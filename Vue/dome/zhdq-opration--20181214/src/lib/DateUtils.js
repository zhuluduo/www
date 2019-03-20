const timeSet = {}

timeSet.timeFiler = function(name){
    let date=new Date();
    let itemJson={};
    switch(name)
    {
    case '今日':
    itemJson.start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
    itemJson.end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
    itemJson.start.setTime(itemJson.start.getTime());
    break;
    case '昨日':
    itemJson.start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
    itemJson.end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
    itemJson.start.setTime(itemJson.start.getTime()-24*60*60*1000);
    itemJson.end.setTime(itemJson.end.getTime()-24*60*60*1000);
    break;
    case '本周':
    itemJson.start = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - date.getDay() || 7 ,0,0,0);
    itemJson.end = new Date(date.getFullYear(), date.getMonth(), (date.getDate() + 1 - date.getDay() || 7)+6 ,23,59,59);
    break;
    case '本月':
    itemJson.start = new Date(date.getFullYear(),date.getMonth(),1,0,0,0);
    itemJson.end = new Date(date.getFullYear(),date.getMonth() + 1, 0 ,23,59,59);
    break;
    }
    return itemJson;
}
export default timeSet;
