$(function() {
	
	var filter = "win16|win32|win64|mac";
	 if( navigator.platform  ){
		 if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
			 $.pagingItem();
		 }
	 }
	 $.scrollPaging();
	
	
	
});
$.pagingItem = function(){
	$.mobile.showPageLoadingMsg();
	$.post(contextPath+'/app/ajax/productPagination.jt',{}, function(data){
    	if(data.mergeItems.length > 0){
			$.attendProductItems(data);
			$.mobile.hidePageLoadingMsg();
    	}else{
            	//end dialog
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
	console.log(items);
	for(var idx=0, size = items.length; idx < size; idx++){
		html += '<div class="jt-app-item-list-products">';
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
		console.log();
	}
	
	$('.jt-app-item-list').append(html);
};
