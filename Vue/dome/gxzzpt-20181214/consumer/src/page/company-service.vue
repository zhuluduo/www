<template>
    <div class="manufacturerserve">
        <div class="right-title">制造服务</div>
        <div class="manufacturerList">
        <v-operation>
            <v-button slot="right" @click="addBtnClick">+添加服务</v-button>
        </v-operation>
            <div class="box-content">
                <el-table :data="tableData"   stripe style="width: 100%">
                    <el-table-column prop="index" label="序号"  align="center" width="60"></el-table-column>
                    <el-table-column prop="companyServiceName" label="服务名称"  align="center" width="120"></el-table-column>
                    <el-table-column label="标签" align="center" width="200">
                        <template slot-scope="scope">
                            <span v-for="(ele,index) in scope.row.tags" :key="index">
                                {{ele.name}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="步骤" align="center" width="180" >
                        <template slot-scope="scope">
                             -
                        </template>
                    </el-table-column>
                    <el-table-column  label="上架" align="center" width="240" >
                        <template slot-scope="scope">
                             <span v-if="scope.row.isOn" class="enable-btn tb-status-btn">已上架</span>
                             <span v-else class="disable-btn tb-status-btn">未上架</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="操作" align="center" >
                        <template slot-scope="scope">
                            <div class="btnServeBox">
                                <span  @click="editBtn(scope.row)" class="btnServe">
                                    <img src="../../static/img/addressAlter.png" alt="">
                                </span>
                                <span  @click="deleteBtn(scope.row.id)" class="btnServe">
                                    <img src="../../static/img/addressDelete.png" alt="">
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>  
        </div>
        <div class="pagination">
            <el-pagination
            @current-change="changePage" 
            background 
            layout="total,prev, pager, next" 
            :page-size="pagination.pageSize"
            :current-page="pagination.currentPageIndex"
            :page-count="pagination.pageCount"
            :total="pagination.recordCount">
            </el-pagination>
        </div>
        <el-dialog  title="添加服务" width="520px" :visible.sync="addForm.isShow">
            <div>
                <el-form label-position="left" ref="addForm" :rules="addForm.rules" :model="addForm.data" label-width="86px">
                    <el-form-item label="服务名称 :" class="required" prop="name">
                        <el-input  v-model="addForm.data.name" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item label="标签 :" prop="region">
                        <el-select v-model="addForm.data.region"  multiple  placeholder="请选择活动区域">
                            <el-option :label="ele.name" :value="ele.id" v-for="ele in Tagslist" :key="ele.id "></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否上架 :">
                        <el-radio v-model="addForm.radio" label="true">是</el-radio>
                        <el-radio v-model="addForm.radio" label="false">否</el-radio>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button type="primary">取消</el-button> -->
                <el-button type="primary" @click="submitBtn">提交</el-button>
            </span>
        </el-dialog>
        <el-dialog  title="编辑服务" width="520px" :visible.sync="editForm.isShow">
            <div>
                <el-form label-position="left" ref="editForm" :rules="editForm.rules" :model="editForm.data" label-width="86px" >
                    <el-form-item label="服务名称 :" class="required" prop="name">
                        <el-input v-model="editForm.data.name" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item label="标签 :" prop="region">
                        <el-select v-model="editForm.data.region"  multiple  placeholder="请选择活动区域">
                            <el-option :label="ele.name" :value="ele.id" v-for="ele in Tagslist" :key="ele.id "></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="是否上架 :">
                        <el-radio v-model="editForm.radio" label="true">是</el-radio>
                        <el-radio v-model="editForm.radio" label="false">否</el-radio>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditBtn">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
import operationBar from '../components/operationBar.vue';
import addBtn from '../components/addButton.vue';
import tabsVue from '../components/tabs.vue';
export default {
    components: {
        'v-button':addBtn,
        'v-operation': operationBar
    },
    data() {
        return {
            ajaxData: {
                pageSize: 5,
                pageIndex: 1
            },
            tableData: [{
                
            }],
            pagination: {
                currentPageIndex: 1,
                pageCount: 1,
                pageSize: 5,
                recordCount: 0
            },
            Tagslist:[],
            addForm: {
                isShow: false,
                radio:'true',
                data: {
                    name: "",
                    region: [],
                },
                rules: {
                    name: [
                        { required: true, message: '请输入服务名称', trigger: 'blur' },
                    ],
                    region: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                }
            },
            editForm: {
                isShow: false,
                radio:'',
                id:'',
                data: {
                    name: "",
                    region: [],
                },
                rules: {
                    name: [
                        { required: true, message: '请输入服务名称', trigger: 'blur' },
                    ],
                    region: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                }
            },
        }
    },
    created(){
        this.getManufacturerServeList();
        this.getTagslist();
    },
    methods:{
        //获取供应商服务列表；
        getManufacturerServeList(){
            this.$http.post("/custom/CompanyService/getList",this.ajaxData).then(res => {
                if (res.data.code == 200) {
                    this.tableData =res.data.data.list.length > 0 ? res.data.data.list : [];
                    // console.log(this.tableData);
                    this.pagination=res.data.data.pagination;
                    var index =(this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
                    this.tableData.map((ele, i) => {
                        this.$set(ele, "index", index + i + 1);
                        for (let i = 0; i < ele.tags.length-1; i++) {
                           ele.tags[i].name +=" , " 
                        }
                    });
                }
            }).catch(res => {
                console.log("error");
            });
        },
        //获取获取服务标签
        getTagslist(){
            this.$http.post("/custom/CompanyService/getTags").then(res => {
                if (res.data.code == 200) {
                    this.Tagslist=res.data.data;
                }
            }).catch(res => {
                console.log("error");
            });
        },
        //添加按钮
        addBtnClick(){
            this.addForm.isShow=true;
            setTimeout(()=>{
                this.$refs["addForm"].resetFields();
                this.addForm.data.region=[];
            },10)
        },
        //添加服务
        AddServer(requestParams){
            this.$http.post("/custom/CompanyService/add", requestParams).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                    this.$refs["addForm"].resetFields(); //清除form表单数据；
                    this.addForm.isShow = false;
                    //刷新页面；
                    this.getManufacturerServeList();
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.message
                    });
                }
            });
        },
        //提交添加服务；
        submitBtn(){
            this.$refs["addForm"].validate(valid => {
                if (valid) {
                    let tagsArr=[];
                    this.addForm.data.region.map(ele =>{
                        tagsArr.push(ele)
                    })
                    let requestParams = {
                        "companyServiceName": this.addForm.data.name,
                        "isOn": this.addForm.radio == "true",
                        "tags": tagsArr
                    };
                    this.AddServer(requestParams);
                } else {
                   return false;
                }
            });
        },
        //编辑服务
        EditServer(requestParams){
            this.$http.post("/custom/CompanyService/modify", requestParams).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                    this.$refs["editForm"].resetFields(); //清除form表单数据；
                    this.editForm.isShow = false;
                    //刷新页面；
                    this.getManufacturerServeList();
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.message
                    });
                }
            });
        },
        //编辑按钮
        editBtn(item){
            this.editForm.isShow=true;
            // console.log(item);
            this.editForm.radio=item.isOn+"";
            this.editForm.data.name=item.companyServiceName;
            this.editForm.id=item.id;
            let TagsArr=[];
            item.tags.map(ele=>{
                TagsArr.push(ele.id)
            })
            this.editForm.data.region=TagsArr;
        },
        //提交编辑服务；
        submitEditBtn(){
            this.$refs["editForm"].validate(valid => {
                if (valid) {
                    let tagsArr=[];
                    this.editForm.data.region.map(ele =>{
                        tagsArr.push(ele)
                    })
                    let requestParams = {
                        "companyServiceName": this.editForm.data.name,
                        "isOn": this.editForm.radio == "true",
                        "id":  this.editForm.id,
                        "tags": tagsArr
                    };
                    // console.log(requestParams);
                    this.EditServer(requestParams);
                } else {
                   return false;
                }
            }); 
        },
        //删除服务
        deleteBtn(id){
            this.$http.post("/custom/CompanyService/delete", { id: id }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message,
                        duration: 1000 //设置窗口关闭默认时间；
                    });
                //刷新页面；
                this.getManufacturerServeList();
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.message
                    });
                }
            }); 
        },
        //分页
        changePage(pageindex){
            this.ajaxData.pageIndex = pageindex;
            this.getManufacturerServeList();
        }
    }
  }
</script>

<style lang="less" scoped>
@common-color: #3f8def;
    .manufacturerserve{
        .right-title {
            position: absolute;
            top: -28px;
            left: 0px;
            width: 100%;
            height: 20px;
            font-size: 14px;
            color: #333;
        }
        .box-content{
            .enable-btn{
                background: #e3f0ff;
                color: #3f8def;
                border: 1px solid #3f8def;
            }
            .disable-btn{
                background:#ffecec;
                color: #f84b4b;
                border: 1px solid #f84b4b;
            }
            .btnServeBox{
                display: flex;
                align-items: center;
                justify-content: center;
                .btnServe{
                    margin: 0 10px;
                    display: inline-block;
                    height: 20px;
                    cursor: pointer;
                }
            }
            .tb-status-btn{
                display: inline-block;
                width: 70px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                box-sizing: border-box;
            }
        }
    }
</style>

