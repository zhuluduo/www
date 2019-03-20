const LocalData={}

//获取字典
LocalData.getWords = function (index) {
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
}
//获取登陆信息
LocalData.operation_user=function(){
    let user = localStorage.getItem('operation_user');
    var jsonObjOne = JSON.parse(user);
    return jsonObjOne
}

export default LocalData;