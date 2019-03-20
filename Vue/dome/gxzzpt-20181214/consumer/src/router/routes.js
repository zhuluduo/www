import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
    routes: [{
            path: "/",
            redirect: '/index'
        },
        //打印页面;
        {
            path: "/print",
            name: 'print',
            component: resolve => require(['../page/print.vue'], resolve)
        }, 
        {
            path: "/contract/detail",
            name: "/contract/detail",
            component: resolve => require(['../page/contract-detail.vue'], resolve)
        }, 
        {
            path: "/resume/detail",
            name: "resume-details",
            component: resolve => require(['../page/resume-details.vue'], resolve)
        }, 
        {
            path: "/layout",
            component: require('../page/layout.vue'),
            children: [{
                    path: "/index",
                    name: 'index',
                    component: resolve => require(['../page/index.vue'], resolve)
                }, {
                    path: "/deputy-index",
                    name: 'deputy-index',
                    component: resolve => require(['../page/deputy-index.vue'], resolve)
                }, {
                    path: "/deputyTemplate",
                    name: 'deputyTemplate',
                    component: resolve => require(['../page/deputyTemplate.vue'], resolve)
                }, {
                    path: "/register/entry",
                    component: resolve => require(['../page/register-entry.vue'], resolve)
                }, {
                    name: "/register/demander",
                    path: "/register/demander",
                    component: resolve => require(['../page/demander-register.vue'], resolve)
                }, {
                    path: "/register/provider",
                    component: resolve => require(['../page/provider-register.vue'], resolve)
                }, {
                    path: "/topic/list", //新技术专区
                    component: resolve => require(['../page/topic-list.vue'], resolve)
                }, {
                    path: "/topic/publish", //发表新帖
                    component: resolve => require(['../page/publish-topic.vue'], resolve)
                }, {
                    path: "/topic/detail", //帖子详情
                    component: resolve => require(['../page/topic-detail.vue'], resolve)
                }, {
                    path: "/enquipment/list", //设备交易列表
                    component: resolve => require(['../page/enquipment.vue'], resolve)
                }, {
                    path: "/enquipment/publish", //发布设备交易
                    component: resolve => require(['../page/publish-enquipment.vue'], resolve)
                }, {
                    path: "/enquipment/detail", //发布设备详情
                    component: resolve => require(['../page/enquipment-detail.vue'], resolve)
                }, {
                    path: "/recruitment/index",//才人招聘首页
                    component: resolve => require(['../page/recruitment-index.vue'], resolve)
                },
                {
                    path: "/job/index",//职位首页
                    component: resolve => require(['../page/job-index.vue'], resolve)
                },
                {
                    path: "/job/detail",//职位详情
                    component: resolve => require(['../page/job-detail.vue'], resolve)
                },
                {
                    path: "/resume/list",//简历搜索
                    component: resolve => require(['../page/resume-list.vue'], resolve)
                },
                {
                    path: '/register/success',
                    component: resolve => require(['../page/register-success.vue'], resolve)
                },
                //引导完善信息；
                {
                    path: '/GuideInfo',
                    component: resolve => require(['../page/GuideInfo.vue'], resolve)
                },
                //找回密码；
                {
                    path: '/RetrievePassword',
                    component: resolve => require(['../page/RetrievePassword.vue'], resolve)
                }, {
                    path: "/deputy-index2",
                    name: 'deputy-index2',
                    component: resolve => require(['../page/deputy-index2.vue'], resolve)
                }, {
                    path: "/deputy-index3",
                    name: 'deputy-index3',
                    component: resolve => require(['../page/deputy-index3.vue'], resolve)
                }, {
                    path: "/deputy-common",
                    name: 'deputy-common',
                    component: resolve => require(['../page/deputy-common.vue'], resolve)
                }, {
                    path: "/Tree-common",
                    name: 'Tree-common',
                    component: resolve => require(['../page/Tree-common.vue'], resolve)
                }, {
                    path: "/NavMenu",
                    name: 'NavMenu',
                    component: resolve => require(['../page/NavMenu'], resolve)
                }, {
                    path: "/generate-order",
                    name: "/generate-order",
                    component: resolve => require(['../page/generate-order.vue'], resolve)
                }, {
                    path: "/pay",
                    component: resolve => require(['../page/pay.vue'], resolve)
                }, {
                    path: "/pay-success",
                    component: resolve => require(['../page/pay-success.vue'], resolve)
                }, {
                    path: "/pay-error",
                    component: resolve => require(['../page/pay-error.vue'], resolve)
                }, {
                    path: "/completed-order", //确定收货
                    component: resolve => require(['../page/completed-order.vue'], resolve)
                }, {
                    path: "/quote/manual",
                    component: resolve => require(['../page/manual-quote.vue'], resolve)
                }, {
                    path: "/quote/3d",
                    component: resolve => require(['../page/three-quote.vue'], resolve)
                }, {
                    path: "/quote/excel",
                    component: resolve => require(['../page/excel-quote.vue'], resolve)
                }, {
                    path: "/quote/excel/edit",
                    component: resolve => require(['../page/edit-excel-quote.vue'], resolve)
                }, {
                    path: "/quote/manual/edit",
                    component: resolve => require(['../page/edit-manual-quote.vue'], resolve)
                }, {
                    path: "/quote/auto",
                    name: '/quote/auto',
                    component: resolve => require(['../page/auto-quote.vue'], resolve)
                }, {
                    path: "/produce-order", //自动报价提交订单入口
                    component: resolve => require(['../page/produce-order.vue'], resolve)
                }, {
                    path: "/generate-order", //人工报价提交订单入口
                    component: resolve => require(['../page/generate-order.vue'], resolve)
                }, {
                    path: "/order-detail",
                    component: resolve => require(['../page/order-detail.vue'], resolve)
                }, {
                    path: "/product-case",
                    component: resolve => require(['../page/product-case.vue'], resolve)
                }, {
                    path: "/product-detail",
                    component: resolve => require(['../page/product-detail.vue'], resolve)
                }, {
                    path: "/quote/success",
                    component: resolve => require(['../page/quotation-success.vue'], resolve)
                }, {
                    path: "/buycar", //购物车
                    component: resolve => require(['../page/buycar.vue'], resolve),
                }, {
                    path: "/crafts-list", //工艺
                    component: resolve => require(['../page/crafts-list.vue'], resolve),

                }, {
                    path: "/enquiry/list", //询价
                    component: resolve => require(['../page/enquiry-list.vue'], resolve)
                }, {
                    path: "/enquiry/detail", //询价详情
                    component: resolve => require(['../page/enquiry-detail.vue'], resolve)
                }, {
                    path: "/enquiry/detailInfo", //询价详情（3D）
                    component: resolve => require(['../page/enquiry-detail3D.vue'], resolve)
                }, {
                    path: "/enquiry/detail/my", //我的询价详情
                    component: resolve => require(['../page/my-enquiry-detail.vue'], resolve)
                }, {
                    path: "/crafts-detail", //工艺
                    component: resolve => require(['../page/crafts-detail.vue'], resolve),
                }, {
                    path: "/materials-list", //材料
                    component: resolve => require(['../page/materials-list.vue'], resolve),

                }, {
                    path: "/materials-detail", //材料
                    component: resolve => require(['../page/materials-detail.vue'], resolve),

                }, {
                    path: "/manufacturer-audits", //供应商主页
                    component: resolve => require(['../page/manufacturer-audits.vue'], resolve)
                }, {
                    path: "/technical-zone", //技术专区
                    component: resolve => require(['../page/technical-zone.vue'], resolve)
                }, {
                    path: "/TestScripts", //测试脚本
                    component: resolve => require(['../page/TestScripts.vue'], resolve)
                }, {
                    path: "/manufacturer-library", //供应商库
                    component: resolve => require(['../page/manufacturer-library.vue'], resolve)
                }, {
                    path: "/manufacturer-sort", //供应商库排名
                    component: resolve => require(['../page/manufacturer-sort.vue'], resolve)
                }, {
                    path: "/be-manufacturer",
                    component: resolve => require(['../page/manufacturer.vue'], resolve)
                }, {
                    path: "/contract", //服务协议
                    component: resolve => require(['../page/contract.vue'], resolve)
                }, {
                    path: "/industry-case", //行业案例
                    component: resolve => require(['../page/industry-case.vue'], resolve),
                    children: [{
                        path: "/",
                        redirect: "/case-list",
                    }, {
                        path: "/case-list",
                        component: resolve => require(['../page/case-list.vue'], resolve)
                    }, {
                        path: "/case-detail",
                        component: resolve => require(['../page/case-detail.vue'], resolve)
                    }, {
                        path: "/case-result",
                        component: resolve => require(['../page/case-result.vue'], resolve)
                    }]
                }, {
                    path: "/quote/detail/my",
                    component: resolve => require(['../page/my-quotation-detail.vue'], resolve)
                }, {
                    path: "/quotation",
                    component: resolve => require(['../page/quotation.vue'], resolve)
                }, {
                    path: "/quote",
                    component: resolve => require(['../page/quote.vue'], resolve)
                }, {
                    path: "/Combined-Info", //核价单信息
                    name: 'Combined-Info',
                    component: resolve => require(['../page/Combined-Info.vue'], resolve)
                }, {
                    path: "/deliverOrder", //核价单信息
                    name: 'deliverOrder-Print',
                    component: resolve => require(['../page/deliverOrder-Print.vue'], resolve)
                }, {
                    path: "/usercenter",
                    component: resolve => require(['../page/usercenter.vue'], resolve),
                    children: [{
                        path: "/",
                        redirect: "usercenter-index",
                    }, {
                        path: "usercenter-index", //管理中心
                        component: resolve => require(['../page/usercenter-index.vue'], resolve)
                    }, {
                        path: "my-require", //我的需求
                        component: resolve => require(['../page/my-require.vue'], resolve)
                    }, {
                        path: "received-require", //收到的需求
                        component: resolve => require(['../page/received-require.vue'], resolve)
                    }, {
                        path: "received-order", //收到的订单
                        component: resolve => require(['../page/received-order.vue'], resolve)
                    }, {
                        path: "require-order", //我的订单
                        component: resolve => require(['../page/require-order.vue'], resolve)
                    }, {
                        path: "address", //收货地址
                        component: resolve => require(['../page/address.vue'], resolve)
                    }, {
                        path: "account-settings", //账号管理
                        component: resolve => require(['../page/account-settings'], resolve)
                    }, {
                        path: "message-settings", //消息提醒设置
                        component: resolve => require(['../page/message-settings.vue'], resolve)
                    }, {
                        path: "quotation-detail",
                        component: resolve => require(['../page/quotation-detail.vue'], resolve)
                    }, {
                        path: "my-invoice", //我的发票
                        component: resolve => require(['../page/my-invoice.vue'], resolve)
                    }, {
                        path: "invoice-detail",
                        component: resolve => require(['../page/invoice-detail.vue'], resolve)
                    }, {
                        path: "my-invoice-detail",
                        component: resolve => require(['../page/my-invoice-detail.vue'], resolve)
                    }, {
                        path: "invoice-manage", //开票管理
                        component: resolve => require(['../page/invoice-manage.vue'], resolve)
                    }, {
                        path: "refund-order",
                        component: resolve => require(['../page/refund-order.vue'], resolve)
                    }, {
                        path: "account-manage",
                        component: resolve => require(['../page/subaccount-manage.vue'], resolve)
                    }, {
                        path: "company-service",
                        component: resolve => require(['../page/company-service.vue'], resolve)
                    }, {
                        path: "company-information",
                        component: resolve => require(['../page/company-information.vue'], resolve)
                    }, {
                        path: "company-information-modify",
                        component: resolve => require(['../page/company-information.vue'], resolve)
                    }, {
                        path: "company-settings",
                        component: resolve => require(['../page/company-settings.vue'], resolve)
                    }, {
                        path: "add-subaccount",
                        component: resolve => require(['../page/add-subaccount.vue'], resolve)
                    }, {
                        path: "edit-subaccount",
                        component: resolve => require(['../page/edit-subaccount.vue'], resolve)
                    }, {
                        path: "quotation-list",
                        name: "quotation-list",
                        component: resolve => require(['../page/quotation-list.vue'], resolve)
                    }, {
                        path: "my-manufacturer", //我的供应商
                        component: resolve => require(['../page/my-manufacturer.vue'], resolve)
                    }, {
                        path: "publish-case", //发布产品案例
                        component: resolve => require(['../page/publish-case.vue'], resolve)
                    }, {
                        path: "product-list", //产品案例列表
                        component: resolve => require(['../page/product-list.vue'], resolve)
                    }, {
                        path: "sys-message", //站内消息
                        component: resolve => require(['../page/sys-message.vue'], resolve)
                    }, {
                        path: "evaluate", //评价
                        component: resolve => require(['../page/evaluate.vue'], resolve)
                    }, {
                        path: "launch-aftersale", //发起售后
                        component: resolve => require(['../page/launch-aftersale.vue'], resolve)
                    }, {
                        path: "apply-aftersale", //申请售后
                        component: resolve => require(['../page/apply-aftersale.vue'], resolve)
                    }, {
                        path: "aftersale-detail", //售后详情
                        component: resolve => require(['../page/aftersale-detail.vue'], resolve)
                    }, {
                        path: "aftersale-record", //售后记录
                        component: resolve => require(['../page/aftersale-record.vue'], resolve)
                    }, {
                        path: "edit-case", //编辑案列
                        component: resolve => require(['../page/edit-case.vue'], resolve)
                    }, {
                        path: "usercenter-index", //个人中心-首页
                        component: resolve => require(['../page/usercenter-index.vue'], resolve)
                    }, {
                        path: "my-Combined-list", //我的核价清单；
                        component: resolve => require(['../page/my-Combined-list.vue'], resolve)
                    }, {
                        path: "position-manage", //职位管理
                        component: resolve => require(['../page/position-manage.vue'], resolve)
                    }, {
                        path: "position-issue", //发布职位
                        component: resolve => require(['../page/position-issue.vue'], resolve)
                    }, {
                        path: "my-resume", //我的简历
                        component: resolve => require(['../page/my-resume.vue'], resolve)
                    }, 
                    {
                        path: "my-deliver", //我的投递
                        component: resolve => require(['../page/my-delivery.vue'], resolve)
                    },
                    {
                        path: "received-resume", //收到的简历；
                        component: resolve => require(['../page/received-resume.vue'], resolve)
                    },
                    ]
                },
            ]
        },
    ]
})
export default router;