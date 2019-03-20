<template>
    <div id="usercenter-index">
        <div class="content">
            <!-- <div class="title1">
               <div>供应商审核 <span>未通过</span>，原因：资料不完整，请补充并完善企业信息。</div>
                <router-link :to="{path:'/be-manufacturer'}" target="_blank"> <p class="link">点击修改企业档案信息</p></router-link>
            </div> -->
            <div class="title2">
                <div class="fs16">
                    <!-- 恭喜您，成为大富智造云平台<span>{{isManufacturer?'供应商':'企业用户'}}</span>,您可以： -->
                   欢迎进入大富智造云管理中心，您可以：
                </div>
            </div>
            <ul class="guide-box" v-if="isManufacturer">
                <li>
                    <span>填写我的企业资料，让更多人了解。</span>
                    <span class="link" @click=" $router.push({path:'/usercenter/company-information-modify'})">点击去填写企业资料</span>
                </li>
                <li>
                    <span>发布产品案例，让更多人通过案例找到我。</span>
                    <span class="link"  @click=" $router.push({path:'/usercenter/product-list'})">点击去发布案例</span>
                </li>
                <li>
                    <span>收到平台精心为您推送的需求，参与报价收获订单。</span>
                   <span class="link" @click=" $router.push({path:'/usercenter/received-require'})">点击查看推送我的报价</span>  
                </li>
                <li>
                    <span>去浏览公共区域的最新询盘。</span>
                    <router-link :to="{path:'/enquiry/list'}" target="_blank"><span class="link">点击寻找适合我的询盘信息</span></router-link>   
                </li>
                <li>
                    <span>添加多个账号并分配不同权限，让员工分工合作。</span>
                    <span class="link" @click=" $router.push({path:'/usercenter/account-manage'})">去管理子账号</span>
                </li>
                <li>
                    <span>管理提醒设置，让员工协助业务管理。</span>
                    <span class="link" @click=" $router.push({path:'/usercenter/message-settings'})">去设置提醒</span>
                </li>
                <li v-if="isDemand">
                    <span>去浏览供应商库，寻找合作伙伴。</span>
                    <router-link :to="{path:'/manufacturer-library'}" target="_blank"><span class="link">去查找供应商</span></router-link>
                </li>
                <li>
                    <span>查看常见问答，学习使用大富智造云。</span>
                    <router-link :to="{path:'/contract?index=5'}" target="_blank"><span class="link">查看常见我问题</span></router-link> 
                </li>
                <li><span>联系平台客服，在右侧找到客服QQ和客服微信，或拨打0755-29816880。</span></li>
                <li><span>对平台有任何意见或建议，欢迎您在右侧“反馈”中提交。</span></li>
            </ul>
            <ul class="guide-box" v-if="!isManufacturer">
               <li v-if="companyType==160020">
                    <span>添加多个账号并分配不同权限，让员工分工合作。</span>
                    <span class="link"  @click=" $router.push({path:'/usercenter/account-manage'})">去管理子账号</span>
                </li>
                <li>
                    <span>去提交我的询盘，让供应商为我报价。</span>
                    <router-link :to="{path: '/quote/manual', query:{techniqueType:530020}}" target="_blank"><span class="link">去提交询盘</span></router-link>    
                </li>
                <li>
                    <span>去浏览供应商库，寻找合作伙伴。</span>
                    <router-link :to="{path:'/manufacturer-library'}" target="_blank"><span class="link">去查找供应商</span></router-link>
                </li>
                <li>
                    <span>查看常见问答，学习使用大富智造云。</span>
                    <router-link :to="{path:'/contract?index=5'}" target="_blank"><span class="link">查看常见我问题</span></router-link> 
                </li>
                <li><span>联系平台客服，在右侧找到客服QQ和客服微信，或拨打0755-29816880。</span></li>
                <li><span>对平台有任何意见或建议，欢迎您在右侧“反馈”中提交。</span></li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      companyType: "",
      isManufacturer: false,
      isDemand:'',
    };
  },
  created() {
    let userInfo = JSON.parse(window.localStorage.getItem("gxzzpt2_consumer"));
    this.companyType = userInfo.companyType;
    this.isManufacturer = userInfo.isManufacturer;
    this.isDemand = userInfo.isDemand;
  }
};
</script>
<style lang="less">
#usercenter-index {
  .content {
    // width: 1005px;
    padding: 0 20px;
    margin: 0 auto;
    .fs16{
        font-size: 16px;
        font-weight: bold;
    }
    .title1{
        margin-top: 19px;
        text-align: center;
        padding: 13px 0;
        background-color: #fff0f0;
        p{
            padding-top: 13px;
        }
        span{
            color: red;font-size: 14px;
            cursor: pointer;
        }
        div,p,span{
            font-size: 14px;
        }
    }
    .title2{
        padding: 28px 0 13px 0;
        span{
            font-size: 16px;
            color: #3f8def;
        }
    }
    .guide-box {
        padding-left:17px; 
      li {
        list-style: disc;
        color: #777777;
        margin-top: 22px;
      }
    }
    .link {
        color: #3f8def;
        text-decoration: underline;
        margin-left: 10px;
        cursor: pointer;
    }
  }
}
</style>
