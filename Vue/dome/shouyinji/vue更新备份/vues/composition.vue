<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum nav_top">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm DetermineForm">
        <el-col  :sm="24" :md="24" :lg="14">
          <el-form-item label="活动名称:" prop="name">
            <el-input v-model="ruleForm.name" class="form-inline"></el-input>
          </el-form-item>
          <el-form-item label="促销类别:" >
            {{ruleForm.typeName}}
          </el-form-item>
          <el-form-item label="活动有效期:" required>
            <el-date-picker
              v-model="Activity_time"
              type="datetimerange"
              placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-col :span="24" style="padding: 0 10px 10px 0">
            <el-form-item label="套餐设置" class="Dmck">
              <el-col :span="24" style="padding: 0 10px 10px 0">
                <el-button type="primary" @click="addProductGroup" >添加分组</el-button>
              </el-col>
              <el-col class="Grouptab" :span="24">
                <div v-for="(group,groupIndex) in productGroups" @click="setupGroupIndex(groupIndex)">
                  <!--<el-button type="danger" @click="showProductDialog(groupIndex)" size="small">添加商品</el-button>-->
                  <!--<el-button type="danger" @click="removeProductGroup(groupIndex)" size="small">删除分组</el-button>-->
                  <!--<el-button type="default" @click="removeSelectedGroupProduct(groupIndex)" size="small">清空所选商品-->
                  <!--</el-button>-->
                  <el-col :span="8" style="padding-left: 0">
                    <el-input v-model="group.couponName"  size="small" :placeholder="placeholder+(groupIndex+1)"></el-input>
                  </el-col>
                  <el-col :span="3" style="padding: 0 10px" >
                    <el-checkbox v-model="group.GoodsQuantity" @change='tableKey=tableKey+1' >固定数量</el-checkbox>
                  </el-col>
                  <el-col :span="9" :class="group.GoodsQuantity==true?'checked_len_true':'checked_len_false'">
                    <el-col :span="13" style="padding-right: 0" ><span>以下</span><span class="group_len">{{group.items.length}}</span><span>种商品任选:</span></el-col>
                    <el-col :span="9" style="padding-left: 0" >
                      <el-input type="number" v-model="group.limitNum"   size="small" style="width: 50px"></el-input><span>件</span>
                    </el-col>
                  </el-col>
                  <!--<el-input  type="number" v-model="group.limitNum" placeholder="数量限制" size="small" style="width:100px;"/>-->
                  <el-col :span="4" class="fr tool-bar" >
                    <!--<el-tooltip class="item" effect="dark" content="商品添加" placement="top">-->
                      <!--<el-button type="success" icon="plus" @click="showProductDialog(groupIndex)" size="small"></el-button>-->
                    <!--</el-tooltip>-->
                    <my-component v-on:trans-list="trans" :child-com="groupIndex"></my-component>
                    <el-tooltip class="item" effect="dark" content="删除分组" placement="right">
                      <el-button   icon="delete" :plain="true" type="danger" @click="removeProductGroup(groupIndex)" size="small"></el-button>
                    </el-tooltip>
                  </el-col>
                  <el-table   :key='tableKey' class="Package_class" :data="group.items" @selection-change="handleProductGroupSelection">
                    <el-table-column   type="index" width="50" />
                    <el-table-column prop="name" label="商品名称"/>
                    <el-table-column prop="barcode" label="条码"/>
                    <el-table-column prop="sellingPrice" label="零售价"  width="100"/>
                    <el-table-column label="数量"  v-if='group.GoodsQuantity'>
                      <template scope="scope">
                        <el-input type="number" v-model="scope.row.quantity" :value="scope.row.quantity"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template scope="scope">
                        <el-button type="danger" @click="removeProduct(groupIndex,scope.$index)" size="small">删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="padd_N">
            <el-form-item label="套餐价:"  prop="packagePrice" required>
              <el-input type="number" v-model="ruleForm.packagePrice" class="form-inline" @input="Discount_check(ruleForm)"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col  :sm="24" :md="24" :lg="24">
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea"  v-model="ruleForm.remark" ></el-input>
          </el-form-item>
        </el-col>
        <el-col  :sm="24" :md="24" :lg="24">
          <el-form-item class="txt-cent">
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitForm_loading">保存</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-col>
        <!--<el-col  :sm="24" :md="24" :lg="24">-->
          <!--<el-dialog title="商品添加" :visible.sync="dialogFormVisible" ref='dialog'  @close="show()" >-->
            <!--<el-col :span="24">-->
              <!--<el-row :gutter="10">-->
                <!--<el-col :span="3">-->
                  <!--<el-select v-model="selectedDepartment" clearable placeholder="一级分类" id="id_ment">-->
                    <!--<el-option class="idment" v-for="item in Primarydata" :key="item.name" :label="item.name"-->
                               <!--:value="item.id"></el-option>-->
                  <!--</el-select>-->
                <!--</el-col>-->
                <!--<el-col :span="3">-->
                  <!--<el-select v-model="selectedDepart" clearable placeholder="二级分类">-->
                    <!--<el-option class="idmento" v-for="item in subCategories" :key="item.name" :label="item.name"-->
                               <!--:value="item.id"></el-option>-->
                  <!--</el-select>-->
                <!--</el-col>-->
                <!--<el-col :span="4">-->
                  <!--<el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model="listQuery.searchWord"/>-->
                <!--</el-col>-->
                <!--<el-col :span="4">-->
                  <!--<el-button type="primary" @click="handleFilter" icon="search">搜索</el-button>-->
                <!--</el-col>-->
              <!--</el-row>-->
            <!--</el-col>-->
            <!--<el-col :span="24">-->
              <!--<el-table :data="tableData_Load" style="width: 100%" v-loading="listLoading" ref="multipleTable" row-key="id"-->
                        <!--@selection-change="handleSelectionChange"-->
                        <!--tooltip-effect="dark" class="tableData_Load">-->
                <!--<el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>-->
                <!--<el-table-column prop="name" label="商品名称"></el-table-column>-->
                <!--<el-table-column prop="barcode" label="商品条码"></el-table-column>-->
                <!--<el-table-column prop="spec" label="规格"></el-table-column>-->
                <!--<el-table-column prop="pkg" label="单位"></el-table-column>-->
                <!--<el-table-column prop="secondCategory.name" label="分类"></el-table-column>-->
              <!--</el-table>-->
              <!--<el-pagination-->
                <!--@size-change="handleSizeChange"-->
                <!--@current-change="handleCurrentChange"-->
                <!--:current-page.sync="currentPage3"-->
                <!--:page-size=listQuery.pageSize-->
                <!--layout="total,prev, pager, next, jumper"-->
                <!--:total="total">-->
              <!--</el-pagination>-->
            <!--</el-col>-->
            <!--<div slot="footer" class="dialog-footer">-->
              <!--<el-button @click="dialogFormVisible = false" class="fr">取 消</el-button>-->
              <!--<el-button type="primary" @click="update(currentGroupIndex)"  class="fr mg_r" >确 定</el-button>-->
            <!--</div>-->
          <!--</el-dialog>-->
        <!--</el-col>-->
      </el-form>
    </el-col>
  </el-row>
</template>


<style>

</style>

<script>
  import Vue from 'vue';
  import {bus} from '../../bus.js';
  import {dateFormat} from '../../utils/date.js';
  Vue.component('my-component', {
    props: ['childCom'],
    template: '  <div>\n' +
    '    <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>\n' +
    '    <el-dialog\n' +
    '      title="提示"\n' +
    '      :visible.sync="dialogVisible"\n' +
    '      size="tiny"\n' +
    '      :before-close="handleClose">\n' +
    '      <span>这是一段信息{{dialogList}}-{{childCom}}</span>\n' +
    '      <span slot="footer" class="dialog-footer">\n' +
    '    <el-button @click="dialogVisible = false">取 消</el-button>\n' +
    '    <el-button type="primary" @click="handleClose">确 定</el-button>\n' +
    '  </span>\n' +
    '    </el-dialog>\n' +
    '  </div>',
    data: function () {
      return {
        dialogVisible: false,
        dialogList: {id:1}
      }
    },
    methods: {
      handleClose: function() {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('trans-list', this.dialogList);
          })
          .catch(_ => {});
      }
    }
  })
  export default {
    data() {
      return {
        dialogVisible: false,
        url: bus.host + '/pos/api/product/list',
        transList:'',
        ruleForm: {
          name: '',
          typeName: '',
          remark:'',
          packagePrice:'',
          typeCode: '',
          baseList:[],
        },
        listQuery: {
          searchWord: '',
          productStatus: 1,
          firstCategoryId: '',
          secondCategoryId: '',
          page: 1,
          pageSize: 15,
        },
        total: 1,
        currentPage3: 1,
        Activity_time: '',
        tableData:[],
        tableData_Load:[],
        Primarydata:[],
        currentGroupIndex: '', // 当前正在修改分组索引值
        productGroups: [], // 产品分组数组
        tableKey: 0,
        Grouptab:'',
        placeholder:'分组',
        GoodsQuantity: false,
        selectedDepart: '',
        selectedDepartment: '',
        clicktag:0,
        multipleSelection:'',
        submitForm_loading:false,
        listLoading: false,
        dialogFormVisible: false,
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
          packagePrice: [
            {type:'number', required: true, message: '请输入套餐价格', trigger: 'blur'}
          ],
        },
      }
    },
    computed: {
      /**
       * @param  {object} subCategories 数据联动
       */
      subCategories() {
        let list = [];
        let selectedDepart = this.$data.selectedDepartment;
        this.$data.Primarydata.forEach(function (d) {
          if (d.id == selectedDepart) {
            list = d.subCategories;
          }
        });
        return list;
      },
    },
    methods: {
      trans(trans) {
        this.transList = trans;
        alert(this.transList)
      },
      Primaryone() {
        let url = bus.host + '/pos/api/category/list/0'
        this.$http.get(url, {}).then((response) => {
          if (response.data.success == false) {
          } else {
            this.Primarydata = response.data.msg;
          }
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },

      /*表格数据添加*/
      Add_goods(){
        this.dialogFormVisible = true;
        this.getTable();
      },
      /*表格数据清空*/
      empty_goods(){
        $('.tableData tbody tr').html("");
        this.tableData = [];
      },
      /*分页*/
      handleSizeChange(val) {
        this.listQuery.pagesize = val;
        this.getTable();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getTable();
      },
      /*dialog商品选中*/
      handleSelectionChange(selection){
        this.multipleSelection = selection;
      },
      /*dialog商品删除*/
      showremove(row, index){
        this.tableData.splice(index, 1)
      },
      /*dialog数据收索*/
      handleFilter(){
        this.getTable();
      },
      /*页面加载数据查询*/
      created(){
        if(this.$route.query.couponId){
          let url = bus.host + '/pos/api/promotion/detail?couponId=';
          let id=this.$route.query.couponId;
          if(id==null){
            return false
          }
          this.$http.get(url+id).then((response)=>{
            let res=response.data.msg;
            this.ruleForm.typeCode=res.typeCode
            this.tableData=res.baseList;
            this.ruleForm.name=res.name;
            this.ruleForm.id = res.id;
            this.ruleForm.typeName=res.typeName;
            this.Activity_time=[new Date(res.startTime),new Date(res.endTime)];
            this.ruleForm.remark=res.remark;
            let obj = eval('(' + res.rule + ')');
            let productGroup = [];
            obj.forEach(e => {
              let product = {couponName:'',limitNum: '', items: '', limitNum: '',GoodsQuantity:''};
              product.limitNum = e.quantity;
              product.couponName =e.couponName;
              product.items = e.baseList;
              for (let i = 0; i < e.baseList.length; i++) {
                product.items[i].sellingPrice = e.baseList[i].products[0].sellingPrice;
                product.items[i].inventory = e.baseList[i].products[0].inventory;
              };
              product.limitNum = e.quantity;
              if (product.limitNum==0 || product.limitNum=='0'){
                product.GoodsQuantity=true;
              }else {
                product.GoodsQuantity=false;
              }
              this.addProductGroup;
              productGroup.push(product);
            });
            for (let z = 0; z<productGroup.length;z++){
              this.productGroups[z]= productGroup[z];
            }
            let packagePrice =  obj[0].packagePrice;
            this.ruleForm.packagePrice = packagePrice;
          }, (response) => {
            this.$notify.error({
              title: '错误',
              message: '这是一条错误的提示消息'
            });
          })
        }else {
          this.ruleForm.typeName = this.$route.query.label;
          this.ruleForm.value = this.$route.query.value;
          let Grouptab=2;
          for(var i=0;i<Grouptab;i++){
            this.addProductGroup();
          }
        }
      },
      /*dialog数据查询*/
      getTable() {
        let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        this.listLoading = true;
        this.listQuery.firstCategoryId = this.$data.selectedDepartment;
        this.listQuery.secondCategoryId = this.$data.selectedDepart;
        this.$http.post(this.url + pg, this.listQuery, {}).then((response) => {
          if (response.data.success == false) {
            this.$notify.error({
              title: '错误',
              message: '您没用权限哦！'
            });
          }
          this.total = response.data.msg.totalElements;
          this.tableData_Load = response.data.msg.content;
          this.listLoading = false;
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      /*清空dialog分类,搜索*/
      show(){
        this.$data.selectedDepartment='';
        this.$data.selectedDepart='';
        this.listQuery.searchWord='';
      },
      /*dialog选择确定*/
      update(groupIndex){
        let checked = this.multipleSelection;
        if (checked.length < 1) {
          this.$message({
            message: '请选择商品',
            type: 'warning'
          });
          return;
        }
        checked.forEach(e => {
          e.sellingPrice = e.products[0].sellingPrice;
          e.inventory = e.products[0].inventory;
        });
        // 原来的产品
        let oldGroup = this.productGroups[groupIndex];
        let items = oldGroup.items;
        let merged = items.concat(checked);
        // 去重
        let idToProductMap = [];
        merged.forEach(e => {
          //添加的商品数量
          e.quantity=1;
          let ele = idToProductMap[e.id];
          if (ele == null || ele == undefined) {
            idToProductMap[e.id] = e;
          }
        });
        let uniqueArr = [];
        for (let k in idToProductMap) {
          uniqueArr.push(idToProductMap[k]);
        }
        oldGroup.items = uniqueArr;
        this.productGroups[groupIndex] = oldGroup;
        let self = this;
        this.$message({
          message: '商品添加成功！！！',
          type: 'success',
          duration: 200,
          onClose: function () {
            self.dialogFormVisible = false;
          }
        });
        this.$data.selectedDepartment='';
        this.$data.selectedDepart='';
        this.listQuery.searchWord='';
      },
      Discount_check(val){
        this.ruleForm.packagePrice = Number(val.packagePrice);
//        if (val.packagePrice != null) {
//          this.ruleForm.packagePrice =val.packagePrice.replace(/[^\d.]/g, '').replace(/\.{2,}/g, ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
//        }
        },
      /*弹出商品选择框*/
      showProductDialog(index){
        this.currentGroupIndex = index;
        this.dialogFormVisible = true;
        this.getTable();
//        if(this.multipleSelection.length>0){
//          this.$refs.multipleTable.clearSelection();
//        }
      },
      /*删除分组中的商品*/
      removeProduct(groupIndex, productIndex){
        this.productGroups[groupIndex].items.splice(productIndex, 1);
      },
      /*删除分组中所选的商品*/
      removeSelectedGroupProduct(groupIndex){
        this.currentGroupIndex = groupIndex;
        let groupItems = this.productGroups[groupIndex].items;
        let removeItems = this.selectedGroupProducts[groupIndex];
        let removeIds = [];
        removeItems.forEach(e => removeIds.push(e.id));
        // 需要保留下来的商品
        let keepItems = [];
        groupItems.forEach(e => {
          if (removeIds.indexOf(e.id) == -1) {
            keepItems.push(e);
          }
        });
        this.productGroups[groupIndex].items = keepItems;
      },
      /*添加产品分组*/
      addProductGroup(){
        this.productGroups.push({
          limitNum:0, // 数量限制默认为0
          items: [],
          couponName:'',
        });
//        this.selectedGroupProducts.push([]);
      },
      /*删除产品分组*/
      removeProductGroup(groupIndex){
        this.productGroups.splice(groupIndex, 1);
      },
      /*修正当前分组索引*/
      setupGroupIndex(groupIndex){
        this.currentGroupIndex = groupIndex;
      },
      handleProductGroupSelection(val){
        this.selectedGroupProducts[this.currentGroupIndex] = val;
      },
      /*数据提交*/
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              //数据适配
              this.submitForm_loading=true;
              let Groupsitems=true;
              let couponRuleList = [];
              this.productGroups.forEach(e => {
                if(e.items==''||e.items==null||e.items==undefined){
                  Groupsitems=false;
                  this.submitForm_loading=false;
                  return false;
                }else {
                  let couponRule = {couponName: '', baseList: [], quantity: '', packagePrice: ''};
                  e.quantity = e.limitNum;
                  e.packagePrice = this.ruleForm.packagePrice;
                  couponRule.baseList = e.items;
                  //防止添加错误数据
                  if (e.GoodsQuantity==true){
                    //勾选固定数量  一定为0
                    couponRule.quantity = 0;
                  }else {
                    //不勾选一定大于0  如果为0 默认添加为1  必须选择一条商品
                    if (e.limitNum<1){
                      e.limitNum =1;
                    }
                    couponRule.quantity = e.limitNum;
                  }
//               couponRule.quantity = e.limitNum;
                  couponRule.packagePrice = this.ruleForm.packagePrice;
                  couponRule.couponName = e.couponName;
                  couponRuleList.push(couponRule);
                }
              });

              if (this.Activity_time[0] == null && this.Activity_time[0] == undefined && this.Activity_time[1] == null && this.Activity_time[1] == undefined) {
                this.$message({message: '请输入活动有效日期', type: 'warning'});
                this.submitForm_loading=false;
                return false
              } else {
                let format = 'yyyy-MM-dd hh:mm:ss';
                this.startYmdhms = dateFormat(this.Activity_time[0], format);
                this.endYmdhms = dateFormat(this.Activity_time[1], format);
              }
              if(this.ruleForm.packagePrice==''||this.ruleForm.packagePrice==null){
                this.$message({message:'请填写套餐价', type: 'warning'});
                this.submitForm_loading=false;
                return false
              }
              if(Groupsitems==false){
                let product_ind=[];
                let pro=this.productGroups;
                for (var i=0;i<pro.length;i++){
                  if(this.productGroups[i].items==''||this.productGroups[i].items==null){
                    let Groups_len=this.productGroups[i];
                    product_ind.push(Groups_len)
                  }
                }
                this.$message({message:'剩余'+product_ind.length+ '个分组未设置商品选项', type: 'warning'});
                this.submitForm_loading=false;
                return false
              }
              if(this.productGroups==''){
                this.$message({message:'套餐不能为空', type: 'warning'});
                this.submitForm_loading=false;
                return false
              }
              let param = {
                startTime: this.startYmdhms,
                endTime: this.endYmdhms,
                name: this.ruleForm.name,
                rule: 'string',
                status: 0,
                type: 0,
                version: 0,
                typeCode: '6',
                typeName: this.ruleForm.typeName,
                couponRuleList: couponRuleList,
                remark:this.ruleForm.remark
              };

              if (this.ruleForm.id != null && this.ruleForm.id != undefined && this.ruleForm.id != '') {
                param.id = this.ruleForm.id;
              }
            if(this.$route.query.couponId){
            }else {
              this.ruleForm.typeCode = this.$route.query.value;
              this.ruleForm.version = '1';
            }
                let url = bus.host + '/pos/api/promotion/updataandcreate'
                this.$axios.put(url, param).then((response) => {
                  if (response.data.success == false) {
                    this.$message({message: response.data.msg, type: 'error'});
                    this.submitForm_loading=false;
                    return;
                  }
                  if(response.data.success == true){
                    if(this.$route.query.couponId){
                      this.$message({message: '活动修改成功', type: 'success',duration:1000});
                    }else {
                      this.$message({message: '活动添加成功', type: 'success',duration:1000});
                    }
                    setTimeout(() => {this.$router.push('promotion');},1000)
                  }
                }, (response) => {
                  this.$message({message: response.data.msg, type: 'error'});
                  this.submitForm_loading=false;
                });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    mounted()
    {
      this.created();
      this.Primaryone();
    }
  }
</script>
<style scoped lang="scss">
  .Dmck label, .Dmck .formtxt {
    line-height: 35px;
  }
  .DetermineForm {
    width: 840px
  }
  .edtit {
    padding-top: 5px;
    font-size: 14px;
    color: #9e9e9e;
  }
  .Grouptab{
    border:1px solid #ECE5DF;
    padding:10px;
    max-height: 500px;
    overflow: auto;
    overflow-x: hidden;
  }
  .group_len{color: #20A0FF;}
</style>
