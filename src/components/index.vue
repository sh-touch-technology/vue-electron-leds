<template>
    <h1>index</h1>
    <p>配置信息：{{ config }}</p>
    <register />
</template>
<script>
import { inject } from 'vue';
import register from './register.vue';
export default {
    components: { register },
    mounted() {
        console.log('this.config'+this.config);
    },
    data() {
        return {
            config: inject('config'),
        }
    },
    methods: {
        
    },
    beforeUnmount() {
        
    }
}
</script>

<style scoped>

</style>