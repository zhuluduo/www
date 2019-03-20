<template>
    <div class="company-information">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item>需供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/main/manufacturer-manage' }">企业供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>企业资料</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="company-information-main">
            <div class="company-information-tabs">
              <el-button type="primary" size="small" class="btnUpload" @click="UploadSave('dynamicValidateForm')" :loading="this.saveLoading" v-if="UploadName=='second'">保存</el-button>
                <el-tabs v-model="activeName" @tab-click="handleClick" class="information-tabs-box">
                    <el-tab-pane label="企业资料" name="first">
                       <v-informationList v-bind:information-list.sync="DetailsPage" ></v-informationList>
                    </el-tab-pane>
                    <el-tab-pane label="修改资料" name="second">
                    <div id="modify-data">
                    <v-informationModify  @Save-list="SaveList"  v-bind:modify-data.sync="dynamicValidateForm.invoiceInfo" v-bind:modify-list.sync="dynamicValidateForm" v-bind:upload-save="SaveState"></v-informationModify>
                    </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>


<script>
import informationList from './company-information-list'
import informationModify from './company-information-modify'
export default {
   data(){
       return{
       //企业资料列表
        DetailsPage:{},

        //企业资料修改
        SaveState:false,
        saveLoading:false,
        activeName: 'first',
        UploadName:'',
        dynamicValidateForm:{},
        invoiceData:[],
       }
   },
    components: {
      "v-informationList": informationList,
      "v-informationModify": informationModify,
    },
   created(){
    this.modifyCreated();
   },
   methods:{

    /*企业资料*/
      handleClick(tab, event) {
        this.UploadName=tab.name; //上传按钮显隐
      },

    modifyCreated(){
        let params={
            companyId:parseInt(this.$route.query.companyId),
        }
        let url="/custom/company/getCompanyDetail";
        this.$http.post(url,params).then(res=>{
            if(res.data.code==200){
            let data=res.data.data;
                if(JSON.stringify(data) == "{}"){
                    data=[];
                }
                if(JSON.stringify(data.qualificationInfo) == "{}"){
                    data.qualificationInfo=[]
                }
                if(JSON.stringify(data.techniqueInfo) == "{}"){
                    data.techniqueInfo=[]
                }
                this.DetailsPage={
                    logoUrl:data.logoUrl,
                    companyName:data.companyName,
                    shortName:data.shortName,
                    extendInfo:data.extendInfo,
                    equipmentInfo:data.equipmentInfo,
                    qualificationInfo:data.qualificationInfo,
                    creditInfo:data.creditInfo,
                    techniqueInfo:data.techniqueInfo,
                    certInfo:data.certInfo,
					manufacturerAuditReport:data.manufacturerAuditReport,
                    country:data.country,
                    countryStr:data.countryStr,
                    contactsInfo:data.contactsInfo,
                    collectionAccount:data.collectionAccount,
                    invoiceInfo:data.invoiceInfo,
                    province:data.province,
                    city:data.city,
                    region:data.region,
                    address:data.address,
                    companyClassStr:data.companyClassStr,
                    foundingTime:data.extendInfo.foundingTime,
                    companyPropertyStr:data.companyPropertyStr,
                    coopInfo:data.coopInfo,
                    industryName:data.coopInfo.firstIndustry.industryName,
                    isDemand:data.isDemand,
                    isManufacturer:data.isManufacturer,
                    contract:data.contract,
                }
                let techniqueInfo=[];
                let techniqueData=[];
                let industryInfo=[];
                let creditInfo=[];
                let certInfos=[];
                let qualificationInfo=[];
                for(let item in data.techniqueInfo){
                    techniqueInfo.push(data.techniqueInfo[item].techniqueId)
                }
                for(let item in data.coopInfo.industryInfo){
                    industryInfo.push(data.coopInfo.industryInfo[item].id)
                }
                for(let item in data.creditInfo){
                    let creditInfoData={
                    certName:'',
                    id:data.creditInfo[item].id,
                    certType:data.creditInfo[item].certType,
                    fileId:data.creditInfo[item].file.id,
                    url:data.creditInfo[item].file.fileUrl
                    }
                    creditInfo.push(creditInfoData)
                }
                for(let item in data.certInfo){
                    let fileInfo=data.certInfo[item].file;
                    let certInfoData={
					canDelete:data.certInfo[item].canDelete,
                    certName:data.certInfo[item].certName,
                    id:data.certInfo[item].id,
                    certType:data.certInfo[item].certType,
                    }
                    if(fileInfo!=undefined){
                        certInfoData.name=fileInfo.fileName;
                        certInfoData.fileId=fileInfo.id;
                        certInfoData.url=fileInfo.fileUrl;
                    }
                    certInfos.push(certInfoData)
                }
                for(let item in data.qualificationInfo){
                    let certInfoData={
                        qualificationType:data.qualificationInfo[item].qualificationType,
                        qualificationName:data.qualificationInfo[item].qualificationName,
                        qualificationIndate:data.qualificationInfo[item].qualificationIndate,
                        id:data.qualificationInfo[item].id,
                        fileName:data.qualificationInfo[item].file!=undefined?data.qualificationInfo[item].file.fileName:'',
                        fileUrl:data.qualificationInfo[item].file!=undefined?data.qualificationInfo[item].file.fileUrl:'',
                        fileId:data.qualificationInfo[item].file!=undefined?data.qualificationInfo[item].file.id:'',
                    }
                    qualificationInfo.push(certInfoData)
                }
                this.dynamicValidateForm={
                companyName:data.companyName,
                shortName:data.shortName,
                logoUrl:data.logoUrl,
                equipmentInfo:data.equipmentInfo,
                qualificationInfo:qualificationInfo,
                manufacturerAuditReport:data.manufacturerAuditReport,
                countryStr:data.countryStr !=undefined?data.countryStr:'',
                country:data.country !=undefined?parseInt(data.country):'',
                coopInfo:{
                    orderType:data.coopInfo.orderType===310010?'310010':'310020',
                    exportMarket:data.coopInfo.exportMarket===undefined?[]:data.coopInfo.exportMarket,
                    firstIndustryId:data.coopInfo.firstIndustry.industryId,
                    firstCustomer:data.coopInfo.firstCustomer,
                    secondCustomer:data.coopInfo.secondCustomer,
                    thirdCustomer:data.coopInfo.thirdCustomer,
                },
                mainWorksCopy:data.coopInfo.mainWorks.join(),
                coopCompanysCopy:data.coopInfo.coopCompanys.join(),
                industryInfo:industryInfo,
                techniqueInfo:techniqueInfo,
                techniqueData:data.techniqueInfo,
                selectList:parseInt(data.country)==350000?[data.province,data.city,data.region]:[],
                address:data.address,
                companyClass:data.companyClass,
                contactInfo:[],
                invoiceInfo:data.invoiceInfo,
                collectionAccount:data.collectionAccount,
                contactsInfo:data.contactsInfo,
                extendInfo:{
                    introduceInfo:data.extendInfo.introduceInfo,
                    foundingTime:data.extendInfo.foundingTime,
                    employeeScale:data.extendInfo.employeeScale,
                    engineerScale:data.extendInfo.engineerScale,
                    designerScale:data.extendInfo.designerScale,
                    qualityInspectorScale:data.extendInfo.qualityInspectorScale,
                    factoryAcreage:data.extendInfo.factoryAcreage,
                    yearlyOutput:data.extendInfo.yearlyOutput,
                    maxYearlyOutput:data.extendInfo.maxYearlyOutput,
                    totalAssets:data.extendInfo.totalAssets,
                    ioRights:data.extendInfo.ioRight===true?'true':'false',
                    exportRate:data.extendInfo.exportRate,
                    odmAbilitys:data.extendInfo.odmAbility===true?'true':'false',
                    informationSystem:data.extendInfo.informationSystem,
                    websiteUrl:data.extendInfo.websiteUrl,
                },

                companyProperty:data.companyProperty,
                showLegalName:data.showLegalName,
                isDemand:data.isDemand,
                isManufacturer:data.isManufacturer,
                creditInfo:creditInfo,
                certInfo:certInfos,
                contract:data.contract,
                tel:data.contract.tel,
                fax:data.contract.fax,
                }
            }
            window.scrollTo(0, 0);
        })
    },

    UploadSave(){  //数据保存
      this.SaveState=true;
    },

    /*修改资料---END*/
    SaveList(item1,item2){
        this.saveLoading=item1;
        this.SaveState=false
        if(item2==true){
           this.activeName='first';
           this.UploadName='first'
           this.modifyCreated();
        }
    },

   }
  }
</script>
<style lang="less">
.company-information{
    margin-bottom: 20px;
    .el-icon-close:before{
        font-size: 16px !important;
    }
}
    .tableData{
        padding: 0!important;
      th{font-weight: 500!important;}
      .el-table th{
        background-color: #eaeaea;
        padding: 8px 0!important;
        color: #333333;
        }
      .el-table tr{
        background-color: rgba(241, 241, 241, 0.7);
        }
      .el-table__row{
        height: 60px!important;
        }
    }
    .dialog-box{
      .el-dialog__title{
          font-size: 17px;
      }
      .el-dialog__body{
        padding: 20px 28px 25px 28px;
      }
      .el-dialog__footer{
         padding: 0px 28px 21px 28px!important;
      }
      .el-button{
        height: 30px!important;
        padding: 7px 20px !important;
      }
      .dialog-update{
         ul{
            overflow: hidden;
             li{
               width: 80px;
               height: 80px;
               padding: 1px!important;
               border-radius: 0;
               overflow: initial!important;
               float: left;
               margin-right: 12px;
               img{
                width: 75px;
                height: 75px;
                margin-left: 0!important;
               }
               a{
                 display: none!important;
               }
               label{
                  z-index: 99;
                  display: none!important;
               }
               .el-icon-close{
                   z-index: 99;
                   display: block;
                    top: -8px;
                    right: -7px;
                    background-color: #f84b4b;
                    color: #fff;
                    border-radius: 50%;
                    &::before{
                       font-size: 14px !important;
                    }
                   }
               .el-icon-close-tip{display: none;}
             }
         }
      }
    }
    .border-R-No{
       .el-input__inner{
         border-right: 0;
       }
       .el-input-group__append{
           background:#fff;
           color: #c0c4cc;
       }
    }
    #modify-data{
      .el-form-item{
        margin-bottom: 0!important;
      }
      .area-select-wrap{
       .area-select{margin-left:0!important;}
       .area-select.medium{width: 114px!important;line-height: 16px;}
       .area-select-option.selected{color: #409eff!important;}
      }
      .medium+.medium{
        margin-left: 10px;
      }
      .area-select-icon{
        border-top-color:#c4cada;
        &::before{
          content: "";
          position: absolute;
          top: -8px;
          left: -7px;
          width: 0;
          height: 0;
          border-top: 7px solid #ffffff;
          border-left: 7px solid transparent;
          border-right: 6px solid transparent;
        }

      }
    .avatar-uploader .el-upload {
    width: 193px;
    height: 85px;
    border: solid 1px #e2e2e2;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
   .avatar:hover {
     .avatar-uploader-icon{
        position: absolute;
        left: 0;
        top: 0;
     }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 195px!important;
    height: 85px!important;
    line-height: 84px;
    text-align: center;
  }
 }
 .projectAdd{
    padding:5px 0px;
    text-align: right;
    background: #fff;
   .el-button{
    height: 28px;
    width: 55px;
    padding: 3px 13px !important;
    box-sizing: border-box;
   }
 }
.BusinessType{
    width: 100%;
    height: 152px;
    overflow-x: hidden;
    overflow-y: scroll;
    border: 1px solid #e2e2e2;
    padding: 7px 0;
    background: #fff;
    label{display: block;margin-left: 0!important;padding: 2px 10px;line-height: 0!important;}
    label+label{margin-bottom: 5px;}
}
.modifyText{
    .modify-content{
      .el-form-item__content{line-height:0px!important;padding: 15px 0 6px 0;}
    }
    .modify-title{margin-bottom: 3px;}
}
.modifyUploadImg{
    overflow: hidden;
    .upload-demo{
        .el-upload--picture{text-align: right!important;display: block!important;}
        .el-upload-list__item-name{display:none;}
        ul{
        height: 190px;
        margin-top: 10px;
        .el-upload-list__item{
            width: 252px!important;
            height: 178px!important;
            border: solid 1px #e2e2e2;
            position: relative;
            overflow: inherit;
            float: left;
            padding: 0;
            border-radius: 0;
            .el-upload-list__item-status-label,.el-icon-close-tip{display:none!important;}
            .el-upload-list__item-thumbnail{
                vertical-align: middle;
                display: inline-block;
                width: 100%!important;
                height: 178px!important;
                margin: 0!important;
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
        li+li{margin-left:28px;}
        }
    }
}

.selectData{
   .el-select{
      width: 128px!important;
   }
   .el-select+.el-select{
      margin-left: 5px!important;
   }
}
.table_distance{
    .cell{
       padding-left: 5px!important;
       padding-right: 5px!important;
    }
}


@common-color: #3f8def;
.box {
  padding: 0px 20px 0px 20px;
  .title{
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 15px;
  }
}
.box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 65px;
    border-bottom: 1px solid #e2e2e2;
    box-sizing: border-box;
    margin-bottom: 25px;
  > div {
    height: 30px;
    line-height: 30px;
  }
}
.list {
  .row {
    margin-top: 32px;
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
    .userInfo,.companyInfo{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > span {
        flex: 0 0 33.33%;
      }
      .spanPading{
          margin-bottom: 20px;
      }
    }
    .AptitudesInfo{
        p{
            margin-bottom: 20px;
        }
        .imgPic{
            .imgsmallbox{
                cursor: pointer;
                width: 338px;
                height: 180px;
                margin-bottom: 20px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            p{
                margin-bottom: 7px;
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
                >img{
                    border: 1px solid #fff;
                    width: 1056px;
                    height: 684px;
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
           align-items: center;
           .logoImg{
               width: 86px;
               height: 51px;
               margin-bottom: 11px;
               img{
                   width: 100%;
                   height: 100%;
               }
           }
        }
        .modal-name{
            color: #3f8def;
            text-decoration: underline;
            white-space: nowrap;
            cursor: pointer;
        }
    }
  }
}
.right-title {
  position: absolute;
  top: -28px;
  left: 0;
  width: 100%;
  height: 20px;
  font-size: 14px;
  color: #333;
}
.status {
  color: #3f8def;
}

.pull-left{float: left;}
.pull-right{float: right;}
.pull-center{text-align: center;}
.pull-block{display: block;}
.pull-overflow{overflow: hidden;}
.pull-ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.pull-top{margin-top:33px;}
.pull-cursor{
    cursor: pointer;
    &:hover{
      color: #3f8def!important;
    }
    }
.modifyText{
    .Fixed-info-top+.Fixed-info-top{margin-top:18px!important;}
}
.pull-inline{display: inline-block!important;}
.pull-inline+.pull-inline{
    &::before{
        content:",";
        width: 5px;
        display: inline-block;
        padding-left: 2px;
    }
}
.pull-height{
    span{
        display: inline-block;
        width: 50%;
        height: 25px;
    }
}
//企业资料
.company-information-main{
    .company-information-tabs{
        padding: 10px 0 0 0;
        position: relative;
        .btnUpload{
            position: absolute;
            left: 980px;
            width: 90px;
            top: 8px;
            z-index: 5;
        }
        .examine-state{
            width: 1006px;
            height: 32px;
            background-color: rgba(63, 141, 239, 0.1);
            color: #3f8def;
            line-height: 32px;
        }
      .information-first{
          margin-top:2px;
      }
      .information-tabs-content{
          width: 100%;
          overflow: hidden;
          min-width: 1080px;
          .information-tabs-left{
              width:600px;
          }
          .information-tabs-right{
              width:455px;
              margin-left: 18px;
          }
        .tabs-content{
            .tabs-title{
                display: block;
                color: #333333;
                margin-bottom: 13px;
                font-family: MicrosoftYaHei;
                font-size: 14px;
                font-weight: bold;
            }
            .tabs-text{
                width: 100%;
                min-height: 50px;
                background-color: rgba(241, 241, 241, 0.7);
                padding: 23px;
                box-sizing: border-box;
            }
          .c-introduction{
              img{width: 218px;height:82px;margin-bottom: 22px;}
              .c-introduction-name{margin-bottom: 28px;}
              .c-introduction-cont{
                  span{display: block;}
                  .cont-txt{margin-left:70px;line-height: 22px;}
              }
          }
        // .reputation{
        //     span{
        //         font-size: 14px;
        //         color: #333333;
        //         display:block;
        //         margin-bottom:6px;
        //     }
        //     img{
        //         width:100%;
        //         height:435px;
        //         margin-bottom:18px;
        //     }
        // }
        // .Technology{
        //    span{
        //        display:block;
        //        font-family: MicrosoftYaHei;
        //        font-size: 14px;
        //        color: #333333;
        //    }
        //    span+span{margin-top:26px;}
        // }
        .Fixed-info{
          .Fixed-info-top+.Fixed-info-top{margin-top:26px;}
        }
        }
      }
      .invoiceInfoList{
        .el-checkbox{margin-left: 0;width: 50%;}
      }
    .max-Img{
        img{max-width: 555px;}
    }
    // 修改企业资料
    #modify-data{
        .modifyData{
           width:296px;
           .cont-title{
             margin-bottom: 2px;
           }
           .c-introduction-name{
               margin-bottom: 16px!important;
           }
        }
        .modifyImg{
            width:195px;
            height: 85px;
            margin-left: 45px;
            margin-top: 22px;
            img{
            width:100%!important;
            height: 85px!important;
            border:none!important;
            }
            .ImgW{
              width: auto!important;
              max-width:193px!important;
            }
            span{
                font-size: 12px;
                color: #9e9e9e;
                display: block;
                text-align: center;
                margin-top: 6px!important;
            }
        }
       .c-introduction-cont{
         .cont-title{
             margin-bottom: 2px;
         }
         .cont-txt{
           margin-left:0px!important;
         }
       }
       .Enterprise-documents{
         .Enterprise-documents-text{
            color: #9c9c9c;
            margin-bottom: 20px;
         }
         .el-button-center{
             width: 45px;
             height:28px;
             line-height: 8px;
             padding: 9px 10px;
        }
		.EnterpriseDocuments{
            margin-top:20px;
            .Enterprise-List+.Enterprise-List{margin-top: 5px;}
            .Enterprise-List{
                overflow: hidden;
                .certType,.BusinessImg{float: left;}
                .certType{
                    width:130px;
                }
                .BusinessImg{
                    width: 200px;
                    margin: 0 15px;
                    line-height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                      &:hover{
                        color:#66b1ff;
                      }
                }
                .BusinessImg,i{cursor: pointer;}
            }
            .el-icon-close{color: #ff3b3b;line-height: 40px;}
            i{float: right;}
         }
        .Enterprise-documents-upload{
            overflow: hidden;
            padding-top: 10px;
            border-top: 1px solid #e2e2e2;
            margin-top: 10px;
        .el-icon-document,.el-upload-list__item-status-label{display:none!important;}
        .el-icon-upload-success{
            color: #67c23a !important;
        }
        .el-icon-close{
            display:block!important;
            right: -20px;
            transition:all .2s;
            -ms-transition:all .2s; /* IE 9  */
            -webkit-transition:all .2s; /* Safari */
            &::before{
                font-size: 16px !important;
            }
        }
        .el-upload{
            text-align: center!important;display: block!important;
        }
        .el-upload-list{
          li{
            margin-top: 4px;
            text-align: center;
                &:hover{
                  .el-icon-close{
                      right:8px;
                  }
                }
            }
        }
        }
         .Enterprise_select,.upload-demo{float: left;}
         .Enterprise_select{
           .el-select{
             width: 130px;
           }
         }
         .upload-demo{
             width: 220px;
             margin: 5px 11px;
             overflow: hidden;
         }
         .Enterprise-add{
             float:right;
             padding: 5px 0;
             line-height:35px;
            .el-button-add{
               height: 28px;
               line-height: 4px;
            }
            i{
               cursor: pointer;
               font-size: 17px;
               font-weight: bold;
               color: #3f8def;
            }
         }
       }
     }
    }
 }
    .dialog-box{
        .Notes{
        color: #9e9e9e;
        margin-top: 45px;
        line-height: 20px;
        font-size: 12px;
        span{
            display: block;
        }
        }
    }
    .No-data{
        width:100%;
        height: 80px;
        text-align: center;
        line-height: 80px;
       img{
        width:20px;
        height:20px;
        display: inline-block;
        vertical-align: text-bottom;
        padding-right: 4px;
       }
    }
    .imgOut{
        width: 218px!important;
        height: 82px!important;
        line-height: 82px;
        text-align: center;
        border: solid 1px #e2e2e2;
        line-height: 82px;
        text-align: center;
        border: 1px solid #e2e2e2;
        margin-bottom: 22px!important;
    img{
        display: inline-block!important;
        height: 82px!important;
        width: auto!important;
        max-width: 216px;
    }
    }
	.Detailedlist,.Qualifications{
		border: 1px solid #ff3b3b;
	}
</style>
<style lang="less" scoped>
.reputation{
    span{
        font-size: 14px;
        color: #333333;
        display:block;
        margin-bottom:6px;
    }
    img{
        width:100%;
        height:435px;
        margin-bottom:18px;
    }
}
.Technology{
    span{
        display:block;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #333333;
    }
    span+span{margin-top:26px;}
}

</style>
