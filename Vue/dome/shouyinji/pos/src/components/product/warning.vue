<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>库存预警</el-breadcrumb-item>
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
        <el-button type="primary" size="small" @click="Place_order">店宝直供一键下单{{this.stockGoods.number}}</el-button>
        <el-table :data="list">
          <el-table-column prop="name" label="商品名称" ></el-table-column>
          <el-table-column prop="date" label="商品条码" ></el-table-column>
          <el-table-column prop="name" label="当前库存" ></el-table-column>
          <el-table-column prop="name" label="库存单位" ></el-table-column>
          <el-table-column prop="name" label="建立采购量" >
            <template scope="scope">
              <el-input v-model="scope.row.purchaseNumber" placeholder="请输入内容" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="采购单位"></el-table-column>
          <el-table-column prop="address" label="货源"></el-table-column>
          <el-table-column prop="address" label="处理状态"></el-table-column>
        </el-table>
        <!--<el-pagination-->
          <!--@size-change="changeSize"-->
          <!--@current-change="changePage"-->
          <!--:current-page.sync="page.currentPage"-->
          <!--:page-size="page.size"-->
          <!--layout="prev, pager, next, jumper, total"-->
          <!--:total="page.total">-->
        <!--</el-pagination>-->
      </el-col>
    </el-row>
    <el-dialog
      title="提示" :visible.sync="dialogVisible" size="tiny" :show-close="false" class="warningList">
      <div class="Inwarning" v-if="this.orderInfo==1">
        <h3 class="warningTit">确定提交吗？</h3>
        <span class="warningCent">商品件数：<i>35</i>件</span>
        <span class="warningCent">商品金额：￥<i>668.5</i>元</span>
        <span class="warningCent">付款方式：货到付款</span>
        <div class="warningCent">
          <el-button icon="close" @click="dialogVisible=false" size="small" class="warningbutton">取&nbsp;&nbsp;消</el-button>
          <el-button icon="check" @click="submitOrder"  type="primary" size="small" class="warningbutton">确&nbsp;&nbsp;定</el-button>
        </div>
      </div>
      <div class="orderConfirm" v-if="this.orderInfo==2">
        <h3 class="warningTit"><i class="el-icon-check"></i>订单已提交</h3>
        <span class="warningCent">订单编号：<i>3555555555555</i></span>
        <span class="warningCent">您可打开店宝APP查看订单进度</span>
        <div class="warningCent">
          <el-button icon="check" @click="dialogVisible=false" size="small" class="warningbutton">确&nbsp;&nbsp;定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  export default{
    data(){
      return {
        list:[
          {
            date: '1111111111111',
            name: '王小虎1',
            address: '上海市普陀区金沙江路 1518 弄',
            purchaseNumber:'10',
            money:'42'
          },
          {
            date: '2222222',
            name: '王小虎2',
            address: '上海市普陀区金沙江路 1518 弄',
            purchaseNumber:'21',
            money:'32'
          },
          {
            date: '3333333',
            name: '王小虎3',
            address: '上海市普陀区金沙江路 1518 弄',
            purchaseNumber:'32',
            money:'22'
          },
          {
            date: '444444',
            name: '王小虎4',
            address: '上海市普陀区金沙江路 1518 弄',
            purchaseNumber:'40',
            money:'12'
          }
        ], // 列表数据
        categories:[], // 商品分类
        parentChildCategoryMap:[], // 父分类与子分类列表的映射
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
        orderInfo:'',
        stockGoods:{
          number:'',
          money:'',
        },
        dialogVisible:false,
        loading:false, // 是否显示加载遮罩层
      }

    },

//    computed: {
//      /*选中一级分类，加载二级分类*/
//      subCategories() {
//        return this.$data.parentChildCategoryMap[this.$data.params.firstCategoryId];
//      },
//    },
    methods: {
      getSum(ar){
        var arr=ar;
        var s=eval(arr.join("+"))

        return  s;

      },
  /*店宝直供一键下单*/
      Place_order(preValue){
        this.dialogVisible=true;
        this.orderInfo=1;
        this.list.forEach((e)=>{
          var purchaseNumber=new Array()
          purchaseNumber.push(e.purchaseNumber)
          this.getSum(purchaseNumber)
          var ss=this.getSum(purchaseNumber)
          console.log(ss)
//          e.purchaseNumber +=e.purchaseNumber;
        })

      },

  submitOrder(){
        this.orderInfo=2;
      },


      /*加载列表数据*/
//      loadList() {
//        this.loading=true;
//        //let queryParams='?page='+(this.page.currentPage-1)+'&size='+this.page.size+'&sort=pr.sellingPrice,asc&sort=pr.purchasePrice,asc&sort=pr.inventory,asc&pr.safetyInventoryDays,asc&sort=ba.updateTime,desc';
//        this.$axios.post(bus.host+'/pos/api/product/list'+queryParams,this.params,{}).then((res) => {
//          /*let data = res.data;
//          if(!data.success){
//            //this.$router.push('/erro/401');
//            this.$notify.error({
//              title: '错误',
//              message: data.msg
//            });
//          }
//          let msg=data.msg;
//          this.page.total =msg.totalElements;
//          let content=msg.content;
//          content.forEach(function(e){
//            e.type=e.type==0?false:true;
//            if(e.products.length==0){
//              e['inventory']=0;
//              e['invClass']='danger';
//              e['sellingPrice']=0;
//              e['selClass']='danger';
//              e['purchasePrice']=0;
//              e['purClass']='danger';
//              e['safetyInventoryDays']=0;
//              e['safClass']='danger';
//            }else{
//              let product=e.products[0];
//              e['inventory']=product.inventory;
//              e['invClass']='black';
//              e['sellingPrice']=product.sellingPrice;
//              e['selClass']='black';
//              e['purchasePrice']=product.purchasePrice;
//              e['purClass']='black';
//              e['safetyInventoryDays']=product.safetyInventoryDays;
//              e['safClass']='black';
//            }
//          });
//          console.log(content);
//          this.list = content;*/
//          this.loading = false;
//        })
//          .catch((err)=>{
//            console.log(err);
//          });
//      },
//
//      /*根据父ID获取子分类列表*/
//      loadCategory(parentId) {
//        let url = bus.host+'/pos/api/category/list/'+parentId;
//        this.$axios.get(url,{}).then((response) => {
//          if(!response.data.success){
//            this.$notify.error({
//              title: '请求有误！',
//              message: response.data.msg
//            });
//            return;
//          }
//          this.categories = response.data.msg;
//          // 父分类与子分类映射
//          let sub=this.$data.parentChildCategoryMap;
//          this.categories.forEach(function(e){
//            sub[e.id]=e.subCategories;
//          });
//        });
//      },
//
//      /*处理分页事件*/
//      changeSize(val) {
//        this.page.size = val;
//        this.loadList();
//      },
//      changePage(val) {
//        this.page.currentPage = val;
//        this.loadList();
//      },
//      /*编辑*/
//      edit (row) {
//        this.$router.push({path: 'edit', query: {id: row['products'][0]['id']}});
//      }
    },
    mounted() {
//      this.loadCategory(0);
//      this.loadList();
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .warningList .el-dialog__header{
    display: none;
  }
  .warningCent{
  .warningbutton{
    margin-top: 30px;
  }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  *{
    font-weight: normal;
    font-style: normal;
    box-sizing: border-box;
  }
  .warningCent{
    text-align: center;
  }
  .warningTit{
    font-size: 1.35em;
    text-align: center;
    i{
      padding-right: 5px;
    }
  }
  .Inwarning ,.orderConfirm{
    box-sizing: border-box;
    span{
      font-size: 15px;
      height: 22px;
      line-height: 22px;
      display: block
    }
  }

</style>
