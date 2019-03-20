<template>
    <div id="menu"> 
        <div class="bread-crumb">
          <div v-if="isShow">
            <span >管理中心</span> >
            <span>{{crumbObj.level1.name}}</span> > 
            <span @click="$router.push({path: crumbObj.level2.url})" class="crumb-level2" :class="{crumbColor:!crumbObj.level3.name}">{{crumbObj.level2.name}}</span> 
            <span class="crumbColor" v-if="crumbObj.level3.name">> {{crumbObj.level3.name}}</span>
          </div>
          <div v-else >
            <span >管理中心</span> >
            <span class="crumb-level2" @click="$router.push({path:'/index'})">首页</span>
          </div>
        </div>
        <ul class="menu pull-shadow" :class="(user.isManufacturer&&user.isDemand)?'Df-height':''" >
            <li class="menu-item-top"  @click="$router.push({path:'/usercenter/usercenter-index'})">管理中心</li>
            <li class="menu-item">
                <div class="menu-item-box">
                  <i class="icon"></i>
                  <span class="userCenterHover"  :class="{'userCenter':!isShow}" @click="$router.push({path:'/usercenter/usercenter-index'})">首页</span>
                </div>
            </li>
            <li v-show="item.isShow" v-for="(item,index) in menus" :key="index" class="menu-item">
              <div class="menu-item-box">
                <i class="icon"></i>
                <span>{{item.name}}</span>
              </div>
              <ul class="sub-menu" >
                <li  v-show="sub.isShow" @click="jump(sub, item)" class="sub-menu-item" v-for="sub in item.subMenu">
                  <span :class="{'sub-menu-active':sub.active}">{{sub.name}}</span>
                </li>
              </ul>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  data() {
    return {
      crumbObj:'',
      menus: [
        {
          name: '询盘',
          icon: 'requirement',
          active: false,
          isShow:false,
          subMenu:[
            {
              url:'/usercenter/received-require',
              name:'我的报价',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '报价详情', url:'/usercenter/quotation-detail', parentUrl:'/usercenter/received-require' },
                { name: '去报价', url:'/usercenter/to-quotation', parentUrl:'/usercenter/received-require' },
              ]
            }, {
              url:'/usercenter/my-require',
              name:'我的询盘',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '报价清单', url:'/usercenter/quotation-list', parentUrl:'/usercenter/my-require' },
              ]
            },
            {
              url:'/usercenter/my-Combined-list',
              name:'我的报价单',
              active: false,
              isShow: false,
              threeLevelMenus:[
                // { name: '报价详情', url:'/usercenter/my-quotation-detail', parentUrl:'/usercenter/my-received-require' },
                // { name: '报价清单', url:'/usercenter/quotation-list', parentUrl:'/usercenter/my-received-require' },
              ]
            },
          ]
        }, {
          name: '订单',
          icon: 'order',
          active: false,
          isShow:false,
          subMenu:[
            {
              url:'/usercenter/received-order',
              name:'承接的订单',
              active: false,
              isShow: false,
              type:2,
              typeSatee:false,
              threeLevelMenus:[
                { name: '订单详情', url:'/order-detail', parentUrl:'/usercenter/received-order' },
                { name: '评价', url:'/usercenter/evaluate', parentUrl:'/usercenter/received-order' },
                { name: '退款', url:'/usercenter/refund-order', parentUrl:'/usercenter/received-order' },
              ]
            },{
              url:'/usercenter/require-order',
              name:'我的订单',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '订单详情', url:'/order-detail', parentUrl:'/usercenter/require-order' },
                { name: '评价', url:'/usercenter/evaluate', parentUrl:'/usercenter/require-order' },
              ]
            }
          ]
        }, 
        {
          name: '供应商',
          icon: 'resource',
          active: false,
          isShow:false,
          subMenu:[
            {
              url:'/usercenter/my-manufacturer',
              name:'我的供应商',
              active: false,
              isShow: false,
            }
          ]
        },
        {
          name: '企业管理',
          icon: 'company',
          active: false,
          isShow:false,
          subMenu:[
            {
              url:'/usercenter/company-service',
              name:'制造服务',
              active: false,
              isShow: false,
            },{
              url:'/usercenter/be-manufacturer',
              name:'成为供应商',
              active: false,
              isShow: false,
            },{
              url:'/usercenter/company-information',
              name:'企业档案',
              active: false,
              isShow: false,
            },{
              url:'/usercenter/company-information-modify',
              name:'修改档案',
              active: false,
              isShow: false,
            },{
              url:'/usercenter/company-settings',
              name:'企业设置',
              active: false,
              isShow: false,
            },{
              url:'/usercenter/product-list',
              name:'产品案例',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '案例发布', url:'/usercenter/publish-case', parentUrl:'/usercenter/product-list' },
              ]
            },{
              url:'/usercenter/account-manage',
              name:'子账号管理',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '添加子账户', url:'/usercenter/add-subaccount', parentUrl:'/usercenter/account-manage' },
                {name: '编辑子账号', url:'/usercenter/edit-subaccount', parentUrl:'/usercenter/account-manage' },
              ]
            }
          ]
        },
        {
          name: '人才招聘',
          icon: 'settings',
          active: false,
          isShow:false,
          subMenu:[
            {
              url:'/usercenter/position-manage',
              name:'职位管理',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '发布职位', url:'/usercenter/position-issue', parentUrl:'/usercenter/position-issue' },
              ]
            },{
              url:'/usercenter/my-resume',
              name:'我的简历',
              active: false,
              isShow: false,
            },
            {
              url:'/usercenter/my-deliver',
              name:'我的投递',
              active: false,
              isShow: false,
            },
            {
              url:'/usercenter/received-resume',
              name:'收到的简历',
              active: false,
              isShow: false,
            },
          ]
        },
        {
          name: '发票',
          icon: 'invoice',
          active: false,
          isShow:false,
          subMenu:[
            {
              url:'/usercenter/invoice-manage',
              name:'开票管理',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '开票详情', url:'/usercenter/invoice-detail', parentUrl:'/usercenter/invoice-manage' },
              ]
            }, {
              url:'/usercenter/my-invoice',
              name:'我的发票',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '开票详情', url:'/usercenter/my-invoice-detail', parentUrl:'/usercenter/my-invoice' },
              ]
            }
          ]
        },
        {
          name: '售后',
          icon: 'aftersale',
          active: false,
          isShow:false,
          subMenu:[
            {
              url:'/usercenter/apply-aftersale',
              name:'申请售后',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '发起售后', url:'/usercenter/launch-aftersale', parentUrl:'/usercenter/apply-aftersale' },
              ]
            }, {
              url:'/usercenter/aftersale-record',
              name:'售后记录',
              active: false,
              isShow: false,
              threeLevelMenus:[
                { name: '售后详情', url:'/usercenter/aftersale-detail', parentUrl:'/usercenter/apply-aftersale' },
              ]
            }
          ]
        },  
        {
          name: '消息',
          icon: 'message',
          active: false,
          isShow:false,
          subMenu:[
            {
              url:'/usercenter/sys-message',
              name:'站内消息',
              active: false,
              isShow: false,
            }
          ]
        },
        {
          name: '设置',
          icon: 'settings',
          active: false,
          isShow:false,
          subMenu:[
             {
              url:'/usercenter/address',
              name:'收货地址',
              active: false,
              isShow: false,
            }, {
              url:'/usercenter/account-settings',
              name:'个人设置',
              active: false,
              isShow: false,
            }, {
              url:'/usercenter/message-settings',
              name:'提醒设置',
              active: false,
              isShow: false,
            }
          ]
        },
      ],
      isShow:true,
      user:{},
    };
  },
  created(){
    var url = this.$route.path;
    var parentUrl = this.$route.query.parentUrl||'';
    this.getMenuList();
    this.autoActive(url, parentUrl);
    this.user=this.$LocalStorage.gxzzpt2_consumer();
  },
  watch: {
    $route(newVal, val) {
      var parentUrl = this.$route.query.parentUrl||'';
      this.autoActive(newVal.path, parentUrl);
    }
  },
  methods: {
    //根据路由自动高亮
    autoActive(url, parentUrl) {
      var crumbObj = {level1:{name:''},level2:{name:'', url: ''}, level3:{name:''}};
      var activeMenuItem = null;
      if(url=='/usercenter/usercenter-index'){
        this.isShow=false;
        this.menus.map(ele=>{
          ele.subMenu.map(sub=>{
             sub.active = false;
          })
        })
      }else{
        this.menus.map(ele => {
          ele.active = false;
          ele.subMenu.map( sub => {
            if(sub.url == url){
                sub.active = true;
                activeMenuItem = sub;
                crumbObj.level1.name = ele.name;
                crumbObj.level2.name = sub.name;
            }else {
              if ( sub.threeLevelMenus ) {
                sub.threeLevelMenus.map(( three ) => {
                  if ( three.url == url ) {
                    if ( parentUrl ) {
                      if ( parentUrl == three.parentUrl ) {
                        sub.active = true;
                        activeMenuItem = sub;
                        crumbObj.level1.name = ele.name;
                        crumbObj.level2.name = sub.name;
                        crumbObj.level2.url = sub.url;
                        crumbObj.level3.name = three.name;
                      } else {
                        sub.active = false;
                      }
                    } else {
                      sub.active = true;
                      activeMenuItem = sub;
                      crumbObj.level1.name = ele.name;
                      crumbObj.level2.name = sub.name;
                      crumbObj.level2.url = sub.url;
                      crumbObj.level3.name = three.name;
                    }
                  } else {
                    sub.active = false;
                  }
                })
              } else {
                sub.active = false;
              }
            }
          })
        });
        this.isShow=true;
        activeMenuItem.active = true;
        this.crumbObj = crumbObj;
      }

    },

    jump(subMenu, menuItem) {
      this.$router.push({path:subMenu.url});
    },

    //
    getMenuList() {
      this.$http.post('/getCustomMenuList').then(( res ) => {
        if ( res.data.code == 200 ) {
          var menuList = res.data?res.data.data:[];
          menuList.map(( menuItem ) => {
            this.menus.map(( menu ) => {
              if ( menu.name == menuItem.groupName ) {
                menu.isShow = true;
                // console.log('group--');
                menuItem.menu.map(( subMenuItem ) => {
                  menu.subMenu.map(( sub ) => {
                    if ( sub.url == subMenuItem.entrance ) {
                      sub.isShow = true;
                    }
                  })
                })
              }
            })
          })
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
#menu {
  position: relative;
  height: 100%;
  .bread-crumb{
    position: absolute;
    z-index: 99;
    top: -24px;
    left: 125px;
    width: 400px;
    .crumb-level2{
        cursor: pointer;
        &:hover{
          color: #3f8def;
          text-decoration: underline;
        }
    }
    .crumbColor{
      color: #3f8def;
    }
  }
}
.menu {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  height:auto;
  color: #333;
  padding-top: 16px;
  min-height: 650px;
  .menu-item-top{
    position: absolute;
    top:-32px;
    width: 112px;
    line-height: 32px;
    text-align: center;
    background-color: #3f8def;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
  .menu-item {
    padding-bottom: 5px;
    padding-left: 14px;
    cursor: pointer;
    .userCenterHover:hover{
      color: #3f8def;
    }
    .userCenter{
      color: #3f8def;
    }
    .menu-item-box{
      display: flex;
      height: 20px;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 5px;
      font-weight: 700;
      .icon {
        width: 4px;
        margin-right: 4px;
        height: 4px;
        display: inline-block;
        background-color: #8e8e8e;
        border-radius: 2px;
      }  
    }
    .sub-menu{
      .sub-menu-item{
        height: 14px;
        line-height: 14px;
        margin-bottom: 10px;
        color: #636363;
        padding-left: 8px;
        >span:hover{
          color: #3f8def;
        }
      }
      .sub-menu-active{
        color: #3f8def;
      }
      .sub-menuOk-active .sub-menu-active{color: #636363;} 
    }
  }
}
</style>
