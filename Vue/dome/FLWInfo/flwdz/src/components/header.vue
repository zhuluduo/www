<template>
   <div class="header" id="header">
		 <div class="header-main">
				<div class="header-title">
					<div class="wp pull-ov">
						<div class="header-title-left pull-left">
							<div class="header-title-left-cnt pull-ov pull-left">
								<img class="pull-left" src="http://dw.szazkj.com/static/b6/af/b3/74/868/311/e89/0c7/005056a828db.png" alt="">
								<span>主站</span>
							</div>
							<div class="header-title-left-cnt pull-ov">
								<img class="pull-left" src="http://dw.szazkj.com/static/b6/af/b3/74/868/311/e89/0c7/005056a828db.png" alt="">
								<span>主站</span>
							</div>
						</div>
						<div class="header-title-right pull-right ">
							
						</div>
					</div>
				</div>
				<div class="header-banner">
						<div class="SearchBox">

						</div>
				</div>
		 </div>
		 <div id="header-nav" class="header-nav">
			 <div class="wp">
					<div class="header-nav-list">
						<ul class="pull-ov">
							<li class="active">项目一</li>
							<li>项目二</li>
							<li>项目三</li>
							<li>项目四</li>
							<li>项目五</li>
							<li>项目六</li>
						</ul>
						<div id="inputSearch" class="inputSearch">
							<input type="text" id="search-text" ref="searchTxt" v-model="searchVal" @keyup.enter="searchBtn">
							<span class="search-btn" id="search-btn" @click="searchBtn ">搜索</span>
							<div id="search-dropdown" class="search-dropdown search-dropdown-hide">
								<ul class="dropdown-list" v-if="search!=''">
									<li v-for="(item,index) in search.slice(0,5)" @click="searchGo(item)"><p>{{item.name}}</p></li>
								</ul>
							</div>
						</div>
					</div>
			 </div>
		 </div>
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
  data () {
    return {
			searchVal:'',
			search:[]
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
		/*滚动导航*/
		headscroll(){
			let headerScroll=document.getElementById('header-nav')
			let inputSearch=document.getElementById('inputSearch')
			window.onscroll=function(){
				let scrolltop=document.documentElement.scrollTop||document.body.scrollTop;
				if(scrolltop>=180){
					headerScroll.className='header-nav-active';
					inputSearch.style.top='50%';
				}else{
					headerScroll.className='header-nav';
					inputSearch.style.top='-200%';
				}
			}
		},
		/*搜索*/
		searchBtn(){
			this.fetchData(this.$refs.searchTxt.value)
		},
// 		/*获取焦点*/
// 		changeFocus(){
// 			this.fetchData(this.$refs.searchTxt.value)
// 		},
// 		/*失去焦点*/
// 		changeCount(){
// 			this.search=[];
// 			let searchDor=document.getElementById('search-dropdown');
// 			searchDor.className='search-dropdown search-dropdown-hide';
// 		},
		/*实时搜索*/
		fetchData(ovj){
		let url='https://s.search.bilibili.com/main/suggest?jsoncallback=jQuery172013447496224619382_1532052599991&func=suggest&suggest_type=accurate&sub_type=tag&main_ver=v1&highlight=&userid=0&bangumi_acc_num=1&special_acc_num=1&topic_acc_num=1&upuser_acc_num=3&tag_num=10&special_num=10&bangumi_num=10&upuser_num=3&term='
		this.$http.get(url +this.searchVal+'&rnd=0.0648155621633777&_=1532052610861',{ headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
			console.log(response.data)
//       let maps = response.data.split('=');
//    	  let obj = eval('(' + maps[1] + ')');
//    	  this.search=obj.data;
// 			this.searcList(obj.data)
		},(response) => {
			console.log("失败")
		});
		},
		/*获取详细列表*/
		searcList(ovj){
			console.log(ovj)
			if(ovj!=''){
				let searchDor=document.getElementById('search-dropdown');
				searchDor.className='search-dropdown search-dropdown-show'
			}
		},
		/*搜索内容跳转*/
		searchGo(obj){
			console.log(obj)
		},
  },
  mounted(){
		this.headscroll();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
	
</style>
<style scoped lang="scss">
	li{list-style: none;}
	.pull-left{float: left;}
	.pull-right{float: right;}
	.pull-ov{overflow: hidden;}
	.clearfix {zoom: 1;}
	.wp{width: 1200px;margin: 0 auto;}
	#header{
		width: 100%;
		height: 280px;
		position: relative;
		.header-main{
			width: 100%;
			height: 230px;
			background: #0086B3;
			.header-title{
				width: 100%;
				height: 50px;
				position: fixed;
				top: 0;
				left: 0;
				z-index: 999;
				&:before{
					content: '';
					width: 100%;
					height:100%;
					position: absolute;
					top: 0;
					left: 0;
					background: #19469D;
					filter: alpha(opacity=20);
					-moz-opacity: 0.2;
					-khtml-opacity: 0.2;
					opacity: 0.2;
					z-index: 888;
				}
				.wp{margin: 7.25px auto;}
				.header-title-left{
					.header-title-left-cnt+.header-title-left-cnt{margin-left:20px}
					.header-title-left-cnt{
						line-height:35px;
						float:left;
						img{
							display: block;
							width: 35px;
							height: 35px;
						}
						span{float: left;}
					}
				}
			}
			.header-banner{
				width: 100%;
				height: 230px;
				.SearchBox{
					width: 1200px;
					height: 230px;
					margin:0 auto;
					position: relative;
				}
			}
		}
		#header-nav{
			width: 100%;
			height: 50px;
			background: #0A76A4;
			.header-nav-list{
				position: relative;
				ul{width: 100%;
				height: 100%;
				line-height: 50px;
				-o-box-sizing: border-box;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;}
				li{
					float:left;
					list-style: none;
					position: relative;
					padding: 0 10px;
					font-size: 14px;
				}
				.active{
					&:before{
						content: '';
						width: 100%;
						height: 0px;
						border-bottom:2px solid red;
						position: absolute;
						bottom: 0;
						left: 0;
					}
				}
				#inputSearch{
					width: 100%;
					position: absolute;
					top: -200%;
					right: 0;
					margin-top: -15px;
					text-align: right;
					input{
						width: 220px;
						height: 30px;
						border-radius:5px;
						border-top-right-radius: 0px;
						border-bottom-right-radius: 0px;
						border:0;
						outline:none;
						text-indent: 10px;
					}
					span{
						display: inline-block;
						font-size: 13px;
						cursor: pointer;
						background: #3f8def;
						color:#fff;
						margin-left: -3px;
						padding: 6.5px 10px;
						vertical-align: bottom;
						border-top-right-radius: 5px;
						border-bottom-right-radius: 5px;
					}
					.search-dropdown{
						width:265px;
						background: #fff;
						position: absolute;
						right: 1px;
						display: block;
						border-radius: 5px;
						z-index: 999;
						-webkit-transition:all .2s;
						-o-transition:all .2s;
						transition:all .2s;
						.dropdown-list{
							width: 100%;
							height: 100%;
							padding:10px 5px;
							overflow: hidden;
							text-align: left;
							li{
								width: 100%;
								line-height: 25px;
								padding: 0 5px;
								-o-box-sizing: border-box;
								-webkit-box-sizing: border-box;
								box-sizing: border-box;
								-webkit-transition:all .2s;
								-o-transition:all .2s;
								transition:all .2s;
									&:hover{
										padding-left: 10px;
										-o-box-sizing: border-box;
										-webkit-box-sizing: border-box;
										box-sizing: border-box;
										background-color:#e5e9ef;
										p{
											color: #3f8def;
										}
									}
								p{
									color:#000;
									display: block;
									text-decoration: none;
									cursor: pointer;
								}
							}
						}
					}
					.search-dropdown-hide{
						margin-top:-15px;
						filter:alpha(opacity=0); /* IE */  
						-moz-opacity:0; /* 老版Mozilla */  
						-khtml-opacity:0; /* 老版Safari */  
						opacity: 0; /* 支持opacity的浏览器*/  
					}
					.search-dropdown-show{
						margin-top:1px;
						filter:alpha(opacity=1); /* IE */  
						-moz-opacity:1; /* 老版Mozilla */  
						-khtml-opacity:1; /* 老版Safari */  
						opacity: 1; /* 支持opacity的浏览器*/  
					}
				}
			}
		}
		.header-nav{
			position: relative;
		}
		.header-nav-active{
			position: fixed;
			top: 50px;
			left: 0px;
		}
	}
</style>
