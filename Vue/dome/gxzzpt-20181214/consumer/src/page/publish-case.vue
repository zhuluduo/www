<template>
    <div id="publish-case">
        <div class="content">
            <el-form :rules="rules" :model="formData" ref="caseForm">
                <el-form-item label-position="left" label="产品名称：" label-width="82px" prop="productName">
                    <el-input v-model="formData.productName"></el-input>
                </el-form-item>
                <el-form-item label-position="left" label="工艺：" label-width="82px" prop="techniqueId">
                    <el-input v-model="formData.techniqueId" placeholder="请输入内容" v-if="1>2"></el-input>
                     <!-- <el-select v-model="formData.technique">
                        <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in requireTypes"></el-option>
                    </el-select> -->
                    <div class="BusinessTrees">
                        <div class="Treebtn">
                        <CommonTree  v-on:get-currentKey="getCurrentKey" :checked-nodes="Tree.SelectNode"  :checked-keys="Tree.SelectDatas" :expand-all="false" :set-width="Tree.width" :set-title='Tree.title' :btn-name='Tree.btnName' :switch-state='true' :max-length='1'></CommonTree>
                        </div>
                    </div>
                </el-form-item>
                 <el-form-item label-position="left" label="行业：" label-width="82px" prop="industryId">
                    <el-select v-model="formData.industryId">
                        <el-option-group v-for="group in industrys" :label="group.industryCatalogName" :key="group.id">
                            <el-option :label="item.industryName" :key="item.id" v-for="item in group.industryList" :value="item.id"></el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label-position="left" label="材料：" label-width="82px" prop="material">
                    <el-input v-model="formData.material"></el-input>
                </el-form-item>
                <el-form-item label-position="left" label="报价范围：" label-width="82px" prop="priceScope">
                    <el-input v-model="formData.priceScope"></el-input>
                </el-form-item>
                <!-- <el-form-item label-position="left" label="产能情况：" label-width="82px" prop="productionCapacity">
                    <el-input v-model="formData.productionCapacity"></el-input>
                </el-form-item> -->
                <el-form-item label-position="left" label="产品图片：" label-width="82px" required prop="pictureUrls">
                    <el-button type="primary" @click="showUploadDlg">上传图片</el-button>
                    <input type="file" hidden ref="uploadInput" @change="uploadImg">
                    <div class="upload-img-list"  v-show="formData.pictureUrls.length>0">
                        <div class="upload-img-item"  v-for="(file,index) in formData.pictureUrls">
                            <img :src="file" alt="">
                            <i class="img-colse-icon" @click="deleteFile(index)"></i>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label-position="left" label="产能介绍：" label-width="82px" prop="description">
                    <el-input type="textarea" :rows="7" v-model="formData.description"></el-input>
                </el-form-item>
            </el-form>
            <div class="form-btn-box">
                <div class="form-btn">清除</div>
                <div class="form-btn form-next-btn" @click="submit">提交</div>
            </div>
        </div>
    </div>
</template>
<script>
import { validateFile} from '../lib/validate.js';
import CommonTree from './Tree-common'
export default {
  components: {
       CommonTree
  },
    data() {
        return {
            id: '',
            industrys:[],
            requireTypes:[],
            formData: {
                pictureUrls:[],
                productName:'',
                industryId:'',
                techniqueId:'',
                material: '',
                priceScope: null,
            //    productionCapacity: null,
                description:'',
            },
            rules:{
                productName:[{required: true,message:'请填写产品名称',trigger:'blur'}],
                industryId: [{required: true,message:'请选择产业',trigger:'change'}],
                techniqueId: [{required: true,message:'请选择主工艺',trigger:'blur'}],
                material:[{required: true,message:'请填写材料',trigger:'blur'}],
                pictureUrls:[{required: true,validator: validateFile,trigger:'blur'}],
            },
            Tree:{
            Treename:[],
            SelectDatas:[],
            SelectNode:[],
            width:'30%',
            title:'工艺',
            btnName:''
        }
        }
    },
    created() {
        this.id = Number(this.$route.query.id);
        this.getIndustrys();
        this.getWords();
        this.getData();
    },
    methods: {

        getData() {
            this.$http.post('/custom/manufacturer/productCase/get', {id: this.id}).then(( res ) => {

            })
        },

        getWords() {
            var wordsString = localStorage.getItem("words");
            var words = JSON.parse(wordsString);
            this.requireTypes = words[105].item;
        },

        getIndustrys() {
            this.$http.post('/custom/industryCatalog/all').then(( res ) => {
            if ( res.data.code ==200 ) {
                this.industrys = res.data.data;

            } else {
                this.$error(res.data.message);
            }
            })
        },

        /*选中工艺*/
        getCurrentKey(takeDate,keyDate){
           this.formData.techniqueId=keyDate[0];
           this.Tree.btnName= takeDate[0].techniqueName;
           this.submit();
        },

        deleteFile( index ) {
            this.formData.pictureUrls.splice( index, 1 );
        },
        uploadImg( e ) {
            if ( this.formData.pictureUrls.length >= 5 ) {
                this.$error('只能上传五张');
            } else {
                var file = e.target.files[0];
                if (!/\.(png|PNG|JPG|jpg)$/.test(file.name)) {
                    this.$error('png/JPG格式的图片');
                } else if( file.size > 1*1024*1024 ){
                    this.$error('图片大小不能超过1M');
                } else {
                    var data = new FormData();
                    data.append('file', file);
                    this.$upload.post('http://dw.tatfookcloud.com/upload', data).then(( res ) => {
                        if ( res.data.code == 200 ) {
                            this.formData.pictureUrls.push(res.data.data.img_url);
                        } else {
                            this.$error(res.data.message);
                        }
                    })
                }
            }
            this.$refs.uploadInput.value = '';
        },
        showUploadDlg() {
            this.$refs.uploadInput.click();
        },
        submit() {
            this.$refs.caseForm.validate(( valid ) => {
                if ( valid ) {
                    this.$http.post('/custom/manufacturer/productCase/add', this.formData).then(( res ) => {
                        if ( res.data.code == 200 ) {
                            this.$success(res.data.message);
                            this.$router.push({path:'/usercenter/product-list'});
                        } else {
                            this.$error(res.data.error);
                        }
                    })
                } else {
                    return false;
                }
            })
        }
    }
}
</script>

<style lang="less">
#publish-case{
    div{
        box-sizing: border-box;
    }
    .el-input, .el-textarea{
        width: 488px;
    }
    .content{
        width: 1005px;
        padding: 40px 25px;
        margin: 0 auto;
        .upload-img-list{
            margin-top: 15px;
            .upload-img-item{
                display: inline-block;
                position: relative;
                width: 105px;
                height: 105px;
                img{
                    display: block;
                    width: 105px;
                    height: 105px;
                    background: #f1f1f1;
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
        .el-form-item__label{
            text-align: left;
        }
        .el-form-item{
            position: relative;
        }
        .el-form-item.is-required .el-form-item__label:before {
            position: absolute;
            left: -8px;
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
    }
}
.BusinessTrees{
  .Treebtn{
    width: 488px;
    min-height: 26px;
    border: 1px solid #dcdfe6;
    .btn {
      width: 100%;
      min-height: 14px;
      background: #fff;
      border: none;
      color: #606266;
      text-align: left;
      line-height: 21px;
      word-break: break-all;
      word-wrap: break-word;
      white-space: pre-wrap;
      padding: 0;
      span{color: #606266;padding-left: 10px;}
    }
  }
}
</style>
