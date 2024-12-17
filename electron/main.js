const { app, BrowserWindow, ipcMain } = require('electron')
const {
    createMainWindowView, printLog, initLog, openDialog, openMainwindowDevTools,
    maximizeMainwindow, minimizeMainwindow, exitMainwindow, reloadMainwindow
} = require('./functions');
const { openSerialPort, sendSerialPortMessage } = require('./serial');

initLog();

let mainWindow;

function createWindow() {
    //加载vue devtools拓展
    //session.defaultSession.loadExtension('C:/Users/admin/AppData/Local/Google/Chrome/User Data/Default/Extensions/fjjopahebfkmlmkekebhacaklbhiefbn/6.5.1_0').then(({ id }) => { })
    //session.defaultSession.loadExtension('C:/Users/admin/AppData/Local/Google/Chrome/User Data/Default/Extensions/fjjopahebfkmlmkekebhacaklbhiefbn/6.5.1_1').then(({ id }) => {})

    //创建浏览器窗口
    mainWindow = createMainWindowView();

    //打开串口
    ipcMain.on('serial-open-port', (com) => {
        openSerialPort(com, mainWindow);
    });

    //发送串口消息
    ipcMain.on('serial-send-message', (message) => {
        sendSerialPortMessage(message, mainWindow);
    });

    //渲染进程调用应用程序重启
    ipcMain.handle('app-relaunch', () => {
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