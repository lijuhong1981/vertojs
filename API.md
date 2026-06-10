## Classes

<dl>
<dt><a href="#ConferenceMemberInfo">ConferenceMemberInfo</a></dt>
<dd><p>组会成员信息</p>
</dd>
<dt><a href="#ConferenceLiveArray">ConferenceLiveArray</a> ⇐ <code>Destroyable</code></dt>
<dd><p>组会实时数组，同步在线组会成员信息，会在Conference创建时同步创建</p>
</dd>
<dt><a href="#Conference">Conference</a> ⇐ <code>Destroyable</code></dt>
<dd><p>组会对象，发起组会呼叫或收到组会呼叫时生成该对象，同时在onConferenceEvent事件回调中传递该对象</p>
</dd>
<dt><a href="#Dialog">Dialog</a> ⇐ <code>Destroyable</code></dt>
<dd><p>会话对象，发起呼叫或收到呼叫时生成该对象，同时在onDialogEvent事件回调中传递该对象</p>
</dd>
<dt><a href="#FSRTC">FSRTC</a> ⇐ <code>Destroyable</code></dt>
<dd><p>媒体流客户端，用于基于FreeSwitch和WebRTC协议的音视频流的发送和接收</p>
</dd>
<dt><a href="#JsonRpcClient">JsonRpcClient</a></dt>
<dd><p>JsonRPC协议客户端，用于JsonRPC协议消息的发送与接受，目前只支持WebSocket连接方式</p>
</dd>
<dt><a href="#EventChannel">EventChannel</a></dt>
<dd><p>事件频道对象，在subscribeChannel函数中生成并返回</p>
</dd>
<dt><a href="#VertoClient">VertoClient</a> ⇐ <code>Destroyable</code></dt>
<dd><p>Verto协议客户端，主要用于与FreeSwitch通信</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#videoInDevices">videoInDevices</a> : <code>Array.&lt;MediaDeviceInfo&gt;</code></dt>
<dd><p>视频输入设备列表</p>
</dd>
<dt><a href="#audioInDevices">audioInDevices</a> : <code>Array.&lt;MediaDeviceInfo&gt;</code></dt>
<dd><p>音频输入设备列表</p>
</dd>
<dt><a href="#audioOutDevices">audioOutDevices</a> : <code>Array.&lt;MediaDeviceInfo&gt;</code></dt>
<dd><p>音频输出设备列表</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#findLine">findLine()</a></dt>
<dd></dd>
<dt><a href="#doCallback">doCallback(self, cbName, ...args)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onIceSDP">onIceSDP(self, sd)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#onOfferSDP">onOfferSDP(self, sd)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#stopMediaStream">stopMediaStream(stream)</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#enumerateMediaDevices">enumerateMediaDevices(callback)</a> ⇒ <code>Promise</code></dt>
<dd><p>枚举本地媒体设备</p>
</dd>
<dt><a href="#getDeviceIdByLabel">getDeviceIdByLabel(label)</a> ⇒ <code>string</code></dt>
<dd><p>根据设备label获取设备id</p>
</dd>
<dt><a href="#getUserMediaConstraints">getUserMediaConstraints(options)</a> ⇒ <code>object</code></dt>
<dd><p>获取媒体约束条件</p>
</dd>
<dt><a href="#getUserMediaStream">getUserMediaStream(options)</a> ⇒ <code>Promise.&lt;MediaStream&gt;</code></dt>
<dd><p>获取本地媒体流</p>
</dd>
<dt><a href="#StopFunction">StopFunction()</a> ⇒ <code>Array.&lt;Blob&gt;</code></dt>
<dd><p>停止方法</p>
</dd>
<dt><a href="#startRecord">startRecord(options)</a> ⇒ <code><a href="#RecordResult">Promise.&lt;RecordResult&gt;</a></code></dt>
<dd><p>录制</p>
</dd>
<dt><a href="#getMediaElementByTag">getMediaElementByTag(tag, createAudio)</a> ⇒ <code>Promise.&lt;HTMLMediaElement&gt;</code></dt>
<dd></dd>
<dt><a href="#getMemberNumbers">getMemberNumbers(members, selfUserNumber)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>获取成员号码数组</p>
</dd>
<dt><a href="#getLocalIP">getLocalIP()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>获取本地IP地址</p>
</dd>
<dt><a href="#ensureIceServers">ensureIceServers(config, options)</a> ⇒ <code>object</code></dt>
<dd><p>确保WebRTC配置中包含ICE服务器</p>
</dd>
<dt><a href="#createClient">createClient(options, callbacks)</a> ⇒ <code><a href="#VertoClient">VertoClient</a></code></dt>
<dd><p>创建VertoClient实例</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#RecordResult">RecordResult</a> : <code>object</code></dt>
<dd><p>录制结果对象</p>
</dd>
<dt><a href="#LoginData">LoginData</a> : <code>object</code></dt>
<dd><p>登录账号配置数据</p>
</dd>
<dt><a href="#DeviceParams">DeviceParams</a> : <code>object</code></dt>
<dd><p>设备配置参数</p>
</dd>
</dl>

<a name="ConferenceMemberInfo"></a>

## ConferenceMemberInfo
组会成员信息

**Kind**: global class  

* [ConferenceMemberInfo](#ConferenceMemberInfo)
    * [new ConferenceMemberInfo(key, data)](#new_ConferenceMemberInfo_new)
    * [.uuid](#ConferenceMemberInfo+uuid) : <code>string</code>
    * [.id](#ConferenceMemberInfo+id) : <code>string</code>
    * [.number](#ConferenceMemberInfo+number) : <code>string</code>
    * [.name](#ConferenceMemberInfo+name) : <code>string</code>
    * [.codec](#ConferenceMemberInfo+codec) : <code>string</code>
    * [.status](#ConferenceMemberInfo+status) : <code>object</code>
    * [.userVariables](#ConferenceMemberInfo+userVariables) : <code>object</code>
    * [.isMicMuted](#ConferenceMemberInfo+isMicMuted) : <code>boolean</code>
    * [.isCameraMuted](#ConferenceMemberInfo+isCameraMuted) : <code>boolean</code>
    * [.isTalking](#ConferenceMemberInfo+isTalking) : <code>boolean</code>
    * [.isVideoFloor](#ConferenceMemberInfo+isVideoFloor) : <code>boolean</code>
    * [.isDeaf](#ConferenceMemberInfo+isDeaf) : <code>boolean</code>

<a name="new_ConferenceMemberInfo_new"></a>

### new ConferenceMemberInfo(key, data)

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| data | <code>Array</code> | 

<a name="ConferenceMemberInfo+uuid"></a>

### conferenceMemberInfo.uuid : <code>string</code>
成员uuid

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
<a name="ConferenceMemberInfo+id"></a>

### conferenceMemberInfo.id : <code>string</code>
成员id

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
<a name="ConferenceMemberInfo+number"></a>

### conferenceMemberInfo.number : <code>string</code>
成员号码

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
<a name="ConferenceMemberInfo+name"></a>

### conferenceMemberInfo.name : <code>string</code>
成员名称

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
<a name="ConferenceMemberInfo+codec"></a>

### conferenceMemberInfo.codec : <code>string</code>
编解码器

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
<a name="ConferenceMemberInfo+status"></a>

### conferenceMemberInfo.status : <code>object</code>
成员状态

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
<a name="ConferenceMemberInfo+userVariables"></a>

### conferenceMemberInfo.userVariables : <code>object</code>
成员其他信息

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
<a name="ConferenceMemberInfo+isMicMuted"></a>

### conferenceMemberInfo.isMicMuted : <code>boolean</code>
麦克风是否已关闭

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
**Read only**: true  
<a name="ConferenceMemberInfo+isCameraMuted"></a>

### conferenceMemberInfo.isCameraMuted : <code>boolean</code>
相机是否已关闭

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
**Read only**: true  
<a name="ConferenceMemberInfo+isTalking"></a>

### conferenceMemberInfo.isTalking : <code>boolean</code>
是否正在说话

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
**Read only**: true  
<a name="ConferenceMemberInfo+isVideoFloor"></a>

### conferenceMemberInfo.isVideoFloor : <code>boolean</code>
是否视频Floor

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
**Read only**: true  
<a name="ConferenceMemberInfo+isDeaf"></a>

### conferenceMemberInfo.isDeaf : <code>boolean</code>
是否已被禁听

**Kind**: instance property of [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)  
**Read only**: true  
<a name="ConferenceLiveArray"></a>

## ConferenceLiveArray ⇐ <code>Destroyable</code>
组会实时数组，同步在线组会成员信息，会在Conference创建时同步创建

**Kind**: global class  
**Extends**: <code>Destroyable</code>  

* [ConferenceLiveArray](#ConferenceLiveArray) ⇐ <code>Destroyable</code>
    * [new ConferenceLiveArray(conference, context, name, config)](#new_ConferenceLiveArray_new)
    * _instance_
        * [.onChange](#ConferenceLiveArray+onChange) : <code>function</code>
        * [.onError](#ConferenceLiveArray+onError) : <code>function</code>
        * [.membersCount](#ConferenceLiveArray+membersCount) ⇒ <code>number</code>
        * [.members()](#ConferenceLiveArray+members) ⇒ [<code>Array.&lt;ConferenceMemberInfo&gt;</code>](#ConferenceMemberInfo)
        * [.getByUuid(uuid)](#ConferenceLiveArray+getByUuid) ⇒ [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)
        * [.sendCommand(command, obj)](#ConferenceLiveArray+sendCommand) ⇒ <code>void</code>
        * [.bootstrap(obj)](#ConferenceLiveArray+bootstrap) ⇒ <code>void</code>
        * [.clear()](#ConferenceLiveArray+clear) ⇒ <code>void</code>
    * _static_
        * [.Action](#ConferenceLiveArray.Action) : [<code>ConferenceLiveArrayAction</code>](#ConferenceLiveArrayAction)

<a name="new_ConferenceLiveArray_new"></a>

### new ConferenceLiveArray(conference, context, name, config)

| Param | Type | Description |
| --- | --- | --- |
| conference | [<code>Conference</code>](#Conference) | 组会对象 |
| context | <code>string</code> | LiveArray上下文，即LiveArray事件频道名称 |
| name | <code>string</code> | LiveArray名称 |
| config | <code>object</code> | 配置项 |
| config.subParams | <code>object</code> |  |

<a name="ConferenceLiveArray+onChange"></a>

### conferenceLiveArray.onChange : <code>function</code>
LiveArray变化通知

**Kind**: instance property of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  
<a name="ConferenceLiveArray+onError"></a>

### conferenceLiveArray.onError : <code>function</code>
LiveArray错误通知

**Kind**: instance property of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  
<a name="ConferenceLiveArray+membersCount"></a>

### conferenceLiveArray.membersCount ⇒ <code>number</code>
获取组会成员数量

**Kind**: instance property of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  
**Read only**: true  
<a name="ConferenceLiveArray+members"></a>

### conferenceLiveArray.members() ⇒ [<code>Array.&lt;ConferenceMemberInfo&gt;</code>](#ConferenceMemberInfo)
获取所有组会成员信息

**Kind**: instance method of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  
<a name="ConferenceLiveArray+getByUuid"></a>

### conferenceLiveArray.getByUuid(uuid) ⇒ [<code>ConferenceMemberInfo</code>](#ConferenceMemberInfo)
根据uuid获取组会成员信息

**Kind**: instance method of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  

| Param | Type |
| --- | --- |
| uuid | <code>string</code> | 

<a name="ConferenceLiveArray+sendCommand"></a>

### conferenceLiveArray.sendCommand(command, obj) ⇒ <code>void</code>
发送liveArray命令

**Kind**: instance method of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | 命令 |
| obj | <code>any</code> | 参数 |

<a name="ConferenceLiveArray+bootstrap"></a>

### conferenceLiveArray.bootstrap(obj) ⇒ <code>void</code>
发送bootstrap命令，LiveArray创建时调用

**Kind**: instance method of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  

| Param | Type |
| --- | --- |
| obj | <code>any</code> | 

<a name="ConferenceLiveArray+clear"></a>

### conferenceLiveArray.clear() ⇒ <code>void</code>
清除

**Kind**: instance method of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  
<a name="ConferenceLiveArray.Action"></a>

### ConferenceLiveArray.Action : [<code>ConferenceLiveArrayAction</code>](#ConferenceLiveArrayAction)
组会成员数组动作

**Kind**: static property of [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)  
**Read only**: true  
<a name="Conference"></a>

## Conference ⇐ <code>Destroyable</code>
组会对象，发起组会呼叫或收到组会呼叫时生成该对象，同时在onConferenceEvent事件回调中传递该对象

**Kind**: global class  
**Extends**: <code>Destroyable</code>  

* [Conference](#Conference) ⇐ <code>Destroyable</code>
    * [new Conference(dialog, params, onConferenceEvent)](#new_Conference_new)
    * _instance_
        * [.state](#Conference+state) : [<code>ConferenceState</code>](#ConferenceState)
        * [.lastState](#Conference+lastState) : [<code>ConferenceState</code>](#ConferenceState)
        * [.liveArray](#Conference+liveArray) : [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)
        * [.isVideo](#Conference+isVideo) ⇒ <code>boolean</code>
        * [.groupNumber](#Conference+groupNumber) ⇒ <code>string</code>
        * [.userNumber](#Conference+userNumber) ⇒ <code>string</code>
        * [.userMemberID](#Conference+userMemberID) ⇒ <code>string</code>
        * [.isModerator](#Conference+isModerator) ⇒ <code>boolean</code>
        * [.sendChat(message, type, onSuccess, onError)](#Conference+sendChat) ⇒ <code>void</code>
        * [.moderatorCommand(command, id, value, onSuccess, onError)](#Conference+moderatorCommand) ⇒ <code>void</code>
        * [.canvasInfo(onSuccess, onError)](#Conference+canvasInfo) ⇒ <code>void</code>
        * [.listVideoLayouts(onSuccess, onError)](#Conference+listVideoLayouts) ⇒ <code>void</code>
        * [.setVideoLayout(layout, canvasID)](#Conference+setVideoLayout) ⇒ <code>void</code>
        * [.play(url)](#Conference+play) ⇒ <code>void</code>
        * [.stopPlay()](#Conference+stopPlay) ⇒ <code>void</code>
        * [.startRecord(dirPath, fileName)](#Conference+startRecord) ⇒ <code>string</code>
        * [.stopRecord()](#Conference+stopRecord) ⇒ <code>void</code>
        * [.deaf(memberID)](#Conference+deaf) ⇒ <code>void</code>
        * [.undeaf(memberID)](#Conference+undeaf) ⇒ <code>void</code>
        * [.muteMic(memberID, what)](#Conference+muteMic) ⇒ <code>void</code>
        * [.toggleMic()](#Conference+toggleMic)
        * [.muteCamera(memberID, what)](#Conference+muteCamera) ⇒ <code>void</code>
        * [.toggleCamera()](#Conference+toggleCamera)
        * [.kick(memberID)](#Conference+kick) ⇒ <code>void</code>
        * [.presenter(memberID)](#Conference+presenter) ⇒ <code>void</code>
        * [.videoFloor(memberID)](#Conference+videoFloor) ⇒ <code>void</code>
        * [.videoBanner(memberID, text)](#Conference+videoBanner) ⇒ <code>void</code>
        * [.resetVideoBanner(memberID)](#Conference+resetVideoBanner) ⇒ <code>void</code>
        * [.transfer(memberID, destination_number)](#Conference+transfer) ⇒ <code>void</code>
        * [.volumeDown(memberID)](#Conference+volumeDown) ⇒ <code>void</code>
        * [.volumeUp(memberID)](#Conference+volumeUp) ⇒ <code>void</code>
        * [.gainDown(memberID)](#Conference+gainDown) ⇒ <code>void</code>
        * [.gainUp(memberID)](#Conference+gainUp) ⇒ <code>void</code>
        * [.close()](#Conference+close) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.hangup(params)](#Conference+hangup) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.destroy()](#Conference+destroy) ⇒ <code>void</code>
    * _static_
        * [.State](#Conference.State) : [<code>ConferenceState</code>](#ConferenceState)

<a name="new_Conference_new"></a>

### new Conference(dialog, params, onConferenceEvent)

| Param | Type | Description |
| --- | --- | --- |
| dialog | [<code>Dialog</code>](#Dialog) | 会话对象 |
| params | <code>object</code> | 参数 |
| params.pvtData | <code>object</code> | FreeSwitch下发的组会数据 |
| onConferenceEvent | <code>function</code> | 组会事件回调通知 |

<a name="Conference+state"></a>

### conference.state : [<code>ConferenceState</code>](#ConferenceState)
当前的会话状态

**Kind**: instance property of [<code>Conference</code>](#Conference)  
<a name="Conference+lastState"></a>

### conference.lastState : [<code>ConferenceState</code>](#ConferenceState)
之前的会话状态

**Kind**: instance property of [<code>Conference</code>](#Conference)  
<a name="Conference+liveArray"></a>

### conference.liveArray : [<code>ConferenceLiveArray</code>](#ConferenceLiveArray)
LiveArray对象

**Kind**: instance property of [<code>Conference</code>](#Conference)  
<a name="Conference+isVideo"></a>

### conference.isVideo ⇒ <code>boolean</code>
是否视频会议

**Kind**: instance property of [<code>Conference</code>](#Conference)  
**Read only**: true  
<a name="Conference+groupNumber"></a>

### conference.groupNumber ⇒ <code>string</code>
组会号码

**Kind**: instance property of [<code>Conference</code>](#Conference)  
**Read only**: true  
<a name="Conference+userNumber"></a>

### conference.userNumber ⇒ <code>string</code>
用户号码

**Kind**: instance property of [<code>Conference</code>](#Conference)  
**Read only**: true  
<a name="Conference+userMemberID"></a>

### conference.userMemberID ⇒ <code>string</code>
用户在组会中的成员id

**Kind**: instance property of [<code>Conference</code>](#Conference)  
**Read only**: true  
<a name="Conference+isModerator"></a>

### conference.isModerator ⇒ <code>boolean</code>
当前用户是否组会主持人

**Kind**: instance property of [<code>Conference</code>](#Conference)  
<a name="Conference+sendChat"></a>

### conference.sendChat(message, type, onSuccess, onError) ⇒ <code>void</code>
发送聊天消息

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | 发送的消息 |
| type | <code>string</code> \| <code>undefined</code> | <code>&quot;chatMessage&quot;</code> | 消息类型 |
| onSuccess | <code>function</code> \| <code>undefined</code> |  |  |
| onError | <code>function</code> \| <code>undefined</code> |  |  |

<a name="Conference+moderatorCommand"></a>

### conference.moderatorCommand(command, id, value, onSuccess, onError) ⇒ <code>void</code>
发送组会主持人命令

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type |
| --- | --- |
| command | <code>string</code> | 
| id | <code>number</code> \| <code>undefined</code> | 
| value | <code>string</code> \| <code>undefined</code> | 
| onSuccess | <code>function</code> \| <code>undefined</code> | 
| onError | <code>function</code> \| <code>undefined</code> | 

<a name="Conference+canvasInfo"></a>

### conference.canvasInfo(onSuccess, onError) ⇒ <code>void</code>
获取当前画布信息

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type |
| --- | --- |
| onSuccess | <code>function</code> \| <code>undefined</code> | 
| onError | <code>function</code> \| <code>undefined</code> | 

<a name="Conference+listVideoLayouts"></a>

### conference.listVideoLayouts(onSuccess, onError) ⇒ <code>void</code>
获取支持的所有视频布局列表

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type |
| --- | --- |
| onSuccess | <code>function</code> \| <code>undefined</code> | 
| onError | <code>function</code> \| <code>undefined</code> | 

<a name="Conference+setVideoLayout"></a>

### conference.setVideoLayout(layout, canvasID) ⇒ <code>void</code>
设置视频布局

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| layout | <code>string</code> | 布局名称，从listVideoLayouts接口中获取 |
| canvasID | <code>string</code> \| <code>undefined</code> |  |

<a name="Conference+play"></a>

### conference.play(url) ⇒ <code>void</code>
在组会中播放一段音视频

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | 音视频url |

<a name="Conference+stopPlay"></a>

### conference.stopPlay() ⇒ <code>void</code>
停止播放音视频

**Kind**: instance method of [<code>Conference</code>](#Conference)  
<a name="Conference+startRecord"></a>

### conference.startRecord(dirPath, fileName) ⇒ <code>string</code>
开始会议录制

**Kind**: instance method of [<code>Conference</code>](#Conference)  
**Returns**: <code>string</code> - 录制的文件全路径  

| Param | Type | Description |
| --- | --- | --- |
| dirPath | <code>string</code> | 录制文件目录路径 |
| fileName | <code>string</code> \| <code>undefined</code> | 文件名，可不填由程序自动生成 |

<a name="Conference+stopRecord"></a>

### conference.stopRecord() ⇒ <code>void</code>
停止会议录制

**Kind**: instance method of [<code>Conference</code>](#Conference)  
<a name="Conference+deaf"></a>

### conference.deaf(memberID) ⇒ <code>void</code>
禁听某位成员

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+undeaf"></a>

### conference.undeaf(memberID) ⇒ <code>void</code>
解除禁听

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+muteMic"></a>

### conference.muteMic(memberID, what) ⇒ <code>void</code>
开启或关闭某位成员麦克风

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| memberID | <code>string</code> |  | 成员id |
| what | <code>string</code> \| <code>boolean</code> \| <code>undefined</code> | <code>&quot;toggle&quot;</code> | 执行何种动作，默认toggle |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| on | <code>string</code> | 开启 |
| open | <code>string</code> | 开启 |
| off | <code>string</code> | 关闭 |
| close | <code>string</code> | 关闭 |
| toggle | <code>string</code> | 切换 |
| true | <code>boolean</code> | 关闭 |
| false | <code>boolean</code> | 开启 |

<a name="Conference+toggleMic"></a>

### conference.toggleMic()
切换某位成员麦克风

**Kind**: instance method of [<code>Conference</code>](#Conference)  
<a name="Conference+muteCamera"></a>

### conference.muteCamera(memberID, what) ⇒ <code>void</code>
开启或关闭某位成员相机

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| memberID | <code>string</code> |  | 成员id |
| what | <code>string</code> \| <code>boolean</code> \| <code>undefined</code> | <code>&quot;toggle&quot;</code> | 执行何种动作，默认toggle |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| on | <code>string</code> | 开启 |
| open | <code>string</code> | 开启 |
| off | <code>string</code> | 关闭 |
| close | <code>string</code> | 关闭 |
| toggle | <code>string</code> | 切换 |
| true | <code>boolean</code> | 关闭 |
| false | <code>boolean</code> | 开启 |

<a name="Conference+toggleCamera"></a>

### conference.toggleCamera()
切换某位成员相机

**Kind**: instance method of [<code>Conference</code>](#Conference)  
<a name="Conference+kick"></a>

### conference.kick(memberID) ⇒ <code>void</code>
踢出某位成员

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+presenter"></a>

### conference.presenter(memberID) ⇒ <code>void</code>
指定某位成员为主讲人

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+videoFloor"></a>

### conference.videoFloor(memberID) ⇒ <code>void</code>
设置某位成员视频为floor

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+videoBanner"></a>

### conference.videoBanner(memberID, text) ⇒ <code>void</code>
设置某位成员视频banner

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |
| text | <code>string</code> | banner文本内容 |

<a name="Conference+resetVideoBanner"></a>

### conference.resetVideoBanner(memberID) ⇒ <code>void</code>
重置某位成员视频banner

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+transfer"></a>

### conference.transfer(memberID, destination_number) ⇒ <code>void</code>
转呼某位成员

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |
| destination_number | <code>string</code> | 目标号码 |

<a name="Conference+volumeDown"></a>

### conference.volumeDown(memberID) ⇒ <code>void</code>
减小某位成员的输出音量

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+volumeUp"></a>

### conference.volumeUp(memberID) ⇒ <code>void</code>
增大某位成员的输出音量

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+gainDown"></a>

### conference.gainDown(memberID) ⇒ <code>void</code>
减小某位成员的麦克风音量

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+gainUp"></a>

### conference.gainUp(memberID) ⇒ <code>void</code>
增大某位成员的麦克风音量

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| memberID | <code>string</code> | 成员id |

<a name="Conference+close"></a>

### conference.close() ⇒ <code>Promise.&lt;boolean&gt;</code>
结束组会，只有主持人可以结束组会

**Kind**: instance method of [<code>Conference</code>](#Conference)  
<a name="Conference+hangup"></a>

### conference.hangup(params) ⇒ <code>Promise.&lt;boolean&gt;</code>
挂断

**Kind**: instance method of [<code>Conference</code>](#Conference)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> \| <code>undefined</code> | 参数 |
| params.cause | <code>string</code> \| <code>undefined</code> | 原因文本 |
| params.causeCode | <code>number</code> \| <code>undefined</code> | 原因编码 |

<a name="Conference+destroy"></a>

### conference.destroy() ⇒ <code>void</code>
销毁

**Kind**: instance method of [<code>Conference</code>](#Conference)  
<a name="Conference.State"></a>

### Conference.State : [<code>ConferenceState</code>](#ConferenceState)
组会状态

**Kind**: static property of [<code>Conference</code>](#Conference)  
**Read only**: true  
<a name="Dialog"></a>

## Dialog ⇐ <code>Destroyable</code>
会话对象，发起呼叫或收到呼叫时生成该对象，同时在onDialogEvent事件回调中传递该对象

**Kind**: global class  
**Extends**: <code>Destroyable</code>  

* [Dialog](#Dialog) ⇐ <code>Destroyable</code>
    * [new Dialog(direction, client, params, onDialogEvent)](#new_Dialog_new)
    * [.direction](#Dialog+direction) : [<code>Direction</code>](#Direction)
    * [.state](#Dialog+state) : [<code>DialogState</code>](#DialogState)
    * [.userNumber](#Dialog+userNumber) ⇒ <code>string</code>
    * [.userName](#Dialog+userName) ⇒ <code>string</code>
    * [.destinationNumber](#Dialog+destinationNumber) ⇒ <code>string</code>
    * [.callID](#Dialog+callID) ⇒ <code>string</code>
    * [.deviceParams](#Dialog+deviceParams) ⇒ [<code>DeviceParams</code>](#DeviceParams)
    * [.wantVideo](#Dialog+wantVideo) ⇒ <code>boolean</code>
    * [.hasLocalVideo](#Dialog+hasLocalVideo) ⇒ <code>boolean</code>
    * [.hasRemoteVideo](#Dialog+hasRemoteVideo) ⇒ <code>boolean</code>
    * [.callerName](#Dialog+callerName) ⇒ <code>string</code>
    * [.callerNumber](#Dialog+callerNumber) ⇒ <code>string</code>
    * [.calleeName](#Dialog+calleeName) ⇒ <code>string</code>
    * [.calleeNumber](#Dialog+calleeNumber) ⇒ <code>string</code>
    * [.remoteNumber](#Dialog+remoteNumber) ⇒ <code>string</code>
    * [.remoteName](#Dialog+remoteName) ⇒ <code>string</code>
    * [.isActive](#Dialog+isActive) ⇒ <code>boolean</code>
    * [.isHolding](#Dialog+isHolding) ⇒ <code>boolean</code>
    * [.micMuted](#Dialog+micMuted) ⇒ <code>boolean</code>
    * [.cameraMuted](#Dialog+cameraMuted) ⇒ <code>boolean</code>
    * [.voiceMuted](#Dialog+voiceMuted) ⇒ <code>boolean</code>
    * [.setSpeakerDevice(sinkId, onSuccess, onError)](#Dialog+setSpeakerDevice) ⇒ <code>Promise</code>
    * [.call()](#Dialog+call) ⇒ <code>Promise</code>
    * [.answer(params)](#Dialog+answer) ⇒ <code>Promise</code>
    * [.hangup(params)](#Dialog+hangup) ⇒ <code>Promise</code>
    * [.reject()](#Dialog+reject) ⇒ <code>Promise</code>
    * [.ring()](#Dialog+ring) ⇒ <code>Promise</code>
    * [.transfer(destination, params)](#Dialog+transfer) ⇒ <code>void</code>
    * [.hold(params)](#Dialog+hold) ⇒ <code>void</code>
    * [.unhold(params)](#Dialog+unhold) ⇒ <code>void</code>
    * [.toggleHold(params)](#Dialog+toggleHold) ⇒ <code>void</code>
    * [.sendTextMessage(message)](#Dialog+sendTextMessage) ⇒ <code>void</code>
    * [.muteMic(what)](#Dialog+muteMic) ⇒ <code>boolean</code>
    * [.toggleMic()](#Dialog+toggleMic) ⇒ <code>boolean</code>
    * [.muteCamera(what)](#Dialog+muteCamera) ⇒ <code>boolean</code>
    * [.toggleCamera()](#Dialog+toggleCamera) ⇒ <code>boolean</code>
    * [.muteVoice(what)](#Dialog+muteVoice) ⇒ <code>boolean</code>
    * [.toggleVoice()](#Dialog+toggleVoice) ⇒ <code>boolean</code>
    * [.switchMediaStream(constraints)](#Dialog+switchMediaStream) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.switchCamera(videoConstraints)](#Dialog+switchCamera) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.switchMic(audioConstraints)](#Dialog+switchMic) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.switchCameraByDeviceId(deviceId)](#Dialog+switchCameraByDeviceId) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.switchMicByDeviceId(deviceId)](#Dialog+switchMicByDeviceId) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.switchCameraByLabel(deviceLabel)](#Dialog+switchCameraByLabel) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.switchMicByLabel(deviceLabel)](#Dialog+switchMicByLabel) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.switchCameraByFacingMode(facingMode)](#Dialog+switchCameraByFacingMode) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.destroy()](#Dialog+destroy) ⇒ <code>void</code>

<a name="new_Dialog_new"></a>

### new Dialog(direction, client, params, onDialogEvent)

| Param | Type | Description |
| --- | --- | --- |
| direction | [<code>Direction</code>](#Direction) | 呼叫方向，呼出还是呼入 |
| client | [<code>VertoClient</code>](#VertoClient) | 通讯客户端对象 |
| params | <code>object</code> \| <code>undefined</code> | 配置项 |
| params.wantVideo | <code>boolean</code> \| <code>undefined</code> | 呼叫或应答是否启用视频 |
| params.hasRemoteVideo | <code>boolean</code> \| <code>undefined</code> | 被叫时远程媒体流是否包含视频 |
| params.remoteTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> \| <code>undefined</code> | 播放远程音视频的dom标签 |
| params.localTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> \| <code>undefined</code> | 播放本地音视频的dom标签 |
| params.overtime | <code>number</code> \| <code>undefined</code> | 等待接听超时时间，单位毫秒 |
| params.deviceParams | [<code>DeviceParams</code>](#DeviceParams) \| <code>undefined</code> | 设备相关参数 |
| onDialogEvent | <code>function</code> \| <code>undefined</code> | Dialog事件回调通知 |

<a name="Dialog+direction"></a>

### dialog.direction : [<code>Direction</code>](#Direction)
呼叫方向

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+state"></a>

### dialog.state : [<code>DialogState</code>](#DialogState)
当前的会话状态

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+userNumber"></a>

### dialog.userNumber ⇒ <code>string</code>
用户号码

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+userName"></a>

### dialog.userName ⇒ <code>string</code>
用户名称

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+destinationNumber"></a>

### dialog.destinationNumber ⇒ <code>string</code>
呼叫目标号码，direction === Direction.outbound 时存在

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+callID"></a>

### dialog.callID ⇒ <code>string</code>
会话id

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+deviceParams"></a>

### dialog.deviceParams ⇒ [<code>DeviceParams</code>](#DeviceParams)
获取设备相关参数

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+wantVideo"></a>

### dialog.wantVideo ⇒ <code>boolean</code>
是否视频呼叫

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+hasLocalVideo"></a>

### dialog.hasLocalVideo ⇒ <code>boolean</code>
本地媒体流是否包含视频

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+hasRemoteVideo"></a>

### dialog.hasRemoteVideo ⇒ <code>boolean</code>
远程媒体流是否包含视频

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+callerName"></a>

### dialog.callerName ⇒ <code>string</code>
呼叫者名称

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+callerNumber"></a>

### dialog.callerNumber ⇒ <code>string</code>
呼叫者号码

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+calleeName"></a>

### dialog.calleeName ⇒ <code>string</code>
被叫者名称

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+calleeNumber"></a>

### dialog.calleeNumber ⇒ <code>string</code>
被叫者号码

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+remoteNumber"></a>

### dialog.remoteNumber ⇒ <code>string</code>
会话远程用户号码

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+remoteName"></a>

### dialog.remoteName ⇒ <code>string</code>
会话远程用户名称

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
**Read only**: true  
<a name="Dialog+isActive"></a>

### dialog.isActive ⇒ <code>boolean</code>
是否通话中

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+isHolding"></a>

### dialog.isHolding ⇒ <code>boolean</code>
是否通话保持中

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+micMuted"></a>

### dialog.micMuted ⇒ <code>boolean</code>
麦克风是否已关闭

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+cameraMuted"></a>

### dialog.cameraMuted ⇒ <code>boolean</code>
相机是否已关闭

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+voiceMuted"></a>

### dialog.voiceMuted ⇒ <code>boolean</code>
通话音是否已关闭

**Kind**: instance property of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+setSpeakerDevice"></a>

### dialog.setSpeakerDevice(sinkId, onSuccess, onError) ⇒ <code>Promise</code>
设置扬声器

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| sinkId | <code>string</code> | The [MediaDeviceInfo.deviceId](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo/deviceId) of the audio output device |
| onSuccess | <code>function</code> |  |
| onError | <code>function</code> |  |

<a name="Dialog+call"></a>

### dialog.call() ⇒ <code>Promise</code>
发起会话

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+answer"></a>

### dialog.answer(params) ⇒ <code>Promise</code>
会话应答

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> \| <code>undefined</code> | 应答参数 |
| params.wantVideo | <code>boolean</code> \| <code>undefined</code> | 是否启用视频，默认由呼叫方决定 |
| params.remoteTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> \| <code>undefined</code> | 播放远程音视频的dom标签 |
| params.localTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> \| <code>undefined</code> | 播放本地音视频的dom标签 |
| params.deviceParams | [<code>DeviceParams</code>](#DeviceParams) | 设备相关参数 |

<a name="Dialog+hangup"></a>

### dialog.hangup(params) ⇒ <code>Promise</code>
挂断

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 参数 |
| params.cause | <code>string</code> \| <code>undefined</code> | 原因文本 |
| params.causeCode | <code>number</code> \| <code>undefined</code> | 原因编码 |

<a name="Dialog+reject"></a>

### dialog.reject() ⇒ <code>Promise</code>
拒绝接听

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+ring"></a>

### dialog.ring() ⇒ <code>Promise</code>
响铃

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
<a name="Dialog+transfer"></a>

### dialog.transfer(destination, params) ⇒ <code>void</code>
通话转移

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type |
| --- | --- |
| destination | <code>string</code> | 
| params | <code>object</code> | 

<a name="Dialog+hold"></a>

### dialog.hold(params) ⇒ <code>void</code>
通话保持

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type |
| --- | --- |
| params | <code>object</code> | 

<a name="Dialog+unhold"></a>

### dialog.unhold(params) ⇒ <code>void</code>
取消通话保持

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type |
| --- | --- |
| params | <code>object</code> | 

<a name="Dialog+toggleHold"></a>

### dialog.toggleHold(params) ⇒ <code>void</code>
切换通话保持状态

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type |
| --- | --- |
| params | <code>object</code> | 

<a name="Dialog+sendTextMessage"></a>

### dialog.sendTextMessage(message) ⇒ <code>void</code>
发送文本消息

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | 消息内容 |

<a name="Dialog+muteMic"></a>

### dialog.muteMic(what) ⇒ <code>boolean</code>
设置麦克风开启或关闭

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>boolean</code> - 麦克风是否开启  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| what | <code>string</code> \| <code>boolean</code> \| <code>undefined</code> | <code>&quot;toggle&quot;</code> | 执行何种动作，默认toggle |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| on | <code>string</code> | 开启 |
| open | <code>string</code> | 开启 |
| off | <code>string</code> | 关闭 |
| close | <code>string</code> | 关闭 |
| toggle | <code>string</code> | 切换 |
| true | <code>boolean</code> | 关闭 |
| false | <code>boolean</code> | 开启 |

<a name="Dialog+toggleMic"></a>

### dialog.toggleMic() ⇒ <code>boolean</code>
切换麦克风开启或关闭

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>boolean</code> - 麦克风是否开启  
<a name="Dialog+muteCamera"></a>

### dialog.muteCamera(what) ⇒ <code>boolean</code>
设置相机开启或关闭

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>boolean</code> - 相机是否开启  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| what | <code>string</code> \| <code>boolean</code> \| <code>undefined</code> | <code>&quot;toggle&quot;</code> | 执行何种动作，默认toggle |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| on | <code>string</code> | 开启 |
| open | <code>string</code> | 开启 |
| off | <code>string</code> | 关闭 |
| close | <code>string</code> | 关闭 |
| toggle | <code>string</code> | 切换 |
| true | <code>boolean</code> | 关闭 |
| false | <code>boolean</code> | 开启 |

<a name="Dialog+toggleCamera"></a>

### dialog.toggleCamera() ⇒ <code>boolean</code>
切换相机开启或关闭

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>boolean</code> - 相机是否开启  
<a name="Dialog+muteVoice"></a>

### dialog.muteVoice(what) ⇒ <code>boolean</code>
设置通话音开启或关闭

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>boolean</code> - 通话音是否开启  

| Param | Type | Description |
| --- | --- | --- |
| what | <code>string</code> \| <code>boolean</code> | 执行何种动作 |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| on | <code>string</code> | 开启 |
| off | <code>string</code> | 关闭 |
| toggle | <code>string</code> | 切换 |
| true | <code>boolean</code> | 关闭 |
| false | <code>boolean</code> | 开启 |

<a name="Dialog+toggleVoice"></a>

### dialog.toggleVoice() ⇒ <code>boolean</code>
切换通话音开启或关闭

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>boolean</code> - 通话音是否开启  
<a name="Dialog+switchMediaStream"></a>

### dialog.switchMediaStream(constraints) ⇒ <code>Promise.&lt;boolean&gt;</code>
切换本地媒体流

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| constraints | <code>MediaStreamConstraints</code> | 获取媒体流约束条件 |
| constraints.audio | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks) |
| constraints.video | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks) |

<a name="Dialog+switchCamera"></a>

### dialog.switchCamera(videoConstraints) ⇒ <code>Promise.&lt;boolean&gt;</code>
切换摄像头

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| videoConstraints | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks) |

<a name="Dialog+switchMic"></a>

### dialog.switchMic(audioConstraints) ⇒ <code>Promise.&lt;boolean&gt;</code>
切换麦克风

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| audioConstraints | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks) |

<a name="Dialog+switchCameraByDeviceId"></a>

### dialog.switchCameraByDeviceId(deviceId) ⇒ <code>Promise.&lt;boolean&gt;</code>
根据传入的deviceId切换摄像头

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type |
| --- | --- |
| deviceId | <code>string</code> | 

<a name="Dialog+switchMicByDeviceId"></a>

### dialog.switchMicByDeviceId(deviceId) ⇒ <code>Promise.&lt;boolean&gt;</code>
根据传入的deviceId切换麦克风

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type |
| --- | --- |
| deviceId | <code>string</code> | 

<a name="Dialog+switchCameraByLabel"></a>

### dialog.switchCameraByLabel(deviceLabel) ⇒ <code>Promise.&lt;boolean&gt;</code>
根据传入的deviceLabel切换摄像头

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type |
| --- | --- |
| deviceLabel | <code>string</code> | 

<a name="Dialog+switchMicByLabel"></a>

### dialog.switchMicByLabel(deviceLabel) ⇒ <code>Promise.&lt;boolean&gt;</code>
根据传入的deviceLabel切换麦克风

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type |
| --- | --- |
| deviceLabel | <code>string</code> | 

<a name="Dialog+switchCameraByFacingMode"></a>

### dialog.switchCameraByFacingMode(facingMode) ⇒ <code>Promise.&lt;boolean&gt;</code>
切换移动端前后摄像头

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| facingMode | <code>string</code> | <code>&quot;user&quot;</code> | user-前摄像头，environment-后摄像头，不传则默认用user |

<a name="Dialog+destroy"></a>

### dialog.destroy() ⇒ <code>void</code>
销毁会话

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
<a name="FSRTC"></a>

## FSRTC ⇐ <code>Destroyable</code>
媒体流客户端，用于基于FreeSwitch和WebRTC协议的音视频流的发送和接收

**Kind**: global class  
**Extends**: <code>Destroyable</code>  

* [FSRTC](#FSRTC) ⇐ <code>Destroyable</code>
    * [new FSRTC(dialog, callbacks)](#new_FSRTC_new)
    * [.peer](#FSRTC+peer) : <code>FSRTCPeerConnection</code>
    * [.localStream](#FSRTC+localStream) : <code>MediaStream</code>
    * [.remoteStream](#FSRTC+remoteStream) : <code>MediaStream</code>
    * [.offerToReceiveAudio](#FSRTC+offerToReceiveAudio)
    * [.offerToReceiveAudio](#FSRTC+offerToReceiveAudio) ⇒ <code>boolean</code>
    * [.offerToReceiveVideo](#FSRTC+offerToReceiveVideo)
    * [.offerToReceiveVideo](#FSRTC+offerToReceiveVideo) ⇒ <code>boolean</code>
    * [.call()](#FSRTC+call) ⇒ <code>void</code>
    * [.answer(params)](#FSRTC+answer) ⇒ <code>void</code>
    * [.handleAnswerSDP(sdp, onSuccess, onError)](#FSRTC+handleAnswerSDP) ⇒ <code>void</code>
    * [.switchMediaStream(constraints)](#FSRTC+switchMediaStream) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="new_FSRTC_new"></a>

### new FSRTC(dialog, callbacks)

| Param | Type | Description |
| --- | --- | --- |
| dialog | [<code>Dialog</code>](#Dialog) |  |
| callbacks | <code>object</code> | 回调通知 |
| callbacks.onIceCandidate | <code>function</code> |  |
| callbacks.onIceSDP | <code>function</code> |  |
| callbacks.onOfferSDP | <code>function</code> |  |
| callbacks.onError | <code>function</code> |  |
| callbacks.onLocalStream | <code>function</code> |  |
| callbacks.onRemoteStream | <code>function</code> |  |

<a name="FSRTC+peer"></a>

### fsrtC.peer : <code>FSRTCPeerConnection</code>
**Kind**: instance property of [<code>FSRTC</code>](#FSRTC)  
<a name="FSRTC+localStream"></a>

### fsrtC.localStream : <code>MediaStream</code>
**Kind**: instance property of [<code>FSRTC</code>](#FSRTC)  
<a name="FSRTC+remoteStream"></a>

### fsrtC.remoteStream : <code>MediaStream</code>
**Kind**: instance property of [<code>FSRTC</code>](#FSRTC)  
<a name="FSRTC+offerToReceiveAudio"></a>

### fsrtC.offerToReceiveAudio
**Kind**: instance property of [<code>FSRTC</code>](#FSRTC)  

| Param | Type |
| --- | --- |
| value | <code>boolean</code> | 

<a name="FSRTC+offerToReceiveAudio"></a>

### fsrtC.offerToReceiveAudio ⇒ <code>boolean</code>
**Kind**: instance property of [<code>FSRTC</code>](#FSRTC)  
<a name="FSRTC+offerToReceiveVideo"></a>

### fsrtC.offerToReceiveVideo
**Kind**: instance property of [<code>FSRTC</code>](#FSRTC)  

| Param | Type |
| --- | --- |
| value | <code>boolean</code> | 

<a name="FSRTC+offerToReceiveVideo"></a>

### fsrtC.offerToReceiveVideo ⇒ <code>boolean</code>
**Kind**: instance property of [<code>FSRTC</code>](#FSRTC)  
<a name="FSRTC+call"></a>

### fsrtC.call() ⇒ <code>void</code>
呼叫

**Kind**: instance method of [<code>FSRTC</code>](#FSRTC)  
<a name="FSRTC+answer"></a>

### fsrtC.answer(params) ⇒ <code>void</code>
应答

**Kind**: instance method of [<code>FSRTC</code>](#FSRTC)  

| Param | Type |
| --- | --- |
| params | <code>object</code> | 

<a name="FSRTC+handleAnswerSDP"></a>

### fsrtC.handleAnswerSDP(sdp, onSuccess, onError) ⇒ <code>void</code>
sdp应答

**Kind**: instance method of [<code>FSRTC</code>](#FSRTC)  

| Param | Type |
| --- | --- |
| sdp | <code>string</code> | 
| onSuccess | <code>function</code> | 
| onError | <code>function</code> | 

<a name="FSRTC+switchMediaStream"></a>

### fsrtC.switchMediaStream(constraints) ⇒ <code>Promise.&lt;boolean&gt;</code>
切换本地媒体流

**Kind**: instance method of [<code>FSRTC</code>](#FSRTC)  

| Param | Type | Description |
| --- | --- | --- |
| constraints | <code>MediaStreamConstraints</code> | 获取媒体流约束条件 |
| constraints.audio | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks) |
| constraints.video | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks) |

<a name="JsonRpcClient"></a>

## JsonRpcClient
JsonRPC协议客户端，用于JsonRPC协议消息的发送与接受，目前只支持WebSocket连接方式

**Kind**: global class  

* [JsonRpcClient](#JsonRpcClient)
    * [new JsonRpcClient(options, callbacks)](#new_JsonRpcClient_new)
    * [._socket](#JsonRpcClient+_socket) : <code>WebSocket</code>
    * [.socketState](#JsonRpcClient+socketState) ⇒ <code>number</code>
    * [.socketConnecting](#JsonRpcClient+socketConnecting) ⇒ <code>boolean</code>
    * [.socketReady](#JsonRpcClient+socketReady) ⇒ <code>boolean</code>
    * [.authorized](#JsonRpcClient+authorized) ⇒ <code>boolean</code>
    * [.getSocket()](#JsonRpcClient+getSocket) ⇒ <code>WebSocket</code>
    * [.speedTest(bytesNum, callback)](#JsonRpcClient+speedTest) ⇒ <code>void</code>
    * [.call(method, params, onSuccess, onError)](#JsonRpcClient+call) ⇒ <code>void</code>
    * [.notify(method, params)](#JsonRpcClient+notify) ⇒ <code>void</code>
    * [.login(onSuccess, onError)](#JsonRpcClient+login) ⇒ <code>void</code>
    * [.loginAsync()](#JsonRpcClient+loginAsync) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.logout()](#JsonRpcClient+logout) ⇒ <code>void</code>

<a name="new_JsonRpcClient_new"></a>

### new JsonRpcClient(options, callbacks)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 配置项 |
| options.url | <code>string</code> \| <code>URL</code> | WebSocket地址 |
| options.backupUrl | <code>string</code> \| <code>URL</code> \| <code>Array.&lt;(string\|URL)&gt;</code> | 备用地址，可以是单个地址，也可以是地址数组，地址会在连接失败时轮流切换使用 |
| options.autoRetry | <code>boolean</code> | 自动重试，默认true |
| options.maxRetryCount | <code>number</code> | 最大重试次数，设置0或负数表示不限制重试次数 |
| options.switchUrlConut | <code>number</code> | 重试多少次后切换url |
| options.retryInterval | <code>number</code> | 重试间隔时间，单位毫米，默认1000 |
| options.sessid | <code>string</code> | session id |
| options.loginData | [<code>LoginData</code>](#LoginData) | 登录相关参数 |
| callbacks | <code>object</code> | 回调通知 |
| callbacks.handleMessage | <code>function</code> | 处理FreeSwitch的消息句柄 |
| callbacks.onSocketEvent | <code>function</code> | Socket事件回调 |
| callbacks.onLogin | <code>function</code> | 登录事件回调 |
| callbacks.onLogout | <code>function</code> | 登出事件回调 |

<a name="JsonRpcClient+_socket"></a>

### jsonRpcClient.\_socket : <code>WebSocket</code>
**Kind**: instance property of [<code>JsonRpcClient</code>](#JsonRpcClient)  
<a name="JsonRpcClient+socketState"></a>

### jsonRpcClient.socketState ⇒ <code>number</code>
Returns the state of the WebSocket object's connection. It can have the values described below.[MDN Reference](https://developer.mozilla.org/docs/Web/API/WebSocket/readyState)

**Kind**: instance property of [<code>JsonRpcClient</code>](#JsonRpcClient)  
<a name="JsonRpcClient+socketConnecting"></a>

### jsonRpcClient.socketConnecting ⇒ <code>boolean</code>
socket是否处于链接中

**Kind**: instance property of [<code>JsonRpcClient</code>](#JsonRpcClient)  
<a name="JsonRpcClient+socketReady"></a>

### jsonRpcClient.socketReady ⇒ <code>boolean</code>
socket是否已准备好

**Kind**: instance property of [<code>JsonRpcClient</code>](#JsonRpcClient)  
<a name="JsonRpcClient+authorized"></a>

### jsonRpcClient.authorized ⇒ <code>boolean</code>
是否已登录

**Kind**: instance property of [<code>JsonRpcClient</code>](#JsonRpcClient)  
<a name="JsonRpcClient+getSocket"></a>

### jsonRpcClient.getSocket() ⇒ <code>WebSocket</code>
获取WebSocket对象

**Kind**: instance method of [<code>JsonRpcClient</code>](#JsonRpcClient)  
<a name="JsonRpcClient+speedTest"></a>

### jsonRpcClient.speedTest(bytesNum, callback) ⇒ <code>void</code>
网络测速

**Kind**: instance method of [<code>JsonRpcClient</code>](#JsonRpcClient)  

| Param | Type |
| --- | --- |
| bytesNum | <code>number</code> | 
| callback | <code>function</code> | 

<a name="JsonRpcClient+call"></a>

### jsonRpcClient.call(method, params, onSuccess, onError) ⇒ <code>void</code>
Sends a command to the JSON-RPC server

**Kind**: instance method of [<code>JsonRpcClient</code>](#JsonRpcClient)  

| Param | Type |
| --- | --- |
| method | <code>string</code> | 
| params | <code>object</code> | 
| onSuccess | <code>function</code> | 
| onError | <code>function</code> | 

<a name="JsonRpcClient+notify"></a>

### jsonRpcClient.notify(method, params) ⇒ <code>void</code>
Notify sends a command to the JSON-RPC server that won't need a response.

**Kind**: instance method of [<code>JsonRpcClient</code>](#JsonRpcClient)  

| Param | Type |
| --- | --- |
| method | <code>string</code> | 
| params | <code>void</code> | 

<a name="JsonRpcClient+login"></a>

### jsonRpcClient.login(onSuccess, onError) ⇒ <code>void</code>
登录

**Kind**: instance method of [<code>JsonRpcClient</code>](#JsonRpcClient)  

| Param | Type |
| --- | --- |
| onSuccess | <code>function</code> | 
| onError | <code>function</code> | 

<a name="JsonRpcClient+loginAsync"></a>

### jsonRpcClient.loginAsync() ⇒ <code>Promise.&lt;Object&gt;</code>
异步登录

**Kind**: instance method of [<code>JsonRpcClient</code>](#JsonRpcClient)  
<a name="JsonRpcClient+logout"></a>

### jsonRpcClient.logout() ⇒ <code>void</code>
登出

**Kind**: instance method of [<code>JsonRpcClient</code>](#JsonRpcClient)  
<a name="EventChannel"></a>

## EventChannel
事件频道对象，在subscribeChannel函数中生成并返回

**Kind**: global class  
<a name="new_EventChannel_new"></a>

### new EventChannel(eventChannel, handler, subParams)

| Param | Type | Description |
| --- | --- | --- |
| eventChannel | <code>string</code> | 事件频道名称 |
| handler | <code>function</code> | 事件频道消息处理句柄 |
| subParams | <code>object</code> | 其他参数 |

<a name="VertoClient"></a>

## VertoClient ⇐ <code>Destroyable</code>
Verto协议客户端，主要用于与FreeSwitch通信

**Kind**: global class  
**Extends**: <code>Destroyable</code>  

* [VertoClient](#VertoClient) ⇐ <code>Destroyable</code>
    * [new VertoClient(options, callbacks)](#new_VertoClient_new)
    * [.enableLog](#VertoClient+enableLog) : <code>boolean</code>
    * [.localParams](#VertoClient+localParams) ⇒ <code>object</code>
    * [.turnServer](#VertoClient+turnServer)
    * [.turnServer](#VertoClient+turnServer) ⇒ <code>boolean</code> \| <code>RTCIceServer</code>
    * [.iceServers](#VertoClient+iceServers)
    * [.iceServers](#VertoClient+iceServers) ⇒ <code>Array.&lt;RTCIceServer&gt;</code> \| <code>null</code>
    * [.loginData](#VertoClient+loginData)
    * [.loginData](#VertoClient+loginData) ⇒ [<code>LoginData</code>](#LoginData)
    * [.deviceParams](#VertoClient+deviceParams) ⇒ <code>void</code>
    * [.deviceParams](#VertoClient+deviceParams) ⇒ [<code>DeviceParams</code>](#DeviceParams)
    * [.audioConstraints](#VertoClient+audioConstraints) ⇒ <code>void</code>
    * [.audioConstraints](#VertoClient+audioConstraints) ⇒ <code>MediaTrackConstraints</code>
    * [.videoConstraints](#VertoClient+videoConstraints) ⇒ <code>void</code>
    * [.videoConstraints](#VertoClient+videoConstraints) ⇒ <code>MediaTrackConstraints</code>
    * [.login(onSuccess, onError)](#VertoClient+login) ⇒ <code>void</code>
    * [.logout()](#VertoClient+logout) ⇒ <code>void</code>
    * [.hangup(params)](#VertoClient+hangup) ⇒ <code>void</code>
    * [.newCall(params)](#VertoClient+newCall) ⇒ [<code>Dialog</code>](#Dialog)
    * [.sendTextMessage(destinationNumber, message)](#VertoClient+sendTextMessage) ⇒ <code>void</code>
    * [.getDialogs()](#VertoClient+getDialogs) ⇒ [<code>Array.&lt;Dialog&gt;</code>](#Dialog)
    * [.getActiveDialogs()](#VertoClient+getActiveDialogs) ⇒ [<code>Array.&lt;Dialog&gt;</code>](#Dialog)
    * [.hasDialog()](#VertoClient+hasDialog) ⇒ <code>boolean</code>
    * [.hasActiveDialog()](#VertoClient+hasActiveDialog) ⇒ <code>boolean</code>

<a name="new_VertoClient_new"></a>

### new VertoClient(options, callbacks)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 配置项 |
| options.fsConfig | <code>object</code> | FreeSwitch服务相关配置参数 |
| options.fsConfig.url | <code>string</code> | FreeSwitch服务器wss地址 |
| options.fsConfig.backupUrl | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 备用wss地址 |
| options.fsConfig.maxRetryCount | <code>number</code> | 最大重试次数，设置0或负数表示不限制重试次数 |
| options.fsConfig.switchUrlConut | <code>number</code> | 重试多少次后切换url |
| options.fsConfig.retryInterval | <code>number</code> | 重试间隔时间，单位毫米 |
| options.fsConfig.turnServer | <code>boolean</code> \| <code>RTCIceServer</code> | WebRTC服务是否启用turnServer |
| options.fsConfig.iceServers | <code>Array.&lt;RTCIceServer&gt;</code> \| <code>undefined</code> | WebRTC服务iceServer列表 |
| options.localParams | <code>object</code> | 本地相关配置参数 |
| options.localParams.remoteTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> | 播放远程音视频的dom标签 |
| options.localParams.localTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> | 播放本地音视频的dom标签 |
| options.localParams.ringerTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> | 播放本地铃声的dom标签 |
| options.localParams.ringFile | <code>string</code> | 响铃文件地址 |
| options.localParams.overtime | <code>number</code> \| <code>undefined</code> | 等待接听超时时间，单位毫秒，默认30000 |
| options.loginData | [<code>LoginData</code>](#LoginData) | 登录账号配置数据 |
| options.deviceParams | [<code>DeviceParams</code>](#DeviceParams) | 设备相关配置参数 |
| options.enableLog | <code>boolean</code> | 是否启用日志输出，默认true |
| callbacks | <code>object</code> | 回调通知 |
| callbacks.onClientEvent | <code>function</code> | 客户端事件回调 |
| callbacks.onDialogEvent | <code>function</code> | 会话事件回调 |
| callbacks.onConferenceEvent | <code>function</code> | 组会事件回调 |

<a name="VertoClient+enableLog"></a>

### vertoClient.enableLog : <code>boolean</code>
是否启用日志输出

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
**Default**: <code>true</code>  
<a name="VertoClient+localParams"></a>

### vertoClient.localParams ⇒ <code>object</code>
本地配置参数

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
**Read only**: true  
<a name="VertoClient+turnServer"></a>

### vertoClient.turnServer
设置turnServer

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  

| Param | Type |
| --- | --- |
| value | <code>boolean</code> \| <code>RTCIceServer</code> | 

<a name="VertoClient+turnServer"></a>

### vertoClient.turnServer ⇒ <code>boolean</code> \| <code>RTCIceServer</code>
获取turnServer

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+iceServers"></a>

### vertoClient.iceServers
设置iceServers

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  

| Param | Type |
| --- | --- |
| value | <code>Array.&lt;RTCIceServer&gt;</code> \| <code>null</code> | 

<a name="VertoClient+iceServers"></a>

### vertoClient.iceServers ⇒ <code>Array.&lt;RTCIceServer&gt;</code> \| <code>null</code>
获取iceServers

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+loginData"></a>

### vertoClient.loginData
设置登录账号配置数据

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  

| Param | Type |
| --- | --- |
| params | [<code>LoginData</code>](#LoginData) | 

<a name="VertoClient+loginData"></a>

### vertoClient.loginData ⇒ [<code>LoginData</code>](#LoginData)
获取登录账号配置数据

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+deviceParams"></a>

### vertoClient.deviceParams ⇒ <code>void</code>
设置设备相关参数

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  

| Param | Type |
| --- | --- |
| params | [<code>DeviceParams</code>](#DeviceParams) | 

<a name="VertoClient+deviceParams"></a>

### vertoClient.deviceParams ⇒ [<code>DeviceParams</code>](#DeviceParams)
获取设备相关参数

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+audioConstraints"></a>

### vertoClient.audioConstraints ⇒ <code>void</code>
设置捕获音频流条件

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
**See**: [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)  

| Param | Type |
| --- | --- |
| constraints | <code>MediaTrackConstraints</code> | 

<a name="VertoClient+audioConstraints"></a>

### vertoClient.audioConstraints ⇒ <code>MediaTrackConstraints</code>
获取音频流条件

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+videoConstraints"></a>

### vertoClient.videoConstraints ⇒ <code>void</code>
设置捕获视频流条件

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
**See**: [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)  

| Param | Type |
| --- | --- |
| constraints | <code>MediaTrackConstraints</code> | 

<a name="VertoClient+videoConstraints"></a>

### vertoClient.videoConstraints ⇒ <code>MediaTrackConstraints</code>
获取视频流条件

**Kind**: instance property of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+login"></a>

### vertoClient.login(onSuccess, onError) ⇒ <code>void</code>
登录

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  

| Param | Type |
| --- | --- |
| onSuccess | <code>function</code> | 
| onError | <code>function</code> | 

<a name="VertoClient+logout"></a>

### vertoClient.logout() ⇒ <code>void</code>
登出

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+hangup"></a>

### vertoClient.hangup(params) ⇒ <code>void</code>
挂断会话

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | 参数 |
| params.callID | <code>string</code> \| <code>undefined</code> | 呼叫id，不传表示挂断所有的会话 |
| params.cause | <code>string</code> \| <code>undefined</code> | 原因文本 |
| params.causeCode | <code>number</code> \| <code>undefined</code> | 原因编码 |

<a name="VertoClient+newCall"></a>

### vertoClient.newCall(params) ⇒ [<code>Dialog</code>](#Dialog)
发起一个新呼叫

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> \| <code>string</code> | 呼叫参数或呼叫号码 |
| params.destinationNumber | <code>string</code> | 呼叫号码，必填项 |
| params.wantVideo | <code>boolean</code> \| <code>undefined</code> | 是否使用视频呼叫，默认false |
| params.remoteTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> \| <code>undefined</code> | 播放远程音视频的dom标签 |
| params.localTag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> \| <code>undefined</code> | 播放本地音视频的dom标签 |
| params.overtime | <code>number</code> \| <code>undefined</code> | 等待接听超时时间，单位毫秒 |
| params.deviceParams | [<code>DeviceParams</code>](#DeviceParams) \| <code>undefined</code> | 设备相关参数 |

<a name="VertoClient+sendTextMessage"></a>

### vertoClient.sendTextMessage(destinationNumber, message) ⇒ <code>void</code>
发送文本消息

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  

| Param | Type | Description |
| --- | --- | --- |
| destinationNumber | <code>string</code> | 目标号码 |
| message | <code>string</code> | 消息内容 |

<a name="VertoClient+getDialogs"></a>

### vertoClient.getDialogs() ⇒ [<code>Array.&lt;Dialog&gt;</code>](#Dialog)
获取当前的会话列表

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+getActiveDialogs"></a>

### vertoClient.getActiveDialogs() ⇒ [<code>Array.&lt;Dialog&gt;</code>](#Dialog)
获取当前正在通话的会话列表

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+hasDialog"></a>

### vertoClient.hasDialog() ⇒ <code>boolean</code>
是否存在会话

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  
<a name="VertoClient+hasActiveDialog"></a>

### vertoClient.hasActiveDialog() ⇒ <code>boolean</code>
是否存在正在通话的会话

**Kind**: instance method of [<code>VertoClient</code>](#VertoClient)  
<a name="ConferenceState"></a>

## ConferenceState : <code>enum</code>
组会状态

**Kind**: global enum  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| new | <code>string</code> | 新建 |
| join | <code>string</code> | 加入 |
| hangup | <code>string</code> | 挂断 |
| destroy | <code>string</code> | 销毁 |

<a name="ConferenceLiveArrayAction"></a>

## ConferenceLiveArrayAction : <code>enum</code>
组会实时数组动作

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| init | <code>string</code> | 数组初始化，注意，此时不会生成成员数据 |
| bootObj | <code>string</code> | 引导数组数据，此时会生成成员数据 |
| add | <code>string</code> | 新增成员 |
| modify | <code>string</code> | 成员数据有修改，比如状态变化等 |
| del | <code>string</code> | 移除成员 |
| clear | <code>string</code> | 清除所有成员数据 |
| reorder | <code>string</code> | 数组重排序 |
| error | <code>string</code> | 数组出错 |

<a name="Direction"></a>

## Direction : <code>enum</code>
会话方向

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| inbound | <code>string</code> | 呼入 |
| outbound | <code>string</code> | 呼出 |

<a name="DialogState"></a>

## DialogState : <code>enum</code>
会话状态

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| new | <code>string</code> | 新建会话 |
| readying | <code>string</code> | 会话准备中，获取本地媒体流，建立RTCPeerConnection |
| inviting | <code>string</code> | 发送会话邀请请求 |
| trying | <code>string</code> | 发送会话邀请成功，FreeSwitch尝试呼叫 |
| waiting | <code>string</code> | 呼叫成功，对方已响铃，获取到FreeSwitch下发的早期流媒体，等待对方应答 |
| ringing | <code>string</code> | 响铃中 |
| answering | <code>string</code> | 发送会话接听请求 |
| attaching | <code>string</code> | 发送会话恢复请求 |
| active | <code>string</code> | 会话已建立，通话中 |
| holding | <code>string</code> | 会话保持中 |
| hangup | <code>string</code> | 挂断会话 |
| destroy | <code>string</code> | 销毁会话 |

<a name="EventType"></a>

## EventType : <code>enum</code>
事件类型枚举

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| loginSuccess | <code>string</code> | 登录成功事件 |
| loginError | <code>string</code> | 登录出错事件 |
| logout | <code>string</code> | 登出事件 |
| stateChange | <code>string</code> | 状态变化事件 |
| success | <code>string</code> | 成功事件 |
| error | <code>string</code> | 错误事件 |
| ready | <code>string</code> | 准备完成事件 |
| eventChannel | <code>string</code> | 频道事件 |
| liveArray | <code>string</code> | 活动数组事件 |
| chat | <code>string</code> | 聊天事件 |
| info | <code>string</code> | 信息事件 |
| display | <code>string</code> | 会话展示事件 |
| localStream | <code>string</code> | 本地媒体流事件 |
| remoteStream | <code>string</code> | 远程媒体流事件 |
| action | <code>string</code> | 动作事件 |
| message | <code>string</code> | 消息事件 |

<a name="VertoMethod"></a>

## VertoMethod : <code>enum</code>
Verto指令枚举

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| invite | <code>string</code> | 邀请 |
| answer | <code>string</code> | 应答 |
| attach | <code>string</code> | 吸附 |
| bye | <code>string</code> | 再见 |
| modify | <code>string</code> | 修改 |
| info | <code>string</code> | 信息 |
| broadcast | <code>string</code> | 广播 |
| media | <code>string</code> | 媒体 |
| display | <code>string</code> | 展示 |
| subscribe | <code>string</code> | 订阅 |
| unsubscribe | <code>string</code> | 取消订阅 |
| punt | <code>string</code> | 踢出 |
| event | <code>string</code> | 事件 |
| clientReady | <code>string</code> | 客户端准备完成 |
| ping | <code>string</code> | 网络探测 |

<a name="videoInDevices"></a>

## videoInDevices : <code>Array.&lt;MediaDeviceInfo&gt;</code>
视频输入设备列表

**Kind**: global constant  
<a name="audioInDevices"></a>

## audioInDevices : <code>Array.&lt;MediaDeviceInfo&gt;</code>
音频输入设备列表

**Kind**: global constant  
<a name="audioOutDevices"></a>

## audioOutDevices : <code>Array.&lt;MediaDeviceInfo&gt;</code>
音频输出设备列表

**Kind**: global constant  
<a name="findLine"></a>

## findLine()
**Kind**: global function  
**Import**: Dialog from "./Dialog.js";  
<a name="doCallback"></a>

## doCallback(self, cbName, ...args) ⇒ <code>void</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| self | [<code>FSRTC</code>](#FSRTC) | 
| cbName | <code>string</code> | 
| ...args | <code>any</code> | 

<a name="onIceSDP"></a>

## onIceSDP(self, sd) ⇒ <code>void</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| self | [<code>FSRTC</code>](#FSRTC) | 
| sd | <code>RTCSessionDescription</code> | 

<a name="onOfferSDP"></a>

## onOfferSDP(self, sd) ⇒ <code>void</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| self | [<code>FSRTC</code>](#FSRTC) | 
| sd | <code>RTCSessionDescription</code> | 

<a name="stopMediaStream"></a>

## stopMediaStream(stream) ⇒ <code>void</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| stream | <code>MediaStream</code> | 

<a name="enumerateMediaDevices"></a>

## enumerateMediaDevices(callback) ⇒ <code>Promise</code>
枚举本地媒体设备

**Kind**: global function  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="enumerateMediaDevices..gotDevices"></a>

### enumerateMediaDevices~gotDevices(devices) ⇒ <code>object</code>
**Kind**: inner method of [<code>enumerateMediaDevices</code>](#enumerateMediaDevices)  

| Param | Type |
| --- | --- |
| devices | <code>Array.&lt;MediaDeviceInfo&gt;</code> | 

<a name="getDeviceIdByLabel"></a>

## getDeviceIdByLabel(label) ⇒ <code>string</code>
根据设备label获取设备id

**Kind**: global function  

| Param | Type |
| --- | --- |
| label | <code>string</code> | 

<a name="getUserMediaConstraints"></a>

## getUserMediaConstraints(options) ⇒ <code>object</code>
获取媒体约束条件

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | <code>object</code> \| <code>undefined</code> | 
| options.deviceParams | <code>object</code> \| <code>undefined</code> | 
| options.wantVideo | <code>boolean</code> \| <code>undefined</code> | 

<a name="getUserMediaStream"></a>

## getUserMediaStream(options) ⇒ <code>Promise.&lt;MediaStream&gt;</code>
获取本地媒体流

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> \| <code>undefined</code> |  |
| options.constraints | <code>MediaStreamConstraints</code> \| <code>undefined</code> |  |
| options.constraints.audio | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks) |
| options.constraints.video | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks) |
| options.onSuccess | <code>function</code> \| <code>undefined</code> |  |
| option.onError | <code>function</code> \| <code>undefined</code> |  |

<a name="StopFunction"></a>

## StopFunction() ⇒ <code>Array.&lt;Blob&gt;</code>
停止方法

**Kind**: global function  
<a name="startRecord"></a>

## startRecord(options) ⇒ [<code>Promise.&lt;RecordResult&gt;</code>](#RecordResult)
录制

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.audio | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks) |
| options.video | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks) |
| options.mimeType | <code>string</code> \| <code>undefined</code> | 媒体类型，@see [MediaRecorder#mimeType](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder#mimetype) |
| options.bitsPerSecond | <code>number</code> \| <code>undefined</code> | 比特率，@see [MediaRecorder#bitspersecond](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder#bitspersecond) |
| options.timeslice | <code>number</code> \| <code>undefined</code> | 要记录到每个Blob中的毫秒数，@see [MediaRecorder#start](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#timeslice) |
| options.onSuccess | <code>function</code> \| <code>undefined</code> |  |
| option.onError | <code>function</code> \| <code>undefined</code> |  |
| option.onDataAvailable | <code>function</code> \| <code>undefined</code> |  |

<a name="getMediaElementByTag"></a>

## getMediaElementByTag(tag, createAudio) ⇒ <code>Promise.&lt;HTMLMediaElement&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| tag | <code>string</code> \| <code>HTMLMediaElement</code> \| <code>function</code> | 
| createAudio | <code>boolean</code> | 

<a name="getMemberNumbers"></a>

## getMemberNumbers(members, selfUserNumber) ⇒ <code>Array.&lt;string&gt;</code>
获取成员号码数组

**Kind**: global function  

| Param | Type |
| --- | --- |
| members | <code>Array</code> | 
| selfUserNumber | <code>string</code> | 

<a name="getLocalIP"></a>

## getLocalIP() ⇒ <code>Promise.&lt;string&gt;</code>
获取本地IP地址

**Kind**: global function  
<a name="ensureIceServers"></a>

## ensureIceServers(config, options) ⇒ <code>object</code>
确保WebRTC配置中包含ICE服务器

**Kind**: global function  
**Returns**: <code>object</code> - WebRTC配置对象  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | WebRTC配置对象 |
| options | <code>object</code> | 选项对象，包含turnServer和iceServers属性 |

<a name="createClient"></a>

## createClient(options, callbacks) ⇒ [<code>VertoClient</code>](#VertoClient)
创建VertoClient实例

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 配置项，@see VertoClient.constructor |
| callbacks | <code>object</code> | 回调通知，@see VertoClient.constructor |

<a name="RecordResult"></a>

## RecordResult : <code>object</code>
录制结果对象

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| stream | <code>MediaStream</code> | 
| recorder | <code>MediaRecorder</code> | 
| stop | [<code>StopFunction</code>](#StopFunction) | 

<a name="LoginData"></a>

## LoginData : <code>object</code>
登录账号配置数据

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | 登录账号 |
| password | <code>string</code> | 登录密码 |
| loginParams | <code>object</code> \| <code>undefined</code> | 其他登录参数 |
| userVariables | <code>object</code> \| <code>undefined</code> | 用户其他参数，比如nickName、email、phone等 |

<a name="DeviceParams"></a>

## DeviceParams : <code>object</code>
设备配置参数

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| useCamera | <code>string</code> \| <code>undefined</code> | 使用的摄像头设备id，默认default表示使用系统默认摄像头，设置为none表示不使用摄像头 |
| useCameraLabel | <code>string</code> \| <code>undefined</code> | 使用的摄像头设备label，设置后会覆盖useCamera参数 |
| useMic | <code>string</code> \| <code>undefined</code> | 使用的麦克风设备id，默认default表示使用系统默认麦克风，设置为none表示不使用麦克风 |
| useMicLabel | <code>string</code> \| <code>undefined</code> | 使用的麦克风设备label，设置后会覆盖useMic参数 |
| useSpeaker | <code>string</code> \| <code>undefined</code> | 使用的扬声器设备id，默认default表示使用系统默认扬声器，设置为none表示不使用扬声器 |
| useSpeakerLabel | <code>string</code> \| <code>undefined</code> | 使用的扬声器设备label，设置后会覆盖useSpeaker参数 |
| audioConstraints | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks) |
| videoConstraints | <code>MediaTrackConstraints</code> \| <code>undefined</code> | 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks) |

