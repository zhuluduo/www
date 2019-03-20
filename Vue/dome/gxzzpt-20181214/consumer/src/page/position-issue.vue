<template>
    <div id="position-issue">
        <div class="opearaton clearfix">
            <div class="add-btn fl-right" @click="submitForm('ruleForm')">{{flag?'保存职位':'发布职位'}}</div>
        </div>
        <div class="box">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                <p class="title">基本信息</p>
                <div class="basic-info">
                    <div class="content">
                        <el-form-item label="职位名称" prop="jobName">
                            <el-input v-model="ruleForm.jobName"></el-input>
                        </el-form-item>
                        <el-form-item label="薪资范围" prop="salaryScope">
                            <el-select v-model="ruleForm.salaryScope" placeholder="请选择薪资">
                                <el-option
                                    v-for="item in options.salary"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div class="inner">
                            <div class="innerleft">
                                <el-form-item label="招聘人数" prop="hiringNumber" >
                                    <el-input v-model="ruleForm.hiringNumber" placeholder="请填写招聘人数"></el-input>
                                    <span class="innerleftUnit">人</span>
                                </el-form-item>
                            </div>
                            <div class="innerRght">
                                <el-form-item label="经验要求" prop="experienceRequire">
                                    <el-select v-model="ruleForm.experienceRequire" placeholder="请选择经验">
                                        <el-option
                                            v-for="item in options.experience"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="inner">
                            <div class="innerleft">
                                <el-form-item label="开始时间" prop="startTime">
                                    <el-date-picker
                                        v-model="ruleForm.startTime"
                                        type="date"
                                        placeholder="开始日期"
                                        :picker-options="pickerOptions1"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="innerRght">
                                <el-form-item label="结束时间" prop="endTime">
                                    <el-date-picker
                                        v-model="ruleForm.endTime"
                                        type="date"
                                        placeholder="结束日期"
                                        :picker-options="pickerOptions2"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="inner">
                            <div class="innerleft">
                                <el-form-item label="学历要求" prop="degreeLevel">
                                    <el-select v-model="ruleForm.degreeLevel" placeholder="请选择学历">
                                        <el-option
                                            v-for="item in options.degreeLevel"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="innerRght">
                                <el-form-item label="职业技能" prop="jobFunction">
                                    <el-select v-model="ruleForm.jobFunction" placeholder="请选择活动区域">
                                        <el-option 
                                            v-for="item in options.jobSkill" 
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <el-form-item label="上班地区：" class="required" prop="selectList">
                            <template>
                                <div class="select-area">
                                    <area-select type="text" v-model="ruleForm.selectList" :data="$areaData" :level="2" @change="addressTrigger"></area-select>
                                </div>
                            </template>
                        </el-form-item>
                        <el-form-item label="详细地址：" class="required" prop="address">
                            <el-input v-model="ruleForm.address" placeholder="请您填写详细的地址" ></el-input>
                        </el-form-item>
                    </div>
                </div>
                <p class="title">职位信息</p>
                <div class="position-info">
                    <div class="content">
                        <el-form-item label="职位描述" prop="jobDetail">
                            <quill-editor ref="myTextEditor"  :options="editorOption"  v-model="ruleForm.jobDetail"></quill-editor>  
                        </el-form-item>
                        <el-form-item label="任务要求" prop="jobRequire">
                            <quill-editor ref="myTextEditor"  :options="editorOption"  v-model="ruleForm.jobRequire"></quill-editor>  
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pickerOptions1:{
                disabledDate: (time) =>{
                    if(this.ruleForm.endTime){
                        let endTime = new Date(this.ruleForm.endTime).getTime();
                        if(endTime > time.getTime()+86400000){
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                       return false; 
                    }
                }
            },
            pickerOptions2:{
                disabledDate: (time) =>{
                    if(this.ruleForm.startTime){
                        let startTime = new Date(this.ruleForm.startTime).getTime();
                        if(startTime < time.getTime()){
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return false;
                    }
                }
            },
            options:{
                salary:this.$LocalStorage.getWords(168),
                jobSkill:this.$LocalStorage.getWords(171),
                degreeLevel:this.$LocalStorage.getWords(172),
                experience:this.$LocalStorage.getWords(173),
            },
            ruleForm: {
                selectList:[],
                jobName:'',
                startTime:'',
                endTime:'',
                province:'',
                city:'',
                region: '',
                address:'',
                salaryScope: null,
                hiringNumber:null,
                experienceRequire:null,
                degreeLevel: null,
                jobFunction: null,
                jobDetail:'',
                jobRequire:'',
            },
            rules: {
                jobName: [
                    { required: true, message: '请输入职位名称', trigger: 'blur' },
                ],
                startTime: [
                    { required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                salaryScope: [
                    { required: true, message: '请选择薪资范围', trigger: 'change' }
                ],
                experienceRequire: [
                    { required: true, message: '请选择经验', trigger: 'change' }
                ],
                degreeLevel: [
                    { required: true, message: '请选择学历', trigger: 'change' }
                ],
                jobFunction: [
                    { required: true, message: '请选择职业技能', trigger: 'change' }
                ],
                hiringNumber: [
                    { required: true, message: '请填写招聘人数', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ],
                selectList:[
                    { required: true, message: "请您填写省市区"}
                ],
                jobDetail: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ],
                jobRequire: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ],
            },
            flag:null,
            editorOption:{
                modules:{
                    toolbar:[
                        ['bold', 'italic', 'underline', 'strike'], 
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],     
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],  
                        [{ 'indent': '-1'}, { 'indent': '+1' }],   
                        [{ 'direction': 'rtl' }],               
                        [{ 'size': ['small', false, 'large', 'huge'] }], 
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                    ]
                },
                theme:'snow'
            },
        };
    },
    created() {
        let id = this.$route.query.id;
        if(id){
            let parameter = {'id':Number(id)};
            this.getJobInfo(parameter);
            this.flag =true;
        }
    },
    //页面在顶部；
    mounted() {
    },
    filters: {
    },
    methods: {
        //添加职位API；
        async JobInfo(parameter){
            let res 
            if (this.flag) {
                res = await this.$http.post('/custom/manufacturer/jobInfo/update',parameter);
            } else {
                res = await this.$http.post('/custom/manufacturer/jobInfo/add',parameter);
                
            }
            this.$ResultTips(res);
            if(res.data.code == 200){
                this.$router.push({path:'/usercenter/position-manage'})
            }
        },
        //获取职位数据Api；
        async getJobInfo(parameter){
            let res = await this.$http.post('/custom/manufacturer/jobInfo/get',parameter);
            if(res.data.code == 200){
                let resData =res.data.data;
                for (let key in resData) {
                    this.ruleForm[key] = resData[key]
                }
                this.ruleForm['selectList'] =[ resData['province'] , resData['city'] , resData['region']]
            }
        },
        //数据处理逻辑;
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let parameter = {};
                    this.ruleForm.province = this.ruleForm.selectList[0]
                    this.ruleForm.city = this.ruleForm.selectList[1]
                    this.ruleForm.region = this.ruleForm.selectList[2]
                    for (let key in this.ruleForm) {
                        if(key != 'selectList'){
                            parameter[key] = this.ruleForm[key]
                        }
                    }
                    parameter.hiringNumber = Number(parameter.hiringNumber)||1;
                    this.JobInfo(parameter)
                } else {
                    return false;
                }
            });
        },
        //省级联动局部验证；
        addressTrigger(val){
            this.$refs.ruleForm.validateField('selectList');
        },  
    }
};
</script>
<style lang="less" scoped>
#position-issue{
    .opearaton{
        padding: 7px 0;
        border-bottom: 1px solid #e2e2e2;
    }
    .box{
        .basic-info,.position-info{
            background-color: #f1f1f1;
            padding: 15px 0 2px 0;
        }
        .title{
            padding: 10px 0 10px 0;
            font-size: 14px;
            color: #777;
        }
        .content{
            width: 600px;
            margin: 0 24px;
            .inner{
                display: flex;
                justify-content: space-between;
                .innerRght,.innerleft{
                    width: 256px;
                    position: relative;
                }
                .innerleftUnit{
                    position: absolute;
                    top: 0px;
                    right: 5px;
                }
            }
        }
    }
}
</style>
<style lang="less">
#position-issue {
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>