$(function() {
	 //~ Init
	 if($.checkLikePage()){
		 $.setHeightEventItems();
		//TODO 버튼 pressed 초기화
	 }
	$(document).on("pageshow", function () {
		if($.checkLikePage()){
			$.setHeightEventItems();
		}
	});
	
});

$.checkLikePage = function(){
	if('app/like' == document.URL.substring(document.URL.lastIndexOf('app'))){ 
		return true;
	}else{
		return false;
	}
};

$.setHeightEventItems = function(){
	$('.jt-app-item-list-events').height($('.jt-app-item-list-products:last').height());
	$('.jt-app-item-event-wrap').height($('.jt-app-item-list-products-img img:last').height());
};

