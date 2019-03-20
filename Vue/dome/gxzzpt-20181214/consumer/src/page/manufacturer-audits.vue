<template>
	<div id="ManufacturerAudits">
      <div class="bread-crumb"><span class="pull-cursor" @click="$router.push({path:'/index'})">首页</span> > <span @click="$router.push({path:'/manufacturer-library'})"> 供应商库</span> > <span class="LastName">{{ruleForm.companyName}}</span></div>
      <div class="Manufacturer-nav pull-shadow">
          <div class="Manufacturer-nav-img">
         <img :src="ruleForm.logoUrl" alt="" >
          </div>
         <h1 class="Manufacturer-nav-title">{{ruleForm.companyName}}</h1>
         <el-button type="primary" :icon="toggleFavor==false?'el-icon-plus':'el-icon-check'" class="Manufacturer-nav-btn" :class="toggleFavor==false?'':'toggleFavor'" @click="Collection">
             <span v-if="toggleFavor===false">加入我的供应商</span>
             <span v-else>已加入我的供应商</span>
         </el-button>
      </div>
      <div class="Manufacturer-contant">
         <div  class="content-box">
            <el-tabs v-model="activeName" @tab-click="handleClick" >
                <el-tab-pane label="企业资料" name="first" v-loading="loading" element-loading-text="数据加载中">
                    <div class="tab-content" id="tab-content">
                     <div id="tab-2" class="pull-over">
                      <div  class="tab-box tab-first pull-left">
                         <span class="tab-nav">主要涉及工艺</span>
                         <div  class="tab-text">
                            <div class="tab-text-overflow">
                                <span v-for="(item,index) in ruleForm.techniqueInfo" :key="index">{{item.techniqueName}}</span>
                            </div>
                         </div>
                      </div>
                       <div class="tab-box tab-introduce pull-left tab-1">
                         <span class="tab-nav pull-center">公司介绍</span>
                         <div id="BtnToggle-txt" class="tab-text">
                             <div id="toggleBox">
                             <span id="toggleText">{{ruleForm.extendInfo.introduceInfo}}</span>
                             </div>
                             <div class="Img-W">
                                 <img src="../../static/img/0201xiala.png" alt="" id="BtnToggle" class="BtnToggle BtnToggleTop active">
                             </div>
                         </div>
                      </div>
                     </div>
                      <div id="tab-3" class="tab-box tab-box-top tab-evaluate tab-enterpriseImg tab-1">
                         <span class="tab-nav pull-center pull-padd-left">交易评价 <i class="pull-right" @click="MoreEvaluate">更多</i></span>
                         <div class="tab-text">
                             <!-- <span class="Noevaluate pull-block">暂无评价</span> -->
                            <div class="tab-evaluate-Info pull-left">
                                <fieldset>
                                    <legend class="pull-left">交付时间：</legend>
                                        <el-rate v-model="ruleForm.deliveryTimeScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="pull-left">产品质量：</legend>
                                        <el-rate v-model="ruleForm.productQualityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="pull-left">产品价格：</legend>
                                        <el-rate v-model="ruleForm.productPriceScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="pull-left">服务质量：</legend>
                                        <el-rate v-model="ruleForm.serviceQualityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="pull-left">技术能力：</legend>
                                        <el-rate v-model="ruleForm.technologyAbilityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                </fieldset>
                             </div>
                             <div class="tab-evaluate-box">
                                 <div class="rate-cont pull-over" v-for="(item,index) in EvaluateData.slice(0,5)" :key="index">
                                     <span class="rate-cont-text pull-block pull-left">{{item.content}}</span>
                                     <span class="rate-cont-date pull-right">{{item.EvaluateTime}}</span>
                                 </div>
                             </div>
                         </div>
                      </div>
                      <div id="tab-4" class="tab-box tab-box-top tab-enterpriseImg tab-1">
                         <span class="tab-nav pull-center pull-padd-left">企业图片<i class="pull-right" @click="MoreImg">更多</i></span>
                         <div class="tab-text">
                            <img class="pull-left" v-for="(item,index) in ruleForm.pictureInfo.slice(0,4)" :key="index"  :src="item.pictureUrl" alt="">
                         </div>
                      </div>
                       <div id="tab-5" class="tab-box tab-box-top tab-AuditReport tab-1">
                         <span class="tab-nav pull-center">审核报告</span>
                         <div class="tab-text">
                             <span v-if="ruleForm.manufacturerAuditReport!=''">{{ruleForm.manufacturerAuditReport}}</span>
                              <span v-else class="Noevaluate pull-block">暂无报告</span>
                         </div>
                      </div>
                      <div id="tab-6" class="tab-box tab-box-top tab-CompanyInfo tab-1">
                         <span class="tab-nav pull-center">公司信息</span>
                         <div class="tab-text">
                            <div class="CompanyInfo-txt pull-left">
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">国家/地区：</el-col>
                                        <el-col :span="14">{{ruleForm.countryStr}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">省份：</el-col>
                                        <el-col :span="14">{{ruleForm.province}}{{ruleForm.city}}{{ruleForm.region}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">地区：</el-col>
                                        <el-col :span="14" class="active"><div>{{ruleForm.address}}</div></el-col>
                                    </el-row>
                                </span>
                               <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">成立年份：</el-col>
                                        <el-col :span="14">{{ruleForm.foundingTime}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">雇员数量：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.employeeScaleStr}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">科研人员数量：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.engineerScaleStr}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">设计人员数量：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.designerScaleStr}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">质检人员数量：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.qualityInspectorScaleStr}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">工厂面积：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.factoryAcreageStr}}</el-col>
                                    </el-row>
                                </span>
                            </div>
                            <div class="CompanyInfo-txt pull-left">
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">进出口权:</el-col>
                                        <el-col :span="14">
                                            <div v-if="ruleForm.extendInfo !=''&&ruleForm.extendInfo.ioRight !=undefined">
                                              <span v-if="ruleForm.extendInfo.ioRight==true">是</span><span v-else>否</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">年产值：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.yearlyOutputStr}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">最大年产能：</el-col>
                                        <el-col :span="14"><span v-if="ruleForm.extendInfo.maxYearlyOutput!=undefined">{{ruleForm.extendInfo.maxYearlyOutput}}万元</span> </el-col>
                                    </el-row>
                                </span>
                               <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">总资产：</el-col>
                                        <el-col :span="14"><span v-if="ruleForm.extendInfo.totalAssets!=undefined">{{ruleForm.extendInfo.totalAssets}}万元</span> </el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">ODM能力：</el-col>
                                        <el-col :span="14">
                                            <div v-if="ruleForm.extendInfo !=''&&ruleForm.extendInfo.odmAbility !=undefined">
                                               <span v-if="ruleForm.extendInfo.odmAbility==false">否</span><span v-else>是</span>     
                                            </div>
                                            </el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">公司性质：</el-col>
                                        <el-col :span="14">{{ruleForm.companyPropertyStr}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">信息化系统：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.informationSystem}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">出口比例：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.exportRateStr}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">网站：</el-col>
                                        <el-col :span="14">{{ruleForm.extendInfo.websiteUrl}}</el-col>
                                    </el-row>
                                </span>
                            </div>
                         </div>
                      </div>
                       <div id="tab-7" class="tab-box tab-box-top tab-Authentication tab-1">
                         <span class="tab-nav pull-center">资格认证</span>
                         <span v-if="ruleForm.qualificationInfo==''" class="Noevaluate pull-block">暂无数据</span>
                         <div v-else class="tab-text">
                             <p class="Authentication-title">
                            <el-row>
                            <el-col :span="8">名称</el-col>
                            <el-col :span="8">有效期</el-col>
                            <el-col :span="8"> 附件</el-col>
                            </el-row>
                             </p>
                            <p class="Authentication-content" v-for="(item,index) in ruleForm.qualificationInfo" :key="index">
                            <el-row>
                            <el-col :span="8">{{item.qualificationName}}</el-col>
                            <el-col :span="8">{{item.qualificationIndate}}</el-col>
                            <el-col :span="8"><span v-if="item.file !=undefined" @click="downloadClick(item)" class="pull-cursor" >查看</span></el-col>
                            </el-row>
                             </p>
                         </div>
                      </div>
                      <div id="tab-8"  class="tab-box tab-box-top tab-CompanyInfo tab-industry tab-1">
                         <span class="tab-nav pull-center">行业与客户</span>
                         <div class="tab-text">
                            <div class="CompanyInfo-txt pull-left">
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">倾向订单类型：</el-col>
                                        <el-col :span="14">{{ruleForm.coopInfo.orderTypeStr}} </el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">主要出口市场：</el-col>
                                        <el-col :span="14">
                                            <span v-for="(item,index) in ruleForm.coopInfo.exportMarketStr" :key="index" class="pull-inline">{{item}}</span>
                                        </el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">第一优势行业：</el-col>
                                        <el-col :span="14">{{ruleForm.industryName}}</el-col>
                                    </el-row>
                                </span>
                               <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">第一主要客户：</el-col>
                                        <el-col :span="14">{{ruleForm.coopInfo.firstCustomer}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">第二主要客户：</el-col>
                                        <el-col :span="14">{{ruleForm.coopInfo.secondCustomer}}</el-col>
                                    </el-row>
                                </span>
                            </div>
                            <div class="CompanyInfo-txt pull-left">
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">第三主要客户：</el-col>
                                        <el-col :span="14">{{ruleForm.coopInfo.thirdCustomer}}</el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">代表性产品：</el-col>
                                        <el-col :span="14"><span v-for="(item,index) in ruleForm.coopInfo.mainWorks" :key="index" class="pull-inline">{{item}}</span></el-col>
                                    </el-row>
                                </span>
                               <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">合作过的企业：</el-col>
                                        <el-col :span="14"><span v-for="(item,index) in ruleForm.coopInfo.coopCompanys" :key="index" class="pull-inline">{{item}}</span></el-col>
                                    </el-row>
                                </span>
                                <span class="CompanyInfo-txt-nth">
                                    <el-row>
                                        <el-col :span="10" class="pad-l">行业类型：</el-col>
                                        <el-col :span="14" class="padW"><span v-for="(item,index) in ruleForm.coopInfo.industryInfo" :key="index" class="pull-inline">{{item.industryName}}</span></el-col>
                                    </el-row>
                                </span>
                            </div>
                         </div>
                      </div>
                      <div id="tab-9" class="tab-box tab-box-top tab-Authentication tab-1">
                         <span class="tab-nav pull-center">关键设备清单</span>
                         <span v-if="ruleForm.equipmentInfo==''" class="Noevaluate pull-block">暂无数据</span>
                         <div v-else class="tab-text">
                             <p class="Authentication-title">
                            <el-row>
                            <el-col :span="4">设备名称</el-col>
                            <el-col :span="4">型号</el-col>
                            <el-col :span="3">台数</el-col>
                            <el-col :span="5">参数</el-col>
                            <el-col :span="4">设备类型</el-col>
                            <el-col :span="4">品牌</el-col>
                            </el-row>
                             </p>
                             <p class="Authentication-content" v-for="(item,index) in ruleForm.equipmentInfo" :key="index">
                            <el-row>
                            <el-col :span="4">
                                <div class="itemDark">
                                    {{item.equipmentName}}
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="itemDark">
                                    {{item.equipmentModel}}
                                </div>
                            </el-col>
                            <el-col :span="3">
                                <div class="itemDark">
                                    {{item.total}}
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="itemDark">
                                <el-tooltip class="item" effect="dark" v-if="item.equipmentParam!=undefined" :content="item.equipmentParam" placement="top">
                                <span class="pull-ellips">{{item.equipmentParam}}</span>
                                </el-tooltip>
                                </div>
                            </el-col> 
                            <el-col :span="4">
                                <div class="itemDark">
                                    {{item.equipmentTypeStr}}
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="itemDark">
                                    {{item.brand}}
                                </div>
                            </el-col>
                            </el-row>
                             </p>
                         </div>
                      </div>
                    </div>
                    <div id="contant-Stairs" class="contant-Stairs pull-left">
                        <span class="contant-Stairs-nav pull-center pull-block">信息导航</span>
                        <div class="contant-Stairs-txt">
                            <span class="Tablename" :class="first.scrollName=='tab-2'?'active':''" @click="btnscroll('tab-2')">公司介绍</span>
                            <span class="Tablename" :class="first.scrollName=='tab-3'?'active':''" @click="btnscroll('tab-3')">交易评价</span>
                            <span class="Tablename" :class="first.scrollName=='tab-4'?'active':''" @click="btnscroll('tab-4')">企业图片</span>
                            <span class="Tablename" :class="first.scrollName=='tab-5'?'active':''" @click="btnscroll('tab-5')">审核报告</span>
                            <span class="Tablename" :class="first.scrollName=='tab-6'?'active':''" @click="btnscroll('tab-6')">公司信息</span>
                            <span class="Tablename" :class="first.scrollName=='tab-7'?'active':''" @click="btnscroll('tab-7')">资格认证</span>
                            <span class="Tablename" :class="first.scrollName=='tab-8'?'active':''" @click="btnscroll('tab-8')">行业与客户</span>
                            <span class="Tablename" :class="first.scrollName=='tab-9'?'active':''" @click="btnscroll('tab-9')">关键设备清单</span>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="产品案例" name="second" v-loading="loadingSecond" element-loading-text="数据加载中">
                    <div class="tab-content ProductCase">
                       <div class="No-data" v-if="ProductCaseData==''||ProductCaseData==undefined">
                                <img src="../../static/img/no-data.png" alt=""> 暂无数据
                       </div>
                        <div class="tab-content-imgList">
                            <ul>
                              <div class="imgList-top">
                                <li class="pull-left pull-cursor"  v-for="(item,index) in ProductCaseData" :key="index" :class="(index + 1) % 5==0?'no-margin-left':''"  @click="resolveTag(item.id)">
                                    <div class="imgList">
                                        <img v-if="item.pictureUrls!=undefined" :src="item.pictureUrls[0]" alt="">
                                        <img v-else src="../../static/img/defaultLogo.png" alt="">
                                        </div>
                                    <div class="imgtext">
                                        <h2>{{item.productName}}</h2>
                                        <span class="pull-block">工艺：<span v-if="item.techniqueInfo!=undefined">{{item.techniqueInfo.techniqueName}}</span></span>
                                        <span class="pull-block">材料：{{item.material}}</span>
                                    </div>
                                </li>
                              </div>
                            </ul>
                        </div>
                    </div>
                     <div class="pagination">
                        <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="page.currentPageIndex"
                        :page-size="page.size"
                        layout="total, prev, pager, next"
                        :total="page.total">
                    </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="企业图片" name="third" v-loading="loadingThird"  element-loading-text="数据加载中">
                    <div class="tab-content">
                        <div class="No-data" v-if="ruleForm.pictureInfo==''||ruleForm.pictureInfo==undefined">
                            <img src="../../static/img/no-data.png" alt=""> 暂无数据
                       </div>
                       <div v-else class="Business-picture pull-shadow">
                        <div class="contant-big">
                            <div class="small">
                                <ul id="simages" style="left:0;">
                                    <li v-for="(item,index) in ruleForm.pictureInfo" :key="index">
                                    <img  :src="item.pictureUrl" width="100%" alt="" class=''>                                        
                                    </li>
                                </ul>
                            </div>
                            <div id="big">
                                <img id="sImg" :src="this.pictureUrl" width="100%" alt="">
                            </div>
                            <span class="btnMove btnLeft acitve"><img  src="../../static/img/arrow_left.png" alt=""></span>
                            <span class="btnMove btnRight acitve"><img  src="../../static/img/arrow_right.png" alt=""></span>
                        </div>
                       </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="评价" name="rate" v-loading="loadingRate" element-loading-text="数据加载中">
                    <div class="tab-content">
                        <div class="No-data" v-if="EvaluateData ==''">
                            <img src="../../static/img/no-data.png" alt=""> 暂无数据
                        </div>
                        <div v-else class="rate-grid">
                            <div class="rate-master pull-shadow" v-for="(item,index) in EvaluateData" :key="index">
                                <div class="rate-premiere pull-over">
                                    <div class="rate-mark pull-left">
                                        <fieldset>
                                           <legend class="pull-left">交付时间：</legend>
                                           <el-rate v-model="item.deliveryTimeScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                        </fieldset>
                                        <fieldset>
                                           <legend class="pull-left">产品质量：</legend>
                                           <el-rate v-model="item.productQualityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                        </fieldset>
                                        <fieldset>
                                           <legend class="pull-left">产品价格：</legend>
                                           <el-rate v-model="item.productPriceScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                        </fieldset>
                                        <fieldset>
                                           <legend class="pull-left">服务质量：</legend>
                                           <el-rate v-model="item.serviceQualityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                        </fieldset>
                                        <fieldset>
                                           <legend class="pull-left">技术能力：</legend>
                                           <el-rate v-model="item.technologyAbilityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                                        </fieldset>
                                    </div>
                                    <div class="rate-content">
                                        <div class="rate-fulltxt">
                                            {{item.content}}
                                        </div>
                                        <div class="rate-photos">
                                            <img src="https://img.alicdn.com/bao/uploaded/i3/TB2tvtPiYZnBKNjSZFGXXbt3FXa_!!0-rate.jpg_400x400.jpg" alt="">
                                            <img src="https://img.alicdn.com/bao/uploaded/i3/TB2tvtPiYZnBKNjSZFGXXbt3FXa_!!0-rate.jpg_400x400.jpg" alt="">
                                            <img src="https://img.alicdn.com/bao/uploaded/i3/TB2tvtPiYZnBKNjSZFGXXbt3FXa_!!0-rate.jpg_400x400.jpg" alt="">
                                            <img src="https://img.alicdn.com/bao/uploaded/i3/TB2tvtPiYZnBKNjSZFGXXbt3FXa_!!0-rate.jpg_400x400.jpg" alt="">
                                            <img src="https://img.alicdn.com/bao/uploaded/i3/TB2tvtPiYZnBKNjSZFGXXbt3FXa_!!0-rate.jpg_400x400.jpg" alt="">
                                        </div>
                                        <div class="rate-date">{{item.EvaluateTime}}</div>
                                    </div>
                                    <div class="rate-author pull-over">
                                    <div class="rate-user">
                                        <img :src="item.logoUrl" alt="">
                                        <span v-if="item.commentCompanyName !=''">{{item.commentCompanyName}}</span>
                                        <span v-else>匿名用户</span>
                                    </div>
                                   </div>
                                </div>
                            </div>
                        </div>
                        <div class="pagination">
                            <el-pagination
                            background
                            @size-change="RateSizeChange"
                            @current-change="RateCurrentChange"
                            :current-page.sync="RatePage.currentPageIndex"
                            :page-size="RatePage.size"
                            layout="total, prev, pager, next"
                            :total="RatePage.total">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs> 
         </div>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loading:false,
      loadingSecond:false,
      loadingThird:true,
      loadingRate:false,
      introduceIndex:'',
      activeName: 'first',//first
      supplierId:'',
      pictureUrl:'',
      first:{
        scrollName:'',
      },
      TableName:'',
      ruleForm:{
        companyName:'',
        logoUrl:'',
        techniqueInfo:[],
        extendInfo:'',  
        countryStr:'',
        province:'',
        city:'',
        region:'',
        address:'',
        foundingTime:'',
        manufacturerAuditReport:'',
        industryName:'',
        companyPropertyStr:'',
        qualificationInfo:[],
        coopInfo:[],
        pictureInfo:[],
        commentScore:'',
      },
      toggleFavor:false, //收藏状态
      NoData:true,
      supplier:[],

      page:{ // 产品案例--分页
        currentPageIndex:1, // 当前页
        size:10, // 每页大小
        total:0, // 总页数
      },

      RatePage:{ //评价--分页
        currentPageIndex:1, // 当前页
        size:10, // 每页大小
        total:0, // 总页数
      },

      EvaluateData:[], //评价
      ProductCaseData:[],
    }
  },
  created(){
  },

  methods:{
    handleClick(tab, event) {},
    TablenameLis(){
        var Tablename = document.getElementsByClassName('Tablename');
        for(let i=0;i<Tablename.length;i++){
            Tablename[i].className='Tablename'
        }
    },
    btnscroll(val){
        let _this=this;
        this.TablenameLis();
        this.first.scrollName=val;
        var _id = document.getElementById(val);
    　　window.scrollTo(0,_id.offsetTop+230);
    },

  /*初始化数据*/
    Initialization(){
      let _this=this;
      let params={
         companyId:parseInt(this.$route.query.companyId),
      }
      let url="/custom/company/getCompanyDetail"
       this.loading=true;
       this.$http.post(url,params).then(res=>{
        let data=res.data.data;
        if(JSON.stringify(data) == "{}"){
           data=[];
        }
        if(this.$route.query.position !=undefined){
            this.activeName='second'
        }
        if(this.$route.query.rateState !=undefined){
            this.activeName='rate'
        }
        //获取收藏状态
        let user = localStorage.getItem('gxzzpt2_consumer');
        if(user!=''&&user !=undefined){
        var jsonObj = JSON.parse(user);
        this.supplier=jsonObj.supplier;
            for(let item in jsonObj.supplier){
                if(jsonObj.supplier[item]==data.id){
                    this.toggleFavor=true;
                }
            }
        }
        _this.supplierId=data.id;
        let BtnToggle=document.getElementById("BtnToggle");
        _this.introduceIndex=data.extendInfo.introduceInfo !=undefined?data.extendInfo.introduceInfo.length:0;
        if(_this.introduceIndex>285){
            BtnToggle.className = "BtnToggle BtnToggleTop";
        }
        _this.ruleForm={
          companyName:data.companyName,
          logoUrl:data.logoUrl,
          techniqueInfo:data.techniqueInfo,
          extendInfo:data.extendInfo,
          countryStr:data.countryStr,
          province:data.province,
          city:data.city,
          region:data.region,
          address:data.address,
          industryName:data.coopInfo.firstIndustry.industryName,
          foundingTime:data.extendInfo.foundingTime,
          manufacturerAuditReport:data.manufacturerAuditReport,
          companyPropertyStr:data.companyPropertyStr,
          qualificationInfo:data.qualificationInfo,
          coopInfo:data.coopInfo,
          equipmentInfo:data.equipmentInfo,
          pictureInfo:data.pictureInfo,
          deliveryTimeScore:data.commentScore !=undefined?data.commentScore.deliveryTimeScore:0,
          productQualityScore:data.commentScore !=undefined?data.commentScore.productQualityScore:0,
          productPriceScore:data.commentScore !=undefined?data.commentScore.productPriceScore:0,
          serviceQualityScore:data.commentScore !=undefined?data.commentScore.serviceQualityScore:0,
          technologyAbilityScore:data.commentScore !=undefined?data.commentScore.technologyAbilityScore:0,
        }
        this.pictureUrl=data.pictureInfo.length>=1?data.pictureInfo[0].pictureUrl:[];
        _this.loading=false;
      })
        setTimeout(() => {
            this.scroll(1);
            this.toggleText();
            this.BusinessImg();
        }, 900);
    },

    /*企业资料-信息导航*/
    scroll(vals){
    var contantStairs = document.getElementById('contant-Stairs');
    var Tablename = document.getElementsByClassName('Tablename');
    function TablenameLis(){
        for(let i=0;i<Tablename.length;i++){
            Tablename[i].className='Tablename'
        }
    }
    
    window.onscroll=function(){
        let scrolltop=document.documentElement.scrollTop||document.body.scrollTop;
        let tabID=scrolltop
        if(scrolltop >=255){
            contantStairs.style.position="fixed";
            contantStairs.style.top="115px";
        }else{
            contantStairs.style.position="absolute";
            contantStairs.style.top="0px";
        }

        if(Tablename[0] !=undefined){
            if(tabID>230&&tabID<588){
                TablenameLis()
                Tablename[0].className='Tablename active'
            }else if(tabID>588&&tabID<836){
                TablenameLis()
                Tablename[1].className='Tablename active'
            }else if(tabID>836&&tabID<1156){
                TablenameLis()
                Tablename[2].className='Tablename active'
            }else if(tabID>1156&&tabID<1415){
                TablenameLis()
                Tablename[3].className='Tablename active'
            }else if(tabID>1415&&tabID<1885){
                TablenameLis()
                Tablename[4].className='Tablename active'
            }else if(tabID>1885&&tabID<2167){
                TablenameLis()
                Tablename[5].className='Tablename active'
            }else if(tabID>2167&&tabID<2477){
                TablenameLis()
            Tablename[6].className='Tablename active'
            }else if(tabID>2477){
                TablenameLis()
                Tablename[7].className='Tablename active'
            }
        }
    }
    },
    /*企业图片*/
    BusinessImg(){
    this.loadingThird=false;
    if(this.ruleForm.pictureInfo !=''&&this.ruleForm.pictureInfo !=undefined){
    var big = document.getElementById('big');
    var sImg = document.getElementById('sImg');
    var simages = document.getElementById('simages');
    var btnMove = document.getElementsByClassName('btnMove');
    var lis = simages.children;
    var index = 1;
    var len = lis.length;
    
    /*初始化*/
    lis[0].className = 'active-border';
    for (var i = 0; i < lis.length; i++) {
        lis[i].onclick = function() {
            borderLen();
            this.className = 'active-border';
            var src = this.firstElementChild.getAttribute('src');
            sImg.src = src;
        }
    }

    function borderLen(){
    for (var i = 0; i < lis.length; i++) { 
        if (lis[i].className == 'active-border') {
            lis[i].className = '';
        }
        }
    }

    if(len >5){
        btnMove[1].addEventListener("click",fn2);
        btnMove[1].className = 'btnMove btnRight'
    }
    function animate(offset) {
        simages.style.left = parseInt(simages.style.left) + offset + 'px';
        var sd = lis[len - 1].offsetLeft - Math.abs(parseInt(simages.style.left))
        if (sd == 580) {
            btnMove[1].removeEventListener("click",fn2);
            btnMove[1].className = 'btnMove btnRight acitve'
        } else {
            btnMove[1].addEventListener("click",fn2);
            btnMove[1].className = 'btnMove btnRight'
        }
        var lefts = parseInt(simages.style.left);
        if (lefts == 0) {
            btnMove[0].removeEventListener("click",fn1);
            btnMove[0].className = 'btnMove btnLeft acitve'
        } else {
            btnMove[0].addEventListener("click",fn1);
            btnMove[0].className = 'btnMove btnLeft'
        }
     }
        function fn1(){
            animate(145);
        }
        function fn2(){
            animate(-145);
        }
     }
    },

    /*公司介绍详情*/
    toggleText(){
        let textLeng=document.getElementById("toggleText");
        let text=textLeng.innerHTML;
        var BtnToggleText=document.getElementById("BtnToggle-txt");
        var BtnToggle=document.getElementById("BtnToggle");
        BtnToggle.onclick = function(){ 
        if (BtnToggle.className == "BtnToggle BtnToggleTop"){ 
            BtnToggle.className = "BtnToggle BtnToggleBottom"; 
            BtnToggleText.className="tab-text HeightOut"
        }else{ 
            BtnToggle.className = "BtnToggle BtnToggleTop";
            BtnToggleText.className="tab-text HeightMin"
        } 
        } 
    },
    
    /*点击收藏*/
    Collection(){
      let _this=this;
      let url="/custom/company/collectManufacturer";
      let params={
        supplierId:parseInt(_this.supplierId),
      }
      if(_this.toggleFavor !=true){
      _this.$http.post(url,params).then(res=>{
          if(res.data.code==200){
            _this.toggleFavor=true;
             this.supplier.push(_this.supplierId)
            let user = localStorage.getItem('gxzzpt2_consumer');
             if(user!=''&&user !=undefined){
                var jsonObj = JSON.parse(user);
                jsonObj.supplier=this.supplier;  
              let students = JSON.stringify(jsonObj);
              localStorage.setItem("gxzzpt2_consumer",students);
                this.$message({message: '收藏成功', type: 'success',duration:1000}); 
             }
          }else{
            this.$message.error('收藏失败');
          }
      })
      }
    },

    /*企业图片*/
    MoreImg(){
      this.activeName='third'; 
    },

    /*查看更多评价*/
    MoreEvaluate(){
      this.activeName='rate';  
    },

    /*产品案例*/
    ImgDisplaying(){
      let _this=this;
      let params={
        pageIndex: this.page.currentPageIndex,
        pageSize:this.page.size,
        companyId:parseInt(this.$route.query.companyId),
      }
      let url="/custom/productCase/getListByCompanyId";
         this.loadingSecond=true;
         this.$http.post(url,params).then(res=>{
        if(res.data.code==200){
        let data=res.data.data;
        let pageTotal=res.data.pagination.recordCount;
        if(data.constructor !=Array||data==undefined){
           data=[];
           pageTotal=0;
           this.NoData=false;
        }else{
         this.NoData=true;
        }
         this.page.total=pageTotal;
         this.ProductCaseData=data !=undefined?data:[];
         this.loadingSecond=false;
        }else{
         this.loadingSecond=false;
         this.page.total=0;
         this.ProductCaseData=[];
        } 
      })
    },

    /*产品案例跳转*/
    resolveTag(val){
        let routeData = this.$router.resolve({path: '/product-detail', query: {productId: val}});
        window.open(routeData.href, '_blank');
    },

    /*评价*/
    Evaluate(){
    let url='/custom/CompanyComment/getCommentList';
    let EvaluateTime='';
    let params={
        pageIndex: this.RatePage.currentPageIndex,
        pageSize:this.RatePage.size,
        companyId:parseInt(this.$route.query.companyId),
    }
    this.loadingRate=true;
    this.$http.post(url,params).then(res=>{
        if(res.data.code==200){
        let data=res.data.data;
        let pageTotal=res.data.pagination.recordCount;
        if(data!=undefined){
          if(data.constructor !=Array){
           data=[];
           pageTotal=0;
         } 
         if(data.length>=1){
          for(let item in data){
            data[item].EvaluateTime=data[item].createTime.split(" ")[0]
          }
        }
          this.RatePage.total=pageTotal;
          this.EvaluateData=data;
          this.loadingRate=false; 
         }
        }else{  
        this.RatePage.total=0;
        this.EvaluateData=[];    
        this.loadingRate=false;    
        }
    })
    },

    /*处理分页事件*/
    handleSizeChange(val) {
      this.page.size = val;
      this.ImgDisplaying();
    },
    handleCurrentChange(val) {
      this.page.currentPageIndex = val;
      this.ImgDisplaying();
    },
    RateSizeChange(val){
      this.RatePage.size=val;
      this.Evaluate();
    },
    RateCurrentChange(val){
      this.RatePage.currentPageIndex=val;
      this.Evaluate();  
    },
    /*附件下载*/
    downloadClick(row){
        window.open(row.file.fileUrl);
    },
  },
  mounted(){
    this.Initialization();
    this.ImgDisplaying();
    this.Evaluate();
  },
}
</script>
<style lang="less" >
    .No-data{
    text-align: center;
    height: 100px;
    line-height: 100px;
    font-size: 15px;
    img{
        width: 25px;
        height: 25px;
        vertical-align: middle;
        margin-right: 4px;
    }
  }
    #ManufacturerAudits{
    .Manufacturer-nav{
     .el-button--primary{
        background-color:rgba(63, 141, 239, 0.1) !important;  
     }
     .el-button{
        padding: 8px 0px !important;
        i,span{color: #3f8def;}
     }
     }
      .Manufacturer-contant{
          .el-tabs__content{
            overflow: initial;
          }
         .content-box{
             #tab-first,#tab-second,#tab-third{
                width: 100px;
                height: 35px;
                line-height: 34px;
                text-align: center;
                padding: 0;
             }
             #tab-first,#tab-second,#tab-third,#tab-rate{color: #777777;}
             .is-active{
               background-color: #3f8def;
               color: #fff!important;
             }
             .el-tabs__nav-wrap{
                &::after{
                    background-color: #3f8def;;
                }
             }
             .el-tabs__item.is-top:last-child{
                padding-right: 18px!important;  
             }
         }
         .tab-box{
             .tab-nav{
               width: 100%;
               display:block;
               font-size: 14px;
               font-weight: 600;
               letter-spacing: 0px;
               color: #3f8def;
               background-color: #fff; 
               padding: 15px;
               box-sizing: border-box;
             }
             .tab-text{
              min-height: 158px;
              margin-top: -1px;
             }
             #BtnToggle-txt{
              height: 154px;
              overflow: hidden;
              #toggleText{
                font-size: 12px;
                line-height: 22px;
              }
              .active{display:none;}
             }
             .HeightOut{
               height: auto!important;  
             }
             .HeightMin{
              height: 154px!important;  
             }
           }
        }  
    }
    #footer{
      position: relative;
      z-index: 2;   
    }

    .el-rate__icon{font-size: 13px;}
    
</style>
<style lang="less" scoped>
    @bg-color: #3f8def;
    @size-color: #3f8def;
    .pull-left{float: left;}
    .pull-right{float:right;}
    .pull-center{text-align: center;}
    .pull-block{display:block;}
    .pull-over{overflow: hidden;}
    .pull-cursor{cursor: pointer;color: #3f8def;}
    .pull-inline{display: inline-block!important;}
    .pull-shadow{
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    }
    .pull-ellips{
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .pull-inline+.pull-inline{
        &::before{
            content:",";
            width: 5px;
            display: inline-block;
            padding-left: 2px;
        }
    }
    .pull-padd-left{padding-left: 50px!important;}
    #ManufacturerAudits{
        width: 1200px;
        margin: auto;
        box-sizing: border-box;
        font-size: 12px;
        .bread-crumb{
        margin-top: 13px;
        span{cursor: pointer;color:#777;}
        .LastName{color: #3f8def;cursor: initial;}
    }    
       .Manufacturer-nav{
            background: #fff;
            height: 135px;
            margin: 9px 0 25px 0;
            padding: 20px 24px;
            box-sizing: border-box;
            overflow: hidden;
         .Manufacturer-nav-img{
            width: 95px;
            height: 95px;
            line-height: 92px;
            border: 1px solid #e2e2e2;
            float: left;
            margin-right: 15px;
             img{
            width: 100%;
            min-height: 45px;
            max-height: 92px;
            vertical-align: middle;
            padding: 1px;
            display:  inline-block;;
            box-sizing: border-box;
             }
         }
         .Manufacturer-nav-title{
            display: block;
            padding: 5px 0 20px 0;
            font-family: MicrosoftYaHei;
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            color: #797979;
         }
         .Manufacturer-nav-btn{
            width: 120px;
            height: 30px;
            background-color: rgba(63, 141, 239, 0.1);
            border: solid 1px #3f8def;
            color: #3f8def;
            font-size: 12px;
            border-radius: 0;
         }
         .toggleFavor{
            background-color: rgba(75, 75, 75, 0.1)!important;
            border-color: #ededed!important;
         }
      }
      .Manufacturer-contant{
         .tab-content{
            margin-top: 10px;
            box-sizing: border-box;
            position: relative;
            padding-bottom: 50px;
            #tab-2{
              width: 1035px;
                margin-left: -10px;
                padding:0 10px 5px 10px;
                box-sizing: border-box;  
            }
            .tab-box{
                background: #ffffff;
                box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                }
            .Noevaluate{
                font-family: MicrosoftYaHei;
                font-size: 12px!important;
                font-weight: normal;
                font-stretch: normal;
                text-align: center;
                line-height: 100px!important;
                color: #a09f9f!important;
            }
            .tab-first{
              width:370px;
              height:206px;
              .tab-nav{
                  width:370px;
                  padding: 15px;
              }
              .tab-text{
                  width: 370px;
                  padding: 3px 15px 15px 15px;
                  box-sizing: border-box;
                  overflow: hidden;
                  .tab-text-overflow{
                    max-height: 143px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    width: 367px;
                  }
                  span{display:inline-block;color: #777777;font-family: MicrosoftYaHei;font-size: 12px;margin-bottom: 5px;margin-right: 12px;}
              }
            }
            .tab-introduce{
                width:632px;
                margin-left: 8px;
                .tab-text{
                width: 632px;
                padding: 0 54px 30px 32px;
                box-sizing: border-box;
                position: relative;
                span{
                    font-family: MicrosoftYaHei;
                    font-size: 14px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 38px;
                    letter-spacing: 0px;
                    color: #777;
                }
                .Img-W{
                    position: absolute;
                    right: 0;
                    bottom: -1px;
                    width: 100%;
                    height: 27px;
                    line-height: 27px;
                    text-align: right;
                    background: #fff;
                    border-bottom: 1px solid #e7e7e7;
                    img{
                    width: 13px;
                    height: 11px;
                    cursor: pointer;
                    margin-right: 16px;
                    }
                }
            #BtnToggle{
             transition:all .2s;
            -moz-transition:all .2s; /* Firefox 4 */
            -webkit-transition:all .2s; /* Safari and Chrome */
            -o-transition:all .2s; /* Opera */
         }
         .BtnToggleBottom{
            transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            -o-transform: rotate(180deg); 
         }
         .BtnToggleTop{
            transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);   
         }
                }
            }
            .tab-box-top{
                margin-top:10px;
            }
            .tab-evaluate,.tab-enterpriseImg, .tab-AuditReport,.tab-CompanyInfo,.tab-Authentication{ width:1011px;}
            .tab-evaluate{
                .tab-text{
                  min-height:150px!important;;
                  padding: 0 17px 17px 45px!important;;
                  box-sizing: border-box;
                }
                .tab-evaluate-Info{
                  fieldset{
                    width:200px;
                    margin: 0;
                    padding: 0;
                    border: none;
                }
                  fieldset+fieldset{margin-top:8px;}
                }
                .tab-evaluate-box{
                    margin-left: 195px;
                    border-left: 1px solid #eaeaea;;
                    min-height: 131px;
                    padding-left: 40px;
                    padding-right: 28px;
                    .rate-cont+.rate-cont{margin-top: 12px;}
                    .rate-cont{
                        .rate-cont-text{
                           width: 580px;
                           overflow: hidden;
                           -o-text-overflow:ellipsis;
                           text-overflow:ellipsis;
                           white-space: nowrap;
                           color: #777777;
                        }
                        .rate-cont-date{
                           color: #c1c1c1; 
                        }
                    } 
                }
            }
            .tab-enterpriseImg{
                .tab-nav{
                    // padding-left: 52px;
                    i{
                    font-style:normal;
                    font-weight: normal;
                    font-stretch: normal;
                    font-size: 12px;
                    color: #3f8def;
                    // padding-right: 16px;
                    cursor: pointer;
                    &::after{
                    content:'>';
                    width: 6px;
                    height: 10px;
                    color:#3f8def;
                    display:  inline-block;
                    padding-left: 3px;
                    }
                    }
                }                   
                .tab-text{
                    min-height:180px;
                    padding: 0 44px 25px 44px;
                    box-sizing: border-box;
                    overflow: hidden;
                    img{
                        width: 195px;
                        height: 155px;
                        background-color: #ffffff;
                        border: solid 1px #e2e2e2;
                    }
                    img+img{margin-left:47px;}
                }
            }
            .tab-AuditReport{
             .tab-text{
                min-height:145px;
                padding: 0 50px 40px 38px;
                box-sizing: border-box;
                span{
                font-size: 12px;
                line-height: 30px;
                letter-spacing: 0px;
                color: #333333;
                }
                p{
                    font-size: 12px;
                    text-align: right;
                    margin-top: 18px;
                    color: #909090;
                }
             }
            }
            .tab-CompanyInfo{
                .tab-text{
                    min-height: 310px;
                    padding:0 37px 25px 37px;
                    box-sizing: border-box;
                    overflow: hidden;
                    .CompanyInfo-txt{
                        width:462px;
                        .CompanyInfo-txt-nth{
                            display: block;
                            min-height: 30px;
                            line-height: 30px;
                            background-color:#f4f4f4;;
                            .pad-l{padding-left: 24px;}
                        }
                        .active{line-height:20px!important;padding: 12px 0px;}
                        .CompanyInfo-txt-nth:nth-child(even){
                            background-color:#fafafa;
                        }
                    }
                    .CompanyInfo-txt+.CompanyInfo-txt{margin-left:11px;}
                }
            }
            .tab-industry{
                .tab-text{
                    min-height: 205px;
                    padding:0 37px 25px 37px;
                    box-sizing: border-box;
                    overflow: hidden;
                }
            }
            .tab-Authentication{
                .tab-text{
                    min-height: 0;
                    padding:0 39px 25px 39px ;
                    box-sizing: border-box;
                    p{ text-align: center;}
                    .Authentication-title{
                        height: 40px;
                        line-height: 40px;
                        color: #858585;
                        background-color: #f3f3f3;
                    }
                    .Authentication-content{
                        height:45px;
                        line-height:45px;
                        color: #333333;
                        background-color: #f8f8f8;
                        a{color: #3f8def;}
                        .itemDark{min-height:45px;}
                    }
                } 
                .Noevaluate{
                    margin-top: -1px;
                }
            }
         }
         .contant-Stairs{
             width:170px;
             margin-left:18px;
             background-color: #ffffff;
             box-shadow: 0px 0px 13px 0px 
                rgba(0, 0, 0, 0.1);
            position: absolute;
            top:0px;
            left: 50%;
            margin-left: 430px;
            z-index:1;
            .contant-Stairs-nav{
                font-family: MicrosoftYaHei;
                font-size: 16px;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 1px;
                color: #3f8def;
                margin: 15px 0 20px 0;
                &::before,&::after{
                  content:'';
                  width: 15px;
                  height: 2px;
                  background-color: #3f8def;
                  display:  inline-block;
                  vertical-align: middle;
                }
                &::before{
                    margin-right: 4px;
                }
                &::after{
                    margin-left: 2px;
                }
            }
            .contant-Stairs-txt{
                font-family: MicrosoftYaHei;
                font-size: 14px;
                font-weight: normal;
                font-stretch: normal;
                padding: 0 12px 16px 12px;
                box-sizing: border-box;
                span{
                    width: 147px;
                    height: 42px;
                    line-height: 42px;
                    text-align: center;
                    background-color: #f3f3f3;
                    display:block;
                    cursor: pointer;
                        color: #777;
                        &:hover{
                        color:#fff;
                        background-color: #3f8def;
                       -webkit-transition: all 200ms;
                        -o-transition: all 200ms;
                        transition: all 200ms;
                    }
                }
                span+span{margin-top:14px;}
                .active{
                    color:#fff;
                    background-color: #3f8def;
                    -webkit-transition: all 200ms;
                    -o-transition: all 200ms;
                    transition: all 200ms;
                }
            }
         }

         //产品案例
         .ProductCase{
            width: 102%;
            height: 100%;
            overflow: hidden;
            margin-left: -10px;
            padding-left: 10px;
            margin-top: -1px;
            padding-top: 8px;
            .tab-content-imgList{
              ul{
                  width:100%;
                  height: 100%;
                  li{
                    width: 232px;
                    height: 266px;
                    background-color: #ffffff;
                    -moz-box-shadow:0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                    -webkit-box-shadow:0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                    margin-right:10px;
                    margin-bottom: 10px;
                    padding: 20px 15px;
                    box-sizing: border-box;
                     .imgList{
                        width: 155px;
                        height: 118px;
                        text-align: center;
                        line-height: 116px;
                        margin: auto;
                        img{
                            display: inline-block;
                            width: 100%;
                            vertical-align: middle;
                            max-height: 118px;
                            margin-top: -2px;
                        }
                     }
                     .imgtext{
                         width:100%;height:100px;
                         padding-top: 15px;
                         box-sizing: border-box;
                         h2{
                            font-size: 15px;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0px;
                            color: #777777;
                            padding-bottom:9px;
                         }
                         span{
                            font-family: MicrosoftYaHei;
                            font-size: 12px;
                            font-weight: normal;
                            letter-spacing: 0px;
                            color: #a09f9f;
                            line-height: 24px;
                         }
                        }
                  }
                  .no-margin-left{
                      margin-right:0;
                  }
                //   li+li{margin-left:19px;}
              }
            }
            .tab-btn{
                text-align: center;
                button{
                width: 530px;
                height: 45px;
                background-color: #3f8def!important;
                border-radius: 0;
                font-size: 18px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 0px;
                letter-spacing: 1px;
                color: #ffffff;
                margin-top: 20px;
                }
            }
         }
         //企业图片
         .Business-picture{
             width:1200px;
             height:745px;
             background-color: #ffffff;
             padding-top:30px;
             margin-bottom: 50px;
            //  padding: 43px 180px 71px 180px;
             box-sizing: border-box;
               .contant-big {
                  position: relative;
                  width: 720px;
                  margin: auto;
                   #big {
                        width: 720px;
                        height: 560px;
                        text-align: center;
                        line-height: 560px;
                        #sImg {
                        max-width: 718px;
                        max-height: 558px;
                        display: inline-block;
                        width: auto;
                        margin: auto;
                    }
                  }
                    .small {
                        overflow: hidden;
                        width:720px;
                        height: 110px;
                        margin-bottom:10px;
                        position: relative;
                        ul {
                            width: 4000px;
                            list-style: none;
                            position: absolute;
                            -webkit-transition: all 300ms;
                            -o-transition: all 300ms;
                            transition: all 300ms;
                            li {
                              width: 140px;
                              height: 110px;  
                              float: left;
                            //   border: solid 1px #ddd;
                              padding: 0;
                              img{
                                  cursor: pointer;width: 100%;height: 100%;box-sizing: border-box;
                                  &:link{
                                    border: 2px solid #3f8def;  
                                  }
                                  }
                            }
                            li+li{
                                margin-left: 5px;
                               }
                            .active-border{
                               img{border: solid 4px #3f8def;} 
                            } 
                         }
                     }
                        .btnMove {
                            width: 24px;
                            height: 28px;
                            cursor: pointer;
                            top: 6%;
                        }
                        .btnLeft {
                            position: absolute;
                            left:-50px;
                        }
                        .btnRight {
                            position: absolute;
                            right:-50px;
                        }
                        .acitve {
                            display: block;
                            opacity: 0.5;
                            -moz-opacity:0.5;
                            filter: alpha(opacity=50);
                        }
                }
         }
        .rate-grid{
            font-size: 14px;
            box-sizing: border-box;
          .rate-master{
             border: 1px solid #e2e2e2;
             padding: 20px 0; 
             background: #fbfbfb;
          }
          .rate-master+.rate-master{margin-top:10px;}
          .rate-author{
             span{font-weight: 600;}
          }
          .rate-premiere{
              position: relative;
            .rate-mark{
              width: 195px;
              box-sizing: border-box;
              margin-left: 30px;
              margin-top: 5px;
              legend{width:62px;}
              fieldset{
                margin: 0;
                padding: 0;
                border: 0;
              }
              fieldset+fieldset{
                margin-top:5px;
              }
            }
            .rate-content{
                margin-left: 229px;
                border-left: 1px dashed #d3d3d3;
                border-right: 1px dashed #d3d3d3;
                width: 820px;
                padding: 0 50px;
                min-height: 135px;
                box-sizing: border-box;
              .rate-fulltxt{
                padding:5px 0;
              }
              .rate-photos{
                display:none;
                img{width:100px;height:100px;}
              }
              .rate-date{
                font-size: 12px;
                color: #c1c1c1;
                margin-top: 17px;
              }
            }
            .rate-author{
               width:150px;
               height:100%;
               position: absolute;
               top:0;
               right:0;
               display: -ms-flexbox;
                display: flex;
                -ms-flex-pack: center;
                justify-content: center;
                -ms-flex-align: center;
                align-items: center;
            .rate-user{
                width:100px;
                text-align: center;
               img{
                width: 56px;
                height: 56px;
                border-radius: 50%;
                display: inline-block;
                background-color: #ffffff;
                border: solid 1px #e2e2e2;
                padding: 1px;
                box-sizing: border-box;
               }
               span{
                display: block;
                font-size: 12px;
                padding-top: 5px;
                font-weight: normal;
                color: #777777;
               }
            }
            }
          }
        }


      }
    }
    .padW{
    width: 255px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    }
</style>