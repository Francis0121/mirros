/*
 **	Anderson Ferminiano
 **	contato@andersonferminiano.com -- feel free to contact me for bugs or new implementations.
 **	jQuery ScrollPagination
 **	28th/March/2011
 **	http://andersonferminiano.com/jqueryscrollpagination/
 **	You may use this script for free, but keep my credits.
 **	Thank you.
 */

(function($) {

	$.fn.scrollPagination = function(options) {
		var opts = $.extend($.fn.scrollPagination.defaults, options);
		var target = opts.scrollTarget;
		if (target == null) {
			target = obj;
		}
		opts.scrollTarget = target;

		return this.each(function() {
			$.fn.scrollPagination.init($(this), opts);
		});
	};

	$.fn.stopScrollPagination = function() {
		return this.each(function() {
			$(this).attr('scrollPagination', 'disabled');
		});
	};

	$.fn.scrollPagination.loadContent = function(obj, opts) {
		var target = opts.scrollTarget;
		var mayLoadContent = $(target).scrollTop() + opts.heightOffset >= $(document).height() - $(target).height();
		if (mayLoadContent) {
			if (opts.beforeLoad != null) {
				opts.beforeLoad();
			}
			$(obj).children().attr('rel', 'loaded');
			var url = opts.contentPage;
			var json = opts.contentData;
			var currentPage = $('#__current_page');
			json.currentPage = currentPage.val();
			
			if(json.currentPage <= opts.maxPage ){
				$.postJSON(url, json, function(data){
					if(data){
						opts.successCallback(data);
						currentPage.val(Number(json.currentPage)+1);
						
						var objectsRendered 	= $(obj).children('[rel!=loaded]');
						if (opts.afterLoad != null) {
							opts.afterLoad(objectsRendered);
						}
						$container.masonry('reload');
					}else{
						opts.errorCallback;
					}
				});
			}
		}
	};

	$.fn.scrollPagination.init = function(obj, opts) {
		var target = opts.scrollTarget;
		$(obj).attr('scrollPagination', 'enabled');
		$(obj).after('<input type="hidden" id="__current_page" value="2"/>');

		$(target).scroll(function(event) {
			if ($(obj).attr('scrollPagination') == 'enabled') {
				$.fn.scrollPagination.loadContent(obj, opts);
			} else {
				event.stopPropagation();
			}
		});
		$.fn.scrollPagination.loadContent(obj, opts);
	};

	$.fn.scrollPagination.defaults = {
		'contentPage' : null,
		'contentData' : {},
		'beforeLoad' : null,
		'afterLoad' : null,
		'scrollTarget' : null,
		'heightOffset' : 0,
		'successCallback' : function(data){
			alert(data);
			return data;
		},
		'errorCallback' : function(){
			alert('ERROR');
		},
		'maxPage': 1
	};
})(jQuery);