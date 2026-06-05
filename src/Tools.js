import isAsyncFunction from "@lijuhong1981/jscheck/src/isAsyncFunction.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";

/**
 * @param {string|HTMLMediaElement|Function} tag
 * @param {boolean} createAudio
 * @returns {Promise<HTMLMediaElement>}
 */
async function getMediaElementByTag(tag, createAudio) {
    if (tag instanceof HTMLMediaElement)
        return tag;
    else if (isFunction(tag)) {
        if (isAsyncFunction(tag))
            tag = await tag();
        else
            tag = tag();
        tag = await getMediaElementByTag(tag, createAudio);
    } else if (typeof (tag) === 'string') {
        tag = document.getElementById(tag);
    } else if (createAudio) {
        const audio = document.createElement('audio');
        audio.autoplay = true;
        audio.style.pointerEvents = 'none';
        audio.style.position = 'absolute';
        audio.style.zIndex = '-9999';
        audio.style.width = '0';
        audio.style.height = '0';
        document.body.appendChild(audio);
        tag = audio;
    }
    return tag;
};

/**
 * 获取成员号码数组
 * @param {Array} members
 * @param {string} selfUserNumber
 * @returns {Array<string>}
 */
function getMemberNumbers(members, selfUserNumber) {
    const userIds = [];
    members.forEach(element => {
        let userNumber;
        if (typeof element === 'string')
            userNumber = element;
        else
            userNumber = element.userId;
        //排除掉自己
        if (userNumber !== selfUserNumber)
            userIds.push(userNumber);
    });
    return userIds;
};

/**
 * 获取本地IP地址
 * @returns {Promise<string>}
 */
function getLocalIP() {
    return new Promise((resolve, reject) => {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel(''); // 创建数据通道触发候选收集
        pc.onicecandidate = (e) => {
            if (!e.candidate) {
                reject(new Error("无法获取IP"));
                return;
            }
            if (e.candidate.address)
                resolve(e.candidate.address);
            else {
                const ipRule = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                const ipAddr = ipRule.exec(e.candidate.candidate);
                if (ipAddr && ipAddr.length > 1) {
                    resolve(ipAddr[1]);
                } else {
                    reject(new Error("无法获取IP"));
                }
            }
            pc.close();
        };
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(reject);
    });
};

/**
 * 确保WebRTC配置中包含ICE服务器
 * @param {object} config WebRTC配置对象
 * @param {object} options 选项对象，包含turnServer和iceServers属性
 * @returns {object} WebRTC配置对象
*/
function ensureIceServers(config, options) {
    if (options.turnServer) {
        const default_ice = [{ urls: ['stun:stun.l.google.com:19302'] }];
        typeof options.turnServer === 'object' && default_ice.push(options.turnServer);

        if (Array.isArray(options.iceServers) && options.iceServers.length > 0)
            config.iceServers = options.iceServers;
        else
            config.iceServers = default_ice;
    }
    return config;
};

export {
    ensureIceServers,
    getLocalIP,
    getMediaElementByTag,
    getMemberNumbers,
};

