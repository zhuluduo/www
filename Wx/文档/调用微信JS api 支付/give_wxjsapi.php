<?php
include_once dirname(__FILE__)."/wxpay/WxPayPubHelper.php";//引入文件需求 
$jsApi = new JsApi_pub();     
//通过code获得openid
if(!isset($_GET['code'])){
  //触发微信返回code码
  $url = $jsApi->createOauthUrlForCode('http://www.52jingbao.com/system/modules/pay/lib/give_wxjsapi.php');
  Header("Location: $url");
}else{
  //获取code码，以获取openid
  $code = $_GET['code'];
  $jsApi->setCode($code);
  $openid = $jsApi->getOpenId();
  //print_r($openid); 
  //exit;
  $state = $_GET['state'];
}
$config=unserialize($state);
//print_r($config);exit;
$unifiedOrder = new UnifiedOrder_pub();
$unifiedOrder->setParameter("openid",$openid);//商品描述
$unifiedOrder->setParameter("body","微信转账支付测试");//商品描述
$timeStamp = time();
$unifiedOrder->setParameter("out_trade_no",$config['code']);//商户订单号
//$unifiedOrder->setParameter("total_fee","1");//总金额
$unifiedOrder->setParameter("total_fee",$config['money']*100);//总金额
$unifiedOrder->setParameter("notify_url",WEB_PATH.'/pay/give_url/houtai/');//通知地址
$unifiedOrder->setParameter("trade_type","JSAPI");//交易类型
$prepay_id = $unifiedOrder->getPrepayId();
$jsApi->setPrepayId($prepay_id);
$jsApiParameters = $jsApi->getParameters();
?>
<html>
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/> 
    <title>微信转账支付</title>
    <link href="{G_TEMPLATES_CSS}/mobile/weui.css" rel="stylesheet" type="text/css" />
	<style type="text/css">
        @font-face {font-family:Helvetica; src: url("http://1.vhi99.com/statics/templates/quyu-1yygkuan/css/mobile/font/Helvetica.ttf")}  
        body{background: #f5f5f5;margin: 0px;}
		.wxzf{width: 100%;height: 50px;margin-top: 30px; }
		.zhifu{width:95%;height:50px;border-radius:5px;background-color:#04BE02;border:0px #04BE02 solid;cursor:pointer;color:white;font-size:16px;}
        .weui_icon_area{width: 70px;height: 70px;margin: 0 auto;margin-top:30px;}
        .weui_icon_area img{width: 70px;height: 70px;}
        .zfcg{text-align: center;margin-top: 15px;}
        .jiner{width: 100%;height: 35px;text-align: center;line-height: 35px;font-size:26px;font-family:Helvetica;margin-bottom: 15px;}
        .skr{width: 92%;height: 40px;line-height: 40px;font-size:14px;font-family:Helvetica;margin: 0 auto;border: 1px solid #e1e1e1;border-right: 0;border-left: 0;}
        .jiner_1 span{font-family:Helvetica;font-size: 38px; }

        .skr span{color: #858585;}
        .xm{float: right;}
    </style>  
    <script type="text/javascript">
        //调用微信JS api 支付
        function jsApiCall(){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                <?php echo $jsApiParameters; ?>,
                function(res){
                    WeixinJSBridge.log(res.err_msg);
                    //alert(res.err_code+res.err_desc+res.err_msg);
                    switch(res.err_msg){
                        case 'get_brand_wcpay_request:cancel':
                            //alert('用户取消支付！');
                            break;
                        case 'get_brand_wcpay_request:fail':
                            //alert('支付失败！（'+res.err_desc+'）');
                            break;
                        case 'get_brand_wcpay_request:ok':
                            //alert('支付成功！');
                            //window.close();   //关闭当前页面
							//var money=document.getElementById('paySatus');
                            //money.innerText='支付成功！';
                            var money='<?php echo $config['money'];?>';
                            var innerhtml='<div class="weui_icon_area">'+'<img src="http://www.52jingbao.com/statics/templates/quyu-1yygkuan/images/mobile/123.png"></div>'+'<div class="zfcg" style="padding-bottom:14px;">'+
								'<span style="font-size:19px;color:#3fb837;font-family:Helvetica;" id="paySatus">支付成功</span></div>'+'<div class="jiner">'+'<div class="jiner_1"><span id="money" ddmoney="<?php echo $config['money'];?>">￥<?=$config['money']?><span></div></div>'+'<div class="skr">'+'<div class="skr_1"><span class="sk">收款人</span><span class="xm">武汉大头仔餐饮管理有限公司</span></div></div>'+
								'<div align="center" class="wxzf">'+
									'<button class="zhifu weui_btn weui_btn_primary" type="button" onclick="callback()" >完成</button></div>';                       
                            document.getElementById('innerHtml').innerHTML=innerhtml;
                            break;
                        default:
                            alert(JSON.stringify(res));
                            break;
                    }
                }
            );
        }

        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
            }
        }else{
            jsApiCall();
        }
        function callback(){
            WeixinJSBridge.call('closeWindow');
        }
    </script>
</head>
<body>
<div id="innerHtml">
	<!--<div style="padding-bottom:14px;">
	   <span style="font-size:15px;color:#7b7b7b;font-family:Helvetica;" id="paySatus"></span>
	</div>
	<div align="center" class="wxzf">
		<button class="zhifu" type="button" onclick="callback()" >关闭当前页面</button>
	</div>-->

</div>
</body>
</html>






