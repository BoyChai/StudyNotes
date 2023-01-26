<template>
  <div class="menu">
    <el-menu
      router
      :collapse="isCollapse"
      :default-active="activePath"
      class="menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      @select="menuSelect"
    >
      <template v-for="(item,index) in $store.state.menus">
        <el-submenu v-if="item.isSubMenu" :key="index" :index="item.path">
          <template slot="title">
            <i :class="`el-icon-${item.icon}`"></i>
            <span slot="title">{{item.title}}</span>
          </template>
          <el-menu-item v-for="(subItem,subIndex) in item.children" :key="subIndex" :index="subItem.path ">
            <span slot="title">{{subItem.title}}</span>
          </el-menu-item>

        </el-submenu>
        <el-menu-item v-else :key="index" :index="item.path">
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {trim} from "core-js/internals/string-trim";

export default {
  name: "SideBar",
  props: ["isCollapse"],
  data() {
    return{
      activePath:"/",
    }
  },
  methods: {
    menuSelect(index,indexPath) {
      this.$store.state.activePath = index
      // 面包屑
      let currentMenu = []
      let tag;
      this.$store.state.menus.forEach(m => {
        if (m.path == index) {
          currentMenu.push(m.title)
          tag = m
        } else if (m.children.length) {
          m.children.forEach(subM => {
            if (subM.path == index) {
              currentMenu.push(m.title)
              currentMenu.push(subM.title)
              tag = subM
            }
          })
        }
      })
      this.$store.state.currentMenu = currentMenu
      // 添加tag
      let tagIndex = this.$store.state.tags.findIndex(tag => {
        return tag.path == index
      })
      if (tagIndex === -1) {
        // 添加
        if (tag) {
          this.$store.state.tags.push(tag)
        }
      }
    }
  }
}
</script>

<style scoped>
.menu {
  height: 100%;
}

</style>