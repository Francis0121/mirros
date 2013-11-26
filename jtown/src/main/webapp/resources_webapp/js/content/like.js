$(function() {
	 //~ Init
	 if($.checkLikePage()){
		 $.setHeightEventItems();
	 }
	$(document).on("pageshow", function () {
		if($.checkLikePage()){
			$.setHeightEventItems();
		}
	});
	
});

$.checkLikePage = function(){
	if($('.jt-app-header-category:last').attr('data-category-type') == 'like'){
		return true;
	}else{
		return false;
	}
};

$.setHeightEventItems = function(){
	$('.jt-app-item-list-events').height($('.jt-app-item-list-products:last').height());
	$('.jt-app-item-event-wrap').height($('.jt-app-item-list-products-img img:last').height());
};

