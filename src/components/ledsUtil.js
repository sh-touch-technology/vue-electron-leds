//地址转换为ascaii字节地址 channel只能传0-63 返回结果是两位数组
function convertToAsciiAddress(channel) {
    const str = channel.toString().padStart(2, '0');
    const result = str.split('').map(char => char.charCodeAt(0));
    return result;
}

//计算adl、adh
function getAdlAdh(ph) {
    let adl = 0x80 | (ph & 0x3F);
    let adh = 0xC0 | ((ph >> 6) & 0x03);
    return [adl, adh]
}

//计算字节拆分高四位、低四位，低四位为0且数值小于128则不拆分
function getH4L4(num) {
    const h4 = ((num >> 4) & 0x0F);
    const l4 = (num & 0x0F);

    if (l4 === 0 && num < 128) {
        return [(h4 << 4)];
    } else {
        return [h4, l4];
    }
}

//数组逐个异或计算校验和
function calculateCheckSum(dataArray) {
    let crc = 0;
    for (let i = 0; i < dataArray.length; i++) {
        crc ^= dataArray[i];
    }
    return crc;
}

//获取 //主控读取 数据帧
export function getReadMainControlData(channel) {
    if (!channel) { channel = 0 };
    const ascaii_addr = convertToAsciiAddress(channel);
    const data = [191, 195, 82, ...ascaii_addr, 26];
    return data;
}

//获取 //主控修改 数据帧
export function getEditMainControlData(channel) {
    if (!channel) { channel = 0 };
    const ascaii_addr = convertToAsciiAddress(channel);
    const pms = [69, ...ascaii_addr, 26];
    const check_sum = calculateCheckSum(pms);
    const data = [191, 195, ...pms, check_sum];
    return data;
}

//获取 //无线控制卡 批量信道修改数据帧
export function getEditWirelessControlCardChannelData(channel, screen) {
    if (!channel) { channel = 0 }
    if (!screen) { screen = 0 }
    const pms = [67];
    // 信道（转换为两位 ASCII）
    if (channel < 9) {
        pms.push(0);
        pms.push((channel % 10) + 0x30);
    }
    else {
        pms.push(...convertToAsciiAddress(channel))
    }
    pms.push(26)
    const check_sum = calculateCheckSum(pms);
    const data = [...getAdlAdh(screen), ...pms, check_sum];
    return data;
}

//获取 //修改设置 修改基本设置数据帧
export function getEditBaseSettingData(setting) {
    const {
        ph = 255,
        xgph = 255,
        hs = 1,
        mhzs = 8,
        zf = true,
        oe = false,
        m_sdot = 16,
        m_sdot_75e = 32,
        background_color_75e = 1,
        device_type = 1
    } = setting;
    //if (!channel) { channel = 0 };
    const adl_adh = getAdlAdh(ph);
    console.log('adl_adh', adl_adh);
    const pms = [];
    //cmd
    pms.push(65);

    //xgph修改屏号，高4位和低4位
    pms.push(...getH4L4(xgph));

    //行数hs，高4位和低4位
    pms.push(...getH4L4(hs));

    //每行字数mhzs，高4位和低4位
    pms.push(...getH4L4(mhzs));

    //窗口屏、综合屏、喇叭 正反和oe控制
    if ([1, 2, 3].includes(device_type)) {
        // oe和zf控制的两个字节
        if (oe) {
            if (zf) {
                pms.push(0x11);
            } else {
                pms.push(0x10);
            }
        } else {
            if (zf) {
                pms.push(0x00);
                pms.push(0x01);
            } else {
                pms.push(0x00);
                pms.push(0x00);
            }
        }
    }
    //75e
    else {
        if (oe) {
            pms.push(16 + background_color_75e);
        }
        else {
            pms.push(0);
            pms.push(background_color_75e);
        }
    }

    //窗口屏、喇叭 点阵控制
    if (device_type === 1 || device_type === 3) {
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
    }
    //综合屏固定16点阵
    else if (device_type === 2) {
        pms.push(65);
    }
    //75e
    else {
        //m_sdot
        let m_sdot_;
        if (m_sdot_75e === 16) {
            m_sdot_ = 65;
        } else if (m_sdot_75e === 24) {
            m_sdot_ = 66;
        } else if (m_sdot_75e === 32) {
            m_sdot_ = 67;
        } else {
            m_sdot_ = 16;
        }
        pms.push(m_sdot_);
    }
    //结束符
    pms.push(26);
    const check_sum = calculateCheckSum(pms);
    const data = [...adl_adh, ...pms, check_sum];
    return data;
}

//获取 //led显示内容发送 数据帧
export function getLedContendSendData(setting) {
    // if (typeof ph !== 'number' || ph < 0 || ph > 255) {
    //     throw new Error("屏号(ph)必须是0~255之间的数字");
    // }
    // if (typeof cmd !== 'string' || cmd.length !== 1) {
    //     throw new Error("cmd必须是一个单字符字符串");
    // }
    // if (typeof text !== 'string' || text.length === 0) {
    //     throw new Error("文本内容不能为空");
    // }
    const {
        ph = 255,
        encodeArray,
        cmd
    } = setting;

    const pms = [];
    const adl_adh = getAdlAdh(ph);

    // 命令
    pms.push(cmd.charCodeAt(0));

    // 文本内容（GBK编码）
    pms.push(...encodeArray);

    // 结束符 0x1A
    pms.push(0x1A);

    const check_sum = calculateCheckSum(pms);

    const data = [...adl_adh, ...pms, check_sum];
    return data;
}

//获取 //扩展设置 数据帧
export function getExtensionSettingData(setting) {

    const {
        ph = 255,
        move_effect_zh = 0,
        move_speed = 1,
        flashes_num = 5,
        align_type = 0,
        device_type = 1
    } = setting;
    const pms = [];
    const adl_adh = getAdlAdh(ph);

    // 命令 '@'
    pms.push('@'.charCodeAt(0));

    // 结构：分隔符0x10 + 设置项字母 + 参数(ASCII)

    //A移动速度
    pms.push(0x10);
    pms.push('A'.charCodeAt(0));
    pms.push(move_speed + 0x30);

    //B移动效果
    if (device_type === 2) {
        pms.push(0x10);
        pms.push('B'.charCodeAt(0));
        pms.push(move_effect_zh + 0x30);
    }
    //移动效果固定左移
    else {
        pms.push(0x10);
        pms.push('B'.charCodeAt(0));
        pms.push(0x33);
    }

    //C闪烁次数
    pms.push(0x10);
    pms.push('C'.charCodeAt(0));
    pms.push(flashes_num + 0x30);

    //D对齐方式
    pms.push(0x10);
    pms.push('D'.charCodeAt(0));
    pms.push(align_type + 0x30);

    // 结束标志
    pms.push(0x1A);

    // CRC 计算，从第3个字节开始异或
    const check_sum = calculateCheckSum(pms);

    const data = [...adl_adh, ...pms, check_sum];

    return data; // 返回最终帧数组
}

//获取 //喇叭音量 数据帧
export function getVolumeSettingData(setting) {
    const {
        ph = 255,
        volume = 11
    } = setting;
    const pms = [];
    const adl_adh = getAdlAdh(ph);

    // 命令 'L'
    pms.push('L'.charCodeAt(0));

    // 喇叭音量（转换为两位 ASCII）
    if (volume < 9) {
        let n1, n2;
        if (volume > 9) {
            n1 = volume / 10 + 0x30;
        } else {
            n1 = 0;
        }
        n2 = (volume % 10) + 0x30;

        pms.push(n1);
        pms.push(n2);
    }
    else {
        pms.push(...convertToAsciiAddress(volume))
    }

    // 结束标志
    pms.push(0x1A);

    // CRC 计算，从第3个字节开始异或
    const check_sum = calculateCheckSum(pms);

    const data = [...adl_adh, ...pms, check_sum];

    return data;
}