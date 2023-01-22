import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入页面
import Home from '@/views/Home.vue'
import Cart from '@/views/Cart.vue'
import User from '@/views/User.vue'
import Category from '@/views/Category.vue'
import SearchBar from "@/components/SearchBar.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect:"/home"
  },
  {
    name:"Home",
    path:"/home",
    component:Home,
    meta:{
      showTab: true
    },
  },{
    name:"Cart",
    path:"/cart",
    component:Cart,
    meta:{
      showTab: true
    },
  },{
    name:"User",
    path:"/user",
    component:User,
    meta:{
      showTab: true
    },
  },{
    name:"Category",
    path:"/category",
    component:Category,
    meta:{
      showTab: true
    },
  },{
  name: "SearchBar",
    path: "/searchbar",
    component: SearchBar,
    meta:{
      showTab: false
    },
  }
]

const router = new VueRouter({
  routes
})

export default router
