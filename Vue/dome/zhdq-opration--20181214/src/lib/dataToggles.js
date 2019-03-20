const dataFile = {}

dataFile.pickerDetails =function(data){
var datadefault=data!=undefined?data:[{text: '今日'},{text: '昨日'},{text: '本周'},{text: '本月'}];

var shortcuts=[
  {
    text: '今日',
    onClick(picker) {
        let date=new Date();
        const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
        const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
        start.setTime(start.getTime());
        picker.$emit('pick', [start, end]);
    }
    }, {
    text: '昨日',
    onClick(picker) {
        let date=new Date();
        const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
        const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
        start.setTime(start.getTime()-24*60*60*1000);
        end.setTime(end.getTime()-24*60*60*1000);
        picker.$emit('pick', [start, end]);
    }
    },{
    text: '本周',
    onClick(picker) {
        let date=new Date();
        const end = new Date(date.getFullYear(), date.getMonth(), (date.getDate() + 1 - date.getDay() || 7)+6 ,23,59,59);
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - date.getDay() || 7 ,0,0,0);
        picker.$emit('pick', [start, end]);
    }
    },{
    text: '本月',
    onClick(picker) {
        let date=new Date();
        const end = new Date(date.getFullYear(),date.getMonth() + 1, 0 ,23,59,59);
        const start = new Date(date.getFullYear(),date.getMonth(),1,0,0,0);
        picker.$emit('pick', [start, end]);
    }
  }
];

var temporaryData = []; 

for(let i=0;i<shortcuts.length;i++){
    for(let j=0;j<datadefault.length;j++){
        if(datadefault[j].text==shortcuts[i].text){
            temporaryData.push(shortcuts[i])
        }
    }
}
    return temporaryData
}

export default dataFile;