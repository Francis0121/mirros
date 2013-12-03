$(function() {
	 //~ Init
	 if($.checkLikePage()){
		 $.setHeightEventLikes();
	 }
	$(document).on("pageshow", function () {
		if($.checkLikePage()){
			$.setHeightEventLikes();
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


$.setHeightEventLikes = function(){
	$('.jt-app-item-list-events').height($('.jt-app-item-list-products:last').height());
	$('.jt-app-item-event-wrap').height($('.jt-app-item-list-products-img img:last').height());
};

$('body').on('taphold', '.jt-app-like-lists', function(){
	var productPn =$(this).attr('data-product-pn');
	var eventPn =$(this).attr('data-event-pn');
	
	if($('body').attr('data-cpn') == ''){
		$.toast('로그인 해주세요.');
		return;
	}else{
		$.thisItem = $(this);
		if(eventPn == null){
			$.post(contextPath + '/ajax/productHeartClickMobile.jt', { productPn : productPn }, function(product) {
				var crudType = product.crudType, message = product.message;
				if(message == '1'){
					$.toast('로그인 해주세요.');
					return;
				}else if(message == '2'){
					$.toast('판매자는 불가능합니다');
					return;
				}
				if('productHeartDelete' == crudType){
					$.toast('체크리스트에서 제거되었습니다.');
					$.thisItem.remove();
				}
			});
		}else if(productPn == null){
			$.post(contextPath + '/ajax/eventHeartClickMobile.jt', { eventPn : eventPn }, function(event) {
				var crudType = event.crudType, message = event.message;
				if(message == '1'){
					$.toast('로그인 해주세요.');
					return;
				}else if(message == '2'){
					$.toast('판매자는 불가능합니다');
					return;
				}
				if('eventHeartDelete' == crudType){
					$.toast('체크리스트에서 제거되었습니다.');
					$.thisItem.remove();
				}
			});
		}
	}
});
