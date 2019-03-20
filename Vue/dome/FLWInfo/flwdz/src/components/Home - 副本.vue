<template>
    <div class="FMC" id="FMC">
    	<!--nav-banner-->
    	     <div class="header header_section" id="header">
    	     <div class="mod-top-wr">
    		  <div class="navTop" id="navTop">
    			<div class="nav-content">
    				<a href="#" class="logo fl"><img src="../assets/logo1.png"/></a>
    				<ul class="navlist fl">
    					<li><a href="#" class="padding-R">游戏中心</a></li>
    					<li><a href="#">直播</a></li>
    					<li><a href="#">福利社</a></li>
    					<li><a href="#">周边	</a></li>
    				</ul>
    				<ul class="navlist fr">
    					<li><a href="#" class="padding-R nav-download">下载手机端</a></li>
    					<li><a href="#" class="nav-avatar">登陆</a>/<a href="#" class="nav-login">注册</a></li>
    					<li><a href="#" class="nav-upload"></a></li>
    				</ul>
    			</div>
    		</div>
    		<!--搜索-->
    		<div class="banner banner_section">
    			<div class="search">
    				<div class="search-input-warp">
    				<input type="text" name="" id="search-text" ref="searchTxt" @keyup.enter="searchBtn"  v-on:focus="changeFocus" v-on:blur="changeCount"  v-model.trim="searchVal" placeholder="枫橙之恋"/>
    				<span class="search-btn" id="search-btn" @click="searchBtn "><i></i></span>
    				<div class="search-dropdown open" v-if="search!=''" :style="searHeight">
    					<ul class="dropdown-list">
    						<li v-for="(item,index) in search"><a :href="https+item.name">{{item.name}}</a></li>
    					</ul>
    				</div>
    			</div>
    			</div>
    		</div>
    		<!--导航-->
    		<div class="nav nav_section" id="navTop2">
    				<div class="nav-content">
    					<ul class="clearfix">
    						<li v-for="(item,index) in itemname" :class="item.id==1?'active':''" @click="cleartxt(item,index)">
    							<a href="#" >{{item.name}}</a>
    						</li>
    					</ul>
    			</div>
    		</div>
    		</div>
    	    </div>
    		
    		<div class="main" id="main">
 			<section class="newyear-bg-wrap area over-flow">
 			<!--banner-warp-->
 			<div class="ui-wm banner-warp clearfix over-flow" id="banner-warp">
	    	<div class="blur-banner" id="blur-banner">
	    		<div class="banner-con">
	    		<div class="bx-wrapper" style="max-width: 9000px;">
	    			<div class="bx-viewport">
	    				<ul class="in-banner" id="in-banner"></ul>
	    			</div>
	    		</div>
	    		</div>
	    	</div>
	    	<div class="rank-wr">
	    		<div class="tab-handle">
	    			<ul id="rank-handle">
	    				<li></li>
	    			</ul>
	    		</div>
	    		<div id="rank-panel" class="tab-content-wr">
	    			<div class="tab-content clearfix">
	    				<ul class="rank-list">
	    					<li>11</li>
	    				</ul>
	    			</div>
	    			<div class="tab-content clearfix"></div>
	    			<div class="tab-content clearfix"></div>
	    		</div>
	    		<ul class="rank-recommend">
	    			<li></li>
	    		</ul>
	    	</div>
	   	</div>
 		</section>
 		
 		<section class="ui-wm area column-box area-monkey">
 		<!--推荐-->
	    <div class="sample-warp">
	    	<header class="clearfix area-header">
	    		<h3 class="fl area-title">
	    			<img src="http://imgs.aixifan.com/cms/2017_11_01/1509533250991.gif?imageView2/1/w/100/h/100" data-original="http://imgs.aixifan.com/cms/2017_11_01/1509533250991.gif?imageView2/1/w/100/h/100" class="fl" />
	    			<b>猴子推荐</b>
	    			<p>吃我蕉啦！</p>
	    		</h3>
	    	</header>
	    	<div class="sample_box">
	    	<ul class="sample-content">
	    		<li class="fl block-box block-video  no-animate" v-for="(item,index) in danmu">
	    			<a href="#" class="block-img">
	    				<div class="pic">
	    					<img class="pic-img" :src="item.http" />
	    				</div>
	    			</a>
	    			<p href="" class="block-title">
	    				<b><a :href="item.href" target="_blank" :title="item.titleOne">{{item.titleOne}}</a></b>
	    				<span><a :href="item.href" target="_blank" :title="item.titleTwo">{{item.titleTwo}}</a></span>
	    			</p>
	    		</li>
	    	</ul>
	    	<a href="#" class="sample-img"><img src="https://i0.hdslb.com/bfs/sycp/creative_img/201804/ee42e40a2557b9f4decc40a847076379.jpg" alt="大吉大利,今晚吃鸡" /></a>
	    	</div>
	    </div>
 		</section>
 		<section class="ui-wm clearfix area column-box">
 		<!--畅销-->
 		<div class="column-left"></div>
 		<div class="column-right"></div>
 		</section>
 		<section class="ui-wm clearfix area column-box">
	    <!--连载-->
	    <div class="column-left"></div>
 		<div class="column-right"></div>
 		</section>
 		<section class="ui-wm clearfix area column-box area-channel">
	    <!--国产-->
	    <div class="column-left"></div>
 		<div class="column-right"></div>
 		</section>
 		<section class="ui-wm clearfix area column-box area-channel">
	    <!--国产-->
	    <div class="column-left"></div>
 		<div class="column-right"></div>
 		</section>
 		<section class="ui-wm clearfix area column-box area-channel">
	    <!--国产-->
	    <div class="column-left"></div>
 		<div class="column-right"></div>
 		</section>
 		<section class="ui-wm clearfix area column-box area-channel">
	    <!--国产-->
	    <div class="column-left"></div>
 		<div class="column-right"></div>
 		</section>
 		<section class="ui-wm clearfix area column-box area-channel">
	    <!--国产-->
	    <div class="column-left"></div>
 		<div class="column-right"></div>
 		</section>
 		<section class="ui-wm clearfix area column-box area-channel">
	    <!--国产-->
	    <div class="column-left"></div>
 		<div class="column-right"></div>
 		</section>
 		</div>
 		
 		<div class="footer" id="footer"></div>
 		
 		<!--<div style="width: 200px;height: 200px;float: left;" v-for="(item,index) in photosList">
 			<img class="photosImg" src="" :guoyu-src="item.url" style="width: 200px;height: 150px;"/>
 			<p>{{item.albumId}}--{{item.title}}</p>
 		</div>-->
    </div>
</template>

<script>
	// 节流函数(发请求造成页面的卡顿)
	const delay = (function() {
	  let timer = 0;
		  return function(callback, ms) {
		    clearTimeout(timer);
		    timer = setTimeout(callback, ms);
	  };
	})();
export default {
  name: 'Home',
  data () {
    return {
      https:'http://www.acfun.cn/search/#query=',
      msg: '这是首页2662',
      searchVal:'',
      search:[],
      searHeight:'',
      photosList:'',
      index:1,
      itemname:[
      {name:'首页',id:1},
      {name:'AC正义',id:0},
      {name:'动画',id:0},
      {name:'二次元',id:0},
      {name:'国产',id:0},
      {name:'音乐',id:0},
      {name:'舞蹈-彼女',id:0},
      {name:'游戏',id:0},
      {name:'娱乐',id:0},
      {name:'科技',id:0},
      {name:'影视',id:0},
      {name:'体育',id:0},
      {name:'鱼塘',id:0},
      {name:'文章',id:0},
      ],
       goodsList:[
        //假数据
        {name:"三星Galaxy Note8",price:5200,sales:2.6},
        {name:"iphone5s",price:2500,sales:2.2},
        {name:"iphone6",price:2800,sales:1.6},
        {name:"iphone6s",price:3200,sales:2.9},
        {name:"iphone7",price:3800,sales:12.6},
        {name:"iphone7plus",price:4200,sales:2.1},
        {name:"iphone8",price:5500,sales:10.6},
        {name:"华为",price:4600,sales:7.6},
        {name:"小米",price:1200,sales:32.6},
        {name:"OPPOR11",price:3000,sales:1.2},
        {name:"vivoX20",price:3250,sales:2.9}
    ],
    danmu:[
    	{http:'http://imgs.aixifan.com/content/2018_04_17/1523949725.jpg?imageView2/1/w/320/h/180',href:'http://www.acfun.cn/v/ac4314669',titleOne:'刘老师逆天吐槽解忧杂货店',titleTwo:'UP: 刘老师说电影'},
    	{http:'http://imgs.aixifan.com/content/2018_04_15/1523795836.gif?imageView2/1/w/320/h/180',href:'http://www.acfun.cn/v/ac4311581',titleOne:'37款IGN满分游戏了解一下？',titleTwo:'UP: 游戏van家'},
    	{http:'http://imgs.aixifan.com/content/2018_04_15/1523803543.gif?imageView2/1/w/432/h/240',href:'http://www.acfun.cn/v/ac4313682',titleOne:'刘老师逆天吐槽解忧杂货店',titleTwo:'UP: 刘老师说电影'},
    	{http:'http://imgs.aixifan.com/content/2018_04_16/1523876600.gif?imageView2/1/w/432/h/240',href:'http://www.acfun.cn/v/ac4315189',titleOne:'刘老师逆天吐槽解忧杂货店',titleTwo:'UP: 刘老师说电影'},
    	{http:'http://imgs.aixifan.com/content/2018_04_17/1523957267.gif?imageView2/1/w/320/h/180',href:'http://www.acfun.cn/v/ac4313595',titleOne:'刘老师逆天吐槽解忧杂货店',titleTwo:'UP: 刘老师说电影'}
    ]
    }
  },
watch: {
  //实时更新搜索数据
    searchVal() {
      delay(() => {
        this.fetchData();
      }, 300);
    },
  },
  methods:{
  	//导航
  	cleartxt(obj,index){
  		for(var i=0;i<this.itemname.length;i++){
			if(this.itemname[i].id==1){
				this.itemname[i].id=0
			}
		}
		obj.id=1
  	},
  	//实时搜索
  	fetchData(ovj){
		var _this = this;
		let url='http://search.acfun.cn/suggest?cd=1&sys_name=pc&q='
		_this.$http.get(url +_this.searchVal,{ headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
      let maps = response.data.split('=');
   	  let obj = eval('(' + maps[1] + ')');
   	  _this.search=obj.data
      _this.searHeight='height:'+_this.search.length*30+'px';    //数据显示并添加高度
    },(response) => {
      console.log("失败")
    });
  	},
  	searchBtn(){
  		this.fetchData(this.$refs.searchTxt.value)
  	},
  	//失去焦点触发
  	changeCount(){
  		this.search='';
  	},
  	//获取焦点
  	changeFocus(){
  		this.fetchData(this.$refs.searchTxt.value)
  	},
  	photos(page){
  		let url="http://jsonplaceholder.typicode.com/photos?albumId=";
  		this.$http.get(url+page).then((response)=>{
  			console.log(response.data)
  			this.photosList = response.data
  		},(response)=>{
  			
  		})
  		 this.index++;
  	},
  	photosImg(){
  		var aImg = document.querySelectorAll('img');
        var len = aImg.length;
        console.log(len)
//      var n = 0;//存储图片加载到的位置，避免每次都从第一张图片开始遍历sample-content
//      window.onscroll = function() {
//          var seeHeight = document.documentElement.clientHeight;
//          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
//          for (var i = n; i < len; i++) {
//              if (aImg[i].offsetTop < seeHeight + scrollTop) {
//                  if (aImg[i].getAttribute('src') == '') {
//                      aImg[i].src = aImg[i].getAttribute('guoyu-src');
//                  }
//                  n = i + 1;
//                  console.log('n = ' + n);
//              }
//          }
//      };

  },
     scrollTops(){
     	 $(window).scroll(function() {
	 	  let scrollT = $(window).scrollTop(); //滚动条top 
	 	  let navTop = document.getElementById('navTop');
	 	  let navTop2 = document.getElementById('navTop2');
	 	  console.log(scrollT)
	 	  if(scrollT>=50){
	 	  	navTop.style.position="fixed";
	 	  }
 	   	  if(scrollT>=135){
 	  		navTop2.style.position="fixed";
 	  		navTop2.style.top="47px";
	 	  }
 	   	  if(scrollT<=95){
 	  		navTop2.style.position="static";
 	  		navTop2.style.top=" ";
	 	  }
 	   	  if(scrollT=0){
	 	  	navTop.style.position="static";
	 	  }
		 })
     },
  },
  mounted(){
  	let _this=this
  	this.photos(1);
  	this.scrollTops();
//	_this.photos(0); //加载第一页
//	 var totalpage = 7; //总页数，防止超过总页数继续滚动
//              var winH = $(window).height(); //页面可视区域高度 
//              $(window).scroll(function() {
//                  if (_this.index < totalpage) { // 当滚动的页数小于总页数的时候，继续加载
//                      var pageH = $(document.body).height();
//                      var scrollT = $(window).scrollTop(); //滚动条top 
//                      var aa = (pageH - winH - scrollT) / winH;
//                      if (aa < 0.01) {
////                         _this.photos(_this.index)
//                      }
//                  }
//              });


//	let urs='http://search.acfun.cn/suggest?cd=1&sys_name=pc&q=黑&_=1521193455763'
//	console.log(urs)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
	.fl{float: left;}
	.fr{float: right;}
	.clearfix {zoom: 1;}
	.ui-wm{width: 1200px;margin:0 auto;}
	.area{
		margin-bottom: 36px;clear: both;
		.area-header{margin-bottom: 10px;height: 40px;overflow: hidden;}
		.area-title{
			height: 40px;line-height: 40px;float: left;font-size: 12px;
			img{
				width: 40px;
				height: 40px;
				display: initial;
				border-radius: 0%;
				margin-right: 12px;
				float: none;
				vertical-align: middle;
			}
			b{
				font-size: 18px;
				font-weight: bold;
				color: #122;
				display: inline-block;
				margin-right: 16px;
			}
			p{
				color: #999;
				display: inline-block;
			}
		  }
		}
	.over-flow{overflow: hidden;}
	.column-box{.column-left{width: 890px;float: left;} .column-right{width: 270px;float:right;}}
</style>
<style scoped lang="scss">
		#navTop ,#navTop2{z-index: 999;}
		.fl{float: left;}
		.fr{float: right;}
		.padding-R{padding-right: 10px;}
  	.FMC{
  		width: 100%;
  		background: #fff;
  		text-align: left;
  		.navTop ,.nav{
  			width: 100%;
  			height: 46px;
  			background: #fff;
  			border-bottom: 1px solid #d8d8d8;
  			.nav-content{
  				width: 1200px;
  				margin: 0 auto;
  				line-height: 46px;
  				overflow: hidden;
  			}
  		}
  		.navTop{
  			.nav-content{
  				.logo{
  					height: 27px;
  					padding: 8px 0 12px;
    				margin-right: 30px;
  					img{
  						width: 100px;
  						height: 25px;
  					}
  				}
  			.navlist{
  				display: inline-block;
  					li{float: left;display: block;}
  					li+li{margin:0 10px;}
  					.nav-upload:before{
  						content: url(../assets/chuang.png);
  						display: block;
  						padding-top: 1px;
  					}
  					.nav-download{
  						display: block;
  						position: relative;
  							&:before{
  							content:'';
  						 background:url(../assets/phone.png) no-repeat;
						    background-size: cover;
						    display: inline-block;
						    position: absolute;
						    top: 7px;
						    left: -25px;
						    width: 30px;
						    height: 30px;
  					}
  					}
  			}	
  			}
  		}
  		.banner{
  			width: 100%;
  			height: 180px;
  			background:url(../assets/1521086301000.jpg) no-repeat;
  			background-size: cover;
  			position: relative;
  			.search{width: 1200px;
			margin:0 auto;
			position:relative;
			height:100%;
			.search-input-warp{
  				position: absolute;
  				width: 330px;
  				height: 35px;
  				border:1px solid #e0e0e0;
   				background: #fff;
 					top: 50%;
 					right: 0;
 					margin-top: -17.5px;
  				border-radius: 5px;
  				-webkit-border-radius: 5px;
  				-moz-border-radius:5px;
  				transition: all .4s;
  				-webkit-transition: all .4s;
  				-moz-transition: all .4s;
  				box-sizing: border-box;
  				-webkit-box-sizing: border-box;
  				-moz-box-sizing: border-box;
  					#search-text{
  						outline: none;
  						width: 100%;
  						height: 100%;
  						line-height: 35px;
  						float: left;
  						border: none;
  						border-radius: 5px;
  						background: transparent;
  						font-size: 14px!important;
						transition: all .4s;
						-webkit-transition: all .4s;
					    -moz-transition:all .4s;
					    -o-transition: all .4s;
						text-indent: 10px;
						z-index: 2;
  					}
  					#search-btn{
  						border:none;
  						width: 40px;
  						height: 33px;
  						position: absolute;
  						cursor: pointer;
  						right: 0;
  						top: 0;
  						z-index: 3;
  						background: #fff;
  						border-top-right-radius: 5px;
    					border-bottom-right-radius: 5px;
    					-webkit-border-top-right-radius:5px;
    					-moz-border-top-right-radius:5px;
    					-webkit-border-bottom-right-radius:5px;
    					-moz-border-bottom-right-radius:5px;
						i{
							width: 100%;
							height: 100%;
							display: block;
						}
						i:before{
						content: '';
							background: url(../assets/Cable.png) no-repeat;
							background-size: 96%;
							position: absolute;
							top: 0;
					    	right: 5px;
						    width: 35px;
						    height: 35px;
						}
		  					}
	  					.search-dropdown{
	  						position: absolute;
	  						z-index: 888;
	  						color: #2C3E50;
	  						top: 35px;
	  						left: 0;
	  						width: 100%;
	  						height: 0;
	  						border-radius: 5px;
	  						background: #fff;
	  						box-shadow: 0 2px 4px rgba(0,0,0,.15);
	  						box-sizing: border-box;
	  						-webkit-box-sizing: border-box;
  							-moz-box-sizing: border-box;
	  						transition: all .17s ease;
	  						-webkit-transition:all .17s ease;
						    -moz-transition:all .17s ease;
						    -o-transition: all .17s ease;
	  						padding: 0;
	  						overflow: hidden;
  							.dropdown-list{
  								display: block;
  								box-sizing: border-box;
  								-webkit-box-sizing: border-box;
  								-moz-box-sizing: border-box;
							li{
								cursor: pointer;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								font-size: 12px;
								line-height: 20px;
								text-align: left;
								 &:hover{background: rgba(30,144,255,0.3);}
								a{
									display: inline-block;
								    width: 100%;
								    color: #333;
								    transition: all .17s ease;
								    -webkit-transition:all .17s ease;
								    -moz-transition:all .17s ease;
								    -o-transition: all .17s ease;
								    text-decoration: none;
								    padding: 5px 12px;
								    box-sizing: border-box;
								    -webkit-box-sizing: border-box;
  									-moz-box-sizing: border-box;
								    	&:hover{
	  											color: #1e90ff;
	  										}
								}
						
							}
  						}
			  		}
			  	}
			}
	}
  		.nav{
  			.clearfix{
  				height: 46px;overflow: hidden;
  					li{
  						 float: left;margin-right: 35px;
  						  &:last-child{margin-right: 0;}
  					}
  					  .active a{
  					  		height: 46px;
  					  		display: block;
  					  		color: red;
  						  	border-bottom: 3px solid red;
  						  	box-sizing: border-box;
  						  	-webkit-box-sizing: border-box;
  							-moz-box-sizing: border-box;
  						  	
  						  }
  				}
  		}
  	.banner-warp{
  		margin-top: 10px;
  		.blur-banner{
  			float: left;
  			width: 910px;
  			overflow: hidden;
  			position: relative;
  			background: #ddd;
  			.banner-con{
  				position: relative;
  				.bx-wrapper{
  				height: 355px !important;
  				position: relative;
  				.bx-viewport{
  					width: 100%;
  					height: 355px;
  					overflow: hidden;
  					position: relative;
  					.in-banner{
  						width: auto;
  					    height: 355px;
  					    overflow: hidden;
  					    position: relative;
  					    }
  				}
  			  }
  			}
  		}
  		.rank-wr{
  			width: 275px;
  			height: 355px;
  			overflow: hidden;
  			padding: 3px 12px 0 14px;
  			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
  			float: right;
  			background: #ddd;
  			.rank-handle li{
  				float: left;
  				height: 48px;
  				font: 18px/48px 微软雅黑;
  			}
  			.tab-content-wr{
  				.tab-content{
  					margin-top: 22px;
  					height: 212px;
  					overflow: hidden;
  					.rank-list{
  						float: left;
  						li{
  							width: 122px;
						    height: 18px;
						    margin-bottom: 8px;
						    overflow: hidden;
						    zoom: 1;
  						}
  					}
  				}
  			}
  			.rank-recommend{
  				li{
  				float: left;
			    width: 118px;
			    height: 18px;
			    padding-top: 10px;
			    line-height: 18px;
			    margin-right: 10px;
			    overflow: hidden;
  				}
  			}
  		}
  	}	
  	.sample-warp{
  		position: relative;
  		height: 200px;
  		.sample_box{height: 150px;overflow:hidden;}
  		.sample-content{
  			width: 910px;
  			height: 150px;
  			float: left;
  			li+li{margin-left: 25px;}
  			li{
  				float: left;
  				width: 160px;
				.block-img{
					border-radius: 3px;
					display: block;
					margin-bottom: 7px;
					.pic{
						position:relative;
						.pic-img{
						width:100%;
						height:100px;
						border-radius: 3px;
					}
					}
				}
  				}
  				.block-video{
  					.block-title{
  						position: relative;
						height: 40px;
						overflow: hidden;
						transition:all .2s ease;
						-webkit-transition:all .2s ease;
						-moz-transition:all .2s ease;
						b{
						overflow: hidden;
						display: block;
						line-height: 20px;
						}
						span{
							a{color: #999;}
						}
						b>a:hover,span>a:hover{
							color: orangered;
						}
  					}
  				}
  		}
  		.sample-img{
  			width: 270px;
  			height: 150px;
  			display: inline-block;
  			float: right;
  			background: #ddd;
  			img{
  				width: 100%;
  				height: 150px;
  			}
  		}
  	}
  	}
</style>
