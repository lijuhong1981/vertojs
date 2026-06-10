import Check from "@lijuhong1981/jscheck/src/Check.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import deepMix from "@lijuhong1981/jslib/src/deepMix.js";
import { EventType } from "./Enums";
import { logger } from "./Tools.js";

/**
 * JsonRPC协议客户端，用于JsonRPC协议消息的发送与接受，目前只支持WebSocket连接方式
 * @class
 */
class JsonRpcClient extends Destroyable {
    /**
     * @constructor
     * @param {object} options 配置项
     * @param {string|URL} options.url WebSocket地址
     * @param {string|URL|Array<string|URL>} options.backupUrl 备用地址，可以是单个地址，也可以是地址数组，地址会在连接失败时轮流切换使用
     * @param {boolean} options.autoRetry 自动重试，默认true
     * @param {number} options.maxRetryCount 最大重试次数，设置0或负数表示不限制重试次数
     * @param {number} options.switchUrlConut 重试多少次后切换url
     * @param {number} options.retryInterval 重试间隔时间，单位毫米，默认1000
     * @param {string} options.sessid session id
     * @param {LoginData} options.loginData 登录相关参数
     * @param {object} callbacks 回调通知
     * @param {Function} callbacks.handleMessage 处理FreeSwitch的消息句柄
     * @param {Function} callbacks.onSocketEvent Socket事件回调
     * @param {Function} callbacks.onLogin 登录事件回调
     * @param {Function} callbacks.onLogout 登出事件回调
     */
    constructor(options = {}, callbacks = {}) {
        super();
        Check.defined('options.url', options.url);

        this.options = deepMix({
            url: null,
            backupUrl: null,
            autoLogin: false,
            autoRetry: true,
            maxRetryCount: -1,
            switchUrlConut: 10,
            retryInterval: 1000,
            sessid: null,
            loginData: {
                account: null,
                password: null,
                loginParams: null,
                userVariables: null,
            }
        }, options);
        this.callbacks = callbacks;

        this.urls = [];
        this.urls.push(this.options.url);
        if (Array.isArray(this.options.backupUrl)) {
            this.options.backupUrl.forEach(url => {
                this.urls.push(url);
            });
        } else if (this.options.backupUrl) {
            this.urls.push(this.options.backupUrl);
        }
        /** @type {WebSocket} */
        this._socket = null;
        this._retry_count = 0;
        this._to = null;
        this._req_callbacks = {};
        this._req_id = 1;
        this._req_queue = [];
        this._st_result = {};
        this._authorizing = false;
        this._login_queue = [];
        this._wsOnMessage = this._wsOnMessage.bind(this);
    }

    /**
     * Returns the state of the WebSocket object's connection. It can have the values described below.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/WebSocket/readyState)
     * 
     * @returns {number}
     */
    get socketState() {
        return this._socket ? this._socket.readyState : -1;
    }

    /**
     * socket是否处于链接中
     * @returns {boolean}
     */
    get socketConnecting() {
        return this._socket && this._socket.readyState === 0;
    }

    /**
     * socket是否已准备好
     * @returns {boolean}
     */
    get socketReady() {
        return this._socket && this._socket.readyState === 1;
    }

    /**
     * 是否已登录
     * @returns {boolean}
    */
    get authorized() {
        return this._loginResult ? true : false;
    }

    /**
     * @private
     */
    _notifySocketEvent(event) {
        event.socket = this._socket;
        isFunction(this.callbacks.onSocketEvent) && this.callbacks.onSocketEvent(event);
    }

    /**
     * @private
     */
    _notifySocketStateChangeEvent() {
        this._notifySocketEvent({
            type: EventType.stateChange,
            state: this.socketState
        });
    }

    /**
     * @private
     */
    _notifySocketErrorEvent(error) {
        this._notifySocketEvent({
            type: EventType.error,
            error,
        });
    }

    /**
     * @private
     */
    _clearTimeout() {
        if (this._to) {
            clearTimeout(this._to);
            this._to = null;
        }
    }

    /**
     * @param {Function} onmessage 
     * @returns {boolean}
     * @private
    */
    _connectSocket(onmessage) {
        const self = this;

        self._clearTimeout();

        if (!self._socket || self._socket.readyState > 1) {
            self._authorizing = false;

            // 判断是否需要切换url
            if (self.urls.length > 1) {
                let index = self._retry_count / self.options.switchUrlConut;
                if (index >= self.urls.length)
                    index = 0;
                self.url = self.urls[index];
            } else {
                self.url = self.urls[0];
            }

            // No socket, or dying socket, let's get a new one.
            self._socket = new WebSocket(self.url);

            self._notifySocketStateChangeEvent();

            if (self._socket) {
                // Set up onmessage handler.
                self._socket.onmessage = onmessage;
                self._socket.onclose = function (e) {
                    logger.error("Websocket Lost. The current retry count: " + self._retry_count + " interval: " + self.options.retryInterval + " msec.", e);

                    self._notifySocketStateChangeEvent();

                    //自动重试为false，退出
                    if (self.options.autoRetry === false) {
                        //执行登出
                        self._logout();
                        return;
                    }

                    self._retry_count++;

                    //超过最大重试次数，不再重试
                    if (self.options.maxRetryCount > 0 && self._retry_count > self.options.maxRetryCount) {
                        logger.warn('The retry count ' + self._retry_count + ' > the max retry count ' + self.options.maxRetryCount + ' , stop reconnection.');

                        //执行登出
                        self._logout();
                        return;
                    }

                    self._to = setTimeout(function () {
                        logger.log("Attempting Reconnection....", self.url);
                        self._connectSocket(onmessage);
                    }, self.options.retryInterval);
                };

                // Set up sending of message for when the socket is open.
                self._socket.onopen = function () {
                    logger.info('Websocket Opened:', self.url);
                    self._clearTimeout();
                    self._retry_count = 0;

                    self._notifySocketStateChangeEvent();

                    // 已经登录过的，直接重新登录，登录成功后再调用popReqQueue
                    if (self.authorized) {
                        self._login(function () {
                            self._popReqQueue(self._socket);
                        });
                    } else {
                        self._popReqQueue(self._socket);
                    }
                };

                self._socket.onerror = function (e) {
                    logger.error('Websocket Error:', self.url, e);
                    self._notifySocketErrorEvent(e);
                };
            }
        }

        return self._socket ? true : false;
    }

    /**
     * 获取WebSocket对象
     * @returns {WebSocket}
     */
    getSocket() {
        this._connectSocket(this._wsOnMessage);
        return this._socket;
    }

    /**
     * 网络测速
     * @param {number} bytesNum
     * @param {Function} callback
     * @returns {void}
     */
    speedTest(bytesNum = 1024 * 10, callback) {
        const socket = this.getSocket();
        if (socket) {
            this._st_request = { bytesNum, callback };
            socket.send("#SPU " + bytesNum);

            const loops = bytesNum / 1024;
            const rem = bytesNum % 1024;
            let i;
            const data = new Array(1024).join(".");
            for (i = 0; i < loops; i++) {
                socket.send("#SPB " + data);
            }

            if (rem) {
                socket.send("#SPB " + data);
            }

            socket.send("#SPE");
        }
    }

    /**
     * @param {WebSocket} socket
     * @param {object} data
     * @param {boolean} printLog
     * @returns {void}
     * @private
     */
    _wsSend(socket, data, printLog) {
        if (socket && data) {
            if (printLog)
                logger.info('Websocket Send:', data);
            socket.send(JSON.stringify(data));
        }
    }

    /**
     * @private
    */
    _popReqQueue(socket) {
        let req;
        // Send the requests.
        while ((req = this._req_queue.pop())) {
            this._wsSend(socket, req, true);
        }
    }

    /**
     * @param {WebSocket} socket
     * @param {object} request
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {void}
     * @private
     */
    _wsCall(socket, request, onSuccess, onError) {
        // Setup callbacks.  If there is an id, this is a call and not a notify.
        if ('id' in request) {
            this._req_callbacks[request.id] = { request, onSuccess, onError };
        }

        if (socket.readyState !== 1) {
            this._req_queue.push(request);
        } else {
            this._wsSend(socket, request, true);
        }
    }

    /**
     * Sends a command to the JSON-RPC server
     * @param {string} method
     * @param {object} params
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {void}
     */
    call(method, params = {}, onSuccess, onError) {
        Check.defined('method', method)

        this.options.sessid && (params.sessid = this.options.sessid);

        const request = {
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: this._req_id++  // Increase the id counter to match request/response
        };

        // Try making a WebSocket call.
        const socket = this.getSocket();
        socket && this._wsCall(socket, request, onSuccess, onError);
    }

    /**
     * Notify sends a command to the JSON-RPC server that won't need a response.
     * @param {string} method
     * @param {void} params
     * @returns {void}
     */
    notify(method, params = {}) {
        Check.defined('method', method);

        this.options.sessid && (params.sessid = this.options.sessid);

        const request = {
            jsonrpc: '2.0',
            method: method,
            params: params
        };

        // Try making a WebSocket call.
        const socket = this.getSocket();
        socket && this._wsCall(socket, request);
    }

    set loginData(params) {
        if (!params) return;
        Object.assign(this.options.loginData, params);
    }

    get loginData() {
        return this.options.loginData;
    }

    _login(onSuccess, onError) {
        this._authorizing = true;
        this.call("login", {
            login: this.loginData.account,
            passwd: this.loginData.password || '1234',
            loginParams: this.loginData.loginParams,
            userVariables: this.loginData.userVariables
        }, onSuccess, onError);
    }

    /**
     * 登录
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {void}
     */
    login(onSuccess, onError) {
        const self = this;
        //已登录，直接返回
        if (self.authorized) {
            logger.warn('The login has been successful and a repeated login is not required.');
            isFunction(onSuccess) && onSuccess(self._loginResult);
            return;
        }
        //登录中，放入login_queue中等待回调
        if (self._authorizing) {
            self._login_queue.push({
                onSuccess,
                onError,
            });
            return;
        }
        if (self.loginData.account) {
            self._login(onSuccess, onError);
        } else
            isFunction(onError) && onError(new Error('Login Error: the login account is undefined.'));
    }

    /**
     * 异步登录
     * @returns {Promise<Object>}
     */
    loginAsync() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.login((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
        });
    }

    _logout() {
        this._closeSocket();
        delete this._loginResult;
        this._req_id = 1;
    }

    /**
     * 登出
     * @returns {void}
     */
    logout() {
        const self = this;
        //未登录，直接返回
        if (!self.authorized) return;

        self._logout();

        isFunction(self.callbacks.onLogout) && self.callbacks.onLogout();
    }

    /**
     * @param {any} result
     * @param {any} error
     * @returns {void}
     * @private
     */
    _popLoginQueue(result, error) {
        let req;
        while ((req = this._login_queue.pop())) {
            if (result && isFunction(req.onSuccess)) req.onSuccess(result);
            else if (error && isFunction(req.onError)) req.onError(error);
        }
    }

    /**
     * @param {MessageEvent} event
     * @returns {void}
     * @private
     */
    _wsOnMessage(event) {
        const self = this;

        // Speed Test Result
        if (event.data[0] === "#" && event.data[1] === "S" && event.data[2] === "P") {
            if (event.data[3] === "U") {
                self._st_result.upDur = parseInt(event.data.substring(4));
            } else if (isFunction(self._st_request.callback) && event.data[3] === "D") {
                self._st_result.downDur = parseInt(event.data.substring(4));

                self._st_result.upKPS = (((self._st_request.bytesNum * 8) / (self._st_result.upDur / 1000)) / 1024).toFixed(0);
                self._st_result.downKPS = (((self._st_request.bytesNum * 8) / (self._st_result.downDur / 1000)) / 1024).toFixed(0);

                logger.info("Speed Test Result:", self._st_result);
                const callback = self._st_request.callback;
                delete self._st_request;
                callback(self._st_result);
            }
            return;
        }

        // Handle Receive Data
        try {
            const response = JSON.parse(event.data);
            if (response.method === 'verto.ping' || (response.method === 'verto.event' && response.params && response.params.data && response.params.data.action === 'modify')) {
                /// @todo
            } else
                logger.log('Websocket Receive:', response);

            /// @todo Make using the jsonrcp 2.0 check optional, to use this on JSON-RPC 1 backends.

            // if (typeof response === 'object' &&
            //     'jsonrpc' in response &&
            //     response.jsonrpc === '2.0') {

            /// @todo Handle bad response (without id).

            if (self._req_callbacks[response.id]) {
                // If this is an object with result, it is a response.
                if ('result' in response) {
                    // Get the success callback.
                    const onSuccess = self._req_callbacks[response.id].onSuccess;
                    // Get the request data.
                    const orig_req = self._req_callbacks[response.id].request;

                    // Delete the callback from the storage.
                    delete self._req_callbacks[response.id];

                    // Run callback with result as parameter.
                    isFunction(onSuccess) && onSuccess(response.result);

                    if (orig_req.method === 'login') {
                        self._loginResult = response.result;
                        delete self._loginError;
                        self._authorizing = false;
                        isFunction(self.callbacks.onLogin) && self.callbacks.onLogin(true, response.result);
                        self._popLoginQueue(response.result);
                    }
                    return;
                } else if ('error' in response) {
                    // Get the success callback.
                    const onSuccess = self._req_callbacks[response.id].onSuccess;
                    // Get the error callback.
                    const onError = self._req_callbacks[response.id].onError;
                    // Get the request data.
                    const orig_req = self._req_callbacks[response.id].request;

                    // Delete the callback from the storage.
                    delete self._req_callbacks[response.id];

                    // 返回-32000，说明授权已失效，需重新登录
                    if (response.error.code === -32000) {
                        if (self.loginData.account) {
                            delete self._loginResult;
                            self._login((result) => { //重登录成功，重新发起请求
                                // if (orig_req.method === 'login') {
                                //     isFunction(onSuccess) && onSuccess(result);
                                //     return;
                                // }
                                const socket = self.getSocket();
                                socket && self._wsCall(socket, orig_req, onSuccess, onError);
                            }, (err) => { //重登录失败
                                isFunction(onError) && onError(response.error);
                            });
                            return;
                        }
                    }

                    // Run callback with the error object as parameter.
                    isFunction(onError) && onError(response.error);

                    if (orig_req.method === 'login') {
                        self._loginError = response.error;
                        delete self._loginResult;
                        self._authorizing = false;
                        isFunction(self.callbacks.onLogin) && self.callbacks.onLogin(false, response.error);
                        self._popLoginQueue(undefined, response.error);
                    }
                    return;
                }
            }
            // }

            if (response && isFunction(self.callbacks.handleMessage)) {
                const reply = self.callbacks.handleMessage(response);

                // 需要发送回复消息
                if (reply && response.id) {
                    const msg = {
                        jsonrpc: "2.0",
                        id: response.id,
                        result: reply
                    };

                    if (reply.method !== 'verto.ping')
                        logger.log('Websocket Reply:', msg);
                    self._wsSend(self._socket, msg);
                }
            }
        } catch (e) {
            // Probably an error while parsing a non json-string as json.  All real JSON-RPC cases are
            // handled above, and the fallback method is called below.
            logger.error("Handle Response Error:", e);
            self._notifySocketErrorEvent(e);
            return;
        }
    }

    /**
     * 关闭WebSocket
     * @returns {void}
     * @private
     */
    _closeSocket() {
        const self = this;
        if (self._socket && self._socket.readyState < 2) {
            self._socket.onclose = function (e) {
                logger.log("Websocket Closed:", self.url, e);
                self._notifySocketStateChangeEvent();
            };
            self._socket.close();
        }
    }

    onDestroy() {
        this._closeSocket();
    }
};

export default JsonRpcClient;
export { JsonRpcClient };

