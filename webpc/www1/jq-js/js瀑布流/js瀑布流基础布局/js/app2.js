
window.onload=function(){
	waterfallInit({
		parent:"main",
		pin:'pin',
		successFn:success,
		loadImgSrc:'./imgages/120.gif',
		requersUrl:'***.php',
		requestNum:5,
		style:2
	})
	function success(data){
		  var oParent = document.getElementById('main');// 父级对象
            for(var i=0;i<data.length;i++){
                var oPin=document.createElement('div'); //添加 元素节点
                oPin.className='pin';                   //添加 类名 name属性
                oParent.appendChild(oPin);              //添加 子节点
                var oBox=document.createElement('div');
                oBox.className='box';
                oPin.appendChild(oBox);
              var oImg=document.createElement('img');
              oImg.src='./images/'+data[i].src;
              oBox.appendChild(oImg);
	    }
     }
}

function  waterfallInit(json){
	var parent=json.parent;
	var pin=json.pin;
	var successFn=json.successFn;
	var loadImgSrc=json.loadImgSrc;
	var requersUrl=json.requersUrl;
	var requestNum=json.requestNum
	var style=json.style;
     waterfall(parent,pin);
// ajax加载
    ajaxRequest();
    var ajaxState=true;
    var page=0;
    window.onscroll=function(){
          if(checkscrollside() && ajaxState){
          	page++;
          	ajaxState =false;
          	ajaxRequest();
          
    }
    }
    function ajaxRequest(){
    		$.ajax({
          		type:"get",
          		url:requersUrl,
          		data:'page='+page+'&requestNum='+requestNum,
          		dataType:'json',
          		beforeSend:function(){
          		if(page){
				var oparent=document.getElementById(parent);
				var aPin=getclassobj(oparent,pin);
				var lastPinH=aPin[aPin.length-1].offsetTop+aPin[aPin.length-1].offsetHeight;//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
          		var lodimg=document.createElement('img');
          		lodimg.src=loadImgSrc;
          		lodimg.id='lodimg';
          		oparent.appendChild(lodimg);
          		lodimg.style.position='absolute';
          		lodimg.style.top=lastPinH+50+'px';
          		lodimg.style.left=Math.floor((oparent.offsetWidth-lodimg.offsetWidth)/2)+'px';
          		}
          		},
          		success:function(data){
          			successFn(data);
          			 waterfall(parent,pin,style);
            
           },
           conmplete:function(){
           	if(){
           			document.getElementById(parent).removeChild(document.getElementById('lodimg'));
           	}
           	ajaxState=true;
           }
        });
    }
    // ajax加载
    //检验滚动条位置
function checkscrollside(){
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
    var documentH=document.documentElement.clientHeight;//页面高度
    return getLasth()<scrollTop+documentH?true:false;//到达指定高度后 返回true，触发waterfall()函数
}
 function getLasth(){
 	var oparent=document.getElementById(parent);
	var aPin=getclassobj(oparent,pin);
	//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var lastPinH=aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);
   return lastPinH;
 }
}
function waterfall(parent,pin,style){
	var oparent=document.getElementById(parent);
	var apin=getclassobj(oparent,pin);
//	1一个盒子的宽度
    var pinw=apin[0].offsetWidth;
//  2一排能放多少个
     var num=Math.floor(oparent.offsetWidth/pinw);
// 3让父级居中
      oparent.style.cssText='width:'+num*pinw+'px;margin:0 auto;position:relative;';
//   4 创建一个数组(每一个盒子的高度)循环
   var compareAarr = [];
   for(var i=0;i<apin.length;i++){
   	  if(i<num){
   	  	compareAarr[i]=apin[i].offsetHeight;
   	  }else{
   	  	//5 获取最小值
  var minH=Math.min.apply(null,compareAarr);
  var minkey=getMinKey(compareAarr,minH);
  compareAarr[minkey]+=apin[i].offsetHeight;
  setmovestyle(apin[i],minH,apin[minkey].offsetLeft,i,style);
   	  }  	
   }
}

/* 动画(运动的对象)K  对象：obj ,运动的top/left值* */
var startNum=0;
function setmovestyle(obj,top,left,index,style){
	if(index<=startNum){
		return;
	}
	  var docw=document.documentElement.clientWidth;
	  obj.style.position='absolute';
 	  switch(style){
	  	case 1:
	  	 obj.style.top=getTotalh()+'px';
	  obj.style.left=Math.floor((docw-obj.offsetWidth)/2)+'px';
	  $(obj).stop().animate({
		top:top,
		left:left
	},1000);
	  break;
	  case 2:
	  obj.style.top=top+'px';
	  obj.style.left=left+'px';
	  obj.style.opacity=0;
	  obj.style.filter='alpha(opacity=0)';
	  	  $(obj).stop().animate({
		   opacity:1
	    },1000);
	    break;
	     }
	startNum=index;//更新索引
}
/* 动画K* */

 /*获得总高度
  */
 function getTotalh(){
 	var totalH=document.documentElement.scrollHeight ||document.body.scrollHeight;
    return totalH;
 }
//获取数组最小值的键值
function getMinKey(arr,minH){
	for(key in arr){
		if(arr[key]==minH){
			return key;
		}
}
}
function callBack(w,h,imgObj){
	imgObj.style.width=205+'px';
	var scale=w/205;
	imgObj.style.Height=Math.floor(h/scale)+'px';
}

//图片加载线上布局问题解决方案
function ldImg(url,fn,imgObj){
	var img=new Image();
	img.src=url;
	if(img.complete){
//		alert(img.width+'==>'+img.height);
      fn(img.width,img.height,imgObj)
	}else{
		img.onload=function(){
			fn(img.width,img.height,imgObj)
		}
	}
}

//2-1循环出父级下面的所有pin
function getclassobj(parent,pin){
	var obj=parent.getElementsByTagName('*');
	var result=[];
	for(var i=0;i<obj.length;i++){
		if (obj[i].pin == pin) {
			result.push(obj[i]);
		}
	};
	return result;
}
