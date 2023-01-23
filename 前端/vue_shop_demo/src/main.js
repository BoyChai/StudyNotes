import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import  "@/assets/reset.css"
// 引入Vant组件
import Vant from 'vant'
// 引入Vant样式
import 'vant/lib/index.css';
// 引入iconfont图标
import '@/assets/iconfont/iconfont.css'
// 请求拦截
import './api/mock'
// 过滤器
import * as filters from '@/filter'
import vuexEsm from "vuex";

// 动画
import 'animate.css'
// 注册组件
Vue.use(Vant)
// 注册Vues过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key,filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
