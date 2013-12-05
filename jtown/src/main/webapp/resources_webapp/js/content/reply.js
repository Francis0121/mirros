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

$.deleteTarget = null;
$('body').on('taphold', '.jt-app-reply-comment-wrap', function(){
	var userPn = $('body').attr('data-cpn');
	if(userPn == ''){
		$.toast('로그인 해주세요.');
		return;
	}
	$('#jt-reply-popup-menu').popup('open');
	var eventPn = $(this).find('.jt-app-reply-event-wrap').attr('data-eventPn');
	var productPn = $(this).find('.jt-app-reply-img-wrap').attr('data-productPn');
	var commentPn = $(this).attr('data-comment-pn');
	var customerPn = $(this).attr('data-customer-pn');
	userPn != customerPn ? $('.jt-app-reply-popup-delete').hide() : $('.jt-app-reply-popup-delete').show();
	$.deleteTarget = $(this);
		
	$('#jt-reply-popup-menu').attr('data-event-pn', eventPn);
	$('#jt-reply-popup-menu').attr('data-product-pn', productPn);
	$('#jt-reply-popup-menu').attr('data-comment-pn', commentPn);
});

$('body').on('click', '.jt-app-reply-popup-warn', function(){
	var productPn = $('#jt-reply-popup-menu').attr('data-product-pn');
	productPn == null ? productPn =0 : '';  
	var commentPn = $('#jt-reply-popup-menu').attr('data-comment-pn');
	
	$.postJSON(contextPath + '/ajax/insertCommentWarn.jt', { commentPn : commentPn, productPn : productPn}, function(object) {
			if(object.message == '1'){
				$.toast('로그인 해주세요.');
			}else if(object.message == '2'){
				$.toast('판매자는 불가능합니다');
			}else if(object.message == '3'){
				$.toast('이미 신고되었습니다.');
			}else{
				$.toast('신고되었습니다.');
				$('#jt-reply-popup-menu').popup('close');
			}
			$.resetReplyPopup();
	});
});

$('body').on('click', '.jt-app-reply-popup-delete', function(){
	var productPn = $('#jt-reply-popup-menu').attr('data-product-pn');
	productPn == null ? productPn = 0 : ''; 
	var eventPn = $('#jt-reply-popup-menu').attr('data-event-pn');
	eventPn == null ? eventPn = 0 : ''; 
	var commentPn = $('#jt-reply-popup-menu').attr('data-comment-pn');
	
	$.postJSON(contextPath + '/ajax/deleteComment.jt', { commentPn : commentPn, productPn : productPn, eventPn : eventPn}, function(object) {
		if(object.message == '1'){
			$.toast('로그인 해주세요.');
		}else if(object.message == '2'){
			$.toast('판매자는 불가능합니다');
		}else if(object.message == '3'){
			$.toast('자신의 글만 삭제할 수 있습니다.');
		}else{
			$.toast('삭제되었습니다.');
			$.deleteTarget.remove();
			$('#jt-reply-popup-menu').popup('close');
		}
		$.resetReplyPopup();
	});
});

$.resetReplyPopup = function(){
	$('#jt-reply-popup-menu').removeAttr('data-comment-pn');
	$('#jt-reply-popup-menu').removeAttr('data-event-pn');
	$('#jt-reply-popup-menu').removeAttr('data-product-pn');
};