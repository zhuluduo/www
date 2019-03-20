<template>
    <div id="artificial-quotation">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <!-- <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/index'})"></span>-->
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span> 
                <span class="router-link" @click="$router.push({path:'/quote/manual'})">人工报价</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">导入询盘</span> 
            </div>
            <div class="error-tip" v-if="requirmentData.auditStatus==190030">需求被平台驳回！原因：{{requirmentData.auditRemark||''}}  这可能会导致无法给出正确的报价，请调整后继续发布。</div>
            <div class="form-wrapper">
                <div class="form-content-item" ref="baseFormItem">
                    <div class="item-title">询价信息</div>
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
                                        <v-tree  v-on:get-currentKey="techniqueChangeHandler" :max-length="1" :checked-nodes="treeModal.SelectNode" :techniqueType="530020"
                                         :checked-keys="treeModal.SelectDatas" :expand-all="false" :set-width="treeModal.width" :set-title='treeModal.title' :btn-name='treeModal.btnName' :switch-state='true'></v-tree>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="询价方式：" label-position="left" label-width="95px" prop="enquiryType" required>
                                        <v-checkBtn :title="item.title" :active="item.isCheck" @click="selectEnquiry(item)" v-for="(item,index) in enquiryTypes" :key="index">{{item.name}}</v-checkBtn>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            
                            <el-form-item label-position="top">
                                <el-col :span="11">
                                    <el-form-item required label="结算方式：" label-position="left" label-width="95px" prop="settlementType">
                                        <div style="display:flex;align-items:center;height:26px;">
                                            <el-radio-group v-model="baseForm.data.settlementType">
                                                <el-radio :label="430010">全款现付</el-radio>
                                                <el-radio :label="430020">月结</el-radio>
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
                                            <el-option :disabled="item.id==490020?true:false" v-for="item in priceTemplates" :value="item.id" :label="item.name" :key="item.id"></el-option>
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
                <div class="step-item">
                    <label>第二步：下载模板</label>
                    <a :href="excelFileUrl" style="text-decoration:underline;" class="link-with-underline">点击我下载询盘导入模板</a>
                </div>
                <div class="step-item import-step">
                    <label>第三步：导入信息</label>
                    <div class="upload-box">
                        <el-upload
                            :action="uploadUrl"
                            :with-credentials="true"
                            :limit="100"
                            :on-success="onSuccessUploadExcel"
                            :before-upload="beforeUploadExcel"
                            :show-file-list="false">
                            <el-button type="primary" size="mini">上传文件</el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="step-item view-step">
                    <label>第四步：信息预览</label>
                    <span class="help">共{{tableList.length}}个零件</span>
                    <div class="table" v-show="tableList.length>0">
                        <table>
                            <tr>
                                <td width="68px">序号</td>
                                <td width="138px">料件编号</td>
                                <td width="128px">品名</td>
                                <td width="134px">数量</td>
                                <td width="130px">单位</td>
                                <td width="152px">图号</td>
                                <td width="143px">版本号</td>
                                <td width="181px">附件</td>
                                <td width="120px">操作</td>
                            </tr>
                            <tr v-for="(item, index) in tableList" :key="'tr' + index">
                                <td>{{index+1}}</td>
                                <td>{{item.itemNumber}}</td>
                                <td>{{item.itemName}}</td>
                                <td>{{item.estimateCount}}</td>
                                <td>{{item.unit}}</td>
                                <td>{{item.picNumber}}</td>
                                <td>{{item.versionNumber}}</td>
                                <td>
                                    <div class="file-item" v-for="(fileItem,fIndex) in item.fileList" :key="fileItem.id">
                                        <div class="text ellipsis" :title="fileItem.fileName">{{fileItem.fileName}}</div>
                                        <i class="el-icon-circle-close" @click="deleteFileItem(fIndex, item.fileList)"></i>
                                    </div>
                                </td>
                                <td><span class="delete-link" @click="deleteTableItem(index)">删除</span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="step-item upload-step">
                    <label>第五步：上传附件</label>
                    <div class="upload-box">
                        <el-upload
                            :action="uploadUrl"
                            :with-credentials="true"
                            :limit="100"
                            :on-success="onSuccessUploadOther"
                            :before-upload="beforeUploadOther"
                            :show-file-list="false">
                            <el-button type="primary" :disabled="tableList.length>0?false:true" size="mini">上传文件</el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="footer-btn">
                    <div class="submit clearfix">
                        <div class="btn save-btn" @click="submit(true)">保存为草稿</div>
                        <div class="btn submit-btn" @click="submit(false)">提交需求</div>
                    </div>
                </div>
            </div>
        </div>
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
            uploadUrl: this.$baseURL + '/uploadingFile',
            excelFileUrl: this.$clientRoot + '/down/batch-up.xlsx',
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
            paymentCycles:[],//月结算周期集合
            expressModes:[],//配送方式集合
            priceTemplates:[],//报价模板集合
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
                    techniqueNames:''
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
            tableList:[],
            uoloadDlg:{
                visible: false,
            },
            requirementId: '',
            requirmentData:'',
            techniqueType:{
                THREE_PRINT:530010,
                MACHINING:530020
            }
        }
    },
    computed: {
        ...mapState({
            user: state => state.user,
        }),
    },
    watch: {
        $route: function( route ) {
    //         this.initRequirementType(); 
        }
    },
    created() {
        this.getWords();
    //    this.initRequirementType(); 
        this.getIndustrys();
        this.getCompanys( );
        
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
        },
        
        //获取所有询价、工艺列表
        getWords() {
            var wordsString = localStorage.getItem('words');
            var words = JSON.parse(wordsString);

            this.paymentCycles = words[151].item;
            this.expressModes = words[110].item;
            this.priceTemplates = words[156].item;
        },

        techniqueChangeHandler(takeDate, keyDate) {
            console.log(takeDate);
            console.log(keyDate);
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
            this.$http.post('/getManufacturerList',{keyword:keyword, techniqueTypeList:[this.techniqueType.MACHINING]}).then(( res ) => {
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

        beforeUploadExcel( file ) {

        },

        onSuccessUploadExcel( res, file, fileList ) {
            if ( res.code == 200 ) {
            //    var url = 'd:/baojiamoban.xlsx';
                var url = res.attachFile.fileUrl;
                this.$http.post('/analysisExcel',{filePath: url}).then(( respone ) => {
                    if ( respone.data.code == 200 ) {
                        if ( Array.isArray( respone.data.data ) ) {
                            this.$success('上传并解析成功');
                            respone.data.data.map(( item ) => {
                                var tableItem = { itemNumber: item[0], itemName:item[1], estimateCount: item[2], unit:item[3], picNumber: item[4], versionNumber:item[5],fileList:[]};
                                this.tableList.push(tableItem);
                            })
                        } else {
                            this.tableList = [];
                        }
                    }
                })
            } else {
                this.$error('上传失败');
            }
        },

        //获取文件前缀名称
        getPrefixName( fullFileName ) {
            var lastIndex = fullFileName.lastIndexOf('.');
            var prefixName = fullFileName.substring(0, lastIndex);
            return prefixName;
        },

        beforeUploadOther( file ) {
            var isUpload = false;
            var fileName = this.getPrefixName(file.name);
            this.tableList.map(( item ) => {
                if ( (fileName == (item.picNumber + ' ' + item.versionNumber)) || (fileName == (item.picNumber + '-' + item.versionNumber)) || (fileName == (item.picNumber + '/' + item.versionNumber)) ) {
                    isUpload = true;
                     if ( item.fileList.length > 0 ) {
                        item.fileList.map(( fileItem ) => {
                            if ( fileItem.fileName == file.name ) {
                                isUpload = false;
                            }
                        })
                    }
                } 
            })
            return isUpload;
        },

        onSuccessUploadOther( res, file, fileList ) {
            if ( res.code == 200 ) {
                var fileName = this.getPrefixName(file.name);
                this.tableList.map(( item ) => {
                    if ( (fileName == (item.picNumber + ' ' + item.versionNumber)) || (fileName == (item.picNumber + '-' + item.versionNumber)) || (fileName == (item.picNumber + '/' + item.versionNumber)) ) {
                        if ( item.fileList.length > 0 ) {
                            item.fileList.map(( fileItem ) => {
                                if ( fileItem.fileName !== res.attachFile.fileName ) {
                                    item.fileList.push(res.attachFile);
                                }
                            })
                        } else {
                            item.fileList.push(res.attachFile);
                        }
                    }
                })
                
            }
        },

        deleteFileItem(index, fileList) {
            fileList.splice( index, 1 );  
        },


        //删除零件
        deleteTableItem( index ) {
            if ( this.tableList.length >= 1 ) {
                this.tableList.splice( index, 1 );  
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
                        this.$login({}, this.getMaterials);
                    } else {
                        this.$error(res.data.message);
                    }
                })  
            }
        },

        
        checkForm() {

            let baseFormValid = false;

            this.$refs['baseForm'].validate(( valid ) => {
                if ( valid ) {
                    baseFormValid = true;
                } else {
                    baseFormValid = false;
                    return false;
                }
            }) 

            return baseFormValid;
        },

        //构造请求参数  submitType
        itemParamsHandler( isDraft ) {
            var params = {
                settlementType:this.baseForm.data.settlementType,
                settlementPeriod:this.baseForm.data.settlementPeriod,
                techniqueId: this.baseForm.data.techniqueId,
                industryId: this.baseForm.data.industryId,
                estimateCount: this.tableList.length,
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
                isExcelData:true,
            };

            this.tableList.map(( tableItem ) => {
                var item = {
                    itemName: tableItem.itemName,
                    itemNo: tableItem.itemNumber,
                    photoNo: tableItem.picNumber,
                    version: tableItem.versionNumber,
                    unit: tableItem.unit,
                    estimateCount: Number(tableItem.estimateCount),
                    otherFileIds:[]
                };
                tableItem.fileList.map(( fileItem ) => {
                    item.otherFileIds.push(fileItem.id);
                })
                params.items.push(item);
            })
            
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
                    .hidden-price{
                        position: absolute;
                        top: 0px;
                        right: -123px;
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
                   margin: 90px 0px 50px 0;
                   padding: 0 300px;
                   .btn{
                       width: 173px;
                       height: 42px;
                       line-height: 42px;
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
        .step-item{
            label{
                font-size: 14px;
            }
            .link-with-underline, .help{
                margin-left: 18px;
            }
        }
        .import-step,.view-step{
            margin-top: 13px;
        }
        .upload-box{
            display: inline-block;
            margin-left: 18px;
        }
        .upload-step{
            margin-top: 17px;
        }
        .table{
            margin-top: 9px;
            table{
                border: 1px solid #b6b6b6;
                td{
                    border: 1px solid #b6b6b6;
                    text-align: center;
                    vertical-align: middle;
                    padding: 8px 5px;
                    .file-item{
                        position: relative;
                        .text{
                            display: inline-block;
                            width: 160px;
                        }
                        .el-icon-circle-close{
                            position: absolute;
                            right: 0;
                            top: 3px;
                            color: #b6b6b6;
                            font-size: 14px;
                            cursor: pointer;
                        }
                    }
                    .delete-link{
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
