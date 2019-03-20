<template>
    <div id="artificial-quotation">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/deputy-index2'})">机械加工</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span> 
                <span class="curr">人工报价</span>
            </div>
            <div class="error-tip" v-if="requirmentData.auditStatus==190030">需求被平台驳回！原因：{{requirmentData.auditRemark||''}}  这可能会导致无法给出正确的报价，请调整后继续发布。</div>
            <div class="form-wrapper">
                
                <div class="form-content-item" ref="baseFormItem">
                    <div class="item-title">询价信息<span class="excel-link" @click="$router.push({path:'/quote/excel'})">手动填写太繁琐？点击导入excel</span></div>
                    <div class="form-box">
                        <el-form :rules="baseForm.rules" :model="baseForm.data" ref="baseForm" label-position="left">
                            <el-form-item class="form-item-1">
                                <el-col :span="11">
                                    <el-form-item label="所属行业：" prop="industryName" label-position="left" label-width="95px">
                                        <div class="fake-input" @click="selectModal.visible=true">{{baseForm.data.industryName}}</div>
                                        <v-select :selectModal="selectModal">
                                            <el-collapse v-model="selectModal.actives">
                                                <el-collapse-item :title="group.industryCatalogName" :name="group.id"  v-for="group in industrys" :key="group.id">
                                                    <div>
                                                        <el-radio @change="handleIndustryChange(item)" v-model="baseForm.data.industryId" :label="item.id" v-for="item in group.industryList" :key=item.id>{{item.industryName}}</el-radio>
                                                    </div>
                                                </el-collapse-item>
                                            </el-collapse>
                                        </v-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="送货地区：" label-position="left" label-width="95px" prop="addressList" required>
                                        <div class="select-area">
                                            <area-select type="text" v-model="baseForm.data.addressList" :level="1" :data="$areaData" ></area-select>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item label-position="top">
                                <el-col :span="11">
                                    <el-form-item label="报价截止：" prop="offerDeadlineTime" label-position="left" label-width="95px">
                                        <el-date-picker v-model="baseForm.data.offerDeadlineTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptions"
                                            placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="联系人：" label-position="left" label-width="95px" prop="contactName">
                                       <el-input :maxlength="36" v-model="baseForm.data.contactName"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item label-position="top">
                                <el-col :span="11">
                                    <el-form-item label="联系电话：" label-position="left" label-width="95px" prop="contactPhone">
                                        <el-input :maxlength="11"  v-model="baseForm.data.contactPhone"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="邮箱：" label-position="left" label-width="95px" prop="contactEmail">
                                       <!-- <el-input :maxlength="50"  v-model="baseForm.data.contactEmail"></el-input> -->
                                       <el-autocomplete 
                                            v-model="baseForm.data.contactEmail"
                                            :fetch-suggestions="emailInputHandler"
                                            placeholder="请输入邮箱"
                                            :trigger-on-focus="true"
                                        ></el-autocomplete>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item label-position="top">
                                <el-col :span="11">
                                    <el-form-item class="tech-form-item" label="主工艺：" label-position="left" label-width="95px" prop="techniqueNames" required>
                                        <el-input v-model="baseForm.data.techniqueNames" v-show="false"></el-input>
                                        <!-- <v-tree  v-on:get-currentKey="techniqueChangeHandler" :max-length="1" :checked-nodes="treeModal.SelectNode" :techniqueType="techniqueType" :removeEmpty="true"
                                         :checked-keys="treeModal.SelectDatas" :expand-all="false" :set-width="treeModal.width" :set-title='treeModal.title' :btn-name='treeModal.btnName' :switch-state='true'></v-tree> -->
                                    <v-tree  v-on:get-currentKey="techniqueChangeHandler" :max-length="1" :checked-nodes="treeModal.SelectNode" :techniqueType="530020" :removeEmpty="true"
                                         :checked-keys="treeModal.SelectDatas" :expand-all="false" :set-width="treeModal.width" :set-title='treeModal.title' :btn-name='treeModal.btnName' :switch-state='true'></v-tree>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="询价方式：" label-position="left" label-width="95px" prop="enquiryType" required>
                                        <v-checkBtn :title="item.title" :active="item.isCheck" @click="selectEnquiry(item)" v-for="item in enquiryTypes">{{item.name}}</v-checkBtn>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            
                            <el-form-item label-position="top">
                                <el-col :span="11">
                                    <el-form-item required label="结算方式：" label-position="left" label-width="95px" prop="settlementType">
                                        <div style="display:flex;align-items:center;height:26px;">
                                            <el-radio-group v-model="baseForm.data.settlementType">
                                                <el-radio :label="430010">全款现付</el-radio>
                                                <el-radio :label="430020" v-if="user.companyType==160020">月结</el-radio>
                                            </el-radio-group>
                                            <div v-if="baseForm.data.settlementType==430020" class="payment-type" style="">
                                                <el-select v-model="baseForm.data.settlementPeriod">
                                                    <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in paymentCycles"></el-option>
                                                </el-select>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item required label="指定供应商：" label-position="left" label-width="95px" v-if="baseForm.data.enquiryType==230020" prop="companys">
                                        <el-select v-model="baseForm.data.companys"  filterable multiple remote :remote-method="remoteMethod">
                                            <el-option :value="item.id" :label="item.companyName" :key="item.id" v-for="item in companyList"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-col :span="11">
                                    <el-form-item label="报价模板：" label-position="left" label-width="95px" prop="priceTemplate">
                                        <el-select v-model="baseForm.data.priceTemplate">
                                            <!-- <el-option :disabled="item.id==490020?true:false" v-for="item in priceTemplates" :value="item.id" :label="item.name" :key="item.id"></el-option> -->
                                            <el-option  v-for="item in priceTemplates" :value="item.id" :label="item.name" :key="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2"><div style="visibility:hidden">1</div></el-col>
                                <el-col :span="11">
                                    <el-form-item label="配送方式：" label-position="left" label-width="95px" prop="expressMode">
                                        <el-radio-group v-model="baseForm.data.expressMode">
                                            <el-radio :label="item.id" v-for="item in expressModes" :key="item.id">{{item.name}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            
                            <el-form-item label="需求说明：" label-position="left" label-width="95px" prop="textarea">
                                <el-input :maxlength="200" v-model="baseForm.data.description" type="textarea" :rows="2"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                
                <div class="form-content-item" v-for="(partForm, index) in partForms" :ref="'partFormItem' + index" :key="'part-form-' + index">
                    <div class="item-title">零件信息<div class="delete-form-content" v-if="partForms.length > 1" @click="deletePartForm(index)">删除</div></div>
                    <div class="form-box">
                        <el-form :rules="partRules" :model="partForm" :ref="'partForm' + index">
                            <el-form-item label-position="top">
                                <el-col :span="11">
                                    <el-form-item label="零件名称：" label-position="left" label-width="95px" prop="itemName">
                                        <el-input :maxlength="30" v-model="partForm.itemName"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="需求数量：" label-position="left" label-width="95px" prop="estimateCount">
                                       <el-input :maxlength="9" v-model="partForm.estimateCount"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item label-position="top">
                                <el-col :span="11">
                                    <el-form-item label="交付周期：" label-position="left" label-width="95px" prop="deliveryTime">
                                        <el-input :maxlength="9" placeholder="天" v-model="partForm.deliveryTime"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="加工材质：" label-position="left" label-width="95px" prop="material">
                                       <!-- el-select v-model="partForm.materialId">
                                            <el-option :label="item.materialName" :key="item.materialId" v-for="item in materials" :value="item.materialId"></el-option>
                                        </el-select> -->
                                        <el-input v-model="partForm.material"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-col :span="11">
                                    <el-form-item class="single-price-form-item" label="目标单价：" label-position="left" label-width="95px" prop="expectPrice">
                                        <el-input v-model="partForm.expectPrice" :maxlength="9"></el-input>
                                        <div class="hidden-price"><el-checkbox v-model="partForm.showExpectPrice">对供应商隐藏单价</el-checkbox></div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="发货方式" label-position="left" label-width="95px" prop="deliveryType"> 
                                        <el-radio-group v-model="partForm.deliveryType">
                                            <el-radio v-for="(item, index) in deliveryTypeList" :key="'deliveryType-' +index" :label="item.id">{{item.name}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item class="ladder-quotation-form-item" label="阶梯报价：" label-position="left" label-width="95px">
                                <el-col :span="1.5">
                                    <el-form-item>
                                        <el-checkbox v-model="partForm.isLadderPrice">是</el-checkbox>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-1">一级阶梯：</div>
                                </el-col>
                                <el-col :span="2" v-if="partForm.isLadderPrice">
                                    <el-form-item prop="num1">
                                        <el-input :maxlength="9" v-model="partForm.num1"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1.1" v-if="partForm.isLadderPrice"><div class="form-col-text-2">至</div></el-col>
                                <el-col :span="2" v-if="partForm.isLadderPrice">
                                     <el-form-item prop="num2">
                                        <el-input :maxlength="9" v-model="partForm.num2"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1.1" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-2">件</div>
                                </el-col>
                                <el-col :span="1" v-if="partForm.isLadderPrice">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="2" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-1">二级阶梯：</div>
                                </el-col>
                                <el-col :span="2" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-3">{{partForm.num2?(Number(partForm.num2) + 1):''}}</div>
                                </el-col>
                                <el-col :span="1.1" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-2">至</div>
                                </el-col>
                                <el-col :span="2" v-if="partForm.isLadderPrice">
                                    <el-form-item prop="num3">
                                        <el-input :maxlength="9" v-model="partForm.num3"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1.1" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-2">件</div>
                                </el-col>
                                <el-col :span="1" v-if="partForm.isLadderPrice">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="2" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-1">三级阶梯：</div>
                                </el-col>
                                <el-col :span="1" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-1">大于</div>
                                </el-col>
                                <el-col :span="2" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-3">{{partForm.num3?partForm.num3:''}}</div>
                                </el-col>
                                <el-col :span="1.1" v-if="partForm.isLadderPrice">
                                    <div class="form-col-text-2">件</div>
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-col :span="11">
                                    <el-form-item label="3D模型：" label-position="left" label-width="95px" prop="modelFileNames">
                                        <el-input disabled v-model="partForm.modelFileNames"></el-input>
                                        <!-- <span class="upload-btn 3d-upload-btn" @click="showModelDlg(partForm)">上传</span> -->
                                        <el-upload
                                            :action="uploadUrl"
                                            :with-credentials="true"
                                            :limit="100"
                                            :on-success="onSuccessUploadModel"
                                            :before-upload="beforeUploadModelFile"
                                            :show-file-list="false">
                                            <span class="upload-btn 3d-upload-btn" @click="showModelDlg(partForm)">上传</span>
                                        </el-upload>
                                      <!--   <span class="upload-remark">小于25M，支持STP、IGS格式</span> -->
                                        <div class="upload-img-list"  v-show="partForm.modelFiles.length>0">
                                            <div class="upload-img-item"  v-for="(mf, index) in partForm.modelFiles" :key="'modelImg'+index">
                                                <img v-if="mf.thumbnailUrl" :src="$baseURL + '/' + mf.thumbnailUrl" alt="">
                                                <img v-else src="../../static/img/empty.png" alt="">
                                                <i class="img-colse-icon" @click="deleteModelFile(mf, partForm)"></i>
                                                <p>{{mf.orignFileName}}</p>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="2D图纸：" label-position="left" label-width="95px" prop="planeGraphFileName">
                                        <el-input disabled v-model="partForm.planeGraphFileName"></el-input>
                                        <el-upload
                                            :action="planeGraphUploadUrl"
                                            :with-credentials="true"
                                            :on-success="onSuccessUploadPlaneGraph"
                                            :before-upload="beforeUploadPlaneGraph"
                                            :limit="100"
                                            :show-file-list="false">
                                            <span class="upload-btn 3d-upload-btn" @click="showPlaneGraphFileDlg(partForm)">上传</span>
                                        </el-upload>
                                        <!-- <span class="upload-btn 3d-upload-btn" @click="showPlaneGraphFileDlg(partForm)">上传</span> -->
                                       <!--  <span class="upload-remark">小于25M，支持doc、docx、pdf、jpg、png、dwg格式</span> -->
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item class="other-file-form-item" label="其他文件：" label-position="left" label-width="95px">
                                <el-button size="mini" type="primary" @click="showUploadDlg(partForm)">{{partForm.otherFiles.length>0?'查看':'上传'}}</el-button>
                                <span class="other-upload-remark">小于25M</span>
                            </el-form-item>
                            <el-form-item label="说明：" label-position="left" label-width="95px">
                                <el-input :maxlength="200" type="textarea" v-model="partForm.description" :rows="2"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div> 
                <div class="footer-btn">
                    <div class="add">
                        <div class="add-btn" @click="addPartForm">添加零件</div>
                        <div class="remark-info">最多可询盘十个零件</div>
                    </div>
                    <div class="submit clearfix">
                        <div class="btn save-btn" @click="submit(true)">保存为草稿</div>
                        <div class="btn submit-btn" @click="submit(false)">提交需求</div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="上传" width="524px" :visible.sync="uoloadDlg.visible">
            <div class="upload-dlg">
                <div class="add-btn" @click="showOtherFileDlg">选择文件</div>
                <input type="file" hidden ref="otherFileInput" multiple @change="uploadOhterFile">
                <div class="file-list" v-if="currentPartForm.otherFiles">
                    <div class="file-item" v-for="file in currentPartForm.otherFiles">{{file.fileName}} <i class="remove-icon" @click="deleteOtherFileItem(file)"></i></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"
                @click="closeUploadDlg" >确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import CheckBtn from '../components/checkButton.vue';
import { validatNumber, validatePhone, validateEmail, checkNormal ,EmailAuto} from '../lib/validate.js';
import { mapState } from 'vuex';
import CommonTree from './Tree-common';
export default {
    components:{
        'v-checkBtn': CheckBtn,
        'v-tree': CommonTree
    },
    data() {
        return {
            selectModal:{
                visible:false,
                title:'选择行业',
                actives:[]
            },
            treeModal: {
                SelectDatas:[],
                SelectNode:[],
                width:'35%',
                title:'工艺选择',
                btnName:''
            },
            actives:[],
            pickerOptions:{
                disabledDate: function(date) {
                    var now = new Date();
                    now.setDate(now.getDate()-1);
                    if (date.getTime() < now.getTime()) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            uploadUrl: this.$baseURL + '/custom/attachFile/upload3DFileForCNC',
            planeGraphUploadUrl: this.$baseURL + '/uploadingFile',
            serviceList:[],
            industrys:[],
            enquiryTypes:[{
                name: '平台询价',
                id: 230010,
                isCheck: true,
                title: '由平台提供技术分析后，为您匹配最合适的供应商'
            },{
                name: '指定供应商',
                id: 230020,
                 isCheck: false,
                title: '您可以指定供应商来为您报价'
            },{
                name: '公开询价',
                id: 230030,
                 isCheck: false,
                title: '将需求发布到最新询盘中，供应商浏览并未您报价'
            }],
            companyList: [],
            materials:[],
            requireTypes:[],//工艺集合
            paymentCycles:[],//月结算周期集合
            expressModes:[],//配送方式集合
            priceTemplates:[],//报价模板集合
            deliveryTypeList:[],//发货方式
            baseForm:{
               data:{
                    settlementType:430010,
                    settlementPeriod:440010,
                    techniqueId: '',
                    industryId: null,
                    industryName: '',
                    offerDeadlineTime: '',
                    contactName: '',
                    contactPhone: '',
                    contactEmail: '',
                    enquiryType: 230010,
                    companys:[],
                    addressList:['广东省','深圳市'],
                    description:'',
                    expressMode:'',
                    priceTemplate:490010,
                    techniqueNames:'',
               },
               rules:{
                    contactName:[{required: true,validator:checkNormal,trigger:'blur'}],
                    contactPhone:[{required: true,validator:validatePhone,trigger:'blur'}],
                    contactEmail:[{required: true,validator: validateEmail,trigger:'change'}],
                    // industryName:[{required: true,message:'请选择所属行业',trigger:'change'}],
                    offerDeadlineTime:[{required: true,message:'请填写报价时限',trigger:'change'}],
                    companys:[{required: true,message:'请选择供应商',trigger:'change'}],
                    techniqueNames: [{required: true,message:'请选择主工艺',trigger:'change'}],
                    expressMode:[{required: true,message:'请选择配送方式',trigger:'change'}],
                    priceTemplate:[{required: true,message:'请选择报价模板',trigger:'change'}],
               }
            },
            partForms:[{
                itemName:null,
                deliveryTime:null,
                deliveryTimeUnit:null,
                estimateCount:null,
                material:null,
                expectPrice:null,
                showExpectPrice:true,
                modelFileIds:[],
                planeGraphFileId:null,
                otherFileIds:[],
                description:null,
                isLadderPrice:false,
                num1: null,
                num2: null,
                num3: null,
                planeGraphFileName:'',
                modelFileNames:'',
                modelFiles:[],
                otherFiles:[],
                otherFilesEl:[],
                deliveryType:''
            }],
            currentPartForm:'',
            partRules:{
                itemName:[{required: true,validator:checkNormal,trigger:'blur'}],
                deliveryTime:[{required: true,validator:validatNumber,trigger:'blur'}],
                estimateCount: [{required: true,validator:validatNumber,trigger:'blur'}],
                num1:[{required: true,message:'请填写数量',trigger:'blur'},{required:true, validator: validatNumber, trigger:'blur'}],
                num2:[{required: true,message:'请填写数量',trigger:'blur'},{required:true, validator: validatNumber, trigger:'blur'}],
                num3:[{required: true,message:'请填写数量',trigger:'blur'},{required:true, validator: validatNumber, trigger:'blur'}],
                deliveryType: [{required: true,message:'请选择发货方式',trigger:'change'}],
            },
            uoloadDlg:{
                visible: false,
            },
            unCheckedFormIndexs:[],
            requirementId: '',
            requirmentData:'',
            defaultOfferDeadlineTime:''
        }
    },
    computed: {
        ...mapState({
            user: state => state.user,
        }),
    },
    watch: {
    },
    created() {
        this.techniqueType = Number(this.$route.query.techniqueType);
        this.getWords();
        this.getIndustrys();
        this.getCompanys();
        
        this.baseForm.data.contactName = this.user.nickName || '';
        this.baseForm.data.contactEmail = this.user.email || '';
        this.baseForm.data.contactPhone = this.user.phone || '';

        let timestamp = new Date().getTime();//当前的时间戳
        timestamp = timestamp + 2 * 60 * 60 * 1000;
        this.defaultOfferDeadlineTime = new Date(timestamp);
        this.baseForm.data.offerDeadlineTime = this.$dateFormat(new Date(timestamp));
    },
    methods:{

        /* --------------人工报价------------------------ */

        getScrollTopValue( targetElement ) {
            var boundingClientTop = targetElement.getBoundingClientRect().top;//目标元素顶部到窗口顶部的距离
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            var maxSrcollTop = boundingClientTop + scrollTop; // 目标元素顶部到窗口顶部的最大距离或最大滚动值
            var scrollValue = maxSrcollTop - 200;//120 头部距离
            return scrollValue;
        },

        //邮箱自动补全；
        emailInputHandler( inputString, cb ) {
            EmailAuto(inputString,cb)
        },

        remoteMethod( queryString ) {
            this.getCompanys( queryString );
        },
        
        //获取供应商列表
        getIndustrys() {
            this.$http.post('/custom/industryCatalog/all').then(( res ) => {
                if ( res.data.code ==200 ) {
                    this.industrys = res.data.data;
                    this.industrys.map(( item ) => {
                        this.selectModal.actives.push(item.id);
                    })
                } else {
                    this.$error(res.data.message);
                }
            })
        },

        handleIndustryChange( val ) {
            this.baseForm.data.industryName = val.industryName;
            this.baseForm.data.industryId = val.id;
        },
        
        //获取所有询价、工艺列表
        getWords() {
            var wordsString = localStorage.getItem('words');
            var words = JSON.parse(wordsString);

            this.requireTypes = words[105].item;
            this.paymentCycles = words[151].item;
            this.expressModes = words[110].item;
            this.priceTemplates = words[156].item;
            this.deliveryTypeList = words[163].item;
        },

        techniqueChangeHandler(takeDate, keyDate) {
            this.treeModal.SelectDatas = keyDate;
            if ( takeDate.length > 0 ) {
                this.baseForm.data.techniqueId = keyDate[0];
                this.treeModal.btnName = takeDate[0].techniqueName;
                this.baseForm.data.techniqueNames = takeDate[0].techniqueName;
            } else {
                this.baseForm.data.techniqueNames = '';
                this.baseForm.data.techniqueId = '';
                this.treeModal.btnName = '';
            }
            
        },

        //选择询价方式
        selectEnquiry( enquiry ) {
            this.enquiryTypes.map(( item ) => {
                item.isCheck = false;
            })
            enquiry.isCheck = true;
            this.baseForm.data.enquiryType = enquiry.id;
        },

        //获取供应商列表
        getCompanys( keyword ) {
            this.$http.post('/getManufacturerList',{keyword:keyword, techniqueTypeList:[530020]}).then(( res ) => {
                if ( res.data.code ==200 ) {
                    if ( Array.isArray( res.data.data.list ) ) {
                        this.companyList = res.data.data.list;
                    } else {
                        this.companyList = [];
                    }
                } else {
                    this.$error(res.data.message);
                }
            })
        },

        //
        showModelDlg( partForm ) {
            this.currentPartForm = partForm;
        //    this.$refs.modelFileInput.click();
        },
       
       //上传模型文件前
        beforeUploadModelFile( file ) {
            if ( this.currentPartForm.modelFiles.length > 0 ) {
                this.$error('只能上传一个模型');
                return false;
            }
            if ( file.size > 25*1024*1024 ) {
                this.$error('文件大小不能超过25M');
                return false;
            }
            if ( this.baseForm.data.techniqueType == 530010 ) {
                if (!/\.(stl|stp|IGS|igs|STL|STP)$/.test(file.name)) {
                    this.$error('3D打印只支持上传stl/stp/igs格式的模型');
                    return false;
                } 
            }
        },

        onSuccessUploadModel( res, file, fileList ) {
            if ( res.code == 200 ) {
                this.currentPartForm.modelFiles.push(res.attachFile);
                this.currentPartForm.modelFileNames = res.attachFile.orignFileName;
            } else {
                this.$error(res.message);
            }
        },

        deleteModelFile( file, partForm ) {
            partForm.modelFiles.map(( item, index ) => {
                if ( item.fileId == file.fileId ) {
                    partForm.modelFiles.splice(index,1);
                }
            })
            partForm.modelFileNames = null;
        },

        showPlaneGraphFileDlg( partForm ) {
            this.currentPartForm = partForm;
        //    this.$refs.planeGraphFileInput.click();
        },

        onSuccessUploadPlaneGraph( res, file, fileList ) {
            if ( res.code == 200 ) {
                this.currentPartForm.planeGraphFileName = res.attachFile.fileName;
                this.currentPartForm.planeGraphFileId = res.attachFile.id;
            } else {
                this.$error(res.message);
            }
        },

        beforeUploadPlaneGraph( file ) {
            if (!/\.(doc|DOC|png|PNG|docx|DOCX|pdf|PDF|jpg|JPG|DWG|dwg)$/.test(file.name)) {
                this.$error("只支持上传doc/docx/pdf/jpg/png/dwg格式的模型");
                return false;
            }
            if (file.size / 1024 / 2024 > 25) {
                this.$error('文件大小不能超过25M');
                return false;
            }
        },

        showUploadDlg( partForm ) {
            this.currentPartForm = partForm;
            this.uoloadDlg.visible = true;
        },
        
        closeUploadDlg() {
            this.uoloadDlg.visible = false;
        },
        showOtherFileDlg() {
            this.$refs.otherFileInput.click();
        },
        uploadOhterFile( e ) {
            
            if ( (this.currentPartForm.otherFiles.length + e.target.files.length) > 10 ) {
                this.$error('只能上传10个文件');
            } else {
                let isValid = true;
                for( var i = 0; i < e.target.files.length; i++ ) {
                    var file = e.target.files[i];
                    if ( file.size > 25*1024*1024 ){
                        isValid = false;
                        this.$error(file.name + '文件大小超过25M');
                        break;
                    }
                    if (/\.(zip|ZIP|rar|RAR|7z|7Z|tar|TAR|iso|ISO|jar|JAR|gz|GZ)$/.test(file.name)) {
                        isValid = false;
                        this.$error('不支持上传zip/rar/7z/tar等压缩格式');
                        break;
                    }
                }

                if( isValid ) {
                    for( var j = 0; j < e.target.files.length; j++) {
                        var fileItem = e.target.files[j];
                        var data = new FormData();
                        data.append('file', fileItem);
                        this.$upload.post('/uploadingFile', data).then(( res ) => {
                            if ( res.data.code == 200 ) {
                                this.currentPartForm.otherFiles.push(res.data.attachFile);
                            } else {
                                this.$error(res.data.message);
                            }
                        })
                    }
                }
            }
            this.$refs.otherFileInput.value = '';
        },
        //删除文件
        deleteOtherFileItem( file ) {
            this.currentPartForm.otherFiles.map(( item, index ) => {
                if ( item.id == file.id ) {
                    this.currentPartForm.otherFiles.splice(index,1);
                }
            })
        },

        //添加零件
        addPartForm() {
            if ( this.partForms.length >=10 ) {
                this.$error('最多可询盘十个零件');
            } else {
                var partForm = {
                    itemName:null,
                    deliveryTime:null,
                    deliveryTimeUnit:null,
                    estimateCount:null,
                    material:null,
                    expectPrice:null,
                    showExpectPrice:true,
                    modelFileIds:[],
                    planeGraphFileId:null,
                    otherFileIds:[],
                    description:null,
                    isLadderPrice:false,
                    num1: null,
                    num2: null,
                    num3: null,
                    planeGraphFileName:'',
                    modelFileNames:'',
                    modelFiles:[],
                    otherFiles:[],
                    deliveryType:''
                }
                this.partForms.push( partForm );
            }
        },

        //删除零件
        deletePartForm( index ) {
            if ( this.partForms.length >= 2 ) {
                this.partForms.splice( index, 1 );  
            }
        },

        //提交需求
        submit( isDraft ) {
            if ( this.checkForm( ) ) {
                let params = this.itemParamsHandler( isDraft );
                console.log(params);
                this.$http.post('/custom/Requirement/add',params).then((res) => {
                    if ( res.data.code == 200 ) {
                        this.$success('操作成功');
                        this.$router.push({path:'/quote/success'});
                    } else if ( res.data.code == 400 ) {
                        this.$login({}, null);
                    } else {
                        this.$error(res.data.message);
                    }
                })  
            }
        },

        
        checkForm() {

            let valid = false;

            let baseFormValid = false;
            let partFormsValid = true;

            let set = new Set();

            this.$refs['baseForm'].validate(( valid ) => {
                if ( valid ) {
                    baseFormValid = true;
                } else {
                    baseFormValid = false;
                    return false;
                }
            }) 

            for( let i = 0; i < this.partForms.length; i++ ) {
                this.$refs['partForm' + i][0].validate(( valid ) => {
                    if ( valid ) {
                        //
                    } else {
                        partFormsValid = false;
                        set.add( i );
                        return false;
                    }
                })
            } 

            this.unCheckedFormIndexs = [...set];

            if (baseFormValid && partFormsValid ) {
            //    this.itemParamsHandler();
                valid = true;
            } else {
                if ( !baseFormValid ) {
                    let scrollTopVal = this.getScrollTopValue( this.$refs['baseFormItem'] );
                    window.document.documentElement.scrollTop = scrollTopVal;
                } else {
                    if ( this.unCheckedFormIndexs.length > 0 ) {
                        let scrollTopVal = this.getScrollTopValue( this.$refs['partFormItem' + this.unCheckedFormIndexs[0] ][0] );
                        window.document.documentElement.scrollTop = scrollTopVal;
                    }
                }
            }
            return valid;
        },

        //构造请求参数  submitType
        itemParamsHandler( isDraft ) {
            var params = {
                settlementType:this.baseForm.data.settlementType,
                settlementPeriod:this.baseForm.data.settlementPeriod,
                techniqueId: this.baseForm.data.techniqueId,
                industryId: this.baseForm.data.industryId,
                estimateCount: this.partForms.length,
                offerDeadlineTime: this.baseForm.data.offerDeadlineTime,
                contactName: this.baseForm.data.contactName,
                contactPhone: this.baseForm.data.contactPhone,
                contactEmail: this.baseForm.data.contactEmail,
                enquiryType: this.baseForm.data.enquiryType,
                deliveryProvince: this.baseForm.data.addressList[0],
                deliveryCity: this.baseForm.data.addressList[1],
                companys: this.baseForm.data.companys,
                description:this.baseForm.data.description,
                priceTemplate: this.baseForm.data.priceTemplate,
                expressMode: this.baseForm.data.expressMode,
                items:[],
                draft: isDraft,
                techniqueType: this.techniqueType
            };

            if ( this.requirementId ) {
                params.id = this.requirementId;
            }
            
            this.partForms.map(( part ) => {
                var item = {
                    itemName: part.itemName,
                    deliveryTime: Number(part.deliveryTime),
                    deliveryTimeUnit: 105040,
                    estimateCount: Number(part.estimateCount),
                    material: part.material,
                    expectPrice: Number(part.expectPrice),
                    showExpectPrice: part.showExpectPrice,
                    modelFileIds: [],
                    planeGraphFileId: part.planeGraphFileId,
                    otherFileIds: [],
                    description: part.description,
                    isLadderPrice: part.isLadderPrice,
                    num1: Number(part.num1)||null,
                    num2: Number(part.num2)||null,
                    num3: Number(part.num3)||null,
                    deliveryType:part.deliveryType
                }
                if ( part.id ) {
                    item.id = part.id;
                }
                part.modelFiles.map(( model ) => {
                    item.modelFileIds.push(model.fileId);
                })
                part.otherFiles.map(( other ) => {
                    item.otherFileIds.push(other.id);
                })
                params.items.push( item );
            });

            return params;
        }
    }
}
</script>

<style lang="less">
#artificial-quotation{
    
    .add-btn{
        width: 122px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        font-size: 14px;
        color: #3f8def;
        border: 1px solid #3f8def;
        text-indent: 20px;
        background: rgba(63, 141, 239, 0.1) url(../../static/img/add-icon.png) no-repeat 17px center;
        cursor: pointer;
    }
    .content{
        width: 1200px;
        margin: 0 auto;
        .crumb-bread{
            height: 35px;
            line-height: 35px;
            .router-link{
                cursor: pointer;
                &:hover{
                    color: #3f8def;
                    text-decoration: underline;
                }
            }
            .right-arrow{
                margin: 0 5px;
            }
            .curr{
                color: #3f8def;
            }
        }
        .error-tip{
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            color: #f34747;
            background: #ffe7e7;
            margin-bottom: 23px;
            text-align: center;
        }
        .service-type{
            font-size: 32px;
            color: #3f8def;
            height: 32px;
            line-height: 32px;
            font-weight: 700;
            margin: 48px 0 37px 0;
        }
        .auto-quotation{
            margin-bottom: 65px;
            padding-bottom: 58px;
            border-bottom: 1px dashed #b9b9b9;
            .upload-model-btn{
                width: 109px;
                height: 37px;
                line-height: 37px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                border-radius: 4px;
                background-color: #3f8def;
                cursor: pointer;
            }
        }
        .form-wrapper{
            margin-top: 15px;
            .quotation-title{
                height: 16px;
                margin-bottom: 32px;
                border-left: 4px solid #3f8def;
                line-height: 16px;
                span{
                display: inline-block;
                font-size: 16px;
                color: #2e2e2e;
                text-indent: 4px;
                line-height: 16px;
                height: 16px;
                label{
                    font-size: 13px;
                    color: #aeacac;
                    margin-left: 15px;
                }
                }
            }
            .fake-input{
                width: 431px;
                height: 26px;
                border: 1px solid #d0d0d0;
                cursor: pointer;
                text-indent: 10px;
            }
            .area-select.medium{
                width: 210px !important;
            }
            .form-content-item{
                margin-bottom: 22px;
                .delete-form-content{
                    float: right;
                    margin-right: 20px;
                    cursor: pointer;
                    &:hover{
                        color: #f56c6c;
                    }
                }
                .item-title{
                    height: 14px;
                    line-height: 14px;
                    color: #777;
                    margin-bottom: 9px;
                    font-size: 14px;
                    .excel-link{
                        float: right;
                        color: #3f8def;
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }
                .form-box{
                    padding: 15px 19px 1px 19px;
                    // border: 1px solid #e2e2e2;
                    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                    background: #fff;
                    .el-form-item__error{
                        font-size: 12px;
                        top: 25px;
                    }
                    .el-select{
                        width: 431px;
                    }
                    .el-input,.el-textarea{
                        width: 431px;
                    }
                    .el-date-editor.el-input, .el-date-editor.el-input__inner{
                        width: 431px;
                    }
                    .el-form-item__label{
                        padding: 0;
                        line-height: 26px;
                        font-size: 12px;
                        width: 92px;
                        text-align: left;
                    }
                    .el-form-item.is-required .el-form-item__label:before {
                        position: absolute;
                        left: -8px;
                    }
                    .area-select{
                        height: 26px;
                        .area-selected-trigger{
                            line-height: 26px;
                            font-size: 12px;
                        }
                    }
                    .el-form-item__label{font-size: 12px;color: #777;line-height: 26px;text-align: left;}
                    .el-form-item__content{line-height: 26px;}
                    .el-form-item{position:relative;margin-bottom: 15px;}
                    .el-form-item .el-form-item{
                        margin-bottom: 0;
                    }
                    .el-icon-arrow-up:before{
                            position: absolute;
                            top: 0px;
                            left: 5px;
                    }
                    .el-radio__label,.el-checkbox__input.is-checked + .el-checkbox__label{
                        font-size: 12px;
                        color:#777;
                    }
                    .area-select.medium{
                        width: 250px;
                    }
                    .el-input__inner{
                        height: 26px !important;
                        font-size: 12px;
                    }
                    .el-autocomplete{
                        width: 100%;
                    }
                    .el-input__icon{
                        margin-top: -4px;
                    }
                    .el-form-item__content{
                        line-height: 26px;
                    }
                    .check-btn{
                        width: 135px;
                        height: 26px;
                        line-height: 25px;
                        font-size: 12px;
                        background-color: #fff;
                    }
                    .check-btn + .check-btn{
                        margin-left:13px;
                    }
                    .single-price-form-item{
                        .el-input{
                            width: 280px;
                        }
                    }
                    .hidden-price{
                        position: absolute;
                        top: 0px;
                        right: 10px;
                    }
                    .payment-type{
                        width:260px;
                        margin-left:15px;
                        .el-select{
                            width: 265px;
                        }
                        .el-input{
                            width: 265px;
                        }
                    }
                    .tech-form-item{
                        .Tree-common{
                            height: 26px;
                        }
                        .btn{
                            width: 431px;
                            height: 26px;
                            border: #d0d0d0 1px solid;
                            border-radius: 0;
                            background: #fff;
                            text-align: left;
                            padding: 0;
                            text-indent: 10px;
                            span{
                                color: #777;
                            }
                        }
                    }
                    .ladder-quotation-form-item{
                        .el-input{
                            width: 100%;
                        }
                        .form-col-text-1{
                            text-align: right;
                        }
                        .form-col-text-2{
                            padding: 0 10px;
                        }
                        .form-col-text-3{
                           text-align: center;
                           color: #9e9e9e;
                        }
                    }
                    .el-upload{
                        display: block;
                    }
                  /*   .el-button{
                        height: 30px !important;
                    } */
                    .upload-btn{
                        position: absolute;
                        top: 1px;
                        right: 0;
                        width: 65px;
                        height: 26px;
                        box-sizing: border-box;
                    //    border: 1px solid #3f8def;
                        line-height: 26px;
                        text-align: center;
                        color: #3f8def;
                        cursor: pointer;
                        background: #d2e6ff;
                    }
                    .upload-remark{
                        position: absolute;
                        top:1px;
                        left: 540px;
                        width: 400px;
                        font-size: 12px;
                        color: #9e9e9e;
                    }
                    .other-upload-remark{
                        position: absolute;
                        top:0px;
                        left: 80px;
                        width: 200px;
                        font-size: 12px;
                        color: #9e9e9e;
                    }
                    .upload-img-list{
                        margin-top: 15px;
                        .upload-img-item{
                            display: inline-block;
                            position: relative;
                            width: 80px;
                            height: 105px;
                            img{
                                display: block;
                                width: 80px;
                                height: 80px;
                                background: #f1f1f1;
                            }
                            .no-img{
                                display: block;
                                width: 80px;
                                height: 80px;
                                background: #e7e7e7;
                                text-align: center;
                                line-height: 80px;
                                font-size: 16px;
                                color: #878787;
                            }
                            p{
                            margin-top: 5px;
                            line-height: 20px;
                            text-align: center;
                            color: #9e9e9e;
                            white-space: nowrap;
                            }
                            .img-colse-icon{
                                position: absolute;
                                right: -7px;
                                top: -6px;
                                width: 14px;
                                height: 14px;
                            //      border: 1px solid #666;
                                border-radius: 50%;
                                background-image: url(../../static/img/close-red-icon.png);
                                background-repeat: no-repeat;
                                cursor: pointer;
                            }
                        }
                        .upload-img-item + .upload-img-item{
                            margin-left: 15px;
                        }
                    }
                }
            }
            .footer-btn{
               .add{
                   position: relative;
                   height: 37px;
                   .add-btn{
                       float: left;
                   }
                   .remark-info{
                       width: 250px;
                       height: 37px;
                       line-height: 37px;
                       float: left;
                       margin: 0 10px;
                       color: #9e9e9e;
                   }
               }
               .submit{
                   margin: 15px 0px 83px 0;
                   padding: 0 300px;
                   .btn{
                       width: 173px;
                       height: 38px;
                       line-height: 38px;
                       font-size: 16px;
                       text-align: center;
                       border-radius: 4px;
                       cursor: pointer;
                       border: 1px solid #3f8def;
                   }
                   .save-btn{
                       background: #f5f5f5;
                       color: #3f8def;
                       float: left;
                   }
                   .submit-btn{
                       background: #3f8def;
                       color: #fff;
                       float: right;
                   }
               }
            }
        }
    }
    .upload-dlg{
        .file-list{
            margin-top: 22px;
            .file-item{
                position: relative;
                height: 15px;
                margin-bottom: 24px;
                line-height: 15px;
            //    background: #fff url(../../static/img/red-x-icon.png) no-repeat scroll right;
                .remove-icon{
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 15px;
                    height: 15px;
                    background: #fff url(../../static/img/red-x-icon.png) no-repeat scroll center;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
