$(function() {
	 //~ Init
	if($.checkAppPage()){
		$.pagingItem(1);
		$.scrollPaging();
		$.setCategory();
		$.hotNewChangeBtnInit();
	 }
	 $(document).on("pagechange", function () {
		 if($.checkAppPage()){
			 $.hotNewChangeBtnInit();
			 $.pagingItem();
			 $.setCategory();
			 $.scrollPaging();
		 }
	 });
});
$itemWrapStaticTarget = null;

$.checkAppPage = function(){
	if($('.jt-app-header-category:last').attr('data-category-type') == 'app'){
		return true;
	}else{
		return false;
	}
};

var isPaging = 0;
$.pagingItem = function(init){
	if(isPaging == 0){
		isPaging++;
		var navFlag = null;
		var itemName = $('.jt-app-header-search').attr('data-search');
		var categoryPn = $('.jt-app-header-category:last').attr('data-category');
		$('.jt-app-item-content').attr('data-nav') == 'H' ? navFlag = 'H': navFlag=null;
		$.post(contextPath+'/app/ajax/productPagination.jt',{navFlag : navFlag, categoryPn : categoryPn, itemName : itemName, init : init}, function(data){
	    	if(data.mergeItems.length > 0){
	    		$.attendProductItems(data);
	    	}else{
	    		$.toast('마지막 페이지입니다.');
	    	}
	    	isPaging = 0;
	    });
	}
};

var isScrollingFlag = 0;

$.scrollPaging = function(){
	$('.jt-app-contents-wrap').scroll(function(){
	    if($.checkAppPage()){
	    	isScrollingFlag = 1;
	    	
	    	var elemTop = $('.jt-app-item-lists:last').offset().top;
	    	if($('.jt-app-item-lists:last').height() + 60 >= elemTop ){
	    		$.pagingItem();
	    		return;
	    	}
	    }
	});
	$('.jt-app-contents-wrap').on('scrollstop',function(){
		 if($.checkAppPage()){
			 isScrollingFlag = 0;
		 }
	});
};

$.attendProductItems = function(data){
	var html ='';
	var items = data.mergeItems;
	for(var idx=0, size = items.length; idx < size; idx++){
		var isHeartCheckedIcon = '';
		if(items[idx].customerPn ==  null){
			isHeartCheckedIcon='';
		}else{
			isHeartCheckedIcon = 'jt-app-item-heart-active';
		}
		
		if(items[idx].eventPn == 0){
			html += '<div class="jt-app-item-list-products jt-app-item-lists" data-url="'+items[idx].url+'" data-product-pn="'+items[idx].productPn+'" data-like="'+items[idx].customerPn+'">';
			html += '<div class="jt-app-item-list-wrap"></div>';
			html += '<div class="jt-app-item-img-shield"></div>';
			html += '<div class="jt-app-item-heart-wrap"><div class="jt-app-item-heart-wrap-background"><div class="jt-app-item-heart '+isHeartCheckedIcon+'"></div></div></div>';
			if(items[idx].hot == 1){
				html+='<div class="jt-tab-wrap"><div class="jt-tab-hot"></div></div>';
			}
			html +=	'<div class="jt-app-item-list-products-img">';
			if(items[idx].contentType == ''){
				html+=		'<img src="'+contextPath+'/resources/uploadImage/'+items[idx].saveName+'" />';
			}else{
				html+=		'<img src="'+contextPath+'/photo/thumbnail/'+items[idx].saveName+'product.'+items[idx].contentType +'" />';	
			}
			html +=	'</div>';
			html +=	'<div class="jt-app-item-list-products-name">'+$.reduceText(11,items[idx].productName)+'</div>'; 
			html +=	'<div class="jt-app-item-list-products-price">'+$.formatNumber(items[idx].price)+'원</div>';
			html +=	'<div class="jt-app-item-list-reply">';
			if(items[idx].comment == null){
				html +=		'&nbsp; ';
			}else{
				html +=		'"'+$.reduceText(10,items[idx].comment)+'"';	
			}
			html += 	'</div>';
			html += '<div class="jt-app-reply-wrap"></div>';
			html += '</div>';
		}else{
			html += '<div class="jt-app-item-list-events jt-app-item-lists" data-url="'+items[idx].url+'" data-event-pn="'+items[idx].eventPn+'" data-like="'+items[idx].customerPn+'" oncontextmenu="return false" onselectstart="return false">';
			html += '<div class="jt-app-item-list-wrap"></div>';
			html += '<div class="jt-app-item-img-shield"></div>';
			html+=  '<div class="jt-tab-wrap"><div class="jt-tab-event"></div></div>';
			html += '<div class="jt-app-item-heart-wrap"><div class="jt-app-item-heart"></div></div>';
			html += '<div class="jt-app-item-heart-wrap"><div class="jt-app-item-heart-wrap-background"><div class="jt-app-item-heart '+isHeartCheckedIcon+'"></div></div></div>';
			html += 	'<div class="jt-app-item-event-wrap"><img src="'+contextPath+'/resources_webapp/images/jt-dummy.png" /></div>';
			html += 	'<div class="jt-app-item-event-name">'+items[idx].eventName+'</div>';
			html += 	'<div class="jt-app-item-event-contents">'; 
			html += 		'<div class="jt-app-item-shop-name">'+items[idx].shopName+'</div>';
			html += 		'<div class="jt-app-item-end-date">D-'+items[idx].endDate+'일 남았습니다.<span class="jt-app-item-dummy-font">&nbsp;</span></div>';
			html += 	'</div>';
			html +=	'<div class="jt-app-item-list-reply">';
			if(items[idx].comment == null){
				html +=		'&nbsp; ';
			}else{
				html +=		'"'+$.reduceText(10,items[idx].comment)+'"';	
			}
			html +=		'</div>'; 
			html += '<div class="jt-app-reply-wrap"></div>';
			html += '</div>';
		}
	}
	$('.jt-app-item-list').append(html);
};
$.hotNewChangeBtnInit = function(){
	$('.jt-app-item-content').attr('data-nav') == 'H' ? $('.jt-app-item-change-mode').text('NEW'): $('.jt-app-item-change-mode').text('HOT');
};
$('body').on('tap','.jt-app-item-change-mode',function(){
	if($('.jt-app-item-content').attr('data-nav') == 'H'){
		$.mobile.showPageLoadingMsg();
		$.mobile.changePage( contextPath+'/app', {
			transition: 'flip',
			type: 'post',
			reloadPage: true,
			reverse:true,
			data:{categoryPn : $('.jt-app-header-category:last').attr('data-category')}
		});
		$.mobile.hidePageLoadingMsg();
	}else{
		$.mobile.showPageLoadingMsg();
		$.mobile.changePage( contextPath+'/app', {
			transition: 'flip',
			type: 'post',
			reloadPage: true,
			reverse:false,
			data:{navFlag : 'H', categoryPn : $('.jt-app-header-category:last').attr('data-category')}
		});
		$.mobile.hidePageLoadingMsg();
	}
});

$('body').on('tap', '.jt-app-item-heart-wrap', function(e){
	e.stopPropagation();
	e.preventDefault();
	if(isScrollingFlag == 0){
		var heartWrap = $(this).find('.jt-app-item-heart-wrap-background');
		heartWrap.css('background', 'linear-gradient(#ffd79b, #ffe9c8)');
		setTimeout(function(){
			heartWrap.css('background', 'linear-gradient(#ffffff, #f0f0f0)');
		}, 500);
		
		$itemWrapStaticTarget = $(this).parent('.jt-app-item-lists');
		var productPn =$itemWrapStaticTarget.attr('data-product-pn');
		var eventPn =$itemWrapStaticTarget.attr('data-event-pn');
		$.post(contextPath + '/app/ajax/checkLogin.jt', {}, function(object) {
			if(object.isLogin==false){
				$.toast('로그인 해주세요.');
				$.changePageTransition('/app/login', 'pop');
				return;
			}else{
				$.itemHeartClick(productPn, eventPn, $itemWrapStaticTarget);
			}
		});
	}else{
		e.stopPropagation();
		e.preventDefault();
	}
});

$.itemHeartClick = function(productPn, eventPn, target){
	$.thisItem = target;
	
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
			$('.jt-app-item-like-popup-dialog').popup('close');
			$('.jt-app-item-like-popup-dialog').attr('data-product-pn', null);
			if('productHeartInsert' == crudType){
				$.likeToast('<div class="jt-app-item-like-heart-active"></div>'+'관심리스트에<br/> 추가되었습니다.');
				$.thisItem.find('.jt-app-item-list-wrap').css('box-shadow','0 0 4px 4px rgba(0,0,0,0.2)').fadeIn(250).delay(500).fadeOut(1000);
				$.thisItem.find('.jt-app-item-heart').addClass('jt-app-item-heart-active');
				$.thisItem.attr('data-like', product.order);
			}else if('productHeartDelete' == crudType){
				$.likeToast('<div class="jt-app-item-like-heart"></div>'+'관심리스트에서<br/> 제거되었습니다.');
				$.thisItem.find('.jt-app-item-list-wrap').css('box-shadow','0 0 4px 4px rgba(0,0,0,0.2)').fadeIn(250).delay(500).fadeOut(1000);
				$.thisItem.find('.jt-app-item-heart').removeClass('jt-app-item-heart-active');
				$.thisItem.attr('data-like', 'null');
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
			$('.jt-app-item-like-popup-dialog').popup('close');
			$('.jt-app-item-like-popup-dialog').attr('data-event-pn', null);
			if('eventHeartInsert' == crudType){
				$.likeToast('<div class="jt-app-item-like-heart-active"></div>'+'관심리스트에<br/> 추가되었습니다.');
				$.thisItem.find('.jt-app-item-list-wrap').css('box-shadow','0 0 4px 4px rgba(0,0,0,0.2)').fadeIn(250).delay(500).fadeOut(1000);
				$.thisItem.find('.jt-app-item-heart').addClass('jt-app-item-heart-active');
			}else if('eventHeartDelete' == crudType){
				$.likeToast('<div class="jt-app-item-like-heart"></div>'+'관심리스트에서<br/> 제거되었습니다.');
				$.thisItem.find('.jt-app-item-list-wrap').css('box-shadow','0 0 4px 4px rgba(0,0,0,0.2)').fadeIn(250).delay(500).fadeOut(1000);
				$.thisItem.find('.jt-app-item-heart').removeClass('jt-app-item-heart-active');
			}
		});
	}
};

$('body').on('tap', '.jt-app-item-list-products', function(e){
	if(isScrollingFlag == 0){
		var productPn = $(this).attr('data-product-pn');
		$.insertProductClickStatistic(productPn);
		window.open($(this).attr('data-url'));
	}else{
		e.stopPropagation();
		e.preventDefault();
	}
});
$('body').on('tap', '.jt-app-item-list-events', function(){
	if(isScrollingFlag == 0){
		var eventPn = $(this).attr('data-event-pn');
		$.insertEventClickStatistic(eventPn);
		window.open($(this).attr('data-url'));
	}else{
		e.stopPropagation();
		e.preventDefault();
	}
});


$('body').on('tap', '.jt-app-item-list-reply', function(e){
	if(isScrollingFlag == 0){
		e.stopPropagation();
		e.preventDefault();
		$pThis = $(this);
		$.post(contextPath + '/app/ajax/checkLogin.jt', {}, function(object) {
			if(object.isLogin==false){
				$.toast('로그인 해주세요.');
				$.changePageTransition('/app/login', 'pop');
				return;
			}else{
				$.replyDialog(e, $pThis);
			}
		});
	}else{
		e.stopPropagation();
		e.preventDefault();
	}
});
$('body').on('tap', '.jt-app-reply-wrap', function(e){
	if(isScrollingFlag == 0){
		e.stopPropagation();
		e.preventDefault();
		$pThis = $(this);
		$.post(contextPath + '/app/ajax/checkLogin.jt', {}, function(object) {
			if(object.isLogin==false){
				$.toast('로그인 해주세요.');
				$.changePageTransition('/app/login', 'pop');
				return;
			}else{
				$.replyDialog(e, $pThis);
			}
		});
	}else{
		e.stopPropagation();
		e.preventDefault();
	}
});

$.replyDialog = function(e, pThis){
	e.stopPropagation();
	e.preventDefault();
	$('#jt-app-reply-dialog').popup('open');
	$eventPn = pThis.parents('.jt-app-item-lists').attr('data-event-pn');
	$productPn = pThis.parents('.jt-app-item-lists').attr('data-product-pn');
	
	$itemWrapStaticTarget = pThis.parents('.jt-app-item-lists');
	$eventPn == null ? $('#jt-app-reply-dialog').attr('data-product-pn', $productPn) : $('#jt-app-reply-dialog').attr('data-event-pn',$eventPn);
};


$('body').on('tap', '.jt-app-reply-submit', function(){
	$inputText = $('.jt-app-reply-input-text').val();
	var productPn = $('#jt-app-reply-dialog').attr('data-product-pn');
	var eventPn = $('#jt-app-reply-dialog').attr('data-event-pn');
	productPn == null ? productPn = 0 : eventPn = 0; 
	if($inputText == ''){
		$.toast('글을 입력해주세요.');
		return;
	}
	$.postJSON(contextPath + '/ajax/insertComment.jt', { productPn : productPn, eventPn : eventPn, comment : $inputText }, function(object) {
		$('.jt-app-reply-input-text').val('');
		$('.jt-app-reply-submit').removeClass('jt-btn-orange');
		$('.jt-app-reply-submit').addClass('jt-btn-gray');
		$('#jt-app-reply-dialog').popup('close');
		if(object.comment.message == '1'){
			$.toast('로그인 하셔야합니다.');
			$.changePageTransition('/app/login', 'pop');
			return;
		}else if(object.comment.message == '2'){
			$.toast('판매자는 불가능합니다');
			return;
		}else if(object.comment.message == '3'){
			$.toast('한 상품에 댓글은 한번만 가능합니다.');
			return;
		}
		$itemWrapStaticTarget.find('.jt-app-item-list-reply').text('"'+$.reduceText(11,object.comment.comment)+'"');
	});
});

$('body').on('keyup' ,'.jt-app-reply-input-text', function(){
	if($('.jt-app-reply-input-text').val().length == 0){
		$('.jt-app-reply-submit').removeClass('jt-btn-orange');
		$('.jt-app-reply-submit').addClass('jt-btn-gray');
	}else{
		$('.jt-app-reply-submit').addClass('jt-btn-orange');
		$('.jt-app-reply-submit').removeClass('jt-btn-gray');
	}
});
