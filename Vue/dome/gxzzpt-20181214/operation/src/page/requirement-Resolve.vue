<template>
    <div class="requirement-Resolve">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>需求</el-breadcrumb-item>
            <el-breadcrumb-item>需求解析</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box" >
            <div class="list">
                <div class="state">
                    <span>需求编号 :{{tableData.requirementNo}}</span>
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
                                <div class="tableBodyHead" >
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
                                <div class="goodsResolve">
                                    <p class="ResolveTitle">需求解析</p>
                                    <div class="uploadBox">
                                        <div class="GoodsTitle">
                                            分析报告:
                                        </div>
                                        <div class="uploadName">
                                            <el-upload
                                            v-model="item.analysisFileId"
                                            class="upload-demo"
                                            :action="uploadUrl"
                                            :on-remove="handleRemove"
                                            :before-upload="beforeAvatarUpload"
                                            :on-success="handleAvatarSuccess"
                                            multiple
                                            :limit="1"
                                            :on-exceed="handleExceed"
                                            :file-list="item.fileList">
                                            <el-button size="small" type="primary" @click='getindex(index)'>点击上传</el-button>
                                            <div slot="tip" class="el-upload__tip">小于25M，只能上传doc、docx、pdf、ppt、pptx、jpg、png文件;</div>
                                            </el-upload>
                                        </div>
                                    </div>
                                    <div class="GoodsTextarea">
                                        <div class="GoodsTitle">
                                            说明：
                                        </div>
                                        <div class="textarea">
                                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3}"  maxlength='200' placeholder="请输入说明的内容" v-model="item.analysisRemark" width='600px'>
                                            </el-input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="submitform">
                <button @click="submitForm">保存</button>
            </div>
        </div>
    </div>
</template>

<script>
import {dayFilter} from '../lib/filter.js'
export default {
  data() {
    return {
        uploadUrl:this.$baseURL + '/uploadingFile',
        tableData: [],
        index:'',
        id:'',
    };
  },
  created() {
    this.getRequirementDetails();
    this.id=this.$route.query.id;
  },
  methods: {
    getRequirementDetails() {
      let Id = Number(this.$route.query.id);
      this.$http.post("/operation/requirement/getRequirementDetails", { id: Id }).then(res => {
          if (res.data.code == 200) {
            this.pagination = res.data.pagination;
            this.tableData = res.data.data ? res.data.data : [];
            this.tableData.itemList.map((ele)=>{
                this.$set(ele,'fileList',[])
                if(!ele.analysisRemark){
                    this.$set(ele,'analysisRemark','')
                }
                if(!ele.analysisFileInfo){
                    this.$set(ele,'analysisFileInfo',{})
                }else{
                    let obj={}
                    obj.name=ele.analysisFileInfo.fileName;
                    obj.url=ele.analysisFileInfo.fileUrl;
                    obj.id=ele.analysisFileInfo.analysisFileId;
                    ele.fileList.push(obj)
                }   
            })
          }
        })
        .catch(res => {});
    },
    saveAnalysiApi(params) {
      this.$http.post("/operation/requirement/saveAnalysis", { analysis: params }).then(res => {
          if (res.data.code == 200) {
            this.$message({
                type: "success",
                message:res.data.message,
            });
            this.getRequirementDetails();
            this.$router.push({path:'/main/requirement-details',query:{'id':this.id}})
            } else {
                this.$message({
                    type: "error",
                    message: res.data.message,
                });
            }
        })
        .catch(res => {});
    },
    submitForm(){
        let productsArr=[];
        this.tableData.itemList.forEach(ele=>{
            let obj={}
            obj.id=ele.id;
            obj.analysisFileId=ele.analysisFileInfo.analysisFileId;
            obj.analysisRemark=ele.analysisRemark;
            productsArr.push(obj)
         })
        this.saveAnalysiApi(productsArr)
    },
    getindex(index){
        this.index=index;
    },
    //上传问文件;
    handleAvatarSuccess(file,fileList){
        this.tableData.itemList[this.index].analysisFileInfo.analysisFileId=file.attachFile.id;
    },
    handleRemove(file,fileList) {
        //判断是已经存在的file还是新上传的file删除；
        let id =file.id?file.id:file.response.attachFile.id;
        this.tableData.itemList.map(ele=>{
            if(ele.analysisFileInfo.analysisFileId==id){
                ele.analysisFileInfo.analysisFileId=''
            }
        })
    },
    beforeAvatarUpload(file){
        if(!/\.(doc|docx|pdf|ppt|pptx|jpg|png|JGP|PNG)$/.test(file.name)) {
            this.$message({
                type: "error",
                message: '只支持doc/docx/pdf/ppt/pptx/jpg/png/JGP/PNG文件格式',
                duration:1000
            });
            return false;
        }
        if (file.size / 1024 / 1024 > 25) {
            this.$message.error("文件大小不能超过25M");
            return false;
        }
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
  }
};
</script>

<style lang="less">
 .requirement-Resolve{
     .uploadBox{
        .uploadName{
            position: relative;
            box-sizing: border-box;
            background-color: #fff;
            width:340px;
            padding:0 10px;
            height: 32px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            .el-button{
                position: absolute;
                top:-1px;
                right:-78px;
            }
            .el-upload__tip{
                position: absolute;
                top:0px;
                right:-460px;
            }
            .el-upload-list{
                position: absolute;
                top: -8px;
                left: 5px;
                .el-upload-list__item{
                    float: left;
                    width: auto;
                    margin-top: 10px;
                }
            }
            .el-upload-list__item-name{
                max-width: 260px;
            }
        }
        .uploadName:hover{
            border:1px solid #20a0ff; 
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
p {
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
    //   padding: 20px 24px;
    }
    .PartInfo {
        margin-bottom: 20px;
        border-top: 1px solid #e1e1e1;
        border-bottom: 1px solid #e1e1e1;
      .table-header,.tableBodyHead {
        display: flex;
        height: 60px;
        justify-content: center;
        text-align: center;
        align-items: center;
        img {
          width: 120px;
          height: 40px;
          display: block;
          background: #e0e0e0;
          margin: 0 auto;
        }
      }
      .table-header{
          background-color: #f5f5f5;
      }
      .tableBody {
        border-top: 1px solid #e1e1e1;
        padding-bottom: 40px;
        .tableBodyHead{
            .ladderPriceInfo {
                display: flex;
                > div {
                    flex: 1;
                }
            }
        }
        .goodsResolve{
            padding: 0 20px;
            background-color: #f5f5f5;
            border-top:1px solid #e0e0e0;
            .ResolveTitle{
                font-weight: bold;
            }
            .GoodsTextarea,.uploadBox{
                padding: 10px 0;
                display: flex;
                .textarea{
                    width: 800px;
                }
                .GoodsTitle{
                    width: 66px;
                    line-height: 32px;
                }
            }
        } 
      }
    }
  }
}
.submitform{
    display: flex;
    justify-content: flex-end;
    padding-bottom: 20px;
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
</style>
