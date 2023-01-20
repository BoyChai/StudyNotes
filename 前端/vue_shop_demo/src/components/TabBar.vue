<template>
  <div>
    <van-tabbar active-color="#ee0a24" route>
      <van-tabbar-item  v-for="(tab,index) in tabs" :key="index" :icon="tab.icon" :to="tab.path">{{tab.name}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
  export default {
    name:"MallMobileTabber",
    data(){
      return {
        tabs: [
          {
            name: "精选",
            icon: "compass-full",
            path:"/home"
          },{
            name: "分类",
            icon: "class-full",
            path:"/category"
          },{
            name: "购物车",
            icon: "cart-full",
            path: "/cart"
          },{
            name: "我的",
            icon: "wode",
            path: "/user"
          },
        ],
      };
    },
    mounted() {
    },
    methods() {

    },

  }
</script>

<style></style>