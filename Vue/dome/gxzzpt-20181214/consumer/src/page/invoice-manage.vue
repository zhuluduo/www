<template>
<div id="invoice-manage">
  <div class="box">
    <v-operation>
      <v-tabs :tabs="types" @click="changeTab"></v-tabs>
    </v-operation>
    <div class="table table-header-bg-gray">
      <el-table :data="tableData">
        <el-table-column label="报价类型" prop="orderTypeText" align="center" width="100"></el-table-column>
        <el-table-column label="订单编号" prop="orderNumber" align="center"></el-table-column>
        <el-table-column label="商品" prop="orderTypeText" align="center" width="120">
          <template slot-scope="scope">
            <div v-for="(ele ,index) in scope.row.orderItemList" :key="index">{{ele.itemName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" prop="totalPrice" align="center" width="120"></el-table-column>
        <el-table-column label="开票信息" prop="orderTypeText" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.invoiceManagementInfo" class="invoiceInfo">
              <div>{{scope.row.invoiceManagementInfo?scope.row.invoiceManagementInfo.invoiceTitle:""}}</div>
              <div>{{scope.row.invoiceManagementInfo?scope.row.invoiceManagementInfo.invoiceModeText:""}}</div>
              <div>{{scope.row.invoiceManagementInfo.invoiceTypeText}}</div>
              <div v-if="scope.row.invoiceManagementInfo.taxNo">纳税人识别号：{{scope.row.invoiceManagementInfo.taxNo}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="orderTypeText" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceManagementInfo">{{scope.row.invoiceManagementInfo?scope.row.invoiceManagementInfo.invoiceStatusText:""}}</span>
            <span v-else>未申请</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  width="100">
          <template slot-scope="scope">
                <span class="table-btn" @click="$router.push({path:'/usercenter/invoice-detail',query:{id:scope.row.invoiceManagementInfo.id}})" v-if="scope.row.invoiceManagementInfo&&scope.row.invoiceManagementInfo.invoiceStatus==120030">查看发票</span>
                <span class="table-btn" @click="showForm(scope.row)" v-if="scope.row.invoiceManagementInfo&&scope.row.invoiceManagementInfo.invoiceStatus==120010">开票</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
      </div>
    </div>
  </div>

  <el-dialog title="开票" width="600px" class="invoice-dlg" :visible.sync="form1.visiable" @close="closeModal('form1')">
    <div>
      <el-collapse-transition>
        <div class="form-msg" v-show="form1.errRes">{{form1.errRes}}</div>
      </el-collapse-transition>
      <div class="form-detail">
        <div>订单类型：{{form1.row.orderTypeText}}</div>
        <div>商品：{{form1.row.goods}}</div>
        <div>开票方式：{{form1.row.invoiceManagementInfo?form1.row.invoiceManagementInfo.invoiceModeText:""}}</div>
        <div>抬头：{{form1.row.invoiceManagementInfo?form1.row.invoiceManagementInfo.invoiceTitle:""}}</div>
        <div v-if="form1.row.invoiceManagementInfo&&form1.row.invoiceManagementInfo.taxNo">纳税人识别号：{{form1.row.invoiceManagementInfo.taxNo}}</div>
        <div v-if="form1.row.invoiceManagementInfo&&form1.row.invoiceManagementInfo.contentCategory">发票类型：{{form1.row.invoiceManagementInfo.contentCategory}}</div>
      </div>
      <el-form label-position="left" ref="form1" :rules="rules" :model="form1.data" label-width="86px">
        <el-form-item label="发票代码：" class="required" prop="invoiceCode">
              <el-input v-model="form1.data.invoiceCode"></el-input>
        </el-form-item>
        <el-form-item label="发票号码：" class="required" prop="invoiceNo">
            <el-input v-model="form1.data.invoiceNo" ></el-input>
        </el-form-item>
        <el-form-item label="开票金额：" class="required" prop="invoiceAmount">
            <el-input v-model="form1.data.invoiceAmount" ></el-input>
        </el-form-item>
        <el-form-item label="邮寄：" class="required" prop="expressMode">
            <template slot-scope="scope">
              <el-radio-group v-model="expressMode">
                <el-radio :label="3">顺丰到付</el-radio>
              </el-radio-group>
            </template>
        </el-form-item>
        <el-form-item label="快递单号：" class="required" prop="expressNo">
            <el-input v-model="form1.data.expressNo" ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal('form1')">取消</el-button>
      <el-button type="primary" @click="submit('form1')">确定</el-button>
    </span>
  </el-dialog>

  <el-dialog title="开票" width="600px" :visible.sync="form2.visiable" @close="closeModal('form2')">
    <div>
      <el-collapse-transition>
        <div class="form-msg" v-show="form2.errRes">{{form2.errRes}}</div>
      </el-collapse-transition>
      <div class="form-detail">
        <div>订单类型：{{form2.row.orderTypeText}}</div>
        <div>商品：{{form2.row.goods}}</div>
        <div>开票方式：{{form2.row.invoiceManagementInfo?form2.row.invoiceManagementInfo.invoiceModeText:""}}</div>
        <div>抬头：{{form2.row.invoiceManagementInfo?form2.row.invoiceManagementInfo.invoiceTitle:""}}</div>
        <div v-if="form2.row.invoiceManagementInfo&&form2.row.invoiceManagementInfo.taxNo">纳税人识别号：{{form2.row.invoiceManagementInfo.taxNo}}</div>
        <div v-if="form2.row.invoiceManagementInfo&&form2.row.invoiceManagementInfo.contentCategory">发票类型：{{form2.row.invoiceManagementInfo.contentCategory}}</div>
      </div>
      <el-form label-position="left" ref="form2" :rules="rules" :model="form2.data" label-width="86px">
        <el-form-item label="发票代码：" class="required" prop="invoiceCode">
              <el-input v-model="form2.data.invoiceCode"></el-input>
        </el-form-item>
        <el-form-item label="发票号码：" class="required" prop="invoiceNo">
            <el-input v-model="form2.data.invoiceNo" ></el-input>
        </el-form-item>
        <el-form-item label="开票金额：" class="required" prop="invoiceAmount">
            <el-input v-model="form2.data.invoiceAmount" ></el-input>
        </el-form-item>
        <el-form-item label="上传发票：" class="" prop="invoiceImg">
            <el-upload
              class="upload-demo"
              action="http://dw.tatfookcloud.com/upload"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :limit="1"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal('form2')">取消</el-button>
      <el-button type="primary" @click="submit('form2')">确定</el-button>
    </span>
  </el-dialog>

</div>
</template>
<script>
import tabs from '../components/tabs.vue';
import operationBar from '../components/operationBar.vue';
export default {
  components: {
    'v-tabs':tabs,
    'v-operation': operationBar,
  },
  data() {
    const checkAmount = (rule,value,callback)=>{
      if(value){
        callback();
      }else{
        callback(new Error('请输入正确的值'))
      }
    }
    return {
      fileList:[],
      expressMode:3,
      pagination: {
        currentPageIndex: 1,
        pageSize: 5,
        pageCount: 0
      },
      types: [
        { name: "全部", id: [120010, 120020, 120030], isCheck: true },
        { name: "待开票", id: [120010], isCheck: false },
        { name: "已开票", id: [120020, 120030], isCheck: false }
      ],
      tableData: [],
      ajaxData: {
        pageIndex: 1,
        pageSize: 5,
        invoiceStatus: [ 120010, 120020, 120030],
        all: true
      },
      form1:{
        visiable:false,
        errRes:"",
        row:{},
        data:{
          id:"",
          invoiceAmount:"",
          invoiceCode:"",
          invoiceNo:"",
          expressNo:"",
        }
      },
      form2:{
        visiable:false,
        errRes:"",
        row:{},
        data:{
          id:"",
          invoiceAmount:"",
          invoiceCode:"",
          invoiceNo:"",
          invoiceImg:null,
        }
      },
      rules:{
        invoiceAmount:[{validator:checkAmount,trigger:'blur'}],
        invoiceCode:[{validator:checkAmount,trigger:'blur'}],
        invoiceNo:[{validator:checkAmount,trigger:'blur'}],
        expressNo:[{validator:checkAmount,trigger:'blur'}],
      }
    };
  },
  created() {
    this.getList();
  },
  filters:{
    goodsFilter(row){
      return 1;
    }
  },
  methods: {
    handleRemove(file,fileList){
      this.form2.data.invoiceImg = null;
    },
    handleSuccess(file,fileList){
      console.log(file);

      if(file.code == 200){
        this.form2.data.invoiceImg = file.data.img_url;
      }
    },
    handleChange(file, fileList){

    },
    submit(formName){
      this.$refs[formName].validate(valid=>{
        if(valid){
          this.invoice(formName);
        }else{
          return false;
        }
      })
    },
    invoice(formName){
      if(formName=="form1"){
        var data = {
          id:Number(this[formName].data.id),
          invoiceAmount:Number(this[formName].data.invoiceAmount),
          invoiceCode:this[formName].data.invoiceCode,
          invoiceNo:this[formName].data.invoiceNo,
          expressNo:this[formName].data.expressNo,
        }
      }else if(formName=="form2"){
        var data = {
          id:Number(this[formName].data.id),
          invoiceAmount:Number(this[formName].data.invoiceAmount),
          invoiceCode:this[formName].data.invoiceCode,
          invoiceNo:this[formName].data.invoiceNo,
          invoiceImg:this[formName].data.invoiceImg || null,
        }
      }
      console.log(this[formName].data);
      this.$http.post('/custom/manufacturer/invoiceManagement/update',data).then(res=>{
        if(res.data.code == 200){
          this.closeModal(formName);
          this.getList();
        }else{
          this[formName].errRes = res.data.message;
        }
      }).catch(res=>{})
    },
    closeModal(formName){
      this[formName].visiable = false;
      this.$refs[formName].resetFields();
      this[formName].errRes = "";
    },
    showForm(row){
      var formName = "form1";
      if(row.invoiceManagementInfo.invoiceMode==150010){
        formName = 'form1';
      }else if(row.invoiceManagementInfo.invoiceMode==150020){
        formName = 'form2';
      }
      this[formName].visiable = true;
      this[formName].row = row;
      var arr = [];
      this[formName].row.orderItemList.map(ele=>{
        arr.push(ele.itemName);
      })
      this.$set(this[formName].row,'goods',arr.join('，'))
      this[formName].data.id = row.invoiceManagementInfo.id;
    },
    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    getList() {
      this.$http
        .post("/custom/manufacturer/InvoiceManagement/list", this.ajaxData)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.pagination = res.data.pagination;
          } else {
          }
        });
    },
    search() {
      this.getList();
    },
    changeTab(item) {
      if (item.isCheck) return;
      this.types.map(ele => {
        if (ele.id == item.id) {
          ele.isCheck = true;
        } else {
          ele.isCheck = false;
        }
      });
      this.ajaxData.invoiceStatus = item.id;
      if (this.ajaxData.invoiceStatus.length != 3) {
        this.ajaxData.all = false;
      } else {
        this.ajaxData.all = true;
      }
      this.getList();
    }
  }
};
</script>
<style lang="less">
#invoice-manage{
  .invoiceInfo{
    text-align: left;
  }
  .invoice-dlg{
    .el_dialog_body{
      padding: 30px 28px;
    }
    .form-detail{
      div{
        margin-bottom: 5px;
      }
    }
  }
}
</style>
