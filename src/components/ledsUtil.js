//地址转换为ascaii字节地址
function convertToAsciiAddress(address) {
    const str = address.toString().padStart(2, '0');
    const result = str.split('').map(char => char.charCodeAt(0));
    return result;
}

//获取主控读取数据帧
export function getReadMainControlData(address) {
    const ascaii_add = convertToAsciiAddress(address); 
    const data = [...[191, 195, 82],...ascaii_add,...[26]];
    return data;
}