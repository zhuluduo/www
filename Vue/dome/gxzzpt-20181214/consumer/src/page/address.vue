<template>
<div id="address">
  <div class="box">
    <div class="box-header">
        <div class="add-btn fl-right" @click="addAddress">+ 新增收货地址</div>
        <!-- <span>您已创建了{{addressNum}}个收货地址，最多可创建10个</span> -->
    </div>
    <div class="box-content">
      <ul class="address-list">
          <li v-for="(item,index) in addressList"  :class="{ liChecked:!item.isDefault}" :key="index">
              <div style="width:28%">
                  <span v-if="item.isDefault" @click="select(item.id)"  :class="{ checked:item.isDefault, noChecked:!item.isDefault }">默认</span>
                  <span v-if="!item.isDefault"  @click="select(item.id)" :class="{ checked:item.isDefault, noChecked:!item.isDefault }"> 设为默认</span>
                  收货人：<span>{{item.contactName}}</span>
              </div>
              <div style="width:38%">
                  地址：<span>{{item.province+item.city+item.region+item.address}}</span>
              </div>
              <div style="width:22%">
                  手机号码：{{item.contactPhone}}
              </div>
              <div style="width:12%" class="operator-area">
                  <span class="table-btn" @click="Edit(item)">
                      <img src="../../static/img/addressAlter.png" alt="">
                  </span>
                  <span  @click="deleteAddressBtn(item.id)">
                      <img src="../../static/img/addressDelete.png" alt="">
                  </span>
              </div>
          </li>
      </ul>
    </div>
  </div>
  <el-dialog  center title="添加收货地址" width="640px" :visible.sync="addForm.showAdd">
    <div>
      <el-collapse-transition>
        <!-- <div class="form-msg" v-show="errRes">{{errRes}}</div> -->
      </el-collapse-transition>
      <el-form label-position="left" ref="addForm" :rules="addForm.rules" :model="addForm.data" label-width="82px">
        <el-form-item label="收货人：" class="required" prop="name">
              <el-input v-model="addForm.data.name" placeholder="请您填写收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" class="required" prop="Phone">
              <el-input v-model="addForm.data.Phone" placeholder="请您填写收货人的手机号" ></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" class="required" prop="selectList">
              <template>
                  <div class="select-area">
                    <area-select type="text"  :data="$areaData" v-model="addForm.data.selectList" :level="2" @change="addressTrigger"></area-select>
                  </div>
              </template>
        </el-form-item>
        <el-form-item label="详细地址：" class="required" prop="descAddress">
            <el-input v-model="addForm.data.descAddress" placeholder="请您填写详细的地址" ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="addForm.showAdd = false">取 消</el-button> -->
      <el-button type="primary" @click="sbumitAdress">保存收货地址</el-button>
    </span>
  </el-dialog>
  <el-dialog  center title="编辑收货地址" width="640px" :visible.sync="editForm.showAdd">
    <div>
      <el-collapse-transition>
        <!-- <div class="form-msg" v-show="errRes">{{errRes}}</div> -->
      </el-collapse-transition>
      <el-form label-position="left" ref="editForm" :rules="editForm.rules" :model="editForm.data" label-width="82px">
        <el-form-item label="收货人：" class="required" prop="name">
              <el-input v-model="editForm.data.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" class="required" prop="Phone">
              <el-input v-model="editForm.data.Phone"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" class="required">
            <div class="select-area">
              <area-select type="text" v-model="selectList" :data="$areaData" :level="2"></area-select>
            </div>
        </el-form-item>
        <el-form-item label="详细地址：" class="required" prop="descAddress">
            <el-input v-model="editForm.data.descAddress"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sbumitEditAdress">保存收货地址</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
//电话，验证引入；
import { validatePhone} from '../lib/validate.js'
export default {
  data() {
    return {
      selectList: [], //三级联动数据；
      addressNum: 0, //创建的地址数量；
      //编辑地址表单；
      editForm: {
        showAdd: false,
        data: {
          name: "",
          Phone: "",
          descAddress: "",
          province: "",
          city: "",
          region: "",
          id: "",
          isDefault: "",
        },
        rules: {
          name: [
            { required: true, message: "请您填写收货人姓名", trigger: "blur" },
            {min: 1,max: 10,message: "长度在 1 到 10 个字符",trigger: "blur"}
          ],
          Phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
          descAddress: [
             { required: true, message: "请您填写详细的地址", trigger: "blur" }
          ]
        }
      },
      // 添加地址表单
      addForm: {
        showAdd: false,
        data: {
          name: "",
          Phone: "",
          descAddress: "",
          province: "",
          city: "",
          region: "",
          selectList:[],
        },
        rules: {
          name: [
            { required: true, message: "请您填写收货人姓名", trigger: "blur" },
            {
              min: 1,
              max: 10,
              message: "长度在 1 到 10 个字符",
              trigger: "blur"
            }
          ],
          Phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
          descAddress: [
            { required: true, message: "请您填写详细的地址", trigger: "blur" }
          ],
          selectList:[
            { required: true, message: "请您填写省市区"}
          ]
        }
      },
      //返回addressList的数据；
      addressList: []
    };
  },
  created() {
    this.getAddresssList();
  },
  methods: {
    doneUpload(res){
      // console.log(res);
    },
    //请求地址列表；
    getAddresssList() {
        this.$http.post("/custom/Address/getList").then(res => {
          if (res.data.code == 200) {
            this.addressList = res.data.data?res.data.data:[];
            this.addressNum = res.data.data?res.data.data.length:0;
          } else {
            this.$error(res.data.message);
          }
        });
      },
      //消息提示；
      message() {
        this.$message({
          type: "warning",
          message: "输入数量不能超过10个"
        });
    },
    //添加地址按钮；
    addAddress(){
      this.addForm.showAdd=true
      this.addForm.data.selectList=[];
    },
    //添加地址请求api
    addAddressApi(requestParams) {
      this.$http.post("/custom/Address/add", requestParams).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.$refs["addForm"].resetFields(); //清除form表单数据；
          this.addForm.showAdd = false;
          //刷新页面；
          this.getAddresssList();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    //修改地址请求api
    editAddress(requestParams) {
      this.$http.post("/custom/Address/update", requestParams).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.$refs["editForm"].resetFields(); //清除form表单数据；
          this.editForm.showAdd = false;
          //刷新页面；
          this.getAddresssList();
        } else {
          this.$error(res.data.message);
        }
      });
    },
    //删除地址功能
    deleteAddressBtn(id) {
      this.$http.post("/custom/Address/deleted", { id: id }).then(res => {
        if (res.data.code == 200) {
          this.$success(res.data.message);
          //刷新页面；
          this.getAddresssList();
        } else {
          this.$error(res.data.message);
        }
      });
    },
    //选择默认首选项；
    select(id) {
      this.$http.post("/custom/Address/setDefault", { id: id }).then(res => {
        if (res.data.code == 200) {
          this.$success( "默认地址修改成功");
          this.getAddresssList();
        } else {
          this.$error(res.data.message);
        }
      });
    },
    //添加提交按钮；
    sbumitAdress() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          if(this.addForm.data.selectList.length==0){
           this.$warning('请输入正确的地址')
          }else{
            let requestParams = {
              province: this.addForm.data.selectList[0],
              city: this.addForm.data.selectList[1],
              region: this.addForm.data.selectList[2],
              address: this.addForm.data.descAddress,
              contactName: this.addForm.data.name,
              contactPhone: this.addForm.data.Phone
            };
            this.addAddressApi(requestParams);
          }
        } else {
          return false;
        }
      });
    },
    addressTrigger(){
      if(this.addForm.data.selectList.length!=0){
        this.sbumitAdress();
      }
    },
    //编辑按钮；
    Edit(item) {
      this.editForm.data.id = item.id;
      this.selectList[0] = item.province;
      this.selectList[2] = item.region;
      this.selectList[1] = item.city;
      (this.editForm.data.descAddress = item.address),
      (this.editForm.data.name = item.contactName),
      (this.editForm.data.Phone = item.contactPhone),
      (this.editForm.data.isDefault = item.isDefault),
      //  console.log(item.isDefault);
      (this.editForm.showAdd = true);
    },
    //编辑提交按钮；
    sbumitEditAdress() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let requestParams = {
            province: this.selectList[0],
            city: this.selectList[1],
            region: this.selectList[2],
            address: this.editForm.data.descAddress,
            contactName: this.editForm.data.name,
            contactPhone: this.editForm.data.Phone,
            id: this.editForm.data.id,
            isDefault: this.editForm.data.isDefault
          };
          this.editAddress(requestParams);
        } else {
          return false;
        }
      });
      
    }
  }
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
#address{
  .box-header{
    height:43px;
  }
}
.box {
  margin: 0 auto;
}
.box-header {
  height: 76px;
  padding: 6px 0;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  > span {
      margin-right: 10px;
  }
}
.address-list {
  li {
    display: flex;
    height: 54px;
    align-items: center;
    background-color: #f5f5f5;
    border: 1px solid #dddddd;
    margin-bottom: 18px;
    .checked{
      display: inline-block;
      cursor: pointer;
      text-align: center;
      line-height: 22px;
      margin: 0 11px 0 24px;
      height: 22px;
      width: 46px;
      color: @common-color;
      border: 1px solid @common-color;
      background-color: #e3f0ff;
    }
    .noChecked{
      cursor: pointer;
      color: @common-color;
      display: inline-block;
      margin: 0 8px 0 20px;
      text-decoration:underline;
      
    }
  }
  .liChecked{
    border: none;
  }
  .operator-area {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    >span{
      margin-right: 16px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
