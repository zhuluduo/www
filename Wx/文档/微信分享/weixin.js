wx.config({
	debug: false,
	appId: "wx311eec75c3a873f4",
	timestamp: "<?php echo time() ?>",
	nonceStr: "<?php echo $str ?>",
	signature: "<?php echo $signature ?>",
	jsApiList: [
		'checkJsApi',
		'onMenuShareTimeline',
		'onMenuShareAppMessage',
		'onMenuShareQQ',
		'onMenuShareWeibo'
	]
});
var imgcontent=document.getElementById("imgcontent").src;
//alert(imgcontent);
wx.ready(function () {
	var pcontent=$('p').eq(1).text();
	wx.checkJsApi({
		jsApiList: [
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
		]
	});
	wx.onMenuShareTimeline({					
		title: pcontent,
		link: 'http://game.vhi99.com/thy/',
		imgUrl: imgcontent,
		trigger: function (res) {
			//alert('用户点击分享到朋友圈');
		},
		success: function (res) {
			//alert('已分享');
		},
		cancel: function (res) {
			//alert('已取消');
		},
		fail: function (res) {
			alert('wx.onMenuShareTimeline:fail: '+JSON.stringify(res));
		}
	});
	wx.onMenuShareAppMessage({
		title: '如果你穿越到《琅琊榜》，你会是谁', // 分享标题
		desc: pcontent, // 分享描述
		link: 'http://game.vhi99.com/thy/', // 分享链接
		imgUrl: imgcontent, // 分享图标
		type: 'link', // 分享类型,music、video或link，不填默认为link
		dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		trigger: function () { 
		// 用户确认分享后执行的回调函数
		},
		success: function () { 
		// 用户确认分享后执行的回调函数
		},
		cancel: function () { 
		// 用户取消分享后执行的回调函数
		}
	});
});
wx.error(function (res) {
	alert('wx.error: '+JSON.stringify(res));
});