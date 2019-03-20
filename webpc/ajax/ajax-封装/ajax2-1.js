

function myAjax(obj){
	let defaults = {
		type:'get',
		url:'#',
		dataType:'json',
		data:{},
		asyncs:true,
		success:function(result){}
	};
	
	/**
	 * obj中的属性，覆盖到defaults中的属性
	 * 1.如果一些属性只存在于obj中，会在defaults中增加属性
	 * 2.如果一些属性在obj和defaults中都存在，将会覆盖defaults中的默认值
	 * 3.如果一些属性只在defaults中存在（obj中不存在）这时候defaults中默认值不改变
	 */
	for(let key in obj){
		defaults[key] = obj[key];
	}
	
	var xhr = null;
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else{
		xhr = new ActiveXObject('Microsoft.XMLHTTP')
	}
	
	let params = '';
	for(let attr in defaults.data){
		params +=attr + "=" +defaults.data[attr] + '&';
	}
	if(params){
		params = params.substring(0,params.length-1)
	}
	
	if(defaults.type == 'get'){
		defaults.url += "?" + params;
	}
	
	xhr.open(defaults.type,defaults.url,defaults.asyncs);
	
	if(defaults.type == 'get'){
		xhr.send(null)
	}else if(defaults.type == 'post'){
		xhr.setRequestHeader("Content-type","application/x-www-for-urlencoded");  //请求头只针对于post请求
		xhr.send(params)
	}
	
	//判断请求是否为异步
	if(defaults.asyncs){
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					var result = null;
					if(defaults.dataType == 'json'){
						result=xhr.responseText;
						result = JSON.parse(result);
					}else if(defaults.dataType == 'xml'){
						result=xhr.responseXML;
					}else{
						result=xhr.responseText;
					}
					defaults.success(result);
				}
			}
		}
	}else{
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				var result = null;
				if(defaults.dataType == 'json'){
					result=xhr.responseText;
					result = JSON.parse(result);
				}else if(defaults.dataType == 'xml'){
					result=xhr.responseXML;
				}else{
					result=xhr.responseText;
				}
				defaults.success(result);
			}
		}
	}
}