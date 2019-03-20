<template>
  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>需求方管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/main/manufacturer-manage' }">企业供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>审核</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box Enterprise-information" v-loading="loading" element-loading-text="数据加载中">
        <el-tabs v-model="activeName" @tab-click="handleClick" id="tabClick">
             <p v-if="DisplayState==='NotThrough'" class="State-prompting">
                <span v-if="prompting===190010">资质待审核</span>
                <span v-if="prompting===190030">审核未通过</span>
             </p>
             <el-tab-pane label="企业信息" name="second" v-if="DisplayState==='adopt'">
              <div class="list">
               <div class="row ">
                <div class="row-col">
                   <el-row :gutter="5">
                    <el-col :span="12" class="information-tabs-lef" >
                      <div class="contentList company">
                        <p class="title">公司介绍:</p>
                        <div class="info-content ">
                          <div class="row-content manufInfo">
                              <div class="company-top pull-over">
                                  <el-row>
                                    <el-col :span="24">
                                      <div class="imgOut">
                                         <img :src="Form.logoUrl" alt="" >
                                      </div>
                                    </el-col>
                                    <el-col :span="24">
                                        <span>公司简称：<section>{{Form.shortName}}</section></span>
                                    </el-col>
                                    <el-col :span="24">
                                        <span class='register'>公司法定名称（注册）：<section>{{Form.companyName}}</section></span>
                                    </el-col>
                                  </el-row>
                              </div>
                              <div class="company-bottom">
                                <p>公司介绍：</p>
                                <span>
                                    {{Form.introduceInfo}}
                                </span>
                              </div>
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">平台审核报告:</p>
                        <div class="info-content ">
                          <div class="row-content manufInfo">
                               {{Form.manufacturerAuditReport}}
                          </div>
                        </div>
                      </div>
                      <div class="contentList company">
                        <p class="title">联系人信息:</p>
                        <div class="info-content ">
                          <div class="row-content manufInfo">
                            <el-table :data="Form.contactsInfo" style="width: 100%">
                            <el-table-column  prop="contacts" label="姓名" align="center"> </el-table-column>
                            <el-table-column  prop="jobTitle" label="职位" align="center" > </el-table-column>
                            <el-table-column  prop="tel" label="手机号码" align="center"> </el-table-column>
                            <el-table-column  prop="email" label="电子邮箱"  align="center"> </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">关键设备清单:</p>
                        <div class="info-content ">
                          <div class="row-content manufInfo">
                            <el-table :data="Form.equipmentInfo" border style="width: 100%">
                              <el-table-column prop="equipmentName" label="设备名称" > </el-table-column>
                              <el-table-column prop="equipmentModel" label="型号" > </el-table-column>
                              <el-table-column prop="total" label="台数" > </el-table-column>
                              <el-table-column prop="equipmentParam" label="参数" > </el-table-column>
                              <el-table-column prop="equipmentTypeStr" label="设备类型" > </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">资格认证:</p>
                        <div class="info-content ">
                          <div class="row-content manufInfo">
                            <el-table :data="Form.qualificationInfo" border style="width: 100%">
                              <el-table-column prop="qualificationName" label="名称" > </el-table-column>
                              <el-table-column prop="qualificationIndate" label="有效期" > </el-table-column>
                              <el-table-column prop="" label="附件" >
                                <template slot-scope="scope">
                                    <span @click="downloadClick(scope.row)" class="pull-cursor" v-if="scope.row.file!=undefined">{{scope.row.file.fileName}}</span>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">组织征信报告:</p>
                        <div class="info-content ">
                          <div class="row-content manufInfo creditImg">
                              <img v-for="(item,index) in Form.creditInfo" :src="item.file.fileUrl" alt="" :key="index">
                          </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="10" class="company-left information-tabs-right">
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">提供服务的工艺:</p>
                        <div class="info-content">
                          <div class="row-content manufInfo Fixed-info-top pull-over techniqueCont">
                              <span v-for="(item,index) in Form.business" :key="index">{{item.techniqueName}}</span>
                                <!-- <div v-for="(items,index) in ModifyPage.techniqueData" :key="index" class="techniqueDataSpan">
                                       <span v-for="(item,index) in Form.business" :key="index" v-if="items.id===item.techniqueType">
                                           {{items.name}}
                                       </span>
                                </div> -->
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">企业证件:</p>
                        <div class="info-content">
                          <div class="row-content manufInfo pull-top Technology">
                             <!-- <a class="underLine" :href="tableData.equipmentFileUrl">{{tableData.equipmentFileName}}</a> -->
                             <!-- <span v-for="(item,index) in Form.certInfo" :key="index" @click="downloadClick(item)" class="pull-cursor">{{item.file.fileName}}</span> -->
                              <p v-for="(item,index) in Form.certInfo" v-if="item.file !=undefined" :key="index" @click="downloadClick(item)" >
                                <span class="pull-cursor">{{item.certTypeStr}}</span><span class="pull-ellipsis pull-cursor">{{item.file.fileName}}</span>
                              </p>
                          </div>
                        </div>
                      </div>
                      <div class="contentList company">
                        <p class="title">电子合同:</p>
                        <div class="info-content">
                          <div class="row-content manufInfo Fixed-info-top">
                              <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">企业名称：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.companyName}}</el-col>
                              </el-row>
                              <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">住所：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.contract.address}}</el-col>
                              </el-row>
                              <!-- <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">帐号：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.contract.account}}</el-col>
                              </el-row> -->
                              <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">联系电话：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.contract.tel}}</el-col>
                              </el-row>
                              <!-- <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">传真：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.contract.fax}}</el-col>
                              </el-row> -->
                               <!-- <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">法定代表人：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.contract.legalPerson}}</el-col>
                              </el-row> -->
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">支持发票:</p>
                        <div class="info-content">
                          <div class="row-content manufInfo Fixed-info-top pull-over pull-height">
                            <span v-for="(item,index) in Form.invoiceInfo" :key="index" v-if="item.value==true">
                              {{item.invoiceTitleTypeText}}-{{item.invoiceTypeText}} {{item.taxRate*100}}%
                              </span>
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">收款账号:</p>
                        <div class="info-content">
                          <div class="row-content manufInfo Fixed-info-top">
                              <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">银行：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.collectionAccount.bankName}}</el-col>
                              </el-row>
                              <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">姓名：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.collectionAccount.accountName}}</el-col>
                              </el-row>
                              <el-row class="contact">
                                <el-col :span="7" class="companyInfo-1 companyInfo-txt">账号：</el-col>
                                <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.collectionAccount.accountNo}}</el-col>
                              </el-row>
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">公司信息:</p>
                        <div class="info-content">
                          <div class="row-content manufInfo">
                               <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">国家：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.countryStr}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">省市：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt"><span  v-if="Form.province !=undefined&&Form.city !=undefined">{{Form.province}}、{{Form.city}}、{{Form.region}}</span></el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">地址：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.address}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">企业类型：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.companyClassStr}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">成立年份：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.foundingTime}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">雇员数量：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.employeeScaleStr}}</el-col>
                                  </el-row>
                                </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">科研人员数量：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.engineerScale}}</el-col>
                                  </el-row>
                               </div>
                               <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">设计人员数量：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.designerScaleStr}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">质检人员数量：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.qualityInspectorScaleStr}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">工厂面积 ：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.factoryAcreageStr}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">年产值：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.yearlyOutput}}</el-col>
                                  </el-row>
                              </div>
                               <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">最大年产能：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.maxYearlyOutput}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">总资产：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.totalAssets}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">进出口权：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt"><span v-if="Form.ioRight==true">是</span><span v-else>否</span></el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">出口比例：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.exportRateStr}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">ODM能力：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt"><span v-if="Form.odmAbility==false">否</span><span v-else>是</span></el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">公司性质：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.companyPropertyStr}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">信息化系统：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.informationSystem}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">网站：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.websiteUrl}}</el-col>
                                  </el-row>
                               </div>
                          </div>
                        </div>
                      </div>
                      <div class="contentList company" v-if="this.Form.isManufacturer==true">
                        <p class="title">行业与客户:</p>
                        <div class="info-content">
                          <div class="row-content manufInfo">
                             <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">倾向订单类型：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.orderTypeStr}} </el-col>
                                  </el-row>
                              </div>
                               <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">主要出口市场:</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.exportMarketStr}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">第一优势行业：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.industryName}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">第一主要客户：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.firstCustomer}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">第二主要客户：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.secondCustomer}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">第三主要客户：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt">{{Form.thirdCustomer}}</el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">代表性产品：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt"><span v-for="(item,index) in Form.mainWorks" :key="index" class="pull-inline">{{item}}</span></el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">合作过的企业：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt"><span v-for="(item,index) in Form.coopCompanys" :key="index" class="pull-inline">{{item}}</span></el-col>
                                  </el-row>
                               </div>
                                <div class="companyInfo">
                                  <el-row>
                                    <el-col :span="7" class="companyInfo-1 companyInfo-txt">行业类型：</el-col>
                                    <el-col :span="17" class="companyInfo-2 companyInfo-txt"><span v-for="(item,index) in Form.industryInfo" :key="index" class="pull-inline">{{item.industryName}}</span></el-col>
                                  </el-row>
                               </div>
                          </div>
                        </div>
                      </div>

                    </el-col>
                   </el-row>
                </div>
               </div>
              </div>
             </el-tab-pane>
             <el-tab-pane label="供应商审核" name="first"  v-if="DisplayState==='NotThrough'">
            <div class="list">
             <div class="row ">
              <div class="row-col">
                <el-row :gutter="5">
                <el-col :span="24" >
                  <p class="title">注册信息:</p>
                  <div class="info-content info-left Manufacturer register">
                    <div class="row-content pull-over">
                      <el-col :xs="24" :sm="24" :md="14" :lg="14">
                        <el-col :xs="24" :sm="12" :md="12" :lg="12">
                          <p>企业法定名称：{{ruleForm.companyName}}</p>
                          <p>联系人姓名：{{ruleForm.contactsInfo.contacts}}</p>
                          <p>手机号码：{{ruleForm.adminInfo.phone}}</p>
                          <p>主工艺：<span  class="pull-inline" v-for="(item,index) in ruleForm.techniqueInfo" :key="index">{{item.techniqueName}}</span></p>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12">
                          <p>企业简称：{{ruleForm.shortName}}</p>
                          <p>电子邮箱：{{ruleForm.contactsInfo.email}}</p>
                          <p>国家/地区：{{ruleForm.countryStr}}</p>
                          <p>联系电话：{{ruleForm.contactsInfo.tel}}</p>
                        </el-col>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="10" :lg="10">
                     <div class="Business_picture">
                     <div class="info-content info-right Manufacturer ">
                        <div class="row-content manufInfo pull-over">
                            <div class="pull-left " style="margin-right:50px;">
                                <p >营业执照：</p>
                                <div class="imgsmallbox" @click="showProductBigPic(ruleForm)">
                                    <img v-if="ruleForm.businessCert!=''" :src="ruleForm.businessCert" alt="">
                                    <span>{{ruleForm.shortName}}</span>
                                </div>
                                <!-- <div id="overlay" class="overlay" v-if="isProductShow"  @click="overlay"></div> -->
                                  <!-- <div class="imgbigbox" v-if="isProductShow">
                                    <img :src="ruleForm.businessCert" alt="">
                                  </div> -->
                            </div>
                            <div class="pull-left ">
                                <p >Logo：</p>
                                <div class="imgsmallbox" @click="showTaxBigPic(ruleForm)">
                                    <img v-if="ruleForm.logoUrl!=undefined" :src="ruleForm.logoUrl" alt="">
                                    <span>{{ruleForm.shortName}}</span>
                                </div>
                                <!-- <div id="overlay" class="overlay" v-if="isTaxShow" @click="overlay"></div> -->
                                <!-- <div class="imgbigbox" v-if="isTaxShow">
                                    <img :src="ruleForm.logoUrl" alt="">
                                </div> -->
                            </div>
                            </div>
                            </div>
                          </div>
                      </el-col>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <p class="title">完善信息:</p>
                  <div class="info-content info-left Manufacturer Perfect_information">
                    <div class="row-content">
                      <div class="Perfect_information_list">
                        <h3>支持发票</h3>
                        <span v-for="(item,index) in ruleForm.invoiceInfo" :key="index" v-if="item.value==true">{{item.invoiceTitleTypeText}} {{item.invoiceTypeText}} {{item.taxRate}}</span>
                      </div>
                      <div class="Perfect_information_list">
                        <h3>电子合同</h3>
                        <span>企业名称：{{ruleForm.companyName}}</span><span>联系电话：{{ruleForm.contract.tel}}</span><span>住所：{{ruleForm.contract.address}}</span>
                      </div>
                      <div class="Perfect_information_list">
                        <h3>收款账号</h3>
                        <span>银行：{{ruleForm.collectionAccount.bankName}}</span><span>姓名：{{ruleForm.collectionAccount.accountName}}</span><span>账号：{{ruleForm.collectionAccount.accountNo}}</span>
                      </div>
                    </div>
                  </div>
                </el-col>
                </el-row>
               </div>
              </div>
             </div>
             </el-tab-pane>
        </el-tabs>
        <div class="submitpart" v-if="this.activeName !='second'">
            <div class="row ">
                <div class="row-col">
                    <p class="title">审核:</p>
                    <div class="row-content audit">
                        <div class="el-form-list">
                           <el-form :model="Result" :rules="rules" ref="Result" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="审核结果：" prop="isPassed">
                                <el-radio-group v-model="Result.isPassed">
                                <el-radio label="1">通过</el-radio>
                                <!-- <el-radio label="0">不通过</el-radio> -->
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="说明：" prop="remark" class="el-form-remark">
                                <el-row >
                                <el-col  :sm="24" :md="22" :lg="10" :xl="10">
                                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="Result.remark" placeholder="请输入内容"></el-input>
                                </el-col>
                                </el-row>
                            </el-form-item>
                               <el-form-item label="通知方式：" prop="type" >
                                    <el-checkbox-group v-model="Result.type">
                                    <el-checkbox label="360010">站内消息</el-checkbox>
                                    <el-checkbox label="360020">通过邮件</el-checkbox>
                                    <el-checkbox label="360030">通过短信</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            <el-form-item class="pull-btn">
                                <el-button @click="returnBack"  size="small">返回</el-button>
                                <el-button type="primary" @click="submitForm('Result')" :loading="this.saveLoading"  size="small">提交</el-button>
                            </el-form-item>
                        </el-form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            radio1:'',
            radio2:'3',
            textarea:'',
            prompting:'',
            tableData:[],
            loading:false,
            saveLoading:false,
            activeName: 'second',
            isTaxShow:false,
            isProductShow:false,
            DisplayState:'',//通过-adopt，未通过-NotThrough,变更中-Changes
            Form:{
               logoUrl:'',
               companyName:'',
               shortName:'',
               introduceInfo:'',
               countryStr:'',
               province:'',
               city:'',
               region:'',
               address:'',
               websiteUrl:'',
               informationSystem:'',
               companyPropertyStr:'',
               odmAbility:'',
               exportRateStr:'',
               maxYearlyOutput:'',
               yearlyOutputStr:'',
               factoryAcreageStr:'',
               companyClassStr:'',
               thirdCustomer:'',
               secondCustomer:'',
               firstCustomer:'',
               foundingTime:'',
               employeeScaleStr:'',
               engineerScale:'',
               designerScaleStr:'',
               qualityInspectorScaleStr:'',
               manufacturerAuditReport:'',
               contactsInfo:[],
               yearlyOutput:'',
               totalAssets:'',
               ioRight:'',
               tel:'',
               orderType:'',
               orderTypeStr:'',
               exportMarketStr:'',
               contacts:'',
               mainWorks:[],
               coopCompanys:[],
               creditInfo:[],
               qualificationInfo:[],
               certInfo:[],
               business:[],
               equipmentInfo:[],
               industryInfo:'',
               collectionAccount:'',//银行
               invoiceInfo:[],//发票
               isManufacturer:false,
               contract:''
            },
            ruleForm:{
                logoUrl:'',
                companyName:'',
                shortName:'',
                adminInfo:'',
                countryStr:'',
                techniqueInfo:'',
                productionLicenseFile:[],
                taxCertificateFile:[],
                businessCert:'',
                invoiceInfo:[],
                contract:'',
                collectionAccount:'',
                contactsInfo:'',
                province:'',
                city:'',
                region:'',
                address:'',
                contacts:'',
                email:'',
                employeeScale:'',
                tel:'',
                techniqueList:[],
            },
            ModifyPage:{
              techniqueData:'',
              TradeList:'',
            },
            Result:{
             isPassed:'1',
             remark:'',
             type:[],
            },
            rules: {
            isPassed: [
            { required: true, message: '请选择审核结果', trigger: 'change' }
            ],
            type:[
             { type: 'array', required: true, message: '请选择通知方式', trigger: 'change'}
            ],
            remark: [
            { required: true, message: '请填写说明', trigger: 'blur' }
            ]
            }
        }
    },
    created(){
        // this.getCompanyDetail();
      let status=parseInt(this.$route.query.status)
      this.prompting=status;
      if(status===190020){
          this.DisplayState='adopt';
          this.activeName='second';
          this.created();
      }else{
          this.DisplayState='NotThrough'
          this.activeName='first';
          this.ToExamine();
      }
      this.catalogName();
    //   this.industryCheck();
    },
    methods:{
        catalogName(){
          let url="/getWords";
          this.$http.post(url).then(res=>{
              var jsonObj = res.data.data
                for(let i in jsonObj){
                if(i==105){this.ModifyPage.techniqueData=jsonObj[i].item}
                }
          })
        },
    //   industryCheck(){
    //   let _this=this;
    //   let url="/custom/industry/all"
    //   _this.$http.post(url).then(res=>{
    //       _this.ModifyPage.TradeList=res.data.data
    //   })
    // },

        /*企业信息*/
        created(){
          let _this=this;
          let url='/operation/company/getCompanyDetail';
          let params={
              companyId:parseInt(this.$route.query.companyId)
          }
          this.loading=true;
          _this.$http.post(url,params).then(res=>{
              let data=res.data.data;
              if(JSON.stringify(data) == "{}"){
                data=[];
                }
              this.loading=false;
              _this.Form={
                isManufacturer:data.isManufacturer,
                 business:data.techniqueInfo,
                 logoUrl:data.logoUrl,
                 shortName:data.shortName,
                 companyName:data.companyName,
                 certInfo:data.certInfo,
                 countryStr:data.countryStr,
                 province:data.province,
                 city:data.city,
                 region:data.region,
                 address:data.address,
                 creditInfo:data.creditInfo,
                 websiteUrl:data.extendInfo.websiteUrl,
                 informationSystem:data.extendInfo.informationSystem,
                 equipmentInfo:data.equipmentInfo,
                 companyPropertyStr:data.companyPropertyStr,
                 odmAbility:data.extendInfo.odmAbility,
                 exportRateStr:data.extendInfo.exportRateStr,
                 maxYearlyOutput:data.extendInfo.maxYearlyOutput,
                 yearlyOutputStr:data.extendInfo.yearlyOutputStr,
                 factoryAcreageStr:data.extendInfo.factoryAcreageStr,
                 thirdCustomer:data.coopInfo.thirdCustomer,
                 secondCustomer:data.coopInfo.secondCustomer,
                 firstCustomer:data.coopInfo.firstCustomer,
                 foundingTime:data.extendInfo.foundingTime,
                 tel:data.extendInfo.tel,
                 employeeScaleStr:data.extendInfo.employeeScaleStr,
                 engineerScale:data.extendInfo.engineerScale,
                 designerScaleStr:data.extendInfo.designerScaleStr,
                 qualityInspectorScaleStr:data.extendInfo.qualityInspectorScaleStr,
                 yearlyOutput:data.extendInfo.yearlyOutput,
                 totalAssets:data.extendInfo.totalAssets,
                 ioRight:data.extendInfo.ioRight,
                 orderTypeStr:data.coopInfo.orderTypeStr,
                 industryName:data.coopInfo.firstIndustry.industryName,
                 exportMarketStr:data.coopInfo.exportMarketStr.join(),
                 mainWorks:data.coopInfo.mainWorks,
                 industryInfo:data.coopInfo.industryInfo,
                 coopCompanys:data.coopInfo.coopCompanys,
                 companyClassStr:data.companyClassStr,
                 qualificationInfo:data.qualificationInfo,
                 introduceInfo:data.extendInfo.introduceInfo,
                 contacts:data.extendInfo.contacts,
                 contract:data.contract,
                 manufacturerAuditReport:data.manufacturerAuditReport,
                 contactsInfo:data.contactsInfo,
                 collectionAccount:data.collectionAccount,//银行
                 invoiceInfo:data.invoiceInfo,//发票
              }
          })
        },
        /*供应商审核*/
        ToExamine(){
          this.loading=false;
          let _this=this;
          let url='/operation/company/manufacturerApplyInfo';
          let params={
            companyId:parseInt(this.$route.query.companyId)
          }
          _this.$http.post(url,params).then(res=>{
            let manufacturerAuditStatus=parseInt(res.data.data.manufacturerAuditStatus)
            if(manufacturerAuditStatus===190010){
                this.Result.isPassed=''
            }
            if(manufacturerAuditStatus===190030){
                this.Result.isPassed='0'
            }
            _this.ruleForm={
                logoUrl:res.data.data.logoUrl,
                companyName:res.data.data.companyName,
                shortName:res.data.data.shortName,
                adminInfo:res.data.data.adminInfo,
                countryStr:res.data.data.countryStr,
                techniqueInfo:res.data.data.techniqueInfo,
                contactsInfo:res.data.data.contactsInfo,
                contract:res.data.data.contract,
                // productionLicenseFile:res.data.data.certInfo !=''?res.data.data.certInfo[1].file.fileUrl:'',
                // taxCertificateFile:res.data.data.certInfo !=''?res.data.data.certInfo[0].file.fileUrl:'',
                businessCert:res.data.data.businessCert.file!=undefined?res.data.data.businessCert.file.fileUrl:'',
                collectionAccount:res.data.data.collectionAccount,
                invoiceInfo:res.data.data.invoiceInfo,
                province:res.data.data.province,
                city:res.data.data.city,
                region:res.data.data.region,
                address:res.data.data.address,
                // contacts:res.data.data.extendInfo.contacts,
                // email:res.data.data.extendInfo.email,
                // employeeScale:res.data.data.extendInfo.employeeScaleStr,
                // tel:res.data.data.extendInfo.tel,
                // techniqueList:res.data.data.techniqueInfo,
            }
          })
        },

        /*附件下载*/
        downloadClick(row){
             window.open(row.file.fileUrl);
            // var iframe = document.createElement("iframe")
            // iframe.style.display = "none";
            // iframe.src = row.file.fileUrl;
            // document.body.appendChild(iframe);
        },
        /*新企业信息详情*/
        returnBack(){
            this.$router.push({path:'/main/manufacturer-manage'})
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        /*显示大图片*/
        showProductBigPic(ruleForm){
          if(ruleForm.businessCert!=''){
            window.open(ruleForm.businessCert);
          }
            // this.isProductShow=!this.isProductShow;
        },
        /*税务登记*/
        showTaxBigPic(ruleForm){
          if(ruleForm.logoUrl!=undefined){
            window.open(ruleForm.logoUrl);
          }
          //  this.isTaxShow=!this.isTaxShow;
        },
        /*关闭大图片*/
        // overlay(){
        //      this.isProductShow=false;
        //      this.isTaxShow=false;
        // },
        /*图片下载*/
        imgBtn(url){
            var iframe = document.createElement("iframe")
            iframe.style.display = "none";
            iframe.src = url;
            document.body.appendChild(iframe);
        },
        /*提交按钮*/
       submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          this.saveLoading=true;
          if (valid) {
            let _this=this;
            let url='/operation/company/auditManufacturer';
              let notifyTypes=[]
              for(let index in this.Result.type){
                  notifyTypes.push(parseInt(this.Result.type[index]))
              }
            let params={
                companyId:parseInt(this.$route.query.companyId),
                isPassed:this.Result.isPassed=='1'?true:false,
                remark:this.Result.remark,
                notifyTypes:notifyTypes
            }
            _this.$http.post(url,params).then(res=>{
                if(res.data.code==200){
                this.$message({
                message: '数据提交成功',
                type: 'success',
                duration:1000
                });
                setTimeout(() => {
                 this.$router.push({path:'/main/manufacturer-manage'})
                }, 1100);
                this.saveLoading=false;
                }else{
                this.$message({
                showClose: true,
                 message: '数据提交失败',
                type: 'warning'
                });
                this.saveLoading=false;
                }
            })
          } else {
            return false;
          }
        });
      },
        // submit(){
            // _this.

            // let data={
            //     "companyId":Number(this.$route.query.companyId),
            //     "isPassed": this.radio1==190020,
	        //     "remark": this.textarea,
            // }
            // this.$http.post("/operation/company/auditManufacturer",data).then(res => {
            //     if (res.data.code == 200){
            //         this.$message({
            //             type: "success",
            //             message: res.data.message,
            //             duration:1000
            //         })
            //         this.getCompanyDetail()
            //     }
            // }).catch(res => {
            //     this.$message({
            //         type: "error",
            //         message: res.data.message
            //     });
            // });
        // }
    }


};
</script>
<style lang="less">
   .el-form-list{
      .el-form-remark{
         .el-form-item__label{
            width: 74px!important;
         }
         .el-form-item__content{
            margin-left: 75px!important;
         }
      }
   }
   .pull-btn{
       margin-left: -100px;
       text-align: center;
       button{width:110px;}
       button+button{
           margin-left: 100px!important;
       }
    }

</style>

<style lang="less" scoped>
.pull-cursor{
    cursor: pointer;
    &:hover{
      color: #3f8def!important;
    }
    }
.info-content{position: relative;width:100%;}
.info-left{}
.info-right{margin-left: 5%;}
.pull-left{float: left;}
.pull-right{float: right;}
.pull-over{overflow: hidden;}
.company-left{margin-left: 18px!important;}
.pull-inline{display: inline-block!important;}
.pull-inline+.pull-inline{
    &::before{
        content:",";
        width: 5px;
        display: inline-block;
        padding-left: 2px;
    }
}
.pull-top{
    span+span{margin-top:25px}
}
.pull-ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.techniqueCont{
  padding: 20px 0!important;
  span{
    display: inline-block!important;
    padding: 0 15px;
    margin-top: 0!important;
  }
}
.techniqueDataSpan{float: left;margin:0 15px;}
.information-tabs-lef{
  width: 600px;
}
.information-tabs-right{
  width: 455px;
}
@common-color: #3f8def;
.box {
  padding: 10px 20px 0px 20px;
}
p{
    padding: 12px 0;
}
.title{
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 15px;
    padding:0px;
    padding-left:24px;
}
.row {
    margin: 12px 0 24px 0;
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
  }
.list {
    position: relative;
    .user {
      height: 120px;
      >p{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          span{
            flex: 1;
            .passwordReset{
                    font-weight: normal;
                    margin-left: 30px;
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
    }
    .Info{
        height: 400px;
        .conpanydetailInfo{
            width: 100%;
            span{
                line-height: 60px;
                display: inline-block;
                width: 33%
            }
        }
        >div{
            img{
                width: 400px;
                height: 200px;
            }
        }
    }
    .manufInfo{
        >div{
            .imgsmallbox{
                cursor: pointer;
                width: 200px;
                height: 150px;
                background-color: #fff;
                img{
                    width: 100%;
                    height: 100%;
                }
                span{
                  font-size: 30px;
                  font-weight: bold;
                  color: #a8a8a8;
                  margin: 0;
                  line-height: 150px;
                  text-align: center;
                }
            }
            #overlay{
                cursor: pointer;
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0px;
                left: 0px;
                z-index: 10000;
                display:block;
                background-color: #777;
                opacity: 0.5;
                -moz-opacity: 0.5;
            }
            .imgbigbox{
                  width: 700px;
                >img{
                    border: 1px solid #fff;
                    width: 700px;
                    height: 400px;
                    z-index: 10001;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    margin: auto;
                }
            }
        }
        >div:nth-child(1){
            >span{
                margin-right:100px ;
            }
        }
        .underLine{
            text-decoration: underline;
        }
    }
}
.submitpart{
    .audit{
        // height: 200px;
        margin-bottom:100px;
        >div{
            padding: 20px 0;
            span{
               margin-right: 10px;
            }
        }
        .textBox{
            width: 500px;
            display: flex;
            align-items: center;
            span{
                width: 60px;
                text-align: center;
            }
        }
        .btn{
            display: flex;
            justify-content: center;
        }
    }
}
.modal-name{
    color: #3f8def;
    text-decoration: underline;
    white-space: nowrap;
    cursor: pointer;
}
.Enterprise-information{
    .title{
      padding-left:0!important;
    }
    .State-prompting{
        padding:0!important;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: rgba(255, 233, 233, 0.8);
        color: #ff2c2c;
    }
}
.Fixed-info-top{
  span+span{margin-top: 18px;}
  .contact+.contact{margin-top: 18px;}
}
//供应商审核
.Manufacturer{
    .Manufacturer-top{overflow: hidden;}
    .Manufacturer-bottom{margin-top:25px;}
    img{width: 220px;height:100px;float: left;margin-right: 30px;background-color: #e2e2e2;}
    span{margin-right: 0!important;display: block;margin-bottom:15px;}
}
.pull-height{
    span{
        display: inline-block!important;
        width: 50%;
        height: 25px;
    }
}
//企业信息
.company+.company{margin-top:30px;}
.company{
  .company-top{
    .imgOut{
      width: 218px;
      height: 82px;
      line-height: 82px;
      text-align: center;
      border: 1px solid #e2e2e2;
      margin-bottom: 22px;
    img{
      display: inline-block!important;
      width: auto!important;
      max-width: 216px;
      height: 82px;
    }
    }
     section{padding-left: 5px;display: inline-block;}
     .register{margin-top: 26px;}
  }
  .creditImg{
    width: 595px;
    box-sizing: border-box;
    img{max-width: 545px;margin-bottom: 15px;}
  }
  .company-bottom{
      margin-top: 22px;
      overflow: hidden;
     p{
        display: block;
        float: left;
        padding: 2px 0 0 0!important;
     }
     span{
        margin-left: 70px;
        line-height: 23px;
     }
  }
  span{margin-right: 0!important;display: block;}
  .companyInfo{
      border: 1px solid #ddddde;
      margin-top: -1px;
      display: block!important;
      .companyInfo-2{border-left: 1px solid #ddddde;}
      .companyInfo-txt{padding: 8px 5px;min-height: 35px;}
  }
}
.Technology{
  p{
    span{width: 100px;display: inline-block;margin-top:0!important;}
    span+span{width: 230px}
  }
}
//供应商审核
.AuditStatus{background: #f5f5f5;text-align:center;color: #208bfb;}
.public-border{border:1px solid #ddd;}
.public-border-left{margin-left: -1px;}
.ToExamine{
    width: 100%;
    max-height: 600px;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: scroll;
    .ToExamine-state{color: #000;font-size: 14px;font-weight: bold;margin-bottom: 15px;}
    img{width: 180px;height:90px;}
    .ToExamine-content-inle{
        span{display: inline-block;}
    }
}
.Business_picture{
  .row-content,p{padding:0}
  p{padding-bottom:10px;}
}
.Perfect_information{
    margin-bottom: 15px;
  h3{
    font-size: 14px;
    font-weight: 600;
    padding-bottom: 6px;
  }
  span{
    width:180px;
    display: inline-block;
    font-size: 13px;
    margin-bottom:10px;
    padding: 5px;
  }

}
</style>
