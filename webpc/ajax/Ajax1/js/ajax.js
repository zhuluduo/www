	function ajax(json){
		var type=json.type ||'GET';
		var url=json.url;
		var success=json.success;
		var error=json.error;
         var data=json.data || '';
         //创建ajax对象
         var oajax;
		if (window.XMLHttpRequest) {
  		  oajax=new XMLHttpRequest();
		}else{
			oajax=new ActiveXObject('Microsoft.XMLHTTP');
		}
		//链接服务器
		oajax.open(type,url,true);

		//发送请求
		oajax.send();
		oajax.onreadystatechange=function(){
			if (oajax.readyState==4) {
				if (oajax.status==200) {
					var data=oajax.responseText;
					success(data);
				}else{
					error();
				}
			}
		}
	}