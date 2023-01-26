import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入页面
import Layout from "@/views/Layout.vue";
import Home from "@/views/Home.vue";
import GoodsCreate from "@/views/goods/Create.vue";
import GoodsList from "@/views/goods/List.vue";

Vue.use(VueRouter)

const routes = [
  {
    name:"layout",
    path:"/",
    component:Layout,
    children:[{
      name: "layout",
      path:"/",
      component:Home
    },{
      name: 'goodslist',
      path: 'goods/list',
      component: GoodsList
    },{
      name: 'goodscreate',
      path: 'goods/create',
      component: GoodsCreate
    }]
  },
]

const router = new VueRouter({
  routes
})

export default router
