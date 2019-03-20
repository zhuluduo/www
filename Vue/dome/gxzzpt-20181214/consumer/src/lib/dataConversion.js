//工艺--行业书格式转换
const conversion = {}

conversion.LoadDataOne =function(data,dataLength){
        var newJson =data;
        var len = newJson.length; 
        var idInfo ;
        var disabledFalse=false;
        var disabledTrue=true;
        for (var i = 0; i < len; i++) {
          newJson[i].idInfo=parseInt(newJson[i].id);
          newJson[i].name=newJson[i].techniqueCatalogName;
          if(newJson[i].techniqueList!=undefined){
              newJson[i].techniqueList.map((vals)=>{
                  vals.techniqueCatalogName=vals.techniqueName;
                  vals.name=vals.techniqueName;
              })
              if(newJson[i].children==undefined){
                newJson[i].children=newJson[i].techniqueList;
              }
          }
          if(newJson[i].children==undefined&&newJson[i].techniqueList==undefined&&newJson[i].disabled==undefined){
            newJson[i].disabled=disabledTrue;
          }
            var item = newJson[i];
            if (item.children && item.children.length != 0) {
              var child = item.children;
              for (var j = 0; j < child.length; j++) {
                if (item.idInfo) {
                  child[j].idInfo = parseInt(child[j].id);
                  if(child[j].techniqueName){
                    child[j].disabled=disabledFalse;
                  }else{
                    child[j].disabled=disabledTrue;
                  }
                }
                else {
                  child[j].idInfo =parseInt(child[j].id);
                }
                if(child[j].techniqueList!=undefined&&child[j].children!=undefined){
                    child[j].children=child[j].children.concat(child[j].techniqueList)
                }
                if(child[j].techniqueList!=undefined&&child[j].children==undefined){
                  child[j].techniqueList.map((vals)=>{
                      vals.techniqueCatalogName=vals.techniqueName;
                      vals.name=vals.techniqueName;
                  })
                  child[j].children=child[j].techniqueList;
                }
                  newJson[len + j] = child[j];
            }
            len = newJson.length;
            }
         }
        return newJson.slice(0,dataLength)
};

conversion.LoadDataTwo=function(data,dataLength){
    var newJsonTwo =data;
    var len = newJsonTwo.length; 
    var idInfo ;
    var disabledFalse=false;
    var disabledTrue=true;
    for (var i = 0; i < len; i++) {
      newJsonTwo[i].idInfo=parseInt(newJsonTwo[i].id);
      newJsonTwo[i].name=newJsonTwo[i].industryCatalogName;
      if(newJsonTwo[i].industryList!=undefined){
          newJsonTwo[i].industryList.map((vals)=>{
              vals.industryCatalogName=vals.industryName;
              vals.name=vals.industryName;
          })
          if(newJsonTwo[i].children==undefined){
            newJsonTwo[i].children=newJsonTwo[i].industryList;
          }
      }
      if(newJsonTwo[i].children==undefined&&newJsonTwo[i].industryList==undefined&&newJsonTwo[i].disabled==undefined){
        newJsonTwo[i].disabled=disabledTrue;
      }
        var item = newJsonTwo[i];
        if (item.children && item.children.length != 0) {
          var child = item.children;
          for (var j = 0; j < child.length; j++) {
            if (item.idInfo) {
              child[j].idInfo = parseInt(child[j].id);
              if(child[j].industryName){
                child[j].disabled=disabledFalse;
              }else{
                child[j].disabled=disabledTrue;
              }
            }
            else {
              child[j].idInfo =parseInt(child[j].id);
            }
            if(child[j].industryList!=undefined&&child[j].children!=undefined){
                child[j].children=child[j].children.concat(child[j].industryList)
            }
            if(child[j].industryList!=undefined&&child[j].children==undefined){
              child[j].industryList.map((vals)=>{
                  vals.industryCatalogName=vals.industryName;
                  vals.name=vals.industryName;
              })
              child[j].children=child[j].industryList;
            }
              newJsonTwo[len + j] = child[j];
        }
        len = newJsonTwo.length;
        }
    }
    return newJsonTwo.slice(0,dataLength)
    }

export default conversion;