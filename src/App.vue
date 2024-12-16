<template>
  <router-view></router-view>
  <div v-if="$route.matched.length === 0">
    <h1>404 - 页面未找到</h1>
  </div>
</template>

<script>
import './assets/main.css'
export default {
  components: {
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
