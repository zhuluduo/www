<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in menuList">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                       <template slot="title">
                           <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                       </template>
                       <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                           {{ subItem.title }}
                       </el-menu-item>
                   </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                       <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                   </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                menuList: [
                    {
                        icon: 'el-icon-location',
                        index: '1',
                        title: '首页'
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '平台管理',
                        subs: [
                            {
                                index: '/platform/user',
                                title: '用户管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '3',
                        title: '数据统计',
                        subs: [
                            {
                                index: '/statistics/flow',
                                title: '流量统计'
                            },
                            {
                                index: '/statistics/retain',
                                title: '留存统计'
                            },
                            {
                                index: '/statistics/activityRate',
                                title: '活跃率'
                            },
                            {
                                index: '/statistics/duration',
                                title: '时长统计'
                            },
                            {
                                index: '/statistics/churnRate',
                                title: '流失率'
                            }
                        ]
                    }
                ],
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'table',
                        title: '基础表格'
                    },
                    {
                        icon: 'el-icon-message',
                        index: 'tabs',
                        title: 'tab选项卡'
                    },
                    {
                        icon: 'el-icon-date',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: '/form',
                                title: '基本表单'
                            },
                            {
                                index: '/editor',
                                title: '富文本编辑器'
                            },
                            {
                                index: '/markdown',
                                title: 'markdown编辑器'
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'charts',
                        title: 'schart图表'
                    },
                    {
                        icon: 'el-icon-rank',
                        index: 'drag',
                        title: '拖拽列表'
                    },
                    {
                        icon: 'el-icon-warning',
                        index: 'permission',
                        title: '权限测试'
                    },
                    {
                        icon: 'el-icon-error',
                        index: '404',
                        title: '404页面'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
            //    return this.$route.path.replace('/','');
                return this.$route.path;
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 160px;
    }
    .sidebar > ul {
        height:100%;
    }
    .iconfont::before{
        font-size: 18px;
    }
</style>
