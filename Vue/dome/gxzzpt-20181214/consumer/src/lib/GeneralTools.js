
import Vue from 'vue'
import ElementUI from 'element-ui';
Vue.use(ElementUI)
var myGeneralTools = new Vue()


//日常请求接口返回成功(针对新封装的请求)
export const showResultTips = (res)=>{
  if (res.code == 200) {
    myGeneralTools.$message({
      type: "success",
      message: res.message,
      duration: 1000,
    });
  } else {
    myGeneralTools.$message({
      type: "error",
      message: res.message || "网络异常",
      duration: 1000,
    });
  }
}

//日常请求接口返回成功
export const ResultTips = (res, success, error) => {
  //res 返回的数据，success成功的数据，error失败的数据，
  if (res.data.code == 200) {
    //判断是的是目的是获取数据；
    myGeneralTools.$message({
      type: "success",
      message: success || res.data.message,
      duration: 1000,
    });
  } else {
    myGeneralTools.$message({
      type: "error",
      message: error || res.data.message || "网络异常" ,
      duration: 1000,
    });
  }
}

//消息提示
export const success = (message) => {
  myGeneralTools.$message({message: message,type: 'success',duration: 1000});
}
export const error = (message) => {
  myGeneralTools.$message({message: message,type: 'error',duration: 1000});
}
export const warning = (message) => {
  myGeneralTools.$message({message: message,type: 'warning',duration: 1000});
}

//获取本地数据;
export const LocalStorage = {
  getWords: (index) => {
      let user = localStorage.getItem('words');
      var jsonObj = JSON.parse(user);
      for (let i in jsonObj) {
        if (index != undefined) {
          if (i == index) {
            return jsonObj[i].item
          }
        } else {
          return []
        }
      }
   },
  gxzzpt2_consumer:()=>{
    var userData = window.localStorage.getItem("gxzzpt2_consumer") ? window.localStorage.getItem("gxzzpt2_consumer") : "{}";
    var user = JSON.parse(userData);
    return user
  }
}

const remove_ie_header_and_footer = () => {
    var hkey_root, hkey_path, hkey_key;
    hkey_root = "HKEY_CURRENT_USER";
    hkey_path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
    try {;
      var RegWsh = new ActiveXObject("WScript.Shell")
      hkey_key = "header"
      RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
      hkey_key = "footer"
      RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "&w&b页码，&p/&P")
    } catch (e) {

    }
}
export const print = (name)=>{
     if (!!window.ActiveXObject || "ActiveXObject" in window) { //判断是否ie
       remove_ie_header_and_footer();
     }
     let PrintHTML = document.getElementById(name).innerHTML;
     let oldHTML = document.body.innerHTML;
     document.body.innerHTML = PrintHTML;

     window.print();
     window.location.reload();
     document.body.innerHTML = oldHTML;
     return false;
}

export const dateFormat = (time, format = 'YY-MM-DD hh:mm:ss') =>{
  var date = new Date(time);

  var year = date.getFullYear(),
    month = date.getMonth() + 1,//月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
    return '0' + index;
  });////开个长度为10的数组 格式为 00 01 02 03

  var newTime = format.replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec);

  return newTime;
}
