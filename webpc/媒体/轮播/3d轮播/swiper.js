 /*
 * @swiper 获取最外层父级类名
 * @imgList 获取承载img父盒子的class
 * @data 获取图片集合
 * 
 */
 var swiper;
 var imgList;
 var imgListW;
 var ingLength;
 var mySpot;
 var spotState=true;
 var prev;
 var next;
 var timer;
 var index=0;
 
 function main(params){
	spotState=params.spotState;
	swiper=document.getElementById(params.ParentName);
	
	//创建图片父级盒子
	imgList=document.createElement('div');//创建父盒子
	imgList.className='imageList';
	imgListW=params.ParentWidth;
	ingLength=params.data.length;//根据动态传参获取子集个数
	imgList.style.width=imgListW*ingLength+'px';//更改父级盒子宽度
	imgList.style.WebkitTransform="translateX(0px)"; //默认滚动距离
	imgList.style.webkitTransition ="transform"+params.speed+"s"; //兼任谷歌滚动速度
	imgList.style.transition = "transform "+params.speed+"s";  //滚动速度
	swiper.appendChild(imgList);
	
	//插入图片集合
	for(var i=0;i<params.data.length;i++){
		var myImage = document.createElement("img");
		myImage.src = params.data[i];
		imgList.appendChild(myImage);
	}
	
	//插入圆点集合
	mySpot=document.createElement('div');//创建父盒子
	mySpot.className='spot';
	mySpot.style.bottom=params.spotBottom;
	swiper.appendChild(mySpot);
	if(spotState==true){
		for(var i=0;i<params.data.length;i++){//插入根据图片数量插入对应数量子集
			mySpotList=document.createElement('i');
			mySpot.appendChild(mySpotList);
		}
		mySpot.firstElementChild.className='active';//默认第一个元素添加class
	}
	
	if(params.btn){
		//创建左箭头
			prev=document.createElement('a');
			prev.href='javascript:;';
			prev.id='prev';
			prev.className='arrow';
			prev.innerHTML='&lt;';
			swiper.appendChild(prev);
			prev.addEventListener('click',function(){
				if (index == 1) {
					index = ingLength;
				}
				else {
					index -= 1;
				}
				showButton((index-1),mySpot,imgList,imgListW)
			})
		//创建右箭头
			next=document.createElement('a');
			next.href='javascript:;';
			next.id='next';
			next.className='arrow';
			next.innerHTML='&gt;';
			swiper.appendChild(next);
			next.addEventListener('click',function(){
				if (index ==ingLength) {
					index = 1;
				}
				else {
					index += 1;
				}
				showButton((index-1),mySpot,imgList,imgListW)
			})
	}
	
	spotClick(mySpot,imgList,imgListW)
	play(ingLength)
	swiper.onmouseover=stop;
	swiper.onmouseout = start;
	}
	
	//获取点击事件圆点
	function spotClick(mySpot,imgList,imgListW){
		for(var j=0;j<mySpot.childNodes.length;j++){ 
			mySpot.childNodes[j].addEventListener('click',function(j){
				return ()=>{
					index=j
					showButton(index,mySpot,imgList,imgListW)	
				}
			}(j))
		}
	}
		
	//自动轮播
	function play(ingLength){
	  timer = setTimeout(function () {
			if (index ==ingLength) {
				index = 1;
			}
			else {
				index += 1;
			}
			showButton((index-1),mySpot,imgList,imgListW)
	  	play(ingLength);
	  }, 1000);
	}
	
	function start(){//鼠标移出
		play(ingLength)
	}
	
	function stop() {//鼠标移入
		clearTimeout(timer);
	}
	
	function showButton(index,mySpot,imgList,imgListW){
		if(spotState==true){
			for(let i=0;i<mySpot.childNodes.length;i++){
			if(mySpot.childNodes[i].className=='active'){
				mySpot.childNodes[i].className='';
			}
			}
			mySpot.childNodes[index].className='active';
		}
		imgList.style.WebkitTransform="translateX("+(-(imgListW*index))+"px)";
	}



