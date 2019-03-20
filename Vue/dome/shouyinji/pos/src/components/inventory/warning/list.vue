<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item>库存预警</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
      </el-col>
      <el-col :span="1">
      </el-col>
    </el-row>

    <el-row :gutter="2">
      <el-col :span="5">
        <el-button type="danger" @click="list=[]" size="small" icon="delete">清空商品</el-button>
        <el-button type="primary" size="small" @click="showProductDialog()" icon="plus">添加商品</el-button>
        <el-button type="danger" icon="el-icon-search" size="small" @click="openview()">店宝直供一键下单</el-button>
      </el-col>

      <el-col :span="19" class="tool-bar">
        <el-button type="primary" @click="$router.push('unmatchList')" size="small">外部采购</el-button>
        <el-button type="primary" @click="$router.push('detaillist')" size="small">已处理商品</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" element-loading-text="数据加载中"
                  @selection-change="handleSelectionChange">
          <el-table-column type="index" width="50"/>
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="baseName" label="商品名称"/>
          <el-table-column prop="barcode" label="商品条码" width="200"/>
          <el-table-column sortable="custom" prop="safetyStockNum" label="安全库存" width="100"/>
          <el-table-column sortable="custom" prop="inventory" label="当前库存" width="100"/>
          <el-table-column sortable="custom" prop="sellingPkg" label="库存单位" width="100"/>
          <!--<el-table-column sortable="custom" prop="spec" label="规格" width="100"/>
          <el-table-column sortable="custom" prop="logicStock" label="库存量" width="100"/>-->
          <el-table-column prop="purchaseNum" label="采购量" width="170">
            <template scope="scope">
              <el-input type="number" @input="handleInput(scope.row.purchaseNum,scope.row.logicStock)"
                        v-model="scope.row.purchaseNum"/>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="purchasePkg" label="采购单位" width="170"/>
          <el-table-column sortable="custom" prop="productPrice" label="采购价(￥/元)" width="170"/>
          <el-table-column prop="supplierName" label="货源" width="200"/>
          <el-table-column label="操作" align="center">
            <template scope="scope">
              <el-button :plain="true" type="warning" size="small" icon="edit" @click="list.splice(scope.$index, 1)">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog class="order-dialog" :visible.sync="dialogFormVisible" :close-on-click-modal="false" title="确定下单吗？">
      <el-form label-position="right" label-width="100px">
        <el-form-item class="warn-form-item" label="商品件数：">{{quantity1}}</el-form-item>
        <el-form-item class="warn-form-item" label="商品金额："><span style="color:red;">￥{{totalprices}}</span></el-form-item>
        <el-form-item class="warn-form-item" label="钱包余额："><span style="color:red;">￥{{store.walletBalance}}</span></el-form-item>
        <el-form-item class="warn-form-item" label="付款方式：">
          <el-select class="order-paytype" v-model="payType" placeholder="支付方式">
            <el-option label="钱包支付" value="5"></el-option>
            <el-option label="货到付款" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="submit" @click="order" size="small">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="选择商品" :modal="true" :close-on-click-modal="false" :visible.sync="productDialogVisible"
               @close="show()">
      <el-row :gutter="10">
        <el-col :span="5" style="border:1px solid rgb(244, 240, 237);padding:3px;">
          <el-row class="scrollbar selectedProducts_tag">
            <el-row align="center" style="background-color: rgb(106, 92, 72);color:white;">
              <el-col align="center">已选商品(共{{dianBaoSelectedProducts.length}}个)</el-col>
            </el-row>
            <el-table :data="dianBaoSelectedProducts" :show-header="false" style="width: 100%">
              <el-table-column label="" show-overflow-tooltip>
                <template scope="scope">
                  <el-tag type="primary">{{scope.row.name}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="" width="25">
                <template scope="scope">
                  <el-button :plain="true" type="danger" @click="handleClose($event,scope.$index, scope.row)"
                             size="small" icon="delete"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-col>
        <el-col :span="19">
          <el-row :gutter="2">
            <!-- <el-col >
               <el-select v-model="params.firstCategoryId" clearable placeholder="一级分类" size="small">
                 <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"/>
               </el-select>
             </el-col>
             <el-col :span="4">
               <el-select v-model="params.itemCatelogid" clearable placeholder="二级分类" size="small">
                 <el-option v-for="item in subCategories" :key="item.name" :label="item.name" :value="item.syncId"/>
               </el-select>
             </el-col>-->
            <el-col :span="8">
              <el-cascader :options="options2" clearable :show-all-levels="true" v-model="selectedOptions2"
                           size="small"></el-cascader>
            </el-col>

            <el-col :span="7">
              <el-input @keyup.enter.native="handleFilter" placeholder="商品条码" v-model.trim="params.barcode"
                        size="small"/>
            </el-col>
            <el-col :span="7">
              <el-input @keyup.enter.native="handleFilter" placeholder="商品名称" v-model.trim="params.keyword"
                        size="small"/>
            </el-col>
            <el-col :span="2" align="right">
              <el-button type="primary" @click="handleFilter" :loading="loading" icon="search" size="small">搜索
              </el-button>
            </el-col>
          </el-row>
          <el-row class="tableScroll">
            <el-table stripe border v-loading="dialogLoading" element-loading-text="加载中..." :data="products"
                      ref="multipleTable" row-key="productId"
                      @selection-change="dianbaoProductSelectionChange" selectionchangeclass="scrollbar"
                      @row-click="toggleSelect"
                      :highlight-current-row="true" height="400" >

              <el-table-column type="selection" :reserve-selection="true" width="30" :selectable="selectable"/>
              <el-table-column prop="name" label="商品名称" width="261"/>
              <el-table-column prop="brand" label="商品品牌" width="82"/>
              <el-table-column prop="pkg" label="商品单位" width="89"/>
              <el-table-column prop="spec" label="规格" width="105"/>
              <el-table-column prop="logicStock" label="库存量" width="67"/>
              <el-table-column prop="categoryName" label="二级分类" width="79"/>
              <!--<el-table-column prop="purchaseNum" label="采购量" >
                <template scope="scope">
                  <el-input v-if="scope.row.logicStock>0" type="number" @input="handledianbaohandleInputInput(scope.row.purchaseNum,scope.row.logicStock)" v-model="scope.row.purchaseNum"/>
                  <el-row v-if="scope.row.logicStock<=0"  >{{scope.row.purchaseNum}}</el-row>
                </template>
              </el-table-column>-->
            </el-table>
            <el-row class="pages">
              <el-col :span="3">
                <el-button @click="prevPage" size="small" style=" text-align: center;" :disabled="prevPageDisabled"
                           icon="arrow-left">上一页
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-tag type="danger" size="small" style=" height: 28px; text-align: center;">第{{page.currentPage}}页
                  每页{{page.size}}条
                </el-tag>
              </el-col>
              <el-col :span="3">
                <el-button @click="nextPage" size="small" style=" text-align: center;" :disabled="nextPageDisabled"
                           icon="arrow-right">下一页
                </el-button>
              </el-col>
              <el-col :span="2">
                <el-input v-model="jumps" size="small" style="height: 28px;" type="number" @blur="integralization"/>
              </el-col>
              <el-col :span="2">
                <el-button size="small" style=" text-align: center;" @click="jump">前往</el-button>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="right">
          <el-button @click="closeProduct" size="small" icon="close">取 消</el-button>
          <el-button type="primary" @click="dialogConfirm" size="small" icon="check" :loading="booldainbao">确 定
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog :visible.sync="rechargeDialogVisible" class="weixin" :close-on-click-modal="false"
               title="店宝钱包余额不足，请扫码充值！" width="3%">
      <!--  <el-row>
          <el-col >
            <div class="money">
              <el-button @click="rechargeAmount=100;openRecharge" size="small">100</el-button>
              <el-button @click="rechargeAmount=200;openRecharge" size="small">200</el-button>
              <el-button @click="rechargeAmount=300;openRecharge" size="small">300</el-button>
              <el-button @click="rechargeAmount=400;openRecharge" size="small">400</el-button>
              <el-button @click="rechargeAmount=500;openRecharge" size="small">500</el-button>
            </div>
              <div class="money">
                <el-input size="small" v-model="rechargeAmount" ></el-input>
              </div>
            <el-button @click="openRecharge" size="small">确定</el-button>
          </el-col>
        </el-row>-->

      <el-row :gutter="20" style="display: inline-block">
        <el-col class="dia-warning" style="width:auto" :span="24">
          <img :src="wxqrcodeImg"/>
          <el-row class="wxpayImg">
            微信---充值金额：￥{{rechargeAmount}}
          </el-row>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rechargeDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="submit" @click="order" size="small">下 单</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="payPassword" size="tiny" :close-on-click-modal="false" :before-close="handle" title="请输入支付密码">
      <el-row :gutter="5">
        <el-input type="password" @keyup.enter.native="submitPassword"  maxlength="6" v-model="password" placeholder="请输入支付密码"/>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=true" size="small">取消支付</el-button>
        <el-button type="primary" size="small" :loading="submit" @keyup.enter.native="submitPassword" @click="submitPassword">确定支付</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      size="tiny"
      :close-on-click-modal="false"
      :show-close = "false"
      :before-close="handleClose">
      <el-row>
        <span>你确定要取消订单号:{{orderId}}支付吗？</span>
      </el-row>
      <el-row>
        <span>提示：取消支付后可在24小时之内在店宝付款</span>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    <el-button type="primary"  @click="dialogVisible = false;payPassword=false" size="small">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>
<script>
  import {bus} from '../../../bus.js';
  import QRCode from 'qrcode';

  export default {
    data() {
      return {
        // 钱包
        rechargeAmount: 0,
        payType: '5',
        paymentTypes:[{
          value: '5',
          label: '钱包支付'
            }, {
            value: '2',
            label: '货到付款'
          }],
        rechargeDialogVisible: false,
        alipayqrcodeImg: '',
        wxqrcodeImg: '',
        password: null,
        payPassword: false,
        orderId: null,
        dialogVisible: false,
        submit:false,
        jumps: 1,
        booldainbao: false,
        url: bus.host,
        store: {walletBalance:null},
        dialogFormVisible: false,
        dateRange: null,
        totalprices: null, //价格和
        quantity1: null,  // 采购数量和
        list: [], // 列表数据
        orderProduct: [],
        dianBaoSelectedProducts: [],
        params: { // 列表查询参数
          barcode: '', // 当前列表取所有已上架商品
          keyword: '', // 模糊搜索关键字
          firstCategoryId: '', // 一级分类 id
          itemCatelogid: '', // 二级分类ID
        },
        page: { // 分页信息
          currentPage: 1, // 当前页
          size: 10, // 每页大小
          total: 1, // 总页数
        },
        storageID: '',
        products: [],
        productDialogVisible: false,
        categories: [], // 商品分类
        parentChildCategoryMap: [], // 父分类与子分类列表的映射
        loading: false, // 是否显示加载遮罩层
        dialogLoading: false, // 是否显示加载遮罩层
        prevPageDisabled: false,
        nextPageDisabled: false,

        //级联
        options2: [],
        selectedOptions2: [],
        options: null
      }

    },
    computed: {


      /*选中一级分类，加载二级分类*/
      subCategories() {
        return this.$data.parentChildCategoryMap[this.$data.params.firstCategoryId];
      },
      editSecondCategories() {
        return this.$data.parentChildCategoryMap[this.$data.ruleForm.firstCategoryId];
      },
    },
    methods: {

      // 自定义金额
      /*openRecharge(){
        let url = this.url + '/pos/api/warn/dianbao/walletrecharge?params='+this.rechargeAmount;
        this.$http.post(url).then((res)=>{
          let date = res.data.msg;
          if (res.data.success == false) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
            return false;
          }
          this.wxqrcode(date)
        }).catch((res) => {
        })
      },*/

      wxqrcode(url) {
        QRCode.toDataURL(url).then(url => {
          this.wxqrcodeImg = url;
        }).catch(err => {
          console.error(err)
        })
      },
      aliqrcode(url) {
        QRCode.toDataURL(url)
          .then(url => {
            this.alipayqrcodeImg = url;
          })
          .catch(err => {
            console.error(err)
          })
      },


      closeProduct() {
        this.productDialogVisible = false;
        this.jumps = 1;
        this.params.itemCatelogid = '';
        this.page.currentPage = 1;
        this.selectedOptions2 = [];
        this.params.keyword = '';
        this.params.barcode = '';
      },
      integralization() {
        this.jumps = Math.trunc(this.jumps);
      },
      jump() {
        if (this.jumps < 1) {
          return;
        }
        this.page.currentPage = this.jumps;
        this.loadDianbaoProductList();
      },

      prevPage() {
        let prevPageNum = this.page.currentPage - 1;
        if (prevPageNum < 1) {
          this.$message.error('已经没有上一页了！');
          return;
        }
        this.page.currentPage = prevPageNum;
        if (prevPageNum === 0) {
          this.prevPageDisabled = true;
        }
        this.loadDianbaoProductList({}); // 加载店宝商品列表
      },
      nextPage() {
        let nextPageNum = this.page.currentPage + 1;
        this.prevPageDisabled = false;
        this.page.currentPage = nextPageNum;
        this.loadDianbaoProductList(); // 加载店宝商品列表
      },
      toggleSelect(row, event, column) {
        if (row.logicStock < 1) {
          return ;
        }
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      selectable(row, index) {
        if (row.logicStock < 1) {
          return false;
        }
        return true;
      },
      dianbaoProductSelectionChange(selection) {
        this.storageID = selection;
        let idValueMap = [];
        selection.forEach(function (e) {
          idValueMap[e.productId] = e;
        });
        let valArr = new Array();
        for (let k in idValueMap) {
          valArr.push(idValueMap[k]);
        }
        this.dianBaoSelectedProducts = valArr;
      },

      handleClose(e, index, row) {
        this.dianBaoSelectedProducts.splice(index, 1)
        if (this.storageID.length != this.dianBaoSelectedProducts.length) {
          this.$refs.multipleTable.toggleRowSelection(this.storageID[index], false);
        }
      },
      handle(){
        this.dialogVisible=true
      },
      handleFilter() {
        this.page.currentPage = 1;
        this.prevPageDisabled = true;
        this.params.itemCatelogid = this.options;
        this.loadDianbaoProductList(); // 加载店宝商品列表
      },

      //移除
      removeProduct(data, index) {
        this.list.remove(index);
      },

      //添加商品
      showProductDialog() {
        this.loadCategory(0); // 加载商品分类
        this.loadDianbaoProductList(); // 加载店宝商品列表
        this.selectedOptions2 = [];
        this.productDialogVisible = true;
      },
      // 加载店宝商品数据
      loadDianbaoProductList() {
        this.dialogLoading = true;
        let param = {
          pageIndex: this.page.currentPage,
          pageSize: this.page.size
        };
        if (this.selectedOptions2.length == 2) {
          param.itemCatelogid = this.selectedOptions2[1];
        }
        if (this.params.barcode != '') {
          param.barcode = this.params.barcode;
        }
        if (this.params.keyword != '') {
          param.keyword = this.params.keyword;
        }
        this.$axios.post(bus.host + '/pos/api/warn/dianbao/product', param).then(res => {
          if (!res.data.success) {
            this.$message.error(res.data.msg);
            this.dialogLoading = false;
            return;
          }

          let resProducts = res.data.msg;

          this.products = [];
          resProducts.forEach(e => {
            //console.log(e.name);
            let product = {
              productId: e.id,
              name: e.name,
              brand: e.brand,
              pkg: e.pkg,
              categoryName: e.cateNm,
              areaprice: e.areaprice,
              logicStock: e.logicStock,
              spec: e.spec,
              purchaseNum: 0
            };
            this.products.push(product);
          });
          if (this.products.length == 0) {
            this.nextPageDisabled = true;
          }
          if (this.products.length > 0) {
            this.nextPageDisabled = false;
          }
          this.dialogLoading = false;
        });
      },
      /*dialog页面关闭清除其他属性*/
      show() {
        this.$data.params.firstCategoryId = '';
        this.$data.params.itemCatelogid = '';
        this.params.searchWord = '';
        this.list == '';
        this.productDialogVisible = false;
        this.jumps = 1;
        this.params.itemCatelogid = '';
        this.page.currentPage = 1;
        this.selectedOptions2 = [];
        this.params.keyword = '';
        this.params.barcode = '';
        this.$refs.multipleTable.clearSelection();
      },

      // 在选择商品弹窗中点击确认
      dialogConfirm() {
        if (this.booldainbao) {
          return false;
        }
        this.booldainbao = true;
        if (this.dianBaoSelectedProducts == undefined) {
          this.$message.error('请选择商品');
          this.booldainbao = false;
          return false;
        } else if (this.dianBaoSelectedProducts.length == 0) {
          this.$message.error('请选择商品');
          this.booldainbao = false;
          return false;
        } else {
          let bool = true;
          let bools = true;
          let broductname = '';
          this.dianBaoSelectedProducts.forEach(e => {
            if (e.purchaseNum < 0) {
              broductname += e.name + ' ';
              bool = false;
            }
            if (e.purchaseNum > e.logicStock) {
              broductname += e.name + ' ';
              bools = false;
            }
          });
          if (!bool) {
            this.$message.error(broductname + "的采购量少于0");
            this.booldainbao = false;
            return false;
          }
          if (!bools) {
            this.$message.error(broductname + "的采购量大于库存量");
            this.booldainbao = false;
            return false;
          }
          let idToProductMap = new Map();
          this.list.forEach(e => idToProductMap.set(e.productId, e));
          this.dianBaoSelectedProducts.forEach(e => {
            if (!idToProductMap.get(e.productId)) {
              let ce = {
                productId: e.productId,
                baseName: e.name,
                brand: e.brand,
                categoryName: e.cateNm,
                spec: e.spec,
                barcode: '',
                safetyStockNum: '',
                inventory: '',
                sellingPkg: '',
                purchaseNum: e.purchaseNum,
                purchasePkg: e.pkg,
                supplierName: '',
                productPrice: e.areaprice,
                purchasePrice: e.areaprice,
                sellingPrice: e.areaprice,
                logicStock: e.logicStock,
                barcode: '',
                inventory: '',
                productName: e.name,
              };
              ce.customized = 1; // 标识为自选商品
              this.list.push(ce);
            }
            this.booldainbao = false;
          });
          this.productDialogVisible = false;

          this.jumps = 1;
          this.params.itemCatelogid = '';
          this.page.currentPage = 1;
          this.selectedOptions2 = [];
          this.params.keyword = '';
          this.params.barcode = '';
        }
      },
      /*根据父ID获取子分类列表*/
      loadCategory(parentId) {
        let url = bus.host + '/pos/api/category/list/' + parentId;
        this.$axios.get(url, {}).then((res) => {
          if (!res.data.success) throw res;
          this.categories = res.data.msg;
          this.categories.forEach(e => {

            let children = [];
            e.subCategories.forEach(es2015 => {
              let childrensw = {
                value: es2015.syncId,
                label: es2015.name,
              }
              children.push(childrensw);
            })
            let option = {
              label: e.name,
              value: e.id,
              children: children
            }
            this.options2.push(option);
          })
          // 父分类与子分类映射
          let sub = this.$data.parentChildCategoryMap;
          this.categories.forEach(e => sub[e.id] = e.subCategories);
        }).catch(err => {
          this.$notify.error({
            title: '错误！',
            message: err.data.msg
          });
        });
      },

      handleInput(e, num) {
        if (!/^\d+$/.test(e)) {
          this.$message({message: '商品采购数量不合法！', type: 'warning'});
        }
        if (e > num) {
          this.$message({message: '库存不足！', type: 'warning'});
        }
      },
      handledianbaohandleInputInput(e, row) {
        if (!/^\d+$/.test(e)) {
          this.$message({message: '商品采购数量不合法！', type: 'warning'});
        }
        if (e > row) {
          e = row;
          this.$message({message: '库存不足！', type: 'warning'});

        }
      },
      /*提交订单*/
      order() {
        if(this.submit){
          return false;
        }
        this.submit =true;
        // 提交订单清空订单号
        this.orderId = null;
        if (this.orderProduct.length < 1) {
          this.$message({
            message: "店宝error：请选择商品",
            type: 'error'
          });
          this.submit =false;
          return false;
        }
        this.orderProduct.forEach(e => {
          if (e.inventory == '' || e.inventory == null) {
            e.inventory = e.purchaseNum;
          }
          if (e.barcode == null || e.barcode == '') {
            e.barcode = '未知'
          }
          e.supportmetho = this.payType;
        });
        let url = bus.host + '/pos/api/warn/order';
        this.$axios.post(url, this.orderProduct).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$message({
              message: "店宝error：" + data.msg,
              type: 'warning'
            });
            this.orderProduct.forEach(e => {
              if (e.customized == 1) {
                e.inventory = null;
                e.barcode = ''
              }
            });
            this.submit =false;
            this.loading = false;
            return false;
          }
          if (data.msg.code == 0) {
            // this.wxqrcode( JSON.parse(data.msg.result).wechatUrl)
            this.wxqrcode(data.msg.result)
            //this.aliqrcode( JSON.parse(data.msg.result).aliPayUrl)
            this.rechargeDialogVisible = true;
            this.rechargeAmount = data.msg.money;
            this.orderProduct.forEach(e => {
              if (e.customized == 1) {
                e.inventory = null;
                e.barcode = ''
              }
            });
            this.submit =false;
            return false;
          }

          this.orderId = data.msg.result;
          if (this.payType == 5) {
            this.payPassword = true;
          }
          if (this.rechargeDialogVisible==true){
            this.rechargeDialogVisible = false;
          }
          this.dialogFormVisible = false
          if (this.payType!='5'){
          let all = new Set(this.list), remove = new Set(this.orderProduct);
          let unorderd = new Set([...all].filter(x => !remove.has(x)));
          this.list = Array.from(unorderd);
          //this.loadList();
            this.$message({
              message: "下单成功",
              type: 'success'
            });
          }
          this.submit =false;
          this.payType= '5'
        }).catch((err) => {
          this.loading = false;
          this.orderProduct.forEach(e => {
            if (e.customized == 1) {
              e.inventory = null;
              e.barcode = ''
            }
          });
          this.submit =false;
          return false;
        });
        this.loading = false;
      },
      /*打开提交框*/
      openview() {
        if (this.orderProduct == null || this.orderProduct.length < 1) {
          this.$message({
            message: '请选择采购商品',
            type: 'warning'
          });
          return false;
        }
        let quantity = 0;
        let totalprices = 0;
        let e = [];
        for (let i = 0; i < this.orderProduct.length; i++) {
          e = this.orderProduct[i];

          if (e.purchaseNum == null) {
            this.$message({
              message: e.baseName + '有商品采购数量为空',
              type: 'warning'
            });
            return false;
          }
          if (e.purchaseNum < 1) {
            this.$message({
              message: e.baseName + '商品采购数量不能小于1',
              type: 'warning'
            });
            return false;
          }
          if (e.purchaseNum > e.logicStock) {
            this.$message.error(e.baseName + '商品采购数量不能大于库存数量');
            return false;
          }
          if (!/^\d+$/.test(e.purchaseNum)) {
            this.$message({message: e.baseName + '商品采购数量不合法！', type: 'warning'});
            return false;
          }
          quantity += parseInt(e.purchaseNum);
          totalprices += (e.purchaseNum * e.productPrice);
        }
        this.quantity1 = quantity;
        this.totalprices = totalprices.toFixed(2);
        this.dialogFormVisible = true;
        //this.storeDate();
        this.walletbalance();
      },
      /*选中列*/
      handleSelectionChange(selection) {
        this.orderProduct = selection;
      },
      /*加载列表数据*/
      loadList() {
        let url = bus.host + '/pos/api/warn/prod/list/' + "1" + "?page=" + 0 + "&size=" + 999999999999999999;
        this.loading = true;
        this.$axios.post(url, {}).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
            this.loading = false;
            return false;
          }
          let msg = data.msg;
          if (msg == null || msg == '' || msg == []) {
            this.list = []
          } else {
            let content = msg;
            content.forEach(e => e.statusStr = e.status === 0 ? '未确认' : '已确认');
            this.list = content;
          }
          this.loading = false;
        }).catch((err) => {
        });
        this.loading = false;
      },

      // 获取店铺信息
      storeDate() {
        let url = this.url + '/pos/api/store/detail';
        this.$http.get(url).then((res) => {
          let date = res.data.msg;
          if (res.data.success == false) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
            return false;
          }
          this.store = date;
          console.log(this.store.walletBalance)
          if (this.store.walletBalance==null||this.store.walletBalance==undefined){
            console.log(this.store.walletBalance)
            this.store.walletBalance=0;
          }
        }).catch((res) => {
        })
      },

      walletbalance() {
        let url = this.url + '/pos/api/warn/dianbao/walletbalance';
        this.$http.get(url).then((res) => {
          let date = res.data.msg;
          if (res.data.success == false) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
            return false;
          }
          this.store.walletBalance=date;
        }).catch((res) => {
        })
      },


      submitPassword() {
        if(this.submit){
          return false;
        }
        this.submit =true;
        if (null == this.password || this.password == '' || this.password == undefined) {
          this.$message({
            message: "密码不能为空",
            type: 'warning'
          });
          this.submit =false;
          return false;
        }

        let Base64 = require('js-base64').Base64;
        if (this.password.length < 6) {
          this.$message({
            message: "密码不能少于六位",
            type: 'warning'
          });
          this.submit =false;
          return false;
        }
        if (this.password.length > 6) {
          this.$message({
            message: "密码不能大于六位",
            type: 'warning'
          });
          this.submit =false;
          return false;
        }
        if (!/^[0-9]\d*$/.test(this.password)){
          this.$message({
            message: "密码格式不合法",
            type: 'warning'
          });
          this.submit =false;
          return false;
        }
        let url = this.url + '/pos/api/warn/dianbao/payment?orderId=' + this.orderId + '&password=' + Base64.encode(this.password);
        this.$axios.post(url).then((res) => {
          let date = res.data;
          if (!date.success) {
            this.$message({
              message: date.msg,
              type: 'error'
            });
            this.password = null;
            this.submit =false;
            return false;
          }
          console.log(date.msg.code)
          if (date.msg.code == 0) {
            this.$message({
              message: date.msg.result,
              type: 'success'
            });
            this.submit =false;
            this.payPassword = false;
            this.password = null;
            let all = new Set(this.list), remove = new Set(this.orderProduct);
            let unorderd = new Set([...all].filter(x => !remove.has(x)));
            this.list = Array.from(unorderd);
            this.payType= '5'
            return;
          } else if (date.msg.code == 1) {
            this.$message({
              message: date.msg.result,
              type: 'error'
            });
            this.submit =false;
            this.password = null;
            return;
          }
          this.submit =false;
          this.password = null;
        }).catch((res) => {
          this.submit =false;
        })

      }
    },
    mounted() {
      this.loadList();
     // this.storeDate();
      this.walletbalance();
    }
  }
</script>
<style>
  .money{display: inline-block;}
  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .dia-warning {
    font-size: 100px;
    text-align: center;
    font-weight: bold;
  }

  .el-input--small  {
    height: 28px;
  }

  .weixin .el-dialog__body {
    text-align: center
  }
  .paymentClass input{
    border: none!important;
  }
  .pas {
    width: 15%;
  }
  .tableScroll .el-table .el-table__body-wrapper{overflow: hidden;overflow-y:scroll;}
  .pages{margin: 5px 0 0 0;}

  .warn-form-item{
    margin-bottom: 0;
    font-size: 20px;
    font-weight: bold;
  }
  .order-dialog .el-dialog--small{width:auto;}
  .order-dialog .order-paytype .el-input__inner{
    width:120px;
    border:transparent;
  }
  .order-dialog .order-paytype .el-input__icon{
    color: rgb(243, 237, 231);
  }
</style>

