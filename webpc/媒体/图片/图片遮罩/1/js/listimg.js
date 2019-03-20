$(function(){
	
	//图片放大效果伴随蒙版文字出现 开始
	$(".con-six").hover(function() {
		$(this).find(".conimg-two").stop().animate({"width":310,"height":210});
		$(this).find(".txt-six").css("display","block");
	}, function() {
		$(this).find(".conimg-two").stop().animate({"width":297,"height":198});
		$(this).find(".txt-six").css("display","none");
	})
	//图片放大效果伴随蒙版文字出现 结束
});
