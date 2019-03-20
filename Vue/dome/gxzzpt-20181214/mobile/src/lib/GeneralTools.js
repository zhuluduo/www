
import Vue from 'vue'
// import ElementUI from 'element-ui';
// Vue.use(ElementUI)
var myGeneralTools = new Vue()


//日常请求接口返回成功(针对新封装的请求)
// export const showResultTips = (res)=>{
//   if (res.code == 200) {
//     myGeneralTools.$message({
//       type: "success",
//       message: res.message,
//       duration: 1000,
//     });
//   } else {
//     myGeneralTools.$message({
//       type: "error",
//       message: res.message || "网络异常",
//       duration: 1000,
//     });
//   }
// }

//日常请求接口返回成功
// export const ResultTips = (res, success, error) => {
//   //res 返回的数据，success成功的数据，error失败的数据，
//   if (res.data.code == 200) {
//     //判断是的是目的是获取数据；
//     res.data.data ? null:myGeneralTools.$message({
//       type: "success",
//       message: success || res.data.message,
//       duration: 1000,
//     });
//     return res.data.data
//   } else {
//     myGeneralTools.$message({
//       type: "error",
//       message: error || res.data.message || "网络异常" ,
//       duration: 1000,
//     });
//   }
// }

//消息提示
// export const success = (message) => {
//   myGeneralTools.$message({message: message,type: 'success',duration: 1000});
// }
// export const error = (message) => {
//   myGeneralTools.$message({message: message,type: 'error',duration: 1000});
// }
// export const warning = (message) => {
//   myGeneralTools.$message({message: message,type: 'warning',duration: 1000});
// }

//获取本地数据;
export const LocalStorage = {
  getWords: (index) => {
      let user = localStorage.getItem('gxzzpt2_mobile_words');
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
  gxzzpt2_mobile: () => {
    var userData = window.localStorage.getItem("gxzzpt2_mobile") ? window.localStorage.getItem("gxzzpt2_mobile") : "{}";
    var user = JSON.parse(userData);
    return user
  }
}
