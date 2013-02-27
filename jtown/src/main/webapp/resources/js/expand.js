if (typeof jtown.expand == 'undefined') {
	jtown.expand = {};
}

$(document).ready(function(){
	jtown.expand.loadExpandShop();
	
	jtown.expand.syncProductMove();
});

jtown.expand.loadExpandShop = function(){
	$('.jt-home-shop-content').unbind('click');
	$('.jt-home-shop-content').bind('click', function(){
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
			jtownUser = selectMap.jtownUser;
		
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
		
		
		html += '<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-size="'+productSize+'" data-nowPosition="'+(productSize-1)+'">';
		html += '	<header>';
		html += '		<a href="#none" onclick="window.open(\'http://'+htmlChars(jtownUser.shopUrl)+'\');">'+htmlChars(jtownUser.shopName)+'</a>';
		html += '	</header>';
		html += '	<ul class="jt-home-expand-shop-expandProducts">';
		html += '		<li class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow">';
		html += '			<a href="#none" id="jt-home-expand-shop-leftArrow">&lt;</a>';
		html += '		</li>';
		html += '		<li class="jt-home-expand-shop-expandProduct-slide" id="jt-seller-slide-big">';
		html +=	'			'+bigProductHtml;
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-rigthArrow jt-home-expand-shop-arrow">';
		html +=	'			<a href="#none" id="jt-home-expand-shop-rigthArrow">&gt;</a>';
		html +=	'		</li>';
		html += '	</ul>';
		html += '	<div class="jt-home-expand-shop-products">';
		html += '		<h2>Products</h2>';
		html += '		<ul id="jt-seller-slide-small">';
		html += '			'+smallProductHtml;
		html += '		</ul>';
		html += '	</div>';
		html += '	<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-first">';
		html += '		<img alt="event1" src="'+path + eventImage1 +'" title="'+htmlChars(jtownUser.shopName)+' Event"/>';
		html += '	</div>';
		html += '	<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-second">';
		html +=	'		<img alt="event2" src="'+path + eventImage2 +'" title="'+htmlChars(jtownUser.shopName)+' Event"/>';
		html +=	'	</div>';	
		html += '	<ul class="jt-home-expand-shop-content-fn">';
		html +=	'		<li>';
		html +=	'			VIEW '+ jtownUser.viewCount;	
		html +=	'		</li>';
		html +=	'		<li>';
		html +=	'			COMMENT 8';
		html +=	'		</li>';
		html +=	'		<li>';
		html +=	'			♥ ' + jtownUser.loveCount;
		html +=	'		</li>';
		html +=	'	</ul>'+
				'	<div class="jt-home-expand-shop-comment-wrap">'+
				'		<ul class="jt-home-expand-shop-comment">'+
				'			<li><span class="jt-home-expand-shop-comment-name">김성근</span> 이 매장 정말 좋아요</li>'+
				'			<li><span class="jt-home-expand-shop-comment-name">박광열</span> 상품 배송이 정말 빨랑</li>'+
				'			<li><span class="jt-home-expand-shop-comment-name">이진섭</span> 대박쇼핑몰!!</li>'+
				'			<li><span class="jt-home-expand-shop-comment-name">홍길동</span> 상품이 정말 많아요</li>'+
				'			<li><span class="jt-home-expand-shop-comment-name">홍길동</span> 상품이 정말 많아요</li>'+
				'		</ul>'+
				'	</div>'+
				'	<div class="jt-home-expand-shop-comment-insert">'+
				'		<input type="text"/>'+
				'	</div>'+
				'</div>';
		$.smartPop.open({width : 640,height : 780,html : html });
		setTimeout(jtown.expand.syncProductMove(), 1300);
	});
};

jtown.expand.syncProductMove = function(){
	
	$('#jt-home-expand-shop-leftArrow').unbind('click');
	$('#jt-home-expand-shop-leftArrow').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			nowPosition = Number($parent.attr('data-nowPosition'));
	
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
	});	

	$('#jt-home-expand-shop-rigthArrow').unbind('click');
	$('#jt-home-expand-shop-rigthArrow').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			nowPosition = Number($parent.attr('data-nowPosition'));

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
	});
	
	$('.jt-product-list').unbind('click');
	$('.jt-product-list').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			count = Number($(this).parents('li').attr('data-count'));
		
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
	});
	
};