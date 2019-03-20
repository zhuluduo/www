<template>
    <div id="publish-post">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/topic/list'})">新技术专区</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">发表新帖</span>
            </div>
            <div class="main-content">
                <div class="title">发布新帖</div>
                <div class="form">
                    <el-form label-position="left" :rules="rules" :model="formData" ref="postForm" label-width="40px">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="formData.title"></el-input>
                        </el-form-item>
                        <el-form-item label="板块" prop="topicPlate">
                            <el-select v-model="formData.topicPlate">
                                <el-option v-for="(item, index) in topicPlates" :value="item.id" :label="item.name" :key="'topic'+index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                            <quill-editor ref="myTextEditor" v-model="formData.content"></quill-editor>   
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn-box">
                    <el-button type="primary" size="medium" @click="submit">发布</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            formData: {
                title:'',
                topicPlate:'',
                content:''
            },
            rules:{
                title:[{required:true,message:'请填写标题',trigger:'blur'}],
                topicPlate:[{required:true,message:'请选择板块',trigger:'change'}],
                content:[{required:true,message:'请填写内容',trigger:'blur'}],
            },
            topicPlates:[]
        }
    },
    created() {
        this.topicPlates = this.$LocalStorage.getWords(162);
    },
    methods: {
        submit() {
            this.$refs.postForm.validate(( valid ) => {
                if( valid ) {
                    this.$http.post('/custom/techTopic/add', this.formData).then(( res ) => {
                        if ( res.data.code == 200 ) {
                            this.$success('添加成功');
                            setTimeout(() => {
                                this.$router.push({path:'/topic/list'});
                            }, 500);
                        } else {
                            this.$error(res.data.message);
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
#publish-post{
    .content{
        width: 1200px;
        margin: 0 auto;
        margin-bottom: 50px;
    }
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
        height: 800px;
        padding: 20px 28px;
        .title{
            position: relative;
            font-size: 20px;
            color: #3f8def;
            font-weight: 700;
            text-indent: 5px;
            &::before{
                content: '';
                position: absolute;
                top: 5px;
                left: -5px;
                height: 18px;
                border-left: 4px solid #3f8def;
            }
        }
        .form{
            width: 1000px;
            height: 620px;
            margin: 20px auto;
            .quill-editor{
                height: 450px;
            }
        }
        .btn-box{
            display: flex;
            justify-content: flex-end;
            padding-right: 70px;
        }
    }
}
</style>

