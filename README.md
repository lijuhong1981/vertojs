# vertojs

基于FreeSwitch的Verto协议与浏览器WebRTC技术开发的js库，用于开发基于Web页面的ip通信。

## 安装

```bash
npm install @lijuhong1981/vertojs
```

## 使用

```js
import * as VertoJS from "@lijuhong1981/vertojs";
...
// 检测媒体设备
const devices = await VertoJS.enumerateMediaDevices();
// 创建verto客户端
const client = VertoJS.createClient({
    fsConfig: {
        url: wssUrl, //freeswitch wss地址
        turnServer: false, //是否启用turnServer
    },
    localParams: {
        remoteTag: getRemoteTag,//播放远程音视频所使用的媒体标签，未指定则会自动创建一个audio标签
        localTag: getLocalTag,//播放本地音视频如相机所使用的媒体标签，不指定则不显示本地音视频
        ringerTag: getRingerTag,//响铃所使用的媒体标签，未指定则会自动创建一个audio标签
        ringFile: "sounds/bell_ring2.mp3",//响铃声音文件地址，未指定则无法响铃
    },
    enableLog: serverParams.enableLog,//是否启用日志
}, {
    //登录事件通知
    onLoginEvent: function (event) {
        console.log('onLoginEvent:', event);
    },
    //客户端事件通知
    onClientEvent: function (event) {
        console.log('onClientEvent:', event);
    },
    //会话事件通知
    onDialogEvent: function (event) {
        console.log('onDialogEvent:', event);
    },
    //组会事件通知
    onConferenceEvent: function (event) {
        if (event.action !== VertoJS.Conference.LiveArrayAction.modify)
            console.log('onConferenceEvent:', event);
    }
});
```

## [API文档](./API.md)
