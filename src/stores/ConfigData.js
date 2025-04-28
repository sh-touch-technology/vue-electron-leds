import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const ConfigDataStore = defineStore('ConfigData', () => {

    let init_tate = false;
    const config = ref({});

    const Init = (data) => {
        init_tate = false;
        config.value = data;
        console.log('config存储初始化', config);
        setTimeout(() => {
            init_tate = true;
        }, 1000)
    };

    const resetSetting = () => {
        window.electron.resetSetting().then((configData) => {
            console.log('获取到配置信息：', configData);
            ConfigDataStore().Init(configData);
        });
    }

    //监听配置变化
    watch(
        () => config.value,
        (newVal, oldVal) => {
            console.log('person对象发生变化:');
            init_tate && window.electron.saveConfig(JSON.stringify(newVal)).then((result) => {
                if (result) {
                    //console.log('保存成功')
                } else {
                    console.error("配置文件保存失败");
                }
            });
        },
        { deep: true }
    )

    return {
        config, Init, resetSetting
    }
})