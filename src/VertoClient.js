import Check from "@lijuhong1981/jscheck/src/Check.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import deepMix from "@lijuhong1981/jslib/src/deepMix.js";
import generateGUID from "@lijuhong1981/jslib/src/generateGUID.js";
import parseUrl from "@lijuhong1981/jsurl/src/parseUrl.js";
import Conference from "./Conference.js";
import Dialog from "./Dialog.js";
import { EventType, VertoMethod } from "./Enums.js";
import JsonRpcClient from "./JsonRpcClient.js";
import { getMediaElementByTag, logger } from "./Tools.js";

/**
 * 登录账号配置数据
 * @typedef {object} LoginData
 * @property {string} account 登录账号
 * @property {string} password 登录密码
 * @property {object|undefined} loginParams 其他登录参数
 * @property {object|undefined} userVariables 用户其他参数，比如nickName、email、phone等
 */
/**
 * 设备配置参数
 * @typedef {object} DeviceParams
 * @property {string|undefined} useCamera 使用的摄像头设备id，默认default表示使用系统默认摄像头，设置为none表示不使用摄像头
 * @property {string|undefined} useCameraLabel 使用的摄像头设备label，设置后会覆盖useCamera参数
 * @property {string|undefined} useMic 使用的麦克风设备id，默认default表示使用系统默认麦克风，设置为none表示不使用麦克风
 * @property {string|undefined} useMicLabel 使用的麦克风设备label，设置后会覆盖useMic参数
 * @property {string|undefined} useSpeaker 使用的扬声器设备id，默认default表示使用系统默认扬声器，设置为none表示不使用扬声器
 * @property {string|undefined} useSpeakerLabel 使用的扬声器设备label，设置后会覆盖useSpeaker参数
 * @property {MediaTrackConstraints|undefined} audioConstraints 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
 * @property {MediaTrackConstraints|undefined} videoConstraints 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
*/

/**
 * 事件频道对象，在subscribeChannel函数中生成并返回
*/
class EventChannel {
    /**
     * @constructor
     * @param {string} eventChannel 事件频道名称
     * @param {Function} handler 事件频道消息处理句柄
     * @param {object} subParams 其他参数
    */
    constructor(eventChannel, handler, subParams) {
        this.eventChannel = eventChannel;
        this.handler = handler;
        this.subParams = subParams;
        // this.ready = false;
    }
};

/**
 * @param {VertoClient} verto
 * @param {string} eventChannel
 * @returns {void}
 * @private
 */
function drop_unauthorized_channel(verto, eventChannel) {
    logger.error("drop_unauthorized_channel: " + eventChannel);
    delete verto.eventChannels[eventChannel];
}

/**
 * @param {VertoClient} verto
 * @param {string} eventChannel
 * @returns {void}
 * @private
 */
function ready_subscribed_channel(verto, eventChannel) {
    if (verto.eventChannels[eventChannel]) {
        verto.eventChannels[eventChannel].forEach(channel => {
            channel.ready = true;
        });
    }
}

// let SERNO = 1;

/**
 * Verto协议客户端，主要用于与FreeSwitch通信
 * @extends Destroyable
*/
class VertoClient extends Destroyable {
    /**
     * @constructor
     * @param {object} options 配置项
     * @param {object} options.fsConfig FreeSwitch服务相关配置参数
     * @param {string} options.fsConfig.url FreeSwitch服务器wss地址
     * @param {string|Array<string>} options.fsConfig.backupUrl 备用wss地址
     * @param {number} options.fsConfig.maxRetryCount 最大重试次数，设置0或负数表示不限制重试次数
     * @param {number} options.fsConfig.switchUrlConut 重试多少次后切换url
     * @param {number} options.fsConfig.retryInterval 重试间隔时间，单位毫米
     * @param {boolean|RTCIceServer} options.fsConfig.turnServer WebRTC服务是否启用turnServer
     * @param {Array<RTCIceServer>|undefined} options.fsConfig.iceServers WebRTC服务iceServer列表
     * @param {object} options.localParams 本地相关配置参数
     * @param {string|HTMLMediaElement|Function} options.localParams.remoteTag 播放远程音视频的dom标签
     * @param {string|HTMLMediaElement|Function} options.localParams.localTag 播放本地音视频的dom标签
     * @param {string|HTMLMediaElement|Function} options.localParams.ringerTag 播放本地铃声的dom标签
     * @param {string} options.localParams.ringFile 响铃文件地址
     * @param {number|undefined} options.localParams.overtime 等待接听超时时间，单位毫秒，默认30000
     * @param {LoginData} options.loginData 登录账号配置数据
     * @param {DeviceParams} options.deviceParams 设备相关配置参数
     * @param {boolean} options.enableLog 是否启用日志输出，默认true
     * @param {object} callbacks 回调通知
     * @param {Function} callbacks.onClientEvent 客户端事件回调
     * @param {Function} callbacks.onDialogEvent 会话事件回调
     * @param {Function} callbacks.onConferenceEvent 组会事件回调
     */
    constructor(options = {}, callbacks = {}) {
        super();
        const self = this;

        self.options = deepMix({
            fsConfig: {
                protocol: 'verto',
                retryInterval: 1000,
            },
            localParams: {
                remoteTag: null,
                localTag: null,
                ringerTag: null,
                ringFile: null,
                emergencyRingFile: null,
                overtime: 30000,
                useStream: null
            },
            loginData: {},
            deviceParams: {
                useCamera: 'default',
                useCameraLabel: null,
                useMic: 'default',
                useMicLabel: null,
                useSpeaker: 'default',
                useSpeakerLabel: null,
                audioConstraints: {
                    autoGainControl: true, //自动增益
                    echoCancellation: true, //回声消除
                    noiseSuppression: true, //噪声抑制
                    highpassFilter: true, //高通滤波
                },
                videoConstraints: {
                    width: {
                        min: 640,
                        ideal: 1280,
                    },
                    height: {
                        min: 480,
                        ideal: 720,
                    },
                    frameRate: {
                        min: 10,
                        ideal: 30,
                    },
                    facingMode: 'user',
                },
            },
            enableLog: true,
        }, options);
        self.callbacks = callbacks;
        // logger.log('Create Verto:', self.options);

        self.options.enableLog ? logger.enable() : logger.disable();
        delete self.options.enableLog;

        const urlParsed = parseUrl(self.options.fsConfig.url);
        self.urlParsed = urlParsed;

        if (self.options.sessid) {
            self.sessid = self.options.sessid;
        } else {
            self.sessid = localStorage.getItem("session_uuid") || generateGUID();
            localStorage.setItem("session_uuid", self.sessid);
        }

        /** @type {Object<string, Dialog>} */
        self.dialogs = {};
        /** @type {Object<string, Array<EventChannel>>} */
        self.eventChannels = {};
        /** @type {Object<string, Conference>} */
        self.conferences = {};

        /**
         * @type {JsonRpcClient}
         * @private
         */
        self.rpcClient = new JsonRpcClient({
            url: self.options.fsConfig.url,
            backupUrl: self.options.fsConfig.backupUrl,
            autoRetry: self.options.fsConfig.autoRetry,
            maxRetryCount: self.options.fsConfig.maxRetryCount,
            switchUrlConut: self.options.fsConfig.switchUrlConut,
            retryInterval: self.options.fsConfig.retryInterval,
            sessid: self.sessid,
            loginData: self.options.loginData,
        }, {
            handleMessage: function (e) {
                return self._handleVertoMessage(e);
            },
            onSocketEvent: function (e) {
                if (e.state === WebSocket.CLOSED)
                    self._purge();
            },
        });
        delete self.options.loginData;

        (async () => {
            self.ringer = await getMediaElementByTag(self.options.localParams.ringerTag, true);
        })();
    }

    /**
     * 是否启用日志输出
     * @type {boolean}
     * @default true
    */
    set enableLog(value) {
        logger.enabled = value;
    }
    get enableLog() {
        return logger.enabled;
    }

    /**
     * 本地配置参数
     * @returns {object}
     * @readonly
     */
    get localParams() {
        return this.options.localParams;
    }

    /**
     * 设置turnServer
     * @param {boolean|RTCIceServer} value
    */
    set turnServer(value) {
        this.options.fsConfig.turnServer = value;
    }

    /**
     * 获取turnServer
     * @returns {boolean|RTCIceServer}
     */
    get turnServer() {
        return this.options.fsConfig.turnServer;
    }

    /**
     * 设置iceServers
     * @param {Array<RTCIceServer>|null} value
     */
    set iceServers(value) {
        this.options.fsConfig.iceServers = value;
    }

    /**
     * 获取iceServers
     * @returns {Array<RTCIceServer>|null}
     */
    get iceServers() {
        return this.options.fsConfig.iceServers;
    }

    /**
     * 设置登录账号配置数据
     * @param {LoginData} params
     */
    set loginData(params) {
        if (!params) return;
        if (this.rpcClient)
            this.rpcClient.loginData = params;
    }

    /**
     * 获取登录账号配置数据
     * @returns {LoginData}
     */
    get loginData() {
        if (this.rpcClient)
            return this.rpcClient.loginData;
        else
            return this.options.loginData;
    }

    /**
     * @private
    */
    get socketReady() {
        if (this.rpcClient) return this.rpcClient.socketReady;
        else if (this.sessionManager) return this.sessionManager.isConnected();
        else return this.socketState === 1;
    }

    /**
     * 登录
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {void}
     */
    login(onSuccess, onError) {
        const self = this;

        const notifyResult = (result) => {
            isFunction(onSuccess) && onSuccess(result);
            self._notifyEvent({
                type: EventType.loginSuccess,
                result,
            });
        }

        const notifyError = (error) => {
            isFunction(onError) && onError(error);
            self._notifyEvent({
                type: EventType.loginError,
                error,
            });
        }

        if (self.rpcClient) {
            self.logout();
            self.rpcClient.login(notifyResult, notifyError);
        }
    }

    /**
     * 登出
     * @returns {void}
    */
    logout() {
        if (this.rpcClient)
            this.rpcClient.logout();
        this._purge();
        this._notifyEvent({
            type: EventType.logout,
        });
    }

    /**
     * 设置设备相关参数
     * @param {DeviceParams} params
     * @returns {void}
     */
    set deviceParams(params) {
        if (!params) return;
        deepMix(this.options.deviceParams, params);
    }

    /**
     * 获取设备相关参数
     * @returns {DeviceParams}
     */
    get deviceParams() {
        return this.options.deviceParams;
    }

    /**
     * 设置捕获音频流条件
     * @param {MediaTrackConstraints} constraints
     * @see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
     * @returns {void}
     */
    set audioConstraints(constraints) {
        if (!constraints) return;
        deepMix(this.options.deviceParams.audioConstraints, params);
    }

    /**
     * 获取音频流条件
     * @returns {MediaTrackConstraints}
     */
    get audioConstraints() {
        return this.options.deviceParams.audioConstraints;
    }

    /**
     * 设置捕获视频流条件
     * @param {MediaTrackConstraints} constraints
     * @see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
     * @returns {void}
     */
    set videoConstraints(params) {
        if (!constraints) return;
        deepMix(this.options.deviceParams.videoConstraints, params);
    }

    /**
     * 获取视频流条件
     * @returns {MediaTrackConstraints}
     */
    get videoConstraints() {
        return this.options.deviceParams.videoConstraints;
    }

    /**
     * @param {object} event 
     * @param {string} event.type
     * @returns {void}
     * @private
    */
    _notifyEvent(event) {
        event.client = this;
        isFunction(this.callbacks.onClientEvent) && this.callbacks.onClientEvent(event);
    }

    /**
     * 处理接收到的verto消息
     * @private
    */
    _handleVertoMessage(message) {
        if (!message || !message.method) {
            logger.error('Invalid Message:', message);
            return;
        }

        // if (message.method !== VertoMethod.ping)
        //     logger.log('handleMessage:', message);
        if (message.params.callID) {
            let dialog = this.dialogs[message.params.callID];

            if (message.method === VertoMethod.attach && dialog) {
                dialog.destroy();
                dialog = null;
            }

            if (dialog) {
                switch (message.method) {
                    case VertoMethod.media:
                        dialog._handleMedia(message.params);
                        break;
                    case VertoMethod.answer:
                        dialog._handleAnswer(message.params);
                        break;
                    case VertoMethod.display:
                        dialog._handleDisplay(message.params);
                        break;
                    case VertoMethod.info:
                        dialog._handleInfo(message.params);
                        break;
                    case VertoMethod.bye:
                        dialog._handleBye(message.params);
                        break;
                    default:
                        logger.warn("INVALID METHOD OR NON-EXISTANT CALL REFERENCE IGNORED", dialog, message.method);
                        break;
                }
            } else {
                switch (message.method) {
                    case VertoMethod.attach:
                        message.params.attach = true;

                        if (message.params.sdp && message.params.sdp.indexOf("m=video") > 0) {
                            message.params.hasRemoteVideo = true;
                        }

                        dialog = new Dialog(Dialog.Direction.inbound, this, message.params, this.callbacks.onDialogEvent);

                        break;
                    case VertoMethod.invite:
                        if (message.params.sdp && message.params.sdp.indexOf("m=video") > 0) {
                            message.params.hasRemoteVideo = true;
                        }

                        dialog = new Dialog(Dialog.Direction.inbound, this, message.params, this.callbacks.onDialogEvent);
                        break;
                    default:
                        logger.warn("INVALID METHOD OR NON-EXISTANT CALL REFERENCE IGNORED", message.method);
                        break;
                }
            }

            return {
                method: message.method
            };
        } else {
            switch (message.method) {
                case VertoMethod.punt://被踢下线，自动重连
                    // this.logout();
                    this.login();
                    break;
                case VertoMethod.event:
                    let eventType = null;
                    let channels = null;
                    let eventChannel = null;

                    if (message.params) {
                        eventType = message.params.eventType;
                        eventChannel = message.params.eventChannel;
                    }

                    if (eventType === 'channelPvtData') {
                        const pvtData = message.params.pvtData;
                        if (!pvtData) {
                            logger.warn("The pvtData is undefined.");
                            return;
                        }
                        const dialog = this.dialogs[pvtData.callID];
                        let conference = this.conferences[pvtData.callID];
                        switch (pvtData.action) {
                            case "conference-liveArray-join"://加入组会
                                if (conference)
                                    conference.destroy();
                                conference = new Conference(dialog, message.params, this.callbacks.onConferenceEvent);
                                break;
                            case "conference-liveArray-part"://离开组会
                                if (conference)
                                    conference.destroy();
                                break;
                        }
                        return;
                    }

                    if (eventChannel)
                        channels = this.eventChannels[eventChannel];

                    if (channels) {
                        channels.forEach(channel => {
                            isFunction(channel.handler) && channel.handler(message.params);
                        });
                    } else {
                        if (eventChannel) {
                            if (eventChannel === this.sessid) {
                                this._notifyEvent({
                                    type: EventType.eventChannel,
                                    params: message.params,
                                });
                            } else if (this.dialogs[eventChannel]) {
                                this.dialogs[eventChannel]._notifyDialogEvent({
                                    type: EventType.eventChannel,
                                    params: message.params,
                                });
                            }
                        }
                    }
                    break;
                case VertoMethod.info:
                    // if (this.callbacks.onMessage) {
                    //     this.callbacks.onMessage(this, null, Verto.enum.message.info, response.params.msg);
                    // }
                    // logger.debug("MESSAGE from: " + data.params.msg.from, data.params.msg.body);
                    break;
                case VertoMethod.clientReady:
                    this._notifyEvent({
                        type: EventType.ready
                    });
                    break;
                case VertoMethod.ping:
                    return {
                        method: message.method
                    };
                default:
                    logger.warn("INVALID METHOD OR NON-EXISTANT CALL REFERENCE IGNORED", message.method);
                    break;
            }
        }
    }

    /**
     * 处理通过sendMethod发送消息的结果
     * @private
     */
    _processResult(method, success, e) {
        let key;
        switch (method) {
            case VertoMethod.subscribe:
                for (key in e.unauthorizedChannels) {
                    drop_unauthorized_channel(this, e.unauthorizedChannels[key]);
                }
                // for (key in e.subscribedChannels) {
                //     ready_subscribed_channel(this, e.subscribedChannels[key]);
                // }
                break;
            case VertoMethod.unsubscribe:
                break;
        }
    }

    /**
     * 发送Verto指令
     * @param {VertoMethod} method Verto指令
     * @param {object} params 指令内容
     * @returns {void}
     * @private
     */
    _sendVertoMethod(method, params) {
        const self = this;
        if (self.rpcClient)
            self.rpcClient.call(method, params,
                function (e) {
                    /* Success */
                    self._processResult(method, true, e);
                },
                function (e) {
                    /* Error */
                    self._processResult(method, false, e);
                });
    }

    /**
     * 发送事件频道广播
     * @param {string} eventChannel 事件频道
     * @param {object} data 广播数据
     * @returns {void}
     * @private
     */
    sendChannelBroadcast(eventChannel, data) {
        this._sendVertoMethod(VertoMethod.broadcast, {
            eventChannel,
            data,
        });
    }

    /**
     * 事件频道订阅
     * @param {string} eventChannel 事件频道名称
     * @param {Function} handler 事件频道消息处理句柄
     * @param {object} subParams 其他参数
     * @returns {EventChannel}
     * @private
     */
    subscribeChannel(eventChannel, handler, subParams) {
        Check.typeOf.string('eventChannel', eventChannel);

        const channel = new EventChannel(eventChannel, handler, subParams);

        if (!this.eventChannels[eventChannel]) {
            this.eventChannels[eventChannel] = [];
            this._sendVertoMethod(VertoMethod.subscribe, {
                eventChannel, subParams
            });
        }
        this.eventChannels[eventChannel].push(channel);

        return channel;
    }

    /**
     * 取消事件频道订阅
     * @param {EventChannel} channel 由subscribeChannel函数返回的EventChannel对象
     * @returns {boolean}
     * @private
     */
    unsubscribeChannel(channel) {
        Check.instanceOf('channel', channel, EventChannel);

        const list = this.eventChannels[channel.eventChannel];
        if (list) {
            const idx = list.indexOf(channel);
            if (idx === -1) {
                logger.warn('The channel is not in eventChannels array.', channel);
                return false;
            }
            list.splice(idx, 1);
            if (list.length === 0) {
                delete this.eventChannels[channel.eventChannel];
                this._sendVertoMethod(VertoMethod.unsubscribe, {
                    eventChannel: channel.eventChannel
                });
            }
            return true;
        } else {
            logger.warn("Not found the " + channel.eventChannel + "'s array.");
            this._sendVertoMethod(VertoMethod.unsubscribe, {
                eventChannel: channel.eventChannel
            });
            return false;
        }
    }

    /**
     * 挂断会话
     * @param {object} params 参数
     * @param {string|undefined} params.callID 呼叫id，不传表示挂断所有的会话
     * @param {string|undefined} params.cause 原因文本
     * @param {number|undefined} params.causeCode 原因编码
     * @returns {void}
     */
    hangup(params = {}) {
        if (params.callID) {
            this.dialogs[params.callID] && this.dialogs[params.callID].hangup(params);
        } else {
            for (const key in this.dialogs) {
                this.dialogs[key].hangup(params);
            }
        }
    }

    /**
     * 发起一个新呼叫
     * @param {object|string} params 呼叫参数或呼叫号码
     * @param {string} params.destinationNumber 呼叫号码，必填项
     * @param {boolean|undefined} params.wantVideo 是否使用视频呼叫，默认false
     * @param {string|HTMLMediaElement|Function|undefined} params.remoteTag 播放远程音视频的dom标签
     * @param {string|HTMLMediaElement|Function|undefined} params.localTag 播放本地音视频的dom标签
     * @param {number|undefined} params.overtime 等待接听超时时间，单位毫秒
     * @param {DeviceParams|undefined} params.deviceParams 设备相关参数
     * @returns {Dialog}
     */
    newCall(params = {}) {
        if (!this.socketReady) {
            logger.error("Not Connected...");
            return;
        }
        if (typeof params === 'string') params = { destinationNumber: params };
        // 兼容以前使用destination_number时的代码
        if (params.destination_number) params.destinationNumber = params.destination_number;
        Check.defined('params.destinationNumber', params.destinationNumber);

        if (params.destinationNumber === this.loginData.account) {
            logger.error("destinationNumber " + params.destinationNumber + " equals account " + this.loginData.account);
            return;
        }

        return new Dialog(Dialog.Direction.outbound, this, params, this.callbacks.onDialogEvent);
    }

    /**
     * 发送文本消息
     * @param {string} destinationNumber 目标号码
     * @param {string} message 消息内容
     * @returns {void}
     */
    sendTextMessage(destinationNumber, message) {
        Check.defined('destinationNumber', destinationNumber);
        Check.typeOf.string('message', message);
        if (this.isSip) {
            const destination = "sip:" + destinationNumber + "@" + this.urlParsed.host;
            this.sessionManager.message(destination, message);
        } else if (this.isVerto) {
            this._sendVertoMethod(VertoMethod.info, {
                msg: {
                    from: this.loginData.account,
                    to: destinationNumber,
                    body: message,
                }
            });
        }
    }

    /**
     * 清理所有的会话与订阅
     * @returns {void}
     * @private
    */
    _purge() {
        for (const key in this.conferences) {
            this.conferences[key].destroy();
        }
        this.conferences = {};
        for (const key in this.dialogs) {
            this.dialogs[key].destroy();
        }
        this.dialogs = {};

        // for (key in this.eventChannels) {
        //     delete this.eventChannels[key];
        // }
        this.eventChannels = {};
    }

    /**
     * 获取当前的会话列表
     * @returns {Array<Dialog>}
     */
    getDialogs() {
        const result = [];
        for (const key in this.dialogs) {
            result.push(this.dialogs[key]);
        }
        return result;
    }

    getDialogBySession(session) {
        for (const key in this.dialogs) {
            const dialog = this.dialogs[key];
            if (dialog.session === session) {
                return dialog;
            }
        }
    }

    /**
     * 获取当前正在通话的会话列表
     * @returns {Array<Dialog>}
     */
    getActiveDialogs() {
        const result = [];
        for (const key in this.dialogs) {
            const dialog = this.dialogs[key];
            if (dialog.isActive) {
                result.push(dialog);
            }
        }
        return result;
    }

    /**
     * 是否存在会话
     * @returns {boolean}
     */
    hasDialog() {
        return this.getDialogs().length > 0;
    }

    /**
     * 是否存在正在通话的会话
     * @returns {boolean}
     */
    hasActiveDialog() {
        return this.getActiveDialogs().length > 0;
    }

    onDestroy() {
        delete this.ringer;
        this.logout();
        this.rpcClient && this.rpcClient.destroy();
    }
};

Object.defineProperties(VertoClient, {
    Method: {
        get: function () {
            return VertoMethod;
        }
    },
    EventChannel: {
        get: function () {
            return EventChannel;
        }
    }
});

/**
 * 创建VertoClient实例
 * @param {object} options 配置项，@see VertoClient.constructor
 * @param {object} callbacks 回调通知，@see VertoClient.constructor
 * @returns {VertoClient}
*/
function createClient(options, callbacks) {
    return new VertoClient(options, callbacks);
};

export default VertoClient;
export { VertoClient as Client, createClient, EventChannel, VertoClient, VertoMethod };

