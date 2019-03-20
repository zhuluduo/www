//获取时间差
const timeSet = {}

timeSet.timeDetails =function(TimeOne,TimeTwo){
var date1=TimeOne!=undefined?new Date(TimeOne.replace(/-/g, "/")):new Date();  //开始时间
var date2=TimeTwo!=undefined?new Date(TimeTwo.replace(/-/g, "/")):new Date();  //结束时间


var date3=date2.getTime() - date1.getTime();  //时间差的毫秒数
var days=Math.floor(date3/(24*3600*1000))//天

var leave1=date3%(24*3600*1000)
var hours=Math.floor(leave1/(3600*1000))//时

var leave2=leave1%(3600*1000)
var minutes=Math.floor(leave2/(60*1000))//分

var leave3=leave2%(60*1000)
var seconds=Math.round(leave3/1000)//秒
var TimeList={
    days:Math.abs(days),
    hours:Math.abs(hours),
    minutes:Math.abs(minutes),
    seconds:Math.abs(seconds),
}
    return TimeList;
}

export default timeSet;