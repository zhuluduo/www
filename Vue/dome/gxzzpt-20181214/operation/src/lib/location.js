const locationUrl={}

//获取窗口栏地址
locationUrl.locationHost=function(){
    var host ='http://'+window.location.host;
    return host
}

export default locationUrl;