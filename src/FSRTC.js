import Check from "@lijuhong1981/jscheck/src/Check.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import deepMix from "@lijuhong1981/jslib/src/deepMix.js";
import * as logger from "@lijuhong1981/jslib/src/logger.js";
import Dialog from "./Dialog.js";
import { getUserMediaConstraints, getUserMediaStream, stopMediaStream, } from "./MediaDevice.js";
import { ensureIceServers } from "./Tools.js";

// Find the line in sdpLines that starts with |prefix|, and, if specified,
// contains |substr| (case-insensitive search).
function findLine(sdpLines, prefix, substr) {
    return findLineInRange(sdpLines, 0, -1, prefix, substr);
}

// Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
// and, if specified, contains |substr| (case-insensitive search).
function findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
    const realEndLine = (endLine != -1) ? endLine : sdpLines.length;
    for (let i = startLine; i < realEndLine; ++i) {
        if (sdpLines[i].indexOf(prefix) === 0) {
            if (!substr || sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
                return i;
            }
        }
    }
    return null;
}

// Gets the codec payload type from an a=rtpmap:X line.
function getCodecPayloadType(sdpLine) {
    const pattern = new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');
    const result = sdpLine.match(pattern);
    return (result && result.length == 2) ? result[1] : null;
}

// Returns a new m= line with the specified codec as the first one.
function setDefaultCodec(mLine, payload) {
    const elements = mLine.split(' ');
    const newLine = [];
    let index = 0;
    for (let i = 0; i < elements.length; i++) {
        if (index === 3) { // Format of media starts from the fourth.
            newLine[index++] = payload; // Put target payload to the first.
        }
        if (elements[i] !== payload) newLine[index++] = elements[i];
    }
    return newLine.join(' ');
}

// Sets Opus in stereo if stereo is enabled, by adding the stereo=1 fmtp param.
function stereoHack(self, sdp) {
    if (!self.dialog.deviceParams.useStereo) {
        return sdp;
    }

    const sdpLines = sdp.split('\r\n');

    // Find opus payload.
    const opusIndex = findLine(sdpLines, 'a=rtpmap', 'opus/48000');
    let opusPayload;

    if (!opusIndex) {
        return sdp;
    } else {
        opusPayload = getCodecPayloadType(sdpLines[opusIndex]);
    }

    // Find the payload in fmtp line.
    const fmtpLineIndex = findLine(sdpLines, 'a=fmtp:' + opusPayload.toString());

    if (fmtpLineIndex === null) {
        // create an fmtp line
        sdpLines[opusIndex] = sdpLines[opusIndex] + '\r\na=fmtp:' + opusPayload.toString() + " stereo=1; sprop-stereo=1"
    } else {
        // Append stereo=1 to fmtp line.
        sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].concat('; stereo=1; sprop-stereo=1');
    }

    sdp = sdpLines.join('\r\n');
    return sdp;
}

/**
 * @param {FSRTC} self
 * @param {string} cbName
 * @param {...any} args
 * @returns {void}
 */
function doCallback(self, cbName, ...args) {
    isFunction(self.callbacks[cbName]) && self.callbacks[cbName](self, ...args);
}

function onLocalStreamError(self, e) {
    logger.log('There has been a problem retrieving the streams - did you allow access? Check Device Resolution', e);
    doCallback(self, "onError", e);
}

function onLocalStreamSuccess(self, stream) {
    // logger.log("Stream Success");
    doCallback(self, "onLocalStream", stream);
}

function onRemoteStreamSuccess(self, stream) {
    logger.log("Remote Stream Success");
    doCallback(self, "onRemoteStream", stream);
}

function onIceCandidate(self, candidate) {
    // logger.log('onIceCandidate:', candidate);
    self.mediaData.candidate = candidate;
    self.mediaData.candidateList.push(self.mediaData.candidate);

    doCallback(self, "onIceCandidate", candidate);
}

/**
 * @param {FSRTC} self
 * @param {RTCSessionDescription} sd
 * @returns {void}
 */
function onIceSDP(self, sd) {
    self.mediaData.SDP = stereoHack(self, sd.sdp);
    logger.log("onIceSDP:", self.mediaData);
    doCallback(self, "onIceSDP", self.mediaData.SDP);
}

function onChannelError(self, e) {
    // logger.error("Channel Error", e);
    doCallback(self, "onError", e);
}

// function onAnswerSDP(self, sdp) {
//     self.answer.SDP = stereoHack(self, sdp.sdp);
//     logger.log("ICE ANSWER SDP");
//     doCallback(self, "onAnswerSDP", self.answer.SDP);
// }

// function onMessage(self, msg) {
//     logger.log("Message");
//     doCallback(self, "onICESDP", msg);
// }

function onRemoteStream(self, stream) {
    self.remoteStream = stream;
    onRemoteStreamSuccess(self, stream);
}

/**
 * @param {FSRTC} self
 * @param {RTCSessionDescription} sd
 * @returns {void}
 */
function onOfferSDP(self, sd) {
    self.mediaData.SDP = stereoHack(self, sd.sdp);
    // logger.log("onOfferSDP:", self.mediaData);
    doCallback(self, "onOfferSDP", self.mediaData.SDP);
}

function FSRTCPeerConnection(options = {}) {
    const config = {};

    ensureIceServers(config, options);

    config.bundlePolicy = "max-compat";
    config.sdpSemantics = "unified-plan";

    // logger.log('Create Peer:', config);
    const peer = new window.RTCPeerConnection(config);

    openOffererChannel();

    let gathering = false, done = false;
    function ice_complete() {
        done = true;
        gathering = null;

        isFunction(options.onIceSDP) && options.onIceSDP(peer.localDescription);
    }

    peer.onicecandidate = function (event) {
        // logger.log('Peer onicecandidate:', event);
        if (done) {
            return;
        }

        if (!gathering) {
            gathering = setTimeout(ice_complete, 1000);
        }

        if (event) {
            event.candidate && isFunction(options.onIceCandidate) && options.onIceCandidate(event.candidate);
        } else {
            done = true;

            if (gathering) {
                clearTimeout(gathering);
                gathering = null;
            }

            ice_complete();
        }
    };

    if (options.attachStream) {
        // FreeSWITCH currently orders its answer SDP such that audio m-lines
        // always come first, adding the tracks to the peer in that order
        // prevents possible m-line ordering validation errors on the client.
        options.attachStream.getAudioTracks().forEach(function (track) { peer.addTrack(track, options.attachStream) });
        options.attachStream.getVideoTracks().forEach(function (track) { peer.addTrack(track, options.attachStream) });
    }

    if (options.attachStreams && options.attachStreams.length) {
        const streams = options.attachStreams;
        for (var i = 0; i < streams.length; i++) {
            peer.addStream(streams[i]);
        }
    }

    peer.ontrack = function (event) {
        // logger.log('Peer ontrack:', event);
        // var remoteMediaStream = event.stream;
        const remoteMediaStream = event.streams[0];

        remoteMediaStream.oninactive = function () {
            if (options.onRemoteStreamEnded) options.onRemoteStreamEnded(remoteMediaStream);
        };

        isFunction(options.onRemoteStream) && options.onRemoteStream(remoteMediaStream);
    };

    function createOffer() {
        if (!isFunction(options.onOfferSDP)) return;
        logger.log('Peer CreateOffer:', options.offerOptions);
        // peer.createOffer(function (sessionDescription) {
        //     sessionDescription.sdp = serializeSdp(sessionDescription.sdp);
        //     peer.setLocalDescription(sessionDescription);
        //     options.onOfferSDP(sessionDescription);
        // }, onSdpError, options.offerOptions);
        peer.createOffer(options.offerOptions)
            .then(function (sessionDescription) {
                logger.log('Peer CreateOffer success:', sessionDescription);
                sessionDescription.sdp = serializeSdp(sessionDescription.sdp);
                peer.setLocalDescription(sessionDescription);
                options.onOfferSDP(sessionDescription);
            })
            .catch(onSdpError);
    }

    function createAnswer() {
        if (options.type !== "answer") return;
        logger.log('Peer CreateAnswer:', options.offerSDP);
        //options.offerSDP.sdp = addStereo(options.offerSDP.sdp);
        // peer.setRemoteDescription(new window.RTCSessionDescription(options.offerSDP), onSdpSuccess, onSdpError);
        peer.setRemoteDescription(new window.RTCSessionDescription(options.offerSDP))
            .then(onSdpSuccess)
            .catch(onSdpError);
        // peer.createAnswer(function (sessionDescription) {
        //     sessionDescription.sdp = serializeSdp(sessionDescription.sdp);
        //     peer.setLocalDescription(sessionDescription);
        //     if (options.onAnswerSDP) {
        //         options.onAnswerSDP(sessionDescription);
        //     }
        // }, onSdpError);
        peer.createAnswer()
            .then(function (sessionDescription) {
                sessionDescription.sdp = serializeSdp(sessionDescription.sdp);
                peer.setLocalDescription(sessionDescription);
                isFunction(options.onAnswerSDP) && options.onAnswerSDP(sessionDescription);
            })
            .catch(onSdpError);
    }

    // if ((options.onChannelMessage) || !options.onChannelMessage) {
    createOffer();
    createAnswer();
    // }

    function serializeSdp(sdp) {
        return sdp;
    }

    // DataChannel management
    /** @type {RTCDataChannel} */
    let channel;

    function openOffererChannel() {
        if (!options.onChannelMessage) return;

        _openOffererChannel();

        return;
    }

    function _openOffererChannel() {
        const label = options.channel || 'RTCDataChannel';
        logger.log('Peer CreateChannel:', label);
        channel = peer.createDataChannel(label, {
            reliable: false
        });

        setChannelEvents();
    }

    function setChannelEvents() {
        channel.onmessage = function (event) {
            logger.log('Channel Message:', event);
            isFunction(options.onChannelMessage) && options.onChannelMessage(event);
        };
        channel.onopen = function (event) {
            logger.log('Channel Open:', event);
            isFunction(options.onChannelOpened) && options.onChannelOpened(event);
        };
        channel.onclose = function (event) {
            logger.warn('Channel Close:', event);
            isFunction(options.onChannelClosed) && options.onChannelClosed(event);
        };
        channel.onerror = function (event) {
            logger.error('Channel Error:', event);
            isFunction(options.onChannelError) && options.onChannelError(event);
        };
    }

    function onSdpSuccess() {
        logger.log('sdp success.');
    }

    function onSdpError(e) {
        logger.error('sdp error:', e);
        isFunction(options.onChannelError) && options.onChannelError(e);
    }

    return {
        addAnswerSDP: function (config, onSuccess, onError) {
            logger.log('Peer addAnswerSDP:', config);
            // peer.setRemoteDescription(new window.RTCSessionDescription(config), onSuccess ? onSuccess : onSdpSuccess, onError ? onError : onSdpError);
            peer.setRemoteDescription(new window.RTCSessionDescription(config))
                .then(isFunction(onSuccess) ? onSuccess : onSdpSuccess)
                .catch(isFunction(onError) ? onError : onSdpError);
        },
        addIceCandidate: function (config) {
            logger.log('Peer addIceCandidate:', config);
            peer.addIceCandidate(new window.RTCIceCandidate({
                sdpMLineIndex: config.sdpMLineIndex,
                candidate: config.candidate
            }));
        },
        peer: peer,
        channel: channel,
        sendData: function (data) {
            logger.log('Channel send:', data);
            channel && channel.send(data);
        },
        stop: function () {
            logger.log('Peer Stop.');
            if (options.attachStream instanceof MediaStream) {
                stopMediaStream(options.attachStream);
                options.attachStream = null
            }
            peer.close();
        },
        replaceTrack: function (kind, track) {
            peer.getSenders().forEach(sender => {
                if (sender.track.kind === kind) {
                    logger.log('found the sender by ' + kind + ", do replace track.", sender, track);
                    sender.replaceTrack(track);
                }
            });
        }
    };
}

/**
 * 媒体流客户端，用于基于FreeSwitch和WebRTC协议的音视频流的发送和接收
 * @extends Destroyable
*/
class FSRTC extends Destroyable {
    /**
     * @constructor
     * @param {Dialog} dialog
     * @param {object} callbacks 回调通知
     * @param {Function} callbacks.onIceCandidate
     * @param {Function} callbacks.onIceSDP
     * @param {Function} callbacks.onOfferSDP
     * @param {Function} callbacks.onError
     * @param {Function} callbacks.onLocalStream
     * @param {Function} callbacks.onRemoteStream
    */
    constructor(dialog, callbacks) {
        super();
        Check.defined('dialog', dialog);

        this.dialog = dialog;
        this.client = dialog.client;
        this.callbacks = deepMix({
            onIceCandidate: null,
            onIceSDP: null,
            onOfferSDP: null,
            onError: null,
            onLocalStream: null,
            onRemoteStream: null,
        }, callbacks);

        this.micEnabled = this.dialog.deviceParams.useMic !== "none" ? true : false;
        this.cameraEnabled = this.dialog.deviceParams.useCamera !== "none" ? true : false;
        this.voiceEnabled = true;

        this.hasVideo = false;
        this.mediaData = {
            SDP: null,
            profile: {},
            candidateList: []
        };

        this.offerOptions = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
        };

        /** @type {FSRTCPeerConnection} */
        this.peer;
        /** @type {MediaStream} */
        this.localStream;
        /** @type {MediaStream} */
        this.remoteStream;
    }

    /**
     * @param {boolean} value
     */
    set offerToReceiveAudio(value) {
        this.offerOptions.offerToReceiveAudio = value;
    }

    /**
     * @returns {boolean}
     */
    get offerToReceiveAudio() {
        return this.offerOptions.offerToReceiveAudio;
    }

    /**
     * @param {boolean} value
     */
    set offerToReceiveVideo(value) {
        this.offerOptions.offerToReceiveVideo = value;
    }

    /**
     * @returns {boolean}
     */
    get offerToReceiveVideo() {
        return this.offerOptions.offerToReceiveVideo;
    }

    /**
     * 呼叫
     * @returns {void}
     */
    call(params = {}) {
        const self = this;
        self.type = "offer";
        self.offerToReceiveAudio = self.dialog.deviceParams.useSpeaker === "none" ? false : true;
        self.offerToReceiveVideo = self.dialog.wantVideo ? true : false;

        let screen = false;
        if (params.screenShare) { //self.videoConstraints.chromeMediaSource == 'desktop') {
            screen = true;
        }

        function onSuccess(stream) {
            self.localStream = stream;

            if (screen) {
                self.offerOptions.offerToReceiveVideo = false;
                self.offerOptions.offerToReceiveAudio = false;
                self.offerOptions.offerToSendAudio = false;
            }

            self.peer = FSRTCPeerConnection({
                type: self.type,
                attachStream: self.localStream,
                onIceCandidate: function (candidate) {
                    return onIceCandidate(self, candidate);
                },
                onIceSDP: function (sd) {
                    return onIceSDP(self, sd);
                },
                onRemoteStream: screen ? function (stream) { } : function (stream) {
                    return onRemoteStream(self, stream);
                },
                onOfferSDP: function (sd) {
                    return onOfferSDP(self, sd);
                },
                onChannelError: function (e) {
                    return onChannelError(self, e);
                },
                offerOptions: self.offerOptions,
                turnServer: self.client.turnServer,
                iceServers: self.client.iceServers,
            });

            onLocalStreamSuccess(self, stream);
        }

        function onError(e) {
            onLocalStreamError(self, e);
        }

        if (params.mediaStream) {
            onSuccess(params.mediaStream);
            return;
        }

        const constraints = getUserMediaConstraints(self.dialog);
        self.hasVideo = constraints.video === false ? false : true;

        // logger.log("Audio constraints", constraints.audio);
        // logger.log("Video constraints", constraints.video);

        if (constraints.audio || constraints.video) {
            getUserMediaStream({
                constraints, onSuccess, onError,
            });
        } else {
            onSuccess(null);
        }
    }

    /**
     * 应答
     * @param {object} params
     * @returns {void}
     */
    answer(params) {
        const self = this;
        self.type = "answer";
        self.remoteSDP = params.sdp;
        self.offerToReceiveAudio = self.dialog.deviceParams.useSpeaker === "none" ? false : true;
        self.offerToReceiveVideo = self.dialog.wantVideo ? true : false;
        // logger.debug("inbound sdp: ", params.sdp);

        function onSuccess(stream) {
            self.localStream = stream;

            self.peer = FSRTCPeerConnection({
                type: self.type,
                attachStream: self.localStream,
                onIceCandidate: function (candidate) {
                    return onIceCandidate(self, candidate);
                },
                onIceSDP: function (sd) {
                    return onIceSDP(self, sd);
                },
                onRemoteStream: function (stream) {
                    return onRemoteStream(self, stream);
                },
                onChannelError: function (e) {
                    return onChannelError(self, e);
                },
                offerOptions: self.offerOptions,
                offerSDP: {
                    type: "offer",
                    sdp: self.remoteSDP
                },
                turnServer: self.client.turnServer,
                iceServers: self.client.iceServers,
            });

            onLocalStreamSuccess(self, stream);
        }

        function onError(e) {
            onLocalStreamError(self, e);
        }

        if (params.mediaStream) {
            onSuccess(params.mediaStream);
            return;
        }

        const constraints = getUserMediaConstraints(self.dialog);
        self.hasVideo = constraints.video === false ? false : true;

        // logger.log("Audio constraints", constraints.audio);
        // logger.log("Video constraints", constraints.video);

        if (constraints.audio || constraints.video) {
            getUserMediaStream({
                constraints, onSuccess, onError,
            });
        } else {
            onSuccess(null);
        }
    }

    /**
     * sdp应答
     * @param {string} sdp
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {void}
     */
    handleAnswerSDP(sdp, onSuccess, onError) {
        this.peer && this.peer.addAnswerSDP({
            type: "answer",
            sdp: sdp
        }, onSuccess, onError);
    }

    get micMuted() {
        return !this.micEnabled;
    }

    muteMic(what) {
        const self = this;
        if (!self.localStream) {
            return false;
        }

        if (typeof what === 'string') {
            switch (what) {
                case "on":
                case "open":
                    self.micEnabled = true;
                    break;
                case "off":
                case "close":
                    self.micEnabled = false;
                    break;
                case "toggle":
                    self.micEnabled = !self.micEnabled;
                default:
                    break;
            }
        } else {
            self.micEnabled = what ? false : true;
        }

        self.localStream.getAudioTracks().forEach(function (track) {
            track.enabled = self.micEnabled;
        });

        return self.micEnabled;
    }

    get cameraMuted() {
        return !this.cameraEnabled;
    }

    muteCamera(what) {
        const self = this;
        if (!self.localStream) {
            return false;
        }

        if (typeof what === 'string') {
            switch (what) {
                case "on":
                case "open":
                    self.cameraEnabled = true;
                    break;
                case "off":
                case "close":
                    self.cameraEnabled = false;
                    break;
                case "toggle":
                    self.cameraEnabled = !self.cameraEnabled;
                default:
                    break;
            }
        } else {
            self.cameraEnabled = what ? false : true;
        }

        self.localStream.getVideoTracks().forEach(function (track) {
            track.enabled = self.cameraEnabled;
        });

        return self.cameraEnabled;
    }

    get voiceMuted() {
        return !this.voiceEnabled;
    }

    muteVoice(what) {
        const self = this;
        if (!self.remoteStream) {
            return false;
        }

        if (typeof what === 'string') {
            switch (what) {
                case "on":
                case "open":
                    self.voiceEnabled = true;
                    break;
                case "off":
                case "close":
                    self.voiceEnabled = false;
                    break;
                case "toggle":
                    self.voiceEnabled = !self.voiceEnabled;
                default:
                    break;
            }
        } else {
            self.voiceEnabled = what ? false : true;
        }

        self.remoteStream.getAudioTracks().forEach(function (track) {
            track.enabled = self.voiceEnabled;
        });

        return self.voiceEnabled;
    }

    /**
     * 切换本地媒体流
     * @param {MediaStreamConstraints} constraints 获取媒体流约束条件
     * @param {MediaTrackConstraints|undefined} constraints.audio 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
     * @param {MediaTrackConstraints|undefined} constraints.video 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
     * @returns {Promise<boolean>}
     */
    async switchMediaStream(constraints) {
        logger.log('switchMediaStream:', constraints);
        if (!constraints) return;
        // 音视频约束条件都不存在
        if (!constraints.audio && !constraints.video) return;

        const self = this;
        if (!self.localStream) return;

        // 获取原来的约束条件
        const originConstraints = getUserMediaConstraints(self.dialog);
        // 合并约束条件
        let audio = false, video = false;
        if (constraints.audio)
            audio = deepMix({}, originConstraints.audio, constraints.audio);
        if (constraints.video) {
            video = deepMix({}, originConstraints.video, constraints.video);
            // 指定了deviceId，移除facingMode
            if (constraints.video.deviceId) delete video.facingMode;
            // 指定了facingMode，移除deviceId
            else if (constraints.video.facingMode) delete video.deviceId;
        }
        logger.log('merged constraints:', audio, video);

        // 先停止本地媒体流
        if (constraints.audio) {
            // 停止本地音频轨道
            self.localStream.getAudioTracks().forEach(track => {
                track.stop();
                self.localStream.removeTrack(track);
            });
        }
        if (constraints.video) {
            // 停止本地视频轨道
            self.localStream.getVideoTracks().forEach(track => {
                track.stop();
                self.localStream.removeTrack(track);
            });
        }
        // 重新获取媒体流
        const stream = await getUserMediaStream({ constraints: { audio, video } });
        if (!stream) return;
        // 存在音频约束条件时
        if (constraints.audio) {
            const tracks = stream.getAudioTracks();
            // 存在音频轨道时
            if (tracks && tracks.length > 0) {
                const track = tracks[0];
                // 切换远端轨道
                self.peer.replaceTrack('audio', track);
                // 切换本地音频轨道
                self.localStream.addTrack(track);
            }
        }
        // 存在视频约束条件时
        if (constraints.video) {
            const tracks = stream.getVideoTracks();
            // 存在视频轨道时
            if (tracks && tracks.length > 0) {
                const track = tracks[0];
                // 切换远端轨道
                self.peer.replaceTrack('video', track);
                // 切换本地视频轨道
                self.localStream.addTrack(track);
            }
        }
        return true;
    }

    stopPeer() {
        this.peer && this.peer.stop();
    }

    stop() {
        const self = this;

        if (self.localStream) {
            logger.log("Stopping localStream:", self.localStream);
            stopMediaStream(self.localStream);
            self.localStream = null;
        }

        self.stopPeer();
    }

    onDestroy() {
        this.stop();
    }
};

export default FSRTC;
export { FSRTC };
