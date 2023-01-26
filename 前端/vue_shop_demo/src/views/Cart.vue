<template>
  <div>
    <!-- 顶部编辑 -->
    <div  class="cart-header">
      <van-icon :name="isEditor?'success':'editor'"></van-icon>
      <span @click="isEditor=!isEditor">{{ isEditor?'完成':'编辑' }}</span>
    </div>
    <!-- 购物车商品列表 -->
    <div>
      <van-checkbox-group v-model="checkedGoods" @change="groupChange">
        <van-swipe-cell :disabled="!isEditor" v-for="(item,index) in cartInfo.cartList":key="index">
          <!-- 自定义显示内容 -->
          <div class="goods-item">
            <van-checkbox style="margin-left: 10px" v-model="item.checked" :name="item.id"></van-checkbox>
            <van-card
              :num="item.number"
              :price="item.price|priceFormat"
              :title="item.goodsName"
              :thumb="item.picUrl"
              style="width: 100%;background-color:white;"
            >
              <!-- 规格 -->
              <template #tags>
                <div>
                  <van-tag plain v-for="(s,index) in item.specifications":key="index">{{s}}</van-tag>
                </div>
              </template>
              <!-- 底部日期 -->
              <template #footer>
                <div v-if="!isEditor">添加日期{{item.addTime}}</div>
                <van-stepper @change="numChange(item)" v-else v-model="item.number"></van-stepper>
              </template>
            </van-card>
          </div>
          <!-- 右边划出的内容 -->
          <template #right>
            <van-button style="height: 100%" text="删除" type="danger" @click="delItem(item)"></van-button>
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>

    <div v-if="!cartInfo.cartList.length">购物车空空如也</div>

    <!-- 顶部结算 -->
    <van-submit-bar
      :loading="loading"
      :price="totalPrice"
      :button-text="isEditor?'删除':'结算'"
      :label="'总计'"
      @submit="cartSubmit"
      style="margin-bottom: 50px"
    >
      <van-checkbox v-model="checkedAll" @click="checkedAllChange">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import  _ from 'lodash'
import {getCart} from "@/api/api";
export default {
  name: "Cart",
  data() {
    return{
      loading: false,
      checkedAll:false,
      checkKeyCodes: [],
      isEditor: false,
      cartInfo: {},
      checkedGoods:[],
    }
  },
  /*计算属性*/
  computed:{
    totalPrice(){
      return this.cartInfo.cartList.reduce((total,item) => {
        return total+=this.checkedGoods.indexOf(item.id)!== -1?(item.price*item.number*100):0
      },0);
    }
  },
  created(){
    getCart().then(resp => {
      this.cartInfo = resp.data.data
      // this.checkedGoods = this.getCheckedList()
      this.getCheckedList()
      this.groupChange()
    })
  },
  methods: {
    cartSubmit(){
      if (this.isEditor){
        let delArray = [];
        this.cartInfo.cartList.forEach(p => {
          delArray.push(p.productId)
        })
        console.log(`删除${delArray}`)
        this.cartInfo.cartList = []
        this.isEditor = false
      } else {
        console.info("正在结算")
        this.loading =true
      }
    },
    numChange(item) {
      console.log(item)
    },
    delItem(item){
      let delArray = [item.productId]
      // 原生js实现
      // this.cartInfo.cartList.forEach((s,index) => {
      //   if (s.id==item.id) {
      //     this.cartInfo.cartList.splice(index,1)
      //   }
      // })
      let index = _.findIndex(this.cartInfo.cartList,e=> e.id==item.id)
      this.cartInfo.cartList.splice(index,1)

    },
    checkedAllChange() {
      if (this.checkedAll){
        this.checkedGoods = []
        this.cartInfo.cartList.forEach(p => {
          this.checkedGoods.push(p.id)
        })
      } else {
        this.checkedGoods= []
      }
    },
    groupChange(checkedData) {
      this.checkedAll = this.checkedGoods.length===this.cartInfo.cartList.length
      let checkedArray=[]
      let uncheckedArray=[];
      _.each(this.cartInfo.cartList,item => {
        if (checkedData.indexOf(item.id)!==-1){
          checkedArray.push(item.productId)
        } else {
          uncheckedArray.push(item.productId)
        }
      })


    },
    getCheckedList() {
      this.cartInfo.cartList.forEach(p => {
        if (p.checked){
          this.checkedGoods.push(p.id)
        }
      })
    }
  },
}
</script>

<style scoped>
.cart-header{
  text-align: right;
  height: 46px;
  line-height: 46px;
  margin-right: 15px;
}
.goods-item{
  display: flex;
  align-items: center;
}
</style>