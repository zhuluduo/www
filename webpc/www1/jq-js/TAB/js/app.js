//    获取id
function $(id){
	 return typeof id=="string"?document.getElementById(id):id;
}
   window.onload=function(){
	var titlename=$("tab_list").getElementsByTagName("li");
	 var tabcontent=$("tab_content").getElementsByTagName('div');
	 
    if(titlename.length!=tabcontent.length){
      return;
    }
    for (var i=0;i<titlename.length;i++) {
    	titlename[i].id=i;
    	titlename[i].onmousemove=function(){
    		for (var j=0;j<titlename.length;j++) {
    			titlename[j].className="";
    			tabcontent[j].style.display="none";
    		}
    		this.className="select";
    		tabcontent[this.id].style.display='block';
    	}
    }
     }