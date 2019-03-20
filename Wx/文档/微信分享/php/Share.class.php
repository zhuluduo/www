<?php
/*share.class.php	分享类
 *@time 2016-03-23
 *@author	小邓  <969101097@qq.com>*/
class share{
	//private $token;	
	/* 生成access_token
	* @time 2016-03-23
	* @author	小邓  <969101097@qq.com>*/
	function setToken(){
		$appid='wx991ee7472149aa79';
		$secret ='6d84c29aa1f94c1a964a1f51348b55cf';
		$url_token = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$secret;
		if(function_exists('file_get_contents')){
			$file_contents=file_get_contents($url_token);
		}else{
			$ch = curl_init();
			$timeout = 5; 
			curl_setopt ($ch, CURLOPT_URL, $url_token);
			curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1); 
			curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$file_contents = curl_exec($ch);
			curl_close($ch);
		}
		$token_arr=json_decode($file_contents,TRUE);
		return $token_arr['access_token'];
	}
	
	/* 获取access_token
	* @time 2016-03-23
	* @author	小邓  <969101097@qq.com>*/
	function getToken(){
		$filename='token.txt';
		if(!file_exists($filename)){	//判断文件是否存在
			$token=fopen($filename,"w");
		}else{		
			$tokenArr=json_decode(file_get_contents($filename),true);//读内容
			if(!$tokenArr['tokenValue']){
				//echo '请写入内容';
				$dataArr=array('tokenValue'=>$this->setToken(),'tokenTime'=>time());
				file_put_contents($filename,json_encode($dataArr));	//写内容	
				$access_token=$this->setToken();
			}else{
				if(time()-$tokenArr['tokenTime']>60*20){
					$dataArr=array('tokenValue'=>$this->setToken(),'tokenTime'=>time());
					file_put_contents($filename,json_encode($dataArr));	//修改内容
					$access_token=$this->setToken();
				}else{
					$access_token=$tokenArr['tokenValue'];
				}
			}
			//$this->token=$access_token;
			return $access_token;
		}	
	}
	
	/* 获取随机数及签名
	* @time 2016-03-23
	* @author	小邓  <969101097@qq.com>*/
	function getSigna(){
		$access_token=$this->getToken();
		$url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='.$access_token.'&type=jsapi';
		$file_contents = file_get_contents($url);
		$file_contents= json_decode($file_contents,TRUE);
		$chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
		$url1 = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
		$str="";
		for($i=0; $i<16;$i++){
		  $str.=substr($chars,mt_rand(0,strlen($chars)-1),1);
		}
		$signature=sha1('jsapi_ticket='.$file_contents['ticket'].'&noncestr='.$str.'&timestamp='.time().'&url='.$url1);
		$signa_arr=array();
		$signa_arr['str']=$str;
		$signa_arr['signature']=$signature;
		$result_signa=serialize($signa_arr);
		return $result_signa;
	}
	
}
?>