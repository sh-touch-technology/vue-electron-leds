const { SerialPort } = require('serialport');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')

const { printLog } = require('./utils');

//是否打印调试日志
const logs = false;

//保存串口实例
let port;

//view.webContents.send('serial-data', { type: 'com-port-open', flag: 'success', msg: '串口已打开' }); //返回串口状态
//view.webContents.send('serial-message', data); //返回串口接收数据

//打开串口
function openSerialPort(com, view) {
    // 确保传递的是一个有效的串口路径
    if (typeof com !== 'string' || com.trim() === '') {
        logs && console.error('串口路径无效');
        printLog(`[打开串口]错误：指定的串口名称无效,port:${com}`);
        view.webContents.send('serial-data', { type: 'com-state-message', flag: 'error', msg: '指定的串口名称无效' });
        return;
    }
    try {
        port = new SerialPort({
            path: com,            // 串口路径
            baudRate: 9600,       // 波特率
            autoOpen: false       // 不自动打开
        });
    }
    catch (err) {
        view.webContents.send('serial-data', { type: 'com-state-message', flag: 'error', msg: '串口打开失败：' + err.message });
        return logs && console.error('打开串口失败:', err.message);
    }
    // 3. 打开串口
    port.open(err => {
        if (err) {
            printLog(`[打开串口]错误：串口打开失败:${err.message}`);
            view.webContents.send('serial-data', { type: 'com-state-message', flag: 'error', msg: '串口打开失败：' + err.message });
            return logs && console.error('打开串口失败:', err.message);
        }
        printLog(`[打开串口]port:${com}`);
        logs && console.log('串口已打开');
        view.webContents.send('serial-data', { type: 'com-port-open', flag: 'success', msg: '串口已打开' });
    });

    const parser = port.pipe(new InterByteTimeoutParser({ interval: 30 }))
    parser.on('data', data => {
        const data_info = Array.from(data) + `十进制(${Array.from(data).map(num => num.toString(16).padStart(2, '0').toUpperCase()).join(' ')})`
        logs && console.log('[串口接收]', Array.from(data));  // 打印接收到的字节数据
        view.webContents.send('serial-message', Array.from(data)); // 发送到界面
    });

    // 监听串口数据
    /* port.on('data', data => {
        const data_info = Array.from(data) + `(${Array.from(data).map(num => num.toString(16).padStart(2, '0').toUpperCase()).join(' ')})`
        printLog(`[串口接收]${data_info}`);
        //logs && console.log('接收到的数据字节:', Array.from(data));  // 打印接收到的字节数据
        view.webContents.send('serial-message', Array.from(data)); // 发送到界面
    }); */

    port.on('close', () => {
        printLog(`[串口断开]串口已断开连接`);
        logs && console.log('串口已断开连接');
        view.webContents.send('serial-data', { type: 'com-port-disconnected', flag: 'warning', msg: '串口已断开连接' });
    });

    // 6. 错误处理
    port.on('error', err => {
        printLog(`[串口错误]${err.message}`);
        logs && console.error('串口错误：', err.message);
        view.webContents.send('serial-data', { type: 'com-state-message', flag: 'error', msg: '串口错误：' + err.message });
    });
}

//释放串口
function releaseSerialPort(view) {
    if (port && port.isOpen) {
        port.close(err => {
            if (err) {
                printLog(`[串口释放]释放串口失败：${err.message}`);
                logs && console.error('释放串口失败：', err.message);
                view.webContents.send('serial-data', { type: 'com-state-message', flag: 'error', msg: '释放串口失败：' + err.message });
            } else {
                port = null;
                printLog(`[串口释放]串口已释放`);
                logs && console.log('串口已释放');
                view.webContents.send('serial-data', { type: 'com-port-release', flag: 'primary', msg: '串口已释放' });
            }
        });
    } else {
        printLog(`[串口释放]串口未打开，无需释放`);
        logs && console.log('串口未打开');
        view.webContents.send('serial-data', { type: 'com-state-message', flag: 'default', msg: '串口未打开，无需释放' });
    }
}

// 5. 发送数据到串口
function sendSerialPortMessage(dataArray, view) {
    if (!port || !port.isOpen) {
        logs && console.error('串口未打开，无法发送数据');
        view.webContents.send('serial-data', { type: 'com-state-message', flag: 'error', msg: '串口未打开，无法发送数据' });
        return;
    }

    const byteData = Buffer.from(dataArray);

    port.write(byteData, err => {
        if (err) {
            printLog(`[串口发送]发送失败：${err.message}`);
            logs && console.error('发送失败：', err.message);
            view.webContents.send('serial-data', { type: 'com-state-message', flag: 'error', msg: '发送失败：' + err.message });
        }
        const data_info = `${dataArray.map(num => num.toString(16).padStart(2, '0').toUpperCase()).join(' ')} 十进制(${dataArray.join(' ')})`;
        printLog(`[串口发送]${data_info}`);
        view.webContents.send('serial-data', { type: 'com-state-message', flag: 'success', msg: '发送完成' });
    });
}

//获取系统串口列表
async function getSerialPortList(view) {
    try {
        const ports = await SerialPort.list();  // 获取所有串口列表
        if (ports.length === 0) {
            printLog(`[获取串口列表]设备上没有可用的串口`);
            logs && console.log('没有找到可用的串口');
            view.webContents.send('serial-data', { type: 'com_port_list', flag: 'success', data: [] });
            view.webContents.send('serial-data', { type: 'com-state-message', flag: 'warning', msg: '设备上没有可用的串口！' });
        } else {
            logs && console.log('可用的串口列表:');
            const port_list = [];
            ports.forEach(port => {
                logs && console.log(`路径: ${port.path}, 名称: ${port.manufacturer || '未知'}`);
                port_list.push({ name: port.manufacturer, port: port.path });
            });
            printLog(`[获取串口列表]${JSON.stringify(port_list)}`);
            view.webContents.send('serial-data', { type: 'com_port_list', flag: 'success', data: port_list });
        }
    } catch (error) {
        printLog(`[获取串口列表]错误：${error}`);
        logs && console.error('获取串口列表时出错：', error);
        view.webContents.send('serial-data', { type: 'com-state-message', flag: 'error', msg: '串口列表获取失败：' + error });
    }
}

module.exports = {
    openSerialPort, releaseSerialPort, sendSerialPortMessage, getSerialPortList
}