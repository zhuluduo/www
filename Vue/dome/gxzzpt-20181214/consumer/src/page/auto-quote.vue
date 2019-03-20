<template>
  <div class="auto-quotation">
      <div class="content">
        <div class="step-box">
            <v-orderStep :active="stepActive"></v-orderStep>
        </div>
        <div class="cnc-title">
            <div class="text">{{serviceName}}</div>
            <div class="btn">
                <el-upload
                    :action="uploadUrl"
                    :with-credentials="true"
                    :limit="100"
                    :on-success="onSuccess2"
                    :before-upload="beforeUpload2"
                    :show-file-list="false"
                    :file-list="fileList2"
                    >
                    <el-button  class="go-on-upload" v-show="cncList.length>0" size="small" type="primary">+继续上传</el-button>
                  </el-upload>
            </div>
        </div>
        <div class="cnc-info">
            <div class="cnc-info-item" v-show="cncList.length==0">
                <div class="left">
                     <el-upload
                        :action="uploadUrl"
                        :with-credentials="true"
                        :limit="100"
                        :on-success="onSuccess1"
                        :before-upload="beforeUpload1"
                        :show-file-list="false"
                        :on-progress="onProgress1"
                        :file-list="fileList1"
                        >
                        <el-button size="small" type="primary">上传模型文件</el-button>
                    </el-upload>
                    <p class="prompt-info file-type-info">支持STL、STP格式文件</p>
                    <p class="prompt-info">请先上传您的模型文件</p>
                    <div class="proccess-bar" v-show="showProccessBar">
                        <div class="proccess-bar-inner" :style="{ width: proccessWidth}"></div>
                    </div>
                </div>
                <div class="right">
                    <table class="cnc-table">
                        <thead>
                            <tr>
                                <th class="th-1">零件信息</th>
                                <th class="th-2">工艺</th>
                                <th class="th-3">单价</th>
                                <th class="th-4">数量</th>
                                <th class="th-5">交期</th>
                                <th class="th-6">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6">您还未上传模型</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

              <div class="cnc-info-item" v-show="cncList.length>0" v-for="(cncItem,index) in cncList">
                <div class="left">
                    <img :src="$baseURL + '/' + cncItem.attachFile.thumbnailUrl||emptyImg" alt="">
                </div>
                <div class="right">
                    <table class="cnc-table">
                        <thead>
                            <tr>
                                <th class="th-1">零件信息</th>
                                <th class="th-2">工艺</th>
                                <th class="th-3">单价</th>
                                <th class="th-4">数量</th>
                                <th class="th-5">交期</th>
                                <th class="th-6">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                           <tr>
                                <td class="th-1">
                                    <div>
                                        <div class="td-info-item">名称：{{cncItem.attachFile.orignFileName}}</div>
                                        <div class="td-info-item">尺寸：{{cncItem.attachFile.width}}x{{cncItem.attachFile.length}}x{{cncItem.attachFile.height}}{{cncItem.fileUnit|fileUnitFilter(fileUnitList)}}</div>
                                        <div class="td-info-item">体积：{{cncItem.attachFile.surface}}{{cncItem.fileUnit|fileUnitFilter(fileUnitList)}}<sup>2</sup></div>
                                        <div class="td-info-item">体积：{{cncItem.attachFile.volume}}{{cncItem.fileUnit|fileUnitFilter(fileUnitList)}}<sup>3</sup></div>
                                         <div class="td-info-item" style="padding-right:40px;">
                                            <label for="">文件单位：</label>  
                                            <div class="select-item">
                                                <el-select @change="selectFileUnit(cncItem)" v-model="cncItem.fileUnit" placeholder="请选择">
                                                    <el-option
                                                    v-for="file in fileUnitList"
                                                    :key="file.id"
                                                    :label="file.name"
                                                    :value="file.id">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                         </div>
                                    </div>
                                </td>
                                <td class="th-2">
                                    <div>
                                         <div class="td-info-item">
                                            <label for="">材质选择：</label>  
                                            <div class="select-item">
                                               <div class="def-select" @click="openMaterialDlg(cncItem)">{{cncItem.material.materialName}}</div>
                                            </div>
                                        </div>
                                        <div class="td-info-item" v-for="step in cncItem.stepList" @click="openStepDlg(cncItem, step)">
                                            <label for="">{{step.stepName}}：</label>
                                            <div class="select-item">
                                                <div class="def-select">{{step.techniqueName}}</div>
                                            </div>
                                        </div>
                                        <div class="td-info-item" v-for="techniqueParam in cncItem.techniqueParams">
                                            <label for="">{{techniqueParam.techniqueParamName}}：</label>
                                            <div class="select-item">
                                                <el-select @change="selectTechniqueParam(cncItem)" v-model="techniqueParam.value" placeholder="请选择">
                                                    <el-option
                                                    v-for="val in techniqueParam.valueList"
                                                    :key="val"
                                                    :label="val"
                                                    :value="val">
                                                    </el-option>
                                            </el-select>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="th-3">￥{{cncItem.price.toFixed(2)}}</td>
                                <td class="th-4">
                                    <div class="td-box">
                                        <div class="inline-item sub-btn" :class="{'disabled':cncItem.quantity==1}" @click="reduceQuantity( cncItem )">-</div>
                                        <div class="inline-item" ><input @input="changeQuantity( cncItem )" v-model="cncItem.quantity" type="text"></div>
                                        <div class="inline-item add-btn" @click="addQuantity( cncItem )">+</div>
                                    </div>
                                </td>
                                <td class="th-5">{{serviceData.periodMin}}-{{serviceData.periodMax}}{{serviceData.periodUnitText}}</td>
                                <td class="th-6"><i class="el-icon-delete cursor-pointer" @click="deleteModel(cncItem,index)"></i></td>
                            </tr> 
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="footer-btn" v-show="cncList.length>0">
            <div class="fl-right">
                <div class="total">合计（不含运费）：<span class="total-amount">{{totalPrice}}</span></div>
                <div class="add-to-cart-btn" @click="addToCart(true)">加入购物车</div>
                <div class="buy-now-btn" @click="addToCart(false)">立即购买</div>
            </div>
        </div>

        <div class="artificical-quotation">
            <div class="title"><span>人工报价</span></div>
            <div class="btn-box">
                <div class="btn" @click="$router.push({path: '/quote/3d'});">去找供应商报价</div>
                <div class="desc">自由选择供应商，人工报价更精准！</div>
            </div>
        </div>
    </div>

     <el-dialog class="cnc-material-dlg"
        :visible.sync="materialDlg.visible"
        :before-close="handleMaterialDlgClose"
        width="930px">
        <div slot="title" class="def-dlg-title">
            <span @click="handleMaterialCatalog(item)" v-for="(item,index) in materialRenderList" :class="{'tab-item-active':item.isActive}" class="tab-item" :key="index">{{item.catalogName}}</span>
        </div>
        <div class="dlg-content" v-for="(item,index) in materialRenderList" v-show="item.isActive" :key="index">
           <div @click="selectMaterial(el)" class="material-item" :class="{'material-item-active':el.isSelected}" v-for="(el,index) in item.materials" :key="index">
               <img :src="el.picture" alt="">
               <p class="name">{{el.materialName}}</p>
               <p class="desc">{{el.info}}</p>
               <p class="detail-link">查看详情</p>
           </div>
        </div>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeMaterialDlg">取 消</el-button>
            <el-button type="primary" @click="confirmsSelectMaterial">确 定</el-button>
        </div>
    </el-dialog>


    <el-dialog class="cnc-step-dlg"
        :title="currentStepItem.stepName"
        :visible.sync="stepDlg.visible"
        :before-close="handleStepDlgClose"
        width="930px">
        <div class="dlg-content">
            <div class="content-row">
                <div class="lf-title"><span>工艺选择</span></div>
                <div class="rg-content">
                    <div @click="selectTechnique(technique)" class="card-item" :class="{'card-item-active':technique.isActive}" v-for="(technique,index) in techniqueRenderList" :key="index">
                        <img :src="technique.techniquePicture||emptyImg" alt="不可描述">
                        <p>{{technique.techniqueName}}</p>
                    </div>
                </div>
            </div>
            <div class="content-row" v-for="(technique,index) in techniqueRenderList" v-show="technique.isActive" :key="index">
                <div class="lf-title"><span>耗材分类</span></div>
                <div class="rg-content consume-rg-content">
                   <div class="consume">
                       <div class="tab">
                           <span @click="handleConsumeCatalog(consumable, technique.consumableMaterialList)" :class="{'consume-tab-active': consumable.isActive}" v-for="consumable in technique.consumableMaterialList">{{consumable.catalogName}}</span>
                       </div>
                       <div class="consume-list" v-show="consumable.isActive" v-for="consumable in technique.consumableMaterialList">
                            <div @click="selectConsumeMaterial(material, consumable.materials)" class="card-item" :class="{'card-item-active': material.isActive}" v-for="material in consumable.materials">
                                <img :src="material.picture||emptyImg" alt="">
                                <p>{{material.materialName}}</p>
                            </div>
                            <div class="params-box" v-for="material in consumable.materials" v-show="material.isActive">
                                <div class="params-item" v-for="param in material.param" v-show="material.isActive">
                                    <label for="">{{param.materialParamName}}：</label>
                                    <el-select v-model="param.defaultValue" placeholder="请选择" v-show="'valueList' in param && !param.valueInputable">
                                        <el-option
                                        v-for="valItem in param.valueList"
                                        :key="valItem"
                                        :label="valItem"
                                        :value="valItem">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="param.defaultValue" v-show="!('valueList' in param) && param.valueInputable"/>
                                </div>
                            </div>
                       </div>
                   </div>
                   
                </div>
            </div>
        </div>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeStepDlg">取 消</el-button>
            <el-button type="primary" @click="confirmHandleStep">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import orderStep from "../components/orderStep.vue";
import emptyImg from '../../static/img/empty.png';
//验证表单
import { validateFile,validatePhone,validateEmail,checkNormal} from "../lib/validate.js";
export default {
  components: {
    "v-orderStep": orderStep
  },
  data() {
    return {
        serviceName:'',
        emptyImg:emptyImg,
        currentCncItem: null,
        currentStepItem: '',
        materialRenderList:[],
        stepRenderList:[],
        techniqueRenderList:[],
        fileUnitList:[],
        cartList:[],
        serviceData:null,
        stepDlg: {
            visible: false
        },
        materialDlg:{
            visible: false,
        },
        proccessWidth: "0%",
        showProccessBar: false,
        uploadUrl: this.$baseURL + "/custom/attachFile/upload3DFileForCNC",
        uploadUrl3:this.$baseURL + '/uploadingFile',
        stepActive: {
            stepOne: false,
            stepTwo: true,
            stepThr: false,
            stepFou: false
        },
        fileList1:[],
        fileList2:[],
        fileList3:[],
        cncList:[],
        uploadForm: {
            rules: {
            type: [{ required: true, message: "请选择类别", trigger: "change" }],
            fileName: [{ validator: validateFile, trigger: "change" }],
            fileList: [
                { required: true, validator: validateFile, trigger: "change" }
            ],
            remark: [{ message: "请输入备注", trigger: "blur" }]
            },
            typeList: [{ name: "3D打印", id: 106010 }],
            data: {
            fileList: [],
            type: 106990,
            remark: "",
            fileName: "",
            fileId: ""
            }
        },
        contactForm: {
            rules: {
            name: [{ validator: checkNormal, trigger: "blur" }],
            phone: [{ validator: validatePhone, trigger: "blur" }],
            email: [{ validator: validateEmail, trigger: "blur" }]
            },
            data: {
            name: "",
            phone: "",
            email: ""
            }
        }
    };
  },
  computed: {
      totalPrice: function(){
          var price = 0;
          this.cncList.map(( cncItem ) => {
              price += cncItem.price*cncItem.quantity;
          })
          return price.toFixed(2);
      },
  },
  created() {

      var serviceId = this.$route.query.serviceId;
      this.serviceName = this.$route.query.serviceName;
      this.getServiceInfoById({serviceId:Number(serviceId)});  
      this.getWords();
  },

  filters: {
      fileUnitFilter: function( value, fileUnitList ) {
          var fileUnitName = '';
          fileUnitList.map(( item ) => {
              if ( item.id == value ) {
                  fileUnitName = item.name; 
              }
          }) 
          return fileUnitName;
      }
      
  },

  methods: {

    getWords(){
        var wordsStr = localStorage.getItem("words");
        var words = JSON.parse(wordsStr);
        this.fileUnitList = words[121].item;
    },

    handleStepDlgClose( done ) {
        done();
    },
    
    handleMaterialDlgClose( done ){
        done();
    },

    //
    beforeUpload1(file) {
        if (!/\.(stl|stp)$/.test(file.name)) {
            this.$error("只支持上传stl/stp格式的模型");
                return false;
        }
        if (file.size / 1024 / 2024 > 100) {
            this.$error("文件大小不能超过100M");
            return false;
        }
        this.showProccessBar = true;
    },
    onSuccess1(res, file, fileList){
      /*       var res = {
            attachFile:{
                width: '200',
                newFileName:'SBYANGNBI.rar',
                length:'300',
                fileId:129,
                surface:'400',
                thumbnailUrl:'http://sb.com',
                volume:'500',
                height:'600',
                orignFileName:'cube.stl'
            }, 
            message:'ok',
            code:200
        }  */  

        if ( res.code == 200 ) {
            this.currentCncItem = this.initCncItem(res.attachFile);
            this.cncList.push( this.currentCncItem );
            this.getPrice( this.currentCncItem );
        }
    },

    onProgress1(e, file, fileList) {
        var per = (e.loaded / e.total * 100).toFixed(2);
        this.proccessWidth = per + "%";
        if (per >= 100) {
            setTimeout(() => {
            this.showProccessBar = false;
            }, 500);
        }
    },

    beforeUpload2(file) {
        if (!/\.(stl|stp)$/.test(file.name)) {
            this.$error("只支持上传stl/stp格式的模型");
            return false;
        }
        if (file.size / 1024 / 2024 > 100) {
            this.$error("文件大小不能超过100M");
            return false;
        }
    },
    onSuccess2(res, file, fileList) {
        /*  var res = {
            attachFile:{
                width: '200',
                newFileName:'SBYANGNBI.rar',
                length:'300',
                fileId:129,
                surface:'400',
                thumbnailUrl:'http://sb.com',
                volume:'500',
                height:'600',
                orignFileName:'cube.stl'
            },
            message:'ok',
            code:200
        }     */
        if ( res.code == 200 ) {
            this.currentCncItem = this.initCncItem(res.attachFile);
            this.cncList.push( this.currentCncItem );
            console.log(this.currentCncItem);
            this.getPrice( this.currentCncItem );
        }
    },
    deleteModel(item, index) {
        this.cncList.splice(index,1);
    },

    //切换材质分类Tab
    handleMaterialCatalog( materialCatalog ) {
        this.materialRenderList.map(( mc ) => {
            mc.isActive = false;
        })
        materialCatalog.isActive = true;
    },

    selectMaterial( material ) {
        this.materialRenderList.map(( mc ) => {
            mc.materials.map(( ma ) => {
                ma.isSelected = false;
            })
        })
        material.isSelected = true;

    },

    selectTechniqueParam( cncItem ) {
        this.getPrice( cncItem );
    },

    selectFileUnit( cncItem ) {
        this.getPrice( cncItem );
    }, 

    confirmsSelectMaterial() {

        this.materialRenderList.map(( mc ) => {
            if ( mc.isActive ) {
                this.currentCncItem.material.catalogName = mc.catalogName;
                this.currentCncItem.material.catalogId = mc.id;
                mc.materials.map(( ma ) => {
                    if ( ma.isSelected ) {
                        this.currentCncItem.material.materialName = ma.materialName;
                        this.currentCncItem.material.materialId = ma.materialId;
                    }
                })
            }
        })

        //重置该材质下的步骤的参数选择
        this.stepRenderList.map(( stepItem ) => {

            var techniqueList = this.getTechniqueListByMaterial( this.currentCncItem, stepItem );
            this.setTechniqueRenderListDefaultActive( techniqueList );

            var stepObj = this.getStepValue( stepItem, techniqueList, this.currentCncItem );

            this.currentCncItem.stepList.map(( st, index ) => {
                if ( st.id == stepObj.id ) {
                    this.$set(this.currentCncItem.stepList, index, stepObj);
                }
            })
        })

        this.getPrice( this.currentCncItem );

        this.materialDlg.visible = false;
    },

    closeMaterialDlg() {
        this.materialDlg.visible = false;
    },

    openMaterialDlg( cncItem ) {
        this.currentCncItem = cncItem;
        this.materialRenderList.map(( mc ) => {
            if ( mc.id == cncItem.material.catalogId ) {
                mc.isActive = true;
            } else {
                mc.isActive = false;
            }
            mc.materials.map(( ma ) => {
                if ( ma.materialId == cncItem.material.materialId ) {
                    ma.isSelected = true;
                } else {
                    ma.isSelected = false;
                }
            })
        })
        console.log(this.materialRenderList);
        this.materialDlg.visible = true;
    },

    openStepDlg( cncItem, stepItem ) {

        this.currentCncItem = cncItem;
        this.currentStepItem = stepItem;

        this.stepRenderList.map(( step ) => {
            if ( step.id == stepItem.id ) {
                this.techniqueRenderList = this.getTechniqueListByMaterial(cncItem, step);
                this.setTechniqueRenderListDefaultActive( this.techniqueRenderList );
                this.techniqueRenderList.map(( technique ) => {
                    if ( technique.id == stepItem.techniqueId ) {
                        technique.isActive = true;
                    } else {
                        technique.isActive = false;
                    }

                    if ( 'consumableMaterialList' in technique ) {
                        technique.consumableMaterialList.map(( consume ) => {
                            if ( consume.id == stepItem.consumeCatalogId ) {
                                consume.isActive = true;
                            } else {
                                consume.isActive = false;
                            }

                            if ( 'materials' in consume ) {
                                consume.materials.map(( material ) => {
                                    if ( material.materialId == stepItem.material.materialId ) {
                                        material.isActive = true;
                                    } else {
                                        material.isActive = false;
                                    }
                                })
                            }
                        })
                    }
                })

                this.stepDlg.visible = true;
            }
        }) 
       
    },

    closeStepDlg() {
         this.stepDlg.visible = false;
    },

    reduceQuantity( cncItem ) {
        if ( cncItem.quantity >= 2 ) {
            cncItem.quantity--;
            this.getPrice( cncItem );
        }
    },

    changeQuantity( cncItem ) {
       if ( /^[0-9]+$/.test( cncItem.quantity ) ){
           cncItem.quantity = Number.parseInt(cncItem.quantity);
       } else {
           cncItem.quantity = 1;
       }
       this.getPrice( cncItem );
    },

    addQuantity( cncItem ) {
         cncItem.quantity++;
         this.getPrice( cncItem );
    },

    addToCart( isDisplay ) {
        var cartList = {cartItems:[], isDisplay:isDisplay};
        this.cncList.map(( cncItem ) => {
            var requestParams = {
                productId: this.serviceData.id,
                itemName: cncItem.attachFile.orignFileName,
                modelFileId: cncItem.attachFile.fileId,
                quantity: cncItem.quantity,
                fileUnit:cncItem.fileUnit,
                productParams:{
                    material:{
                        id: cncItem.material.materialId,
                        name:cncItem.material.materialName    
                    },
                    fileUnit: cncItem.fileUnit,
                    serviceName: this.serviceData.serviceName,
                    steps:cncItem.stepList
                },
            };
             //获取文件单位名称
            this.fileUnitList.map(( item ) => {
                if ( item.id == cncItem.fileUnit ) {
                    requestParams.productParams.fileUnit = item.name; 
                }
            })
            cartList.cartItems.push( requestParams );
            // console.log(cartList);
        })
        this.$http.post('custom/cart/add', cartList).then(( res ) => {
            if ( res.data.code == 200 ) {
                if ( isDisplay ) {
                    this.$router.push({path:'/buycar'});
                } else {
                    this.$router.push({path:'/produce-order', query:{ids: res.data.cartItemIds}});
                }
            }else{
                this.$error(res.data.message)
            }
        })
    },

    getPrice( cncItem ) {
        var requestParams = {
            productId: this.serviceData.id,
            itemName: cncItem.attachFile.orignFileName,
            modelFileId: cncItem.attachFile.fileId,
            quantity: cncItem.quantity,
            fileUnit:cncItem.fileUnit,
            productParams:{
            material:{
                    id: cncItem.material.materialId,
                    name:cncItem.material.materialName    
                },
                fileUnit: '',
                serviceName: this.serviceData.serviceName,
                steps:cncItem.stepList
            },
        };

        //获取文件单位名称
        this.fileUnitList.map(( item ) => {
            if ( item.id == cncItem.fileUnit ) {
                requestParams.productParams.fileUnit = item.name; 
            }
        }) 
        
        //获取第一步的工艺参数
        cncItem.stepList.map(( stepItem ) => {
            if ( stepItem.step == 1 ) {
                stepItem.techniqueParams = [];
                 if ( cncItem.techniqueParams.length > 0 ) {
                    cncItem.techniqueParams.map(( techniqueParam ) => {
                        var techniqueParamItem = {paramsId: techniqueParam.paramId, key: techniqueParam.techniqueParamName, value: techniqueParam.value };
                        stepItem.techniqueParams.push( techniqueParamItem );
                    })
                }
            }
        })

        // console.log('requestParams--', requestParams);

        this.$http.post('/custom/AutoOffer/getPrice', requestParams).then(( res ) => {
            if ( res.data.code == 200 ) {
                cncItem.price = res.data.data.price;
            }
        }) 

    },

    initCncItem( attachFile ) {
        var cncItem = {
            quantity:1, 
            fileUnit:140010,
            price:0, 
            attachFile: attachFile, 
            techniqueParams:[],
            material:{
                catalogName:'', 
                catalogId:'',
                materialName:'',
                materialId:''
            },
            stepList:[]
        };

        if ( this.materialRenderList.length > 0 ) {

            this.materialRenderList.map(( mc, mcIndex ) => {

                mc.materials.map(( ma, maIndex ) => {
                    ma.isSelected = false;
                })  

                if ( mcIndex == 0 ) {
                    mc.isActive = true;
                    cncItem.material.catalogName = mc.catalogName;
                    cncItem.material.catalogId = mc.id;
                    
                    mc.materials.map(( ma, maIndex ) => {
                    if ( maIndex == 0 ) {
                        ma.isSelected = true;
                        cncItem.material.materialName = ma.materialName;
                        cncItem.material.materialId = ma.materialId;
                    } 
                    })    
                } else {
                    mc.isActive = false;
                }  
            })
        }

        //获取步骤默认值
        this.stepRenderList.map(( stepItem ) => {

            var techniqueList = this.getTechniqueListByMaterial( cncItem, stepItem );
            this.setTechniqueRenderListDefaultActive(techniqueList);

            var stepObj = this.getStepValue( stepItem, techniqueList, cncItem );

            cncItem.stepList.push(stepObj);
        })

        return cncItem;
    },

    getStepValue( stepItem, techniqueList, cncItem ) {

        console.log('getStepValue stepItem --',stepItem);

            var stepObj = {
            id:stepItem.id, 
            step:stepItem.step, 
            stepName: stepItem.stepName, 
            techniqueId:'',
            techniqueName:'',
            consumeCatalogId:'',
            techniqueParams:[],
            material:{
                materialId:'',
                value:'',
                materialParams:[]
            }
        };

         if ( techniqueList.length > 0 ) {
            techniqueList.map(( technique ) => {
                if ( technique.isActive ) {
                    if ( stepItem.step == 1 ) {

                        if ( 'param' in technique ) {
                            cncItem.techniqueParams = [];
                            technique.param.map(( pa ) => {
                                var paramObj = {techniqueParamName:pa.techniqueParamName, paramId: pa.paramId, valueList:pa.valueList,value:''};
                                cncItem.techniqueParams.push( paramObj );
                            })
                        } else {
                            cncItem.techniqueParams = [];
                        }
                    } 
                    stepObj.techniqueName = technique.techniqueName;
                    stepObj.techniqueId = technique.id;
                    if ( 'consumableMaterialList' in technique) {
                        technique.consumableMaterialList.map(( consumeType ) => {
                            if ( consumeType.isActive ) {
                                stepObj.consumeCatalogId = consumeType.id;
                                if ( 'materials' in consumeType ) {
                                    consumeType.materials.map(( material ) => {
                                        if ( material.isActive ) {
                                            stepObj.material.materialId = material.materialId;
                                            stepObj.material.value = material.materialName;
                                            if ( 'param' in material ) {
                                                material.param.map(( p ) => {
                                                    var paramObj = {paramsId: p.paramId, key: p.materialParamName, value: p.defaultValue};
                                                    stepObj.material.materialParams.push( paramObj );
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }

        return stepObj;

    },

    //确认选择步骤相关参数
    confirmHandleStep() {

        var techniqueList = this.techniqueRenderList; 

        var stepObj = this.getStepValue(this.currentStepItem, techniqueList, this.currentCncItem );

        this.currentCncItem.stepList.map(( st, index ) => {
            if ( st.id == stepObj.id ) {
                this.$set(this.currentCncItem.stepList, index, stepObj);
            }
        })

        this.getPrice( this.currentCncItem );

        this.stepDlg.visible = false;
    },

    //根据材质获取某一步骤中支持的工艺集合
    getTechniqueListByMaterial( cncItem, stepItem ) {

        var techniqueList = [];

        if ( 'techniqueList' in stepItem ) {
            stepItem.techniqueList.map(( technique ) => {
                if ( 'processMaterialList' in technique ) {
                    technique.processMaterialList.map(( processMaterial ) => {
                        if ( 'materials' in processMaterial ) {
                            processMaterial.materials.map(( ma ) => {
                                if ( ma.materialId == cncItem.material.materialId ) {
                                    techniqueList.push(technique);
                                }
                            })
                        }
                    })
                }
            })
        } 
        return techniqueList;
    },

    //设置默认选中步骤中的第一项工艺及耗材
    setTechniqueRenderListDefaultActive( techniqueList ) {
        techniqueList.map(( technique, techniqueIndex ) => {
            this.$set( technique, 'isActive', false );
            if ( 'consumableMaterialList' in technique ) {
                technique.consumableMaterialList.map(( consumableMaterial, conIndex ) => {
                    this.$set( consumableMaterial, 'isActive', false );
                    if ( 'materials' in consumableMaterial ) {
                        consumableMaterial.materials.map(( material, materialIndex ) => {
                            this.$set( material, 'isActive', false );
                        })
                    } 
                })
            }
        })

         techniqueList.map(( technique, techniqueIndex ) => {
            if ( techniqueIndex == 0 ) {
                this.$set( technique, 'isActive', true );
                if ( 'consumableMaterialList' in technique ) {
                    technique.consumableMaterialList.map(( consumableMaterial, conIndex ) => {
                        if ( conIndex == 0 ) {
                            this.$set( consumableMaterial, 'isActive', true );
                            if ( 'materials' in consumableMaterial ) {
                                consumableMaterial.materials.map(( material, materialIndex ) => {
                                    if ( materialIndex == 0 ) {
                                        this.$set( material, 'isActive', true );
                                    } else {
                                        this.$set( material, 'isActive', false );
                                    }
                                })
                            } 
                        } 
                    })
                }
            } 
        })
        return techniqueList; 
    },

    //选择耗材分类
    handleConsumeCatalog( consume, consumeList ) {
        console.log(consumeList);
        consumeList.map(( con ) => {
            con.isActive = false;
             if ( 'materials' in con ) {
                con.materials.map(( material, materialIndex ) => {
                    material.isActive = false;
                })
            } 
        })
         consumeList.map(( con ) => {
           con.isActive = false;
            if ( 'materials' in con ) {
                con.materials.map(( material, materialIndex ) => {
                    if ( materialIndex == 0 ) {
                        material.isActive = true;
                    } else {
                        material.isActive = false;
                    }
                })
            } 
        })
        consume.isActive = true;
    },

    //选择耗材
    selectConsumeMaterial( material, materialList ) {

        materialList.map(( material, materialIndex ) => {
            material.isActive = false;
        })
        material.isActive = true;
    },

    //选择工艺
    selectTechnique( technique ) {
        this.techniqueRenderList.map(( te ) => {
            te.isActive = false;
            if ( 'consumableMaterialList' in te ) {
                te.consumableMaterialList.map(( consumableMaterial, conIndex ) => {
                    consumableMaterial.isActive = false;
                    if ( 'materials' in consumableMaterial ) {
                        consumableMaterial.materials.map(( material, materialIndex ) => {
                            material.isActive = false;
                        })
                    } 
                })
            }
        })
        this.techniqueRenderList.map(( te ) => {
            te.isActive = false;
            if ( 'consumableMaterialList' in te ) {
                te.consumableMaterialList.map(( consumableMaterial, conIndex ) => {
                    if ( conIndex == 0 ) {
                        consumableMaterial.isActive = true;
                        if ( 'materials' in consumableMaterial ) {
                            consumableMaterial.materials.map(( material, materialIndex ) => {
                                if ( materialIndex == 0 ) {
                                    material.isActive = true;
                                } 
                            })
                        } 
                    }
                })
            }
        })
        technique.isActive = true;
    },


    getServiceInfoById( params ) {
        this.$http.post('/custom/service/getProcedureListAndTechnique', params).then((res) => {
            if ( res.data.code == 200 ) {
                var defaultMaterial = null;
                if ('materialQuality' in res.data.data) {
                    this.materialRenderList = res.data.data.materialQuality;
                    this.materialRenderList.map(( materialCatalog, index ) => {
                        this.$set(materialCatalog, 'isActive', false);
                            if ( 'materials' in materialCatalog ) {
                            materialCatalog.materials.map(( material, materialIndex ) => {
                                this.$set( material, 'isSelected', false );
                            })
                        }
                    })
                    this.materialRenderList.map(( materialCatalog, index ) => {
                        if ( index == 0 ){
                            this.$set(materialCatalog, 'isActive', true);
                            if ( 'materials' in materialCatalog ) {
                                materialCatalog.materials.map(( material, materialIndex ) => {
                                    if ( materialIndex == 0 ) {
                                        this.$set( material, 'isSelected', true );
                                    } 
                                })
                            }
                        }    
                    })
                }
                if ( 'procedureList' in res.data.data ) {
                    this.stepRenderList = res.data.data.procedureList;
                }
                if ( 'serviceData' in res.data.data ) {
                    this.serviceData = res.data.data.serviceData;
                }
                if ( this.$route.params.attachFile ) {
                    this.currentCncItem = this.initCncItem(this.$route.params.attachFile);
                    this.cncList.push( this.currentCncItem );
                    console.log(this.currentCncItem);
                    this.getPrice( this.currentCncItem );
                }
            }
        })
    },

    //人工报价

    submitForms(){
        var uploadFormValid = false;
        var contactFormValid = false;
        this.$refs['uploadForm'].validate((valid) => {
          if(valid) {
            uploadFormValid = true;
          } else {
            return false;
          }
        })
        this.$refs['contactForm'].validate((valid) => {
          if(valid) {
            contactFormValid = true;
          } else {
            return false;
          }
        })
        if (uploadFormValid && contactFormValid) {
          var requestParams = {
            requirementType:this.uploadForm.data.type.toString(),
            attaFileId:this.uploadForm.data.fileId,
            fileName: this.uploadForm.data.fileName,
            description:this.uploadForm.data.remark,
            contactName:this.contactForm.data.name,
            contactPhone:this.contactForm.data.phone,
            contactEmail:this.contactForm.data.email,
          };
          this.$http.post('/custom/requirement/add', requestParams).then((res) =>{
            if(res.data.code==200) {
              this.$message({type:'success',message:'需求提交成功'});
              this.$router.push({path:'/usercenter/my-require'});
            } else {
              this.$message({type:'error',message:res.data.message});
            }
          })
        }
    },
    beforeUpload3(file){
        if(!/\.(rar|zip)$/.test(file.name)) {
          this.$error('只支持zip/rar文件格式');
          return false;
        }
        if(file.size/1024/2024 > 100) {
          this.$error('文件大小不能超过100M');
          return false;
        }
    },
    onSuccess3(res, file, fileList) {
        console.log(res);
        this.uploadForm.data.fileList=fileList;
        if (res.code == 200) {
          this.uploadForm.data.fileId = res.attachFile.id;
          this.uploadForm.data.fileName = res.attachFile.fileName;
        }
    },
    handleRemove3() {
        this.uploadForm.data.fileList = [];
    }
     
  }
};
</script>
<style lang="less" scoped>
.cursor-pointer{
    cursor: pointer;
}
.disabled{
    background: #f5f5f5;
    cursor: not-allowed !important;
}
.auto-quotation {
  padding-top: 80px;
  padding-bottom: 110px;
  .content {
    width: 1200px;
    margin: 0 auto;
  }
  .go-on-upload{
      span{
          color: #3f8def !important;
      }
  }
  .cnc-title {
    .text {
      display: inline-block;
      height: 40px;
      font-size: 32px;
      color: #3f8def;
      line-height: 40px;
      font-weight: 700;
    }
    .btn {
      display: inline-block;
      margin-left: 10px;
      float: right;
    }
  }
  .cnc-info {
    .cnc-info-item {
      margin-top: 20px;
      .left {
        display: inline-block;
        float: left;
        width: 257px;
        height: 257px;
        border: 1px solid #e2e2e2;
        box-sizing: border-box;
        img{
            display: block;
            width: 100%;
            height: 100%;
        }
        .prompt-info {
          line-height: 24px;
          text-align: center;
          color: #acabab;
        }
        .file-type-info {
          margin-top: 14px;
        }
        .proccess-bar {
          width: 150px;
          height: 10px;
          background: #fff;
          border-radius: 4px;
          border: 1px solid #3f8def;
          opacity: 0.8;
          margin: auto;
          margin-top: 15px;
          .proccess-bar-inner {
            width: 0;
            height: 100%;
            background: #3f8def;
            border-radius: 4px;
          }
        }
      }
      .right {
        display: inline-block;
        margin-left: 10px;
        width: 933px;
        height: 257px;
        //  border: 1px solid #e2e2e2;
        border-bottom: none;
        .cnc-table {
          border: 1px solid #e2e2e2;
          thead {
            th {
              height: 46px;
              text-align: center;
              vertical-align: middle;
              font-weight: 500;
              color: #333;
              border-bottom: 1px solid #e2e2e2;
              background: #f5f5f5;
            }
            .th-1 {
              width: 280px;
            }
            .th-2 {
              width: 260px;
            }
            .th-3 {
              width: 100px;
            }
            .th-4 {
              width: 135px;
            }
            .th-5 {
              width: 96px;
            }
            .th-6 {
              width: 60px;
            }
          }
          tbody {
            td {
              height: 208px;
              text-align: center;
              vertical-align: middle;
              color: #65656e;
              padding: 0 10px;
              .td-info-item {
                display: flex;
                text-align: left;
                color: #65656e;
                line-height: 32px;
                .select-item {
                  flex: 1;
                }
                sup{
                    font-size: x-small;
                    line-height: 20px;
                }
                .def-select{
                    border: 1px solid #e2e2e2;
                    height: 28px;
                    box-sizing: border-box;
                    text-indent: 14px;
                    line-height: 28px;
                    cursor: pointer;
                }
              }
            }
            .th-2 {
              .td-info-item {
                margin-bottom: 7px;
              }
            }
            .th-4 {
              .td-box {
                display: flex;
                border: 1px solid #e2e2e2;
                .sub-btn,.add-btn {
                  width: 30px;
                  height: 28px;
                  line-height: 28px;
                  text-align: center;
                  cursor: pointer;
                }
                input {
                  border: none;
                  border-left: 1px solid #e2e2e2;
                  border-right: 1px solid #e2e2e2;
                  width: 60px;
                  height: 28px;
                  text-align: center;
                  color: #65656e;
                }
              }
            }
            .th-6 {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
  .footer-btn {
    height: 42px;
    margin-top: 15px;
    .fl-right {
      float: right;
      div {
        display: inline-block;
        line-height: 42px;
        color: #65656e;
      }
      .total-amount {
        color: #f84b4b;
      }
      .add-to-cart-btn,
      .buy-now-btn {
        width: 136px;
        height: 42px;
        font-size: 18px;
        margin-left: 12px;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
      }
      .add-to-cart-btn {
        color: #3f8def;
        border: 1px solid #3f8def;
      }
      .buy-now-btn {
        color: #fff;
        border: 1px solid #f84b4b;
        background: #f84b4b;
      }
    }
  }

  .artificical-quotation{
      position: relative;
      margin-top: 100px;
      .title{
          font-size: 16px;
          margin-bottom: 20px;
          &::before{
              content: '';
              position: absolute;
              top: 3px;
              width: 4px;
              height: 18px;
              background: #3f8def;
          }
          span{
              margin-left: 10px;
          }
      }
      .btn-box{
          display: flex;
          align-items: center;
      }
      .desc{
          margin-left: 12px;
      }
      .btn{
          width: 150px;
          height: 35px;
          text-align: center;
          line-height: 35px;
          border: 1px solid #3f8def;
          border-radius: 4px;
          background: #3f8def;
          color: #fff;
          cursor: pointer;
      }
  }

  .cnc-material-dlg{
      .def-dlg-title{
          height: 70px;
          .tab-item{
              display: inline-block;
              width: 106px;
              height: 68px;
              line-height: 70px;
              font-size: 18px;
              text-align: center;
              cursor: pointer;
          }
          .tab-item-active{
            border-bottom: 4px solid #3f8def;
          }
      }
      .dlg-content{
          padding: 20px 20px 0 20px;
          .material-item{
              display: inline-block;
              width: 198px;
              height: 318px;
              padding: 8px 8px 0;
              box-sizing: border-box;
              border: 1px solid #e2e2e2;
              margin: 0 20px 20px 0;
              cursor: pointer;
              img{
                  display: block;
                  width: 180px;
                  height: 180px;
              }
              .name{
                  font-size: 16px;
                  font-weight: 700;
                  margin-top: 4px;
              }
              .desc{
                  display: -webkit-box;
                  line-height: 22px;
                  height: 66px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  -webkit-line-clamp: 3;
                  height: 66px;
              }
              .detail-link{
                  text-align: right;
                  color: #3f8def;
                  margin-top: 6px;
              }
          }
          .material-item-active{
              border: 2px solid #3f8def;
          }
      }
  }
  
  .cnc-step-dlg{
    .dlg-content{
        .content-row{
            display: flex;
            border-bottom: 1px solid #e2e2e2;
            .lf-title{
                display: flex;
                align-items: center;
                width: 52px;
                padding: 19px;
                line-height: 20px;
                box-sizing: border-box;
                border-right: 1px solid #e2e2e2;
            }
            .rg-content{
                display: inline-block;
                padding: 20px 20px 0;
                max-height: 276px;
                overflow-y: auto;
                .card-item{
                    display: inline-block;
                    width: 120px;
                    height: 120px;
                    box-sizing: border-box;
                    margin: 0 20px 18px 0;
                    cursor: pointer;
                    img{
                        display: block;
                        width: 85px;
                        height: 85px;
                        margin: 7px auto;
                    }
                    p{
                        height: 14px;
                        line-height: 14px;
                        text-align: center;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .card-item-active{
                    border: 2px solid #3f8def;
                }
                .card-item:nth-child(6n) {
                    margin-right: 0px !important;
                }
            }
            .consume-rg-content{
                padding: 14px 0 5px 0px;
                width: 877px;
                max-height: 400px;
                overflow: hidden;
                .tab{
                     display: inline-block;
                //    justify-content: space-around;
                //    width: 184px; 
                    height: 36px;
                    padding: 0 6px;
                    box-sizing: border-box;
                    background: #efefef;
                    margin-bottom: 20px;
                    margin-left:20px;
                    span{
                        display: inline-block;
                        width: 68px;
                        height: 34px;
                        line-height: 36px;
                        text-align: center;
                        cursor: pointer;
                    }
                    .consume-tab-active{
                        border-bottom: 2px solid #3f8def;
                    }
                }
                .consume-list{
             //       margin-left:20px;
                    max-height: 276px;
                    overflow-y: auto;
                    .card-item{
                        margin-left:20px;
                    }
                    .params-box{
                        padding-left: 20px;
                    }
                }
                .params-box{
                    border-top: 1px solid #e2e2e2;
                    padding: 18px 20px 3px 0px;
                    .params-item{
                        display: inline-block;
                        margin: 0 10px 10px 0;
                    }
                }
            }
        }
    }
  }

}
</style>
