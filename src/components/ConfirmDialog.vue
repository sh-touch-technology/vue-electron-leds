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

  <el-dialog v-model="error_visible" :title="error_title" top="35vh" width="550px" @close="handleClose" class="confirm">
    <div class="warning">
      <el-alert :title="error_message" type="error" :closable="false" show-icon></el-alert>
      <el-alert :title="code" type="warning" :closable="false" v-if="code" style="margin-top: 10px;"></el-alert>
    </div>
    <template #footer>
      <div class="foot">
        <el-button @click="error_visible = false" style="width: 100px;height: 35px;">取消</el-button>
        <el-button type="primary" @click="error_visible = false" style="width: 100px;height: 35px;">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('提示')
const message = ref('确定要执行该操作吗？')

const error_visible = ref(false)
const error_title = ref('错误')
const error_message = ref('出现了一个错误')
const code = ref(null)

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

// 打开错误提示对话框
const openError = (options = {}) => {
  if (options.code) {
    code.value = '运行命令：'+options.code;
  } else {
    code.value = null;
  }
  error_title.value = options.title || '错误'
  error_message.value = options.message || '出现了一个错误'
  error_visible.value = true
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
  openConfirm, openError
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