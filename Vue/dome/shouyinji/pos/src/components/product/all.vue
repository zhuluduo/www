<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
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
          <el-button type="primary" @click="showEdit=true;updateTakeoutStatus();" size="small" icon="plus">新建商品</el-button>
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
          <el-table-column sortable="custom" prop="barcode" label="商品条码" width="140"/>
          <el-table-column sortable="custom" prop="pkg" label="商品单位" width="100"/>
          <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类" width="110"/>
          <el-table-column sortable="custom" prop="categoryName" label="二级分类" width="110">
            <template scope="scope">
              {{scope.row.secondCategory.name}}
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="purchasePrice" label="采购价格" width="100">
            <template scope="scope">
              <el-input v-if="scope.row.offshelf"  v-model="scope.row.purchasePrice" size="mini"/>
              <el-input v-else v-model="scope.row.purchasePrice" disabled="disabled" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="sellingPrice" label="零售价格" width="100">
            <template scope="scope">
              <el-input v-if="scope.row.offshelf" v-model="scope.row.sellingPrice" size="mini"/>
              <el-input v-else v-model="scope.row.sellingPrice" disabled="disabled" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="inventory" label="商品库存" width="100">
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
          <el-table-column label="操作" width="80" align="center">
            <template scope="scope">
              <el-button :disabled="scope.row.id==='DEFAULTID'&&!scope.row.offshelf?true:false" :plain="scope.row.offshelf?true:false" :type="scope.row.offshelf?'warning':'danger'"
                         :icon="scope.row.offshelf?'arrow-up':'arrow-down'"
                         @click='onshelf(scope.row)' size="small">
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

    <transition name="el-zoom-in-right" style="padding-bottom: 0;">
      <div v-show="showEdit" class="transition-box scrollbar" v-loading="editLoading">
        <el-row class="box-title">
          <el-col :span="24" align="center">新建商品</el-col>
        </el-row>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm ruleForms">
          <el-form-item label="商品条码:" prop="barcode">
            <el-input v-model="ruleForm.barcode" @change="getBase" size="small" placeholder="请输入商品条码"/>
          </el-form-item>
          <el-form-item class="upload-item" label="商品图片:" prop="picUrl" style="margin-bottom: 0;">
            <el-upload class="upload-area"
                       :action="uploadUrl"
                       name="files"
                       :show-file-list="false"
                       :on-success="picHandler"
                       :beforeUpload="beforeUpload" v-loading="uploadLoading"
            >
              <img v-if="ruleForm.picUrl" :src="ruleForm.showPicUrl" class="preview">
              <i class="el-icon-upload2 upload-area-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品名称:" prop="name" style="margin-top:17px;">
            <el-input v-model="ruleForm.name" size="small" :disabled="ruleForm.disabled" placeholder="请输入商品名称"/>
          </el-form-item>
          <el-form-item label="商品分类:" prop="secondCategoryId">
            <el-row>
              <el-col :span="12">
                <el-select v-model="ruleForm.firstCategoryId" clearable placeholder="一级分类" size="small" :disabled="ruleForm.disabled" >
                  <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"/>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="ruleForm.secondCategoryId" clearable placeholder="二级分类" size="small" :disabled="ruleForm.disabled">
                  <el-option v-for="item in editSecondCategories" :key="item.name" :label="item.name" :value="item.id"/>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="商品类型:" prop="typeName">
            <el-select v-model="ruleForm.typeName" clearable placeholder="商品类型" size="small" :disabled="ruleForm.disabled">
              <el-option v-for="item in productTypes" :key="item.name" :label="item.name" :value="item.name"/>
            </el-select>
            <!--<el-radio-group v-model="ruleForm.type" :disabled="ruleForm.disabled">
              <el-radio v-for="item in productTypes" :key="item.name" :label="item.key">{{item.name}}</el-radio>
            </el-radio-group>-->
          </el-form-item>
          <el-form-item label="商品品牌:" prop="brand">
            <el-input v-model="ruleForm.brand" size="small" :disabled="ruleForm.disabled" placeholder="请输入商品品牌"/>
          </el-form-item>
          <el-form-item label="商品单位:" prop="pkg">
            <el-input v-model="ruleForm.pkg" size="small" :disabled="ruleForm.disabled" placeholder="请输入商品单位"/>
          </el-form-item>
          <el-form-item label="商品规格:" prop="spec">
            <el-input v-model="ruleForm.spec" size="small" :disabled="ruleForm.disabled" placeholder="请输入商品规格"/>
          </el-form-item>
          <el-form-item label="保质天数:" prop="expirationDays">
            <el-input v-model="ruleForm.expirationDays" size="small" :disabled="ruleForm.disabled" placeholder="请输入保质天数"/>
          </el-form-item>
          <el-form-item label="商品状态:" prop="status">
            <el-switch on-text="上架" off-text="下架" v-model="ruleForm.status"/>
          </el-form-item>
          <el-form-item label="销售价格:" prop="sellingPrice" >
            <el-input v-model.number="ruleForm.sellingPrice" size="small" placeholder="请输入销售价格"/>
          </el-form-item>
          <el-form-item label="采购价格:" prop="purchasePrice">
            <el-input v-model.number="ruleForm.purchasePrice" size="small" placeholder="请输入采购价格"/>
          </el-form-item>
          <el-form-item label="商品库存:" prop="inventory" >
            <el-input v-model.number="ruleForm.inventory" :disabled="!ruleForm.inventoryChangeable" size="small" placeholder="请输入商品库存"/>
          </el-form-item>
          <el-form-item label="安全天数:" prop="safetyInventoryDays" >
            <el-input v-model.number="ruleForm.safetyInventoryDays" size="small" placeholder="请输入安全天数"/>
          </el-form-item>
          <el-form-item label="同步至外卖:" >
            <el-checkbox v-model="ruleForm.syncToMeituan" size="small" v-if="meituanEnabled">美团</el-checkbox>
            <el-checkbox v-model="ruleForm.syncToMeituan" size="small" disabled v-if="!meituanEnabled">美团{{meituanTips}}</el-checkbox>
            <el-checkbox v-model="ruleForm.syncToEleme" size="small" v-if="elemeEnabled">饿了么</el-checkbox>
            <el-checkbox v-model="ruleForm.syncToEleme" size="small" disabled v-if="!elemeEnabled">饿了么{{elemeTips}}</el-checkbox>
          </el-form-item>
        </el-form>
        <el-row class="box-footer">
          <el-col :span="24" align="center">
            <el-button :loading="loading" type="success" @click="submitForm('ruleForm')" size="small" icon="check">保存</el-button>
            <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
            <el-button @click="closeForm('ruleForm')" size="small" icon="close">关闭</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>

    <transition name="el-zoom-in-right" style="padding-bottom: 0;">
      <div v-show="showTakeoutSyncLog" class="transition-box scrollbar" v-loading="editLoading">
        <el-row class="box-title">
          <el-col :span="24" align="center"><i class="el-icon-loading"></i>  同步日志</el-col>
        </el-row>
        <el-row>
        </el-row>
        <el-row class="box-footer">
          <el-col :span="24" align="center">
            <el-button @click="showTakeoutSyncLog=!showTakeoutSyncLog" size="small" icon="close">关闭</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>
<script>
  import lodash from 'lodash';
  import {bus} from '../../bus.js'
  let defaultForm={
      syncToMeituan:false,
      syncToEleme:false,
      formTitle:'新建',
      id:'',
      barcode:'',
      picUrl:'',
      showPicUrl:'',
      name:'',
      firstCategoryId:'', // 一级分类ID
      firstCategoryName:'', // 一级分类名称
      secondCategoryId:'', // 二级分类ID
      secondCategoryName:'', // 二级分类名称
      type:0, // 商品类型
      typeName: '非标品',
      brand:'',
      pkg:'',
      spec:'1',
      no:'',
      expirationDays:0,
      status: true,
      sellingPrice:0,
      purchasePrice:0,
      inventory:0,
      inventoryChangeable:true,
      safetyInventoryDays:3,
      productId:null,
      syncId:'',
      disabled:true
    };
  export default{
    data(){
      return {
        meituanTips:'',
        meituanEnabled:true,
        elemeTips:'',
        elemeEnabled:true,

        updateProductButton: true,
        list:[], // 列表数据
        listSort:{},
        categories:[], // 商品分类
        parentChildCategoryMap:[], // 父分类与子分类列表的映射
        childParentCategoryMap:[], // 子分类与父分类的映射
        productTypes:[ // 商品类型
          { key: '1', name: '标品' },
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

        uploadLoading:false,
        showEdit: false,
        showTakeoutSyncLog:false,
        uploadUrl:bus.host+'/pos/api/upload',

        editLoading:false,

        ruleForm:JSON.parse(JSON.stringify(defaultForm)),
        rules:{
          barcode: [
            { required: true, message: '请输入商品条码', trigger: 'change' }
          ],
          /*picUrl:[
            { required: true, message: '请上传商品图片', trigger: 'change' }
          ],*/
          name: [
            { required: true, message: '请输入商品名称', trigger: 'change' }
          ],
          secondCategoryId: [
            { required: true, message: '请选择二级分类', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择商品类型', trigger: 'change' }
          ],
          brand: [
            { required: true, message: '请输入商品品牌', trigger: 'change' }
          ],
          pkg: [
            { required: true, message: '请输入商品单位', trigger: 'change' }
          ],
          spec: [
            { required: true, message: '请输入商品规格', trigger: 'change' }
          ],
          expirationDays: [
            { required: true, message: '请输入保质天数'},
            {  pattern:/^[0-9]\d*$/ ,message: '保质天数不能小于0或为小数'},
          ],
          sellingPrice:  [
            { required: true, message: '请输入销售价格'},
            { type: 'number', message: '请输入数字'},
            { pattern:/^\d+(\.\d+)?$/,message: '销售价格不能小于0'},
          ],
          purchasePrice:  [
            { required: true, message: '请输入采购价格'},
            { type: 'number', message: '请输入数字'},
            { pattern:/^\d+(\.\d+)?$/,message: '采购价格不能小于0'},
          ],
          inventory: [
            { required: true, message: '请输入商品库存'},
            {  pattern:/^[0-9]\d{0,5}$/ ,message: '商品库存不能小于0或为小数,且不能大于6位数'},
          ],
          safetyInventoryDays: [
            { required: true, message: '请输入安全天数'},
            {  pattern:/^[0-9]\d*$/ ,message: '安全天数不能小于0或为小数'},
          ],
        }
      }

    },

    computed: {
      /*选中一级分类，加载二级分类*/
      subCategories() {
        return this.$data.parentChildCategoryMap[this.$data.params.firstCategoryId];
      },
      editSecondCategories() {
        return this.$data.parentChildCategoryMap[this.$data.ruleForm.firstCategoryId];
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
          // 子分类ID与父分类映射
          this.childParentCategoryMap = {};

          this.categories.forEach(e=>{
            // 父分类与子分类映射
            sub[e.id]=e.subCategories;

            // 子分类ID与父分类映射
            let arr=e.subCategories;
            if(arr!=null&&arr!=undefined){
              arr.forEach(se=>{
                this.childParentCategoryMap[se.id]=e;
              })
            }
          });


        });
      },
      getBase: _.debounce(
        function () {

          console.log(this.ruleForm.barcode);
          console.log(this.ruleForm.barcode==null||this.ruleForm.barcode==undefined||this.ruleForm.barcode.trim()=='');
          // 构造默认数据
          let defaultData = JSON.parse(JSON.stringify(defaultForm));
          defaultData.barcode=this.ruleForm.barcode;
          if(this.ruleForm.barcode==null||this.ruleForm.barcode==undefined||this.ruleForm.barcode.trim()==''){
            this.ruleForm=defaultData;
            return;
          }
          this.editLoading=true;
          let url =bus.host+'/pos/api/product/base/';
          this.$http.get(url+this.ruleForm.barcode,{}).then((response) => {
            let data=response.data.msg;
            console.log(data);

            if(data.barcode==null){

              // 条码为空，表示所输入的条码在收银商品库和中国物品编码库中都没有对应的信息
              if(this.ruleForm.barcode!=null&&this.ruleForm.barcode!=''){
                // 条码输入框中的数据不为空，则可更改信息
                defaultData.disabled=false;
              }
              // 清空数据
              this.ruleForm=defaultData;
              this.editLoading=false;
              return;
            }else{
              // 加载出相应的信息
              for(let k in data){
                this.ruleForm[k]=data[k];
              }

              if(data.id!=null&&data.id!=''){
                if(data.syncId!=null&&data.syncId!=''&&data.syncId!=undefined){
                  // 若同步ID不为空，表示这是客服里面的商品，不能修改基础信息
                  this.ruleForm.disabled=true;
                }else{
                  this.ruleForm.disabled=false;
                }

                this.ruleForm.formTitle='更新';
                // 条码不为空，且基础商品ID不为空，表示在收银商品库中存在此条码信息
                this.ruleForm.secondCategoryId=data.secondCategory.id;
                this.ruleForm.secondCategoryName=data.secondCategory.name;

                let product;
                console.log(3333)
                if(data.products==null||data.products.length==0||data.products[0]==null){
                  product={
                    expirationDays:0,
                    sellingPrice:0,
                    purchasePrice:0,
                    inventory:0,
                    safetyInventoryDays:3,
                  }
                  this.ruleForm.inventoryChangeable=true;
                  this.ruleForm.status=false;

                }else{
                  product=data.products[0];
                  if(product.expirationDays==''||product.expirationDays==null||product.expirationDays==undefined){
                    product.expirationDays=0;
                  }

                  let status = product.status==1?false:true;
                  this.ruleForm.inventoryChangeable=status;
                  this.ruleForm.status=status;
                  if(product.picUrl!=''&&product.picUrl!=null){
                    // 如果自定义图片不为空，则使用自定义图片
                    this.ruleForm.picUrl=product.picUrl;
                  }
                }

                this.ruleForm.showPicUrl=bus.imgHost+this.ruleForm.picUrl;
                this.ruleForm.status=true; // 默认上架

                this.ruleForm.expirationDays=data.expirationDays;
                this.ruleForm.sellingPrice=product.sellingPrice;
                this.ruleForm.purchasePrice=product.purchasePrice;
                this.ruleForm.inventory=product.inventory;
                this.ruleForm.safetyInventoryDays=product.safetyInventoryDays;

                this.ruleForm.sype=data.type;
                this.ruleForm.typeName=data.type==1?'标品':'非标品';

                let firstCategory=this.childParentCategoryMap[data.secondCategory.id];
                if(firstCategory!=undefined){
                  this.ruleForm.firstCategoryId=firstCategory.id;
                  this.ruleForm.firstCategoryName=firstCategory.name;
                }
                this.ruleForm.picUrl=data.picUrl; // 先取基础商品图片，后面可能会被自定义商品图片覆盖
              }else{
                this.ruleForm.formTitle='新建';
                // 基础商品ID为空，表示在收银商品库中不存在，但在中国物品编码库中存在
                this.ruleForm.barcode=this.ruleForm.barcode.replace(/^0+/,""); // 去除前导0
                this.ruleForm.showPicUrl='';
                this.ruleForm.picUrl='';
                this.ruleForm.expirationDays=0,
                this.ruleForm.sellingPrice=0,
                this.ruleForm.status=true,
                this.ruleForm.purchasePrice=0,
                this.ruleForm.inventory=0,
                this.ruleForm.safetyInventoryDays=3,
                this.ruleForm.disabled=false;
                this.ruleForm.inventoryChangeable=true;
                this.ruleForm.firstCategoryId=''; // 一级分类ID
                this.ruleForm.firstCategoryName=''; // 一级分类名称
                this.ruleForm.secondCategoryId='';// 二级分类ID
                this.ruleForm.secondCategoryName=''; // 二级分类名称
              }
            }
            this.editLoading=false;
          }).catch((err)=>{
            this.editLoading=false;
          });
        },
        800
      ),
      submitForm(formName) {
        this.editLoading=true;

        console.log('>>>>>>>>>>>>>>>>>>')
        console.log(this.ruleForm)

        let row = {
          offshelf:this.ruleForm.status,
          id:this.ruleForm.id,
          productId:this.ruleForm.products!=null?(this.ruleForm.products[0]!=null?this.ruleForm.products[0].id:null):null,
          barcode:this.ruleForm.barcode,
          sellingPrice: this.ruleForm.sellingPrice,
          purchasePrice: this.ruleForm.purchasePrice,
          inventory: this.ruleForm.inventory,
          safetyInventoryDays:this.ruleForm.safetyInventoryDays,
          picUrl:this.ruleForm.picUrl,
          status:this.ruleForm.status?1:0,
          inventoryChangeable:this.ruleForm.inventoryChangeable,
          secondCategoryId:this.ruleForm.secondCategoryId,
          pkg:this.ruleForm.pkg,
          spec:this.ruleForm.spec,
          disabled:this.ruleForm.disabled,
          expirationDays:this.ruleForm.expirationDays
        };

        if(this.ruleForm.id==''||this.ruleForm.id==null||this.ruleForm.id==undefined){
          // 新建
          this.$refs[formName].validate((valid) => {
            if(this.ruleForm.barcode.length>30){
              this.$message({
                message: "输入条码过长",
                type: 'error'
              });
              this.editLoading=false;
              return;
            }
            if(this.ruleForm.name.length>30){
              this.$message({
                message: "输入商品名称过长",
                type: 'error'
              });
              this.editLoading=false;
              return;
            }
            if(this.ruleForm.spec.length>30){
              this.$message({
                message: "输入商品规格过长",
                type: 'error'
              });
              this.editLoading=false;
              return;
            }
            if(this.ruleForm.brand.length>30){
              this.$message({
                message: "输入商品品牌过长",
                type: 'error'
              });
              this.editLoading=false;
              return;
            }
            let inventoryStr=this.ruleForm.inventory+'';
            if(inventoryStr.length>6){
              this.$message({
                message: "商品库存太大啦",
                type: 'error'
              });
              this.editLoading=false;
              return;
            }
            if(this.ruleForm.status){
              // 新建并上架，需要校验价格信息
              if(!this.validate(row)){
                this.editLoading=false;
                return;
              }
            }

            let that=this;
            if (valid) {
              this.ruleForm.type=this.ruleForm.typeName==='标品'?1:0;
              let param=JSON.parse(JSON.stringify(this.ruleForm));
              let products=[{
                id:null,
                status:this.ruleForm.status?1:0,
                sellingPrice:param.sellingPrice,
                purchasePrice:param.purchasePrice,
                inventory:param.inventory,
                safetyInventoryDays:param.safetyInventoryDays,
                picUrl:param.picUrl
              }];
              let secondCategory={id:param.secondCategoryId};
              param.products=products;
              param.secondCategory=secondCategory;
              param.syncToMeituan=this.ruleForm.syncToMeituan==null?false:this.ruleForm.syncToMeituan;
              param.syncToEleme=this.ruleForm.syncToEleme==null?false:this.ruleForm.syncToEleme;
              this.$axios.post(bus.host+'/pos/api/product/create', param).then((response)=> {
                let success=response.data.success,msgType=success?'success':'error', msg;
                if(!success){
                  this.editLoading=false;
                  msg=response.data.msg;
                }else{
                  msg='商品【'+response.data.msg.name+'】创建成功！';
                }
                this.$message({
                  message: msg,
                  type: msgType,
                  duration:500,
                  onClose:function () {
                    if(success){
                      that.showEdit=false;
                      that.editLoading=false;
                      that.resetForm('ruleForm');
                      that.ruleForm=JSON.parse(JSON.stringify(defaultForm));
                      that.loadList();
                    }
                  }
                });
              }).catch(res=>{
                console.log(res.data);
              });
            } else {
              this.$message({
                message: '请更正错误！',
                type: 'warning',
                duration:1000
              });
              that.editLoading=false;
              return false;
            }
          });
        }else{
          // 更新商品信息
          this.changeStatus(row);
          this.editLoading=false;
        }
      },
      /*更改外卖复选框的状态*/
      updateTakeoutStatus(){
        this.$axios.get(bus.host+'/pos/api/system/takeout/list').then(res=>{
          let settings = res.data.msg,hasMeituan=false,hasEleme=false;
          settings.forEach(setting=>{
            switch (setting.takeoutType){
              case 0:
                // 美团
                hasMeituan=true;
                break;
              case 1:
                // 饿了么
                hasEleme=true;
                break;
            }
          });
          if(hasMeituan){
            this.meituanEnabled=true;
            this.meituanTips='';
          }else{
            this.meituanEnabled=false;
            this.meituanTips='(未绑定)'
          }
          if(hasEleme){
            this.elemeEnabled=true;
            this.elemeTips='';
          }else{
            this.elemeEnabled=false;
            this.elemeTips='(未绑定)'
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.ruleForm=JSON.parse(JSON.stringify(defaultForm));
      },
      closeForm(formName){
        this.$refs[formName].resetFields();
        this.ruleForm=JSON.parse(JSON.stringify(defaultForm));
        this.showEdit=false;
      },
      // 图片上传
      picHandler(res,file) {
        this.ruleForm.picUrl=res.msg[0];
        this.ruleForm.showPicUrl = URL.createObjectURL(file.raw);
        this.uploadLoading=false;
      },
      beforeUpload(file) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png'||file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImg) {
          this.$message.error('上传图片只能是jpg/png/gif格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isImg && isLt2M;
      },
      synchronizeToTakeoutStore(){
        this.$confirm('此操作将会更改外卖商品的名称、价格、图片，确定把便利店商品信息同步到外卖店铺吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get(bus.host+'/pos/api/takeout/product/sync').then(pres=>{
            if(!pres.data.success){
              this.$message({
                message: "商品同步失败！",
                type: 'error'
              });
              return;
            }
            this.$message({
              message: "商品正在后台上传...！",
              type: 'success'
            });
            this.showTakeoutSyncLog=true;
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
      onshelf(row){
        /*改变上下架状态*/
        row.inventoryChangeable=true;
        row.productId=row.products[0].id;
        this.changeStatus(row);
      },
      /*改变上下架状态*/
      changeStatus (row) {
        console.log(row)
        if (this.updateProductButton==false){
          return false;
        }
        this.updateProductButton = false;
        if(row.offshelf){
          // 当前状态是下架，则是上架操作需要做校验
          if(!this.validate(row)){
            this.editLoading=false;
            return;
          }
        }

        let params = {
          id: row.id,
          pkg:row.pkg,
          spec:row.spec,
          expirationDays:row.expirationDays,
          products: [
            {
              id:row.productId?row.productId:'null',
              sellingPrice: row.sellingPrice,
              purchasePrice: row.purchasePrice,
              inventory: row.inventory,
              picUrl: row.picUrl,
              status:row.offshelf?1:0,
            }
          ]
        }
        console.log(row.inventoryChangeable)
        if(row.inventoryChangeable){
          params.products[0].inventory=row.inventory;
        }
        if(row.safetyInventoryDays!=null&&row.safetyInventoryDays!=undefined){
          params.products[0].safetyInventoryDays=row.safetyInventoryDays;
        }
        if(!row.disabled){
          if(row.secondCategoryId!=null&&row.secondCategoryId!=undefined){
            params.secondCategory={id:row.secondCategoryId};
          }
        }

        let tip=row.offshelf?'上架':'下架';
        let url =  bus.host+'/pos/api/product/update'
        this.$axios.put(url,params).then((res) => {
          let data=res.data;
          if(!data.success){
            this.$message({
              message: data.msg,
              type: 'error'
            });
            return;
          }
          if (data.success) {
            this.$message({
              message: '商品【'+tip+'】成功！',
              type: 'success'
            });
            this.showEdit=false;
            this.resetForm('ruleForm');
            this.ruleForm=JSON.parse(JSON.stringify(defaultForm));
            this.loadList();
          }
          row.offshelf=row.offshelf?1:0;
        }, (res) => {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        });
        this.updateProductButton = true;
      },
      validate(row) {
        try{
          if(row.barcode==null||row.barcode==''||row.barcode==undefined) {
            this.$message({message: '上架商品条码不能为空！', type: 'warning'});
            throw row;
          }
          if(row.purchasePrice==null||row.purchasePrice===''||row.purchasePrice===0||row.purchasePrice<0||row.purchasePrice==0) {
            this.$message({message: '采购价格不能为空、零、负数！', type: 'warning'});
            throw row;
          }
          if(!/^\d+(\.\d+)?$/.test(row.purchasePrice)){
            this.$message({message: '采购价格不合法！', type: 'warning'});
            throw row;
          }
          if(row.sellingPrice==null||row.sellingPrice===0||row.sellingPrice===''||row.sellingPrice<0||row.sellingPrice==0) {
            this.$message({message: '零售价格不能为空、零、负数！', type: 'warning'});
            throw row;
          }
          if(!/^\d+(\.\d+)?$/.test(row.sellingPrice)){
            this.$message({message: '零售价格不合法！', type: 'warning'});
            throw row;
          }
          if(row.inventory==null||row.inventory==='') {
            this.$message({message: '商品库存不能为空！', type: 'warning'});
            throw row;
          }
          if(row.inventory<0){
            this.$message({message: '商品库存不能小于零！', type: 'warning'});
            throw row;
          }
          if(!/^[0-9]\d{0,5}$/.test(row.inventory)){
            this.$message({message: '商品库存不能超过6位数！', type: 'warning'});
            throw row;
          }
          if(!/^\d+$/.test(row.inventory)) {
            this.$message({message: '商品库存不合法！', type: 'warning'});
            throw row;
          }
          return true;
        }catch(e){
          this.updateProductButton = true;
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
  .upload-item .el-form-item__label{padding-top: 60px;}
</style>
