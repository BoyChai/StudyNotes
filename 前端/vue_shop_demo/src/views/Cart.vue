<template>
  <div>
    <!-- 顶部编辑 -->
    <div  class="cart-header">
      <van-icon :name="isEditor?'success':'editor'"></van-icon>
      <span @click="isEditor=!isEditor">{{ isEditor?'完成':'编辑' }}</span>
    </div>
    <!-- 购物车商品列表 -->
    <div>
      <van-checkbox-group>
        <van-swipe-cell :disabled="!isEditor" v-for="(item,index) in cartInfo.cartList":key="index">
          <!-- 自定义显示内容 -->
          <div class="goods-item">
            <van-checkbox style="margin-left: 10px" v-model="item.checked"></van-checkbox>
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
                <van-stepper v-else v-model="item.number"></van-stepper>
              </template>
            </van-card>
          </div>
          <!-- 右边划出的内容 -->
          <template #right>
            <van-button style="height: 100%" text="删除" type="danger"></van-button>
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <!-- 顶部结算 -->
    <van-submit-bar
      :price="cartInfo.cartTotal.checkedGoodsAmount"
      :button-text="'结算'"
      :label="'总计'"
      style="margin-bottom: 50px"
    >
      <van-checkbox></van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import {getCart} from "@/api/api";
import {priceFormat} from "@/filter";
export default {
  name: "Cart",
  data() {
    return{
      isEditor: false,
      cartInfo: {}
    }
  },
  created(){
    getCart().then(resp => {
      this.cartInfo = resp.data.data
    })
}
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