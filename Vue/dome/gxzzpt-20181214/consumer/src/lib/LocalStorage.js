const LocalData={}

//获取字典
LocalData.getWords=function(index){
    let user = localStorage.getItem('words');
    var jsonObj = JSON.parse(user);
    for(let i in jsonObj){
    if(index!=undefined){
        if(i==index){
            return jsonObj[i].item
        }
    }else{
      return []
    }
    }
}

//获取登陆信息
LocalData.gxzzpt2_consumer=function(){
    var userData = window.localStorage.getItem("gxzzpt2_consumer") ? window.localStorage.getItem("gxzzpt2_consumer") : "{}";
    var user = JSON.parse(userData);
    return user
}

export default LocalData;