$(function(){
	jtown.expand.loadExpandShop();
	
	jtown.expand.syncProductMove();
	
	jtown.comment.syncComment();
	
	jtown.expand.gotoPage();
});

if (typeof jtown.expand == 'undefined') {
	jtown.expand = {};
}

jtown.expand.show = true;

jtown.expand.loadExpandShop = function(){
	$('.jt-home-shop-content-image').unbind('click').bind('click', function(){
		var parent = $(this).parents('.jt-seller-main');
		
		if(nullValueCheck(parent.html())){
			var jtHomeShop = $(this).parents('.jt-home-shop'),
				spn = jtHomeShop.attr('data-spn');
			jtown.expand.makeInnerHtml(spn);	
		}
	});
	
	$('.jt-home-shop-comment').unbind('click').bind('click', function(){
		var $parent = $(this).parents('.jt-seller-main');
		
		if(nullValueCheck($parent.html())){
			var jtHomeShop = $(this).parents('.jt-home-shop'),
			spn = jtHomeShop.attr('data-spn');
			jtown.expand.makeInnerHtml(spn);
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
			interests = selectMap.interestes,
			cpn = selectMap.cpn,
			best = false,
			loveHave = selectMap.loveHave;
		
		var productSize = Number(products.length);
		var bigProductHtml = '';
		var smallProductHtml = '';
		for(var i=0; i<productSize; i++){
			var product = products[i],
				index = productSize-Number(i);
			
			var detailProduct  = '<span>'+htmlChars(nullValueCheck(product.name) ? '' : product.name)+'</span>';
				detailProduct += '<span>'+htmlChars(nullValueCheck(product.commaPrice) ? '' : product.commaPrice)+'</span>';
			
			if(nullValueCheck(product.name) || nullValueCheck(product.commaPrice)){
				detailProduct = '<span>상품 정보가 아직</span><span>입력되지 않았습니다.</span>';
			}
			
			bigProductHtml += '<div class="jt-home-expand-shop-expandProduct">';
			bigProductHtml += '<a href="'+ ( nullValueCheck(product.url) ? jtownUser.shopUrl : product.url  )+'" target="_blank" onclick="jtown.home.goHome('+spn+');"><img alt="상품" src="'+path+product.saveName+'"/></a>';
			bigProductHtml += '<div class="jt-product-article-object-wrap jt-product-article-object-expand">';
			bigProductHtml += detailProduct;
			bigProductHtml += '</div>';
			bigProductHtml += '</div>';
			
			var smallProductNewHtml = '<span>&nbsp;</span>';
			if(product.newProduct){
				smallProductNewHtml = '<span>New</span>';
			}
			
			smallProductHtml += '<li data-count="'+index+'">';
			smallProductHtml += '	'+smallProductNewHtml;
			smallProductHtml += '	<a href="#none" class="jt-product-list"><img alt="상품" src="'+path+product.saveName+'"/></a>';
			smallProductHtml += '</li>';
		}
		
		var eventImage1 = contextPath + 'resources/images/jt-event-user-blank.png', 
			eventImage2 = contextPath + 'resources/images/jt-event-user-blank.png';
		
		if(!nullValueCheck(event1)){
			eventImage1 = path + event1.saveName;
		}
		
		if(!nullValueCheck(event2)){
			eventImage2 = path + event2.saveName;
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
			var warnComment = '';
			if(comment.customerPn != cpn){
				if(nullValueCheck(comment.warnCustomerPn)){
					warnComment = '&nbsp;<span href="#none" class="jt-warn-active" title="신고">WARN</span>';
				}else{
						warnComment = '&nbsp;<span href="#none" class="jt-warn-disactive" title="신고">WARN</span>';
				}
			}
			
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
			commentHtml +=	'			'+warnComment;
			commentHtml += 	'		</li>';
			commentHtml	+= 	'	</ul>';
			if(comment.customerPn == cpn){
				commentHtml +=	'<div class="jt-home-expand-shop-update-wrap">';
				commentHtml +=	'	<input type="text" class="jt-comment-update-input" value="'+htmlChars(comment.comment)+'" maxlength="100"><br/>';
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
			commentInputHtml += '<input id="jt-comment-insert" readonly="readonly" placeholder="판매자 아이디로는 이용하실 수 없습니다."/>';	
		}else if(!nullValueCheck(cpn)){			 
			commentInputHtml += '<input type="text" id="jt-comment-insert" placeholder="쇼핑몰에 대한 한마디를 남겨보세요. 상품 배송문의는 해당 쇼핑몰 고객센터로 남겨주세요." maxlength="100"/>';
		}else{
			commentInputHtml += '<input id="jt-comment-insert" readonly="readonly" placeholder="로그인한 사용자만 사용할 수 있습니다."/>';
		}
		
		var newEventHtml = '';
		newEventHtml += '		<div class="jt-home-expand-shop-event-new">';
		newEventHtml += '			<div>';
		newEventHtml += '				<span class="jt-home-expand-shop-event-new-image">NEW</span>';
		newEventHtml += '			</div>';
		newEventHtml += '		</div>';
		
		var loveClick = (!nullValueCheck(loveHave) && loveHave != 0 ) ? 'jt-home-shop-love-click' : '';
		var loveTextClick =   (!nullValueCheck(loveHave) && loveHave != 0) ? 'jt-home-shop-love-text-click' : '';
		
		var loveHotCount ='<span class="jt-home-shop-love-hot" title="최근 뜨는 미니샵">HOT</span>';
		if(nullValueCheck(jtownUser.loveHotCount) || jtownUser.loveHotCount == 0 ){
			loveHotCount = '';
		}
		
		var tagHtml = '<span class="tag-txt">';
		for(var i = 0, iLength = interests.length ; i < iLength ; i++){
			var interest = interests[i];
			tagHtml += interest.name;
			if((i+1) != iLength){
				tagHtml += ',&nbsp;';
			}
		}
		tagHtml +='</span><span class="tag-image">Tag</span>';
		
		html += '<header class="jt-home-expand-click-shop-header">';
		html += '	<div>';
		html += '		<a href="'+jtownUser.shopUrl+'" target="_blank" onclick="jtown.home.goHome(\''+spn+'\');" title="클릭시 해당 쇼핑몰로 이동됩니다.">'+htmlChars(jtownUser.name)+'</a>';
		html += '	</div>';	
		html += '</header>';
		html += '<div class="jt-home-expand-shop jt-home-expand-click-shop" id="jt-home-expand-shop" data-name="'+htmlChars(jtownUser.name)+'" data-size="'+productSize+'" data-nowPosition="'+productSize+'" data-spn="'+jtownUser.pn+'" data-url="'+jtownUser.shopUrl+'">';
		html += '	<div id="jt-home-expand-shop-notice" class="gotoPage" title="클릭시 해당 쇼핑몰로 이동됩니다.">';
		html += '		<span class="jt-home-expand-shop-firstQuotationMark"></span>';
		html += '		<pre id="jt-seller-expand-shop-text" class="jt-home-expand-shop-text">'+ ( nullValueCheck(jtownUser.longNotice) ? "쇼핑몰의 홍보문구를 입력해주세요." : jtownUser.longNotice ) +'</pre>';
		html += '		<span class="jt-home-expand-shop-lastQuotationMark"></span>';				
		html += '	</div>';
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
		html += '	<div class="jt-home-expand-shop-products ">';
		html += '		<ul id="jt-seller-slide-small">';
		html += '			'+smallProductHtml;
		html += '		</ul>';
		html += '		<div class="jt-home-expand-shop-tag">';
		html += '			'+tagHtml;
		html += '		</div>';	
		html += '	</div>';
		html += '	<div class="jt-home-expand-shop-event gotoPage" id="jt-seller-expand-event-first" title="클릭시 해당 쇼핑몰로 이동됩니다.">';
		html += '		'+ ( (jtownUser.bannerFirst != null && Number(jtownUser.bannerFirst) < 3 ) ? newEventHtml : '');
		html += '		<img alt="First Event" src="'+eventImage1 +'"/>';
		html += '	</div>';
		html += '	<div class="jt-home-expand-shop-event gotoPage" id="jt-seller-expand-event-second" title="클릭시 해당 쇼핑몰로 이동됩니다.">';
		html += '		'+ ( (jtownUser.bannerSecond != null && Number(jtownUser.bannerSecond) < 3 )? newEventHtml : '');
		html +=	'		<img alt="Second Event" src="'+eventImage2 +'"/>';
		html +=	'	</div>';	
		html += '	<ul class="jt-home-expand-shop-content-fn">';
		html +=	'		<li class="jt-home-expand-shop-content-view-wrap">';
		html +=	'			<span class="jt-home-expand-shop-content-view" title="최근 일주일간 방문수">Look</span>&nbsp;<span id="view-expand-'+spn+'">'+jtownUser.viewCount+'</span>';	
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-content-comment-wrap">';
		html +=	'			<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;<span id="comment-expand-'+spn+'" class="jt-home-expand-shop-content-comment-text">' + jtownUser.commentCount+'</span>';
		html += '			<div class="jt-home-expand-shop-border-hide"></div>';
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-content-love-wrap">';
		html +=	'			<div class="jt-heart-click-expand-wrap">';
		html +=	'				<div class="jt-heart-click-background" id="jt-heart-expand-click-'+spn+'">';
		html +=	'					<img alt="heart-background" src="'+contextPath+'resources/images/heart-background.png">';
		html +=	'				</div>';
		html +=	'				<div class="jt-heart-click">';
		html +=	'					<a href="#none" onclick="jtown.home.clickLove(\''+spn+'\');"><span class="jt-home-expand-shop-content-love '+loveClick+'" id="love-expand-image-'+spn+'">Love</span></a>';
		html +=	'				</div>';
		html +=	'			</div>';
		html +=	'			<div class="jt-home-expand-shop-content-love-text-wrap">';
		html +=	'				<span id="love-expand-'+spn+'" class="'+loveTextClick+'">'+jtownUser.loveCount+'</span>';
		html += '				'+loveHotCount;		
		html +=	'			</div>';
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
		
		$.smartPop.open({width : 640,height : 650, html : html ,effect : 'transfer', target : '#jt-home-shop-'+spn });
		setTimeout('jtown.expand.setTimeout()',0);
		setTimeout('jtown.home.clickShop(\''+spn+'\');', 0);
	});
};

jtown.expand.setTimeout = function(){
	jtown.expand.show = true;
	jtown.expand.syncProductMove();
	jtown.comment.syncComment();
	jtown.expand.changeContainerHeight();
	jtown.expand.gotoPage();
	jtown.seller.syncProduct();
	$(function(){
		$('#jt-comment-insert').placeholder(); 
	});
};

jtown.expand.gotoPage = function(){
	
	$('.gotoPage').unbind('click').bind('click', function(){
		var parent = $(this).parents('.jt-home-expand-shop');
		var spn = parent.attr('data-spn');
		var url = parent.attr('data-url');

		var open = window.open('about:blank');
		open.location.href = url;
		jtown.home.goHome(spn);
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
	
	$('.jt-product-list').unbind('mouseover mouseout').bind('mouseover mouseout', function(event){
		if(event.type == 'mouseover'){
			$(this).css('opacity', '.7');
		}else if(event.type == 'mouseout'){
			$(this).css('opacity', '1');
		}
	});
	
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
				
				if(size > 3){	
					dan.prepend(last.clone().wrapAll('<div/>').parent().html());
					dan.css({left :  '-170px'}).animate({left :  '0px' }, '500', 'swing');
					last.remove();
	
					parent.attr('data-nowPosition', (np + 1) > size ? 1 : (np + 1) );
					jtown.seller.syncProduct();
				}
			};
			
			s = setTimeout('a()', 200);
		});	
	};
	
	activeLeftArrow();
	
	activeRightArrow = function(){
		var s ;
		
		$('#jt-home-expand-shop-rigthArrow').unbind('click').bind('click', function(){
			clearTimeout(s);	
			a = function(){
				var first = $('#jt-seller-slide-content-dan>div:first'),
					dan = $('#jt-seller-slide-content-dan'),
					parent = $('#jt-home-expand-shop'),
					size = Number(parent.attr('data-size')),
					np = Number(parent.attr('data-nowPosition'));
				if(size > 3){
					
					dan.animate({left : '-170px'}, '500', 'swing', function(){
							dan.css({left : '0px'});
							first.remove();
						}
					);
					dan.append(first.clone().wrapAll('<div/>').parent().html());
					parent.attr('data-nowPosition', (np - 1) <  1 ? size : (np - 1) );
					jtown.seller.syncProduct();
				}
			};
			
			s = setTimeout('a()', 200);
		});
	};
	
	activeRightArrow();
	
	activeProductList = function(){
		var s ;
				
		$('.jt-product-list').unbind('click').bind('click', function(){
			$('.jt-product-list').unbind('click');
			$('#jt-home-expand-shop-rigthArrow').unbind('click');
			$('#jt-home-expand-shop-leftArrow').unbind('click');
			clearTimeout(s);
			var	count = Number($(this).parents('li').attr('data-count'));
			
			a = function(){
				var last = $('#jt-seller-slide-content-dan>div:last'),
					dan = $('#jt-seller-slide-content-dan'),
					parent = $('#jt-home-expand-shop'),
					size = Number(parent.attr('data-size')),
					np = Number(parent.attr('data-nowPosition'));
				
				if((np == 1 && size == count) || (count != size && (count+1) == np )){
					activeProductList();
					activeLeftArrow();
					activeRightArrow();
					return ;
				}
				if(size > 3){
				
					if(count != np){
						if(jtown.expand.show){							
							setTimeout('a()', 500);
						}
					}else{
						activeProductList();
						activeLeftArrow();
						activeRightArrow();
					}
						
					dan.prepend(last.clone().wrapAll('<div/>').parent().html());
					dan.css({left :  '-170px'}).animate({left :  '0px' }, '500', 'swing');
					last.remove();
		
					parent.attr('data-nowPosition', (np + 1) > size ? 1 : (np + 1) );
					jtown.seller.syncProduct();
				}
			};
			
			s = setTimeout('a()', 500);
		});
	};
	activeProductList();
};