<template>
  <div class="content">
    <div class="header" id="header">
    		<div class="navTop">
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
    		<div class="banner">
    			<div class="search">
    				<div class="search-input-warp">
    				<input type="text" name="" id="search-text" placeholder="枫橙之恋" v-model.trim="searchVal" />
    				<span class="search-btn" id="search-btn"><i></i></span>
    				<div class="search-dropdown open" v-if="search!=''" :style="searHeight">
    					<ul class="dropdown-list">
    						<li v-for="(item,index) in search"><a :href="item.id">{{item.name}}</a></li>
    					</ul>
    				</div>
    			</div>
    			</div>
    		</div>
    		<div class="nav">
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
      msg: '这是首页2662',
      searchVal:'',
      search:[],
      searHeight:'',
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
  	fetchData(){
  		console.log(this.searchVal)
			let url='http://jsonplaceholder.typicode.com/comments?name=%name%'
    	this.$http.get(url + this.searchVal,{ headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
      this.search=response.body
      console.log(response.body)
      this.searHeight='height:'+response.body.length*28+'px'
      console.log(this.searHeight+'ccc')
			console.log("成功")
    },(response) => {
      console.log(response)
      console.log("失败")
    });
  	},
  	ccss(){
  		console.log('这是测试')
  	}
  },
  mounted(){
  	this.ccss()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
		.fl{float: left;}
		.fr{float: right;}
		.padding-R{padding-right: 10px;}
  	.header{
  		width: 100%;
  		background: #fff;
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
						  				border:1px solid #fff;
						  				background: #fff;
						 					top: 50%;
						 					right: 0;
						 					margin-top: -17.5px;
						  				border-radius: 5px;
						  				transition: all .4s;
						  				box-sizing: border-box;
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
						  							i{
						  								width: 100%;
						  								height: 100%;
						  								display: block;
						  							}
						  							i:before{
						  								content: '';
						  								background: url(../assets/Cable.png) no-repeat;
						  								background-size: 100%;
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
						  						transition: all .17s ease;
						  						padding: 0;
						  						overflow: hidden;
						  							.dropdown-list{display: block;box-sizing: border-box;
						  									li{
						  										cursor: pointer;
						  										white-space: nowrap;
						  										text-overflow: ellipsis;
						  										overflow: hidden;
						  										font-size: 12px;
						  										line-height: 18px;
						  										text-align: left;
						  										a{
						  											display: inline-block;
																    width: 100%;
																    color: #333;
																    transition: all .17s ease;
																    text-decoration: none;
																    padding: 5px 12px;
																    box-sizing: border-box;
																    	&:hover{
									  											color: dodgerblue;
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
  						  	
  						  }
  				}
  		}
  		
  	}
</style>
