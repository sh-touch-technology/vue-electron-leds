<template>
  <div class="conatiner" :style="{ zoom: scale }">
    <div class="toolbar">
      <toolbar />
    </div>
    <div class="main"><router-view></router-view>
      <div v-if="$route.matched.length === 0">
        <h1>404 - 页面未找到</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import toolbar from './components/toolbar.vue';
import { ref } from 'vue';

const scale = ref(1)

window.electron.getCurrentScale().then(v => {
  scale.value = v
})
</script>

<style scoped>
.conatiner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* zoom: 0.8; */
  /* transform-origin: top left;
  transform: scale(0.8); */
}

.toolbar {}

.main {
  flex: 1;
  overflow: auto;
}
</style>

<style>
.el-segmented__item-selected {}
</style>