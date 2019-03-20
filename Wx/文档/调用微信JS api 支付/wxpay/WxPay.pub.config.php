<?php
/**
* 	配置账号信息
*/
class WxPayConf_pub
{
    //=======【基本信息设置】=====================================
    //微信公众号身份的唯一标识。审核通过后，在微信发送的邮件中查看

    static $APPID = 'wx4c9f2ead52f08cdf';
    //受理商ID，身份标识
    static $MCHID = '1273021101';
    //商户支付密钥Key。审核通过后，在微信发送的邮件中查看
    static $KEY = 'DFlsjdfltr1431lsdjflka253lkjsdf1';
    //JSAPI接口中获取openid，审核后在公众平台开启开发模式后可查看
    static $APPSECRET = 'd783884fafd63721d3acfc912daacb74';

    //=======【JSAPI路径设置】===================================
    //获取access_token过程中的跳转uri，通过跳转将code传入jsapi支付页面
    //static $JS_API_CALL_URL = 'http://1.vhi99.com/wxjsapi/jsapi.php';
	static $JS_API_CALL_URL = 'http://www.52jingbao.com/system/modules/pay/lib/native_wxjsapi.php';
    //=======【证书路径设置】=====================================
    //证书路径,注意应该填写绝对路径
    static $SSLCERT_PATH = 'http://yun.demo.wowcms.cn:8080/system/modules/pay/lib/wxpay/cacert/apiclient_cert.pem';
    static $SSLKEY_PATH = 'http://yun.demo.wowcms.cn:8080/system/modules/pay/lib/xpay/cacert/apiclient_key.pem';

    //=======【异步通知url设置】===================================
    //异步通知url，商户根据实际开发过程设定
    static $NOTIFY_URL ='http://yun.demo.wowcms.cn:8080/weixin/demo/js_api_call.php';

    //=======【curl超时设置】===================================
    //本例程通过curl使用HTTP POST方法，此处可修改其超时时间，默认为30秒
    static $CURL_TIMEOUT = 30;
}
	
?>