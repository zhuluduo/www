<template>
    <div id="to-quotation">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">询盘</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/index'})">我的报价</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">去报价</span>
            </div>
            <div class="require-number clearfix">
                <div class="number">需求编号：{{data.requirement?data.requirement.requirementNo:''}}</div>
                <div class="state">{{data.requirement?data.requirement.requirementStatusStr:''}}</div>
                <!-- <div class="modify-btn btn" @click="submit" v-if="data.acceptStatus==450010&&data.requirement.requirementStatus==107020&&data.offerStatus==210020">修改报价</div> -->
            </div>
            <div class="content-item">
                <div class="title">零件报价<span style="color:#a09f9f">（零件报价信息必须填写，如果某个零件不参与报价请勾选零件右侧的“不报价”）</span></div>
                <div class="content-item-box part-info-box">
                    <el-form :model="data" :rules="tableRules" ref="tableForm">
                        <table class="part-table" v-if="data.requirement&&data.requirement.priceTemplate==490010">
                            <thead>
                                <tr>
                                    <td width="142px">零件编号</td>
                                    <td width="148px">零件名称</td>
                                    <td width="132px">数量</td>
                                    <td width="170px">最小接单量</td>
                                    <td width="216px">报价阶梯</td>
                                    <td width="276px">报价</td>
                                    <td width="146px">不报价</td>
                                </tr>
                            </thead>
                            <tbody v-for="(item,index) in data.requirementPriceItems" :key="'tbody' + index" :ref="'requirementItem'+index" v-if="item.isLadderPrice">
                                <tr>
                                    <td>{{item.itemNo||'-'}}</td>
                                    <td>{{item.itemName}}</td>
                                    <td>{{item.estimateCount}}</td>
                                    <td>
                                        <el-form-item :show-message="false" prop="number">
                                            <el-input v-model="item.defMaterial" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defMinCount.showErrorMsg}" v-model="item.defMinCount.value" @blur="validate($event, /^[0-9]+$/, item.defMinCount)"
                                            :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defMinCount)" maxlength="9" type="text" class="input-item" placeholder=""> -->
                                    </td>
                                    <td class="td-with-bt-border">{{item.priceInfo[0].from}}-{{item.priceInfo[0].to}}</td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input v-model="item.price1" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.price1.showErrorMsg}" v-model="item.price1.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price1)"
                                            :disabled="item.isAbandon||data.acceptStatus!=450010||data.requirement.requirementStatus!=107020"
                                            @input="validate($event, /^[0-9]+$/, item.price1)" maxlength="9" type="text" class="input-item" placeholder=""> -->
                                        <span>￥件</span>
                                    </td>
                                    <td><el-checkbox :disabled="data.acceptStatus!=450010||data.requirement.requirementStatus!=107020" v-model="item.isAbandon">不报价</el-checkbox></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="td-with-bt-border">{{item.priceInfo[1].from}}-{{item.priceInfo[1].to}}</td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input v-model="item.price2" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.price2.showErrorMsg}" v-model="item.price2.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price2)" :disabled="item.isAbandon||data.acceptStatus!=450010||data.requirement.requirementStatus!=107020"
                                            @input="validate($event, /^[0-9]+$/, item.price2)" maxlength="9" type="text" class="input-item" placeholder=""> -->
                                        <span>￥件</span>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="td-with-bt-border">>{{item.priceInfo[2].from}}</td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input v-model="item.price3" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.price3.showErrorMsg}" v-model="item.price3.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.price3)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.price3)" maxlength="9" type="text" class="input-item" placeholder=""> -->
                                        <span>￥件</span>
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody v-else :key="'tbody' + index" :ref="'requirementItem'+index">
                                <tr>
                                    <td>{{item.itemNo||'-'}}</td>
                                    <td>{{item.itemName}}</td>
                                    <td>{{item.estimateCount}}</td>
                                    <td>
                                        <el-form-item prop="number" :show-message="false">
                                            <el-input v-model="item.defMinCount" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defMinCount.showErrorMsg}" v-model="item.defMinCount.value" @blur="validate($event, /^[0-9]+$/, item.defMinCount)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defMinCount)" maxlength="9" type="text" class="input-item" placeholder=""> -->
                                    </td>
                                    <td class="td-with-bt-border">-</td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input v-model="item.defSinglePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defSinglePrice.showErrorMsg}" v-model="item.defSinglePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/, item.defSinglePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defSinglePrice)" maxlength="9" type="text" class="input-item" placeholder=""> -->
                                        <span>￥件</span>
                                    </td>
                                    <td><el-checkbox :disabled="data.acceptStatus!=450010||data.requirement.requirementStatus!=107020" v-model="item.isAbandon">不报价</el-checkbox></td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- 专业版 -->
                        <table v-else class="part-table">
                            <thead>
                                <tr>
                                    <td width="134px" :rowspan="2">零件编号</td>
                                    <td width="110px" :rowspan="2">零件名称</td>
                                    <td width="66px" :rowspan="2">数量</td>
                                    <td width="134px" :rowspan="2">图号</td>
                                    <td width="85px" :rowspan="2">材料</td>
                                    <td width="80px" class="td-with-rg-border" :rowspan="2">报价阶梯</td>
                                    <td width="160px" class="td-with-bt-border" style="height:28px;" :colspan="3">材料费</td>
                                    <td width="160px" class="td-with-bt-border td-with-lf-border" style="height:28px;" :colspan="3">加工费</td>
                                    <td width="87px" class="td-with-lf-border" :rowspan="2">综合管理费</td>
                                    <td width="87px" :rowspan="2">总单价</td>
                                    <td width="93px" :rowspan="2">不报价</td>
                                </tr>
                                <tr>
                                    <td width="54px">材料重量(kg)</td>
                                    <td width="54px">材料单价(元/kg)</td>
                                    <td width="54px">加工时间(秒)</td>
                                    <td width="54px" class="td-with-lf-border">加工单价(元/h)</td>
                                    <td width="54px">加工费(元)</td>
                                    <td width="54px">所占单价总比重</td>
                                </tr>
                            </thead>
                            <tbody v-for="(item,index) in data.requirementPriceItems" :key="'tbody' + index" :ref="'requirementItem'+index" v-if="item.isLadderPrice">
                                <tr>
                                    <td>{{item.itemNo||'-'}}</td>
                                    <td>{{item.itemName}}</td>
                                    <td>{{item.estimateCount}}</td>
                                    <td>-</td>
                                    <td>
                                        <el-form-item prop="notEmpty" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defMaterial" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defMaterial.showErrorMsg}" v-model="item.defMaterial.value" @blur="validate($event, /^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/,
                                            item.defMaterial)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/, item.defMaterial)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-rg-border">0-2000</td>

                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice1.weight" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice1.weight.showErrorMsg}" v-model="item.materialPrice1.weight.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice1.weight)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice1.weight)" maxlength="9" class="input-item wd-32" type="text"> --></td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice1.singlePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                       <!--  <input :class="{'red-border': item.materialPrice1.singlePrice.showErrorMsg}" v-model="item.materialPrice1.singlePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice1.singlePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice1.singlePrice)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="nummber" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice1.processingTime" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice1.processingTime.showErrorMsg}" v-model="item.materialPrice1.processingTime.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice1.processingTime)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice1.processingTime)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border td-with-lf-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice1.singlePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice1.singlePrice.showErrorMsg}" v-model="item.processPrice1.singlePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice1.singlePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice1.singlePrice)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice1.price" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice1.price.showErrorMsg}" v-model="item.processPrice1.price.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice1.price)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice1.price)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice1.rate" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice1.rate.showErrorMsg}" v-model="item.processPrice1.rate.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice1.rate)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice1.rate)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>

                                    <td class="td-with-bt-border td-with-lf-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defManagementPrice1" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defManagementPrice1.showErrorMsg}" v-model="item.defManagementPrice1.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.defManagementPrice1)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defManagementPrice1)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defPrice1" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defPrice1.showErrorMsg}" v-model="item.defPrice1.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.defPrice1)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defPrice1)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border"><el-checkbox :disabled="data.acceptStatus!=450010||data.requirement.requirementStatus!=107020" v-model="item.isAbandon">不报价</el-checkbox></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="td-with-rg-border">0-2000</td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice2.weight" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice2.weight.showErrorMsg}" v-model="item.materialPrice2.weight.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice2.weight)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice2.weight)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice2.singlePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice2.singlePrice.showErrorMsg}" v-model="item.materialPrice2.singlePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice2.singlePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice2.singlePrice)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice2.processingTime" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice2.processingTime.showErrorMsg}" v-model="item.materialPrice2.processingTime.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice2.processingTime)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice2.processingTime)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border td-with-lf-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice2.singlePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice2.singlePrice.showErrorMsg}" v-model="item.processPrice2.singlePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice2.singlePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice2.singlePrice)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice2.price" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice2.price.showErrorMsg}" v-model="item.processPrice2.price.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice2.price)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice2.price)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice2.rate" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice2.rate.showErrorMsg}" v-model="item.processPrice2.rate.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice2.rate)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice2.rate)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border td-with-lf-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defManagementPrice2" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defManagementPrice2.showErrorMsg}" v-model="item.defManagementPrice2.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.defManagementPrice2)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defManagementPrice2)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defPrice2" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defPrice2.showErrorMsg}" v-model="item.defPrice2.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.defPrice2)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defPrice2)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="td-with-rg-border">0-2000</td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice3.weight" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice3.weight.showErrorMsg}" v-model="item.materialPrice3.weight.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice3.weight)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice3.weight)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice3.singlePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice3.singlePrice.showErrorMsg}" v-model="item.materialPrice3.singlePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice3.singlePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice3.singlePrice)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="number" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice3.processingTime" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice3.processingTime.showErrorMsg}" v-model="item.materialPrice3.processingTime.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice3.processingTime)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice3.processingTime)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border td-with-lf-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice3.singlePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice3.singlePrice.showErrorMsg}" v-model="item.processPrice3.singlePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice3.singlePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice3.singlePrice)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice3.price" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice3.price.showErrorMsg}" v-model="item.processPrice3.price.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice3.price)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice3.price)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice3.rate" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice3.rate.showErrorMsg}" v-model="item.processPrice3.rate.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice3.rate)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice3.rate)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border td-with-lf-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defManagementPrice3" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defManagementPrice3.showErrorMsg}" v-model="item.defManagementPrice3.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.defManagementPrice3)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defManagementPrice3)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defPrice3" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defPrice3.showErrorMsg}" v-model="item.defPrice3.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.defPrice3)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defPrice3)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border"></td>
                                </tr>
                            </tbody>
                            <tbody v-else :key="'tbody' + index" :ref="'requirementItem'+index" :class="'sss' + index">
                                <tr>
                                    <td>{{item.itemNo||'-'}}</td>
                                    <td>{{item.itemName}}</td>
                                    <td>{{item.estimateCount}}</td>
                                    <td>-</td>
                                    <td>
                                        <el-form-item prop="notEmpty" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defMaterial" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                       <!--  <input :class="{'red-border': item.defMaterial.showErrorMsg}" v-model="item.defMaterial.value" @blur="validate($event, /^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/,
                                            item.defMaterial)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/, item.defMaterial)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-rg-border">-</td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice1.weight" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice1.weight.showErrorMsg}" v-model="item.materialPrice1.weight.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice1.weight)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice1.weight)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice1.singlePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                       <!--  <input :class="{'red-border': item.materialPrice1.singlePrice.showErrorMsg}" v-model="item.materialPrice1.singlePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice1.singlePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice1.singlePrice)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="processingTime" :show-message="false">
                                            <el-input class="wd-32" v-model="item.materialPrice1.processingTime" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.materialPrice1.processingTime.showErrorMsg}" v-model="item.materialPrice1.processingTime.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.materialPrice1.processingTime)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.materialPrice1.processingTime)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border td-with-lf-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice1.singlePrice" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice1.singlePrice.showErrorMsg}" v-model="item.processPrice1.singlePrice.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice1.singlePrice)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice1.singlePrice)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice1.price" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice1.price.showErrorMsg}" v-model="item.processPrice1.price.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice1.price)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice1.price)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-32" v-model="item.processPrice1.rate" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.processPrice1.rate.showErrorMsg}" v-model="item.processPrice1.rate.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.processPrice1.rate)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.processPrice1.rate)" maxlength="9" class="input-item wd-32" type="text"> -->
                                    </td>

                                    <td class="td-with-bt-border td-with-lf-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defManagementPrice1" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defManagementPrice1.showErrorMsg}" v-model="item.defManagementPrice1.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.defManagementPrice1)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defManagementPrice1)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border">
                                        <el-form-item prop="price" :show-message="false">
                                            <el-input class="wd-68" v-model="item.defPrice1" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                        </el-form-item>
                                        <!-- <input :class="{'red-border': item.defPrice1.showErrorMsg}" v-model="item.defPrice1.value" @blur="validate($event, /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                                            item.defPrice1)" :disabled="item.isAbandon||(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            @input="validate($event, /^[0-9]+$/, item.defPrice1)" maxlength="9" class="input-item wd-68" type="text"> -->
                                    </td>
                                    <td class="td-with-bt-border"><el-checkbox :disabled="data.acceptStatus!=450010||data.requirement.requirementStatus!=107020" v-model="item.isAbandon">不报价</el-checkbox></td>
                                </tr>
                            </tbody>
                        </table>
                    </el-form>
                </div>
            </div>
            <div class="content-item added-info" ref="baseForm">
                <div class="title">报价信息</div>
                <div class="content-item-box">
                    <div class="prompt-info">以下为需求方询盘的信息，您可以与需求方协商后调整</div>
                    <el-form :model="formData" :rules="rules" ref="quotationForm">
                        <el-form-item class="time-form-item">
                            <el-col :span="7">
                                <el-form-item label-posotion="left" label="报价有效期：" prop="offerInvalidTime" label-width="84px" required>
                                    <el-date-picker v-model="formData.offerInvalidTime" :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                        type="datetime"
                                        value-format="yyyy-MM-dd hh:ss:mm"
                                        :picker-options="pickerOptions"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="formData.settlementType==430020?8:7">
                                <el-form-item class="payment-form-item" required label="结算方式：" label-position="top"  label-width="74px" prop="settlementType">
                                    <div style="display:flex;align-items:center;height:26px;">
                                        <el-radio-group v-model="formData.settlementType">
                                            <el-radio :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)" :label="430010">全款现付</el-radio>
                                            <el-radio :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)" :label="430020">月结</el-radio>
                                        </el-radio-group>
                                        <div v-if="formData.settlementType==430020" style="width:82px;margin-left:15px;">
                                            <el-select :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)" v-model="formData.settlementPeriod">
                                                <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in paymentCycles"></el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item class="delivery-form-item" label-posotion="left" prop="expressMode" label="配送方式：" label-width="74px" required>
                                    <el-radio-group v-model="formData.expressMode">
                                        <el-radio :label="item.id" v-for="item in deliveryTypes" :key="item.name" :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)">{{item.name}}</el-radio>
                                    </el-radio-group>
                                    <!-- <v-checkBtn :class="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)?'disabled':''" @click="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)?'':selectExpressMode(item)" :active="item.isCheck" v-for="item in deliveryTypes">{{item.expressModeName}}</v-checkBtn> -->
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item class="invoice-form-item" label-posotion="left" label="支持发票：" label-width="74px">
                            <el-radio-group v-model="formData.invoiceTemplateId">
                                <el-radio :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)" :label="invoice.id" v-for="invoice in invoices" :key="invoice.id">{{invoice.invoiceTitleTypeText}}{{invoice.invoiceTypeText}}{{invoice.taxRate*100}}%</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="beautiful-line help">以下信息是您的报价补充信息</div>
                        <el-form-item class="contact-form-item" label-posotion="left" label="对接人：" label-width="60px">
                            <el-col :span="3">
                                <el-form-item class="name-form-item">
                                    <el-input v-model="formData.contactName" :maxlength="20" placeholder="姓名" :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" class="phone-form-item">
                                <el-form-item>
                                    <el-input  v-model="formData.contactPhone" :maxlength="25" placeholder="电话" :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item class="email-form-item">
                                    <el-autocomplete
                                            :maxlength="36"
                                            :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"
                                            class="inline-input company-input"
                                            v-model="formData.contactEmail"
                                            :fetch-suggestions="emailInputHandler"
                                            placeholder="请输入邮箱"
                                            :trigger-on-focus="true"
                                        ></el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <div style="padding-left:20px;">附件：<span class="link" @click="showUploadDlg">{{uploadDlg.fileList.length>0?'查看':'上传'}}</span></div>
                            </el-col>
                        </el-form-item>
                        <el-form-item class="explain-form-item" label-posotion="left" label="报价说明：" label-width="74px">
                            <el-input v-model="formData.remark" :maxlength="200" :rows="2" type="textarea" :disabled="(data.acceptStatus!=450010||data.requirement.requirementStatus!=107020)"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="help">注：报价含运费、含包装费、价格有效期线下商定</div>
                </div>
            </div>

            <div v-if="data.acceptStatus==450010&&data.requirement.requirementStatus==107020" class="form-btn-box">
                <div class="form-btn" @click="cancel">取消</div>
                <div class="form-btn form-next-btn" @click="submit">保存并提交</div>
            </div>

            <el-dialog title="上传" width="524px" :visible.sync="uploadDlg.visible">
                <div class="upload-dlg">
                    <div class="add-btn" @click="showFileDlg">选择文件</div>
                    <input type="file" hidden ref="fileInput" @change="uploadFile">
                    <div class="file-list" v-if="uploadDlg.fileList">
                        <div class="file-item" v-for="(file,index) in uploadDlg.fileList" :key="'file-item' + index">
                            {{file.fileName}}
                            <i class="remove-icon" @click="deleteFileItem(index)"></i>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary"
                    @click="closeUploadDlg" >确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import CheckBtn from '../components/checkButton.vue';
import {EmailAuto,validatNumber} from '../lib/validate.js';
export default {
    components:{
        'v-checkBtn': CheckBtn
    },
    data() {
        return {
            testList:[{isLabel:false}, {isLabel:true}],
            pickerOptions:{
                disabledDate: function(date) {
                    var now = new Date();
                    now.setDate(now.getDate()-1);
                    if (date.getTime() < now.getTime()) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            paymentCycles: [],
            currentRequirementItem:'',
            currentUploadType: 0,
            quotationId:'',
            requireId:'',
            data: {},
            label:['报价含运费','报价含税','报价含包装费'],
            formData:{
                settlementType:430010,
                settlementPeriod:440010,
                offerInvalidTime:'',
                invoiceTemplateId:'',
                expressMode :'',
                contactName:'',
                contactPhone:'',
                contactEmail:'',
                remark: '',
            },
            rules: {
                offerInvalidTime: [{required: true,message:'请选择有效期时间',trigger:'change'},{required: true,message:'请选择有效期时间',trigger:'blur'}],
                expressMode:[{required: true,message:'请选择配送方式',trigger:'change'}],
                settlementType:[{required: true,message:'请选择结算方式',trigger:'change'}],
            },
            invoices:[],
            deliveryTypes:[],
            uploadDlg:{
                visible: false,
                fileList:[]
            },
            requirementItemIndexs: [],
            tableRules:{
                price:[{required: true,message:'请选择配送方式1',trigger:'change'}],
                notEmpty:[{required: true,validator:validatNumber,trigger:'change'}],
                number:[{required: true,validator: validatNumber,trigger:'change'}],
                processingTime:[{required: true,validator: validatNumber,trigger:'change'}],
            }
        }
    },
    created() {
        this.getWords();
        this.quotationId = Number(this.$route.query.quotationId);
        this.requireId = Number(this.$route.query.requireId);
        this.getInvoices();
        this.getFormInfo();
    },
    methods: {
        emailInputHandler( inputString, cb ) {
            EmailAuto(inputString,cb)
        },

        getScrollTopValue( targetElement ) {
            var boundingClientTop = targetElement.getBoundingClientRect().top;//目标元素顶部到窗口顶部的距离
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            var maxSrcollTop = boundingClientTop + scrollTop; // 目标元素顶部到窗口顶部的最大距离或最大滚动值
            var scrollValue = maxSrcollTop - 300;//120 头部距离
            return scrollValue;
        },

        validate( e, rule, item ){
            var valid = rule.test( e.target.value );
            if( valid ) {
                item.showErrorMsg = false;
                item.isCheck = true;
            } else {
               item.showErrorMsg = true;
               item.isCheck = false;
            }
        },

        getWords() {
            var wordsString = localStorage.getItem('words');
            var words = JSON.parse(wordsString);
            this.paymentCycles = words[151].item;

            this.deliveryTypes = words[110].item;
        //    this.formData.expressMode = this.deliveryTypes[0].expressMode;
        },

        //获取数据
        getFormInfo() {
            this.$http.post('/custom/manufacturer/requirementPrice/get',{id: this.quotationId}).then((res) => {
                if ( res.data.code ==200 ) {
                    this.data = res.data.data;
                    this.formData.settlementType = this.data.settlementType || 430010;
                    this.formData.offerInvalidTime = this.data.offerInvalidTime || null;
                    this.formData.remark = this.data.remark || '';
                    this.formData.invoiceTemplateId = this.data.invoiceTemplateId || this.formData.invoiceTemplateId;
                    this.formData.expressMode = this.data.expressMode || this.data.requirement.expressMode;
                    this.uploadDlg.fileList = this.data.otherFiles || [];
                    if(this.data.offerStatus==210020){
                        this.formData.contactName = this.data.contactName || '';
                        this.formData.contactPhone = this.data.contactPhone || '';
                        this.formData.contactEmail = this.data.contactEmail || '';
                    }else if(this.data.offerStatus==210010){
                        let user=JSON.parse(window.localStorage.getItem('gxzzpt2_consumer'));
                        this.formData.contactName = this.data.contactName || user.nickName;
                        this.formData.contactPhone = this.data.contactPhone || user.phone;
                        this.formData.contactEmail = this.data.contactEmail || user.email;
                    }

                    if ( this.data.requirement.priceTemplate ==490010 ) {
                        this.data.requirementPriceItems.map(( item ) => {
                            if ( item.isLadderPrice ) {
                                this.$set( item, 'price1', (item.priceInfo&&item.priceInfo[0].price)||'' );
                                this.$set( item, 'price2', (item.priceInfo&&item.priceInfo[1].price)||'' );
                                this.$set( item, 'price3', (item.priceInfo&&item.priceInfo[2].price)||'' );
                            } else {
                                this.$set( item, 'defSinglePrice', (item.priceInfo&&item.priceInfo.price)||'');
                            }
                        //    this.$set( item, 'defDeliveryTime', {value:item.deliveryTime||'',isCheck: item.deliveryTime?true:false, showErrorMsg: false,} );
                            this.$set( item, 'defMinCount', item.minCount||'' );
                        })
                    } else {
                        this.data.requirementPriceItems.map(( item ) => {
                            if ( item.isLadderPrice ) {
                                this.$set( item, 'defMaterial', item.material||'');
                                this.$set( item, 'defManagementPrice1', item.priceInfo?item.priceInfo[0].managementPrice:'');
                                this.$set( item, 'defManagementPrice2', item.priceInfo?item.priceInfo[1].managementPrice:'');
                                this.$set( item, 'defManagementPrice3', item.priceInfo?item.priceInfo[2].managementPrice:'');
                                this.$set( item, 'defPrice1', item.priceInfo?item.priceInfo[0].price:'');
                                this.$set( item, 'defPrice2', item.priceInfo?item.priceInfo[1].price:'');
                                this.$set( item, 'defPrice3', item.priceInfo?item.priceInfo[2].price:'');
                                this.$set( item, 'materialPrice1', {
                                    weight:(item.priceInfo&&item.priceInfo[0].materialPrice)?item.priceInfo[0].materialPrice.weight:'',
                                    singlePrice:(item.priceInfo&&item.priceInfo[0].materialPrice)?item.priceInfo[0].materialPrice.singlePrice:'',
                                    processingTime:(item.priceInfo&&item.priceInfo[0].materialPrice)?item.priceInfo[0].materialPrice.processingTime:''
                                });
                                this.$set( item, 'materialPrice2', {
                                    weight:(item.priceInfo&&item.priceInfo[1].materialPrice)?item.priceInfo[1].materialPrice.weight:'',
                                    singlePrice:(item.priceInfo&&item.priceInfo[1].materialPrice)?item.priceInfo[1].materialPrice.singlePrice:'',
                                    processingTime:(item.priceInfo&&item.priceInfo[1].materialPrice)?item.priceInfo[1].materialPrice.processingTime:'', 
                                });
                                this.$set( item, 'materialPrice3', {
                                    weight:(item.priceInfo&&item.priceInfo[2].materialPrice)?item.priceInfo[2].materialPrice.weight:'', 
                                    singlePrice:(item.priceInfo&&item.priceInfo[2].materialPrice)?item.priceInfo[2].materialPrice.singlePrice:'',
                                    processingTime:(item.priceInfo&&item.priceInfo[2].materialPrice)?item.priceInfo[2].materialPrice.processingTime:'',
                                });
                                this.$set( item, 'processPrice1', {
                                    price:(item.priceInfo&&item.priceInfo[0].processPrice)?item.priceInfo[0].processPrice.price:'',
                                    singlePrice:(item.priceInfo&&item.priceInfo[0].processPrice)?item.priceInfo[0].processPrice.singlePrice:'', 
                                    rate:(item.priceInfo&&item.priceInfo[0].processPrice)?item.priceInfo[0].processPrice.rate:'',
                                });
                                this.$set( item, 'processPrice2', {
                                    price:(item.priceInfo&&item.priceInfo[1].processPrice)?item.priceInfo[1].processPrice.price:'',
                                    singlePrice:(item.priceInfo&&item.priceInfo[1].processPrice)?item.priceInfo[1].processPrice.singlePrice:'', 
                                    rate: (item.priceInfo&&item.priceInfo[1].processPrice)?item.priceInfo[1].processPrice.rate:'',
                                });
                                this.$set( item, 'processPrice3', {
                                    price:(item.priceInfo&&item.priceInfo[2].processPrice)?item.priceInfo[2].processPrice.price:'', 
                                    singlePrice: (item.priceInfo&&item.priceInfo[2].processPrice)?item.priceInfo[2].processPrice.singlePrice:'', 
                                    rate:(item.priceInfo&&item.priceInfo[2].processPrice)?item.priceInfo[2].processPrice.rate:'',
                                });
                            } else {
                                this.$set( item, 'defMaterial', item.material||'');
                                this.$set( item, 'defManagementPrice1', item.priceInfo?item.priceInfo.managementPrice:'');
                                this.$set( item, 'defPrice1', item.priceInfo?item.priceInfo.price:'');
                                this.$set( item, 'materialPrice1', {
                                    weight:(item.priceInfo&&item.priceInfo.materialPrice)?item.priceInfo.materialPrice.weight:'', 
                                    singlePrice:(item.priceInfo&&item.priceInfo.materialPrice)?item.priceInfo.materialPrice.singlePrice:'',
                                    processingTime:(item.priceInfo&&item.priceInfo.materialPrice)?item.priceInfo.materialPrice.processingTime:'',
                                });
                                this.$set( item, 'processPrice1', {
                                    price:(item.priceInfo&&item.priceInfo.processPrice)?item.priceInfo.processPrice.price:'', 
                                    singlePrice:(item.priceInfo&&item.priceInfo.processPrice)?item.priceInfo.processPrice.singlePrice:'',
                                    rate:(item.priceInfo&&item.priceInfo.processPrice)?item.priceInfo.processPrice.rate:'',
                                });
                            }
                        })
                    }
                    console.log('data', this.data);
                } else {
                    this.$error(res.data.message);
                }
            })
        },


        //选择配送方式
        selectExpressMode( mode ) {
            this.deliveryTypes.map((item) => {
                item.isCheck = false;
            })
            mode.isCheck = true;
            this.formData.expressMode = mode.expressMode;
        },

        //获取发票
        getInvoices() {
            this.$http.post('/custom/manufacturer/InvoiceTemplate/getList').then((res) => {
                if ( res.data.code ==200 ) {
                    if ( res.data.data) {
                        this.invoices = res.data.data;
                        this.formData.invoiceTemplateId = this.invoices[0].id;
                    } else {
                        this.$error('未查到发票模板信息');
                    }
                } else {
                    this.$error(res.data.message);
                }
            })
        },

        //提交并保存
        submit() {
        //    var itemsValid = this.checkItems();
            console.log(this.data);
            this.$refs.tableForm.validate((valid) => {

            })
            
            var itemsValid = false;
            var quotationFormValid = false;

            this.$refs.quotationForm.validate(( valid ) => {
                if ( valid ) {
                    quotationFormValid = true;
                } else {
                    return false;
                }
            })

            if ( itemsValid && quotationFormValid ) {
                var params = this.paramsHandler();
                this.$http.post('/custom/manufacturer/requirementPrice/saveAndQuotedPrice',params).then((res) => {
                   if ( res.data.code == 200 ) {
                       this.$message.success('保存成功');
                       this.$router.push({path:'/usercenter/received-require'});
                   } else {
                       this.$error(res.data.message);
                   }
               })
            } else {
                if ( this.requirementItemIndexs.length > 0 ) {
                    let scrollTopVal = this.getScrollTopValue( this.$refs['requirementItem' + this.requirementItemIndexs[0]][0] || this.$refs['requirementItem' + this.requirementItemIndexs[0]]);
                    window.document.documentElement.scrollTop = scrollTopVal;
                } else {
                    let scrollTopVal = this.getScrollTopValue( this.$refs['baseForm']);
                    window.document.documentElement.scrollTop = scrollTopVal;
                }
            }
        },

        checkItems() {
            var itemsValid = true;
            let set = new Set();

            if ( this.data.requirement.priceTemplate == 490020 ) {
                this.data.requirementPriceItems.map(( item, index ) => {
                    if ( !item.isAbandon ) {
                    
                        if ( !item.defMaterial.isCheck ) {
                            item.defMaterial.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
                        if ( !item.defManagementPrice1.isCheck ) {
                            item.defManagementPrice1.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
                        if ( !item.defPrice1.isCheck ) {
                            item.defPrice1.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
    
                        ///////
                        
                        if ( !item.materialPrice1.weight.isCheck ) {
                            item.materialPrice1.weight.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
    
                        if ( !item.materialPrice1.singlePrice.isCheck ) {
                            item.materialPrice1.singlePrice.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
    
                        if ( !item.materialPrice1.processingTime.isCheck ) {
                            item.materialPrice1.processingTime.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
    
                        /////////
    
                        
                        if ( !item.processPrice1.price.isCheck ) {
                            item.processPrice1.price.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
    
                        if ( !item.processPrice1.singlePrice.isCheck ) {
                            item.processPrice1.singlePrice.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
    
                        if ( !item.processPrice1.rate.isCheck ) {
                            item.processPrice1.rate.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
    
                        if ( item.isLadderPrice ) {
                            if ( !item.materialPrice2.weight.isCheck ) {
                                item.materialPrice2.weight.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                            
                            if ( !item.materialPrice2.singlePrice.isCheck ) {
                                item.materialPrice2.singlePrice.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.materialPrice2.processingTime.isCheck ) {
                                item.materialPrice2.processingTime.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                            ///////////
                            if ( !item.materialPrice3.weight.isCheck ) {
                                item.materialPrice3.weight.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                            
                            if ( !item.materialPrice3.singlePrice.isCheck ) {
                                item.materialPrice3.singlePrice.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.materialPrice3.processingTime.isCheck ) {
                                item.materialPrice3.processingTime.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                             ///////////
                            if ( !item.processPrice2.price.isCheck ) {
                                item.processPrice2.price.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.processPrice2.singlePrice.isCheck ) {
                                item.processPrice2.singlePrice.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.processPrice2.rate.isCheck ) {
                                item.processPrice2.rate.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                            ///////////
                            if ( !item.processPrice3.price.isCheck ) {
                                item.processPrice3.price.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.processPrice3.singlePrice.isCheck ) {
                                item.processPrice3.singlePrice.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.processPrice3.rate.isCheck ) {
                                item.processPrice3.rate.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            ////////////
                            if ( !item.defManagementPrice2.isCheck ) {
                                item.defManagementPrice2.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.defManagementPrice3.isCheck ) {
                                item.defManagementPrice3.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.defPrice2.isCheck ) {
                                item.defPrice2.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
    
                            if ( !item.defPrice3.isCheck ) {
                                item.defPrice3.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                        }
                    }

                    
                })
            } else {
                this.data.requirementPriceItems.map(( item, index ) => {
                    if ( !item.isAbandon ) {
                        if ( item.isLadderPrice ) {
                            if ( !item.price1.isCheck ) {
                                item.price1.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                            if ( !item.price2.isCheck ) {
                                item.price2.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                            if ( !item.price3.isCheck ) {
                                item.price3.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                        } else {
                            if ( !item.defSinglePrice.isCheck ) {
                                item.defSinglePrice.showErrorMsg = true;
                                itemsValid = false;
                                set.add( index );
                            }
                        }

                        if ( !item.defMinCount.isCheck ) {
                            item.defMinCount.showErrorMsg = true;
                            itemsValid = false;
                            set.add( index );
                        }
                    }
                })
            }

            this.requirementItemIndexs = [...set];
            return itemsValid;
        },

        cancel() {

        },

        //保存
        save( ) {
            var itemsValid = this.checkItems();

            var quotationFormValid = false;

            this.$refs.quotationForm.validate(( valid ) => {
                if ( valid ) {
                    quotationFormValid = true;
                } else {
                    return false;
                }
            })

            if ( itemsValid && quotationFormValid ) {
                var params = this.paramsHandler();
                this.$http.post('/custom/manufacturer/requirementPrice/save',params).then((res) => {
                    if ( res.data.code == 200 ) {
                        this.$message.success('保存成功');
                    } else {
                        this.$error(res.data.message);
                    }
                })
            }

        },
        paramsHandler() {
            let params = {
                id: this.quotationId,
                offerInvalidTime: this.formData.offerInvalidTime,
                expressMode: this.formData.expressMode,
                invoiceTemplateId: this.formData.invoiceTemplateId,
                contactName: this.formData.contactName,
                contactPhone: this.formData.contactPhone,
                contactEmail: this.formData.contactEmail,
                remark: this.formData.remark,
                settlementType: this.formData.settlementType,
                settlementPeriod: this.formData.settlementType == 430010 ? null : this.formData.settlementPeriod,
                items: [],
                otherFileIds: []
            };
            this.uploadDlg.fileList.map(( item ) => {
                params.otherFileIds.push( item.id );
            })
            if ( this.data.requirement.priceTemplate == 490020 ) {
                this.data.requirementPriceItems.map(( item ) => {
                    var requirement = {
                        requirementPriceItemId:item.id,
                        isAbandon: item.isAbandon,
                        priceInfo:[],
                        minCount:1,
                        material: item.defMaterial.value,
                    }
                    if ( item.isLadderPrice ) {
                        requirement.priceInfo.push({from: item.priceInfo[0].from, to: item.priceInfo[0].to, price: Number(item.defPrice1.value), managementPrice: Number(item.defManagementPrice1.value),
                        materialPrice:{weight: Number(item.materialPrice1.weight.value), singlePrice: Number(item.materialPrice1.singlePrice.value), processingTime: Number(item.materialPrice1.processingTime.value)},
                        processPrice:{singlePrice: Number(item.processPrice1.singlePrice.value), price: Number(item.processPrice1.price.value), rate: Number(item.processPrice1.rate.value)}
                        });
                        requirement.priceInfo.push({from: item.priceInfo[1].from, to: item.priceInfo[1].to, price: Number(item.defPrice2.value), managementPrice:Number(item.defManagementPrice2.value),
                        materialPrice:{weight: Number(item.materialPrice2.weight.value), singlePrice: Number(item.materialPrice2.singlePrice.value), processingTime: Number(item.materialPrice2.processingTime.value)},
                        processPrice:{singlePrice: Number(item.processPrice2.singlePrice.value), price: Number(item.processPrice2.price.value), rate: Number(item.processPrice2.rate.value)}
                        });
                        requirement.priceInfo.push({from: item.priceInfo[2].from, price: Number(item.defPrice3.value), managementPrice:Number(item.defManagementPrice3.value),
                        materialPrice:{weight: Number(item.materialPrice3.weight.value), singlePrice: Number(item.materialPrice3.singlePrice.value), processingTime: Number(item.materialPrice3.processingTime.value)},
                        processPrice:{singlePrice: Number(item.processPrice3.singlePrice.value), price: Number(item.processPrice3.price.value), rate: Number(item.processPrice3.rate.value)}});
                    } else {
                        requirement.priceInfo = { price: Number(item.defPrice1.value), managementPrice:Number(item.defManagementPrice1.value),
                        materialPrice:{weight: Number(item.materialPrice1.weight.value), singlePrice: Number(item.materialPrice1.singlePrice.value), processingTime: Number(item.materialPrice1.processingTime.value)},
                        processPrice:{singlePrice: Number(item.processPrice1.singlePrice.value), price: Number(item.processPrice1.price.value), rate: Number(item.processPrice1.rate.value)}
                        };
                    }
                    params.items.push(requirement);
                    console.log(params);
                })
            } else {
                this.data.requirementPriceItems.map(( item ) => {
                    var requirement = {
                        requirementPriceItemId:item.id,
                    //    singlePrice: null,
                        priceInfo: [],
                        minCount: Number(item.defMinCount.value),
                        isAbandon: item.isAbandon,
                    }
                    if ( item.isLadderPrice ) {
                        requirement.priceInfo.push({from: item.priceInfo[0].from, to: item.priceInfo[0].to, price: Number(item.price1.value)});
                        requirement.priceInfo.push({from: item.priceInfo[1].from, to: item.priceInfo[1].to, price: Number(item.price2.value)});
                        requirement.priceInfo.push({from: item.priceInfo[2].from, price: Number(item.price3.value)});
                    } else {
                        requirement.priceInfo = {};
                        requirement.priceInfo.price = Number(item.defSinglePrice.value);
                    }
                    params.items.push(requirement);
                })
            }
            return params;
        },

        //关闭弹窗
        closeUploadDlg() {
            this.uploadDlg.visible = false;
        },

        //删除文件
        deleteFileItem( index ) {
         //   if ( this.uploadDlg.fileList.length >= 2 ) {
                this.uploadDlg.fileList.splice( index, 1 );
        //    }
        },

        //上传文件
        uploadFile( e ) {
            var file = e.target.files[0];
            if (!/\.(doc|DOC|xlsx|XLSX|ppt|PPT|pdf|PDF|XLS|xls|docx|DOCX)$/.test(file.name)) {
                this.$error("只支持上传doc/ppt/pdf/xls/docx格式的文件");
            }  else if( file.size > 25*1024*1024 ){
                this.$error("文件大小不能超过25M");
            } else {
                var data = new FormData();
                data.append("file", file);
                this.$upload.post('/uploadingFile', data).then(( res ) => {
                    if ( res.data.code == 200 ) {
                        this.uploadDlg.fileList.push(res.data.attachFile);
                    } else {
                        this.$error(res.data.message);
                    }
                })
            }
            this.$refs.fileInput.value = '';
        },

        //显示文件选择弹窗
        showFileDlg() {
            this.$refs.fileInput.click();
        },

        //显示上传文件弹窗
        showUploadDlg( ) {
            this.uploadDlg.visible = true;
        }
    }
}
</script>
<style lang="less">
#to-quotation{
    .el-date-editor.el-input{
        width: 180px;
    }
    .td-with-bt-border{
        border-bottom: 1px solid #d0d0d0;
    }
    .td-with-lf-border{
        border-left: 1px solid #d0d0d0;
    }
    .td-with-rg-border{
        border-right: 1px solid #d0d0d0;
    }
    .content{
        width: 1200px;
    //    padding: 0 15px;
        margin: 0 auto;
        margin-bottom: 35px;
        .crumb-bread{
            height: 35px;
            line-height: 35px;
            .router-link{
                cursor: pointer;
                &:hover{
                    color: #3f8def;
                    text-decoration: underline;
                }
            }
            .right-arrow{
                margin: 0 5px;
            }
            .curr{
                color: #3f8def;
            }
        }
        .require-number{
            margin-top: 15px;
            margin-bottom: 10px;
            .number{
                float: left;
                width: 205px;
                font-size: 16px;
                font-weight: 700;
            }
            .state{
                float: left;
                width: 56px;
                height: 23px;
                background-color: #e5f1ff;
                border: solid 1px #3f8def;
                color: #3f8def;
                line-height: 23px;
                text-align: center;
            }
            .btn{
                float: right;
                width: 70px;
                height: 30px;
                background-color: #3f8def;
                border-radius: 4px;
                color: #fff;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
            }
        }
        .content-item{
            margin-bottom: 15px;
            .title{
                font-size: 14px;
                margin-bottom: 5px;
            }
            .content-item-box{
                padding: 14px 18px;
                background: #fff;
                box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                .prompt-info{
                    color: #a09f9f;
                    margin-bottom: 13px;
                }
                .contact-info{
                    margin-bottom: 0;
                }
                .payment-form-item{
                    .el-select{
                        width: 82px;
                    }
                }
                .name-form-item,.phone-form-item,.email-form-item{
                    .el-input{
                        width: 90%;
                    }
                }
                .invoice-form-item{
                    .el-form-item__label{
                        line-height: 16px;
                    }
                    .el-radio{
                        width: 205px;
                        padding-left: 5px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .el-radio+.el-radio{margin-left:0;}
                    .el-radio:nth-child(n+7) {
                        margin-top: 14px;
                    }
                    .el-radio:nth-child(6n+1) {
                        margin-left: 0;
                    }
                }
                .explain-form-item{
                    .el-textarea{
                        width: 595px;
                    }
                }
                .beautiful-line{
                    border-top: 1px solid #e2e2e2;
                    padding: 12px 0;
                }
                .part-table{
                    .el-form-item{
                        margin-bottom: 0px;
                    }
                }
                table{
                    thead td{
                        text-align: center;
                        background: #ebebeb;
                        height: 34px;
                        vertical-align: middle;
                    }
                    tbody{
                        border-bottom: 1px solid #e2e2e2;
                        tr{
                            td{
                                background: #fff;
                                height: 37px;
                                text-align: center;
                                vertical-align: middle;
                                
                                .input-item{
                                    width: 96px;
                                    height: 26px;
                                    border: 1px solid #d0d0d0;
                                    box-sizing: border-box;
                                    text-align: center;
                                }
                                .wd-32{
                                    width: 32px;
                                }
                                .wd-68{
                                    width: 68px;
                                }
                                .red-border{
                                    border: 1px solid #f56c6c;
                                }
                            }
                        }
                    }
                    tbody:last-child{
                        tr:last-child td{
                            height: 47px;
                            padding-bottom: 10px;
                        }
                        tr:last-child .td-with-bt-border{
                            border-bottom: none;
                        }
                    }
                }
            }
            .part-info-box{
                 padding: 0;
            }
        }
    }
    .upload-dlg{
        .add-btn{
            width: 122px;
            height: 37px;
            text-align: center;
            line-height: 36px;
            font-size: 16px;
            color: #3f8def;
            border: 1px solid #3f8def;
            text-indent: 20px;
            background: rgba(63, 141, 239, 0.1) url(../../static/img/add-icon.png) no-repeat 17px center;
            cursor: pointer;
        }
        .file-list{
            margin-top: 22px;
            .file-item{
                position: relative;
                height: 15px;
                margin-bottom: 24px;
                line-height: 15px;
            //    background: #fff url(../../static/img/red-x-icon.png) no-repeat scroll right;
                .remove-icon{
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 15px;
                    height: 15px;
                    background: #fff url(../../static/img/red-x-icon.png) no-repeat scroll center;
                    cursor: pointer;
                }
            }
        }
    }
    .form-btn-box{
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
        padding: 0 320px;
        margin-bottom: 35px;
        .form-btn{
            width: 176px;
            height: 38px;
            border-radius: 4px;
            box-sizing: border-box;
            color: #fff;
            line-height: 38px;
            text-align: center;
            background: #d0d0d0;
            cursor: pointer;
        }
        .form-next-btn{
            color: #fff;
            background: #3f8def;
        }
    }
}
</style>
