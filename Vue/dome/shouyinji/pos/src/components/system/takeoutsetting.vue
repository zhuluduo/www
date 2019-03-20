<template>
  <div class="content-list">
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>外卖设置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="3">便利店名称：{{storeDetail.name}}</el-col>
      <el-col :span="7">便利店ID：<span style="color:red;">{{storeDetail.id}}</span></el-col>
      <el-col :span="11">
        美团门店绑定测试工具：
        <a style="color:red;" target="_blank" href="http://developer.meituan.com/admin#/callback/tool">http://developer.meituan.com/admin#/callback/tool</a>
      </el-col>
      <!--<el-col :span="3" align="right">
        营业状态：<el-switch v-model="storeStatus" on-text="营业" off-text="休息" on-color="#13ce66" off-color="#ff4949"
                        :disabled="storeStatusDisabled" @change="setupStoreStatus"/>
      </el-col>-->
      <el-col :span="3" align="right">
        自动接单：<el-switch v-model="autoAccept" on-text="开启" off-text="关闭" on-color="#13ce66" off-color="#ff4949"
                        :disabled="autoAcceptDisabled" @change="setupAutoAccept"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading">
          <el-table-column prop="takeoutName" label="外卖平台" width="200"></el-table-column>
          <el-table-column prop="takeoutStoreName" label="外卖店铺名称"></el-table-column>
          <el-table-column prop="takeoutStoreId" label="外卖店铺ID"></el-table-column>
          <el-table-column label="状态" width="70" align="center">
            <template scope="scope">
              <el-tag :type="scope.row.binded?'success':'danger'">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="营业状态" width="100" align="center">
            <template scope="scope">
              <el-tag v-if="scope.row.storeStatus==0||scope.row.storeStatus==null" type="danger">休息</el-tag>
              <el-tag v-if="scope.row.storeStatus==1" type="success">营业</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="bindTime" label="绑定时间" width="150"></el-table-column>
          <el-table-column label="操作"  width="500" >
            <template scope="scope">
              <el-button v-if="!scope.row.binded" @click="bindTakeoutStore(scope.row.takeoutType)" type="success" size="small"  icon="share">绑定</el-button>
              <el-button v-if="scope.row.binded" @click="unbindTakeoutStore(scope.row.takeoutType,false)" type="danger" size="small"  icon="close">解绑</el-button>
              <el-button @click="bindHistory(scope.row.takeoutType)" type="info" size="small" icon="time">绑定历史</el-button>
              <el-popover
                ref="accessToken"
                placement="top"
                :title="scope.row.takeoutStoreName+'访问Token'"
                trigger="click"
                :content="scope.row.accessToken">
              </el-popover>
              <el-button v-show="scope.row.binded" v-popover:accessToken type="danger" icon="information" size="small">查看访问令牌</el-button>
              <el-popover
                ref="refreshToken"
                placement="top"
                :title="scope.row.takeoutStoreName+'刷新Token'"
                trigger="click"
                :content="scope.row.refreshToken">
              </el-popover>
              <el-button v-show="scope.row.binded&&scope.row.takeoutType==1" v-popover:refreshToken type="warning" icon="information" size="small">查看刷新令牌</el-button>
              <el-tooltip class="item" effect="light" content="绑定过程中，若出现：'请联系您的erp厂商检查您的ePoiId是否和其它商户发生重复'，请尝试强制解绑！解绑过程中可能需要您向技术人员提供便利店ID！" placement="left" >
                <el-button v-if="!scope.row.binded&&scope.row.takeoutType==0" @click="unbindTakeoutStore(scope.row.takeoutType,true)" type="danger" size="small"  icon="circle-close">强制解绑</el-button>
              </el-tooltip>
              <el-button v-if="scope.row.storeStatus!=null&&scope.row.storeStatus==0" @click="setupStoreStatus(true,scope.row)" type="success" size="small"  icon="share">置为营业</el-button>
              <el-button v-if="scope.row.storeStatus!=null&&scope.row.storeStatus==1" @click="setupStoreStatus(false,scope.row)"  type="danger" size="small"  icon="close">置为停业</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog class="takeoutDialog" id="takeoutDialog"
      :title="takeoutDialogTitle"
      :visible.sync="showTakeoutDialog"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div>
       <pre style="padding:0 5px;color:red;margin:0;">注意：
{{takeoutDialogTips}}</pre>
        <el-row>
          <el-col align="right" :span="24" style="padding-right:8px;"><el-button @click="bindHistory(takeoutType)" type="info" size="small" icon="time">绑定历史</el-button></el-col>
        </el-row>
      </div>
      <iframe id="takeoutIframe" v-show="showIframe" width="100%" height="600" :src="iframeUrl"/>
      <div v-show="!showIframe" style="padding:0px 10px;">
        <div v-show="takeoutType==1">
          <el-row :gutter="2">
            <el-col align="center" :span="6"><img width="228" heithg="300" src="../../assets/images/eleme_unbind_step_0.png"/></el-col>
            <el-col align="center" :span="6"><img width="228" heithg="300" src="../../assets/images/eleme_unbind_step_1.png"/></el-col>
            <el-col align="center" :span="6"><img width="228" heithg="300" src="../../assets/images/eleme_unbind_step_2.png"/></el-col>
            <el-col align="center" :span="6"><img width="228" heithg="300" src="../../assets/images/eleme_unbind_step_3.png"/></el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button icon="close" @click="handleClose" size="small">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog class="historyDialog" id="historyDialog"
               :title="historyDialogTitle"
               :visible.sync="showHistoryDialog">
      <el-row>
        <el-table stripe border v-loading="historyLoading" element-loading-text="加载中..." :data="bindHistoryList" ref="multipleTable" row-key="id"
                  @sort-change="sortList" :default-sort = "{prop: 'updateTime', order: 'descending'}">
          <el-table-column sortable="custom" prop="takeoutStoreName" label="外卖店铺名称"/>
          <el-table-column sortable="custom" prop="takeoutStoreId" label="外卖店铺ID"/>
          <el-table-column sortable="custom" prop="updateTime" label="绑定时间"/>
          <el-table-column width="208" label="操作" align="center">
            <template scope="scope">
              <el-popover
                ref="historyAccessToken"
                placement="top"
                :title="scope.row.takeoutStoreName+'访问Token'"
                trigger="click"
                :content="scope.row.accessToken">
              </el-popover>
              <el-button v-popover:historyAccessToken type="danger" size="small">查看访问令牌</el-button>
              <el-popover
                ref="historyRefreshToken"
                placement="top"
                :title="scope.row.takeoutStoreName+'刷新Token'"
                trigger="click"
                :content="scope.row.refreshToken">
              </el-popover>
              <el-button v-show="scope.row.takeoutType==1" v-popover:historyRefreshToken type="warning" size="small">查看刷新令牌</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeSize"
          @current-change="changePage"
          :current-page.sync="historyPage.currentPage"
          :page-size="historyPage.size"
          layout="prev, pager, next, jumper, total"
          :total="historyPage.total">
        </el-pagination>
      </el-row>

    </el-dialog>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  let takeouts= {
    meituan: {takeoutType:0,takeoutName: '美团外卖',takeoutStoreId:'',takeoutStoreName:'', accessToken: '',refreshToken:'', status: '未绑定',bindTime:'', binded:false},
    eleme: {takeoutType:1,takeoutName: '饿了么',takeoutStoreId:'', takeoutStoreName:'',accessToken: '',refreshToken:'', status: '未绑定',bindTime:'', binded:false},
    baidu: {takeoutType:2,takeoutName: '百度外卖',takeoutStoreId:'', takeoutStoreName:'',accessToken: '',refreshToken:'', status: '未绑定',bindTime:'', binded:false}
  };
  export default{
    data(){
      return {
        forceUnbindTimestamp:'',
        takeoutType:'',
        storeDetail:{},

        storeStatus: false, // 营业状态
        storeStatusDisabled:false,
        autoAccept: false, // 自动接单
        autoAcceptDisabled:false,

        historyDialogTitle:'',
        showHistoryDialog:false,
        bindHistoryList:[],
        historyListSort:{},

        showTakeoutDialog:false,
        takeoutDialogTitle:'',
        takeoutDialogTips:'',
        showIframe:false,
        detectorHandler:'',
        iframeUrl:'',
        loading: false, // 是否显示加载遮罩层

        historyLoading: false,
        historyPage:{ // 绑定历史分页信息
          currentPage:1, // 当前页
          size:10, // 每页大小
          total:1, // 总页数
        },

        list:[takeouts.meituan,takeouts.eleme,takeouts.baidu]
      }

    },
    methods: {
      trimSort(sort){
        if(sort.order!=null)
          sort.order=sort.order.replace('ending','');
        return sort;
      },
      // 处理点击排序
      sortList(sort){
        this.historyListSort=this.trimSort(sort);
        this.loadHistoryList(this.takeoutType);
      },
      /*处理分页事件*/
      changeSize(val) {
        this.historyPage.size = val;
        this.loadHistoryList(this.historyPage.params.takeoutType);
      },
      changePage(val) {
        this.historyPage.currentPage = val;
        this.loadHistoryList(this.takeoutType);
      },
      /*设置营业状态*/
      setupStoreStatus(status,row) {
        let param = { takeoutType:row.takeoutType};
        if (status) {
          param.storeStatus = 1;
        } else {
          param.storeStatus = 0;
        }
        let url = bus.host + '/pos/api/system/takeout/store-status';
        this.$axios.post(url, param).then(res => {
          if(res.data.success){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.loadList();
          }else{
            this.$message.error(res.data.msg);
            this.storeStatus=false;
          }
        });
      },
      /*设置自动接单*/
      setupAutoAccept(status) {
        let param = {};
        if (status) {
          param.autoAccept = 1;
        } else {
          param.autoAccept = 0;
        }
        let url = bus.host + '/pos/api/system/takeout/auto-accept';
        this.$axios.post(url, param).then(res => {
          if(res.data.success){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
          }else{
            this.$message.error(res.data.msg);
            this.autoAccept=false;
          }
        });
      },
      handleClose(done){
        try{
          done();
        }catch(e){}
        this.showTakeoutDialog=false;
        this.loadList();
      },
      /** 探测页面是否有特定标识出现
       * takeoutType : 外卖类型：0-美团外卖、1-饿了么、2-百度外卖
       * callbackType: 回调类型：0-绑定、1-解绑、2、其他信息
       **/
      detect(takeoutType,callbackType){
        let handlers=new Set();
        try{
          let existHandlers=JSON.parse(sessionStorage.getItem('takeoutIntervalHandlers'));
          if(existHandlers!=null&&existHandlers!=undefined){
            existHandlers.forEach(h=>handlers.add(h));
            handlers.forEach(h=>clearInterval(h));
            handlers.clear();
          }
        }catch (e){};
        console.log(handlers);
        this.detectorHandler=setInterval(()=>{
          console.log('探测外卖设置结果:takeoutType='+takeoutType+',回调类型='+callbackType);
          let detectUrl=bus.host+'/pos/api/system/takeout/status?storeId='+this.storeDetail.id+'&takeoutType='+takeoutType+'&callbackType='+callbackType+'&_'+new Date().getTime();
          this.$axios.get(detectUrl).then(res=>{
            let cn = res.data;
            if(cn.success){
              let that=this;
              this.$message({
                type: 'success',
                message: cn.message,
                duration:2000,
                showClose: true,
                onClose:function () {
                  that.showTakeoutDialog=false;
                  clearInterval(that.detectorHandler);
                  that.loadList();
                }
              });
            }else{
              if(cn.message==null){
                return;
              }
              let that=this;
              this.$message({
                type: 'error',
                message: cn.message,
                duration:5000,
                showClose: true,
                onClose:function () {
                  that.showTakeoutDialog=false;
                  clearInterval(that.detectorHandler);
                  that.loadList();
                }
              });
            }
          });
          handlers.add(this.detectorHandler);
          sessionStorage.setItem('takeoutIntervalHandlers',JSON.stringify(handlers));
          if(!this.showTakeoutDialog){
            // 关闭弹窗，停止检测
            clearInterval(this.detectorHandler);
          }
        },1500)
      },
      // 绑定外卖店铺
      bindTakeoutStore(takeoutType){
        this.loading=true;
        this.takeoutType=takeoutType;
        let timestamp = '_='+new Date().getTime();
        this.$axios.get(bus.host+'/pos/api/system/takeout/bind/'+takeoutType+'?'+timestamp).then(res=>{
          let url = res.data.msg;
          if(url===''){
            this.$message({
              type: 'error',
              message: '获取不到绑定URL',
              duration:2000,
              showClose: true
            });
            this.loading=false;
            return;
          }
          switch(takeoutType){
            case 0:
              this.takeoutDialogTitle='绑定美团外卖店铺';
              this.takeoutDialogTips='1、请使用美团商户账号登陆并选择要与收银系统绑定的店铺；\r\n2、绑定过程中，若出现："请联系您的erp厂商检查您的ePoiId是否和其它商户发生重复"，\r\n  表示当前便利店已经绑定其它的美团外卖店铺，但收银系统中没有相关绑定记录。请尝试强制解绑，然后再绑定！'
              this.showIframe=true;
            break;
            case 1:
              this.takeoutDialogTitle='绑定饿了么外卖店铺,';
              this.takeoutDialogTips='请使用饿了么商户账号登陆并对收银系统授权！'
              this.showIframe=true;
            break;
            case 2:
              this.takeoutDialogTitle='绑定百度外卖店铺, 请使用百度外卖商户账号登陆并选择要与收银系统绑定的店铺';
              this.takeoutDialogTips='请使用百度外卖商户账号登陆并对收银系统授权！'
              // this.showIframe=true;
            break;
          }
          this.iframeUrl = url+'&'+timestamp;
          this.showTakeoutDialog=true;
          this.loading=false;
          this.detect(takeoutType,0);
        });
      },
      // 解绑外卖店铺
      unbindTakeoutStore(takeoutType,force){
        this.loading=true;
        this.takeoutType=takeoutType;
        let tips='\r\n若解绑过程中提示："此帐号与门店不匹配, 请使用对应账号重新登录"，\r\n请尝试任何曾经绑定过的美团外卖账号！相关信息请查询绑定历史！';
        switch (takeoutType){
          case 0: // 美团外卖
            if(force){
              this.takeoutDialogTitle='尝试强制解绑美团外卖店铺';
              this.takeoutDialogTips='请使用要解绑的美团店铺对应的商户账号登陆！'+tips;
            }else{
              this.takeoutDialogTitle='解绑美团外卖店铺';
              this.takeoutDialogTips='请使用外卖设置列表中的美团店铺对应的商户账号登陆！'+tips;
            }
            let timestamp = '_='+new Date().getTime();
            this.$axios.get(bus.host+'/pos/api/system/takeout/unbind?takeoutType='+takeoutType+'&force='+force+'&_'+new Date().getTime()).then(res=>{
              let data = res.data;
              if(!data.success){
                this.$message({
                  type: 'error',
                  message: data.msg,
                  duration:5000,
                  showClose: true
                });
                this.showTakeoutDialog=false;
                this.loading=false;
                //this.detect(takeoutType,1);
                return;
              }
              let url = data.msg;
              if(url!=''){
                this.iframeUrl = url+'&'+timestamp;
                this.showIframe=true;
                this.showTakeoutDialog=true;
                this.detect(takeoutType,1);
              }
            });
            break;
          case 1: // 饿了么外卖
            this.takeoutDialogTitle='解绑饿了么外卖店铺';
            this.takeoutDialogTips='请使用外卖设置列表中的饿了么店铺对应的商户账号登陆';
            this.showIframe=false;
            this.showTakeoutDialog=true;
            this.detect(takeoutType,1);
            break;

          case 2: // 百度外卖
            this.takeoutDialogTitle='解绑百度外卖店铺';
            this.takeoutDialogTips='请使用外卖设置列表中的百度外卖店铺对应的商户账号登陆';
            this.showIframe=false;
            //this.showTakeoutDialog=false;
            // this.detect(takeoutType,1);
            break;
        }
        this.loading=false;
      },
      bindHistory(takeoutType){
        this.historyDialogTitle='便利店【'+this.storeDetail.name+'】与【TAKEOUT_NAME店铺】绑定历史';
        let show=true;
        switch (takeoutType){
          case 0:this.historyDialogTitle=this.historyDialogTitle.replace('TAKEOUT_NAME','美团外卖');break;
          case 1:this.historyDialogTitle=this.historyDialogTitle.replace('TAKEOUT_NAME','饿了么');break;
          case 2:this.historyDialogTitle=this.historyDialogTitle.replace('TAKEOUT_NAME','百度外卖');break;
          default:
            show=false;
        }
        if(show){
          this.takeoutType=takeoutType;
          this.loadHistoryList(takeoutType);
          this.showHistoryDialog=true;
        }
      },
      /*加载列表数据*/
      loadList() {
        this.loading = true;
        this.$axios.get(bus.host + '/pos/api/system/takeout/list').then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
            return;
          }
          let msg = data.msg;
          this.list.forEach(obj=>{
            obj.accessToken='';
            obj.status='未绑定';
            obj.binded=false;
            obj.takeoutStoreName='';
            obj.takeoutStoreId='';
            obj.bindTime='';
            obj.refreshToken='';
            msg.forEach(remote=>{
              if(obj.takeoutType===remote.takeoutType){
                obj.status='已绑定';
                obj.binded=true;
                obj.takeoutStoreName=remote.takeoutStoreName;
                obj.takeoutStoreId=remote.takeoutStoreId;
                obj.bindTime=remote.updateTime;
                obj.accessToken=remote.accessToken;
                obj.refreshToken=remote.refreshToken;
              }
            });
          });
          this.loading = false;
        }).catch((err) => {
          console.log(err);
        });
      },
      loadHistoryList(takeoutType){
        this.historyLoading=true;
        let params={takeoutType:takeoutType};
        let url=bus.host+'/pos/api/system/takeout/bind/history?page='+(this.historyPage.currentPage-1)+'&size='+this.historyPage.size;
        if(this.historyListSort.order!=null){
          url+='&sort='+this.historyListSort.prop+','+this.historyListSort.order;
        }
        this.$axios.post(url,params).then(res=>{
          console.log(res);
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
            this.historyLoading=false;
            return;
          }

          this.bindHistoryList=data.msg.content;
          this.historyPage.total =data.msg.totalElements;
          this.historyLoading=false;
        });
      }
    },
    mounted() {
      this.loadList();
      let url = bus.host + '/pos/api/store/detail';
      this.$axios.get(url).then(res=>{
        this.storeDetail=res.data.msg;
      }).catch(e=>{});
    }
  }
</script>
<style>
 .takeoutDialog .el-dialog__body,.historyDialog .el-dialog__body{
   padding:0 2px;
 }
 .takeoutDialog iframe{
   border:0;
 }
</style>
