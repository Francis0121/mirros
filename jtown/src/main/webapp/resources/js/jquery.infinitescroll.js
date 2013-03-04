/**
*	
*	Infinite Scroll
*	
*	https://github.com/paulirish/infinitescroll
*	version 2.0b2.110713
*	Copyright 2011 Paul Irish & Luke Shumard
*	Licensed under the MIT license
*	
*	Documentation: http://infinite-scroll.com/
*	
 */
(function(window, $, undefined) {
	$.infinitescroll = function infscr(options, callback, element) {
		this.element = $(element);
		this._create(options, callback);
	};
	$.infinitescroll.defaults = {
		loading : {
			finished : undefined,
			finishedMsg : "<em>Congratulations, you've reached the end of the internet.</em>",
			img : "http://www.infinite-scroll.com/loading.gif",
			msg : null,
			msgText : "<em>Loading the next set of posts...</em>",
			selector : null,
			speed : 'fast',
			start : undefined
		},
		state : {
			isDuringAjax : false,
			isInvalidPage : false,
			isDestroyed : false,
			isDone : false,
			isPaused : false,
			currPage : 1
		},
		callback : undefined,
		debug : false,
		behavior : undefined,
		binder : $(window),
		nextSelector : "div.navigation a:first",
		navSelector : "div.navigation",
		contentSelector : null,
		extraScrollPx : 150,
		itemSelector : "div.post",
		animate : false,
		pathParse : undefined,
		dataType : 'html',
		appendCallback : true,
		bufferPx : 40,
		errorCallback : function() {
		},
		infid : 0,
		pixelsFromNavToBottom : undefined,
		path : undefined
	};
	$.infinitescroll.prototype = {
		_binding : function infscr_binding(binding) {
			var instance = this, opts = instance.options;
			if (!!opts.behavior
					&& this['_binding_' + opts.behavior] !== undefined) {
				this['_binding_' + opts.behavior].call(this);
				return;
			}
			if (binding !== 'bind' && binding !== 'unbind') {
				this._debug('Binding value  ' + binding + ' not valid')
				return false;
			}
			if (binding == 'unbind') {
				(this.options.binder).unbind('smartscroll.infscr.'
						+ instance.options.infid);
			} else {
				(this.options.binder)[binding]('smartscroll.infscr.'
						+ instance.options.infid, function() {
					instance.scroll();
				});
			}
			;
			this._debug('Binding', binding);
		},
		_create : function infscr_create(options, callback) {
			if (!this._validate(options)) {
				return false;
			}
			var opts = this.options = $.extend(true, {},
					$.infinitescroll.defaults, options), relurl = /(.*?\/\/).*?(\/.*)/, path = $(
					opts.nextSelector).attr('href');
			opts.contentSelector = opts.contentSelector || this.element;
			opts.loading.selector = opts.loading.selector
					|| opts.contentSelector;
			if (!path) {
				this._debug('Navigation selector not found');
				return;
			}
			opts.path = this._determinepath(path);
			opts.loading.msg = $('<div id="infscr-loading"><img alt="Loading..." src="'
					+ opts.loading.img
					+ '" /><div>'
					+ opts.loading.msgText
					+ '</div></div>');
			(new Image()).src = opts.loading.img;
			opts.pixelsFromNavToBottom = $(document).height()
					- $(opts.navSelector).offset().top;
			opts.loading.start = opts.loading.start
					|| function() {
						$(opts.navSelector).hide();
						opts.loading.msg.appendTo(opts.loading.selector).show(
								opts.loading.speed, function() {
									beginAjax(opts);
								});
					};
			opts.loading.finished = opts.loading.finished || function() {
				opts.loading.msg.fadeOut('normal');
				jtown.expand.loadExpandShop();
			};
			opts.callback = function(instance, data) {
				if (!!opts.behavior
						&& instance['_callback_' + opts.behavior] !== undefined) {
					instance['_callback_' + opts.behavior].call(
							$(opts.contentSelector)[0], data);
				}
				if (callback) {
					callback.call($(opts.contentSelector)[0], data);
				}
			};
			this._setup();
		},
		_debug : function infscr_debug() {
			if (this.options.debug) {
				return window.console && console.log.call(console, arguments);
			}
		},
		_determinepath : function infscr_determinepath(path) {
			var opts = this.options;
			if (!!opts.behavior
					&& this['_determinepath_' + opts.behavior] !== undefined) {
				this['_determinepath_' + opts.behavior].call(this, path);
				return;
			}
			if (!!opts.pathParse) {
				this._debug('pathParse manual');
				return opts.pathParse;
			} else if (path.match(/^(.*?)\b2\b(.*?$)/)) {
				path = path.match(/^(.*?)\b2\b(.*?$)/).slice(1);
			} else if (path.match(/^(.*?)2(.*?$)/)) {
				if (path.match(/^(.*?page=)2(\/.*|$)/)) {
					path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
					return path;
				}
				path = path.match(/^(.*?)2(.*?$)/).slice(1);
			} else {
				if (path.match(/^(.*?page=)1(\/.*|$)/)) {
					path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
					return path;
				} else {
					this
							._debug('Sorry, we couldn\'t parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.');
					opts.state.isInvalidPage = true;
				}
			}
			this._debug('determinePath', path);
			return path;
		},
		_error : function infscr_error(xhr) {
			var opts = this.options;
			if (!!opts.behavior
					&& this['_error_' + opts.behavior] !== undefined) {
				this['_error_' + opts.behavior].call(this, xhr);
				return;
			}
			if (xhr !== 'destroy' && xhr !== 'end') {
				xhr = 'unknown';
			}
			this._debug('Error', xhr);
			if (xhr == 'end') {
				this._showdonemsg();
			}
			opts.state.isDone = true;
			opts.state.currPage = 1;
			opts.state.isPaused = false;
			this._binding('unbind');
		},
		_loadcallback : function infscr_loadcallback(box, data) {
			var opts = this.options, callback = this.options.callback, result = (opts.state.isDone) ? 'done'
					: (!opts.appendCallback) ? 'no-append' : 'append', frag;
			if (!!opts.behavior
					&& this['_loadcallback_' + opts.behavior] !== undefined) {
				this['_loadcallback_' + opts.behavior].call(this, box, data);
				return;
			}
			switch (result) {
			case 'done':
				this._showdonemsg();
				return false;
				break;
			case 'no-append':
				if (opts.dataType == 'html') {
					data = '<div>' + data + '</div>';
					data = $(data).find(opts.itemSelector);
				}
				;
				break;
			case 'append':
				var children = box.children();
				if (children.length == 0) {
					return this._error('end');
				}
				frag = document.createDocumentFragment();
				while (box[0].firstChild) {
					frag.appendChild(box[0].firstChild);
				}
				this._debug('contentSelector', $(opts.contentSelector)[0])
				$(opts.contentSelector)[0].appendChild(frag);
				data = children.get();
				break;
			}
			opts.loading.finished.call($(opts.contentSelector)[0], opts)
			if (opts.animate) {
				var scrollTo = $(window).scrollTop()
						+ $('#infscr-loading').height() + opts.extraScrollPx
						+ 'px';
				$('html,body').animate({
					scrollTop : scrollTo
				}, 800, function() {
					opts.state.isDuringAjax = false;
				});
			}
			if (!opts.animate)
				opts.state.isDuringAjax = false;
			callback(this, data);
		},
		_nearbottom : function infscr_nearbottom() {
			var opts = this.options, pixelsFromWindowBottomToBottom = 0
					+ $(document).height() - (opts.binder.scrollTop())
					- $(window).height();
			if (!!opts.behavior
					&& this['_nearbottom_' + opts.behavior] !== undefined) {
				this['_nearbottom_' + opts.behavior].call(this);
				return;
			}
			this._debug('math:', pixelsFromWindowBottomToBottom,
					opts.pixelsFromNavToBottom);
			return (pixelsFromWindowBottomToBottom - opts.bufferPx < opts.pixelsFromNavToBottom);
		},
		_pausing : function infscr_pausing(pause) {
			var opts = this.options;
			if (!!opts.behavior
					&& this['_pausing_' + opts.behavior] !== undefined) {
				this['_pausing_' + opts.behavior].call(this, pause);
				return;
			}
			if (pause !== 'pause' && pause !== 'resume' && pause !== null) {
				this._debug('Invalid argument. Toggling pause value instead');
			}
			;
			pause = (pause && (pause == 'pause' || pause == 'resume')) ? pause
					: 'toggle';
			switch (pause) {
			case 'pause':
				opts.state.isPaused = true;
				break;
			case 'resume':
				opts.state.isPaused = false;
				break;
			case 'toggle':
				opts.state.isPaused = !opts.state.isPaused;
				break;
			}
			this._debug('Paused', opts.state.isPaused);
			return false;
		},
		_setup : function infscr_setup() {
			var opts = this.options;
			if (!!opts.behavior
					&& this['_setup_' + opts.behavior] !== undefined) {
				this['_setup_' + opts.behavior].call(this);
				return;
			}
			this._binding('bind');
			return false;
		},
		_showdonemsg : function infscr_showdonemsg() {
			var opts = this.options;
			if (!!opts.behavior
					&& this['_showdonemsg_' + opts.behavior] !== undefined) {
				this['_showdonemsg_' + opts.behavior].call(this);
				return;
			}
			opts.loading.msg.find('img').hide().parent().find('div').html(
					opts.loading.finishedMsg).animate({
				opacity : 1
			}, 2000, function() {
				$(this).parent().fadeOut('normal');
			});
			opts.errorCallback.call($(opts.contentSelector)[0], 'done');
		},
		_validate : function infscr_validate(opts) {
			for ( var key in opts) {
				if (key.indexOf && key.indexOf('Selector') > -1
						&& $(opts[key]).length === 0) {
					this._debug('Your ' + key + ' found no elements.');
					return false;
				}
				return true;
			}
		},
		bind : function infscr_bind() {
			this._binding('bind');
		},
		destroy : function infscr_destroy() {
			this.options.state.isDestroyed = true;
			return this._error('destroy');
		},
		pause : function infscr_pause() {
			this._pausing('pause');
		},
		resume : function infscr_resume() {
			this._pausing('resume');
		},
		retrieve : function infscr_retrieve(pageNum) {
			var instance = this, opts = instance.options, path = opts.path, box, frag, desturl, method, condition, pageNum = pageNum
					|| null, getPage = (!!pageNum) ? pageNum
					: opts.state.currPage;
			beginAjax = function infscr_ajax(opts) {
				opts.state.currPage++;
				instance._debug('heading into ajax', path);
				box = $(opts.contentSelector).is('table') ? $('<tbody/>')
						: $('<div/>');
				desturl = path.join(opts.state.currPage);
				method = (opts.dataType == 'html' || opts.dataType == 'json') ? opts.dataType
						: 'html+callback';
				if (opts.appendCallback && opts.dataType == 'html')
					method += '+callback'
				switch (method) {
				case 'html+callback':
					instance._debug('Using HTML via .load() method');
					box.load(desturl + ' ' + opts.itemSelector, null,
							function infscr_ajax_callback(responseText) {
								instance._loadcallback(box, responseText);
							});
					break;
				case 'html':
				case 'json':
					instance._debug('Using ' + (method.toUpperCase())
							+ ' via $.ajax() method');
					$
							.ajax({
								url : desturl,
								dataType : opts.dataType,
								complete : function infscr_ajax_callback(jqXHR,
										textStatus) {
									condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR
											.isResolved())
											: (textStatus === "success" || textStatus === "notmodified");
									(condition) ? instance._loadcallback(box,
											jqXHR.responseText) : instance
											._error('end');
								}
							});
					break;
				}
			};
			if (!!opts.behavior
					&& this['retrieve_' + opts.behavior] !== undefined) {
				this['retrieve_' + opts.behavior].call(this, pageNum);
				return;
			}
			if (opts.state.isDestroyed) {
				this._debug('Instance is destroyed');
				return false;
			}
			;
			opts.state.isDuringAjax = true;
			opts.loading.start.call($(opts.contentSelector)[0], opts);
		},
		scroll : function infscr_scroll() {
			var opts = this.options, state = opts.state;
			if (!!opts.behavior
					&& this['scroll_' + opts.behavior] !== undefined) {
				this['scroll_' + opts.behavior].call(this);
				return;
			}
			if (state.isDuringAjax || state.isInvalidPage || state.isDone
					|| state.isDestroyed || state.isPaused)
				return;
			if (!this._nearbottom())
				return;
			this.retrieve();
		},
		toggle : function infscr_toggle() {
			this._pausing();
		},
		unbind : function infscr_unbind() {
			this._binding('unbind');
		},
		update : function infscr_options(key) {
			if ($.isPlainObject(key)) {
				this.options = $.extend(true, this.options, key);
			}
		}
	}
	$.fn.infinitescroll = function infscr_init(options, callback) {
		var thisCall = typeof options;
		switch (thisCall) {
		case 'string':
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function() {
				var instance = $.data(this, 'infinitescroll');
				if (!instance) {
					return false;
				}
				if (!$.isFunction(instance[options])
						|| options.charAt(0) === "_") {
					return false;
				}
				instance[options].apply(instance, args);
			});
			break;
		case 'object':
			this.each(function() {
				var instance = $.data(this, 'infinitescroll');
				if (instance) {
					instance.update(options);
				} else {
					$.data(this, 'infinitescroll', new $.infinitescroll(
							options, callback, this));
				}
			});
			break;
		}
		return this;
	};
	var event = $.event, scrollTimeout;
	event.special.smartscroll = {
		setup : function() {
			$(this).bind("scroll", event.special.smartscroll.handler);
		},
		teardown : function() {
			$(this).unbind("scroll", event.special.smartscroll.handler);
		},
		handler : function(event, execAsap) {
			var context = this, args = arguments;
			event.type = "smartscroll";
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
			scrollTimeout = setTimeout(function() {
				$.event.handle.apply(context, args);
			}, execAsap === "execAsap" ? 0 : 100);
		}
	};
	$.fn.smartscroll = function(fn) {
		return fn ? this.bind("smartscroll", fn) : this.trigger("smartscroll",
				[ "execAsap" ]);
	};
})(window, jQuery);