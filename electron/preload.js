const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // 监听主进程的消息并暴露给渲染进程
    onExitClick: (callback) => {
        ipcRenderer.on('exit-click', (event, message) => {
            callback(message);  // 将消息传递给渲染进程的回调函数
        });
    },

    //打开串口
    openSerialPort: (com) => ipcRenderer.send('serial-open-port', com),

    //发送串口消息
    sendSerialPortMessage: (msg) => ipcRenderer.send('serial-send-message', msg),

    //弹出electron提示const { title, msg } = obj;
    clientDialog: (obj) => ipcRenderer.send('client-dialog', obj),

    // 最小化窗口
    minimizeWindow: () => ipcRenderer.send('minimize-window'),

    // 最大化窗口
    maximizeWindow: () => ipcRenderer.send('maximize-window'),

    // 打开调试工具
    openDevTools: () => ipcRenderer.send('open-devtools'),

    // 退出应用
    exitApp: () => ipcRenderer.send('window-exit'),

    // 刷新窗口
    reloadWindow: () => ipcRenderer.send('window-reload'),

    // 获取版本号
    getAppVersion: () => ipcRenderer.send('get-app-version')
});