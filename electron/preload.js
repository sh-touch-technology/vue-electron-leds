const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // 监听串口返回消息
    onSerialData: (callback) => {
        const listener = (event, obj) => {
            //console.log('serial-data');
            callback(obj);
        };
        ipcRenderer.on('serial-data', listener);
        return () => ipcRenderer.removeListener('serial-data', listener); // 返回移除方法
    },

    // 监听串口监听接收数据
    onSerialMessage: (callback) => {
        const listener = (event, data) => {
            //console.log('serial-message');
            callback(data);
        };
        ipcRenderer.on('serial-message', listener);
        return () => ipcRenderer.removeListener('serial-message', listener); // 返回移除方法
    },

    //获取配置数据
    getConfigData: () => ipcRenderer.invoke('get-config-data'),

    //保存配置
    saveConfig: (data) => ipcRenderer.invoke('save-config-data', data),

    //获取linux用户名
    getLinuxUsername: () => ipcRenderer.invoke('get-linux-user'),

    // 写入剪贴板
    writeClipboard: (info) => ipcRenderer.invoke('write-clipboard', info),

    //获取串口列表
    getSerialPortList: () => ipcRenderer.send('serial-get-port-list'),

    //打开串口
    openSerialPort: (com) => ipcRenderer.send('serial-open-port', com),

    //释放串口
    releaseSerialPort: () => ipcRenderer.send('serial-release-port'),

    //发送串口消息
    sendSerialPortMessage: (dataArray) => ipcRenderer.send('serial-send-message', dataArray),

    //字符串gbk编码转换
    convertStringToGbkEncode: (data) => ipcRenderer.invoke('convert-gbk-encode', data),

    //弹出electron提示const { title, msg } = obj;
    clientDialog: (obj) => ipcRenderer.send('client-dialog', obj),

    //重置设置
    resetSetting: () => ipcRenderer.invoke('reset-setting'),

    //应用重启
    appRelaunch: () => { ipcRenderer.send('app-relaunch'); console.log('appRelaunch') },

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