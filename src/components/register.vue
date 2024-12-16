<template>
    <div class="block" v-if="!registerState">
        <div class="block-dialog">
            <p>{{ expireDate == null ? '软件未授权，请联系供应商' : '软件授权已过期，请联系供应商' }}</p>
            <p v-if="expireDate != null">到期时间：{{ expireDate }}</p>
        </div>
        <div class="block-modal"></div>
    </div>
</template>
<script>
const { ipcRenderer } = require('electron');
export default {
    mounted() {
        ipcRenderer.send('check-register');
        ipcRenderer.on('register-state', this.receiveRegisterState);
    },
    data() {
        return {
            expireDate: null,
            registerState: true,
        }
    },
    methods: {
        receiveRegisterState(event, data) {
            console.log('接收到注册信息：', data);
            this.expireDate = data.expire;
            this.registerState = data.state;
        },
    },
    beforeUnmount() {
        ipcRenderer.removeListener('register-state', this.receiveRegisterState);
    }
}
</script>

<style scoped lang="scss">
.block-modal {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #3535355f;
    z-index: 1000;
}

.block-dialog {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    
    z-index: 1001;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (orientation: landscape) {
        width: 45%;
        height: 25vw;
        border-radius: 1vw;
    }

    @media (orientation: portrait) {
        width: 80vw;
        height: 40vh;
        border-radius: 2vh;
    }
}

.block-dialog p {
    margin: 10px;
    font-size: 22px;
}
</style>