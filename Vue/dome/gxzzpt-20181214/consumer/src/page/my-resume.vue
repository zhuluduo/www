<template>
    <div id="my-resume">
        <div class="header">
            <v-operation>
                <div>
                    <span>最后更新时间：{{tableData.updateTime}}</span>
                    <span class="status">{{tableData.isPublic?'公开':'隐藏'}}</span>
                </div>
                <div slot="right">
                    <div class="add-btn style" @click="isPublic">{{tableData.isPublic?'隐藏简历':'公开简历'}}</div>
                    <div class="add-btn style" @click="updateResume">刷新简历</div>
                    <div class="add-btn" @click="submitResume">保存简历</div>
                </div>
            </v-operation>
        </div>
        <div class="box">
            <div class="basics-info">
                <p class="title">基本信息</p>
                <div class="clearfix">
                    <div class="content fl-left">
                        <el-form :model="tableData" :rules="rules" ref="basicsForm" label-width="75px" class="demo-ruleForm">
                            <div class="inner">
                                <div class="innerleft">
                                    <el-form-item label="姓名：" prop="name">
                                        <el-input v-model="tableData.name" placeholder="请输入姓名"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="出生年月" prop="birthDay">
                                        <el-date-picker
                                        v-model="tableData.birthDay"
                                        type="date"
                                        placeholder="选择出生日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="inner">
                                <div class="innerleft">
                                    <el-form-item label="求职状态" prop="jobStatus">
                                        <el-select v-model="tableData.jobStatus" placeholder="请选择求职状态">
                                            <el-option
                                                v-for="item in options.jobStatus"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="性别" prop="gender">
                                        <el-select v-model="tableData.gender" placeholder="请选择性别">
                                            <el-option
                                                v-for="item in options.genderStatus"
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
                                    <el-form-item label="婚姻状态:" prop="maritalStatus">
                                    <el-select v-model="tableData.maritalStatus" placeholder="请选择婚姻状态">
                                            <el-option
                                                v-for="item in options.maritalStatus"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="身高:" prop="height">
                                        <el-input v-model="tableData.height" placeholder="请输入身高"></el-input>
                                        <span class="innerleftUnit">CM</span>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="inner">
                                <div class="innerleft">
                                    <el-form-item label="正在面貌" prop="politicsStatus">
                                        <el-select v-model="tableData.politicsStatus" placeholder="请选择政治面貌">
                                            <el-option
                                                v-for="item in options.politicsStatus"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="微信号" prop="wechatNo">
                                        <el-input v-model="tableData.wechatNo" placeholder="请输入微信号"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="inner">
                                <div class="innerleft">
                                    <el-form-item label="手机号" prop="phone">
                                        <el-input v-model="tableData.phone" placeholder="请输入手机号"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="邮箱" prop="email">
                                        <el-autocomplete
                                        v-model="tableData.email"
                                        :fetch-suggestions="querySearch"
                                        :trigger-on-focus="false"
                                        ></el-autocomplete>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="inner">
                                <div class="innerleft">
                                    <el-form-item label="工作年限" prop="workYears">
                                        <el-input v-model="tableData.workYears" placeholder="请输入工作年限"></el-input>
                                        <span class="innerleftUnit">年</span>
                                    </el-form-item>
                                </div>
                            </div>
                            <el-form-item label="现住址" prop="currentAddList" class="required">
                                <div class="select-area1"  >
                                    <area-select  v-if="flag"  type="text" v-model="tableData.currentAddList" :data="$areaData" :level="1"></area-select>
                                </div>
                            </el-form-item>
                            <el-form-item label="家庭地址：" class="required" prop="familyAddList">
                                <div class="select-area">
                                    <area-select type="text" v-if="flag"  v-model="tableData.familyAddList" :data="$areaData" :level="2"></area-select>
                                </div>
                            </el-form-item>
                            <el-form-item label="详细地址:" class="required" prop="familyAddress" >
                                <el-input v-model="tableData.familyAddress" placeholder="请您填写详细的地址" ></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="fl-right imgStyle" v-if="tableData.portrait">
                        <az-upload  @imgUrl="getimgUrl" :img='tableData.portrait'></az-upload>
                    </div>
                </div>
            </div>
            <div class="intension">
                <p class="title">求职意向</p>
                <div class="content">
                    <el-form :model="tableData" :rules="rules" ref="intensionForm" label-width="75px" class="demo-ruleForm">
                        <div class="inner">
                            <div class="innerleft">
                                <el-form-item label="期望薪资:" prop="expectSalary">
                                    <el-select v-model="tableData.expectSalary" placeholder="请选择薪资">
                                        <el-option
                                            v-for="item in options.expectSalaryStatus"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="innerRght">
                                <el-form-item label="工作类型" prop="expectJobType">
                                    <el-select v-model="tableData.expectJobType" placeholder="请选择薪资">
                                        <el-option
                                            v-for="item in options.expectJobTypeStatus"
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
                                <el-form-item label="职能" prop="jobFunction">
                                 <el-select v-model="tableData.jobFunction" placeholder="请选择职能">
                                        <el-option
                                            v-for="item in options.jobFunctionStatus"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="innerRght">
                                <el-form-item label="到岗时间" prop="arrivalTime">
                                    <el-select v-model="tableData.arrivalTime" placeholder="请选择到岗时间">
                                        <el-option
                                            v-for="item in options.arrivalTimeStatus"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <el-form-item label="期望地点" prop="workAddList" >
                            <div class="select-area1">
                                <area-select   v-if="flag" type="text" v-model="tableData.workAddList" :data="$areaData" :level="1"></area-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="自我评价:" class="required" prop="selfEvaluate">
                            <quill-editor ref="myTextEditor"  :options="editorOption"  v-model="tableData.selfEvaluate"></quill-editor>   
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="work-experience">
                <p class="title">工作经验</p>
                <div class="loop" v-for="(item,index) in tableData.ResumeJobList" :key="index">
                    <span class="fl-right deleteStyle" v-if="tableData.ResumeJobList.length>1" @click="deleteExperience(index,1)">删除</span> 
                    <div class="content">
                        <el-form :model="item" :rules="rules" :ref="'jobsForm'+{index}" label-width="75px" class="demo-ruleForm">
                            <div class="innerData">
                                <div class="innerleft">
                                    <el-form-item label="工作时间" prop="startTime">
                                        <el-date-picker
                                            @focus="selectTime(item)"
                                            v-model="item.startTime"
                                            type="month"
                                            :picker-options="pickerOptions1"
                                            placeholder="开始日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="到" prop="endTime">
                                        <el-date-picker
                                            @focus="selectTime(item)"
                                            v-model="item.endTime"
                                            type="month"
                                            :picker-options="pickerOptions2"
                                            placeholder="结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="inner">
                                <div class="innerleft">
                                    <el-form-item label="公司名称" prop="companyName">
                                        <el-input v-model="item.companyName" placeholder="请输入公司名称"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="职位名称" prop="jobName">
                                        <el-input v-model="item.jobName" placeholder="请输入职位名称"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <el-form-item label="工作描述:" class="required" prop="jobDetail">
                                <el-input type="textarea" :rows="2" placeholder="工作描述" v-model="item.jobDetail"> </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="clearfix">
                    <span class="fl-right add-btn btnstyle" @click="addExperience(1)">+新增工作经验</span>
                </div>
            </div>
            <div class="project-experience">
                <p class="title">项目经验</p>
                <div class="loop" v-for="(item,index) in tableData.ResumeProjectList" :key="index">
                    <span class="fl-right deleteStyle" v-if="tableData.ResumeProjectList.length>1" @click="deleteExperience(index,2)">删除</span> 
                    <div class="content">
                        <el-form :model="item" :rules="rules" :ref="'projectForm'+{index}" label-width="75px" class="demo-ruleForm">
                            <div class="innerData">
                                <div class="innerleft">
                                    <el-form-item label="项目时间" prop="startTime">
                                        <el-date-picker
                                            @focus="selectTime(item)"
                                            v-model="item.startTime"
                                            type="month"
                                            :picker-options="pickerOptions1"
                                            placeholder="开始日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="到" prop="endTime">
                                        <el-date-picker
                                            @focus="selectTime(item)"
                                            v-model="item.endTime"
                                            type="month"
                                            :picker-options="pickerOptions2"
                                            placeholder="结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="inner">
                                <div class="innerleft">
                                    <el-form-item label="项目名称" prop="projectName">
                                        <el-input v-model="item.projectName" placeholder="请输入项目名称"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <el-form-item label="项目描述:" class="required" prop="projectDetail">
                                <el-input type="textarea" :rows="2" placeholder="项目描述" v-model="item.projectDetail"> </el-input>
                            </el-form-item>
                            <el-form-item label="职责描述:" class="required" prop="responsibility">
                                <el-input type="textarea" :rows="2" placeholder="职责描述" v-model="item.responsibility"> </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div> 
                <div class="clearfix">
                    <span class="fl-right add-btn btnstyle" @click="addExperience(2)">+新增项目经验</span>
                </div>
            </div>
            <div class="edu-experience">
                <p class="title">教育经验</p>
                <div class="loop" v-for="(item,index) in tableData.ResumeEduList" :key="index">
                    <span class="fl-right deleteStyle" v-if="tableData.ResumeEduList.length>1" @click="deleteExperience(index,3)">删除</span> 
                    <div class="content">
                        <el-form :model="item" :rules="rules" :ref="'eduForm'+{index}" label-width="75px" class="demo-ruleForm">
                           <div class="innerData">
                                <div class="innerleft">
                                    <el-form-item label="教育时间" prop="startTime">
                                        <el-date-picker
                                            @focus="selectTime(item)"
                                            v-model="item.startTime"
                                            type="month"
                                            :picker-options="pickerOptions1"
                                            placeholder="开始日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="到" prop="endTime">
                                        <el-date-picker
                                            @focus="selectTime(item)"
                                            v-model="item.endTime"
                                            type="month"
                                            :picker-options="pickerOptions2"
                                            placeholder="结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="inner">
                                <div class="innerleft">
                                    <el-form-item label="学历/学位:" prop="degreeLevel">
                                        <el-select v-model="item.degreeLevel" placeholder="请选择活动区域">
                                            <el-option
                                                v-for="item in options.degreeLevelStatus"
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
                                    <el-form-item label="学校名称" prop="schoolName">
                                        <el-input v-model="item.schoolName" placeholder="请选择活动区域"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="innerRght">
                                    <el-form-item label="专业名称" prop="majorName">
                                        <el-input v-model="item.majorName" placeholder="请选择活动区域"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-form>
                    </div>
                </div>
                <div class="clearfix">
                    <span class="fl-right add-btn btnstyle" @click="addExperience(3)">+新增教育经验</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import operationBar from '../components/operationBar.vue';
import upload from '../components/upload.vue';
import { validatePhone2 ,validatNumber,EmailAuto,validateEmail} from '../lib/validate.js'
export default {
    data() {
        return {
            currentTime:{},
            pickerOptions1:{
                disabledDate: (time) =>{
                    if(this.currentTime.endTime){
                        let endTime = new Date(this.currentTime.endTime).getTime();
                        if(endTime >= time.getTime()){
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
                    let startTime = new Date(this.currentTime.startTime).getTime();
                    if(startTime<time.getTime()){
                        return false;
                    }else{
                        return true;
                    }
                }
            },
            destroy:true,
            options:{
                jobStatus:this.$LocalStorage.getWords(164),
                genderStatus:this.$LocalStorage.getWords(165),
                maritalStatus:this.$LocalStorage.getWords(166),
                politicsStatus:this.$LocalStorage.getWords(167),
                expectSalaryStatus:this.$LocalStorage.getWords(168),
                expectJobTypeStatus:this.$LocalStorage.getWords(169),
                arrivalTimeStatus:this.$LocalStorage.getWords(170),
                jobFunctionStatus:this.$LocalStorage.getWords(171),
                degreeLevelStatus:this.$LocalStorage.getWords(172),
            },
            tableData: {
                familyAddList:[],
                currentAddList:[],
                workAddList:[],
                isPublic:null,
                id:this.$LocalStorage.gxzzpt2_consumer().id,
                name:'',
                birthDay: "",
                jobStatus: null,
                gender:null,
                maritalStatus:null,
                height:null,
                politicsStatus:null,
                phone:null,
                wechatNo:null,
                email:'',
                workYears: null,
                familyAddress:'',
                portrait:null,
                expectSalary:null,
                expectJobType:null,
                jobFunction:null,
                arrivalTime:null,
                selfEvaluate: "",
                expectCity: null,
                expectProvince: null,
                familyProvince: null,
                familyCity: null,
                familyRegion: null,
                currentProvince: null,
                currentCity: null,
                ResumeJobList: [
                    {
                        companyName: "",
                        jobDetail: "",
                        jobName: "",
                        startTime: "",
                        endTime: ""
                    },
                ],
                ResumeProjectList:[
                    {
                        projectDetail: "",
                        projectName: "",
                        responsibility: "",
                        startTime: "",
                        endTime: ""
                    },
                ],
                ResumeEduList: [
                    {
                        majorName: "",
                        startTime: "",
                        endTime: "",
                        schoolName: "",
                        degreeLevel: null,
                    },
                    
                ],
            },
            rules: {
                name: [
                    { required: true, message: '请填写姓名', trigger: 'blur' }
                ],
                birthDay: [
                    { required: true, message: '请填写出生年月日', trigger: 'change' }
                ],
                jobStatus: [
                    { required: true, message: '请选择求职状态', trigger: 'change' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                phone: [{ required: true, validator: validatePhone2, trigger: "blur" }],
                email: [
                    {  required: true,validator: validateEmail, trigger: 'blur' }
                ],
                currentAddList:[
                    { required: true, message: "请您填写省市区"}
                ],
                workYears: [
                    {  required: true,validator: validatNumber, trigger: 'blur' }
                ],
                workAddList:[
                    { required: true, message: "请您填写省市区"}
                ],
                expectSalary: [
                    { required: true, message: '请选择起始时间', trigger: 'change' }
                ],
                expectJobType: [
                    { required: true, message: '请选择起始时间', trigger: 'change' }
                ],
                jobFunction: [
                    { required: true, message: '请选择起始时间', trigger: 'change' }
                ],
                arrivalTime: [
                    { required: true, message: '请选择起始时间', trigger: 'change' }
                ],
                startTime: [
                    { required: true, message: '请选择起始时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                companyName: [
                    { required: true, message: '请填写公司名称', trigger: 'blur' }
                ],
                jobDetail: [
                    { required: true, message: '请填写职位详情', trigger: 'blur' }
                ],
                jobName: [
                    { required: true, message: '请填写职位名称', trigger: 'blur' }
                ],
                projectDetail: [
                    { required: true, message: '请填写项目详情', trigger: 'blur' }
                ],
                projectName: [
                    { required: true, message: '请填写项目名称', trigger: 'blur' }
                ],
                responsibility: [
                    { required: true, message: '请填写项目职责描述', trigger: 'blur' }
                ],
                majorName: [
                    { required: true, message: '请填写专业名称', trigger: 'blur' }
                ],
                schoolName: [
                    { required: true, message: '请填写学校名称', trigger: 'blur' }
                ],
                degreeLevel: [
                    { required: true, message: '请填写学历/学位', trigger: 'change' }
                ],
                
            },
            flag:false,
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
        }
    },
    components: {
        'v-operation': operationBar,
        "az-uplood":upload,
    },
    activated(){
        this.getlist();
    },
    created() {
        this.getlist();
    },
    //页面在顶部；
    mounted() {
    },
    filters: {
    },
    methods: {
        //图片上传逻辑;
        getimgUrl(img){
            this.tableData.portrait=img.imgUrl;
        },
        addExperience(mark){
            let obj
            switch (mark) {
                case 1:
                    obj =  {
                        startTime: "",
                        endTime: "",
                        companyName: "",
                        jobDetail: "",
                        jobName: "",
                    };
                    this.tableData.ResumeJobList.push(obj)
                    break;
                case 2:
                    obj =  {
                        startTime:null,
                        endtTime:null,
                        projectName:'',
                        responsibility:'',
                        projectDetail:'',
                    };
                    this.tableData.ResumeProjectList.push(obj)
                    break;
                case 3:
                    obj =  {
                        startTime: '',
                        endTime: '',
                        majorName: '',
                        schoolName: '',
                        degreeLevel: null,
                    };
                    this.tableData.ResumeEduList.push(obj)
                    break;
                default:
                    break;
            }
        },
        deleteExperience(index,mark){
            switch (mark) {
                case 1:
                    this.tableData.ResumeJobList.splice(index,1)
                    break;
                case 2:
                    this.tableData.ResumeProjectList.splice(index,1)
                    break;
                case 3:
                    this.tableData.ResumeEduList.splice(index,1)
                    break;
                default:
                    break;
                }
        },
        getlist(){
            this.$http.post("/custom/ResumeBasic/get").then(res =>{
                if(res.data.code == 200){
                    let resData = res.data.data;
                    for (let key in resData) {
                        switch (key) {
                            case 'workAddList':
                                break;
                            case 'familyAddList':
                                break;
                            case 'currentAddList':
                                break;
                            default:
                                this.tableData[key] = resData[key]
                                break;
                        }
                    }               
                    this.tableData.workAddList[0] = res.data.data.expectProvince ; 
                    this.tableData.workAddList[1] = res.data.data.expectCity ; 
                    this.tableData.familyAddList[0] = res.data.data.familyProvince ; 
                    this.tableData.familyAddList[1] = res.data.data.familyCity ; 
                    this.tableData.familyAddList[2] = res.data.data.familyRegion ; 
                    this.tableData.currentAddList[0] = res.data.data.currentProvince ; 
                    this.tableData.currentAddList[1] = res.data.data.currentCity ;             
                }
                this.flag =true;
            }); 
        },
        //是否公开简历
        async isPublic(){
            this.tableData.isPublic = !this.tableData.isPublic;
            let parameter = {isPublic: this.tableData.isPublic,}
            let res = await this.$http.post("/custom/ResumeBasic/updatePubilce",parameter);
            this.$ResultTips(res);
        },
        //刷新简历
        async updateResume(){
            let res = await this.$http.post("/custom/ResumeBasic/updateResume");
            this.$ResultTips(res);
            if(res.data.code == 200){
                this.getlist()
            }
        },
        async saveResumeApi(parameter){
            let res = await this.$http.post("/custom/ResumeBasic/insert",parameter);
            this.$ResultTips(res);
        },
        submitResume(){
            let flag = this.vaildFrom();
            if(!flag){
                this.$warning('请检查填写的信息是否完整')
                return false;
            }
            let parameters = {};
            for (let key in this.tableData) {
                switch (key) {
                    case 'workAddList':
                        break;
                    case 'familyAddList':
                        break;
                    case 'currentAddList':
                        break;
                    case 'updateTime':
                        break;
                    default:
                        parameters[key] = this.tableData[key]
                        break;
                }
            }
            parameters.expectProvince = this.tableData.workAddList[0];
            parameters.expectCity = this.tableData.workAddList[1];
            parameters.familyProvince = this.tableData.familyAddList[0];
            parameters.familyCity = this.tableData.familyAddList[1];
            parameters.familyRegion = this.tableData.familyAddList[2];
            parameters.currentProvince = this.tableData.currentAddList[0];
            parameters.currentCity = this.tableData.currentAddList[1];
            this.saveResumeApi(parameters)
        },
        vaildFrom(){
            let [flag , i] =[true,null];
            for (let key in this.$refs) {
                if(key !='myTextEditor'){
                    if(key.includes('[object Object]')){
                        for (i = 0; i < this.$refs[key].length; i++) {
                            this.$refs[key][i].validate((valid) => {
                                if (!valid) {
                                    flag = valid;
                                } 
                            });
                        }
                    }else{
                        this.$refs[key].validate((valid) => {
                            if (!valid) {
                                flag = valid;
                            } 
                        });
                    }
                }
                if(!flag){
                    break;
                }
            }
            return flag
        },
        //邮箱自动补全的方法；
        querySearch(inputString,cb) {
            EmailAuto(inputString,cb)
        },
        //保存时间；
        selectTime(ele){
            this.currentTime =ele;
        }
    }
};
</script>
<style lang="less" scoped>
#my-resume {
  .header {
    span {
      display: inline-block;
      line-height: 26px;
    }
    .status {
      width: 57px;
      height: 26px;
      margin-left: 10px;
      text-align: center;
      background-color: #d6e8ff;
      color: #3f8def;
    }
    .style {
      border: solid 1px #3f8def;
      color: #3f8def;
      background-color: #fff;
      margin-right: 8px;
    }
  }
  .box {
    .basics-info,
    .intension,
    .work-experience,
    .project-experience,
    .edu-experience,
    .others {
      background-color: #f1f1f1;
    }
    .title {
      padding: 10px 0 10px 0;
      font-size: 14px;
      color: #777;
      background-color: #fff;
    }
    .content {
      width: 720px;
      padding: 17px 24px 4px;
      .inner {
        display: flex;
        justify-content: space-between;
        .innerRght,
        .innerleft {
          width: 302px;
          position: relative;
        }
        .innerleftUnit {
          position: absolute;
          top: 0px;
          right: 5px;
        }
      }
      .innerData {
        display: flex;
        justify-content: flex-start;
        .innerRght,
        .innerleft {
          width: 302px;
        }
        .innerRght{
            margin-left: 66px;
        }
        .innerUnit {
          margin: 0 65px;
        }
      }
    }
    .loop + .loop {
      border-top: 1px solid #fff;
    }
    .btnstyle {
        margin: 0 17px 17px 0;
        line-height: 28px;
        background-color: #fff;
        border: solid 1px #3f8def;
        color: #3f8def;
    }
    .deleteStyle{
        margin: 17px 24px 0 0;
        cursor: pointer;
    }
    .imgStyle{
        margin: 88px 69px 0 0;
    }
  }
}
</style>
<style lang="less">
    #my-resume {
        .select-area1 {
            .area-select-wrap .area-select {
            margin-left: 0px;
            }
        }
        .select-area {
            .area-select-wrap {
            width: 490px;
            }
        }
        .el-date-editor {
            .el-range__icon {
            line-height: 20px;
            }
            .el-range-separator {
            padding: 0px;
            line-height: 20px;
            }
        }
        .el-date-editor.el-input {
            width: 100%;
        }
    }
</style>
