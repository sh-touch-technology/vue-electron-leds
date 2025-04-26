//地址转换为ascaii字节地址
function convertToAsciiAddress(address) {
    const str = address.toString().padStart(2, '0');
    const result = str.split('').map(char => char.charCodeAt(0));
    return result;
}

//数组逐个异或计算校验和
function calculateChecksum(dataArray) {
    let crc = 0;
    for (let i = 0; i < dataArray.length; i++) {
        crc ^= dataArray[i];
    }
    return [crc];
}

//获取主控读取数据帧
export function getReadMainControlData(address) {
    if (!address) { address = 0 };
    const ascaii_add = convertToAsciiAddress(address);
    const data = [191, 195, 82, ...ascaii_add, 26];
    return data;
}

//获取主控修改数据帧
export function getEditMainControlData(address) {
    if (!address) { address = 0 };
    const ascaii_add = convertToAsciiAddress(address);
    const check_sum = calculateChecksum([69, ...ascaii_add, 26]);
    const data = [191, 195, 69, ...ascaii_add, 26, ...check_sum];
    return data;
}