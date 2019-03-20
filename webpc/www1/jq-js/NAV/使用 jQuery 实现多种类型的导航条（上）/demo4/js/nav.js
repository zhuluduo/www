$(function(){
	var index=window.location.href.split('/').length-1;
	var href=window.location.href.split('/')[index].substr(0,4);	
	$(".nav_con li a[href^='"+href+"']").addClass("on");
	
	
	var li_width=$(".nav_con li a.on").outerWidth();
	var li_left=$(".nav_con li a.on").position().left;	
	$(".nav_con .line").css({width:li_width,left:li_left})
	
	
	
	
	$(".nav_con li").hover(function(){
		var li_width=$(this).outerWidth();
		var li_left=$(this).position().left;
		$(".nav_con .line").stop().animate({width:li_width,left:li_left},{duration:1500,easing:"easeOutElastic"})
		
		
		
	},function(){
		
		$(".nav_con .line").stop().animate({width:li_width,left:li_left},{duration:1500,easing:"easeOutElastic"})
		
	})
	
})