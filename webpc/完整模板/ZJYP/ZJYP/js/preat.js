
  $(function(){
        new WOW().init();

        var btntop=document.getElementById('top');
        var time=null;
        var topheight=document.documentElement.clientHeight;
        document.onscroll=function(){
        		var top=document.body.scrollTop;
        		if(top>=topheight){
        			btntop.style.display='block';
        		}else{
        			btntop.style.display='none';
        		}
        }  
        btntop.onclick=function(){
        	time=setInterval(function(){
        		var top=document.body.scrollTop;
        		var speend=top/5;
        		document.body.scrollTop=top-speend;
        		if(top==0){
        			clearInterval(time);
        		}
        	},30)
        }
    })