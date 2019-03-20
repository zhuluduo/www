// 初始化ajax
1.创建XMLHTttpRequest对象
var xhr = null;
if(window.XMLHttpRequest){
	xhr = new XMLHttpRequest();
}else{
	xhr = new ActiveXObject('Microsoft.XMLHTTP')
}

xhr.open(get,url,true)  //请求方法---请求地址---同步（false）还是异步(true)显示

//对于post请求来说,参数应该放入大请求体中
xhr.setRequestHeader("Content-type","application/x-www-for-urlencoded");  //请求头只针对于post请求
xhr.send(null)

xhr.onreadystatechange = function(){
	if(xhr.readyState == 4){  //自身返回成功状态
		if(xhr.status == 200){  //服务器返回状态
			xhr.responseText
		}
	}
}