//地址转换为ascaii字节地址
function convertToAdlAdh(channel) {
    const str = channel.toString().padStart(2, '0');
    const result = str.split('').map(char => char.charCodeAt(0));
    return result;
}

//数组逐个异或计算校验和
function calculateChecksum(dataArray) {
    let crc = 0;
    for (let i = 0; i < dataArray.length; i++) {
        crc ^= dataArray[i];
    }
    return crc;
}

//获取 //主控读取 数据帧
export function getReadMainControlData(channel) {
    if (!channel) { channel = 0 };
    const adl_adh = convertToAdlAdh(channel);
    const data = [191, 195, 82, ...adl_adh, 26];
    return data;
}

//获取 //主控修改 数据帧
export function getEditMainControlData(channel) {
    if (!channel) { channel = 0 };
    const adl_adh = convertToAdlAdh(channel);
    const pms = [69, ...adl_adh, 26];
    const check_sum = calculateChecksum(pms);
    const data = [191, 195, ...pms, check_sum];
    return data;
}

//获取 //无线控制卡 批量信道修改数据帧
export function getEditWirelessControlCardChannelData(channel) {
    if (!channel) { channel = 0 };
    const adl_adh = convertToAdlAdh(channel);
    const pms = [67, ...adl_adh, 26];
    const check_sum = calculateChecksum(pms);
    const data = [191, 195, ...pms, check_sum];
    return data;
}

//获取 //修改设置 修改基本设置数据帧
export function getEditBaseSettingData(setting) {
    const { ph, xgph, hs, mhzs, zf, oe, m_sdot } = setting;
    //if (!channel) { channel = 0 };
    const adl_adh = convertToAdlAdh(ph);
    const pms = [];
    //cmd
    pms.push(65);
    //xgph修改屏号，高4位和低4位
    pms.push(((xgph >> 4) & 0x0F));
    pms.push((xgph & 0x0F));
    //行数hs，高4位和低4位
    pms.push(((hs >> 4) & 0x0F));
    pms.push((hs & 0x0F));
    //每行字数mhzs，高4位和低4位
    pms.push(((mhzs >> 4) & 0x0F));
    pms.push((mhzs & 0x0F));
    // oe和zf控制的两个字节
    if (oe) {
        if (zf) {
            pms.push(0x00);
            pms.push(0x00);
        } else {
            pms.push(0x00);
            pms.push(0x01);
        }
    } else {
        if (zf) {
            pms.push(0x10);
        } else {
            pms.push(0x11);
        }
    }
    //m_sdot
    let m_sdot_;
    if (m_sdot === 16) {
        m_sdot_ = 65;
    } else if (m_sdot === 24) {
        m_sdot_ = 66;
    } else if (m_sdot === 32) {
        m_sdot_ = 67;
    } else {
        m_sdot_ = 16;
    }
    pms.push(m_sdot_);
    //结束符
    pms.push(26);
    const check_sum = calculateChecksum(pms);
    const data = [...adl_adh, ...pms, check_sum];
    return data;
}