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
          <el-form-item label="参与商品:" class="Dmck">
          <el-col :span="24" style="padding: 0 10px 10px 0">
          <el-button type="primary" @click="Add_goods">添加商品</el-button>
          <el-button @click="empty_goods">清空所选商品</el-button>
          </el-col>
          <el-col :span="24" class="padd_L" style="width: 650px">
          <el-table :data="tableData" id="tableData_ov" class="tableData">
          <el-table-column type="index" label="序号" width="70"></el-table-column>
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="barcode" label="商品条码" width="160"></el-table-column>
          <el-table-column prop="spec" label="规格" width="80"></el-table-column>
          <el-table-column label="操作" width="80">
          <template scope="scope">
          <el-button type="danger" @click="showremove(scope.row,scope.$index)" size="small">删除</el-button>
          </template>
          </el-table-column>
          </el-table>
          </el-col>
          </el-form-item>
          <el-form-item label="促销方式:" prop="resource" class="Dmck" style="line-height:0">
            <el-radio-group v-model="resource" @change="resources(resource)">
              <el-row :gutter="20">
                <el-col :span="24" class="mg-bot">
                  <el-col :span="2">
                    <el-radio :label="1" name="Promotionmode">加</el-radio>
                  </el-col>
                  <el-col :span="3" style="padding: 0">
                    <el-input type="number" v-model="single.element" placeholder=""
                             ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span class="formtxt">元多</span>
                  </el-col>
                  <el-col :span="3" style="padding: 0">
                    <el-input type="number" v-model="single.quantity" placeholder=""
                             ></el-input>
                  </el-col>
                  <el-col :span="1">
                    <span class="formtxt">件</span>
                  </el-col>
                </el-col>
                <el-col :span="24" class="mg-bot">
                  <el-col :span="3">
                    <el-radio :label="2" name="Promotionmode">第二件</el-radio>
                  </el-col>
                  <el-col :span="3" style="padding: 0">
                    <el-input v-model="single.discount1" placeholder=""
                              ></el-input>
                  </el-col>
                  <el-col :span="18">
                    <span class="formtxt">（如：8折，即输入数字：0.8）</span>
                  </el-col>
                </el-col>
                <el-col :span="24" class="mg-bot">
                  <el-col :span="2">
                    <el-radio :label="3" name="Promotionmode">买</el-radio>
                  </el-col>
                  <el-col :span="3" style="padding: 0;">
                    <el-input type="number" v-model="single.quantity3" placeholder=""
                              ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span class="formtxt">件送</span>
                  </el-col>
                  <el-col :span="3" style="padding: 0;">
                    <el-input type="number" v-model="single.giveNum1" placeholder=""
                              ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="formtxt">件</span>
                  </el-col>
                </el-col>
                <!--<el-col :span="24" class="mg-bot">-->
                  <!--<el-col :span="4">-->
                    <!--<el-radio :label="4" name="Promotionmode">单品特价</el-radio>-->
                  <!--</el-col>-->
                  <!--<el-col :span="2" style="padding: 0;">-->
                    <!--<span class="formtxt">特惠价：</span>-->
                  <!--</el-col>-->
                  <!--<el-col :span="3" style="padding: 0">-->
                    <!--<el-input type="number" v-model="single.packagePrice" placeholder="￥"-->
                              <!--&gt;</el-input>-->
                  <!--</el-col>-->
                  <!--<el-col :span="2">-->
                    <!--<span class="formtxt">元</span>-->
                  <!--</el-col>-->
                <!--</el-col>-->
                <el-col :span="24" class="mg-bot">
                  <el-col :span="2">
                    <el-radio :label="5" name="Promotionmode">买</el-radio>
                  </el-col>
                  <el-col :span="3" style="padding: 0">
                    <el-input type="number" v-model="single.quantity1"
                              ></el-input>
                  </el-col>
                  <el-col :span="2" style="padding-right: 0">
                    <span class="formtxt">件特惠</span>
                  </el-col>
                  <el-col :span="2" style="padding-right: 0">
                    <span class="formtxt">特惠：</span>
                  </el-col>
                  <el-col :span="3" style="padding: 0">
                    <el-input type="number" v-model="single.packagePrice1" placeholder="￥"
                              ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <span class="formtxt">元</span>
                  </el-col>
                </el-col>
                <el-col :span="24" class="mg-bot">
                  <el-col :span="2">
                    <el-radio :label="6" name="Promotionmode">加</el-radio>
                  </el-col>
                  <el-col :span="3" style="padding: 0px">
                    <el-input type="number" v-model="single.element1" placeholder="￥"
                              ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="formtxt">元换购商品</span>
                  </el-col>
                  <el-col :span="6" style="padding-left: 0px">
                    <el-input v-model="ruleForm.basename" placeholder="输入换购商品条码" disabled="disabled"
                              ></el-input>
                  </el-col>
                  <el-col :span="2" style="padding: 0">
                    <el-button type="primary" @click="Giveaway_search(1)">...</el-button>
                  </el-col>
                  <el-col :span="1" style="padding: 0px">
                    <el-input type="number" v-model="single.quantity2" placeholder=""
                             ></el-input>
                  </el-col>
                  <el-col :span="6">
                    <span class="formtxt">件(赠送品不能参与此活动)</span>
                  </el-col>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col  :sm="24" :md="24" :lg="24">
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea"  v-model="ruleForm.remark" ></el-input>
          </el-form-item>
        </el-col>
        <el-col  :sm="24" :md="24" :lg="24">
          <el-form-item class="txt-cent">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitForm_loading">保存</el-button>
          <el-button @click="$router.push('promotion')">取消</el-button>
          </el-form-item>
        </el-col>
        <el-col  :sm="24" :md="24" :lg="24">
          <el-dialog title="商品添加" :visible.sync="dialogFormVisible" ref='dialog' @close="show()" >
            <el-col :span="5" style="border:1px solid rgb(244, 240, 237);padding:3px;">
              <el-row  class="scrollbar scrollbar_tag">
                <el-row align="center" style="background-color: rgb(106, 92, 72);color:white;"><el-col align="center">已选商品(共{{storage.length}}个)</el-col></el-row>
                <el-table
                  :data="storage"
                  :show-header="false"
                  style="width: 100%">
                  <el-table-column label="" show-overflow-tooltip>
                    <template scope="scope" >
                      <el-tag type="primary" >{{scope.row.name}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label=""  width="23">
                    <template scope="scope" >
                      <el-button :plain="true" type="danger" @click="storage.splice(scope.$index, 1)" size="small" icon="delete"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-col>
            <el-col :span="19">
              <el-row :gutter="2">
                <el-col :span="6">
                  <el-select v-model="selectedDepartment" clearable placeholder="一级分类" id="id_ment">
                    <el-option class="idment" v-for="item in Primarydata" :key="item.name" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="selectedDepart"  placeholder="二级分类" class="selectedDepart">
                    <el-option class="idmento" v-for="item in subCategories" :key="item.name" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="9">
                  <el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model="listQuery.searchWord"/>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" @click="handleFilter" icon="search">搜索</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-table :data="tableData_Load" style="width: 100%" v-loading="listLoading" ref="multipleTable" row-key="id"
                          @selection-change="handleSelectionChange"
                          tooltip-effect="dark" class="tableData_Load">
                  <el-table-column type="selection"  :reserve-selection="true" :selectable="selectable" width="55"></el-table-column>
                  <el-table-column prop="name" label="商品名称"></el-table-column>
                  <el-table-column prop="barcode" label="商品条码"></el-table-column>
                  <el-table-column prop="spec" label="规格"></el-table-column>
                  <el-table-column prop="pkg" label="单位"></el-table-column>
                  <el-table-column prop="secondCategory.name" label="分类"></el-table-column>
                </el-table>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage3"
                  :page-size=listQuery.pageSize
                  layout="total,prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
              </el-row>
            </el-col>
            <div slot="footer" class="dialog-footer">
              <el-button   @click="dialogFormVisible = false" class="fr">取 消</el-button>
              <el-button type="primary" @click="update" class="fr mg_r"  :class="this.Giveaway2==false?'checked_len_true':'checked_len_false'">确 定</el-button>
              <el-button type="primary" @click="upGiveaway" class="fr mg_r"  :class="this.Giveaway1==false?'checked_len_true':'checked_len_false'">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
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
  export default {
    data() {
      return {
        url: bus.host + '/pos/api/product/list',
        ruleForm: {
          name: '',
          typeName: '',
          remark:'',
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
        /*单品促销*/
        resource:'',
        single: {
          element: '',
          quantity: '',
          discount1: '',
          quantity3: '',
          giveNum1: '',
//          packagePrice: '',
          quantity1: '',
          packagePrice1: '',
          element1: '',
          quantity2: '',
        },
        /*分页和表格*/
        total: 1,
        currentPage3: 1,
        Activity_time: '',
        tableData:[],
        storage:[],
        tableData_Load:[],
        Primarydata:[],
        selectedDepart: '',
        selectedDepartment: '',
        multipleSelection:'',
        clicktag:0,
        GiveawayID: '',
        GiveawayNo: '',
        Giveaway:'',
        Giveaway1:false,
        Giveaway2:false,
        submitForm_loading:false,
        listLoading: false,
        dialogFormVisible: false,
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
        },
      }
    },
    computed: {
      /*dialog分类筛选*/
      subCategories() {
        let list = [];
        let selectedDepart = this.$data.selectedDepartment;
        $(".selectedDepart input[ type='text' ]").val('')
        this.$data.Primarydata.forEach(function (d) {
          if (d.id == selectedDepart) {
            list = d.subCategories;
          }
        });
        return list;
      },
    },
    methods: {
      selectable(row, index){
        if (row.id === 'DEFAULTID') {
          return false;
        }
        return true;
      },
      Primaryone() {
        let url = bus.host + '/pos/api/category/list/0'
        this.$http.get(url, {}).then((response) => {
          if (response.data.success == false) {
          } else {
            this.Primarydata = response.data.msg;
          }
        }, (response) => {
          this.$message.error('这是一条错误的提示消息');
        });
      },
      Giveaway_search(){
        this.dialogFormVisible = true;
        this.Giveaway1=true
        this.getTable();
        if(this.multipleSelection.length>=1){
          this.$refs.multipleTable.clearSelection();
        }
      },
      /*表格数据添加*/
      Add_goods(){
        this.dialogFormVisible = true;
        this.Giveaway2=true
        this.getTable();
        if(this.multipleSelection.length==1){
          this.$refs.multipleTable.clearSelection();
        }
      },
      /*清空dialog分类,搜索*/
      show(){
        this.Giveaway1=false;
        this.Giveaway2=false;
        this.$data.selectedDepartment='';
        this.$data.selectedDepart='';
        this.listQuery.searchWord='';
      },
      /*表格数据清空*/
      empty_goods(){
        $('.tableData tbody tr').html("");
        this.tableData = [];
        this.$refs.multipleTable.clearSelection();
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
        this.storage = selection;
        if (this.Giveaway == 1 ) {
          if (selection.length > 1) {
            this.$message({
              message: '赠送商品只能为一',
              type: 'warning'
            });
          }
        }
      },
      upGiveaway(){
        if(this.multipleSelection==undefined){
          this.$message.error('请选择商品');
          return false;
        }else if(this.multipleSelection.length==0){
          this.$message.error('请选择商品');
          return false;
        }else {
          let Giveaway = this.multipleSelection;
          if (this.multipleSelection.length > 1) {
            this.$message({
              message: '赠送商品只能为一',
              type: 'warning'
            });
            return false;
          }
          this.ruleForm.basename = Giveaway[0].name;
          this.GiveawayID = Giveaway[0].id;
          this.GiveawayNo = Giveaway[0].no;
          this.$message({
            message: '商品添加成功！！！',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.Giveaway1= false;
          this.$data.selectedDepartment='';
          this.$data.selectedDepart='';
          this.listQuery.searchWord='';
          this.storage=='';
          this.$refs.multipleTable.clearSelection();
        }
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
          if(id==null){return false}
          this.$http.get(url+id).then((response)=>{
            let res=response.data.msg;
            this.ruleForm.typeCode=res.typeCode
            this.tableData=res.baseList;
            this.ruleForm.name=res.name;
            this.ruleForm.id = res.id;
            this.ruleForm.typeName=res.typeName;
            this.Activity_time=[new Date(res.startTime),new Date(res.endTime)];
            let obj=eval('('+ res.rule+')');
            if (obj.element != null && obj.quantity != null && obj.base == null) {
              this.resource = 1;
              this.single.element=obj.element;
              this.single.quantity=obj.quantity;
            }
            if (obj.discount != null) {
              this.resource = 2;
              this.single.discount1 = obj.discount;
            }
            if(obj.quantity !=null&& obj.giveNum !=null){
              this.resource=3;
              this.single.quantity3=obj.quantity;
              this.single.giveNum1=obj.giveNum;
            }
//            if(obj.packagePrice !=null&&obj.quantity ==null){
//              this.resource=4;
//              this.single.packagePrice=obj.packagePrice;
//            }
            if(obj.quantity !=null&&obj.packagePrice !=null){
              this.resource=5;
              this.single.quantity1=obj.quantity;
              this.single.packagePrice1=obj.packagePrice;
            }
            if(obj.element !=null&&obj.quantity !=null&&obj.base !=null){
              this.resource=6;
              this.single.element1=obj.element;
              this.ruleForm.basename=obj.base.name;
              this.single.quantity2=obj.quantity;
              this.GiveawayID=obj.base.id;
              this.GiveawayNo=obj.base.no;
            }
            this.ruleForm.remark=res.remark;
          }, (response) => {
            this.$message.error('这是一条错误的提示消息');
          })
        }else {
          this.ruleForm.typeName = this.$route.query.label;
          this.ruleForm.value = this.$route.query.value;
        }
      },
      /*dialog数据查询*/
      getTable() {
        this.Giveaway = this.Giveaway1;
        let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        this.listLoading = true;
        this.listQuery.firstCategoryId = this.$data.selectedDepartment;
        this.listQuery.secondCategoryId = this.$data.selectedDepart;
        this.$http.post(this.url + pg, this.listQuery, {}).then((response) => {
          if (response.data.success == false) {
            this.$message.error('您没用权限哦');
          }
          this.total = response.data.msg.totalElements;
          this.tableData_Load = response.data.msg.content;
          this.listLoading = false;
        }, (response) => {
          this.$message.error('错了哦，这是一条错误消息');
        });
      },
      /*dialog选择确定*/
      update(){
          if(this.multipleSelection==undefined){
            this.$message.error('请选择商品');
            return false;
          }else if(this.multipleSelection.length==0){
            this.$message.error('请选择商品');
            return false;
          }else {
            this.storage = this.multipleSelection;
            let tab = [];
            tab = this.tableData;
            this.storage.forEach(function (i) {
              let tablist = {
                id: i.id,
                name: i.name,
                barcode: i.barcode,
                spec: i.spec,
              };
              tab.push(i)
            })
            this.tableData = tab;
            let idValueMap = [];
            this.tableData.forEach(function (e) {
              idValueMap[e.id] = e;
            });
            let valArr = new Array();
            for (let k in idValueMap) {
              valArr.push(idValueMap[k]);
            }
            this.tableData = valArr;
            this.$message({
              message: '商品添加成功！！！',
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.Giveaway2= false;
            this.$data.selectedDepartment='';
            this.$data.selectedDepart='';
            this.listQuery.searchWord='';
            this.storage=='';
            this.$refs.multipleTable.clearSelection();
          }
      },
      resources(val){
        if (val != 1) {
          this.single.element = null;
          this.single.quantity = null;
        }
        if (val != 2) {
          this.single.discount1 = null;
        }
        if (val != 3) {
          this.single.quantity3 = null;
          this.single.giveNum1 = null;
        }
//        if (val != 4) {
//          this.single.packagePrice = null;
//        }
        if (val != 5) {
          this.single.quantity1 = null;
          this.single.packagePrice1 = null;
        }
        if (val != 6) {
          this.single.element1 = null;
          this.single.quantity2 = null;
          this.GiveawayID = null;
          this.GiveawayNo = null;
        }
      },
      /*--促销方式校验--*/

      submitForm(formName){
        if(this.tableData==''||this.tableData==null){
          this.$message({message: '参与商品不能为空！', type: 'warning'});
          this.submitForm_loading=false;
          return false;
        }
        if(this.resource==''){
          this.$message({message: '请选择促销方式', type: 'warning'});
          return false;
        }
        if(this.resource == 1){
          if(this.single.element==null&&this.single.element==''&&this.single.quantity==null&&this.single.quantity==''){
            this.$message({message: '条件不能为空', type: 'warning'});
            return false;
          }
          if(this.single.element==''||this.single.element==null){
            this.$message({message: '加多少元不能为空', type: 'warning'});
            return false;
          }
          if(this.single.quantity==''||this.single.quantity==null){
            this.$message({message: '赠送商品数量不能为空', type: 'warning'});
            return false;
          }
          this.ruleForm.rule = "{\"element\":" + this.single.element + ",\"quantity\":" + this.single.quantity + "}";
        }
        if(this.resource==2){
          if(this.single.discount1==''||this.single.discount1==null){
            this.$message({message:'折扣不能为空',type:'warning'});
            return false;
          }
          this.ruleForm.rule = "{\"discount\":" + this.single.discount1 + "}";
        }
        if (this.resource == 3) {
            if (this.single.quantity3 == null || this.single.quantity3 == '') {
              this.$message({message:'条件买多少不能为空',type:'warning'});
              return false;
            }
            if (this.single.giveNum1 == null || this.single.giveNum1 == '') {
              this.$message({message:'条件送多少不能为空',type:'warning'});
              return false;
            }
          this.ruleForm.rule = "{\"quantity\":" + this.single.quantity3 + ",\"giveNum\":" + this.single.giveNum1 + "}";
        }
//        if (this.resource == 4) {
//          if (this.single.packagePrice == null || this.single.packagePrice == '') {
//            this.$message({message:'特惠价不能为空',type:'warning'});
//            return false;
//          }
//          this.ruleForm.rule = "{\"packagePrice\":" + this.single.packagePrice + "}";
//        }
        if (this.resource == 5) {
            if (this.single.quantity1 == null || this.single.quantity1 == '') {
              this.$message({message:'条件买多少不能为空',type:'warning'});
              return false;
            }
            if(this.single.packagePrice1==null||this.single.packagePrice1==''){
              this.$message({message:'特惠价不能为空',type:'warning'});
              return false;
            }
          this.ruleForm.rule = "{\"quantity\":" + this.single.quantity1 + ",\"packagePrice\":" + this.single.packagePrice1+ "}";
        }
        if (this.resource == 6) {
            if (this.single.element1 == null || this.single.element1 == '') {
              this.$message({message:'条件加多少钱不能为空',type:'warning'});
              return false;
            } else if (this.single.quantity2 == null || this.single.quantity2 == '') {
              this.$message({message:'条件送多少件不能为空',type:'warning'});
              return false;
            }
          if (this.GiveawayID == null || this.GiveawayID == '') {
            this.$message({message:'条件赠品不能为空',type:'warning'});
            return false;
          }
          this.ruleForm.rule = "{\"element\":\"" + this.single.element1 + "\",\"quantity\":" + this.single.quantity2 + ",\"base\":{\"id\":\"" + this.GiveawayID + "\",\"name\":\"" + this.ruleForm.basename + "\",\"no\":\"" + this.GiveawayNo + "\"}}";
        }

        if(this.single.element !=null){
          if(!/^\d+(\.\d+)?$/.test(this.single.element)){
            this.$message({message: '金额输入不合法！', type: 'error'});
            return false;
          }
        }
//        if(this.single.packagePrice !=null){
//          if(!/^\d+(\.\d+)?$/.test(this.single.packagePrice)){
//            this.$message({message: '金额输入不合法！', type: 'error'});
//            return false;
//          }
//        }
        if(this.single.discount1 !=null){
          if (!/^\d+(\.\d+)?$/.test(this.single.discount1)) {
            this.$message({message: '折扣输入不合法！', type: 'error'})
            return false;
          }
          if (this.single.discount1 > 1) {
          this.$message({message: '折扣不能大于1', type: 'error'});
          this.single.discount1 = null;
          return false;
        }
        }
        if(this.single.packagePrice1 !=null){
          if(!/^\d+(\.\d+)?$/.test(this.single.packagePrice1)){
            this.$message({message: '特惠金额输入不合法！', type: 'error'});
            return false;
          }
        }
        if(this.single.element1 !=null){
          if(!/^\d+(\.\d+)?$/.test(this.single.element1)){
            this.$message({message: '金额输入不合法！', type: 'error'});
            return false;
          }
        }
        if(this.single.quantity !=null){
          if(!/^\d+$/.test(this.single.quantity)){
            this.$message({message: '商品件数不合法！', type: 'error'});
            return false;
          }
        }
        if(this.single.quantity3 !=null){
          if(!/^\d+$/.test(this.single.quantity3)){
            this.$message({message: '商品件数不合法！', type: 'error'});
            return false;
          }
        }
        if(this.single.giveNum1 !=null){
          if(!/^\d+$/.test(this.single.giveNum1)){
            this.$message({message: '商品件数不合法！', type: 'error'});
            return false;
          }
        }
        if(this.single.quantity1 !=null){
          if(!/^\d+$/.test(this.single.quantity1)){
            this.$message({message: '商品件数不合法！', type: 'error'});
            return false;
          }
        }
        if(this.single.quantity2 !=null){
          if(!/^\d+$/.test(this.single.quantity2)){
            this.$message({message: '商品件数不合法！', type: 'error'});
            return false;
          }
        }
        this.Singule_product(formName);
      },
      /*数据提交*/
      Singule_product(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitForm_loading=true;
           this.ruleForm.baseList=this.tableData;
            if (this.Activity_time[0] == null && this.Activity_time[0] == undefined && this.Activity_time[1] == null && this.Activity_time[1] == undefined) {
              this.$message({message: '请输入活动有效日期', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            } else {
              let startTime = dateFormat(this.Activity_time[0], 'yyyy-MM-dd hh:mm:ss');
              let endTime = dateFormat(this.Activity_time[1], 'yyyy-MM-dd hh:mm:ss');
              this.ruleForm.startTime = startTime;
              this.ruleForm.endTime = endTime;
            }
            if(this.$route.query.couponId){
              this.ruleForm.typeCode;
            }else {
              this.ruleForm.typeCode = this.$route.query.value;
            }
            this.ruleForm.version = '1';
            let url = bus.host + '/pos/api/promotion/updataandcreate';
            this.$axios.put(url ,this.ruleForm).then((res) => {
              if(res.data.success == true){
                if(this.$route.query.couponId){
                  this.$message({message: '活动修改成功', type: 'success',duration:1000});
                }else {
                  this.$message({message: '活动添加成功', type: 'success',duration:1000});
                }
                setTimeout(() => {this.$router.push('promotion');},1000)
              }
            },(res)=>{
              this.$message.error('错了哦，这是一条错误消息');
              this.submitForm_loading=false;
              })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.push('promotion');
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
</style>
