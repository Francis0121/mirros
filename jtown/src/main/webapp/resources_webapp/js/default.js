$(function(){
	//~default Init
	window.addEventListener('load', function(){
	    document.body.style.height = (document.documentElement.clientHeight + 5) + 'px';
	    window.scrollTo(0, 1);
	}, false);
	$.setHeightFull();
	$(document).on("pageshow", function () {
		$.setHeightFull();
	});
});

$.setHeightFull = function(){
	scroll(0, 0);
	var header = $("div[data-role='header']:visible");
	var footer = $("div[data-role='footer']:visible");
	var content = $("div[data-role='content']:visible");
	var viewport_height = $(window).height();

	var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
	content_height -= (content.outerHeight() - content.height());
	$("div[data-role='content']").css('min-height',content_height);
};

$.setCategory = function(){
	var cIdx = $('.jt-app-header-category').length-1;
	var size = $('.jt-app-header-category:eq('+cIdx+') li').size(); 
	for(var idx =0; idx< size ; idx++ ){
		if($('.jt-app-header-category:eq('+cIdx+') li a:eq('+idx+')')[0].href == document.URL){    
			$('.jt-app-header-category:eq('+cIdx+') li a:eq('+idx+')')[0].id = 'jt-app-header-category-current'; 
		}
	}
	if('navFlag=H' == document.URL.substring(document.URL.length-9,document.URL.length)){
		$('.jt-app-header-category:eq('+cIdx+') li a:eq(0)')[0].id = 'jt-app-header-category-current';
	}
};

$('body').on('swipedown','.jt-app-header', function(){
	$.titleMenuOpen();
});
$('body').on('click', '.jt-app-header-left-wrap', function(){
	if($('.jt-app-header-left-wrap').attr('data-toggle') == '0'){
		$.titleMenuOpen();
	}else{
		$.titleMenuClose();
	}
});
$('body').on('click','.jt-app-header-extend-menu-margin', function(){
	$.titleMenuClose();
});

$.titleMenuOpen = function(){
	$('.jt-app-header-extend-menu').height('100%');
	$('.jt-app-header-extend-menu-inner').css('box-shadow','0px 4px 4px 1px rgba(0,0,0,.33)').css('display','block');
	$('.jt-app-header-extend-menu-margin').height('100%');
	$('.jt-app-header-left-wrap').attr('data-toggle','1');
	$('.jt-app-header-arrow-down').attr('class', 'jt-app-header-arrow-up');
};
$.titleMenuClose = function(){
	$('.jt-app-header-extend-menu-inner').fadeOut(120);
	$('.jt-app-header-extend-menu').height('0');
	$('.jt-app-header-left-wrap').attr('data-toggle','0');
	$('.jt-app-header-search-result').css('display','none');
	$('.jt-app-search-item').html('');
	$('.jt-app-header-search').text('');
	$('.jt-app-header-arrow-up').attr('class', 'jt-app-header-arrow-down');
};

$('body').on('click','.jt-app-header-right-wrap', function(){
	if($('.jt-app-header-right-wrap').attr('data-toggle') == 0){
		$.eventMenuOpen();
	}else{
		$.eventMenuClose();
	}
});
$('body').on('click','.jt-app-header-extend-event-menu-margin', function(){
	$.eventMenuClose();
});

$.eventMenuOpen = function(){
	$('body').css('overflow','hidden');
	$(document).delegate('.ui-page', 'scrollstart', false);
	$('.jt-app-header-extend-event-menu').width('100%');
	$('.jt-app-header-extend-event-menu-margin').width('20%');
	$('.jt-app-header-extend-event-menu-inner').width('80%').css('box-shadow','0px 7px 8px 3px rgba(0,0,0,.33)');
	$('.jt-app-header-right-wrap').attr('data-toggle','1');
	$('.jt-app-header-arrow-left').attr('class', 'jt-app-header-arrow-right');
};

$.eventMenuClose = function(){
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
	$('body').on('click', '.jt-app-header-extend-menu-inner .ui-input-clear', function(){
		$('.jt-app-search-item').html('');
	});
	
	$('body').on('click', '.jt-app-search-item li', function(){
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

$('body').on('click', '.jt-app-footer-reply', function(){
	var direction = true;
	if($.checkAppPage() || $.checkReplyPage()){
		direction = false;
	}
	$.changePageTransition('/app/reply', 'slide', direction);
});
$('body').on('click', '.jt-app-footer-like', function(){
	var direction = false;
	if($.checkMorePage()){
		direction = true;
	}
	$.changePageTransition('/app/like', 'slide', direction);
});
$('body').on('click', '.jt-app-footer-item', function(){
	var direction = true;
	if($.checkAppPage()){
		direction = false;
	}
	$.changePageTransition('/app', 'slide', direction);
});
$('body').on('click', '.jt-app-footer-more', function(){
	$.changePageTransition('/app/more', 'slide', false);
});
$('body').on('click', '.jt-app-footer-login', function(){
	$.changePageTransition('/app/login', 'pop');
});
