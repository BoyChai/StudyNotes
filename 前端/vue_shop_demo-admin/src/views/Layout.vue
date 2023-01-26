<template>
  <div class="container">
    <el-container class="container">
      <el-aside :width="isCollapse?'63px':'200px'">
        <SideBar :isCollapse="isCollapse"></SideBar>
      </el-aside>
      <el-container>
        <el-header>
<!--          面包屑-->
          <div>
<!--            左边面包屑-->
            <div>
<!--              折叠开关-->
              <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="toggleMenu"></i>
<!--              面包屑-->
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(bread,index) in $store.state.currentMenu" :key="index">{{bread}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
<!--            右边导航-->
            <div>

            </div>
          </div>
<!--          标签栏-->
          <div>
            <el-tag v-for="(tag,index) in $store.state.tags" :key="index" :closable="!(tag.path=='/')"
            :type="tag.path==$store.state.activePath?'success':'info'"
            @close="closeTag(tag)"
            @click="tagChange(tag)">
              {{tag.title}}
            </el-tag>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SideBar from "@/views/layout/SideBar.vue";
export default {
  name: "Layout",
  data() {
    return{
      isCollapse: true,
    }
  },
  components: {SideBar},
  comments: {
    SideBar
  },
  methods: {
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    },
    tagChange(tag) {
      this.$store.state.activePath = tag.path
      this.$router.push(tag.path)
      let currentMenu = []
      this.$store.state.menus.forEach(m => {
        if (m.path == tag.path) {
          currentMenu.push(m.title)
        } else if (m.children.length) {
          m.children.forEach(subM => {
            if (subM.path == tag.path) {
              currentMenu.push(m.title)
              currentMenu.push(subM.title)
            }
          })
        }
      })
      this.$store.state.currentMenu = currentMenu
    },
    // 移除tag
    closeTag(tag) {
      let index = this.$store.state.tags.findIndex(t => {
        return tag.path == t.path
      })
      if (index !== -1){
        this.$store.state.tags.splice(index,1)
        if (tag.path==this.$store.state.activePath) {
          this.tagChange(this.$store.state.tags[this.$store.state.tags.length-1])
        }
      }
    },
  }
}
</script>

<style scoped>
.container{
  height: 100%;
}
</style>