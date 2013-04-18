$(function(){
	jtown.expand.loadExpandShop();
	
	jtown.expand.syncProductMove();
	
	jtown.comment.syncComment();
});

if (typeof jtown.expand == 'undefined') {
	jtown.expand = {};
}

jtown.expand.loadExpandShop = function(){
	$('.jt-home-shop-content-image').unbind('click').bind('click', function(){
		var parent = $(this).parents('.jt-seller-main');
		
		if(nullValueCheck(parent.html())){
			var jtHomeShop = $(this).parents('.jt-home-shop');
			jtown.expand.makeInnerHtml(jtHomeShop.attr('data-spn'));	
		}
	});
	
	$('.jt-home-shop-comment').unbind('click').bind('click', function(){
		var $parent = $(this).parents('.jt-seller-main');
		
		if(nullValueCheck($parent.html())){
			var jtHomeShop = $(this).parents('.jt-home-shop');
			jtown.expand.makeInnerHtml(jtHomeShop.attr('data-spn'));
		}
	});
};

jtown.expand.makeInnerHtml = function(spn){
	
	var url = contextPath + 'ajax/home/expandShop.jt',
		json = { 'pn' : spn };

	$.postJSON(url, json, function(selectMap){
		var html ='';
		var path = contextPath + 'resources/uploadImage/';
		var event1 = selectMap.event1, 
			event2 = selectMap.event2, 
			products = selectMap.products, 
			jtownUser = selectMap.jtownUser,
			comments = selectMap.comments,
			commentTops = selectMap.commentTops,
			commentFilter = selectMap.commentFilter,
			cpn = selectMap.cpn,
			best = false,
			loveHave = selectMap.loveHave;
		
		var productSize = Number(products.length);
		var bigProductHtml = '';
		var smallProductHtml = '';
		for(var i=0; i<productSize; i++){
			var product = products[i],
				index = productSize-Number(i);
			
			bigProductHtml += '<div class="jt-home-expand-shop-expandProduct">';
			bigProductHtml += '<img alt="상품" src="'+path+product.saveName+'"/>';
			bigProductHtml += '</div>';
			
			smallProductHtml += '<li data-count="'+index+'">';
			smallProductHtml += '	<a href="#none" class="jt-product-list"><img alt="상품" src="'+path+product.saveName+'"/></a>';
			smallProductHtml += '</li>';
		}
		
		var eventImage1='event-1.png', eventImage2 = 'event-2.png';
		
		if(!nullValueCheck(event1)){
			eventImage1 = event1.saveName;
		}
		
		if(!nullValueCheck(event2)){
			eventImage2 = event2.saveName;
		}
		
		var commentHtml = '';

		if(commentTops.length > 0){
			comments = commentTops;
			best = true;
		}
		
		var cancleHtml = '&nbsp;<a href="#none" class="jt-home-expand-shop-comment-loveIt-cancle">취소</a>';
		for(var i=0; i<comments.length; i++){
			var comment = comments[i];
			var cancleComment = nullValueCheck(comment.commentCustomerPn) ? '' : cancleHtml;
			
			commentHtml += 	'<li data-copn="'+comment.commentPn+'" class="'+(best ? 'jt-home-expand-shop-comment-li-best' : 'jt-home-expand-shop-comment-li')+'">';
			commentHtml +=	'	<ul class="jt-home-expand-shop-text-wrap">';
			if(best){
			commentHtml += 	'		<li class="jt-home-expand-shop-comment-header">';
			commentHtml += 	'			<span class="jt-home-expand-shop-comment-best">BEST</span>';	
			commentHtml += 	'		</li>';	
			}
			commentHtml += 	'		<li class="jt-home-expand-shop-comment-content">';
			commentHtml += 	'			<span class="jt-home-expand-shop-comment-name">'+htmlChars(comment.customerName)+'</span>';
			commentHtml +=	' 			<span class="jt-home-expand-shop-comment-text">'+htmlChars(comment.comment)+'</span>';
			commentHtml += 	'		</li>';
			commentHtml +=	'		<li class="copnLoveIt-'+comment.commentPn+' jt-home-expand-shop-comment-footer">';
			commentHtml += 	'			<span class="jt-home-expand-shop-comment-progress-date">'+comment.inputDate+'</span>';
			commentHtml +=	' 			<a href="#none" class="jt-home-expand-shop-comment-loveIt">LOVE</a>';	
			commentHtml +=	'			<span class="jt-home-expand-shop-comment-loveIt-count">'+ ( nullValueCheck(comment.commentLoveCount) ? '' : comment.commentLoveCount )+'</span>'+cancleComment;	
			commentHtml += 	'		</li>';
			commentHtml	+= 	'	</ul>';
			if(comment.customerPn == cpn){
				commentHtml +=	'<div class="jt-home-expand-shop-update-wrap">';
				commentHtml +=	'	<input type="text" class="jt-comment-update-input" value="'+htmlChars(comment.comment)+'"/><br/>';
				commentHtml += 	'	<span>esc를 누르시면 수정이 취소 됩니다.</span>';
				commentHtml +=	'</div>';
				commentHtml +=	'<div class="jt-home-expand-shop-tool-wrap">';
				commentHtml +=	'	<a href="#none" class="jt-comment-update jt-btn-white-small">';
				commentHtml +=	'		<span class="btnImage"></span>';
				commentHtml +=	'	</a>';
				commentHtml +=	'	<a href="#none" class="jt-comment-delete jt-btn-white-small">';
				commentHtml +=	'		<span class="btnImage"></span>';
				commentHtml +=	'	</a>';
				commentHtml +=	'</div>';
			}
			commentHtml += '</li>';
		}
		
		var pagination = commentFilter.pagination;
		if(commentTops.length > 0){
			if(pagination.numItems > 0 ){
				commentHtml +=	'<li class="jt-home-expand-shop-comment-add">';
				commentHtml +=	'	<a href="#none" class="jt-btn-silver" id="comment-add-btn"';
				commentHtml +=	'		data-spn="'+jtownUser.pn+'" data-page="0" ';
				commentHtml +=	'		data-ni="'+pagination.numItems+'" data-nipp="'+pagination.numItemsPerPage+'">';
				commentHtml +=	'			댓글&nbsp;더&nbsp;보기&nbsp;<span id="comment-now-count">0</span>/'+pagination.numItems;
				commentHtml +=	'	</a>';
				commentHtml +=	'</li>';
			}
		}else{
			if(pagination.numItems > pagination.numItemsPerPage ){
				commentHtml +=	'<li class="jt-home-expand-shop-comment-add">';
				commentHtml +=	'	<a href="#none" class="jt-btn-silver" id="comment-add-btn"';
				commentHtml +=	'		data-spn="'+jtownUser.pn+'" data-page="1" ';
				commentHtml +=	'		data-ni="'+pagination.numItems+'" data-nipp="'+pagination.numItemsPerPage+'">';
				commentHtml +=	'			댓글&nbsp;더&nbsp;보기&nbsp;<span id="comment-now-count">'+pagination.numItemsPerPage+'</span>/'+pagination.numItems;
				commentHtml +=	'	</a>';
				commentHtml +=	'</li>';
			}
		}
		
		var commentInputHtml = '';
		if(cpn == 0){
			commentInputHtml += '<input type="text" id="jt-comment-insert" readonly="readonly" placeholder="판매자 아이디로는 이용하실 수 없습니다."/>';	
		}else if(!nullValueCheck(cpn)){			
			commentInputHtml += '<input type="text" id="jt-comment-insert" placeholder="회사를 평가해 주세요." maxlength="100"/>';
		}else{
			commentInputHtml += '<input type="text" id="jt-comment-insert" readonly="readonly" placeholder="로그인한 사용자만 사용할 수 있습니다."/>';
		}
		
		var newEventHtml = '';
		newEventHtml += '		<div class="jt-home-expand-shop-event-new">';
		newEventHtml += '			<div>';
		newEventHtml += '				<span class="jt-home-expand-shop-event-new-image">NEW</span>';
		newEventHtml += '			</div>';
		newEventHtml += '		</div>';
		
		var loveClick = (!nullValueCheck(loveHave) && loveHave != 0 ) ? 'jt-home-shop-love-click' : '';
		var loveTextClick =   (!nullValueCheck(loveHave) && loveHave != 0) ? 'jt-home-shop-love-text-click' : '';
		
		var loveHotCount ='<span class="jt-home-shop-love-hot">HOT</span>';
		if(nullValueCheck(jtownUser.loveHotCount)){
			loveHotCount = '';
		}
		
		html += '<header class="jt-home-expand-click-shop-header">';
		html += '	<div>';
		html += '		<a href="http://'+jtownUser.shopUrl+'" target="_blank" onclick="jtown.home.clickShop(\''+spn+'\');">'+htmlChars(jtownUser.name)+'</a>';
		html += '	</div>';	
		html += '</header>';
		html += '<div class="jt-home-expand-shop jt-home-expand-click-shop" id="jt-home-expand-shop" data-size="'+productSize+'" data-nowPosition="'+productSize+'" data-spn="'+jtownUser.pn+'" >';
		html += '	<ul class="jt-home-expand-shop-expandProducts">';
		html += '		<li class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow">';
		if(productSize > 3){
		html += '			<a href="#none" id="jt-home-expand-shop-leftArrow">&lt;</a>';
		}
		html += '		</li>';
		html += '		<li class="jt-home-expand-shop-expandProduct-slide" id="jt-seller-slide-big">';
		html += '			<div id="jt-seller-slide-fake-dan">';
		html += '				<div style="width : '+(Number(productSize)*170)+'px;" id="jt-seller-slide-content-dan">';
		html +=	'					'+bigProductHtml;
		html += '				</div>';
		html += '			</div>';
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-rigthArrow jt-home-expand-shop-arrow">';
		if(productSize > 3){
		html +=	'			<a href="#none" id="jt-home-expand-shop-rigthArrow">&gt;</a>';
		}
		html +=	'		</li>';
		html += '	</ul>';
		html += '	<div class="jt-home-expand-shop-products">';
		html += '		<ul id="jt-seller-slide-small">';
		html += '			'+smallProductHtml;
		html += '		</ul>';
		html += '	</div>';
		html += '	<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-first">';
		html += '		'+ ( (jtownUser.bannerFirst != null && Number(jtownUser.bannerFirst) < 8 ) ? newEventHtml : '');
		html += '		<img alt="event1" src="'+path + eventImage1 +'" title="'+htmlChars(jtownUser.name)+' Event"/>';
		html += '	</div>';
		html += '	<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-second">';
		html += '		'+ ( (jtownUser.bannerSecond != null && Number(jtownUser.bannerSecond) < 8)? newEventHtml : '');
		html +=	'		<img alt="event2" src="'+path + eventImage2 +'" title="'+htmlChars(jtownUser.name)+' Event"/>';
		html +=	'	</div>';	
		html += '	<ul class="jt-home-expand-shop-content-fn">';
		html +=	'		<li class="jt-home-expand-shop-content-view-wrap">';
		html +=	'			<span class="jt-home-expand-shop-content-view">Look</span>&nbsp;<span id="view-expand-'+spn+'">'+jtownUser.viewCount+'</span>';	
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-content-comment-wrap">';
		html +=	'			<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;&nbsp;<span id="comment-expand-'+spn+'">' + jtownUser.commentCount+'</span>';
		html += '			<div class="jt-home-expand-shop-border-hide"></div>';
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-content-love-wrap">';
		html += '			'+loveHotCount;		
		html +=	'			<a href="#none" onclick="jtown.home.clickLove(\''+spn+'\');"><span class="jt-home-expand-shop-content-love '+loveClick+'" id="love-expand-image-'+spn+'">Love</span></a>&nbsp;<span id="love-expand-'+spn+'" class="'+loveTextClick+'">'+jtownUser.loveCount+'</span>';
		html +=	'		</li>';
		html +=	'	</ul>';
		html +=	'	<div class="jt-home-expand-shop-comment-wrap">';
		html +=	'		<ul class="jt-home-expand-shop-comment">';
		html +=	'			'+commentHtml;
		html +=	'		</ul>';
		html +=	'		<div class="jt-home-expand-shop-comment-insert">';
		html +=	'			'+commentInputHtml;
		html +=	'		</div>';
		html +=	'	</div>';
		html +=	'</div>';
		
		$.smartPop.open({width : 640,height : 650,html : html ,effect : 'transfer', target : '#jt-home-shop-'+spn });
		setTimeout('jtown.expand.syncProductMove()', 0);
		setTimeout('jtown.comment.syncComment()', 0);
		setTimeout('jtown.expand.changeContainerHeight()', 0);
		setTimeout('$(function(){ $("#jt-comment-insert").placeholder(); })', 0);
	});
};

jtown.expand.changeContainerHeight = function(){
	var smartPopContainer = $('#smartPop_container');
	if(!nullValueCheck(smartPopContainer.html())){	
		var smartPopContent = $('#smartPop_content');
		var height = $('#jt-home-expand-shop').css('height');
		height = Number(height.replace('px', ''));
		var changeHeight = height + 50;
		
		smartPopContainer.css('height', changeHeight+'px');
		smartPopContent.css('height', changeHeight+'px');
	}
};

jtown.expand.syncProductMove = function(){
	
	activeLeftArrow = function(){
		var s ;

		$('#jt-home-expand-shop-leftArrow').unbind('click').bind('click', function(){
			clearTimeout(s);
			a = function(){
				var last = $('#jt-seller-slide-content-dan>div:last'),
					dan = $('#jt-seller-slide-content-dan'),
					parent = $('#jt-home-expand-shop'),
					size = Number(parent.attr('data-size')),
					np = Number(parent.attr('data-nowPosition'));
			
				dan.prepend(last.clone().wrapAll('<div/>').parent().html());
				dan.css({left :  '-170px'}).animate({left :  '0px' }, '500', 'swing');
				last.remove();

				parent.attr('data-nowPosition', (np + 1) > size ? 1 : (np + 1) );
			};
			
			s = setTimeout('a()', 500);
		});	
	};
	activeLeftArrow();
	
	activeRightArrow = function(){
		var s ;
		
		$('#jt-home-expand-shop-rigthArrow').unbind('click').bind('click', function(){
			clearTimeout(s);	
			
			a = function(){
				var first = $('#jt-seller-slide-content-dan>div:first'),
					dan = $('#jt-seller-slide-content-dan');
					parent = $('#jt-home-expand-shop'),
					size = Number(parent.attr('data-size')),
					np = Number(parent.attr('data-nowPosition'));
			
				dan.animate({left : '-170px'}, '500', 'swing', function(){
						dan.css({left : '0px'});
						first.remove();
					}
				);
				dan.append(first.clone().wrapAll('<div/>').parent().html());
				
				parent.attr('data-nowPosition', (np - 1) <  1 ? size : (np - 1) );
			};
			
			s = setTimeout('a()', 500);
		});
	};
	activeRightArrow();
	
	activeProductList = function(){
		var s ;
				
		$('.jt-product-list').unbind('click').bind('click', function(){
			clearTimeout(s);
			var	count = Number($(this).parents('li').attr('data-count'));
			
			a = function(){
				var last = $('#jt-seller-slide-content-dan>div:last'),
					dan = $('#jt-seller-slide-content-dan'),
					parent = $('#jt-home-expand-shop'),
					size = Number(parent.attr('data-size')),
					np = Number(parent.attr('data-nowPosition'));
				
				if(count != np){
					setTimeout('a()', 500);
				}
				
				dan.prepend(last.clone().wrapAll('<div/>').parent().html());
				dan.css({left :  '-170px'}).animate({left :  '0px' }, '500', 'swing');
				last.remove();
	
				parent.attr('data-nowPosition', (np + 1) > size ? 1 : (np + 1) );
				
			};
			
			s = setTimeout('a()', 500);
		});
	};
	activeProductList();
};