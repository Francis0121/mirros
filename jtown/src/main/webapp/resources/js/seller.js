if (typeof jtown == 'undefined') {
	jtown = {};
}

if (typeof jtown.seller == 'undefined') {
	jtown.seller = {};
}

$(document).ready(function(){
	jtown.seller.syncMainNotice();
	
	jtown.seller.syncMainImage();
});

jtown.seller.syncMainNotice = function(){
	$('#jt-seller-main-footer').unbind('mouseover mouseout');
	$('#jt-seller-main-footer').bind('mouseover mouseout', function(event){
		var display = $('#jt-seller-main-notice-update-tool').css('display');
		if(display == 'none'){
			if(event.type == 'mouseover'){
				$('#jt-seller-main-notice-hover-tool').show();
			}else if(event.type == 'mouseout'){
				$('#jt-seller-main-notice-hover-tool').hide();
			}	
		}
	});
	
	$('#jt-seller-main-notice-updateShow').unbind('click');
	$('#jt-seller-main-notice-updateShow').bind('click', function(){
		$('#jt-seller-main-notice-hover-tool').hide();
		$('#jt-seller-main-footer-text').hide();
		$('#jt-seller-main-notice-update-tool').show();
		$('#jt-seller-main-textarea').show();
	});
	
	$('#jt-seller-main-notice-update').unbind('click');
	$('#jt-seller-main-notice-update').bind('click', function(){
		$('#jt-seller-main-notice-update-tool').hide();
		//Ajax 로 Return 된 값 넣어줌
		$('#jt-seller-main-textarea').hide();
		$('#jt-seller-main-footer-text').show();
	});
	
	$('#jt-seller-main-notice-cancle').unbind('click');
	$('#jt-seller-main-notice-cancle').bind('click', function(){
		$('#jt-seller-main-notice-update-tool').hide();
		//Ajax 로 Return 된 값 넣어줌
		$('#jt-seller-main-textarea').hide().val();
		$('#jt-seller-main-footer-text').show();
	});
};

jtown.seller.syncMainImage = function(){
	$('#jt-seller-main-image').unbind('mouseover mouseout');
	$('#jt-seller-main-image').bind('mouseover mouseout', function(event){
		var display = $('#jt-seller-main-image-update-tool').css('display');
		if(display == 'none'){
			if(event.type == 'mouseover'){
				$('#jt-seller-main-image-hover-tool').show();
			}else if(event.type == 'mouseout'){
				$('#jt-seller-main-image-hover-tool').hide();
			}	
		}
	});
	
	$('#jt-seller-main-image-updateShow').unbind('click');
	$('#jt-seller-main-image-updateShow').bind('click', function(){
		$('#jt-seller-main-image-hover-tool').hide();
		$('#jt-seller-main-image-update-tool').show();
	});
	
	$('#jt-seller-main-image-update').unbind('click');
	$('#jt-seller-main-image-update').bind('click', function(){
		$('#jt-seller-main-image-update-tool').hide();
	});
	
	$('#jt-seller-main-image-cancle').unbind('click');
	$('#jt-seller-main-image-cancle').bind('click', function(){
		$('#jt-seller-main-image-update-tool').hide();
	});
};

