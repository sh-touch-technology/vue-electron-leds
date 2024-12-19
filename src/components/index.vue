<template>
    <div class="common-layout">
        <el-container class="main-container" :style="{ width: leftWidth + 'px' }">
            <el-header class="head">
                <div class="groupbox" data-title="串口设置">
                    <div class="groupbox-content">
                        <el-select v-model="com_port_selected" clearable placeholder="请选择监听串口"
                            style="min-width: 220px;flex: 1;" :popper-options="{
                                modifiers: [
                                    {
                                        name: 'computeStyles',
                                        options: { gpuAcceleration: false, adaptive: false },
                                    },
                                ],
                            }">
                            <el-option v-for="item in com_port_list" :key="item.port" :label="item.port" :value="item.port"
                                style="display: flex;flex-direction: row;justify-content: space-between;">
                                <span style="">{{ item.port }}</span>
                                <span style="color: var(--el-text-color-secondary);font-size: 12px;">
                                    {{ item.name }}
                                </span>
                            </el-option>
                            <template #label>
                                <span>串口监听：{{ com_port_selected }}</span>
                            </template>
                        </el-select>
                        <div class="button-area">
                            <el-button type="primary" plain @click="getSerialPortList">刷新列表</el-button>
                            <el-button :type="com_state ? 'danger' : 'primary'" plain @click="openSerialPort">{{ com_state ?
                                '释放' : '打开' }}
                            </el-button>
                        </div>
                        <!-- <el-button type="primary" plain @click="sendSerialPortMessage">发送</el-button> -->
                    </div>
                </div>
                <div class="groupbox" data-title="信道设置">
                    <div class="groupbox-content">
                        <el-select v-model="com_channel_selected" clearable style="min-width: 150px;flex: 1;"
                            :popper-options="{
                                modifiers: [
                                    {
                                        name: 'computeStyles',
                                        options: { gpuAcceleration: false, adaptive: false },
                                    },
                                ],
                            }">
                            <el-option v-for="item in channelDefined" :key="item.channel"
                                :label="`${item.label}(${item.channel})`" :value="item.channel">
                                <span style="float: left">{{ `${item.label}(${item.channel})` }}</span>
                            </el-option>
                            <template #label>
                                <span>信道：{{ `${channelDefined[com_channel_selected].label}(${com_channel_selected})`
                                }}</span>
                            </template>
                        </el-select>
                        <div class="button-area">
                            <el-button type="primary" plain>主控读取</el-button>
                            <el-button type="primary" plain>主控修改</el-button>
                            <el-button type="primary" plain>无线控制卡</el-button>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main class="main">Main
                <el-button type="primary" plain @click="sendSerialPortMessage">测试发送</el-button>
            </el-main>
            <el-footer class="footer">Footer</el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { channelDefined } from './channel';

const com_port_list = ref([]);
const com_port_selected = ref('');
const com_state = ref(false);

const com_channel_selected = ref('');

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

    .main-container {
        .head {
            padding: 0;
            height: auto;
            display: flex;
            min-width: 510px;

            padding: 15px 10px;

            @media (max-width: 950px) {
                flex-direction: column;
                gap: 15px;
            }

            @media (min-width: 950px) {
                flex-direction: row;
                gap: 10px;
            }
        }

        .main {
            flex: 1;
            padding: 0;
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
    flex: 1;

    .groupbox-content {
        padding-top: 5px;
        display: flex;
        flex-direction: row;

        .button-area {
            display: flex;
            flex-wrap: nowrap;
            margin-left: 12px;
        }
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