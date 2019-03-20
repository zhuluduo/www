

<?php 
include_once dirname(__FILE__)."/wxpay/WxPayPubHelper.php";//引入文件需求 
$jsApi = new JsApi_pub();     
//通过code获得openid
if(!isset($_GET['code'])){
  //触发微信返回code码
  $url = $jsApi->createOauthUrlForCode(WxPayConf_pub::$JS_API_CALL_URL);
  Header("Location: $url");
}else{
  //获取code码，以获取openid
  $code = $_GET['code'];
  $jsApi->setCode($code);
  $openid = $jsApi->getOpenId();
  //print_r($openid); 
  //exit;
  $state = $_GET['state'];
  if(!$openid){
	//$openid=$_COOKIE['openidCookie'];
	session_start();
	$openid=$_SESSION['openid'];
  }
}
$config=unserialize($state);
//session_start();
//print_r($_SESSION['openid']);
$unifiedOrder = new UnifiedOrder_pub();
$unifiedOrder->setParameter("openid",$openid);//商品描述
$unifiedOrder->setParameter("body","竞宝.惊喜无限");//商品描述
$timeStamp = time();
$unifiedOrder->setParameter("out_trade_no",$config['code']);//商户订单号
//$unifiedOrder->setParameter("total_fee","1");//总金额
$unifiedOrder->setParameter("total_fee",$config['money']*100);//总金额
$unifiedOrder->setParameter("notify_url",WEB_PATH.'/pay/jspay_url/houtai/');//通知地址
$unifiedOrder->setParameter("trade_type","JSAPI");//交易类型
$prepay_id = $unifiedOrder->getPrepayId();
$jsApi->setPrepayId($prepay_id);
$jsApiParameters = $jsApi->getParameters();
//echo $jsApiParameters;exit;
/**
 * 注意：
 * 1、当你的回调地址不可访问的时候，回调通知会失败，可以通过查询订单来确认支付是否成功
 * 2、jsapi支付时需要填入用户openid，WxPay.JsApiPay.php中有获取openid流程 （文档可以参考微信公众平台“网页授权接口”，
 * 参考http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html）
 */
?>
<html>
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>

    <title>微信支付</title>
    <style type="text/css">
        @font-face {font-family:Helvetica; src: url("http://1.vhi99.com/statics/templates/quyu-1yygkuan/css/mobile/font/Helvetica.ttf")}  
        body{background: #f5f5f5;margin: 0px;}
   
    .dindangzf{width: 100%;text-align: center;padding-top: 10px;}
   .wxzf{width: 100%;height: 50px;margin-top: 30px; }
   .jinger{width: 100%;text-align: center;}
    .zhifu{width:95%; height:50px; border-radius: 15px;background-color:#04BE02 ; border:0px #04BE02 solid; cursor: pointer;  color:white;  font-size:16px;}
    .dingdanghao{width: 100%;height: 105px;border: 1px solid #ddd;margin-top: 20px;}
    .dingdang{padding: 15px;}

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
            var out_trade_no='<?php echo $config['code'];?>';
            var money='<?php echo $config['money'];?>';
            window.location='http://www.52jingbao.com/index.php/pay/jspay_url/houtai?out_trade_no='+out_trade_no+'&money='+money;
            break;
          default:
            alert(JSON.stringify(res));
            break;
        }
      }     
    );
  }

  function callpay(){
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
  }
  </script>
    
  <script type="text/javascript">
  //获取共享地址
  /*function editAddress(){
    WeixinJSBridge.invoke(
      'editAddress',
      <?php echo $editAddress; ?>,
      function(res){
        var value1 = res.proviceFirstStageName;
        var value2 = res.addressCitySecondStageName;
        var value3 = res.addressCountiesThirdStageName;
        var value4 = res.addressDetailInfo;
        var tel = res.telNumber;        
        //alert(value1 + value2 + value3 + value4 + ":" + tel);
      }
    );
  }
  
  window.onload = function(){
    if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', editAddress, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', editAddress); 
            document.attachEvent('onWeixinJSBridgeReady', editAddress);
        }
    }else{
      editAddress();
    }
  };*/
  
  </script>
</head>
<body>
     <div class="dindangzf"><span style="font-size:15px;" id="money" ddmoney="<?php echo $config['money'];?>">订单支付共计<?=$config['money']?>元</span></div>
	
   
    <div class="jinger "><font color="#9ACD32" ><span style="color:#000;font-size:40px;font-family:Helvetica; "  id="money" ddmoney="<?php echo $config['money'];?>">￥<?=$config['money']?>.00</span></font></div>
   <div class="dingdanghao">
   <div class="dingdang">
   <div style="padding-bottom:4px;"><span style="color:#7b7b7b;font-size:14px;">收款方</span>
   <span style="font-size:15px; float: right;color:#7b7b7b;" id="dingdan" >竞宝,欢乐购物,精喜无限</span></div>
   
<div style="padding-bottom:3px;"><span style="color:#7b7b7b;font-size:14px;" >订单号</span>
    <span style="font-size:15px;float: right;color:#7b7b7b;padding-top:2px;font-family:Helvetica;" id="dingdan" ddcode="<?php echo $config['code'];?>"><?php echo $config['code'];?></span></div>
  


   <div style="padding-bottom:14px;"><span style="color:#7b7b7b;font-size:14px;">商&nbsp;品</span>
   <span style="font-size:15px; float: right;color:#7b7b7b;font-family:Helvetica;" id="dingdan" >订单支付共计<?=$config['money']?>.00元</span></div>
   
   </div>
	<div align="center" class="wxzf">
		<button class="zhifu" type="button" onclick="callpay()" >立即支付</button>
	</div>
</body>
</html>






