<template>
  <div class="my-invoice">
    <div class="box">
      <div class="box-header">
        <ul class="tabs">
          <li v-for="(item,index) in types" :key="index" :class="item.isCheck?'checked':''" @click="changeTab(item)">{{item.name}}</li>
        </ul>
      </div>
      <div class="table table-header-bg-gray">
        <el-table :data="tableData">
          <el-table-column label="报价类型" prop="orderTypeText" align="center" width='100'></el-table-column>
          <el-table-column label="订单编号" prop="orderNumber" align="center"></el-table-column>
          <el-table-column label="商品" prop="orderTypeText" align="center"  width='120'>
            <template slot-scope="scope">
              <div v-for="(ele,index) in scope.row.orderItemList" :key="index">{{ele.itemName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单金额" prop="totalPrice" align="center" width='120'></el-table-column>
          <el-table-column label="开票信息" prop="orderTypeText" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invoiceManagementInfo" class="invoiceInfo">
                <div>{{scope.row.invoiceManagementInfo.invoiceTitle}}</div>
                <div>{{scope.row.invoiceManagementInfo.invoiceModeText}}</div>
                <div>{{scope.row.invoiceManagementInfo.invoiceTypeText}}</div>
                <div v-if="scope.row.invoiceManagementInfo.taxNo">纳税人识别号：{{scope.row.invoiceManagementInfo.taxNo}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="orderTypeText" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceManagementInfo">{{scope.row.invoiceManagementInfo?scope.row.invoiceManagementInfo.invoiceStatusText:""}}</span>
              <span v-else="scope.row.invoiceManagementInfo">未申请</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog  center title="申请发票" width="640px" :visible.sync="showModal">
      <div>
        <el-collapse-transition>
          <!-- <div class="form-msg" v-show="errRes">{{errRes}}</div> -->
        </el-collapse-transition>
        <el-form label-position="left" ref="applyForm" :rules="rules" :model="applyForm" label-width="100px">
          <el-form-item label="发票抬头" class="" prop="invoiceTitle">
            <v-check :active="item.checked" v-for="item in titleList" @click="changeSelect(item,titleList,'invoiceTitle')">{{item.name}}</v-check>
          </el-form-item>
          <el-form-item label="开票方式" class="" prop="invoiceMode">
            <v-check :active="item.checked" v-for="item in typeList" @click="changeSelect(item,typeList,'invoiceMode')">{{item.name}}</v-check>
          </el-form-item>
          <el-form-item label="发票类型" class="" prop="invoiceType">
            <v-check :active="item.checked" v-for="item in catalogList" @click="changeSelect(item,catalogList,'invoiceType')">{{item.name}}</v-check>
          </el-form-item>
          <el-form-item label="企业名称：" class="required" prop="companyName" v-if="applyForm.invoiceTitle==119020">
                <el-input v-model="applyForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号" class="required" prop="taxNo"  v-if="applyForm.invoiceTitle==119020">
              <el-input v-model="applyForm.taxNo" ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="submit">申请</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import checkButton from "../components/checkButton.vue";
export default {
  components: {
    "v-check": checkButton,
  },
  data() {
    return {
      titleList: [],
      catalogList: [],
      typeList: [],
      applyForm: {
        companyName:"",
        invoiceMode: "",
        invoiceType: "",
        invoiceTitle: "",
        orderId: "",
        taxNo: ""
      },
      showModal: false,
      tableData: [],
      ajaxData: {
        pageIndex: 1,
        pageSize: 5,
        invoiceStatus: [120010, 120020, 120030],
        all: true
      },
      types: [
        { name: "全部", id: [120010, 120020, 120030], isCheck: true },
        { name: "待开票", id: [120010], isCheck: false },
        { name: "已开票", id: [120020, 120030], isCheck: false }
      ],
      pagination: {
        currentPageIndex: 1,
        pageSize: 5,
        pageCount: 0
      },
      rules: {
        companyName:[{required: true, message: "请输入企业名称",trigger:"blur"}],
        taxNo:[{required: true, message: "请输入纳税号",trigger:"blur"}],
      }
    };
  },
  created() {
    this.getList();
    this.getWords();
  },
  methods: {
    closeModal(){
      this.$refs['applyForm'].resetFields();
      this.showModal = false;
    },
    submit() {
      var ajaxData = {
        orderId: this.applyForm.orderId,
        invoiceMode: this.applyForm.invoiceMode,
        invoiceType: this.applyForm.invoiceType,
        taxNo: this.applyForm.taxNo,
        invoiceTitle:"",
      };
      if(this.applyForm.invoiceTitle == 119010){
        ajaxData.invoiceTitle = '个人';
        delete ajaxData.taxNo;
        this.ajaxForm(ajaxData);
      }else{
        ajaxData.invoiceTitle = this.applyForm.companyName;
        this.submitForm(ajaxData);
      }
    },
    submitForm(ajaxData){
      this.$refs['applyForm'].validate(valid=>{
        if(valid){
          this.ajaxForm(ajaxData);
        }else{
          return false;
        }
      })
    },
    ajaxForm(data){
      this.$http.post('/custom/invoiceManagement/add',data).then(res=>{
        if(res.data.code == 200){
          this.closeModal();
          this.getList();
        }
      })
    },
    getWords() {
      var words = JSON.parse(localStorage.getItem("words"));
      this.typeList = words[122].item;
      this.typeList.map((ele, i) => {
        if (i == 0) {
          this.$set(ele, "checked", true);
          this.applyForm.invoiceMode = ele.id;
        } else {
          this.$set(ele, "checked", false);
        }
      });
      this.titleList = words[118].item;
      this.titleList.map((ele, i) => {
        if (i == 0) {
          this.$set(ele, "checked", true);
          this.applyForm.invoiceTitle = ele.id;
        } else {
          this.$set(ele, "checked", false);
        }
      });
      this.catalogList = words[117].item;
      this.catalogList.map((ele, i) => {
        if (i == 0) {
          this.$set(ele, "checked", true);
          this.applyForm.invoiceType = ele.id;
        } else {
          this.$set(ele, "checked", false);
        }
      });
    },
    changeSelect(item, arr, str) {
      if (item.checked) return;
      arr.map(ele => {
        ele.checked = false;
      });
      item.checked = true;
      this.applyForm[str] = item.id;
    },
    showApplyForm(row) {
      this.showModal = true;
      this.applyForm.orderId = row.id;
    },
    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },

    getList() {
      this.$http
        .post("/custom/invoiceManagement/myList", this.ajaxData)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.pagination = res.data.pagination;
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
      if(this.ajaxData.invoiceStatus.length != 3){
        this.ajaxData.all = false;
      }else{
        this.ajaxData.all = true;
      }
      this.getList();
    }
  }
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
.box {
  //   border: 1px solid #e6e6e6;
}
.box-header {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e2e2;
  .search-input {
    width: 308px;
    input {
      border-radius: 0 !important;
    }
  }
  .tabs {
    display: flex;
    li {
      color: #787878;
      font-size: 14px;
      padding: 5px 10px;
      cursor: pointer;
      & + li {
        margin-left: 12px;
      }
    }
    .checked {
      background: @common-color;
      color: #fff;
    }
  }
}
.table {
  .table-header {
    margin-top: 40px;
    display: flex;
    color: #333;
    > div {
      padding-bottom: 12px;
      text-align: center;
    }
    border-bottom: 3px solid #abcdf8;
  }
  .table-item {
    margin-top: 15px;
    width: 100%;
    border: 1px solid #eee;
    td {
      vertical-align: middle;
    }
    .table-item-header {
      display: flex;
      font-size: 14px;
      > div + div {
        margin-left: 22px;
      }
    }
    thead {
      tr {
        height: 38px;
        background: #f1f1f1;
        color: #919191;
        td {
          padding-left: 15px;
        }
      }
    }
    tbody {
      tr {
        height: 104px;
      }
    }
  }
}
.status {
  color: #3f8def;
}
.invoiceInfo{
  text-align: left;
}
</style>
