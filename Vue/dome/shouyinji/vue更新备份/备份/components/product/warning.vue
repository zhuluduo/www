<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>过期预警</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!--<el-row :gutter="10">
      <el-col :span="3">
        <el-select v-model="params.firstCategoryId" clearable placeholder="一级分类" size="small">
          <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="params.secondCategoryId" clearable placeholder="二级分类" size="small">
          <el-option v-for="item in subCategories" :key="item.name" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select clearable class="filter-item" v-model="params.productType" placeholder="商品类型" size="small">
          <el-option v-for="item in productTypes" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="loadList" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord" size="small"/>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="loadList" icon="search" size="small">搜索</el-button>
      </el-col>
    </el-row>-->
    <el-row>
      <el-col>
        <el-table :data="ilst">
          <el-table-column prop="name" label="商品编号" ></el-table-column>
          <el-table-column prop="date" label="商品名称" ></el-table-column>
          <el-table-column prop="name" label="商品条码" ></el-table-column>
          <el-table-column prop="name" label="规格" ></el-table-column>
          <el-table-column prop="name" label="单位" ></el-table-column>
          <el-table-column prop="address" label="分类"></el-table-column>
          <el-table-column prop="address" label="生产日期"></el-table-column>
          <el-table-column prop="address" label="保质期"></el-table-column>
          <el-table-column prop="address" label="剩余有效期"></el-table-column>
          <el-table-column prop="address" label="采购价"></el-table-column>
          <el-table-column prop="address" label="零售价"></el-table-column>
          <el-table-column prop="address" label="库存"></el-table-column>
          <el-table-column prop="address" label="状态"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeSize"
          @current-change="changePage"
          :current-page.sync="page.currentPage"
          :page-size="page.size"
          layout="prev, pager, next, jumper, total"
          :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  export default{
    data(){
      return {
        list:[], // 列表数据
        categories:[], // 商品分类
        parentChildCategoryMap:[], // 父分类与子分类列表的映射
        productTypes:[ // 商品类型
          { key: '1', name: '标  品' },
          { key: '0', name: '非标品' }
        ],
        params:{ // 列表查询参数
          productType:'', // 当前列表取所有已上架商品
          searchWord:'', // 模糊搜索关键字
          productStatus:1, // 当前列表取所有已上架商品
          firstCategoryId:'', // 一级分类ID
          secondCategoryId:'', // 二级分类ID
        },
        page:{ // 分页信息
          currentPage:1, // 当前页
          size:15, // 每页大小
          total:1, // 总页数
        },
        loading:false, // 是否显示加载遮罩层
      }

    },

    computed: {
      /*选中一级分类，加载二级分类*/
      subCategories() {
        return this.$data.parentChildCategoryMap[this.$data.params.firstCategoryId];
      },
    },
    methods: {
      /*加载列表数据*/
      loadList() {
        this.loading=true;
        //let queryParams='?page='+(this.page.currentPage-1)+'&size='+this.page.size+'&sort=pr.sellingPrice,asc&sort=pr.purchasePrice,asc&sort=pr.inventory,asc&pr.safetyInventoryDays,asc&sort=ba.updateTime,desc';
        this.$axios.post(bus.host+'/pos/api/product/list'+queryParams,this.params,{}).then((res) => {
          /*let data = res.data;
          if(!data.success){
            //this.$router.push('/erro/401');
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg=data.msg;
          this.page.total =msg.totalElements;
          let content=msg.content;
          content.forEach(function(e){
            e.type=e.type==0?false:true;
            if(e.products.length==0){
              e['inventory']=0;
              e['invClass']='danger';
              e['sellingPrice']=0;
              e['selClass']='danger';
              e['purchasePrice']=0;
              e['purClass']='danger';
              e['safetyInventoryDays']=0;
              e['safClass']='danger';
            }else{
              let product=e.products[0];
              e['inventory']=product.inventory;
              e['invClass']='black';
              e['sellingPrice']=product.sellingPrice;
              e['selClass']='black';
              e['purchasePrice']=product.purchasePrice;
              e['purClass']='black';
              e['safetyInventoryDays']=product.safetyInventoryDays;
              e['safClass']='black';
            }
          });
          console.log(content);
          this.list = content;*/
          this.loading = false;
        })
          .catch((err)=>{
            console.log(err);
          });
      },

      /*根据父ID获取子分类列表*/
      loadCategory(parentId) {
        let url = bus.host+'/pos/api/category/list/'+parentId;
        this.$axios.get(url,{}).then((response) => {
          if(!response.data.success){
            this.$notify.error({
              title: '请求有误！',
              message: response.data.msg
            });
            return;
          }
          this.categories = response.data.msg;
          // 父分类与子分类映射
          let sub=this.$data.parentChildCategoryMap;
          this.categories.forEach(function(e){
            sub[e.id]=e.subCategories;
          });
        });
      },

      /*处理分页事件*/
      changeSize(val) {
        this.page.size = val;
        this.loadList();
      },
      changePage(val) {
        this.page.currentPage = val;
        this.loadList();
      },
      /*编辑*/
      edit (row) {
        this.$router.push({path: 'edit', query: {id: row['products'][0]['id']}});
      }
    },
    mounted() {
      this.loadCategory(0);
      this.loadList();
    }
  }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
</style>
