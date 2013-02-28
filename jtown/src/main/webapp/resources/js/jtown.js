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
	
//	$('.jt-header-nav-all').children('li').unbind('click');
//	$('.jt-header-nav-all').children('li').bind('click', function(){
//		var left = Number($(this).position().left) - 1;
//		$('.jt-header-nav-all').animate({
//			left : '-'+left+'px'
//		}, 500);	
//	});
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
	var $parent = me.parents('.jt-header-nav-down'),
		cpn = $parent.attr('data-cpn'),
		spn = $parent.attr('data-spn');
	var url = contextPath + 'ajax/navInterestDelete.jt',
		json = {	'categoryPn'	:	cpn,
					'sectionPn'		:	spn		};
	
	$.postJSON(url, json, function(){
		$parent.remove();		
	});
	
};

if (typeof jtown.home == 'undefined') {
	jtown.home = {};
}

jtown.home.clickShop = function(spn, href){
	var url = contextPath + 'ajax/clickShop.jt',
		json = {	'pn' :	spn	};
	
	$.postJSON(url, json, function(view){
		if(nullValueCheck(view)){
			window.open('http://'+href);			
		}else{
			$('#view-expand-'+spn).html(view);
			$('#view-'+spn).html(view);
		}
	});
};

jtown.home.clickLove = function(spn){
	var url = contextPath + 'ajax/clickLove.jt',
	json = {	'sellerPn'	:	spn};

	$.postJSON(url, json, function(count){
		if(nullValueCheck(count.message)){
			$('#love-expand-'+spn).html(count.count);
			$('#love-'+spn).html(count.count);
		}else{
			alert(count.message);
		}
	});
};

