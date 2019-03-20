<template>
  <div id="company_information_list">
    <div v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
      <p class="examine-state pull-center " v-if="DetailsPage.manufacturerAuditStatus==190020">资质已审核</p>
      <p class="examine-state pull-center color-state" v-if="DetailsPage.manufacturerAuditStatus==190010">资质待审核</p>
      <p class="examine-state pull-center color-state" v-if="DetailsPage.manufacturerAuditStatus==190030">资质审核未通过</p>
    </div>
    <div class="information-tabs-content information-first">
    <div class="information-tabs-left pull-left">
      <div class="tabs-content">
        <span class="tabs-title">公司介绍</span>
        <div class="tabs-text c-introduction">
          <div class="imgOut">
              <img :src="DetailsPage.logoUrl" alt="" v-if="DetailsPage.logoUrl!=undefined">
              <img v-else src="../../static/img/defaultLogo.png" alt="">
          </div>
          <p class="c-introduction-name1 c-introduction-name">
              <span class="cont-title">公司简称：{{DetailsPage.shortName}}</span>
          </p>
          <p class="c-introduction-name2 c-introduction-name">
              <span class="cont-title" >公司法定名称（注册）：{{DetailsPage.companyName}}</span>
          </p>
          <div class="c-introduction-cont">
              <span class="cont-title pull-left">公司介绍：</span>
              <span class="cont-txt">
                  {{DetailsPage.extendInfo.introduceInfo}}
              </span>
          </div>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">平台审核报告</span>
        <div class="tabs-text ToExamine">
            {{DetailsPage.manufacturerAuditReport}}
        </div>
      </div>
      <div class="tabs-content pull-top">
        <span class="tabs-title">联系人信息</span>
        <div class="tabs-text tableData">
          <el-table :data="DetailsPage.contactsInfo" style="width: 100%">
          <el-table-column  prop="contacts" label="姓名" align="center"> </el-table-column>
          <el-table-column  prop="jobTitle" label="职位" align="center" > </el-table-column>
          <el-table-column  prop="tel" label="手机号码" align="center"> </el-table-column>
          <el-table-column  prop="email" label="电子邮箱"  align="center"> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">关键设备清单</span>
        <div class="tabs-text tableData">
          <el-table :data="DetailsPage.equipmentInfo" style="width: 100%">
          <el-table-column  prop="equipmentName" label="设备名称" align="center"> </el-table-column>
          <el-table-column  prop="equipmentModel" label="型号" align="center" > </el-table-column>
          <el-table-column  prop="total" label="台数" align="center"> </el-table-column>
          <el-table-column  prop="equipmentParam" label="参数"  align="center"> </el-table-column>
          <el-table-column  prop="equipmentTypeStr" label="设备类型" align="center"> </el-table-column>
          <el-table-column  prop="brand" label="品牌" align="center"> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">资格认证</span>
        <div class="tabs-text tableData">
          <el-table :data="DetailsPage.qualificationInfo"  style="width: 100%">
          <el-table-column  prop="qualificationName" label="名称" align="center"> </el-table-column>
          <el-table-column  prop="qualificationIndate" label="有效期" align="center" > </el-table-column>
          <el-table-column prop="" label="附件" >
              <template slot-scope="scope">
                  <span v-if="scope.row.file !=undefined" @click="downloadClick(scope.row)" class="pull-cursor">{{scope.row.file.fileName}}</span>
              </template>
          </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">组织征信报告</span>
        <div class="tabs-text reputation max-Img">
          <img v-for="(item,index) in DetailsPage.creditInfo" v-if="item.file !=undefined" :src="item.file.fileUrl" alt="" :key="index">
        </div>
      </div>
    </div>
    <div class="information-tabs-right pull-left">
      <div class="tabs-content" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">提供服务的工艺</span>
        <div class="tabs-text  techniqueName">
              <span v-for="(item,index) in DetailsPage.techniqueInfo" :key="index" >
                  {{item.techniqueName}}
              </span>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">企业证件</span>
        <div class="tabs-text Technology">
          <p v-for="(item,index) in DetailsPage.certInfo" v-if="item.file !=undefined" :key="index" @click="downloadClick(item)" >
            <span class="pull-cursor">{{item.certTypeStr}}</span><span class="pull-ellipsis pull-cursor">{{item.file.fileName}}</span>
          </p>
        </div>
      </div>
      <div class="tabs-content" :class="$LocalStorage.gxzzpt2_consumer().isManufacturer==true?'pull-top':''">
        <span class="tabs-title">电子合同</span>
        <div class="tabs-text Fixed-info">
          <el-row>
          <el-col :span="24">
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="5">企业名称：</el-col>
              <el-col :span="19">{{DetailsPage.companyName}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="5">住所：</el-col>
              <el-col :span="19">{{DetailsPage.contract.address}}</el-col>
            </el-col>
            <!-- <el-col :span="24" class="Fixed-info-top">
              <el-col :span="5">帐号：</el-col>
              <el-col :span="19">{{DetailsPage.contract.account}}</el-col>
            </el-col> -->
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="5">联系电话：</el-col>
              <el-col :span="19">{{DetailsPage.contract.tel}}</el-col>
            </el-col>
            <!-- <el-col :span="24" class="Fixed-info-top">
              <el-col :span="5">法定代表人：</el-col>
              <el-col :span="19">{{DetailsPage.contract.legalPerson}}</el-col>
            </el-col> -->
          </el-col>
          </el-row>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">支持发票</span>
        <div class="tabs-text Fixed-info pull-height" style="padding-top: 12px;padding-bottom: 7px;">
          <span v-for="(item,index) in DetailsPage.invoiceInfo" :key="index" v-if="item.value==true">{{item.invoiceTitleTypeText}}-{{item.invoiceTypeText}} {{item.taxRate*100}}%</span>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">收款账号</span>
        <div class="tabs-text Fixed-info">
        <el-row>
          <el-col :span="24" class="Fixed-info-top">银行：{{DetailsPage.collectionAccount.bankName}}</el-col>
          <el-col :span="24" class="Fixed-info-top">姓名：{{DetailsPage.collectionAccount.accountName}}</el-col>
          <el-col :span="24" class="Fixed-info-top">账号：{{DetailsPage.collectionAccount.accountNo}}</el-col>
          </el-row>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">公司信息</span>
        <div class="tabs-text Fixed-info">
          <el-row>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">国家：</el-col>
              <el-col :span="18">{{DetailsPage.countryStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">省市：</el-col>
              <el-col :span="18" v-if="DetailsPage.province !=undefined&&DetailsPage.city !=undefined">{{DetailsPage.province}}、{{DetailsPage.city}}、{{DetailsPage.region}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">地址：</el-col>
              <el-col :span="18">{{DetailsPage.address}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">企业类型：</el-col>
              <el-col :span="18">{{DetailsPage.companyClassStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">成立年份：</el-col>
              <el-col :span="18">{{DetailsPage.foundingTime}}年</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">雇员数量：</el-col>
              <el-col :span="18">{{DetailsPage.extendInfo.employeeScaleStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">科研人员数量：</el-col>
              <el-col :span="18">{{DetailsPage.extendInfo.engineerScaleStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">设计人员数量：</el-col>
              <el-col :span="18">{{DetailsPage.extendInfo.designerScaleStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">质检人员数量：</el-col>
              <el-col :span="18">{{DetailsPage.extendInfo.qualityInspectorScaleStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">工厂面积：</el-col>
              <el-col :span="18">{{DetailsPage.extendInfo.factoryAcreageStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">年产值：</el-col>
              <el-col :span="18">
                  <span v-if="DetailsPage.extendInfo.yearlyOutput !=undefined"> {{DetailsPage.extendInfo.yearlyOutputStr}}</span>
                  </el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">最大年产能：</el-col>
              <el-col :span="18">
                  <span v-if="DetailsPage.extendInfo.maxYearlyOutput !=undefined">{{DetailsPage.extendInfo.maxYearlyOutput}}万元</span>
                  </el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">总资产：</el-col>
              <el-col :span="18">
                  <span v-if="DetailsPage.extendInfo.totalAssets !=undefined">{{DetailsPage.extendInfo.totalAssets}}万元</span>
                  </el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">进出口权：</el-col>
              <el-col :span="18">
                  <div v-if="DetailsPage.extendInfo.ioRight !=undefined">
                    <span v-if="DetailsPage.extendInfo.ioRight==true">是</span><span v-else>否</span>
                  </div>
              </el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">出口比例：</el-col>
              <el-col :span="18">{{DetailsPage.extendInfo.exportRateStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">ODM能力：</el-col>
              <el-col :span="18">
                  <div v-if="DetailsPage.extendInfo !=''">
                      <span v-if="DetailsPage.extendInfo.odmAbility==false">否</span><span v-else>是</span>
                  </div>
              </el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">公司性质：</el-col>
              <el-col :span="18">{{DetailsPage.companyPropertyStr}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">信息化系统：</el-col>
              <el-col :span="18">{{DetailsPage.extendInfo.informationSystem}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">网站：</el-col>
              <el-col :span="18">{{DetailsPage.extendInfo.websiteUrl}}</el-col>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
        <span class="tabs-title">行业与客户</span>
        <div class="tabs-text Fixed-info">
          <el-row>
          <el-col :span="24">
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">倾向订单类型：</el-col>
              <el-col :span="18">{{DetailsPage.coopInfo.orderTypeStr}}</el-col>
            </el-col>
          <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">主要出口市场：</el-col>
              <el-col :span="18">
              <span v-for="(item,index) in DetailsPage.coopInfo.exportMarketStr" :key="index" class="pull-inline">{{item}}</span>
              </el-col>
            </el-col>
          <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">第一优势行业：</el-col>
              <el-col :span="18">{{DetailsPage.industryName}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">第一主要客户：</el-col>
              <el-col :span="18">{{DetailsPage.coopInfo.firstCustomer}}</el-col>
            </el-col>
          <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">第二主要客户：</el-col>
              <el-col :span="18">{{DetailsPage.coopInfo.secondCustomer}}</el-col>
            </el-col>
          <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">第三主要客户：</el-col>
              <el-col :span="18">{{DetailsPage.coopInfo.thirdCustomer}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">代表性产品：</el-col>
              <el-col :span="18">
                  <span v-for="(item,index) in DetailsPage.coopInfo.mainWorks" :key="index" class="pull-inline">{{item}}</span>
              </el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">合作过的企业：</el-col>
              <el-col :span="18">
                  <span v-for="(item,index) in DetailsPage.coopInfo.coopCompanys" :key="index" class="pull-inline">{{item}}</span>
              </el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="6">行业类型：</el-col>
              <el-col :span="18">
                  <span v-for="(item,index) in DetailsPage.coopInfo.industryInfo" :key="index" class="pull-inline">{{item.industryName}}</span>
              </el-col>
            </el-col>
          </el-col>
          </el-row>
        </div>
      </div>
      <!-- <div class="tabs-content pull-top">
        <span class="tabs-title">联系方式</span>
        <div class="tabs-text Fixed-info">
          <el-row>
          <el-col :span="24">
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="4">联系人：</el-col>
              <el-col :span="20">{{DetailsPage.extendInfo.contacts}}</el-col>
            </el-col>
            <el-col :span="24" class="Fixed-info-top">
              <el-col :span="3">电话：</el-col>
              <el-col :span="21">{{DetailsPage.extendInfo.tel}}</el-col>
            </el-col>
          </el-col>
          </el-row>
        </div>
      </div> -->
    </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['informationList'],
    //   informationlist:{
    //   type:Object,
    //   requirder:true,
    // }
  data() {
    return {
    defaultLogo:'../../static/img/defaultLogo.png',
    DetailsPage:{
      logoUrl:'',
      companyName:'',
      shortName:'',
      extendInfo:[],
      contactsInfo:[],//联系人
      collectionAccount:'',//银行
      invoiceInfo:[],//发票
      equipmentInfo:[],
      qualificationInfo:[],
      creditInfo:[],
      techniqueInfo:[],
      certInfo:[],
      country:'',
      countryStr:'',
      province:'',
      city:'',
      region:'',
      manufacturerAuditReport:'',
      address:'',
      companyClassStr:'',
      foundingTime:'',
      companyPropertyStr:'',
      coopInfo:[],
      industryName:'',
      contract:'',
      manufacturerAuditStatus:190010,
      },
    }
  },
  watch: {
      informationList (val, oldVal) {
        this.DetailsPage=val
      }
    },
  created() {
  },

  mounted() {

  },
  methods: {
    /*附件下载*/
    downloadClick(row){
        window.open(row.file.fileUrl);
        // var iframe = document.createElement("iframe")
        // iframe.style.display = "none";
        // iframe.src = row.file.fileUrl;
        // document.body.appendChild(iframe);
    },

  }
}
</script>

<style lang="less" scoped>
.Technology{
  p+p{margin-top: 10px;}
  p{
    span{
      width: 100px;
      display: inline-block;
    }
    span+span{width: 230px;}
  }
}
.techniqueName{
  padding: 15px 10px!important;
  span{
    display: inline-block;
    padding: 5px 15px;
  }
}
  .max-Img{
      img{max-width: 555px;}
  }
</style>

