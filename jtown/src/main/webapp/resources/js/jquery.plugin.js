/**
 * smartPopup
 * 
 * Copyright (c) 2011 Cho Yong Gu (@inidu2) Dual licensed under the MIT and GPL
 * licenses: http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Copyright (c) 2013 Francis Update SmartPop
 */
(function($) {
	var ie = $.browser.msie && ($.browser.version < 9);

	$.smartPop = {
		isInstall : false,
		opts : {},
		open : function(options) {
			this.opts = $.extend({}, $.smartPop.defaults, options);
			this.install();
			this.resize();

			$('html').css({
				display : 'block',
				overflow : 'hidden',
				overflowY : 'hidden'
			});

			if (this.opts.log)
				$('#smartPop_log').show();
		},
		resize : function() {
			this.log(this.opts.width + ' x ' + this.opts.height);
			this.log('background : ' + this.opts.background);
			this.log('closeMargin : ' + this.opts.closeMargin);
			this.log('opacity : ' + this.opts.opacity);
			this.log('');

			// 기본 설정
			$('#smartPop_close').css({
				top : this.opts.closeMargin + 'px',
				right : this.opts.closeMargin + 'px'
			});
			$('#smartPop_container').width(this.opts.width);
			$('#smartPop_close_wrap').width(this.opts.width);
			this.resizeHeight(this.opts.height);
		},
		resizeHeight : function(h) {
			var innerH = window.innerHeight;

			this.log('resizeHeight : ' + h);
			if (ie) {
				$('body').attr({
					scroll : 'no'
				}); // ie7에서 overflow 적용안됨
				innerH = document.documentElement.clientHeight;
			}

			// 위치설정
			if (this.opts.position == 'center') {
				var t;
				t = (h < innerH) ? (innerH - h) / 2 : 10;
				$('#smartPop_container').css({
					marginLeft : 'auto',
					marginTop : t + 'px'
				});
			} else {
				$('#smartPop_container').css({
					marginLeft : this.opts.left + 'px',
					marginTop : this.opts.top + 'px'
				});
			}

			// 높이설정
			$('#smartPop_container').height(h);

			$('#smartPop_content').html(this.opts.html).height(h).show();

			$('#smartPop_loading').hide();
			this.log('');
		},
		install : function() {
			if (this.isInstall == false) {
				var body = $('body');
				var smartPop_overlay = $('<div />').attr('id',
						'smartPop_overlay');
				var smartPop = $('<div />').attr('id', 'smartPop');
				var smartPop_container = $('<div />').attr('id',
						'smartPop_container');
				var smartPop_close_wrap = $('<div />').attr('id',
						'smartPop_close_wrap');
				var smartPop_close = $('<div />').attr('id', 'smartPop_close');
				var smartPop_loading = $('<div />').attr('id',
						'smartPop_loading');
				var smartPop_content = $('<div />').attr('id',
						'smartPop_content');

				smartPop_close_wrap.append(smartPop_close).appendTo(
						smartPop_container);
				smartPop_container.append(smartPop_loading).append(
						smartPop_content).appendTo(smartPop);
				smartPop.append($('<div />').attr('id', 'smartPop_log'));
				body.append(smartPop_overlay).append(smartPop);
				this.isInstall = true;
				$('#smartPop').hide();
			}

			$('#smartPop').fadeIn(500);
			$('#smartPop_overlay').fadeIn(500);

			// 닫기 버튼 설정
			if (this.opts.closeImg != undefined) {
				$('#smartPop_close').css({
					width : this.opts.closeImg.width + 'px',
					height : this.opts.closeImg.height + 'px',
					backgroundImage : 'url(' + this.opts.closeImg.src + ')'
				});
			}

			if (this.opts.bodyClose) {
				$('body').unbind('click');
				$('body').bind(
						'click',
						function(event) {
							if (!event)
								event = window.event;
							var target = (event.target) ? event.target
									: event.srcElement;
							event.stopPropagation(); // 이벤트 버블링 전파를 막음
							if (target.id == 'smartPop') {
								$.smartPop.close();
							}
						});
			}

			$('#smartPop_close').click(function() {
				$.smartPop.close();
			});
		},
		close : function() {
			if (ie) {
				$('body').attr({
					scroll : 'yes'
				});
			}
			$('html').css({
				marginRight : 0,
				display : '',
				overflowY : 'scroll'
			});

			var options = {};

			if (this.opts.effect === "transfer") {
				if(nullValueCheck($(this.opts.target).html()))
					this.opts.effect = null;
				
				if (this.opts.target)
					options = {
						to : this.opts.target,
						className : "ui-effects-transfer"
					};
				jtown.expand.show = false;
				$('#smartPop').hide();
			}

			if (this.opts.effect === null) {
				sessionStorage.removeItem('productPn');
				sessionStorage.removeItem('eventPn');
				sessionStorage.removeItem('spn');
				sessionStorage.removeItem('productUrl');
				sessionStorage.removeItem('eventUrl');
				jtown.login.loginOff();
				jtown.login.joinOff();
				$('#smartPop').hide();
				$('#smartPop_overlay').fadeOut(500);
			} else {
				
				$('#smartPop').effect(this.opts.effect, options, 250);
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
		position : 'center',
		left : 310,
		top : 10,
		bodyClose : true,
		closeMargin : 0,
		closeImg : {
			width : 0,
			height : 0,
			src : contextPath + 'resources/images/jt-btn-close.png'
		},
		opacity : 1,
		width : 720,
		height : 500,
		html : '',
		log : false,
		categoryFn : function() {
		},
		effect : 'puff'
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

		return this
				.each(function() {
					var nav = $(this), currentPageItem = $('#selected', nav), blob, reset = 0;

					$('<li class="' + options.css + '"></li>').css(
							{
								width : currentPageItem.outerWidth(),
								height : currentPageItem.outerHeight()
										+ options.overlap,
								left : currentPageItem.position().left,
								top : currentPageItem.position().top
										- options.overlap / 2,
								backgroundColor : options.color
							}).appendTo(this);

					blob = $('.' + options.css, nav);

					$('li:not(.' + options.css + ')', nav).hover(function() {
						// mouse over
						clearTimeout(reset);
						blob.animate({
							left : $(this).position().left,
							width : $(this).width()
						}, {
							duration : options.speed,
							queue : false
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

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(window, document, $) {

	var isInputSupported = 'placeholder' in document.createElement('input'),
	    isTextareaSupported = 'placeholder' in document.createElement('textarea'),
	    prototype = $.fn,
	    valHooks = $.valHooks,
	    hooks,
	    placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);
				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);
				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != document.activeElement) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		isInputSupported || (valHooks.input = hooks);
		isTextareaSupported || (valHooks.textarea = hooks);

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {},
		    rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this,
		    $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == document.activeElement && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement,
		    input = this,
		    $input = $(input),
		    $origInput = $input,
		    id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': true,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

}(this, document, jQuery));

/*
 * jquery.jqplot
 */
(function($) {  
 
    $.jqplot.DateAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.DateAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.DateAxisRenderer.prototype.constructor = $.jqplot.DateAxisRenderer;
    
    $.jqplot.DateTickFormatter = function(format, val) {
        if (!format) {
            format = '%Y/%m/%d';
        }
        return Date.create(val).strftime(format);
    };
    
    $.jqplot.DateAxisRenderer.prototype.init = function(options){
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        // this.tickRenderer = $.jqplot.AxisTickRenderer;
        // this.labelRenderer = $.jqplot.AxisLabelRenderer;
        this.tickOptions.formatter = $.jqplot.DateTickFormatter;
        this.daTickInterval = null;
        this._daTickInterval = null;
        $.extend(true, this, options);
        var db = this._dataBounds;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s.data;
            var pd = s._plotData;
            var sd = s._stackData;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    d[j][0] = Date.create(d[j][0]).getTime();
                    pd[j][0] = Date.create(d[j][0]).getTime();
                    sd[j][0] = Date.create(d[j][0]).getTime();
                    if (d[j][0] < db.min || db.min == null) {
                        db.min = d[j][0];
                    }
                    if (d[j][0] > db.max || db.max == null) {
                        db.max = d[j][0];
                    }
                }              
                else {
                    d[j][1] = Date.create(d[j][1]).getTime();
                    pd[j][1] = Date.create(d[j][1]).getTime();
                    sd[j][1] = Date.create(d[j][1]).getTime();
                    if (d[j][1] < db.min || db.min == null) {
                        db.min = d[j][1];
                    }
                    if (d[j][1] > db.max || db.max == null) {
                        db.max = d[j][1];
                    }
                }              
            }
        }
    };
    
    // called with scope of an axis
    $.jqplot.DateAxisRenderer.prototype.reset = function() {
        this.min = this._min;
        this.max = this._max;
        this.tickInterval = this._tickInterval;
        this.numberTicks = this._numberTicks;
        this.daTickInterval = this._daTickInterval;
        // this._ticks = this.__ticks;
    };
    
    $.jqplot.DateAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0; i<userTicks.length; i++){
                var ut = userTicks[i];
                var t = new this.tickRenderer(this.tickOptions);
                if (ut.constructor == Array) {
                    t.value = Date.create(ut[0]).getTime();
                    t.label = ut[1];
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(t.value, this.name);
                    this._ticks.push(t);
                }
                
                else {
                    t.value = Date.create(ut).getTime();
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(t.value, this.name);
                    this._ticks.push(t);
                }
            }
            this.numberTicks = userTicks.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks-1].value;
            this.daTickInterval = [(this.max - this.min) / (this.numberTicks - 1)/1000, 'seconds'];
        }
        
        // we don't have any ticks yet, let's make some!
        else {
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
            
            // if min, max and number of ticks specified, user can't specify interval.
            if (this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null;
            }
            
            // if user specified a tick interval, convert to usable.
            if (this.tickInterval != null)
            {
                // if interval is a number or can be converted to one, use it.
                // Assume it is in SECONDS!!!
                if (Number(this.tickInterval)) {
                    this.daTickInterval = [Number(this.tickInterval), 'seconds'];
                }
                // else, parse out something we can build from.
                else if (typeof this.tickInterval == "string") {
                    var parts = this.tickInterval.split(' ');
                    if (parts.length == 1) {
                        this.daTickInterval = [1, parts[0]];
                    }
                    else if (parts.length == 2) {
                        this.daTickInterval = [parts[0], parts[1]];
                    }
                }
            }
        
            min = ((this.min != null) ? Date.create(this.min).getTime() : db.min);
            max = ((this.max != null) ? Date.create(this.max).getTime() : db.max);
            
            // if min and max are same, space them out a bit
            if (min == max) {
                var adj = 24*60*60*500;  // 1/2 day
                min -= adj;
                max += adj;
            }

            var range = max - min;
            var rmin, rmax;
        
            rmin = (this.min != null) ? Date.create(this.min).getTime() : min - range/2*(this.padMin - 1);
            rmax = (this.max != null) ? Date.create(this.max).getTime() : max + range/2*(this.padMax - 1);
            this.min = rmin;
            this.max = rmax;
            range = this.max - this.min;
    
            if (this.numberTicks == null){
                // if tickInterval is specified by user, we will ignore computed maximum.
                // max will be equal or greater to fit even # of ticks.
                if (this.daTickInterval != null) {
                    var nc = Date.create(this.max).diff(this.min, this.daTickInterval[1], true);
                    this.numberTicks = Math.ceil(nc/this.daTickInterval[0]) +1;
                    // this.max = Date.create(this.min).add(this.numberTicks-1, this.daTickInterval[1]).getTime();
                    this.max = Date.create(this.min).add((this.numberTicks-1) * this.daTickInterval[0], this.daTickInterval[1]).getTime();
                }
                else if (dim > 200) {
                    this.numberTicks = parseInt(3+(dim-200)/100, 10);
                }
                else {
                    this.numberTicks = 2;
                }
            }
    
            if (this.daTickInterval == null) {
                this.daTickInterval = [range / (this.numberTicks-1)/1000, 'seconds'];
            }
            for (var i=0; i<this.numberTicks; i++){
                var min = Date.create(this.min);
                tt = min.add(i*this.daTickInterval[0], this.daTickInterval[1]).getTime();
                var t = new this.tickRenderer(this.tickOptions);
                // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
                if (!this.showTicks) {
                    t.showLabel = false;
                    t.showMark = false;
                }
                else if (!this.showTickMarks) {
                    t.showMark = false;
                }
                t.setTick(tt, this.name);
                this._ticks.push(t);
            }
        }
        if (this._daTickInterval == null) {
            this._daTickInterval = this.daTickInterval;    
        }
    };
   
})(jQuery);

(function($) {
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
    
    $.jqplot.Highlighter = function(options) {
        // Group: Properties
        //
        //prop: show
        // true to show the highlight.
        this.show = $.jqplot.config.enablePlugins;
        // prop: markerRenderer
        // Renderer used to draw the marker of the highlighted point.
        // Renderer will assimilate attributes from the data point being highlighted,
        // so no attributes need set on the renderer directly.
        // Default is to turn off shadow drawing on the highlighted point.
        this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
        // prop: showMarker
        // true to show the marker
        this.showMarker  = true;
        // prop: lineWidthAdjust
        // Pixels to add to the lineWidth of the highlight.
        this.lineWidthAdjust = 2.5;
        // prop: sizeAdjust
        // Pixels to add to the overall size of the highlight.
        this.sizeAdjust = 5;
        // prop: showTooltip
        // Show a tooltip with data point values.
        this.showTooltip = true;
        // prop: tooltipLocation
        // Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.tooltipLocation = 'nw';
        // prop: tooltipFade
        // true = fade in/out tooltip, flase = show/hide tooltip
        this.fadeTooltip = true;
        // prop: tooltipFadeSpeed
        // 'slow', 'def', 'fast', or number of milliseconds.
        this.tooltipFadeSpeed = "fast";
        // prop: tooltipOffset
        // Pixel offset of tooltip from the highlight.
        this.tooltipOffset = 2;
        // prop: tooltipAxes
        // Which axes to display in tooltip, 'x', 'y' or 'both', 'xy' or 'yx'
        // 'both' and 'xy' are equivalent, 'yx' reverses order of labels.
        this.tooltipAxes = 'both';
        // prop; tooltipSeparator
        // String to use to separate x and y axes in tooltip.
        this.tooltipSeparator = ', ';
        // prop: useAxesFormatters
        // Use the x and y axes formatters to format the text in the tooltip.
        this.useAxesFormatters = true;
        // prop: tooltipFormatString
        // sprintf format string for the tooltip.
        // Uses Ash Searle's javascript sprintf implementation
        // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
        // See http://perldoc.perl.org/functions/sprintf.html for reference.
        // Additional "p" and "P" format specifiers added by Chris Leonello.
        this.tooltipFormatString = '%.5P';
        // prop: formatString
        // alternative to tooltipFormatString
        // will format the whole tooltip text, populating with x, y values as
        // indicated by tooltipAxes option.  So, you could have a tooltip like:
        // 'Date: %s, number of cats: %d' to format the whole tooltip at one go.
        // If useAxesFormatters is true, values will be formatted according to
        // Axes formatters and you can populate your tooltip string with 
        // %s placeholders.
        this.formatString = null;
        // prop: yvalues
        // Number of y values to expect in the data point array.
        // Typically this is 1.  Certain plots, like OHLC, will
        // have more y values in each data point array.
        this.yvalues = 1;
        this._tooltipElem;
        this.isHighlighting = false;

        $.extend(true, this, options);
    };
    
    // axis.renderer.tickrenderer.formatter
    
    // called with scope of plot
    $.jqplot.Highlighter.init = function (target, data, opts){
        var options = opts || {};
        // add a highlighter attribute to the plot
        this.plugins.highlighter = new $.jqplot.Highlighter(options.highlighter);
    };
    
    // called within scope of series
    $.jqplot.Highlighter.parseOptions = function (defaults, options) {
        this.showHighlight = true;
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.Highlighter.postPlotDraw = function() {
        this.plugins.highlighter.highlightCanvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding, 'jqplot-highlight-canvas', this._plotDimensions));
        var hctx = this.plugins.highlighter.highlightCanvas.setContext();
        
        var p = this.plugins.highlighter;
        p._tooltipElem = $('<div class="jqplot-highlighter-tooltip" style="position:absolute;display:none"></div>');
        this.target.append(p._tooltipElem);
    };
    
    $.jqplot.preInitHooks.push($.jqplot.Highlighter.init);
    $.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Highlighter.parseOptions);
    $.jqplot.postDrawHooks.push($.jqplot.Highlighter.postPlotDraw);
    
    function draw(plot, neighbor) {
        var hl = plot.plugins.highlighter;
        var s = plot.series[neighbor.seriesIndex];
        var smr = s.markerRenderer;
        var mr = hl.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + hl.lineWidthAdjust;
        mr.size = smr.size + hl.sizeAdjust;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var newrgb = [rgba[0], rgba[1], rgba[2]];
        var alpha = (rgba[3] >= 0.6) ? rgba[3]*0.6 : rgba[3]*(2-rgba[3]);
        mr.color = 'rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+alpha+')';
        mr.init();
        mr.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], hl.highlightCanvas._ctx);
    }
    
    function showTooltip(plot, series, neighbor) {
        // neighbor looks like: {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]}
        // gridData should be x,y pixel coords on the grid.
        // add the plot._gridPadding to that to get x,y in the target.
        var hl = plot.plugins.highlighter;
        var elem = hl._tooltipElem;
        if (hl.useAxesFormatters) {
            var xf = series._xaxis._ticks[0].formatter;
            var yf = series._yaxis._ticks[0].formatter;
            var xfstr = series._xaxis._ticks[0].formatString;
            var yfstr = series._yaxis._ticks[0].formatString;
            var str;
            var xstr = xf(xfstr, neighbor.data[0]);
            var ystrs = [];
            for (var i=1; i<hl.yvalues+1; i++) {
                ystrs.push(yf(yfstr, neighbor.data[i]));
            }
            if (hl.formatString) {
                switch (hl.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        ystrs.unshift(xstr);
                        ystrs.unshift(hl.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'yx':
                        ystrs.push(xstr);
                        ystrs.unshift(hl.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'x':
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, [hl.formatString, xstr]);
                        break;
                    case 'y':
                        ystrs.unshift(hl.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    default: // same as xy
                        ystrs.unshift(xstr);
                        ystrs.unshift(hl.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                } 
            }
            else {
                switch (hl.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += hl.tooltipSeparator + ystrs[i];
                        }
                        break;
                    case 'yx':
                        str = '';
                        for (var i=0; i<ystrs.length; i++) {
                            str += ystrs[i] + hl.tooltipSeparator;
                        }
                        str += xstr;
                        break;
                    case 'x':
                        str = xstr;
                        break;
                    case 'y':
                        str = '';
                        for (var i=0; i<ystrs.length; i++) {
                            str += ystrs[i] + hl.tooltipSeparator;
                        }
                        break;
                    default: // same as 'xy'
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += hl.tooltipSeparator + ystrs[i];
                        }
                        break;
                    
                }                
            }
        }
        else {
            var str;
            if (hl.tooltipAxes == 'both' || hl.tooltipAxes == 'xy') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]) + hl.tooltipSeparator + $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]);
            }
            else if (hl.tooltipAxes == 'yx') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]) + hl.tooltipSeparator + $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]);
            }
            else if (hl.tooltipAxes == 'x') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]);
            }
            else if (hl.tooltipAxes == 'y') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]);
            } 
        }
        elem.html(str);
        var gridpos = {x:neighbor.gridData[0], y:neighbor.gridData[1]};
        var ms = 0;
        var fact = 0.707;
        if (series.markerRenderer.show == true) { 
            ms = (series.markerRenderer.size + hl.sizeAdjust)/2;
        }
        switch (hl.tooltipLocation) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - ms;
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + fact * ms;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + ms;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + fact * ms;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
        }
        elem.css('left', x);
        elem.css('top', y);
        if (hl.fadeTooltip) {
            elem.fadeIn(hl.tooltipFadeSpeed);
        }
        else {
            elem.show();
        }
        
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var hl = plot.plugins.highlighter;
        if (hl.show) {
            if (neighbor == null && hl.isHighlighting) {
               var ctx = hl.highlightCanvas._ctx;
               ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (hl.fadeTooltip) {
                    hl._tooltipElem.fadeOut(hl.tooltipFadeSpeed);
                }
                else {
                    hl._tooltipElem.hide();
                }
               hl.isHighlighting = false;
            
            }
            if (neighbor != null && plot.series[neighbor.seriesIndex].showHighlight && !hl.isHighlighting) {
                hl.isHighlighting = true;
                if (hl.showMarker) {
                    draw(plot, neighbor);
                }
                if (hl.showTooltip) {
                    showTooltip(plot, plot.series[neighbor.seriesIndex], neighbor);
                }
            }
        }
    }
})(jQuery);