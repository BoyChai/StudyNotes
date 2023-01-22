<template>
  <div>
    <!-- 搜索栏 -->
    <SearchBar></SearchBar>
    <!-- 分类选择 -->
    <div>
      <!-- 左侧 -->
      <van-sidebar v-model="activeIndex" class="fl" style="height: 100%" @change="sidebarChange">
        <van-sidebar-item v-for="(item,index) in categoryInfos.categoryList" :key="index" :title="item.name"></van-sidebar-item>
      </van-sidebar>
      <!-- 右侧 -->
      <div class="right-content">
        <div class="right-top">
          <img :src="categoryInfos.currentCategory.picUrl" style="width: 250px">
          <p class="desc">{{categoryInfos.currentCategory.desc}}</p>
        </div>
        <van-grid column-num="3">
          <van-grid-item v-for="(item,index) in categoryInfos.currentSubCategory":key="index">
            <img :src="item.picUrl" style="width: 70px">
            <p class="desc">{{item.desc}}</p>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
import {getCategory,getCurrentCategory} from "@/api/api";
export default {
  components: {
    SearchBar
  },
  name: "Category",
  data() {
    return{
      activeIndex:0,
      categoryInfos: {
        categoryList: {},
        currentCategory:{},
        currentSubCategory:{},
      },
    }
  },
  created() {
    getCategory().then(resp =>{
      this.categoryInfos = resp.data.data
    })
  },
  methods:{
    sidebarChange(index){
      getCurrentCategory(this.categoryInfos.categoryList[index].id).then(resp =>{
        this.categoryInfos.currentSubCategory = resp.data.data.currentSubCategory
        this.categoryInfos.currentCategory = resp.data.data.currentCategory
      })
    }
  },
}
</script>

<style scoped>
  .right-content{
      margin-left: 80px;
  }
  .right-top{
    text-align: center;
  }
  .right-top>desc {
    margin-top: 10px;
  }

</style>