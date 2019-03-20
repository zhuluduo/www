
window.onload=function(){
   waterfall('main','pin');

   var data=[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}];


    window.onscroll=function(){
          if(checkscrollside()){
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
            waterfall('main','pin');
   
    }
    }
// ajax加载
//  var ajaxState=true;
//  window.onscroll=function(){
//        if(checkscrollside() && ajaxState){
//        	ajaxState =false;
//        	$.ajax({
//        		type:"get",
//        		url:"",
//        		data:'',
//        		dataType:'json',
//        		beforeSend:function(){
//				var oparent=document.getElementById('main');
//				var aPin=getclassobj(oparent,'pin');
//				 var lastPinH=aPin[aPin.length-1].offsetTop+aPin[aPin.length-1].offsetHeight;//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
//        		var lodimg=document.createElement('img');
//        		lodimg.src='./imgages/120.gif';
//        		lodimg.id='lodimg';
//        		oparent.appendChild(lodimg);
//        		lodimg.style.position='absolute';
//        		lodimg.style.top=lastPinH+50+'px';
//        		lodimg.style.left=Math.floor((oparent.offsetWidth-lodimg.offsetWidth)/2)+'px';
//        		},
//        		success:function(data){
//          var oParent = document.getElementById('main');// 父级对象
//          for(var i=0;i<data.length;i++){
//              var oPin=document.createElement('div'); //添加 元素节点
//              oPin.className='pin';                   //添加 类名 name属性
//              oParent.appendChild(oPin);              //添加 子节点
//              var oBox=document.createElement('div');
//              oBox.className='box';
//              oPin.appendChild(oBox);
//            var oImg=document.createElement('img');
//            oImg.src='./images/'+data[i].src;
//            oBox.appendChild(oImg);
//          }
//          waterfall('main','pin');
//         },
//         conmplete:function(){
//         	document.getElementById('main').removeChild(document.getElementById('lodimg'));
//         	ajaxState=true;
//         }
//        	});
//  }
//  }
    // ajax加载
}
function waterfall(parent,className){
	var oparent=document.getElementById(parent);
	var apin=getclassobj(oparent,className);
//	1一个盒子的宽度
    var pinw=apin[0].offsetWidth;
//  2一排能放多少个
     var num=Math.floor(document.documentElement.clientWidth/pinw);
// 3让父级居中
      oparent.style.cssText='width:'+num*pinw+'px;margin:0 auto;';
//   4 创建一个数组(每一个盒子的高度)循环
   var compareAarr = [];
   for(var i=0;i<apin.length;i++){
   	  if(i<num){
   	  	compareAarr[i]=apin[i].offsetHeight;
   	  }else{
   	  	//5 获取最小值
  var minH=Math.min.apply(null,compareAarr);
  var minkey=getMinKey(compareAarr,minH);
  apin[i].style.position='absolute';
  apin[i].style.top=minH+'px';
  apin[i].style.left=apin[minkey].offsetLeft+'px';
  compareAarr[minkey]+=apin[i].offsetHeight;
   	  }  	
   }
}



/* 动画K* */
//检验滚动条位置
function checkscrollside(){
	var oparent=document.getElementById('main');
	var aPin=getclassobj(oparent,'pin');
    var lastPinH=aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
    var documentH=document.documentElement.clientHeight;//页面高度
    return (lastPinH<scrollTop+documentH)?true:false;//到达指定高度后 返回true，触发waterfall()函数
}

//获取数组最小值的键值
function getMinKey(arr,minH){
	for(key in arr){
		if(arr[key]==minH){
			return key;
		}
}
}

//2-1循环出父级下面的所有pin
function getclassobj(parent,className){
	var obj=parent.getElementsByTagName('*');
	var result=[];
	for(var i=0;i<obj.length;i++){
		if (obj[i].className == className) {
			result.push(obj[i]);
		}
	};
	return result;
}
