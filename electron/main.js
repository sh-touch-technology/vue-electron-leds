// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, Menu, dialog } = require('electron')
const {
    createMainWindowView, closeWebError,
    getRegisterState, saveRegisterInfo, getPrintState, clearPageCache, getPageCache,
    savePageCache, saveConfig, exitMainwindow, settingButtonClick, printPdf, startCameraService,
    updateMenu, printLog, readConfigFile, getConfig, updateLastRunTime, clearPrintQueue,
    varifyRegisterInfo, registeCheck, getRegisterInfo, initLog, initStore, openDialog,
    openMainwindowDevTools, maximizeMainwindow, minimizeMainwindow, reloadMainwindow,
    homeMainwindow, backMainwindow, forwardMainwindow, nircmd, showNotice, closeNotice
} = require('./funtions');

initLog();

//发布时改为非dev的值
const env = 'dev';

//配置文件中目录
const configFilePath = (env == 'dev' ? path.resolve(__dirname, '../config.json') : path.resolve(__dirname, '../../../config.json'));
//日志目录
const logFilePath = (env == 'dev' ? path.resolve(__dirname, '../log/' + getCurrentDate() + '-log.txt') : path.resolve(__dirname, '../../../log/' + getCurrentDate() + '-log.txt'));

let config;

let expireDate = null;
let registerState = null;

let mainWindow;

const aesKey = Buffer.from('loaSoTGngHMpCxmkuKsjcw==', 'base64');
const aesIv = Buffer.from('qdmzKCH8TmFrqtpsnGByvA==', 'base64');


function createWindow(width, height) {
    const copnfig = getConfig();
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: config.window_width,
        height: config.window_height,
        x: (width - config.window_width) / 2,  // 计算窗口的x坐标
        y: (height - config.window_height) / 2, // 计算窗口的y坐标
        webPreferences: {
            // 书写渲染进程中的配置
            nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
            contextIsolation: false, // 可以使用require方法
            enableRemoteModule: true, // 可以使用remote方法
        },
    })

    // 配置热更新
    if (env == 'dev') {
        //开发环境
        const elePath = path.join(__dirname, '../node_modules/electron')
        require('electron-reload')('../', {
            electron: require(elePath),
        })
        mainWindow.loadURL('http://localhost:8890')
        mainWindow.webContents.openDevTools()
    } else {
        //生产环境
        mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'))
        mainWindow.webContents.openDevTools()
    }

    //隐藏菜单
    Menu.setApplicationMenu(null)

    //设置最小化
    ipcMain.on('minimize-window', () => {
        if (mainWindow) {
            mainWindow.minimize();
        }
    });

    //在窗口加载完成后调用 setFullScreen
    mainWindow.webContents.on('did-finish-load', () => {
        //窗口最大化结束初始化
        //const config = getConfig();
        if (env == 'dev') {
            console.log('dev mode');
            //mainWindow.setSize(config.window_width,config.window_height);
        }
        else {
            // mainWindow.maximize();
            // mainWindow.setFullScreen(true);
            // mainWindow.focus();
        }
    });
}

//获取和缓存配置信息
function getConfig() {
    return config == null ? readConfigFile() : config;
}
//读取配置文件
function readConfigFile() {
    console.log('config path :' + configFilePath);
    try {
        const configFileContent = fs.readFileSync(configFilePath, 'utf-8');
        console.log('read config file content:' + configFileContent);
        config = JSON.parse(configFileContent);
        return config;
    } catch (error) {
        console.error('Error reading config file:', error);
        showErrorDialog(`配置文件读取失败: ${error.message}`)
    }
}

//报错信息
function showErrorDialog(msg) {
    const options = {
        type: 'error',
        buttons: ['确定'],
        defaultId: 0,
        title: '错误',
        message: msg,
    };

    dialog.showMessageBox(null, options).then((result) => {
        if (result.response === 0) {
            app.quit();
        }
    });
}

//日志函数
function log(message) {
    if (!fs.existsSync(path.dirname(logFilePath))) {
        try {
            fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
            console.log(`Log folder created at ${path.dirname(logFilePath)}`);
        } catch (error) {
            console.error('Error creating log folder:', error);
        }
    }
    if (!fs.existsSync(logFilePath)) {
        try {
            fs.writeFileSync(logFilePath, '');
            console.log(`Log file created at ${logFilePath}`);
        } catch (error) {
            console.error('Error creating log file:', error);
        }
    }
    const timestamp = getCurrentDateTime();
    const logMessage = `[${timestamp}]${message}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

//获取当前时间
function getCurrentDateTime() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 月份从0开始，所以要加1
    var day = ('0' + currentDate.getDate()).slice(-2);
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getSeconds()).slice(-2);
    var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return formattedDateTime;
}

//获取当前日期
function getCurrentDate() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 月份从0开始，所以要加1
    var day = ('0' + currentDate.getDate()).slice(-2);
    var formattedDateTime = year + '-' + month + '-' + day;
    return formattedDateTime;
}

//更新最后运行时间
function updateLastRunTime() {
    const config_ = getConfig();
    try {
        if (config_.update) {
            if (new Date() >= new Date(aesDecrypt(config_.update))) {
                config_.update = aesEncrypt(getCurrentDate());
                fs.writeFile(configFilePath, JSON.stringify(config_), (err) => {
                    if (err) {
                        log('更新配置文件失败：' + err.message);
                    } else {
                        log('更新配置文件成功');
                    }
                });
            }
            else {
                log('系统时间异常，终止更新配置文件');
            }
        }
        else {
            log('启动时更新配置文件时，配置文件缺少date');
            showErrorDialog('配置文件缺少配置项');
        }
    }
    catch (error) {
        log('应用程序启动时更新配置文件异常:' + error);
        showErrorDialog('应用程序启动检查时异常:' + error);
    }
}

function aesEncrypt(text) {
    let cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(aesKey), Buffer.from(aesIv, 'hex'));
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function aesDecrypt(encryptedText) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(aesKey), Buffer.from(aesIv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

//注册状态校验
function registerCheck() {
    log('开始检查注册状态');
    //RSA公钥，PEM格式
    const public_key = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxZBhhrilZKG2rKsneJ3j
Va7hZabiealulPo8s31emKjPRw4qhSFLui+9XNb6I3v3FiXTOtqaHhAeYPDmQpbo
zbNpHDGCzBc5dD15wC2ql8YyFPg7NGYTjjgK/h4BA8RGMw9OScbTaBvEZfx41YqS
hdLb9mMifCLZS3iGgRkHrKt0cXCCMYW6m3iKWNcIZRak1Eb2DMbaWF5mBA2B/k5T    
+NPmU7/ohmmNaorvkLWvk90mOBa49z/jZh4G7OZsl+wnq1hTpnfjvcacE3L/bi90
rTnZQDT5jRFOdOWs8ECAAGs4MvhBffHq42Wij1KZbhW6PMYTpit1HE0JhLb9mQCP
LQIDAQAB
-----END PUBLIC KEY-----`;
    //获取CPU序列号
    const cpu = os.platform() === 'win32' ? execSync('wmic cpu get processorid').toString().split('\n').slice(1, -1) : [];
    const cpu_id = cpu[0].trim();
    log('机器码:' + cpu_id);

    //读取配置文件
    const config_path = 'C:\\shkj_license.txt';
    const client_config = getConfig();
    console.log('config_path:', config_path);
    if (fs.existsSync(config_path)) {
        try {
            const config_content = fs.readFileSync(config_path, 'utf-8');
            const config = JSON.parse(config_content);

            if (config.machine_code !== cpu_id) {
                log("授权文件无效");
                return false;
            }

            const verify = crypto.createVerify('RSA-SHA256');
            verify.update(JSON.stringify(config.license) + cpu_id);
            const result = verify.verify(public_key, atob(config.sign), 'base64');

            if (!result) {
                log("授权文件签名无效");
                return false;
            }

            if (!config.license['1002']?.authority) {
                log("当前软件未授权");
                return false;
            }

            expireDate = config.license['1003'].expire;
            const verifyDate = config.license['1003'].strict ? new Date(aesDecrypt(client_config.update)) : new Date();
            if (new Date(expireDate) < verifyDate) {
                log("授权已过期");
                return false;
            }

            log("授权验证成功");
            return true;

        } catch (error) {
            log("授权文件校验失败：" + error);
            return false;
        }

    } else {
        log("授权文件不存在:" + config_path);
        return false;
    }
}

//渲染进程获取配置信息
ipcMain.handle('get-config-data', () => {
    log('渲染进程获取配置信息');
    return getConfig();
});

//渲染进程检查授权状态
ipcMain.on('check-register', () => {
    registerState = (registerState == null ? registerCheck() : registerState);
    mainWindow.webContents.send('register-state', { state: registerState, expire: expireDate });
});

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    log('程序启动');
    updateLastRunTime();
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    log('创建主窗体');
    createWindow(width, height)

    app.on('activate', function () {
        // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
        // 打开的窗口，那么程序会重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})