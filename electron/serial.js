//const SerialPort = require('serialport');
const { SerialPort } = require('serialport');

let port;
let parser;

function openSerialPort(com, view) {
    // 确保传递的是一个有效的串口路径
    if (typeof com !== 'string' || com.trim() === '') {
        console.error('串口路径无效');
        view.webContents.send('serial-state', { flag: false, msg: '串口路径无效' });
        return;
    }
    console.log('com没有问题');
    port = new SerialPort({
        path: com,            // 串口路径
        baudRate: 9600,       // 波特率
        autoOpen: false       // 不自动打开
    });
    // 3. 打开串口
    port.open(err => {
        if (err) {
            return console.error('打开串口失败:', err.message);
        }
        console.log('串口已打开');
        view.webContents.send('serial-state', { flag: true, msg: '串口已打开' });

        // 监听串口数据
        port.on('data', data => {
            console.log('接收到的数据字节:', data);  // 打印接收到的字节数据
            view.webContents.send('serial-data', data); // 发送到界面
        });
    });

    // 6. 错误处理
    port.on('error', err => {
        console.error('串口错误:', err.message);
        view.webContents.send('serial-state', { flag: false, msg: '串口错误:' + err.message });
    });
}

// 5. 发送数据到串口
function sendSerialPortMessage(message, view) {
    if (!port.isOpen) {
        console.error('串口未打开，无法发送数据');
        view.webContents.send('serial-state', { flag: false, msg: '串口未打开，无法发送数据' });
        return;
    }

    port.write(message + '\r\n', err => {
        if (err) {
            console.error('发送失败:', err.message);
            view.webContents.send('serial-state', { flag: false, msg: '发送失败:' + err.message });
        }
        console.log('已发送:', message);
        view.webContents.send('serial-state', { flag: true, msg: '已发送:' + message });
    });
}


module.exports = {
    openSerialPort,sendSerialPortMessage
}