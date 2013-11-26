$(function() {
	
});

$('body').on('click', '.jt-app-reply-comment-wrap', function(){
	var eventPn = $(this).find('.jt-app-reply-event-wrap').attr('data-eventPn');
	var productPn = $(this).find('.jt-app-reply-img-wrap').attr('data-productPn');
	productPn == null ? $.insertEventClickStatistic(eventPn) : $.insertProductClickStatistic(productPn); 
	location.href=$(this).attr('data-url');
});

$.checkReplyPage = function(){
	if($('.jt-app-header-category:last').attr('data-category-type') == 'reply'){
		return true;
	}else{
		return false;
	}
};

