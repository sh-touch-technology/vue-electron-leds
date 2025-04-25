import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'dayjs/locale/zh-cn';
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router/index.js'
import { ConfigDataStore } from '@pinia/ConfigData.js'

const app = createApp(App)
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(ElementPlus, {
    locale: zhCn,
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 异步获取配置信息
//ipcRenderer.invoke('getConfigData').then((configData) => {
window.electron.getConfigData().then((configData) => {
    console.log('获取到配置信息：', configData);
    ConfigDataStore().Init(configData);
    app.mount('#app');
});