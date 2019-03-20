<template>
    <div>
        <div class="container">
            <div class="zjjf-header-top zoom" id="zjjf-header">
                <div class="topbar ">
                    <div class="pull-right topbar-user user-box">
                        <div class="topbar-info-dropdown topbar-info-item">
                            <a class="topbar-info-dropdown-toggle topbar-btn" v-on:mouseenter="dataDetails($event)"><img class="topbar-user-avatar" src="https://oss.aliyuncs.com/aliyun_id_photo_bucket/default_handsome.jpg"></a>
                            <div class="topbar-info-dropdown-memu topbar-align-right" v-on:mouseleave="hiddenDetail($event)">
                                <div class="topbar-content">
                                    这是中间内容
                                </div>
                                <div class="user-btn-list">
                                    <a  class="user-btn-link" @click="doLoginOut">
                                        <span>退出控制台</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="zjjf-sidebar zoom" id="zjjf-sidebar">
                <div class="sidebar-wrapper zoom">
                    <div class="sidebar-content zoom">
                        <div class="sidebar-inner">
                        <div class="sidebar-fold icon-unfold zoom" @click="topbarSidebar"></div>
                         <div class="sidebar-nav zoom hide show" v-for="(item,indexs) in user"  >
                        <div class="sidebar-trans" v-for="(parent,index) in $router.options.routes" v-if="item.authString==parent.authString&&!parent.hidden">
                            <div class="sidebar-title sidebar-trans" @click="sidebarnav(index)">
                                <span class="sidebar-title-icon icon-arrow-right"></span>
                                <span class="sidebar-title-text">{{parent.name}}</span>
                            </div>
                            <ul class="sidebar-trans">
                                 <div v-for="(itemList,index) in item.auths">
                                <li class="nav-item " @click="navActive(index)" v-for="(child,index) in parent.children" v-if="itemList.authString==child.authString&&!child.hidden">
                                    <a @click="$router.push(child.path)">
                                    <!-- <a @click="routerLink(child)"> -->
                                        <el-tooltip v-if="navDisabled==true" class="item"  effect="dark" :content="child.name" placement="right">
                                        <div class="nav-icon sidebar-trans">
                                        <span :class="item.authString+index" class="icon-logo-new"></span>
                                      
                                            </div>
                                        </el-tooltip>
                                        <div v-else class="nav-icon sidebar-trans">
                                             <span :class="item.authString+index" class="icon-logo-new"></span>
                                        </div>
                                             <span class="nav-title"> {{child.name}}</span>
                                    </a> 
                                </li>
                                 </div>
                            </ul>
                              <!-- <router-link :to="{path:'zjjf'}">Zjjf</router-link> -->
                          </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        

            <div class="zjjf-content zoom" id="zjjf-content">
                <div class="zjjf-home zoom">
                    <div class="zjjf-home-list">
                        <div class="home-section-main zoom">
                        <div class="home-section-wrap">
                        <div class="section-container">
                            <span
                            v-for="rlink in routLink"
                            :key="rlink.path"
                            @click="packs(rlink)"
                            >
                            {{rlink.name}}
                            </span>
                                <router-view/>
                        </div>
                        </div>
                     </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
         data(){
             return{
                Id:'',
                user:'',
                num:0,
                navDisabled:false,
                routLink:[],
             }
         },
         methods:{
             /*鼠标控制个人操作*/
             dataDetails(event){
                 $(".topbar-info-dropdown-memu").css({"visibility":"visible","opacity":"1"})
             },
             hiddenDetail(event){
                 $(".topbar-info-dropdown-memu").css({"visibility":"hidden","opacity":"0"})
             },
             /*注销*/
             doLoginOut(){
                let url="/api/zjjf-auth/auth/authority/doLoginOut";
                this.$ajaxs(url).then((res)=>{
                   sessionStorage.removeItem('currentUser');
                   this.$router.push({path: '/login'});
                }).catch((error)=>{
                   sessionStorage.removeItem('currentUser');
                   this.$router.push({path: '/login'});
                })
             },
             topbarSidebar(){
                 let sidebar=$("#zjjf-sidebar");
                 let zjjfHome=$(".zjjf-home");
                 if(sidebar.hasClass("sidebar-mini")){
                     $("#zjjf-sidebar").removeClass("sidebar-mini")
                        zjjfHome.animate({"left":"180px"},100)
                         this.navDisabled=false;
                 }else{
                      sidebar.addClass("sidebar-mini")
                       zjjfHome.animate({"left":"50px"},100)
                       this.navDisabled=true;
                 }
             },
             sidebarnav(index){
                 this.num++
                $(".sidebar-nav").eq(index-1).addClass("sidebar-nav-active").siblings().removeClass("sidebar-nav-active");
                $(".sidebar-nav").eq(index-1).find("ul").toggle(100).parent().parent().siblings().find("ul").hide(100);
                $(".sidebar-nav ul li a").removeClass("active")
             },
             navActive(index){
              $(".sidebar-nav-active ul li a").eq(index).addClass("active").parent().parent().siblings().find("a").removeClass("active")
             },
         },
         mounted(){
           this.user=JSON.parse(sessionStorage.getItem('currentUser'));
        //    this.authMainPage();
         }
    }
</script>
<style lang="scss">
*, *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
}
body, h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6{
    font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", STHeiti, "Microsoft YaHei";
}
.hide {
    display: none!important;
}
.show {
    display: block!important;
}
.zoom{zoom: 1;}
[class^="icon-"], [class*=" icon-"]{
    font-family: 'aliyun-console-font' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
    .section-title{
        min-height: 50px;
        h5{
            font-size: 14px;
            display: inline-block;
            text-indent: 8px;
            border-left: 2px solid #88B7E0;
            margin-top: 8px;
            margin-bottom: 8px;
        }
    }
    .section-title-border{
        border-bottom: 1px solid #DDD;
    }
    .pull-left{
       float: left!important;
    }
    .pull-right{
       float: right!important;
    }
    .section-ng-scope{
        margin-top: 30px;
        .expands {
          border: 1px solid #efefef;
        }
    }
</style>

<style lang="scss"  scoped>
    .el-tooltip__popper{display:none!important;}
    .container{
        position: relative;
    }
    .zjjf-header-top{
        width: 100%;
        height: 50px;
        background-color: #373d41;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
        .pull-right{
            float: right;
            .topbar-info-item{
               display: inline-block;
            }
            .topbar-info-dropdown{
                position: relative;
                .topbar-info-dropdown-toggle{
                    color: #fff;
                }
            }
            .topbar-btn{
                padding: 0 12px;
                height: 50px;
                display: block;
                z-index: 2;
                border-right: 1px solid #2a2f32;
                font-size: 14px;
                line-height: 50px;
                text-decoration: none;
                cursor: pointer;
                    &:hover{
                        background: #42485b;
                    }
            }
            }
            .topbar-user .topbar-user-avatar{
                    width: 36px;
                    height: 36px;
                    border-radius: 18px;
                    vertical-align: middle;
            }
            .topbar-info-dropdown-memu{
                    padding: 0;
                    position: absolute;
                    top: 100%;
                    right: 0;
                    visibility: hidden;
                    float: left;
                    list-style: none;
                    background-color: #fff;
                    background-clip: padding-box;
                    z-index: 1;
                    font-size: 12px;
                    min-width: 100%;
                    margin: 0;
                    border: none;
                    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.1);
                    box-shadow: 0 1px 3px rgba(0,0,0,.2);
                    -webkit-transition: opacity .15s,visibility 0s .15s;
                    transition: opacity .15s,visibility 0s .15s;
                    opacity: 0;
                    filter:alpha(opacity=0);
                    white-space: nowrap;
                    .topbar-content{
                        overflow: hidden;
                        width: 270px;
                        margin: 8px 0;
                        padding: 8px 15px;
                    }
                    .user-btn-list{
                        height: 50px;
                        line-height: 50px;
                        display: block;
                        -webkit-transition: all .15s;
                        transition: all .15s;
                        text-align: center;
                        color: #333;
                        background-color: #f5f5f6;
                        border-top: #eaeaea;
                        .user-btn-link{
                                display: block;
                                cursor: pointer;
                        }
                    }
                    
            }
    }
    .zjjf-sidebar{
    position: fixed;
    top: 50px;
    bottom: 0;
    left: 0;
    background-color: #333744;
    z-index: 109;
        span,a,p,li{
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        letter-spacing: 0.02em;
        }
    .sidebar-wrapper{
        box-sizing:border-box;
            .sidebar-content{
                .sidebar-nav-active{
                    .sidebar-title-icon{
                        transform: rotate(90deg);
                    }
                }
                .sidebar-inner{position: relative;}
                width: 180px;
                height: 100%;
                overflow: auto;
                overflow-x: hidden;
                overflow-y: hidden;
                position: relative;
                .sidebar-fold{
                    height: 30px;
                    width: 100%;
                    background: #4a5064;
                    color: #aeb9c2;
                    text-align: center;
                    line-height: 30px!important;
                    font-size: 12px;
                    -ms-user-select: none;
                    user-select: none;
                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                }
                .icon-unfold{
                    &:before{
                        content: '三';
                    }
                      &:hover{
                           &:before{
                                color: #fff
                           }
                        }
                }
                .sidebar-nav{
                    width: 100%;
                    overflow-x: hidden;
                    overflow-y: auto;
                    transition: all .2s;
                    .sidebar-title-icon{
                        display: inline-block;
                        margin: 0 8px 0 20px;
                        vertical-align: middle;
                    }
                    .icon-arrow-right{
                        &::before{
                            content:">";
                        }
                    }
                     .nav-icon{
                                width: 50px;
                                text-align: center;
                                font-size: 16px;
                                float: left;
                                color: #aeb9c2;
                                .icon-logo-new{
                                    transition:color .2s;
                                }
                                .adm0{
                                    &::before{
                                        content: "\2715";
                                    }
                                }
                                .adm1{
                                    &::before{
                                        content: "\2715";
                                    }
                                }
                                .adm2{
                                    &::before{
                                        content: "\2715";
                                    }
                                }
                                .auth0{
                                    &::before{
                                        content: "\2715";
                                    }
                                }
                                .auth1{
                                    &::before{
                                        content: "\2715";
                                    }
                                }
                                .auth2{
                                    &::before{
                                        content: "\2715";
                                    }
                                }
                                  .auth3{
                                    &::before{
                                        content: "\2715";
                                    }
                                }
                     }
                        .nav-title{
                        float: left;
                        overflow: hidden;
                        color: #fff;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        display: block;
                        width: 130px;
                        text-align: left;
                        }
                    .sidebar-title{
                            height: 40px;
                            background: #42485b;
                            color: #fff;
                            line-height: 40px;
                            position: relative;
                            cursor: pointer;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            overflow: hidden;
                            text-align: left;
                            &:hover{
                                background-color: #00c1de;
                            }
                    }
                    ul{
                        width: 200px;
                        margin: 0;
                        padding: 0;
                        list-style: none;
                        overflow-y: scroll;
                        overflow-x: hidden;
                        display: none;
                            li{
                                position: relative;
                                cursor: pointer;
                                a{
                                    display: block;
                                    width: 180px;
                                    height: 40px;
                                    line-height: 40px;
                                    overflow: hidden;
                                    color: #fff;
                                    &:hover{
                                        background-color: #4A5064;
                                        .icon-logo-new{color: #fff;}
                                    }
                                }
                             a.active{
                                 background: #00c1de;
                                 .icon-logo-new{color: #fff;}
                             }   
                            }
                    }
  
                }
            }
        }
    }
          .sidebar-mini{
            .sidebar-content{
                width:50px!important;
                display:block;
                .sidebar-nav{
                    .sidebar-title-text{display: none !important;}
                    ul{
                    width:70px!important;
                    li a{
                        width:50px;
                        }
                    }
                }
            }
            .talkbubble {
            width: 120px;
            height: 80px;
            background: red;
            position: relative;
            -moz-border-radius:    10px;
            -webkit-border-radius: 10px;
            border-radius:         10px;
            }
            .talkbubble:before {
            content:"";
            position: absolute;
            right: 100%;
            top: 26px;
            width: 0;
            height: 0;
            border-top: 13px solid transparent;
            border-right: 26px solid red;
            border-bottom: 13px solid transparent;
            }
        }
    .zjjf-content{
            background: #eaedf1;
                .zjjf-home{
                    width: auto;
                    position: absolute;
                    left: 180px;
                    top: 50px;
                    right: 0;
                    bottom: 0;
                    .zjjf-home-list{
                         background: #eaedf1;
                         overflow:hidden;
                    }
                    .home-section-main{
                    padding: 0 8px;
                    position: relative;
                    .home-section-wrap{
                        margin: 16px 8px;
                        .section-container{
                            padding: 16px 16px;
                            background: #fff;
                            box-shadow: 0 1px 1px rgba(0,0,0,0.15);
                        }
                    }
                    }

                }
    }
</style>
