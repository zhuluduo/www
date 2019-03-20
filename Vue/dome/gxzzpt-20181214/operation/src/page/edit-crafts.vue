<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>服务</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/main/crafts-manage'}">工艺管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑工艺</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="step-page" v-show="pageOne.visible">
      <div class="step-box-1">
        <div class="step-title">第一步、填写工艺基本信息</div>
        <el-form ref="craftsBaseInfoForm" :model="pageOne.craftsBaseInfoForm" :rules="pageOne.rules" label-width="80px">
          <el-form-item label="工艺名称" prop="name">
            <el-input v-model="pageOne.craftsBaseInfoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="工艺类别" prop="type">
            <el-select v-model="pageOne.craftsBaseInfoForm.type" placeholder="请选择">
              <el-option
                v-for="item in pageOne.craftsTypes"
                :key="item.id"
                :label="item.techniqueCatalogName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工艺图" class="upload-label" prop="picture">
            <!-- <el-input disabled v-model="pageOne.craftsBaseInfoForm.pictureName">
              <el-button slot="append" icon="el-icon-upload" @click="openUploadDlg"></el-button>
            </el-input> -->
            <el-button size="small" type="primary" @click="openUploadDlg">上传图片</el-button>
            <div class="uploadImg">
              <img :src="pageOne.craftsBaseInfoForm.picture" alt="">
            </div>
            <input type="file" hidden ref="uploadInput" @change="handleFileChange">
          </el-form-item>
          <el-form-item label="介绍链接" prop="link">
            <el-input v-model="pageOne.craftsBaseInfoForm.link"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="introdution">
            <el-input type="textarea" :rows="3" v-model="pageOne.craftsBaseInfoForm.introdution"></el-input>
          </el-form-item>
        </el-form>
        <div class="step-btn">
          <!--<el-button type="primary">完成</el-button>-->
          <el-button type="primary" @click="pageOneNextHandler">下一步</el-button>
        </div>
      </div>
    </div>
    <div class="step-page" v-show="pageTwo.visible">
      <div class="step-box-2">
        <div class="step-title">第二步、配置工艺的物料</div>
        <div class="error-info" v-show="pageTwo.errorVisible">请配置工艺的物料</div>
        <div class="select">
          <div class="select-item">
            <p><span class="star">支持的原料</span><label @click="pageTwo.rawDlgVisible=true">选择</label></p>
            <div class="material-box" v-for="(item,i) in pageTwo.rawMaterialCheckList" :key="i">
              <div class="material-type"  v-show="item.materials.length">{{item.catalogName}}</div>
              <div class="material-item">
                <el-tag closable v-for="(child,index) in item.materials" @close="tagCloseHandler(child, item)" :key="index">{{child.materialName}}</el-tag>
              </div>
            </div>
          </div>
          <div class="select-item">
            <p><span>支持的耗材</span><label @click="pageTwo.conDlgVisible=true">选择</label></p>
            <div class="material-box" v-for="item in pageTwo.consumableMaterialCheckList">
              <div class="material-type" v-show="item.materials.length">{{item.catalogName}}</div>
              <div class="material-item">
                <el-tag closable v-for="child in item.materials" @close="CloseConTagHandler(child,item)">{{child.materialName}}</el-tag>
              </div>
            </div>
          </div>
        </div>
        <div class="step-btn">
          <el-button type="primary" @click="pageOne.visible=true;pageTwo.visible=false">上一步</el-button>
          <el-button type="primary" @click="pageTwoNextHandler">下一步</el-button>
        </div>
      </div>

      <el-dialog class="add-material-dlg"
        title="原料"
        :visible.sync="pageTwo.rawDlgVisible"
         :before-close="handleRawDlgClose"
        width="700px">
        <div>
          <el-tabs type="card" v-model="pageTwo.rawDlgTab">
            <el-tab-pane :label="rawMaterial.catalogName" :name="String(index)" v-for="(rawMaterial,index) in pageTwo.rawMaterialList" :key="index">
              <div class="materials-wrapper">
                <div class="materials">
                  <div class="material" :class="{'material-active':material.isCheck}" v-for="material in rawMaterial.materials" @click="selectMaterial(material)">
                    <img :src="material.picture" alt="">
                    <p>{{material.materialName}}</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeRawMaterialDlg">取 消</el-button>
          <el-button type="primary" @click="selectRawMaterialHandler">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog class="add-material-dlg"
                 title="耗材"
                 :visible.sync="pageTwo.conDlgVisible"
                 :before-close="handleConDlgClose"
                 width="700px">
        <div>
          <el-tabs type="card" v-model="pageTwo.conDlgTab">
            <el-tab-pane :label="cMaterial.catalogName" :name="String(index)" v-for="(cMaterial,index) in pageTwo.consumableMaterialList" :key="index">
              <div class="materials-wrapper">
                <div class="materials">
                  <div class="material" :class="{'material-active':material.isCheck}" v-for="material in cMaterial.materials" @click="selectMaterial(material)">
                    <img :src="material.picture" alt="">
                    <p>{{material.materialName}}</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeConMaterialDlg">取 消</el-button>
          <el-button type="primary" @click="selectConMaterialHandler">确 定</el-button>
        </div>
      </el-dialog>

    </div>

    <div class="step-page" v-show="pageThr.visible">
      <div class="step-box-3">
        <div class="step-title">第三步、配置工艺参数</div>
        <el-table
          :data="pageThr.tableData"
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="techniqueParamName"
            label="参数名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.techniqueParamName" placeholder="参数名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="参数值">
            <template slot-scope="scope">
              <span>{{scope.row.valueListtr}}</span>
              <span v-if="!scope.row.configured" class="tb-operation-link" @click="openCfgDlg(scope.row,scope)">设置</span>
              <span v-if="scope.row.configured" class="tb-operation-link" @click="openCfgDlg(scope.row,scope)">已设置</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope">
              <span class="icon-box"><i class="el-icon-plus operation-icon" @click="addParamsRow"></i></span>
              <span class="icon-box"><i class="el-icon-close operation-icon" @click="deleteParamsRow(scope)"></i></span>
            </template>
          </el-table-column>
        </el-table>
        <div class="step-btn">
          <el-button type="primary" @click="pageTwo.visible=true;pageThr.visible=false">上一步</el-button>
          <el-button type="primary" @click="addCrafts">完成</el-button>
        </div>
      </div>
      <el-dialog
        title="参数值"
        :visible="pageThr.dlgVisible"
        width="500px">
        <div>
          <el-form labelPosition="top" ref="form" label-width="80px">
            <el-form-item v-for="(item,index) in pageThr.dlgForm.inputList" :key="index">
              <template slot-scope="scope">
                <div class="def-form-item" >
                  <input type="radio" v-model="pageThr.dlgForm.defIndex" :checked="index==0" :value="index" class="def-params" name="def-params">
                  <el-input v-model="item.value"></el-input>
                  <div class="right-operation">
                    <i class="el-icon-plus cursor" @click="addFormInput"></i>
                    <i class="el-icon-close" @click="deleteFormInput(index)"></i>
                  </div>
                </div>
              </template>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeCfgDlg">取 消</el-button>
          <el-button type="primary" @click="configParams">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      id: "",
      detail: {},
      pageOne: {
        visible: true,
        craftsTypes: [],
        craftsBaseInfoForm: {
          name: "",
          type: "",
          introdution: "",
          link: "",
          picture: "",
          pictureName: ""
        },
        rules: {
          name: [
            { required: true, message: "请输入工艺名称", trigger: "blur" }
          ],
          type: [
            { required: true, message: "请选择工艺类型", trigger: "blur" }
          ],
          picture: [
            { required: true, message: "请上传工艺图", trigger: "change" }
          ]
        }
      },
      pageTwo: {
        visible: false,
        errorVisible: false,
        rawDlgVisible: false,
        conDlgVisible: false,
        conDlgTab: "0",
        rawDlgTab: "0",
        rawMaterialCheckList: [],
        rawMaterialList: [],
        consumableMaterialList: [],
        consumableMaterialCheckList: []
      },
      pageThr: {
        visible: false,
        dlgVisible: false,
        row: "",
        currRow: 0,
        dlgForm: {
          defIndex: 0,
          defValue: "",
          inputList: [{ value: "" }]
        },
        tableData: [
          {
            techniqueParamName: "",
            valueListtr: "",
            configured: false,
            defValue: "",
            valueList: []
          }
        ]
      }
    };
  },
  watch: {},
  created() {
    this.getCraftsTypeList();
  },
  mounted() {},
  methods: {
    //获取工艺详情
    getDetail(id) {
      var data = {
        id: Number(id)
      };
      this.id = Number(id);
      this.$http.post("/operation/technique/get", data).then(res => {
          if (res.data.code == 200) {
            this.getMaterialType1();
            this.detail = res.data.data;
            this.pageOne.craftsBaseInfoForm = {
              name: this.detail.techniqueName,
              type: Number(this.detail.catalog.catalogId),
              introdution: this.detail.techniqueInfo,
              link: this.detail.techniqueDetailUrl,
              picture: this.detail.techniquePicture
            };
            if ("param" in this.detail) {
              this.pageThr.tableData = this.detail.param;
              this.pageThr.tableData.map(ele => {
                this.$set(ele, "valueListtr", ele.valueList.join(","));
                this.$set(ele, "configured", true);
              });
            } else {
            }
          }
        })
        .catch(res => {});
    },
    /*-----------------------tab one---------------------*/
    openUploadDlg() {
      this.$refs.uploadInput.click();
    },
    handleFileChange() {
      var self = this;
      var file = this.$refs.uploadInput.files[0];
      // var reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = function() {
      //   self.pageOne.craftsBaseInfoForm.picture = this.result;
      // };
      this.upload(file);
    },
    upload(file) {
      var data = new FormData();
      data.append("file", file);
      this.$upload.post("http://dw.tatfookcloud.com/upload", data).then(res => {
        if ((res.data.code == 200)) {
          this.pageOne.craftsBaseInfoForm.pictureName = file.name;
          this.pageOne.craftsBaseInfoForm.picture = res.data.data.img_url;
        }
      });
    },
    getCraftsTypeList() {
      this.$http.post("/operation/techniqueCatalog/getList").then(res => {
        if (res.data.code == 200) {
          this.pageOne.craftsTypes = res.data.data;
          var id = this.$route.query.id;
          this.getDetail(id);
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },

    pageOneNextHandler() {
      this.$refs["craftsBaseInfoForm"].validate(valid => {
        if (valid) {
          this.pageTwo.visible = true;
          this.pageOne.visible = false;
        } else {
          return false;
        }
      });
    },
    autoSelect(inList, outerList, callback) {
      let flag
      outerList.map(ele1 => {
        ele1.materials.forEach(ele2 => {
          flag =inList?inList.indexOf(ele2.materialId) >= 0:false;
          if(flag){
            ele2.isCheck = true;
          }
        });
      });
      callback();
    },

    /*-------------tab two-----------------------------*/

    getMaterialType1() {
      this.$http.post("/operation/material/getAllByMaterialType", { type: 103010 }).then(res => {
        if (res.data.code == 200) {
          this.getMaterialType2();
          this.pageTwo.rawMaterialList = res.data.data;
          this.pageTwo.rawMaterialList.map(rawMaterial => {
            rawMaterial.materials.map(material => {
              this.$set(material, "isCheck", false);
              this.$set(material, "refCheck", false);
            });
          });
          this.autoSelect(
            this.detail.processMaterialList,
            this.pageTwo.rawMaterialList,
            this.selectRawMaterialHandler
          );
        }
      });
    },

    tagCloseHandler(child, parent) {
      this.pageTwo.rawMaterialList.map(item => {
        if (parent.id == item.id) {
          item.materials.map(el => {
            if (el.materialId == child.materialId) {
              el.isCheck = false;
              el.refCheck = false;
            }
          });
        }
      });
      this.pageTwo.rawMaterialCheckList.map(item => {
        if (parent.id == item.id) {
          item.materials.map((el, index) => {
            if (el.materialId == child.materialId) {
              item.materials.splice(index, 1);
              return;
            }
          });
        }
      });
    },
    closeRawMaterialDlg() {
      this.pageTwo.rawMaterialList.map(item => {
        item.materials.map(el => {
          el.isCheck = el.refCheck;
        });
      });
      this.pageTwo.rawDlgVisible = false;
    },
    handleRawDlgClose(done) {
      this.pageTwo.rawMaterialList.map(item => {
        item.materials.map(el => {
          el.isCheck = el.refCheck;
        });
      });
      done();
    },
    selectMaterial(material) {
      material.isCheck = !material.isCheck;
    },
    selectRawMaterialHandler() {
      this.pageTwo.rawMaterialCheckList = [];
      this.pageTwo.rawMaterialList.map(item => {
        var parentMaterial = {
          catalogName: item.catalogName,
          id: item.id,
          materials: []
        };
        item.materials.map(el => {
          if (el.isCheck) {
            parentMaterial.materials.push({
              materialName: el.materialName,
              isCheck: el.isCheck,
              materialId: el.materialId
            });
          }
          el.refCheck = el.isCheck;
        });
        this.pageTwo.rawMaterialCheckList.push(parentMaterial);
      });

      this.pageTwo.rawDlgVisible = false;
    },

    /*耗材*/

    getMaterialType2() {
      this.$http.post("/operation/material/getAllByMaterialType", { type: 103020 }).then(res => {
          if (res.data.code == 200 && Array.isArray(res.data.data)) {
            this.pageTwo.consumableMaterialList = res.data.data;
            this.pageTwo.consumableMaterialList.map(parentMaterial => {
              parentMaterial.materials.map(material => {
                this.$set(material, "isCheck", false);
                this.$set(material, "refCheck", false);
              });
            });
            this.autoSelect(
              this.detail.consumableMaterialList,
              this.pageTwo.consumableMaterialList,
              this.selectConMaterialHandler
            );
          }
        });
    },

    closeConMaterialDlg() {
      this.pageTwo.conDlgVisible = false;
      this.pageTwo.consumableMaterialList.map(item => {
        item.materials.map(el => {
          el.isCheck = el.refCheck;
        });
      });
    },

    handleConDlgClose(done) {
      this.pageTwo.consumableMaterialList.map(item => {
        item.materials.map(el => {
          el.isCheck = el.refCheck;
        });
      });
      done();
    },

    CloseConTagHandler(child, parent) {
      this.pageTwo.consumableMaterialList.map(item => {
        if (parent.id == item.id) {
          item.materials.map(el => {
            if (el.materialId == child.materialId) {
              el.isCheck = false;
              el.refCheck = false;
            }
          });
        }
      });
      this.pageTwo.consumableMaterialCheckList.map(item => {
        if (parent.id == item.id) {
          item.materials.map((el, index) => {
            if (el.materialId == child.materialId) {
              item.materials.splice(index, 1);
              return;
            }
          });
        }
      });
    },

    selectConMaterialHandler() {
      this.pageTwo.consumableMaterialCheckList = [];
      this.pageTwo.consumableMaterialList.map(item => {
        var parentMaterial = {
          catalogName: item.catalogName,
          id: item.id,
          materials: []
        };
        item.materials.map(el => {
          if (el.isCheck) {
            parentMaterial.materials.push({
              materialName: el.materialName,
              isCheck: el.isCheck,
              materialId: el.materialId
            });
          }
          el.refCheck = el.isCheck;
        });
        this.pageTwo.consumableMaterialCheckList.push(parentMaterial);
      });
      this.pageTwo.conDlgVisible = false;
    },

    pageTwoNextHandler() {
      // var conValid = false;
      var rawValid = false;

      // this.pageTwo.consumableMaterialCheckList.map(item => {
      //   item.materials.map(el => {
      //     if (el.isCheck) {
      //       conValid = true;
      //       return;
      //     }
      //   });
      // });

      this.pageTwo.rawMaterialCheckList.map(item => {
        item.materials.map(el => {
          if (el.isCheck) {
            rawValid = true;
            return;
          }
        });
      });

      if (rawValid) {
        this.pageTwo.visible = false;
        this.pageThr.visible = true;
        this.pageTwo.errorVisible = false;
      } else {
        this.pageTwo.errorVisible = true;
      }
    },

    /*--------------tab three ------------------------------*/

    addFormInput() {
      this.pageThr.dlgForm.inputList.push({ value: "" });
    },
    deleteFormInput(index) {
      if (this.pageThr.dlgForm.inputList.length > 1) {
        this.pageThr.dlgForm.inputList.splice(index, 1);
      }
    },
    configParams() {
      var valueList = [];
      this.pageThr.dlgForm.inputList.map(item => {
        if (item.value) {
          valueList.push(item.value);
        }
      });
      if (valueList.length > 0) {
        this.pageThr.tableData[this.pageThr.currRow].configured = true;
      } else {
        this.pageThr.tableData[this.pageThr.currRow].configured = false;
      }
      this.pageThr.tableData[
        this.pageThr.currRow
      ].valueListtr = valueList.toString();
      this.pageThr.tableData[this.pageThr.currRow].valueList = valueList;
      this.pageThr.tableData[
        this.pageThr.currRow
      ].defValue = this.pageThr.dlgForm.inputList[
        this.pageThr.dlgForm.defIndex
      ].value;
      this.pageThr.dlgForm.inputList = [{ value: "" }];
      this.pageThr.dlgVisible = false;
    },
    openCfgDlg(row, scope) {
      this.pageThr.currRow = scope.$index;
      if (this.pageThr.tableData[scope.$index].valueList.length > 0) {
        this.pageThr.dlgForm.inputList = [];
        this.pageThr.tableData[scope.$index].valueList.map(item => {
          this.pageThr.dlgForm.inputList.push({ value: item });
        });
      } else {
        this.pageThr.dlgForm.inputList = [];
        this.pageThr.dlgForm.inputList.push({
          techniqueParamName: "",
          valueListtr: "",
          configured: false,
          defValue: "",
          valueList: []
        });
      }
      this.pageThr.dlgVisible = true;
    },
    closeCfgDlg() {
      this.pageThr.dlgVisible = false;
    },
    addParamsRow() {
      this.pageThr.tableData.push({
        techniqueParamName: "",
        valueListtr: "",
        configured: false,
        defValue: "",
        valueList: []
      });
    },
    deleteParamsRow(scope) {
      this.pageThr.tableData.splice(scope.$index, 1);
    },
    addCrafts() {
      var craft = {
        id: this.id,
        techniqueName: "",
        processMaterialList: [],
        consumableMaterialList: [],
        techniquePicture: "",
        techniqueDetailUrl: "",
        techniqueInfo: "",
        techniqueCatalogId: "",
        params: []
      };
      craft.techniqueName = this.pageOne.craftsBaseInfoForm.name;
      craft.techniquePicture = this.pageOne.craftsBaseInfoForm.picture;
      craft.techniqueDetailUrl = this.pageOne.craftsBaseInfoForm.link;
      craft.techniqueCatalogId = this.pageOne.craftsBaseInfoForm.type;
      craft.techniqueInfo = this.pageOne.craftsBaseInfoForm.introdution;

      this.pageTwo.rawMaterialCheckList.map(item => {
        item.materials.map(el => {
          if (el.isCheck) {
            craft.processMaterialList.push(el.materialId);
          }
        });
      });
      
      this.pageTwo.consumableMaterialList.map(item => {
        item.materials.map(el => {
          if (el.isCheck) {
            craft.consumableMaterialList.push(el.materialId);
          }
        });
      });

      this.pageThr.tableData.map(item => {
        if (item.techniqueParamName && item.configured) {
          var craftParams = {
            defaultValue: item.defValue,
            techniqueParamName: item.techniqueParamName,
            techniqueParamPicture: "",
            techniqueParamInfo: "",
            valueList: item.valueList
          };
          craft.params.push(craftParams);
        }
      });
      // this.pageThr.tableData.map(item => {
      //   var craftParams = {
      //     defaultValue: item.defValue,
      //     techniqueParamName: item.techniqueParamName,
      //     techniqueParamPicture: "",
      //     techniqueParamInfo: "",
      //     valueList: item.valueList
      //   };
      //   craft.params.push(craftParams);
      // });
      this.$http.post("/operation/technique/update", craft).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.$router.push({ path: "/main/crafts-manage" });
        } else {
          this.$message({
            type: "error",
            message: "添加失败"
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.cursor {
  cursor: pointer !important;
}
.step-title {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  padding: 40px 0 60px 0;
}
.step-box-1 {
  width: 600px;
  margin: 0 auto;
}
.el-select {
  width: 100%;
}
.el-radio {
  line-height: 40px !important;
}
.step-btn {
  display: flex;
  justify-content: center;
  padding: 20px 50px;
}
.step-btn button {
  margin: 0 100px !important;
}
.step-box-2 {
  margin: 0 auto;
  .select {
    display: flex;
    justify-content: space-around;
    .select-item {
      flex: 1;
      text-align: center;
      padding: 20px 70px;
      .material-item {
        border: none;
        padding: 10px 0;
        text-align: left;
      }
      .material-type {
        font-size: 14px;
        font-weight: 700;
        text-align: left;
        margin-top: 30px;
      }
    }
    p {
      position: relative;
      line-height: 24px;
      font-size: 16px;
      font-weight: 600;
    }
    .star {
      position: relative;
    }
    .star::before {
      content: "*";
      position: absolute;
      left: -8px;
      color: red;
    }
    label {
      text-decoration: underline;
      color: #409eff;
      font-weight: normal;
      margin-left: 15px;
    }
  }
}
.materials-wrapper {
  width: 650px;
  .materials {
    width: 670px;
    height: 400px;
    overflow-y: auto;
    background: #fff;
    .material {
      display: inline-block;
      width: 112px;
      height: 140px;
      padding: 5px;
      border: 1px solid #eee;
      background-color: #eee;
      box-sizing: border-box;
      margin-right: 15px;
      margin-bottom: 20px;
      cursor: pointer;
      &:hover {
        border: 1px solid #409eff;
      }
      img {
        display: block;
        width: 100px;
        height: 100px;
        background-color: #fff;
      }
      p {
        line-height: 20px;
        text-align: center;
        margin-top: 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .material-active {
      background-color: #409eff;
      color: #fff;
    }
    .material:nth-child(5n) {
      margin-right: 0px !important;
    }
  }
}
.el-tag {
  margin-right: 20px !important;
  margin-bottom: 15px !important;
}
.icon-box {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 10px;
}
.operation-icon {
  cursor: pointer;
  color: #000 !important;
  font-weight: 700;
  font-size: 16px !important;
}
.tb-operation-link {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
  margin: 0 10px;
}
.step-box-3 .el-input {
  width: 50% !important;
}
.def-form-item {
  display: flex;
  .right-operation {
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
  }
}
.def-params {
  margin-top: 15px;
  margin-right: 10px;
}
.error-info {
  text-align: center;
  color: #f84b4b;
}
.uploadImg{
  width: 400px;
  height: 300px;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
