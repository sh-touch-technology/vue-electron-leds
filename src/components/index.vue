<template>
    <div class="common-layout">
        <el-container class="main-container" :style="{ width: leftWidth + 'px' }">
            <el-header class="head">
                <!-- 串口设置 -->
                <div class="groupbox" data-title="串口设置" style="flex: 2;">
                    <div class="groupbox-content row">
                        <el-select v-model="data.com_port_selected" filterable placeholder="请选择监听串口"
                            style="min-width: 220px;flex: 1;" :popper-options="popper_options">
                            <el-option v-for="item in com_port_list" :key="item.port" :label="item.port" :value="item.port"
                                style="display: flex;flex-direction: row;justify-content: space-between;">
                                <span style="">{{ item.port }}</span>
                                <span style="color: var(--el-text-color-secondary);font-size: 12px;">
                                    {{ item.name }}
                                </span>
                            </el-option>
                            <template #label>
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <span :style="computeSelectStyle(data.com_port_selected)">
                                        串口选择：{{ data.com_port_selected }}
                                    </span>
                                    <el-tag style="margin-left: auto;height: 20px;border-radius: 4px;"
                                        :type="com_state ? 'success' : 'info'">{{ com_state
                                            ? '监听中' : '未监听' }}</el-tag>
                                </div>
                            </template>
                        </el-select>
                        <div class="button-area nowrap">
                            <el-button type="primary" plain @click="getSerialPortList">刷新列表</el-button>
                            <el-button :type="com_state ? 'danger' : 'primary'" plain @click="openSerialPort">{{ com_state ?
                                '释放串口' : '打开串口' }}
                            </el-button>
                        </div>
                        <!-- <el-button type="primary" plain @click="sendSerialPortMessage">发送</el-button> -->
                    </div>
                </div>
                <!-- 屏号选择 -->
                <div class="groupbox" data-title="选择修改屏号" style="flex: 1;">
                    <div class="groupbox-content row">
                        <el-select v-model="data.screen_selected" filterable placeholder="请选择修改屏号"
                            style="min-width: 200px;flex: 1;" :popper-options="popper_options">
                            <el-option v-for="screen in Array.from({ length: 256 }, (_, i) => i)" :key="screen"
                                :label="screen" :value="screen"
                                style="display: flex;flex-direction: row;justify-content: space-between;">
                                <span style="">{{ screen }}</span>
                            </el-option>
                            <template #label>
                                <span :style="computeSelectStyle(data.screen_selected)">屏号选择：{{ data.screen_selected
                                }}</span>
                            </template>
                        </el-select>
                        <!-- <el-button type="primary" plain @click="sendSerialPortMessage">发送</el-button> -->
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
                            <!-- 行数 -->
                            <el-select v-model="data.line_num" filterable style="flex: 1;" :popper-options="popper_options">
                                <el-option :key="1" :label="1" :value="1">
                                    <span style="">1</span>
                                </el-option>
                                <el-option :key="2" :label="2" :value="2">
                                    <span style="">2</span>
                                </el-option>
                                <template #label>
                                    <span :style="computeSelectStyle(data.line_num)">行数：{{ data.line_num }}</span>
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
                                    <span :style="computeSelectStyle(data.line_text_num)">每行汉字数：{{ data.line_text_num
                                    }}</span>
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
                                    <span :style="computeSelectStyle(data.data_forward_or_reverse_direction)">数据正反向：{{
                                        data.data_forward_or_reverse_direction ? '正向' : '反向' }}</span>
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
                                    <span :style="computeSelectStyle(data.oe_polarity)">OE极性：{{ data.oe_polarity ? '正向' :
                                        '反向' }}</span>
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
                                    <span :style="computeSelectStyle(data.dot_matrix)">点阵选择：{{ data.dot_matrix }}</span>
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
                                    <span :style="computeSelectStyle(data.com_channel_selected)">信道选择：{{
                                        `${channelDefined[data.com_channel_selected].label}(${data.com_channel_selected})`
                                    }}</span>
                                </template>
                            </el-select>
                            <div class="button-area wrap">
                                <el-button type="primary" plain>主控读取</el-button>
                                <el-button type="primary" plain>主控修改</el-button>
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
                            <div class="log-item" v-for="item in log_list" :key="item.id"
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
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
import { channelDefined } from './channel';

//Popper.js配置
const popper_options = ref({ modifiers: [{ name: 'computeStyles', options: { gpuAcceleration: false, adaptive: false }, },], });

//串口列表
const com_port_list = ref([]);
//串口监听状态
const com_state = ref(false);
//日志列表
const log_list = ref([]);

//设置数据
const data = ref({
    com_port_selected: null, //选择的串口
    screen_selected: 255, //选择修改的屏号
    line_num: 1, //行数
    line_text_num: 8, //每行汉字数
    data_forward_or_reverse_direction: true, //数据正反向
    oe_polarity: false, //OE极性
    dot_matrix: 32, //点阵选择
    com_channel_selected: null, //信道选择
})

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
const sendSerialPortMessage = () => {
    const data = [191, 195, 82, 50, 51, 26];
    window.electron.sendSerialPortMessage(data);
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
        default:
            return {
                color: '#909399'
            }
    }
}

onMounted(() => {
    log('程序启动');
    // 监听串口状态
    cleanupFns.push(
        window.electron.onSerialState((state) => {
            console.log('收到串口状态', state);
            log(state.msg, state.flag)
        })
    );

    // 监听串口数据
    cleanupFns.push(
        window.electron.onSerialData((obj) => {
            console.log('串口收到消息', obj);
            //接收到串口列表
            if (obj.type === 'com_port_list') {
                com_port_list.value = obj.data;
                log(`串口列表获取成功 ${JSON.stringify(com_port_list.value.map(item => item.port))} ${com_port_list.value.length}个串口`, 'success');
                //未选择串口的情况下，自动选择一个串口
                if (com_port_list.value.length > 0 && !data.value.com_port_selected) {
                    data.value.com_port_selected = com_port_list.value[0].port;
                }
                //接收到串口打开
            } else if (obj.type === 'com-port-open') {
                com_state.value = true;
                log(`串口打开成功 ${data.value.com_port_selected}`, 'success');
                //接收到串口释放成功
            } else if (obj.type === 'com-port-release') {
                com_state.value = false;
                log(`串口释放`, 'primary');
            }
        })
    );

    // 监听串口消息
    cleanupFns.push(
        window.electron.onSerialMessage((data) => {
            console.log('串口收到消息', data);
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
                    max-height: 160px;
                    min-height: 160px;
                    gap: 2px;

                    .log-item {
                        display: flex;
                        flex-direction: row;
                        word-break: break-all;
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
    color: #7e7e7e;
}
</style>