<template>
  <div id="upload" class="clear">
      <div class="preview" v-for="(item,index) in imgUrlArray" :key='index' v-if='ApiErrorFlag'>
          <div class="imgBox"> 
              <img :src="item.url" alt="">
              <div class="maskBox" @click.stop>
                  <div class="iconBox" @click.stop="deleteImgArr(index)">
                      <img src="../../static/img/cancel-Btn.png" alt="" class="deleteBtn"> 
                  </div>
              </div>
          </div>
      </div>
      <!-- limit限制上传数量，单张上传的时候，上传后 上传按钮隐藏 -->
      <div class="preview" @click="showUpload" v-if="imgUrlArray.length<limit">
          <i class="operator-icon">
          </i>
      </div>
    <input type="file" ref="file" @change="doUpload($event)"  :multiple='multiple'>
  </div>
</template>
<script>
/*
* @property { setLimit :  {nummer} 上传的数量限制，默认为1张}
* @property { setImgArr : {Array}  原来的图片数据 [{url:'img.jpg'}]形式，默认为空[] }
* @property { setMultiple : {Boolean} 是否同时上传多个文件，默认为false }
* @property { setUploadUrl : {String} 上传的url接口，默认为'http://dw.tatfookcloud.com/upload'}
* @property { @on-success : {Fuction} 图片上传成功后台返回的数据 }
* @property { @on-remove :{Fuction} 移出是返回的数据， }
* @property { @before-upload :{Fuction} 文件上传前的处理方法，返回值为true表示，继续执行，为false表示停止执行 }
* @property { @on-exceed :{Fuction} 文件个数超出时，执行的方法 }
* @property { @on-error : {Fuction} 上传接口错误，返回的提示信息 }
*/
import CommonService from '../services/CommonService.js'
export default {
  props: ["setLimit","setImgArr",'setMultiple','setUploadUrl'],
  data() {
    return {
      CommonService:new CommonService(), 
      limit:this.setLimit?this.setLimit:1,
      multiple:this.setMultiple,
      imgUrlArray:this.setImgArr?this.setImgArr:[],//图片显示的url数组；
      fileArr: [],//文件验证前获取的数据；
      ApiErrorFlag:true,//API 请求是否成功;
      beforeUploadFile:true,//接受上传前验证函数的返回值。true表示继续执行，false 表示 停止执行;
      resFileData:[],//上传成功返回数据的数组；
      fileUploadUrl:this.setUploadUrl?this.setUploadUrl:"http://dw.tatfookcloud.com/upload",
    };
  },
  created() {
    //父组件传递过来的数据;
    // this.imgUrlArray=this.setImgArr;
  },
  mounted() {
    this.$bus.$on('beforeUploadFile', (res)=>{
        this.beforeUploadFile=res;
    })
  },
  methods: {
    deleteFile(i) {
      this.$refs["file"].value = "";
      this.fileArr.splice(i);
    },
    showUpload() {
      this.$refs["file"].click();
    },
    async doUpload(e) {
        //单文件的数据；
        let file = e.target.files[0];
        //上传多文件数据；
        let arr = [].slice.call(e.target.files);
        if (arr.length) {
            arr.map(ele => {
                this.fileArr.push(ele);
            });
        }
        //上传前执行的函数
        if(this.multiple){
         this.$emit('before-upload',this.fileArr);
        }else{
          this.$emit('before-upload',file)
        }

        // let Valid =function(ele){
        //   //文件类型及大小验证；
        //   if(!/\.(jpg)$/.test(ele.name)) {
        //     console.log(111111111);
        //     return false;
        //   }
        //   if (ele.size / 1024 / 1024 > 0.12) {
        //     return false;
        //   }
        // }

        // console.log(this.fileArr);
        // if(this.multiple){
        //   let ValidFlag=true;
        //   this.fileArr.forEach(function(ele){
        //       if(!Valid(ele)){
        //         ValidFlag=false
        //       }
        //   });
        //   return ValidFlag
        // }else{
        //   return Valid(file)
        // }
      
        
        // if(!/\.(jpg|png|JGP|PNG)$/.test(file.name)) {
        //     return false;
        // }
        // if (ele.size / 1024 / 1024 > 0.12) {
        //     return false;
        // }

        //上传文件前类型及大小的验证；
        let isPassValid=this.beforeUploadFile;
        if(!isPassValid){
          //图片验证错误时候清除数据
          this.fileArr=[];
          return false;
        }

        //上传文件数量超过限定的个数；触发：on-exceed方法
        let limitISOver = this.fileArr.length>this.limit
        if(limitISOver){
          this.fileArr=[];
          this.$emit('on-exceed',this.fileArr); 
          return false;
        }
        
        //上传读取图片方法type：fuction；
        let readUpload = (fileData)=>{
          //1读取文件；
          let reader =new FileReader();
          //2绑定vue
          reader.vue = this;
          reader.readAsDataURL(fileData);
          //3执行完赋值给vue.imgUrlArray
          reader.onload=function(e){
            let obj={};
            obj.url=this.result;
            this.vue.imgUrlArray.push(obj) 
          };
        }
       
        //请求接口的数据；
        let data = new FormData();//创建FormData对象发送文件
        let url=this.$baseURL+'/uploadingFile';
        // let url='http://dw.tatfookcloud.com/upload';
        let self = this //函数指向外部；

        //调用接口的方法；
        // let ApiErrorFlag =true;
        let getUploadApi = async function(url,data,self){
          let res =await self.CommonService.UploadFile(url,data);
          if(res.code==200){
            let resData=res.data||res.attachFile;
            self.resFileData.push(resData)
            return true
          }else{
            self.ApiErrorFlag=false
            return false
          }
        }

        //单一上传和多重上传的操作；
        if(this.multiple){
          //多数据上传，调用接口；
          for (let index = 0; index < this.fileArr.length; index++) {
              const ele = this.fileArr[index];
              readUpload(ele)
              data.append("file",ele);
              //接口返回值，如果上传错误返回中断跳出循环；
              if (! await getUploadApi(url,data,self)) {
                self.$emit('on-error','上传失败')//上传错误是的验证;
                break;
              }  
          }
          if(this.ApiErrorFlag){
            this.$emit('on-success',this.resFileData);
          }else{
            this.imgUrlArray=[];
          }
          this.fileArr=[]
        }else{
          readUpload(file)
          data.append("file", file);
          await getUploadApi(url,data,self);
          if(this.ApiErrorFlag){
            this.$emit('on-success',self.resFileData)
          }else{
            this.imgUrlArray=[];
            self.$emit('on-error','上传失败')//上传错误是的验证;
          }
          this.fileArr=[]
        }
    },
    deleteImgArr(i){
      this.imgUrlArray.splice(i,1);
      this.resFileData.splice(i,1)
      this.$emit('on-remove',this.resFileData)
    }
  }
};
</script>
<style lang="scss" scoped>
$color: #3f8def;
#upload {
  display: flex;
  flex-wrap: wrap;
  .preview{
    width: 170px;
    height: 170px;
    margin: 0 20px 1px 0; 
    position: relative;
    cursor: pointer;
    border: solid 1.5px #e2e2e2;
    background-color: #fff;
    .imgBox{
        width: 100%;
        height:100%;
        img{
            width: 100%;
            height:100%;
        }
        .iconBox{
            top:-25px;
            right:-25px;
            position: absolute;
            z-index: 3;
            width: 50px;
            height: 50px;
            .deleteBtn{
              position: absolute;
              top:0px;
              left: 0px;
              right:0px;
              bottom: 0px;
              margin: auto;
              height: 24px;
              width: 24px;
              color:#e2e2e2;
            }
           
        }
        .maskBox{
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
    }
    .operator-icon::before,.operator-icon::after{
        content: "";
        width: 16px;
        height: 97px;
        background: #e2e2e2;
    }
    .operator-icon::after{
        width: 97px;
        height: 16px;
    }
    .operator-icon::before,.operator-icon::after{
        position: absolute;
        top:0px;
        left: 0px;
        right:0px;
        bottom: 0px;
        margin: auto;
    }
  }
  input[type="file"] {
    display: none;
  }
}
</style>
