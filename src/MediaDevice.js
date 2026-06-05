import isDefined from "@lijuhong1981/jscheck/src/isDefined";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import deepMix from "@lijuhong1981/jslib/src/deepMix.js";
import HashArray from "@lijuhong1981/jslib/src/HashArray.js";
import * as logger from "@lijuhong1981/jslib/src/logger.js";

/**
 * @param {MediaStream} stream
 * @returns {void}
 */
function stopMediaStream(stream) {
    stream && stream.getTracks().forEach(function (track) { track.stop(); });
}

const devicesHash = new HashArray();
/**
 * 视频输入设备列表
 * @type {Array<MediaDeviceInfo>}
*/
const videoInDevices = [];
/**
 * 音频输入设备列表
 * @type {Array<MediaDeviceInfo>}
*/
const audioInDevices = [];
/**
 * 音频输出设备列表
 * @type {Array<MediaDeviceInfo>}
*/
const audioOutDevices = [];

/**
 * 枚举本地媒体设备
 * @param {Function} callback
 * @returns {Promise}
 */
async function enumerateDevices(callback) {
    logger.info("enumerate devices start.");
    devicesHash.clear();
    audioInDevices.length = 0;
    audioOutDevices.length = 0;
    videoInDevices.length = 0;
    let video_count = 0, audio_count = 0;

    /**
     * @param {Array<MediaDeviceInfo>} devices
     * @returns {object}
     */
    function gotDevices(devices) {
        // Handles being called several times to update labels. Preserve values.
        for (let i = 0, len = devices.length; i < len; i++) {
            const deviceInfo = devices[i];
            // logger.log(deviceInfo);

            let label = "";
            if (deviceInfo.kind === 'audioinput') {
                label = deviceInfo.label || 'microphone ' + (audioInDevices.length + 1);
                const device = {
                    label,
                    id: deviceInfo.deviceId,
                    kind: deviceInfo.kind,
                    groupId: deviceInfo.groupId,
                };
                audioInDevices.push(device);
                devicesHash.set(label, device);
            } else if (deviceInfo.kind === 'audiooutput') {
                label = deviceInfo.label || 'speaker ' + (audioOutDevices.length + 1);
                const device = {
                    label,
                    id: deviceInfo.deviceId,
                    kind: deviceInfo.kind,
                    groupId: deviceInfo.groupId,
                };
                audioOutDevices.push(device);
                devicesHash.set(label, device);
            } else if (deviceInfo.kind === 'videoinput') {
                label = deviceInfo.label || 'camera ' + (videoInDevices.length + 1);
                const device = {
                    label,
                    id: deviceInfo.deviceId,
                    kind: deviceInfo.kind,
                    groupId: deviceInfo.groupId,
                };
                videoInDevices.push(device);
                devicesHash.set(label, device);
            } else {
                logger.log('Some other kind of source/device: ', deviceInfo);
            }
        }

        logger.info("Audio In Devices", audioInDevices);
        logger.info("Audio Out Devices", audioOutDevices);
        logger.info("Video In Devices", videoInDevices);

        const result = { audioInDevices, audioOutDevices, videoInDevices }
        isFunction(callback) && callback(result);
        return result;
    }

    function handleError(error) {
        logger.error('enumerate devices error: ', error);
        isFunction(callback) && callback(false, error);
    }

    try {
        let devices = await navigator.mediaDevices.enumerateDevices();
        for (let i = 0, len = devices.length; i < len; i++) {
            if (devices[i].kind === 'audioinput') {
                audio_count++;
            } else if (devices[i].kind === 'videoinput') {
                video_count++;
            }
        }
        const has_audio = audio_count > 0 ? true : false;
        const has_video = video_count > 0 ? true : false;
        if (has_audio || has_video) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: has_audio, video: has_video });
            stopMediaStream(stream);
            devices = await navigator.mediaDevices.enumerateDevices();
        }
        return gotDevices(devices);
    } catch (error) {
        handleError(error);
        throw error;
    }
};

/**
 * 根据设备label获取设备id
 * @param {string} label
 * @returns {string}
 */
function getDeviceIdByLabel(label) {
    const device = devicesHash.get(label);
    if (device) {
        return device.id;
    } else {
        logger.warn('Not found device by ' + label);
    }
};

/**
 * 获取媒体约束条件
 * @param {object|undefined} options
 * @param {object|undefined} options.deviceParams
 * @param {boolean|undefined} options.wantVideo
 * @returns {object}
 */
function getUserMediaConstraints(options = {}) {
    const deviceParams = options.deviceParams || {};
    let audio, video;

    if (deviceParams.useMic === 'none' || audioInDevices.length === 0) {
        audio = false;
    } else {
        audio = deepMix({}, deviceParams.audioConstraints);
        if (deviceParams.useMicLabel)
            deviceParams.useMic = getDeviceIdByLabel(deviceParams.useMicLabel) || 'default';
        if (deviceParams.useMic && deviceParams.useMic !== 'default')
            audio.deviceId = deviceParams.useMic;
    }

    if (!options.wantVideo || deviceParams.useCamera === 'none' || videoInDevices.length === 0) {
        video = false;
    } else {
        video = deepMix({}, deviceParams.videoConstraints);
        if (deviceParams.useCameraLabel)
            deviceParams.useCamera = getDeviceIdByLabel(deviceParams.useCameraLabel) || 'default';
        if (deviceParams.useCamera && deviceParams.useCamera !== 'default')
            video.deviceId = deviceParams.useCamera;
    }
    const result = { audio, video };
    logger.log('getUserMediaConstraints:', result);
    return result;
};

/**
 * 获取本地媒体流
 * @param {object|undefined} options
 * @param {MediaStreamConstraints|undefined} options.constraints
 * @param {MediaTrackConstraints|undefined} options.constraints.audio 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
 * @param {MediaTrackConstraints|undefined} options.constraints.video 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
 * @param {Function|undefined} options.onSuccess
 * @param {Function|undefined} option.onError
 * @returns {Promise<MediaStream>}
 */
async function getUserMediaStream(options = {}) {
    logger.log('getUserMediaStream start:', options);
    const constraints = options.constraints || {
        audio: audioInDevices.length > 0 ? true : false,
        video: videoInDevices.length > 0 ? true : false,
    }

    try {
        logger.log('getUserMediaStream constraints:', constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        logger.info('getUserMediaStream success:', stream);
        isFunction(options.onSuccess) && options.onSuccess(stream);
        return stream;
    } catch (error) {
        logger.error('getUserMediaStream error:', error);
        isFunction(options.onError) && options.onError(error);
        throw error;
    }
};

// 判断是否为音频MIME类型
function isAudioMimeType(mimeType) {
    return mimeType.startsWith('audio/') || mimeType === 'default';
}

// 检查MIME类型是否被浏览器支持
function isMimeTypeSupported(mimeType) {
    if (mimeType === 'default') return true;
    return MediaRecorder.isTypeSupported(mimeType);
}

/**
 * 停止方法
 * @returns {Array<Blob>}
 */
function StopFunction() { }
/**
 * 录制结果对象
 * @typedef {object} RecordResult
 * @property {MediaStream} stream 
 * @property {MediaRecorder} recorder
 * @property {StopFunction} stop
*/
/**
 * 录制
 * @param {object} options
 * @param {MediaTrackConstraints|undefined} options.audio 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
 * @param {MediaTrackConstraints|undefined} options.video 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
 * @param {string|undefined} options.mimeType 媒体类型，@see [MediaRecorder#mimeType](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder#mimetype)
 * @param {number|undefined} options.bitsPerSecond 比特率，@see [MediaRecorder#bitspersecond](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder#bitspersecond)
 * @param {number|undefined} options.timeslice 要记录到每个Blob中的毫秒数，@see [MediaRecorder#start](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#timeslice)
 * @param {Function|undefined} options.onSuccess
 * @param {Function|undefined} option.onError
 * @param {Function|undefined} option.onDataAvailable
 * @returns {Promise<RecordResult>}
 */
async function startRecord(options = {}) {
    try {
        const mimeType = options.mimeType || 'default';
        const isAudioOnly = isAudioMimeType(mimeType);
        // 设置媒体约束
        const constraints = {
            audio: options.audio || true,
            video: isAudioOnly ? false : options.video,
        };
        logger.log('getUserMediaStream constraints:', constraints);
        // 获取用户媒体流
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        logger.info('getUserMediaStream success:', stream);

        // 设置MediaRecorder选项
        const recorderOptions = {};
        if (mimeType !== 'default' && isMimeTypeSupported(mimeType)) {
            recorderOptions.mimeType = mimeType;
        } else {
            recorderOptions.mimeType = isAudioOnly ? 'audio/webm' : 'video/webm';
        }
        // 设置比特率
        options.bitsPerSecond && (recorderOptions.bitsPerSecond = options.bitsPerSecond);
        // 创建MediaRecorder实例
        const recorder = new MediaRecorder(stream, recorderOptions);
        // 存储录制的数据块
        const recordChunks = [];
        // 设置数据可用时的回调
        recorder.ondataavailable = function (event) {
            if (event.data && event.data.size > 0) {
                console.log("ondataavailable:", event.data);
                recordChunks.push(event.data);
                isFunction(options.onDataAvailable) && options.onDataAvailable(event.data);
            }
        }
        recorder.start(options.timeslice);

        const result = {
            stream, recorder,
            stop: function () {
                recorder.stop();
                stopMediaStream(stream);
                return recordChunks;
            }
        };
        isFunction(options.onSuccess) && options.onSuccess(result);
        return result;
    } catch (error) {
        logger.error('startRecord error:', error);
        isFunction(options.onError) && options.onError(error);
        throw error;
    }
}

export {
    audioInDevices,
    audioOutDevices,
    enumerateDevices,
    getDeviceIdByLabel,
    getUserMediaConstraints,
    getUserMediaStream,
    startRecord,
    stopMediaStream,
    videoInDevices
};

