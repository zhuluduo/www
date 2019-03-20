<template>
    <div id="job-detail">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">人才招聘</span>
            </div>
            <div class="summary-info-wrapper">
                <div class="main-info">
                    <span class="job-name">{{data.jobName}}</span>
                    <span class="salary">{{data.salaryScopeText}}</span>
                </div>
                <div class="company-name" v-if="data.companyInfo">{{data.companyInfo.companyName}}</div>
                <div class="other-info">
                    <span>{{data.city}}</span>
                    <span>{{data.experienceRequireText}}工作经验</span>
                    <span>{{data.degreeLevelText}}</span>
                    <span>招{{data.hiringNumber}}人</span>
                </div>
                <div class="apply-btn" v-if="flag != 1" @click="apply">申请职位</div>
            </div>
            <div class="detail-info-wrapper clearfix">
                <div class="left" ref="leftWrapper">
                    <div class="job-info-box info-box">
                        <v-title title="职位信息" color="#3f8def"></v-title>
                        <div class="sub-info-box">
                            <div class="sub-title">职责描述：</div>
                            <div class="sub-content" v-html="data.jobDetail"></div>
                        </div>
                        <div class="sub-info-box">
                            <div class="sub-title">任职要求：</div>
                            <div class="sub-content" v-html="data.jobRequire"></div>
                        </div>
                    </div>
                    <div class="info-box address-info-box">
                        <v-title title="上班地址" color="#3f8def"></v-title>
                        <div class="info-content">{{data.province+data.city+data.region+data.address}}</div>
                    </div>
                    <div class="info-box">
                        <v-title title="公司信息" color="#3f8def"></v-title>
                        <div class="info-content" v-html="data.companyInfo?data.companyInfo.introduceInfo:''">
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="company-info">
                        <v-title title="公司信息" color="#3f8def"></v-title>
                        <div class="info-list">
                            <div class="info-item tb-link" @click="$router.push({path:'/manufacturer-audits', query:{companyId:data.companyInfo.id}})">{{data.companyInfo?data.companyInfo.companyName:'-'}}</div>
                            <div class="info-item">{{data.companyInfo?data.companyInfo.employeeScaleText:'-'}}</div>
                            <div class="info-item">{{data.companyInfo?(data.companyInfo.industryName||''):''}}</div>
                        </div>
                    </div>
                    <div class="similar-job" ref="similarWrapper">
                        <v-title title="相似职位" color="#3f8def"></v-title>
                        <div class="item-box" @click="toJobDetail(item)" v-if="data.similarJobList" v-for="(item, index) in data.similarJobList" :key="'similar' + index">
                            <div class="info-item">{{item.jobName}}</div>
                            <div class="info-item company-name">{{item.companyInfo?item.companyInfo.companyName:'-'}}</div>
                            <div class="info-item other-info-item"> 
                                <span class="salary">{{item.salaryScopeText}}</span>
                                <span class="address">{{item.city}}</span> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import title from './../components/title.vue';
export default {
    components: {
        'v-title':title,
    },
    data() {
        return {
            id: '',
            data:'',
            flag:this.$route.query.flag,
        }
    },
    created() {
        this.id = Number(this.$route.query.id);
        this.$http.post('/custom/jobInfo/get', {id: this.id}).then(( res ) => {
            if ( res.data.code == 200 ) {
                this.data = res.data.data;
            }
        })
    },
    mounted() {
        this.$refs.similarWrapper.style.height = (this.$refs.leftWrapper.offsetHeight-176) + 'px';
    },
    methods: {
        apply() {
            this.$confirm('确定申请该职位？','提示').then(() => {
                this.$http.post('/custom/jobInfo/apply',{id: this.id}).then(( res ) => {
                    if ( res.data.code == 200 ) {
                        this.$success('申请成功');
                    } else {
                        this.$error(res.data.message);
                    }
                })
            })
        },
        toJobDetail( item ) {
            let {href} = this.$router.resolve({path:'/job/detail', query:{id: item.id}})
            window.open(href, '_blank');
        }
    }
}
</script>

<style lang="less">
#job-detail{
    .content{
        width: 1200px;
        margin: 0 auto;
        margin-bottom: 50px;
        .summary-info-wrapper{
            position: relative;
            width: 1200px;
            height: 116px;
            padding: 15px 20px;
            background-color: #ffffff;
            box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
            .main-info{
                span{
                    font-size: 18px;
                }
                .job-name{
                    color: #797979;
                }
                .salary{
                    color: #f9b33c;
                    margin-left: 43px;
                }
            }
            .company-name{
                font-size: 14px;
                margin-top: 11px;
            }
            .other-info{
                margin-top: 12px;
                span{
                    font-size: 12px;
                    color: #a09f9f;
                    margin-right: 15px;
                }
            }
            .apply-btn{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                width: 112px;
                height: 38px;
                background-color: #3f8def;
                border-radius: 4px;
                font-size: 14px;
                color: #fff;
                text-align: center;
                line-height: 38px;
                cursor: pointer;
            }
        }
        .detail-info-wrapper{
            margin-top: 10px;
            .left{
                float: left;
                width: 848px;
                min-height: 1026px;
                padding: 20px;
                background-color: #ffffff;
                box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                .info-box{
                    .sub-title{
                        font-weight: 700;
                        margin: 18px 0 10px 0;
                    }
                    .sub-content{
                        p{
                            line-height: 26px;
                        }
                    }
                    .info-content{
                        margin-top: 18px;
                        p{
                            line-height: 26px;
                        }
                    }
                }
                .info-box + .info-box{
                    margin-top: 31px;
                }
            }
            .right{
                float: left;
                width: 342px;
                min-height: 1026px;
                margin-left: 10px;
                .company-info{
                    height: 166px;
                    padding: 20px;
                    background-color: #ffffff;
                    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                    .info-list{margin-top: 18px;}
                    .info-item{
                        line-height: 29px;
                    }
                }
                .similar-job{
                    margin-top: 10px;
                    padding: 20px;
                    min-height: 850px;
                    background-color: #ffffff;
                    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                    .item-box{
                        border-bottom: 1px solid #e2e2e2;
                        padding: 9px 0;
                        margin-top: 8px;
                        cursor: pointer;
                        .info-item{
                            font-size: 14px;
                            line-height: 29px;
                        }
                        .company-name{
                            font-size: 12px;
                        }
                        .other-info-item{
                            display: flex;
                            justify-content: space-between;
                            .salary{
                                font-size: 12px;
                                color: #f9b33c;
                            }
                            .address{
                                display: inline-block;
                                width: 100px;
                                font-size: 12px;
                                color: #a09f9f;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>

