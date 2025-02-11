<template>
    <div class="common-layout">
        <el-container class="main-container" :style="{ width: leftWidth + 'px' }">
            <el-header class="head">
                <!-- 串口设置 -->
                <div class="groupbox" data-title="串口设置" style="flex: 1;">
                    <div class="groupbox-content row">
                        <el-select v-model="com_port_selected" filterable placeholder="请选择监听串口"
                            style="min-width: 220px;flex: 1;" :popper-options="popper_options">
                            <el-option v-for="item in com_port_list" :key="item.port" :label="item.port"
                                :value="item.port"
                                style="display: flex;flex-direction: row;justify-content: space-between;">
                                <span style="">{{ item.port }}</span>
                                <span style="color: var(--el-text-color-secondary);font-size: 12px;">
                                    {{ item.name }}
                                </span>
                            </el-option>
                            <template #label>
                                <span>串口选择：{{ com_port_selected }}</span>
                            </template>
                        </el-select>
                        <div class="button-area nowrap">
                            <el-button type="primary" plain @click="getSerialPortList">刷新列表</el-button>
                            <el-button :type="com_state ? 'danger' : 'primary'" plain
                                @click="openSerialPort">{{ com_state ? '释放串口' + com_port_selected : '打开串口' }}
                            </el-button>
                        </div>
                        <!-- <el-button type="primary" plain @click="sendSerialPortMessage">发送</el-button> -->
                    </div>
                </div>
                <!-- 屏号选择 -->
                <div class="groupbox" data-title="选择修改屏号">
                    <div class="groupbox-content row">
                        <el-select v-model="screen_selected" filterable placeholder="请选择修改屏号"
                            style="min-width: 200px;flex: 1;" :popper-options="popper_options">
                            <el-option v-for="screen in Array.from({ length: 256 }, (_, i) => i)" :key="screen"
                                :label="screen" :value="screen"
                                style="display: flex;flex-direction: row;justify-content: space-between;">
                                <span style="">{{ screen }}</span>
                            </el-option>
                            <template #label>
                                <span>屏号选择：{{ screen_selected }}</span>
                            </template>
                        </el-select>
                        <!-- <el-button type="primary" plain @click="sendSerialPortMessage">发送</el-button> -->
                    </div>
                </div>
            </el-header>
            <el-main class="main">
                <div class="setting">
                    <!-- 基本设置 -->
                    <div class="groupbox" data-title="基本设置" style="flex:1;">
                        <div class="groupbox-content column">
                            <!-- 修改屏号 -->
                            <el-select v-model="screen_modify" filterable style="flex: 1;"
                                :popper-options="popper_options">
                                <el-option v-for="screen in Array.from({ length: 256 }, (_, i) => i)" :key="screen"
                                    :label="screen" :value="screen">
                                    <span style="">{{ screen }}</span>
                                </el-option>
                                <template #label>
                                    <span>修改屏号：{{ screen_modify }}</span>
                                </template>
                            </el-select>
                            <!-- 行数 -->
                            <el-select v-model="line_num" filterable style="flex: 1;" :popper-options="popper_options">
                                <el-option :key="1" :label="1" :value="1">
                                    <span style="">1</span>
                                </el-option>
                                <el-option :key="2" :label="2" :value="2">
                                    <span style="">2</span>
                                </el-option>
                                <template #label>
                                    <span>行数：{{ line_num }}</span>
                                </template>
                            </el-select>
                            <!-- 每行汉字数 -->
                            <el-select v-model="line_text_num" filterable style="flex: 1;"
                                :popper-options="popper_options">
                                <el-option v-for="item in Array.from({ length: 33 }, (_, i) => i)" :key="item"
                                    :label="item" :value="item">
                                    <span style="">{{ item }}</span>
                                </el-option>
                                <template #label>
                                    <span>每行汉字数：{{ line_text_num }}</span>
                                </template>
                            </el-select>
                            <!-- 数据正反向 -->
                            <el-select v-model="data_forward_or_reverse_direction" style="flex: 1;" :popper-options="popper_options">
                                <el-option :key="1" :label="'正向'" :value="true">
                                    <span style="">正向</span>
                                </el-option>
                                <el-option :key="2" :label="'反向'" :value="false">
                                    <span style="">反向</span>
                                </el-option>
                                <template #label>
                                    <span>数据正反向：{{ data_forward_or_reverse_direction ? '正向' : '反向' }}</span>
                                </template>
                            </el-select>
                            <!-- OE极性 -->
                            <el-select v-model="oe_polarity" style="flex: 1;" :popper-options="popper_options">
                                <el-option :key="1" :label="'正向'" :value="true">
                                    <span style="">正向</span>
                                </el-option>
                                <el-option :key="2" :label="'反向'" :value="false">
                                    <span style="">反向</span>
                                </el-option>
                                <template #label>
                                    <span>OE极性：{{ oe_polarity ? '正向' : '反向' }}</span>
                                </template>
                            </el-select>
                            <!-- 点阵选择 -->
                            <el-select v-model="dot_matrix" style="flex: 1;" :popper-options="popper_options">
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
                                    <span>点阵选择：{{ dot_matrix }}</span>
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
                    <!-- 信道设置 -->
                    <div class="groupbox" data-title="无线信道" style="flex:1;">
                        <div class="groupbox-content column">
                            <el-select v-model="com_channel_selected" filterable style="min-width: 150px;flex: 1;"
                                :popper-options="popper_options">
                                <el-option v-for="item in channelDefined" :key="item.channel"
                                    :label="`${item.label}(${item.channel})`" :value="item.channel">
                                    <span style="float: left">{{ `${item.label}(${item.channel})` }}</span>
                                </el-option>
                                <template #label>
                                    <span>信道选择：{{ `${channelDefined[com_channel_selected].label}(${com_channel_selected})` }}</span>
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
                <el-button type="primary" plain @click="sendSerialPortMessage">测试发送</el-button>
            </el-main>
            <el-footer class="footer">Footer</el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { channelDefined } from './channel';

const popper_options = ref({ modifiers: [{ name: 'computeStyles', options: { gpuAcceleration: false, adaptive: false }, },], });

//串口列表
const com_port_list = ref([]);
//当前选择串口
const com_port_selected = ref('');
//串口监听状态
const com_state = ref(false);

//修改屏号
const screen_modify = ref(255);
//行数
const line_num = ref(1);
//每行汉字数
const line_text_num = ref(8);
//数据正反向
const data_forward_or_reverse_direction = ref(true);
//OE极性
const oe_polarity = ref(false);
//点阵选择
const dot_matrix = ref(32);

//当前选择信道
const com_channel_selected = ref('');
//当前选择屏号
const screen_selected = ref(255);

const getSerialPortList = () => {
    window.electron.getSerialPortList();
}
const openSerialPort = () => {
    if (com_state.value) {
        window.electron.releaseSerialPort()
    }
    else {
        window.electron.openSerialPort(com_port_selected.value);
    }

}

const sendSerialPortMessage = () => {
    const data = [191, 195, 82, 50, 51, 26];
    window.electron.sendSerialPortMessage(data);
}

let cleanupFns = [];
onMounted(() => {
    // 监听串口状态
    cleanupFns.push(
        window.electron.onSerialState((state) => {
            console.log('收到串口状态', state);
        })
    );

    // 监听串口数据
    cleanupFns.push(
        window.electron.onSerialData((obj) => {
            console.log('串口收到消息', obj);
            if (obj.type === 'com_port_list') {
                com_port_list.value = obj.data;
                if (com_port_list.value.length > 0 && com_port_selected.value === '') {
                    com_port_selected.value = com_port_list.value[0].port;
                }
            } else if (obj.type === 'com-port-open') {
                com_state.value = true;
            } else if (obj.type === 'com-port-release') {
                com_state.value = false;
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
    padding: 15px 10px;

    .main-container {
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
        }

        .main {
            flex: 1;
            padding: 15px 0 0 0;

            .setting {
                flex: 1;
                display: flex;
                flex-direction: row;
                gap: 10px;
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