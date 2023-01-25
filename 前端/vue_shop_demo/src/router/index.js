import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入页面
import Home from '@/views/Home.vue'
import Cart from '@/views/Cart.vue'
import User from '@/views/User.vue'
import Category from '@/views/Category.vue'
import SearchBar from "@/components/SearchBar.vue";
import Login from "@/views/Login.vue";
import {getToken} from "@/utils/token";

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
      showTab: true,
      login: true
    },
  },{
    name:"User",
    path:"/user",
    component:User,
    meta:{
      showTab: true,
      login: true
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
  },{
    name: "Login",
    path: "/login",
    component: Login,
    meta:{
      showTab: false
    },
  }
]

// 重写push方法
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function(location){
  return originalPush.call(this, location).catch(err => err);
}

const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach((to,from,next) => {
  let token = getToken()
  if (!token) {
    // 没登陆
    if (to.meta.login) {
      // 登录充公跳转原页面
      next({name:"Login",query:{redirect: to.path}} )
    }
  }
  // 已经登陆过了,去原页面
  next()
});
export default router
