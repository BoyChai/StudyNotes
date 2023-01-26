<template>
<div>
<!--  搜索栏-->
  <el-form :inline="true" :model="listQuery" class="demo-form-inline">
    <el-form-item>
      <el-input size="mini" v-model="listQuery.goodsId" placeholder="请输入商品id"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input size="mini" v-model="listQuery.goodsSn" placeholder="请输入商品编号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input size="mini" v-model="listQuery.name" placeholder="请输入商品名称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-search" size="mini" type="primary" @click="onQuery">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-edit" size="mini" type="primary" @click="onCreate">上架</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-download" size="mini" type="primary" @click="onExport">导出</el-button>
    </el-form-item>
  </el-form>
<!--  数据表格-->
  <el-table
      :data="goodsList"
      style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商品描述">
            <span>{{ props.row.brief }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
        label="商品 ID"
        prop="id">
    </el-table-column>
    <el-table-column
        label="商品名称"
        prop="name">
    </el-table-column>
    <el-table-column
        label="图片">
      <template slot-scope="scope">
        <el-image :src="scope.row.picUrl"></el-image>
      </template>
    </el-table-column>
    <el-table-column
        label="分享图">
      <template slot-scope="scope">
        <el-image :src="scope.row.shareUrl"></el-image>
      </template>
    </el-table-column>
    <el-table-column
        label="详情"
        prop="brief">
    </el-table-column>
    <el-table-column
        label="市场售价"
        prop="counterPrice">
    </el-table-column>
    <el-table-column
        label="当前价格"
        prop="retailPrice">
    </el-table-column>
    <el-table-column
        label="是否新品">
      <template slot-scope="scope">
        <el-tag :type="scope.row.isNew?'success':'error'" >{{scope.row.isNew?'新品':'非新品'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
        label="是否热品">
      <template slot-scope="scope">
        <el-tag :type="scope.row.isHot?'success':'error'" >{{scope.row.isHot?'热品':'非热品'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
        width="200px"
        label="操作">
      <template slot-scope="scope">
        <el-button size="mini" type="primary">编辑</el-button>
        <el-button size="mini" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
<!--  分页栏-->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
  </el-pagination>
</div>
</template>

<script>
import {getGoodsList} from '@/api/api.js'
export default {
  name: 'MallAdminList',

  data() {
    return {
      page:{
        limit:10,
        page:1,
        pages:1,
        total:0
      },
      listQuery:{
        goodsId: null,
        goodsSn: null,
        name: ''
      },
      goodsList: []
    };
  },
  created(){
    getGoodsList({}).then(resp => {
      console.info(resp.data);
      this.goodsList = resp.data.data.list;
      this.page.limit = resp.data.data.limit;
      this.page.page = resp.data.data.page;
      this.page.pages = resp.data.data.pages;
      this.page.total = resp.data.data.total;
    });
  },
  mounted() {

  },

  methods: {
    onQuery(){

    },
    onCreate(){

    },
    onExport(){

    },
    handleCurrentChange(val){
      console.info("去"+val+"页");
    },
    handleSizeChange(val){
      console.info("每页"+val+"条");
    }
  },
};
</script>


<style scoped>

</style>