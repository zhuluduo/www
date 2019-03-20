window.onload=function(){
//	获取id,定制计时器，可视区域高度
	var btntop=document.getElementById('btn');
	var timer=null;
	var topheight=document.documentElement.clientHeight;

	window.onscroll=function(){
		var backtop=document.body.scrollTop;
		if(backtop>=topheight){
			btntop.style.display='block';
		}else{
			btntop.style.display='none';
		}
	}
	btntop.onclick=function(){
		timer=setInterval(function(){
			var backtop=document.body.scrollTop;
			var spend=backtop/5;
			document.body.scrollTop=backtop-spend;
			if(backtop==0){
				clearInterval(timer);
			}
		},30);
			
		
	}
}
