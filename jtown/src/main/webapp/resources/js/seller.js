if (typeof jtown == 'undefined') {
	jtown = {};
}

if (typeof jtown.seller == 'undefined') {
	jtown.seller = {};
}

$(function() {
	jtown.seller.syncMainNotice();

	jtown.seller.syncMainImage();

	jtown.seller.syncProductList();

	jtown.seller.syncEvent();
	
	jtown.seller.syncExpandNotice();

	$('#jt-event-second-image').uploadify({
		'buttonText' : '사진 업로드',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.secondEvent(eval('('+data+')'));
		}
	});
	
	$('#jt-event-first-image').uploadify({
		'buttonText' : '사진 업로드',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.firstEvent(eval('('+data+')'));
		}
	});
	
	$('#jt-represent-image').uploadify({
		'buttonText' : '사진 업로드',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.mainImage(eval('('+data+')'));
		}
	});
	
	$('#jt-product-file').uploadify({
		'buttonClass' : 'uploadify-plus-insert-btn',
		'buttonText' : '',
		'buttonImage' : contextPath + 'resources/images/jt-plus-btn.png',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.productImage(eval('('+data+')'));
		}
	});
});

jtown.seller.syncExpandNotice = function(){
	$('#jt-home-expand-shop-notice').unbind('mouseover mouseout').bind('mouseover mouseout', function(event) {
		var display = $('#jt-seller-expand-notice-update-tool').css('display');
		if (display == 'none') {
			if (event.type == 'mouseover') {
				$('#jt-seller-expand-notice-hover-tool').show();
			} else if (event.type == 'mouseout') {
				$('#jt-seller-expand-notice-hover-tool').hide();
			}
		}
	});

	$('#jt-seller-expand-notice-updateShow').unbind('click').bind('click', function() {
		$('#jt-seller-expand-notice-hover-tool').hide();
		$('#jt-seller-expand-shop-text').hide();
		$('#jt-seller-expand-notice-update-tool').show();
		$('#jt-seller-expand-textarea').show();
	});

	$('#jt-seller-expand-notice-update').unbind('click');
	$('#jt-seller-expand-notice-update').bind('click', function() {
		$('#jt-seller-expand-notice-update-tool').hide();
		var url = contextPath + 'ajax/seller/changeLongNotice.jt',
			longNotice =  $('#jt-seller-expand-textarea').val(),
			json = { 'longNotice' : longNotice	};
		
		$.postJSON(url, json, function(){
			return jQuery.ajax({
				'success' : function(){
					$('#jt-seller-expand-textarea').hide();
					$('#jt-seller-expand-shop-text').html(longNotice).show();
				},
				'error' : function(){
					$('#jt-seller-expand-textarea').hide();
					$('#jt-seller-expand-shop-text').show();
					jtown.dialog('오류발생');
				}
			});
		});
	});

	$('#jt-seller-expand-notice-cancle').unbind('click');
	$('#jt-seller-expand-notice-cancle').bind('click', function() {
		$('#jt-seller-expand-notice-update-tool').hide();
		$('#jt-seller-expand-textarea').hide().val($('#jt-seller-expand-shop-text').html());
		$('#jt-seller-expand-shop-text').show();
	});
};

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
		var url = contextPath + 'ajax/seller/changeNotice.jt',
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
					jtown.dialog('오류발생');
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
				jtown.dialog("오류 발생!");
			}
		});
	});
};

jtown.seller.mainImageCancle = function(){
	var oldSrc = $('#jt-seller-main-image-area').attr('data-oldSrc');
	$('#jt-seller-main-image-area').attr('src', oldSrc).attr('data-oldSrc', '').attr('data-imagePn', '');
	$('#representImageForm #filedata').val('');
};

jtown.seller.productImage = function(file){
	var url = contextPath + 'ajax/seller/insertProduct.jt',
		json = { 'imagePn' : file.imagePn};
	
	$.postJSON(url, json, function(product){
		if(product.count >= 9){
			$('#jt-seller-product-insert-wrap').hide();
		}
		if(!nullValueCheck(product.pn)){
			var parent = $('#jt-home-expand-shop'),
				size = Number(parent.attr('data-size')),
				nowSize = size + 1,
				np = Number(parent.attr('data-nowPosition')),
				image = contextPath + 'resources/uploadImage/'+file.saveName;
			
			var bigHtml = 	'<div class="jt-home-expand-shop-expandProduct" id="jt-product-'+nowSize+'">'+
							'	<img alt="상품" src="'+image+'"/>'+
							'</div>';
				smallHtml = '<li data-count="'+nowSize+'" data-ppn="'+product.pn+'">'+
							'	<div class="jt-seller-expand-product-delete-tool">'+
							'		<div>'+
							'			<a href="#none" class="jt-seller-product-delete jt-btn-white-small">'+
							'				<span class="btnImage"></span>'+
							'			</a>'+
							'		</div>'+
							'	</div>'+
							'	<a href="#none"class="jt-product-list"><img alt="상품" src="'+image+'"/></a>'+
							'</li>';
			if(nowSize == 1){
				$('#jt-seller-slide-content-dan').html(bigHtml);
				$('#jt-seller-slide-small').html(smallHtml);				
			}else{
				$('#jt-product-'+size).before(bigHtml);
				$('#jt-seller-slide-small').prepend(smallHtml);				
			}
			parent.attr('data-size', nowSize);
			if(size == np){
				parent.attr('data-nowPosition', nowSize);
			}	
			
			jtown.seller.syncProductList();
			jtown.expand.syncProductMove();
		}else{
			jtown.dialog('상품은 10개 이하로 등록 가능합니다.');
		}
	});
};

jtown.seller.syncProductList = function() {
	$('.jt-home-expand-shop-products ul li').unbind('mouseover mouseout');
	$('.jt-home-expand-shop-products ul li').bind(
			'mouseover mouseout',
			function(event) {
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
		var pn = $(this).parents('li').attr('data-ppn');
		var form = document.forms['product'];
		form.pn.value = pn;
		form.submit();
	});
};

jtown.seller.syncEvent = function() {

	$('#jt-seller-expand-event-first, #jt-seller-expand-event-second').unbind('mouseover mouseout');
	$('#jt-seller-expand-event-first, #jt-seller-expand-event-second').bind('mouseover mouseout', function(event) {
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
		var $img = $parent.find('img'), imagePn = $img.attr('data-imagePn');
		
		
		if(!nullValueCheck(imagePn)){
			var url = contextPath + 'ajax/seller/changeEvent.jt',
				json = { 	'imagePn' 		:	imagePn,
							'pn'			:	$parent.attr('data-epn'),
							'bannerOrder'	:	$parent.attr('data-bo')		};
			
			$.postJSON(url, json, function(){
				return jQuery.ajax({
					'success' : function(){
						$img.attr('data-oldSrc', '').attr('data-imagePn', '');
						$parent.children('.jt-home-expand-shop-event-update-wrap').hide();
						var html = 	'<div class="jt-home-expand-shop-event-new">'+
										'<div>'+
											'<span class="jt-home-expand-shop-event-new-image">NEW</span>'+
										'</div>'+
									'</div>';
						$parent.prepend(html);
					},
					'error' : function(){
						jtown.dialog("오류 발생!");
					}
				});
			});
		}else{
			$img.attr('data-oldSrc', '').attr('data-imagePn', '');
			$parent.children('.jt-home-expand-shop-event-update-wrap').hide();
		}
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