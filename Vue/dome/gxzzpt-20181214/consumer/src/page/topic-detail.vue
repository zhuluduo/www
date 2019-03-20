<template>
    <div id="topic-detail">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/topic/list'})">新技术专区</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">详情</span>
            </div>
            <div class="main-content">
                <div class="reply-btn">
                    <div class="btn" @click="toReply">回复</div>
                </div>
                <div class="article">
                    <div class="title">{{data.title}}</div>
                    <div class="info">
                        <label v-if="data.userInfo" for="">{{data.userInfo.username}}</label>
                        <label for="">{{data.createTime}}</label>
                        <label for="">{{(data.techReplyList&&data.techReplyList.list)?data.techReplyList.list.length:'0'}}回复</label>
                    </div>
                    <div class="article-content">
                        <div v-html="data.content"></div>
                    </div>
                </div>
            </div>
            <div class="reply-content">
                <div class="title">评论</div>
                <div class="reply-list" v-if="data.techReplyList">
                    <div class="empty-reply" v-if="!data.techReplyList.list">暂无评论~~</div>
                    <div class="reply-item" v-if="data.techReplyList.list" v-for="(item, index) in data.techReplyList.list" :key="'reply-item-' + index">
                        <img v-if="item.userInfo" :src="item.userInfo.portrait" alt="">
                        <div class="right">
                            <div class="user-info">
                                <span class="user">{{item.userInfo&&item.userInfo.username}}</span>
                                <span>{{item.createTime}}</span>
                            </div>
                            <div class="reply-text">
                                {{item.content}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="title">回复</div>
                <div class="form">
                    <el-form :model="replyForm" ref="replyForm" :rules="rules">
                        <el-form-item prop="content">
                            <el-input :rows="5" type="textarea" v-model="replyForm.content"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="reply-btn">
                        <div class="btn" @click="submit">回复</div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            id:'',
            replyForm: {
                content:''
            },
            rules:{
                content:[{required:true,message:'请填写内容',trigger:'blur'}],
            },
            data:''
        }
    },
    created() {
        this.id = Number(this.$route.query.id);
        this.getData();
        
    },
    methods: {
        toReply() {
            var bodyEl = document.getElementsByTagName('body')[0];
            window.scrollTo(0, bodyEl.scrollHeight)
        },
        getData() {
            this.$http.post('/custom/techTopic/get',{id:this.id}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.data = res.data.data;
                } else {

                }
            })
        },
        submit() {
            this.$refs.replyForm.validate((valid) => {
                if ( valid ) {
                    this.$http.post('/custom/techReply/add',{techTopicId: this.id, content: this.replyForm.content}).then((res) => {
                        if ( res.data.code == 200 ) {
                            this.getData();
                            this.$refs.replyForm.resetFields();
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
#topic-detail{
    .content{
        width: 1200px;
        margin: 0 auto;
        margin-bottom: 50px;
        min-height: 600px;
        .crumb-bread{
            height: 35px;
            line-height: 35px;
            .router-link{
                cursor: pointer;
                &:hover{
                    color: #3f8def;
                    text-decoration: underline;
                }
            }
            .right-arrow{
                margin: 0 5px;
            }
            .curr{
                color: #3f8def;
            }
        }
        .reply-btn{
            display: flex;
            justify-content: flex-end;
            .btn{
                width: 98px;
                height: 32px;
                text-align: center;
                line-height: 32px;
                border-radius: 4px;
                background: #3f8def;
                font-size: 14px;
                color: #fff;
                cursor: pointer;
            }
        }
        .main-content{
            background: #fff;
            padding: 13px 20px;
            .article{
                width: 940px;
                margin: 16px auto;
                .title{
                    font-size: 20px;
                    color: #777;
                    text-align: center;
                }
                img{
                    display: block;
                    max-width: 800px;
                    margin: auto;
                }
                p{
                    text-indent: 24px;
                    line-height: 24px;
                }
                .info{
                    display: flex;
                    justify-content: center;
                    font-size: 14px;
                    color: #a09f9f;
                    margin-top: 14px;
                    label{
                        margin: 0 10px;
                        color: #a09f9f;
                    }
                }
                .article-content{
                    margin-top: 22px;
                }
            }
        }
        .reply-content{
            margin-top: 10px;
            padding: 20px 34px;
            background: #fff;
            .title{
                position: relative;
                font-size: 20px;
                color: #3f8def;
                font-weight: 700;
                text-indent: 5px;
                margin-bottom: 5px;
                &::before{
                    content: '';
                    position: absolute;
                    top: 5px;
                    left: -5px;
                    height: 18px;
                    border-left: 4px solid #3f8def;
                }
            }
            .reply-list{
                margin-bottom: 35px;
                .empty-reply{
                    height: 100px;
                    text-align: center;
                    line-height: 100px;
                }
                .reply-item{
                    display: flex;
                    justify-content: flex-start;
                    padding: 17px 0px 19px 30px;
                    border-bottom: 1px solid #e2e2e2;
                    margin-right: 90px;
                    img{
                        display: block;
                        width: 56px;
                        height: 56px;
                        border: 1px solid #e2e2e2;
                        border-radius: 50%;
                        margin-right: 20px;
                    }
                    .right{
                        flex: 1;
                        .user-info{
                            margin-bottom: 10px;
                            span{
                                font-size: 12px;
                                color: #777;
                            }
                            .user{
                                color: #3f8def;
                                margin-right: 10px;
                            }
                        }
                        .reply-text{
                            line-height: 24px;
                            color: #777;
                        }
                    }
                }
            }
            .form{
                padding: 12px 90px 10px 30px;
            }
        }
    }
}
</style>
