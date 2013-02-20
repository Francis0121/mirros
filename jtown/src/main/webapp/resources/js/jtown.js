if (typeof jtown == 'undefined') {
	jtown = {};
}

if (typeof jtown.header == 'undefined') {
	jtown.header = {};
}

(function($) {
	$.fn.navHover = function(options) {
		
		options = $.extend({
			overlap : -10,
			speed : 500,
			reset : 1500,
			css : 'jt-header-hover'
		}, options);

		return this.each(function() {
			var nav = $(this), currentPageItem = $('#selected', nav), blob, reset;
			
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