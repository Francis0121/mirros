if (typeof jtown.expand == 'undefined') {
	jtown.expand = {};
}

$(document).ready(function(){
	jtown.expand.loadExpandShop();
});

jtown.expand.loadExpandShop = function(){
	$('.jt-home-shop-content').unbind('click');
	$('.jt-home-shop-content').bind('click', function(){
		var $parent = $(this).parents('.jt-seller-main');
		
		if(nullValueCheck($parent.html())){
			$.smartPop.open({
				width : 640,
				height : 780,
				html : jtown.expand.makeInnerHtml()
			});
			
			setTimeout(jtown.expand.syncProductMove(), 1000);	
		}
	});
};

jtown.expand.makeInnerHtml = function(){
	
	var html = 	'<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-size="10" data-nowPosition="2">'+
				'	<header>'+
				'		<a href="#none">Teachers Fitting Shop</a>'+
				'	</header>'+
				'	<ul class="jt-home-expand-shop-expandProducts">'+
				'		<li class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow">'+
				'			<a href="#none" id="jt-home-expand-shop-leftArrow">&lt;</a>'+
				'		</li>'+
				'		<li class="jt-home-expand-shop-expandProduct-slide">';
				for(var i=1; i<11; i++){
					if(i<4){
						html+=
				'			<div class="jt-home-expand-shop-expandProduct" id="jt-product-'+i+'">';	
					}else{
						html+=	
				'			<div class="jt-home-expand-shop-expandProduct" id="jt-product-'+i+'" style="display: none;">';		
					}
						html+=
				'				<img alt="상품" src="'+contextPath+'resources/uploadImage/Product-'+i+'.png"/>'+
				'			</div>';
				}
				html+=
				'		</li>'+
				'		<li class="jt-home-expand-shop-rigthArrow jt-home-expand-shop-arrow">'+
				'			<a href="#none" id="jt-home-expand-shop-rigthArrow">&gt;</a>'+
				'		</li>'+
				'	</ul>'+
				'	<div class="jt-home-expand-shop-products">'+
				'		<h2>Products</h2>'+
				'		<ul>';
				for(var i=1; i<11; i++){
					html +=
				'				<li data-count="'+i+'">'+
				'					<div class="jt-seller-expand-product-delete-tool">	'+
				'						<a href="#none" class="jt-seller-product-delete">X</a>'+
				'					</div>'+
				'					<a href="#none"class="jt-product-list"><img alt="상품" src="'+contextPath+'/resources/uploadImage/Product-'+i+'.png"/></a>'+
				'				</li>';
				}
				html+=	
				'		</ul>'+
				'	</div>'+
				'	<div class="jt-home-expand-shop-event-first" id="jt-seller-expand-event-first">'+
				'		<img alt="event1" src="'+contextPath+'resources/uploadImage/event-1.png"/>'+
				'	</div>'+
				'	<div class="jt-home-expand-shop-event-second" id="jt-seller-expand-event-second">'+
				'		<img alt="event2" src="'+contextPath+'resources/uploadImage/event-2.png"/>'+
				'	</div>'+
				'	<ul class="jt-home-expand-shop-content-fn">'+
				'		<li>'+
				'			VIEW 3,000'+	
				'		</li>'+
				'		<li>'+
				'			COMMENT 8'+
				'		</li>'+
				'		<li>'+
				'			♥'+
				'		</li>'+
				'	</ul>'+
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
	
		return html;
};

jtown.expand.syncProductMove = function(){
	
	$('#jt-home-expand-shop-leftArrow').unbind('click');
	$('#jt-home-expand-shop-leftArrow').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			nowPosition = Number($parent.attr('data-nowPosition'));
	
		if(nowPosition == size){
			$('#jt-product-'+1).css({'display':'none'});	
		}else{
			$('#jt-product-'+(nowPosition+1)).css({'display':'none'});
		}
		
		if(nowPosition == 2 ){
			$('#jt-product-2').css({'left': '170px'});
			$('#jt-product-1').css({'left': '170px'});
			$('#jt-product-'+size).css({'left': '-340px', 'display':'block'});
		}else if(nowPosition == 1){
			$('#jt-product-1').css({'left': '340px'});
			$('#jt-product-'+(size)).css({'left': '-170px'});
			$('#jt-product-'+(size-1)).css({'left': '-170px', 'display':'block'});
		}else{
			$('.jt-home-expand-shop-expandProduct').css({'left':'0'});
			$('#jt-product-'+(nowPosition - 2)).css({'display':'block'});
		}
		
		if(nowPosition - 1 < 1){
			$parent.attr('data-nowPosition', size );			
		}else{
			$parent.attr('data-nowPosition', (nowPosition - 1) );			
		}
	});	

	$('#jt-home-expand-shop-rigthArrow').unbind('click');
	$('#jt-home-expand-shop-rigthArrow').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			nowPosition = Number($parent.attr('data-nowPosition'));

		if(nowPosition == 1){
			$('#jt-product-'+size).css({'display':'none'});
		}else{
			$('#jt-product-'+(nowPosition-1)).css({'display':'none'});	
		}
		
		if(nowPosition == size){
			$('#jt-product-2').css({'display':'block', 'left': '170px'});
			$('#jt-product-1').css({'left': '170px'});
			$('#jt-product-'+size).css({'left': '-340px'});
		}else if(nowPosition == (size-1)){
			$('#jt-product-'+(size-1)).css({'left': '-170px'});
			$('#jt-product-'+(size)).css({'left': '-170px'});
			$('#jt-product-1').css({'display':'block', 'left': '340px'});
		}else{
			$('.jt-home-expand-shop-expandProduct').css({'left':'0'});
			$('#jt-product-'+(nowPosition + 2)).css('display', 'block');
		}
		
		if(nowPosition + 1 > size){
			$parent.attr('data-nowPosition', 1 );			
		}else{
			$parent.attr('data-nowPosition', (nowPosition + 1) );			
		}
	});
	
	$('.jt-product-list').unbind('click');
	$('.jt-product-list').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			size = Number($parent.attr('data-size')),
			count = Number($(this).parents('li').attr('data-count'));
		
		$('.jt-home-expand-shop-expandProduct').css({'display':'none', 'left':'0'});
		
		if(count == size){			
			$('#jt-product-'+(size-1)).css({'display':'block', 'left': '-170px'});
			$('#jt-product-'+(size)).css({'display':'block', 'left': '-170px'});
			$('#jt-product-'+1).css({'display':'block', 'left': '340px'});
		}else if(count == 1){
			$('#jt-product-2').css({'display':'block', 'left': '170px'});
			$('#jt-product-1').css({'display':'block', 'left': '170px'});
			$('#jt-product-'+size).css({'display':'block', 'left': '-340px'});
		}else{
			$('#jt-product-'+(count - 1)).css('display', 'block');
			$('#jt-product-'+count).css('display', 'block');
			$('#jt-product-'+(count + 1)).css('display', 'block');
		}
		$parent.attr('data-nowPosition', count);			
	});
	
};