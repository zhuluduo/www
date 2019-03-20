<template>
<div id="resume-detail">
    <div class="resume-detail-inner-wrapper" style="background: #f5f5f5;">
        <div class="template-container" style="padding: 0;margin: 0;box-sizing: border-box;font-size: 14px;color:#777777;width: 1000px;background: #ffffff;margin: 0 auto;">
            <div class="top" style="height: 45px;background-color: rgba(63,141,239,0.25);font-size: 14px;color: #777777;line-height: 45px;text-indent:11px;">更新时间：2018-11-25</div>
            <div class="content" style="padding: 20px;">
                <div class="content-item user-info" style="border-bottom: 1px solid #e2e2e2;padding: 22px 0;display: flex;justify-content: flex-start; align-items: center; padding-top: 0;">
                    <img :src="data.portrait" alt="" class="photo" style="display: block;width: 104px;height: 104px;background-color: #bcbcbc;"/>
                    <div class="base-info" style="margin-left: 40px;">
                        <div class="user-name" style="font-size: 18px;color: #3f8def;font-weight: 700;">{{data.name}}</div>
                        <div class="contact" style="margin-top: 20px;">
                            <span style="margin-right: 73px;">{{data.jobStatusText}}</span>
                            <span style="margin-right: 73px;">{{data.phone}}</span>
                            <span style="margin-right: 73px;">{{data.email}}</span>
                        </div>
                        <div class="other" style="margin-top: 22px;">
                            <span>{{data.genderText}}</span> |
                            <span>{{data.year||0}}岁（{{data.birthDay}}）</span> | 
                            <span>现居住 {{data.currentProvince}}{{data.currentCity}}</span> | 
                            <span>{{data.workYears}}年工作经验</span>
                        </div>
                    </div>
                    <div class="upload-btn" style="width: 112px;height: 38px;background-color: #3f8def;border-radius: 4px;color: #ffffff;
                        text-align: center;line-height: 38px;cursor: pointer;margin: 30px;" id="download-btn" @click="download()">下载简历</div>
                </div>
                <div class="content-item" style="border-bottom: 1px solid #e2e2e2;padding: 22px 0;">
                    <div class="row" style="display: flex;">
                        <div class="title" style="width: 420px;font-size: 16px;color: #3f8def;font-weight: 700;">最近工作</div>
                        <div class="title" style="width: 420px;font-size: 16px;color: #3f8def;font-weight: 700;">最高学历/学位</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="row-column" style="width: 420px;">职位：{{data.latelyJobName||'-'}}</div>
                        <div class="row-column" style="width: 420px;">专业：{{data.latelyMajorName||'-'}}</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="row-column" style="width: 420px;">公司：{{data.latelyCompanyName}}</div>
                        <div class="row-column" style="width: 420px;">学校：{{data.latelySchoolName}}</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <!-- <div class="row-column" style="width: 420px;">行业：</div> -->
                        <div class="row-column" style="width: 420px;">学历/学位：{{data.latelyDegreeLevelText}}</div>
                    </div>
                </div>
                <div class="content-item" style="border-bottom: 1px solid #e2e2e2;padding: 22px 0;">
                    <div class="row" style="display: flex;">
                        <div class="title" style="width: 420px;font-size: 16px;color: #3f8def;font-weight: 700;">个人信息</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="row-column" style="width: 420px;">微信号：{{data.wechatNo}}</div>
                        <div class="row-column" style="width: 420px;">婚姻状况：{{data.maritalStatusText}}</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="row-column" style="width: 420px;">身高：{{data.height}}cm</div>
                        <div class="row-column" style="width: 420px;">政治面貌：{{data.politicsStatusText}}</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="row-column" style="width: 420px;">家庭地址：{{data.familyProvince}}{{data.familyCity}}{{data.familyRegion}}{{data.familyAddress}}</div>
                    </div>
                </div>
                <div class="content-item" style="border-bottom: 1px solid #e2e2e2;padding: 22px 0;">
                    <div class="row" style="display: flex;">
                        <div class="title" style="width: 420px;font-size: 16px;color: #3f8def;font-weight: 700;">求职意向</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="row-column" style="width: 420px;">期望薪资：{{data.expectSalaryText}}/月</div>
                        <div class="row-column" style="width: 420px;">地点：{{data.expectProvince}}{{data.expectCity}}</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="row-column" style="width: 420px;">职能：{{data.jobFunctionText}}</div>
                        <div class="row-column" style="width: 420px;">工作类型：{{data.expectJobTypeText}}</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="row-column" style="width: 420px;">到岗时间：{{data.arrivalTimeText}}</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="label" style="line-height: 24px;">自我评价：</div>
                        <div class="editor multi-line" style="flex: 1;line-height: 24px; padding-right: 60px;" v-html="data.selfEvaluate">
                            
                        </div>
                    </div>
                </div>
                <div class="content-item" style="border-bottom: 1px solid #e2e2e2;padding: 22px 0;">
                    <div class="row" style="display: flex;">
                        <div class="title" style="width: 420px;font-size: 16px;color: #3f8def;font-weight: 700;">工作经验</div>
                    </div>
                    <div class="experience-item" :style="{marginTop:index==0?'15px':'25px'}" style="display:flex;margin-top: 15px;" v-for="(item, index) in data.ResumeJobList" :key="'job-item-' + index">
                        <div class="left">{{item.startTime}}-{{item.endTime}} </div>
                        <div class="right" style="margin-left: 45px;flex: 1;">
                            <div class="row" style="display: flex;">
                                <div class="row-item">{{item.companyName}}</div>
                                <div class="row-item" style="margin-left: 50px;">{{item.jobName}}</div>
                            </div>
                            <div class="row" style="display: flex;margin-top: 15px;">
                                <div class="label" style="line-height: 24px;">工作描述：</div>
                                <div class="row-editor" style="line-height: 24px;flex: 1;padding-right: 60px;">
                                   {{item.jobDetail}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-item" style="border-bottom: 1px solid #e2e2e2;padding: 22px 0;">
                    <div class="row" style="display: flex;">
                        <div class="title" style="width: 420px;font-size: 16px;color: #3f8def;font-weight: 700;">项目经验</div>
                    </div>
                    <div class="experience-item" :style="{marginTop:index==0?'15px':'25px'}" style="display:flex;margin-top: 15px;" v-for="(item, index) in data.ResumeProjectList" :key="'pro' + index">
                        <div class="left">{{item.startTime}}-{{item.endTime}} </div>
                        <div class="right" style="margin-left: 45px;flex: 1;">
                            <div class="row" style="display: flex;">
                                <div class="row-item">{{item.projectName}}</div>
                            </div>
                            <div class="row" style="display: flex;margin-top: 15px;">
                                <div class="label" style="line-height: 24px;">项目描述：</div>
                                <div class="row-editor" style="line-height: 24px;flex: 1;padding-right: 60px;">
                                    {{item.projectDetail}}
                                </div>
                            </div>
                            <div class="row" style="display: flex;margin-top: 15px;">
                                <div class="label" style="line-height: 24px;">职责描述：</div>
                                <div class="row-editor" style="line-height: 24px;flex: 1;padding-right: 60px;">
                                   {{item.responsibility}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-item" style="border-bottom: 1px solid #e2e2e2;padding: 22px 0;">
                    <div class="row" style="display: flex;">
                        <div class="title" style="width: 420px;font-size: 16px;color: #3f8def;font-weight: 700;">教育经历</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;" v-for="(item, index) in data.ResumeEduList" :key="'edu-'+index">
                        <div class="row-column-3" style="width: 250px;">{{item.startTime}}-{{item.endTime}}</div>
                        <div class="row-column-3" style="width: 250px;">{{item.schoolName}}</div>
                        <div class="row-column-3" style="width: 250px;">{{item.degreeLevelText}}|{{item.majorName}}</div>
                    </div>
                </div>
                <div class="content-item ohter-info" style="padding: 22px 0;border-bottom: none;padding-bottom: 60px;">
                    <div class="row" style="display: flex;">
                        <div class="title" style="width: 420px;font-size: 16px;color: #3f8def;font-weight: 700;">教育经历</div>
                    </div>
                    <div class="row" style="display: flex;margin-top: 15px;">
                        <div class="multi-line editor" style="flex: 1;line-height: 24px; padding-right: 60px;" v-html="data.selfEvaluate">
                            
                        </div>
                    </div>
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
            id: Number(this.$route.query.id),
            data:''
        }
    },
    created() {
        this.getData();
    },
    mounted() {
        
    },
    methods: {
        getData() {
            this.$http.post('/custom/ResumeBasic/getById', {id: this.id}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.data = res.data.data;
                }
            })
        },
        download() {
            var editorChildren = document.querySelector('.editor').children||[];
            if ( editorChildren.length > 0 ) {
                for( var i = 0; i < editorChildren.length; i++ ) {
                    editorChildren[i].style.margin = '0';
                }
            }
            
            var uploadBtn = document.querySelector('#download-btn');
            uploadBtn.style.display = 'none';

            var htmlEl = document.querySelector('#resume-detail').innerHTML;
            var linkEl = document.createElement('a');
            linkEl.download = this.data.name + '的简历.html';
            linkEl.style.display = 'none';

            var blobData = new Blob([htmlEl]);

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blobData, this.data.name + '的简历.html');
            } else {

                linkEl.href = URL.createObjectURL(blobData);
                document.body.appendChild(linkEl);
                linkEl.click();
            }

        uploadBtn.style.display = 'block';
        }
    },
};
</script>
<style scoped>
</style>
