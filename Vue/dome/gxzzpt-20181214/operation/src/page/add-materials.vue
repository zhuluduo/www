<template>
  <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>标准化配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/main/materials-manage'}">材料管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加材料</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="step-box">
          <div class="step step1" v-show="currentStep==0?true:false">
              <p class="step-header">第一步、填写材料基本信息</p>
              <div>
                  <el-form label-position="top" label-width="80px" :model="form1" :rules="formRules1" ref="form1">
                      <el-form-item label="材料名称" class="required" prop="materialName">
                          <el-input v-model="form1.materialName"></el-input>
                      </el-form-item>
                      <el-form-item label="材料类别" class="required" prop="catalogIds">
                          <el-select v-model="form1.catalogIds" placeholder="请选择">
                              <el-option
                              v-for="(item,index) in sortList"
                              :key="index"
                              :label="item.catalogName"
                              :value="item.id">
                              </el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="材料类型" class="required">
                          <el-radio-group v-model="form1.type" size="small">
                              <el-radio-button :label="ele.id" v-for="(ele,i) in types" :key="i" >{{ele.name}}</el-radio-button>
                          </el-radio-group>
                      </el-form-item>
                      <el-form-item label="材料图" class="required" prop="picture">
                          <el-button size="small" type="primary" @click="handleClick">点击上传</el-button>
                          <div>
                              <input type="file" ref="uploadImg" @change="handleChange"/>
                              <img :src="form1.picture" >
                          </div>
                      </el-form-item>
                      <el-form-item label="介绍链接">
                          <el-input v-model="form1.detailUrl"></el-input>
                      </el-form-item>
                      <el-form-item label="简介">
                          <el-input v-model="form1.info" type="textarea"></el-input>
                      </el-form-item>
                  </el-form>
                  <div class="step-footer">
                      <el-button @click="next1('form1')">下一步</el-button>
                  </div>
              </div>
          </div>
          <div class="step step2" v-show="currentStep==1?true:false">
            <p class="step-header">第二步、配置材料默认参数</p>
            <div>
                <el-form label-position="top" label-width="80px" :model="form2" ref="form2">
                    <el-form-item :label="ele.paramName+'（'+ele.valueUnit+'）'" class="required" v-for="(ele,i) in form2.internalParams" :key="i" :prop="'internalParams.' + i + '.value'" :rules="check">
                        <el-input v-model="ele.value"></el-input>
                    </el-form-item>
                     <!-- <el-form-item label="材料单价（元/克）" class="required">
                        <el-input v-model="form1.name"></el-input>
                    </el-form-item>
                     <el-form-item label="加工单价（元/cm³）" class="required">
                        <el-input v-model="form1.name"></el-input>
                    </el-form-item>
                     <el-form-item label="材料壁厚（cm）" class="required">
                        <el-input v-model="form1.name"></el-input>
                    </el-form-item> -->
                </el-form>
            </div>
            <div class="step-footer">
                <el-button @click="currentStep=0">上一步</el-button>
                <el-button @click="next2('form2')">下一步</el-button>
            </div>
          </div>
          <div class="step step3" v-show="currentStep==2?true:false">
            <p class="step-header">第三步、配置材料自定义参数</p>
            <div class="step-table">
                <el-table :data="tableData" style="width: 100%" @header-click="addPara">
                    <el-table-column prop="index" label="序号" width="80px">
                    </el-table-column>
                    <el-table-column prop="paramName" label="参数名">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.paramName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="值类型">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.valueInputable" placeholder="请选择" @change="changeType(scope.row)">
                                <el-option
                                v-for="(item,index) in valueType"
                                :key="index"
                                :label="item.name"
                                :value="item.flag">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" label="值">
                        <template slot-scope="scope">
                            <span class="table-operator" v-show="!scope.row.valueInputable" @click="showForm(scope.row)">设置</span>
                            <span>{{scope.row.valueList.join(',')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fileType" label="上传文件类型">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.attachmentExt" placeholder="请选择" multiple   @change="changeSelect(scope.row)">
                                <el-option
                                v-for="(item,index) in fileType"
                                :key="index"
                                :label="item"
                                :value="item"
                               >
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="+" type="add" :label-class-name="cln">
                        <template slot-scope="scope">
                            <span class="table-operator" @click="removeItem(scope.row,tableData)">删除</span>
                        </template>
                    </el-table-column>
               </el-table>
            </div>
            <div class="step-footer">
                <el-button @click="currentStep=1">上一步</el-button>
                <el-button type="primary" @click="submitForm()">完成</el-button>
            </div>
          </div>
      </div>
      <el-dialog title="值" width="500px" :visible.sync="showEditForm" labelPosition="left">
       <el-form :model="valueForm" ref="valueForm" label-width="80px" class="">
        <el-form-item
            v-for="(ele, index) in valueForm.list"
            :label="'第' + (index+1)+'项：'"
            :key="index"
            :prop="ele.value">
            <template slot-scope="scope">
            <el-input v-model="ele.value"></el-input>
            <div class="add-minus">
                <el-button @click="addValue">新增</el-button>
                <el-button @click="removeItem(ele,valueForm.list)" v-show="index!=0">删除</el-button>
            </div>
            </template>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showEditForm = false">取 消</el-button>
            <el-button type="primary" @click="setValue">确 定</el-button>
        </div>
        </el-dialog>
  </div>
</template>
<script>
import { mapGetters ,mapState } from "vuex";

export default {
  component: {},
  data() {
    const checkValue = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入正确的值"));
      }
    };
    const checkName = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入正确的材料名称"));
      }
    };
    const checkSort = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请选择材料分类"));
      }
    };
    const checkPic = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请上传图片"));
      }
    };
    return {
      types: [],
      paraTypes: [],
      imgSrc: "",
      cln: "add-row-btn",
      sortList: [],
      valueForm: {
        list: [
          {
            value: ""
          }
        ]
      },
      currentRow: 0,
      showEditForm: false,
      fileType: ["jpg", "png", "rar"],
      valueType: [
        {
          name: "自由填写",
          flag: true
        },
        {
          name: "内置固定值",
          flag: false
        }
      ],
      currentStep: 0,
      fileList: [],
      tableData: [],
      form1: {
        materialName: "",
        info: "",
        detailUrl: "",
        picture: "",
        type: "原料",
        catalogIds: ""
      },
      form2: {
        internalParams: []
      },
      check: {
        validator: checkValue,
        trigger: "blur"
      },
      formRules1: {
        materialName: [
          {
            validator: checkName,
            trigger: "blur"
          }
        ],
        catalogIds: [
          {
            validator: checkSort,
            trigger: "change"
          }
        ],
        picture: [
          {
            validator: checkPic,
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    tableData(newVal, val) {
      var self = this;
      this.tableData.map(function(ele, i) {
        self.$set(ele, "index", i + 1);
      });
    },
    getDic(newVal, val) {
      this.types = this.getDic["102"].item;
      this.form1.type = this.types[0].id;
    }
  },
  created() {
    this.getAll();
    this.getInternalParams();
  },
  mounted() {
  setTimeout(()=>{
      this.types = this.getDic["102"].item;
      this.form1.type = this.types[0].id;
  },100)
    // this.types = this.getDic["102"].item;
    // this.form1.type = this.types[0].id;
  },
  computed: {
    // ...mapGetters(["getDic"]),
    ...mapState({
        getDic: state => state.dic,
    }),
  },
  methods: {
    changeSelect(val){
      if(val.attachmentExt.length==0){
        val.canAttachment = false;
      }else if(val.attachmentExt.length>0){
        val.canAttachment = true;
      }
    },
    submitForm() {
      var ajaxData = JSON.parse(JSON.stringify(this.form1));
      var arr = [];
      arr.push(Number(ajaxData.catalogIds));
      ajaxData.catalogIds = arr;
      ajaxData.type = Number(ajaxData.type);
      this.$set(ajaxData, "internalParams", this.form2.internalParams);
      this.$set(ajaxData, "customParams", this.tableData);

      this.$http
        .post("/operation/material/add", ajaxData)
        .then(res => {
          if (res.data.code == 200) {
            this.$router.push({ path: "/main/materials-manage" });
          } else {
            this.$message({
              type: "error",
              message: res.data.message || "网络异常"
            });
          }
        })
        .catch(res => {});
    },
    getInternalParams() {
      this.$http
        .post("/operation/material/getInternalParams")
        .then(res => {
          if (res.data.code == 200) {
            this.form2.internalParams = res.data.data;
            this.form2.internalParams.map(ele => {
              this.$set(ele, "value", "");
            });
          }
        })
        .catch(res => {});
    },
    //获取所有材料分类
    getAll() {
      this.$http
        .post("/operation/materialCatalog/getAll")
        .then(res => {
          if (res.data.code == 200) {
            this.sortList = res.data.data;
          }
        })
        .catch(res => {});
    },
    handleClick() {
      this.$refs["uploadImg"].click();
    },
    handleChange() {
      var self = this;
      var file = this.$refs["uploadImg"].files[0];
      // var reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = function() {
      //   self.form1.picture = this.result;
      // };
      this.upload(file);
    },
    upload(file){
      var data = new FormData();
      data.append('file',file);
      this.$upload.post('http://dw.tatfookcloud.com/upload',data).then(res=>{
        if(res.data.code == 200){
          this.form1.picture = res.data.data.img_url;
        }
      })
    },
    setValue() {
      var self = this;
      var arr = [];
      this.valueForm.list.map(function(ele, index) {
        arr.push(ele.value);
      });
      this.tableData[this.currentRow].valueList = arr;
      this.showEditForm = false;
    },
    showForm(item) {
      this.showEditForm = true;
      var index = this.tableData.indexOf(item);
      this.currentRow = index;
    },
    removeItem(item, list) {
      var index = list.indexOf(item);
      if (index !== -1) {
        list.splice(index, 1);
      }
    },
    addValue() {
      this.valueForm.list.push({
        value: ""
      });
    },
    changeType(row) {
      if (!row.valueInputable) {
      } else {
        row.valueList = [];
      }
    },
    addPara(column, event) {
      if (column.type != "add") return;
      var item = {
        paramName: "",
        paramNameEN: "",
        valueInputable: true,
        canAttachment: false,
        attachmentExt: [],
        valueList: []
      };
      this.tableData.push(item);
    },
    next1(formName) {
      //   this.currentStep += 1;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.currentStep += 1;
        } else {
          return false;
        }
      });
    },
    next2(formName) {
      //   this.currentStep += 1;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.currentStep += 1;
        } else {
          return false;
        }
      });
    },
    handlePreview() {},
    handleRemove() {}
  }
};
</script>

<style lang="less" scoped>
.step {
  width: 400px;
  margin: auto;
  .step-header {
    text-align: center;
    padding: 10px 0px;
  }
  .step-footer {
    text-align: center;
  }
}
.step-table {
  margin: 22px 0px;
}
.line-row {
  display: flex;
}
.step3 {
  width: 100%;
}
.add-minus {
  text-align: right;
  margin-top: 10px;
}
input[type="file"] {
  display: none;
}
</style>
