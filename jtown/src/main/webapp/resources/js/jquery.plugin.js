/**
 * smartPopup
 *
 * Copyright (c) 2011 Cho Yong Gu (@inidu2)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Copyright (c) 2013 Francis
 * Update SmartPop
 */ 
(function($) {
    var ie     	= $.browser.msie && ($.browser.version < 9);
    
    $.smartPop = {
        isInstall : false,
        opts : {},
        open : function(options) {
            this.opts = $.extend({}, $.smartPop.defaults, options);
            this.install();
            this.resize();

            $('html').css({ display: 'block', overflow: 'hidden', overflowY: 'hidden'});
         
            if(this.opts.log) $('#smartPop_log').show();
        },
        resize : function() {
            this.log(this.opts.width + ' x ' + this.opts.height);
            this.log('background : ' + this.opts.background);
            this.log('closeMargin : ' + this.opts.closeMargin);
            this.log('opacity : ' + this.opts.opacity);
            this.log('');

            // 기본 설정
            $('#smartPop_close').css({ top: this.opts.closeMargin + 'px', right: this.opts.closeMargin + 'px' });
            $('#smartPop_container').width(this.opts.width);
            $('#smartPop_close_wrap').width(this.opts.width);
            this.resizeHeight(this.opts.height);
        },
        resizeHeight : function(h) {
        	var innerH  = window.innerHeight;
        	
            this.log('resizeHeight : ' + h);
            if(ie) {
                $('body').attr({ scroll: 'no' }); // ie7에서 overflow 적용안됨 
                innerH = document.documentElement.clientHeight;
            }

            // 위치설정
            if(this.opts.position == 'center') {
                var t;
                t = (h < innerH) ? (innerH - h) / 2 : 10;
                $('#smartPop_container').css({ marginLeft: 'auto', marginTop: t + 'px' });
            } else {
                $('#smartPop_container').css({ marginLeft: this.opts.left + 'px', marginTop: this.opts.top + 'px' });
            }

            // 높이설정
            $('#smartPop_container').height(h);
            
            $('#smartPop_content').html(this.opts.html).height(h).show();
            
            $('#smartPop_loading').hide();
            this.log('');
        },
        install : function() {
            if(this.isInstall == false) {
                var body                    = $('body');
                var smartPop_overlay        = $('<div />').attr('id', 'smartPop_overlay');
                var smartPop                = $('<div />').attr('id', 'smartPop');
                var smartPop_container      = $('<div />').attr('id', 'smartPop_container');
                var smartPop_close_wrap     = $('<div />').attr('id', 'smartPop_close_wrap');
                var smartPop_close          = $('<div />').attr('id', 'smartPop_close');
                var smartPop_loading        = $('<div />').attr('id', 'smartPop_loading');
                var smartPop_content        = $('<div />').attr('id', 'smartPop_content');

                smartPop_close_wrap.append(smartPop_close).appendTo(smartPop_container);
                smartPop_container.append(smartPop_loading).append(smartPop_content).appendTo(smartPop);
                smartPop.append($('<div />').attr('id', 'smartPop_log'));
                body.append(smartPop_overlay).append(smartPop);
                this.isInstall = true;
                $('#smartPop').hide();
            } 
            
            $('#smartPop').fadeIn(500);
            $('#smartPop_overlay').fadeIn(500);

            // 닫기 버튼 설정
            if(this.opts.closeImg != undefined) {
                $('#smartPop_close').css({ width:this.opts.closeImg.width + 'px', height:this.opts.closeImg.height + 'px', backgroundImage:'url(' + this.opts.closeImg.src + ')'});
            }

            if(this.opts.bodyClose) {
            	$('body').unbind('click');
                $('body').bind('click', function(event) {
                    if (!event) event = window.event;
                    var target = (event.target) ? event.target : event.srcElement;
                    event.stopPropagation(); // 이벤트 버블링 전파를 막음
                	if(target.id == 'smartPop') { 
                    	$.smartPop.close(); 
                    }
                });
            }

            $('#smartPop_close').click(function() {
                $.smartPop.close();
            });
        },
        close : function() {
            if(ie) {
                $('body').attr({ scroll: 'yes' });
            }
            $('html').css({ marginRight: 0, display: '', overflowY: 'scroll'});
            
            var options = {};
            
            if ( this.opts.effect === "transfer" ) {
            	if(this.opts.target)
            	options = { to: this.opts.target , className: "ui-effects-transfer" };
            	$('#smartPop').hide();
            } 
            
            if(this.opts.effect === null){
            	$('#smartPop').hide();
            	$('#smartPop_overlay').fadeOut(500);  
            }else{
            	$('#smartPop').effect( this.opts.effect, options, 250);
            	$('#smartPop_overlay').fadeOut(500);            	
            }
            this.opts.categoryFn();
        },
        log : function(msg) {
            var log = $('#smartPop_log').html();
            $('#smartPop_log').html(msg + '<br />' + log);
        }
    };
    
    $.smartPop.defaults = {
        position    : 'center',
        left        : 310,
        top         : 10,
        bodyClose   : true,
        closeMargin : 0,
        closeImg    : {width:0, height: 0, src: contextPath + 'resources/images/jt-btn-close.png'},
        opacity     : 1,
        width       : 720,
        height      : 500,
        html        : '',
        log         : false,
        categoryFn	: function(){},
        effect		: 'puff'
    };
})(jQuery);
/**
 * NavHoverSlide
 * 
 * Copyright (c) 2013 Francis
 * 
 */
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