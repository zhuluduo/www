// JavaScript Document
$("#login_content_log").on('click',function(){
	    $("#login_content_log,#login_content_reg").fadeOut();
		$("#login_content_log_02").fadeIn();
	});
$("#login_close").on('click',function(){
	    $("#login_content_log,#login_content_reg").fadeIn();
		$("#login_content_log_02").fadeOut();
	});
$("#login_input11").on('focus',function(){
	    $(this).css('color','black');
		if($(this).val() == "用户名")
		{
			$(this).val('');}
			$("#login_input1").css('borderColor','#0099cc').css('box-shadow','#0099cc 0px 0px 3px');
	}).on('blur',function(){
		$(this).css('color','gray');
		if($(this).val() == '')
		{
			$(this).val('用户名');}
			$("#login_input1").css('borderColor','gray').css('box-shadow','none');
		});
$("#login_input12").on('focus',function(){
	    $(this).css('color','black');
		//document.getElementById("login_input12").type = 'password';
		$("#login_input12[type='text']").attr('type','password');
		if($(this).val() == "密码")
		{
			$(this).val('');}
			$("#login_input2").css('borderColor','#0099cc').css('box-shadow','#0099cc 0px 0px 3px');
	}).on('blur',function(){
		$(this).css('color','gray');
		//document.getElementById("login_input12").type = 'text';
		$("#login_input12[type='password']").attr('type','text');
		if($(this).val() == '')
		{
			$(this).val('密码');}
			$("#login_input2").css('borderColor','gray').css('box-shadow','none');
		if($(this).val() != ''&&$(this).val() != "密码")
		{
			//document.getElementById("login_input12").type = 'password';
			$("#login_input12[type='text']").attr('type','password');
			}
		});

$(document).mousemove(function(e){	//背景移动
	var page_width = $("body").width();
	var x = e.pageX;
	x=40+(((x-page_width/2)/page_width)*100+50)/20;
	x = x+"% 10%";
	var obj = document.getElementById("login_bg")
	obj.style.backgroundPosition = x;
	});

		
		
$("#login_input4 input").on('click',function(){//登陆按钮
  var user = $("#login_input11").val();
  var password = $("#login_input12").val();
     if(user==''||user=='用户名'){
		 //$("#login_tip").val("用户名不能为空");
		 document.getElementById('login_tip').innerHTML = "用户名不能为空";
		 $("#login_input11").focus();
		 return false;}
	   else if(password==''||password=='密码'){
		 //$("#login_tip").val("密码不能为空")
		 document.getElementById('login_tip').innerHTML = "密码不能为空";
		 $("#login_input12").focus();
		 return false;
		 }
		 else{
		//ajax请求
		/*$.ajax({
			type:"POST",
			url:"ajax.php?action=login",
			dataType:"json",
			data:{"user":user,"password":password},
			beforeSend:function(){
				document.getElementById("login_tip").innerHTML = "登录中..."
				},
			success:function(json){
				if(json.success == 1){
					document.getElementById("welcome_user").innerHTML = json.user;
					$("#login_content_log_02").fadeOut();
					$("#login_content_log_03").fadeIn();
					//alert(getCookie(user));
					t1 = setTimeout("window.location.href='index.php'",3000);}
					else{
						document.getElementById("login_tip").innerHTML = json.msg;}
				}
				
			});}*/
		 
         document.getElementById("login_tip").innerHTML = "登录中...";
		 t = setTimeout("demo()",1500);
		 }
	});
function demo(){//效果测试
   var user = $("#login_input11").val();
   var password = $("#login_input12").val();
   if(user=="admin"&&password=="123456"){
	$("#login_content_log_02").fadeOut();
	$("#login_content_log_03").fadeIn();
	//t1 = setTimeout("window.location.href='login.html'",3000);
	}
	else{
		document.getElementById("login_tip").innerHTML = "账号或密码错误";}
	}
	
	$("#exit_button").on('click',function(){
		$.post("ajax.php?action=exit");
		});
/**************************************************/
		
function getCookie(name)//cookie检查
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg))
return unescape(arr[2]);
else
return null;
}