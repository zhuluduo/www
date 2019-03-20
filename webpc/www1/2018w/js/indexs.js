
	// 百度地图API功能
	var map = new BMap.Map("l-map");
	var point = new BMap.Point(116.400244,39.92556);
	map.enableScrollWheelZoom(true);
	map.centerAndZoom(point, 12);
	var marker = new BMap.Marker(point);// 创建标注
  	var geoc = new BMap.Geocoder();  
	map.addOverlay(marker);             // 将标注添加到地图中
  
  	marker.addEventListener("mouseup", function(e){  
   			console.log(e)
		var pt = e.point;
       
		geoc.getLocation(pt, function(rs){
			var addComp = rs.addressComponents;
			console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
		});        
	});
