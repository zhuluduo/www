<template>
    <div :class="SwitchStates==true||IndustryType==true?'Tree-common':'Trees-common'">
      <el-button type="primary" @click="BtnDialog" class="btn">{{btnNames}}</el-button>
      <el-dialog
        :title="title"
        class="dialog-box"
        :class="SwitchStates==true||IndustryType==true?'Tree-commons':'Trees-commons'"
        :visible.sync="dialogVisible"
        :width="width"
        center
        append-to-body
        @open='openDialog'
        @close='closeDialog'>
        <div class="dialog-cont" v-loading="loading" element-loading-text="数据加载中">
        <div class="dialog-tag">
            <div class="title">已选择工艺:</div>
            <div class="dialog-tag-list"> 
              <el-tag size="medium" closable v-for="item in checkData" :key="item.id" @close="handleClose(item)">{{SwitchStates?item.techniqueName:item.techniqueCatalogName}}</el-tag>
            </div>
          </div>
          <p class="xian"></p>
          <div class="dialog-checkbox" v-if="dialogState">
            <el-tree :data="dataInfo" :props="labelName"   show-checkbox :check-strictly='true' ref="tree" :node-key="SwitchStates==true?'idInfo':'id'" @check-change='check' :default-expand-all='expandAlls' :check-on-click-node='false' :default-expanded-keys="checkedKey" ></el-tree>
          </div>
        </div>
        <div  class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="getCheckedNodes" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
/*
* @property { data :  {Array} 接口传来的数组 }
* @property { checkedKeys : {Array} 接收要选中key的数据 }
* @property { checkedNodes : {Array} 接收要选中nodes的数据 }
* @property { expandAll : {Boolean}是否默认展开所有数据--默认false }
* @property { getCheckedNodes : 向父组件回传所选中的data的数组,key的数组 }
* @property { getCurrentKey : 接收回传所选中的data的数组,key的数组 }
* @property { switchState :{Boolean} true可选择工艺，false选择父级 }
* @property { industryType :{Boolean} 行业类型true}
* @property { maxLength : {number} 工艺最大选择数 }
* @property { techniqueType : {number} 何种工艺类型 }
* @property { removeEmpty : {number} 去除没有工艺的空工艺分类 }
* @property { switchPose : {number} 工艺类型默认人工报价(460020)--460010自动报价--460030人工/自动 }
* @property { title : {String} 弹窗上方的名字 }
* @property { width : {String} 弹窗宽度 }
* @property { width : {String} 弹窗宽度 }
* @property { btnNames : {String} 按钮名 }
*/
export default {
  props: ['checkedKeys','checkedNodes','setWidth','setTitle','btnName','expandAll','switchState','industryType','maxLength','switchPose', 'techniqueType','removeEmpty'],
  data() {
    return {
      width:this.setWidth!=undefined?this.setWidth:'30%',
      title:this.setTitle!=undefined?this.setTitle:'树形控件',
      btnNames:this.btnName!=undefined?this.btnName:'树形组件',
      checkedKey:this.checkedKeys!=undefined?this.checkedKeys:[],
      expandAlls:this.expandAll!=undefined?this.expandAll:false,
      maxLengths:this.maxLength!=undefined?this.maxLength:10,
      setPoses:this.switchPose!=undefined?this.switchPose:460020,
      techniqueTypes:this.techniqueType!=undefined?this.techniqueType:null,
      removeEmptys:this.removeEmpty!=undefined?this.removeEmpty:null,
      SwitchStates:this.switchState!=undefined?this.switchState:undefined,
      IndustryType:this.industryType!=undefined?this.industryType:undefined,
      dialogVisible:false,
      dataInfo:[],
      selectOrg:[],
      labelName:'',
      defaultProps: {
        children: 'children',
        label:'techniqueCatalogName',
      },
      defaultPropsTwo: {
        children: 'children',
        label:'industryCatalogName',
      },
      index:0,
      loading:false,
      dialogState:true,
      checkData:[],
    };
  },
  watch:{
    checkedKeys(){
      this.checkedKey=this.checkedKeys;
    },
    btnName: function() {
      this.btnNames = this.btnName;
    }
    
  },
  methods: {
      BtnDialog(){
        if(this.SwitchStates!=undefined){
          this.getTechnique();
          this.labelName=this.defaultProps;
        }
        if(this.IndustryType!=undefined){
          if(this.IndustryType==true){
            this.Industry();
            this.labelName=this.defaultPropsTwo;
          }
        }
        this.loading=true;
        setTimeout(()=>{
          this.loading=false;
        },300)
        this.dialogVisible=true;
        this.dialogState=true
      },
      //关闭弹框清空数据
      closeDialog(){
        this.$refs.tree.setCheckedKeys([]);
        this.dialogState=false;
      },
      //初始化加载数据
      openDialog(){
        setTimeout(()=>{
          if(this.checkedNodes!=undefined){
            this.$refs.tree.setCheckedNodes(this.checkedNodes);
            setTimeout(()=>{
               this.checkData=this.$refs.tree.getCheckedNodes();
              },300)
          }
          if(this.checkedKeys!=undefined){
            this.$refs.tree.setCheckedKeys(this.checkedKeys);
              setTimeout(()=>{
               this.checkData=this.$refs.tree.getCheckedNodes()
              },300)
          }
        },100)
      },
      getCheckedNodes(){
        //获取所有被选中的data的数组
        let takeDate=this.$refs.tree.getCheckedNodes();
        //获取所有被选中的key的数组
        let keyDate=this.$refs.tree.getCheckedKeys()
        //获取父级
        let parentData=this.$refs.tree.getNode(keyDate[0])
        this.$emit('get-currentKey', takeDate,keyDate,parentData);
        this.dialogVisible=false;
      },
      
       //行业
      Industry(){
        let url="/custom/industryCatalog/all";
        this.$http.post(url).then(res=>{
            let data=res.data.data;
            let dataLength=res.data.data.length;
            this.LoadDataTwo(data,dataLength)
        })
      },

      //工艺
      getTechnique(){
      if(this.SwitchStates==true){
        let parmes={}
        parmes.techniquePurpose = this.setPoses
        parmes.techniqueType=this.techniqueTypes;
        parmes.removeEmpty=this.removeEmptys;
        this.$http.post('/getTechniqueAndStructure',parmes).then(res=>{
            let data=res.data.data;
            let dataLength=res.data.data.length;
            this.LoadDataOne(data,dataLength)
        })
      }
      if(this.SwitchStates==false){
        let parmes={}
          parmes.removeTechnique=true
        
        this.$http.post('/getTechniqueAndStructure',parmes).then(res=>{
            let data=res.data.data;
            this.dataInfo=data;
            this.selectOrg=data
        })
      }
       },
        LoadDataOne(data,dataLength){
        var newJson =data;
        var len = newJson.length;   //长度
        var idInfo ;
        var disabledFalse=false;
        var disabledTrue=true;
        for (var i = 0; i < len; i++) {
          newJson[i].idInfo=parseInt(newJson[i].id);
          if(newJson[i].techniqueList!=undefined){
              newJson[i].techniqueList.map((vals)=>{
                  vals.techniqueCatalogName=vals.techniqueName;
              })
              if(newJson[i].children==undefined){
                newJson[i].children=newJson[i].techniqueList;
              }
          }
          if(newJson[i].children==undefined&&newJson[i].techniqueList==undefined&&newJson[i].disabled==undefined){
            newJson[i].disabled=disabledTrue;
          }
            var item = newJson[i];
            if (item.children && item.children.length != 0) {
              var child = item.children;
              for (var j = 0; j < child.length; j++) {
                if (item.idInfo) {
                  child[j].idInfo = parseInt(child[j].id);
                  if(child[j].techniqueName){
                    child[j].disabled=disabledFalse;
                  }else{
                    child[j].disabled=disabledTrue;
                  }
                }
                else {
                  child[j].idInfo =parseInt(child[j].id);
                }
                if(child[j].techniqueList!=undefined&&child[j].children!=undefined){
                    child[j].children=child[j].children.concat(child[j].techniqueList)
                }
                if(child[j].techniqueList!=undefined&&child[j].children==undefined){
                  child[j].techniqueList.map((vals)=>{
                      vals.techniqueCatalogName=vals.techniqueName;
                  })
                  child[j].children=child[j].techniqueList;
                }
                  newJson[len + j] = child[j];
            }
            len = newJson.length;
            }
         }
            this.dataInfo=newJson.slice(0,dataLength)
        },

        LoadDataTwo(data,dataLength){
          var newJsonTwo =data;
          var len = newJsonTwo.length; 
          var idInfo ;
          var disabledFalse=false;
          var disabledTrue=true;
          for (var i = 0; i < len; i++) {
            newJsonTwo[i].idInfo=parseInt(newJsonTwo[i].id);
            if(newJsonTwo[i].industryList!=undefined){
                newJsonTwo[i].industryList.map((vals)=>{
                    vals.industryCatalogName=vals.industryName;
                })
                if(newJsonTwo[i].children==undefined){
                  newJsonTwo[i].children=newJsonTwo[i].industryList;
                }
            }
            if(newJsonTwo[i].children==undefined&&newJsonTwo[i].industryList==undefined&&newJsonTwo[i].disabled==undefined){
              newJsonTwo[i].disabled=disabledTrue;
            }
              var item = newJsonTwo[i];
              if (item.children && item.children.length != 0) {
                var child = item.children;
                for (var j = 0; j < child.length; j++) {
                  if (item.idInfo) {
                    child[j].idInfo = parseInt(child[j].id);
                    if(child[j].industryName){
                      child[j].disabled=disabledFalse;
                    }else{
                      child[j].disabled=disabledTrue;
                    }
                  }
                  else {
                    child[j].idInfo =parseInt(child[j].id);
                  }
                  if(child[j].industryList!=undefined&&child[j].children!=undefined){
                      child[j].children=child[j].children.concat(child[j].industryList)
                  }
                  if(child[j].industryList!=undefined&&child[j].children==undefined){
                    child[j].industryList.map((vals)=>{
                        vals.industryCatalogName=vals.industryName;
                    })
                    child[j].children=child[j].industryList;
                  }
                    newJsonTwo[len + j] = child[j];
              }
              len = newJsonTwo.length;
              }
          }
              this.dataInfo=newJsonTwo.slice(0,dataLength)
          },

         //获取当前选中属性的值
        check(data,checked, node){
          //工艺父级每次只选择一个
          if(this.SwitchStates==false){
            this.index++;
              if(this.index%2==0){
                  if(checked){
                      this.$refs.tree.setCheckedNodes([]);
                      this.$refs.tree.setCheckedNodes([data]);
                      //交叉点击节点
                  }else{
                      this.$refs.tree.setCheckedNodes([]);
                      //点击已经选中的节点，置空
                  }
              }
          }

          //规定工艺每次选中的最大个数
          if(this.SwitchStates==true||this.IndustryType==true){
            var DataID=this.$refs.tree.getCheckedKeys();
            if(this.$refs.tree.getCheckedKeys().length>this.maxLength){
              for(var t=0;t<DataID.length;t++){
                if(DataID[t]==data.id){
                  DataID.splice(t,1)
                    this.$refs.tree.setCheckedKeys([]);
                    this.$refs.tree.setCheckedKeys(DataID);
                    this.$message({
                      message: '工艺最多'+this.maxLength+'项',
                      type: 'warning',
                      duration:1100
                    });
                }
              }
            }
          }
          this.checkData=this.$refs.tree.getCheckedNodes()
        },

        //tag清除
        handleClose(val){
          this.checkData.splice(this.checkData.indexOf(val), 1);
          this.$refs.tree.setCheckedNodes([]);
          this.$refs.tree.setCheckedNodes(this.checkData);
        }

  },
  mounted() {
    // this.getTechnique();
  },
};
</script>
<style lang="less">
.Tree-commons{
    .el-tree-node__content .el-checkbox,.el-checkbox{
      display: none!important;
    }
   .expanded+.el-checkbox{
      display: none!important;
    }
    .is-leaf+.el-checkbox{
      display: block!important;
    }
    .is-disabled{display: none!important;}
      .el-tree-node__label{font-size: 12px;}
    .el-dialog__body{padding:10px 0 20px 0 !important}
    .dialog-checkbox,.dialog-footer{
      margin-left:25px;
      margin-right: 25px;
    }
}
</style>

<style lang="less" scoped>
    .Tree-commons,.Trees-commons{
      // width: 1200px;
      // height:500px;
      // margin:auto;
    }
    .dialog-box{
      .dialog-footer{text-align: right;}
    }
    .dialog-cont{
      max-height:520px;
      margin-bottom:10px;
      overflow: hidden;
      .xian{
        margin-bottom: 6px;
        height: 1px;
        background: #e2e2e2;
      }
      .dialog-tag{
        width:103%;
        max-height:200px;
        overflow-x:hidden;
        overflow-y:auto;
        padding: 0 40px 15px 25px;
        position: relative;
        .title,.dialog-tag-list{float: left;}
        .title{
          width:76px;
          color: #3f8def;
          line-height: 26px;
          display: inline-block;
          padding-right: 10px;
        }
        .dialog-tag-list{
          width: 85%;
          span{
            margin-right: 10px;
            margin-bottom: 5px;
          }
        }
      }
      .dialog-checkbox{
        max-height:310px;
        overflow-x:hidden;
        overflow-y:auto;
      }
    }
</style>
