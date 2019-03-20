<template>
  <div id="company_information_modify">
  <el-form :model="dynamicValidateForm" :rules="dynamicRules" ref="dynamicValidateForm"  class="demo-ruleForm">
  <div class="information-tabs-content information-first">
      <div class="information-tabs-left pull-left">
          <div class="tabs-content">
            <span class="tabs-title">公司介绍</span>
            <div class="tabs-text c-introduction">
                <div class="pull-overflow">
                <div class="modifyData pull-left">
                  <p class="c-introduction-name1 c-introduction-name">
                      <span class="cont-title pull-block">公司简称：</span>
                      <span class="pull-block">
                          <el-form-item >
                              <el-input v-model="dynamicValidateForm.shortName" :disabled="true"></el-input>
                          </el-form-item>
                      </span>
                  </p>
                  <p class="c-introduction-name2 c-introduction-name">
                      <span class="cont-title pull-block">公司法定名称（注册）：</span>
                      <span class=" pull-block">
                          <el-form-item >
                              <el-input v-model="dynamicValidateForm.companyName" :disabled="true"></el-input>
                               <el-checkbox class="el-checkbox-Name" v-model="dynamicValidateForm.showLegalName" :checked="dynamicValidateForm.showLegalName">法定名称是否显示</el-checkbox>
                          </el-form-item>
                      </span>
                  </p>
                </div>
                <div class="modifyImg pull-left">
                  <el-upload
                      class="avatar-uploader"
                      :class="dynamicValidateForm.logoUrl?'avatar':''"
                      action="http://dw.tatfookcloud.com/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessModify"
                      :before-upload="beforeAvatarUploadModify">
                      <img class="ImgW" v-if="dynamicValidateForm.logoUrl"  :src="dynamicValidateForm.logoUrl" >
                      <img class="el-icon-plus avatar-uploader-icon" src="../../static/img/modifyLogo.png" alt="">
                      </el-upload>
                  <span>建议:215*80，支持:png, gif, jpg</span>
                </div>
              </div>
              <div class="c-introduction-cont">
                  <span class="cont-title">公司介绍：</span>
                  <span class="cont-txt">
                      <el-form-item >
                          <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 4}" v-model="dynamicValidateForm.extendInfo.introduceInfo"></el-input>
                      </el-form-item>
                  </span>
              </div>
            </div>
          </div>
          <!-- <div  class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
              <span class="tabs-title">平台审核报告</span>
              <div class="tabs-text ToExamine">
                  <el-form-item >
                      <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 4}" v-model="dynamicValidateForm.manufacturerAuditReport" maxlength='500'></el-input>
                  </el-form-item>
              </div>
          </div> -->
           <div class="tabs-content pull-top">
            <span class="tabs-title">联系人信息</span>
            <div class="tabs-text tableData">
              <el-table :data="dynamicValidateForm.contactsInfo" style="width: 100%" class="table_distance">
              <el-table-column  label="姓名" align="center">
                  <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.contacts"></el-input>
                  </template>
              </el-table-column>
              <el-table-column   label="职位" align="center" >
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.jobTitle" ></el-input>
                  </template>
              </el-table-column>
              <el-table-column  label="手机号码" align="center">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.tel" ></el-input>
                  </template>
              </el-table-column>
              <el-table-column  label="电子邮箱"  align="center">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.email" ></el-input>
                  </template>
              </el-table-column>
              <el-table-column   label="操作" align="center" width="50">
                  <template slot-scope="scope">
                      <i class="el-icon-delete pull-cursor" @click="removeContactInfo(scope.row,scope.$index)"></i>
                  </template>
              </el-table-column>
              </el-table>
              <div class="projectAdd">
                  <el-button type="primary" @click="AddContactInfo">添加</el-button>
              </div>
            </div>
          </div>
          <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">关键设备清单</span>
            <div class="tabs-text tableData">
              <el-table :data="dynamicValidateForm.equipmentInfo" style="width: 100%" class="table_distance">
              <el-table-column  label="设备名称" align="center">
                  <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.equipmentName" @change="Detailedlist(scope.row,scope.$index)" :class="scope.row.state==true?'Detailedlist':''"></el-input>
                  </template>
              </el-table-column>
              <el-table-column   label="型号" align="center" >
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.equipmentModel" ></el-input>
                  </template>
              </el-table-column>
              <el-table-column  label="台数" align="center">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.total" ></el-input>
                  </template>
              </el-table-column>
              <el-table-column  label="参数"  align="center">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.equipmentParam" ></el-input>
                  </template>
              </el-table-column>
              <el-table-column   label="设备类型" align="center">
                  <template slot-scope="scope">
                        <el-select v-model="scope.row.equipmentType" placeholder="请选择">
                          <el-option
                          v-for="item in EquipmentTypeData"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </template>
              </el-table-column>
              <el-table-column  label="品牌"  align="center">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.brand" ></el-input>
              </template>
              </el-table-column>
              <el-table-column   label="操作" align="center" width="50">
                  <template slot-scope="scope">
                      <i class="el-icon-delete pull-cursor" @click="removeEquipmentInfo(scope.row,scope.$index)"></i>
                  </template>
              </el-table-column>
              </el-table>
              <div class="projectAdd">
                  <el-button type="primary" @click="AddEquipmentInfo">添加</el-button>
              </div>
            </div>
          </div>
          <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">资格认证</span>
            <div class="tabs-text tableData">
              <el-table :data="dynamicValidateForm.qualificationInfo"  style="width: 100%">
              <el-table-column  label="名称" align="center">
                  <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.qualificationName" @change="Qualifications(scope.row,scope.$index)" :class="scope.row.state==true?'Qualifications':''"></el-input>
                  </template>
              </el-table-column>
              <el-table-column  label="有效期" align="center" width="150">
                  <template slot-scope="scope">
                          <el-date-picker
                          v-model="scope.row.qualificationIndate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" style="width:140px;">
                          </el-date-picker>
                  </template>
              </el-table-column>
              <el-table-column  label="附件" align="center">
                  <template slot-scope="scope">
                      <div class="avatar-uploader-box">
                          <el-upload
                          class="avatar-uploader-img"
                          :action="uploadUrl"
                          :show-file-list="false"
                          :on-success="AuthentAvatarSuccess"
                          >
                          <span v-if="scope.row.fileName !=''">{{scope.row.fileName}}</span>
                          <span v-if="scope.row.fileName==''" @click="UploadIndex(scope.$index)">上传</span>
                          <span v-if="scope.row.fileName!=''" @click="UploadIndex(scope.$index)">修改</span>
                          </el-upload>
                      </div>
                  </template>
              </el-table-column>
              <el-table-column   label="操作" width="50" align="center">
                  <template slot-scope="scope">
                      <i class="el-icon-delete pull-cursor" @click="removeAuthenticationData(scope.row,scope.$index)"></i>
                  </template>
              </el-table-column>
              </el-table>
              <div class="projectAdd">
                  <el-button type="primary" @click="AddAuthenticationData">添加</el-button>
              </div>
            </div>
          </div>
          <div class="tabs-content pull-top modifyText" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">行业与客户</span>
            <div class="tabs-text Fixed-info">
              <el-row>
              <el-col :span="24">
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5">倾向订单类型：</el-col>
                  <el-col :span="14">
                      <el-form-item class="modify-content">
                          <el-radio-group v-model="dynamicValidateForm.coopInfo.orderType">
                          <el-radio label="310010">小批量多品种 </el-radio>
                          <el-radio label="310020">大批量少品种</el-radio>
                          </el-radio-group>
                      </el-form-item>
                  </el-col>
                </el-col>
              <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">主要出口市场：</el-col>
                  <el-col :span="14">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.coopInfo.exportMarket" multiple placeholder="请选择出口市场" style="width:100%">
                          <el-option
                          v-for="item in ExportArea"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
              <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">第一优势行业：</el-col>
                  <el-col :span="14">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.coopInfo.firstIndustryId" placeholder="请选择第一优势行业" style="width:100%">
                          <el-option
                          v-for="item in TradeList"
                          :key="item.id"
                          :label="item.industryName"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">第一主要客户：</el-col>
                  <el-col :span="14">
                      <el-form-item >
                          <el-input v-model="dynamicValidateForm.coopInfo.firstCustomer" ></el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
              <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">第二主要客户：</el-col>
                  <el-col :span="14">
                      <el-form-item >
                          <el-input v-model="dynamicValidateForm.coopInfo.secondCustomer" ></el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
              <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">第三主要客户：</el-col>
                  <el-col :span="14">
                      <el-form-item >
                          <el-input v-model="dynamicValidateForm.coopInfo.thirdCustomer" ></el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">代表性产品：</el-col>
                  <el-col :span="14">
                      <el-form-item >
                          <el-input v-model.trim="dynamicValidateForm.mainWorksCopy" ></el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">合作过的企业：</el-col>
                  <el-col :span="14">
                      <el-form-item >
                          <el-input v-model.trim="dynamicValidateForm.coopCompanysCopy" ></el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">行业类型：</el-col>
                  <el-col :span="14">
                      <el-form-item >
                          <div class="BusinessType">
                          <el-checkbox-group v-model="dynamicValidateForm.industryInfo" >
                              <el-checkbox v-for="(item,index) in TradeList" :label="item.id" :key="index" @change="techniqueType(1)">{{item.industryName}}</el-checkbox>
                          </el-checkbox-group>
                          </div>
                      </el-form-item>
                  </el-col>
                </el-col>
              </el-col>
              </el-row>
            </div>
          </div>
          <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">组织征信报告</span>
            <div class="tabs-text reputation">
                <div class=" modifyUploadImg">
                  <el-upload
                  class="upload-demo"
                  :action="uploadUrl"
                  :on-success="reputationLicenseUrl"
                  :before-upload="beforeAvatarUploadModifs"
                  :on-remove="handleRemoves"
                  :limit="2"
                  :on-exceed="reputationHandleExceed"
                  :file-list="dynamicValidateForm.creditInfo"
                  list-type="picture">
                  <el-button size="small" type="primary">上传</el-button>
              </el-upload>
                </div>
            </div>
          </div>
      </div>
      <div class="information-tabs-right pull-left">
          <div class="tabs-content" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">提供服务的工艺</span>
            <div class="tabs-text Technology">
                <el-form-item >
                      <div class="BusinessTree">
                          <div class="Treename">
                              <span class="pull-inline" v-for="(item,index) in Tree.Treename" :key="index" >{{item.techniqueName}}</span>
                          </div>
                          <div class="Treebtn">
                               <CommonTree  v-on:get-currentKey="getCurrentKey" :checked-nodes="Tree.SelectNode"  :checked-keys="Tree.SelectDatas" :expand-all="false" :set-width="Tree.width" :set-title='Tree.title' :btn-name='Tree.btnName' :switch-state='true' :max-length='20'></CommonTree>
                          </div>
                      <!-- <el-checkbox-group v-model="dynamicValidateForm.techniqueInfo" >
                          <el-checkbox v-for="(item,index) in techniqueData" :label="item.id" :key="index"  @change="techniqueType(2)">{{item.name}}</el-checkbox>
                      </el-checkbox-group> -->
                      </div>
                  </el-form-item>
            </div>
          </div>
          <div class="tabs-content pull-top" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">企业证件</span>
            <div class="tabs-text Technology Enterprise-documents">
                <span class="Enterprise-documents-text">
                  大富制造云将通过第三方验证机构来证明您公司真实性，
                  您也可以及时上传营业执照，以便加快您公司的验证进程，
                  请以图片或者PDF格式上传
                </span>
                <div class="EnterpriseDocuments">
                    <div class="Enterprise-List" v-for="(item,index) in dynamicValidateForm.certInfo" :key="index">
                        <div class="certType">
                            <el-select v-model="item.certType" placeholder="请选择" v-if="item.canDelete==true||item.canDelete==undefined">
                                <el-option
                                v-for="item in $LocalStorage.getWords(139)"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else>{{item.certType}}</span>
                        </div>
                        <div class="BusinessImg" >
                            {{item.name}}
                        </div>
                        <i  class="el-icon-close" v-if="item.canDelete==true||item.canDelete==undefined" @click="handleRemoveModify(index)"></i>
                    </div>
                </div>
                <div class="Enterprise-documents-upload">
                  <div class="Enterprise_select">
                    <el-select v-model="certInfoData.certType" placeholder="请选择">
                        <el-option
                        v-for="item in $LocalStorage.getWords(139)"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                  </div>
                  <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="uploadUrl"
                  :on-success="CertificatesChange"
                  :before-upload="CertificatesUploadModify">
                  <el-button size="small" type="primary" class="el-button-center" v-if="CertificatesFiles==''">上传</el-button>
                  </el-upload>
                  <!-- <div class="Enterprise-add">
                      <i class="el-icon-plus" @click="CertificatesAdd"></i> -->
                     <!-- <el-button type="primary" class="el-button-add" @click="CertificatesAdd">添加</el-button>  -->
                  <!-- </div> -->
                </div>
            </div>
          </div>
          <div class="tabs-content  modifyText" :class="$LocalStorage.gxzzpt2_consumer().isManufacturer==true?'pull-top':''">
            <span class="tabs-title">电子合同</span>
            <div class="tabs-text Fixed-info">
              <el-row>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">企业名称：</el-col>
                  <el-col :span="19">
                  <el-form-item>
                       <div style="line-height: 26px;">{{dynamicValidateForm.companyName}}</div>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">住所：</el-col>
                  <el-col :span="19">
                  <el-form-item >
                      <el-input v-model="dynamicValidateForm.contract.address" ></el-input>
                  </el-form-item>
                  </el-col>
                </el-col>
                <!-- <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">帐号：</el-col>
                  <el-col :span="19">
                  <el-form-item >
                      <el-input v-model="dynamicValidateForm.contract.account" ></el-input>
                  </el-form-item>
                  </el-col>
                </el-col> -->
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">联系电话：</el-col>
                  <el-col :span="19">
                  <el-form-item prop="tel">
                        <el-input v-model="dynamicValidateForm.tel" ></el-input>
                  </el-form-item>
                  </el-col>
                </el-col>
                <!-- <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="5" class="modify-title">法定代表人：</el-col>
                  <el-col :span="19">
                  <el-form-item >
                        <el-input v-model="dynamicValidateForm.contract.legalPerson" ></el-input>
                  </el-form-item>
                  </el-col>
                </el-col> -->
            </el-row>
            </div>
          </div>
          <div class="tabs-content pull-top modifyText" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">支持发票</span>
            <div class="tabs-text Fixed-info" style="padding-top: 12px;padding-bottom: 7px;">
              <el-row>
                <el-col :span="24" class="Fixed-info-top invoiceInfoList">
                  <el-col :span="24">
                  <el-form-item >
                      <el-checkbox-group v-model="invoiceData" >
                          <el-checkbox v-for="(item,index) in dynamicValidateForm.invoiceInfo" :label="item.id" :key="item.id" :checked="item.value" @change="invoiceChange(index)">{{item.invoiceTitleTypeText}}-{{item.invoiceTypeText}} {{item.taxRate*100}}%</el-checkbox>
                      </el-checkbox-group>
                  </el-form-item>
                  </el-col>
                </el-col>
            </el-row>
            </div>
          </div>
          <div class="tabs-content pull-top modifyText" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">收款账号</span>
            <div class="tabs-text Fixed-info">
              <el-row>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">银行：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                        <el-input v-model="dynamicValidateForm.collectionAccount.bankName" placeholder="请输入银行" maxlength='10'></el-input>
                        <!-- <el-select
                        v-model="dynamicValidateForm.collectionAccount.bankName"
                            filterable
                            allow-create
                            remote
                            reserve-keyword
                            default-first-option
                            placeholder="请选择银行"
                            style="width: 100%;">
                            <el-option v-for="(item,index) in BankList" :label="item.name" :value="item.name" :key="index" ></el-option>
                        </el-select> -->
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">姓名：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-input v-model="dynamicValidateForm.collectionAccount.accountName" ></el-input>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">账号：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-input v-model="dynamicValidateForm.collectionAccount.accountNo" ></el-input>
                  </el-form-item>
                  </el-col>
                </el-col>
            </el-row>
            </div>
          </div>
          <div class="tabs-content pull-top modifyText" v-if="$LocalStorage.gxzzpt2_consumer().isManufacturer==true">
            <span class="tabs-title">公司信息</span>
            <div class="tabs-text Fixed-info">
              <el-row>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">国家：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.country" placeholder="请选择国家/地区" @change='countryInfo(dynamicValidateForm.country)' style="width: 100%;">
                      <el-option v-for="item in countryInfoList" :label="item.name" :value="item.id" :key="item.id" ></el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">省市：</el-col>
                  <el-col :span="18">
                      <el-form-item class="select-area">
                            <div v-if="selectStats !=true">
                              <area-select type="text"  :data="$areaData" v-model="dynamicValidateForm.selectList" :level="2"></area-select>
                            </div>
                            <div class="selectData" v-else>
                              <el-select v-model="selectData" disabled placeholder="请选择"><el-option label="" value=""></el-option></el-select>
                              <el-select v-model="selectData" disabled placeholder="请选择"><el-option label="" value=""></el-option></el-select>
                              <el-select v-model="selectData" disabled placeholder="请选择"><el-option label="" value=""></el-option></el-select>
                              <span v-if="selectStats==true" style="font-size: 12px;color: #a09f9f">( 国外省市区域暂不支持选择 )</span>
                            </div>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">地址：</el-col>
                  <el-col :span="18">
                      <el-form-item >
                          <el-input v-model="dynamicValidateForm.address"  placeholder="请填写具体地址,不含省市区"></el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">企业类型：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.companyClass"  placeholder="请选择企业类型" style="width:100%">
                          <el-option
                          v-for="item in enterpriseType"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">成立年份：</el-col>
                  <el-col :span="18">
                      <el-form-item >
                          <el-date-picker
                          v-model="dynamicValidateForm.extendInfo.foundingTime"
                          type="year"
                          placeholder="选择年" style="width:100%;">
                          </el-date-picker>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">雇员数量：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.employeeScale" placeholder="请选择雇员数量" style="width:100%">
                          <el-option
                          v-for="item in Employee"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">科研人员数量：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.engineerScale" placeholder="请选择科研人员数量" style="width:100%">
                          <el-option
                          v-for="item in SmallScale"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">设计人员数量：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.designerScale" placeholder="请选择设计人员数量" style="width:100%">
                          <el-option
                          v-for="item in SmallScale"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">质检人员数量：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.qualityInspectorScale" placeholder="请选择质检人员数量" style="width:100%">
                          <el-option
                          v-for="item in SmallScale"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">工厂面积：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.factoryAcreage" placeholder="请选择工厂面积" style="width:100%">
                          <el-option
                          v-for="item in CoverArea"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">年产值：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.yearlyOutput" placeholder="请选择年产值" style="width:100%">
                          <el-option
                          v-for="item in yearlyOutput"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">最大年产能：</el-col>
                  <el-col :span="18">
                      <el-form-item class="border-R-No">
                          <el-input v-model="dynamicValidateForm.extendInfo.maxYearlyOutput" placeholder='请输入最大年产能'>
                              <template slot="append">万元</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">总资产：</el-col>
                  <el-col :span="18">
                      <el-form-item class="border-R-No">
                          <el-input v-model="dynamicValidateForm.extendInfo.totalAssets" placeholder='请输入总资产'>
                              <template slot="append">万元</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">进出口权：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.ioRights" placeholder="请选择进出口权" style="width:100%">
                      <el-option label="是" value='true'></el-option>
                      <el-option label="否" value='false'></el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">出口比例：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.exportRate" placeholder="请选择出口比例" style="width:100%">
                        <el-option
                          v-for="item in exportRateStr"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">ODM能力：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.extendInfo.odmAbilitys" placeholder="请选择ODM能力" style="width:100%">
                      <el-option label="是" value='true'></el-option>
                      <el-option label="否" value='false'></el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">公司性质：</el-col>
                  <el-col :span="18">
                  <el-form-item >
                      <el-select v-model="dynamicValidateForm.companyProperty" placeholder="请选择公司性质" style="width:100%">
                        <el-option
                          v-for="item in companyPropertyStr"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">信息化系统：</el-col>
                  <el-col :span="18">
                      <el-form-item >
                          <el-input v-model="dynamicValidateForm.extendInfo.informationSystem" ></el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24" class="Fixed-info-top">
                  <el-col :span="6" class="modify-title">网站：</el-col>
                  <el-col :span="18">
                      <el-form-item >
                          <el-input v-model="dynamicValidateForm.extendInfo.websiteUrl" ></el-input>
                      </el-form-item>
                  </el-col>
                </el-col>
              </el-row>
            </div>
          </div>
      </div>
  </div>
  </el-form>
  </div>
</template>
<script>
import {validatePhone,validateFax} from "../lib/validate.js";
import CommonTree from './Tree-common'
export default {
  props: ['modifyList','uploadSave','modifyData'],
  components: {
       CommonTree
  },
  data() {
    return {
      uploadState:false,
      uploadUrl:this.$baseURL + '/uploadingFile',
      selectStats:false,
      saveLoading:false,
      company_Id:'',
      selectData:'',//省市区切换(假)
      selectList:[],
      //企业资料--修改
        dynamicValidateForm:{
          companyName:'',
          shortName:'',
          logoUrl:'',
          equipmentInfo:[],
          contactsInfo:[],//联系人信息
          invoiceInfo:[],//发票
          collectionAccount:'',//银行
          qualificationInfo:[],
          industryInfo:[],
          techniqueInfo:[],
          selectList:[],
          address:'',
          companyClass:'',
          manufacturerAuditReport:'',
          companyProperty:'',
          creditInfo:[],
          certInfo:[],
          contract:'',
          showLegalName:false,
          tel:'',
          fax:'',
          country:'',
        coopInfo:{
            orderType:[],
            exportMarket:[],
            firstIndustryId:'',
            firstCustomer:'',
            secondCustomer:'',
            thirdCustomer:'',
            mainWorks:[],
            coopCompanysCopy:[],
            industryIds:[],
        },
        extendInfo:{
            introduceInfo:'',
            foundingTime:'',
            employeeScale:'',
            engineerScale:'',
            designerScale:'',
            qualityInspectorScale:'',
            factoryAcreage:'',
            yearlyOutput:'',
            maxYearlyOutput:'',
            totalAssets:'',
            ioRight:'',
            ioRights:'',
            exportRate:'',
            odmAbility:'',
            odmAbilitys:'',
            informationSystem:'',
            websiteUrl:'',
            },
        },
        dynamicRules:{
          tel:[{required: true, validator: validatePhone,trigger: "blur" }],
          fax:[{required: true, validator: validateFax,trigger: "blur" }],
        },
        TradeList:[],//行业类型
        invoiceData:[],
        invoiceInfoData:[],
        certInfoData:{
           certType:329990,
           fileList:'',
        },
        CertificatesFiles:[],
        EquipmentTypeData:this.$LocalStorage.getWords(137),//获取设备类型
        ExportArea:this.$LocalStorage.getWords(136), //出口地区
        techniqueData:this.$LocalStorage.getWords(105), //涉及工艺
        Employee:this.$LocalStorage.getWords(125), //雇员数量
        SmallScale:this.$LocalStorage.getWords(140),//小规模人员
        CoverArea:this.$LocalStorage.getWords(134),//占地范围
        exportRateStr:this.$LocalStorage.getWords(141),//占比
        companyPropertyStr:this.$LocalStorage.getWords(124),//公司性质
        enterpriseType:this.$LocalStorage.getWords(133), //企业类型
        yearlyOutput:this.$LocalStorage.getWords(135),//年产值
        // BankList:this.$LocalStorage.getWords(149),//银行
        countryInfoList:this.$LocalStorage.getWords(142),//国家

        EquipmentList:[],
        AuthenticationList:{},
        AuthenticationData:[],
        AuthentIndex:'',

        reputation:{
          fileList:[]
        },
        CertificatesfileList:[],
        Tree:{
            Treename:[],
            SelectDatas:[],
            SelectNode:[],
            width:'30%',
            title:'工艺',
            btnName:'选择工艺'
        }

    }
  },
  watch: {
    modifyData(val,oldval){
       this.dynamicValidateForm.invoiceInfo=val;
       this.invoiceInfoData=val;
    },
    modifyList (val, oldVal) {
      this.dynamicValidateForm=val;
      this.Tree.SelectDatas=val.techniqueInfo;
      this.Tree.Treename=val.techniqueData;
      if(parseInt(val.country) !=350000){
        this.selectStats=true;
       }
    },
    uploadSave(val, oldVal){
      this.UploadSaves(val,'dynamicValidateForm')
    }
  },
  created() {},
  methods: {
     industryCheck(){
      let url="/custom/industry/all";
      this.$http.post(url).then(res=>{
          this.TradeList=res.data.data
      })
    },
      handleAvatarSuccessModify(res, file) {//logo
        this.dynamicValidateForm.logoUrl=res.data.img_url;
      },

      /*logo*/
      beforeAvatarUploadModify(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'||file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 0.2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG,PNG,GIF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传Logo大小不能超过 120kb!');
        }
        return isJPG && isLt2M;
      },

      /*组织征信报告*/
      beforeAvatarUploadModifs(file){
        const isJPG = file.type === 'image/jpeg'|| file.type === 'image/png'||file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG,PNG,GIF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传征信报告大小不能超过 2M!');
        }
        return isJPG && isLt2M;
      },

      UploadIndex(index){
       this.AuthentIndex=index;
      },
      AuthentAvatarSuccess(res, file){ //资格认证
        let index=this.AuthentIndex;
        this.dynamicValidateForm.qualificationInfo[index].fileId=res.attachFile.id;
        this.dynamicValidateForm.qualificationInfo[index].fileName=res.attachFile.fileName;
        this.dynamicValidateForm.qualificationInfo[index].fileUrl=res.attachFile.fileUrl;

      },

      AddContactInfo(){ //添加联系人信息
        let contactInfodata={
          contacts:'',
          jobTitle:'',
          tel:'',
          email:''
        }
        this.dynamicValidateForm.contactsInfo.push(contactInfodata)
      },

     AddEquipmentInfo(){ //添加关键设备清单
       let tableDataInfo={
           equipmentName:'',
           equipmentModel:'',
           total:'',
           equipmentParam:'',
           equipmentTypeStr:'',
           equipmentType:'',
           brand:'',
       }
        this.dynamicValidateForm.equipmentInfo.push(tableDataInfo)
      },

      AddAuthenticationData(){
        let AuthenDataInfo={
            qualificationName:'',
            qualificationIndate:'',
            fileId:'',
            fileName:'',
            fileUrl:''
        }
         this.dynamicValidateForm.qualificationInfo.push(AuthenDataInfo)
      },

      removeContactInfo(row,index){ //删除联系人信息
        this.dynamicValidateForm.contactsInfo.splice(index, 1);
      },

      removeEquipmentInfo(row,index){ //删除关键设备清单
        this.dynamicValidateForm.equipmentInfo.splice(index, 1);
      },

      removeAuthenticationData(row,index){
        let _this=this;
        _this.dynamicValidateForm.qualificationInfo.splice(index, 1);
      },

      handleRemoves(file, fileList){
          this.dynamicValidateForm.creditInfo=fileList;
      },

      handleRemoveModify(index){
          this.dynamicValidateForm.certInfo.splice(index, 1);
      },

      reputationLicenseUrl(res, file,fileList){ //征信
        let fileData={
            fileName:res.attachFile.fileName,
            url:this.$baseURL+'/'+res.attachFile.fileUrl,
            fileId:res.attachFile.id,
        }
        this.dynamicValidateForm.creditInfo.push(fileData)
     },

     reputationHandleExceed(files, fileList){
        this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
     },

     CertificatesChange(res, file,fileList){ //企业证件
         let fileData={
            fileName:res.attachFile.fileName,
            url:res.attachFile.fileUrl,
            fileId:res.attachFile.id,
            name:res.attachFile.fileName,
        }
        this.certInfoData.fileList=fileData;
        this.CertificatesFiles=fileList;
        this.CertificatesAdds();
     },
     CertificatesAdds(){
        let fileData={
            certType:this.certInfoData.certType,
            fileName:this.certInfoData.fileList.fileName,
            url:this.certInfoData.fileList.url,
            fileId:this.certInfoData.fileList.fileId,
            name:this.certInfoData.fileList.name,
        }
        this.dynamicValidateForm.certInfo.push(fileData)
        this.$refs.upload.uploadFiles=[];
        this.CertificatesFiles=this.$refs.upload.uploadFiles;
     },
    //  CertificatesRemove(file, fileList){
    //      this.CertificatesFiles=fileList;
    //  },
    //  CertificatesAdd(){
    //      if(this.certInfoData.fileList!=''&&this.certInfoData.certType!=''){
    //         let fileData={
    //             certType:this.certInfoData.certType,
    //             fileName:this.certInfoData.fileList.fileName,
    //             url:this.certInfoData.fileList.url,
    //             fileId:this.certInfoData.fileList.fileId,
    //             name:this.certInfoData.fileList.name,
    //         }
    //         this.dynamicValidateForm.certInfo.push(fileData)
    //         this.$refs.upload.uploadFiles=[];
    //         this.certInfoData.certType='';
    //         this.CertificatesFiles=this.$refs.upload.uploadFiles;
    //      }else{
    //         this.$message({
    //         message: '请选择图片与证件类型',
    //         type: 'warning',
    //         duration:1100
    //          });
    //      }
    //  },

     /*企业证件*/
     CertificatesUploadModify(file){
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'||file.type === 'image/gif'||file.type === 'application/pdf';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG,PNG,GIF,PDF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传企业证件大小不能超过 2M!');
        }
        return isJPG && isLt2M;
     },

    /*涉及工艺*/
    techniqueType(val){
      if(val==2){
        if(this.dynamicValidateForm.techniqueInfo.length>5){
        this.dynamicValidateForm.techniqueInfo.pop();
        this.$message({
        message: '工艺最多5项',
        type: 'warning',
        duration:1100
      });
     }
    }
      if(val==1){
        if(this.dynamicValidateForm.industryInfo.length>5){
        this.dynamicValidateForm.industryInfo.pop();
        this.$message({
        message: '类型最多5项',
        type: 'warning',
        duration:1100
      });
      }
     }
    },

    /*根据国家判定省市区toggle*/
    countryInfo(val){
      if(val !=350000){
        this.dynamicValidateForm.selectList=[]
        this.selectStats=true
      }else{
         this.selectStats=false
      }
    },

    /*获取选中的发票状态*/
    invoiceChange(index){
       this.invoiceInfoData[index].value =!this.invoiceInfoData[index].value;
    },

    /*选中工艺*/
    getCurrentKey(takeDate,keyDate){
        this.dynamicValidateForm.techniqueInfo=keyDate;
        this.Tree.SelectDatas=keyDate;
        this.Tree.Treename=takeDate;
    },

	Detailedlist(row,index){
        if(row.equipmentName!=''){
            this.$set(this.dynamicValidateForm.equipmentInfo[index],'state',false);
        }
    },
    Qualifications(row,index){
        if(row.qualificationName!=''){
            this.$set(this.dynamicValidateForm.qualificationInfo[index],'state',false);
        }
    },
    UploadSaves(formSate,formName){
      if(formSate==true){
        let state1=true;
        let state2=true;
        for(let index in this.dynamicValidateForm.equipmentInfo){
            if(this.dynamicValidateForm.equipmentInfo !=''&&this.dynamicValidateForm.equipmentInfo[index].equipmentName==''){
                this.$set(this.dynamicValidateForm.equipmentInfo[index],'state',true);
                state1=false;
            }
        }
        for(let index in this.dynamicValidateForm.qualificationInfo){
            if(this.dynamicValidateForm.qualificationInfo !=''&&this.dynamicValidateForm.qualificationInfo[index].qualificationName==''){
                this.$set(this.dynamicValidateForm.qualificationInfo[index],'state',true);
                state2=false;
            }
        }
          if(state1==true&&state2==true){
              this.$refs[formName].validate(valid => {
              let _this=this;
              if (valid) {

          _this.dynamicValidateForm.province=this.selectStats==false?_this.dynamicValidateForm.selectList[0]:'';
          _this.dynamicValidateForm.city=this.selectStats==false?_this.dynamicValidateForm.selectList[1]:'';
          _this.dynamicValidateForm.region=this.selectStats==false?_this.dynamicValidateForm.selectList[2]:'';
          _this.dynamicValidateForm.extendInfo.ioRight=_this.dynamicValidateForm.extendInfo.ioRights=='true'?true:false;
          _this.dynamicValidateForm.extendInfo.odmAbility=_this.dynamicValidateForm.extendInfo.odmAbilitys=='true'?true:false;
          _this.dynamicValidateForm.coopInfo.orderType=parseInt(_this.dynamicValidateForm.coopInfo.orderType)
          _this.dynamicValidateForm.coopInfo.coopCompanys=_this.dynamicValidateForm.coopCompanysCopy===''?[]:_this.dynamicValidateForm.coopCompanysCopy.split(/[\n,]/g);
          _this.dynamicValidateForm.coopInfo.mainWorks=_this.dynamicValidateForm.mainWorksCopy===''?[]:_this.dynamicValidateForm.mainWorksCopy.split(/[\n,]/g);
          _this.dynamicValidateForm.coopInfo.industryIds=_this.dynamicValidateForm.industryInfo;
          _this.dynamicValidateForm.contract.tel= _this.dynamicValidateForm.tel;
          _this.dynamicValidateForm.contract.fax= _this.dynamicValidateForm.fax;
          this.dynamicValidateForm.invoiceInfo=this.invoiceInfoData;
          let url="/custom/company/updateInfo";
          this.$emit('Save-list',true,false);
          _this.$http.post(url,_this.dynamicValidateForm).then(res=>{
          if(res.data.code==200){
              this.$message({message: '数据保存成功', type: 'success', duration:1300});
              setTimeout(() => {
                  this.$emit('Save-list',false,true);
                  }, 1000);
          }else{
          this.$emit('Save-list',false,false);
          this.$message({message: res.data.message, type: 'warning', duration:1300});
          }
      })
        } else {
            window.scrollTo(0,700)
            this.$emit('Save-list',false,false);
            return false;
        }
        });
		  }else{
        this.$emit('Save-list',false,false);
        this.$message({
          message: '请完善资料',
          type: 'warning',
          duration:1100
        });
       window.scrollTo(0,800);
      }
      }
    },

  },
  mounted() {
  this.industryCheck();
},
}
</script>
<style lang="less">
.BusinessTree{
    .Treename,.Treebtn{float: left;}
    .Treename{
       width: 305px; 
       min-height: 26px;
    }
    .Treebtn{
     margin-left: 10px;
     button{height: 26px;line-height: 8px;}   
    }
}
</style>

<style lang="less" scoped>
.pull-left{float: left;}
.pull-right{float: right;}
.pull-ovflow{overflow: hidden;}
</style>

