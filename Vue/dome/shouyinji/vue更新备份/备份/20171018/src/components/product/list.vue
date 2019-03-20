<template>
  <div class="content-list">
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>在售商品</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
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
        <el-button type="primary" @click="loadList" :loading="loading" icon="search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="7" class="tool-bar">
        <el-button type="primary" @click="exportProduct" size="small" icon="caret-right" :loading="loading">导出商品</el-button>
        <el-button type="primary" @click="$router.push('all')" size="small" icon="plus">商品上架</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table class="scrollbar" stripe border :data="list" v-loading="loading" @sort-change="sortList" :default-sort = "{prop: 'sellingPrice', order: 'ascending'}">
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
                <el-form-item label="一级分类">
                  <span>{{ props.row.firstCategoryName }}</span>
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
                <el-form-item label="毛利">
                  <span>{{ props.row.profit }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="name" label="商品名称"/>
          <el-table-column sortable="custom" prop="barcode" label="商品条码" />
          <!--<el-table-column prop="spec" label="商品规格" width="170"/>-->
          <el-table-column sortable="custom" prop="pkg" label="商品单位" width="100"/>
          <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类" width="110"/>
          <el-table-column sortable="custom" prop="categoryName" label="二级分类" width="110">
            <template scope="scope">
              {{scope.row.secondCategory.name}}
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="sellingPrice" label="零售价格" width="100">
            <template scope="scope">
              <span :class=" scope.row['products'][0]['sellingPrice']<=0?'color-red':'color-black'"> {{scope.row['products'][0]['sellingPrice']}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="purchasePrice" label="采购价格" width="100">
            <template scope="scope">
              <span :class=" scope.row['products'][0]['purchasePrice']<=0?'color-red':'color-black'"> {{scope.row['products'][0]['purchasePrice']}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="profit" label="毛利" width="110"/>
          <el-table-column sortable="custom" prop="inventory" label="商品库存" width="100">
            <template scope="scope">
              <span :class=" scope.row['products'][0]['inventory']<=0?'color-red':'color-black'"> {{scope.row['products'][0]['inventory']}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="安全天数" width="100">
            <template scope="scope">
              <span :class=" scope.row['products'][0]['safetyInventoryDays']==0?'color-red':'color-black'"> {{scope.row['products'][0]['safetyInventoryDays']}}</span>
            </template>
          </el-table-column>-->
          <!--<el-table-column label="商品类型" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.type" type="success">标品</el-tag>
              <el-tag v-else type="danger">非标品</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column label="操作" width="80" align="right">
            <template scope="scope">
              <!--<el-button size="small" @click="onEditUser(scope.$index,scope.row)">打印标价签</el-button>-->
              <el-button :disabled="scope.row.id==='DEFAULTID'?true:false" :plain="true" type="warning" size="small" @click="edit(scope.row,scope.$index)" icon="edit">编辑</el-button>
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
    <transition name="el-zoom-in-right">
      <div v-show="showEdit" class="transition-box scrollbar">
        <el-row class="box-title">
          <el-col :span="24" align="center">编辑商品</el-col>
        </el-row>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="ruleForm ruleForms">
          <el-form-item class="upload-item" label="商品图片:">
            <el-upload v-if="ruleForm.syncId==''"
                       class="upload-area"
                       :action="uploadUrl"
                       name="files"
                       :show-file-list="false"
                       :on-success="picHandler"
                       :beforeUpload="beforeUpload" v-loading="uploadLoading">
              <img v-if="ruleForm.picUrl" :src="ruleForm.showPicUrl" class="preview">
              <i class="el-icon-upload2 upload-area-icon"></i>
            </el-upload>
            <img v-else :src="ruleForm.showPicUrl" class="preview">
          </el-form-item>
          <el-row v-if="this.ruleForm.status==true">
          <el-form-item label="商品名称:" prop="name" :rules="[{ required: true, message: '请输入商品名称' }]">
            <el-input v-model="ruleForm.name" size="small" :disabled="ruleForm.syncId==''?false:true"/>
          </el-form-item>
          <el-form-item label="商品类型:" prop="type"  :rules="[{ required: true, message: '请选择商品类型'  }]">
            <el-radio-group v-model="ruleForm.type" :disabled="ruleForm.syncId==''?false:true">
              <el-radio v-for="item in productTypes" :key="item.name" :label="item.key">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row>
          <el-form-item label="商品分类:" style=" display: inline-block;" prop="firstCategoryId" :rules="[{  required: true, message: '请选择一级分类', trigger: 'change' }]">
            <el-select v-model="ruleForm.firstCategoryId" clearable placeholder="一级分类" size="small" :disabled="ruleForm.syncId==''?false:true"  style="width: 129px;">
              <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item style=" display: inline-block;"   prop="secondCategoryId" :rules="[{  required: true, message: '请选择二级分类', trigger: 'change'  }]">
            <el-select v-model="ruleForm.secondCategoryId" clearable placeholder="二级分类" size="small" :disabled="ruleForm.syncId==''?false:true" style="width: 129px;">
              <el-option v-for="item in editSecondCategories" :key="item.name" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          </el-row>
          <!--<el-form-item label="商品分类:" required>-->
            <!--<el-row>-->
              <!--<el-col :span="12">-->
                <!--<el-select v-model="ruleForm.firstCategoryId" clearable placeholder="一级分类" size="small" :disabled="ruleForm.syncId==''?false:true" >-->
                  <!--<el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"/>-->
                <!--</el-select>-->
              <!--</el-col>-->
              <!--<el-col :span="12">-->
                <!--<el-select v-model="ruleForm.secondCategoryId" clearable placeholder="二级分类" size="small" :disabled="ruleForm.syncId==''?false:true">-->
                  <!--<el-option v-for="item in editSecondCategories" :key="item.name" :label="item.name" :value="item.id"/>-->
                <!--</el-select>-->
              <!--</el-col>-->
            <!--</el-row>-->
          <!--</el-form-item>-->
          <el-form-item label="商品条码:" prop="barcode"  :rules="[{ required: true, message: '请选择输入商品条码', trigger: 'blur' }]">
            <el-input v-model="ruleForm.barcode" size="small" :disabled="ruleForm.syncId==''?false:true"/>
          </el-form-item>
          <el-form-item label="商品品牌:" prop="brand"  :rules="[{ required: true, message: '请选择输入商品品牌', trigger: 'blur' }]">
            <el-input v-model="ruleForm.brand" size="small" :disabled="ruleForm.syncId==''?false:true"/>
          </el-form-item>
          <el-form-item label="商品单位:" prop="pkg"  :rules="[{ required: true, message: '请选择输入商品单位', trigger: 'blur' }]">
            <el-input v-model="ruleForm.pkg" size="small" :disabled="ruleForm.syncId==''?false:true"/>
          </el-form-item>
          <el-form-item label="商品规格:" prop="spec"  :rules="[{ required: true, message: '请选择输入商品规格', trigger: 'blur' }]">
            <el-input v-model="ruleForm.spec" size="small" :disabled="ruleForm.syncId==''?false:true"/>
          </el-form-item>
          <el-form-item label="保质天数:" prop="expirationDays" :rules="[
            { required: true, message: '保质天数不能为空'},
            {  pattern:/^[0-9]\d*$/ ,message: '保质天数不能小于0或为小数'},
          ]">
            <el-input v-model="ruleForm.expirationDays" size="small" :disabled="ruleForm.syncId==''?false:true"/>
          </el-form-item>
          </el-row>
          <el-row v-else="this.ruleForm.status==false">
            <el-form-item label="商品名称:" prop="name" >
              <el-input v-model="ruleForm.name" size="small" :disabled="ruleForm.syncId==''?false:true"/>
            </el-form-item>
            <el-form-item label="商品类型:" prop="type"  >
              <el-radio-group v-model="ruleForm.type" :disabled="ruleForm.syncId==''?false:true">
                <el-radio v-for="item in productTypes" :key="item.name" :label="item.key">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品分类:">
              <el-row>
                <el-col :span="12">
                  <el-select v-model="ruleForm.firstCategoryId" clearable placeholder="一级分类" size="small" :disabled="ruleForm.syncId==''?false:true" >
                    <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select v-model="ruleForm.secondCategoryId" clearable placeholder="二级分类" size="small" :disabled="ruleForm.syncId==''?false:true">
                    <el-option v-for="item in editSecondCategories" :key="item.name" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="商品条码:" prop="barcode" >
              <el-input v-model="ruleForm.barcode" size="small" :disabled="ruleForm.syncId==''?false:true"/>
            </el-form-item>
            <el-form-item label="商品品牌:" prop="brand"  >
              <el-input v-model="ruleForm.brand" size="small" :disabled="ruleForm.syncId==''?false:true"/>
            </el-form-item>
            <el-form-item label="商品单位:" prop="pkg"  >
              <el-input v-model="ruleForm.pkg" size="small" :disabled="ruleForm.syncId==''?false:true"/>
            </el-form-item>
            <el-form-item label="商品规格:" prop="spec" >
              <el-input v-model="ruleForm.spec" size="small" :disabled="ruleForm.syncId==''?false:true"/>
            </el-form-item>
            <el-form-item label="保质天数:" prop="expirationDays" >
              <el-input v-model="ruleForm.expirationDays" size="small" :disabled="ruleForm.syncId==''?false:true"/>
            </el-form-item>
          </el-row>
          <el-form-item label="商品状态:" prop="status">
            <el-switch on-text="上架" off-text="下架" v-model="ruleForm.status"/>
          </el-form-item>
          <el-row v-if="this.ruleForm.status==true">
          <el-form-item label="零售价格:" prop="sellingPrice" :rules="[
            { required: true, message: '零售价格不能为空'},
            { type: 'number', message: '零售价格必须为数字值'},
            { pattern:/^\d+(\.\d+)?$/,message: '零售价格不能小于0'},
          ]">
            <el-input v-model.number="ruleForm.sellingPrice" size="small"/>
          </el-form-item>
          <el-form-item label="采购价格:" prop="purchasePrice" :rules="[
            { required: true, message: '采购价格不能为空'},
            { type: 'number', message: '采购价格必须为数字值'},
            { pattern:/^\d+(\.\d+)?$/ ,message: '采购价格不能小于0'},
          ]">
            <el-input v-model.number="ruleForm.purchasePrice" size="small"/>
          </el-form-item>
          <!--<el-form-item label="商品库存:" prop="inventory" :rules="[-->
            <!--{ required: true, message: '商品库存不能为空'},-->
            <!--{ type: 'number', message: '商品库存必须为数字值'},-->
            <!--{ pattern:/^[0-9]\d*$/ ,message: '商品库存不能小于0或为小数'},-->
          <!--]">-->
            <!--<el-input v-model.number="ruleForm.inventory" size="small"/>-->
          <!--</el-form-item>-->
          <el-form-item label="商品库存:" prop="inventory" >
            <el-input v-model.number="ruleForm.inventory"  :disabled="true" size="small"/>
          </el-form-item>
          <el-form-item label="安全天数:" prop="safetyInventoryDays" :rules="[
            { required: true, message: '安全天数不能为空'},
            { type: 'number', message: '安全天数必须为数字值'},
            { pattern:/^[0-9]\d*$/,message: '安全天数不能小于0或为小数'},
          ]">
            <el-input v-model.number="ruleForm.safetyInventoryDays" size="small"/>
          </el-form-item>
          </el-row>
          <el-row v-else="this.ruleForm.status==false">
            <el-form-item label="零售价格:" prop="sellingPrice" >
              <el-input v-model.number="ruleForm.sellingPrice" size="small"/>
            </el-form-item>
            <el-form-item label="采购价格:" prop="purchasePrice">
              <el-input v-model.number="ruleForm.purchasePrice" size="small"/>
            </el-form-item>
            <el-form-item label="商品库存:" prop="inventory" >
              <el-input v-model.number="ruleForm.inventory"  :disabled="true" size="small"/>
            </el-form-item>
            <el-form-item label="安全天数:" prop="safetyInventoryDays" >
              <el-input v-model.number="ruleForm.safetyInventoryDays" size="small"/>
            </el-form-item>
          </el-row>
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
  </div>
</template>
<script>
    import {bus} from '../../bus.js';
    import math from '../../utils/math.js'
    export default{
      data(){
            return {
                list:[], // 列表数据
                listSort:{},
                categories:[], // 商品分类
                parentChildCategoryMap:[], // 父分类与子分类列表的映射
                productTypes:[ // 商品类型
                  { key:1, name: '标  品' },
                  { key:0, name: '非标品' }
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
                uploadLoading:false,
                showEdit: false,
                uploadUrl:bus.host+'/pos/api/upload',
                inv:'',
                ruleForm: {
                  id:'',
                  name:'',
                  brand:'',
                  barcode:'',
                  spec:'',
                  no:'',
                  expirationDays:0,
                  type:'', // 商品类型
                  typeName: '',
                  firstCategoryId:'', // 一级分类ID
                  firstCategoryName:'', // 一级分类名称
                  secondCategoryId:'', // 二级分类ID
                  secondCategoryName:'', // 二级分类名称
                  sellingPrice:0,
                  purchasePrice:0,
                  inventory:0,
                  safetyInventoryDays:0,
                  status: false,
                  picUrl:'',
                  showPicUrl:'',
                  syncId:''
                },
                exportForm:{
                  url:'',
                  params:{}
                },
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
                    if(!data.success) throw res;
                    let msg=data.msg;
                    this.page.total =msg.totalElements;
                    let content=msg.content;
                    content.forEach((e)=>{
                       if(e.products.length==0){
                         e['inventory']=0;
                         e['status']=0;
                         e['sellingPrice']=0;
                         e['purchasePrice']=0;
                         e['safetyInventoryDays']=0;
                         e['secondCategoryId']='';
                         e['secondCategoryName']='';
                         e['syncId']='';
                         e.profit=0;
                       }else{
                         let product=e.products[0];
                         e['inventory']=product.inventory;
                         e['status']=product.status;
                         e['sellingPrice']=product.sellingPrice;
                         e['purchasePrice']=product.purchasePrice;
                         e['safetyInventoryDays']=product.safetyInventoryDays;
                         e['firstCategoryId']=e.secondCategory.parentId;
                         e['secondCategoryId']=e.secondCategory.id;
                         e['secondCategoryName']=e.secondCategory.name;
                         e['syncId']=e.syncId==null?'':e.syncId;
                         e.profit=product.profit;
                       }
                    });
                    this.list = content;
                    this.loading = false;
                }).catch((err)=>{
                  this.$notify.error({
                    title: '错误',
                    message: err.data.msg
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
              this.$axios.get(url,{}).then((res) => {
                if(!res.data.success) throw res;
                this.categories = res.data.msg;
                // 父分类与子分类映射
                let sub=this.$data.parentChildCategoryMap;
                this.categories.forEach(e=>sub[e.id]=e.subCategories);
              }).catch(err=>{
                this.$notify.error({
                  title: '错误！',
                  message: err.data.msg
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
              this.ruleForm.id=row.id;
              this.ruleForm.name=row.name;
              this.ruleForm.status=row.status==0?false:true;
              this.ruleForm.barcode=row.barcode;
              this.ruleForm.no=row.no;
              this.ruleForm.brand=row.brand;
              this.ruleForm.pkg=row.pkg;
              this.ruleForm.spec=row.spec;
              this.ruleForm.type=row.type;
              this.ruleForm.expirationDays=row.expirationDays;
              this.ruleForm.typeName=row.type==1?'标品':'非标品';
              this.ruleForm.secondCategoryId=row.secondCategoryId;
              this.ruleForm.secondCategoryName=row.secondCategoryName;
              this.ruleForm.sellingPrice=row.sellingPrice;
              this.ruleForm.purchasePrice=row.purchasePrice;
              this.ruleForm.inventory=row.inventory;
              this.inv=row.inventory;
              this.ruleForm.safetyInventoryDays=row.safetyInventoryDays;
              this.ruleForm.syncId=row.syncId;
              this.ruleForm.picUrl=row.picUrl;
              this.ruleForm.showPicUrl=bus.imgHost+row.picUrl;
              this.showEdit=true;
              this.categories.forEach((e)=>{
                if(e.id===row.firstCategoryId)
                    this.ruleForm.firstCategoryId=e.id;
                    this.ruleForm.firstCategoryName=e.name;
              });
            },

            submitForm(formName) {
              this.loading=true;
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  let params={
                      id:this.ruleForm.id,
                      name:this.ruleForm.name,
                      type:this.ruleForm.type,
                      secondCategory:{id:this.ruleForm.secondCategoryId},
                      no:this.ruleForm.no,
                      barcode:this.ruleForm.barcode,
                      brand:this.ruleForm.brand,
                      pkg:this.ruleForm.pkg,
                      expirationDays:this.ruleForm.expirationDays,
                      spec:this.ruleForm.spec,
                      picUrl:this.ruleForm.picUrl,
                      products:[{
                        id:'null',
                        status:this.ruleForm.status?1:0,
                        sellingPrice:this.ruleForm.sellingPrice,
                        purchasePrice:this.ruleForm.purchasePrice,
//                        inventory:this.ruleForm.inventory,
                        inventory:this.inv,
                        safetyInventoryDays:this.ruleForm.safetyInventoryDays
                      }]
                  };
                  this.$http.put(bus.host+'/pos/api/product/update', params).then((response)=> {
                    let type='warning';
                    if (response.data.success)
                      type='success';
                    this.$message({
                      message: response.data.msg,
                      type: type
                    });
                    if (response.data.success){
                      this.showEdit=false;
                      this.loadList();
                    }
                    this.$refs[formName].resetFields();
                    this.loading=false;
                  });
                } else {
                  this.loading=false;
                  return false;
                }
              });
            },
            resetForm(formName) {
              this.$refs[formName].resetFields();
              if(this.ruleForm.status==false){
                this.$refs[formName].resetFields();
              }
            },
            closeForm(formName){
              this.$refs[formName].resetFields();
              this.showEdit=false;
            },
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
            // 导出商品
            exportProduct(){
              let url=bus.host+'/pos/api/product/export';
              if(this.listSort.order!=null){
                url+='?sort='+this.listSort.prop+','+this.listSort.order;
              }
              this.loading = true;
              this.$axios.post(url,this.params,{}).then(res => {
                if(!res.data.success){
                  this.$message.error(res.data.msg);
                  return;
                }
                this.$notify.success({message:'导出成功,正在下载...',duration:1000,onClose:function () {
                  window.location=res.data.msg;
                }});
                this.loading=false;
              });
            }
          },
          mounted() {
            this.loadCategory(0);
            this.loadList();
          }
    }
</script>
<style>
  .el-zoom-in-right-enter-active,.el-zoom-in-right-leave-active {
    transition:all .3s
  }
  .el-zoom-in-right-enter-active,.el-zoom-in-right-leave-active {
    /*opacity:1;*/
    margin-right: 0;
    /*-ms-transform:scaleX(1);*/
    /*transform:scaleX(1);*/
    /*-ms-transform-origin: right center;*/
    /*transform-origin: right center;*/
  }
  .el-zoom-in-right-enter,.el-zoom-in-right-leave-active {
    /*opacity:0;*/
    margin-right: -405px;
    /*-ms-transform:scaleX(0);*/
    /*transform:scaleX(0)*/
  }
  .scrollbar .el-table .cell{padding: 0 10px}
  .color-red{color: red;}
  .color-black{color: #000;}
  .breadcrumb-border{
    border-bottom:1px solid #efefef;
    margin-bottom:10px;
  }
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .transition-box .el-form-item{
    margin-bottom: 15px;
  }
  .transition-box {
    box-shadow: 0px 0px 0px 2px #383531;
    position: fixed;
    top:50px;
    right:0;
    width: 400px;
    height: 100%;
    background-color: #f6f3ee;
    color: #fff;
    box-sizing: border-box;
    z-index:999;
    overflow:scroll;
    padding-bottom: 70px;
  }
  .transition-box .box-title{
    position: fixed;
    top: 50px;
    width: 400px;
    padding: 5px;
    background-color: #F6F3EE !important;
    color: #6A5C48 !important;
    border-bottom: 1px solid #e8e8e8 !important;
    z-index:999;
  }
  .transition-box .ruleForm{
    padding-right: 20px;
    padding-top:50px;
  }
  .transition-box .box-footer{
    position: fixed;
    bottom: 0;
    width: 400px;
    padding: 5px;
    background-color: #F6F3EE !important;
    color: #6A5C48 !important;
    border-top: 1px solid #e8e8e8 !important;
  }
  .transition-box .form-inline{
    display: inline;
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  /*上传*/
  .upload-item .el-form-item__content{
    margin-left: 100px!important;
    text-align: center;
  }
  .upload-area{margin-left: 0;}
  .upload-area .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 130px;
  }
  .upload-area .el-upload:hover {
    border-color: #20a0ff;
  }
  .upload-area .el-upload {
    width:270px;
  }
 /* .upload-item .el-form-item__label{
    padding-top:60px;
  }*/
  .upload-area-icon {
    font-size: 28px;
    color: #8c939d;
    width: 270px;
    height: 130px;
    line-height: 130px;
    text-align: center;
    position: absolute;
    top:0;
    left:0;
  }
  .preview {
    width: 270px;
    height: 130px;
    display: block;
  }

  .data-table-expand {
    font-size: 0;
  }
  .data-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .data-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .transition-box .ruleForm{
    padding-bottom: 60px;
  }
  /*.ruleForm{*/
    /*height: 100%;*/
    /*overflow-y: scroll;*/
    /*overflow-x: hidden;*/
  /*}*/
  /*.transition-box .ruleForms{padding-top: 30px!important}*/
</style>
