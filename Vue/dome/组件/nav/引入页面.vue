vue--element-UI

一.引入组件（递归循环）
import NavMenu from './NavMenu.vue'

<el-menu
	mode="horizontal"
	menu-trigger='hover'
	unique-opened
	background-color="#fff">
	<NavMenu :navMenus="menuData"  @nodeClick="TechnologyClick" ></NavMenu>
</el-menu>


二.插入数据与方法执行
   
   1.插入数据:
   (data<数据见 index.json>,dataLength<数据长度>)
   this.menuData=LoadDataOne(data,dataLength)
   
   
   
   
   
   
   数据格式转化
   function LoadDataOne(data,dataLength){
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
}