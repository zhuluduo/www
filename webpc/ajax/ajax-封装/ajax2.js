//ajax封装

function myAjax(type,url,params,dataType,callback,async){
	var xhr = null;
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else{
		xhr = new ActiveXObject('Microsoft.XMLHTTP')
	}
	if(type == 'get'){
		if(params && params != ''){
			url +="?"+params;
		}
	}
	
	xhr.open(type,url,async);
	
	if(type == 'get'){
		xhr.send(null)
	}else if(type == 'post'){
		xhr.setRequestHeader("Content-type","application/x-www-for-urlencoded");  //请求头只针对于post请求
		xhr.send(params)
	}
	
	if(async){ //如果是异步请求
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){  //自身返回成功状态
				if(xhr.status == 200){  //服务器返回状态
					var result = null;
					if(dataType == 'json'){
						result=xhr.responseText;
						result = JSON.parse(result);
					}else if(dataType == 'xml'){
						result=xhr.responseXML;
					}else{
						result=xhr.responseText;
					}
					if(callback){
						callback(result);
					}
				}
			}
		}
	}else{
		if(xhr.readyState == 4){  //自身返回成功状态
			if(xhr.status == 200){  //服务器返回状态
				var result = null;
				if(dataType == 'json'){
					result=xhr.responseText;
					result = JSON.parse(result);
				}else if(dataType == 'xml'){
					result=xhr.responseXML;
				}else{
					result=xhr.responseText;
				}
				if(callback){
					callback(result);
				}
			}
		}
	}

}

//调用
myAjax(type,url,params,dataType,function(){
	
})
