if (typeof jtown.seller == 'undefined') {
	jtown.seller = {};
}

$(function() {
	
	jtown.seller.syncPopup();
	jtown.seller.startIntro();
	jtown.seller.markIntro();
	jtown.seller.syncIntro();
	jtown.seller.syncMainNotice();
	jtown.seller.syncMainImage();
	jtown.seller.syncProduct();
	jtown.seller.syncEvent();
	jtown.seller.syncExpandNotice();

	$('#jt-event-second-image').uploadify({
		'formData' : {'pn' : $('#jt-seller-body').attr('data-spn'), 'category' : 'event'},
		'buttonText' : '이미지 업로드',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
        'fileSizeLimit' : '2MB',
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadStart' : function(){
			jtown.loading.start();
		},
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.secondEvent(eval('('+data+')'));
			setTimeout('jtown.loading.finish()');
		}
	});
	
	$('#jt-event-first-image').uploadify({
		'formData' : {'pn' : $('#jt-seller-body').attr('data-spn'), 'category' : 'event'},
		'buttonText' : '이미지 업로드',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
        'fileSizeLimit' : '2MB',
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadStart' : function(){
			jtown.loading.start();
		},
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.firstEvent(eval('('+data+')'));
			setTimeout('jtown.loading.finish()', 0);
		}
	});
	
	$('#jt-represent-image').uploadify({
		'formData' : {'pn' : $('#jt-seller-body').attr('data-spn'), 'category' : 'represent'},
		'buttonText' : '사진 업로드',
		'method' : 'post',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
        'fileSizeLimit' : '2MB',
		'multi'	: false,
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onUploadStart' : function(){
			jtown.loading.start();
		},
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.mainImage(eval('('+data+')'));
			setTimeout('jtown.loading.finish()', 0);
		}
	});
	
	$('#jt-product-file').uploadify({
		'formData' : {'pn' : $('body').attr('data-spn'), 'category' : 'product'},
		'buttonClass' : 'uploadify-plus-insert-btn',
		'buttonText' : '<img src="'+ contextPath + 'resources/images/jt-cloth-icon.png'+'" style="float:left; margin:9px 7px 0 10px"/><span style="float:left; ">상품추가</span>',
		'height' : '30',
		'width' : '90',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
        'fileSizeLimit' : '2MB',
		'swf' : contextPath + 'resources/uploadify/uploadify.swf',
		'uploader' : contextPath + 'file/upload.jt',
		'itemTemplate' : '<div></div>',
		'errorMsg' : '',
		'onUploadStart' : function(){
			jtown.loading.start();
		},
		'onUploadSuccess' : function(file, data, response){
			jtown.seller.productImage(eval('('+data+')'));
		},
		'onQueueComplete' : function(){
			setTimeout('jtown.loading.finish()', 1000);
			setTimeout('location.reload();', 1000);
		}
	});
	
	$('#jt-product-finish').unbind('click').bind('click', function(){
		window.opener.document.location.reload();
		window.close();
	});
	
	$('#jt-tag-update-show-btn').toggle(function(){
		var url = contextPath + 'ajax/seller/selectInterestes.jt',
			json = {};	
		$.postJSON(url, json, function(interestes){
			var html = '';
			for(var i=0, iLen = interestes.length ; i < iLen ; i++){
				var interest = interestes[i];
				var checked = nullValueCheck(interest.sellerPn) ? '' : 'checked="checked"';
				html += '<li><input type="checkbox" '+checked+' name="jt-tag-check" class="jt-tag-check" value="'+interest.sectionPn+'"/><label for="jt-tag-check">'+htmlChars(interest.name)+'</label></li>';
			}
			$('#jt-tag-checkBox-section>ul').html(html);
			$('#jt-tag-checkBox').show();
			setTimeout('jtown.seller.changeTag()', 0);
			setTimeout('jtown.seller.changeTagIntro();', 0);
		});		
	}, function(){
		$('#jt-tag-checkBox').hide();
		setTimeout('jtown.seller.changeTagIntro();', 0);
	});
	
	
});

jtown.seller.changeTag = function(){
	$('.jt-tag-check').unbind('click').bind('click', function(){
		var checkedList = $('input:checkbox[name=jt-tag-check]:checked');
		if(checkedList.length > 5){
			$(this).each(function(){
				this.checked = false;
			});
			$('#jt-checkBox-header-text').css('color','#ff3600');
		}else{
			$('#jt-checkBox-header-text').css('color','#808080');
		}
	});
	
	$('#jt-tag-update-btn').unbind('click').bind('click', function(){
		var checkedList = $('input:checkbox[name=jt-tag-check]:checked');
		var spnList = new Array(checkedList.length);
		for(var i=0, cLen = checkedList.length; i < cLen; i++){
			var checked = checkedList[i];
			spnList[i] = checked.value;
		}
		
		var url = contextPath + 'ajax/seller/updateSellerInterestes.jt';
		var json = { spnList : spnList };
		
		$.postJSON(url, json, function(interestes){	
			$('#jt-seller-tag-content>span').remove();
			var html = '';
			for(var i=0, iLen = interestes.length ; i< iLen ;i++){
				var interest = interestes[i];
				html +='<span>'+interest.name;
				if((i+1) != iLen){
					html += ', ';
				}
				html +='</span>';
			}
			$('#jt-tag-update-show-btn').before(html);
			$('#jt-tag-checkBox').hide();
			setTimeout('jtown.seller.changeTagIntro();', 0);
		});		
	});
		
	$('#jt-tag-cancle-btn').unbind('click').bind('click', function(){
		$('#jt-tag-checkBox').hide();
		setTimeout('jtown.seller.changeTagIntro();', 0);
	});
};

jtown.seller.changeTagIntro = function(){
	var height = Number($('#step2').height())+20;
	$('.introjs-helperLayer').height(height);
};

makeIntro = function(){
	var intro = introJs();
	intro.setOptions({
        steps: 
        [
			{
				element: '#step3',
				intro: 	'<ol style="list-style: decimal; margin-left: 15px;">'+
						'	<li>마우스를 사진 위에 올립니다.</li>'+
						'	<li>수정 버튼을 클릭합니다.</li>'+
						'	<li>사진 업로드 버튼을 클릭하여 사진을 업로드 합니다.</li>'+
						'	<li>수정 버튼을 클릭합니다.</li>'+
						'</ol>'
			},
			{
				element: '#jt-seller-main-footer',
				intro: 	'<ol style="list-style: decimal; margin-left: 15px;">'+
						'	<li>마우스를 내용 위에 올립니다.</li>'+
						'	<li>수정 버튼을 클릭합니다.</li>'+
						'	<li>내용을 수정 합니다.</li>'+
						'	<li>수정 버튼을 클릭합니다.</li>'+
						'</ol>'
			},
			{
				element: '#step5',
				intro: 	'<ul>'+
						'	<li><span class="jt-home-shop-view jt-home-text-explain">VIEW</span> : 최근 일주일간 방문수</li>'+
						'	<li><span class="jt-home-shop-comment jt-home-text-explain jt-comment-text-explain">COMMENT</span> : 댓글 수</li>'+
						'	<li><span class="jt-home-shop-love jt-home-text-explain jt-love-text-explain">♥</span> : 하트 클릭 수</li>'+
						'</ul>'
			},
			{
				element: '#step1',
				intro:  'ShopNo : 고객고유번호<br/> Seller : 회사명 <br/>Site : 홈페이지주소<br/>'+
						'<span style="color : #ff431e;">위 정보는 고유정보 임으로 바꾸시려면 <a href="'+contextPath+'help/question" style="text-decoration:underline; color:#ff431e;">고객센터</a>에 문의 해주시기 바랍니다.</span>'
			},
			{
				element: '#step2',
				intro : '<ol>'+
						'	<li>쇼핑몰 대표 태그 입니다.</li>'+
						'	<li><span class="jt-intro-order">1.</span><span class="jt-tag-update-intro">수정</span> 을 클릭합니다.</li>'+
						'	<li><span class="jt-intro-order">2.</span>자신이 원하는 Tag을 체크합니다.</li>'+
						'	<li><span class="jt-intro-order">3.</span>수정 버튼을 클릭합니다.</li>'+
						'</ol>'
			},
			{
				element: '#jt-home-expand-shop-notice',
				intro: 	'<ol style="list-style: decimal; margin-left: 15px;">'+
						'	<li>마우스를 내용 위에 올립니다.</li>'+
						'	<li>수정 버튼을 클릭합니다.</li>'+
						'	<li>내용을 수정 합니다.</li>'+
						'	<li>수정 버튼을 클릭합니다.</li>'+
						'</ol>'
			},
			{
				element: '#step7',
				intro:  '소비자가 해당 상품을 클릭하면 입력된 상품 URL 로 이동됩니다. 입력되지 않았을 시에는 쇼핑몰 첫 페이지로 이동 됩니다. 입력은 다음 단계에서 간편하게 가능 합니다.'
			},
			{
				element: '#jt-seller-product-insert-wrap',
				intro:  '상품과 이벤트를 관리할 수 있습니다. 새 상품과 이벤트를 등록하여 당신의 상품들을 알려보세요.'
			}
		]
	});
	return intro;
};

jtown.seller.syncIntro = function(){
	$('.jt-seller-text-content').unbind('mouseover mouseout').bind('mouseover mouseout', function(event){
		if(event.type =='mouseover'){
			$(this).find('.question-mark-wrap').show();
		}else if(event.type == 'mouseout'){
			$(this).find('.question-mark-wrap').hide();
		}
	});
	
	$('.jt-home-shop-content-fn').unbind('mouseover mouseout').bind('mouseover mouseout', function(event){
		if(event.type =='mouseover'){
			$(this).find('.question-mark-wrap').show();
		}else if(event.type == 'mouseout'){
			$(this).find('.question-mark-wrap').hide();
		}
	});
	
	$('.jt-home-expand-shop-products').unbind('mouseover mouseout').bind('mouseover mouseout', function(event){
		if(event.type =='mouseover'){
			$(this).find('.question-mark-wrap').show();
		}else if(event.type == 'mouseout'){
			$(this).find('.question-mark-wrap').hide();
		}
	});
	
	$('.jt-seller-tag').unbind('mouseover mouseout').bind('mouseover mouseout', function(event){
		if(event.type =='mouseover'){
			$(this).find('.question-mark-wrap').show();
		}else if(event.type == 'mouseout'){
			$(this).find('.question-mark-wrap').hide();
		}
	});
};

jtown.seller.startIntro = function(){
	$('#showHow').unbind('click').bind('click', function(){
		makeIntro().start();
  	});
	
	$('#showHowPopup').unbind('click').bind('click',function(){
		makePoupIntro().start();
	});
};

jtown.seller.markIntro = function(){
	$('.question-mark').unbind('click').bind('click', function(){
		$('.question-mark').addClass('question-mark-hide');
		var step = $(this).attr('data-step');
		makeIntro().goToStep(step).start().oncomplete(function(){
			jtown.seller.markIntro();
			$('.question-mark').removeClass('question-mark-hide');
		}).onexit(function(){
			jtown.seller.markIntro();
			$('.question-mark').removeClass('question-mark-hide');
		});
	});	
};

jtown.seller.syncProduct = function() {
	$('.jt-home-expand-shop-products .thumbnail').unbind('mouseover mouseout');
	$('.jt-home-expand-shop-products .thumbnail').bind('mouseover mouseout', function(event){
		if(event.type =='mouseover'){
			$(this).find('.jt-product-article-object-wrap').show();
		}else if(event.type == 'mouseout'){
			$(this).find('.jt-product-article-object-wrap').hide();
		}
	});
	
	$('#jt-product-popup').unbind('click').bind('click', function(){
		var url = contextPath + 'seller/products/'+$(this).attr('data-pn');
		var option = 'width=630, height=610, left=500,top=200, toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no';
		
		window.open(url, 'item', option);
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
		$('.jt-event-article-object-item').removeClass('jt-event-article-object-item-active');
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

jtown.seller.changeExpandTextIntro = function(){
	var height = Number($('#jt-home-expand-shop-notice').height()) + 20;
	$('.introjs-helperLayer').height(height);
};

jtown.seller.syncExpandNotice = function(){
	$('#jt-home-expand-shop-notice').unbind('mouseover mouseout').bind('mouseover mouseout', function(event) {
		var display = $('#jt-seller-expand-notice-update-tool').css('display');
		if (display == 'none') {
			if (event.type == 'mouseover') {
				$('#jt-seller-expand-notice-hover-tool').show();
				$(this).find('.question-mark-wrap').show();
			} else if (event.type == 'mouseout') {
				$('#jt-seller-expand-notice-hover-tool').hide();
				$(this).find('.question-mark-wrap').hide();
			}
		}
	});

	$('#jt-seller-expand-notice-updateShow').unbind('click').bind('click', function() {
		$('#jt-seller-expand-notice-hover-tool').hide();
		$('#jt-seller-expand-shop-text').hide();
		$('#jt-seller-expand-notice-update-tool').show();
		$('#jt-seller-expand-textarea').show();
		setTimeout('jtown.seller.changeExpandTextIntro();', 0);
	});

	$('#jt-seller-expand-notice-update').unbind('click').bind('click', function() {
		$('#jt-seller-expand-notice-update-tool').hide();
		var url = contextPath + 'ajax/seller/changeLongNotice.jt',
			longNotice =  $('#jt-seller-expand-textarea').val(),
			json = { 'longNotice': longNotice, 'pn': $(this).parents("#jt-home-expand-shop").attr("data-spn") };
		
		$.postJSON(url, json, function(){
			return jQuery.ajax({
				'success' : function(){
					$('#jt-seller-expand-textarea').hide();
					$('#jt-seller-expand-shop-text').html(longNotice).show();
					setTimeout('jtown.seller.changeExpandTextIntro();', 0);
				},
				'error' : function(){
					$('#jt-seller-expand-textarea').hide();
					$('#jt-seller-expand-shop-text').show();
					setTimeout('jtown.seller.changeExpandTextIntro();', 0);
					jtown.dialog('오류발생');
				}
			});
		});
	});

	$('#jt-seller-expand-notice-cancle').unbind('click').bind('click', function() {
		$('#jt-seller-expand-notice-update-tool').hide();
		$('#jt-seller-expand-textarea').hide().val($('#jt-seller-expand-shop-text').html());
		$('#jt-seller-expand-shop-text').show();
		setTimeout('jtown.seller.changeExpandTextIntro();', 0);
	});
};

jtown.seller.changeMainTextIntro = function(){
	var height = Number($('#jt-seller-main-footer').height()) + 20;
	$('.introjs-helperLayer').height(height);
};

jtown.seller.syncMainNotice = function() {
	$('#jt-seller-main-footer').unbind('mouseover mouseout').bind('mouseover mouseout', function(event) {
		var display = $('#jt-seller-main-notice-update-tool').css('display');
		if (display == 'none') {
			if (event.type == 'mouseover') {
				$('#jt-seller-main-notice-hover-tool').show();
				$(this).find('.question-mark-wrap').show();
			} else if (event.type == 'mouseout') {
				$('#jt-seller-main-notice-hover-tool').hide();
				$(this).find('.question-mark-wrap').hide();
			}
		}
	});

	$('#jt-seller-main-notice-updateShow').unbind('click').bind('click', function() {
		$('#jt-seller-main-notice-hover-tool').hide();
		$('#jt-seller-main-footer-text').hide();
		$('#jt-seller-main-notice-update-tool').show();
		$('#jt-seller-main-textarea').show();
		setTimeout('jtown.seller.changeMainTextIntro()');
	});

	$('#jt-seller-main-notice-update').unbind('click').bind('click', function() {
		$('#jt-seller-main-notice-update-tool').hide();
		var url = contextPath + 'ajax/seller/changeNotice.jt',
			notice =  $('#jt-seller-main-textarea').val(),
			json = { 'notice' : notice	};
		
		$.postJSON(url, json, function(){
			return jQuery.ajax({
				'success' : function(){
					$('#jt-seller-main-textarea').hide();
					if(nullValueCheck(notice)){
						$('#jt-seller-main-textarea').hide();
						$('#jt-seller-main-footer-text').html('쇼핑몰 소개 공간입니다. 쇼핑몰의 특징이나 최근 진행하는 이벤트를 적어보세요.').show().attr('data-isNull', 'true').addClass('jt-home-shop-footer-text-isNull');
					}else{
						$('#jt-seller-main-footer-text').html(notice).show().attr('data-isNull', 'false').removeClass('jt-home-shop-footer-text-isNull');						
					}
					setTimeout('jtown.seller.changeMainTextIntro()');
				},
				'error' : function(){
					$('#jt-seller-main-textarea').hide();
					$('#jt-seller-main-footer-text').show();
					setTimeout('jtown.seller.changeMainTextIntro()');
					jtown.dialog('오류발생');
				}
			});
		});
	});

	$('#jt-seller-main-notice-cancle').unbind('click').bind('click', function() {
		var isNull = $('#jt-seller-main-footer-text').attr('data-isNull'), html = $('#jt-seller-main-footer-text').html();
		if(isNull == 'true'){ html = ''; }
		
		$('#jt-seller-main-notice-update-tool').hide();
		$('#jt-seller-main-textarea').hide().val(html);
		$('#jt-seller-main-footer-text').show();
		setTimeout('jtown.seller.changeMainTextIntro()');
	});
};

jtown.seller.syncMainImage = function() {
	$('#jt-seller-main-image').unbind('mouseover mouseout').bind('mouseover mouseout', function(event) {
		var display = $('#jt-seller-main-image-update-tool').css('display');
		if (display == 'none') {
			if (event.type == 'mouseover') {
				$('#jt-seller-main-image-hover-tool').show();
				$(this).find('.question-mark-wrap').show();
			} else if (event.type == 'mouseout') {
				$('#jt-seller-main-image-hover-tool').hide();
				$(this).find('.question-mark-wrap').hide();
			}
		}
	});

	$('#jt-seller-main-image-updateShow').unbind('click').bind('click', function() {
		$('#jt-seller-main-image-hover-tool').hide();
		$('#jt-seller-main-image-update-tool').show();
		setTimeout('jtown.seller.changeMainBgHeight()', 0);
	});

	$('#jt-seller-main-image-update').unbind('click').bind('click', function() {
		$('#jt-seller-main-image-update-tool').hide();
		jtown.seller.mainImageUpdate();
	});

	$('#jt-seller-main-image-cancle').unbind('click').bind('click', function() {
		$('#jt-seller-main-image-update-tool').hide();
		jtown.seller.mainImageCancle();
		setTimeout('jtown.seller.changeMainBgHeight()', 0);
	});
};

jtown.seller.changeMainBgHeight = function(){
	var height = $('#jt-seller-main-image').height();
	$('#jt-seller-main-image-update-tool').height(height);
	height = Number(height) + 20;
	$('.introjs-helperLayer').height(height);
};

jtown.seller.mainImage = function(file) {
	var oldSrc = $('#jt-seller-main-image-area').attr('src'),
		newSrc = contextPath+'photo/thumbnail/'+file.saveName+'represent.'+file.type,
		oldSrcObject = $('#jt-seller-main-image-area').attr('data-oldSrc');
	$('#jt-seller-main-image-area').attr('src', newSrc).attr('data-imagePn', file.imagePn);
	if(nullValueCheck(oldSrcObject)){
		$('#jt-seller-main-image-area').attr('data-oldSrc', oldSrc);
	}
	
	setTimeout('jtown.seller.changeMainBgHeight()', 100);
};

jtown.seller.mainImageUpdate = function(){
	var url = contextPath + 'ajax/seller/changeMainImage.jt',
		json = { 'imagePn' : $('#jt-seller-main-image-area').attr('data-imagePn')};
	
	$.postJSON(url, json, function(text){
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
		if(product.todayCount ==13){
			jtown.dialog('하루에 올릴 수 있는 상품은 12개 입니다.');
		}else if(product.count > 9){
			jtown.dialog('상품은 10개 이하로 등록 가능합니다.');
		}
		var me = $('#jt-product-article-object-'+product.count);
		me.children('img').attr('src', contextPath+'photo/thumbnail/'+product.saveName+'product.'+file.type);
		me.addClass('jt-product-article-object-img');
		me.attr('data-ppn', product.pn);
		
		jtown.seller.syncPopup();
	});
};


//~ event

$('.jt-event-popup').bind('click', function(){
	var url = contextPath + 'seller/events/'+$(this).attr('data-pn');
	var option = 'width=550, height=530, left=500,top=200, toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no';
	
	window.open(url, 'event', option);
});
$('.jt-seller-event-insert-btn').bind('click', function(){
	$('.jt-product-article-update').show();
	$('.jt-product-article-insert').hide();
	$('#eventName').val('');
	$('#endDate').val('');
	$('#url').val('');
	$('.jt-product-error-text').text('');
});

$('.jt-event-endDate-input').datepicker({
	buttonText: "Calendar",
	dateFormat: "yy-mm-dd"
});

$('.jt-event-update-submit').bind('click', function(){
	var nowDate = new Date();
	var endDate = new Date($('.jt-event-endDate-input').val());
	var differenceDate = Math.floor((endDate - nowDate )/(1000*60*60*24));
	if(differenceDate > 29){
		jtown.dialog('만기일은 '+new Date(nowDate.getTime()+(1000*60*60*24* 30) ).format("yyyy년 MM월 dd일")+'까지 입니다.');
		return;
	}else if(differenceDate < -1){
		jtown.dialog('지난날은 만기일로 할 수 없습니다.');
		return;
	}
	
	var pn = null; 
	$('.jt-event-article-object-item-active').length == 1 ? pn = $('.jt-event-article-object-item-active').parent('.jt-event-article-object').attr('data-ppn') : pn = null;
	
	var form = document.forms['event'];
	form.eventPn.value = pn;
	form._method.value = 'put';
	form.submit();
});

$('.jt-seller-event-delete').on('click', function() {
	var pn = $(this).parents('li').attr('data-ppn');
	var form = document.forms['event'];
	form.eventPn.value = pn;
	form._method.value = 'delete';
	form.submit();
});

$('.jt-event-article-object-item').on('click',function(){
	$eventPn = $(this).parent('.jt-event-article-object').attr('data-ppn');
	$('.jt-event-article-object-item').removeClass('jt-event-article-object-item-active');
	$(this).addClass('jt-event-article-object-item-active');
	$('.jt-product-error-text').text('');
	
	$.post(contextPath+'ajax/seller/getEventData.jt',{eventPn :  $eventPn}, function(data){
		$('.jt-product-article-update').show();
		$('.jt-product-article-insert').hide();
		$('#eventName').val(data.eventName);
		$('#endDate').val(new Date(data.endDate).format('yyyy-MM-dd'));
		$('#url').val(data.url);
	});
});

$('.jt-event-article-object').on({
	mouseover : function(){
		$(this).children('.jt-seller-expand-product-delete-tool').show();
	},
	mouseout: function(){
		$(this).children('.jt-seller-expand-product-delete-tool').hide();
	}
});

$('.jt-seller-event-wrap').on('click', function(){
	var openNewWindow = window.open("about:blank");
	openNewWindow.location.href=$(this).attr('data-url');
});

jtown.seller.syncEvent = function() {

}; 

jtown.seller.firstEvent = function(file){
	var oldSrc = $('#jt-seller-expand-event-first-img').attr('src'),
		newSrc = contextPath+'photo/thumbnail/'+file.saveName+'event.'+file.type,
		oldSrcObject = $('#jt-seller-expand-event-first-img').attr('data-oldSrc');
	
	$('#jt-seller-expand-event-first-img').attr('src', newSrc).attr('data-imagePn', file.imagePn);
	if(nullValueCheck(oldSrcObject)){
		$('#jt-seller-expand-event-first-img').attr('data-oldSrc', oldSrc);
	}
};

jtown.seller.secondEvent = function(file){
	var oldSrc = $('#jt-seller-expand-event-second-img').attr('src'),
		newSrc = contextPath+'photo/thumbnail/'+file.saveName+'event.'+file.type,
		oldSrcObject = $('#jt-seller-expand-event-second-img').attr('data-oldSrc');

	$('#jt-seller-expand-event-second-img').attr('src', newSrc).attr('data-imagePn', file.imagePn);
	if(nullValueCheck(oldSrcObject)){
		$('#jt-seller-expand-event-second-img').attr('data-oldSrc', oldSrc);
	}
};


jtown.seller.shopStatistic = function(s1,s2, year, month, labelType){
	var length = s1.length >= s2.length ? s1.length : s2.length;
	$('#jt-statistic-graph').html('');
	var label1, label2;
	if(labelType == 'admin'){
		label1 = '상품 클릭 수';
		label2 = '이벤트 클릭 수';
	}else if(labelType == 'seller'){
		label1 = '쇼핑몰의 상품 클릭수';
		label2 = '상위 20%의 상품 클릭수';
	}
	
	plot1 = $.jqplot('jt-statistic-graph',[s1,s2],{
	    legend: {
	        show: true,
	        location: 'ne',
	        xoffset: 15
	    },
	   series: [{label: label1},{label:label2}],
       axes: {
           xaxis: {
               renderer: $.jqplot.DateAxisRenderer,
               tickOptions: {
            	   formatString: '%d'
               },
               numberTicks: length 
           },
           yaxis: {
               tickOptions: {
                   formatString: '%d'
               }
           }
       },
       highlighter: {
           sizeAdjust: 10,
           tooltipLocation: 'n',
           useAxesFormatters: true,
           formatString: year+'-'+month+'-%s, %d회' 
       },
       cursor: {
           show: true
       }
   });
};
// ~ onLoad statistic 
if($('.jt-statistic-content').attr('data-time') !=null){
	if($('.jt-statistic-content').attr('data-role') =="admin"){
		$.postJSON(contextPath+'admin/ajax/getStatisticValue.jt', {}, function(object){
			$('.jt-statistic-content').attr('data-time',object.currentDate);
			$('.jt-statistic-title span').text(object.currentYear+'년 '+object.currentMonth+'월 통계');
			var productStatisticArray = jtown.seller.statisticToArray(object.productStatistic, object.currentYear, object.currentMonth);
			var eventStatisticArray = jtown.seller.statisticToArray(object.eventStatistic,object.currentYear, object.currentMonth);
			jtown.seller.shopStatistic(productStatisticArray,eventStatisticArray, object.currentYear, object.currentMonth,'admin');
		});
	}else{
		var sellerPn = $('.jt-statistic-content').attr('data-sellerPn');
		$.postJSON(contextPath+'ajax/statistic/getStatisticValue.jt', {sellerPn: sellerPn}, function(object){
			$('.jt-statistic-content').attr('data-time',object.currentDate);
			$('.jt-statistic-title span').text(object.currentYear+'년 '+object.currentMonth+'월 통계');
			var shopStatisticArray = jtown.seller.statisticToArray(object.shopStatistic, object.currentYear, object.currentMonth);
			var topStatisticArray = jtown.seller.statisticToArray(object.TopStatistic,object.currentYear, object.currentMonth);
			jtown.seller.shopStatistic(shopStatisticArray,topStatisticArray, object.currentYear, object.currentMonth,'seller');
		});
	}
};

jtown.seller.statisticToArray = function(array,year,month){
	var arraySize = array.length;
	var dataList = new Array();
	for(var idx=0; idx< arraySize; idx++){
		var data = new Array();
		data.push(array[idx].countDate);
		data.push(array[idx].todayCount);
		dataList.push(data);
	}
	if(arraySize == 0){
		var data = new Array();
		data.push(year+'-'+month+'-01');
		data.push(0);
		dataList.push(data);
	}
	return dataList;
};

$('.jt-statistic-next-month-btn').bind('click',function(){
	var nextMonth = $(this).val();
	var currentDate = $('.jt-statistic-content').attr('data-time');
	if($('.jt-statistic-content').attr('data-role') =="admin"){
		$.postJSON(contextPath+'admin/ajax/getStatisticValue.jt', {currentDate: currentDate , nextMonth : nextMonth}, function(object){
			$('.jt-statistic-content').attr('data-time',object.currentDate);
			$('.jt-statistic-title span').text(object.currentYear+'년 '+object.currentMonth+'월 통계');
			var productStatisticArray = jtown.seller.statisticToArray(object.productStatistic, object.currentYear, object.currentMonth);
			var eventStatisticArray = jtown.seller.statisticToArray(object.eventStatistic,object.currentYear, object.currentMonth);
			jtown.seller.shopStatistic(productStatisticArray,eventStatisticArray, object.currentYear, object.currentMonth,'admin');
		});
	}else{
		var sellerPn = $('.jt-statistic-content').attr('data-sellerPn');
		$.postJSON(contextPath+'ajax/statistic/getStatisticValue.jt', {sellerPn: sellerPn, currentDate: currentDate , nextMonth : nextMonth}, function(object){
			$('.jt-statistic-content').attr('data-time',object.currentDate);
			$('.jt-statistic-title span').text(object.currentYear+'년 '+object.currentMonth+'월 통계');
			var shopStatisticArray = jtown.seller.statisticToArray(object.shopStatistic, object.currentYear, object.currentMonth);
			var topStatisticArray = jtown.seller.statisticToArray(object.TopStatistic,object.currentYear, object.currentMonth);
			jtown.seller.shopStatistic(shopStatisticArray,topStatisticArray,object.currentYear, object.currentMonth, 'seller' );
		});
	}
});


$(function(){
	$(".jt-home-expand-shop-event-update-large-wrap-calender-btn").datepicker({
		showOn: "button",
		buttonImageOnly: true,
		buttonImage: "../resources/jquery/images/calendar.gif",
		buttonText: "Calendar",
		dateFormat: "yy-mm-dd"
	});
	$('.jt-home-expand-shop-event-update-large-wrap').easyModal({
		top: 300,
		autoOpen: false,
		overlayOpacity: 0.3,
		overlayColor: "#333",
		overlayClose: false,
		closeOnEscape: false
	});
});

