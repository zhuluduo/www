var xinm = ["江小鱼", "楚留香", "觉远", "金麟", "展白", "邀月", "怜星", "蓉蓉", "仙仙", "燕十三",
    "公子羽", "元宝", "花满楼", "孟星魂", "小霸王", "东郭仁", "胡不归", "田七", "胜泫", "叶开",
    "俞子牙", "倚剑", "南宫平", "孙秀青", "谢晓峰", "司徒笑", "冯天雨", "唐无双", "杨艳", "田思思",
    "卓东来", "陈圆圆", "华华凤", "无艳", "萧王孙", "冯百万", "快活王", "叶孤城", "阿珂", "楚青",
    "云铮", "元丰", "高渐飞", "钱通", "李玉堂", "丁喜", "傅红雪", "林诗音", "颜小英", "傅必宜", "张平",
    "徐剑豪", "尹俊", "宾明友", "资云", "黄鸿雁", "李城辉", "陆玉坡", "林育新", "林洁彬", "杨加丹",
    "红红", "不悔", "至尊宝", "云飞扬", "司空摘心", "铁中棠", "司徒静", "杨开泰", "芊芊", "燕南天",
    "林仙儿", "独孤剑", "白玉京", "慕容九", "上官小仙", "原随云", "花飞"
];

var nametxt = $('.name');
var pcount = xinm.length - 1;
var runing = true;
var td = 78; //游戏名额
var num = 0;
var t;
var index = 0;

function start() {
    if (runing) {
        runing = false;
        $('#btntxt').removeClass('start').addClass('stop');
        $('#btntxt').html('停止');
        startNum()
    } else {
        runing = true;
        $('#btntxt').removeClass('stop').addClass('start');
        $('#btntxt').html('开始');
        stop();
        cc()
    }
}

function startNum() {
    num = Math.floor(Math.random() * pcount);
    nametxt.html(xinm[num]);
    t = setTimeout(startNum, 0);
}

function stop() {
    pcount = xinm.length - 1;
    clearInterval(t);
    t = 0;
    if (xinm.length == 1) {
        $('#btntxt').addClass('disnone');
        $('#btnno').removeClass('disnone').addClass('disblock');
    }
}

function cc() {
    index++
    console.log(xinm[num])
    console.log(index)
    $('.list').prepend("<p>" + index + ' ' + xinm[num] + "</p>");
    xinm.splice($.inArray(xinm[num], xinm), 1);
    td = td - 1;
}