<template>
  <div id="app">
    <TarBar></TarBar>
  </div>
</template>

<script>
// 引入自定义的组件
import TarBar from '@/components/TabBar.vue'

export default  {
  data() {
    return {

    }
  },
  // 注册组件
  components:{
    TarBar
  }
}
</script>

<style>

</style>
