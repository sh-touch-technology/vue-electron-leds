<template>
    <div class="common-layout">
        <el-container>
            <el-header class="head">
                <el-button type="primary" plain @click="openSerialPort">打开串口</el-button>
                <el-button type="primary" plain @click="sendSerialPortMessage">发送</el-button>
            </el-header>
            <el-main class="main">Main</el-main>
            <el-footer class="footer">Footer</el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const openSerialPort = () => {
    window.electron.openSerialPort('com2')
}

const sendSerialPortMessage = () => {
    window.electron.sendSerialPortMessage('FF 00 16');
}
onMounted(() => {
    //监听串口回传状态消息
    window.electron.onSerialState((state) => {
        console.log('收到串口状态', state);
    });
    //监听串口接收消息
    window.electron.onSerialData((data) => {
        console.log('串口收到消息', data);
    })
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
</style>