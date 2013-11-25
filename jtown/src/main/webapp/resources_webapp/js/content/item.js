$(function() {
	
	var filter = "win16|win32|win64|mac";
	 if( navigator.platform  ){
		 if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
			 if($.checkAppPage()){
				 $.pagingItem(); 
			 }
		 }
	 }
	 //~ Init
	 if($.checkAppPage()){
		$.scrollPaging();
		$.setCategory();
		$.hotNewChangeBtnInit();
		//TODO 버튼 pressed 초기화
	 }
	$(document).on("pageshow", function () {
		if($.checkAppPage()){
			$.pagingItem();
			$.hotNewChangeBtnInit();
			$.setCategory();
		}
	});
	
});

$.checkAppPage = function(){
	if('app' == document.URL.substring(document.URL.lastIndexOf('app')) || 
			document.URL.substring(document.URL.lastIndexOf('app')) == 'app?navFlag=H' || 
			document.URL.lastIndexOf('cpn') > 0 ||
			'app/#_=_' == document.URL.substring(document.URL.lastIndexOf('app')) ||
			'app#_=_' == document.URL.substring(document.URL.lastIndexOf('app'))){
		return true;
	}else{
		return false;
	}
};

$.pagingItem = function(){
	$.mobile.showPageLoadingMsg();
	var navFlag = null;
	var itemName = $('.jt-app-header-search').attr('data-search');
	var categoryPn = $('.jt-app-header-category:last').attr('data-category');
	$('.jt-app-item-content').attr('data-nav') == 'H' ? navFlag = 'H': navFlag=null;
	$.post(contextPath+'/app/ajax/productPagination.jt',{navFlag : navFlag, categoryPn : categoryPn, itemName : itemName}, function(data){
    	if(data.mergeItems.length > 0){
			$.attendProductItems(data);
			$.setHeightEventItems();
			$.mobile.hidePageLoadingMsg();
    	}else{
    		$.toast('Page End');
    		$.mobile.hidePageLoadingMsg();
    	}
    });
};
$.scrollPaging = function(){
	$(window).scroll(function(){
	    if($(window).scrollTop() == $(document).height() - $(window).height() ){
	    	if($.checkAppPage()){
	    		$.pagingItem();
	    	}
	    }
	});
};

$.attendProductItems = function(data){
	var html ='';
	var items = data.mergeItems;
	for(var idx=0, size = items.length; idx < size; idx++){
		if(items[idx].eventPn == 0){
			html += '<div class="jt-app-item-list-products" data-url="'+items[idx].url+'" data-product-pn="'+items[idx].productPn+'">';
			if(items[idx].hot == 1){
				html+='<div class="jt-app-item-list-products-hot"><img src="'+contextPath+'/resources/images/jt-hot.png"></div>';
			}
			html +=	'<div class="jt-app-item-list-products-img">';
			if(items[idx].contentType == ''){
				html+=		'<img src="'+contextPath+'/resources/uploadImage/'+items[idx].saveName+'" />';
			}else{
				html+=		'<img src="'+contextPath+'/photo/thumbnail/'+items[idx].saveName+'product.'+items[idx].contentType +'" />';	
			}
			html +=	'</div>';
			html +=	'<div class="jt-app-item-list-products-name">'+$.reduceText(11,items[idx].productName)+'</div>';
			html +=	'<div class="jt-app-item-list-products-price">'+$.formatNumber(items[idx].price)+'원</div>';
			html +=	'<div class="jt-app-item-list-products-reply">';
			if(items[idx].comment == null){
				html +=		'&nbsp; ';
			}else{
				html +=		'"'+$.reduceText(11,items[idx].comment)+'"';	
			}
			html += 	'</div>';
			html += '</div>';
		}else{
			html += '<div class="jt-app-item-list-events" data-url="'+items[idx].url+'" data-event-pn="'+items[idx].eventPn+'">';
			html += 	'<div class="jt-app-item-event-wrap"><span class="jt-app-event-mark jt-app-reply-event-mark"> </span></div>';
			html += 	'<div class="jt-app-item-event-name">'+items[idx].eventName+'</div>';
			html += 	'<div class="jt-app-item-event-contents">'; 
			html += 		'<div class="jt-app-item-shop-name">'+items[idx].shopName+'</div>';
			html += 		'<div class="jt-app-item-end-date">D-'+items[idx].endDate+'일 남았습니다.</div>';
			html += 		'<div class="jt-app-item-comment"></div>';
			html += 	'</div>';
			html += '</div>';
		}
	}
	$('.jt-app-item-list').append(html);
};
$.hotNewChangeBtnInit = function(){
	$('.jt-app-item-content').attr('data-nav') == 'H' ? $('.jt-app-item-change-mode').text('NEW'): $('.jt-app-item-change-mode').text('HOT'); 
};
$('body').on('click','.jt-app-item-change-mode',function(){
	if($('.jt-app-item-content').attr('data-nav') == 'H'){
		$.mobile.showPageLoadingMsg();
		location.href=contextPath+'/app';
		$.mobile.hidePageLoadingMsg();
	}else{
		$.mobile.showPageLoadingMsg();
		location.href=contextPath+'/app?navFlag=H';
		$.mobile.hidePageLoadingMsg();
	}
});

$('body').on('click', '.jt-app-item-list-products', function(){
	var productPn = $(this).attr('data-product-pn');
	$.insertProductClickStatistic(productPn);
	location.href=$(this).attr('data-url');
});

$('body').on('click', '.jt-app-item-list-events', function(){
	var eventPn = $(this).attr('data-event-pn');
	$.insertEventClickStatistic(eventPn);
	location.href=$(this).attr('data-url');
});

$.setHeightEventItems = function(){
	$('.jt-app-item-list-events').height($('.jt-app-item-list-products:last').height());
	$('.jt-app-item-event-wrap').height($('.jt-app-item-list-products-img img:last').height());
};

