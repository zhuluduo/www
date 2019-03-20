<template>
    <div id="Combined-Info">
        <div class="box">
            <div class="operationBox">
                <el-button type='primary' @click="operationSavaData" v-if="isEdit">保存核价单</el-button>
                <el-button type='primary' @click="operationEditData" v-if="!isEdit">编辑核价单</el-button>
                <el-button plain @click="printBtn('Combined-Info-print')" v-if="!isEdit">打印核价单</el-button>
            </div>
            <div id="Combined-Info-print">
                <div id="Combined-Info-print-Content">
                    <div class="Combined-Info-Title">核价单</div>
                    <table align="center">
                        <thead style="display: table-header-group;">
                            <tr>
                                <td rowspan="2" width='40'>序号</td>
                                <td colspan="6">零件基本信息</td>
                                <td colspan="4">材料成本信息</td>
                                <td width='80' v-for="(item,index) in supplierArray" :key="item.id">供应商{{indexLetter[index]}}</td>
                                <td rowspan="2" width='60'>系统最低单价</td>
                                <td rowspan="2" width='60'>最低单价供应商</td>
                                <td rowspan="2" width='60'>确定核入单价</td>
                                <td rowspan="2" width='40'>价格比例</td>
                                <td rowspan="2" width='60'>确定供应商</td>
                                <td rowspan="2" width='60'>核价类型</td>
                                <td rowspan="2" width='50'>价格说明</td>
                                <td rowspan="2" width='50'>备注</td>
                            </tr>  
                            <tr>
                                <td width='60'>零件编号</td>
                                <td width='60'>零件名称</td>
                                <td >图号</td>
                                <td >版本</td>
                                <td >数量</td>
                                <td>单位</td>
                                <td  width='50'>材料</td>
                                <td width='50' >市场单价</td>
                                <td width='40'>材料重量</td>
                                <td width='40'>材料价值</td>
                                <td v-for="item in supplierArray" :key="item.id">{{item.companyName}}</td>
                            </tr>  
                        </thead>
                        <tbody style="text-align: center">
                            <tr v-for="(ele,index) in tableData.items" :key="index">
                                <td>{{index+1}}</td>
                                <td>
                                    {{ele.list[0].itemNo}}
                                </td>
                                <td>{{ele.list[0].itemName}}</td>
                                <td>{{ele.list[0].photoNo}}</td>
                                <td>{{ele.list[0].version}}</td>
                                <td>{{ele.list[0].estimateCount}}</td>
                                <td>{{ele.list[0].unit}}</td>
                                <td>{{ele.list[0].materialInfo.material}}</td>
                                <td>{{ele.list[0].materialInfo.weight*ele.list[0].materialInfo.singlePrice}}</td>
                                <td>{{ele.list[0].materialInfo.weight}}</td>
                                <td>{{ele.list[0].materialInfo.singlePrice}}</td>
                                <td v-for="(item,index) in supplierArray" :key="item.id">
                                    <div v-for="itemIner in ele.list[0].requirementPriceItems" v-if="itemIner.companyId==item.id" :key="itemIner.id">
                                        <div class="conpanyInfo" :class="{'conpanyInfoSave':!isEdit}">
                                            <div>{{itemIner.priceInfo.price}}</div>
                                            <div class="innerOpera" v-if="isEdit" @click="Selection(ele.itemId,itemIner.id,index)" >
                                                {{itemIner.isSelected?'取消':'使用'}}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <el-input v-if="isEdit" v-model="ele.minPrice"></el-input>
                                    <div v-else>{{ele.minPrice}}</div>
                                </td>
                                <td>
                                    <el-input v-if="isEdit" v-model="ele.minPriceSupplier"></el-input>
                                    <div v-else>{{ele.minPriceSupplier}}</div>
                                </td>
                                <td> 
                                    <span v-for="item in supplierArray" :key="item.id">
                                        <span v-for="itemIner in ele.list[0].requirementPriceItems" v-if="itemIner.companyId==item.id&&itemIner.isSelected" :key="itemIner.id">
                                        {{itemIner.priceInfo.price}}
                                        </span>
                                    </span>
                                </td>
                                <td>{{getPriceRate[index]}}</td>
                                <td> 
                                    <span v-for="(item,index) in supplierArray" :key="item.id">
                                        <span v-for="itemIner in ele.list[0].requirementPriceItems" v-if="itemIner.companyId==item.id&&itemIner.isSelected" :key="itemIner.id">
                                        {{indexLetter[index]}}
                                        </span>
                                    </span>
                                </td>
                                <td> 
                                    <el-select v-model="ele.comparisonType" :disabled='!isEdit'>
                                        <el-option
                                        v-for="item in comparisonType"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td>
                                    <el-input v-model="ele.rationalityExplain" v-if="isEdit"></el-input>
                                    <div v-else>{{ele.rationalityExplain}}</div>
                                </td>
                                <td>
                                    <el-input v-model="ele.remark" v-if="isEdit"></el-input>
                                    <div  v-else>{{ele.remark}}</div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot style="display: table-footer-group;"  align="left" v-if="!isEdit">
                            <tr>
                                <td colspan="7">采购员(工程师）制定/日期：</td>                     
                                <td colspan="6">CEG主管审核/日期：</td>                     
                                <td colspan="5">采购经理审核/日期：</td>                     
                                <td colspan="6">采购分管负责人审核/日期：</td>                     
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var letter=["A","B","C",'D','E','F','G','H','I'];
import {print} from '../lib/GeneralTools.js';
export default {
    data(){
        return{
            tableData:[],
            options:[],
            input:'',
            value:"",
            isEdit:false,
            indexLetter:[],
            supplierArray:[],
            comparisonType:this.$LocalStorage.getWords(159),
        }
    },
    created() {
        let id = Number(this.$route.query.id);
        this.getList(id);
        this.indexLetter=letter;
    },
    mounted() {
      
    },
    computed:{
         getPriceRate() {
            let priceRateArray = [];
            this.tableData.items.forEach(ele=>{
                let priceRate =null;
                if(ele.SelectionMinPrice&&ele.minPrice&&ele.minPrice!=0){
                    let rate =(ele.SelectionMinPrice-ele.minPrice)/ele.minPrice
                    priceRate = Math.floor(rate*100) +'%'
                    
                }else{
                    priceRate ="-";
                }
                priceRateArray.push(priceRate)
            })
            return priceRateArray;
        },
    },
    methods: {
        async getList(id){
            let res = await this.$http.post('/custom/comparison/get',{'id':id})
            this.tableData=res.data.data;
            //标示判断是否被编辑;
            let flag = false;
            res.data.data.items.forEach(ele=>{
                if(!ele.minPrice&&!ele.minPriceSupplier&&!ele.rationalityExplain&&!ele.comparisonType&&!ele.choicePriceItemIds){
                    flag = true;
                }
                if(!ele.minPrice){
                    this.$set(ele,'minPrice',null);
                }
                if(!ele.minPriceSupplier){
                    this.$set(ele,'minPriceSupplier',null);
                }
                if(!ele.rationalityExplain){
                    this.$set(ele,'rationalityExplain',null);
                    ele.rationalityExplain=null;
                }
                if(!ele.comparisonType){
                    this.$set(ele,'comparisonType',null);
                }
                if(!ele.remark){
                    this.$set(ele,'remark',null);
                }
                if(!ele.choicePriceItemIds){
                    this.$set(ele,'choicePriceItemIds',[]);
                }
                if(!ele.SelectionMinPrice){
                    this.$set(ele,'SelectionMinPrice',null);
                }
            })
            this.isEdit = flag;
            this.getSupplierAll(this.tableData);
        },
        getSupplierAll(){
            let getSupplierAll = [];
            //获取所有报价的公司；
            this.tableData.items.forEach((ele)=>{
                ele.companyList.forEach(item => {
                    item = JSON.stringify(item)
                    getSupplierAll.push(item)  
                })
                //价格是否被使用；
                ele.list[0].requirementPriceItems.forEach((item)=>{
                    this.$set(item,'isSelected',false);
                    ele.choicePriceItemIds.forEach((userId)=>{
                        if(userId==item.id){
                            this.$set(item,'isSelected',true);
                        }
                    })
                })
         
            }) 
            //数组去重；
            let SupplierArray = Array.from(new Set(getSupplierAll))
            SupplierArray.forEach(ele =>{
                ele = JSON.parse(ele)
                this.supplierArray.push(ele)
            })
            this.SelectionMinPrice()
        },
        //是否被使用；
        Selection(outerId,InnerId){
            this.tableData.items.forEach((ele)=>{
                if(ele.itemId==outerId){
                    let choicePriceItemIds=[];
                    ele.list[0].requirementPriceItems.forEach((item)=>{
                        if(item.id==InnerId){
                            item.isSelected=!item.isSelected;
                        }
                    })
                }
            })
            this.SelectionMinPrice()
           
        },
        //选择最低的商品价格
        SelectionMinPrice(){
            this.tableData.items.forEach((ele)=>{
                let SelectionMinPrice=null;
                let choicePriceItemIds=[];
                ele.list[0].requirementPriceItems.forEach((item)=>{
                    if(item.isSelected){
                        choicePriceItemIds.push(item.id)
                        if(SelectionMinPrice){
                            SelectionMinPrice = SelectionMinPrice-item.priceInfo.price>0?item.priceInfo.price:SelectionMinPrice;
                        }else{
                            SelectionMinPrice = item.priceInfo.price;
                        }
                    }
                })
                ele.choicePriceItemIds=choicePriceItemIds;
                ele.SelectionMinPrice=SelectionMinPrice;
            }) 
        },
        operationSavaData(){
            let parseData={};
            let itemsArray=[];
            this.tableData.items.forEach(ele=>{
                let itemObj={};
                itemObj.id=ele.itemId;
                itemObj.minPrice=Number(ele.minPrice); 
                itemObj.minPriceSupplier=ele.minPriceSupplier; 
                itemObj.choicePriceItemIds=ele.choicePriceItemIds; 
                itemObj.comparisonType=ele.comparisonType; 
                itemObj.rationalityExplain=ele.rationalityExplain; 
                itemObj.remark=ele.remark; 
                itemsArray.push(itemObj)
            })
            parseData.id=this.tableData.id;
            parseData.items=itemsArray;
            this.saveCombinedAPI(parseData)
        },
        async saveCombinedAPI(parseData){
            let res = await this.$http.post('custom/comparison/edit',parseData)
            if(res.data.code==200){
                this.isEdit = false;
                this.$success(res.data.message)
            }else{
                this.$error('请填写完整信息，方可保存')
            }
        },
        operationEditData(){
            this.isEdit = true;
        },
        printBtn(name){
            print(name)
        },
    },
}
</script>
<style lang="less"  media="print">
#Combined-Info-print-Content{
    .Combined-Info-Title{
        font-size: 16px;
        font-weight: bold;
        padding: 16px 0;
    }
    text-align: center;
    table{
        word-wrap: break-word;
        word-break: break-all;
        margin: 0 auto;
        thead{
            td{

            }
        }
    }
    td{
        vertical-align: middle;
        font-size: 12px;
        padding: 3px; 
        border: 1px solid #efefef;
    }
    tbody{
        .conpanyInfo{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .innerOpera{
                width: 30px;
                margin-left:4px; 
                border: 1px solid #e2e2e2;
                border-radius: 2px;
                cursor: pointer;
            }
        }
        .conpanyInfoSave{
            justify-content:center;
        }  
    }
}
</style>

<style lang="less" scoped>
   #Combined-Info{
        padding: 20px 0 40px 0;
        background-color: #fff;
       .box{
           width: 1200px;
           margin: 0 auto;
           text-align: center;
           line-height: 24px;
           .operationBox{
                display: flex;
                justify-content: flex-end;
                margin-bottom:-48px; 
           }
       }
   }
</style>
