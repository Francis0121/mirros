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

	$('#jt-event-second-image').uploadify({
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.secondEvent(getFile(data));
		}
	});
	
	$('#jt-event-first-image').uploadify({
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.firstEvent(getFile(data));
		}
	});
	
	$('#jt-represent-image').uploadify({
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.mainImage(getFile(data));
		}
	});

	$('#jt-product-file').uploadify({
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'onQueueComplete' : function(queueData) {
//				if (queueData.uploadsSuccessful) {
//					location.reload();
//				}
		},
		'onUploadSuccess' : function(file, data, response){
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
		var url = contextPath + '/ajax/seller/changeNotice.jt',
			notice =  $('#jt-seller-main-textarea').val(),
			json = { 'notice' : notice	};
		
		$.postJSON(url, json, function(){
			return jQuery.ajax({
				'success' : function(){
					$('#jt-seller-main-textarea').hide();
					$('#jt-seller-main-footer-text').html(notice).show();
				},
				'error' : function(){
					$('#jt-seller-main-textarea').hide();
					$('#jt-seller-main-footer-text').show();
					alert('오류발생');
				}
			});
		});
	});

	$('#jt-seller-main-notice-cancle').unbind('click');
	$('#jt-seller-main-notice-cancle').bind('click', function() {
		$('#jt-seller-main-notice-update-tool').hide();
		$('#jt-seller-main-textarea').hide().val($('#jt-seller-main-footer-text').html());
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
		jtown.seller.mainImageUpdate();
	});

	$('#jt-seller-main-image-cancle').unbind('click');
	$('#jt-seller-main-image-cancle').bind('click', function() {
		$('#jt-seller-main-image-update-tool').hide();
		jtown.seller.mainImageCancle();
	});
};

jtown.seller.mainImage = function(file) {
	var oldSrc = $('#jt-seller-main-image-area').attr('src'),
		newSrc = contextPath+'resources/uploadImage/'+file.saveName,
		oldSrcObject = $('#jt-seller-main-image-area').attr('data-oldSrc');
	$('#jt-seller-main-image-area').attr('src', newSrc).attr('data-imagePn', file.imagePn);
	if(nullValueCheck(oldSrcObject)){
		$('#jt-seller-main-image-area').attr('data-oldSrc', oldSrc);
	}
};

jtown.seller.mainImageUpdate = function(){
	var url = contextPath + 'ajax/seller/changeMainImage.jt',
		json = { 'imagePn' : $('#jt-seller-main-image-area').attr('data-imagePn')};
	
	$.postJSON(url, json, function(){
		return jQuery.ajax({
			'success' : function(){
				$('#jt-seller-main-image-area').attr('data-oldSrc', '').attr('data-imagePn', '');
			},
			'error' : function(){
				alert("오류 발생!");
			}
		});
	});
};

jtown.seller.mainImageCancle = function(){
	var oldSrc = $('#jt-seller-main-image-area').attr('data-oldSrc');
	$('#jt-seller-main-image-area').attr('src', oldSrc).attr('data-oldSrc', '').attr('data-imagePn', '');
	$('#representImageForm #filedata').val('');
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

	$('#jt-seller-expand-event-first, #jt-seller-expand-event-second').unbind('mouseover mouseout');
	$('#jt-seller-expand-event-first, #jt-seller-expand-event-second').bind('mouseover mouseout', function() {
		if ($(this).children('.jt-home-expand-shop-event-update-wrap').css('display') == 'none') {
			if (event.type == 'mouseover') {
				$(this).children('.jt-home-expand-shop-event-tool').show();
			} else if (event.type == 'mouseout') {
				$(this).children('.jt-home-expand-shop-event-tool').hide();
			}
		}
	});

	$('.jt-home-expand-shop-event-tool').unbind('click');
	$('.jt-home-expand-shop-event-tool').bind('click', function() {
		$(this).parents('.jt-home-expand-shop-event').children('.jt-home-expand-shop-event-tool').hide();
		$(this).parents('.jt-home-expand-shop-event').children('.jt-home-expand-shop-event-update-wrap').show();
	});
	
	$('.jt-home-expand-shop-event-update-cancle').unbind('click');
	$('.jt-home-expand-shop-event-update-cancle').bind('click', function(){
		var $parent = $(this).parents('.jt-home-expand-shop-event');
		var $img = $parent.find('img');
		var oldSrc = $img.attr('data-oldSrc');
		
		$img.attr('src', oldSrc).attr('data-oldSrc', '').attr('data-imagePn', '');
		$parent.find('input[type=file]').val('');
		
		$parent.children('.jt-home-expand-shop-event-update-wrap').hide();
	});
	
	$('.jt-home-expand-shop-event-update-done').unbind('click');
	$('.jt-home-expand-shop-event-update-done').bind('click', function(){
		var $parent = $(this).parents('.jt-home-expand-shop-event');
		var $img = $parent.find('img');
		
		var url = contextPath + 'ajax/seller/changeEvent.jt',
			json = { 	'imagePn' 		:	$img.attr('data-imagePn'),
						'pn'			:	$parent.attr('data-epn'),
						'bannerOrder'	:	$parent.attr('data-bo')		};
		
		$.postJSON(url, json, function(){
			return jQuery.ajax({
				'success' : function(){
					$img.attr('data-oldSrc', '').attr('data-imagePn', '');
					$parent.children('.jt-home-expand-shop-event-update-wrap').hide();
				},
				'error' : function(){
					alert("오류 발생!");
				}
			});
		});
	});
	
};

jtown.seller.firstEvent = function(file){
	var oldSrc = $('#jt-seller-expand-event-first-img').attr('src'),
		newSrc = contextPath+'resources/uploadImage/'+file.saveName,
		oldSrcObject = $('#jt-seller-expand-event-first-img').attr('data-oldSrc');
	
	$('#jt-seller-expand-event-first-img').attr('src', newSrc).attr('data-imagePn', file.imagePn);
	if(nullValueCheck(oldSrcObject)){
		$('#jt-seller-expand-event-first-img').attr('data-oldSrc', oldSrc);
	}
};

jtown.seller.secondEvent = function(file){
	var oldSrc = $('#jt-seller-expand-event-second-img').attr('src'),
		newSrc = contextPath+'resources/uploadImage/'+file.saveName,
		oldSrcObject = $('#jt-seller-expand-event-second-img').attr('data-oldSrc');

	$('#jt-seller-expand-event-second-img').attr('src', newSrc).attr('data-imagePn', file.imagePn);
	if(nullValueCheck(oldSrcObject)){
		$('#jt-seller-expand-event-second-img').attr('data-oldSrc', oldSrc);
	}
};