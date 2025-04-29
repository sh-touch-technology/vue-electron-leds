<template>
  <el-dialog v-model="visible" :title="title" top="35vh" width="500px" @close="handleClose" class="confirm">
    <div class="warning">
      <el-alert :title="message" type="warning" :closable="false" show-icon>
      </el-alert>
    </div>
    <template #footer>
      <div class="foot">
        <el-button @click="handleCancel" style="width: 100px;height: 35px;">取消</el-button>
        <el-button type="primary" @click="handleConfirm" style="width: 100px;height: 35px;">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('提示')
const message = ref('确定要执行该操作吗？')

let resolveCallback = null

// 打开对话框并返回 Promise
const openConfirm = (options = {}) => {
  title.value = options.title || '提示'
  message.value = options.message || '确定要执行该操作吗？'
  visible.value = true

  return new Promise((resolve) => {
    resolveCallback = resolve
  })
}

const handleConfirm = () => {
  visible.value = false
  resolveCallback?.(true)
  resolveCallback = null
}

const handleCancel = () => {
  visible.value = false
  resolveCallback?.(false)
  resolveCallback = null
}

const handleClose = () => {
  resolveCallback?.(false)
  resolveCallback = null
}

defineExpose({
  openConfirm
})
</script>

<style lang="scss">
.confirm {
  .el-dialog__title {
    font-size: 16px;
  }
}
</style>
<style scoped>
.warning {
  margin-bottom: 20px;
}

.warning .el-alert {
  margin: 0;
}
</style>