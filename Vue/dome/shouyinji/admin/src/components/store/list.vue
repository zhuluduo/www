<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="3">
        <el-select v-model="params.storeType" clearable placeholder="店铺类型" size="small">
          <el-option v-for="item in Preference_type" :key="item.label" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="search" placeholder="店铺名称/店长/收银账号" v-model="params.searchWord" size="small"/>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="search" :loading="loading" icon="search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="15" class="tool-bar" align="right">
        <el-button type="primary" @click="showStoreAdd" icon="plus" size="small">添加店铺</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" @sort-change="sortList" v-loading="loading" element-loading-text="数据加载中"
                  :default-sort="{prop: 'createTime', order: 'descending'}">
          <el-table-column prop="name" label="店铺名称"/>
          <el-table-column sortable="custom" prop="storeType" label="店铺类型">
            <template scope="scope">
              <el-tag v-if="scope.row.storeType==0" type="danger">直营店</el-tag>
              <el-tag v-if="scope.row.storeType==1" type="success">加盟店</el-tag>
              <el-tag v-if="scope.row.storeType==2" type="success">其他</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ownerName" label="店铺店长"/>
          <el-table-column prop="telephone" label="店铺收银账号"/>
          <el-table-column prop="address" label="店铺地址"/>
          <el-table-column label="操作" width="200" align="center">
            <template scope="scope">
              <el-button :plain="true" type="warning"
                         @click="edit(scope.row,scope.$index)"
                         size="small" icon="edit">编辑
              </el-button>
              <el-button type="success" @click="login(scope.row.loginUrl)" size="small" icon="caret-right">登录店铺

              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeSize"
          @current-change="changePage"
          :current-page.sync="page.currentPage"
          :page-size="page.size"
          layout="prev, pager, next, jumper, total"
          :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <transition name="el-zoom-in-right">
      <div v-show="showEdit" class="transition-box scrollbar">
        <el-row class="box-title">
          <el-col :span="24" align="center">编辑店铺</el-col>
        </el-row>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="ruleForm ruleForms">
          <el-form-item label="店铺名称：">
            <el-input v-model="ruleForm.name" size="small" disabled="disabled"/>
          </el-form-item>
          <el-form-item label="店主名称：">
            <el-input v-model="ruleForm.ownerName" size="small" disabled="disabled"/>
          </el-form-item>
          <el-form-item label="注册手机号：">
            <el-input v-model="ruleForm.telephone" size="small" disabled="disabled"/>
          </el-form-item>
          <el-form-item label="营业执照：">
            <el-input v-model="ruleForm.licenseNo" size="small" disabled="disabled"/>
          </el-form-item>
          <el-form-item label="所属区域：">
            <el-input v-model="ruleForm.province.name" size="small" disabled="disabled"/>
            <el-input v-model="ruleForm.city.name" size="small" disabled="disabled"/>
            <el-input v-model="ruleForm.area.naem" size="small" disabled="disabled"/>
          </el-form-item>
          <el-form-item label="店铺地址：">
            <el-row :gutter="5">
              <el-col :span="17">
                <el-input  disabled="disabled" v-model="ruleForm.address" size="small"/>
              </el-col>
              <el-col :span="6">
                <el-button @click="baiduMap()" type="primary" size="small">选择地址</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="店铺类型：">
            <el-select v-model="storeType" clearable placeholder="店铺类型" size="small">
              <el-option v-for="item in Preference_type" :key="item.label" :label="item.label"
                         :value="item.value">{{item.label}}
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row class="box-footer">
          <el-col :span="24" align="center">
            <el-button :loading="loading" type="success" @click="submitForm('ruleForm')" size="small" icon="check">保存
            </el-button>
            <!--<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>-->
            <el-button @click="closeForm('ruleForm')" size="small" icon="close">关闭</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <el-dialog title="添加店铺" :visible.sync="showAdd" ref='dialog' @close="closeAdd()" size="tiny">
      <el-row class="data-table" :gutter="2" style="margin-bottom: 5px">
        <el-col :span="7" align="right" style="line-height: 30px;">
          店宝账号：
        </el-col>
        <el-col :span="17">
          <el-autocomplete
            class="inline-input"
            v-model="telePhone"
            :fetch-suggestions="querySearch"
            placeholder="请输入店宝账号"
            :trigger-on-focus="false"
            @select="handleSelect"
            size="small"
            style="width:200px"
          ></el-autocomplete>
          <!--<span class="tpltxt">(输入后,请选择一条注册号码!)</span>-->
        </el-col>
      </el-row>
      <el-row class="data-table" :gutter="2">
        <el-col>
          <el-col :span="7" align="right" style="line-height: 30px;">
            店铺类型：
          </el-col>
          <el-col :span="9">
            <el-select v-model="storeType"   clearable placeholder="店铺类型" size="small" style="width:200px">
              <el-option v-for="item in Preference_type" :key="item.label" :label="item.label"
                         :value="item.value">{{item.label}}
              </el-option>
            </el-select>
          </el-col>
        </el-col>

      </el-row>
      <el-row class="box-footer" style="margin-top:20px">
        <el-col :span="24" align="center">
          <el-button @click="closeAdd()" size="small" icon="close">关闭</el-button>
          <el-button :loading="loading" type="success" @click="savaStore()" size="small" icon="check">开通收银
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="转角地图" :visible.sync="dialogVisible" @open="shopMAp()" :close-on-click-modal="false"
               :show-close="false">
      <el-input type="hidden" id="addressbaidu"></el-input>
      <input type="text" id="lng" style="display: none">
      <input type="text" id="lat" style="display: none">
      <el-row :gutter="20">
        <el-col :span="18">
          <div id="l-map"></div>
        </el-col>
        <el-col :span="6">
          <div id="r-result"><input type="text" id="suggestId" size="20" value="百度" placeholder="搜地点、找路线"
                                    class="keyMap"/></div>
          <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
          <div id="panelTab">
            <ul id="panel"><p class="panelMap mapCent">暂无数据</p></ul>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  import {dateFormat} from '../../utils/date.js';
  import math from '../../utils/math.js';
  import {MP} from '../../utils/map.js'
  export default{
    data(){
      return {
        map: false,
        showAdd: false,
        showEdit: false,
        addTure: true,
        dateRange: '',
        storeType: '',
        telePhone: '',
        syncId: '',
        baiduAddress: '',
        baidulat: '',
        baidulng: '',
        list: [], // 列表数据
        restaurants: [],
        ruleForm: {
          storeType: '',
          id: '',
          name: '',
          lat: '',
          lng: '',
          province: {name: '', id: ''},
          city: {name: '', id: ''},
          area: {name: '', id: ''},
          address: '',
          ownerName: '',
          telephone: '',
          licenseNo: ''
        },
        map: '',
        listSort: {},
        Preference_type: [{label: "直营店", value: 0}, {label: "加盟店", value: 1}, {label: "其他", value: 2}],
        params: { // 列表查询参数
          storeType: '',
          searchWord: '' // 模糊搜索关键字
        },
        page: { // 分页信息
          currentPage: 1, // 当前页
          size: 15, // 每页大小
          total: 1, // 总页数
        },
        loading: false, // 是否显示加载遮罩层
        dialogVisible: false,
      }
    },

    methods: {
      // 处理点击排序
      sortList(sort){
        this.listSort = this.trimSort(sort);
        this.loadList();
      },
      search(){
        this.params.searchWord = $.trim(this.params.searchWord);
        this.loadList();
      },
      trimSort(sort){
        if (sort.order != null)
          sort.order = sort.order.replace('ending', '');
        return sort;
      },
      /*加载列表数据*/
      loadList() {
        let url = bus.host + '/admin/api/store/list?page=' + (this.page.currentPage - 1) + '&size=' + this.page.size;
        if (this.listSort.order != null) {
          url += '&sort=' + this.listSort.prop + ',' + this.listSort.order;
        }
        this.loading = true;
        this.$axios.post(url, this.params).then((res) => {
          let data = res.data;
          if (data.success == false) {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
            this.loading = false;
            return false;
          }
          let msg = data.msg;
          this.page.total = msg.totalElements;
          let content = msg.content;
          this.list = content;
          this.loading = false;
        })
          .catch((err) => {
          });
      },
      /*处理分页事件*/
      changeSize(val) {
        this.page.size = val;
        this.loadList();
      },
      changePage(val) {
        this.page.currentPage = val;
        this.loadList();
      },

      breaks_classify() {
        let url = bus.host + '/admin/api/digtaldictionary/detail?type=2'
        this.$http.get(url, {}).then((response) => {
          if (response.data.success == false) {
          } else {
            this.Preference_type = response.data.msg;
          }
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      /*编辑*/
      edit (row) {
        let z = row;
        this.ruleForm.storeType = row.storeType;
        this.ruleForm.id = row.id;
        this.ruleForm.name = row.name;
        for (var i = 0; i < this.Preference_type.length; i++) {
          if (this.Preference_type[i].value == row.storeType) {
            this.Preference_types = this.Preference_type[i].label
          }
        }
        if (row.provide != null) {
          this.ruleForm.province = row.province;
        }
        if (row.city != null) {
          this.ruleForm.city = row.city;
        }
        if (row.area != null) {
          this.ruleForm.area = row.area;
        }
        this.ruleForm.address = row.address;
        this.ruleForm.ownerName = row.ownerName;
        this.ruleForm.telephone = row.telephone;
        this.ruleForm.licenseNo = row.licenseNo;
        this.ruleForm.lat= row.lat;
        this.ruleForm.lng = row.lng;
//        this.storeType = this.Preference_type;
        if (row.storeType == 0) {
          this.storeType = "直营店"
        }
        if (row.storeType == 1) {
          this.storeType = "加盟店"
        }
        if (row.storeType == 2) {
          this.storeType = "其他"
        }
        this.showEdit = true;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        if (this.ruleForm.status == false) {
          this.$refs[formName].resetFields();
        }
      },
      closeForm(formName){
        this.$refs[formName].resetFields();
        this.showEdit = false;
      },
      /*百度地图*/
      baiduMap(){
        $(".paneMap").remove();
        this.dialogVisible = true;
      },
      /*打开地图后加载*/
      shopMAp(){
        this.skMap(this.ruleForm.lng,this.ruleForm.lat);
      },
      skMap(x,y){
        MP('OHxbkLLnFmtkwG2LftN72LM6').then(BMap => {
          function G(id) {
            return document.getElementById(id);
          }
          var map = new BMap.Map("l-map");
          if (x==null,y==null){
          var point = new BMap.Point(114.02597366, 22.54605355);
          }else {
            var point = new BMap.Point(x,y);
          }
          map.enableScrollWheelZoom(true);  //是否允许地图放大或缩小
          if (x==null,y==null){
            map.centerAndZoom(point, 12);
          }else {
            map.centerAndZoom(point, 18);
          }

          var geolocation = new BMap.Geolocation();
          var mOption = {
            poiRadius: 300,           //半径为1000米内的POI,默认100米
            numPois:20                //列举出50个POI,默认10个
          }
          //图标拖动获取地址
          function mapDrag(vars, point) {
            vars.addEventListener("mouseup", function (e) {
              var pt = e.point;
              geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
//                console.log(addComp)
//                console.log("拖动"+addComp.province + addComp.city +addComp.district +  addComp.street +  addComp.streetNumber);
                displayPOI(pt)
              });
            });
          }

          /*获取全部POI(半径内所有内型的建筑)*/
          var geoc = new BMap.Geocoder();  //鼠标拖动
          function displayPOI(point) {
            $(".paneMap").remove();
            geoc.getLocation(point,
              function mCallback(r) {
                $("#addressbaidu input").val(r.address);
                $("#lng").val(r.point.lng);
                $("#lat").val(r.point.lat);
                var allPois = r.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
                if (allPois == '') {
                  $("#panel .panelMap").addClass("mapDisplay-block").removeClass("mapDisplay-none")
                } else {
                  $("#panel .panelMap").addClass("mapDisplay-none")
                  for (var i = 0; i < allPois.length; ++i) {
//                  document.getElementById("panel").innerHTML += "<li style='font-size:12px;' class='paneMap'>" +"<div>"+(i+1)+ "、"+ allPois[i].title  +"<span>"+allPois[i].address +"</span>"+"</div>"+ "<i>"+allPois[i].point.lng+","+allPois[i].point.lat+"</i>"+"</li>"
                    document.getElementById("panel").innerHTML += "<li style='font-size:12px;' class='paneMap'>" + "<div>" + "<h3>"+allPois[i].title+"</h3>" + "<span>" + allPois[i].address + "</span>" + "</div>" + "<i>" + allPois[i].point.lng + "," + allPois[i].point.lat + "</i>" + "</li>"
                  }
                }
              }, mOption);
          }

          /*获取全部POI(半径内所有内型的建筑)*/
          $("#panel").on("click", "li", function () {
            $(this).addClass('mapBG').siblings().removeClass("mapBG");
            var index = $(this).index();
            var infostit = $(this).find('h3').html();
            var infos = $(this).find('span').html();
            var info = $(this).find('i').html();
            var xMap = info.split(",")[0];
            var yMap = info.split(",")[1];
            if(infos==' ' || infos==null || infos==undefined){
              $("#addressbaidu input").val(infostit);
            }else {
              $("#addressbaidu input").val(infos);
            }
            $("#lng").val(xMap);
            $("#lat").val(yMap);
            map.clearOverlays();
            var new_point = new BMap.Point(xMap, yMap);
            var marker = new BMap.Marker(new_point);  // 创建标注
            map.addOverlay(marker);              // 将标注添加到地图中
            marker.enableDragging();//页面加载是否可拖动
//              displayPOI(new_point)
            mapDrag(marker, new_point)
          });

            //没有X和Y坐标时运行地图加载根据浏览器获取地址
            var mk = new BMap.Marker(point);
            map.addOverlay(mk);    //添加标注
            mk.enableDragging();//页面加载是否可拖动
            displayPOI(point)  //半径内的所有的建筑
            mapDrag(mk, point)

//            //有X和Y坐标时运行地图加载根据浏览器获取地址
//            geolocation.getCurrentPosition(function (r) {
//              if (this.getStatus() == BMAP_STATUS_SUCCESS) {
//                var mk = new BMap.Marker(r.point);
//                map.addOverlay(mk);
//                mk.enableDragging();//页面加载是否可拖动
//                displayPOI(point)  //半径内的所有的建筑
//                mapDrag(mk, point)
//                //地图加载根据浏览器获取地址
//                $("#addressbaidu input").val(r.address.province + r.address.city + r.address.district + r.address.street_number);
//                $("#lng").val(r.point.lng);
//                $("#lat").val(r.point.lat);
////              console.log(r.address.province+r.address.city+r.address.district+r.address.street_number)
////              console.log('您的位置：'+r.point.lng+','+r.point.lat);
//              }
//              else {
//                console.log('failed' + this.getStatus());
//              }
//            }, {enableHighAccuracy: true})

          //收索定位时后继续实现可拖动获取数据
          var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
              "input": "suggestId"
              , "location": map
            });
          ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
              value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
            value = "";
            if (e.toitem.index > -1) {
              _value = e.toitem.value;
              value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G("searchResultPanel").innerHTML = str;
          });
          var myValue;
          ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
            setPlace();
//              console.log(myValue)
          });
          $(".keyMap").keydown(function (event) {
            var myValue = $("#suggestId").val()
            if(myValue==""||myValue==null){
            }else {
              map.clearOverlays();    //清除地图上所有覆盖物
              if (event.keyCode == 13) {
                function myFuns() {
                  var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                  map.centerAndZoom(pp, 18);
                  var marker = new BMap.Marker(pp);// 创建标注
                  var geoc = new BMap.Geocoder();
                  map.addOverlay(marker);    //添加标注
                  marker.enableDragging();
                  displayPOI(pp)  //半径内的所有的建筑
                  mapDrag(marker, point) //图标拖动获取地址
                }
                var local = new BMap.LocalSearch(map, { //智能搜索
                  onSearchComplete: myFuns
                });
                local.search(myValue);
              }
            }
          })
          function setPlace() {
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun() {
              var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
              map.centerAndZoom(pp, 18);
              var marker = new BMap.Marker(pp);// 创建标注
              var geoc = new BMap.Geocoder();
              map.addOverlay(marker);    //添加标注
              marker.enableDragging();
              displayPOI(pp)  //半径内的所有的建筑
              mapDrag(marker, point) //图标拖动获取地址
            }

            var local = new BMap.LocalSearch(map, { //智能搜索
              onSearchComplete: myFun
            });
            local.search(myValue);
          }
        })
      },
      determine(){
        if ($('#addressbaidu input').val() == null || $('#addressbaidu input').val() == undefined || $('#addressbaidu input').val() == "") {
          this.$message({
            message: "请选择地址",
            type: "error",
          });
          return false;
        }
        this.baiduAddress = $('#addressbaidu input').val();
        this.ruleForm.address = this.baiduAddress;
        this.ruleForm.lat = $('#lat').val();
        this.ruleForm.lng = $('#lng').val();
        this.dialogVisible = false
      },
      submitForm(formName) {
      if (this.storeType == null || $.trim(this.storeType)=='') {
        this.storeType = this.ruleForm.storeType;
       }
        this.loading = true;
        if (this.storeType == "直营店") {
          this.storeType = 0;
        }
        if (this.storeType == "加盟店") {
          this.storeType = 1;
        }
        if (this.storeType == "其他") {
          this.storeType = 2;
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              id: this.ruleForm.id,
              storeType: this.storeType,
              address: this.ruleForm.address,
              lat: this.ruleForm.lat,
              lng: this.ruleForm.lng
            };
            this.$http.put(bus.host + '/admin/api/store/update', params).then((response) => {
              let type = 'warning';
              if (response.data.success)
                type = 'success';
              this.$message({
                message: response.data.msg,
                type: type
              });
              if (response.data.success) {
                this.showEdit = false;
                this.loadList();
              }
              this.$refs[formName].resetFields();
              this.loading = false;
            });
          } else {
            this.loading = false;
            return false;
          }
        });
      },
      login(url){
        window.open(url + '&_t=' + new Date().getTime());
      },
      showStoreAdd(){
        this.storeType = null;
        this.showAdd = true;
      },
      closeAdd(){
        this.showAdd = false;
      },
      savaStore(){
          if (this.addTure==false){
              return false;
          }
        this.addTure= false;
        if (this.telePhone == null || this.telePhone == '') {
          this.$message({
            message: "请填入电话号码",
            type: "error",
          });
          this.addTure= true;
          return false;
        }
        if (/^[0-9]{11}$/.test(this.telePhone) == false) {
          this.$message({
            message: "请填入正确的电话号码！！！",
            type: "error",
          });
          this.addTure= true;
          return false;

        }

        let params = {
          storeType: this.storeType,
          telephone: this.telePhone
//          syncId:this.syncId
        };
        this.$http.put(bus.host + '/admin/api/store/create', params).then((response) => {
          let type = 'warning';
          if (response.data.success)
            type = 'success';
          this.telePhone = null;
          this.storeType = null;
          this.$message({
            message: response.data.msg,
            type: type,
          });
          this.addTure= true;
          this.telePhone = null;
          this.storeType = null;
          this.showAdd = false;
          this.showEdit = false;
          this.loadList();
          if (!response.data.success) {
            this.addTure= true;
            this.showEdit = false;
            this.loadList();
          }
          this.addTure= true;
        });
      },
      querySearch(queryString, cb) {
          $(".el-input__inner").blur(function () {
            $(".el-scrollbar").css("display", "block");
          })
        if (!/^\d+$/.test(queryString)) {
          this.$message({message: '输入不合法！', type: 'warning'});
          return false;
        }
        $(".el-scrollbar").css("display", "none");
        this.$http.get(bus.host + '/admin/api/kefu/store?telephone=' + queryString).then((response) => {
          $(".el-scrollbar").css("display", "none");
          if (response.data.success == false) {
            $(".el-scrollbar").css("display", "none");
          }
          if (response.data.success) {
            let msg = response.data.msg;
            if (msg.length > 0) {
              let date = [];
              for (let i = 0; i < msg.length; i++) {
                date.push({value: msg[i].telephone, syncId: msg[i].syncId})
              }
              var restaurants = date;
              var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
              // 调用 callback 返回建议列表的数据
              $(".el-scrollbar").css("display", "block");
              cb(results);

            } else {
              $(".el-scrollbar").css("display", "none");
            }
          }
        })
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.telePhone = item.value;
        this.syncId = item.syncId;
      },

    },
    mounted() {
//      this.breaks_classify()
      this.loadList();

    }
  }
</script>
<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }

  #l-map {
    height: 500px;
    width: 100%;
  }

  #r-result {
    width: 100%;
  }

  .tangram-suggestion-main {
    z-index: 9999;
  }

  #panelTab #panel i, .anchorBL, .anchorBL {
    display: none;
  }

  #panelTab #panel li {
    box-sizing: border-box;
    padding-bottom: 5px;
    padding: 5px 0 5px 5px;
  }

  #panelTab #panel li:hover {
    background: #eef1f6;
    cursor: pointer;
    color: #000;
  }

  #panel .paneMap {
    border-bottom: 1px solid #e4e4e4;
    color: #000;
  }

  #panel .paneMap div h3{
    margin: 0;
    font-size: 15px;
    font-weight: initial;
  }

  #panel .paneMap div span {
    font-size: 12px;
    display: block;
    color: #9a9a9a;
  }

  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .mapBG {
    background: #eef1f6;
  }

  .info-base label {
    width: 90px;
    color: #99a9bf;
  }

  .el-zoom-in-right-enter-active, .el-zoom-in-right-leave-active {
    transition: all .3s
  }

  .el-zoom-in-right-enter-active, .el-zoom-in-right-leave-active {
    /*opacity:1;*/
    margin-right: 0;
    /*-ms-transform:scaleX(1);*/
    /*transform:scaleX(1);*/
    /*-ms-transform-origin: right center;*/
    /*transform-origin: right center;*/
  }

  .el-zoom-in-right-enter, .el-zoom-in-right-leave-active {
    /*opacity:0;*/
    margin-right: -405px;
    /*-ms-transform:scaleX(0);*/
    /*transform:scaleX(0)*/
  }

  .info-base .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  /*.check-dialog .el-dialog__header{padding:0px !important;}*/
  .f-fl {
    float: left;
  }

  .f-fr {
    float: right;
  }

  .f-fwb {
    font-weight: bold;
  }

  .f-tac {
    text-align: center;
  }

  .f-db {
    display: block;
  }

  .f-ib {
    display: inline-block;
    *display: inline;
    *zoom: 1;
  }

  .tpltxt {
    color: #b6b6b6;
    padding-left: 5px;
  }
</style>
<style scoped lang="scss">
  #panelTab {
    max-height: 460px;
    border: 1px solid #eee;
    overflow-y: auto;
    margin-top: 10px;
  }

  #panelTab #panel {
    padding: 0;
    margin: 0;
  }

  .check-dialog-siz {
    font-size: 20px;
    color: #000;
  }

  #suggestId {
    width: 100%;
    height: 25px;
    display: block;
    border-radius: 2em;
    background: #fff;
    color: #535d92;
    border: 1px solid #d6d6d6;
    text-indent: 15px;
  }

  input#suggestId:focus {
    outline: none;
  }

  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .mapDisplay-block {
    display: block;
  }

  .mapDisplay-none {
    display: none;
  }

  .mapCent {
    text-align: center;
  }

  .el-breadcrumb {
    padding: 5px 0px;
  }

  .el-pagination {
    padding: 10px 0px;
  }

  .el-table {
    margin-top: 10px;
  }

  .tool-bar {
    text-align: right;
  }

  .el-date-editor--daterange.el-input {
    width: 100%;
  }

  .transition-box .el-form-item {
    margin-bottom: 15px;
  }

  .transition-box {
    box-shadow: 0px 0px 0px 2px #383531;
    position: fixed;
    top: 50px;
    right: 0;
    width: 400px;
    height: 100%;
    background-color: #f6f3ee;
    color: #fff;
    box-sizing: border-box;
    z-index: 999;
    overflow: scroll;
    padding-bottom: 70px;
  }

  .transition-box .box-title {
    position: fixed;
    top: 50px;
    width: 400px;
    padding: 5px;
    background-color: #F6F3EE !important;
    color: #6A5C48 !important;
    border-bottom: 1px solid #e8e8e8 !important;
    z-index: 999;
  }

  .transition-box .ruleForm {
    padding-right: 20px;
    padding-top: 50px;
  }

  .transition-box .box-footer {
    position: fixed;
    bottom: 0;
    width: 400px;
    padding: 5px;
    background-color: #F6F3EE !important;
    color: #6A5C48 !important;
    border-top: 1px solid #e8e8e8 !important;
  }

  .transition-box .form-inline {
    display: inline;
  }
</style>
