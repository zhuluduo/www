//公告栏滚动---ID(divID值)，times运行时间速度
const scrollLeft={}

scrollLeft.scrollLefts=function(ID,times){
    var oDiv = document.getElementById(ID);
    var oUl = oDiv.getElementsByTagName("ul")[0];
    var aLi = oUl.getElementsByTagName("li");
    var timeInfo=times!=undefined?times:64;
    var speed=3;
    setTimeout(function(){
        if(aLi[0]!=undefined){
            oUl.innerHTML += oUl.innerHTML;
            oUl.style.width = aLi[0].offsetWidth * aLi.length + "px";
            function move() {
              if (oUl.offsetLeft < -oUl.offsetWidth / 2) {
                oUl.style.left = 0
              }
              if (oUl.offsetLeft > 0) {
                oUl.style.left = oUl.offsetWidth / 2 + "px"
              }
              oUl.style.left = oUl.offsetLeft - speed + "px"
            }
            var timer = setInterval(move, timeInfo)
            oDiv.onmousemove = function () {
              clearInterval(timer)
            }
            oDiv.onmouseout = function () {
              timer = setInterval(move, timeInfo)
            }
        }
    },800)
}

export default scrollLeft;