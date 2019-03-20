<template>
    <div id="post-detail">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/enquipment/list'})">设备交易</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">详情</span>
            </div>
            <div class="main-content">
                <div class="article">
                    <div class="title">{{data.title}}</div>
                    <div class="info">
                        <label for="">{{data.username}}</label>
                        <label for="">{{data.createTime}}</label>
                    </div>
                    <div class="article-content">
                        <div class="cover-pic">
                            <img :src="data.coverPicturl" alt="">
                        </div>
                        <div v-html="data.content"></div>
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
            data:'',
        }
    },
    created() {
        var id =  Number(this.$route.query.id);
        this.$http.post('/custom/EquipSale/get', {id: id}).then((res) => {
            if ( res.data.code == 200 ) {
                this.data = res.data.data;
            } else {
                this.$error(res.data.message);
            }
        })
    }
}
</script>
<style lang="less">
#post-detail{
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
        .main-content{
            background: #fff;
            padding: 13px 20px;
            min-height: 560px;
            .article{
                width: 940px;
                margin: 16px auto;
                .title{
                    font-size: 20px;
                    color: #777;
                    text-align: center;
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
                img{
                    display: block;
                    max-width: 800px;
                    margin: auto;
                }
                p{
                    text-indent: 24px;
                    line-height: 24px;
                }
                .cover-pic{
                    img{
                        margin: 15px auto;
                    }
                }
                .article-content{
                    margin-top: 22px;
                }
            }
        }
    } 
}
</style>
