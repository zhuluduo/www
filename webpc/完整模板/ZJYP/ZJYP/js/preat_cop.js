//window.onload=function(){
////	获取id,定制计时器，可视区域高度
//	var btntop=document.getElementById('btn');
//	var timer=null;
//	var topheight=document.documentElement.clientHeight;
//
//	window.onscroll=function(){
//		var backtop=document.body.scrollTop;
//		if(backtop>=topheight){
//			btntop.style.display='block';
//		}else{
//			btntop.style.display='none';
//		}
//	}
//	btntop.onclick=function(){
//		timer=setInterval(function(){
//			var backtop=document.body.scrollTop;
//			var spend=backtop/5;
//			document.body.scrollTop=backtop-spend;
//			if(backtop==0){
//				clearInterval(timer);
//			}
//		},30);
//			
//		
//	}
//}
  $(function(){
        new WOW().init();
        var focusBanner=function(){
				var $focusBanner=$("#focus-banner"),
					$bannerList=$("#focus-banner-list li"),
					$focusHandle=$(".focus-handle"),
					$bannerImg=$(".focus-banner-img"),
					$nextBnt=$("#next-img"),
					$prevBnt=$("#prev-img"),
					$focusBubble=$("#focus-bubble"),
					bannerLength=$bannerList.length,
					_index=0,
					_timer="";

//					var _height=$(".focus-banner-img").find("img").height();
//					$focusBanner.height(_height);
//					$bannerImg.height(_height);

					$(window).resize(function(){
						window.location.reload()
					});

					for(var i=0; i<bannerLength; i++){
						$bannerList.eq(i).css("zIndex",bannerLength-i);
						$focusBubble.append("<li></li>");
					}
					$focusBubble.find("li").eq(0).addClass("current");
					var bubbleLength=$focusBubble.find("li").length;
					$focusBubble.css({
						"width":bubbleLength*22,
						"marginLeft":-bubbleLength*11
					});//初始化

					$focusBubble.on("click","li",function(){
						$(this).addClass("current").siblings().removeClass("current");
						_index=$(this).index();
						changeImg(_index);
					});//点击轮换

					$nextBnt.on("click",function(){
						_index++
						if(_index>bannerLength-1){
							_index=0;
						}
						changeImg(_index);
					});//下一张

					$prevBnt.on("click",function(){
						_index--
						if(_index<0){
							_index=bannerLength-1;
						}
						changeImg(_index);
					});//上一张

					function changeImg(_index){
						$bannerList.eq(_index).fadeIn(250);
						$bannerList.eq(_index).siblings().fadeOut(200);
						$focusBubble.find("li").removeClass("current");
						$focusBubble.find("li").eq(_index).addClass("current");
						clearInterval(_timer);
						_timer=setInterval(function(){$nextBnt.click()},5000)
					}//切换主函数
					_timer=setInterval(function(){$nextBnt.click()},5000)
			}();
    })