<template>
<div>
  <h3>商品介绍</h3>
  <el-form :model="goodsForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="商品编号" prop="name">
      <el-input v-model="goodsForm.goodsSn"></el-input>
    </el-form-item>
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="goodsForm.name"></el-input>
    </el-form-item>
    <el-form-item label="市场售价">
      <el-input v-model="goodsForm.name" placeholder="0.00"></el-input>
    </el-form-item>
    <el-form-item label="是否新品" >
      <el-radio-group v-model="goodsForm.isNew">
        <el-radio label="新品"></el-radio>
        <el-radio label="非新品"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否热卖">
      <el-radio-group v-model="goodsForm.isHot">
        <el-radio label="普通"></el-radio>
        <el-radio label="热卖"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否在售" >
      <el-radio-group v-model="goodsForm.isOnSale">
        <el-radio label="在售"></el-radio>
        <el-radio label="未售"></el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="商品图片">
      <el-upload
          class="avatar-uploader"
          action="http://localhost:8090/storage/create"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
        <img v-if="goodsForm.picUrl" :src="goodsForm.picUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>


    <el-form-item label="商品单位" >
      <el-input v-model="goodsForm.unit"></el-input>
    </el-form-item>
    <el-form-item label="所属分类" >
      <el-select v-model="goodsForm.categoryId" placeholder="请选择">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属品牌商" >
      <el-select v-model="goodsForm.brandId" placeholder="请选择">
        <el-option v-for="(brand,index) in brandList" :key="index" :label="brand.label" :value="brand.value"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="商品简介" prop="desc">
      <el-input type="textarea" v-model="goodsForm.brief"></el-input>
    </el-form-item>

    <el-form-item label="商品详情" >
      <editor id="tinymce" v-model="goodsForm.detail" :init="init"></editor>
    </el-form-item>


    <el-form-item>
      <el-button type="primary" @click="submitForm()">上架</el-button>
      <el-button>重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {getBrandAndCategory} from '@/../../../../../../../文档/环境/前端/vue_shop_demo-admin/src/api/api.js'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/modern/theme'
//插件
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
export default {
  name: "Create",
  data() {
    return{
      init:{
        language_url: '/tinymce/langs/zh_CN.js',// 语言包的路径
        language: 'zh_CN',//语言
        skin_url: '/tinymce/skins/lightgray',// skin路径
        height: 300,//编辑器高度
        branding: false,//是否禁用“Powered by TinyMCE”
        menubar: false,//顶部菜单栏显示
        plugins: 'lists image media table wordcount',
        toolbar: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
      },
      goodsForm:{
        name: '',
        goodsSn: '',
        detail: '',
        isNew: false,
        isHot: false,
        isOnSale: false,
        brief: '',
        categoryId: ''
      },brandList:{

      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    getBrandAndCategory().then(resp => {
      this.brandList = resp.data.data.brandList;
    });
  },
  methods: {
    submitForm(){

    },
    handleAvatarSuccess(){

    }
  },
  components:{
    Editor
  }
}
</script>

<style scoped>

</style>