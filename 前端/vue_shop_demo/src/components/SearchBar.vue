<template>
<div>
  <van-search placeholder="搜索" @click="toSearch"></van-search>
</div>
</template>

<script>
import router from "@/router";

export default {
  name: "SearchBar",
  methods:{
    toSearch(){
      this.$router.push("/searchbar")
    }
  }
}
</script>

<style scoped>

</style>