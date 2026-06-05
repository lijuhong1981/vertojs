/**
 * 事件类型枚举
 * @enum {string} EventType
 * @property {string} loginSuccess 登录成功事件
 * @property {string} loginError 登录出错事件
 * @property {string} logout 登出事件
 * @property {string} stateChange 状态变化事件
 * @property {string} success 成功事件
 * @property {string} error 错误事件
 * @property {string} ready 准备完成事件
 * @property {string} eventChannel 频道事件
 * @property {string} liveArray 活动数组事件
 * @property {string} chat 聊天事件
 * @property {string} info 信息事件
 * @property {string} display 会话展示事件
 * @property {string} localStream 本地媒体流事件
 * @property {string} remoteStream 远程媒体流事件
 * @property {string} action 动作事件
 * @property {string} pttJoinGroup 加入PTT群组事件
 * @property {string} pttLeaveGroup 离开PTT群组事件
 * @property {string} pttRequestSpeak PTT群组申请话权事件
 * @property {string} pttReleaseSpeak PTT群组释放话权事件
 * @property {string} pttSpeakerChanged PTT群组发言人改变事件
 * @property {string} message 消息事件
 * @property {string} udpMessage UDP消息事件
 * @property {string} rtpMessage RTP消息事件
 * @property {string} eastcomMessage 东信固定台消息事件
 * @readonly
*/
const EventType = Object.freeze({
    loginSuccess: 'loginSuccess',
    loginError: 'loginError',
    logout: 'logout',
    stateChange: 'stateChange',
    success: 'success',
    error: 'error',
    ready: 'ready',
    eventChannel: 'eventChannel',
    liveArray: 'liveArray',
    chat: 'chat',
    info: 'info',
    display: 'display',
    localStream: 'localStream',
    remoteStream: 'remoteStream',
    action: 'action',
    pttJoinGroup: 'pttJoinGroup',
    pttLeaveGroup: 'pttLeaveGroup',
    pttRequestSpeak: 'pttRequestSpeak',
    pttReleaseSpeak: 'pttReleaseSpeak',
    pttSpeakerChanged: 'pttSpeakerChanged',
    message: 'message',
    udpMessage: 'udpMessage',
    rtpMessage: 'rtpMessage',
    eastcomMessage: 'eastcomMessage',
});

/**
 * Verto指令枚举
 * @enum {string} VertoMethod
 * @property {string} invite 邀请
 * @property {string} answer 应答
 * @property {string} attach 吸附
 * @property {string} bye 再见
 * @property {string} modify 修改
 * @property {string} info 信息
 * @property {string} broadcast 广播
 * @property {string} media 媒体
 * @property {string} display 展示
 * @property {string} subscribe 订阅
 * @property {string} unsubscribe 取消订阅
 * @property {string} punt 踢出
 * @property {string} event 事件
 * @property {string} clientReady 客户端准备完成
 * @property {string} ping 网络探测
 * @readonly
*/
const VertoMethod = Object.freeze({
    invite: 'verto.invite',
    answer: 'verto.answer',
    attach: 'verto.attach',
    bye: 'verto.bye',
    modify: 'verto.modify',
    info: 'verto.info',
    broadcast: 'verto.broadcast',
    media: 'verto.media',
    display: 'verto.display',
    subscribe: 'verto.subscribe',
    unsubscribe: 'verto.unsubscribe',
    punt: 'verto.punt',
    event: 'verto.event',
    clientReady: 'verto.clientReady',
    ping: 'verto.ping',
});

export { EventType, VertoMethod };