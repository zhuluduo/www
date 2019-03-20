<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>服务</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/main/service-manage'}">服务管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加服务</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="step-page" v-show="pageOne.visible">
      <div class="step-box-1">
        <div class="step-title">第一步、填写服务基本信息</div>
        <el-form ref="baseInfoForm" :model="pageOne.baseInfoForm" :rules="pageOne.rules" label-width="80px">
          <el-form-item label="服务名称" prop="name">
            <el-input v-model="pageOne.baseInfoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="服务类别" prop="type">
            <el-select v-model="pageOne.baseInfoForm.type" placeholder="请选择">
              <el-option
                v-for="item in pageOne.serviceTypes"
                :key="item.id"
                :label="item.serviceCatalogName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票模板" prop="invoiceTemplateId">
            <el-select v-model="pageOne.baseInfoForm.invoiceTemplateId" placeholder="请选择">
              <el-option
                v-for="item in pageOne.invoiceTemplates"
                :key="item.id"
                :label="item.invoiceTitleTypeText+item.invoiceTypeText+(item.taxRate*100)+'%'"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交货周期" required>
            <el-col :span="8">
              <el-form-item prop="minTime">
                <el-input v-model="pageOne.baseInfoForm.minTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2" :style="{'text-align':'center'}">-</el-col>
            <el-col :span="8">
              <el-form-item prop="maxTime">
                <el-input v-model="pageOne.baseInfoForm.maxTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2" :style="{'text-align':'center'}">-</el-col>
            <el-col :span="4">
              <el-form-item prop="periodUnit">
                <el-select v-model="pageOne.baseInfoForm.periodUnit" placeholder="请选择">
                  <el-option
                    v-for="item in pageOne.periodUnitList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="step-btn">
         <!-- <el-button type="primary">完成</el-button>-->
          <el-button type="primary" @click="pageOneNextHandler">下一步</el-button>
        </div>
      </div>
    </div>

    <div class="step-page" v-show="pageTwo.visible">
      <div class="step-box-3">
        <div class="step-title">第二步、配置服务步骤</div>
        <el-table
          :data="pageTwo.tableData"
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="步骤名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="步骤名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="参数值">
            <template slot-scope="scope">
              <span>{{scope.row.crafts}}</span>
              <span v-if="!scope.row.configured" class="tb-operation-link" @click="openCraftsDlg(scope)">设置</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope">
              <span class="icon-box"><i class="el-icon-sort-up operation-icon" v-show="scope.$index!=0" @click="moveUpRow(scope.$index)"></i></span>
              <span class="icon-box"><i class="el-icon-sort-down operation-icon" v-show="scope.$index!=pageTwo.tableData.length-1" @click="moveDownRow(scope.$index)"></i></span>
              <span class="icon-box"><i class="el-icon-plus operation-icon" @click="addRow(scope.$index)"></i></span>
              <span class="icon-box"><i class="el-icon-close operation-icon" @click="deleteRow(scope.$index)"></i></span>
            </template>
          </el-table-column>
        </el-table>
        <div class="step-btn">
          <el-button type="primary" @click="pageOne.visible=true;pageTwo.visible=false">上一步</el-button>
          <el-button type="primary" @click="addService">完成</el-button>
        </div>
      </div>

      <el-dialog title="工艺"  :before-close="handleClose" :visible.sync="pageTwo.dlgVisible" width="700px">
        <div>
          <el-tabs type="card" v-model="pageTwo.dlgTab">
            <el-tab-pane :label="crafts.techniqueCatalogName" :name="String(index)" v-for="(crafts,index) in pageTwo.craftsList">
              <div class="materials-wrapper">
                <div class="materials">
                  <div class="material" :class="{'material-active':item.isCheck}" v-for="item in crafts.techniqueList" @click="clickCrafts(item)">
                    <img :src="item.techniquePicture" alt="">
                    <p>{{item.techniqueName}}</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeCraftsDlg">取 消</el-button>
          <el-button type="primary" @click="selectCrafts">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    components: {
    },
    data() {
      return {
        pageOne:{
          visible:true,
          serviceTypes:[],
          invoiceTemplates: [],
          periodUnitList:[
            {code:105070,name:'年'},
            {code:105060,name:'月'},
            {code:105050,name:'周'},
            {code:105040,name:'天'},
            {code:105030,name:'时'},
            {code:105020,name:'分'},
            {code:105010,name:'秒'},
          ],
          baseInfoForm:{
            name:'',
            type:'',
            maxTime:'',
            minTime:'',
            periodUnit:'',
            invoiceTemplateId:''
          },
          rules:{
            name:[
              {required: true, message:'请输入服务名称',trigger: 'blur'},
            ],
            invoiceTemplateId:[
              {required: true, message:'请选择发票模板',trigger: 'change'},
            ],
            type:[
              {required: true, message:'请选择工艺类型',trigger: 'change'},
            ],
            minTime:[
              {required: true, message:'请输入交货周期',trigger: 'blur'},
            ],
            maxTime:[
              {required: true, message:'请输入交货周期',trigger: 'blur'},
            ],
            periodUnit:[
              {required: true, message:'请选择单位',trigger: 'change'},
            ]
          }
        },
        pageTwo:{
          visible: false,
          dlgVisible: false,
          dlgTab:'0',
          craftsCheckList:[],
          craftsList:[],
          currRow:0,
          tableData:[
            {name:'',crafts:'',craftsIds:[],configured:false},
          ]
        },
      }
    },
    watch: {},
    created() {
      this.getServiceTypeList();
      this.getCraftsList();
      this.getInvoiceTemplates();
    },
    mounted() {},
    methods: {
      getInvoiceTemplates() {
        this.$http.post('/operation/invoiceTemplate/getAll').then(( res ) =>{
          if ( res.data.code == 200 ) {
            this.pageOne.invoiceTemplates = res.data.data;
          }
        })
      },
      getServiceTypeList(){
        this.$http.post('/operation/serviceCatalog/all').then((res) => {
          if ( res.data.code == 200 ) {
            this.pageOne.serviceTypes = res.data.data;
          } else{
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      },
      pageOneNextHandler() {
         this.$refs['baseInfoForm'].validate((valid) => {
         if (valid) {
           this.pageTwo.visible = true;
           this.pageOne.visible = false;
         } else {
         return false;
         }
         })
      },

      /*------------------------page Two-----------------------------------*/

      getCraftsList() {
        let paraMeter ={techniquePurpose:460010}
        this.$http.post('/operation/techniqueCatalog/getTechniques',paraMeter).then((res) => {
          if (res.data.code == 200) {
            if('data' in res.data) {
              this.pageTwo.craftsList = res.data.data;
              this.pageTwo.craftsList.map((crafts) => {
                if('techniqueList' in crafts) {
                  crafts.techniqueList.map((item) => {
                    this.$set(item,'isCheck', false);
                    this.$set(item,'refCheck', false);
                  })
                }
              })
            } else {
              this.pageTwo.craftsList = [];
            }
          }
        })
      },
      clickCrafts( crafts) {
        crafts.isCheck = !crafts.isCheck;
      },
      selectCrafts() {
        var craftsCheckNameArr = [];
        var craftsCheckIdArr = [];
        this.pageTwo.craftsList.map((item) =>{
          if('techniqueList' in item) {
            item.techniqueList.map((el) => {
              el.refCheck = el.isCheck;
              if(el.isCheck) {
                craftsCheckNameArr.push(el.techniqueName);
                craftsCheckIdArr.push(Number(el.id));
              }
            })
          }
        })
        this.pageTwo.dlgVisible = false;

        this.pageTwo.tableData[this.pageTwo.currRow].crafts = craftsCheckNameArr.toString();
        this.pageTwo.tableData[this.pageTwo.currRow].craftsIds = craftsCheckIdArr;

      },
      openCraftsDlg(scope) {
        this.pageTwo.currRow = scope.$index;
    //    this.getCraftsList();
        this.pageTwo.craftsList.map((crafts) => {
          if ('techniqueList' in crafts) {
            crafts.techniqueList.map((item) => {
              if(this.pageTwo.tableData[scope.$index].craftsIds.indexOf(Number(item.id))>=0) {
                item.isCheck = true;
              } else {
                item.isCheck = false;
              }
            })
          }
        })
        this.pageTwo.dlgVisible = true;
      },
      handleClose(done) {
        this.pageTwo.craftsList.map((item) =>{
          if('techniqueList' in item) {
            item.techniqueList.map((el) => {
              el.isCheck = el.refCheck;
            })
          }
        })
        done();
      },
      closeCraftsDlg(){
        this.pageTwo.dlgVisible = false;
      },
      addRow(index){
        this.pageTwo.tableData.splice(index+1,0,{name:'',crafts:'',craftsIds:[],configured:false});
      },
      moveUpRow(index){
        if(index != 0){
          var tmp = this.pageTwo.tableData[index-1];
          this.$set(this.pageTwo.tableData,index-1,this.pageTwo.tableData[index]);
          this.$set(this.pageTwo.tableData,index,tmp);
        }
      },
      moveDownRow(index) {
        if(index < this.pageTwo.tableData.length-1) {
          var tmp = this.pageTwo.tableData[index];
          this.$set(this.pageTwo.tableData,index,this.pageTwo.tableData[index+1]);
          this.$set(this.pageTwo.tableData,index+1,tmp);
        }
      },
      deleteRow(index) {
        if(this.pageTwo.tableData.length > 1) {
          this.pageTwo.tableData.splice(index,1);
        }
      },
      addService(){
        var service = {
          serviceInfo:{
            serviceCatalogId:this.pageOne.baseInfoForm.type,
            serviceName:this.pageOne.baseInfoForm.name,
            servicePicture:'',
            periodMin:Number(this.pageOne.baseInfoForm.minTime) || 3,
            periodMax:Number(this.pageOne.baseInfoForm.maxTime) || 10,
            periodUnit: this.pageOne.baseInfoForm.periodUnit || 105040,
            invoiceTemplateId: this.pageOne.baseInfoForm.invoiceTemplateId
          },
          serviceProceduresInfo:[]
        };
        this.pageTwo.tableData.map((item,index) => {
          var serviceStep = {
            techniqueList:item.craftsIds,
            step:index + 1,
            stepName:item.name
          }
          service.serviceProceduresInfo.push(serviceStep);
        })

        this.$http.post('/operation/service/addServiceAndProcedures', service).then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: 'success',
              message: res.data.message
            });
            this.$router.push({path:'/main/service-manage'});
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      }
    }
  };
</script>
<style lang="less" scoped>
  .cursor{
    cursor: pointer !important;
  }
  .step-title{
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    padding: 40px 0 60px 0;
  }
  .step-box-1{
    width: 600px;
    margin: 0 auto;
  }
  .el-select{
    width: 100%;
  }
  .el-radio{
    line-height: 40px !important;
  }
  .step-btn{
    display: flex;
    justify-content: center;
    padding: 20px 50px;
  }
  .step-btn button{
    margin: 0 100px !important;
  }
  .step-box-2{
    margin: 0 auto;
  .select{
    display: flex;
    justify-content: space-around;
  .select-item{
    flex: 1;
    text-align: center;
    padding: 20px 70px;
  .material-item{
    border: none;
    padding: 10px 0;
    text-align: left;
  }
  .material-type{
    font-size: 14px;
    font-weight: 700;
    text-align: left;
    margin-top: 30px;
  }
  }
  p{
    position: relative;
    line-height: 24px;
    font-size: 16px;
    font-weight: 600;
  }
  .star{
    position: relative;
  }
  .star::before{
    content: '*';
    position: absolute;
    left: -8px;
    color: red;
  }
  label{
    text-decoration: underline;
    color: #409eff;
    font-weight: normal;
    margin-left: 15px;
  }
  }
  }
  .materials-wrapper{
    width:650px;
  .materials{
    width: 670px;
    height: 400px;
    overflow-y: auto;
    background: #fff;
  .material{
    display: inline-block;
    width: 112px;
    height: 140px;
    padding: 5px;
    border:1px solid #eee;
    background-color: #eee;
    box-sizing: border-box;
    margin-right: 15px;
    margin-bottom: 20px;
    cursor: pointer;
  &:hover{
     border: 1px solid #409eff;
   }
  img{
    display: block;
    width: 100px;
    height: 100px;
    background-color: #fff;
  }
  p{
    line-height: 20px;
    text-align: center;
    margin-top: 7px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  }
  .material-active{
    background-color: #409eff;
    color: #fff;
  }
  .material:nth-child(5n){
    margin-right: 0px !important;
  }
  }
  }
  .el-tag{
    margin-right: 20px !important;
    margin-bottom: 15px !important;
  }
  .icon-box{
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 10px;
  }
  .operation-icon{
    cursor: pointer;
    color: #000 !important;
    font-weight: 700;
    font-size: 16px !important;
  }
  .tb-operation-link{
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
    margin: 0 10px;
  }
  .def-form-item-input{
    display: flex;
    .el-input:first-child {
      margin-right: 10px !important; ;
    }
  }
</style>

