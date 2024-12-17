const SerialPort = require('serialport');
const ReadlineParser = require('@serialport/parser-readline');

let port;
let parser;

function openSerialPort(com, view) {
    port = new SerialPort(com, {
        baudRate: 9600,
        autoOpen: false
    });
    // 3. 打开串口
    port.open(err => {
        if (err) {
            return console.error('打开串口失败:', err.message);
        }
        console.log('串口已打开');
        view.webContents.send('serial-message', { flag: true, msg: '串口已打开' });
        // 2. 创建一个 Readline 解析器，用于处理串口接收到的消息
        parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
        parser.on('data', data => {
            console.log('接收到的数据:', data);
            view.webContents.send('serial-data', data);
        });
    });

    // 6. 错误处理
    port.on('error', err => {
        console.error('串口错误:', err.message);
        view.webContents.send('serial-message', { flag: false, msg: '串口错误:' + err.message });
    });
}

// 5. 发送数据到串口
function sendSerialPortMessage(message, view) {
    if (!port.isOpen) {
        console.error('串口未打开，无法发送数据');
        view.webContents.send('serial-message', { flag: false, msg: '串口未打开，无法发送数据' });
        return;
    }

    port.write(message + '\r\n', err => {
        if (err) {
            console.error('发送失败:', err.message);
            view.webContents.send('serial-message', { flag: false, msg: '发送失败:' + err.message });
        }
        console.log('已发送:', message);
        view.webContents.send('serial-message', { flag: true, msg: '已发送:' + message });
    });
}


module.exports = {
    openSerialPort,sendSerialPortMessage
}