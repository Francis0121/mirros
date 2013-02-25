if (typeof jtown == 'undefined') {
	jtown = {};
}

if (typeof jtown.seller == 'undefined') {
	jtown.seller = {};
}

$(document).ready(function() {
	jtown.seller.syncMainNotice();

	jtown.seller.syncMainImage();

	jtown.seller.syncProductList();

	jtown.seller.syncEvent();

	$('#representImageForm').ajaxForm({
		success : function(data) {
			jtown.seller.mainImage(getFile(data));
			alert('이미지가 업로드 되었습니다');
		},
		error : function() {
			alert('파일입력시 에러가 발생하였습니다.');
		}
	});
});

jtown.seller.syncMainNotice = function() {
	$('#jt-seller-main-footer').unbind('mouseover mouseout');
	$('#jt-seller-main-footer').bind('mouseover mouseout', function(event) {
		var display = $('#jt-seller-main-notice-update-tool').css('display');
		if (display == 'none') {
			if (event.type == 'mouseover') {
				$('#jt-seller-main-notice-hover-tool').show();
			} else if (event.type == 'mouseout') {
				$('#jt-seller-main-notice-hover-tool').hide();
			}
		}
	});

	$('#jt-seller-main-notice-updateShow').unbind('click');
	$('#jt-seller-main-notice-updateShow').bind('click', function() {
		$('#jt-seller-main-notice-hover-tool').hide();
		$('#jt-seller-main-footer-text').hide();
		$('#jt-seller-main-notice-update-tool').show();
		$('#jt-seller-main-textarea').show();
	});

	$('#jt-seller-main-notice-update').unbind('click');
	$('#jt-seller-main-notice-update').bind('click', function() {
		$('#jt-seller-main-notice-update-tool').hide();
		// Ajax 로 Return 된 값 넣어줌
		$('#jt-seller-main-textarea').hide();
		$('#jt-seller-main-footer-text').show();
	});

	$('#jt-seller-main-notice-cancle').unbind('click');
	$('#jt-seller-main-notice-cancle').bind('click', function() {
		$('#jt-seller-main-notice-update-tool').hide();
		// Ajax 로 Return 된 값 넣어줌
		$('#jt-seller-main-textarea').hide().val();
		$('#jt-seller-main-footer-text').show();
	});
};

jtown.seller.syncMainImage = function() {
	$('#jt-seller-main-image').unbind('mouseover mouseout');
	$('#jt-seller-main-image').bind('mouseover mouseout', function(event) {
		var display = $('#jt-seller-main-image-update-tool').css('display');
		if (display == 'none') {
			if (event.type == 'mouseover') {
				$('#jt-seller-main-image-hover-tool').show();
			} else if (event.type == 'mouseout') {
				$('#jt-seller-main-image-hover-tool').hide();
			}
		}
	});

	$('#jt-seller-main-image-updateShow').unbind('click');
	$('#jt-seller-main-image-updateShow').bind('click', function() {
		$('#jt-seller-main-image-hover-tool').hide();
		$('#jt-seller-main-image-update-tool').show();
	});

	$('#jt-seller-main-image-update').unbind('click');
	$('#jt-seller-main-image-update').bind('click', function() {
		$('#jt-seller-main-image-update-tool').hide();
	});

	$('#jt-seller-main-image-cancle').unbind('click');
	$('#jt-seller-main-image-cancle').bind('click', function() {
		$('#jt-seller-main-image-update-tool').hide();
	});
};

jtown.seller.mainImage = function(file) {
	alert(file.saveName + ' ' + file.imagePn);
};

jtown.seller.syncProductList = function() {
	$('.jt-home-expand-shop-products ul li').unbind('mouseover mouseout');
	$('.jt-home-expand-shop-products ul li').bind(
			'mouseover mouseout',
			function(evnet) {
				if (event.type == 'mouseover') {
					$(this).children('.jt-seller-expand-product-delete-tool')
							.show();
				} else if (event.type == 'mouseout') {
					$(this).children('.jt-seller-expand-product-delete-tool')
							.hide();
				}
			});

	$('.jt-seller-product-delete').unbind('click');
	$('.jt-seller-product-delete').bind('click', function() {
		// TODO 사진 삭제후 재조회(ajax X) Slide 변경어려움
		location.href = contextPath + 'seller/2';
	});

	$('.jt-home-expand-shop-products').unbind('mouseover mouseout');
	$('.jt-home-expand-shop-products').bind('mouseover mouseout', function() {
		if (event.type == 'mouseover') {
			$(this).children('.jt-seller-expand-product-insert-tool').show();
		} else if (event.type == 'mouseout') {
			$(this).children('.jt-seller-expand-product-insert-tool').hide();
		}
	});
};

jtown.seller.syncEvent = function() {

	$('#jt-seller-expand-event-first, #jt-seller-expand-event-second').unbind(
			'mouseover mouseout');
	$('#jt-seller-expand-event-first, #jt-seller-expand-event-second').bind(
			'mouseover mouseout', function() {
				if ($(this).children('input').css('display') == 'none') {
					if (event.type == 'mouseover') {
						$(this).children('div').show();
					} else if (event.type == 'mouseout') {
						$(this).children('div').hide();
					}
				}
			});

	$('#jt-seller-expand-event-first div a').unbind('click');
	$('#jt-seller-expand-event-first div a').bind('click', function() {
		$('#jt-seller-expand-event-first').children('div').hide();
		$('#jt-seller-expand-event-first').children('input').show();
	});

	$('#jt-seller-expand-event-second div a').unbind('click');
	$('#jt-seller-expand-event-second div a').bind('click', function() {
		$('#jt-seller-expand-event-second').children('div').hide();
		$('#jt-seller-expand-event-second').children('input').show();
	});
};