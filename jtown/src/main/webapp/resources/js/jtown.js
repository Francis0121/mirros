if (typeof jtown == 'undefined') {
	jtown = {};
}

if (typeof jtown.header == 'undefined') {
	jtown.header = {};
}

$(document).ready(function(){
	jtown.header.syncNavMove();
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
};

(function($) {
	$.fn.navHover = function(options) {
		
		options = $.extend({
			overlap : -10,
			speed : 500,
			reset : 1500,
			css : 'jt-header-hover'
		}, options);

		return this.each(function() {
			var nav = $(this), currentPageItem = $('#selected', nav), blob, reset=0;
			
			$('<li class="'+options.css+'"></li>').css({
				width 			: currentPageItem.outerWidth(),
				height 			: currentPageItem.outerHeight()+ options.overlap,
				left 			: currentPageItem.position().left,
				top 			: currentPageItem.position().top- options.overlap / 2,
				backgroundColor : options.color	
			}).appendTo(this);

			blob = $('.'+options.css, nav);

			$('li:not(.'+options.css+')', nav).hover(
				function() {
					// mouse over
					clearTimeout(reset);
					blob.animate({
						left 		: $(this).position().left,
						width 		: $(this).width()
					}, {
						duration 	: options.speed,
						queue 		: false
					});
				}, function() {
					// mouse out
					reset = setTimeout(function() {
						blob.animate({
							width : currentPageItem.outerWidth(),
							left : currentPageItem.position().left
						}, options.speed);
					}, options.reset);
				});
			});
	};
})(jQuery);