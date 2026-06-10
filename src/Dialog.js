import Check from "@lijuhong1981/jscheck/src/Check.js";
import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import isStringNotEmpty from "@lijuhong1981/jscheck/src/isStringNotEmpty.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import deepMix from "@lijuhong1981/jslib/src/deepMix.js";
import generateGUID from "@lijuhong1981/jslib/src/generateGUID.js";
import { EventType, VertoMethod } from "./Enums.js";
import FSRTC from "./FSRTC.js";
import { getDeviceIdByLabel, getUserMediaConstraints } from "./MediaDevice.js";
import { getMediaElementByTag, logger } from "./Tools.js";

/**
 * @import VertoClient, { DeviceParams } from "./VertoClient.js";
*/

/**
 * 会话方向
 * @enum {string} Direction
 * @property {string} inbound 呼入
 * @property {string} outbound 呼出
 * @readonly
 */
const Direction = Object.freeze({
    inbound: 'inbound',
    outbound: 'outbound',
});

/**
 * 会话状态
 * @enum {string} DialogState
 * @property {string} new 新建会话
 * @property {string} readying 会话准备中，获取本地媒体流，建立RTCPeerConnection
 * @property {string} inviting 发送会话邀请请求
 * @property {string} trying 发送会话邀请成功，FreeSwitch尝试呼叫
 * @property {string} waiting 呼叫成功，对方已响铃，获取到FreeSwitch下发的早期流媒体，等待对方应答
 * @property {string} ringing 响铃中
 * @property {string} answering 发送会话接听请求
 * @property {string} attaching 发送会话恢复请求
 * @property {string} active 会话已建立，通话中
 * @property {string} holding 会话保持中
 * @property {string} hangup 挂断会话
 * @property {string} destroy 销毁会话
 * @readonly
 */
const DialogState = Object.freeze({
    new: 'new',
    readying: 'readying',
    inviting: 'inviting',
    trying: 'trying',
    ringing: 'ringing',
    waiting: 'waiting',
    answering: 'answering',
    attaching: 'attaching',
    active: 'active',
    holding: 'holding',
    hangup: 'hangup',
    destroy: 'destroy',
});

const dialogValidStatesChange = Object.freeze({
    new: {
        readying: true,
        inviting: true,
        ringing: true,
        answering: true,
        attaching: true,
        hangup: true,
        destroy: true,
    },
    readying: {
        inviting: true,
        ringing: true,
        answering: true,
        attaching: true,
        hangup: true,
        destroy: true,
    },
    inviting: {
        trying: true,
        hangup: true,
        active: true
    },
    trying: {
        active: true,
        waiting: true,
        hangup: true
    },
    waiting: {
        hangup: true,
        active: true
    },
    ringing: {
        readying: true,
        answering: true,
        attaching: true,
        hangup: true
    },
    answering: {
        active: true,
        hangup: true,
    },
    attaching: {
        active: true,
        hangup: true,
    },
    active: {
        inviting: true,
        answering: true,
        attaching: true,
        hangup: true,
        holding: true,
    },
    holding: {
        active: true,
        hangup: true,
    },
    hangup: {
        destroy: true
    },
    destroy: {},
});

/**
 * 检查状态变化是否合法
 * @param {DialogState} oldS
 * @param {DialogState} newS
 * @returns {boolean}
 * @private
 */
function checkDialogStateChangeValid(oldS, newS) {
    return dialogValidStatesChange[oldS][newS];
}

/**
 * @param {Dialog} dialog
 * @returns {string}
 * @ignore
 */
function getTargetCallNumber(dialog) {
    return dialog.direction === Direction.inbound ? dialog.callerNumber : dialog.calleeNumber
}

/**
 * @param {Dialog} dialog
 * @returns {string}
 * @ignore
 */
function getTargetName(dialog) {
    return dialog.direction === Direction.inbound ? dialog.callerName : dialog.calleeName;
}

const send_keys = ['callID', 'sdp', 'destination_number', 'caller_id_name', 'caller_id_number', 'remote_caller_id_name', 'remote_caller_id_number', 'callee_id_name', 'callee_id_number', 'display_direction', 'login', 'wantVideo', 'screenShare'];

/**
 * @param {HTMLMediaElement} element
 * @param {MediaStream} stream
 * @returns {void}
 * @ignore
 */
function attachMediaStream(element, stream) {
    if (element && element instanceof HTMLMediaElement) {
        if (element.srcObject !== stream)
            element.srcObject = stream;
        else
            logger.warn('The element.srcObject equals with the stream.');
    } else {
        logger.error('Error attaching stream to element.', element);
    }
}

/**
 * 会话对象，发起呼叫或收到呼叫时生成该对象，同时在onDialogEvent事件回调中传递该对象
 * @extends Destroyable
*/
class Dialog extends Destroyable {
    /**
     * @constructor
     * @param {Direction} direction 呼叫方向，呼出还是呼入
     * @param {VertoClient} client 通讯客户端对象
     * @param {object|undefined} params 配置项
     * @param {boolean|undefined} params.wantVideo 呼叫或应答是否启用视频
     * @param {boolean|undefined} params.hasRemoteVideo 被叫时远程媒体流是否包含视频 
     * @param {string|HTMLMediaElement|Function|undefined} params.remoteTag 播放远程音视频的dom标签
     * @param {string|HTMLMediaElement|Function|undefined} params.localTag 播放本地音视频的dom标签
     * @param {number|undefined} params.overtime 等待接听超时时间，单位毫秒
     * @param {DeviceParams|undefined} params.deviceParams 设备相关参数
     * @param {Function|undefined} onDialogEvent Dialog事件回调通知
    */
    constructor(direction, client, params = {}, onDialogEvent) {
        super();
        Check.defined('direction', direction);
        Check.defined('client', client);

        const self = this;

        self.params = deepMix({
            wantVideo: false,
            hasRemoteVideo: false,
            screenShare: false,
            remoteTag: client.localParams.remoteTag,
            localTag: client.localParams.localTag,
            overtime: client.localParams.overtime,
            deviceParams: client.deviceParams,
        }, params);
        // logger.log('Create Dialog:', self.params);

        /**
         * 呼叫方向
         * @type {Direction}
        */
        this.direction = direction;
        self.client = client;
        self.onDialogEvent = onDialogEvent;

        /**
         * 当前的会话状态
         * @type {DialogState}
        */
        this.state = DialogState.new;
        /**
         * 之前的会话状态
         * @type {DialogState}
         * @private
        */
        self.lastState = self.state;
        self.answered = false;
        self.invited = false;
        self.attach = params.attach || false;
        self.gotAnswer = false;
        self.gotMedia = false;
        self.gotBye = false;
        self.sentBye = false;
        self._hangupParams = { cause: 'NORMAL_CLEARING', };

        if (!self.params.callID) self.params.callID = generateGUID();

        self.client.dialogs[self.callID] = self;

        // 含有远程视频，应答也启用视频
        if (self.params.hasRemoteVideo) self.params.wantVideo = true;

        if (self.direction === Direction.inbound) {
            // 呼入的caller_id_name包含-novideo字段，说明是音频通话，设置wantVideo为false
            if (self.params.caller_id_name && self.params.caller_id_name.endsWith("-novideo") > 0)
                self.params.wantVideo = false;
            if (self.client.loginData.userVariables && self.client.loginData.userVariables.nickName)
                self.params.callee_id_name = self.client.loginData.userVariables.nickName;
        } else {
            if (self.params.destination_number)
                self.params.destinationNumber = self.params.destination_number;

            self.params.callee_id_number = self.destinationNumber;
            if (!self.params.callee_id_name) self.params.callee_id_name = self.destinationNumber;
            if (!self.params.caller_id_name) self.params.caller_id_name = self.userName;
            if (!self.params.caller_id_number) self.params.caller_id_number = self.userNumber;
        }

        if (self.client.rpcClient)
            self.rtc = new FSRTC(self, {
                onIceSDP: function (rtc) {
                    // logger.log("RECV " + rtc.type + " SDP", rtc.mediaData.SDP);

                    // if (self.state === State.inviting || self.state === State.answering || self.state == State.active) {
                    //     location.reload();
                    //     return;
                    // }

                    if (rtc.type === "offer") { //attach or invite
                        if (self.isActive) {
                            self._setState(DialogState.attaching);
                            self._sendVertoMethod(VertoMethod.attach, {
                                sdp: rtc.mediaData.SDP
                            });
                        } else {
                            self._setState(DialogState.inviting);
                            self._sendVertoMethod(VertoMethod.invite, {
                                sdp: rtc.mediaData.SDP
                            });
                        }
                    } else { //attach or answer
                        if (self.attach) {
                            self._setState(DialogState.attaching);
                            self._sendVertoMethod(VertoMethod.attach, {
                                sdp: rtc.mediaData.SDP
                            });
                        } else {
                            self._setState(DialogState.answering);
                            self._sendVertoMethod(VertoMethod.answer, {
                                sdp: rtc.mediaData.SDP
                            });
                        }
                    }
                },
                onError: function (e) {
                    // logger.error("ERROR:", e);
                    self.hangup({ cause: "Device or Permission Error" });
                },
                /**
                 * @param {FSRTC} rtc
                 * @param {MediaStream} stream
                 * @returns {void}
                 * @private
                 */
                onLocalStream: function (rtc, stream) {
                    if (rtc.hasVideo && self.localVideo)
                        attachMediaStream(self.localVideo, stream);
                    self._notifyEvent({
                        type: EventType.localStream,
                        stream,
                    });
                },
                /**
                 * @param {FSRTC} rtc
                 * @param {MediaStream} stream
                 * @returns {void}
                 * @private
                 */
                onRemoteStream: function (rtc, stream) {
                    if (self.remoteAudio)
                        attachMediaStream(self.remoteAudio, stream);
                    self._notifyEvent({
                        type: EventType.remoteStream,
                        stream,
                    });
                },
            });

        self._notifyStateChangeEvent();

        (async () => {
            if (self.direction === Direction.inbound) {
                if (self.gotBye) return;

                if (self.attach) {
                    self.answer();
                } else {
                    self.ring();
                }
            } else {
                if (self.gotBye) return;

                self.params.destination_number = self.destinationNumber;
                self.call();
            }
        })();
    }

    /**
     * 用户号码
     * @returns {string}
     * @readonly
     */
    get userNumber() {
        return this.client.loginData.account;
    }

    /**
     * 用户名称
     * @returns {string}
     * @readonly
     */
    get userName() {
        if (this.client.loginData.userVariables && this.client.loginData.userVariables.nickName)
            return this.client.loginData.userVariables.nickName;
        else
            return this.userNumber;
    }

    /**
     * 呼叫目标号码，direction === Direction.outbound 时存在
     * @returns {string}
     * @readonly
     */
    get destinationNumber() {
        return this.params.destinationNumber;
    }

    /**
     * 会话id
     * @returns {string}
     * @readonly
    */
    get callID() {
        return this.params.callID;
    }

    /**
     * 获取设备相关参数
     * @returns {DeviceParams}
     * @readonly
    */
    get deviceParams() {
        return this.params.deviceParams;
    }

    /**
     * 是否视频呼叫
     * @returns {boolean}
     * @readonly
    */
    get wantVideo() {
        return this.params.wantVideo;
    }

    /**
     * 本地媒体流是否包含视频
     * @returns {boolean}
     * @readonly
     */
    get hasLocalVideo() {
        return this.rtc.hasVideo;
    }

    /**
     * 远程媒体流是否包含视频
     * @returns {boolean}
     * @readonly
     */
    get hasRemoteVideo() {
        return this.params.hasRemoteVideo;
    }

    /**
     * 呼叫者名称
     * @returns {string}
     * @readonly
     */
    get callerName() {
        return this.params.caller_id_name;
    }

    /**
     * 呼叫者号码
     * @returns {string}
     * @readonly
     */
    get callerNumber() {
        return this.params.caller_id_number;
    }

    /**
     * 被叫者名称
     * @returns {string}
     * @readonly
     */
    get calleeName() {
        return this.params.callee_id_name;
    }

    /**
     * 被叫者号码
     * @returns {string}
     * @readonly
     */
    get calleeNumber() {
        return this.params.callee_id_number;
    }

    /**
     * 会话远程用户号码
     * @returns {string}
     * @readonly
     */
    get remoteNumber() {
        return getTargetCallNumber(this);
    }

    /**
     * 会话远程用户名称
     * @returns {string}
     * @readonly
     */
    get remoteName() {
        return getTargetName(this);
    }

    /**
     * 是否通话中
     * @returns {boolean}
     */
    get isActive() {
        return this.state === DialogState.active;
    }

    /**
     * 是否通话保持中
     * @returns {boolean}
     */
    get isHolding() {
        return this.state === DialogState.holding;
    }

    /**
     * @private
     */
    _notifyEvent(event) {
        event.dialog = this;
        isFunction(this.onDialogEvent) && this.onDialogEvent(event);
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
     * @private
     */
    async _getMediaTags() {
        try {
            if (this.client.sessionManager)
                return;
            this.remoteAudio = this.params.remoteTag ? await getMediaElementByTag(this.params.remoteTag) : null;
            this.remoteVideo = this.params.wantVideo ? this.remoteAudio : null;
            this.localVideo = this.params.localTag ? await getMediaElementByTag(this.params.localTag) : null;
        } catch (error) {
            logger.error(error);
        }
    }

    /**
     * @private
     */
    async _setState(state) {
        const self = this;
        if (self.isDestroyed() || self.state === DialogState.destroy)
            return false;

        if (self.state === state) {
            logger.warn("The state no change " + state);
            return false;
        }

        if (state !== DialogState.ringing) {
            self._stopRinging();
        }

        if (!checkDialogStateChangeValid(self.state, state)) {
            const msg = "Invalid state change from " + self.state + " to " + state;
            logger.error("Dialog " + self.callID + ": " + msg);
            self._notifyErrorEvent(new Error(msg));
            self.hangup({ cause: msg });
            return false;
        }

        logger.info("Dialog " + self.callID + ": Change state from " + self.state + " to " + state);
        self.lastState = self.state;
        self.state = state;
        self._notifyStateChangeEvent();

        switch (self.state) {
            case DialogState.readying:
                await self._getMediaTags();
                break;
            case DialogState.ringing:
                setTimeout(function () {
                    if (self.state === DialogState.ringing)
                        self.hangup({ cause: 'RINGING_TIMEOUT' });
                }, self.params.overtime);
                break;
            case DialogState.waiting:
            case DialogState.active:
                if (self.state === DialogState.waiting) {
                    setTimeout(function () {
                        if (self.state === DialogState.waiting)
                            self.hangup({ cause: 'CALL_TIMEOUT' });
                    }, self.params.overtime);
                }

                const speaker = self.deviceParams.useSpeaker;
                logger.info("Using Speaker: ", speaker);

                if (speaker && speaker !== "default" && speaker !== "none") {
                    setTimeout(function () {
                        self.setSpeakerDevice(speaker);
                    }, 500);
                }

                if (self.state === DialogState.active) {
                    //为避免状态异常，这里需要判断conference是否已生成，否则则由conference自己来调用join()
                    if (self.conference)
                        self.conference.join();
                }
                break;
            case DialogState.hangup:
                if (!self.gotBye && !self.sentBye) {
                    if (self.client.sessionManager && self.session) {
                        if (self._hangupParams.cause === "CALL_REJECTED")
                            await self.client.sessionManager.decline(self.session);
                        else
                            await self.client.sessionManager.hangup(self.session);
                    } else
                        self._sendVertoMethod(VertoMethod.bye, self._hangupParams);
                    self.sentBye = true;
                }
                setTimeout(() => {
                    self._setState(DialogState.destroy);
                }, 10);
                break;
            case DialogState.destroy:
                if (self.remoteAudio) self.remoteAudio.srcObject = null;
                if (self.localVideo) self.localVideo.srcObject = null;
                delete self.client.dialogs[self.callID];
                if (self.params.screenShare) {
                    self.rtc && self.rtc.stopPeer();
                } else {
                    self.rtc && self.rtc.stop();
                }
                super.destroy();
                break;
        }
        return true;
    }

    /**
     * 处理通过sendMethod发送消息的结果
     * @param {string} method
     * @param {boolean} success
     * @param {object} e
     * @returns {void}
     * @private
     */
    _processResult(method, success, e) {
        const self = this;

        switch (method) {
            case VertoMethod.answer:
            case VertoMethod.attach:
                if (success) {
                    self._setState(DialogState.active);
                } else {
                    self.hangup(e.cause ? e : { cause: "CALL_" + method.toLocaleUpperCase() + "_FAILED" });
                }
                break;
            case VertoMethod.invite:
                if (success) {
                    self._setState(DialogState.trying);
                } else {
                    self.hangup(e.cause ? e : { cause: "CALL_" + method.toLocaleUpperCase() + "_FAILED" });
                }
                break;
            case VertoMethod.bye:
                if (!success) //发送不成功，再次发送
                    self._sendVertoMethod(Method.bye, self._hangupParams);
                break;
            case VertoMethod.modify:
                if (e.holdState === "held") {
                    if (self.state !== DialogState.holding)
                        self._setState(DialogState.holding);
                } else if (e.holdState === "active") {
                    if (self.state !== DialogState.active)
                        self._setState(DialogState.active);
                }
                break;
            default:
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
        if (this.isDestroyed())
            return;
        const self = this;

        params.dialogParams = {};

        for (const key in self.params) {
            if (key === "sdp" && method !== VertoMethod.invite && method !== VertoMethod.attach) {
                continue;
            }

            if ((params.noDialogParams && key !== "callID")) {
                continue;
            }

            if (send_keys.indexOf(key) === -1)
                continue;

            params.dialogParams[key] = self.params[key];
        }

        delete params.noDialogParams;

        if (self.client.rpcClient)
            self.client.rpcClient.call(method, params,
                function (e) {
                    /* Success */
                    self._processResult(method, true, e);
                },
                function (e) {
                    /* Error */
                    self._notifyErrorEvent(e);
                    self._processResult(method, false, e);
                });
    }

    /**
     * 设置扬声器
     * @param {string} sinkId The [MediaDeviceInfo.deviceId](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo/deviceId) of the audio output device
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {Promise}
     */
    async setSpeakerDevice(sinkId, onSuccess, onError) {
        const self = this;
        const element = self.remoteAudio;
        if (element) {
            try {
                if (isFunction(element.setSinkId)) {
                    logger.info("Dialog " + self.callID + " setSpeakerDevice: " + sinkId);

                    await element.setSinkId(sinkId);
                    isFunction(onSuccess) && onSuccess();
                } else {
                    throw new Error('The browser does not support setSinkId function.');
                }
            } catch (error) {
                logger.error(error);
                isFunction(onError) && onError(error);
                throw error;
            }
        }
    }

    /**
     * 发起会话
     * @returns {Promise}
    */
    async call() {
        const self = this;

        await self._setState(DialogState.readying);
        if (self.rtc)
            self.rtc.call();
    }

    /**
     * 会话应答
     * @param {object|undefined} params 应答参数
     * @param {boolean|undefined} params.wantVideo 是否启用视频，默认由呼叫方决定
     * @param {string|HTMLMediaElement|Function|undefined} params.remoteTag 播放远程音视频的dom标签
     * @param {string|HTMLMediaElement|Function|undefined} params.localTag 播放本地音视频的dom标签
     * @param {DeviceParams} params.deviceParams 设备相关参数
     * @returns {Promise}
     */
    async answer(params = {}) {
        const self = this;

        if (!self.answered) {
            if (defined(params.wantVideo)) self.params.wantVideo = params.wantVideo;
            if (params.remoteTag) self.params.remoteTag = params.remoteTag;
            if (params.localTag) self.params.localTag = params.localTag;
            if (params.deviceParams) deepMix(self.deviceParams, params.deviceParams);

            await self._setState(DialogState.readying);
            if (self.rtc)
                self.rtc.answer({
                    sdp: self.params.sdp
                });
            else if (self.client.sessionManager && self.session) {
                const constraints = getUserMediaConstraints(self);
                const options = {
                    extraHeaders: [],
                    sessionDescriptionHandlerOptions: {
                        constraints: constraints
                    }
                };
                self._setState(DialogState.answering);
                self.client.sessionManager.answer(self.session, options);
            }
            self.answered = true;
        } else {
            logger.warn("Dialog " + this.callID + " has answered.");
        }
    }

    /**
     * 挂断
     * @param {object} params 参数
     * @param {string|undefined} params.cause 原因文本
     * @param {number|undefined} params.causeCode 原因编码
     * @returns {Promise}
     */
    async hangup(params = { cause: 'NORMAL_CLEARING', }) {
        if (this.isDestroyed() || this.state === DialogState.hangup || this.state === DialogState.destroy)
            return;

        if (params.cause) this._hangupParams.cause = params.cause;
        if (params.causeCode) this._hangupParams.causeCode = params.causeCode;
        logger.log("Dialog " + this.callID + " hangup:", this._hangupParams);

        await this._setState(DialogState.hangup);
    }

    /**
     * 拒绝接听
     * @returns {Promise}
     */
    reject() {
        return this.hangup({ cause: "CALL_REJECTED" });
    }

    /**
     * @private
     */
    _stopRinging() {
        if (this.client.ringer) {
            this.client.ringer.pause();
            this.client.ringer.currentTime = 0;
            this.client.ringer.src = "";
        }
    }

    /**
     * @private
     */
    async _startRinging() {
        const self = this;

        if (self.client.ringer) {
            const ringFile = self.client.localParams.ringFile;
            if (ringFile) {
                self.client.ringer.src = ringFile;
                self.client.ringer.loop = true;
                await self.client.ringer.play();
            } else
                logger.warn("The ringFile is undefined, can not play ring");
        }
    }

    /**
     * 响铃
     * @returns {Promise}
     */
    async ring() {
        await this._startRinging();
        this._setState(DialogState.ringing);
    }

    /**
     * 通话转移
     * @param {string} destination
     * @param {object} params
     * @returns {void}
     */
    transfer(destination, params) {
        if (destination) {
            this._sendVertoMethod(VertoMethod.modify, {
                action: "transfer",
                destination,
                params,
            });
        }
    }

    replace(replaceCallID, params) {
        if (replaceCallID) {
            this._sendVertoMethod(VertoMethod.modify, {
                action: "replace",
                replaceCallID: replaceCallID,
                params: params
            });
        }
    }

    /**
     * 通话保持
     * @param {object} params
     * @returns {void}
     */
    hold(params) {
        this._sendVertoMethod(VertoMethod.modify, {
            action: "hold",
            params: params
        });
    }

    /**
     * 取消通话保持
     * @param {object} params
     * @returns {void}
     */
    unhold(params) {
        this._sendVertoMethod(VertoMethod.modify, {
            action: "unhold",
            params: params
        });
    }

    /**
     * 切换通话保持状态
     * @param {object} params
     * @returns {void}
     */
    toggleHold(params) {
        this._sendVertoMethod(VertoMethod.modify, {
            action: "toggleHold",
            params: params
        });
    }

    /**
     * 发送文本消息
     * @param {string} message 消息内容
     * @returns {void}
     */
    sendTextMessage(message) {
        return this.client.sendTextMessage(this.remoteNumber, message);
    }

    dtmf(digits) {
        this._sendVertoMethod(VertoMethod.info, {
            dtmf: digits
        });
    }

    /**
     * @private
     */
    _handleMedia(params) {
        const self = this;

        if (self.gotMedia) {
            logger.warn("Dialog " + self.callID + " Remote Media has got.");
            return;
        }
        // logger.log("Dialog " + self.callID + " EARLY SDP", params.sdp);

        self.gotMedia = true;

        if (params.sdp.indexOf("m=video") > 0) self.params.hasRemoteVideo = true;
        self.rtc.handleAnswerSDP(params.sdp, function () {
            logger.log("Dialog " + self.callID + " Establishing early media");
            self._setState(DialogState.waiting);

            if (self.gotAnswer) {
                logger.log("Dialog " + self.callID + " is gotAnswer, set state to active.");
                self._setState(DialogState.active);
            }
        }, function (e) {
            logger.error(e);
            self.hangup({ cause: "AnswerSDP Error" });
        });
    }

    /**
     * @private
     */
    _handleAnswer(params) {
        const self = this;

        if (self.gotAnswer) {
            logger.warn("Dialog " + self.callID + " Answer has got.");
            return;
        }

        self.gotAnswer = true;

        if (self.state === DialogState.waiting) {
            self._setState(DialogState.active);
        } else {
            if (self.gotMedia) {
                logger.warn("Dialog " + self.callID + " Got answer while still establishing early media, delaying...");
            } else {
                if (params.sdp.indexOf("m=video") > 0) self.params.hasRemoteVideo = true;
                self.rtc.handleAnswerSDP(params.sdp, function () {
                    self._setState(DialogState.active);
                }, function (e) {
                    logger.error(e);
                    self.hangup({ cause: "AnswerSDP Error" });
                });
            }
        }
    }

    /**
     * @private
     */
    async _handleDisplay(params) {
        const self = this;

        let changed = false;
        if (isStringNotEmpty(params.caller_id_name) && self.params.caller_id_name !== params.caller_id_name) {
            self.params.caller_id_name = params.caller_id_name;
            // changed = true;
        }
        if (isStringNotEmpty(params.caller_id_number) && self.params.caller_id_number !== params.caller_id_number) {
            self.params.caller_id_number = params.caller_id_number;
            changed = true;
        }
        if (isStringNotEmpty(params.callee_id_name) && self.params.callee_id_name !== params.callee_id_name) {
            self.params.callee_id_name = params.callee_id_name;
            // changed = true;
        }
        if (isStringNotEmpty(params.callee_id_number) && self.params.callee_id_number !== params.callee_id_number) {
            self.params.callee_id_number = params.callee_id_number;
            changed = true;
        }

        self.params.display_name = params.display_name;
        self.params.display_number = params.display_number;
        self.params.display_direction = params.display_direction;

        if (changed) {
            logger.info("Dialog " + self.callID + " HandleDisplay caller or callee changed.");
            if (self.callerNumber === self.userNumber)
                self.direction = Direction.outbound;
            else if (self.calleeNumber === self.userNumber)
                self.direction = Direction.inbound;
        }

        self._notifyEvent({
            type: EventType.display,
            params,
        });
    }

    /**
     * @private
     */
    _handleInfo(params) { }

    /**
     * @private
    */
    _handleBye(params) {
        this.gotBye = true;
        this.hangup(params);
    }

    /**
     * 麦克风是否已关闭
     * @returns {boolean}
     */
    get micMuted() {
        return this.rtc.micMuted;
    }

    /**
     * 设置麦克风开启或关闭
     * @param {string|boolean|undefined} what 执行何种动作，默认toggle
     * @property {string} on 开启
     * @property {string} open 开启
     * @property {string} off 关闭
     * @property {string} close 关闭
     * @property {string} toggle 切换
     * @property {boolean} true 关闭
     * @property {boolean} false 开启
     * @returns {boolean} 麦克风是否开启
     */
    muteMic(what = 'toggle') {
        return this.rtc.muteMic(what);
    }

    /**
     * 切换麦克风开启或关闭
     * @returns {boolean} 麦克风是否开启
     */
    toggleMic() {
        return this.rtc.muteMic('toggle');
    }

    /**
     * 相机是否已关闭
     * @returns {boolean}
     */
    get cameraMuted() {
        return this.rtc.cameraMuted;
    }

    /**
     * 设置相机开启或关闭
     * @param {string|boolean|undefined} what 执行何种动作，默认toggle
     * @property {string} on 开启
     * @property {string} open 开启
     * @property {string} off 关闭
     * @property {string} close 关闭
     * @property {string} toggle 切换
     * @property {boolean} true 关闭
     * @property {boolean} false 开启
     * @returns {boolean} 相机是否开启
     */
    muteCamera(what = 'toggle') {
        return this.rtc.muteCamera(what);
    }

    /**
     * 切换相机开启或关闭
     * @returns {boolean} 相机是否开启
     */
    toggleCamera() {
        return this.rtc.muteCamera('toggle');
    }

    /**
     * 通话音是否已关闭
     * @returns {boolean}
     */
    get voiceMuted() {
        return this.rtc.voiceMuted;
    }

    /**
     * 设置通话音开启或关闭
     * @param {string|boolean} what 执行何种动作
     * @property {string} on 开启
     * @property {string} off 关闭
     * @property {string} toggle 切换
     * @property {boolean} true 关闭
     * @property {boolean} false 开启
     * @returns {boolean} 通话音是否开启
     */
    muteVoice(what) {
        return this.rtc.muteVoice(what);
    }

    /**
     * 切换通话音开启或关闭
     * @returns {boolean} 通话音是否开启
     */
    toggleVoice() {
        return this.rtc.muteVoice('toggle');
    }

    /**
     * 切换本地媒体流
     * @param {MediaStreamConstraints} constraints 获取媒体流约束条件
     * @param {MediaTrackConstraints|undefined} constraints.audio 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
     * @param {MediaTrackConstraints|undefined} constraints.video 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
     * @returns {Promise<boolean>}
     */
    switchMediaStream(constraints) {
        return this.rtc.switchMediaStream(constraints);
    }

    /**
     * 切换摄像头
     * @param {MediaTrackConstraints|undefined} videoConstraints 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
     * @returns {Promise<boolean>}
     */
    async switchCamera(videoConstraints) {
        if (!videoConstraints) return;
        return await this.switchMediaStream({ video: videoConstraints });
    }

    /**
     * 切换麦克风
     * @param {MediaTrackConstraints|undefined} audioConstraints 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
     * @returns {Promise<boolean>}
     */
    async switchMic(audioConstraints) {
        if (!audioConstraints) return;
        return await this.switchMediaStream({ audio: audioConstraints });
    }

    /**
     * 根据传入的deviceId切换摄像头
     * @param {string} deviceId
     * @returns {Promise<boolean>}
     */
    async switchCameraByDeviceId(deviceId) {
        if (!deviceId) return;
        return await this.switchCamera({ deviceId });
    }

    /**
     * 根据传入的deviceId切换麦克风
     * @param {string} deviceId
     * @returns {Promise<boolean>}
     */
    async switchMicByDeviceId(deviceId) {
        if (!deviceId) return;
        return await this.switchMic({ deviceId });
    }

    /**
     * 根据传入的deviceLabel切换摄像头
     * @param {string} deviceLabel
     * @returns {Promise<boolean>}
     */
    async switchCameraByLabel(deviceLabel) {
        if (!deviceLabel) return;
        const deviceId = getDeviceIdByLabel(deviceLabel);
        return await this.switchCameraByDeviceId(deviceId);
    }

    /**
     * 根据传入的deviceLabel切换麦克风
     * @param {string} deviceLabel
     * @returns {Promise<boolean>}
     */
    async switchMicByLabel(deviceLabel) {
        if (!deviceLabel) return;
        const deviceId = getDeviceIdByLabel(deviceLabel);
        return await this.switchMicByDeviceId(deviceId);
    }

    /**
     * 切换移动端前后摄像头
     * @param {string} facingMode user-前摄像头，environment-后摄像头，不传则默认用user
     * @returns {Promise<boolean>}
     */
    async switchCameraByFacingMode(facingMode = 'user') {
        return await this.switchCamera({ facingMode });
    }

    /**
     * 销毁会话
     * @returns {void}
     */
    destroy() {
        this._setState(DialogState.destroy);
    }

    onDestroy() {
        delete this.localVideo;
        delete this.remoteAudio;
        delete this.remoteVideo
        if (this.rtc) {
            this.rtc.destroy();
            delete this.rtc;
        }
        if (this.session) {
            this.session.dispose();
            delete this.session;
        }
    }
};

Object.defineProperties(Dialog, {
    Direction: {
        get: function () {
            return Direction;
        }
    },
    State: {
        get: function () {
            return DialogState;
        }
    },
});

export default Dialog;
export { Dialog, DialogState, Direction };

