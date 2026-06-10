import Check from "@lijuhong1981/jscheck/src/Check.js";
import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import formatDate from "@lijuhong1981/jslib/src/formatDate.js";
import HashArray from "@lijuhong1981/jslib/src/HashArray.js";
import { EventType, VertoMethod } from "./Enums.js";
import { logger } from "./Tools.js";

/**
 * @import Dialog from "./Dialog.js";
*/

/**
 * 组会状态
 * @enum {string} ConferenceState
 * @property {string} new 新建
 * @property {string} join 加入
 * @property {string} hangup 挂断
 * @property {string} destroy 销毁
*/
const ConferenceState = Object.freeze({
    new: 'new',
    join: 'join',
    hangup: 'hangup',
    destroy: 'destroy',
});

const confValidStatesChange = Object.freeze({
    new: {
        join: true,
        hangup: true,
        destroy: true,
    },
    join: {
        hangup: true,
        active: true,
        destroy: true,
    },
    hangup: {
        destroy: true
    },
    destroy: {},
});

/**
 * 检查状态变化是否合法
 * @param {ConferenceState} oldS
 * @param {ConferenceState} newS
 * @returns {boolean}
 * @private
 */
function checkConfStateChangeValid(oldS, newS) {
    return confValidStatesChange[oldS][newS];
};

/**
 * 组会实时数组动作
 * @enum {string} ConferenceLiveArrayAction
 * @property {string} init 数组初始化，注意，此时不会生成成员数据
 * @property {string} bootObj 引导数组数据，此时会生成成员数据
 * @property {string} add 新增成员
 * @property {string} modify 成员数据有修改，比如状态变化等
 * @property {string} del 移除成员
 * @property {string} clear 清除所有成员数据
 * @property {string} reorder 数组重排序
 * @property {string} error 数组出错
 * @readonly
*/
const ConferenceLiveArrayAction = Object.freeze({
    init: 'init',
    bootObj: 'bootObj',
    add: 'add',
    modify: 'modify',
    del: 'del',
    clear: 'clear',
    reorder: 'reorder',
    error: 'error',
});

/**
 * 组会成员信息
 */
class ConferenceMemberInfo {
    /**
     * @constructor
     * @param {string} key 
     * @param {Array} data
     */
    constructor(key, data) {
        /**
         * 成员uuid
         * @type {string}
        */
        this.uuid = key;
        /**
         * 成员id
         * @type {string}
        */
        this.id = data[0];
        /**
         * 成员号码
         * @type {string}
        */
        this.number = data[1];
        /**
         * 成员名称
         * @type {string}
        */
        this.name = data[2];
        /**
         * 编解码器
         * @type {string}
        */
        this.codec = data[3];
        this.statusString = data[4];
        /**
         * 成员状态
         * @type {object}
        */
        this.status = JSON.parse(data[4]);
        /**
         * 成员其他信息
         * @type {object}
        */
        this.userVariables = data[5];
        this.userVariablesString = JSON.stringify(data[5]);
    }
    /**
     * 麦克风是否已关闭
     * @type {boolean}
     * @readonly
    */
    get isMicMuted() {
        return this.status.audio.muted;
    }
    /**
     * 相机是否已关闭
     * @type {boolean}
     * @readonly
    */
    get isCameraMuted() {
        return this.status.video ? this.status.video.muted : true;
    }
    /**
     * 是否正在说话
     * @type {boolean}
     * @readonly
    */
    get isTalking() {
        return this.status.audio.talking;
    }
    /**
     * 是否视频Floor
     * @type {boolean}
     * @readonly
    */
    get isVideoFloor() {
        return this.status.video ? this.status.video.floor : false;
    }
    /**
     * 是否已被禁听
     * @type {boolean}
     * @readonly
    */
    get isDeaf() {
        return this.status.audio.deaf;
    }

    /**
     * 更新MemberInfo，返回信息是否有变化
     * @param {string} key
     * @param {Array} data
     * @returns {boolean} MemberInfo是否有变化
     * @private
     */
    update(key, data) {
        let changed = false;
        if (this.uuid !== key) {
            this.uuid = key;
            changed = true;
        }
        if (this.id !== data[0]) {
            this.id = data[0];
            changed = true;
        }
        if (this.number !== data[1]) {
            this.number = data[1];
            changed = true;
        }
        if (this.name !== data[2]) {
            this.name = data[2];
            changed = true;
        }
        if (this.codec !== data[3]) {
            this.codec = data[3];
            changed = true;
        }
        if (this.statusString !== data[4]) {
            this.statusString = data[4];
            this.status = JSON.parse(data[4]);
            changed = true;
        }
        const userVariablesString = JSON.stringify(data[5]);
        if (this.userVariablesString !== userVariablesString) {
            this.userVariablesString = userVariablesString;
            this.userVariables = data[5];
            changed = true;
        }
        return changed;
    }
};

/**
 * 组会实时数组，同步在线组会成员信息，会在Conference创建时同步创建
 * @extends Destroyable
*/
class ConferenceLiveArray extends Destroyable {
    /**
     * @constructor
     * @param {Conference} conference 组会对象
     * @param {string} context LiveArray上下文，即LiveArray事件频道名称
     * @param {string} name LiveArray名称
     * @param {object} config 配置项
     * @param {object} config.subParams
     */
    constructor(conference, context, name, config) {
        super();

        this.conference = conference;
        this.verto = conference.verto;
        this.context = context;
        this.name = name;
        this.config = config;
        this.lastSerno = 0;
        /** 
         * @type {HashArray<ConferenceMemberInfo>}
         * @private
         */
        this.hashArray = new HashArray();

        /**
         * LiveArray变化通知 
         * @type {Function}
         */
        this.onChange = null;
        /**
         * LiveArray错误通知 
         * @type {Function}
         */
        this.onError = null;
        this.channel = this.verto.subscribeChannel(context, this._handleEvent.bind(this), config.subParams);

        // this.bootstrap();
    }

    /**
     * 获取组会成员数量
     * @returns {number}
     * @readonly
     */
    get membersCount() {
        return this.hashArray.size;
    }

    /**
     * 获取所有组会成员信息
     * @returns {Array<ConferenceMemberInfo>}
     */
    members() {
        return this.hashArray.values();
    }

    /**
     * 根据uuid获取组会成员信息
     * @param {string} uuid
     * @returns {ConferenceMemberInfo}
     */
    getByUuid(uuid) {
        return this.hashArray.get(uuid);
    }

    /**
     * @private
    */
    _notifyChange(event) {
        event.liveArray = this;
        isFunction(this.onChange) && this.onChange(event);
    }

    /**
     * @private
    */
    _notifyError(error) {
        isFunction(this.onError) && this.onError({
            action: ConferenceLiveArrayAction.error,
            liveArray: this,
            error,
        });
    }

    /**
     * @private
    */
    _handleEvent(e) {
        const packet = e.data;
        if (packet.name !== this.name) {
            return;
        }

        switch (packet.action) {
            case ConferenceLiveArrayAction.init:
                this.onInit(packet.wireSerno, packet.hashKey, packet.data, packet.arrIndex);
                break;

            case ConferenceLiveArrayAction.bootObj:
                this.onBootObj(packet.wireSerno, packet.data);
                break;

            case ConferenceLiveArrayAction.add:
                this.onAdd(packet.wireSerno, packet.hashKey, packet.data, packet.arrIndex);
                break;

            case ConferenceLiveArrayAction.modify:
                if (!(packet.arrIndex || packet.hashKey)) {
                    logger.error("Invalid Packet:", packet);
                } else {
                    this.onModify(packet.wireSerno, packet.hashKey, packet.data, packet.arrIndex);
                }
                break;

            case ConferenceLiveArrayAction.del:
                if (!(packet.arrIndex || packet.hashKey)) {
                    logger.error("Invalid Packet:", packet);
                } else {
                    this.onDel(packet.wireSerno, packet.hashKey, packet.arrIndex);
                }
                break;

            case ConferenceLiveArrayAction.clear:
                this.onClear();
                break;

            case ConferenceLiveArrayAction.reorder:
                this.onReorder(packet.wireSerno, packet.order);
                break;

            default:
                if (this._checkSerno(packet.wireSerno)) {
                    this._notifyChange({
                        serno: packet.wireSerno,
                        action: packet.action,
                        data: packet.data,
                    });
                }
                break;
        }
    }

    /**
     * 发送liveArray命令
     * @param {string} command 命令
     * @param {any} obj 参数
     * @returns {void}
     */
    sendCommand(command, obj) {
        this.verto.sendChannelBroadcast(this.context, {
            liveArray: {
                command,
                context: this.context,
                name: this.name,
                obj
            }
        });
    }

    /**
     * 发送bootstrap命令，LiveArray创建时调用
     * @param {any} obj
     * @returns {void}
     */
    bootstrap(obj) {
        this.sendCommand("bootstrap", obj);
    }

    // /**
    //  * 发送changepage命令
    //  * @param {any} obj
    //  * @returns {void}
    //  */
    // changepage(obj) {
    //     this.clear();
    //     this.sendCommand("changepage", obj);
    // }

    // /**
    //  * 发送heartbeat命令
    //  * @param {any} obj
    //  * @returns {void}
    //  */
    // heartbeat(obj) {
    //     this.sendCommand("heartbeat", obj);
    // }

    /**
     * @param {number} serno
     * @returns {boolean}
     * @private
     */
    _checkSerno(serno) {
        if (serno < 0) return true;

        if (this.lastSerno > 0 && serno !== (this.lastSerno + 1)) {
            // if (la.onErr) {
            //     la.onErr(la, {
            //         lastSerno: lastSerno,
            //         serno: serno
            //     });
            // }
            // la.errs++;
            // console.debug(la.errs);
            // if (la.errs < 3) {
            //     la.bootstrap(la.user_obj);
            // }
            const msg = "checkSerno error: lastSerno=" + this.lastSerno + "; serno=" + serno;
            logger.error(msg);
            this._notifyError(new Error(msg));
            return false;
        } else {
            this.lastSerno = serno;
            return true;
        }
    }

    /**
     * @param {number} serno
     * @param {string} key
     * @param {any} data
     * @param {number} index
     * @returns {void}
     * @private
     */
    onInit(serno, key, data, index) {
        if (!defined(key)) key = serno;
        if (this._checkSerno(serno)) {
            this._notifyChange({
                action: ConferenceLiveArrayAction.init,
                serno, key, data, index
            });
        }
    }

    /**
     * @param {number} serno
     * @param {Array} data
     * @returns {void}
     * @private
     */
    onBootObj(serno, data) {
        if (this._checkSerno(serno)) {
            this.hashArray.clear();
            data.forEach(item => {
                const member = new ConferenceMemberInfo(item[0], item[1]);
                this.hashArray.set(member.uuid, member);
            });

            this._notifyChange({
                action: ConferenceLiveArrayAction.bootObj,
                serno, data,
                members: this.members()
            });
        }
    }

    /**
     * @param {number} serno
     * @param {string} key
     * @param {any} data
     * @param {number} index
     * @returns {void}
     * @private
     */
    onAdd(serno, key, data, index) {
        if (!defined(key)) key = serno;
        if (this._checkSerno(serno)) {
            if (this.hashArray.has(key)) {
                const msg = "add error: the key=" + key + " has existed.";
                logger.error(msg);
                this._notifyError(new Error(msg));
            } else {
                const member = new ConferenceMemberInfo(key, data);
                this.hashArray.set(member.uuid, member);
                this._notifyChange({
                    action: ConferenceLiveArrayAction.add,
                    serno, index, key, data, member
                });
            }
        }
    }

    /**
     * @param {number} serno
     * @param {string} key
     * @param {any} data
     * @param {number} index
     * @returns {void}
     * @private
     */
    onModify(serno, key, data, index) {
        if (!defined(key)) key = serno;
        if (this._checkSerno(serno)) {
            const member = this.hashArray.get(key);
            if (member) {
                if (member.update(key, data))
                    this._notifyChange({
                        action: ConferenceLiveArrayAction.modify,
                        serno, key, data, member, index
                    });
            } else {
                const msg = "modify error: the key=" + key + " not exist.";
                logger.error(msg);
                this._notifyError(new Error(msg));
            }
        }
    }

    /**
     * @param {number} serno
     * @param {string} key
     * @param {number} index
     * @returns {void}
     * @private
     */
    onDel(serno, key, index) {
        if (!defined(key)) key = serno;
        if (this._checkSerno(serno)) {
            if (!defined(index) || index < 0)
                index = this.hashArray.indexOf(key);
            if (this.hashArray.delete(key))
                this._notifyChange({
                    action: ConferenceLiveArrayAction.del,
                    serno, key, index
                });
            else {
                const msg = "del error: the key=" + key + " not exist.";
                logger.error(msg);
                this._notifyError(new Error(msg));
            }
        }
    }

    /**
     * @param {Array<string>} newKeys
     * @returns {void}
     * @private
     */
    _reorder(newKeys) {
        const hash = this.hashArray._hash;
        this.hashArray.clear();
        for (let i = 0, len = newKeys.length; i < len; i++) {
            const key = newKeys[i];
            if (hash[key]) {
                this.hashArray.set(key, hash[key]);
                delete hash[key];
            }
        }
    }

    /**
     * @param {number} serno
     * @param {Array<string>} orderKeys
     * @returns {void}
     * @private
     */
    onReorder(serno, orderKeys) {
        if (this._checkSerno(serno)) {
            this._reorder(orderKeys);
            this._notifyChange({
                action: ConferenceLiveArrayAction.reorder,
                serno,
                members: this.members(),
            });
        }
    }

    /**
     * @private
    */
    onClear() {
        this.lastSerno = 0;
        this.clear();
    }

    /**
     * 清除
     * @returns {void}
     */
    clear() {
        this.hashArray.clear();
        this._notifyChange({
            action: ConferenceLiveArrayAction.clear,
        });
    }

    onDestroy() {
        this.clear();
        this.channel && this.verto.unsubscribeChannel(this.channel);
    }
};

Object.defineProperties(ConferenceLiveArray, {
    /**
     * 组会成员数组动作
     * @type {ConferenceLiveArrayAction}
     * @readonly
     * @static
     * @memberof ConferenceLiveArray
    */
    Action: {
        get: function () {
            return ConferenceLiveArrayAction;
        }
    }
});

/**
 * 组会对象，发起组会呼叫或收到组会呼叫时生成该对象，同时在onConferenceEvent事件回调中传递该对象
 * @extends Destroyable
*/
class Conference extends Destroyable {
    /**
     * @constructor
     * @param {Dialog} dialog 会话对象
     * @param {object} params 参数
     * @param {object} params.pvtData FreeSwitch下发的组会数据
     * @param {Function} onConferenceEvent 组会事件回调通知
     */
    constructor(dialog, params = {}, onConferenceEvent) {
        super();
        Check.defined('dialog', dialog);
        Check.defined('params.pvtData', params.pvtData);

        const self = this;
        dialog.conference = self;
        self.dialog = dialog;
        self.verto = dialog.client;
        self.params = params;
        self.pvtData = params.pvtData;
        self.callID = self.pvtData.callID;
        self.onConferenceEvent = onConferenceEvent;

        /**
         * 当前的会话状态
         * @type {ConferenceState}
        */
        this.state = ConferenceState.new;
        /**
         * 之前的会话状态
         * @type {ConferenceState}
        */
        this.lastState = self.state;
        self.subParams = {
            callID: self.callID,
        };

        /**
         * @type {Object<string, Array>}
         * @private
         */
        self._mod_cmd_callbacks = {};

        if (self.pvtData.modChannel) {
            self.modChannel = self.verto.subscribeChannel(self.pvtData.modChannel, function (e) {
                logger.log("onModChannel:", e);
                if (e.data && e.data.action === "response") {
                    if (e.data.response === "OK") {
                        const callbacks = self._mod_cmd_callbacks[e.data["conf-command"]];
                        if (callbacks && callbacks.length > 0) {
                            const element = callbacks.shift();
                            isFunction(element.onSuccess) && element.onSuccess(e.data.responseData);
                        }
                    } else {
                        // const callbacks = self._mod_cmd_callbacks[e.data["conf-command"]];
                        // if (callbacks && callbacks.length > 0) {
                        //     const element = callbacks.shift();
                        //     isFunction(element.onError) && element.onError(e.data.responseData);
                        // }
                    }
                }
            }, self.subParams);
        }

        self.infoChannel = self.verto.subscribeChannel(self.pvtData.infoChannel, function (e) {
            e.type = EventType.info;
            self._notifyEvent(e);
        }, self.subParams);

        self.chatChannel = self.verto.subscribeChannel(self.pvtData.chatChannel, function (e) {
            e.type = EventType.chat;
            self._notifyEvent(e);
        }, self.subParams);

        /**
         * LiveArray对象
         * @type {ConferenceLiveArray}
        */
        this.liveArray = new ConferenceLiveArray(self, self.pvtData.laChannel, self.pvtData.laName, {
            subParams: self.subParams
        });

        function onLiveArrayEvent(e) {
            e.type = EventType.liveArray;
            self._notifyEvent(e);
        }

        self.liveArray.onChange = onLiveArrayEvent;
        self.liveArray.onError = onLiveArrayEvent;

        self.verto.conferences[self.callID] = self;

        self._notifyStateChangeEvent();

        //为避免状态异常，这里需要判断dialog是否已激活，否则则由dialog来调用join()
        if (self.dialog.state === Dialog.State.active)
            self.join();
    }

    /**
     * @private
    */
    _notifyEvent(event) {
        event.conference = this;
        isFunction(this.onConferenceEvent) && this.onConferenceEvent(event);
    }

    /**
     * @private
     */
    _notifyStateChangeEvent() {
        this._notifyEvent({
            type: EventType.stateChange,
            state: this.state,
        });
    }

    /**
     * @private
     */
    _notifyErrorEvent(error) {
        this._notifyEvent({
            type: EventType.error,
            error,
        });
    }

    /**
     * @returns {Promise<boolean>}
     * @private
     */
    async _setState(state) {
        const self = this;
        if (self.isDestroyed() || self.state === ConferenceState.destroy)
            return false;

        if (self.state === state) {
            logger.warn("The state no change " + state);
            return false;
        }

        if (!checkConfStateChangeValid(self.state, state)) {
            const msg = "Invalid state change from " + self.state + " to " + state;
            logger.error("Conference " + self.callID + ": " + msg);
            self._notifyErrorEvent(new Error(msg));
            self.hangup({ cause: msg });
            return false;
        }

        logger.info("Conference " + self.callID + ": Change state from " + self.state + " to " + state);
        self.lastState = self.state;
        self.state = state;
        self._notifyStateChangeEvent();

        switch (self.state) {
            case ConferenceState.join:
                self.liveArray.bootstrap();
                break;
            case ConferenceState.hangup:
                await self.dialog.hangup(self._hangupParams);
                self._setState(ConferenceState.destroy);
                break;
            case ConferenceState.destroy:
                delete self.verto.conferences[self.callID];
                super.destroy();
                break;
        }
        return true;
    }

    /**
     * 是否视频会议
     * @returns {boolean}
     * @readonly
    */
    get isVideo() {
        return this.dialog.wantVideo;
    }

    /**
     * 组会号码
     * @returns {string}
     * @readonly
     */
    get groupNumber() {
        return this.pvtData.laName;
    }

    /**
     * 用户号码
     * @returns {string}
     * @readonly
     */
    get userNumber() {
        return this.dialog.userNumber;
    }

    /**
     * 用户在组会中的成员id
     * @returns {string}
     * @readonly
     */
    get userMemberID() {
        return this.pvtData.conferenceMemberID;
    }

    /**
     * 发送聊天消息
     * @param {string} message 发送的消息
     * @param {string|undefined} type 消息类型
     * @param {Function|undefined} onSuccess
     * @param {Function|undefined} onError
     * @returns {void}
     */
    sendChat(message, type = "chatMessage", onSuccess, onError) {
        Check.typeOf.string('message', message);
        const self = this;
        const params = {
            "eventChannel": self.pvtData.chatChannel,
            "data": {
                "action": "send",
                "message": message,
                "type": type
            }
        };
        if (self.verto.rpcClient)
            self.verto.rpcClient.call(VertoMethod.broadcast, params, onSuccess, onError);
    }

    /**
     * 当前用户是否组会主持人
     * @returns {boolean}
     */
    get isModerator() {
        return this.pvtData.role === "moderator";
    }

    /**
     * 发送组会主持人命令
     * @param {string} command
     * @param {number|undefined} id
     * @param {string|undefined} value
     * @param {Function|undefined} onSuccess
     * @param {Function|undefined} onError
     * @returns {void}
     */
    moderatorCommand(command, id, value, onSuccess, onError) {
        const self = this;
        if (!self.isModerator || !self.pvtData.modChannel) {
            logger.warn("The role is not moderator, can not call moderator command.");
            return;
        }
        if (!self._mod_cmd_callbacks[command]) {
            self._mod_cmd_callbacks[command] = [];
        }
        self._mod_cmd_callbacks[command].push({
            command, id, value, onSuccess, onError
        });
        const params = {
            "eventChannel": self.pvtData.modChannel,
            "data": {
                "application": "conf-control",
                "command": command,
                "id": id,
                "value": value,
            }
        };
        if (self.verto.rpcClient)
            self.verto.rpcClient.call(VertoMethod.broadcast, params);
    }

    /**
     * 获取当前画布信息
     * @param {Function|undefined} onSuccess
     * @param {Function|undefined} onError
     * @returns {void}
     */
    canvasInfo(onSuccess, onError) {
        this.moderatorCommand("canvasInfo", null, null, onSuccess, onError);
    }

    /**
     * 获取支持的所有视频布局列表
     * @param {Function|undefined} onSuccess
     * @param {Function|undefined} onError
     * @returns {void}
     */
    listVideoLayouts(onSuccess, onError) {
        this.moderatorCommand("list-videoLayouts", null, null, onSuccess, onError);
    }

    /**
     * 设置视频布局
     * @param {string} layout 布局名称，从listVideoLayouts接口中获取
     * @param {string|undefined} canvasID
     * @returns {void}
     */
    setVideoLayout(layout, canvasID) {
        if (!this.isVideo) {
            logger.warn("The conference has no video.");
            return;
        }
        if (canvasID) {
            this.moderatorCommand("vid-layout", null, [layout, canvasID]);
        } else {
            this.moderatorCommand("vid-layout", null, layout);
        }
    }

    /**
     * 在组会中播放一段音视频
     * @param {string} url 音视频url
     * @returns {void}
     */
    play(url) {
        if (!url.startsWith("av://"))
            url = "av://" + url;
        this.moderatorCommand("play", null, url);
    }

    /**
     * 停止播放音视频
     * @returns {void}
     */
    stopPlay() {
        this.moderatorCommand("stop", null, "all");
    }

    /**
     * 开始会议录制
     * @param {string} dirPath 录制文件目录路径
     * @param {string|undefined} fileName 文件名，可不填由程序自动生成
     * @returns {string} 录制的文件全路径
     */
    startRecord(dirPath, fileName) {
        Check.defined('dirPath', dirPath);
        if (!fileName) {
            const startTime = formatDate('yyyy-MM-dd-HH-mm-ss');
            const extention = (this.isVideo ? '.mp4' : '.wav');
            fileName = startTime + '_' + this.userNumber + '_' + this.groupNumber + extention;
        }
        if (!dirPath.startsWith('/'))
            dirPath = '/' + dirPath;
        if (!dirPath.endsWith('/'))
            dirPath = dirPath + '/';
        const filePath = 'av://' + dirPath + fileName;
        this.moderatorCommand("recording", null, ["start", filePath]);
        return filePath;
    }

    /**
     * 停止会议录制
     * @returns {void}
     */
    stopRecord() {
        this.moderatorCommand("recording", null, ["stop", "all"]);
    }

    snapshot(file) {
        if (!this.isVideo) {
            logger.warn("The conference has no video.");
            return;
        }
        this.moderatorCommand("vid-write-png", null, file);
    }

    /**
     * 禁听某位成员
     * @param {string} memberID 成员id
     * @returns {void}
     */
    deaf(memberID) {
        this.moderatorCommand("deaf", parseInt(memberID));
    }

    /**
     * 解除禁听
     * @param {string} memberID 成员id
     * @returns {void}
     */
    undeaf(memberID) {
        this.moderatorCommand("undeaf", parseInt(memberID));
    }

    /**
     * 开启或关闭某位成员麦克风
     * @param {string} memberID 成员id
     * @param {string|boolean|undefined} what 执行何种动作，默认toggle
     * @property {string} on 开启
     * @property {string} open 开启
     * @property {string} off 关闭
     * @property {string} close 关闭
     * @property {string} toggle 切换
     * @property {boolean} true 关闭
     * @property {boolean} false 开启
     * @returns {void}
     */
    muteMic(memberID, what = 'toggle') {
        if (typeof what === 'string') {
            switch (what) {
                case "on":
                case "open":
                    this.moderatorCommand("unmute", parseInt(memberID))
                    break;
                case "off":
                case "close":
                    this.moderatorCommand("mute", parseInt(memberID))
                    break;
                case "toggle":
                default:
                    this.moderatorCommand("tmute", parseInt(memberID));
                    break;
            }
        } else {
            what ? this.moderatorCommand("mute", parseInt(memberID)) : this.moderatorCommand("unmute", parseInt(memberID));
        }
    }

    /**
     * 切换某位成员麦克风
     */
    toggleMic(memberID) {
        return this.muteMic(memberID, 'toggle');
    }

    /**
     * 开启或关闭某位成员相机
     * @param {string} memberID 成员id
     * @param {string|boolean|undefined} what 执行何种动作，默认toggle
     * @property {string} on 开启
     * @property {string} open 开启
     * @property {string} off 关闭
     * @property {string} close 关闭
     * @property {string} toggle 切换
     * @property {boolean} true 关闭
     * @property {boolean} false 开启
     * @returns {void}
     */
    muteCamera(memberID, what = 'toggle') {
        if (!this.isVideo) {
            logger.warn("The conference has no video.");
            return;
        }
        if (typeof what === 'string') {
            switch (what) {
                case "on":
                case "open":
                    this.moderatorCommand("unvmute", parseInt(memberID))
                    break;
                case "off":
                case "close":
                    this.moderatorCommand("vmute", parseInt(memberID))
                    break;
                case "toggle":
                default:
                    this.moderatorCommand("tvmute", parseInt(memberID));
                    break;
            }
        } else {
            what ? this.moderatorCommand("vmute", parseInt(memberID)) : this.moderatorCommand("unvmute", parseInt(memberID));
        }
    }

    /**
     * 切换某位成员相机
     */
    toggleCamera(memberID) {
        return this.muteCamera(memberID, 'toggle');
    }

    /**
     * 踢出某位成员
     * @param {string} memberID 成员id
     * @returns {void}
     */
    kick(memberID) {
        this.moderatorCommand("kick", parseInt(memberID));
    }

    /**
     * 指定某位成员为主讲人
     * @param {string} memberID 成员id
     * @returns {void}
     */
    presenter(memberID) {
        if (!this.isVideo) {
            logger.warn("The conference has no video.");
            return;
        }
        this.moderatorCommand("vid-res-id", parseInt(memberID), "presenter");
    }

    /**
     * 设置某位成员视频为floor
     * @param {string} memberID 成员id
     * @returns {void}
     */
    videoFloor(memberID) {
        if (!this.isVideo) {
            logger.warn("The conference has no video.");
            return;
        }
        this.moderatorCommand("vid-floor", parseInt(memberID), "force");
    }

    /**
     * 设置某位成员视频banner
     * @param {string} memberID 成员id
     * @param {string} text banner文本内容
     * @returns {void}
     */
    videoBanner(memberID, text) {
        if (!this.isVideo) {
            logger.warn("The conference has no video.");
            return;
        }
        this.moderatorCommand("vid-banner", parseInt(memberID), encodeURI(text));
    }

    /**
     * 重置某位成员视频banner
     * @param {string} memberID 成员id
     * @returns {void}
     */
    resetVideoBanner(memberID) {
        this.videoBanner(memberID, 'reset');
    }

    /**
     * 转呼某位成员
     * @param {string} memberID 成员id
     * @param {string} destination_number 目标号码
     * @returns {void}
     */
    transfer(memberID, destination_number) {
        this.moderatorCommand("transfer", parseInt(memberID), destination_number);
    }

    /**
     * 减小某位成员的输出音量
     * @param {string} memberID 成员id
     * @returns {void}
     */
    volumeDown(memberID) {
        this.moderatorCommand("volume_out", parseInt(memberID), "down");
    };

    /**
     * 增大某位成员的输出音量
     * @param {string} memberID 成员id
     * @returns {void}
     */
    volumeUp(memberID) {
        this.moderatorCommand("volume_out", parseInt(memberID), "up");
    };

    /**
     * 减小某位成员的麦克风音量
     * @param {string} memberID 成员id
     * @returns {void}
     */
    gainDown(memberID) {
        this.moderatorCommand("volume_in", parseInt(memberID), "down");
    };

    /**
     * 增大某位成员的麦克风音量
     * @param {string} memberID 成员id
     * @returns {void}
     */
    gainUp(memberID) {
        this.moderatorCommand("volume_in", parseInt(memberID), "up");
    };

    /**
     * 结束组会，只有主持人可以结束组会
     * @returns {Promise<boolean>}
    */
    async close() {
        if (!this.isModerator) {
            logger.warn("The role is not moderator, can not call close command.");
            return false;
        }
        const members = this.liveArray.members();
        members.forEach(member => {
            if (member.number !== this.dialog.params.login)
                this.kick(member.id);
        });
        return await this.hangup();
    }

    /**
     * 加入
     * @returns {Promise<void>}
     * @private
     */
    async join() {
        const self = this;
        if (self.state === ConferenceState.new) {
            await self._setState(ConferenceState.join);
        } else {
            logger.warn('The conference state is not new, can not execute join method.');
        }
    }

    /**
     * 挂断
     * @param {object|undefined} params 参数
     * @param {string|undefined} params.cause 原因文本
     * @param {number|undefined} params.causeCode 原因编码
     * @returns {Promise<boolean>}
     */
    async hangup(params) {
        this._hangupParams = params;
        return await this._setState(ConferenceState.hangup);
    }

    /**
     * 销毁
     * @returns {void}
     */
    destroy() {
        this._setState(ConferenceState.destroy);
    }

    onDestroy() {
        this.liveArray && this.liveArray.destroy();
        this.modChannel && this.verto.unsubscribeChannel(this.modChannel);
        this.infoChannel && this.verto.unsubscribeChannel(this.infoChannel);
        this.chatChannel && this.verto.unsubscribeChannel(this.chatChannel);
    }
};

Object.defineProperties(Conference, {
    /**
     * 组会状态
     * @type {ConferenceState}
     * @static
     * @readonly
     * @memberof Conference
    */
    State: {
        get: function () {
            return ConferenceState;
        }
    },
    /**
     * 组会成员信息
     * @type {ConferenceMemberInfo}
     * @static
     * @readonly
     * @memberof Conference     * 
    */
    MemberInfo: {
        get: function () {
            return ConferenceMemberInfo;
        }
    },
    /**
     * 组会实时数组
     * @type {ConferenceLiveArray}
     * @static
     * @readonly
     * @memberof Conference     * 
    */
    LiveArray: {
        get: function () {
            return ConferenceLiveArray;
        }
    },
    /**
     * 组会实时数组动作
     * @type {ConferenceLiveArrayAction}
     * @static
     * @readonly
     * @memberof Conference     * 
    */
    LiveArrayAction: {
        get: function () {
            return ConferenceLiveArrayAction;
        }
    }
});

export default Conference;
export { Conference, ConferenceLiveArray, ConferenceLiveArrayAction, ConferenceState };
