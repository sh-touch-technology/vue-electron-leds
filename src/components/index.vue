<template>
    <div class="common-layout">
        <el-container class="main-container">
            <el-header class="head">
                <!-- 串口设置 -->
                <div class="groupbox" data-title="串口设置" style="flex: 2;">
                    <div class="groupbox-content row">
                        <el-select v-model="data.com_port_selected" filterable placeholder="请选择监听串口"
                            style="min-width: 220px;flex: 1;" :popper-options="popper_options">
                            <el-option v-for="item in com_port_list" :key="item.port" :label="item.port" :value="item.port"
                                style="display: flex;flex-direction: row;justify-content: space-between;">
                                <span style="">
                                    {{ item.port }}
                                </span>
                                <span style="color: var(--el-text-color-secondary);font-size: 12px;">
                                    {{ item.name }}
                                </span>
                            </el-option>
                            <template #label>
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <span class="selector-selected" :style="computeSelectStyle(data.com_port_selected)">
                                        <p class="selected-title">串口选择：</p>
                                        <p class="selected-content">{{ data.com_port_selected }}</p>
                                    </span>
                                    <el-tag style="margin-left: auto;height: 20px;border-radius: 4px;"
                                        :type="com_state ? 'success' : 'info'">
                                        {{ com_state ? '监听中' : '未监听' }}
                                    </el-tag>
                                </div>
                            </template>
                        </el-select>
                        <div class="button-area nowrap">
                            <el-button type="primary" plain @click="getSerialPortList">刷新列表</el-button>
                            <el-button :type="com_state ? 'danger' : 'primary'" plain @click="openSerialPort">
                                {{ com_state ? '释放串口' : '打开串口' }}
                            </el-button>
                        </div>
                    </div>
                </div>
                <!-- 屏号选择 -->
                <div class="groupbox" data-title="选择屏号" style="flex: 1;">
                    <div class="groupbox-content row">
                        <el-select v-model="data.screen_selected" filterable placeholder="请选择屏号"
                            style="min-width: 200px;flex: 1;" :popper-options="popper_options">
                            <el-option v-for="screen in Array.from({ length: 256 }, (_, i) => i)" :key="screen"
                                :label="screen" :value="screen"
                                style="display: flex;flex-direction: row;justify-content: space-between;">
                                <span style="">{{ screen }}</span>
                            </el-option>
                            <template #label>
                                <span class="selector-selected" :style="computeSelectStyle(data.screen_selected)">
                                    <p class="selected-title">屏号选择：</p>
                                    <p class="selected-content">{{ data.screen_selected }}</p>
                                </span>
                            </template>
                        </el-select>
                    </div>
                </div>
                <div class="close">
                    <div class="close-button">
                        <p>退出</p>
                    </div>
                </div>
            </el-header>
            <el-main class="main">
                <div class="setting">
                    <!-- 基本设置 -->
                    <div class="groupbox" data-title="基本设置" style="flex:1;">
                        <div class="groupbox-content column">
                            <!-- 修改屏号 -->
                            <el-select v-model="data.screen_edit" filterable placeholder="请选择修改屏号"
                                style="min-width: 200px;flex: 1;" :popper-options="popper_options">
                                <el-option v-for="screen in Array.from({ length: 256 }, (_, i) => i)" :key="screen"
                                    :label="screen" :value="screen"
                                    style="display: flex;flex-direction: row;justify-content: space-between;">
                                    <span style="">{{ screen }}</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.screen_edit)">
                                        <p class="selected-title">修改屏号：</p>
                                        <p class="selected-content">{{ data.screen_edit }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 行数 -->
                            <el-select v-model="data.line_num" filterable style="flex: 1;" :popper-options="popper_options">
                                <el-option :key="1" :label="1" :value="1">
                                    <span style="">1</span>
                                </el-option>
                                <el-option :key="2" :label="2" :value="2">
                                    <span style="">2</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.line_num)">
                                        <p class="selected-title">行数：</p>
                                        <p class="selected-content">{{ data.line_num }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 每行汉字数 -->
                            <el-select v-model="data.line_text_num" filterable style="flex: 1;"
                                :popper-options="popper_options">
                                <el-option v-for="item in Array.from({ length: 33 }, (_, i) => i)" :key="item" :label="item"
                                    :value="item">
                                    <span style="">{{ item }}</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.line_text_num)">
                                        <p class="selected-title">每行汉字数：</p>
                                        <p class="selected-content">{{ data.line_text_num }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 数据正反向 -->
                            <el-select v-model="data.data_forward_or_reverse_direction" style="flex: 1;"
                                :popper-options="popper_options">
                                <el-option :key="1" :label="'正向'" :value="true">
                                    <span style="">正向</span>
                                </el-option>
                                <el-option :key="2" :label="'反向'" :value="false">
                                    <span style="">反向</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected"
                                        :style="computeSelectStyle(data.data_forward_or_reverse_direction)">
                                        <p class="selected-title">数据正反向：</p>
                                        <p class="selected-content">
                                            {{ data.data_forward_or_reverse_direction ? '正向' : '反向' }}
                                        </p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- OE极性 -->
                            <el-select v-model="data.oe_polarity" style="flex: 1;" :popper-options="popper_options">
                                <el-option :key="1" :label="'正向'" :value="true">
                                    <span style="">正向</span>
                                </el-option>
                                <el-option :key="2" :label="'反向'" :value="false">
                                    <span style="">反向</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.oe_polarity)">
                                        <p class="selected-title">OE极性：</p>
                                        <p class="selected-content">{{ data.oe_polarity ? '正向' : '反向' }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 点阵选择 -->
                            <el-select v-model="data.dot_matrix" style="flex: 1;" :popper-options="popper_options">
                                <el-option :key="16" :label="16" :value="16">
                                    <span style="">16</span>
                                </el-option>
                                <el-option :key="24" :label="24" :value="24">
                                    <span style="">24</span>
                                </el-option>
                                <el-option :key="32" :label="32" :value="32">
                                    <span style="">32</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.dot_matrix)">
                                        <p class="selected-title">点阵选择：</p>
                                        <p class="selected-content">{{ data.dot_matrix }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <div class="button-area wrap">
                                <el-button type="primary" plain>修改设置</el-button>
                            </div>
                        </div>
                    </div>
                    <!-- 初始显示内容设置 -->
                    <div class="groupbox" data-title="初始显示内容设置" style="flex:1;">

                    </div>
                    <!-- 扩展设置 -->
                    <div class="groupbox" data-title="扩展设置" style="flex:1;">

                    </div>
                    <!-- 信道设置 -->
                    <div class="groupbox" data-title="无线信道" style="flex:1;">
                        <div class="groupbox-content column">
                            <el-select v-model="data.com_channel_selected" filterable style="min-width: 150px;flex: 1;"
                                :popper-options="popper_options">
                                <el-option v-for="item in channelDefined" :key="item.channel"
                                    :label="`${item.label}(${item.channel})`" :value="item.channel">
                                    <span style="float: left">{{ `${item.label}(${item.channel})` }}</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.com_channel_selected)">
                                        <p class="selected-title">信道选择：</p>
                                        <p class="selected-content">
                                            {{
                                                `${channelDefined[data.com_channel_selected].label}(${data.com_channel_selected})`
                                            }}
                                        </p>
                                    </span>
                                </template>
                            </el-select>
                            <div class="button-area wrap">
                                <el-button type="primary" plain @click="editMainControl()">主控修改</el-button>
                                <el-button type="primary" plain @click="readMainControl()">主控读取</el-button>
                                <el-button type="primary" plain>无线控制卡</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="test">
                    <!-- 测试显示指令 -->
                    <div class="groupbox" data-title="测试显示指令" style="flex:1;">
                        <el-button type="primary" plain @click="sendSerialPortMessage">测试发送</el-button>
                    </div>
                </div>
                <div class="log">
                    <!-- 日志 -->
                    <div class="groupbox" data-title="日志" style="flex:1;">
                        <div class="log-list" id="logContainer">
                            <el-segmented v-model="log_debug"
                                :options="[{ label: '普通', value: false }, { label: '调试', value: true }]"
                                style="position: absolute;right: 10px;top: 10px;" size="small"/>
                            <div class="log-item" v-for="item in show_log_list" :key="item.id"
                                :style="computeLogColor(item.level)">
                                <p>{{ item.time }} - {{ item.msg }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
            <el-footer class="footer"></el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick, toRefs, computed } from 'vue';
import { channelDefined } from './channel';
import { ConfigDataStore } from '@pinia/ConfigData.js';
import * as ledsUtil from './ledsUtil.js';

const ConfigData = ConfigDataStore();
//Popper.js配置
const popper_options = ref({ modifiers: [{ name: 'computeStyles', options: { gpuAcceleration: false, adaptive: false }, },], });

//串口列表
const com_port_list = ref([]);
//串口监听状态
const com_state = ref(false);
//日志列表
const log_list = ref([]);
//日志显示debug级别
const log_debug = ref(false);
//渲染日志列表
const show_log_list = computed(() => {
    console.log('log_debug.value',log_debug.value);
    if (log_debug.value) {
        return log_list.value;
    }
    const result = log_list.value.filter(item => item.level !== 'debug');
    return result;
})

//设置数据
const { config: data } = toRefs(ConfigData);

//日志函数
let log_id = 0;
const log = (msg, level) => {
    if (!level) { level = 'default' }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    log_list.value.push({
        id: log_id,
        time: time,
        msg: msg,
        level: level
    })
    log_id++;
    nextTick(() => {
        const logContainer = document.getElementById('logContainer');
        logContainer.scrollTop = logContainer.scrollHeight;
    });
}

//获取串口列表
const getSerialPortList = () => {
    window.electron.getSerialPortList();
}

//打开串口
const openSerialPort = () => {
    if (com_state.value) {
        window.electron.releaseSerialPort()
    }
    else {
        window.electron.openSerialPort(data.value.com_port_selected);
    }

}

//发送串口消息
const sendSerialPortMessage = (frame) => {
    window.electron.sendSerialPortMessage(frame);
}

//主控修改
const editMainControl = () =>{
    log('主控修改');
    const frame = ledsUtil.getEditMainControlData(data.value.com_channel_selected);
    sendSerialPortMessage(frame);
}

//主控读取
const readMainControl = () => {
    log('主控读取');
    const frame = ledsUtil.getReadMainControlData(data.value.com_channel_selected);
    sendSerialPortMessage(frame);
}

//保存取消监听渲染进程消息的函数
let cleanupFns = [];

//计算select颜色
const computeSelectStyle = (select) => {
    if (select != null && select !== '') {
        return {
            color: '#409EFF'
        };
    }
    return {};
}

//计算日志颜色
const computeLogColor = (level) => {
    switch (level) {
        case 'primary':
            return {
                color: '#409EFF'
            }
        case 'success':
            return {
                color: '#67C23A'
            }
        case 'warning':
            return {
                color: '#E6A23C'
            }
        case 'error':
            return {
                color: '#F56C6C'
            }
        case 'debug':
            return {
                color: '#b12dff'
            }
        default:
            return {
                color: '#909399'
            }
    }
}

onMounted(() => {
    log('程序启动');

    // 监听串口返回消息
    cleanupFns.push(
        window.electron.onSerialData((obj) => {
            switch (obj.type) {
                //接收到串口列表
                case 'com_port_list':
                    com_port_list.value = obj.data;
                    log(`串口列表获取成功 ${JSON.stringify(com_port_list.value.map(item => item.port))} ${com_port_list.value.length}个串口`, 'success');
                    //未选择串口的情况下，自动选择一个串口
                    if (com_port_list.value.length > 0 && !data.value.com_port_selected) {
                        data.value.com_port_selected = com_port_list.value[0].port;
                    }
                    break;
                //接收到串口打开
                case 'com-port-open':
                    com_state.value = true;
                    log(`串口打开成功 ${data.value.com_port_selected}`, 'success');
                    break;
                //接收到串口释放
                case 'com-port-release':
                    com_state.value = false;
                    log(`串口释放`, 'primary');
                    break;
                //接收到串口状态消息
                case 'com-state-message':
                    log(obj.msg, obj.flag)
                    break;
                default:
                    console.log('接收到渲染进程发送的串口未注册消息', obj);
                    break;
            }
        })
    );

    // 监听串口监听接收数据
    cleanupFns.push(
        window.electron.onSerialMessage((data) => {
            log(`串口接收：${data.join(' ')} hex(${data.map(num => num.toString(16).padStart(2, '0').toUpperCase()).join(' ')})`, 'debug')
        })
    );
    getSerialPortList();
});

onBeforeUnmount(() => {
    console.log('before unmounted');
    cleanupFns.forEach((cleanup) => cleanup());
    cleanupFns = [];
});
</script>
<script>

</script>

<style lang="scss" scoped>
.common-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    padding: 18px 10px 12px 10px;

    .main-container {
        display: flex;
        flex-direction: column;

        .head {
            height: auto;
            display: flex;
            min-width: 510px;
            padding: 0;

            flex-direction: row;
            gap: 10px;

            // @media (max-width: 950px) {
            //     flex-direction: column;
            //     gap: 15px;
            // }

            // @media (min-width: 950px) {
            //     flex-direction: row;
            //     gap: 10px;
            // }
            .close {
                .close-button {
                    width: 120px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgb(236 245 255);
                    border: 1px solid;
                    border-radius: 3px;
                    border-color: rgb(160 207 255);
                    color: #409EFF;
                    cursor: pointer;

                    p {
                        margin-bottom: 2px;
                        margin-left: 5px;
                        letter-spacing: 5px;
                    }
                }

                .close-button:hover {
                    color: white;
                    background-color: #409EFF;
                }
            }
        }

        .main {
            flex: 1;
            padding: 18px 0 0 0;
            display: flex;
            flex-direction: column;
            gap: 18px;

            .setting {
                flex: 1;
                display: flex;
                flex-direction: row;
                gap: 10px;
            }

            .test {
                flex: 1;
                display: flex;
                flex-direction: row;
                gap: 10px;
            }

            .log {
                display: flex;
                flex-direction: row;
                gap: 10px;

                .groupbox {
                    padding-top: 12px;
                }

                .log-list {
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    max-height: 152px;
                    min-height: 152px;
                    gap: 4px;

                    .log-item {
                        display: flex;
                        flex-direction: row;
                        word-break: break-all;
                        font-size: 14px;
                    }
                }
            }
        }

        .footer {
            padding: 0;
            height: auto;
        }
    }
}

.groupbox {
    position: relative;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3.5px;

    .groupbox-content {
        padding-top: 5px;
        display: flex;

        .button-area.wrap {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .button-area.wrap>* {
            flex: 1;
            margin: 0;
        }

        .button-area.nowrap {
            display: flex;
            flex-wrap: nowrap;
            margin-left: 12px;
        }
    }

    .groupbox-content.row {
        flex-direction: row;
    }

    .groupbox-content.column {
        flex-direction: column;
        gap: 10px;
    }
}

.groupbox::before {
    content: attr(data-title);
    position: absolute;
    top: -12px;
    left: 10px;
    background-color: white;
    padding: 0 5px;
    color: #363636;
}

.selector-selected {
    display: flex;
    flex-direction: row;

    .selected-title {
        color: #252525;
    }
}
</style>