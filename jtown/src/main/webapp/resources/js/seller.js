if (typeof jtown == 'undefined') {
	jtown = {};
}

if (typeof jtown.seller == 'undefined') {
	jtown.seller = {};
}

$(function() {
	jtown.seller.syncPopup();
	
	jtown.seller.syncMainNotice();

	jtown.seller.syncMainImage();

	jtown.seller.syncProduct();

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
	
	$('#jt-product-popup').unbind('click').bind('click', function(){
		var url = contextPath + 'seller/products/'+$(this).attr('data-pn');
		var option = 'width=610, height=530, toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no';
		
		window.open(url, '', option);
	});
	
	$('#jt-product-file').uploadify({
		'buttonClass' : 'uploadify-plus-insert-btn',
		'buttonText' : '<img src="'+ contextPath + 'resources/images/jt-cloth-icon.png'+'" style="float:left; margin:9px 7px 0 10px"/><span style="float:left; ">상품추가</span>',
		'height' : '30',
		'width' : '90',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
        'fileSizeLimit' : '15MB',
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.productImage(eval('('+data+')'));
		}
	});
	
	$('#jt-product-finish').unbind('click').bind('click', function(){
		window.opener.document.location.reload();
		window.close();
	});
});

jtown.seller.syncProduct = function() {
	$('.jt-home-expand-shop-expandProduct').unbind('mouseover mouseout');
	$('.jt-home-expand-shop-expandProduct').bind('mouseover mouseout', function(){
		if(event.type =='mouseover'){
			$(this).find('.jt-product-article-object-wrap').show();
		}else if(event.type == 'mouseout'){
			$(this).find('.jt-product-article-object-wrap').hide();
		}
	});
};

jtown.seller.syncPopup = function(){
	
	$('.jt-product-article-object-img').unbind('mouseover mouseout').bind('mouseover mouseout', function(event){
		if (event.type == 'mouseover') {
			$(this).children('.jt-seller-expand-product-delete-tool').show();
			$(this).children('.jt-product-article-object-wrap').show();
		} else if (event.type == 'mouseout') {
			$(this).children('.jt-seller-expand-product-delete-tool').hide();
			$(this).children('.jt-product-article-object-wrap').hide();
		}
	});
	
	$('.jt-seller-product-delete').unbind('click');
	$('.jt-seller-product-delete').bind('click', function() {
		var pn = $(this).parents('li').attr('data-ppn');
		var form = document.forms['product'];
		form.pn.value = pn;
		form._method.value = 'delete';
		form.submit();
	});
	
	$('.jt-product-article-object-img').unbind('click').bind('click', function(){
		var active = $(this).hasClass('jt-product-active');
		
		if(active){
			$('.jt-product-article-update').hide();
			$('.jt-product-article-insert').show();
			$('.jt-product-article-object-img').removeClass('jt-product-active');
			return ;
		}
		var pn = $(this).attr('data-ppn'), name = $(this).attr('data-name'), 
			price = $(this).attr('data-price'), url = $(this).attr('data-url');
		var form = document.forms['product'];
		form.pn.value = pn;
		form.name.value = nullValueCheck(name) ? '' : name;
		form.price.value = nullValueCheck(price) ? '' : price;
		form.url.value = nullValueCheck(url) ? '' : url;
		$('.jt-product-article-insert').hide();
		$('.jt-product-article-update').show();
		$('.jt-product-input-error').addClass('jt-product-input').removeClass('jt-product-input-error');
		$('.jt-product-error').text('');
		$('.jt-product-article-object-img').removeClass('jt-product-active');
		$(this).addClass('jt-product-active');
	});
	
	$('.jt-product-update-cancle').unbind('click').bind('click', function(){
		$('.jt-product-article-update').hide();
		$('.jt-product-article-insert').show();
		$('.jt-product-article-object-img').removeClass('jt-product-active');
	});
	
	$('.jt-product-update-submit').unbind('click').bind('click', function(){
		var form = document.forms['product'];
		form._method.value = 'put';
		form.submit();
		$('.jt-product-article-update').hide();
		$('.jt-product-article-insert').show();
		$('.jt-product-article-object-img').removeClass('jt-product-active');
	});
};

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
		json = { 	'imagePn' : file.imagePn, 
					'saveName': file.saveName };
	
	$.postJSON(url, json, function(product){
		if(product.count >= 9){
			jtown.dialog('상품은 10개 이하로 등록 가능합니다.');
		}
		var me = $('#jt-product-article-object-'+product.count);
		me.children('img').attr('src', contextPath+'resources/uploadImage/'+product.saveName);
		me.addClass('jt-product-article-object-img');
		me.attr('data-ppn', product.pn);
		
		jtown.seller.syncPopup();
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