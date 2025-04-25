import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const ConfigDataStore = defineStore('ConfigData', () => {

    let init_tate = false;
    const config = ref({});

    const Init = (data) => {
        config.value = data;
        console.log('config存储初始化', config);
        setTimeout(()=>{
            init_tate = true;
        },1000)
    };

    //监听配置变化
    watch(
        () => config.value,
        (newVal, oldVal) => {
            console.log('person对象发生变化:', JSON.stringify(newVal));
            init_tate && window.electron.saveConfig(JSON.stringify(newVal)).then((result) => {
                if (result) {
                    console.log('保存成功')
                } else {
                    console.log("保存失败");
                }
            });
        },
        { deep: true }
    )

    return {
        config, Init
    }
})