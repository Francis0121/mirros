$(function() {
	
	if (typeof jtown.pg == 'undefined') {jtown.pg = {};}
	
	function getInternetExplorerVersion() {    
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {        
             var ua = navigator.userAgent;        
             var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");        
             if (re.exec(ua) != null)            
                 rv = parseFloat(RegExp.$1);    
            }    
        return rv; 
   }
	
jtown.pg.windowResize = function(){
	var clientWidth = Number(window.document.body.clientWidth) -210,
	widthItem = Math.floor(clientWidth/258);
	if(widthItem > 6){
		widthItem = widthItem-1;
	}
	$('.jt-pg-main').css({width : (widthItem*258), margin : 'auto'});
};

jtown.pg.itemOrder = function(){
	if (getInternetExplorerVersion() != 7 ){
		var containerDiv = document.querySelector('.jt-pg-main');
		var msnry = new Masonry( containerDiv, {
			  columnWidth: 0,
			  itemSelector: '.jt-pg-item'
			});
	}else{
		var mediaItemContainer = $('.jt-pg-main');
		mediaItemContainer.masonry({
		    columnWidth: 0, 
		    itemSelector: '.jt-pg-item',
		    resizeable: true,
		    saveOptions: true
		  });
		$( mediaItemContainer ).masonry( 'reloadItems' );
	}
};

jtown.pg.scrollPaging = function(){
	$(window).scroll(function(){
	    if($(window).scrollTop() == $(document).height() - $(window).height()){
	        $('div#infscr-loading').show();
	        var itemName = $('.jt-pg-main').attr('data-item-name') == '' ? null : $('.jt-pg-main').attr('data-item-name');
	        var category = $('.jt-header-nav-interestCategory').attr('data-category');
	        var categoryPn = $('.jt-header-nav-interestCategory').attr('data-categoryPn');
	        $.postJSON(contextPath+'ajax/gatherPagination.jt',{itemName : itemName, navFlag : category, categoryPn : categoryPn  }, function(data){
	        	  if(data.mergeItems.length > 0){
		            	productGatherHtml(data);
		                $('div#infscr-loading').hide();
		            }else{
		                $('div#infscr-loading').html('<center>마지막 페이지입니다.</center>');
		                $('div#infscr-loading').delay(500).fadeOut(1000);
		            }
		            if (getInternetExplorerVersion() == 7 ){
		            	jtown.pg.itemOrder();
		            }
	        });
	    }
	});
};


var productGatherHtml = function(data){
	var html = '';
	var size = data.mergeItems.length;
	var heartClickShapeClass ='';
	var heartClickTextClass ='';
	for(var idx=0; idx< size; idx++){
		if(data.mergeItems[idx].customerPn != null){
			heartClickShapeClass = 'jt-home-shop-love-click';
			heartClickTextClass = 'jt-home-shop-love-text-click';
		}else{
			heartClickShapeClass='';
			heartClickTextClass='';
		}
		if(data.mergeItems[idx].hot == 0){
			html+='<div class="jt-pg-item jt-pg-small-product" data-url="'+data.mergeItems[idx].url+'" data-product-pn="'+data.mergeItems[idx].productPn+'" data-event-pn="'+data.mergeItems[idx].eventPn+'">';
			if(data.mergeItems[idx].productPn == 0){
				html+=	'<div class="jt-pg-event-line">';
				html+=	'<div class="jt-pg-item-wrap">';
				html+=		'<div class="jt-pg-event-line-event-name-wrap">';
				html+=	 		'<span class="jt-home-expand-shop-event-new-image">NEW</span>';
				html+=			'<div class="jt-pg-event-line-event-name">'+data.mergeItems[idx].eventName +'</div>';
				html+=		'</div>';
				html+= 	'<div class="jt-pg-event-line-bottom">';
				html+= 		'<div class="jt-pg-event-line-text">';
				html+=				'<div class="jt-pg-event-line-shop-name">';
				html+=					data.mergeItems[idx].shopName ;
				html+=				'</div>';
				html+=				'<div class="jt-pg-event-line-end-date">';
				html+=					'D - '+data.mergeItems[idx].endDate+'일 남았습니다.';
				html+=				'</div>';
				html+= 		'</div>';
				html+=			'<div class="jt-pg-heart-wrap">';
				html+=				'<div class="jt-pg-heart-shape">';
				html+=					'<span class="jt-home-shop-love jt-pg-heart-shape '+heartClickShapeClass+'" id="jt-pg-heart-click-e-'+data.mergeItems[idx].eventPn+'">heart</span>';
				html+=				'</div>';
				html+=				'<div class="jt-pg-heart-event-count '+heartClickTextClass+'" id="jt-pg-heart-count-e-'+data.mergeItems[idx].eventPn+'">	'+data.mergeItems[idx].heartCount+'</div>';
				html+=			'</div>';
				html+= 	'</div>';
				html+=		'<div class="jt-btn-fbLogin jt-pg-product-facebook">';
				html+=			'<span class="loginImage"></span>';
				html+=		'<span class="loginText">페이스북 공유하기</span>';
				html+=		'</div>';
				html+=		'</div>';
				
				html+= '<div class="jt-pg-comment-wrap">';
				html+= '<div><span class="jt-pg-comment-icon"> </span> <input type="text" class="jt-pg-comment-input" placeholder="Write your secret comment"  maxlength="20"/></div>';
				html+= '<div class="jt-pg-comment-line-wrap">';
				
				var commentsSize = data.mergeItems[idx].comments.length;
				var moreEnable = '';
				for(var sIdx=0; sIdx< commentsSize; sIdx++){
					if(sIdx < 3){
						html += '<div>';
						html +=	'<div class="jt-pg-comment-line-text">'+data.mergeItems[idx].comments[sIdx].comment+'</div>';
						html +=	'<div class="jt-pg-comment-line-date" data-cmPn="'+data.mergeItems[idx].comments[sIdx].commentPn+'">';
						html +=		'<span>'+data.mergeItems[idx].comments[sIdx].inputDate+'</span>';
						html +=		'<span class="jt-pg-comment-line-warn">신고</span> |';
						html +=		'<span class="jt-pg-comment-line-delete">삭제</span>'; 
						html +=	'</div>';
						html += '</div>';
					}else{
						moreEnable = 'jt-pg-comment-more-enable';
					}
				}
				html+='	</div>';
				html+='		<div class="jt-pg-comment-more '+moreEnable+'">▼</div>';
				html+='	</div>';
				
				html+='</div>';
			}else if(data.mergeItems[idx].productPn != 0){
				html+=		'<div class="jt-pg-product-line">';
				html+= 	'<div class="jt-pg-item-wrap">';
				html+=			'<div class="jt-pg-product-img">';
				if(data.mergeItems[idx].contentType == ''){
					html+=			 '<img src="'+contextPath+'resources/uploadImage/'+data.mergeItems[idx].saveName+'" alt="'+data.mergeItems[idx].productName+'" />';
				}else{
					html+=			 '<img src="'+contextPath+'photo/thumbnail/'+data.mergeItems[idx].saveName+'product.'+data.mergeItems[idx].contentType +'" alt="'+data.mergeItems[idx].productName+'" />';	
				}
				html+= 		'</div>';
				html+=			'<div class="jt-pg-product-line-bright"></div>';
				html+=			'<div class="jt-btn-fbLogin jt-pg-product-facebook">';
				html+=				'<span class="loginImage"></span>';
				html+=				'<span class="loginText">페이스북 공유하기</span>';
				html+=			'</div>';
				html+= 		'<div class="jt-pg-product-name-wrap">';
				html+=				'<div class="jt-pg-product-name">';
				html+=					'<div>'+data.mergeItems[idx].productName+'</div>';
				html+=					'<div>'+jtown.pg.formatNumber(data.mergeItems[idx].price)+'</div>';
				html+=				'</div>';
				html+=				'<div class="jt-pg-heart-wrap">';
				html+=					'<div class="jt-pg-heart-shape">';	
				html+=						'<span class="jt-home-shop-love jt-pg-heart-shape '+heartClickShapeClass+'" id="jt-pg-heart-click-'+data.mergeItems[idx].productPn+'">heart</span>';
				html+=					'</div>';
				html+=				'<div class="jt-pg-heart-count '+heartClickTextClass+'" id="jt-pg-heart-count-'+data.mergeItems[idx].productPn+'">'+data.mergeItems[idx].heartCount+'</div>';
				html+=				'</div>';
				html+= 		'</div>';
				html+=			'</div>';
				
				html+=		'<div class="jt-pg-comment-wrap">';
				html+=		'<div><span class="jt-pg-comment-icon"> </span> <input type="text" class="jt-pg-comment-input" placeholder="Write your secret comment"  maxlength="20"/></div>';
				html+=		'<div class="jt-pg-comment-line-wrap">';
				var commentsSize = data.mergeItems[idx].comments.length;
				var moreEnable = '';
				for(var sIdx=0; sIdx< commentsSize; sIdx++){
					if(sIdx < 3){
						html += '<div>';
						html +=	'<div class="jt-pg-comment-line-text">'+data.mergeItems[idx].comments[sIdx].comment+'</div>';
						html +=	'<div class="jt-pg-comment-line-date" data-cmPn="'+data.mergeItems[idx].comments[sIdx].commentPn+'">';
						html +=		'<span>'+data.mergeItems[idx].comments[sIdx].inputDate+'</span>';
						html +=		'<span class="jt-pg-comment-line-warn">신고</span> |';
						html +=		'<span class="jt-pg-comment-line-delete">삭제</span>'; 
						html +=	'</div>';
						html += '</div>';
					}else{
						moreEnable = 'jt-pg-comment-more-enable';
					}
				}
				html+='	</div>';
				html+='		<div class="jt-pg-comment-more '+moreEnable+'">▼</div>';
				html+='	</div>';
				
				html+=		'</div>';
			}
			html+='</div>';
		}else{
			html+='<div class="jt-pg-item jt-pg-large-product" data-url="'+data.mergeItems[idx].url+'" data-product-pn="'+data.mergeItems[idx].productPn+'">';
			html+=		'<div class="jt-pg-product-line">';
			html+= 	'<div class="jt-pg-item-wrap">';
			html+=			'<div class="jt-pg-product-line-hot"><img src="'+contextPath+'resources/images/jt-hot.png"></div>';
			html+=			'<div class="jt-pg-product-img">';
			if(data.mergeItems[idx].contentType == ''){
				html+=			 '<img src="'+contextPath+'resources/uploadImage/'+data.mergeItems[idx].saveName+'" alt="'+data.mergeItems[idx].productName+'" />';
			}else{
				html+=			 '<img src="'+contextPath+'photo/thumbnail/'+data.mergeItems[idx].saveName+'product.'+data.mergeItems[idx].contentType +'" alt="'+data.mergeItems[idx].productName+'" />';	
			}
			html+= 		'</div>';
			html+=			'<div class="jt-pg-product-line-bright"></div>';
			html+=			'<div class="jt-btn-fbLogin jt-pg-product-facebook">';
			html+=				'<span class="loginImage"></span>';
			html+=			'<span class="loginText">페이스북 공유하기</span>';
			html+=			'</div>';
			html+=		'<div class="jt-pg-product-name-wrap">';
			html+=			'<div class="jt-pg-product-name">';
			html+=				'<div>'+data.mergeItems[idx].productName+'</div>';
			html+=				'<div>'+jtown.pg.formatNumber(data.mergeItems[idx].price)+'</div>';
			html+=			'</div>';
			html+=			'<div class="jt-pg-heart-wrap">';
			html+=				'<div class="jt-pg-heart-shape">';	
			html+=					'<span class="jt-home-shop-love jt-pg-heart-shape '+heartClickShapeClass+'" id="jt-pg-heart-click-'+data.mergeItems[idx].productPn+'">heart</span>';
			html+=				'</div>';
			html+=				'<div class="jt-pg-heart-count '+heartClickTextClass+'" id="jt-pg-heart-count-'+data.mergeItems[idx].productPn+'" >'+data.mergeItems[idx].heartCount+'</div>';
			html+=			'</div>';
			html+=		'</div>';
			html+=		'</div>';
			
			html+=		'<div class="jt-pg-comment-wrap">';
			html+=		'<div><span class="jt-pg-comment-icon"> </span> <input type="text" class="jt-pg-comment-input" placeholder="Write your secret comment"  maxlength="20"/></div>';
			html+=		'<div class="jt-pg-comment-line-wrap">';
			var commentsSize = data.mergeItems[idx].comments.length;
			var moreEnable = '';
			for(var sIdx=0; sIdx< commentsSize; sIdx++){
				if(sIdx < 3){
					html += '<div>';
					html +=	'<div class="jt-pg-comment-line-text">'+data.mergeItems[idx].comments[sIdx].comment+'</div>';
					html +=	'<div class="jt-pg-comment-line-date" data-cmPn="'+data.mergeItems[idx].comments[sIdx].commentPn+'">';
					html +=		'<span>'+data.mergeItems[idx].comments[sIdx].inputDate+'</span>';
					html +=		'<span class="jt-pg-comment-line-warn">신고</span> |';
					html +=		'<span class="jt-pg-comment-line-delete">삭제</span>';
					html +=	'</div>';
					html += '</div>';
				}else{
					moreEnable = 'jt-pg-comment-more-enable';
				}
			}
			html+='	</div>';
			html+='		<div class="jt-pg-comment-more '+moreEnable+'">▼</div>';
			html+='	</div>';
			
			html+=		'</div>';
			html+='</div>';
		}
	}
	$('.jt-pg-main').append(html);
	jtown.pg.itemOrder();
	
};

$('.jt-pg-container').on('click', '.jt-pg-heart-wrap', function(e){
	e.stopPropagation();
	var productPn =$(this).parents('.jt-pg-item').attr('data-product-pn');
	var eventPn =$(this).parents('.jt-pg-item').attr('data-event-pn');
	var isHeartChecked = $(this).find('.jt-home-shop-love-click').text() =='';
	var fbElement = $(this).parents('.jt-pg-item').find('.jt-pg-product-facebook');
	productPn == 0 ? jtown.home.eventHeartClick(eventPn, isHeartChecked,fbElement) : jtown.home.productHeartClick(productPn, isHeartChecked,fbElement) ;
});

$('.jt-pg-container').on('click', '.jt-pg-product-facebook', function(e){
	e.stopPropagation();
	var productPn =$(this).parents('.jt-pg-item').attr('data-product-pn');
	var eventPn =$(this).parents('.jt-pg-item').attr('data-event-pn');
	var fbTextElement = $(this).parents('.jt-pg-item').find('.loginText'); 
	productPn == 0 ? jtown.home.eventFacebookLikeClick(eventPn, fbTextElement) : jtown.home.productFacebookLikeClick(productPn, fbTextElement);
});

$('.jt-pg-container').on('click', '.jt-pg-item-wrap', function(){
	var productPn = $(this).parents('.jt-pg-item').attr('data-product-pn');
	var eventPn = $(this).parents('.jt-pg-item').attr('data-event-pn');
	var productUrl = $(this).parents('.jt-pg-item').attr('data-url'); 
	if(productPn != 0){
		jtown.home.productStatisticClick(productPn);
	}else{
		jtown.home.eventStatisticClick(eventPn);
	}
	window.open(productUrl, '_blank');
});
$('.jt-pg-container').on('click', '.jt-pg-comment-input', function(){
	if($('.jt-header-login-menu #jt-mypage').length == 0){
		jtown.login.showLoginForm();
		return;
	}
});

jtown.pg.formatNumber = function(cr){
	var str = new Array();
	cr = String(cr);
	for(var i=1;i<=cr.length;i++){
		if(i%3){str[cr.length-i]=cr.charAt(cr.length-i);}
		else{str[cr.length-i]=','+cr.charAt(cr.length-i);}
	}
	return str.join('').replace(/^,/,'');
};

$('.jt-pg-container').on('mouseenter', '.jt-pg-item-wrap', function(){
	$(this).find('.jt-pg-product-line-bright').css('display','block');
});
$('.jt-pg-container').on('mouseleave', '.jt-pg-item-wrap', function(){
	$(this).find('.jt-pg-product-line-bright').css('display','none');
});

$('.jt-pg-container').on('mouseenter', '.jt-pg-heart-wrap', function(){
	$(this).find('.jt-home-shop-love').css('background-position','-15px -30px');
});
$('.jt-pg-container').on('mouseleave', '.jt-pg-heart-wrap', function(){
	$(this).find('.jt-home-shop-love').css('background-position','0px -30px');
});

//~ comment
$('.jt-pg-container').on('keydown','.jt-pg-comment-input',(function(e){
 	if( (e.keyCode) && (e.keyCode==13) && ($(this).val() !='')) {
		var productPn =$(this).parents('.jt-pg-item').attr('data-product-pn');
		var eventPn =$(this).parents('.jt-pg-item').attr('data-event-pn');
		
		$replyItemLength = $(this).parents('.jt-pg-item').find('.jt-pg-comment-line-text').length;
		$inputText =$(this).val();
		$(this).val('');
		$commentWrap = $(this).parents('.jt-pg-item').find('.jt-pg-comment-line-wrap');
		$commentMore = $(this).parents('.jt-pg-item').find('.jt-pg-comment-more');
		$.postJSON(contextPath + 'ajax/insertComment.jt', { productPn : productPn, eventPn : eventPn, comment : $inputText }, function(object) {
			var comments =object.comment;
			var commentList = object.commentList;
			if (!nullValueCheck(comments.message)) {
				if(comments.message == '1'){
					jtown.login.showLoginForm();
				}else if(comments.message == '3'){
					jtown.dialog('한 상품에 댓글은 한번만 가능합니다.');
				}else{
					jtown.dialog('판매자는 불가능합니다');
				}
				return;
			}else if(nullValueCheck(comments.message)){
				if(comments.count <=3){
					var html = '<div>';
					html +=	'<div class="jt-pg-comment-line-text">'+commentList[0].comment+'</div>';
					html +=	'<div class="jt-pg-comment-line-date" data-cmPn="'+commentList[0].commentPn+'">';
					html +=		'<span>'+commentList[0].inputDate+'</span>';
					html +=		'<span class="jt-pg-comment-line-warn">신고</span> |';
					html +=		'<span class="jt-pg-comment-line-delete">삭제</span>';
					html +=	'</div>';
					html += '</div>';
					$commentWrap.prepend(html);
					jtown.pg.itemOrder();
				}else{
					var html ='';
					for(var idx=0; idx< 3; idx++){
						html += '<div>';
						html +=	'<div class="jt-pg-comment-line-text">'+commentList[idx].comment+'</div>';
						html +=	'<div class="jt-pg-comment-line-date" data-cmPn="'+commentList[idx].commentPn+'">';
						html +=		'<span>'+commentList[idx].inputDate+'</span>';
						html +=		'<span class="jt-pg-comment-line-warn">신고</span> |';
						html +=		'<span class="jt-pg-comment-line-delete">삭제</span>';
						html +=	'</div>';
						html += '</div>';
					}
					$commentWrap.html(html);
					$commentMore.attr('class', 'jt-pg-comment-more jt-pg-comment-more-enable');
					if(productPn != 0){
						sessionStorage.setItem('comment-'+productPn, 2);
					}else{
						sessionStorage.setItem('comment-e-'+eventPn, 2);
					}
				}
			}
		});
	}
}));


$('.jt-pg-container').on('click', '.jt-pg-comment-more-enable', function(){
	var productPn = $(this).parents('.jt-pg-item').attr('data-product-pn');
	var eventPn = $(this).parents('.jt-pg-item').attr('data-event-pn');
	var page = 2;
	if(productPn != 0){
		sessionStorage.getItem('comment-'+productPn) == null ? page = 2 : page = sessionStorage.getItem('comment-'+productPn);
	}else{
		sessionStorage.getItem('comment-e-'+eventPn) == null ? page = 2 : page = sessionStorage.getItem('comment-e-'+eventPn);
	}
	$commentWrap = $(this).parents('.jt-pg-item').find('.jt-pg-comment-line-wrap');
	$commentMore = $(this).parents('.jt-pg-item').find('.jt-pg-comment-more');
	$.postJSON(contextPath + 'ajax/selectComment.jt', { productPn : productPn, eventPn : eventPn, page : page}, function(object) {
		if(productPn != 0){
			sessionStorage.setItem('comment-'+productPn, (page-0+1));
		}else{
			sessionStorage.setItem('comment-e-'+productPn, (page-0+1));
		}
		var comments =object.comment;
		var commentList = object.commentList;
		var size = comments.count;
		var html ='';
		for(var idx=0; idx< size; idx++){
			if(idx <=3){
				html += '<div>';
				html +=	'<div class="jt-pg-comment-line-text">'+commentList[idx].comment+'</div>';
				html +=	'<div class="jt-pg-comment-line-date" data-cmPn="'+commentList[idx].commentPn+'">';
				html +=		'<span>'+commentList[idx].inputDate+'</span>';
				html +=		'<span class="jt-pg-comment-line-warn">신고</span> |';
				html +=		'<span class="jt-pg-comment-line-delete">삭제</span>';
				html +=	'</div>';
				html += '</div>';
			}
		}
		$commentWrap.html(html);
		if(size <= 3){
			jtown.pg.itemOrder();
			$commentMore.attr('class', 'jt-pg-comment-more');
		}
	});
});

$('.jt-pg-container').on('click', '.jt-pg-comment-line-warn', function(){
	var productPn = $(this).parents('.jt-pg-item').attr('data-product-pn');
	var commentPn = $(this).parents('.jt-pg-comment-line-date').attr('data-cmpn');
	$.postJSON(contextPath + 'ajax/insertCommentWarn.jt', { commentPn : commentPn, productPn : productPn}, function(object) {
		if (!nullValueCheck(object.message)) {
			if(object.message == '1'){
				jtown.login.showLoginForm();
			}else if(object.message == '2'){
				jtown.dialog('판매자는 불가능합니다');
			}else if(object.message == '3'){
				jtown.dialog('이미 신고되었습니다.');
			}
		}else{
			jtown.dialog('신고되었습니다.');
		}
	});
});

$('.jt-pg-container').on('click', '.jt-pg-comment-line-delete', function(){
	var commentPn = $(this).parents('.jt-pg-comment-line-date').attr('data-cmpn');
	$commentWrap = $(this).parents('.jt-pg-item').find('.jt-pg-comment-line-wrap');
	$commentMore = $(this).parents('.jt-pg-item').find('.jt-pg-comment-more');
	var productPn =$(this).parents('.jt-pg-item').attr('data-product-pn');
	var eventPn =$(this).parents('.jt-pg-item').attr('data-event-pn');
	
	$.postJSON(contextPath + 'ajax/deleteComment.jt', { commentPn : commentPn, productPn : productPn, eventPn : eventPn}, function(object) {
		if (!nullValueCheck(object.message)) {
			if(object.message == '1'){
				jtown.login.showLoginForm();
			}else if(object.message == '2'){
				jtown.dialog('판매자는 불가능합니다');
			}else if(object.message == '3'){
				jtown.dialog('자신의 글만 삭제할 수 있습니다.');
			}
		}else{
			var page = 1;
			$.postJSON(contextPath + 'ajax/selectComment.jt', { productPn : productPn, eventPn : eventPn, page : page}, function(object) {
				if(productPn != 0){
					sessionStorage.setItem('comment-'+productPn, 2);
				}else{
					sessionStorage.setItem('comment-e-'+eventPn, 2);
				}
				var comments =object.comment;
				var commentList = object.commentList;
				var size = comments.count;
				var html ='';
				for(var idx=0; idx< size; idx++){
					if(idx <=3){
						html += '<div>';
						html +=	'<div class="jt-pg-comment-line-text">'+commentList[idx].comment+'</div>';
						html +=	'<div class="jt-pg-comment-line-date" data-cmPn="'+commentList[idx].commentPn+'">';
						html +=		'<span>'+commentList[idx].inputDate+'</span>';
						html +=		'<span class="jt-pg-comment-line-warn">신고</span> |';
						html +=		'<span class="jt-pg-comment-line-delete">삭제</span>';
						html +=	'</div>';
						html += '</div>';
					}
				}
				$commentWrap.html(html);
				if(size <= 3){
					jtown.pg.itemOrder();
					$commentMore.attr('class', 'jt-pg-comment-more');
				}
				jtown.dialog('삭제되었습니다.');
			});
		}
	});
});

//~ eventBanner

jtown.pg.eventBannerOpen = function(pn){
	$.postJSON(contextPath + 'ajax/eventBanner.jt', { pn : pn}, function(object) {
		var html ='<div class="jt-gather-extend-banner">';
		html +=	'<div><img src="'+contextPath+'resources/images/event/'+object.saveName+'" /></div>';
		html +=	'<div class="jt-gather-extend-text"><pre>'+object.content+'</pre></div>';
		html +=	'<div class="jt-gather-extend-input-box"><h3>페이스북으로 공유하고 이벤트 참여하기</h3>';
		html +=	'<form action="'+contextPath+'signin/facebook" class="jt-gather-extend-banner-login-form" method="POST">';
		html +=		'<input type="hidden" name="scope" value="publish_stream,offline_access,email,user_birthday,user_likes" />';
		if('null'!= object.variableData){
			html +=		'<input type="text" class="jt-gather-extend-input-long" placeholder="'+object.variableData+'" />';
		}
		html +=		'<div class="jt-btn-fbLogin jt-gather-extend-facebook" onclick="jtown.pg.facebookLogin('+object.pn+',\''+object.variableData+'\')">';
		html +=			'<span class="loginImage"></span>';
		html +=			'<span class="loginText">3초만에 참여하기</span>';
		html +=		'</div>';
		html += 	'</form>';
		html +=	'</div>';
		html +='</div>';
		$.smartPop.open({ width : 510, height : 640, html : html, effect : null });
	});
};
jtown.pg.facebookLogin = function(pn, memo){
	sessionStorage.setItem('insertParticipant', pn);
	sessionStorage.setItem('insertParticipantMemo', memo);
	var loginForm = $('.jt-gather-extend-banner-login-form')[0];
	loginForm.submit();
};

jtown.pg.eventBanner = function(){
	$.getJSON(contextPath+"bannerJSON?order=1", function(data) {
	    $("#flavor_1").agile_carousel({
	        carousel_data: data,
	        carousel_outer_height: 289,
	        carousel_height: 289,
	        slide_height: 290,
	        carousel_outer_width: 492,
	        slide_width: 492,
	        transition_time: 300,
	        timer: 6500,
	        continuous_scrolling: true,
	        control_set_1: "numbered_buttons"
	    });
	});
};

//~ sidebar 

jtown.pg.commentFeedInit = function(){
	var heartFeedHeight = window.innerHeight - $('.jt-right-sidebar-comment-feed').height() - 115 ;
	$('.jt-right-sidebar-heart-gather-wrap').height(heartFeedHeight);
};

jtown.pg.commentFeedScrollInit = function(){
	getInternetExplorerVersion() == 7 ? $itemSize = $('.jt-sidebar-heart-item').length : $('.jt-right-sidebar-heart-gather-wrap').mCustomScrollbar({theme:"dark"});
};

$('.jt-right-sidebar-comment-feed').on('click', '.jt-right-sidebar-comment-feed-dialog-contents', function(){
	if($(this).find('img').attr('alt') == null){
		var eventPn = $(this).parents('.jt-sidebar-comment-item').attr('data-productPn');
		jtown.home.eventStatisticClick(eventPn);
	}else{
		var productPn =$(this).parents('.jt-sidebar-comment-item').attr('data-productPn');
		jtown.home.productStatisticClick(productPn);
	}
	window.open($(this).parents('.jt-sidebar-comment-item').attr('data-url'), '_blank');
});

$('.jt-right-sidebar').on('mouseover', '.jt-sidebar-comment-item', function(event){
	$(this).find('.jt-right-sidebar-comment-feed-dialog').css('display','block');
	$('.jt-right-sidebar-comment-feed-dialog').css('top', ($(this).offset().top)-50-$('body').scrollTop());
});
$('.jt-right-sidebar').on('mouseout', '.jt-sidebar-comment-item', function(){
	$(this).find('.jt-right-sidebar-comment-feed-dialog').css('display','none');
});

$('body').on('click', '.jt-sidebar-heart-item', function(){
	var productPn = $(this).attr('data-productPn');
	var eventPn = $(this).attr('data-eventPn');
	if(productPn != ""){
		jtown.home.productStatisticClick(productPn);
	}else{
		jtown.home.eventStatisticClick(eventPn);
	}
	window.open($(this).attr('data-url'), '_blank');
});

$('.jt-right-sidebar-cover').bind('click', function(){
		jtown.login.showLoginForm();
});

//~ init

jtown.pg.eventBanner();
jtown.pg.commentFeedInit();
jtown.pg.commentFeedScrollInit();

if($('.jt-pg-main').length != 0 ){
	$( window ).resize(function() {
		jtown.pg.windowResize();
		jtown.pg.commentFeedInit();
	});
	jtown.pg.windowResize();
	jtown.pg.itemOrder();
}
if($('.jt-header-nav-interestCategory').attr('data-category') != null ){
	jtown.pg.scrollPaging();
}

});