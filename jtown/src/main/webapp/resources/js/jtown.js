if (typeof jtown == 'undefined') {
	jtown = {};
}

if (typeof jtown.header == 'undefined') {
	jtown.header = {};
}

$(document).ready(function(){
	$('#jt-login-smartPopup').unbind('click');
	$('#jt-login-smartPopup').bind('click', function() {
		var inner = $('#jt-login-form-wrap');
		$.smartPop.open({
			width : 400,
			height : 270,
			html : inner.html()
		});
	});
	
	jtown.header.syncNavMove();
	
	jtown.header.syncNavInterest();
});

jtown.header.syncNavMove = function(){
	$('.jt-header-nav-right').unbind('click');
	$('.jt-header-nav-right').bind('click', function(){
		var scrollWidth = Number($('.jt-header-nav-scroll').width()),
			allWidth =  Number($('.jt-header-nav-all').width()),
			gapWith = scrollWidth - allWidth,
			allLeftText = $('.jt-header-nav-all').css('left'),
			allLeftWidth = Number(allLeftText.replace('px', '')),
			moveWidth = Number(0);
		
		if(gapWith < allLeftWidth){
			moveWidth = allLeftWidth + -(scrollWidth/2);
			if(moveWidth < gapWith){
				moveWidth = gapWith;
			}
			$('.jt-header-nav-all').animate({
				left : moveWidth+'px'
			}, 500);	
		}
	});
	
	$('.jt-header-nav-left').unbind('click');
	$('.jt-header-nav-left').bind('click', function(){
		var scrollWidth = Number($('.jt-header-nav-scroll').width()),
			allLeftText = $('.jt-header-nav-all').css('left'),
			allLeftWidth = Number(allLeftText.replace('px', '')),
			moveWidth = Number(0);
		
		if(0 > allLeftWidth){
			moveWidth = allLeftWidth + (scrollWidth/2);
			if(moveWidth > 0){
				moveWidth = 0;
			}
			$('.jt-header-nav-all').animate({
				left : moveWidth+'px'
			}, 500);	
		}
	});
	
	$('.jt-header-nav-all').children('li').unbind('click');
	$('.jt-header-nav-all').children('li').bind('click', function(){
		var left = Number($(this).position().left) - 1;
		$('.jt-header-nav-all').animate({
			left : '-'+left+'px'
		}, 500);	
	});
};

jtown.header.syncNavInterest = function(){
	$('.jt-header-nav-down').unbind('mouseover mouseout');
	$('.jt-header-nav-down').bind('mouseover mouseout', function(event){
		if(event.type == 'mouseover'){
			$(this).find('.jt-header-nav-down-delete').show();
		}else if(event.type == 'mouseout'){
			$(this).find('.jt-header-nav-down-delete').hide();
		}
	});
	
	$('.jt-header-nav-down-delete').unbind('click');
	$('.jt-header-nav-down-delete').bind('click', function(){
		jtown.header.navInterestDelete($(this));
	});
};

jtown.header.navInterestDelete = function(me){
	var $parent = me.parents('.jt-header-nav-down');
	$parent.remove();
};

if (typeof jtown.expand == 'undefined') {
	jtown.expand = {};
}

$(document).ready(function(){
	jtown.expand.syncProductMove();
	
	jtown.expand.syncProductList();
	
	jtown.expand.syncEvent();
});

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

jtown.expand.syncProductList = function(){
	$('.jt-home-expand-shop-products ul li').unbind('mouseover mouseout');
	$('.jt-home-expand-shop-products ul li').bind('mouseover mouseout',function(evnet){
		if(event.type == 'mouseover'){
			$(this).children('.jt-seller-expand-product-delete-tool').show();
		}else if(event.type == 'mouseout'){
			$(this).children('.jt-seller-expand-product-delete-tool').hide();
		}
	});
	
	$('.jt-seller-product-delete').unbind('click');
	$('.jt-seller-product-delete').bind('click', function(){
		//TODO 사진 삭제후 재조회(ajax X) Slide 변경어려움
		location.href= contextPath + 'seller/2';
	});
	
	$('.jt-home-expand-shop-products').unbind('mouseover mouseout');
	$('.jt-home-expand-shop-products').bind('mouseover mouseout', function(){
		if(event.type == 'mouseover'){
			$(this).children('.jt-seller-expand-product-insert-tool').show();
		}else if(event.type == 'mouseout'){
			$(this).children('.jt-seller-expand-product-insert-tool').hide();
		}
	});
};

jtown.expand.syncEvent = function(){
	
	$('#jt-seller-expand-event-first, #jt-seller-expand-event-second').unbind('mouseover mouseout');
	$('#jt-seller-expand-event-first, #jt-seller-expand-event-second').bind('mouseover mouseout', function(){
		if($(this).children('input').css('display') == 'none'){
			if(event.type == 'mouseover'){
				$(this).children('div').show();
			}else if(event.type == 'mouseout'){
				$(this).children('div').hide();
			}
		}
	});

	$('#jt-seller-expand-event-first div a').unbind('click');
	$('#jt-seller-expand-event-first div a').bind('click', function(){
		$('#jt-seller-expand-event-first').children('div').hide();
		$('#jt-seller-expand-event-first').children('input').show();
	});
	
	$('#jt-seller-expand-event-second div a').unbind('click');
	$('#jt-seller-expand-event-second div a').bind('click', function(){
		$('#jt-seller-expand-event-second').children('div').hide();
		$('#jt-seller-expand-event-second').children('input').show();
	});
};