jQuery.CateNav=function(elem1,elem2){
		//娣诲姞鐩綍
		var currObj;
		var offsetTop=0;
		var h2List=new Array(),h3List=new Array();
		
		var addNav=function(){
			var i1=0,i2=0,n1=0,n2=0;
			var temp='<dl style="display:none;">';
			var cateList=$(elem1).html().match(/(<h[2-3][^>]*>.*?<\/h[2-3]>)/ig);
			for(var i=0;i<cateList.length;i++){
				if(/(<h2[^>]*>.*?<\/h2>)/ig.test(cateList[i])){
					n1++;
					n2=0;
					temp+='<dd class="cate-item1"><span>'+n1+'</span><a href="#'+n1+'">'+cateList[i].replace(/<[^>].*?>/g,"")+'</a></dd>';
					h2List[i1]=n1;
					i1++;
				}else{
					n2++;
					temp+='<dd class="cate-item2"><span>'+n1+'.'+n2+'</span><a href="#'+n1+'_'+n2+'">'+cateList[i].replace(/<[^>].*?>/g,"")+'</a></dd>';
					h3List[i2]=n1+'_'+n2;
					i2++;
				}
			}
			temp+='</dl>';
			$(elem2).append(temp);
		};
		//娣诲姞閿氱偣
		var addPoint=function(){
			var i1=i2=0;
			$(elem1).find('h2').each(function(){
				$(this).prepend('<a name="'+h2List[i1]+'"></a>');
				i1++;
			});
			$(elem1).find('h3').each(function(){
				$(this).prepend('<a name="'+h3List[i2]+'"></a>');
				i2++;
			});
		};
		//鐐瑰嚮閿氱偣锛岃烦杞埗瀹氫綅缃�
		var clickPoint=function(){
			$(elem2+' a').click(function(e){
				e.preventDefault();
				$(elem2+' dd').removeClass('active');
				$(this).parent('dd').addClass('active');
				currObj=$("[name='"+$(this).attr('href').replace(/#/,'')+"']");
				offsetTop=currObj.offset().top;
				$('html,body').animate({
					scrollTop:offsetTop
				},500,'swing');
			});
		};
		//灞忓箷婊氬姩锛屾樉绀哄苟閫変腑閿氱偣
		var scrollWin=function(){
		var windowTop=0;
			$(window).scroll(function(){
				windowTop=$(window).scrollTop();
				if(windowTop>=$(elem1).offset().top){
					$(elem2+' dl').slideDown(750);
				}else{
					$(elem2+' dl').slideUp(750);
				}
				$(elem2+' a').each(function(){
					currObj=$("[name='"+$(this).attr('href').replace(/#/,'')+"']");
					offsetTop=currObj.offset().top;
					if(windowTop>offsetTop){
						$(elem2+' dd').removeClass('active');
						$(this).parent('dd').addClass('active');
						return;
					}
				});
			});
		};
		var init=function(){
			addNav();
			addPoint();
			clickPoint();
			scrollWin();
		}
		init();
	}