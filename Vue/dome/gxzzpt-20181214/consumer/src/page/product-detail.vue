<template>
    <div id="product-detail">
        <div class="content">
            <div class="content-mg-left">
            <div class="bread-crumb"><span class="pull-cursor" @click="$router.push({path:'/index'})">首页</span> > <span @click="$router.push({path:'/product-case'})"> 产品案例</span> > <span class="LastName">产品信息</span></div>
            <div class="product-info-wrapper pull-shadow">
                <div class="top">
                    <div class="title">{{data.productName}}</div>
                    <div class="btn" @click="$router.push({path: '/manufacturer-audits',query:{companyId: data.companyInfo.id,position: 'second'}})">查看此供应商更多的产品</div>
                </div>
                <div class="center .clearfix">
                    <div class="left clearfix">
                        <div class="boxImg"><img class="big-img" :src="currImg.url" alt=""></div>
                        <div class="sm-img-list">
                            <img v-if="index < 4 " @click="showPicture(item)" :class="item.isActive?'active':''" v-for="(item,index) in imgList" class="sm-img" :src="item.url" alt="">
                        </div>
                    </div>
                    <div class="right">
                        <table>
                            <tr>
                                <td><div class="td-title">产品名称：</div></td>
                                <td width="350px"><div class="common-ellipsis-1 td-content">{{data.productName}}</div></td>
                            </tr>
                             <tr>
                                <td><div class="td-title">行业：</div></td>
                                <td width="350px"><div class="common-ellipsis-1 td-content">{{industryName}}</div></td>
                            </tr>
                            <tr>
                                <td><div class="td-title">工艺：</div></td>
                                <td width="350px"><div class="common-ellipsis-1 td-content"><span v-if="data.techniqueInfo!=undefined">{{data.techniqueInfo.techniqueName}}</span></div></td>
                            </tr>
                            <tr>
                                <td><div class="td-title">材料：</div></td>
                                <td width="350px"><div class="common-ellipsis-1 td-content">{{data.material}}</div></td>
                            </tr>
                            <tr>
                                <td><div class="td-title">报价范围：</div></td>
                                <td width="350px"><div class="common-ellipsis-1 td-content">{{data.priceScope||'无'}}</div></td>
                            </tr>
                            <tr>
                                <td><div class="td-title"></div></td>
                                <td width="350px"><div class="common-ellipsis-1 td-content"></div></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="company-info-wrapper pull-shadow">
                <div class="title">公司信息</div>
                <div class="content-box">
                    <table>
                        <tr>
                            <td><div class="td-title">公司名称：</div></td>
                            <td ><div class="common-ellipsis-1 td-content">
                                <span class="td-company" @click="$router.push({path: '/manufacturer-audits',query:{companyId: data.companyInfo.id}})">{{companyName}}</span></div></td>
                        </tr>
                        <tr>
                            <td><div class="td-title">主要工艺：</div></td>
                            <td >
                                <div class="common-ellipsis-1 td-content">
                                    <span class="pull-inline" v-for="(item,index) in companyTechniqueList" :key="index" v-if="item.techniqueInfo!=undefined">{{item.techniqueInfo.techniqueName}}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><div class="td-title">企业类型：</div></td>
                            <td ><div class="common-ellipsis-1 td-content">{{companyInfo.companyClassText}}</div></td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td><div class="td-title">行业类型：</div></td>
                            <td >
                                <div class="common-ellipsis-1 td-content">
                                 <span class="pull-inline" v-for="(item,index) in industryList" :key="index" v-if="item.industryName!=undefined">{{item.industryName}}</span>
                                </div></td>
                        </tr>
                        <tr>
                            <td><div class="td-title">倾向订单类型：</div></td>
                            <td><div class="common-ellipsis-1 td-content">{{companyInfo.companyCoopInfo?companyInfo.companyCoopInfo.orderTypeText:''}}</div></td>
                        </tr>
                        <tr>
                            <td><div class="td-title">地址：</div></td>
                            <td>
                                <div class="common-ellipsis-1 td-content">
                                    <span v-if="companyInfo.countryText!=undefined">{{companyInfo.countryText}}</span>
                                    <span v-if="companyInfo.province!=undefined">{{companyInfo.province}}</span>
                                    <span v-if="companyInfo.city!=undefined">{{companyInfo.city}}</span>
                                    <span v-if="companyInfo.address!=undefined">{{companyInfo.address}}</span>
                                </div>
                                </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="product-list-wrapper " v-if="data.similarProductCaseList">
                <div class="title">相似产品</div>
                <div class="product-list clearfix">
                <div class="product-item pull-shadow" v-for="(item,index) in data.similarProductCaseList.slice(0,8)" :key="index" @click="toProductDetail(item)" :class="(index + 1) % 4==0?'no-margin-right':''">
                    <div class="imgList"><img v-if="item.pictureUrls!=undefined" :src="item.pictureUrls[0]" alt=""> <img v-else src="../../static/img/defaultLogo.png" alt=""></div>
                    <div class="name info ellipsis">{{item.productName}}</div>
                    <div class="info ellipsis">工艺：<span style="color: #a09f9f;" v-if="item.techniqueInfo!=undefined">{{item.techniqueInfo.techniqueName}}</span></div>
                    <div class="info ellipsis">材料：{{item.material}}</div>
                    <div class="info">单价：人民币[{{item.priceScope}}]/件</div>
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
            productId: '',
            data: '',
            imgList:[],
            currImg:'',
            industryName:'',
            companyName:'',
            industryList:[],
            companyTechniqueList:[],
            companyInfo:'',
        }
    },
    created() {
        this.productId = Number(this.$route.query.productId);
        this.getData();
    },
    filters: {
        // mainTechniqueFilter: function( data ) {
        //     let text = '';
        //     if ( 'companyTechniqueList' in data.companyInfo ) {
        //         data.companyInfo.companyTechniqueList.map(( item ) => {
        //             text += item.techniqueTypeText + ',';
        //         })
        //         text = text.substring( 0, text.length-1 );
        //     } else {
        //         text = '无';
        //     }
        //     return text;
        // },
        // mainIndustryFilter: function( data ) {
        //     let text = '';
        //     if ( 'companyCoopInfo' in data.companyInfo ) {
        //         if ( 'industryList' in data.companyInfo.companyCoopInfo ) {
        //             data.companyInfo.companyCoopInfo.industryList.map(( item ) => {
        //                 text += item.industryName + ',';
        //             })
        //             text = text.substring( 0, text.length-1 );
        //         } else {
        //             text = '无';
        //         }
        //     } else {
        //         text = '无';
        //     }

        //     return text;
        // }
    },
    methods: {
        toProductDetail( item ) {
            let { href } = this.$router.resolve({path:'/product-detail', query:{productId: item.id}});
            window.open(href, '_blank');
        },

        showPicture( item ) {
            this.imgList.map(( el ) => {
                el.isActive = false;
            })
            item.isActive = true;
            this.currImg = item;
        },
        getData() {
            this.$http.post('/custom/productCase/get', { id: this.productId}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.data = res.data.data;
                    this.data.pictureUrls.map(( item ) => {
                        var imgObj = {url: item, isActive: false};
                        this.imgList.push( imgObj );
                    })
                    this.imgList[0].isActive = true;
                    this.currImg = this.imgList[0];
                    this.industryName= res.data.data.industryInfo!=undefined?res.data.data.industryInfo.industryName:'';
                    this.industryList=res.data.data.companyInfo.companyCoopInfo.industryList;
                    this.companyTechniqueList=res.data.data.companyInfo.companyTechniqueList;
                    this.companyName= res.data.data.companyInfo.companyName;
                    this.companyInfo=res.data.data.companyInfo;
                }
            })
        }
    }
}
</script>

<style lang="less">
#product-detail{
    .pull-shadow{
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    }
    .pull-inline{display: inline-block!important;}
    .pull-inline+.pull-inline{
    &::before{
        content:",";
        width: 5px;
        display: inline-block;
        padding-left: 2px;
     }
    }
    .ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
     }
    div, img{
        box-sizing: border-box;
    }
    .clearfix{
        zoom: 1;
        &::after{
            display: block;
            visibility: hidden;
            clear: both;
            height: 0;
            content: '.';
        }
    }
    .content{
        width: 1200px;
        margin: 0 auto;
        margin-bottom: 40px;
        .content-mg-left{width: 1012px;}
        .bread-crumb{
             cursor: pointer;
            padding: 12px 0 10px 0;
            .LastName{color: #3f8def;cursor: initial;}
        }
        .product-info-wrapper{
            border: 1px solid #fff;
            background: #fff;
            padding: 0 38px 20px 38px;
            .top{
                padding: 5px 0 8px;
                border-bottom: 1px solid #e2e2e2;
                .title{
                    display: inline-block;
                    color: #777;
                    font-size: 16px;
                    line-height: 40px;
                }
                .btn{
                    width: 178px;
                    height: 30px;
                    float: right;
                    color: #3f8def;
                    border: 1px solid #3f8def;
                    text-align: center;
                    line-height: 29px;
                    cursor: pointer;
                    margin-top: 7px;
                    cursor: pointer;
                    &:hover{
                        background: #3f8def;
                        color: #fff;
                    }
                }
            }
            .center{
                display: flex;
                margin-top: 23px;
                .left{
                    width: 430px;
                    .boxImg{
                        width: 300px;
                        height:235px;
                        line-height:230px;
                        background-color: #ffffff;
                        border: solid 1px #e2e2e2;
                        text-align:center;
                        float: left;
                    }
                    .big-img{
                        max-width: 298px;
                        max-height: 230px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .sm-img-list{
                        width: 56px;
                        height: 240px;
                        float: left;
                        .sm-img{
                            display: block;
                            width: 66px;
                            height: 51px;
                            border: 1px solid #e2e2e2;
                            margin-left: 10px;
                            & + .sm-img{
                                margin-top: 10px;
                            }
                        }
                        .active {
                            border: 1px solid #3f8def;
                        }
                    }
                }
                .right{
                    width: 470px;
                    margin-left: 30px;
                    table{
                        tr:nth-child(even){
                            background: #fafafa;
                        }
                        tr:nth-child(odd){
                            background: #f7f7f7;
                        }
                        .td-title{
                            color: #858585;
                            width: 150px;
                        }
                        .td-content{
                            width: 312px;
                        }
                        td{
                            height: 30px;
                            vertical-align: middle;
                            text-indent: 40px;
                        }
                    }
                }
            }

        }
        .company-info-wrapper{
            border: 1px solid #fff;
            background: #fff;
            margin-top: 10px;
            margin-bottom:22px;
            .title{
                height: 45px;
                text-align: center;
                font-size: 16px;
                color: #3f8def;
                line-height: 45px;
                background: #fff;
            }
            .content-box{
                display:block;
                overflow: hidden;
                padding: 7px 38px 25px 38px;
                table{
                   width: 467px;
                   float: left;
                    td{
                        height: 30px;
                        vertical-align: middle;
                        padding: 0 20px 0 24px;
                    }
                    .td-title{
                        width: 100px;
                        color: #858585;
                    }
                    .td-content{
                        width: 270px;
                    }
                    .td-company{
                        color: #3f8def;
                        cursor: pointer;
                        &:hover{
                            text-decoration: underline;
                            opacity: .8;
                        }
                    }
                    tr:nth-child(even){
                        background: #f8f8f8;
                    }
                    tr:nth-child(odd){
                        background: #f3f3f3;
                    }
                }
            }
        }
        .product-list-wrapper{
            .title{font-size: 14px;}
            .product-list{
                margin-top: 8px;
                .product-item{
                    width: 245px;
                    height: 265px;
                    border: 1px solid #e2e2e2;
                    float: left;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    background: #fff;
                    cursor: pointer;
                    padding: 0 24px;
                .imgList{
                    width:155px;
                    height:120px;
                    line-height: 117px;
                    margin: auto;
                    text-align: center;
                    margin-top: 20px;
                }
                img{
                    display: inline-block;
                    max-width: 155px;
                    max-height: 117px;
                    vertical-align: middle;
                }
                    .info {
                    height: 14px;
                    line-height: 14px;
                    color: #a09f9f;
                    margin-bottom: 10px;
                    }
                    .name {
                        color: #777;
                        margin-top: 15px;
                        margin-bottom: 14px;
                        font-size: 15px;
                    }
                    
                } 
            }
        }
    }
    .no-margin-right{margin-right: 0!important;}
}
</style>
