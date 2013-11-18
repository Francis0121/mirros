$(function() {
	
	var filter = "win16|win32|win64|mac";
	 if( navigator.platform  ){
		 if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
			 $.pagingItem();
		 }
	 }
	 //~ Init
	 if('app' == document.URL.substring(document.URL.lastIndexOf('app')) || document.URL.substring(document.URL.lastIndexOf('app')) == 'app?navFlag=H' || document.URL.lastIndexOf('cpn') > 0){
		$.scrollPaging();
		$.setCategory();
		$.hotNewChangeBtnInit();
	 }
	$(document).on("pageshow", function () {
		if('app' == document.URL.substring(document.URL.lastIndexOf('app')) || document.URL.substring(document.URL.lastIndexOf('app')) == 'app?navFlag=H' || document.URL.lastIndexOf('cpn') > 0){
			$.pagingItem();
			$.hotNewChangeBtnInit();
			$.setCategory();
		}
	});
	
});

$.pagingItem = function(){
	$.mobile.showPageLoadingMsg();
	var navFlag = null;
	var idx = $('.jt-app-header-category').length-1;
	var categoryPn = $('.jt-app-header-category:eq('+idx+')').attr('data-category');
	$('.jt-app-item-content').attr('data-nav') == 'H' ? navFlag = 'H': navFlag=null;
	$.post(contextPath+'/app/ajax/productPagination.jt',{navFlag : navFlag, categoryPn : categoryPn}, function(data){
    	if(data.mergeItems.length > 0){
			$.attendProductItems(data);
			$.mobile.hidePageLoadingMsg();
    	}else{
            	//TODO end dialog
    	}
    });
};
$.scrollPaging = function(){
	$(window).scroll(function(){
	    if($(window).scrollTop() == $(document).height() - $(window).height() ){
	    	$.pagingItem();
	    }
	});
};

$.attendProductItems = function(data){
	var html ='';
	var items = data.mergeItems;
	for(var idx=0, size = items.length; idx < size; idx++){
		html += '<div class="jt-app-item-list-products" data-url="'+items[idx].url+'" data-productPn="'+items[idx].productPn+'">';
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
	var productPn = $(this).attr('data-productPn');
	$.insertProductClickStatistic(productPn);
	location.href=$(this).attr('data-url');
});




