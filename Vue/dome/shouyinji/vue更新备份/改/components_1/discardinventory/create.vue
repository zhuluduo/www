<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/discardinventory/list' }">报损单</el-breadcrumb-item>
          <el-breadcrumb-item>新增报损</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="4">
        <el-input @keyup.enter.native="search" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord" size="small"/>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="search" icon="search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="4" class="tool-bar f-fr">
        <el-tooltip class="item" effect="light" content="返回报损单列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('list')" size="small">返回列表</el-button>
        </el-tooltip>
        <el-button type="primary" @click="save(list)" size="small">提交报损</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="list" v-loading="loading">
          <el-table-column prop="name" label="商品名称"  />
          <el-table-column prop="barcode" label="商品条码"  width="200"/>
          <el-table-column prop="expirationDays" label="规格" width="100"/>
          <el-table-column prop="pkg" label="单位" width="100"/>
          <el-table-column prop="secondCategory.name" label="分类" width="150"/>
          <el-table-column prop="purchasePrice" label="采购价格" width="100"/>
          <el-table-column prop="quantity" label="报损数量" width="100">
            <template scope="scope">
              <el-input v-model="scope.row.quantity"  />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="报损原因" width="300">
            <template scope="scope">
              <el-input  type="textarea" v-model="scope.row.reason"   autosize/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" align="right">
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="list.splice(scope.$index, 1)" size="small">排除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog   :visible.sync="dialogTableVisible" size="tiny" class="dialog_box">
          <el-row :gutter="20">
           <div class="dialog_cont">
             <el-col :span="24" class="btoom_table">
               <!--{{this.ListFrom.no}}-->
               <!--{{this.ListFrom.createTime}}-->
               <label class="dialog-la">报损单号：</label>
               <div class="dialog-cont">{{this.ListFrom.no}}</div>
             </el-col>
             <el-col :span="24" class="btoom_table">
               <label class="dialog-la">报损时间：</label>
               <div class="dialog-cont">{{this.ListFrom.createTime}}</div>
             </el-col>
             <el-col :span="24" class="btoom_table">
               <label class="dialog-la">报损人：</label>
               <div class="dialog-cont">{{this.ListFrom.operator}}</div>
             </el-col>
             <el-col :span="24" class="btoom_table">
               <label class="dialog-la">报损总数：</label>
               <div class="dialog-cont">{{this.ListFrom.quantity}}件</div>
             </el-col>
             <el-col :span="24" class="btoom_table">
               <label class="dialog-la">报损总数：</label>
               <div class="dialog-cont">￥300元</div>
             </el-col>
           </div>
             <el-col :span="24" class="dialog_bnt">
               <el-button @click="dialogTableVisible = false">取 消</el-button>
               <el-button type="primary" @click="$router.push('list')">确 定</el-button>
             </el-col>
          </el-row>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  import {dateFormat} from '../../utils/date.js';
  import math from '../../utils/math.js';

  export default{
    data(){
      return {
        list: [],
        params:{
          searchWord:'',
        },
        loading: false,
        showDialog:false,
        dialogTableVisible: false,
        ListFrom:{
          no:'',
          createTime:'',
          name:'',
          quantity:'',
          operator:'',
          amount:'',
        }
      }
    },

    methods: {
      /*数据加载*/
      loadList() {
        this.loading = true;
        this.$axios.post(bus.host+'/pos/api/product/list',this.params).then((res) => {
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let content=data.msg.content;
          content.forEach(function(e){
            if(e.products.length==0){
              e['id']='';
              e['purchasePrice']=0;
            }else{
              let product=e.products[0];
              e['purchasePrice']=product.purchasePrice;
            };
          });

          /*数据插入*/
          content.forEach(function(e){
            e.productionDate='';
          });
          this.list = content.reduce( function(coll,item){
            coll.push( item );
            return coll;
          }, this.list);
          /*数据去重*/
          let idValueMap=[];
          this.list.forEach(function(e){
            idValueMap[e.id]=e;
          });
          let valArr=new Array();
          for(let k in idValueMap){
            valArr.push(idValueMap[k]);
          }
          this.list=valArr;
          this.loading = false;
        }, (res) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },

      /*搜索*/
      search(){
        if(this.params.searchWord==''){
          this.$message({
            message: '请输入关键字搜索商品！',
            type: 'warning'
          });
          return;
        }
        this.loadList();
      },
       /*提交*/
      save(rows){
        if(rows.length==0){
          this.$message({message: '请先添加需要入库的商品！', type: 'error'});
          return;
        }
        this.loading=true;
        let scrapItems=new Array();
        rows.forEach((e)=>{
          console.log(e)
          let item={
            product: e.products[0],
            purchasePrice: e.purchasePrice,
            quantity: e.quantity,
            reason: e.reason,
          }
          scrapItems.push(item);
        });
        let params={
          scrapItems:scrapItems
        };
        let url = bus.host + '/pos/api/inventory/scrap/create'
        this.$http.post(url, params).then((res) => {
          let data=res.data;
          if(data.success == false&&status==200){
           this.$alert('您没有此操作权限', '对不起', {
             confirmButtonText: '确定',
            });
           return;
          }
          this.ListFrom.no=data.msg.no;
          this.ListFrom.createTime=data.msg.createTime;
          this.ListFrom.quantity=data.msg.quantity;
          this.ListFrom.operator=data.msg.operator;
          this.dialogTableVisible=true
          this.showDialog=true;
        }, (res) => {
          this.$message({
            message: '错误',
            type: 'warning'
          });
        });
        this.dialogTableVisible=false;
        this.loading=false;
      },
    },
    mounted() {

    }
  }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .tool-bar{text-align: right;}
  .dialog_box .el-dialog__body .dialog-la ,.dialog_box .el-dialog__body.dialog-cont{}
  .dialog_box .el-dialog__body .dialog_bnt{text-align: center;}
</style>
<style scoped lang="scss">
  .dialog_cont{width: 400px;margin: auto}
  .btoom_table{margin-bottom: 15px;}
  .dialog-la{
    width: 80px;
    vertical-align: middle;
    float: left;
    text-align: right;
  }
  .dialog-cont{
    margin-left:90px;
    word-wrap: break-word;
  }
</style>

