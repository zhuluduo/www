<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/product/list' }">在售商品</el-breadcrumb-item>
          <el-breadcrumb-item>商品上架</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="3">
        <el-select v-model="params.firstCategoryId" clearable placeholder="一级分类" size="small">
          <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="params.secondCategoryId" clearable placeholder="二级分类" size="small">
          <el-option v-for="item in subCategories" :key="item.name" :label="item.name" :value="item.id"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select clearable class="filter-item" v-model="params.productType" placeholder="商品类型" size="small">
          <el-option v-for="item in productTypes" :key="item.key" :label="item.name" :value="item.key"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="loadList" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord" size="small"/>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="loadList" :loading="loading" icon="search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="7" class="tool-bar">
        <el-tooltip class="item" effect="light" content="点击可返回在售商品列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('list')" size="small" icon="arrow-left">返回上层</el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="light" content="找不到要上架的商品，可尝试新建商品" placement="left" >
          <el-button type="primary" @click="$router.push('create')" size="small" icon="plus">新建商品</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" @sort-change="sortList" :default-sort = "{prop: 'sellingPrice', order: 'ascending'}">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="data-table-expand">
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="商品品牌">
                  <span>{{ props.row.brand }}</span>
                </el-form-item>
                <el-form-item label="商品条码">
                  <span>{{ props.row.barcode }}</span>
                </el-form-item>
                <el-form-item label="商品规格">
                  <span>{{ props.row.spec }}</span>
                </el-form-item>
                <el-form-item label="商品单位">
                  <span>{{ props.row.pkg }}</span>
                </el-form-item>
                <el-form-item label="二级分类">
                  <span>{{ props.row.secondCategory.name }}</span>
                </el-form-item>
                <el-form-item label="零售价格">
                  <span>{{ props.row.sellingPrice }}</span>
                </el-form-item>
                <el-form-item label="采购价格">
                  <span>{{ props.row.purchasePrice }}</span>
                </el-form-item>
                <el-form-item label="商品库存">
                  <span>{{ props.row.inventory }}</span>
                </el-form-item>
                <el-form-item label="安全天数">
                  <span>{{ props.row.safetyInventoryDays }}</span>
                </el-form-item>
                <el-form-item label="商品类型">
                  <el-tag v-if="props.row.type" type="success">标品</el-tag>
                  <el-tag v-else type="danger">非标品</el-tag>
                </el-form-item>
                <el-form-item label="商品状态">
                  <el-tag v-if="props.row.offshelf" type="danger">下架</el-tag>
                  <el-tag v-else type="success">上架</el-tag>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="name" label="商品名称"/>
          <el-table-column sortable="custom" prop="barcode" label="商品条码" width="200"/>
          <el-table-column sortable="custom" prop="pkg" label="商品单位" width="130"/>
          <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类" width="130"/>
          <el-table-column sortable="custom" prop="categoryName" label="二级分类" width="130">
            <template scope="scope">
              {{scope.row.secondCategory.name}}
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="purchasePrice" label="采购价格" width="130">
            <template scope="scope">
              <el-input v-if="scope.row.offshelf"  v-model="scope.row.purchasePrice" size="mini"/>
              <el-input v-else v-model="scope.row.purchasePrice" disabled="disabled" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="sellingPrice" label="零售价格" width="130">
            <template scope="scope">
              <el-input v-if="scope.row.offshelf" v-model="scope.row.sellingPrice" size="mini"/>
              <el-input v-else v-model="scope.row.sellingPrice" disabled="disabled" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="inventory" label="商品库存" width="130">
            <template scope="scope">
              <el-input v-if="scope.row.offshelf" v-model="scope.row.inventory" size="mini"/>
              <el-input v-else v-model="scope.row.inventory" disabled="disabled" size="mini"/>
            </template>
          </el-table-column>
          <!--<el-table-column label="商品类型" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.type" type="success">标品</el-tag>
              <el-tag v-else type="danger">非标品</el-tag>
            </template>
          </el-table-column>-->
          <!--<el-table-column label="商品状态" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.offshelf" type="danger">下架</el-tag>
              <el-tag v-else type="success">上架</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column label="操作" width="80" align="right">
            <template scope="scope">
              <el-button :disabled="scope.row.id==='DEFAULTID'&&!scope.row.offshelf?true:false" :plain="scope.row.offshelf?true:false" :type="scope.row.offshelf?'warning':'danger'"
                         :icon="scope.row.offshelf?'arrow-up':'arrow-down'"
                         @click='changeStatus(scope.row)' size="small">
                {{scope.row.offshelf? '上架':'下架'}}
              </el-button>
            </template>
          </el-table-column>
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
        listSort:{},
        categories:[], // 商品分类
        parentChildCategoryMap:[], // 父分类与子分类列表的映射
        productTypes:[ // 商品类型
          { key: '1', name: '标  品' },
          { key: '0', name: '非标品' }
        ],
        params:{ // 列表查询参数
          productType:'', // 当前列表取所有已上架商品
          searchWord:'', // 模糊搜索关键字
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
        this.params.searchWord=$.trim(this.params.searchWord);
        let url=bus.host+'/pos/api/product/list?page='+(this.page.currentPage-1)+'&size='+this.page.size;
        if(this.listSort.order!=null){
          url+='&sort='+this.listSort.prop+','+this.listSort.order;
        }
        this.loading = true;
        this.$axios.post(url,this.params,{}).then((res) => {
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg=data.msg;
          this.page.total =msg.totalElements;
          let content=msg.content;
          content.forEach(e=>{
            e.type=e.type==0?false:true;
            if(e.products.length==0){
              e['offshelf']=true;
              e['status']='下架';
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
              e['offshelf']=(product['status']==0||product['status']==null)?true:false;
              e['status']=(product['status']==0||product['status']==null)?'下架':'上架';
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
          this.list = content;
          this.loading = false;
        }).catch((res)=>{
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          });
        });
      },
      trimSort(sort){
        if(sort.order!=null)
          sort.order=sort.order.replace('ending','');
        return sort;
      },
      // 处理点击排序
      sortList(sort){
        this.listSort=this.trimSort(sort);
        this.loadList();
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
          this.categories.forEach(e=>sub[e.id]=e.subCategories);
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
      /*改变上下架状态*/
      changeStatus (row) {
        if(row.offshelf){
          // 当前状态是下架，则是上架操作需要做校验
          if(!this.validate(row))
            return;
        }

        let params = {
          id: row.id,
          products: [
            {
              id:'null',
              sellingPrice: row.sellingPrice,
              purchasePrice: row.purchasePrice,
              inventory: row.inventory,
              status:row.offshelf?1:0,
            }
          ]
        }

        let tip=row.offshelf?'上架':'下架';
        let url =  bus.host+'/pos/api/product/update'
        this.$axios.put(url,params).then((response) => {
          if(response.data.success == false&&response.status==200){
            this.$alert('您没有此操作权限', '对不起', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
            });
            return;
          }
          if (response.data.success == true) {
            this.$message({
              message: '商品【'+tip+'】成功！',
              type: 'success'
            });
            this.loadList();
          }
          row.offshelf=row.offshelf?1:0;
        }, (res) => {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        });
      },
      validate(row) {
        try{
          if(row.purchasePrice==null||row.purchasePrice=='') {
            this.$message({message: '采购价格不能为空！', type: 'warning'});
            throw row;
          }
          if(!/^\d+(\.\d+)?$/.test(row.purchasePrice)){
            this.$message({message: '采购价格不合法！', type: 'warning'});
            throw row;
          }
          if(row.sellingPrice==null||row.sellingPrice=='') {
            this.$message({message: '零售价格不能为空！', type: 'warning'});
            throw row;
          }
          if(!/^\d+(\.\d+)?$/.test(row.sellingPrice)){
            this.$message({message: '零售价格不合法！', type: 'warning'});
            throw row;
          }
          if(row.inventory==null||row.inventory==0||row.inventory=='') {
            this.$message({message: '商品库存不能为空！', type: 'warning'});
            throw row;
          }
          if(!/^\d+$/.test(row.inventory)) {
            this.$message({message: '商品库存不合法！', type: 'warning'});
            throw row;
          }
          return true;
        }catch(e){
          return false;
        }
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
  .tool-bar{text-align: right;}
</style>
