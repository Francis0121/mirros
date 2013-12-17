$(function() {
	 //~ Init
});

$.checkLikePage = function(){
	if($('.jt-app-header-category:last').attr('data-category-type') == 'like'){
		return true;
	}else{
		return false;
	}
};

$.staticLikeWrap = null;

$('body').on('tap', '.jt-app-like-popup-ok', function(){
	var productPn = $('.jt-app-like-popup-dialog').attr('data-product-pn');
	var eventPn = $('.jt-app-like-popup-dialog').attr('data-event-pn');
	$.thisItem = $.staticLikeWrap;
	
	if(eventPn == null){
		$.post(contextPath + '/ajax/productHeartClickMobile.jt', { productPn : productPn }, function(product) {
			var crudType = product.crudType, message = product.message;
			if(message == '1'){
				$.toast('로그인 해주세요.');
				$.changePageTransition('/app/login', 'pop');
				return;
			}else if(message == '2'){
				$.toast('판매자는 불가능합니다');
				return;
			}
			if('productHeartDelete' == crudType){
				$('.jt-app-like-popup-dialog').attr('data-product-pn', null);
				$('.jt-app-like-popup-dialog').popup('close');
				$.toast('체크리스트에서 제거되었습니다.');
				$.thisItem.remove();
			}
		});
	}else if(productPn == null){
		$.post(contextPath + '/ajax/eventHeartClickMobile.jt', { eventPn : eventPn }, function(event) {
			var crudType = event.crudType, message = event.message;
			if(message == '1'){
				$.toast('로그인 해주세요.');
				$.changePageTransition('/app/login', 'pop');
				return;
			}else if(message == '2'){
				$.toast('판매자는 불가능합니다');
				return;
			}
			if('eventHeartDelete' == crudType){
				$('.jt-app-like-popup-dialog').attr('data-event-pn', null);
				$('.jt-app-like-popup-dialog').popup('close');
				$.toast('체크리스트에서 제거되었습니다.');
				$.thisItem.remove();
			}
		});
	}
});
$('body').on('tap', '.jt-app-like-popup-cancel', function(e){
	$('.jt-app-like-popup-dialog').popup('close');
	e.stopPropagation();
	e.preventDefault();
});

$('body').on('taphold', '.jt-app-like-lists', function(){
	isTapHold = true;
	var productPn =$(this).attr('data-product-pn');
	var eventPn =$(this).attr('data-event-pn');
	
	$.staticLikeWrap = $(this);
	$.post(contextPath + '/app/ajax/checkLogin.jt', {}, function(object) {
		if(object.isLogin==false){
			$.toast('로그인 해주세요.');
			$.changePageTransition('/app/login', 'pop');
			return;
		}else{
			$('.jt-app-like-popup-dialog').attr('data-product-pn', productPn);
			$('.jt-app-like-popup-dialog').attr('data-event-pn', eventPn);
			$('.jt-app-like-popup-dialog').popup('open');
		}
	});
});
