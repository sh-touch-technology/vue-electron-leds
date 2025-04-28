const { app, BrowserWindow, BrowserView, Menu, dialog, session } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { printLog } = require('./utils');
const { releaseSerialPort } = require('./serial');
//const os = require('os');

//发布时改为非dev的值
const env = 'dev';

//运行平台win32/linux
//const platform = os.platform();

let mainWindow;
//elctron-store存储实例
let store;

const default_setting = {
    com_port_selected: null, //选择的串口
    screen_selected: 255, //选择修改的屏号
    screen_edit: 255, //修改屏号
    line_num: 1, //行数
    line_text_num: 8, //每行汉字数
    data_forward_or_reverse_direction: true, //数据正反向
    oe_polarity: false, //OE极性
    dot_matrix: 32, //点阵选择
    com_channel_selected: 23, //信道选择
    device_type: 1, //设备类型
    screen_window_sequence_and_name: '&Y01|&Y窗口号与业务名&R称', //窗口序号和名称
    screen_initial_content: '&Y欢迎光临欢迎光临', //初始显示内容设置
    send_test_content: '请A001到01号窗&G口', //发送测试内容
    move_effect: '0', //移动效果
}

//初始化存储
function initStore() {
    store = new Store({
        name: 'config',
        //encryptionKey: 'your-encryption-key', // 数据加密
        defaults: default_setting
    });
}

//重置设置
function resetSetting() {
    store.store = default_setting;
    releaseSerialPort(mainWindow);
    return default_setting;
}

//获取配置文件
function getConfig() {
    try {
        const config = store.store;
        printLog('配置文件读取成功');
        return config;
    }
    catch (error) {
        printLog('配置文件读取失败，错误：' + error);
    }
}

//保存配置文件
function saveConfig(data) {
    try {
        const config = JSON.parse(data);
        store.store = config;
        printLog('渲染进程保存配置信息成功');
        return true;
    } catch (error) {
        printLog('渲染进程保存配置信息失败，错误：' + error);
        return false;
    }
}

//主窗口返回首页/重置页面
function reloadMainwindow() {
    mainWindow.reload();
}

//主窗口最大化/缩小
function maximizeMainwindow() {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
}

//主窗口最小化
function minimizeMainwindow() {
    if (mainWindow) {
        mainWindow.minimize();
    }
}

//打开主窗口的调试
function openMainwindowDevTools() {
    mainWindow.webContents.openDevTools();
}

//弹出dialog
function openDialog(level, title, message) {
    dialog.showMessageBox(mainWindow, {
        type: level, //none,info,error,question,warning
        title: title,
        message: message,
        buttons: ['确定', '取消']
    }).then(result => {
        console.log(result.response);
    });
}

//程序退出
function exitMainwindow() {
    app.quit();
}


function createMainWindowView() {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 880,
        minWidth: 1024,
        minHeight: 880,
        x: 0,
        y: 0,
        frame: false, // 去掉窗口边框
        titleBarStyle: 'hidden', // 隐藏标题栏
        webPreferences: {
            preload: path.join(__dirname, '/preload.js'),
            //渲染进程配置
            nodeIntegration: false, //可以引入node和electron相关的API
            contextIsolation: true, //可以使用require方法
            enableRemoteModule: false, //可以使用remote方法
        },
    });

    // 配置热更新
    if (env == 'dev') {
        //开发环境
        const elePath = path.join(__dirname, '../node_modules/electron');
        require('electron-reload')('../', {
            electron: require(elePath),
        });
        mainWindow.loadURL('http://localhost:8890');
        mainWindow.webContents.openDevTools();
    } else {
        //生产环境中要加载文件，打包的版本
        mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'));
        //mainWindow.webContents.openDevTools()
    }

    //隐藏菜单
    Menu.setApplicationMenu(null)

    // 监听窗口从最小化状态恢复时触发的事件
    mainWindow.on('restore', () => {
        console.log('窗口已从最小化状态恢复');
    });

    return mainWindow;
}

// 导出所有函数
module.exports = {
    createMainWindowView, openDialog, openMainwindowDevTools,
    maximizeMainwindow, minimizeMainwindow, exitMainwindow, reloadMainwindow,
    saveConfig, getConfig, initStore, resetSetting
};