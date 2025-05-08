const { app } = require('electron')
const log = require('electron-log/main');
const path = require('path');
const iconv = require('iconv-lite');
const os = require('os');

//日志目录
const logFilePath = path.resolve(app.getPath('home'), '首环日志\\条屏设置');

//初始化日志
function initLog() {
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
    let date = new Date();
    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    //log.transports.file.resolvePath = () => platform === 'win32' ? ('C:\\shkj-log\\shkj-client\\' + date + '.txt') : ('~/shkj/log/shkj-client/' + date + '.txt');
    log.transports.file.resolvePathFn = () => path.resolve(logFilePath, `${date}.txt`);
    console.log('log file path:', path.resolve(logFilePath, `${date}.txt`));
}

//日志函数
function printLog(message) {
    log.info(message);
}

//iconv-lite字符串转gbk编码数组
function convertStringToGbkCodeArray(inputString) {
    try {
        const data = [];

        for (let i = 0; i < inputString.length; i++) {
            const char = inputString[i];
            const code = char.charCodeAt(0);

            if (code > 127 || code < 16) {
                // 用GBK编码这个字符
                const gbkBuffer = iconv.encode(char, 'gbk'); // 注意是 'gbk' 小写

                for (let j = 0; j < gbkBuffer.length; j++) {
                    const byte = gbkBuffer[j];
                    data.push((byte >> 4) & 0x0F); // 高四位
                    data.push(byte & 0x0F);         // 低四位
                }
            } else {
                data.push(code);
            }
        }
        return {
            state: true,
            data: data
        };
    }
    catch (error) {
        return {
            state: false,
            message: '字符串编码失败，错误：' + error,
            data: []
        };
    }
}

//获取linux用户名
function getLinuxUsername() {
    if (os.platform() === 'linux') {
      try {
        const userInfo = os.userInfo();
        return userInfo.username || '';
      } catch (err) {
        console.error('获取用户名失败:', err);
        return '';
      }
    }
    return '';
  }

module.exports = { initLog, printLog, convertStringToGbkCodeArray, getLinuxUsername };