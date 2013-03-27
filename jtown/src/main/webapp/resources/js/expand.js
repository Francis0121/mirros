if (typeof jtown.expand == 'undefined') {
	jtown.expand = {};
}

$(document).ready(function(){
	jtown.expand.loadExpandShop();
	
	jtown.expand.syncProductMove();
	
	jtown.comment.syncComment();
});

jtown.expand.loadExpandShop = function(){
	$('.jt-home-shop-content-image').unbind('click');
	$('.jt-home-shop-content-image').bind('click', function(){
		var $parent = $(this).parents('.jt-seller-main');
		
		if(nullValueCheck($parent.html())){
			jtown.expand.makeInnerHtml($(this).attr('data-spn'));	
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
			best = false;
		
		var productSize = Number(products.length);
		var bigProductHtml = '';
		var smallProductHtml = '';
		for(var i=0; i<productSize; i++){
			var product = products[i],
				count = Number(i)+1,
				index = productSize-Number(i);
			if(count < 4){
				bigProductHtml+='<div class="jt-home-expand-shop-expandProduct" id="jt-product-'+index+'">';
			}else{
				bigProductHtml+='<div class="jt-home-expand-shop-expandProduct" id="jt-product-'+index+'" style="display: none;">';
			}
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
		
		for(var i=0; i<comments.length; i++){
			var comment = comments[i];
			commentHtml += 	'<li data-copn="'+comment.commentPn+'" class="'+ (best ? 'jt-home-expand-shop-comment-li-best' : 'jt-home-expand-shop-comment-li')+'">';
			commentHtml +=	'	<ul class="jt-home-expand-shop-text-wrap">';
			commentHtml += 	'		<li class="jt-home-expand-shop-comment-header">';
			commentHtml += 	'			<span class="jt-home-expand-shop-comment-name">'+htmlChars(comment.customerName)+'</span>';
			commentHtml += 	'		 	<span class="jt-home-expand-shop-comment-progress-date">'+comment.inputDate+'</span>';
			commentHtml +=	' 			<a href="#none" class="jt-home-expand-shop-comment-loveIt">Love&nbsp;It</a>';	
			commentHtml +=	'			<span id="copnLoveIt-'+comment.commentPn+'" class="jt-home-expand-shop-comment-loveIt-count">'+ ( nullValueCheck(comment.commentLoveCount) ? '' : comment.commentLoveCount )+'</span>';
			commentHtml += 	'		</li>';
			commentHtml +=	'		<li class="jt-home-expand-shop-comment-text">'+htmlChars(comment.comment)+'</li>';
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
			commentInputHtml += '<input type="text" id="jt-comment-insert" placeholder="회사를 평가해 주세요."/>';
		}else{
			commentInputHtml += '<input type="text" id="jt-comment-insert" readonly="readonly" placeholder="로그인한 사용자만 사용할 수 있습니다."/>';
		}
		
		var newEventHtml = '';
		newEventHtml += '		<div class="jt-home-expand-shop-event-new">';
		newEventHtml += '			<div>';
		newEventHtml += '				<span class="jt-home-expand-shop-event-new-image">NEW</span>';
		newEventHtml += '			</div>';
		newEventHtml += '		</div>';
		
		html += '<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-size="'+productSize+'" data-nowPosition="'+(Number(productSize) - 1)+'" data-spn="'+jtownUser.pn+'" >';
		html += '	<header>';
		html += '		<a href="#none" onclick="window.open(\'http://'+htmlChars(jtownUser.shopUrl)+'\');">'+htmlChars(jtownUser.name)+'</a>';
		html += '	</header>';
		html += '	<ul class="jt-home-expand-shop-expandProducts">';
		html += '		<li class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow">';
		if(productSize > 3){
		html += '			<a href="#none" id="jt-home-expand-shop-leftArrow">&lt;</a>';
		}
		html += '		</li>';
		html += '		<li class="jt-home-expand-shop-expandProduct-slide" id="jt-seller-slide-big">';
		html +=	'			'+bigProductHtml;
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
		html +=	'			<span class="jt-home-expand-shop-content-view">Look</span>&nbsp;<span id="view-expand-'+spn+'"/>'+jtownUser.viewCount+'</span>';	
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-content-comment-wrap">';
		html +=	'			<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;&nbsp;<span id="comment-expand-'+spn+'">' + jtownUser.commentCount+'</span>';
		html += '			<div class="jt-home-expand-shop-border-hide"></div>';
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-content-love-wrap">';
		html +=	'			<a href="#none" onclick="jtown.home.clickLove(\''+spn+'\');"><span class="jt-home-expand-shop-content-love">Love</span>&nbsp;<span id="love-expand-'+spn+'">'+jtownUser.loveCount+'</span></a>';
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
		setTimeout('jtown.expand.changeContainerHeight(\''+comments.length+'\')', 0);
	});
};

jtown.expand.changeContainerHeight = function(number){
	var smartPopContainer = $('#smartPop_container');
	var smartPopContent = $('#smartPop_content');
	var height = smartPopContainer.css('height');
	height = Number(height.replace('px', ''));
	var changeHeight = height + (48 * Number(number));

	smartPopContainer.css('height', changeHeight+'px');
	smartPopContent.css('height', changeHeight+'px');
};

jtown.expand.syncProductMove = function(){
	

	$('#jt-home-expand-shop-leftArrow').unbind('click');
	$('#jt-home-expand-shop-leftArrow').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			nowPosition = Number($parent.attr('data-nowPosition'));
		if(size > 3){
			if(nowPosition == 1){
				$('#jt-product-'+size).css({'display':'none'});	
			}else{
				$('#jt-product-'+(nowPosition-1)).css({'display':'none'});
			}
			
			if(nowPosition == size ){
				$('#jt-product-'+size).css({'left': '340px'});
				$('#jt-product-1').css({'left': '-170px'});
				$('#jt-product-2').css({'left': '-170px', 'display':'block'});
			}else if(nowPosition == (size-1)){
				$('#jt-product-'+(size-1)).css({'left': '170px'});
				$('#jt-product-'+(size)).css({'left': '170px'});
				$('#jt-product-1').css({'left': '-340px', 'display':'block'});
			}else{
				$('.jt-home-expand-shop-expandProduct').css({'left':'0'});
				$('#jt-product-'+(nowPosition + 2)).css({'display':'block'});
			}
			
			if(nowPosition + 1 > size){
				$parent.attr('data-nowPosition', 1 );			
			}else{
				$parent.attr('data-nowPosition', (nowPosition + 1) );			
			}
		}
	});	

	$('#jt-home-expand-shop-rigthArrow').unbind('click');
	$('#jt-home-expand-shop-rigthArrow').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			nowPosition = Number($parent.attr('data-nowPosition'));
		if(size > 3){
			if(nowPosition == size){
				$('#jt-product-1').css({'display':'none'});
			}else{
				$('#jt-product-'+(nowPosition+1)).css({'display':'none'});	
			}
			
			if(nowPosition == 2){
				$('#jt-product-2').css({'left': '-170px'});
				$('#jt-product-1').css({'left': '-170px'});
				$('#jt-product-'+size).css({'left': '340px','display':'block'});
			}else if(nowPosition == 1){
				$('#jt-product-'+(size-1)).css({'left': '170px','display':'block'});
				$('#jt-product-'+(size)).css({'left': '170px'});
				$('#jt-product-1').css({'left': '-340px'});
			}else{
				$('.jt-home-expand-shop-expandProduct').css({'left':'0'});	
				$('#jt-product-'+(nowPosition - 2)).css('display', 'block');
			}
			
			if(nowPosition - 1 < 1){
				$parent.attr('data-nowPosition', size );			
			}else{
				$parent.attr('data-nowPosition', (nowPosition - 1) );			
			}
		}
	});
	
	$('.jt-product-list').unbind('click');
	$('.jt-product-list').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			count = Number($(this).parents('li').attr('data-count'));
		if(size > 3){
			$('.jt-home-expand-shop-expandProduct').css({'display':'none', 'left':'0'});
			
			if(count == size){			
				$('#jt-product-'+(size-1)).css({'display':'block', 'left': '170px'});
				$('#jt-product-'+(size)).css({'display':'block', 'left': '170px'});
				$('#jt-product-'+1).css({'display':'block', 'left': '-340px'});
			}else if(count == 1){
				$('#jt-product-2').css({'display':'block', 'left': '-170px'});
				$('#jt-product-1').css({'display':'block', 'left': '-170px'});
				$('#jt-product-'+size).css({'display':'block', 'left': '340px'});
			}else{
				$('#jt-product-'+(count - 1)).css('display', 'block');
				$('#jt-product-'+count).css('display', 'block');
				$('#jt-product-'+(count + 1)).css('display', 'block');
			}
			$parent.attr('data-nowPosition', count);			
		}
	});
	
};