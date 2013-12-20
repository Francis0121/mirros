$(function(){
	//~default Init
	$.setBrowserUrlHidden();
});
//.jt-app-contents-wrap


$.setBrowserUrlHidden = function(){
	window.addEventListener('load', function(){
	    document.body.style.height = (document.documentElement.clientHeight + 5) + 'px';
	    window.scrollTo(0, 1);
	}, false);
};

//~ set Menubar
$.setCategory = function(){
	var size = $('.jt-app-header-category:last li').size(); 
	var categoryPn = $('.jt-app-header-category:last').attr('data-category');
	$('.jt-app-header-category:last li a[data-cpn='+categoryPn+']').attr('id','jt-app-header-category-current');
};

$('body').on('tap', '.jt-app-header-category li', function(e){
	$.mobile.changePage( $(this).find('a').attr('data-url'), {
		transition: 'flip',
		type: 'post',
		reloadPage: true,
		reverse:false,
		data:{navFlag : $('.jt-app-item-content').attr('data-nav'), categoryPn : $('.jt-app-header-category:last').attr('data-category')}
	});
});


$('body').on('tap', '.jt-app-header-left-wrap', function(e){
	if($('.jt-app-header-left-wrap').attr('data-toggle') == '0'){
		$.titleMenuOpen(e);
	}else{
		$.titleMenuClose(e);
	}
});
$('body').on('tap','.jt-app-header-extend-menu-margin', function(e){
	$.titleMenuClose(e);
});

$.titleMenuOpen = function(e){
	$.eventMenuClose(e);
	$('.jt-app-header-extend-menu').height('100%');
	$('.jt-app-header-extend-menu-inner').css('box-shadow','0px 4px 4px 1px rgba(0,0,0,.33)').css('display','block');
	$('.jt-app-header-extend-menu-margin').height('100%');
	$('.jt-app-header-left-wrap').attr('data-toggle','1');
	$('.jt-app-header-arrow-down').attr('class', 'jt-app-header-arrow-up');
};
$.titleMenuClose = function(e){
	e.stopPropagation(e);
	e.preventDefault();
	$('.jt-app-header-extend-menu-inner').fadeOut(120);
	$('.jt-app-header-extend-menu').height('0');
	$('.jt-app-header-left-wrap').attr('data-toggle','0');
	$('.jt-app-header-search-result').css('display','none');
	$('.jt-app-search-item').html('');
	$('.jt-app-header-search').text('');
	$('.jt-app-header-arrow-up').attr('class', 'jt-app-header-arrow-down');
};

$('body').on('tap','.jt-app-header-right-wrap', function(e){
	if($('.jt-app-header-right-wrap').attr('data-toggle') == 0){
		$.eventMenuOpen(e);
	}else{
		$.eventMenuClose(e);
	}
});
$('body').on('tap','.jt-app-header-extend-event-menu-margin', function(e){
	$.eventMenuClose(e);
});

$.eventMenuOpen = function(e){
	$.titleMenuClose(e);
	$('body').css('overflow','hidden');
	$(document).delegate('.ui-page', 'scrollstart', false);
	$('.jt-app-header-extend-event-menu').width('100%');
	$('.jt-app-header-extend-event-menu-margin').width('20%');
	$('.jt-app-header-extend-event-menu-inner').width('80%').css('box-shadow','0px 7px 8px 3px rgba(0,0,0,.33)');
	$('.jt-app-header-right-wrap').attr('data-toggle','1');
	$('.jt-app-header-arrow-left').attr('class', 'jt-app-header-arrow-right');
};

$.eventMenuClose = function(e){
	e.stopPropagation();
	e.preventDefault();
	$('body').css('overflow','auto');
	$(document).delegate('.ui-page', 'scrollstart', true);
	$('.jt-app-header-extend-event-menu').width('0');
	$('.jt-app-header-extend-event-menu-inner').width('0').css('box-shadow','0px 7px 8px 3px rgba(0,0,0,.0)');
	$(document).delegate('.ui-content', 'scrollstart', true);
	$('body').css('overflow', 'auto');
	$('.jt-app-header-right-wrap').attr('data-toggle','0');
	$('.jt-app-header-arrow-right').attr('class', 'jt-app-header-arrow-left');

};

$.insertProductClickStatistic = function(productPn){
	$.post(contextPath+'/ajax/productClick.jt',{productPn : productPn}, function(data){});
};
$.insertEventClickStatistic = function(eventPn){
	$.post(contextPath+'/ajax/eventClick.jt',{eventPn : eventPn}, function(data){});
};


//~ search
$(function(){
	$('body').on('tap', '.jt-app-header-extend-menu-inner .ui-input-clear', function(){
		$('.jt-app-search-item').html('');
		//TODO 아이템 글씨도 사라지게 함
	});
	
	$('body').on('tap', '.jt-app-search-item li', function(){
		if($(this).index() == 0){
			if( $(this).attr('data-search-result') == 'all'){
				post(contextPath+'/app', {itemName : $(this).attr('data-search-name')});
			}
		}else{
			post(contextPath+'/app', {itemName : $(this).text()});
		}
	});
	
	$('body').on('keyup' ,'.jt-app-header-search', function(){
		var searchName = $('.jt-app-header-search:last').val(); 
		if(searchName.length > 1){
			$.post(contextPath + '/ajax/natural/appAutocomplete.jt', {searchName : searchName}, function(map){
				var jtownUsers = map.jtownUsers, interests = map.interests, productName = map.productName,  data = [];
				var size = productName.length;
				
				var html = '';
				if(size > 0){
					html += '<li data-search-result="all" data-search-name='+searchName+'>['+searchName+'] 이(가) 포함된 모든 상품</li>';
					for(var idx = 0; idx< size; idx++){
						html+= '<li>'+ productName[idx].name+'</li>';
					}
				}else{
					html += '<li data-search-result="0">검색결과가 없습니다.</li>';
				}
				$('.jt-app-header-search-result').css('display','block');
				$('.jt-app-search-item').html(html);
			});
		}else{
			$('.jt-app-search-item').html('');
		}
	});
});


$.changePageTransition = function(url, transition, reverse){
	$.mobile.changePage(contextPath+url, {
        allowSamePageTransition: true,
        transition: transition,
        reloadPage: true,
        reverse : reverse
    });
};
//~ footer move

$('body').on('tap', '.jt-app-footer-reply', function(){
	$('.jt-app-icon-reply-passive').addClass('jt-app-icon-reply-active').removeClass('jt-app-icon-reply-passive');
	$('.jt-app-icon-item-active').addClass('jt-app-icon-item-passive').removeClass('jt-app-icon-item-active');
	$('.jt-app-icon-like-active').addClass('jt-app-icon-like-passive').removeClass('jt-app-icon-like-active');
	$('.jt-app-icon-more-active').addClass('jt-app-icon-more-passive').removeClass('jt-app-icon-more-active');
	$('.jt-app-icon-text-active').removeClass('jt-app-icon-text-active');
	$(this).addClass('jt-app-icon-text-active');	
	var direction = true;
	if($.checkAppPage() || $.checkReplyPage()){
		direction = false;
	}
	$.changePageTransition('/app/reply', 'slide', direction);
});
$('body').on('tap', '.jt-app-footer-like', function(){
	$('.jt-app-icon-like-passive').addClass('jt-app-icon-like-active').removeClass('jt-app-icon-like-passive');
	$('.jt-app-icon-item-active').addClass('jt-app-icon-item-passive').removeClass('jt-app-icon-item-active');
	$('.jt-app-icon-reply-active').addClass('jt-app-icon-reply-passive').removeClass('jt-app-icon-reply-active');
	$('.jt-app-icon-more-active').addClass('jt-app-icon-more-passive').removeClass('jt-app-icon-more-active');
	$('.jt-app-icon-text-active').removeClass('jt-app-icon-text-active');
	$(this).addClass('jt-app-icon-text-active');
	var direction = false;
	if($.checkMorePage()){
		direction = true;
	}
	$.changePageTransition('/app/like', 'slide', direction);
});
$('body').on('tap', '.jt-app-footer-item', function(){
	$('.jt-app-icon-item-passive').addClass('jt-app-icon-item-active').removeClass('jt-app-icon-item-passive');
	$('.jt-app-icon-reply-active').addClass('jt-app-icon-reply-passive').removeClass('jt-app-icon-reply-active');
	$('.jt-app-icon-like-active').addClass('jt-app-icon-like-passive').removeClass('jt-app-icon-like-active');
	$('.jt-app-icon-more-active').addClass('jt-app-icon-more-passive').removeClass('jt-app-icon-more-active');
	$('.jt-app-icon-text-active').removeClass('jt-app-icon-text-active');
	$(this).addClass('jt-app-icon-text-active');
	var direction = true;
	if($.checkAppPage()){
		direction = false;
	}
	$.changePageTransition('/app', 'slide', direction);
	
});
$('body').on('tap', '.jt-app-footer-more', function(){
	$('.jt-app-icon-more-passive').addClass('jt-app-icon-more-active').removeClass('jt-app-icon-more-passive');
	$('.jt-app-icon-item-active').addClass('jt-app-icon-item-passive').removeClass('jt-app-icon-item-active');
	$('.jt-app-icon-reply-active').addClass('jt-app-icon-reply-passive').removeClass('jt-app-icon-reply-active');
	$('.jt-app-icon-like-active').addClass('jt-app-icon-like-passive').removeClass('jt-app-icon-like-active');
	$('.jt-app-icon-text-active').removeClass('jt-app-icon-text-active');
	$(this).addClass('jt-app-icon-text-active');
	$.changePageTransition('/app/more', 'slide', false);
});
$('body').on('tap', '.jt-app-footer-login', function(){
	$.changePageTransition('/app/login', 'pop');
});

