<template>
  <div>
<!--    头像-->
    <UserAvatar></UserAvatar>
<!--    <div class="user-avatar">-->
<!--      <van-icon name="set" class="header-setting"></van-icon>-->
<!--      <div class="user-avatar">-->
<!--        <img :src="avatar" alt="">-->
<!--        <div class="nickname">{{nickname}}</div>-->
<!--      </div>-->
<!--    </div>-->
<!--    我的订单-->
    <div>
      <van-cell title="我的订单" is-link value="全部订单"></van-cell>
      <van-grid :column-num="4" icon-size="24px">
        <van-grid-item icon="daifukuan" text="待付款" :badge="2"></van-grid-item>
        <van-grid-item icon="daifahuo" text="待发货" :badge="1"></van-grid-item>
        <van-grid-item icon="wuliu" text="待收货" :badge="4"></van-grid-item>
        <van-grid-item icon="shouhouguanli" text="已完成"></van-grid-item>
      </van-grid>
    </div>
<!--    我的优惠卷-->
    <div>
      <van-cell title="我的优惠卷" is-link value="全部优惠卷"></van-cell>
      <van-grid :column-num="3" icon-size="24px">
        <van-grid-item icon="coupon" :badge="3" text="待使用" ></van-grid-item>
        <van-grid-item icon="coupon-used" :badge="2" text="已使用" ></van-grid-item>
        <van-grid-item icon="coupon-due" text="过期关闭" ></van-grid-item>
      </van-grid>
    </div>
<!--    其他功能-->
    <div>
      <van-cell size="large" title="我的收藏" icon="shoucang" is-link></van-cell>
      <van-cell size="large" title="收货地址" icon="dingwei" is-link></van-cell>
      <van-cell size="large" title="服务中心" icon="kefu" is-link></van-cell>
    </div>
  </div>
</template>

<script>
import UserAvatar from "@/components/UserAvatar.vue";
export default {
  name: "User",
  components: {UserAvatar},
  data(){
    return{
      // avatar: avatar_default,
      // nickname:'mall',
    }
  },
  computed: {
    UserAvatar
  }
}
</script>

<style scoped>
  /*.user-avatar {*/
  /*  height: 130px;*/
  /*  background-color: #f00000;*/
  /*}*/
  /*.header-setting {*/
  /*  position: absolute;*/
  /*  top: 0;*/
  /*  right: 0;*/
  /*  color: white;*/
  /*  font-size: 24px;*/
  /*}*/
  /*.user-avatar{*/
  /*  text-align: center;*/
  /*}*/
  /*.user-avatar img{*/
  /*  margin-top: 20px;*/
  /*  width: 60px;*/
  /*  height: 60px;*/
  /*  border-radius: 30px;*/
  /*}*/
  /*.user-avatar .nickname{*/
  /*  color: white;*/
  /*  margin-top: 10px;*/
  /*}*/

</style>