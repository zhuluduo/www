<template>
    <div class="manufacturer">
        <!-- <div class="right-title">成为供应商</div> -->
        <div class="manufactorMain">
          <div v-if="Form.AuditStatus !=1">
            <div class="manufactorTitle">
                <b>填写供应商生产资质</b>
                <span>(资质越完善，越容易通过审核哦~)</span>
                <p v-if="Form.AuditStatus==2">供应商审核未通过，请检查后再提交！</p>
            </div>
            <div class="form-box">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="雇员数量：" prop="employeeScale">
                        <el-select v-model="ruleForm.employeeScale" clearable style="width: 488px;"  placeholder="请选择">
                        <el-option v-for="(item,index) in Form.employeeScaleData" :label="item.name" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="涉及工艺：" prop="techniqueList">
                         <div class="BusinessType">
                            <el-checkbox-group v-model="ruleForm.techniqueList">
                                <el-checkbox v-for="(item,index) in Form.techniqueData" :label="item.id" :key="index"  @change="techniqueType">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                         </div>
                    </el-form-item>
                    <el-form-item label="国家/地区：" prop="country">
                        <template>
                        <div class="select-area"  style="width: 488px;">
                            <el-select v-model="ruleForm.country" placeholder="请选择国家/地区" @change='countryInfo(ruleForm.country)' style="width: 488px;">
                              <el-option v-for="item in Form.countryInfo" :label="item.name" :value="item.id" :key="item.id" ></el-option>
                            </el-select>
                        </div>
                    </template>
                     </el-form-item>
                    <el-form-item label="省/市/区：" v-if="selectStats !=true" prop="selectList">
                        <template>
                        <div class="select-area"  style="width: 488px;">
                            <area-select type="text"  :data="$areaData" v-model="ruleForm.selectList" :level="2"></area-select>
                        </div>
                    </template>
                    </el-form-item>
                     <el-form-item v-if="selectStats ==true"  label="省/市/区：" prop="selectData">
                        <div class="selectData" >
                        <el-select v-model="ruleForm.selectData" disabled placeholder="请选择"><el-option label="" value=""></el-option></el-select>
                        <el-select v-model="ruleForm.selectData" disabled placeholder="请选择"><el-option label="" value=""></el-option></el-select>
                        <el-select v-model="ruleForm.selectData" disabled placeholder="请选择"><el-option label="" value=""></el-option></el-select>
                        </div>
                     </el-form-item>
                    <el-form-item label="企业地址："  prop="address">
                      <el-input v-model="ruleForm.address"  style="width: 488px;"  placeholder="街道、门牌号、楼宇" ></el-input>
                    </el-form-item>
                    <el-form-item label="企业logo：" >
                        <div class="uploadImg">
                            <span class="uploadImgName">{{Form.logoName}}</span>
                            <el-upload
                            class="upload-demo"
                            action="http://dw.tatfookcloud.com/upload"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUploadLogo"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :on-remove="handleRemove"
                            :file-list="Form.logoUrl"
                            list-type="picture">
                            <el-button size="small" type="primary"
                            list-type="picture">上传</el-button>
                            <span class="remark">
                                小于200KB的图片,格式：.png、.jpg、.jepg
                            </span>
                        </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="营业执照：" prop="acLicenseFileId" class="productionLicenseFileId">
                        <div class="uploadImg">
                            <span class="uploadImgName">{{Form.productionLicenseName}}</span>
                            <el-upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="productionLicenseUrl"
                            :before-upload="beforeAvatarUpload"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :on-remove="handleRemove"
                            :file-list="Form.acLicenseFileId"
                            list-type="picture">
                            <el-button size="small" type="primary">上传</el-button>
                            <span class="remark">
                                小于2M的图片,格式：.png、.jpg、.jepg
                            </span>
                        </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="开户许可证：" prop="bsLicenseFileId" class="taxCertificateFileId">
                        <div class="uploadImg">
                            <span class="uploadImgName">{{Form.taxCertificateName}}</span>
                            <el-upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="taxCertificateUrl"
                            :before-upload="beforeAvatarUpload"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :on-remove="handleRemove"
                            :file-list="Form.bsLicenseFileId"
                            list-type="picture">
                            <el-button size="small" type="primary">上传</el-button>
                            <span class="remark">
                               小于2M的图片,格式：.png、.jpg、.jepg
                            </span>
                        </el-upload>
                        </div>
                    </el-form-item>
                </el-form>
            <div class="submitform">
                <button @click="submitForm('ruleForm')">提交资质</button>
            </div>
            </div>
          </div>
         <div class="PromptText" v-if="Form.AuditStatus ==1">
             <img src="../../static/img/AuditSuccess_icon.png" alt="">
             <span>您的资料已经提交!</span>
             <span>平台正在审核您的信息，请耐心等待。</span>
         </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            statIndex:0,
            uploadUrl:this.$baseURL + '/uploadingFile',
            selectStats:false,
            Form:{
              AuditStatus:0,
              employeeScaleData:[],
              techniqueData:[],
              fileList:[],
              logoUrl:[],
              acLicenseFileId:[],
              bsLicenseFileId:[],
              logoName:'',
              productionLicenseName:'',
              taxCertificateName:'',
              country:[{value:1, label:'中国'}],
              countryInfo:[],
            },
            ruleForm:{
                employeeScale:'',
                techniqueList:[],
                selectList:[],
                address:'',
                logoUrl:'',
                acLicenseFileId:'',
                bsLicenseFileId:'',
                country:[],
                selectData:['1'],//省市区切换(假)
            },
            rules: {
               employeeScale:[
                  { required: true, message: '请选择雇员数量', trigger: 'change' }
                ],
                techniqueList:[
                    { type: 'array', required: true, message: '请至少选择一个生产工艺', trigger: 'change' }
                ],
                country: [
                    { required: true, message: '请选择国家/地区', trigger: 'change' }
                ],
                selectList:[
                    {required: true, message: '请您选择地址' }
                ],
                address:[
                    { required: true, message: '请填写详细地址', }
                ],
                // logoUrl:[
                //     { required: true, message: '请上传企业logo图片'}
                // ],
                acLicenseFileId:[
                    { required: true, message: '请上传营业执照'}
                ],
                bsLicenseFileId:[
                    { required: true, message: '请上传开户许可证'}
                ]
            }
        }
    },
    methods: {
    /*审核状态*/
    initialStat(){
     let _this=this;
     _this.statIndex=1;
     let url='/custom/manufacturer/company/getApplyManufacturerStatus'
     _this.$http.post(url).then(res=>{
         if(res.data.data.manufacturerAuditStatus===-1){
             _this.Form.AuditStatus=0
         }else if(res.data.data.manufacturerAuditStatus===190030){
             _this.Form.AuditStatus=2
         }else if(res.data.data.manufacturerAuditStatus===190010){
             _this.Form.AuditStatus=1
         }else if(res.data.data.manufacturerAuditStatus===190020){
             _this.Form.AuditStatus=3
         }
          if(parseInt(res.data.data.applyData.country) !=350000){
                this.selectStats=true;
          }
        let data=res.data.data.applyData;
        _this.ruleForm={
            employeeScale:res.data.data.applyData.employeeScale,
            techniqueList:res.data.data.applyData.techniqueList,
            selectList:parseInt(data.country)==350000?[data.province,data.city,data.region]:[],
            address:res.data.data.applyData.address,
            logoUrl:res.data.data.applyData.logoUrl,
            acLicenseFileId:res.data.data.applyData.acLicenseFile.id,
            bsLicenseFileId:res.data.data.applyData.bsLicenseFile.id,
            country:parseInt(data.country),
        }
           _this.Form.logoUrl=[{url:res.data.data.applyData.logoUrl}]
           _this.Form.acLicenseFileId=[{id:res.data.data.applyData.acLicenseFile.id,url:res.data.data.applyData.acLicenseFile.url}]
           _this.Form.bsLicenseFileId=[{id:res.data.data.applyData.bsLicenseFile.id,url:res.data.data.applyData.bsLicenseFile.url}]
     })
    },
    /*涉及工艺*/
    techniqueType(){
      if(this.ruleForm.techniqueList.length>5){
          this.ruleForm.techniqueList.pop();
          this.$message({
          message: '工艺最多5项',
          type: 'warning'
        });
      }
    },
    /*根据国家判定省市区toggle*/
    countryInfo(val){
      if(val !=350000){
        this.ruleForm.selectList=[];
        this.selectStats=true;
      }else{
         this.selectStats=false;
      }
    },
     /*上传logo*/
     handleAvatarSuccess(response, file, fileList) {
        let _this=this;
        _this.Form.logoName=file.name
        _this.ruleForm.logoUrl=response.data.img_url;
      },
      /*营业执照*/
      productionLicenseUrl(response, file, fileList){
        let _this=this;
        _this.Form.productionLicenseName=file.name
        _this.ruleForm.acLicenseFileId=response.attachFile.id;
      },
      /*开户许可证*/
      taxCertificateUrl(response, file, fileList){
        let _this=this;
        _this.Form.taxCertificateName=file.name
        _this.ruleForm.bsLicenseFileId=response.attachFile.id;
      },
      /*上传提示--公共*/
      beforeAvatarUploadLogo(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'||file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 0.2;
        if (!isJPG) {
          this.$error('上传图片只能是 JPG,PNG,JPEG,GIF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 200KB!');
        }
        return isJPG&&isLt2M;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'||file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$error('上传图片只能是 JPG,PNG,JPEG,GIF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2M!');
        }
        return isJPG&&isLt2M ;
      },

      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      /*数据删除*/
      handleRemove(file, fileList) {
          let _this=this;
          switch (file.name)
            {
            case _this.Form.logoName:
                _this.Form.logoName='';
                _this.ruleForm.logoUrl=''
                break;
            case _this.Form.productionLicenseName:
                _this.Form.productionLicenseName='';
                _this.ruleForm.acLicenseFileId='';
                break;
            case _this.Form.taxCertificateName:
                _this.Form.taxCertificateName='';
                _this.ruleForm.bsLicenseFileId='';
                break;
            }
            if(file.id==undefined){
                if(file.url===_this.ruleForm.logoUrl){
                _this.ruleForm.logoUrl=''
            }
            }
            if(file.id !=undefined){
            switch (file.id)
            {
            case _this.ruleForm.acLicenseFileId:
                _this.ruleForm.acLicenseFileId='';
                break;
            case _this.ruleForm.bsLicenseFileId:
                _this.ruleForm.bsLicenseFileId='';
                break;
            }
            }
      },
      /*数据提交*/
      submitForm(formName) {
        let _this=this
        let url='/custom/manufacturer/company/applyManufacturer'
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.ruleForm.province=this.selectStats==false?_this.ruleForm.selectList[0]:'';
            _this.ruleForm.city=this.selectStats==false?_this.ruleForm.selectList[1]:'';
            _this.ruleForm.region=this.selectStats==false?_this.ruleForm.selectList[2]:'';
            _this.$http.post(url,_this.ruleForm).then(res=>{
                if(res.data.code == 200){
                    this.Form.AuditStatus=1
                }else{
                    this.Form.AuditStatus=0
                    this.$message({
                      type: "error",
                      message: res.data.message,
                      duration:1000
                    });
                }
            })
          } else {
            return false;
          }
        });
      },

    },
    mounted(){
        let _this=this;
        //获取个人信息枚举
        let user = localStorage.getItem('words');
        var jsonObj = JSON.parse(user);
        for(let i in jsonObj){
        if(i==105){
         _this.Form.techniqueData=jsonObj[i].item
        }
        if(i==125){
        _this.Form.employeeScaleData=jsonObj[i].item
        }
        if(i==142){_this.Form.countryInfo=jsonObj[i].item}
       }
       _this.initialStat();
    }
}
</script>
<style lang="less">
    .manufactorMain{
      .el-form-item__label{
         text-align: left;
      }
      .el-form-item.productionLicenseFileId label,.el-form-item.taxCertificateFileId label{width: 100px!important;margin-right: 0;padding-right: 0;}}
    .el-form-item.productionLicenseFileId,.el-form-item.taxCertificateFileId{
        .el-upload-list__item{margin-left: 2px;}
    }
    .uploadImg{
      .upload-demo{
          .el-upload-list__item-name{display:none;}
          ul{
            .el-upload-list__item{
                width: 80px;
                height:80px;
                border: solid 1px #e2e2e2;
                position: relative;
                overflow: inherit;
                padding: 0;
                border-radius: 0;
                .el-upload-list__item-status-label,.el-icon-close-tip{display:none!important;}
                .el-upload-list__item-thumbnail{
                    vertical-align: middle;
                    display: inline-block;
                    width: 78px;
                    height: 75px;
                    float: left;
                    position: relative;
                    z-index: 1;
                    margin: 2px 0 0 0;
                    z-index: -1;
                }
                .el-icon-close{
                    display:block!important;
                    width: 14px;
                    height: 14px;
                    background-color: #f84b4b;
                    border-radius: 50%;
                    top: -7px;
                    right: -5px;
                    &::before{
                        font-size: 13px !important;
                        color: #fff;
                        padding-left: 1px;
                    }
                    }
            }
          }
      }
    }
.selectData{
   .el-select{
      width: 160px!important;
   }}
</style>

<style lang="less" scoped>
    .manufacturer{
        width: 1200px;
        margin: auto;
        margin-bottom: 100px;
        .right-title {
            position: absolute;
            top: -28px;
            left: 0px;
            width: 100%;
            height: 20px;
            font-size: 14px;
            color: #333;
        }
        .manufactorMain{
            margin: 39px 48px 0 48px;
            .manufactorTitle{
                width: 800px;
                margin-bottom: 25px;
                // b{

                // }
                span{
                    margin-left: 16px;
                    color: #9e9e9e;
                    font-size: 12px;

                }
                p{
                    text-align: center;
                    background: rgba(255, 233, 233, 0.8);
                    margin-top: 10px;
                    width: 908px;
                    height: 32px;
                    line-height: 32px;
                    color: #ff2c2c;
                }
            }
            .BusinessType{
                width: 488px;
                height: 152px;
                overflow-x: hidden;
                overflow-y: scroll;
                border: 1px solid #e2e2e2;
                padding: 7px 0;
                label{display: block;margin-left: 0!important;padding: 2px 10px;line-height: 0!important;}
                label+label{margin-bottom: 5px;}
            }
            .upload{
                position: absolute;
                left: 406px;
                top:0px;
            }
            .uploadBtn{
                height: 34px;
                width: 54px;
                background-color: #e2e2e2;
                padding: 0;
                border: none;
                margin: 0;
                color: #9e9e9e;
                cursor: pointer;
            }
            .uploadBtn:hover{
                color: #fff;
                background-color: #3f8def;
            }
            .remark{
                margin-left: 11px;
                font-size: 13px;
                color: #9e9e9e;
            }
            .submitform{
                display: flex;
                justify-content: center;
                margin-top: 90px;
                button{
                    width: 204px;
                    height:42px; ;
                    padding: 0;
                    margin: 0;
                    border: 1px solid #3f8def;
                    background-color:#3f8def;
                    border-radius: 5px;
                    color: #fff;
                    cursor: pointer;
                }
            }

            .uploadImg{
                 position: relative;
                .uploadImgName{
                    display: inline-block;
                    width: 435px;
                    height: 32px;
                    line-height: 32px;
                    padding-left: 10px;
                    box-sizing: border-box;
                    float: left;
                    background-color: #ffffff;
                    border: solid 1px #e2e2e2;
                }
                .upload-demo{
                    line-height: 30px;
                    // height: 34px;
                  button{
                    width: 54px;
                    height: 32px;
                    color: #3f8def;
                    background-color: #d2e6ff!important;
                    border: none;
                    line-height: 0!important;
                    border-radius: 0!important;
                    line-height: 2!important;
                    padding: 0!important;
                  }
                }
            }
        }
    }
    //提交审核信息提示
    .PromptText{
        width: 100%;
        text-align: center;
        font-size: 22px;
        line-height: 41px;
        font-weight: bold;
        margin-top: 20%;
        img{width: 100px;height: 100px;}
        span{
         display: block;
        }
     }
</style>


