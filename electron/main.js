const { app, BrowserWindow, ipcMain, clipboard } = require('electron')
const { createMainWindowView, openDialog, openMainwindowDevTools,
    maximizeMainwindow, minimizeMainwindow, exitMainwindow, reloadMainwindow,
    getConfig, saveConfig, initStore, resetSetting, getCurrentScale } = require('./functions');
const { openSerialPort, releaseSerialPort, sendSerialPortMessage, getSerialPortList } = require('./serial');
const { printLog, initLog, convertStringToGbkCodeArray, getLinuxUsername } = require('./utils');

initStore();
initLog();

let mainWindow;

function createWindow() {
    //加载vue devtools拓展
    //session.defaultSession.loadExtension('C:/Users/admin/AppData/Local/Google/Chrome/User Data/Default/Extensions/fjjopahebfkmlmkekebhacaklbhiefbn/6.5.1_0').then(({ id }) => { })
    //session.defaultSession.loadExtension('C:/Users/admin/AppData/Local/Google/Chrome/User Data/Default/Extensions/fjjopahebfkmlmkekebhacaklbhiefbn/6.5.1_1').then(({ id }) => {})

    //创建浏览器窗口
    mainWindow = createMainWindowView();

    //获取缩放配置
    ipcMain.handle('get-current-scale', () => {
        return getCurrentScale();
    });

    //渲染进程获取配置信息
    ipcMain.handle('get-config-data', () => {
        return getConfig();
    });

    //渲染进程保存配置
    ipcMain.handle('save-config-data', (event, data) => {
        return saveConfig(data);
    });

    //渲染进程获取linux用户名
    ipcMain.handle('get-linux-user', () => {
        return getLinuxUsername();
    });

    //渲染进程写入剪贴板
    ipcMain.handle('write-clipboard', (event, info) => {
        clipboard.writeText(info);
    });

    //打开串口
    ipcMain.on('serial-open-port', (event, com) => {
        openSerialPort(com, mainWindow);
    });

    //释放串口
    ipcMain.on('serial-release-port', () => {
        releaseSerialPort(mainWindow);
    });

    //发送串口消息
    ipcMain.on('serial-send-message', (event, dataArray) => {
        sendSerialPortMessage(dataArray, mainWindow);
    });

    //获取串口列表
    ipcMain.on('serial-get-port-list', () => {
        getSerialPortList(mainWindow);
    });

    //字符串gbk编码转换
    ipcMain.handle('convert-gbk-encode', (event, inputString) => {
        return convertStringToGbkCodeArray(inputString);
    });

    //渲染进程设置最小化
    ipcMain.handle('reset-setting', () => {
        return resetSetting();
    });

    //渲染进程调用应用程序重启
    ipcMain.on('app-relaunch', () => {
        console.log('appRelaunch')
        app.relaunch();  // 触发重新启动
        app.exit();  // 退出当前应用进程
    })

    //渲染进程设置最小化
    ipcMain.on('minimize-window', () => {
        minimizeMainwindow();
    });

    //设置最大化
    ipcMain.on('maximize-window', () => {
        maximizeMainwindow();
    });

    //渲染进程打开调试工具
    ipcMain.on('open-devtools', () => {
        openMainwindowDevTools();
    });

    //渲染进程调用关闭app
    ipcMain.on('window-exit', () => {
        exitMainwindow();
    });

    //渲染进程调用页面刷新
    ipcMain.on('window-reload', () => {
        reloadMainwindow();
    });

    //设置最前端 
    ipcMain.on('toggle-window', () => {
        const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
        mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
    });

    //获取版本号
    ipcMain.handle('get-app-version', () => {
        const version = app.getVersion();
        console.log('调用version', version);
        return version;
    });
}

// 这段程序将会在 Electron 结束初始化和创建浏览器窗口的时候调用部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    printLog('程序启动');
    createWindow();
    printLog('创建主窗体');
    app.on('activate', function () {
        // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他打开的窗口，那么程序会重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
}).catch((error) => {
    openDialog('error', '启动失败', '启动失败：' + error.message);
})

//非 macOS 当所有窗口关闭时都直接退出
app.on('window-all-closed', function () {
    //if (process.platform !== 'darwin') app.quit()
    app.quit()
})

// 限制一个窗口
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  // 销毁所有窗口、托盘、退出应用
  app.exit();
}

//当运行第二个实例时
app.on("second-instance", () => {
  try {
    if (mainWindow) {
      //窗口已销毁 重新创建窗口
      if (mainWindow.isDestroyed()) {
        createWindow();
        return;
      }
      //窗口最小化 恢复到以前的状态
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      //窗口正常 聚焦窗口
      mainWindow.focus();
    }
  }
  catch (err) {
    createWindow();
  }
});