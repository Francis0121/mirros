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

$.likeListRemoveBtnClick = function(productPn, eventPn, target){
	var $thisItem = target;
	
	if(eventPn == null){
		$.post(contextPath + '/ajax/productHeartClickMobile.jt', { productPn : productPn }, function(product) {
			var crudType = product.crudType, message = product.message;
			if(message == '1'){
				$.toast('로그인 해주세요.');
				$.changePageTransition('/app/login', 'fade');
				return;
			}else if(message == '2'){
				$.toast('판매자는 불가능합니다');
				return;
			}
			if('productHeartDelete' == crudType){
				$.toast('관심리스트에서 제거되었습니다.');
				$thisItem.remove();
			}
		});
	}else if(productPn == null){
		$.post(contextPath + '/ajax/eventHeartClickMobile.jt', { eventPn : eventPn }, function(event) {
			var crudType = event.crudType, message = event.message;
			if(message == '1'){
				$.toast('로그인 해주세요.');
				$.changePageTransition('/app/login', 'fade');
				return;
			}else if(message == '2'){
				$.toast('판매자는 불가능합니다');
				return;
			}
			if('eventHeartDelete' == crudType){
				$.toast('관심리스트에서 제거되었습니다.');
				$thisItem.remove();
			}
		});
	}
};

$('body').on('tap', '.jt-app-like-delete-wrap', function(e){
	e.stopPropagation();
	e.preventDefault();
	var $staticLikeWrap = $(this).parent('.jt-app-like-lists');
	$staticLikeWrap.css('background', 'linear-gradient( #ffd79b, #ffe9c8)');
	setTimeout(function(){
		$staticLikeWrap.css('background', 'linear-gradient( #ffffff, #f0f0f0)');
	}, 500);
	
	var productPn = $staticLikeWrap.attr('data-product-pn');
	var eventPn = $staticLikeWrap.attr('data-event-pn');
	
	$.post(contextPath + '/app/ajax/checkLogin.jt', {}, function(object) {
		if(object.isLogin==false){
			$.toast('로그인 해주세요.');
			$.changePageTransition('/app/login', 'fade');
			return;
		}else{
			$.likeListRemoveBtnClick(productPn, eventPn, $staticLikeWrap);
		}
	});
});
