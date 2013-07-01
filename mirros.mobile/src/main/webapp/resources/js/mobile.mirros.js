$(function(){
	
	$('.mm-home-nav-title').toggle(function(){
		$('.mm-home-sub-nav').hide();
		$(this).parents('li').find('.mm-home-sub-nav').slideDown();
	}, function(){
		$(this).parents('li').find('.mm-home-sub-nav').slideUp();
	});
	
	mobile.homeSync();
});

mobile.homeSync = function(){
	$('.mm-home-love').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');
		var url = contextPath + '/ajax/clickLove.jt', 
			json = { sellerPn : spn };
		
		$.postJSON(url, json, function(count) {
			if (!nullValueCheck(count.message)) {
				if(count.message == '1'){				
					location.href = contextPath+'/login';
				}else{
					alert('판매자는 불가능합니다');
				}
			} else {
				var crudType = count.crudType;
				var background = parent.find('.mm-love-click-background');
				if (crudType == 'insert') {
					background.addClass('mm-love-animation');
				} else if (crudType == 'delete') {
					background.removeClass('mm-love-animation');
				}
			}
		});
	});
	
	$('.mm-home-article-header>a').unbind('click').bind('click',function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');
		
		$.postJSON(contextPath + '/ajax/goHome.jt', { sellerPn : spn }, function() { });
	});
	
	$('.mm-home-mainImage').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');

		location.href= contextPath + '/mir/'+spn;
	});
	
	$('.mm-home-comment').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');

		location.href= contextPath + '/mir/'+spn;
	});
};