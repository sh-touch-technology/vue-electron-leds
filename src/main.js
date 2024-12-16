import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router/index.js'
const { ipcRenderer } = require('electron');

const app = createApp(App)
app.use(router);
app.use(ElementPlus, {
    locale: zhCn,
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 异步获取配置信息
ipcRenderer.invoke('get-config-data').then((configData) => {
    console.log(configData);
    app.provide('config', configData);
    app.mount('#app');
});
