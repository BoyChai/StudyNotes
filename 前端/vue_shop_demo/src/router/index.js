import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入页面
import Home from '@/views/Home.vue'
import Cart from '@/views/Cart.vue'
import User from '@/views/User.vue'
import Category from '@/views/Category.vue'

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
  },{
    name:"Cart",
    path:"/cart",
    component:Cart,
  },{
    name:"User",
    path:"/user",
    component:User,
  },{
    name:"Category",
    path:"/category",
    component:Category,
  },
]

const router = new VueRouter({
  routes
})

export default router
