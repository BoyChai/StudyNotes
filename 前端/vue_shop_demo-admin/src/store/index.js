import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menus:[
      {title:'首页',icon:'s-home',isSubMenu:false,path:'/',children:[]},
      {title:'商品管理',icon:'user',isSubMenu:true,path:"/goods",children:[
          {title:'商品列表',icon:'list',isSubMenu:false,path:'/goods/list'},
          {title:'商品上架',icon:'save',isSubMenu:false,path:'/goods/create'},
        ]
      }
    ],
    activePath:"/",
    currentMenu:[],
    tags:[ {title:'首页',icon:'s-home',isSubMenu:false,path:'/',children:[]},],

  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
