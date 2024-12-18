<template>
    <div class="common-layout">
        <el-container>
            <el-header class="head">
                <div class="groupbox" data-title="串口设置">
                    <div class="groupbox-content">
                        <el-select v-model="com_port_selected" clearable placeholder="请选择监听串口" style="width: 220px;flex: 1;"
                            :popper-options="{
                            modifiers: [
                                {
                                    name: 'computeStyles',
                                    options: { gpuAcceleration: false, adaptive: false },
                                },
                            ],
                        }">
                            <el-option v-for="item in com_port_list" :key="item.port" :label="item.port"
                                :value="item.port">
                                <span style="float: left">{{ item.port }}</span>
                                <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                                    {{ item.name }}
                                </span>
                            </el-option>
                        </el-select>
                        <div class="button-area">
                            <el-button type="primary" plain @click="getSerialPortList">刷新列表</el-button>
                            <el-button :type="com_state ? 'danger' : 'primary'" plain
                                @click="openSerialPort">{{ com_state ? '释放' : '打开' }}
                            </el-button>
                        </div>
                        <!-- <el-button type="primary" plain @click="sendSerialPortMessage">发送</el-button> -->
                    </div>
                </div>
                <div class="groupbox" data-title="信道设置">
                    <div class="groupbox-content">
                        <el-select v-model="com_port_selected" clearable placeholder="请选择监听串口" style="width: 150px;flex: 1;"
                            :popper-options="{
                            modifiers: [
                                {
                                    name: 'computeStyles',
                                    options: { gpuAcceleration: false, adaptive: false },
                                },
                            ],
                        }">
                            <el-option v-for="item in com_port_list" :key="item.port" :label="item.port"
                                :value="item.port">
                                <span style="float: left">{{ item.port }}</span>
                                <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                                    {{ item.name }}
                                </span>
                            </el-option>
                        </el-select>
                        <div class="button-area">
                            <el-button type="primary" plain @click="getSerialPortList">刷新列表</el-button>
                            <el-button :type="com_state ? 'danger' : 'primary'" plain
                                @click="openSerialPort">{{ com_state ? '释放' : '打开' }}
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main class="main">Main</el-main>
            <el-footer class="footer">Footer</el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { channelDefined } from './channel';

const com_port_list = ref([]);
const com_port_selected = ref('');
const com_state = ref(false);

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
    window.electron.sendSerialPortMessage('FF 00 16');
}
onMounted(() => {
    //监听串口调用回传状态消息
    window.electron.onSerialState((state) => {
        console.log('收到串口状态', state);
    });
    //监听串口调用数据回传
    window.electron.onSerialData((obj) => {
        console.log('串口收到消息', obj);
        if (obj.type === 'com_port_list') {
            com_port_list.value = obj.data;
            if (com_port_list.value.length > 0 && com_port_selected.value == '') {
                com_port_selected.value = com_port_list.value[0].port;
            }
        }
        else if (obj.type === 'com-port-open') {
            com_state.value = true;
        }
        else if (obj.type === 'com-port-release') {
            com_state.value = false;
        }
    })
    //监听串口接收消息
    window.electron.onSerialMessage((data) => {
        console.log('串口收到消息', data);
    })
    getSerialPortList();
});
</script>

<style lang="scss" scoped>
.common-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .head {
        padding: 0;
        height: auto;
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 0 10px;
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

.groupbox {
    position: relative;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3.5px;
    margin: 15px 0px;
    flex: 1;

    .groupbox-content {
        padding-top: 5px;
        display: flex;
        flex-direction: row;
        .button-area{
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