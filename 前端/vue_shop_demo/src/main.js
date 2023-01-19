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

// 注册组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
