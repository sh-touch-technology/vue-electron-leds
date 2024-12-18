const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {

    // 监听串口相关函数调用回传状态
    onSerialState: (callback) => {
        ipcRenderer.on('serial-state', (event, state) => {
            console.log('serial-state');
            callback(state);
        });
    },

    // 监听串口相关函数调用数据回传
    onSerialData: (callback) => {
        ipcRenderer.on('serial-data', (event, obj) => {
            console.log('serial-data');
            callback(obj);
        });
    },

    // 监听串口接收消息
    onSerialMessage: (callback) => {
        ipcRenderer.on('serial-message', (event, data) => {
            console.log('serial-message');
            callback(data);
        });
    },

    //获取串口列表
    getSerialPortList: () => ipcRenderer.send('serial-get-port-list'),

    //打开串口
    openSerialPort: (com) => ipcRenderer.send('serial-open-port', com),

    //释放串口
    releaseSerialPort: () => ipcRenderer.send('serial-release-port'),

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

    // 固定窗口在最前
    toggleWindow: () => ipcRenderer.send('toggle-window'),

    // 获取版本号
    getAppVersion: () => ipcRenderer.invoke('get-app-version')
});