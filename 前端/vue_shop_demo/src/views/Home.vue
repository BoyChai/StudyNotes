<template>
  <div class="home-container">
    <!-- 搜索栏 -->
    <van-search placeholder="搜索"></van-search>
    <van-swipe autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(banner,index) in homeInfos.banner" :key="index"  >
        <img :src="banner.url" style="height: 230px" >
      </van-swipe-item>
    </van-swipe>
    <!-- 分类引导 -->
    <van-grid  :column-num="6">
      <van-grid-item v-for="(chan,index) in homeInfos.channel" :key="index" :text="chan.name" :icon="chan.iconUrl"/>
    </van-grid>
    <!-- 团购专区 -->
    <div>
      <van-cell title="团购专区" value="更多团购内容" is-link></van-cell>
      <div>
        <van-card v-for="(groupon,index) in homeInfos.grouponList"
                  :key="index"
                  :title="groupon.name"
                  :desc="groupon.brief"
                  :price="groupon.grouponPrice|priceFormat"
                  :thumb="groupon.picUrl"
                  :origin-price="groupon.retailPrice|priceFormat" >
          <template #tags>
            <van-tag plain type="primary">{{groupon.grouponMember}}人成团</van-tag>
            <van-tag plain type="danger">{{groupon.grouponDiscount}}元再减</van-tag>
          </template>
        </van-card>
      </div>
    </div>
    <!--  品牌商直供  -->
    <div>
      <van-cell title="品牌商直供" value="更多品牌" is-link></van-cell>
      <van-grid column-num="2">
          <van-grid-item v-for="(b,index) in homeInfos.brandList" :key="index">
            <img :src="b.picUrl" style="width: 80%;"/>
            <div>{{b.name}}</div>
          </van-grid-item>
      </van-grid>
    </div>
    <!--  新品首发  -->
    <div>
      <van-cell title="新品首发" value="更多新品" is-link></van-cell>
      <van-row>
        <van-col style="text-align: center;" span="12" v-for="(goods,index) in homeInfos.newGoodsList" :key="index">
          <img :src="goods.picUrl" alt="" style="width: 180px;height: 180px">
          <p style="color: darkgray">{{goods.name}}</p>
          <p style="color: #ab956d">￥{{goods.retailPrice|priceFormat}}</p>
        </van-col>
      </van-row>
    </div>
    <!--  人气推荐  -->
    <div>
      <van-cell title="人气推荐" value="更多人气推荐" is-link></van-cell>
      <div>
        <van-card v-for="(hot,index) in homeInfos.hotGoodsList"
                  :key="index"
                  :title="hot.name"
                  :desc="hot.brief"
                  :price="hot.retailPrice|priceFormat"
                  :thumb="hot.picUrl"
                  :origin-price="hot.counterPrice|priceFormat" >
        </van-card>
      </div>
    </div>
  <!--  专题精选  -->
    <div>
      <van-cell title="专题精选" value="更多专题精选" is-link></van-cell>
      <van-row>
        <van-col style="text-align: center; color: #ab956d;" span="12" v-for="(topic,index) in homeInfos.topicList" :key="index">
          <img :src="topic.picUrl" alt="" style="width: 180px;height: 180px">
          <p>{{topic.title}}</p>
          <p>{{topic.subtitle}}</p>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import {getHome} from "@/api/api";
import {priceFormat} from "@/filter";
export default {
  name: "Home",
  data() {
    return{
      homeInfos:{},
    }
  },
  //当页面创建时，执行下面内容
  created() {
    // 发送请求，获取首页信息
    getHome().then(resq => {
      this.homeInfos = resq.data.data
    })
  }
}
</script>

<style scoped>
.home-container {
  padding-bottom: 50px;
}

</style>