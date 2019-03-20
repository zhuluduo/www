
	function dateFormat(status,content,dataList,TotalData){
		
		if(status){
			var markeds =dataCompile(content.baike_3d)
			var obj=$(markeds);
			let middleData = dataList; //声明中间变量
			
			
			for(let i=0;i<middleData.length;i++){
				let parmes = {
					data:[],
					list:'',
					img:''
				}
				TotalData.push(parmes)
			}
			
			for(let i=0;i<obj.length;i++){
				if(obj[i].nodeName !='#text'){
					for(let j=0;j<middleData.length;j++){
						if(content.ids == middleData[j].id){
							TotalData[j].data.push(obj[i].innerHTML);
							TotalData[j].list=markeds;
							if(obj[i].children.length!=0){
								if(obj[i].children[0].localName == 'img'){
									TotalData[j].img=obj[i].innerHTML;
								}
							}
							if(TotalData[j].img ==''){
								TotalData[j].img = '<img src="../html/images/img.png" alt="">'
							}
						}
					}
				}
			}
			let tableData = trimSpace(TotalData);
			return TotalData
		}else{
			return dataCompile(content)
		}
	}
	
		function dataCompile(content){
			let data = b64_to_utf8(content)
			var rendererMD = new marked.Renderer();  //
			marked.setOptions({
			renderer: rendererMD,
			gfm: true,
			tables: true,
			breaks: true,
			pedantic: false,
			sanitize: false,
			smartLists: true,
			smartypants: false
			});
			return marked(data)
		}
	
    function b64_to_utf8(str) {  
      return decodeURIComponent(escape(window.atob(str)));
    }
		
		//去除数组中的空值
		function trimSpace(array){
			 for(var i = 0 ;i<array.length;i++)
			 {
				 if(array[i].data == "" || typeof(array[i].data) == "undefined")
				 {
						array.splice(i,1);
						i= i-1; 
				 }
			 }
			 return array;
		}
