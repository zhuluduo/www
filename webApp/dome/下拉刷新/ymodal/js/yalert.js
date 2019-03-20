/*!
 * alert模拟
 * Version:  0.0.1
 * Released: 2016-06-20
 * Author:   大姚哥
 * Email:    yaohuitao@100tal.com
 * Company:  好未来-摩比
 *
 */
function includeLinkStyle(url) {
    
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url; 
    link.id="yalertCss";
    if($("#yalertCss").length<=0){
        document.getElementsByTagName("head")[0].appendChild(link);
    }
}
function showAlert(t,m,stylepath,fn){
    //用来引入样式，如果直接写入样式stylepath设为:"";
    if(stylepath){
        includeLinkStyle(stylepath);
    }
    var alertstr='<div class="ymodalAlert">'+
        '<div class="ymodalAlertBody">'+
        '<div class="ymodalTitle">'+t+'</div>'+
        '<div class="ymodalMsg">'+m+'</div>'+
        '<div class="ymodalonfirm"><div class="alertbtn alertbtnSure">确定</div></div>'+
        '</div>'+
        '</div>';
    $("body").append(alertstr);
    $(".alertbtnSure").click(function () {
        $(".ymodalAlert").fadeOut(function(){
            $(".ymodalAlert").remove();
            if (typeof fn === "function"){
                fn();
            }
        })
    })
}

function showConfirm(t,m,stylepath,surefn,canclefn){
    //用来引入样式，如果直接写入样式stylepath设为:"";
    if(stylepath){
        includeLinkStyle(stylepath);
    }
    var confirmstr='<div class="ymodalAlert">'+
        '<div class="ymodalAlertBody">'+
        '<div class="ymodalTitle">'+t+'</div>'+
        '<div class="ymodalMsg">'+m+'</div>'+
        '<div class="ymodalonfirm"><div class="confrimbtn confrimbtnCancle">取消</div><div class="confrimbtn confrimbtnSure">确定</div></div>'+
        '</div>'+
        '</div>';
    $("body").append(confirmstr);
    $(".confrimbtnSure").click(function () {
        $(".ymodalAlert").fadeOut(function(){
            $(".ymodalAlert").remove();
            if (typeof surefn === "function"){
                surefn();
            }
        })
    })
    $(".confrimbtnCancle").click(function () {
        $(".ymodalAlert").fadeOut(function(){
            $(".ymodalAlert").remove();
            if (typeof canclefn === "function"){
                canclefn();
            }
        })
    })
}

