<template>
    <div id="enquiry-quotation">
        <div class="content">
            <div class="require-number">
                <span class="num" v-if="data.requirement">需求编号：{{data.requirement.requirementNo}}</span>
                <span class="state">{{data.offerStatusStr}}</span>
            </div>
          <!--   <div class="tab">
                <span class="btn" @click="$router.push({path:'/usercenter/require-detail',query:{quotationId: quotationId,requireId:requireId}})">需求明细</span>
                <span class="btn active">报价</span>
            </div> -->
            <div class="content-item">
                <div class="title">零件报价<span style="color:#f56c6c">（零件报价信息必须填写，如果某个零件不参与报价请勾选零件右侧的“不报价”）</span></div>
                <div class="content-item-box part-info-box">
                    <table>
                        <thead>
                            <tr>
                                <td width="110px">缩略图</td>
                                <td width="140px">零件名称</td>
                                <td width="130px">需求数量</td>
                                <td width="130px">交付周期</td>
                                <td width="150px">一阶梯报价</td>
                                <td width="150px">二阶梯报价</td>
                                <td width="150px">三阶梯报价</td>
                                <td width="130px">最小接单量</td>
                                <td width="130px"></td>
                            </tr>
                         </thead>
                         <tbody v-for="(item, index) in data.requirementPriceItems" :key="'tbody' + index" :ref="'requirementItem'+index">
                            <tr class="tr1">
                                <td>
                                    <img v-if="item.firstModelFileInfo" :src="item.firstModelFileInfo?item.firstModelFileInfo.thumbnailUrl:''" alt="">
                                    <div v-else class="no-upload-img">未上传</div>
                                </td>
                                <td>{{item.itemName}}</td>
                                <td>{{item.estimateCount}}</td>
                                <td>
                                    <div class="input-box">
                                        <input :class="{'red-border': item.defDeliveryTime.showErrorMsg}" :disabled="item.isAbandon" v-model="item.defDeliveryTime.value" @blur="validate($event, /^[0-9]+$/, item.defDeliveryTime)" 
                                        @input="validate($event, /^[0-9]+$/, item.defDeliveryTime)" maxlength="9" type="text" class="input-item" placeholder="">
                                        <!-- <div class="error-msg" v-if="item.defDeliveryTime.showErrorMsg">请输入交付周期</div> -->
                                    </div>
                                </td>
                                <td v-if="item.isLadderPrice">
                                    <div class="td-ladder-box">
                                        <div class="number-range">{{item.ladderPriceInfo[0].from}}-{{item.ladderPriceInfo[0].to}}</div>
                                        <div class="input-box">
                                            <input :class="{'red-border': item.price1.showErrorMsg}" v-model="item.price1.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price1)" :disabled="item.isAbandon"
                                             @input="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price1)" maxlength="9" type="text" class="input-item" placeholder="">
                                             <div class="price-unit">元/件</div>
                                            <!-- <div class="error-msg" v-if="item.price1.showErrorMsg">请输入价格</div> -->
                                        </div>
                                    </div>
                                </td>
                                <td v-if="item.isLadderPrice">
                                    <div class="td-ladder-box">
                                        <div class="number-range">{{item.ladderPriceInfo[1].from}}-{{item.ladderPriceInfo[1].to}}</div>
                                        <div class="input-box">
                                            <input :class="{'red-border': item.price2.showErrorMsg}" v-model="item.price2.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price2)" :disabled="item.isAbandon"
                                            @input="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price2)" maxlength="9" type="text" class="input-item" placeholder="">
                                            <div class="price-unit">元/件</div>
                                            <!-- <div class="error-msg" v-if="item.price2.showErrorMsg">请输入价格</div> -->
                                        </div>
                                    </div>
                                </td>
                                <td v-if="item.isLadderPrice">
                                    <div class="td-ladder-box">
                                        <div class="number-range">>{{item.ladderPriceInfo[2].from}}</div>
                                        <div class="input-box">
                                            <input :class="{'red-border': item.price3.showErrorMsg}" v-model="item.price3.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price3)" :disabled="item.isAbandon"
                                             @input="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price3)" maxlength="9" type="text" class="input-item" placeholder="">
                                             <div class="price-unit">元/件</div>
                                           <!--  <div class="error-msg" v-if="item.price3.showErrorMsg">请输入价格</div> -->
                                        </div>
                                    </div>
                                </td>
                                <td v-if="!item.isLadderPrice" colspan="3" style="text-align:left">
                                    <div class="td-ladder-box single-box">
                                        <div class="input-box">
                                            <input :class="{'red-border': item.defSinglePrice.showErrorMsg}" v-model="item.defSinglePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.defSinglePrice)" :disabled="item.isAbandon"
                                             @input="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.defSinglePrice)" maxlength="9" type="text" class="input-item" placeholder="">（单价）
                                            <!-- <div class="error-msg" v-if="item.defSinglePrice.showErrorMsg">请输入单价</div> -->
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="input-box">
                                        <input :class="{'red-border': item.defMinCount.showErrorMsg}" v-model="item.defMinCount.value" @blur="validate($event, /^[0-9]+$/, item.defMinCount)" maxlength="9" :disabled="item.isAbandon"
                                        @input="validate($event, /^[0-9]+$/, item.defMinCount)" type="text" class="input-item" placeholder="">
                                        <!-- <div class="error-msg" v-if="item.defMinCount.showErrorMsg">请输入最小接单</div> -->
                                    </div>
                                </td>
                                <td><el-checkbox v-model="item.isAbandon">不报价</el-checkbox></td>
                            </tr>
                            <tr class="tr2">
                                <td colspan="3"></td>
                                <td class="td-file" colspan="6">
                                    <div style="display:flex;justify-content:flex-end;">
                                        <div class="file-box" style="line-height:34px;padding-right: 138px;">
                                            <label>评估报告: <span v-if="item.fsrReportFileList.length==0" @click="showUploadDlg(item, 0)">上传</span><span @click="showUploadDlg(item, 0)" v-if="item.fsrReportFileList.length>0" class="file-name">查看</span></label>
                                            <label>报告详情：<span v-if="item.offerDetailFileList.length==0" @click="showUploadDlg(item, 1)">上传</span><span @click="showUploadDlg(item, 1)" v-if="item.offerDetailFileList.length>0" class="file-name">查看</span></label>
                                        </div>
                                      <!--   <div style="line-height:34px; margin-left:113px;">交付周期：</div>
                                        <div class="input-box">
                                            <input :class="{'red-border': item.defDeliveryTime.showErrorMsg}" :disabled="item.isAbandon" v-model="item.defDeliveryTime.value" @blur="validate($event, /^[0-9]+$/, item.defDeliveryTime)" @input="validate($event, /^[0-9]+$/, item.defDeliveryTime)" type="text" class="input-item" placeholder="">
                                            <div class="error-msg" v-if="item.defDeliveryTime.showErrorMsg">请输入交付周期</div> 
                                        </div> -->
                                    </div>
                                </td>
                            </tr>
                         </tbody>
                    </table>
                </div>
            </div>
            <div class="content-item added-info" ref="baseForm">
                <div class="title">报价信息</div>
                <div class="content-item-box">
                    <el-form :model="formData" :rules="rules" ref="quotationForm">
                        <el-form-item class="time-form-item">
                            <el-col :span="10">
                                <el-form-item label-posotion="left" label="报价有效期：" prop="offerInvalidTime" label-width="97px" required>
                                    <el-date-picker v-model="formData.offerInvalidTime"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <div style="visibility:hidden">1</div>
                            </el-col>
                         <!--    <el-col :span="10">
                                <el-form-item label-posotion="left" label="交付周期：" label-width="97px">
                                    <el-input></el-input>
                                </el-form-item>
                            </el-col> -->
                        </el-form-item>
                        <el-form-item class="quotation-form-item" label-posotion="left" label="报价说明：" label-width="97px">
                                <el-checkbox-group v-model="label">
                                <el-checkbox disabled label="报价含运费"></el-checkbox>
                                <el-checkbox disabled label="报价含税"></el-checkbox>
                                <el-checkbox disabled label="报价含包装费"></el-checkbox>
                            </el-checkbox-group>    
                        </el-form-item>
                        <el-form-item class="delivery-form-item" label-posotion="left" label="配送方式：" label-width="97px" required>
                            <v-checkBtn @click="selectExpressMode(item)" :active="item.isCheck" v-for="item in deliveryTypes">{{item.expressModeName}}</v-checkBtn>
                        </el-form-item>
                        <el-form-item class="invoice-form-item" label-posotion="left" label="支持发票：" label-width="97px">
                            <el-radio-group v-model="formData.invoiceTemplateId">
                                <el-radio :label="invoice.id" v-for="invoice in invoices">{{invoice.invoiceTitleTypeText}}{{invoice.invoiceTypeText}}{{invoice.taxRate*100}}%</el-radio>
                            </el-radio-group> 
                        </el-form-item>
                        <el-form-item class="contact-form-item" label-posotion="left" label="对接人：" label-width="97px">
                            <el-col :span="5">
                                <el-form-item>
                                    <el-input v-model="formData.contactName" :maxlength="20" placeholder="姓名"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item>
                                    <el-input v-model="formData.contactPhone" :maxlength="25" placeholder="电话"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item>
                                    <el-input v-model="formData.contactEmail" :maxlength="36" placeholder="邮箱"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item class="explain-form-item" label-posotion="left" label="说明：" label-width="97px">
                            <el-input v-model="formData.remark" :maxlength="200" :rows="6" type="textarea"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-dialog title="上传" width="524px" :visible.sync="uploadDlg.visible">
                <div class="upload-dlg">
                    <div class="add-btn" @click="showFileDlg">+选择文件</div>
                    <input type="file" hidden ref="fileInput" @change="uploadFile">
                    <div class="file-list" v-if="uploadDlg.fileList">
                        <div class="file-item" v-for="(file,index) in uploadDlg.fileList">
                            {{file.fileName}} 
                            <i class="remove-icon" @click="deleteFileItem(index)"></i>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary"
                    @click="closeUploadDlg" >确定</el-button>
                </span>
            </el-dialog>
            <div v-if="data.offerStatus==210010" class="form-btn-box">
                <div class="form-btn" @click="save">保存</div>
                <div class="form-btn form-next-btn" @click="submit">保存并提交</div>
            </div>
        </div>
    </div>
</template>
<script>
import BreadCrumb from '../components/breadCrumb.vue';
import CheckBtn from '../components/checkButton.vue';
export default {
    components:{
        'v-crumb': BreadCrumb,
        'v-checkBtn': CheckBtn
    },
    data() {
        return {
            pickerOptions:{
                disabledDate: function(date) {
                    if (date.getTime() < new Date().getTime()) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            currentRequirementItem:'',
            currentUploadType: 0,
            quotationId:'',
            requireId:'',
            data: '',
            label:['报价含运费','报价含税','报价含包装费'],
            tableData:[{value:'',showErrorMsg:false, isValid: false}],
            formData:{
                offerInvalidTime:'',
                invoiceTemplateId:'',
                expressMode :'',
                contactName:'',
                contactPhone:'',
                contactEmail:'',
                remark: ''
            },
            rules: {
                offerInvalidTime: [{required: true,message:'请选择有效期时间',trigger:'change'}],
            },
            invoices:[],
            deliveryTypes:[],
            uploadDlg:{
                visible: false,
                fileList:[]
            },
            requirementItemIndexs: []
        }
    },
    created() {
        this.quotationId = Number(this.$route.query.quotationId);
        this.getInvoices();
        this.getExpressModes();
        this.getFormInfo();
    },
    methods: {
        validate( e, rule, item ){
            var valid = rule.test( e.target.value );
            if( valid ) {
                item.showErrorMsg = false;
                item.isCheck = true;
            } else {
               item.showErrorMsg = true; 
               item.isCheck = false;
            }
        },

        getScrollTopValue( targetElement ) {
            var boundingClientTop = targetElement.getBoundingClientRect().top;//目标元素顶部到窗口顶部的距离
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            var maxSrcollTop = boundingClientTop + scrollTop; // 目标元素顶部到窗口顶部的最大距离或最大滚动值
            var scrollValue = maxSrcollTop - 300;//120 头部距离
            return scrollValue;
        },

        //获取数据
        getFormInfo() {
            this.$http.post('/custom/manufacturer/requirementPrice/get',{id: this.quotationId}).then((res) => {
                if ( res.data.code ==200 ) {
                    this.data = res.data.data;
                    this.formData.contactName = this.data.requirement.contactName || '';
                    this.formData.contactPhone = this.data.requirement.contactPhone || '';
                    this.formData.contactEmail = this.data.requirement.contactEmail || '';
                    this.formData.offerInvalidTime = this.data.offerInvalidTime || null;
                    this.formData.remark = this.data.remark || '';
                    this.formData.invoiceTemplateId = this.data.invoiceTemplateId || this.formData.invoiceTemplateId;
                    this.formData.expressMode = this.data.expressMode || this.formData.expressMode;

                    this.data.requirementPriceItems.map(( item ) => {
                        if ( item.isLadderPrice ) {
                            this.$set( item, 'price1', {value:item.ladderPriceInfo[0].price||'',isCheck: item.ladderPriceInfo[0].price?true:false, showErrorMsg: false,} );
                            this.$set( item, 'price2', {value:item.ladderPriceInfo[1].price||'',isCheck: item.ladderPriceInfo[1].price?true:false, showErrorMsg: false,} );
                            this.$set( item, 'price3', {value:item.ladderPriceInfo[2].price||'',isCheck: item.ladderPriceInfo[2].price?true:false, showErrorMsg: false,} );
                        } else {
                            this.$set( item, 'defSinglePrice', {value:item.singlePrice||'',isCheck: item.singlePrice?true:false, showErrorMsg: false,} );
                        }
                        this.$set( item, 'defDeliveryTime', {value:item.deliveryTime||'',isCheck: item.deliveryTime?true:false, showErrorMsg: false,} );
                        this.$set( item, 'defMinCount', {value:item.minCount||'',isCheck: item.minCount?true:false, showErrorMsg: false,} );
                        this.$set( item, 'fsrReportFileList', item.fsrReportFile?[item.fsrReportFile]:[] );
                        this.$set( item, 'offerDetailFileList', item.offerDetailFile?[item.offerDetailFile]:[] );
                    })

                    console.log(this.data);
                } else {
                    this.$error(res.data.message);
                }
            })
        },

        //获取配送方式
        getExpressModes() {
            this.$http.post('/custom/manufacturer/company/getSupportExpressMode').then(( res ) => {
                if ( res.data.code == 200 ) {
                    if ( res.data.data.length > 0 ) {
                        this.deliveryTypes = res.data.data;
                          this.deliveryTypes.map((item) => {
                            this.$set( item, 'isCheck', false );
                        })
                        this.deliveryTypes[0].isCheck = true; 
                        this.formData.expressMode = this.deliveryTypes[0].expressMode;
                    } else {
                        this.$error('未查到配送信息');
                    }
                } else {
                    this.$error(res.data.message);
                }
            })
        },

        //选择配送方式
        selectExpressMode( mode ) {
            this.deliveryTypes.map((item) => {
                item.isCheck = false;
            })
            mode.isCheck = true;
            this.formData.expressMode = this.deliveryTypes[0].expressMode;
        },

        //获取发票
        getInvoices() {
            this.$http.post('/custom/manufacturer/InvoiceTemplate/getList').then((res) => {
                if ( res.data.code ==200 ) {
                    if ( res.data.data.length > 0 ) {
                        this.invoices = res.data.data;
                        this.formData.invoiceTemplateId = this.invoices[0].id;
                    } else {
                        this.$error('未查到发票模板信息');
                    }
                } else {
                    this.$error(res.data.message);
                }
            })
        },

        //提交并保存
        submit() {
            var itemsValid = this.checkItems();
            
            var quotationFormValid = false;

            this.$refs.quotationForm.validate(( valid ) => {
                if ( valid ) {
                    quotationFormValid = true;
                } else {
                    return false;
                }
            })

            if ( itemsValid && quotationFormValid ) {
                var params = this.paramsHandler();
                this.$http.post('/custom/manufacturer/requirementPrice/saveAndQuotedPrice',params).then((res) => {
                   if ( res.data.code == 200 ) {
                       this.$message.success('保存成功');
                    //   this.getFormInfo();
                        this.$router.push({path: '/enquiry/list'});
                   } else {
                       this.$error(res.data.message);
                   }
               })
            } else {
                if ( this.requirementItemIndexs.length > 0 ) {
                    let scrollTopVal = this.getScrollTopValue( this.$refs['requirementItem' + this.requirementItemIndexs[0]][0] );
                    window.document.documentElement.scrollTop = scrollTopVal;
                } else {
                    let scrollTopVal = this.getScrollTopValue( this.$refs['baseForm']);
                    window.document.documentElement.scrollTop = scrollTopVal;
                }
            }
        },

        checkItems() {
            var itemsValid = true;
            let set = new Set();

            this.data.requirementPriceItems.map(( item, index ) => {
                if ( !item.isAbandon ) {
                    if ( item.isLadderPrice ) {
                        if ( !item.price1.isCheck ) {
                            item.price1.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
                        if ( !item.price2.isCheck ) {
                            item.price2.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
                        if ( !item.price3.isCheck ) {
                            item.price3.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
                    } else {
                        if ( !item.defSinglePrice.isCheck ) {
                            item.defSinglePrice.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
                    }
                
                    if ( !item.defMinCount.isCheck ) {
                        item.defMinCount.showErrorMsg = true;
                        itemsValid = false;
                        set.add( index );
                    }
                    if ( !item.defDeliveryTime.isCheck ) {
                        item.defDeliveryTime.showErrorMsg = true;
                        itemsValid = false;
                        set.add( index );
                    }
                }
                
            })

            this.requirementItemIndexs = [...set];
            return itemsValid;
        },

        //保存
        save( ) {
            var itemsValid = this.checkItems();
            
            var quotationFormValid = false;

            this.$refs.quotationForm.validate(( valid ) => {
                if ( valid ) {
                    quotationFormValid = true;
                } else {
                    return false;
                }
            })

            if ( itemsValid && quotationFormValid ) {
                var params = this.paramsHandler();
                this.$http.post('/custom/manufacturer/requirementPrice/save',params).then((res) => {
                    if ( res.data.code == 200 ) {
                        this.$message.success('保存成功');
                    } else {
                        this.$error(res.data.message);
                    }
                })
            }

        },

        paramsHandler() {
            var params = {
                id: this.quotationId,
                offerInvalidTime: this.formData.offerInvalidTime,
                expressMode: this.formData.expressMode,
                invoiceTemplateId: this.formData.invoiceTemplateId,
                contactName: this.formData.contactName,
                contactPhone: this.formData.contactPhone,
                contactEmail: this.formData.contactEmail,
                remark: this.formData.remark ,
                items: []
            }
            this.data.requirementPriceItems.map(( item ) => {
                var requirement = {
                    requirementPriceItemId:item.id,
                    singlePrice: null,
                    ladderPriceInfo: [],
                    minCount: Number(item.defMinCount.value),
                    isAbandon: item.isAbandon,
                    deliveryTime: Number(item.defDeliveryTime.value),
                    fsrReportFileId: item.fsrReportFileList.length > 0 ? item.fsrReportFileList[0].id:null,
                    offerDetailFileId: item.offerDetailFileList.length > 0 ? item.offerDetailFileList[0].id:null,
                }
                if ( item.isLadderPrice ) {
                    requirement.ladderPriceInfo.push({from: item.ladderPriceInfo[0].from, to: item.ladderPriceInfo[0].to, price: Number(item.price1.value)});
                    requirement.ladderPriceInfo.push({from: item.ladderPriceInfo[1].from, to: item.ladderPriceInfo[1].to, price: Number(item.price2.value)});
                    requirement.ladderPriceInfo.push({from: item.ladderPriceInfo[2].from, price: Number(item.price3.value)});
                } else {
                    requirement.singlePrice = item.defSinglePrice.value
                }
                params.items.push(requirement);
            })

            console.log(params);

            return params;
        },

        //关闭弹窗
        closeUploadDlg() {
            this.uploadDlg.visible = false; 
        },

        //删除文件
        deleteFileItem( index ) {
            this.uploadDlg.fileList.splice( index, 1 );  
        },

        //上传文件
        uploadFile( e ) {
            var file = e.target.files[0];
            if (!/\.(doc|DOC|xlsx|XLSX|ppt|PPT|pdf|PDF|XLS|xls|docx|DOCX)$/.test(file.name)) {
                this.$error("只支持上传doc/ppt/pdf/xls/docx格式的文件");
            }  else if( file.size > 25*1024*1024 ){
                this.$error("文件大小不能超过25M");
            } else {
                var data = new FormData();
                data.append("file", file);
                this.$upload.post('/uploadingFile', data).then(( res ) => {
                    if ( res.data.code == 200 ) {
                        if ( this.currentUploadType === 0 ) {
                            this.currentRequirementItem.fsrReportFileList = [];
                            this.currentRequirementItem.fsrReportFileList.push(res.data.attachFile);
                            this.uploadDlg.fileList = this.currentRequirementItem.fsrReportFileList;
                        } else {
                            this.currentRequirementItem.offerDetailFileList = [];
                            this.currentRequirementItem.offerDetailFileList.push(res.data.attachFile);
                            this.uploadDlg.fileList = this.currentRequirementItem.offerDetailFileList;
                        }
                    } else {
                        this.$error(res.data.message);
                    }
                })
            }
            this.$refs.fileInput.value = '';
        },

        //显示文件选择弹窗
        showFileDlg() {
            this.$refs.fileInput.click();
        },

        //显示上传文件弹窗
        showUploadDlg( item, flag ) {
            this.currentRequirementItem = item;
            this.currentUploadType = flag;
            if ( flag === 0 ) {
                this.uploadDlg.fileList = item.fsrReportFileList;
            } else {
                this.uploadDlg.fileList = item.offerDetailFileList;
            }
            this.uploadDlg.visible = true;
        }
    }
}
</script>
<style lang="less">
#enquiry-quotation{
    div{
        box-sizing: border-box;
    }
    .error-msg{
        position: absolute;
        top: 36px;
        left: 5px;
        width: 200px;
        font-size: 12px;
        color: #f56c6c;
        text-align: left;
    }
    .el-form-item{
        position: relative;
    }
    .el-form-item.is-required .el-form-item__label:before {
        position: absolute;
        left: -8px;
    }
    .content{
        width: 1200px;
    //    padding: 0 15px;
        margin: 0 auto;
        .require-number{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 65px;
            margin-bottom: 25px;
            border-bottom: 1px solid #e2e2e2;
            font-size: 18px;
            .state{
                font-size: 14px;
                margin-left: 30px;
                line-height: 65px;
                color: #3f8def;
            }
            .btn{
                display: inline-block;
                width: 82px;
                height: 30px;
                background-color: #3f8def;
                border-radius: 4px;
                color: #fff;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
            }
        }
        .tab{
            height: 35px;
            border-bottom: 1px solid #3f8def;
            margin-bottom: 26px;
            .btn{
                display: inline-block;
                height: 35px;
                width: 98px;
                text-align: center;
                line-height: 35px;
                cursor: pointer;
            }
            .active{
                color: #fff;
                background: #3f8def;
            }
        }
        .content-item{
            margin-bottom: 32px;
            .title{
                margin-bottom: 10px;
                font-weight: 700;
            }
            .content-item-box{
                padding: 22px 25px;
                background: #f5f5f5;
                .row-info{
                    height: 14px;
                    line-height: 14px;
                    margin-bottom: 26px;
                }
                .beautiful-line{
                    border-bottom: 1px solid #e2e2e2;
                    margin-bottom: 21px;
                }
                .multi-row-info{
                    display: flex;
                    line-height: 28px;
                    margin-bottom: 21px;
                }
                .contact-info{
                    margin-bottom: 0;
                }
                table{
                    border: 1px solid #e2e2e2;
                    thead td{
                        text-align: center;
                        background: #f5f5f5;
                        height: 44px;
                        vertical-align: middle;
                        border-bottom: 1px solid #e2e2e2;
                        .fs12{
                            font-size: 12px;
                        }
                    }
                    tbody{
                        border-bottom: 1px solid #e2e2e2;
                        tr{
                            td{
                                background: #fff;
                            }
                        }
                        .tr1{
                            td{
                               text-align: center;
                               vertical-align: middle;
                               padding: 21px 8px 21px 8px;
                            //   border-bottom: 1px dashed #e2e2e2;
                               img{
                                   display: block;
                                   width: 60px;
                                   height: 60px;
                                   margin: 0 auto;
                               }
                               .no-upload-img{
                                    display: block;
                                    width: 60px;
                                    height: 60px;
                                    margin: auto;
                                    background: #e7e7e7;
                                    text-align: center;
                                    line-height: 60px;
                                    font-size: 16px;
                                    color: #878787;
                                } 
                               .td-ladder-box{
                                    position: relative;
                                    .number-range{
                                        font-size: 12px;
                                        color: #b1b1b1;
                                        margin-bottom: 5px;
                                    }
                                    .price-unit{
                                        margin-top: 5px;
                                        font-size: 12px;
                                        color: #888888;
                                    }
                               }
                               .single-box{
                                   padding-left: 20px;
                               }
                               .input-box{
                                   position: relative;
                                    .red-border{
                                        border: 1px solid #f56c6c;
                                    }
                               }
                               .input-item{
                                   width: 92px;
                                   height: 34px;
                                   border: 1px solid #d3d3d3;
                                   box-sizing: border-box;
                                //   text-indent: 10px;
                                   text-align: center;
                               }
                            }
                        }
                        .tr2{
                            td{
                                padding: 23px 0;
                            }
                            .input-box{
                                position: relative;
                                margin-left: 20px;
                                .red-border{
                                    border: 1px solid #f56c6c;
                                }
                            }
                            .input-item{
                                width: 92px;
                                height: 34px;
                                border: 1px solid #d3d3d3;
                                box-sizing: border-box;
                                text-indent: 10px;
                            }
                            .td-file{
                                border-top: 1px dashed #e2e2e2;
                                label + label {
                                    margin-left: 82px;
                                }
                                span{
                                    color: #3f8def;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
            }
            .part-info-box{
                padding: 0;
            }
        }
        .added-info{
            .el-form-item__label{
                text-align: left;
            }
            .time-form-item{
                margin-bottom: 12px;
            }
            .delivery-form-item{
                margin-bottom: 12px;
            }
            .contact-form-item{
                .el-col{
                    margin-right: 29px;
                }
            }
            .invoice-form-item{
                margin-bottom: 10px;
                .el-form-item__content{
                }
                .el-radio-group{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    .el-radio{
                        flex:0 0 25%;
                        margin: 5px 0 5px 0;
                    }
                }
            }
            .explain-form-item{
                .el-textarea{
                    width: 934px;
                }
                margin-bottom: 0;
            }
            .quotation-form-item{
                 margin-bottom: 10px;
            }
            .check-btn + .check-btn{
                margin-left: 15px;
            }
        }
        .form-btn-box{
            display: flex;
            justify-content: space-around;
            margin-top: 30px;
            padding: 0 320px;
            .form-btn{
                width: 90px;
                height: 40px;
                border: 1px solid #3f8def;
                border-radius: 4px;
                box-sizing: border-box;
                color: #3f8def;
                line-height: 40px;
                text-align: center;
                cursor: pointer;
            }
            .form-next-btn{
                color: #fff;
                background: #3f8def;
            }
        }
        .add-btn{
            width: 122px;
            height: 37px;
            text-align: center;
            line-height: 36px;
            font-size: 16px;
            color: #3f8def;
            border: 1px solid #3f8def;
            text-indent: 20px;
            background: rgba(63, 141, 239, 0.1) url(../../static/img/add-icon.png) no-repeat 17px center;
            cursor: pointer;
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
}
</style>
