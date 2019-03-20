<template>
    <div id="requirement-details">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>待分配需求</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: $route.query.from}" >报价接受需求</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box" >
            <div class="list">
                <div class="state">
                    <span>需求编号 :{{tableData.requirementNo}}</span>
                    <span class="stateBox">
                        <span  class="statusbtn" v-if="tableData.requirementStatus==107010"> -待分派</span>
                        <span class="statusbtn" v-if="tableData.requirementStatus==107020"> -可报价</span>
                        <span class="statusbtn" v-if="tableData.requirementStatus==107030"> -报价结束</span>
                    </span>
                    <span class="stateOperation">
                        <el-button v-if="tableData.requirementStatus==107010&&tableData.auditStatus==190020&&tableData.enquiryType==230010" @click="$router.push({path:'/main/requirement-Resolve',query:{'id':tableData.id}})">需求解析</el-button>
                        <el-button v-if="tableData.requirementStatus==107010&&tableData.auditStatus==190020" @click="$router.push({path:'/main/dispatch-order',query:{'id':tableData.id}})">分派</el-button>
                        <el-button v-if="tableData.auditStatus==190010" @click="approveOperation(tableData.id)">通过审核</el-button>
                        <el-button v-if="tableData.auditStatus==190010" @click="rejectOperation(tableData.id)">驳回需求</el-button>
                        <!-- <el-button v-if="tableData.requirementStatus==107020"  @click="$router.push({path:'/main/Quote-details', query:{'id':tableData.id}})">去报价</el-button> -->
                    </span>
                </div>
                <el-tabs v-model="activeName2" type="card" @tab-click="handleClick"  v-if="tableData.requirementStatus">
                    <el-tab-pane label="需求明细" name="first">
                        <div class="row ">
                            <div class="row-col">
                                <p class="title">联系人信息</p>
                                <div class="row-content user">
                                    <div>
                                        <p>
                                            <span class="usertitle">创建时间:</span>
                                            {{tableData.createTime |dataFilter}}
                                        </p>
                                        <p>
                                            <span class="usertitle">主工艺:</span>
                                            {{tableData.techniqueInfo?tableData.techniqueInfo.techniqueName:'无'}}
                                        </p>
                                        <p>
                                            <span class="usertitle">所属行业:</span>
                                            {{tableData.industryInfo?tableData.industryInfo.industryName:'无'}}
                                        </p>
                                        <p>
                                            <span class="usertitle">报价截止日期:</span>
                                            {{tableData.offerDeadlineTime | dayFilter}}
                                        </p>
                                        <p>
                                            <span class="usertitle">送货地区:</span>
                                            {{tableData.deliveryProvince}}{{tableData.deliveryCity}}
                                        </p>
                                        <div class="payType">
                                            <span class="usertitle">结算方式:</span>
                                            <span v-if="tableData.settlementType==430010">
                                                {{tableData.settlementTypeText}}
                                            </span>
                                            <span v-if="tableData.settlementType==430020">
                                                {{tableData.settlementTypeText}}
                                                {{tableData.settlementPeriodText}}
                                            </span>
                                        </div>
                                        <p>
                                            <span class="usertitle">当前已有报价人次:</span>
                                            {{tableData.countPrice.YBJ}}次
                                        </p>
                                        <div>
                                            <p  v-if="tableData.enquiryType==230010"><span class="usertitle">询价方式:</span>平台询价</p>
                                            <p  v-if="tableData.enquiryType==2300120"><span class="usertitle">询价方式:</span>指定供应商</p>
                                            <p  v-if="tableData.enquiryType==230030"><span class="usertitle">询价方式:</span>公开询价</p>
                                        </div>
                                    </div>
                                    <div class="userInfoInd">
                                        <div class="usertitle">需求说明:</div>
                                        <div>
                                            {{tableData.description?tableData.description:'无'}}
                                        </div>
                                    </div>
                                    <div class="userInfo">
                                        <div class="usertitle">联系人信息:</div>
                                        <div>
                                            <p>{{tableData.contactName?tableData.contactName:'-'}}</p>
                                            <p>{{tableData.contactEmail?tableData.contactEmail:'-'}}</p>
                                            <p>{{tableData.contactPhone?tableData.contactPhone:'-'}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row ">
                            <div class="row-col">
                                <p class="title">零件信息</p>
                                <div class="row-content PartInfo">
                                    <div class="table-header">
                                        <div style="width:15%">缩略图</div>
                                        <div style="width:15%">零件名称</div>
                                        <div style="width:15%">材料</div>
                                        <div style="width:15%">一阶梯报价量</div>
                                        <div style="width:15%">二阶梯报价量</div>
                                        <div style="width:15%">三阶梯报价量</div>
                                        <div style="width:10%">需求数量</div>
                                    </div>
                                    <div class="tableBody" v-for="(item,index) in tableData.itemList" :key="index">
                                        <div class="tableBodyHead">
                                            <div style="width:15%">
                                                <img :src="item.firstModelFileInfo?item.firstModelFileInfo.thumbnailUrl:''" alt="">
                                            </div>
                                            <div style="width:15%">{{item.itemName}}</div>
                                            <div style="width:15%">{{item.material}}</div>
                                            <div style="width:45%" class="ladderPriceInfo">
                                                <div  v-for="(ele,index) in item.ladderPriceInfo" :key="index">{{ele.from}} <span v-if="ele.to">~</span> {{ele.to}}</div>
                                                <div  v-if="!item.ladderPriceInfo">-</div>
                                            </div>
                                            <div style="width:10%">{{item.estimateCount}}</div>
                                        </div>
                                        <div class="tableBodyInfo">
                                            <p class="tableBodyloading">
                                                <span>
                                                    交付周期:  {{item.deliveryTime}} {{item.deliveryTimeUnitStr}}
                                                </span>
                                                <span>
                                                    目标单价:  {{item.expectPrice?item.expectPrice:'无'}}
                                                </span>
                                            </p>
                                            <p class="tableBodyloading">
                                                <span>
                                                    3D模型：
                                                    <a  class="modal-name" v-if="item.modelFileList"  target="_blank" :href="ele.fileUrl" v-for="(ele,index) in item.modelFileList" :key="index">{{ele.fileName}}</a>
                                                    <span v-if="!item.modelFileList">无</span>
                                                </span>
                                                <span>
                                                    2D图纸：
                                                    <a class="modal-name" v-if="item.planeGraphFileInfo"  target="_blank" :href="item.planeGraphFileInfo.fileUrl">{{item.planeGraphFileInfo.fileName}}</a>
                                                    <span v-if="!item.planeGraphFileInfo">无</span>
                                                </span>
                                                <span>
                                                    其他文件：
                                                    <a  class="modal-name" v-if="item.otherFileList" target="_blank" :href="ele.fileUrl" v-for="(ele,index) in item.otherFileList" :key="index">{{ele.fileName}}</a>
                                                    <span v-if="!item.otherFileList">无</span>
                                                </span>
                                            </p>
                                            <p>
                                                说明: {{item.description?item.description:'无'}}
                                            </p>
                                        </div>
                                        <div class="Analysis" v-if="tableData.enquiryType==230010">
                                            <p class="title">平台分析</p>
                                            <p class="tableBodyloading">
                                                <span>
                                                    分析报告：
                                                    <a  class="modal-name" target="_blank" v-if="item.analysisFileInfo" :href="item.analysisFileInfo.fileUrl">{{item.analysisFileInfo.fileName}}</a>
                                                    <span v-else>无</span>
                                                </span>
                                            </p>
                                            <p>
                                                <span>说明:</span>
                                                 {{item.analysisRemark?item.analysisRemark:'无'}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="报价清单" name="second"  v-if="tableData.requirementStatus!=107010">
                        <div class="quoteList">
                            <div class="tableHead">
                                <p>报价编号</p>
                                <p>供应商</p>
                                <p>零件名称</p>
                                <p>需求数量</p>
                                <p>第一阶梯报价</p>
                                <p>第二阶梯报价</p>
                                <p>第三阶梯报价</p>
                                <p>报价有效时间</p>
                            </div>
                            <div class="tableBody flexStyle" v-for="item in quoteListData" :key="item.id">
                                <div class="modal-name" v-if="item.offerStatus==210020" @click="$router.push({path:'/main/Quote-details', query:{'id':item.id}})">{{item.requirementPriceNo}}</div>
                                <div v-else>{{item.requirementPriceNo}}</div>
                                <div>{{item.companyName}}</div>
                                <div class="tableBodyContent">
                                    <div class="contentOfProduct flexStyle" v-for="ele in item.items" :key="ele.id">
                                        <div>{{ele.requirementItemInfo?ele.requirementItemInfo.itemName:''}}</div>
                                        <div>{{ele.requirementItemInfo?ele.requirementItemInfo.estimateCount:''}}</div>
                                        <div class="adder flexStyle" >
                                            <div v-if="ele.isAbandon">不报价</div>
                                            <div v-if="!ele.isAbandon" class="ladderPrice">
                                                <div v-if="!ele.requirementItemInfo.isLadderPrice">{{ele.singlePrice?'￥'+ele.singlePrice+'(单价)':'-'}}</div>
                                                <div v-if="ele.requirementItemInfo.isLadderPrice"  v-for="(ladder,index) in ele.ladderPriceInfo" :key="index" >
                                                    <div v-if="ladder.price" >
                                                        <div><span v-if="!ladder.to">大于</span>{{ladder.from}}<span v-if="ladder.to">--</span>{{ladder.to}}</div>
                                                        <div>￥{{ladder.price}}</div>
                                                    </div>
                                                    <div v-if="!ladder.price">
                                                        <p >-</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>{{item.offerInvalidTime|dayFilter}}</div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
             </div>
        </div>
        <el-dialog title="驳回需求" center :visible.sync="RejectDialog.Visible" width="600px">
            <div class="dialogContent">
                <div class="dialogTitle">驳回原因 :</div>
                <el-form  :model="RejectDialog"  :rules="RejectDialog.rules" ref="RejectDialog" label-width="100px" class="RejectDialogRuleForm">
                    <el-form-item  prop="textarea">
                        <el-input  type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="RejectDialog.textarea"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="RejectDialog.Visible = false">取 消</el-button>
                <el-button type="primary" @click="submitReject('RejectDialog')">确定驳回</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {dayFilter} from '../lib/filter.js'
export default {
  data() {
    return {
        tableData: [],
        activeName2: "first",
        quoteListData: "",
        RejectDialog:{
            Visible: false,
            textarea:'',
            rules:{
                textarea: [{ required: true, message: '请输入驳回的原因',trigger: 'blur'}],
            }
        },
        id:'',
        auditIDArray:[],
    };
  },
  created() {
    this.getRequirementDetails();
    this.getRequirementPriceList();
    this.auditIDArray = JSON.parse(window.localStorage.getItem("auditIDArray"))||[];
    let select = this.$route.query.select || "first";
    this.activeName2 = select;
  },
  methods: {
    //获取需求详情；
    getRequirementDetails(id) {
      let Id =id||Number(this.$route.query.id)
      this.$http.post("/operation/requirement/getRequirementDetails", { id: Id }).then(res => {
          if (res.data.code == 200) {
            this.pagination = res.data.pagination;
            this.tableData = res.data.data ? res.data.data : [];
          }
        })
        .catch(res => {});
    },
    //获取报价详情；
    getRequirementPriceList() {
      let Id = Number(this.$route.query.id);
      this.$http
        .post("/operation/RequirementPrice/getList", { requirementId: Id })
        .then(res => {
          if (res.data.code == 200) {
            this.quoteListData = res.data.data;
          }
        })
        .catch(res => {});
    },
    //tab栏切换
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //获取审核的API;
    getAuditApi(parameter){
        this.$http.post("/operation/Requirement/auditRequirements",parameter).then(res => {
            if (res.data.code == 200) {
                this.confirmBox(parameter)
            }else{
                this.$message({
                    type: "error",
                    message: res.data.message
                });
            }
        }).catch(res => {});
    },
    //审核操作；
    approveOperation(id){ 
        let parameter={
            'id':Number(id),
            'adopt':true,
            "auditRemark": this.RejectDialog.textarea,
        }
        this.getAuditApi(parameter);
    },
    //驳回操作；
    rejectOperation(id){
        this.RejectDialog.Visible=true;
        this.RejectDialog.textarea='';
        this.id=id;
    },
    //提交驳回消息；
    submitReject(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let parameter={
            'id':this.id,
            'adopt':false,
            "auditRemark": this.RejectDialog.textarea,
            }
            this.RejectDialog.Visible=false;
            this.getAuditApi(parameter)
          } else {
            return false;
          }
        })
    },
    confirmBox(value) {
        this.$confirm(`需求${this.tableData.requirementNo} 已${value.adopt?'审核通过':'驳回'}`,{
            confirmButtonText: '去审核下一个',
            cancelButtonText: '回待审核列表',
            // showConfirmButton: this.auditIDArray.length>1,
            closeOnClickModal:false,
            center: true
        }).then(() => {
            let IdArray=this.auditIDArray;
            if(IdArray.length>1){ 
                IdArray.splice(IdArray.findIndex(ele => ele === value.id), 1);
                window.localStorage.setItem("auditIDArray",JSON.stringify(IdArray));
                let id =IdArray[0];
                this.getRequirementDetails(id);
            }else{
                this.confirmEnd()
            }
        }).catch(() => {
            this.$router.push({path:'/main/audit-requirement'})
        });
    },
    confirmEnd(){
        this.$confirm('所有需求审核完毕', {
          confirmButtonText: '查看待分派需求',
          center: true,
        }).then(() => {
            this.$router.push({path:'/main/distributing-requirement'})
        }).catch(() => {
            return false;
        });
    }

  }
};
</script>
<style lang="less">
#requirement-details{
    .el-dialog__header {
      padding: 10px;
      background-color: #ebebeb;
    }
    .el-form-item__content {
      line-height: 34px;
    }
    .el-dialog__headerbtn{
        top:15px;
    }
    .el-dialog__body {
        padding: 25px 25px 30px;
    }
    .RejectDialogRuleForm{
        .el-form-item__content{
            margin-left: 0px !important;
        }   
    }
}
</style>

<style lang="less" scoped>
.box {
  padding: 0px 20px;
}
.title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 15px;
  padding: 0px;
}
p,.payType {
  padding: 12px 0px;
}
.modal-name {
  color: #3f8def;
  text-decoration: underline;
  white-space: nowrap;
  cursor: pointer;
}
.state {
  padding: 20px 0;
  span {
    display: inline-block;
    line-height: 32px;
    margin-right: 20px;
    .statusbtn {
      display: inline-block;
      color: #333333;
    }
  }
  .stateOperation {
    float: right;
  }
}
.list {
  .row {
    display: flex;
    .row-col {
      flex: 1;
      & + .row-col {
        margin-left: 66px;
      }
    }
    .row-content {
      background: #f5f5f5;
      padding: 20px 24px;
    }
    .user {
      margin-bottom: 20px;
      .userInfoInd,
      .userInfo {
        display: flex;
        align-items: center;
        p {
          padding: 5px 0;
        }
      }
      .usertitle {
        display: inline-block;
        padding-right: 5px;
      }
      .userInfoInd {
        height: 100px;
        border-bottom: 1px solid #e1e1e1;
        border-top: 1px solid #e1e1e1;
      }
    }
    .PartInfo {
      margin-bottom: 20px;
      .table-header,
      .tableBodyHead {
        display: flex;
        height: 60px;
        justify-content: center;
        text-align: center;
        align-items: center;
        border-top: 1px solid #e1e1e1;
        img {
          width: 120px;
          height: 40px;
          display: block;
          background: #ffffff;
          margin: 0 auto;
        }
      }
      .tableBody {
        .tableBodyInfo {
          border-top: 1px dashed #e1e1e1;
          .tableBodyloading {
            > span {
              display: inline-block;
              margin-right: 50px;
            }
          }
        }
        .ladderPriceInfo {
          display: flex;
          > div {
            flex: 1;
          }
        }
        .Analysis{
            padding-top: 15px;
            border-top: 1px dashed #e1e1e1;
            p{
                padding-top: 0;
            }
        }
      }
    }
  }
  .quoteList {
    .tableHead {
      display: flex;
      text-align: center;
      border-bottom: 1px solid #d7d7d7;
      p {
        flex: 1;
      }
      p:nth-child(2) {
        flex: 2;
      }
    }
    .flexStyle {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .tableBody {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid #d7d7d7;
      line-height: 32px;
      div:nth-child(1) {
        flex: 1;
      }
      div:nth-child(2) {
        flex: 2;
      }
      .tableBodyContent {
        border-right: 1px solid #d7d7d7;
        border-left: 1px solid #d7d7d7;
        flex: 5;
        .contentOfProduct {
          border-bottom: 1px solid #d7d7d7;
          p {
            padding: 5px;
          }
          > div {
            flex: 1;
          }
          .adder {
            flex: 3;
            display: flex;
            border-left: 1px solid #d7d7d7;
            .ladderPrice {
              display: flex;
              justify-content: center;
              align-items: center;

              > div {
                flex: 1;
              }
            }
          }
        }
        > div:last-child {
          border: 0px;
        }
      }
      div:nth-child(4) {
        flex: 1;
      }
    }
  }
}
.dialogContent{
    .dialogTitle{
        padding-bottom:16px;
    }
}
</style>
