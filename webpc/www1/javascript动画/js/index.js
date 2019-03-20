window.onload=function(){
	//速度动画
	var adiv=document.getElementById('div1');
	    adiv.onmousemove=function(){
	    	august(0);
	    }
	    adiv.onmouseout=function(){
	    	august(-200);
	    }
}
      var itime=null;
      function august(iaugs){
      	clearInterval(itime);
      	var adiv=document.getElementById('div1');
      	itime=setInterval(function(){
      		var speen=0;
      		if(adiv.offsetLeft>iaugs){
      			speen=-20
      		}else{
      			speen=20;
      		}
      		if(adiv.offsetLeft==iaugs){
      				clearInterval(itime);
      		}else{
      			adiv.style.left=adiv.offsetLeft+speen+'px';
      		}
      		
      	},30)
      	

      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      }


