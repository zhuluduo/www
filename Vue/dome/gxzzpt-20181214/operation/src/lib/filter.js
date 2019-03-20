//过滤组件;
import Vue from 'vue'

//格式化金额（保留两位小数）过滤器
Vue.filter('money', function (val) {
  val = val.toString().replace(/\$|\,/g, '');
  if (isNaN(val)) {
    val = "0";
  }
  let sign = (val == (val = Math.abs(val)));
  val = Math.floor(val * 100 + 0.50000000001);
  let cents = val % 100;
  val = Math.floor(val / 100).toString();
  if (cents < 10) {
    cents = "0" + cents
  }
  for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
  }
  return (((sign) ? '' : '-') + val + '.' + cents);
})


//日期过滤器 YY-mm-dd 格式；
Vue.filter('dayFilter', val => {
  if (val) {
    var time = new Date(Date.parse(val.replace(/-/g, "/")));
    var year = time.getFullYear();
    var month = time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    var day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    return year + "-" + month + "-" + day;
  } else {
    return '-';
  }
})

//时间过滤器 hh-mm-ss格式；
Vue.filter('timeFilter', val => {
  if (val) {
    var time = new Date(Date.parse(val.replace(/-/g,"/")));
    var hour = time.getHours() < 10 ? +'0' + time.getHours() : time.getHours();
    var min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    var sec = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    return hour + ":" + min + ":" + sec;
  } else {
    return '-';
  }
})

//日期过滤器 YY-mm-dd  hh:mm:ss格式；
Vue.filter('dataFilter', val => {
  if (val) {
    var time = new Date(Date.parse(val.replace(/-/g, "/")));
    var year = time.getFullYear();
    var month = time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    var day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    var hour = time.getHours() < 10 ? +'0' + time.getHours() : time.getHours();
    var min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    var sec = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  } else {
    return '-';
  }
})


  


 