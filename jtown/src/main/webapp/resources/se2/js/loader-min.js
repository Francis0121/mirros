var nSE2Version = 8737;
if (typeof window.nhn == "undefined") {
	window.nhn = {}
}
nhn.FindReplace = jindo
		.$Class({
			sKeyword : "",
			window : null,
			document : null,
			bBrowserSupported : false,
			bEOC : false,
			$init : function(c) {
				this.sInlineContainer = "SPAN|B|U|I|S|STRIKE";
				this.rxInlineContainer = new RegExp("^("
						+ this.sInlineContainer + ")$");
				this.window = c;
				this.document = this.window.document;
				if (this.document.domain != this.document.location.hostname) {
					var a = jindo.$Agent();
					var b = a.navigator();
					if (b.firefox && b.version < 3) {
						this.bBrowserSupported = false;
						this.find = function() {
							return 3
						};
						return
					}
				}
				this.bBrowserSupported = true
			},
			find : function(a, c, d, e) {
				var f, b;
				this.window.focus();
				if (!a) {
					return 2
				}
				this.bEOC = false;
				f = this.findNext(a, c, d, e);
				if (f) {
					return 0
				}
				this.bEOC = true;
				f = this.findNew(a, c, d, e);
				if (f) {
					return 0
				}
				return 1
			},
			findNew : function(a, b, c, d) {
				this.findReset();
				return this.findNext(a, b, c, d)
			},
			findNext : function(a, b, d, g) {
				var h;
				b = b || false;
				g = g || false;
				d = d || false;
				if (this.window.find) {
					var j = false;
					return this.window.find(a, b, d, j, g)
				}
				if (this.document.body.createTextRange) {
					try {
						var c = 0;
						if (d) {
							c += 1
						}
						if (g) {
							c += 2
						}
						if (b) {
							c += 4
						}
						this.window.focus();
						this._range = this.document.selection
								.createRangeCollection().item(0);
						this._range.collapse(false);
						h = this._range.findText(a, 1, c);
						this._range.select();
						return h
					} catch (f) {
						return false
					}
				}
				return false
			},
			findReset : function() {
				if (this.window.find) {
					this.window.getSelection().removeAllRanges();
					return
				}
				if (this.document.body.createTextRange) {
					this._range = this.document.body.createTextRange();
					this._range.collapse(true);
					this._range.select()
				}
			},
			replace : function(c, f, b, d, g) {
				if (!c) {
					return 4
				}
				var e = new nhn.HuskyRange(this.window);
				e.setFromSelection();
				b = b || false;
				var a, h = e.toString();
				if (b) {
					a = (h == c)
				} else {
					a = (h.toLowerCase() == c.toLowerCase())
				}
				if (!a) {
					return this.find(c, b, d, g) + 2
				}
				if (typeof f == "function") {
					e = f(e)
				} else {
					e.pasteText(f)
				}
				e.select();
				return this.find(c, b, d, g)
			},
			replaceAll : function(e, h, j, b) {
				if (!e) {
					return -1
				}
				var c = false;
				var l;
				var a = 0;
				var k = this.window;
				if (this.find(e, j, c, b) !== 0) {
					return a
				}
				var g = new nhn.HuskyRange(this.window);
				g.setFromSelection();
				g.collapseToStart();
				var m = this.window.document.createElement("SPAN");
				m.innerHTML = unescape("%uFEFF");
				g.insertNode(m);
				g.select();
				var d = g.placeStringBookmark();
				this.bEOC = false;
				while (!this.bEOC) {
					l = this.replace(e, h, j, c, b);
					if (l == 0 || l == 1) {
						a++
					}
				}
				var f = function() {
					var n = new nhn.HuskyRange(k);
					n.setFromSelection();
					g.moveToBookmark(d);
					var o = g.compareBoundaryPoints(
							nhn.W3CDOMRange.START_TO_END, n);
					if (o == 1) {
						return false
					}
					return true
				};
				l = 0;
				this.bEOC = false;
				while (!f() && l == 0 && !this.bEOC) {
					l = this.replace(e, h, j, c, b);
					if (l == 0 || l == 1) {
						a++
					}
				}
				g.moveToBookmark(d);
				g.select();
				g.removeStringBookmark(d);
				setTimeout(function() {
					m.parentNode.removeChild(m)
				}, 0);
				return a
			},
			_isBlankTextNode : function(a) {
				if (a.nodeType == 3 && a.nodeValue == "") {
					return true
				}
				return false
			},
			_getNextNode : function(a, b) {
				if (!a || a.tagName == "BODY") {
					return {
						elNextNode : null,
						bDisconnected : false
					}
				}
				if (a.nextSibling) {
					a = a.nextSibling;
					while (a.firstChild) {
						if (a.tagName
								&& !this.rxInlineContainer.test(a.tagName)) {
							b = true
						}
						a = a.firstChild
					}
					return {
						elNextNode : a,
						bDisconnected : b
					}
				}
				return this._getNextNode(nhn.DOMFix.parentNode(a), b)
			},
			_getNextTextNode : function(a, b) {
				var c, a;
				while (true) {
					c = this._getNextNode(a, b);
					a = c.elNextNode;
					b = c.bDisconnected;
					if (a && a.nodeType != 3
							&& !this.rxInlineContainer.test(a.tagName)) {
						b = true
					}
					if (!a || (a.nodeType == 3 && !this._isBlankTextNode(a))) {
						break
					}
				}
				return {
					elNextText : a,
					bDisconnected : b
				}
			},
			_getFirstTextNode : function() {
				var b = this.document.body.firstChild;
				while (!!b && b.firstChild) {
					b = b.firstChild
				}
				if (!b) {
					return null
				}
				if (b.nodeType != 3 || this._isBlankTextNode(b)) {
					var a = this._getNextTextNode(b, false);
					b = a.elNextText
				}
				return b
			},
			_addToTextMap : function(b, d, g, f) {
				var e = d[f].length;
				for ( var c = 0, a = b.nodeValue.length; c < a; c++) {
					g[f][e + c] = [ b, c ]
				}
				d[f] += b.nodeValue
			},
			_createTextMap : function() {
				var b = [];
				var e = [];
				var d = -1;
				var a = this._getFirstTextNode();
				var c = {
					elNextText : a,
					bDisconnected : true
				};
				while (a) {
					if (c.bDisconnected) {
						d++;
						b[d] = "";
						e[d] = []
					}
					this._addToTextMap(c.elNextText, b, e, d);
					c = this._getNextTextNode(a, false);
					a = c.elNextText
				}
				return {
					aTexts : b,
					aElTexts : e
				}
			},
			replaceAll_js : function(t, w, s, u) {
				try {
					var g = new Date();
					var n = this._createTextMap();
					var f = new Date();
					var c = n.aTexts;
					var k = n.aElTexts;
					var h = 0;
					var a = t.length;
					for ( var r = 0, l = c.length; r < l; r++) {
						var o = c[r];
						for ( var q = o.length - a; q >= 0; q--) {
							var d = o.substring(q, q + a);
							if (u
									&& (q > 0 && o.charAt(q - 1).match(
											/[a-zA-Z가-힣]/))) {
								continue
							}
							if (d == t) {
								h++;
								var b = new nhn.HuskyRange(this.window);
								var p, m;
								if (q + a < k[r].length) {
									p = k[r][q + a][0];
									m = k[r][q + a][1]
								} else {
									p = k[r][q + a - 1][0];
									m = k[r][q + a - 1][1] + 1
								}
								b.setEnd(p, m, true, true);
								b.setStart(k[r][q][0], k[r][q][1], true);
								if (typeof w == "function") {
									b = w(b)
								} else {
									b.pasteText(w)
								}
								q -= a
							}
							continue
						}
					}
					return h
				} catch (v) {
					return h
				}
			}
		});
nhn.husky.SE2M_TableTemplate = [ {}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#c7c7c7"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		color : "#666666"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#c7c7c7"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		color : "#666666"
	}, {
		padding : "3px 4px 2px",
		backgroundColor : "#f3f3f3",
		color : "#666666"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "0"
	},
	htTableStyle : {
		backgroundColor : "#ffffff",
		borderTop : "1px solid #c7c7c7"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		borderBottom : "1px solid #c7c7c7",
		backgroundColor : "#ffffff",
		color : "#666666"
	}, {
		padding : "3px 4px 2px",
		borderBottom : "1px solid #c7c7c7",
		backgroundColor : "#f3f3f3",
		color : "#666666"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "0"
	},
	htTableStyle : {
		border : "1px solid #c7c7c7"
	},
	ht1stRowStyle : {
		padding : "3px 4px 2px",
		backgroundColor : "#f3f3f3",
		color : "#666666",
		borderRight : "1px solid #e7e7e7",
		textAlign : "left",
		fontWeight : "normal"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		borderTop : "1px solid #e7e7e7",
		borderRight : "1px solid #e7e7e7",
		color : "#666666"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#c7c7c7"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#f8f8f8",
		color : "#666666"
	}, {
		padding : "3px 4px 2px",
		backgroundColor : "#ebebeb",
		color : "#666666"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "0"
	},
	ht1stRowStyle : {
		padding : "3px 4px 2px",
		borderTop : "1px solid #000000",
		borderBottom : "1px solid #000000",
		backgroundColor : "#333333",
		color : "#ffffff",
		textAlign : "left",
		fontWeight : "normal"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		borderBottom : "1px solid #ebebeb",
		backgroundColor : "#ffffff",
		color : "#666666"
	}, {
		padding : "3px 4px 2px",
		borderBottom : "1px solid #ebebeb",
		backgroundColor : "#f8f8f8",
		color : "#666666"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#c7c7c7"
	},
	ht1stRowStyle : {
		padding : "3px 4px 2px",
		backgroundColor : "#333333",
		color : "#ffffff",
		textAlign : "left",
		fontWeight : "normal"
	},
	ht1stColumnStyle : {
		padding : "3px 4px 2px",
		backgroundColor : "#f8f8f8",
		color : "#666666",
		textAlign : "left",
		fontWeight : "normal"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		color : "#666666"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#c7c7c7"
	},
	ht1stColumnStyle : {
		padding : "3px 4px 2px",
		backgroundColor : "#333333",
		color : "#ffffff",
		textAlign : "left",
		fontWeight : "normal"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		color : "#666666"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#a6bcd1"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		color : "#3d76ab"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#a6bcd1"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		color : "#3d76ab"
	}, {
		padding : "3px 4px 2px",
		backgroundColor : "#f6f8fa",
		color : "#3d76ab"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "0"
	},
	htTableStyle : {
		backgroundColor : "#ffffff",
		borderTop : "1px solid #a6bcd1"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		borderBottom : "1px solid #a6bcd1",
		backgroundColor : "#ffffff",
		color : "#3d76ab"
	}, {
		padding : "3px 4px 2px",
		borderBottom : "1px solid #a6bcd1",
		backgroundColor : "#f6f8fa",
		color : "#3d76ab"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "0"
	},
	htTableStyle : {
		border : "1px solid #a6bcd1"
	},
	ht1stRowStyle : {
		padding : "3px 4px 2px",
		backgroundColor : "#f6f8fa",
		color : "#3d76ab",
		borderRight : "1px solid #e1eef7",
		textAlign : "left",
		fontWeight : "normal"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		borderTop : "1px solid #e1eef7",
		borderRight : "1px solid #e1eef7",
		color : "#3d76ab"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#a6bcd1"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#fafbfc",
		color : "#3d76ab"
	}, {
		padding : "3px 4px 2px",
		backgroundColor : "#e6ecf2",
		color : "#3d76ab"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "0"
	},
	ht1stRowStyle : {
		padding : "3px 4px 2px",
		borderTop : "1px solid #466997",
		borderBottom : "1px solid #466997",
		backgroundColor : "#6284ab",
		color : "#ffffff",
		textAlign : "left",
		fontWeight : "normal"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		borderBottom : "1px solid #ebebeb",
		backgroundColor : "#ffffff",
		color : "#3d76ab"
	}, {
		padding : "3px 4px 2px",
		borderBottom : "1px solid #ebebeb",
		backgroundColor : "#f6f8fa",
		color : "#3d76ab"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#a6bcd1"
	},
	ht1stRowStyle : {
		padding : "3px 4px 2px",
		backgroundColor : "#6284ab",
		color : "#ffffff",
		textAlign : "left",
		fontWeight : "normal"
	},
	ht1stColumnStyle : {
		padding : "3px 4px 2px",
		backgroundColor : "#f6f8fa",
		color : "#3d76ab",
		textAlign : "left",
		fontWeight : "normal"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		color : "#3d76ab"
	} ]
}, {
	htTableProperty : {
		border : "0",
		cellPadding : "0",
		cellSpacing : "1"
	},
	htTableStyle : {
		backgroundColor : "#a6bcd1"
	},
	ht1stColumnStyle : {
		padding : "3px 4px 2px",
		backgroundColor : "#6284ab",
		color : "#ffffff",
		textAlign : "left",
		fontWeight : "normal"
	},
	aRowStyle : [ {
		padding : "3px 4px 2px",
		backgroundColor : "#ffffff",
		color : "#3d76ab"
	} ]
} ];
if (typeof window.nhn == "undefined") {
	window.nhn = {}
}
if (!nhn.husky) {
	nhn.husky = {}
}
nhn.husky.oMockDebugger = {
	log_MessageStart : function() {
	},
	log_MessageEnd : function() {
	},
	log_MessageStepStart : function() {
	},
	log_MessageStepEnd : function() {
	},
	log_CallHandlerStart : function() {
	},
	log_CallHandlerEnd : function() {
	},
	handleException : function() {
	},
	setApp : function() {
	}
};
nhn.husky.HuskyCore = jindo
		.$Class({
			name : "HuskyCore",
			aCallerStack : null,
			$init : function(a) {
				this.htOptions = a || {};
				if (this.htOptions.oDebugger) {
					if (!nhn.husky.HuskyCore._cores) {
						nhn.husky.HuskyCore._cores = [];
						nhn.husky.HuskyCore.getCore = function() {
							return nhn.husky.HuskyCore._cores
						}
					}
					nhn.husky.HuskyCore._cores.push(this);
					this.htOptions.oDebugger.setApp(this)
				}
				this.messageQueue = [];
				this.oMessageMap = {};
				this.oDisabledMessage = {};
				this.aPlugins = [];
				this.appStatus = nhn.husky.APP_STATUS.NOT_READY;
				this.aCallerStack = [];
				this._fnWaitForPluginReady = jindo.$Fn(
						this._waitForPluginReady, this).bind();
				this.registerPlugin(this)
			},
			setDebugger : function(a) {
				this.htOptions.oDebugger = a;
				a.setApp(this)
			},
			exec : function(c, b, a) {
				if (this.appStatus == nhn.husky.APP_STATUS.NOT_READY) {
					this.messageQueue[this.messageQueue.length] = {
						msg : c,
						args : b,
						event : a
					};
					return true
				}
				this.exec = this._exec;
				this.exec(c, b, a)
			},
			delayedExec : function(e, c, a, b) {
				var d = jindo.$Fn(this.exec, this).bind(e, c, b);
				setTimeout(d, a)
			},
			_exec : function(c, b, a) {
				return (this._exec = this.htOptions.oDebugger ? this._execWithDebugger
						: this._execWithoutDebugger).call(this, c, b, a)
			},
			_execWithDebugger : function(d, c, b) {
				this.htOptions.oDebugger.log_MessageStart(d, c);
				var a = this._doExec(d, c, b);
				this.htOptions.oDebugger.log_MessageEnd(d, c);
				return a
			},
			_execWithoutDebugger : function(c, b, a) {
				return this._doExec(c, b, a)
			},
			_doExec : function(g, e, d) {
				var b = false;
				if (!this.oDisabledMessage[g]) {
					var c = [];
					if (e && e.length) {
						var a = e.length;
						for ( var f = 0; f < a; f++) {
							c[f] = e[f]
						}
					}
					if (d) {
						c[c.length] = d
					}
					b = this._execMsgStep("BEFORE", g, c);
					if (b) {
						b = this._execMsgStep("ON", g, c)
					}
					if (b) {
						b = this._execMsgStep("AFTER", g, c)
					}
				}
				return b
			},
			registerPlugin : function(b) {
				if (!b) {
					throw ("An error occured in registerPlugin(): invalid plug-in")
				}
				b.nIdx = this.aPlugins.length;
				b.oApp = this;
				this.aPlugins[b.nIdx] = b;
				if (b.status != nhn.husky.PLUGIN_STATUS.NOT_READY) {
					b.status = nhn.husky.PLUGIN_STATUS.READY
				}
				if (this.appStatus != nhn.husky.APP_STATUS.NOT_READY) {
					for ( var a in b) {
						if (a.match(/^\$(LOCAL|BEFORE|ON|AFTER)_/)) {
							this.addToMessageMap(a, b)
						}
					}
				}
				this.exec("MSG_PLUGIN_REGISTERED", [ b ]);
				return b.nIdx
			},
			disableMessage : function(a, b) {
				this.oDisabledMessage[a] = b
			},
			registerBrowserEvent : function(e, f, b, d, a) {
				d = d || [];
				var c = (a) ? jindo.$Fn(this.delayedExec, this).bind(b, d, a)
						: jindo.$Fn(this.exec, this).bind(b, d);
				return jindo.$Fn(c, this).attach(e, f)
			},
			run : function(d) {
				this.htRunOptions = d || {};
				this
						._changeAppStatus(nhn.husky.APP_STATUS.WAITING_FOR_PLUGINS_READY);
				var c = this.messageQueue.length;
				for ( var b = 0; b < c; b++) {
					var a = this.messageQueue[b];
					this.exec(a.msg, a.args, a.event)
				}
				this._fnWaitForPluginReady()
			},
			acceptLocalBeforeFirstAgain : function(b, a) {
				b._husky_bRun = !a
			},
			createMessageMap : function(a) {
				this.oMessageMap[a] = [];
				var c = this.aPlugins.length;
				for ( var b = 0; b < c; b++) {
					this._doAddToMessageMap(a, this.aPlugins[b])
				}
			},
			addToMessageMap : function(a, b) {
				if (!this.oMessageMap[a]) {
					return
				}
				this._doAddToMessageMap(a, b)
			},
			_changeAppStatus : function(a) {
				this.appStatus = a;
				if (this.appStatus == nhn.husky.APP_STATUS.READY) {
					this.exec("MSG_APP_READY")
				}
			},
			_execMsgStep : function(a, b, c) {
				return (this._execMsgStep = this.htOptions.oDebugger ? this._execMsgStepWithDebugger
						: this._execMsgStepWithoutDebugger).call(this, a, b, c)
			},
			_execMsgStepWithDebugger : function(a, c, d) {
				this.htOptions.oDebugger.log_MessageStepStart(a, c, d);
				var b = this._execMsgHandler("$" + a + "_" + c, d);
				this.htOptions.oDebugger.log_MessageStepEnd(a, c, d);
				return b
			},
			_execMsgStepWithoutDebugger : function(a, b, c) {
				return this._execMsgHandler("$" + a + "_" + b, c)
			},
			_execMsgHandler : function(b, c) {
				var d;
				if (!this.oMessageMap[b]) {
					this.createMessageMap(b)
				}
				var f = this.oMessageMap[b];
				var e = f.length;
				if (e === 0) {
					return true
				}
				var a = true;
				if (b.match(/^\$(BEFORE|ON|AFTER)_MSG_APP_READY$/)) {
					for (d = 0; d < e; d++) {
						if (this._execHandler(f[d], b, c) === false) {
							a = false;
							break
						}
					}
				} else {
					for (d = 0; d < e; d++) {
						if (!f[d]._husky_bRun) {
							f[d]._husky_bRun = true;
							if (typeof f[d].$LOCAL_BEFORE_FIRST == "function"
									&& this._execHandler(f[d],
											"$LOCAL_BEFORE_FIRST", [ b, c ]) === false) {
								continue
							}
						}
						if (typeof f[d].$LOCAL_BEFORE_ALL == "function") {
							if (this._execHandler(f[d], "$LOCAL_BEFORE_ALL", [
									b, c ]) === false) {
								continue
							}
						}
						if (this._execHandler(f[d], b, c) === false) {
							a = false;
							break
						}
					}
				}
				return a
			},
			_execHandler : function(c, b, a) {
				return (this._execHandler = this.htOptions.oDebugger ? this._execHandlerWithDebugger
						: this._execHandlerWithoutDebugger).call(this, c, b, a)
			},
			_execHandlerWithDebugger : function(f, c, b) {
				this.htOptions.oDebugger.log_CallHandlerStart(f, c, b);
				var a;
				try {
					this.aCallerStack.push(f);
					a = f[c].apply(f, b);
					this.aCallerStack.pop()
				} catch (d) {
					this.htOptions.oDebugger.handleException(d);
					a = false
				}
				this.htOptions.oDebugger.log_CallHandlerEnd(f, c, b);
				return a
			},
			_execHandlerWithoutDebugger : function(d, c, b) {
				this.aCallerStack.push(d);
				var a = d[c].apply(d, b);
				this.aCallerStack.pop();
				return a
			},
			_doAddToMessageMap : function(b, d) {
				if (typeof d[b] != "function") {
					return
				}
				var e = this.oMessageMap[b];
				for ( var c = 0, a = e.length; c < a; c++) {
					if (this.oMessageMap[b][c] == d) {
						return
					}
				}
				this.oMessageMap[b][c] = d
			},
			_waitForPluginReady : function() {
				var b = true;
				for ( var a = 0; a < this.aPlugins.length; a++) {
					if (this.aPlugins[a].status == nhn.husky.PLUGIN_STATUS.NOT_READY) {
						b = false;
						break
					}
				}
				if (b) {
					this._changeAppStatus(nhn.husky.APP_STATUS.READY)
				} else {
					setTimeout(this._fnWaitForPluginReady, 100)
				}
			}
		});
nhn.husky.APP_STATUS = {
	NOT_READY : 0,
	WAITING_FOR_PLUGINS_READY : 1,
	READY : 2
};
nhn.husky.PLUGIN_STATUS = {
	NOT_READY : 0,
	READY : 1
};
if (typeof window.nhn == "undefined") {
	window.nhn = {}
}
nhn.CurrentSelection_IE = function() {
	this.getCommonAncestorContainer = function() {
		try {
			this._oSelection = this._document.selection;
			if (this._oSelection.type == "Control") {
				return this._oSelection.createRange().item(0)
			} else {
				return this._oSelection.createRangeCollection().item(0)
						.parentElement()
			}
		} catch (a) {
			return this._document.body
		}
	};
	this.isCollapsed = function() {
		this._oSelection = this._document.selection;
		return this._oSelection.type == "None"
	}
};
nhn.CurrentSelection_FF = function() {
	this.getCommonAncestorContainer = function() {
		return this._getSelection().commonAncestorContainer
	};
	this.isCollapsed = function() {
		var a = this._window.getSelection();
		if (a.rangeCount < 1) {
			return true
		}
		return a.getRangeAt(0).collapsed
	};
	this._getSelection = function() {
		try {
			return this._window.getSelection().getRangeAt(0)
		} catch (a) {
			return this._document.createRange()
		}
	}
};
nhn.CurrentSelection = new (jindo.$Class({
	$init : function() {
		var a = jindo.$Agent().navigator();
		if (a.ie) {
			nhn.CurrentSelection_IE.apply(this)
		} else {
			nhn.CurrentSelection_FF.apply(this)
		}
	},
	setWindow : function(a) {
		this._window = a;
		this._document = a.document
	}
}))();
nhn.W3CDOMRange = jindo
		.$Class({
			$init : function(a) {
				this.reset(a)
			},
			reset : function(a) {
				this._window = a;
				this._document = this._window.document;
				this.collapsed = true;
				this.commonAncestorContainer = this._document.body;
				this.endContainer = this._document.body;
				this.endOffset = 0;
				this.startContainer = this._document.body;
				this.startOffset = 0;
				this.oBrowserSelection = new nhn.BrowserSelection(this._window);
				this.selectionLoaded = this.oBrowserSelection.selectionLoaded
			},
			cloneContents : function() {
				var e = this._document.createDocumentFragment();
				var f = this._document.createDocumentFragment();
				var b = this._getNodesInRange();
				if (b.length < 1) {
					return e
				}
				var a = this._constructClonedTree(b, f);
				var d = f.firstChild;
				if (d) {
					var c = d.firstChild;
					var g;
					while (c) {
						g = c.nextSibling;
						e.appendChild(c);
						c = g
					}
				}
				a = this._splitTextEndNodes({
					oStartContainer : a.oStartContainer,
					iStartOffset : this.startOffset,
					oEndContainer : a.oEndContainer,
					iEndOffset : this.endOffset
				});
				if (a.oStartContainer && a.oStartContainer.previousSibling) {
					nhn.DOMFix.parentNode(a.oStartContainer).removeChild(
							a.oStartContainer.previousSibling)
				}
				if (a.oEndContainer && a.oEndContainer.nextSibling) {
					nhn.DOMFix.parentNode(a.oEndContainer).removeChild(
							a.oEndContainer.nextSibling)
				}
				return e
			},
			_constructClonedTree : function(b, d) {
				var a = null;
				var c = null;
				var f = this.startContainer;
				var e = this.endContainer;
				var g = function(l, k, j) {
					if (k < 0) {
						return k
					}
					var m = k - 1;
					var h = l[k].cloneNode(false);
					if (l[k] == f) {
						a = h
					}
					if (l[k] == e) {
						c = h
					}
					while (m >= 0 && nhn.DOMFix.parentNode(l[m]) == l[k]) {
						m = this._recurConstructClonedTree(l, m, h)
					}
					j.insertBefore(h, j.firstChild);
					return m
				};
				this._recurConstructClonedTree = g;
				b[b.length] = nhn.DOMFix.parentNode(b[b.length - 1]);
				this._recurConstructClonedTree(b, b.length - 1, d);
				return {
					oStartContainer : a,
					oEndContainer : c
				}
			},
			cloneRange : function() {
				return this._copyRange(new nhn.W3CDOMRange(this._window))
			},
			_copyRange : function(a) {
				a.collapsed = this.collapsed;
				a.commonAncestorContainer = this.commonAncestorContainer;
				a.endContainer = this.endContainer;
				a.endOffset = this.endOffset;
				a.startContainer = this.startContainer;
				a.startOffset = this.startOffset;
				a._document = this._document;
				return a
			},
			collapse : function(a) {
				if (a) {
					this.endContainer = this.startContainer;
					this.endOffset = this.startOffset
				} else {
					this.startContainer = this.endContainer;
					this.startOffset = this.endOffset
				}
				this._updateRangeInfo()
			},
			compareBoundaryPoints : function(a, b) {
				switch (a) {
				case nhn.W3CDOMRange.START_TO_START:
					return this._compareEndPoint(this.startContainer,
							this.startOffset, b.startContainer, b.startOffset);
				case nhn.W3CDOMRange.START_TO_END:
					return this._compareEndPoint(this.endContainer,
							this.endOffset, b.startContainer, b.startOffset);
				case nhn.W3CDOMRange.END_TO_END:
					return this._compareEndPoint(this.endContainer,
							this.endOffset, b.endContainer, b.endOffset);
				case nhn.W3CDOMRange.END_TO_START:
					return this._compareEndPoint(this.startContainer,
							this.startOffset, b.endContainer, b.endOffset)
				}
			},
			_findBody : function(a) {
				if (!a) {
					return null
				}
				while (a) {
					if (a.tagName == "BODY") {
						return a
					}
					a = nhn.DOMFix.parentNode(a)
				}
				return null
			},
			_compareEndPoint : function(d, g, c, e) {
				return this.oBrowserSelection.compareEndPoints(d, g, c, e);
				var l, j;
				if (!d || this._findBody(d) != this._document.body) {
					d = this._document.body;
					g = 0
				}
				if (!c || this._findBody(c) != this._document.body) {
					c = this._document.body;
					e = 0
				}
				var f = function(n, m) {
					if (m == -1) {
						m = n + 1
					}
					if (n < m) {
						return -1
					}
					if (n == m) {
						return 0
					}
					return 1
				};
				var h = this._getCommonAncestorContainer(d, c);
				var b = d;
				var k = null;
				if (b != h) {
					while ((k = nhn.DOMFix.parentNode(b)) != h) {
						b = k
					}
					l = this._getPosIdx(b) + 0.5
				} else {
					l = g
				}
				var a = c;
				if (a != h) {
					while ((k = nhn.DOMFix.parentNode(a)) != h) {
						a = k
					}
					j = this._getPosIdx(a) + 0.5
				} else {
					j = e
				}
				return f(l, j)
			},
			_getCommonAncestorContainer : function(c, b) {
				c = c || this.startContainer;
				b = b || this.endContainer;
				var a = b;
				while (c) {
					while (a) {
						if (c == a) {
							return c
						}
						a = nhn.DOMFix.parentNode(a)
					}
					a = b;
					c = nhn.DOMFix.parentNode(c)
				}
				return this._document.body
			},
			deleteContents : function() {
				if (this.collapsed) {
					return
				}
				this._splitTextEndNodesOfTheRange();
				var b = this._getNodesInRange();
				if (b.length < 1) {
					return
				}
				var d = b[0].previousSibling;
				while (d && this._isBlankTextNode(d)) {
					d = d.previousSibling
				}
				var a, e = -1;
				if (!d) {
					a = nhn.DOMFix.parentNode(b[0]);
					e = 0
				}
				for ( var c = 0; c < b.length; c++) {
					var f = b[c];
					if (!f.firstChild || this._isAllChildBlankText(f)) {
						if (a == f) {
							e = this._getPosIdx(a);
							a = nhn.DOMFix.parentNode(f)
						}
						nhn.DOMFix.parentNode(f).removeChild(f)
					} else {
						if (a == f && e === 0) {
							e = this._getPosIdx(a);
							a = nhn.DOMFix.parentNode(f)
						}
					}
				}
				if (!d) {
					this.setStart(a, e, true, true)
				} else {
					if (d.tagName == "BODY") {
						this.setStartBefore(d, true)
					} else {
						this.setStartAfter(d, true)
					}
				}
				this.collapse(true)
			},
			extractContents : function() {
				var a = this.cloneContents();
				this.deleteContents();
				return a
			},
			getInsertBeforeNodes : function() {
				var b = null;
				var a;
				if (this.startContainer.nodeType == "3") {
					a = nhn.DOMFix.parentNode(this.startContainer);
					if (this.startContainer.nodeValue.length <= this.startOffset) {
						b = this.startContainer.nextSibling
					} else {
						b = this.startContainer.splitText(this.startOffset)
					}
				} else {
					a = this.startContainer;
					b = nhn.DOMFix.childNodes(this.startContainer)[this.startOffset]
				}
				if (!b || !nhn.DOMFix.parentNode(b)) {
					b = null
				}
				return {
					elParent : a,
					elBefore : b
				}
			},
			insertNode : function(b) {
				var a = this.getInsertBeforeNodes();
				a.elParent.insertBefore(b, a.elBefore);
				this.setStartBefore(b)
			},
			selectNode : function(a) {
				this.reset(this._window);
				this.setStartBefore(a);
				this.setEndAfter(a)
			},
			selectNodeContents : function(a) {
				this.reset(this._window);
				this.setStart(a, 0, true);
				this.setEnd(a, nhn.DOMFix.childNodes(a).length)
			},
			_endsNodeValidation : function(b, a) {
				if (!b || this._findBody(b) != this._document.body) {
					throw new Error(
							"INVALID_NODE_TYPE_ERR oNode is not part of current document")
				}
				if (b.nodeType == 3) {
					if (a > b.nodeValue.length) {
						a = b.nodeValue.length
					}
				} else {
					if (a > nhn.DOMFix.childNodes(b).length) {
						a = nhn.DOMFix.childNodes(b).length
					}
				}
				return a
			},
			setEnd : function(a, d, c, b) {
				if (!c) {
					d = this._endsNodeValidation(a, d)
				}
				this.endContainer = a;
				this.endOffset = d;
				if (!b) {
					if (!this.startContainer
							|| this._compareEndPoint(this.startContainer,
									this.startOffset, this.endContainer,
									this.endOffset) != -1) {
						this.collapse(false)
					} else {
						this._updateRangeInfo()
					}
				}
			},
			setEndAfter : function(a, b) {
				if (!a) {
					throw new Error("INVALID_NODE_TYPE_ERR in setEndAfter")
				}
				if (a.tagName == "BODY") {
					this.setEnd(a, nhn.DOMFix.childNodes(a).length, true, b);
					return
				}
				this.setEnd(nhn.DOMFix.parentNode(a), this._getPosIdx(a) + 1,
						true, b)
			},
			setEndBefore : function(a, b) {
				if (!a) {
					throw new Error("INVALID_NODE_TYPE_ERR in setEndBefore")
				}
				if (a.tagName == "BODY") {
					this.setEnd(a, 0, true, b);
					return
				}
				this.setEnd(nhn.DOMFix.parentNode(a), this._getPosIdx(a), true,
						b)
			},
			setStart : function(a, d, c, b) {
				if (!c) {
					d = this._endsNodeValidation(a, d)
				}
				this.startContainer = a;
				this.startOffset = d;
				if (!b) {
					if (!this.endContainer
							|| this._compareEndPoint(this.startContainer,
									this.startOffset, this.endContainer,
									this.endOffset) != -1) {
						this.collapse(true)
					} else {
						this._updateRangeInfo()
					}
				}
			},
			setStartAfter : function(a, b) {
				if (!a) {
					throw new Error("INVALID_NODE_TYPE_ERR in setStartAfter")
				}
				if (a.tagName == "BODY") {
					this.setStart(a, nhn.DOMFix.childNodes(a).length, true, b);
					return
				}
				this.setStart(nhn.DOMFix.parentNode(a), this._getPosIdx(a) + 1,
						true, b)
			},
			setStartBefore : function(a, b) {
				if (!a) {
					throw new Error("INVALID_NODE_TYPE_ERR in setStartBefore")
				}
				if (a.tagName == "BODY") {
					this.setStart(a, 0, true, b);
					return
				}
				this.setStart(nhn.DOMFix.parentNode(a), this._getPosIdx(a),
						true, b)
			},
			surroundContents : function(a) {
				a.appendChild(this.extractContents());
				this.insertNode(a);
				this.selectNode(a)
			},
			toString : function() {
				var a = this._document.createElement("DIV");
				a.appendChild(this.cloneContents());
				return a.textContent || a.innerText || ""
			},
			fixCommonAncestorContainer : function() {
				if (!jindo.$Agent().navigator().ie) {
					return
				}
				this.commonAncestorContainer = this
						._getCommonAncestorContainer()
			},
			_isBlankTextNode : function(a) {
				if (a.nodeType == 3 && a.nodeValue == "") {
					return true
				}
				return false
			},
			_isAllChildBlankText : function(a) {
				for ( var b = 0, c = a.childNodes.length; b < c; b++) {
					if (!this._isBlankTextNode(a.childNodes[b])) {
						return false
					}
				}
				return true
			},
			_getPosIdx : function(b) {
				var a = 0;
				for ( var c = b.previousSibling; c; c = c.previousSibling) {
					a++
				}
				return a
			},
			_updateRangeInfo : function() {
				if (!this.startContainer) {
					this.reset(this._window);
					return
				}
				this.collapsed = this.oBrowserSelection.isCollapsed(this)
						|| (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
				this.commonAncestorContainer = this.oBrowserSelection
						.getCommonAncestorContainer(this)
			},
			_isCollapsed : function(f, e, d, c) {
				var b = false;
				if (f == d && e == c) {
					b = true
				} else {
					var a = this._getActualStartNode(f, e);
					var g = this._getActualEndNode(d, c);
					a = this._getNextNode(this._getPrevNode(a));
					g = this._getPrevNode(this._getNextNode(g));
					if (a
							&& g
							&& g.tagName != "BODY"
							&& (this._getNextNode(g) == a || (g == a && this
									._isBlankTextNode(g)))) {
						b = true
					}
				}
				return b
			},
			_splitTextEndNodesOfTheRange : function() {
				var a = this._splitTextEndNodes({
					oStartContainer : this.startContainer,
					iStartOffset : this.startOffset,
					oEndContainer : this.endContainer,
					iEndOffset : this.endOffset
				});
				this.startContainer = a.oStartContainer;
				this.startOffset = a.iStartOffset;
				this.endContainer = a.oEndContainer;
				this.endOffset = a.iEndOffset
			},
			_splitTextEndNodes : function(a) {
				a = this._splitStartTextNode(a);
				a = this._splitEndTextNode(a);
				return a
			},
			_splitStartTextNode : function(b) {
				var f = b.oStartContainer;
				var e = b.iStartOffset;
				var d = b.oEndContainer;
				var a = b.iEndOffset;
				if (!f) {
					return b
				}
				if (f.nodeType != 3) {
					return b
				}
				if (e === 0) {
					return b
				}
				if (f.nodeValue.length <= e) {
					return b
				}
				var c = f.splitText(e);
				if (f == d) {
					a -= e;
					d = c
				}
				f = c;
				e = 0;
				return {
					oStartContainer : f,
					iStartOffset : e,
					oEndContainer : d,
					iEndOffset : a
				}
			},
			_splitEndTextNode : function(b) {
				var e = b.oStartContainer;
				var d = b.iStartOffset;
				var c = b.oEndContainer;
				var a = b.iEndOffset;
				if (!c) {
					return b
				}
				if (c.nodeType != 3) {
					return b
				}
				if (a >= c.nodeValue.length) {
					return b
				}
				if (a === 0) {
					return b
				}
				c.splitText(a);
				return {
					oStartContainer : e,
					iStartOffset : d,
					oEndContainer : c,
					iEndOffset : a
				}
			},
			_getNodesInRange : function() {
				if (this.collapsed) {
					return []
				}
				var b = this._getActualStartNode(this.startContainer,
						this.startOffset);
				var a = this._getActualEndNode(this.endContainer,
						this.endOffset);
				return this._getNodesBetween(b, a)
			},
			_getActualStartNode : function(c, b) {
				var a = c;
				if (c.nodeType == 3) {
					if (b >= c.nodeValue.length) {
						a = this._getNextNode(c);
						if (a.tagName == "BODY") {
							a = null
						}
					} else {
						a = c
					}
				} else {
					if (b < nhn.DOMFix.childNodes(c).length) {
						a = nhn.DOMFix.childNodes(c)[b]
					} else {
						a = this._getNextNode(c);
						if (a.tagName == "BODY") {
							a = null
						}
					}
				}
				return a
			},
			_getActualEndNode : function(c, b) {
				var a = c;
				if (b === 0) {
					a = this._getPrevNode(c);
					if (a.tagName == "BODY") {
						a = null
					}
				} else {
					if (c.nodeType == 3) {
						a = c
					} else {
						a = nhn.DOMFix.childNodes(c)[b - 1]
					}
				}
				return a
			},
			_getNextNode : function(a) {
				if (!a || a.tagName == "BODY") {
					return this._document.body
				}
				if (a.nextSibling) {
					return a.nextSibling
				}
				return this._getNextNode(nhn.DOMFix.parentNode(a))
			},
			_getPrevNode : function(a) {
				if (!a || a.tagName == "BODY") {
					return this._document.body
				}
				if (a.previousSibling) {
					return a.previousSibling
				}
				return this._getPrevNode(nhn.DOMFix.parentNode(a))
			},
			_getNodesBetween : function(b, a) {
				var c = [];
				this._nNodesBetweenLen = 0;
				if (!b || !a) {
					return c
				}
				try {
					this._recurGetNextNodesUntil(b, a, c)
				} catch (d) {
					return []
				}
				return c
			},
			_recurGetNextNodesUntil : function(d, a, b) {
				if (!d) {
					return false
				}
				if (!this._recurGetChildNodesUntil(d, a, b)) {
					return false
				}
				var c = d.nextSibling;
				while (!c) {
					if (!(d = nhn.DOMFix.parentNode(d))) {
						return false
					}
					b[this._nNodesBetweenLen++] = d;
					if (d == a) {
						return false
					}
					c = d.nextSibling
				}
				return this._recurGetNextNodesUntil(c, a, b)
			},
			_recurGetChildNodesUntil : function(e, a, d) {
				if (!e) {
					return false
				}
				var b = false;
				var c = e;
				if (c.firstChild) {
					c = c.firstChild;
					while (c) {
						if (!this._recurGetChildNodesUntil(c, a, d)) {
							b = true;
							break
						}
						c = c.nextSibling
					}
				}
				d[this._nNodesBetweenLen++] = e;
				if (b) {
					return false
				}
				if (e == a) {
					return false
				}
				return true
			}
		});
nhn.W3CDOMRange.START_TO_START = 0;
nhn.W3CDOMRange.START_TO_END = 1;
nhn.W3CDOMRange.END_TO_END = 2;
nhn.W3CDOMRange.END_TO_START = 3;
nhn.HuskyRange = jindo
		.$Class(
				{
					setWindow : function(a) {
						this.reset(a || window)
					},
					$init : function(a) {
						this.HUSKY_BOOMARK_START_ID_PREFIX = "husky_bookmark_start_";
						this.HUSKY_BOOMARK_END_ID_PREFIX = "husky_bookmark_end_";
						this.sBlockElement = "P|DIV|LI|H[1-6]|PRE";
						this.sBlockContainer = "BODY|TABLE|TH|TR|TD|UL|OL|BLOCKQUOTE|FORM";
						this.rxBlockElement = new RegExp("^("
								+ this.sBlockElement + ")$");
						this.rxBlockContainer = new RegExp("^("
								+ this.sBlockContainer + ")$");
						this.rxLineBreaker = new RegExp("^("
								+ this.sBlockElement + "|"
								+ this.sBlockContainer + ")$");
						this.setWindow(a)
					},
					select : function() {
						try {
							this.oBrowserSelection.selectRange(this)
						} catch (a) {
						}
					},
					setFromSelection : function(a) {
						this.setRange(this.oBrowserSelection.getRangeAt(a),
								true)
					},
					setRange : function(a, b) {
						this.reset(this._window);
						this.setStart(a.startContainer, a.startOffset, b, true);
						this.setEnd(a.endContainer, a.endOffset, b)
					},
					setEndNodes : function(b, a) {
						this.reset(this._window);
						this.setEndAfter(a, true);
						this.setStartBefore(b)
					},
					splitTextAtBothEnds : function() {
						this._splitTextEndNodesOfTheRange()
					},
					getStartNode : function() {
						if (this.collapsed) {
							if (this.startContainer.nodeType == 3) {
								if (this.startOffset === 0) {
									return null
								}
								if (this.startContainer.nodeValue.length <= this.startOffset) {
									return null
								}
								return this.startContainer
							}
							return null
						}
						if (this.startContainer.nodeType == 3) {
							if (this.startOffset >= this.startContainer.nodeValue.length) {
								return this._getNextNode(this.startContainer)
							}
							return this.startContainer
						} else {
							if (this.startOffset >= nhn.DOMFix
									.childNodes(this.startContainer).length) {
								return this._getNextNode(this.startContainer)
							}
							return nhn.DOMFix.childNodes(this.startContainer)[this.startOffset]
						}
					},
					getEndNode : function() {
						if (this.collapsed) {
							return this.getStartNode()
						}
						if (this.endContainer.nodeType == 3) {
							if (this.endOffset === 0) {
								return this._getPrevNode(this.endContainer)
							}
							return this.endContainer
						} else {
							if (this.endOffset === 0) {
								return this._getPrevNode(this.endContainer)
							}
							return nhn.DOMFix.childNodes(this.endContainer)[this.endOffset - 1]
						}
					},
					getNodeAroundRange : function(d, a) {
						if (!this.collapsed) {
							return this.getStartNode()
						}
						if (this.startContainer
								&& this.startContainer.nodeType == 3) {
							return this.startContainer
						}
						var e, c, b;
						if (this.startOffset >= nhn.DOMFix
								.childNodes(this.startContainer).length) {
							c = this._getNextNode(this.startContainer)
						} else {
							c = nhn.DOMFix.childNodes(this.startContainer)[this.startOffset]
						}
						if (this.endOffset === 0) {
							e = this._getPrevNode(this.endContainer)
						} else {
							e = nhn.DOMFix.childNodes(this.endContainer)[this.endOffset - 1]
						}
						if (d) {
							b = e;
							if (!b && !a) {
								b = c
							}
						} else {
							b = c;
							if (!b && !a) {
								b = e
							}
						}
						return b
					},
					_getXPath : function(b) {
						var a = "";
						while (b && b.nodeType == 1) {
							a = "/" + b.tagName + "["
									+ this._getPosIdx4XPath(b) + "]" + a;
							b = nhn.DOMFix.parentNode(b)
						}
						return a
					},
					_getPosIdx4XPath : function(b) {
						var a = 0;
						for ( var c = b.previousSibling; c; c = c.previousSibling) {
							if (c.tagName == b.tagName) {
								a++
							}
						}
						return a
					},
					_evaluateXPath : function(l, j) {
						l = l.substring(1, l.length - 1);
						var f = l.split(/\//);
						var d = j.body;
						for ( var e = 2; e < f.length && d; e++) {
							f[e].match(/([^\[]+)\[(\d+)/i);
							var c = RegExp.$1;
							var b = RegExp.$2;
							var k = nhn.DOMFix.childNodes(d);
							var g = [];
							var m = k.length;
							var a = 0;
							for ( var h = 0; h < m; h++) {
								if (k[h].tagName == c) {
									g[a++] = k[h]
								}
							}
							if (g.length < b) {
								d = null
							} else {
								d = g[b]
							}
						}
						return d
					},
					_evaluateXPathBookmark : function(h) {
						var j = h.sXPath;
						var a = h.nTextNodeIdx;
						var c = h.nOffset;
						var e = this._evaluateXPath(j, this._document);
						if (a > -1 && e) {
							var g = nhn.DOMFix.childNodes(e);
							var d = null;
							var b = a;
							var f = c;
							while ((d = g[b]) && d.nodeType == 3
									&& d.nodeValue.length < f) {
								f -= d.nodeValue.length;
								b++
							}
							e = nhn.DOMFix.childNodes(e)[b];
							c = f
						}
						if (!e) {
							e = this._document.body;
							c = 0
						}
						return {
							elContainer : e,
							nOffset : c
						}
					},
					getXPathBookmark : function() {
						var a = -1;
						var d = {
							elContainer : this.startContainer,
							nOffset : this.startOffset
						};
						var e = this.startContainer;
						if (e.nodeType == 3) {
							d = this._getFixedStartTextNode();
							a = this._getPosIdx(d.elContainer);
							e = nhn.DOMFix.parentNode(e)
						}
						var h = this._getXPath(e);
						var j = {
							sXPath : h,
							nTextNodeIdx : a,
							nOffset : d.nOffset
						};
						if (this.collapsed) {
							var g = {
								sXPath : h,
								nTextNodeIdx : a,
								nOffset : d.nOffset
							}
						} else {
							var k = -1;
							var b = {
								elContainer : this.endContainer,
								nOffset : this.endOffset
							};
							var c = this.endContainer;
							if (c.nodeType == 3) {
								b = this._getFixedEndTextNode();
								k = this._getPosIdx(b.elContainer);
								c = nhn.DOMFix.parentNode(c)
							}
							var f = this._getXPath(c);
							var g = {
								sXPath : f,
								nTextNodeIdx : k,
								nOffset : b.nOffset
							}
						}
						return [ j, g ]
					},
					moveToXPathBookmark : function(b) {
						if (!b) {
							return false
						}
						var c = this._evaluateXPathBookmark(b[0]);
						var a = this._evaluateXPathBookmark(b[1]);
						if (!c.elContainer || !a.elContainer) {
							return
						}
						this.startContainer = c.elContainer;
						this.startOffset = c.nOffset;
						this.endContainer = a.elContainer;
						this.endOffset = a.nOffset;
						return true
					},
					_getFixedTextContainer : function(a, b) {
						while (a && a.nodeType == 3 && a.previousSibling
								&& a.previousSibling.nodeType == 3) {
							b += a.previousSibling.nodeValue.length;
							a = a.previousSibling
						}
						return {
							elContainer : a,
							nOffset : b
						}
					},
					_getFixedStartTextNode : function() {
						return this._getFixedTextContainer(this.startContainer,
								this.startOffset)
					},
					_getFixedEndTextNode : function() {
						return this._getFixedTextContainer(this.endContainer,
								this.endOffset)
					},
					placeStringBookmark : function() {
						if (this.collapsed || jindo.$Agent().navigator().ie
								|| jindo.$Agent().navigator().firefox) {
							return this.placeStringBookmark_NonWebkit()
						} else {
							return this.placeStringBookmark_Webkit()
						}
					},
					placeStringBookmark_NonWebkit : function() {
						var b = (new Date()).getTime();
						var c = this.cloneRange();
						c.collapseToEnd();
						var f = this._document.createElement("SPAN");
						f.id = this.HUSKY_BOOMARK_END_ID_PREFIX + b;
						c.insertNode(f);
						var c = this.cloneRange();
						c.collapseToStart();
						var a = this._document.createElement("SPAN");
						a.id = this.HUSKY_BOOMARK_START_ID_PREFIX + b;
						c.insertNode(a);
						if (jindo.$Agent().navigator().ie) {
							try {
								a.innerHTML = unescape("%uFEFF")
							} catch (d) {
							}
							try {
								f.innerHTML = unescape("%uFEFF")
							} catch (d) {
							}
						}
						this.moveToBookmark(b);
						return b
					},
					placeStringBookmark_Webkit : function() {
						var b = (new Date()).getTime();
						var f, d;
						var c = this.cloneRange();
						c.collapseToEnd();
						f = this._document.createTextNode("");
						c.insertNode(f);
						d = f.parentNode;
						if (f.previousSibling
								&& f.previousSibling.tagName == "TD") {
							d = f.previousSibling;
							f = null
						}
						var e = this._document.createElement("SPAN");
						e.id = this.HUSKY_BOOMARK_END_ID_PREFIX + b;
						d.insertBefore(e, f);
						var c = this.cloneRange();
						c.collapseToStart();
						f = this._document.createTextNode("");
						c.insertNode(f);
						d = f.parentNode;
						if (f.nextSibling && f.nextSibling.tagName == "TD") {
							d = f.nextSibling;
							f = d.firstChild
						}
						var a = this._document.createElement("SPAN");
						a.id = this.HUSKY_BOOMARK_START_ID_PREFIX + b;
						d.insertBefore(a, f);
						this.moveToBookmark(b);
						return b
					},
					cloneRange : function() {
						return this
								._copyRange(new nhn.HuskyRange(this._window))
					},
					moveToBookmark : function(a) {
						if (typeof (a) != "object") {
							return this.moveToStringBookmark(a)
						} else {
							return this.moveToXPathBookmark(a)
						}
					},
					getStringBookmark : function(b, a) {
						if (a) {
							return this._document
									.getElementById(this.HUSKY_BOOMARK_END_ID_PREFIX
											+ b)
						} else {
							return this._document
									.getElementById(this.HUSKY_BOOMARK_START_ID_PREFIX
											+ b)
						}
					},
					moveToStringBookmark : function(c, b) {
						var a = this.getStringBookmark(c);
						var d = this.getStringBookmark(c, true);
						if (!a || !d) {
							return false
						}
						this.reset(this._window);
						if (b) {
							this.setEndAfter(d);
							this.setStartBefore(a)
						} else {
							this.setEndBefore(d);
							this.setStartAfter(a)
						}
						return true
					},
					removeStringBookmark : function(a) {
						this._removeAll(this.HUSKY_BOOMARK_START_ID_PREFIX + a);
						this._removeAll(this.HUSKY_BOOMARK_END_ID_PREFIX + a)
					},
					_removeAll : function(b) {
						var a;
						while ((a = this._document.getElementById(b))) {
							nhn.DOMFix.parentNode(a).removeChild(a)
						}
					},
					collapseToStart : function() {
						this.collapse(true)
					},
					collapseToEnd : function() {
						this.collapse(false)
					},
					createAndInsertNode : function(a) {
						var b = this._document.createElement(a);
						this.insertNode(b);
						return b
					},
					getNodes : function(a, b) {
						if (a) {
							this._splitTextEndNodesOfTheRange()
						}
						var d = this._getNodesInRange();
						var e = [];
						if (!b) {
							return d
						}
						for ( var c = 0; c < d.length; c++) {
							if (b(d[c])) {
								e[e.length] = d[c]
							}
						}
						return e
					},
					getTextNodes : function(a) {
						var b = function(c) {
							if (c.nodeType == 3 && c.nodeValue != "\n"
									&& c.nodeValue != "") {
								return true
							} else {
								return false
							}
						};
						return this.getNodes(a, b)
					},
					surroundContentsWithNewNode : function(a) {
						var b = this._document.createElement(a);
						this.surroundContents(b);
						return b
					},
					isRangeinRange : function(b, f) {
						var e = this.compareBoundaryPoints(
								this.W3CDOMRange.START_TO_START, b);
						var c = this.compareBoundaryPoints(
								this.W3CDOMRange.START_TO_END, b);
						var d = this.compareBoundaryPoints(
								this.W3CDOMRange.ND_TO_START, b);
						var a = this.compareBoundaryPoints(
								this.W3CDOMRange.END_TO_END, b);
						if (e <= 0 && a >= 0) {
							return true
						}
						if (f) {
							if (c == 1) {
								return false
							}
							if (d == -1) {
								return false
							}
							return true
						}
						return false
					},
					isNodeInRange : function(d, c, b) {
						var a = new nhn.HuskyRange(this._window);
						if (b && d.firstChild) {
							a.setStartBefore(d.firstChild);
							a.setEndAfter(d.lastChild)
						} else {
							a.selectNode(d)
						}
						return this.isRangeInRange(a, c)
					},
					pasteText : function(a) {
						this.pasteHTML(a.replace(/&/g, "&amp;").replace(/</g,
								"&lt;").replace(/>/g, "&gt;").replace(/ /g,
								"&nbsp;").replace(/"/g, "&quot;"))
					},
					pasteHTML : function(c) {
						var b = this._document.createElement("DIV");
						b.innerHTML = c;
						if (!b.firstChild) {
							this.deleteContents();
							return
						}
						var e = b.firstChild;
						var d = b.lastChild;
						var f = this.cloneRange();
						var a = f.placeStringBookmark();
						this.collapseToStart();
						while (b.lastChild) {
							this.insertNode(b.lastChild)
						}
						this.setEndNodes(e, d);
						f.moveToBookmark(a);
						f.deleteContents();
						f.removeStringBookmark(a)
					},
					toString : function() {
						this.toString = nhn.W3CDOMRange.prototype.toString;
						return this.toString()
					},
					toHTMLString : function() {
						var a = this._document.createElement("DIV");
						a.appendChild(this.cloneContents());
						return a.innerHTML
					},
					findAncestorByTagName : function(a) {
						var b = this.commonAncestorContainer;
						while (b && b.tagName != a) {
							b = nhn.DOMFix.parentNode(b)
						}
						return b
					},
					selectNodeContents : function(c) {
						if (!c) {
							return
						}
						var b = c.firstChild ? c.firstChild : c;
						var a = c.lastChild ? c.lastChild : c;
						this.reset(this._window);
						if (b.nodeType == 3) {
							this.setStart(b, 0, true)
						} else {
							this.setStartBefore(b)
						}
						if (a.nodeType == 3) {
							this.setEnd(a, a.nodeValue.length, true)
						} else {
							this.setEndAfter(a)
						}
					},
					_hasTextDecoration : function(a, b) {
						if (!a || !a.style) {
							return false
						}
						if (a.style.textDecoration.indexOf(b) > -1) {
							return true
						}
						if (b === "underline" && a.tagName === "U") {
							return true
						}
						if (b === "line-through"
								&& (a.tagName === "S" || a.tagName === "STRIKE")) {
							return true
						}
						return false
					},
					_setTextDecoration : function(a, b) {
						if (jindo.$Agent().navigator().firefox) {
							a.style.textDecoration = (a.style.textDecoration) ? a.style.textDecoration
									+ " " + b
									: b
						} else {
							if (b === "underline") {
								a.innerHTML = "<U>" + a.innerHTML + "</U>"
							} else {
								if (b === "line-through") {
									a.innerHTML = "<STRIKE>" + a.innerHTML
											+ "</STRIKE>"
								}
							}
						}
					},
					_checkTextDecoration : function(e) {
						if (e.tagName !== "SPAN") {
							return
						}
						var c = false, a = false, d = "", b = null;
						oChildNode = e.firstChild;
						while (oChildNode) {
							if (oChildNode.nodeType === 1) {
								c = (c || oChildNode.tagName === "U");
								a = (a || oChildNode.tagName === "S" || oChildNode.tagName === "STRIKE")
							}
							if (c && a) {
								return
							}
							oChildNode = oChildNode.nextSibling
						}
						b = nhn.DOMFix.parentNode(e);
						while (b && b.tagName !== "BODY") {
							if (b.nodeType !== 1) {
								b = nhn.DOMFix.parentNode(b);
								continue
							}
							if (!c && this._hasTextDecoration(b, "underline")) {
								c = true;
								this._setTextDecoration(e, "underline")
							}
							if (!a
									&& this._hasTextDecoration(b,
											"line-through")) {
								a = true;
								this._setTextDecoration(e, "line-through")
							}
							if (c && a) {
								return
							}
							b = nhn.DOMFix.parentNode(b)
						}
					},
					styleRange : function(k, f, b, a, e) {
						var j = this.aStyleParents = this._getStyleParentNodes(
								b, a);
						if (j.length < 1) {
							return
						}
						var d, h;
						for ( var c = 0; c < j.length; c++) {
							for ( var g in k) {
								d = g;
								h = k[d];
								if (typeof h != "string") {
									continue
								}
								if (e && k.color) {
									this._checkTextDecoration(j[c])
								}
								j[c].style[d] = h
							}
							if (!f) {
								continue
							}
							for ( var g in f) {
								d = g;
								h = f[d];
								if (typeof h != "string") {
									continue
								}
								if (d == "class") {
									jindo.$Element(j[c]).addClass(h)
								} else {
									j[c].setAttribute(d, h)
								}
							}
						}
						this.reset(this._window);
						this.setStartBefore(j[0]);
						this.setEndAfter(j[j.length - 1])
					},
					expandBothEnds : function() {
						this.expandStart();
						this.expandEnd()
					},
					expandStart : function() {
						if (this.startContainer.nodeType == 3
								&& this.startOffset !== 0) {
							return
						}
						var a = this._getActualStartNode(this.startContainer,
								this.startOffset);
						a = this._getPrevNode(a);
						if (a.tagName == "BODY") {
							this.setStartBefore(a)
						} else {
							this.setStartAfter(a)
						}
					},
					expandEnd : function() {
						if (this.endContainer.nodeType == 3
								&& this.endOffset < this.endContainer.nodeValue.length) {
							return
						}
						var a = this._getActualEndNode(this.endContainer,
								this.endOffset);
						a = this._getNextNode(a);
						if (a.tagName == "BODY") {
							this.setEndAfter(a)
						} else {
							this.setEndBefore(a)
						}
					},
					_getStyleParentNodes : function(d, b) {
						this._splitTextEndNodesOfTheRange();
						var h = this.getStartNode();
						var l = this.getEndNode();
						var q = this._getNodesInRange();
						var o = [];
						var n = 0;
						var p, r, f, k, j;
						var c = q.length;
						var m = jindo.$A(q).filter(function(s) {
							return (!s.firstChild || (b && s.tagName == "LI"))
						});
						var a = this.commonAncestorContainer;
						if (b) {
							while (a) {
								if (a.tagName == "LI") {
									if (this._isFullyContained(a, m)) {
										o[n++] = a
									}
									break
								}
								a = a.parentNode
							}
						}
						for ( var g = 0; g < c; g++) {
							p = q[g];
							if (!p) {
								continue
							}
							if (b && p.tagName == "LI"
									&& this._isFullyContained(p, m)) {
								o[n++] = p;
								continue
							}
							if (p.nodeType != 3) {
								continue
							}
							if (p.nodeValue == ""
									|| p.nodeValue.match(/^(\r|\n)+$/)) {
								continue
							}
							var e = nhn.DOMFix.parentNode(p);
							if (e.tagName == "SPAN") {
								if (this._isFullyContained(e, m, p)) {
									o[n++] = e;
									continue
								}
							}
							j = this._document.createElement("SPAN");
							e.insertBefore(j, p);
							j.appendChild(p);
							o[n++] = j;
							if (d) {
								j.setAttribute(d, "true")
							}
						}
						this.setStartBefore(h);
						this.setEndAfter(l);
						return o
					},
					_isFullyContained : function(d, c, f) {
						var a, e;
						var b = this._getVeryFirstRealChild(d);
						if (f && b == f) {
							a = 1
						} else {
							a = c.indexOf(b)
						}
						if (a != -1) {
							b = this._getVeryLastRealChild(d);
							if (f && b == f) {
								e = 1
							} else {
								e = c.indexOf(b)
							}
						}
						return (a != -1 && e != -1)
					},
					_getVeryFirstChild : function(a) {
						if (a.firstChild) {
							return this._getVeryFirstChild(a.firstChild)
						}
						return a
					},
					_getVeryLastChild : function(a) {
						if (a.lastChild) {
							return this._getVeryLastChild(a.lastChild)
						}
						return a
					},
					_getFirstRealChild : function(b) {
						var a = b.firstChild;
						while (a && a.nodeType == 3 && a.nodeValue == "") {
							a = a.nextSibling
						}
						return a
					},
					_getLastRealChild : function(b) {
						var a = b.lastChild;
						while (a && a.nodeType == 3 && a.nodeValue == "") {
							a = a.previousSibling
						}
						return a
					},
					_getVeryFirstRealChild : function(b) {
						var a = this._getFirstRealChild(b);
						if (a) {
							return this._getVeryFirstRealChild(a)
						}
						return b
					},
					_getVeryLastRealChild : function(b) {
						var a = this._getLastRealChild(b);
						if (a) {
							return this._getVeryLastChild(a)
						}
						return b
					},
					_getLineStartInfo : function(f) {
						var h = null;
						var a = f;
						var g = f;
						var e = false;
						var d = this.rxLineBreaker;
						function b(j) {
							if (!j) {
								return
							}
							if (h) {
								return
							}
							if (d.test(j.tagName)) {
								g = j;
								h = a;
								e = true;
								return
							} else {
								a = j
							}
							c(j.previousSibling);
							if (h) {
								return
							}
							b(nhn.DOMFix.parentNode(j))
						}
						function c(k) {
							if (!k) {
								return
							}
							if (h) {
								return
							}
							if (d.test(k.tagName)) {
								g = k;
								h = a;
								e = false;
								return
							}
							if (k.firstChild && k.tagName != "TABLE") {
								var j = k.lastChild;
								while (j && !h) {
									c(j);
									j = j.previousSibling
								}
							} else {
								a = k
							}
							if (!h) {
								c(k.previousSibling)
							}
						}
						if (d.test(f.tagName)) {
							h = f
						} else {
							b(f)
						}
						return {
							oNode : h,
							oLineBreaker : g,
							bParentBreak : e
						}
					},
					_getLineEndInfo : function(f) {
						var b = null;
						var a = f;
						var g = f;
						var e = false;
						var d = this.rxLineBreaker;
						function h(j) {
							if (!j) {
								return
							}
							if (b) {
								return
							}
							if (d.test(j.tagName)) {
								g = j;
								b = a;
								e = true;
								return
							} else {
								a = j
							}
							c(j.nextSibling);
							if (b) {
								return
							}
							h(nhn.DOMFix.parentNode(j))
						}
						function c(k) {
							if (!k) {
								return
							}
							if (b) {
								return
							}
							if (d.test(k.tagName)) {
								g = k;
								b = a;
								e = false;
								return
							}
							if (k.firstChild && k.tagName != "TABLE") {
								var j = k.firstChild;
								while (j && !b) {
									c(j);
									j = j.nextSibling
								}
							} else {
								a = k
							}
							if (!b) {
								c(k.nextSibling)
							}
						}
						if (d.test(f.tagName)) {
							b = f
						} else {
							h(f)
						}
						return {
							oNode : b,
							oLineBreaker : g,
							bParentBreak : e
						}
					},
					getLineInfo : function(h) {
						var h = h || false;
						var b = this.getStartNode();
						var e = this.getEndNode();
						if (!b) {
							b = this.getNodeAroundRange(!h, true)
						}
						if (!e) {
							e = this.getNodeAroundRange(!h, true)
						}
						var j = this._getLineStartInfo(b);
						var f = j.oNode;
						var c = this._getLineEndInfo(e);
						var a = c.oNode;
						if (b != f || e != a) {
							var g = this._compareEndPoint(nhn.DOMFix
									.parentNode(f), this._getPosIdx(f),
									this.endContainer, this.endOffset);
							var d = this._compareEndPoint(nhn.DOMFix
									.parentNode(a), this._getPosIdx(a) + 1,
									this.startContainer, this.startOffset);
							if (!(g <= 0 && d >= 0)) {
								b = this.getNodeAroundRange(false, true);
								e = this.getNodeAroundRange(false, true);
								j = this._getLineStartInfo(b);
								c = this._getLineEndInfo(e)
							}
						}
						return {
							oStart : j,
							oEnd : c
						}
					}
				}).extend(nhn.W3CDOMRange);
nhn.BrowserSelection = function(a) {
	this.init = function(b) {
		this._window = b || window;
		this._document = this._window.document
	};
	this.init(a);
	if (!!this._document.createRange) {
		nhn.BrowserSelectionImpl_FF.apply(this)
	} else {
		nhn.BrowserSelectionImpl_IE.apply(this)
	}
	this.selectRange = function(b) {
		this.selectNone();
		this.addRange(b)
	};
	this.selectionLoaded = true;
	if (!this._oSelection) {
		this.selectionLoaded = false
	}
};
nhn.BrowserSelectionImpl_FF = function() {
	this._oSelection = this._window.getSelection();
	this.getRangeAt = function(a) {
		a = a || 0;
		try {
			var b = this._oSelection.getRangeAt(a)
		} catch (c) {
			return new nhn.W3CDOMRange(this._window)
		}
		return this._FFRange2W3CRange(b)
	};
	this.addRange = function(a) {
		var b = this._W3CRange2FFRange(a);
		this._oSelection.addRange(b)
	};
	this.selectNone = function() {
		this._oSelection.removeAllRanges()
	};
	this.getCommonAncestorContainer = function(a) {
		var b = this._W3CRange2FFRange(a);
		return b.commonAncestorContainer
	};
	this.isCollapsed = function(a) {
		var b = this._W3CRange2FFRange(a);
		return b.collapsed
	};
	this.compareEndPoints = function(g, d, c, a) {
		var f = this._document.createRange();
		var b = this._document.createRange();
		f.setStart(g, d);
		b.setStart(c, a);
		f.collapse(true);
		b.collapse(true);
		try {
			return f.compareBoundaryPoints(1, b)
		} catch (h) {
			return 1
		}
	};
	this._FFRange2W3CRange = function(b) {
		var a = new nhn.W3CDOMRange(this._window);
		a.setStart(b.startContainer, b.startOffset, true);
		a.setEnd(b.endContainer, b.endOffset, true);
		return a
	};
	this._W3CRange2FFRange = function(a) {
		var b = this._document.createRange();
		b.setStart(a.startContainer, a.startOffset);
		b.setEnd(a.endContainer, a.endOffset);
		return b
	}
};
nhn.BrowserSelectionImpl_IE = function() {
	this._oSelection = this._document.selection;
	this.oLastRange = {
		oBrowserRange : null,
		elStartContainer : null,
		nStartOffset : -1,
		elEndContainer : null,
		nEndOffset : -1
	};
	this._updateLastRange = function(b, a) {
		this.oLastRange.oBrowserRange = b;
		this.oLastRange.elStartContainer = a.startContainer;
		this.oLastRange.nStartOffset = a.startOffset;
		this.oLastRange.elEndContainer = a.endContainer;
		this.oLastRange.nEndOffset = a.endOffset
	};
	this.getRangeAt = function(b) {
		b = b || 0;
		var a, c;
		if (this._oSelection.type == "Control") {
			a = new nhn.W3CDOMRange(this._window);
			var d = this._oSelection.createRange().item(b);
			if (!d || d.ownerDocument != this._document) {
				return a
			}
			a.selectNode(d);
			return a
		} else {
			c = this._oSelection.createRange();
			var d = c.parentElement();
			if (!d || d.ownerDocument != this._document) {
				a = new nhn.W3CDOMRange(this._window);
				return a
			}
			a = this._IERange2W3CRange(c);
			return a
		}
	};
	this.addRange = function(a) {
		var b = this._W3CRange2IERange(a);
		b.select()
	};
	this.selectNone = function() {
		this._oSelection.empty()
	};
	this.getCommonAncestorContainer = function(a) {
		return this._W3CRange2IERange(a).parentElement()
	};
	this.isCollapsed = function(a) {
		var c = this._W3CRange2IERange(a);
		var b = c.duplicate();
		b.collapse();
		return c.isEqual(b)
	};
	this.compareEndPoints = function(d, c, b, a) {
		var f, e;
		if (d === this.oLastRange.elStartContainer
				&& c === this.oLastRange.nStartOffset) {
			f = this.oLastRange.oBrowserRange.duplicate();
			f.collapse(true)
		} else {
			if (d === this.oLastRange.elEndContainer
					&& c === this.oLastRange.nEndOffset) {
				f = this.oLastRange.oBrowserRange.duplicate();
				f.collapse(false)
			} else {
				f = this._getIERangeAt(d, c)
			}
		}
		if (b === this.oLastRange.elStartContainer
				&& a === this.oLastRange.nStartOffset) {
			e = this.oLastRange.oBrowserRange.duplicate();
			e.collapse(true)
		} else {
			if (b === this.oLastRange.elEndContainer
					&& a === this.oLastRange.nEndOffset) {
				e = this.oLastRange.oBrowserRange.duplicate();
				e.collapse(false)
			} else {
				e = this._getIERangeAt(b, a)
			}
		}
		return f.compareEndPoints("StartToStart", e)
	};
	this._W3CRange2IERange = function(a) {
		if (this.oLastRange.elStartContainer === a.startContainer
				&& this.oLastRange.nStartOffset === a.startOffset
				&& this.oLastRange.elEndContainer === a.endContainer
				&& this.oLastRange.nEndOffset === a.endOffset) {
			return this.oLastRange.oBrowserRange
		}
		var b = this._getIERangeAt(a.startContainer, a.startOffset);
		var c = this._getIERangeAt(a.endContainer, a.endOffset);
		b.setEndPoint("EndToEnd", c);
		this._updateLastRange(b, a);
		return b
	};
	this._getIERangeAt = function(f, d) {
		var c = this._document.body.createTextRange();
		var b = this._getSelectableNodeAndOffsetForIE(f, d);
		var e = b.oSelectableNodeForIE;
		var a = b.iOffsetForIE;
		c.moveToElementText(e);
		c.collapse(b.bCollapseToStart);
		c.moveStart("character", a);
		return c
	};
	this._getSelectableNodeAndOffsetForIE = function(e, g) {
		var a = null;
		var d = null;
		var b = 0;
		if (e.nodeType == 3) {
			a = nhn.DOMFix.parentNode(e);
			d = nhn.DOMFix.childNodes(a);
			b = d.length
		} else {
			a = e;
			d = nhn.DOMFix.childNodes(a);
			b = (g < d.length) ? g : d.length
		}
		var h = null;
		var f = 0;
		var j = true;
		for ( var c = 0; c < b; c++) {
			h = d[c];
			if (h.nodeType == 3) {
				if (h == e) {
					break
				}
				f += h.nodeValue.length
			} else {
				a = h;
				f = 0;
				j = false
			}
		}
		if (e.nodeType == 3) {
			f += g
		}
		return {
			oSelectableNodeForIE : a,
			iOffsetForIE : f,
			bCollapseToStart : j
		}
	};
	this._IERange2W3CRange = function(d) {
		var a = new nhn.W3CDOMRange(this._window);
		var c = null;
		var b = null;
		c = d.duplicate();
		c.collapse(true);
		b = this._getW3CContainerAndOffset(c, true);
		a.setStart(b.oContainer, b.iOffset, true, true);
		var e = d.duplicate();
		e.collapse(true);
		if (e.isEqual(d)) {
			a.collapse(true)
		} else {
			c = d.duplicate();
			c.collapse(false);
			b = this._getW3CContainerAndOffset(c);
			a.setEnd(b.oContainer, b.iOffset, true)
		}
		this._updateLastRange(d, a);
		return a
	};
	this._getW3CContainerAndOffset = function(c, f) {
		var p = c;
		var o = p.parentElement();
		var h = -1;
		var e = this._document.body.createTextRange();
		var k = nhn.DOMFix.childNodes(o);
		var g = null;
		var n = 0;
		for ( var j = 0; j < k.length; j++) {
			if (k[j].nodeType == 3) {
				continue
			}
			e.moveToElementText(k[j]);
			if (e.compareEndPoints("StartToStart", c) >= 0) {
				break
			}
			g = k[j]
		}
		var n = j;
		if (n !== 0 && k[n - 1].nodeType == 3) {
			var a = this._document.body.createTextRange();
			var d = null;
			if (g) {
				a.moveToElementText(g);
				a.collapse(false);
				d = g.nextSibling
			} else {
				a.moveToElementText(o);
				a.collapse(true);
				d = o.firstChild
			}
			var m = p.duplicate();
			m.setEndPoint("StartToStart", a);
			var b = m.text.replace(/[\r\n]/g, "").length;
			while (b > d.nodeValue.length && d.nextSibling) {
				b -= d.nodeValue.length;
				d = d.nextSibling
			}
			var l = d.nodeValue;
			if (f && d.nextSibling && d.nextSibling.nodeType == 3
					&& b == d.nodeValue.length) {
				b -= d.nodeValue.length;
				d = d.nextSibling
			}
			o = d;
			h = b
		} else {
			o = p.parentElement();
			h = n
		}
		return {
			oContainer : o,
			iOffset : h
		}
	}
};
nhn.DOMFix = new (jindo.$Class({
	$init : function() {
		if (jindo.$Agent().navigator().ie || jindo.$Agent().navigator().opera) {
			this.childNodes = this._childNodes_Fix;
			this.parentNode = this._parentNode_Fix
		} else {
			this.childNodes = this._childNodes_Native;
			this.parentNode = this._parentNode_Native
		}
	},
	_parentNode_Native : function(a) {
		return a.parentNode
	},
	_parentNode_Fix : function(a) {
		if (!a) {
			return a
		}
		while (a.previousSibling) {
			a = a.previousSibling
		}
		return a.parentNode
	},
	_childNodes_Native : function(a) {
		return a.childNodes
	},
	_childNodes_Fix : function(a) {
		var c = null;
		var b = 0;
		if (a) {
			var c = [];
			a = a.firstChild;
			while (a) {
				c[b++] = a;
				a = a.nextSibling
			}
		}
		return c
	}
}))();
nhn.husky.CorePlugin = jindo
		.$Class({
			name : "CorePlugin",
			htLazyLoadRequest_plugins : {},
			htLazyLoadRequest_allFiles : {},
			htHTMLLoaded : {},
			$AFTER_MSG_APP_READY : function() {
				this.oApp.exec("EXEC_ON_READY_FUNCTION", [])
			},
			$ON_ADD_APP_PROPERTY : function(a, b) {
				this.oApp[a] = b
			},
			$ON_REGISTER_BROWSER_EVENT : function(d, e, b, c, a) {
				this.oApp.registerBrowserEvent(d, e, b, c, a)
			},
			$ON_DISABLE_MESSAGE : function(a) {
				this.oApp.disableMessage(a, true)
			},
			$ON_ENABLE_MESSAGE : function(a) {
				this.oApp.disableMessage(a, false)
			},
			$ON_LOAD_FULL_PLUGIN : function(f, b, e, c, d) {
				var g = c.$this || c;
				var a = f[0];
				if (!this.htLazyLoadRequest_plugins[a]) {
					this.htLazyLoadRequest_plugins[a] = {
						nStatus : 1,
						sContents : ""
					}
				}
				if (this.htLazyLoadRequest_plugins[a].nStatus === 2) {
					this.oApp.exec("MSG_FULL_PLUGIN_LOADED", [ a, b, e, c, d,
							false ])
				} else {
					this._loadFullPlugin(f, b, e, c, d, 0)
				}
			},
			_loadFullPlugin : function(f, a, e, c, d, b) {
				jindo.LazyLoading
						.load(
								nhn.husky.SE2M_Configuration.LazyLoad.sJsBaseURI
										+ "/" + f[b],
								jindo
										.$Fn(
												function(o, h, n, l, m, k) {
													var j = o[k];
													var g = o[0];
													if (k == o.length - 1) {
														this.htLazyLoadRequest_plugins[g].nStatus = 2;
														this.oApp
																.exec(
																		"MSG_FULL_PLUGIN_LOADED",
																		[
																				o,
																				h,
																				n,
																				l,
																				m ]);
														return
													}
													this._loadFullPlugin(o, h,
															n, l, m, k + 1)
												}, this).bind(f, a, e, c, d, b),
								"utf-8")
			},
			$ON_MSG_FULL_PLUGIN_LOADED : function(aFilenames, sClassName,
					sMsgName, oThisRef, oArguments, oRes) {
				var oPluginRef = oThisRef.$this || oThisRef;
				var sFilename = aFilenames;
				for ( var i = 0, nLen = oThisRef._huskyFLT.length; i < nLen; i++) {
					var sLoaderHandlerName = "$BEFORE_" + oThisRef._huskyFLT[i];
					var oRemoveFrom = (oThisRef.$this && oThisRef[sLoaderHandlerName]) ? oThisRef
							: oPluginRef;
					oRemoveFrom[sLoaderHandlerName] = null;
					this.oApp.createMessageMap(sLoaderHandlerName)
				}
				var oPlugin = eval(sClassName + ".prototype");
				var bAcceptLocalBeforeFirstAgain = false;
				if (typeof oPluginRef["$LOCAL_BEFORE_FIRST"] !== "function") {
					this.oApp.acceptLocalBeforeFirstAgain(oPluginRef, true)
				}
				for ( var x in oPlugin) {
					if (oThisRef.$this
							&& (!oThisRef[x] || (typeof oPlugin[x] === "function" && x != "constructor"))) {
						oThisRef[x] = jindo.$Fn(oPlugin[x], oPluginRef).bind()
					}
					if (oPlugin[x]
							&& (!oPluginRef[x] || (typeof oPlugin[x] === "function" && x != "constructor"))) {
						oPluginRef[x] = oPlugin[x];
						if (x.match(/^\$(LOCAL|BEFORE|ON|AFTER)_/)) {
							this.oApp.addToMessageMap(x, oPluginRef)
						}
					}
				}
				if (bAcceptLocalBeforeFirstAgain) {
					this.oApp.acceptLocalBeforeFirstAgain(oPluginRef, true)
				}
				if (!oThisRef.$this) {
					this.oApp.exec(sMsgName, oArguments)
				}
			},
			$ON_LOAD_HTML : function(b) {
				if (this.htHTMLLoaded[b]) {
					return
				}
				var a = jindo.$("_llh_" + b);
				if (!a) {
					return
				}
				this.htHTMLLoaded[b] = true;
				var c = document.createElement("DIV");
				c.innerHTML = a.value;
				while (c.firstChild) {
					a.parentNode.insertBefore(c.firstChild, a)
				}
			},
			$ON_EXEC_ON_READY_FUNCTION : function() {
				if (typeof this.oApp.htRunOptions.fnOnAppReady == "function") {
					this.oApp.htRunOptions.fnOnAppReady()
				}
			}
		});
nhn.husky.HuskyRangeManager = jindo.$Class({
	name : "HuskyRangeManager",
	oWindow : null,
	$init : function(a) {
		this.oWindow = a || window
	},
	$BEFORE_MSG_APP_READY : function() {
		if (this.oWindow && this.oWindow.tagName == "IFRAME") {
			this.oWindow = this.oWindow.contentWindow;
			nhn.CurrentSelection.setWindow(this.oWindow)
		}
		this.oApp.exec("ADD_APP_PROPERTY", [ "getSelection",
				jindo.$Fn(this.getSelection, this).bind() ]);
		this.oApp.exec("ADD_APP_PROPERTY", [ "getEmptySelection",
				jindo.$Fn(this.getEmptySelection, this).bind() ])
	},
	$ON_SET_EDITING_WINDOW : function(a) {
		this.oWindow = a
	},
	getEmptySelection : function(a) {
		var b = new nhn.HuskyRange(a || this.oWindow);
		return b
	},
	getSelection : function(a) {
		this.oApp.exec("RESTORE_IE_SELECTION", []);
		var b = this.getEmptySelection(a);
		try {
			b.setFromSelection()
		} catch (c) {
		}
		return b
	}
});
nhn.husky.SE2M_Toolbar = jindo.$Class({
	name : "SE2M_Toolbar",
	toolbarArea : null,
	toolbarButton : null,
	uiNameTag : "uiName",
	nUIStatus : 1,
	sUIClassPrefix : "husky_seditor_ui_",
	aUICmdMap : null,
	_assignHTMLElements : function(c) {
		c = jindo.$(c) || document;
		this.rxUI = new RegExp(this.sUIClassPrefix + "([^ ]+)");
		this.toolbarArea = jindo.$$.getSingle(".se2_tool", c);
		this.aAllUI = jindo.$$("[class*=" + this.sUIClassPrefix + "]",
				this.toolbarArea);
		this.welToolbarArea = jindo.$Element(this.toolbarArea);
		for ( var b = 0, a = this.aAllUI.length; b < a; b++) {
			if (this.rxUI.test(this.aAllUI[b].className)) {
				var d = RegExp.$1;
				if (this.htUIList[d] !== undefined) {
					continue
				}
				this.htUIList[d] = this.aAllUI[b];
				this.htWrappedUIList[d] = jindo.$Element(this.htUIList[d])
			}
		}
	},
	$init : function(a) {
		this.htUIList = {};
		this.htWrappedUIList = {};
		this.aUICmdMap = {};
		this._assignHTMLElements(a)
	},
	$ON_MSG_APP_READY : function() {
		this.oApp.registerBrowserEvent(this.toolbarArea, "mouseover",
				"EVENT_TOOLBAR_MOUSEOVER", []);
		this.oApp.registerBrowserEvent(this.toolbarArea, "mouseout",
				"EVENT_TOOLBAR_MOUSEOUT", []);
		this.oApp.registerBrowserEvent(this.toolbarArea, "mousedown",
				"EVENT_TOOLBAR_MOUSEDOWN", []);
		this.oApp.exec("ADD_APP_PROPERTY", [ "getToolbarButtonByUIName",
				jindo.$Fn(this.getToolbarButtonByUIName, this).bind() ])
	},
	$ON_TOGGLE_TOOLBAR_ACTIVE_LAYER : function(b, d, e, a, f, c) {
		this.oApp.exec("TOGGLE_ACTIVE_LAYER", [ b, "MSG_TOOLBAR_LAYER_SHOWN",
				[ b, d, e, a ], f, c ])
	},
	$ON_MSG_TOOLBAR_LAYER_SHOWN : function(c, d, b, a) {
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [ c, d ]);
		if (b) {
			this.oApp.exec(b, a)
		}
	},
	$ON_SHOW_TOOLBAR_ACTIVE_LAYER : function(a, d, c, b) {
		this.oApp.exec("SHOW_ACTIVE_LAYER", [ a, d, c ]);
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [ a, b ])
	},
	$ON_ENABLE_UI : function(a) {
		this._enableUI(a)
	},
	$ON_DISABLE_UI : function(a) {
		this._disableUI(a)
	},
	$ON_SELECT_UI : function(a) {
		var b = this.htWrappedUIList[a];
		if (!b) {
			return
		}
		b.removeClass("hover");
		b.addClass("active")
	},
	$ON_DESELECT_UI : function(a) {
		var b = this.htWrappedUIList[a];
		if (!b) {
			return
		}
		b.removeClass("active")
	},
	$ON_ENABLE_ALL_UI : function(b) {
		if (this.nUIStatus === 1) {
			return
		}
		var c, a;
		b = b || {};
		var d = jindo.$A(b.aExceptions || []);
		for ( var c in this.htUIList) {
			if (c && !d.has(c)) {
				this._enableUI(c)
			}
		}
		this.nUIStatus = 1
	},
	$ON_DISABLE_ALL_UI : function(b) {
		if (this.nUIStatus === 2) {
			return
		}
		var c;
		b = b || {};
		var d = jindo.$A(b.aExceptions || []);
		var a = b.bLeaveActiveLayer || false;
		if (!a) {
			this.oApp.exec("HIDE_ACTIVE_LAYER", [])
		}
		for ( var c in this.htUIList) {
			if (c && !d.has(c)) {
				this._disableUI(c)
			}
		}
		this.nUIStatus = 2
	},
	$ON_MSG_STYLE_CHANGED : function(b, a) {
		if (a === "@^") {
			this.oApp.exec("SELECT_UI", [ b ])
		} else {
			this.oApp.exec("DESELECT_UI", [ b ])
		}
	},
	$ON_POSITION_TOOLBAR_LAYER : function(f, j) {
		f = jindo.$(f);
		j = j || {};
		var d = jindo.$(j.elBtn);
		var g = j.sAlign;
		var c = -1;
		if (!f) {
			return
		}
		if (d && d.tagName && d.tagName == "BUTTON") {
			d.parentNode.appendChild(f)
		}
		var h = jindo.$Element(f);
		if (g != "right") {
			f.style.left = "0";
			var b = h.offset().left;
			var k = b + f.offsetWidth;
			var e = this.welToolbarArea.offset().left;
			var a = e + this.toolbarArea.offsetWidth;
			if (k > a) {
				h.css("left", (a - k - c) + "px")
			}
			if (b < e) {
				h.css("left", (e - b + c) + "px")
			}
		} else {
			f.style.right = "0";
			var b = h.offset().left;
			var k = b + f.offsetWidth;
			var e = this.welToolbarArea.offset().left;
			var a = e + this.toolbarArea.offsetWidth;
			if (k > a) {
				h.css("right", -1 * (a - k - c) + "px")
			}
			if (b < e) {
				h.css("right", -1 * (e - b + c) + "px")
			}
		}
	},
	$ON_EVENT_TOOLBAR_MOUSEOVER : function(c) {
		if (this.nUIStatus === 2) {
			return
		}
		var a = this._getAffectedElements(c.element);
		for ( var b = 0; b < a.length; b++) {
			if (!a[b].hasClass("active")) {
				a[b].addClass("hover")
			}
		}
	},
	$ON_EVENT_TOOLBAR_MOUSEOUT : function(c) {
		if (this.nUIStatus === 2) {
			return
		}
		var a = this._getAffectedElements(c.element);
		for ( var b = 0; b < a.length; b++) {
			a[b].removeClass("hover")
		}
	},
	$ON_EVENT_TOOLBAR_MOUSEDOWN : function(b) {
		var a = b.element;
		while (a) {
			if (a.className
					&& a.className.match(/active/)
					&& (a.childNodes.length > 2 || a.parentNode.className
							.match(/se2_pair/))) {
				return
			}
			a = a.parentNode
		}
		this.oApp.exec("HIDE_ACTIVE_LAYER_IF_NOT_CHILD", [ b.element ])
	},
	_enableUI : function(d) {
		this.nUIStatus = 0;
		var e = this.htWrappedUIList[d];
		var g = this.htUIList[d];
		if (!e) {
			return
		}
		e.removeClass("off");
		var a = g.getElementsByTagName("BUTTON");
		for ( var b = 0, c = a.length; b < c; b++) {
			a[b].disabled = false
		}
		var f = "";
		if (this.aUICmdMap[d]) {
			for ( var b = 0; b < this.aUICmdMap[d].length; b++) {
				f = this.aUICmdMap[d][b];
				this.oApp.exec("ENABLE_MESSAGE", [ f ])
			}
		}
	},
	_disableUI : function(d) {
		this.nUIStatus = 0;
		var e = this.htWrappedUIList[d];
		var g = this.htUIList[d];
		if (!e) {
			return
		}
		e.addClass("off");
		e.removeClass("hover");
		var a = g.getElementsByTagName("BUTTON");
		for ( var b = 0, c = a.length; b < c; b++) {
			a[b].disabled = true
		}
		var f = "";
		if (this.aUICmdMap[d]) {
			for ( var b = 0; b < this.aUICmdMap[d].length; b++) {
				f = this.aUICmdMap[d][b];
				this.oApp.exec("DISABLE_MESSAGE", [ f ])
			}
		}
	},
	_getAffectedElements : function(e) {
		var d, b;
		if (!e.bSE2_MDCancelled) {
			e.bSE2_MDCancelled = true;
			var a = e.getElementsByTagName("BUTTON");
			for ( var c = 0, f = a.length; c < f; c++) {
				a[c].onmousedown = function() {
					return false
				}
			}
		}
		if (!e || !e.tagName) {
			return []
		}
		if ((d = e).tagName == "BUTTON") {
			if ((d = d.parentNode) && d.tagName == "LI"
					&& this.rxUI.test(d.className)) {
				return [ jindo.$Element(d) ]
			}
			d = e;
			if ((d = d.parentNode.parentNode) && d.tagName == "LI"
					&& (b = jindo.$Element(d)).hasClass("se2_pair")) {
				return [ b, jindo.$Element(e.parentNode) ]
			}
			return []
		}
		if ((d = e).tagName == "SPAN") {
			if ((d = d.parentNode.parentNode) && d.tagName == "LI"
					&& this.rxUI.test(d.className)) {
				return [ jindo.$Element(d) ]
			}
			if ((d = d.parentNode) && d.tagName == "LI"
					&& this.rxUI.test(d.className)) {
				return [ jindo.$Element(d) ]
			}
		}
		return []
	},
	$ON_REGISTER_UI_EVENT : function(c, d, e, b) {
		if (!this.htUIList[c]) {
			return
		}
		var a;
		if (!this.aUICmdMap[c]) {
			this.aUICmdMap[c] = []
		}
		this.aUICmdMap[c][this.aUICmdMap[c].length] = e;
		a = jindo.$$.getSingle("button", this.htUIList[c]);
		if (!a) {
			return
		}
		this.oApp.registerBrowserEvent(a, d, e, b)
	},
	getToolbarButtonByUIName : function(a) {
		return jindo.$$.getSingle("BUTTON", this.htUIList[a])
	}
});
nhn.husky.SE2M_EditingModeChanger = jindo.$Class({
	name : "SE2M_EditingModeChanger",
	$init : function(a) {
		this._assignHTMLElements(a)
	},
	_assignHTMLElements : function(a) {
		a = jindo.$(a) || document;
		this.elWYSIWYGButton = jindo.$$.getSingle("BUTTON.se2_to_editor", a);
		this.elHTMLSrcButton = jindo.$$.getSingle("BUTTON.se2_to_html", a);
		this.elTEXTButton = jindo.$$.getSingle("BUTTON.se2_to_text", a);
		this.welWYSIWYGButtonLi = jindo
				.$Element(this.elWYSIWYGButton.parentNode);
		this.welHTMLSrcButtonLi = jindo
				.$Element(this.elHTMLSrcButton.parentNode);
		this.welTEXTButtonLi = jindo.$Element(this.elTEXTButton.parentNode)
	},
	$ON_MSG_APP_READY : function() {
		this.oApp.registerBrowserEvent(this.elWYSIWYGButton, "click",
				"EVENT_CHANGE_EDITING_MODE_CLICKED", [ "WYSIWYG" ]);
		this.oApp.registerBrowserEvent(this.elHTMLSrcButton, "click",
				"EVENT_CHANGE_EDITING_MODE_CLICKED", [ "HTMLSrc" ]);
		this.oApp.registerBrowserEvent(this.elTEXTButton, "click",
				"EVENT_CHANGE_EDITING_MODE_CLICKED", [ "TEXT", false ])
	},
	$ON_EVENT_CHANGE_EDITING_MODE_CLICKED : function(b, a) {
		if (b == "TEXT") {
			var c = this.oApp.getIR();
			if (c.length > 0 && !a) {
				if (!confirm(this.oApp
						.$MSG("SE2M_EditingModeChanger.confirmTextMode"))) {
					return false
				}
			}
			this.oApp.exec("CHANGE_EDITING_MODE", [ b ])
		} else {
			this.oApp.exec("CHANGE_EDITING_MODE", [ b ])
		}
		if ("HTMLSrc" == b) {
			this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "htmlmode" ])
		} else {
			if ("TEXT" == b) {
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "textmode" ])
			} else {
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "editormode" ])
			}
		}
	},
	$ON_DISABLE_ALL_UI : function(a) {
		a = a || {};
		var b = jindo.$A(a.aExceptions || []);
		if (b.has("mode_switcher")) {
			return
		}
		if (this.oApp.getEditingMode() == "WYSIWYG") {
			this.welWYSIWYGButtonLi.removeClass("active");
			this.elHTMLSrcButton.disabled = true;
			this.elTEXTButton.disabled = true
		} else {
			if (this.oApp.getEditingMode() == "TEXT") {
				this.welTEXTButtonLi.removeClass("active");
				this.elWYSIWYGButton.disabled = true;
				this.elHTMLSrcButton.disabled = true
			} else {
				this.welHTMLSrcButtonLi.removeClass("active");
				this.elWYSIWYGButton.disabled = true;
				this.elTEXTButton.disabled = true
			}
		}
	},
	$ON_ENABLE_ALL_UI : function() {
		if (this.oApp.getEditingMode() == "WYSIWYG") {
			this.welWYSIWYGButtonLi.addClass("active");
			this.elHTMLSrcButton.disabled = false;
			this.elTEXTButton.disabled = false
		} else {
			if (this.oApp.getEditingMode() == "TEXT") {
				this.welTEXTButtonLi.addClass("active");
				this.elWYSIWYGButton.disabled = false;
				this.elHTMLSrcButton.disabled = false
			} else {
				this.welHTMLSrcButtonLi.addClass("active");
				this.elWYSIWYGButton.disabled = false;
				this.elTEXTButton.disabled = false
			}
		}
	},
	$ON_CHANGE_EDITING_MODE : function(a) {
		if (a == "HTMLSrc") {
			this.welWYSIWYGButtonLi.removeClass("active");
			this.welHTMLSrcButtonLi.addClass("active");
			this.welTEXTButtonLi.removeClass("active");
			this.elWYSIWYGButton.disabled = false;
			this.elHTMLSrcButton.disabled = true;
			this.elTEXTButton.disabled = false;
			this.oApp.exec("HIDE_ALL_DIALOG_LAYER");
			this.oApp.exec("DISABLE_ALL_UI", [ {
				aExceptions : [ "mode_switcher" ]
			} ])
		} else {
			if (a == "TEXT") {
				this.welWYSIWYGButtonLi.removeClass("active");
				this.welHTMLSrcButtonLi.removeClass("active");
				this.welTEXTButtonLi.addClass("active");
				this.elWYSIWYGButton.disabled = false;
				this.elHTMLSrcButton.disabled = false;
				this.elTEXTButton.disabled = true;
				this.oApp.exec("HIDE_ALL_DIALOG_LAYER");
				this.oApp.exec("DISABLE_ALL_UI", [ {
					aExceptions : [ "mode_switcher" ]
				} ])
			} else {
				this.welWYSIWYGButtonLi.addClass("active");
				this.welHTMLSrcButtonLi.removeClass("active");
				this.welTEXTButtonLi.removeClass("active");
				this.elWYSIWYGButton.disabled = true;
				this.elHTMLSrcButton.disabled = false;
				this.elTEXTButton.disabled = false;
				this.oApp.exec("RESET_STYLE_STATUS");
				this.oApp.exec("ENABLE_ALL_UI", [])
			}
		}
	}
});
nhn.husky.SE_EditingAreaManager = jindo
		.$Class({
			name : "SE_EditingAreaManager",
			oActivePlugin : null,
			elContentsField : null,
			bIsDirty : false,
			bAutoResize : false,
			$init : function(g, f, a, e, d) {
				this.sDefaultEditingMode = g;
				this.elContentsField = jindo.$(f);
				this._assignHTMLElements(d);
				this.fOnBeforeUnload = e;
				this.oEditingMode = {};
				this.elContentsField.style.display = "none";
				this.nMinWidth = parseInt((a.nMinWidth || 60), 10);
				this.nMinHeight = parseInt((a.nMinHeight || 60), 10);
				var b = this._getSize([ a.nWidth, a.width,
						this.elEditingAreaContainer.offsetWidth ],
						this.nMinWidth);
				var c = this._getSize([ a.nHeight, a.height,
						this.elEditingAreaContainer.offsetHeight ],
						this.nMinHeight);
				this.elEditingAreaContainer.style.width = b.nSize + b.sUnit;
				this.elEditingAreaContainer.style.height = c.nSize + c.sUnit;
				if (b.sUnit === "px") {
					d.style.width = (b.nSize + 2) + "px"
				} else {
					if (b.sUnit === "%") {
						d.style.minWidth = this.nMinWidth + "px"
					}
				}
			},
			_getSize : function(c, b) {
				var e, g, h, d, a, f = "px";
				b = parseInt(b, 10);
				for (e = 0, g = c.length; e < g; e++) {
					if (!c[e]) {
						continue
					}
					if (!isNaN(c[e])) {
						d = parseInt(c[e], 10);
						a = f;
						break
					}
					h = /([0-9]+)(.*)/i.exec(c[e]);
					if (!h || h.length < 2 || h[1] <= 0) {
						continue
					}
					d = parseInt(h[1], 10);
					a = h[2];
					if (!a) {
						a = f
					}
					if (d < b && a === f) {
						d = b
					}
					break
				}
				if (!a) {
					a = f
				}
				if (isNaN(d) || (d < b && a === f)) {
					d = b
				}
				return {
					nSize : d,
					sUnit : a
				}
			},
			_assignHTMLElements : function(a) {
				this.elEditingAreaContainer = jindo.$$.getSingle(
						"DIV.husky_seditor_editing_area_container", a)
			},
			$BEFORE_MSG_APP_READY : function(a) {
				this.oNavigator = jindo.$Agent().navigator();
				this.oApp.exec("ADD_APP_PROPERTY", [ "elEditingAreaContainer",
						this.elEditingAreaContainer ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "welEditingAreaContainer",
						jindo.$Element(this.elEditingAreaContainer) ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getEditingAreaHeight",
						jindo.$Fn(this.getEditingAreaHeight, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getEditingAreaWidth",
						jindo.$Fn(this.getEditingAreaWidth, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getRawContents",
						jindo.$Fn(this.getRawContents, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getContents",
						jindo.$Fn(this.getContents, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getIR",
						jindo.$Fn(this.getIR, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "setContents",
						this.setContents ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "setIR", this.setIR ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getEditingMode",
						jindo.$Fn(this.getEditingMode, this).bind() ])
			},
			$ON_MSG_APP_READY : function() {
				this.htOptions = this.oApp.htOptions[this.name] || {};
				this.sDefaultEditingMode = this.htOptions.sDefaultEditingMode
						|| this.sDefaultEditingMode;
				this.iframeWindow = this.oApp.getWYSIWYGWindow();
				this.oApp.exec("REGISTER_CONVERTERS", []);
				this.oApp.exec("CHANGE_EDITING_MODE", [
						this.sDefaultEditingMode, true ]);
				this.oApp.exec("LOAD_CONTENTS_FIELD", [ false ]);
				if (!!this.fOnBeforeUnload) {
					window.onbeforeunload = this.fOnBeforeUnload
				} else {
					window.onbeforeunload = jindo
							.$Fn(
									function() {
										this.oApp
												.exec("MSG_BEFOREUNLOAD_FIRED");
										if (this.getRawContents() != this.sCurrentRawContents
												|| this.bIsDirty) {
											return this.oApp
													.$MSG("SE_EditingAreaManager.onExit")
										}
									}, this).bind()
				}
			},
			$AFTER_MSG_APP_READY : function() {
				this.oApp.exec("UPDATE_RAW_CONTENTS");
				if (!!this.oApp.htOptions[this.name]
						&& this.oApp.htOptions[this.name].bAutoResize) {
					this.bAutoResize = this.oApp.htOptions[this.name].bAutoResize
				}
				this.startAutoResize()
			},
			$ON_LOAD_CONTENTS_FIELD : function(b) {
				var a = this.elContentsField.value;
				a = a.replace(/^\s+/, "");
				this.oApp.exec("SET_CONTENTS", [ a, b ])
			},
			$ON_UPDATE_CONTENTS_FIELD : function() {
				this.elContentsField.value = this.oApp.getContents();
				this.oApp.exec("UPDATE_RAW_CONTENTS")
			},
			$ON_UPDATE_RAW_CONTENTS : function() {
				this.sCurrentRawContents = this.oApp.getRawContents()
			},
			$BEFORE_CHANGE_EDITING_MODE : function(a) {
				if (!this.oEditingMode[a]) {
					return false
				}
				this.stopAutoResize();
				this._oPrevActivePlugin = this.oActivePlugin;
				this.oActivePlugin = this.oEditingMode[a]
			},
			$AFTER_CHANGE_EDITING_MODE : function(a, b) {
				if (this._oPrevActivePlugin) {
					var c = this._oPrevActivePlugin.getIR();
					this.oApp.exec("SET_IR", [ c ]);
					this._setEditingAreaDimension()
				}
				this.startAutoResize();
				if (!b) {
					this.oApp.delayedExec("FOCUS", [], 0)
				}
			},
			$ON_SET_IS_DIRTY : function(a) {
				this.bIsDirty = a
			},
			$ON_FOCUS : function() {
				if (!this.oActivePlugin
						|| typeof this.oActivePlugin.setIR != "function") {
					return
				}
				if (!!this.oNavigator.msafari && !!this.iframeWindow
						&& !this.iframeWindow.document.hasFocus()) {
					this.iframeWindow.focus()
				}
				this.oActivePlugin.focus()
			},
			$ON_IE_FOCUS : function() {
				if (!this.oApp.oNavigator.ie) {
					return
				}
				this.oApp.exec("FOCUS")
			},
			$ON_SET_CONTENTS : function(a, b) {
				this.setContents(a, b)
			},
			$BEFORE_SET_IR : function(b, a) {
				a = a || false;
				if (!a) {
					this.oApp.exec("RECORD_UNDO_ACTION", [
							"BEFORE SET CONTENTS", {
								sSaveTarget : "BODY"
							} ])
				}
			},
			$ON_SET_IR : function(a) {
				if (!this.oActivePlugin
						|| typeof this.oActivePlugin.setIR != "function") {
					return
				}
				this.oActivePlugin.setIR(a)
			},
			$AFTER_SET_IR : function(b, a) {
				a = a || false;
				if (!a) {
					this.oApp.exec("RECORD_UNDO_ACTION", [
							"AFTER SET CONTENTS", {
								sSaveTarget : "BODY"
							} ])
				}
			},
			$ON_REGISTER_EDITING_AREA : function(a) {
				this.oEditingMode[a.sMode] = a;
				this.attachDocumentEvents(a.oEditingArea);
				this._setEditingAreaDimension(a)
			},
			$ON_MSG_EDITING_AREA_RESIZE_STARTED : function() {
				this._fitElementInEditingArea(this.elEditingAreaContainer);
				this.oApp.exec("STOP_AUTORESIZE_EDITING_AREA");
				this.oApp.exec("SHOW_EDITING_AREA_COVER");
				this.elEditingAreaContainer.style.overflow = "hidden";
				this.iStartingHeight = parseInt(
						this.elEditingAreaContainer.style.height, 10)
			},
			$ON_STOP_AUTORESIZE_EDITING_AREA : function() {
				if (!this.bAutoResize) {
					return
				}
				this.stopAutoResize();
				this.bAutoResize = false
			},
			startAutoResize : function() {
				if (!this.bAutoResize
						|| !this.oActivePlugin
						|| typeof this.oActivePlugin.startAutoResize != "function") {
					return
				}
				this.oActivePlugin.startAutoResize()
			},
			stopAutoResize : function() {
				if (!this.bAutoResize
						|| !this.oActivePlugin
						|| typeof this.oActivePlugin.stopAutoResize != "function") {
					return
				}
				this.oActivePlugin.stopAutoResize()
			},
			$ON_RESIZE_EDITING_AREA : function(b, a) {
				if (b !== null && typeof b !== "undefined") {
					this._resizeWidth(b, "px")
				}
				if (a !== null && typeof a !== "undefined") {
					this._resizeHeight(a, "px")
				}
				this._fitElementInEditingArea(this.elResizingBoard);
				this._setEditingAreaDimension()
			},
			_resizeWidth : function(c, a) {
				var b = parseInt(c, 10);
				if (b < this.nMinWidth) {
					b = this.nMinWidth
				}
				if (c) {
					this.elEditingAreaContainer.style.width = b + a
				}
			},
			_resizeHeight : function(b, a) {
				var c = parseInt(b, 10);
				if (c < this.nMinHeight) {
					c = this.nMinHeight
				}
				if (b) {
					this.elEditingAreaContainer.style.height = c + a
				}
			},
			$ON_RESIZE_EDITING_AREA_BY : function(b, f) {
				var d = parseInt(b, 10);
				var a = parseInt(f, 10);
				var c;
				var e;
				if (b !== 0
						&& this.elEditingAreaContainer.style.width.indexOf("%") === -1) {
					c = this.elEditingAreaContainer.style.width ? parseInt(
							this.elEditingAreaContainer.style.width, 10)
							+ d : null
				}
				if (a !== 0) {
					e = this.elEditingAreaContainer.style.height ? this.iStartingHeight
							+ a
							: null
				}
				if (!b && !a) {
					return
				}
				this.oApp.exec("RESIZE_EDITING_AREA", [ c, e ])
			},
			$ON_MSG_EDITING_AREA_RESIZE_ENDED : function(a, b, c) {
				this.oApp.exec("HIDE_EDITING_AREA_COVER");
				this.elEditingAreaContainer.style.overflow = "";
				this._setEditingAreaDimension()
			},
			$ON_SHOW_EDITING_AREA_COVER : function() {
				if (!this.elResizingBoard) {
					this.createCoverDiv()
				}
				this.elResizingBoard.style.display = "block"
			},
			$ON_HIDE_EDITING_AREA_COVER : function() {
				if (!this.elResizingBoard) {
					return
				}
				this.elResizingBoard.style.display = "none"
			},
			$ON_KEEP_WITHIN_EDITINGAREA : function(b, a) {
				var c = parseInt(b.style.top, 10);
				if (c + b.offsetHeight > this.oApp.elEditingAreaContainer.offsetHeight) {
					if (typeof a == "number") {
						b.style.top = c - b.offsetHeight - a + "px"
					} else {
						b.style.top = this.oApp.elEditingAreaContainer.offsetHeight
								- b.offsetHeight + "px"
					}
				}
				var d = parseInt(b.style.left, 10);
				if (d + b.offsetWidth > this.oApp.elEditingAreaContainer.offsetWidth) {
					b.style.left = this.oApp.elEditingAreaContainer.offsetWidth
							- b.offsetWidth + "px"
				}
			},
			$ON_EVENT_EDITING_AREA_KEYDOWN : function() {
				this.oApp.exec("HIDE_ACTIVE_LAYER", [])
			},
			$ON_EVENT_EDITING_AREA_MOUSEDOWN : function() {
				this.oApp.exec("HIDE_ACTIVE_LAYER", [])
			},
			$ON_EVENT_EDITING_AREA_SCROLL : function() {
				this.oApp.exec("HIDE_ACTIVE_LAYER", [])
			},
			_setEditingAreaDimension : function(a) {
				a = a || this.oActivePlugin;
				this._fitElementInEditingArea(a.elEditingArea)
			},
			_fitElementInEditingArea : function(a) {
				a.style.height = this.elEditingAreaContainer.offsetHeight
						+ "px"
			},
			attachDocumentEvents : function(a) {
				this.oApp.registerBrowserEvent(a, "click",
						"EVENT_EDITING_AREA_CLICK");
				this.oApp.registerBrowserEvent(a, "dblclick",
						"EVENT_EDITING_AREA_DBLCLICK");
				this.oApp.registerBrowserEvent(a, "mousedown",
						"EVENT_EDITING_AREA_MOUSEDOWN");
				this.oApp.registerBrowserEvent(a, "mousemove",
						"EVENT_EDITING_AREA_MOUSEMOVE");
				this.oApp.registerBrowserEvent(a, "mouseup",
						"EVENT_EDITING_AREA_MOUSEUP");
				this.oApp.registerBrowserEvent(a, "mouseout",
						"EVENT_EDITING_AREA_MOUSEOUT");
				this.oApp.registerBrowserEvent(a, "mousewheel",
						"EVENT_EDITING_AREA_MOUSEWHEEL");
				this.oApp.registerBrowserEvent(a, "keydown",
						"EVENT_EDITING_AREA_KEYDOWN");
				this.oApp.registerBrowserEvent(a, "keypress",
						"EVENT_EDITING_AREA_KEYPRESS");
				this.oApp.registerBrowserEvent(a, "keyup",
						"EVENT_EDITING_AREA_KEYUP");
				this.oApp.registerBrowserEvent(a, "scroll",
						"EVENT_EDITING_AREA_SCROLL")
			},
			createCoverDiv : function() {
				this.elResizingBoard = document.createElement("DIV");
				this.elEditingAreaContainer.insertBefore(this.elResizingBoard,
						this.elEditingAreaContainer.firstChild);
				this.elResizingBoard.style.position = "absolute";
				this.elResizingBoard.style.background = "#000000";
				this.elResizingBoard.style.zIndex = 100;
				this.elResizingBoard.style.border = 1;
				this.elResizingBoard.style.opacity = 0;
				this.elResizingBoard.style.filter = "alpha(opacity=0.0)";
				this.elResizingBoard.style.MozOpacity = 0;
				this.elResizingBoard.style["-moz-opacity"] = 0;
				this.elResizingBoard.style["-khtml-opacity"] = 0;
				this._fitElementInEditingArea(this.elResizingBoard);
				this.elResizingBoard.style.width = this.elEditingAreaContainer.offsetWidth
						+ "px";
				this.elResizingBoard.style.display = "none"
			},
			$ON_GET_COVER_DIV : function(a, b) {
				if (!!this.elResizingBoard) {
					b[a] = this.elResizingBoard
				}
			},
			getIR : function() {
				if (!this.oActivePlugin) {
					return ""
				}
				return this.oActivePlugin.getIR()
			},
			setIR : function(b, a) {
				this.oApp.exec("SET_IR", [ b, a ])
			},
			getRawContents : function() {
				if (!this.oActivePlugin) {
					return ""
				}
				return this.oActivePlugin.getRawContents()
			},
			getContents : function() {
				var b = this.oApp.getIR();
				var a;
				if (this.oApp.applyConverter) {
					a = this.oApp.applyConverter("IR_TO_DB", b, this.oApp
							.getWYSIWYGDocument())
				} else {
					a = b
				}
				a = this._cleanContents(a);
				return a
			},
			_cleanContents : function(a) {
				return a.replace(new RegExp("(<img [^>]*>)"
						+ unescape("%uFEFF") + "", "ig"), "$1")
			},
			setContents : function(a, b) {
				var c;
				if (this.oApp.applyConverter) {
					c = this.oApp.applyConverter("DB_TO_IR", a, this.oApp
							.getWYSIWYGDocument())
				} else {
					c = a
				}
				this.oApp.exec("SET_IR", [ c, b ])
			},
			getEditingMode : function() {
				return this.oActivePlugin.sMode
			},
			getEditingAreaWidth : function() {
				return this.elEditingAreaContainer.offsetWidth
			},
			getEditingAreaHeight : function() {
				return this.elEditingAreaContainer.offsetHeight
			}
		});
nhn.husky.SE_EditingAreaVerticalResizer = jindo.$Class({
	name : "SE_EditingAreaVerticalResizer",
	oResizeGrip : null,
	sCookieNotice : "bHideResizeNotice",
	nEditingAreaMinHeight : null,
	$init : function(a) {
		this._assignHTMLElements(a)
	},
	$ON_MSG_APP_READY : function() {
		this.$FnMouseDown = jindo.$Fn(this._mousedown, this);
		this.$FnMouseMove = jindo.$Fn(this._mousemove, this);
		this.$FnMouseUp = jindo.$Fn(this._mouseup, this);
		this.$FnMouseOver = jindo.$Fn(this._mouseover, this);
		this.$FnMouseOut = jindo.$Fn(this._mouseout, this);
		this.$FnMouseDown.attach(this.oResizeGrip, "mousedown");
		this.$FnMouseOver.attach(this.oResizeGrip, "mouseover");
		this.$FnMouseOut.attach(this.oResizeGrip, "mouseout");
		jindo.$Fn(this._closeNotice, this)
				.attach(this.elCloseLayerBtn, "click");
		this.oApp.exec("REGISTER_HOTKEY", [ "shift+esc", "FOCUS_RESIZER" ]);
		this.oApp.exec("ADD_APP_PROPERTY", [ "checkResizeGripPosition",
				jindo.$Fn(this.checkResizeGripPosition, this).bind() ]);
		if (!!this.welNoticeLayer
				&& !Number(jindo.$Cookie().get(this.sCookieNotice))) {
			this.welNoticeLayer.show()
		}
		if (!!this.oApp.getEditingAreaHeight) {
			this.nEditingAreaMinHeight = this.oApp.getEditingAreaHeight()
		}
	},
	checkResizeGripPosition : function(b) {
		var a = jindo.$Document();
		var c = (jindo.$Element(this.oResizeGrip).offset().top
				- a.scrollPosition().top + 25)
				- a.clientSize().height;
		if (c <= 0) {
			return
		}
		if (b) {
			if (this.nEditingAreaMinHeight > this.oApp.getEditingAreaHeight()
					- c) {
				c = (-1)
						* (this.nEditingAreaMinHeight - this.oApp
								.getEditingAreaHeight())
			}
			this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED");
			this.oApp.exec("RESIZE_EDITING_AREA_BY", [ 0, (-1) * c ]);
			this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED")
		}
		this.oApp.exec("STOP_AUTORESIZE_EDITING_AREA")
	},
	$ON_FOCUS_RESIZER : function() {
		this.oApp.exec("IE_HIDE_CURSOR");
		this.oResizeGrip.focus()
	},
	_assignHTMLElements : function(a) {
		this.oResizeGrip = jindo.$$.getSingle(
				"BUTTON.husky_seditor_editingArea_verticalResizer", a);
		this.elNoticeLayer = jindo.$$.getSingle(
				"DIV.husky_seditor_resize_notice", a);
		this.welConversionMode = jindo.$Element(this.oResizeGrip.parentNode);
		if (!!this.elNoticeLayer) {
			this.welNoticeLayer = jindo.$Element(this.elNoticeLayer);
			this.elCloseLayerBtn = jindo.$$.getSingle("BUTTON.bt_clse",
					this.elNoticeLayer)
		}
	},
	_mouseover : function(a) {
		a.stopBubble();
		this.welConversionMode.addClass("controller_on")
	},
	_mouseout : function(a) {
		a.stopBubble();
		this.welConversionMode.removeClass("controller_on")
	},
	_mousedown : function(a) {
		this.iStartHeight = a.pos().clientY;
		this.iStartHeightOffset = a.pos().layerY;
		this.$FnMouseMove.attach(document, "mousemove");
		this.$FnMouseUp.attach(document, "mouseup");
		this.iStartHeight = a.pos().clientY;
		this.oApp.exec("HIDE_ACTIVE_LAYER");
		this.oApp.exec("HIDE_ALL_DIALOG_LAYER");
		this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED", [ this.$FnMouseDown,
				this.$FnMouseMove, this.$FnMouseUp ])
	},
	_mousemove : function(b) {
		var a = b.pos().clientY - this.iStartHeight;
		this.oApp.exec("RESIZE_EDITING_AREA_BY", [ 0, a ])
	},
	_mouseup : function(a) {
		this.$FnMouseMove.detach(document, "mousemove");
		this.$FnMouseUp.detach(document, "mouseup");
		this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED", [ this.$FnMouseDown,
				this.$FnMouseMove, this.$FnMouseUp ])
	},
	_closeNotice : function() {
		this.welNoticeLayer.hide();
		jindo.$Cookie().set(this.sCookieNotice, 1, 365 * 10)
	}
});
nhn.husky.SE_EditingArea_HTMLSrc = jindo.$Class({
	name : "SE_EditingArea_HTMLSrc",
	sMode : "HTMLSrc",
	bAutoResize : false,
	nMinHeight : null,
	$init : function(a) {
		this.elEditingArea = jindo.$(a)
	},
	$BEFORE_MSG_APP_READY : function() {
		this.oNavigator = jindo.$Agent().navigator();
		this.oApp.exec("REGISTER_EDITING_AREA", [ this ])
	},
	$ON_MSG_APP_READY : function() {
		if (!!this.oApp.getEditingAreaHeight) {
			this.nMinHeight = this.oApp.getEditingAreaHeight()
		}
	},
	$ON_CHANGE_EDITING_MODE : function(a) {
		if (a == this.sMode) {
			this.elEditingArea.style.display = "block"
		} else {
			this.elEditingArea.style.display = "none"
		}
	},
	$AFTER_CHANGE_EDITING_MODE : function(a) {
		if (a == this.sMode) {
			var b = new TextRange(this.elEditingArea);
			b.setSelection(0, 0);
			if (!!this.oNavigator.msafari) {
				this.elEditingArea.blur()
			}
		}
	},
	startAutoResize : function() {
		var a = {
			nMinHeight : this.nMinHeight,
			wfnCallback : jindo.$Fn(this.oApp.checkResizeGripPosition, this)
					.bind()
		};
		this.bAutoResize = true;
		this.AutoResizer = new nhn.husky.AutoResizer(this.elEditingArea, a);
		this.AutoResizer.bind()
	},
	stopAutoResize : function() {
		this.AutoResizer.unbind()
	},
	getIR : function() {
		var a = this.getRawContents();
		if (this.oApp.applyConverter) {
			a = this.oApp.applyConverter(this.sMode + "_TO_IR", a, this.oApp
					.getWYSIWYGDocument())
		}
		return a
	},
	setIR : function(b) {
		if (b.toLowerCase() === "<br>" || b.toLowerCase() === "<p>&nbsp;</p>"
				|| b.toLowerCase() === "<p><br></p>") {
			b = ""
		}
		var a = b;
		if (this.oApp.applyConverter) {
			a = this.oApp.applyConverter("IR_TO_" + this.sMode, a, this.oApp
					.getWYSIWYGDocument())
		}
		this.setRawContents(a)
	},
	setRawContents : function(a) {
		if (typeof a !== "undefined") {
			this.elEditingArea.value = a
		}
	},
	getRawContents : function() {
		return this.elEditingArea.value
	},
	focus : function() {
		this.elEditingArea.focus()
	}
});
if (typeof window.TextRange == "undefined") {
	window.TextRange = {}
}
TextRange = function(b, a) {
	this._o = b;
	this._oDoc = (a || document)
};
TextRange.prototype.getSelection = function() {
	var d = this._o;
	var b = [ -1, -1 ];
	if (isNaN(this._o.selectionStart)) {
		d.focus();
		var a = this._oDoc.body.createTextRange();
		var c = null;
		c = this._oDoc.selection.createRange().duplicate();
		a.moveToElementText(d);
		c.collapse(true);
		a.setEndPoint("EndToEnd", c);
		b[0] = a.text.length;
		c = this._oDoc.selection.createRange().duplicate();
		a.moveToElementText(d);
		c.collapse(false);
		a.setEndPoint("EndToEnd", c);
		b[1] = a.text.length;
		d.blur()
	} else {
		b[0] = d.selectionStart;
		b[1] = d.selectionEnd
	}
	return b
};
TextRange.prototype.setSelection = function(d, a) {
	var c = this._o;
	if (typeof a == "undefined") {
		a = d
	}
	if (c.setSelectionRange) {
		c.setSelectionRange(d, a)
	} else {
		if (c.createTextRange) {
			var b = c.createTextRange();
			b.collapse(true);
			b.moveStart("character", d);
			b.moveEnd("character", a - d);
			b.select();
			c.blur()
		}
	}
};
TextRange.prototype.copy = function() {
	var a = this.getSelection();
	return this._o.value.substring(a[0], a[1])
};
TextRange.prototype.paste = function(c) {
	var h = this._o;
	var f = this.getSelection();
	var e = h.value;
	var g = e.substr(0, f[0]);
	var d = e.substr(f[1]);
	e = g + c + d;
	h.value = e;
	var j = 0;
	if (typeof this._oDoc.body.style.maxHeight == "undefined") {
		var b = g.match(/\n/gi);
		j = (b !== null ? b.length : 0)
	}
	this.setSelection(f[0] + c.length - j)
};
TextRange.prototype.cut = function() {
	var a = this.copy();
	this.paste("");
	return a
};
nhn.husky.SE_EditingArea_TEXT = jindo.$Class({
	name : "SE_EditingArea_TEXT",
	sMode : "TEXT",
	sRxConverter : "@[0-9]+@",
	bAutoResize : false,
	nMinHeight : null,
	$init : function(a) {
		this.elEditingArea = jindo.$(a)
	},
	$BEFORE_MSG_APP_READY : function() {
		this.oNavigator = jindo.$Agent().navigator();
		this.oApp.exec("REGISTER_EDITING_AREA", [ this ]);
		this.oApp.exec("ADD_APP_PROPERTY", [ "getTextAreaContents",
				jindo.$Fn(this.getRawContents, this).bind() ])
	},
	$ON_MSG_APP_READY : function() {
		if (!!this.oApp.getEditingAreaHeight) {
			this.nMinHeight = this.oApp.getEditingAreaHeight()
		}
	},
	$ON_REGISTER_CONVERTERS : function() {
		this.oApp.exec("ADD_CONVERTER", [ "IR_TO_TEXT",
				jindo.$Fn(this.irToText, this).bind() ]);
		this.oApp.exec("ADD_CONVERTER", [ "TEXT_TO_IR",
				jindo.$Fn(this.textToIr, this).bind() ])
	},
	$ON_CHANGE_EDITING_MODE : function(a) {
		if (a == this.sMode) {
			this.elEditingArea.style.display = "block"
		} else {
			this.elEditingArea.style.display = "none"
		}
	},
	$AFTER_CHANGE_EDITING_MODE : function(a) {
		if (a == this.sMode) {
			var b = new TextRange(this.elEditingArea);
			b.setSelection(0, 0)
		}
		if (!!this.oNavigator.msafari) {
			this.elEditingArea.blur()
		}
	},
	irToText : function(d) {
		var a = d, b = 0;
		var c = a.match(new RegExp(this.sRxConverter));
		if (c !== null) {
			a = a.replace(new RegExp(this.sRxConverter), "")
		}
		a = a.replace(/\r/g, "");
		a = a.replace(/[\n|\t]/g, "");
		a = a.replace(/[\v|\f]/g, "");
		a = a.replace(/<p><br><\/p>/gi, "\n");
		a = a.replace(/<P>&nbsp;<\/P>/gi, "\n");
		a = a.replace(/<br(\s)*\/?>/gi, "\n");
		a = a.replace(/<br(\s[^\/]*)?>/gi, "\n");
		a = a.replace(/<\/p(\s[^\/]*)?>/gi, "\n");
		a = a.replace(/<\/li(\s[^\/]*)?>/gi, "\n");
		a = a.replace(/<\/tr(\s[^\/]*)?>/gi, "\n");
		b = a.lastIndexOf("\n");
		if (b > -1 && a.substring(b) == "\n") {
			a = a.substring(0, b)
		}
		a = jindo.$S(a).stripTags().toString();
		a = this.unhtmlSpecialChars(a);
		if (c !== null) {
			a = c[0] + a
		}
		return a
	},
	textToIr : function(c) {
		if (!c) {
			return
		}
		var a = c, b = null;
		b = a.match(new RegExp(this.sRxConverter));
		if (b !== null) {
			a = a.replace(b[0], "")
		}
		a = this.htmlSpecialChars(a);
		a = this._addLineBreaker(a);
		if (b !== null) {
			a = b[0] + a
		}
		return a
	},
	_addLineBreaker : function(b) {
		if (this.oApp.sLineBreaker === "BR") {
			return b.replace(/\r?\n/g, "<BR>")
		}
		var c = new StringBuffer(), f = b.split("\n"), e = f.length, d = "";
		for ( var a = 0; a < e; a++) {
			d = jindo.$S(f[a]).trim().$value();
			if (a === e - 1 && d === "") {
				break
			}
			if (d !== null && d !== "") {
				c.append("<P>");
				c.append(f[a]);
				c.append("</P>")
			} else {
				if (!jindo.$Agent().navigator().ie) {
					c.append("<P><BR></P>")
				} else {
					c.append("<P>&nbsp;</P>")
				}
			}
		}
		return c.toString()
	},
	startAutoResize : function() {
		var a = {
			nMinHeight : this.nMinHeight,
			wfnCallback : jindo.$Fn(this.oApp.checkResizeGripPosition, this)
					.bind()
		};
		this.bAutoResize = true;
		this.AutoResizer = new nhn.husky.AutoResizer(this.elEditingArea, a);
		this.AutoResizer.bind()
	},
	stopAutoResize : function() {
		this.AutoResizer.unbind()
	},
	getIR : function() {
		var a = this.getRawContents();
		if (this.oApp.applyConverter) {
			a = this.oApp.applyConverter(this.sMode + "_TO_IR", a, this.oApp
					.getWYSIWYGDocument())
		}
		return a
	},
	setIR : function(b) {
		var a = b;
		if (this.oApp.applyConverter) {
			a = this.oApp.applyConverter("IR_TO_" + this.sMode, a, this.oApp
					.getWYSIWYGDocument())
		}
		this.setRawContents(a)
	},
	setRawContents : function(a) {
		if (typeof a !== "undefined") {
			this.elEditingArea.value = a
		}
	},
	getRawContents : function() {
		return this.elEditingArea.value
	},
	focus : function() {
		this.elEditingArea.focus()
	},
	htmlSpecialChars : function(a) {
		return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,
				"&gt;").replace(/ /g, "&nbsp;")
	},
	unhtmlSpecialChars : function(a) {
		return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g,
				" ").replace(/&amp;/g, "&")
	}
});
nhn.husky.SE_EditingArea_WYSIWYG = jindo
		.$Class({
			name : "SE_EditingArea_WYSIWYG",
			status : nhn.husky.PLUGIN_STATUS.NOT_READY,
			sMode : "WYSIWYG",
			iframe : null,
			doc : null,
			bStopCheckingBodyHeight : false,
			bAutoResize : false,
			nBodyMinHeight : 0,
			nScrollbarWidth : 0,
			iLastUndoRecorded : 0,
			_nIFrameReadyCount : 50,
			bWYSIWYGEnabled : false,
			$init : function(b) {
				this.iframe = jindo.$(b);
				var a = jindo.$Agent().navigator();
				if (a.ie) {
					this.iframe.style.display = "none"
				}
				this.sBlankPageURL = "smart_editor2_inputarea.html";
				this.sBlankPageURL_EmulateIE7 = "smart_editor2_inputarea_ie8.html";
				this.aAddtionalEmulateIE7 = [];
				this.htOptions = nhn.husky.SE2M_Configuration.SE_EditingAreaManager;
				if (this.htOptions) {
					this.sBlankPageURL = this.htOptions.sBlankPageURL
							|| this.sBlankPageURL;
					this.sBlankPageURL_EmulateIE7 = this.htOptions.sBlankPageURL_EmulateIE7
							|| this.sBlankPageURL_EmulateIE7;
					this.aAddtionalEmulateIE7 = this.htOptions.aAddtionalEmulateIE7
							|| this.aAddtionalEmulateIE7
				}
				this.aAddtionalEmulateIE7.push(8);
				this.sIFrameSrc = this.sBlankPageURL;
				if (a.ie
						&& jindo.$A(this.aAddtionalEmulateIE7).has(
								a.nativeVersion)) {
					this.sIFrameSrc = this.sBlankPageURL_EmulateIE7
				}
				this.iframe.src = this.sIFrameSrc;
				this.initIframe();
				this.elEditingArea = b
			},
			$BEFORE_MSG_APP_READY : function() {
				this.oEditingArea = this.iframe.contentWindow.document;
				this.oApp.exec("REGISTER_EDITING_AREA", [ this ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getWYSIWYGWindow",
						jindo.$Fn(this.getWindow, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getWYSIWYGDocument",
						jindo.$Fn(this.getDocument, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "isWYSIWYGEnabled",
						jindo.$Fn(this.isWYSIWYGEnabled, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "getRawHTMLContents",
						jindo.$Fn(this.getRawHTMLContents, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "setRawHTMLContents",
						jindo.$Fn(this.setRawHTMLContents, this).bind() ]);
				if (!!this.isWYSIWYGEnabled()) {
					this.oApp.exec("ENABLE_WYSIWYG_RULER", [])
				}
				this.oApp.registerBrowserEvent(this.getDocument().body,
						"paste", "EVENT_EDITING_AREA_PASTE")
			},
			$ON_MSG_APP_READY : function() {
				if (!this.oApp.hasOwnProperty("saveSnapShot")) {
					this.$ON_EVENT_EDITING_AREA_MOUSEUP = function() {
					};
					this._recordUndo = function() {
					}
				}
				this._bIERangeReset = true;
				if (jindo.$Agent().navigator().ie) {
					jindo
							.$Fn(
									function(a) {
										if (this.iframe.contentWindow.document.selection.type
												.toLowerCase() === "control"
												&& a.key().keyCode === 8) {
											this.oApp.exec("EXECCOMMAND", [
													"delete", false, false ]);
											a.stop()
										}
										this._bIERangeReset = false
									}, this).attach(
									this.iframe.contentWindow.document,
									"keydown");
					jindo.$Fn(function(a) {
						this._oIERange = null;
						this._bIERangeReset = true
					}, this).attach(this.iframe.contentWindow.document.body,
							"mousedown");
					jindo.$Fn(this._onIEBeforeDeactivate, this).attach(
							this.iframe.contentWindow.document.body,
							"beforedeactivate");
					jindo.$Fn(function(a) {
						this._bIERangeReset = false
					}, this).attach(this.iframe.contentWindow.document.body,
							"mouseup")
				} else {
				}
				this.fnSetBodyHeight = jindo.$Fn(this._setBodyHeight, this)
						.bind();
				this.fnCheckBodyChange = jindo.$Fn(this._checkBodyChange, this)
						.bind();
				this.fnSetBodyHeight();
				this._setScrollbarWidth()
			},
			_setScrollbarWidth : function() {
				var a = this.getDocument(), b = a.createElement("div");
				b.style.width = "100px";
				b.style.height = "100px";
				b.style.overflow = "scroll";
				b.style.position = "absolute";
				b.style.top = "-9999px";
				a.body.appendChild(b);
				this.nScrollbarWidth = b.offsetWidth - b.clientWidth;
				a.body.removeChild(b)
			},
			$AFTER_EVENT_EDITING_AREA_KEYUP : function(a) {
				if (!this.bAutoResize) {
					return
				}
				var b = a.key();
				if ((b.keyCode >= 33 && b.keyCode <= 40) || b.alt || b.ctrl
						|| b.keyCode === 16) {
					return
				}
				this._setAutoResize()
			},
			$AFTER_PASTE_HTML : function() {
				if (!this.bAutoResize) {
					return
				}
				this._setAutoResize()
			},
			startAutoResize : function() {
				this.oApp.exec("STOP_CHECKING_BODY_HEIGHT");
				this.bAutoResize = true;
				var a = this.oApp.oNavigator;
				if (a.ie && a.version < 9) {
					jindo.$Element(this.getDocument().body).css({
						overflow : "visible"
					})
				} else {
					jindo.$Element(this.getDocument().body).css({
						overflowX : "visible",
						overflowY : "hidden"
					})
				}
				this._setAutoResize();
				this.nCheckBodyInterval = setInterval(this.fnCheckBodyChange,
						500);
				this.oApp.exec("START_FLOAT_TOOLBAR")
			},
			stopAutoResize : function() {
				this.bAutoResize = false;
				clearInterval(this.nCheckBodyInterval);
				this.oApp.exec("STOP_FLOAT_TOOLBAR");
				jindo.$Element(this.getDocument().body).css({
					overflow : "visible",
					overflowY : "visible"
				});
				this.oApp.exec("START_CHECKING_BODY_HEIGHT")
			},
			_checkBodyChange : function() {
				if (!this.bAutoResize) {
					return
				}
				var a = this.getDocument().body.innerHTML.length;
				if (a !== this.nBodyLength) {
					this.nBodyLength = a;
					this._setAutoResize()
				}
			},
			_getResizeHeight : function() {
				var d = this.getDocument().body, b, f, a = [ "width",
						"fontFamily", "fontSize", "fontWeight", "fontStyle",
						"lineHeight", "letterSpacing", "textTransform",
						"wordSpacing" ], e, c;
				if (!this.oApp.oNavigator.firefox
						&& !this.oApp.oNavigator.safari) {
					if (this.oApp.oNavigator.ie
							&& this.oApp.oNavigator.version === 8
							&& document.documentMode === 8) {
						jindo.$Element(d).css("height", "0px")
					}
					f = parseInt(d.scrollHeight, 10);
					if (f < this.nBodyMinHeight) {
						f = this.nBodyMinHeight
					}
					return f
				}
				if (!this.elDummy) {
					this.elDummy = document.createElement("div");
					this.elDummy.className = "se2_input_wysiwyg";
					this.oApp.elEditingAreaContainer.appendChild(this.elDummy);
					this.elDummy.style.cssText = "position:absolute !important; left:-9999px !important; top:-9999px !important; z-index: -9999 !important; overflow: auto !important;";
					this.elDummy.style.height = this.nBodyMinHeight + "px"
				}
				b = jindo.$Element(d);
				c = a.length;
				e = {};
				while (c--) {
					e[a[c]] = b.css(a[c])
				}
				if (e.lineHeight.indexOf("px") > -1) {
					e.lineHeight = (parseInt(e.lineHeight, 10) / parseInt(
							e.fontSize, 10))
				}
				jindo.$Element(this.elDummy).css(e);
				this.elDummy.innerHTML = d.innerHTML;
				f = this.elDummy.scrollHeight;
				return f
			},
			_setAutoResize : function() {
				var g = this.getDocument().body, c = jindo.$Element(g), h, d, b, f, e = false, a = this.oApp.oNavigator;
				this.nTopBottomMargin = this.nTopBottomMargin
						|| (parseInt(c.css("marginTop"), 10) + parseInt(c
								.css("marginBottom"), 10));
				this.nBodyMinHeight = this.nBodyMinHeight
						|| (this.oApp.getEditingAreaHeight() - this.nTopBottomMargin);
				if ((a.ie && a.nativeVersion >= 9) || a.chrome) {
					c.css("height", "0px");
					this.iframe.style.height = "0px"
				}
				h = this._getResizeHeight();
				if (a.ie) {
					if (h > this.nBodyMinHeight) {
						b = this.oApp.getCurrentStyle();
						f = parseInt(b.fontSize, 10) * b.lineHeight;
						if (f < this.nTopBottomMargin) {
							f = this.nTopBottomMargin
						}
						d = h + f;
						d += 18;
						e = true
					} else {
						h = this.nBodyMinHeight;
						d = this.nBodyMinHeight + this.nTopBottomMargin
					}
				} else {
					if (h > this.nBodyMinHeight) {
						b = this.oApp.getCurrentStyle();
						f = parseInt(b.fontSize, 10) * b.lineHeight;
						if (f < this.nTopBottomMargin) {
							f = this.nTopBottomMargin
						}
						d = h + f;
						e = true
					} else {
						h = this.nBodyMinHeight;
						d = this.nBodyMinHeight + this.nTopBottomMargin
					}
				}
				if (!a.firefox) {
					c.css("height", h + "px")
				}
				this.iframe.style.height = d + "px";
				this.oApp.welEditingAreaContainer.height(d);
				this.oApp.checkResizeGripPosition(e)
			},
			_setBodyHeight : function() {
				if (this.bStopCheckingBodyHeight) {
					return
				}
				var e = this.getDocument().body, b = jindo.$Element(e), h = parseInt(
						b.css("marginTop"), 10)
						+ parseInt(b.css("marginBottom"), 10), a = this.oApp
						.getEditingAreaHeight(), d = a - h, g = b.height(), f, c;
				this.nTopBottomMargin = h;
				if (g === 0) {
					b.css("height", d + "px");
					setTimeout(this.fnSetBodyHeight, 500);
					return
				}
				b.css("height", "0px");
				f = parseInt(e.scrollHeight, 10);
				c = (f > a ? f - h : d);
				if (this._isHorizontalScrollbarVisible()) {
					c -= this.nScrollbarWidth
				}
				b.css("height", c + "px");
				setTimeout(this.fnSetBodyHeight, 500)
			},
			_isHorizontalScrollbarVisible : function() {
				var a = this.getDocument();
				if (a.documentElement.clientWidth < a.documentElement.scrollWidth) {
					return true
				}
				return false
			},
			$ON_STOP_CHECKING_BODY_HEIGHT : function() {
				if (!this.bStopCheckingBodyHeight) {
					this.bStopCheckingBodyHeight = true
				}
			},
			$ON_START_CHECKING_BODY_HEIGHT : function() {
				if (this.bStopCheckingBodyHeight) {
					this.bStopCheckingBodyHeight = false;
					this.fnSetBodyHeight()
				}
			},
			$ON_IE_CHECK_EXCEPTION_FOR_SELECTION_PRESERVATION : function() {
				if (this.getDocument().selection.type === "Control") {
					this._oIERange = null
				}
			},
			_onIEBeforeDeactivate : function(b) {
				var a, c;
				this.oApp.delayedExec(
						"IE_CHECK_EXCEPTION_FOR_SELECTION_PRESERVATION", [], 0);
				if (this._oIERange) {
					return
				}
				if (this._bIERangeReset) {
					return
				}
				this._oIERange = this.oApp.getSelection().cloneRange()
			},
			$ON_CHANGE_EDITING_MODE : function(a, b) {
				if (a === this.sMode) {
					this.iframe.style.display = "block";
					this.oApp.exec("REFRESH_WYSIWYG", []);
					this.oApp.exec("SET_EDITING_WINDOW", [ this.getWindow() ]);
					this.oApp.exec("START_CHECKING_BODY_HEIGHT")
				} else {
					this.iframe.style.display = "none";
					this.oApp.exec("STOP_CHECKING_BODY_HEIGHT")
				}
			},
			$AFTER_CHANGE_EDITING_MODE : function(a, b) {
				this._oIERange = null
			},
			$ON_REFRESH_WYSIWYG : function() {
				if (!jindo.$Agent().navigator().firefox) {
					return
				}
				this._disableWYSIWYG();
				this._enableWYSIWYG()
			},
			$ON_ENABLE_WYSIWYG : function() {
				this._enableWYSIWYG()
			},
			$ON_DISABLE_WYSIWYG : function() {
				this._disableWYSIWYG()
			},
			$ON_IE_HIDE_CURSOR : function() {
				if (!this.oApp.oNavigator.ie) {
					return
				}
				this._onIEBeforeDeactivate();
				if (this.oApp.getWYSIWYGDocument().selection.createRange) {
					try {
						this.oApp.getWYSIWYGDocument().selection.empty()
					} catch (b) {
						var a = this.oApp.getSelection();
						a.select();
						a.oBrowserSelection.selectNone()
					}
				} else {
					this.oApp.getEmptySelection().oBrowserSelection
							.selectNone()
				}
			},
			$AFTER_SHOW_ACTIVE_LAYER : function() {
				this.oApp.exec("IE_HIDE_CURSOR", []);
				this.bActiveLayerShown = true
			},
			$BEFORE_EVENT_EDITING_AREA_KEYDOWN : function(a) {
				this._bKeyDown = true
			},
			$ON_EVENT_EDITING_AREA_KEYDOWN : function(a) {
				if (this.oApp.getEditingMode() !== this.sMode) {
					return
				}
				var b = a.key();
				if (this.oApp.oNavigator.ie) {
					switch (b.keyCode) {
					case 33:
						this._pageUp(a);
						break;
					case 34:
						this._pageDown(a);
						break;
					case 8:
						this._backspaceTable(a);
						break;
					default:
					}
				} else {
					if (this.oApp.oNavigator.firefox) {
						if (b.keyCode === 8) {
							this._backspaceTable(a)
						}
					}
				}
				this._recordUndo(b)
			},
			_backspaceTable : function(b) {
				var a = this.oApp.getSelection(), c = null;
				if (!a.collapsed) {
					return
				}
				c = a.getNodeAroundRange(true, false);
				if (c && c.nodeType === 3 && /^[\n]*$/.test(c.nodeValue)) {
					c = c.previousSibling
				}
				if (!!c && c.nodeType === 1 && c.tagName === "TABLE") {
					jindo.$Element(c).leave();
					b.stop(jindo.$Event.CANCEL_ALL)
				}
			},
			$BEFORE_EVENT_EDITING_AREA_KEYUP : function(a) {
				if (!this._bKeyDown) {
					return false
				}
				this._bKeyDown = false
			},
			$ON_EVENT_EDITING_AREA_MOUSEUP : function(a) {
				this.oApp.saveSnapShot()
			},
			$BEFORE_PASTE_HTML : function() {
				if (this.oApp.getEditingMode() !== this.sMode) {
					this.oApp.exec("CHANGE_EDITING_MODE", [ this.sMode ])
				}
			},
			$ON_PASTE_HTML : function(b, g, e) {
				var c, j, f, l, h, d, k, a;
				if (this.oApp.getEditingMode() !== this.sMode) {
					return
				}
				if (!e) {
					this.oApp.exec("RECORD_UNDO_BEFORE_ACTION",
							[ "PASTE HTML" ])
				}
				j = jindo.$Agent().navigator();
				c = g || this.oApp.getSelection();
				if (j.ie && j.nativeVersion == 8 && document.documentMode == 8) {
					b = b + unescape("%uFEFF")
				}
				c.pasteHTML(b);
				if (!j.ie) {
					f = c.placeStringBookmark();
					this.oApp.getWYSIWYGDocument().body.innerHTML = this.oApp
							.getWYSIWYGDocument().body.innerHTML;
					c.moveToBookmark(f);
					c.collapseToEnd();
					c.select();
					c.removeStringBookmark(f);
					c = this.oApp.getSelection();
					if (!!g) {
						g.setRange(c)
					}
				} else {
					c.collapseToEnd();
					c.select();
					this._oIERange = null;
					this._bIERangeReset = false
				}
				if (b.indexOf("<img") > -1) {
					l = c.startContainer;
					if (l.nodeType === 1 && l.tagName === "P") {
						h = jindo.$Element(l).child(
								function(m) {
									return (m.$value().nodeType === 1 && m
											.$value().tagName === "IMG")
								}, 1);
						if (h.length > 0) {
							d = h[h.length - 1].$value();
							k = d.nextSibling;
							while (k) {
								a = k.nextSibling;
								if (k.nodeType === 3
										&& (k.nodeValue === "&nbsp;" || k.nodeValue === unescape("%u00A0"))) {
									l.removeChild(k)
								}
								k = a
							}
						}
					}
				}
				if (!e) {
					this.oApp
							.exec("RECORD_UNDO_AFTER_ACTION", [ "PASTE HTML" ])
				}
			},
			$ON_FOCUS_N_CURSOR : function(c, a) {
				c = c || true;
				var b = this.oApp.getSelection();
				if (jindo.$Agent().navigator().ie && !b.collapsed) {
					if (c) {
						b.collapseToEnd()
					} else {
						b.collapseToStart()
					}
					b.select()
				} else {
					if (!!b.collapsed && !a) {
						this.oApp.exec("FOCUS")
					} else {
						if (!!a) {
							setTimeout(
									jindo.$Fn(function(d) {
										this._scrollIntoView(d);
										this.oApp.exec("FOCUS")
									}, this).bind(
											this.getDocument()
													.getElementById(a)), 300)
						}
					}
				}
			},
			_getElementVerticalPosition : function(b) {
				var a = 0, c = b, d = {
					nTop : 0,
					nBottom : 0
				};
				if (!b) {
					return d
				}
				while (c) {
					a += c.offsetTop;
					c = c.offsetParent
				}
				d.nTop = a;
				d.nBottom = a + jindo.$Element(b).height();
				return d
			},
			_getVisibleVerticalPosition : function() {
				var a, b, d, c = {
					nTop : 0,
					nBottom : 0
				};
				a = this.getWindow();
				b = this.getDocument();
				d = a.innerHeight ? a.innerHeight
						: b.documentElement.clientHeight || b.body.clientHeight;
				c.nTop = a.pageYOffset || b.documentElement.scrollTop;
				c.nBottom = c.nTop + d;
				return c
			},
			_isElementVisible : function(b, a) {
				return (b.nTop >= a.nTop && b.nBottom <= a.nBottom)
			},
			_scrollIntoView : function(c) {
				var d = this._getElementVerticalPosition(c), b = this
						._getVisibleVerticalPosition(), a = 0;
				if (this._isElementVisible(d, b)) {
					return
				}
				if ((a = d.nBottom - b.nBottom) > 0) {
					this.getWindow().scrollTo(0, b.nTop + a);
					return
				}
				this.getWindow().scrollTo(0, d.nTop)
			},
			$BEFORE_MSG_EDITING_AREA_RESIZE_STARTED : function() {
				if (!jindo.$Agent().navigator().ie) {
					var a = null;
					a = this.oApp.getSelection();
					this.sBM = a.placeStringBookmark()
				}
			},
			$AFTER_MSG_EDITING_AREA_RESIZE_ENDED : function(a, b, d) {
				if (this.oApp.getEditingMode() !== this.sMode) {
					return
				}
				this.oApp.exec("REFRESH_WYSIWYG", []);
				if (!jindo.$Agent().navigator().ie) {
					var c = this.oApp.getEmptySelection();
					c.moveToBookmark(this.sBM);
					c.select();
					c.removeStringBookmark(this.sBM)
				}
			},
			$ON_CLEAR_IE_BACKUP_SELECTION : function() {
				this._oIERange = null
			},
			$ON_RESTORE_IE_SELECTION : function() {
				if (this._oIERange) {
					try {
						this._oIERange.select();
						this._oPrevIERange = this._oIERange;
						this._oIERange = null
					} catch (a) {
					}
				}
			},
			$ON_EVENT_EDITING_AREA_PASTE : function(a) {
				this.oApp.delayedExec("EVENT_EDITING_AREA_PASTE_DELAY", [ a ],
						0)
			},
			$ON_EVENT_EDITING_AREA_PASTE_DELAY : function(a) {
				this._replaceBlankToNbsp(a.element)
			},
			_replaceBlankToNbsp : function(c) {
				var b = this.oApp.oNavigator;
				if (!b.ie) {
					return
				}
				if (b.nativeVersion !== 9 || document.documentMode !== 7) {
					return
				}
				if (c.nodeType !== 1) {
					return
				}
				if (c.tagName === "BR") {
					return
				}
				var a = jindo.$$("p:empty()",
						this.oApp.getWYSIWYGDocument().body, {
							oneTimeOffCache : true
						});
				jindo.$A(a).forEach(function(e, d, f) {
					e.innerHTML = "&nbsp;"
				})
			},
			_pageUp : function(c) {
				var b = this._getEditorHeight(), d = jindo.$Document(
						this.oApp.getWYSIWYGDocument()).scrollPosition(), a;
				if (d.top <= b) {
					a = 0
				} else {
					a = d.top - b
				}
				this.oApp.getWYSIWYGWindow().scrollTo(0, a);
				c.stop()
			},
			_pageDown : function(c) {
				var b = this._getEditorHeight(), d = jindo.$Document(
						this.oApp.getWYSIWYGDocument()).scrollPosition(), e = this
						._getBodyHeight(), a;
				if (d.top + b >= e) {
					a = e - b
				} else {
					a = d.top + b
				}
				this.oApp.getWYSIWYGWindow().scrollTo(0, a);
				c.stop()
			},
			_getEditorHeight : function() {
				return this.oApp.elEditingAreaContainer.offsetHeight
						- this.nTopBottomMargin
			},
			_getBodyHeight : function() {
				return parseInt(this.getDocument().body.scrollHeight, 10)
			},
			tidyNbsp : function() {
				var a, b;
				if (!this.oApp.oNavigator.ie) {
					return
				}
				b = this.oApp.getWYSIWYGDocument().body
						.getElementsByTagName("P");
				for (a = 0; a < b.length; a++) {
					if (b[a].childNodes.length === 1
							&& b[a].innerHTML === "&nbsp;") {
						b[a].innerHTML = ""
					}
				}
			},
			initIframe : function() {
				try {
					if (!this.iframe.contentWindow.document
							|| !this.iframe.contentWindow.document.body
							|| this.iframe.contentWindow.document.location.href === "about:blank") {
						throw new Error("Access denied")
					}
					this._enableWYSIWYG();
					this.status = nhn.husky.PLUGIN_STATUS.READY
				} catch (a) {
					if (this._nIFrameReadyCount-- > 0) {
						setTimeout(jindo.$Fn(this.initIframe, this).bind(), 100)
					} else {
						throw ("iframe for WYSIWYG editing mode can't be initialized. Please check if the iframe document exists and is also accessable(cross-domain issues). ")
					}
				}
			},
			getIR : function() {
				var a = this.iframe.contentWindow.document.body.innerHTML, b;
				if (this.oApp.applyConverter) {
					b = this.oApp.applyConverter(this.sMode + "_TO_IR", a,
							this.oApp.getWYSIWYGDocument())
				} else {
					b = a
				}
				return b
			},
			setIR : function(c) {
				var b, a = jindo.$Agent().navigator();
				if (this.oApp.applyConverter) {
					b = this.oApp.applyConverter("IR_TO_" + this.sMode, c,
							this.oApp.getWYSIWYGDocument())
				} else {
					b = c
				}
				if (a.ie && a.nativeVersion >= 9 && document.documentMode >= 9) {
					b = b.replace(/[\r\n]/g, "")
				}
				this.iframe.contentWindow.document.body.innerHTML = b;
				if (!a.ie) {
					if ((this.iframe.contentWindow.document.body.innerHTML)
							.replace(/[\r\n\t\s]*/, "") === "") {
						this.iframe.contentWindow.document.body.innerHTML = "<br>"
					}
				} else {
					if (this.oApp.getEditingMode() === this.sMode) {
						this.tidyNbsp()
					}
				}
			},
			getRawContents : function() {
				return this.iframe.contentWindow.document.body.innerHTML
			},
			getRawHTMLContents : function() {
				return this.getRawContents()
			},
			setRawHTMLContents : function(a) {
				this.iframe.contentWindow.document.body.innerHTML = a
			},
			getWindow : function() {
				return this.iframe.contentWindow
			},
			getDocument : function() {
				return this.iframe.contentWindow.document
			},
			focus : function() {
				this.getDocument().body.focus();
				this.oApp.exec("RESTORE_IE_SELECTION", [])
			},
			_recordUndo : function(a) {
				if (a.keyCode >= 33 && a.keyCode <= 40) {
					this.oApp.saveSnapShot();
					return
				}
				if (a.alt || a.ctrl || a.keyCode === 16) {
					return
				}
				if (this.oApp.getLastKey() === a.keyCode) {
					return
				}
				this.oApp.setLastKey(a.keyCode);
				if (!a.enter && a.keyCode !== 46 && a.keyCode !== 8) {
					return
				}
				this.oApp.exec("RECORD_UNDO_ACTION", [
						"KEYPRESS(" + a.keyCode + ")", {
							bMustBlockContainer : true
						} ])
			},
			_enableWYSIWYG : function() {
				if (this.iframe.contentWindow.document.body.contentEditable !== null) {
					this.iframe.contentWindow.document.body.contentEditable = true
				} else {
					this.iframe.contentWindow.document.designMode = "on"
				}
				this.bWYSIWYGEnabled = true;
				if (jindo.$Agent().navigator().firefox) {
					setTimeout(jindo.$Fn(
							function() {
								this.iframe.contentWindow.document.execCommand(
										"enableInlineTableEditing", false,
										false)
							}, this).bind(), 0)
				}
			},
			_disableWYSIWYG : function() {
				if (this.iframe.contentWindow.document.body.contentEditable !== null) {
					this.iframe.contentWindow.document.body.contentEditable = false
				} else {
					this.iframe.contentWindow.document.designMode = "off"
				}
				this.bWYSIWYGEnabled = false
			},
			isWYSIWYGEnabled : function() {
				return this.bWYSIWYGEnabled
			}
		});
nhn.husky.SE_WYSIWYGEnterKey = jindo
		.$Class({
			name : "SE_WYSIWYGEnterKey",
			$init : function(a) {
				if (a == "BR") {
					this.sLineBreaker = "BR"
				} else {
					this.sLineBreaker = "P"
				}
				this.htBrowser = jindo.$Agent().navigator();
				if (this.htBrowser.opera && this.sLineBreaker == "P") {
					this.$ON_MSG_APP_READY = function() {
					}
				}
				if (this.htBrowser.ie) {
					this._addCursorHolder = this._addCursorHolderSpace;
					if (this.htBrowser.nativeVersion < 9
							|| document.documentMode < 9) {
						this._addExtraCursorHolder = function() {
						};
						this._addBlankTextAllSpan = function() {
						}
					}
				} else {
					this._addExtraCursorHolder = function() {
					};
					this._addBlankText = function() {
					};
					this._addBlankTextAllSpan = function() {
					}
				}
			},
			$ON_MSG_APP_READY : function() {
				this.oApp.exec("ADD_APP_PROPERTY", [ "sLineBreaker",
						this.sLineBreaker ]);
				this.oSelection = this.oApp.getEmptySelection();
				this.tmpTextNode = this.oSelection._document
						.createTextNode(unescape("%u00A0"));
				jindo.$Fn(this._onKeyDown, this).attach(
						this.oApp.getWYSIWYGDocument(), "keydown")
			},
			_onKeyDown : function(a) {
				var b = a.key();
				if (b.shift) {
					return
				}
				if (b.enter) {
					if (this.sLineBreaker == "BR") {
						this._insertBR(a)
					} else {
						this._wrapBlock(a)
					}
				}
			},
			$ON_REGISTER_CONVERTERS : function() {
				this.oApp.exec("ADD_CONVERTER", [ "IR_TO_DB",
						jindo.$Fn(this.onIrToDB, this).bind() ])
			},
			onIrToDB : function(b) {
				var a = b, c = /<br(\s[^>]*)?\/?>((?:<\/span>)?<\/p>)/gi;
				if (this.htBrowser.chrome || this.htBrowser.firefox) {
					if (c.test(a)) {
						a = a.replace(c, "&nbsp;$2")
					}
				}
				return a
			},
			_addBlankText : function(c) {
				var g = c.getNodes(), b, e, f, d, a;
				for (b = 0, e = g.length; b < e; b++) {
					f = g[b];
					if (f.nodeType !== 1 || f.tagName !== "SPAN") {
						continue
					}
					if (f.id.indexOf(c.HUSKY_BOOMARK_START_ID_PREFIX) > -1
							|| f.id.indexOf(c.HUSKY_BOOMARK_END_ID_PREFIX) > -1) {
						continue
					}
					d = f.firstChild;
					if (!d
							|| (d.nodeType == 3 && nhn.husky.SE2M_Utils
									.isBlankTextNode(d))
							|| (d.nodeType == 1 && f.childNodes.length == 1 && (d.id
									.indexOf(c.HUSKY_BOOMARK_START_ID_PREFIX) > -1 || d.id
									.indexOf(c.HUSKY_BOOMARK_END_ID_PREFIX) > -1))) {
						a = c._document.createTextNode(unescape("%uFEFF"));
						f.appendChild(a)
					}
				}
			},
			_addCursorHolder : function(b) {
				var a = b;
				if (b.innerHTML == "" || (a = this._getStyleOnlyNode(b))) {
					a.innerHTML = "<br>"
				}
				if (!a) {
					a = this._getStyleNode(b)
				}
				return a
			},
			_addCursorHolderSpace : function(b) {
				var a;
				this._addSpace(b);
				a = this._getStyleNode(b);
				if (a.innerHTML == "") {
					a.innerHTML = unescape("%uFEFF")
				}
				return a
			},
			_wrapBlock : function(k, m) {
				var c = this.oApp.getSelection(), j = c.placeStringBookmark(), o = c
						.getLineInfo(), n = o.oStart, d = o.oEnd, l, e, h;
				if (!n.bParentBreak
						|| c.rxBlockContainer.test(n.oLineBreaker.tagName)) {
					k.stop();
					c.deleteContents();
					if (!!n.oNode.parentNode
							&& n.oNode.parentNode.nodeType !== 11) {
						l = this.oApp.getWYSIWYGDocument().createElement(
								this.sLineBreaker);
						c.moveToBookmark(j);
						c.setStartBefore(n.oNode);
						this._addBlankText(c);
						c.surroundContents(l);
						c.collapseToEnd();
						e = this.oApp.getWYSIWYGDocument().createElement(
								this.sLineBreaker);
						c.setEndAfter(d.oNode);
						this._addBlankText(c);
						c.surroundContents(e);
						c.moveToStringBookmark(j, true);
						c.collapseToEnd();
						c.removeStringBookmark(j);
						c.select();
						h = this._addCursorHolder(l);
						if (e.lastChild !== null && e.lastChild.tagName == "BR") {
							e.removeChild(e.lastChild)
						}
						h = this._addCursorHolder(e);
						if (e.nextSibling && e.nextSibling.tagName == "BR") {
							e.parentNode.removeChild(e.nextSibling)
						}
						c.selectNodeContents(h);
						c.collapseToStart();
						c.select();
						this.oApp.exec("CHECK_STYLE_CHANGE", []);
						j = c.placeStringBookmark();
						setTimeout(jindo.$Fn(function(p) {
							var q = c.getStringBookmark(p);
							if (!q) {
								return
							}
							c.moveToStringBookmark(p);
							c.select();
							c.removeStringBookmark(p)
						}, this).bind(j), 0);
						return
					}
				}
				var g;
				if (this.htBrowser.firefox) {
					g = c.getStringBookmark(j, true);
					if (g && g.nextSibling && g.nextSibling.tagName == "IFRAME") {
						setTimeout(jindo.$Fn(function(p) {
							var q = c.getStringBookmark(p);
							if (!q) {
								return
							}
							c.moveToStringBookmark(p);
							c.select();
							c.removeStringBookmark(p)
						}, this).bind(j), 0)
					} else {
						c.removeStringBookmark(j)
					}
				} else {
					if (this.htBrowser.ie) {
						g = c.getStringBookmark(j, true);
						var f = g.parentNode, b = false, a = false;
						if (!g || !f) {
							c.removeStringBookmark(j);
							return
						}
						c.removeStringBookmark(j);
						b = (f.tagName === "U" || nhn.husky.SE2M_Utils
								.findAncestorByTagName("U", f) !== null);
						a = (f.tagName === "S" || f.tagName === "STRIKE" || (nhn.husky.SE2M_Utils
								.findAncestorByTagName("S", f) !== null && nhn.husky.SE2M_Utils
								.findAncestorByTagName("STRIKE", f) !== null));
						if (b || a) {
							setTimeout(jindo.$Fn(this._addTextDecorationTag,
									this).bind(b, a), 0);
							return
						}
						setTimeout(jindo.$Fn(this._addExtraCursorHolder, this)
								.bind(f), 0)
					} else {
						c.removeStringBookmark(j)
					}
				}
			},
			_addExtraCursorHolder : function(h) {
				var g, d, a;
				h = this._getStyleOnlyNode(h);
				if (!!h && h.tagName === "SPAN") {
					g = h.lastChild;
					while (!!g) {
						d = g.previousSibling;
						if (g.nodeType !== 3) {
							g = d;
							continue
						}
						if (nhn.husky.SE2M_Utils.isBlankTextNode(g)) {
							g.parentNode.removeChild(g)
						}
						g = d
					}
					a = h.innerHTML;
					if (a === "" || a.replace(unescape("%uFEFF"), "") === "") {
						h.innerHTML = unescape("%uFEFF")
					}
				}
				var f = this.oApp.getSelection(), c, b, e;
				if (!f.collapsed) {
					return
				}
				f.fixCommonAncestorContainer();
				b = f.commonAncestorContainer;
				if (!b) {
					return
				}
				b = f._getVeryFirstRealChild(b);
				if (b.nodeType === 3) {
					b = b.parentNode
				}
				if (!b || b.tagName !== "SPAN") {
					return
				}
				a = b.innerHTML;
				if (a === "" || a.replace(unescape("%uFEFF"), "") === "") {
					b.innerHTML = unescape("%uFEFF")
				}
				e = nhn.husky.SE2M_Utils.findAncestorByTagName("P", b);
				f.selectNodeContents(b);
				c = f.placeStringBookmark();
				this._addSpace(e.previousSibling);
				this._addSpace(e);
				f.moveToBookmark(c);
				f.selectNodeContents(b);
				f.collapseToStart();
				f.select();
				f.removeStringBookmark(c)
			},
			_addSpace : function(b) {
				var a, d, h, c, e, g, f;
				if (!b) {
					return
				}
				if (b.nodeType === 3) {
					return b.parentNode
				}
				if (b.tagName !== "P") {
					return b
				}
				g = jindo.$Element(b)
						.child(
								function(j) {
									return (j.$value().nodeType === 1 && j
											.$value().tagName === "IMG")
								}, 1);
				if (g.length > 0) {
					f = g[g.length - 1].$value();
					h = f.nextSibling;
					while (h) {
						c = h.nextSibling;
						if (h.nodeType === 3
								&& (h.nodeValue === "&nbsp;" || h.nodeValue === unescape("%u00A0"))) {
							b.removeChild(h)
						}
						h = c
					}
					return b
				}
				d = b.innerHTML;
				h = b.firstChild;
				c = h;
				e = false;
				while (h) {
					c = h.nextSibling;
					if (h.nodeType === 3) {
						if (h.nodeValue === unescape("%uFEFF")) {
							b.removeChild(h)
						}
						if (!e
								&& (h.nodeValue === "&nbsp;" || h.nodeValue === unescape("%u00A0"))) {
							e = true
						}
					}
					h = c
				}
				if (!e) {
					a = this.tmpTextNode.cloneNode();
					b.appendChild(a)
				}
				return b
			},
			_addTextDecorationTag : function(f, b) {
				var e, c, d = this.oApp.getSelection();
				if (!d.collapsed) {
					return
				}
				e = d.startContainer;
				while (e) {
					if (e.nodeType === 3) {
						e = nhn.DOMFix.parentNode(e);
						break
					}
					if (!e.childNodes || e.childNodes.length === 0) {
						e.innerHTML = unescape("%uFEFF");
						break
					}
					e = e.firstChild
				}
				if (!e) {
					return
				}
				if (e.tagName === "U" || e.tagName === "S"
						|| e.tagName === "STRIKE") {
					return
				}
				var a;
				if (e.innerHTML == "" || (a = this._getStyleOnlyNode(e))) {
					this._addSpace(a, e)
				}
				if (f) {
					c = d._document.createElement("U");
					e.appendChild(c);
					e = c
				}
				if (b) {
					c = d._document.createElement("STRIKE");
					e.appendChild(c)
				}
				c.innerHTML = unescape("%uFEFF");
				d.selectNodeContents(c);
				d.collapseToEnd();
				d.select()
			},
			_addBlankTextAllSpan : function(b) {
				var d, a, e, c;
				if (!b) {
					return
				}
				d = jindo.$Element(b)
						.child(
								function(f) {
									return (f.$value().nodeType === 1 && f
											.$value().tagName === "SPAN")
								});
				a = d.length;
				for (c = 0; c < a; c++) {
					e = d[c].html();
					if (e === "") {
						d[c].html(unescape("%uFEFF"))
					}
				}
			},
			_getStyleNode : function(a) {
				while (a.firstChild
						&& this.oSelection._isBlankTextNode(a.firstChild)) {
					a.removeChild(a.firstChild)
				}
				var b = a.firstChild;
				if (!b) {
					return a
				}
				if (b.nodeType === 3
						|| (b.nodeType === 1 && (b.tagName == "IMG"
								|| b.tagName == "BR" || b.tagName == "HR" || b.tagName == "IFRAME"))) {
					return a
				}
				return this._getStyleNode(a.firstChild)
			},
			_getStyleOnlyNode : function(a) {
				if (!a) {
					return null
				}
				if (!a.insertBefore) {
					return null
				}
				if (a.tagName == "IMG" || a.tagName == "BR"
						|| a.tagName == "HR" || a.tagName == "IFRAME") {
					return null
				}
				while (a.firstChild
						&& this.oSelection._isBlankTextNode(a.firstChild)) {
					a.removeChild(a.firstChild)
				}
				if (a.childNodes.length > 1) {
					return null
				}
				if (!a.firstChild) {
					return a
				}
				if (a.firstChild.nodeType === 3) {
					return nhn.husky.SE2M_Utils.isBlankTextNode(a.firstChild) ? a
							: null
				}
				return this._getStyleOnlyNode(a.firstChild)
			},
			_insertBR : function(b) {
				b.stop();
				var e = this.oApp.getSelection();
				var f = this.oApp.getWYSIWYGDocument().createElement("BR");
				e.insertNode(f);
				e.selectNode(f);
				e.collapseToEnd();
				if (!this.htBrowser.ie) {
					var c = e.getLineInfo();
					var d = c.oEnd;
					if (d.bParentBreak) {
						while (d.oNode && d.oNode.nodeType == 3
								&& d.oNode.nodeValue == "") {
							d.oNode = d.oNode.previousSibling
						}
						var a = 1;
						if (d.oNode == f || d.oNode.nextSibling == f) {
							a = 0
						}
						if (a === 0) {
							e.pasteHTML("<br type='_moz'/>");
							e.collapseToEnd()
						}
					}
				}
				e.insertNode(this.oApp.getWYSIWYGDocument().createTextNode(""));
				e.select()
			}
		});
nhn.ColorPicker = jindo
		.$Class(
				{
					elem : null,
					huePanel : null,
					canvasType : "Canvas",
					_hsvColor : null,
					$init : function(c, b) {
						this.elem = jindo.$Element(c).empty();
						this.huePanel = null;
						this.cursor = jindo.$Element("<div>").css("overflow",
								"hidden");
						this.canvasType = jindo.$(c).filters ? "Filter" : jindo
								.$("<canvas>").getContext ? "Canvas" : null;
						if (!this.canvasType) {
							return false
						}
						this.option({
							huePanel : null,
							huePanelType : "horizontal"
						});
						this.option(b);
						if (this.option("huePanel")) {
							this.huePanel = jindo.$Element(
									this.option("huePanel")).empty()
						}
						this._hsvColor = this._hsv(0, 100, 100);
						for ( var a in this) {
							if (/^_on[A-Z][a-z]+[A-Z][a-z]+$/.test(a)) {
								this[a + "Fn"] = jindo.$Fn(this[a], this)
							}
						}
						this._onDownColorFn.attach(this.elem, "mousedown");
						if (this.huePanel) {
							this._onDownHueFn
									.attach(this.huePanel, "mousedown")
						}
						this.paint()
					},
					rgb : function(a) {
						this.hsv(this._rgb2hsv(a.r, a.g, a.b))
					},
					hsv : function(d) {
						if (typeof d == "undefined") {
							return this._hsvColor
						}
						var f = null;
						var k = this.elem.width();
						var c = this.elem.height();
						var b = this.cursor.width();
						var a = this.cursor.height();
						var j = 0, g = 0;
						if (this.huePanel) {
							f = this._hsv2rgb(d.h, 100, 100);
							this.elem.css("background", "#"
									+ this._rgb2hex(f.r, f.g, f.b));
							j = d.s / 100 * k;
							g = (100 - d.v) / 100 * c
						} else {
							var e = k / 2;
							if (d.v > d.s) {
								d.v = 100;
								j = d.s / 100 * e
							} else {
								d.s = 100;
								j = (100 - d.v) / 100 * e + e
							}
							g = d.h / 360 * c
						}
						j = Math.max(Math.min(j - 1, k - b), 1);
						g = Math.max(Math.min(g - 1, c - a), 1);
						this.cursor.css({
							left : j + "px",
							top : g + "px"
						});
						this._hsvColor = d;
						f = this._hsv2rgb(d.h, d.s, d.v);
						this.fireEvent("colorchange", {
							type : "colorchange",
							element : this,
							currentElement : this,
							rgbColor : f,
							hexColor : "#" + this._rgb2hex(f.r, f.g, f.b),
							hsvColor : d
						})
					},
					paint : function() {
						if (this.huePanel) {
							this["_paintColWith" + this.canvasType]();
							this["_paintHueWith" + this.canvasType]()
						} else {
							this["_paintOneWith" + this.canvasType]()
						}
						this.cursor.appendTo(this.elem);
						this.cursor.css({
							position : "absolute",
							top : "1px",
							left : "1px",
							background : "white",
							border : "1px solid black"
						}).width(3).height(3);
						this.hsv(this._hsvColor)
					},
					_paintColWithFilter : function() {
						jindo
								.$Element("<div>")
								.css(
										{
											position : "absolute",
											top : 0,
											left : 0,
											width : "100%",
											height : "100%",
											filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=1,StartColorStr='#FFFFFFFF',EndColorStr='#00FFFFFF')"
										}).appendTo(this.elem);
						jindo
								.$Element("<div>")
								.css(
										{
											position : "absolute",
											top : 0,
											left : 0,
											width : "100%",
											height : "100%",
											filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr='#00000000',EndColorStr='#FF000000')"
										}).appendTo(this.elem)
					},
					_paintColWithCanvas : function() {
						var e = jindo.$Element("<canvas>").css({
							width : "100%",
							height : "100%"
						});
						e.appendTo(this.elem.empty());
						var b = e.attr("width", e.width()).attr("height",
								e.height()).$value().getContext("2d");
						var d = null;
						var a = e.width();
						var c = e.height();
						d = b.createLinearGradient(0, 0, a, 0);
						d.addColorStop(0, "rgba(255,255,255,1)");
						d.addColorStop(1, "rgba(255,255,255,0)");
						b.fillStyle = d;
						b.fillRect(0, 0, a, c);
						d = b.createLinearGradient(0, 0, 0, c);
						d.addColorStop(0, "rgba(0,0,0,0)");
						d.addColorStop(1, "rgba(0,0,0,1)");
						b.fillStyle = d;
						b.fillRect(0, 0, a, c)
					},
					_paintOneWithFilter : function() {
						var g, b, a, f, d, j;
						var e = this.elem.height();
						for ( var c = 1; c < 7; c++) {
							g = Math.floor((c - 1) / 6 * e);
							b = Math.floor(c / 6 * e);
							a = this._hsv2rgb((c - 1) / 6 * 360, 100, 100);
							f = this._hsv2rgb(c / 6 * 360, 100, 100);
							d = "#FF" + this._rgb2hex(a.r, a.g, a.b);
							j = "#FF" + this._rgb2hex(f.r, f.g, f.b);
							jindo
									.$Element("<div>")
									.css(
											{
												position : "absolute",
												left : 0,
												width : "100%",
												top : g + "px",
												height : (b - g) + "px",
												filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr='"
														+ d
														+ "',EndColorStr='"
														+ j + "')"
											}).appendTo(this.elem)
						}
						jindo
								.$Element("<div>")
								.css(
										{
											position : "absolute",
											top : 0,
											left : 0,
											width : "50%",
											height : "100%",
											filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=1,StartColorStr='#FFFFFFFF',EndColorStr='#00FFFFFF')"
										}).appendTo(this.elem);
						jindo
								.$Element("<div>")
								.css(
										{
											position : "absolute",
											top : 0,
											right : 0,
											width : "50%",
											height : "100%",
											filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType=1,StartColorStr='#00000000',EndColorStr='#FF000000')"
										}).appendTo(this.elem)
					},
					_paintOneWithCanvas : function() {
						var c = {
							r : 0,
							g : 0,
							b : 0
						};
						var g = jindo.$Element("<canvas>").css({
							width : "100%",
							height : "100%"
						});
						g.appendTo(this.elem.empty());
						var b = g.attr("width", g.width()).attr("height",
								g.height()).$value().getContext("2d");
						var a = g.width();
						var e = g.height();
						var f = b.createLinearGradient(0, 0, 0, e);
						for ( var d = 0; d < 7; d++) {
							c = this._hsv2rgb(d / 6 * 360, 100, 100);
							f.addColorStop(d / 6, "rgb(" + c.join(",") + ")")
						}
						b.fillStyle = f;
						b.fillRect(0, 0, a, e);
						f = b.createLinearGradient(0, 0, a, 0);
						f.addColorStop(0, "rgba(255,255,255,1)");
						f.addColorStop(0.5, "rgba(255,255,255,0)");
						f.addColorStop(0.5, "rgba(0,0,0,0)");
						f.addColorStop(1, "rgba(0,0,0,1)");
						b.fillStyle = f;
						b.fillRect(0, 0, a, e)
					},
					_paintHueWithFilter : function() {
						var b, o, n, c, j, l;
						var k = (this.option().huePanelType == "vertical");
						var m = this.huePanel.width();
						var g = this.huePanel.height();
						var d = null;
						var f = parseInt(this.huePanel.css("borderWidth"), 10);
						if (!!isNaN(f)) {
							f = 0
						}
						m -= f * 2;
						for ( var e = 1; e < 7; e++) {
							b = Math.floor((e - 1) / 6 * (k ? g : m));
							o = Math.floor(e / 6 * (k ? g : m));
							n = this._hsv2rgb((e - 1) / 6 * 360, 100, 100);
							c = this._hsv2rgb(e / 6 * 360, 100, 100);
							j = "#FF" + this._rgb2hex(n.r, n.g, n.b);
							l = "#FF" + this._rgb2hex(c.r, c.g, c.b);
							d = jindo
									.$Element("<div>")
									.css(
											{
												position : "absolute",
												filter : "progid:DXImageTransform.Microsoft.Gradient(GradientType="
														+ (k ? 0 : 1)
														+ ",StartColorStr='"
														+ j
														+ "',EndColorStr='"
														+ l + "')"
											});
							var a = (o - b) + 1;
							d.appendTo(this.huePanel);
							d.css(k ? "left" : "top", 0).css(
									k ? "width" : "height", "100%");
							d.css(k ? "top" : "left", b + "px").css(
									k ? "height" : "width", a + "px")
						}
					},
					_paintHueWithCanvas : function() {
						var e = this.option(), c;
						var b = (e.huePanelType == "vertical");
						var g = jindo.$Element("<canvas>").css({
							width : "100%",
							height : "100%"
						});
						g.appendTo(this.huePanel.empty());
						var a = g.attr("width", g.width()).attr("height",
								g.height()).$value().getContext("2d");
						var f = a.createLinearGradient(0, 0, b ? 0 : g.width(),
								b ? g.height() : 0);
						for ( var d = 0; d < 7; d++) {
							c = this._hsv2rgb(d / 6 * 360, 100, 100);
							f.addColorStop(d / 6, "rgb(" + c.join(",") + ")")
						}
						a.fillStyle = f;
						a.fillRect(0, 0, g.width(), g.height())
					},
					_rgb2hsv : function(k, j, a) {
						var f = 0, e = 0, c = Math.max(k, j, a), d = Math.min(
								k, j, a), l = c - d;
						e = (c ? l / c : 0);
						if (e) {
							if (k == c) {
								f = 60 * (j - a) / l
							} else {
								if (j == c) {
									f = 120 + 60 * (a - k) / l
								} else {
									if (a == c) {
										f = 240 + 60 * (k - j) / l
									}
								}
							}
							if (f < 0) {
								f += 360
							}
						}
						f = Math.floor(f);
						e = Math.floor(e * 100);
						c = Math.floor(c / 255 * 100);
						return this._hsv(f, e, c)
					},
					_hsv2rgb : function(j, u, n) {
						j = (j % 360) / 60;
						u /= 100;
						n /= 100;
						var a = 0, k = 0, m = 0;
						var e = Math.floor(j);
						var l = j - e;
						var d = n * (1 - u);
						var c = n * (1 - u * l);
						var o = n * (1 - u * (1 - l));
						switch (e) {
						case 0:
							a = n;
							k = o;
							m = d;
							break;
						case 1:
							a = c;
							k = n;
							m = d;
							break;
						case 2:
							a = d;
							k = n;
							m = o;
							break;
						case 3:
							a = d;
							k = c;
							m = n;
							break;
						case 4:
							a = o;
							k = d;
							m = n;
							break;
						case 5:
							a = n;
							k = d;
							m = c;
							break;
						case 6:
							break
						}
						a = Math.floor(a * 255);
						k = Math.floor(k * 255);
						m = Math.floor(m * 255);
						return this._rgb(a, k, m)
					},
					_rgb2hex : function(d, c, a) {
						d = d.toString(16);
						if (d.length == 1) {
							d = "0" + d
						}
						c = c.toString(16);
						if (c.length == 1) {
							c = "0" + c
						}
						a = a.toString(16);
						if (a.length == 1) {
							a = "0" + a
						}
						return d + c + a
					},
					_hex2rgb : function(b) {
						var a = b.match(/#?([0-9a-f]{6}|[0-9a-f]{3})/i);
						if (a[1].length == 3) {
							a = a[1].match(/./g).filter(function(d) {
								return d + d
							})
						} else {
							a = a[1].match(/../g)
						}
						return {
							r : Number("0x" + a[0]),
							g : Number("0x" + a[1]),
							b : Number("0x" + a[2])
						}
					},
					_rgb : function(e, d, a) {
						var c = [ e, d, a ];
						c.r = e;
						c.g = d;
						c.b = a;
						return c
					},
					_hsv : function(d, c, a) {
						var b = [ d, c, a ];
						b.h = d;
						b.s = c;
						b.v = a;
						return b
					},
					_onDownColor : function(a) {
						if (!a.mouse().left) {
							return false
						}
						var b = a.pos();
						this._colPagePos = [ b.pageX, b.pageY ];
						this._colLayerPos = [ b.layerX, b.layerY ];
						this._onUpColorFn.attach(document, "mouseup");
						this._onMoveColorFn.attach(document, "mousemove");
						this._onMoveColor(a)
					},
					_onUpColor : function(a) {
						this._onUpColorFn.detach(document, "mouseup");
						this._onMoveColorFn.detach(document, "mousemove")
					},
					_onMoveColor : function(g) {
						var d = this._hsvColor;
						var k = g.pos();
						var b = this._colLayerPos[0]
								+ (k.pageX - this._colPagePos[0]);
						var j = this._colLayerPos[1]
								+ (k.pageY - this._colPagePos[1]);
						var c = this.elem.width();
						var f = this.elem.height();
						b = Math.max(Math.min(b, c), 0);
						j = Math.max(Math.min(j, f), 0);
						if (this.huePanel) {
							d.s = d[1] = b / c * 100;
							d.v = d[2] = (f - j) / f * 100
						} else {
							d.h = j / f * 360;
							var a = c / 2;
							if (b < a) {
								d.s = b / a * 100;
								d.v = 100
							} else {
								d.s = 100;
								d.v = (c - b) / a * 100
							}
						}
						this.hsv(d);
						g.stop()
					},
					_onDownHue : function(a) {
						if (!a.mouse().left) {
							return false
						}
						var b = a.pos();
						this._huePagePos = [ b.pageX, b.pageY ];
						this._hueLayerPos = [ b.layerX, b.layerY ];
						this._onUpHueFn.attach(document, "mouseup");
						this._onMoveHueFn.attach(document, "mousemove");
						this._onMoveHue(a)
					},
					_onUpHue : function(a) {
						this._onUpHueFn.detach(document, "mouseup");
						this._onMoveHueFn.detach(document, "mousemove")
					},
					_onMoveHue : function(d) {
						var c = this._hsvColor;
						var h = d.pos();
						var f = 0, b = 0;
						var a = this._hueLayerPos[0]
								+ (h.pageX - this._huePagePos[0]);
						var g = this._hueLayerPos[1]
								+ (h.pageY - this._huePagePos[1]);
						if (this.option().huePanelType == "vertical") {
							f = g;
							b = this.huePanel.height()
						} else {
							f = a;
							b = this.huePanel.width()
						}
						c.h = c[0] = (Math.min(Math.max(f, 0), b) / b * 360) % 360;
						this.hsv(c);
						d.stop()
					}
				}).extend(jindo.Component);
nhn.husky.SE2M_BGColor = jindo.$Class({
	name : "SE2M_BGColor",
	rxColorPattern : /^#?[0-9a-fA-F]{6}$|^rgb\(\d+, ?\d+, ?\d+\)$/i,
	$init : function(a) {
		this._assignHTMLElements(a)
	},
	_assignHTMLElements : function(a) {
		this.elLastUsed = jindo.$$.getSingle(
				"BUTTON.husky_se2m_BGColor_lastUsed", a);
		this.elDropdownLayer = jindo.$$.getSingle(
				"DIV.husky_se2m_BGColor_layer", a);
		this.elBGColorList = jindo.$$
				.getSingle("UL.husky_se2m_bgcolor_list", a);
		this.elPaletteHolder = jindo.$$.getSingle(
				"DIV.husky_se2m_BGColor_paletteHolder", this.elDropdownLayer);
		this._setLastUsedBGColor("#777777")
	},
	$ON_MSG_APP_READY : function() {
		this.oApp.exec("REGISTER_UI_EVENT", [ "BGColorA", "click",
				"APPLY_LAST_USED_BGCOLOR" ]);
		this.oApp.exec("REGISTER_UI_EVENT", [ "BGColorB", "click",
				"TOGGLE_BGCOLOR_LAYER" ]);
		this.oApp.registerBrowserEvent(this.elBGColorList, "click",
				"EVENT_APPLY_BGCOLOR", [])
	},
	$ON_TOGGLE_BGCOLOR_LAYER : function() {
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [ this.elDropdownLayer,
				null, "BGCOLOR_LAYER_SHOWN", [], "BGCOLOR_LAYER_HIDDEN", [] ]);
		this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "bgcolor" ])
	},
	$ON_BGCOLOR_LAYER_SHOWN : function() {
		this.oApp.exec("SELECT_UI", [ "BGColorB" ]);
		this.oApp.exec("SHOW_COLOR_PALETTE", [ "APPLY_BGCOLOR",
				this.elPaletteHolder ])
	},
	$ON_BGCOLOR_LAYER_HIDDEN : function() {
		this.oApp.exec("DESELECT_UI", [ "BGColorB" ]);
		this.oApp.exec("RESET_COLOR_PALETTE", [])
	},
	$ON_EVENT_APPLY_BGCOLOR : function(d) {
		var c = d.element;
		while (c.tagName == "SPAN") {
			c = c.parentNode
		}
		if (c.tagName != "BUTTON") {
			return
		}
		var b, a;
		b = c.style.backgroundColor;
		a = c.style.color;
		this.oApp.exec("APPLY_BGCOLOR", [ b, a ])
	},
	$ON_APPLY_LAST_USED_BGCOLOR : function() {
		this.oApp.exec("APPLY_BGCOLOR", [ this.sLastUsedColor ]);
		this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "bgcolor" ])
	},
	$ON_APPLY_BGCOLOR : function(c, a) {
		if (!this.rxColorPattern.test(c)) {
			alert(this.oApp.$MSG("SE_Color.invalidColorCode"));
			return
		}
		this._setLastUsedBGColor(c);
		var b = {
			backgroundColor : c
		};
		if (a) {
			b.color = a
		}
		this.oApp.exec("SET_WYSIWYG_STYLE", [ b ]);
		this.oApp.exec("HIDE_ACTIVE_LAYER")
	},
	_setLastUsedBGColor : function(a) {
		this.sLastUsedColor = a;
		this.elLastUsed.style.backgroundColor = this.sLastUsedColor
	}
});
nhn.husky.SE2M_ColorPalette = jindo
		.$Class(
				{
					name : "SE2M_ColorPalette",
					elAppContainer : null,
					bUseRecentColor : false,
					nLimitRecentColor : 17,
					rxRGBColorPattern : /rgb\((\d+), ?(\d+), ?(\d+)\)/i,
					rxColorPattern : /^#?[0-9a-fA-F]{6}$|^rgb\(\d+, ?\d+, ?\d+\)$/i,
					aRecentColor : [],
					URL_COLOR_LIST : "",
					URL_COLOR_ADD : "",
					URL_COLOR_UPDATE : "",
					sRecentColorTemp : '<li><button type="button" title="{RGB_CODE}" style="background:{RGB_CODE}"><span><span>{RGB_CODE}</span></span></button></li>',
					$init : function(a) {
						this.elAppContainer = a
					},
					$ON_MSG_APP_READY : function() {
					},
					_assignHTMLElements : function(b) {
						var a = nhn.husky.SE2M_Configuration.SE2M_ColorPalette;
						if (a) {
							this.bUseRecentColor = a.bUseRecentColor || false;
							this.URL_COLOR_ADD = a.addColorURL
									|| "http://api.se2.naver.com/1/colortable/TextAdd.nhn";
							this.URL_COLOR_UPDATE = a.updateColorURL
									|| "http://api.se2.naver.com/1/colortable/TextUpdate.nhn";
							this.URL_COLOR_LIST = a.colorListURL
									|| "http://api.se2.naver.com/1/colortable/TextList.nhn"
						}
						this.elColorPaletteLayer = jindo.$$.getSingle(
								"DIV.husky_se2m_color_palette", b);
						this.elColorPaletteLayerColorPicker = jindo.$$
								.getSingle(
										"DIV.husky_se2m_color_palette_colorpicker",
										this.elColorPaletteLayer);
						this.elRecentColorForm = jindo.$$.getSingle("form",
								this.elColorPaletteLayerColorPicker);
						this.elBackgroundColor = jindo.$$.getSingle(
								"ul.husky_se2m_bgcolor_list", b);
						this.elInputColorCode = jindo.$$.getSingle(
								"INPUT.husky_se2m_cp_colorcode",
								this.elColorPaletteLayerColorPicker);
						this.elPreview = jindo.$$.getSingle(
								"SPAN.husky_se2m_cp_preview",
								this.elColorPaletteLayerColorPicker);
						this.elCP_ColPanel = jindo.$$.getSingle(
								"DIV.husky_se2m_cp_colpanel",
								this.elColorPaletteLayerColorPicker);
						this.elCP_HuePanel = jindo.$$.getSingle(
								"DIV.husky_se2m_cp_huepanel",
								this.elColorPaletteLayerColorPicker);
						this.elCP_ColPanel.style.position = "relative";
						this.elCP_HuePanel.style.position = "relative";
						this.elColorPaletteLayerColorPicker.style.display = "none";
						this.elMoreBtn = jindo.$$.getSingle(
								"BUTTON.husky_se2m_color_palette_more_btn",
								this.elColorPaletteLayer);
						this.welMoreBtn = jindo.$Element(this.elMoreBtn);
						this.elOkBtn = jindo.$$.getSingle(
								"BUTTON.husky_se2m_color_palette_ok_btn",
								this.elColorPaletteLayer);
						if (this.bUseRecentColor) {
							this.elColorPaletteLayerRecent = jindo.$$
									.getSingle(
											"DIV.husky_se2m_color_palette_recent",
											this.elColorPaletteLayer);
							this.elRecentColor = jindo.$$.getSingle(
									"ul.se2_pick_color",
									this.elColorPaletteLayerRecent);
							this.elDummyNode = jindo.$$.getSingle(
									"ul.se2_pick_color > li",
									this.elColorPaletteLayerRecent)
									|| null;
							this.elColorPaletteLayerRecent.style.display = "none"
						}
					},
					$LOCAL_BEFORE_FIRST : function() {
						this._assignHTMLElements(this.elAppContainer);
						if (this.elDummyNode) {
							jindo.$Element(
									jindo.$$.getSingle(
											"ul.se2_pick_color > li",
											this.elColorPaletteLayerRecent))
									.leave()
						}
						if (this.bUseRecentColor) {
							this
									._ajaxRecentColor(this._ajaxRecentColorCallback)
						}
						this.oApp.registerBrowserEvent(
								this.elColorPaletteLayer, "click",
								"EVENT_CLICK_COLOR_PALETTE");
						this.oApp.registerBrowserEvent(this.elBackgroundColor,
								"mouseover", "EVENT_MOUSEOVER_COLOR_PALETTE");
						this.oApp.registerBrowserEvent(
								this.elColorPaletteLayer, "mouseover",
								"EVENT_MOUSEOVER_COLOR_PALETTE");
						this.oApp.registerBrowserEvent(this.elBackgroundColor,
								"mouseout", "EVENT_MOUSEOUT_COLOR_PALETTE");
						this.oApp.registerBrowserEvent(
								this.elColorPaletteLayer, "mouseout",
								"EVENT_MOUSEOUT_COLOR_PALETTE")
					},
					$ON_EVENT_MOUSEOVER_COLOR_PALETTE : function(b) {
						var a = b.element;
						while (a && a.tagName
								&& a.tagName.toLowerCase() != "li") {
							a = a.parentNode
						}
						if (!a || !a.nodeType || a.nodeType == 9) {
							return
						}
						if (a.className == "" || (!a.className)
								|| typeof (a.className) == "undefined") {
							jindo.$Element(a).addClass("hover")
						}
					},
					$ON_EVENT_MOUSEOUT_COLOR_PALETTE : function(b) {
						var a = b.element;
						while (a && a.tagName
								&& a.tagName.toLowerCase() != "li") {
							a = a.parentNode
						}
						if (!a) {
							return
						}
						if (a.className == "hover") {
							jindo.$Element(a).removeClass("hover")
						}
					},
					$ON_EVENT_CLICK_COLOR_PALETTE : function(b) {
						var a = b.element;
						while (a.tagName == "SPAN") {
							a = a.parentNode
						}
						if (a.tagName && a.tagName == "BUTTON") {
							if (a == this.elMoreBtn) {
								this.oApp.exec("TOGGLE_COLOR_PICKER");
								return
							}
							this.oApp.exec("APPLY_COLOR", [ a ])
						}
					},
					$ON_APPLY_COLOR : function(a) {
						var c = this.elInputColorCode.value, b = null;
						if (c.indexOf("#") == -1) {
							c = "#" + c;
							this.elInputColorCode.value = c
						}
						if (a == this.elOkBtn) {
							if (!this._verifyColorCode(c)) {
								this.elInputColorCode.value = "";
								alert(this.oApp
										.$MSG("SE_Color.invalidColorCode"));
								this.elInputColorCode.focus();
								return
							}
							this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [ c,
									true ]);
							return
						}
						b = jindo.$Element(a.parentNode.parentNode.parentNode);
						c = a.title;
						if (b.hasClass("husky_se2m_color_palette")) {
							this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [ c,
									false ])
						} else {
							if (b.hasClass("husky_se2m_color_palette_recent")) {
								this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [
										c, true ])
							}
						}
					},
					$ON_RESET_COLOR_PALETTE : function() {
						this._initColor()
					},
					$ON_TOGGLE_COLOR_PICKER : function() {
						if (this.elColorPaletteLayerColorPicker.style.display == "none") {
							this.oApp.exec("SHOW_COLOR_PICKER")
						} else {
							this.oApp.exec("HIDE_COLOR_PICKER")
						}
					},
					$ON_SHOW_COLOR_PICKER : function() {
						this.elColorPaletteLayerColorPicker.style.display = "";
						this.cpp = new nhn.ColorPicker(this.elCP_ColPanel, {
							huePanel : this.elCP_HuePanel
						});
						var a = jindo.$Fn(function(b) {
							this.elPreview.style.backgroundColor = b.hexColor;
							this.elInputColorCode.value = b.hexColor
						}, this).bind();
						this.cpp.attach("colorchange", a);
						this.$ON_SHOW_COLOR_PICKER = this._showColorPickerMain;
						this.$ON_SHOW_COLOR_PICKER()
					},
					$ON_HIDE_COLOR_PICKER : function() {
						this.elColorPaletteLayerColorPicker.style.display = "none";
						this.welMoreBtn.addClass("se2_view_more");
						this.welMoreBtn.removeClass("se2_view_more2")
					},
					$ON_SHOW_COLOR_PALETTE : function(b, a) {
						this.sCallbackCmd = b;
						this.oLayerContainer = a;
						this.oLayerContainer.insertBefore(
								this.elColorPaletteLayer, null);
						this.elColorPaletteLayer.style.display = "block";
						this.oApp
								.delayedExec(
										"POSITION_TOOLBAR_LAYER",
										[ this.elColorPaletteLayer.parentNode.parentNode ],
										0)
					},
					$ON_HIDE_COLOR_PALETTE : function() {
						this.elColorPaletteLayer.style.display = "none"
					},
					$ON_COLOR_PALETTE_APPLY_COLOR : function(b, a) {
						a = (!a) ? false : a;
						b = this._getHexColorCode(b);
						if (this.bUseRecentColor && !!a) {
							this.oApp.exec("ADD_RECENT_COLOR", [ b ])
						}
						this.oApp.exec(this.sCallbackCmd, [ b ])
					},
					$ON_EVENT_MOUSEUP_COLOR_PALETTE : function(a) {
						var b = a.element;
						if (!b.style.backgroundColor) {
							return
						}
						this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [
								b.style.backgroundColor, false ])
					},
					$ON_ADD_RECENT_COLOR : function(a) {
						var b = (this.aRecentColor.length === 0);
						this._addRecentColor(a);
						if (b) {
							this._ajaxAddColor()
						} else {
							this._ajaxUpdateColor()
						}
						this._redrawRecentColorElement()
					},
					_verifyColorCode : function(a) {
						return this.rxColorPattern.test(a)
					},
					_getHexColorCode : function(e) {
						if (this.rxRGBColorPattern.test(e)) {
							var a = function(f) {
								var g = parseInt(f, 10).toString(16);
								if (g.length < 2) {
									g = "0" + g
								}
								return g.toUpperCase()
							};
							var c = a(RegExp.$1);
							var b = a(RegExp.$2);
							var d = a(RegExp.$3);
							e = "#" + c + b + d
						}
						return e
					},
					_addRecentColor : function(a) {
						var b = jindo.$A(this.aRecentColor);
						b = b.refuse(a);
						b.unshift(a);
						if (b.length() > this.nLimitRecentColor) {
							b.length(this.nLimitRecentColor)
						}
						this.aRecentColor = b.$value()
					},
					_redrawRecentColorElement : function() {
						var a = [], c = this.aRecentColor.length, b;
						if (c === 0) {
							return
						}
						for (b = 0; b < c; b++) {
							a.push(this.sRecentColorTemp.replace(
									/\{RGB_CODE\}/gi, this.aRecentColor[b]))
						}
						this.elRecentColor.innerHTML = a.join("");
						this.elColorPaletteLayerRecent.style.display = "block"
					},
					_ajaxAddColor : function() {
						jindo.$Ajax(this.URL_COLOR_ADD, {
							type : "jsonp",
							onload : function() {
							}
						}).request({
							text_key : "colortable",
							text_data : this.aRecentColor.join(",")
						})
					},
					_ajaxUpdateColor : function() {
						jindo.$Ajax(this.URL_COLOR_UPDATE, {
							type : "jsonp",
							onload : function() {
							}
						}).request({
							text_key : "colortable",
							text_data : this.aRecentColor.join(",")
						})
					},
					_showColorPickerMain : function() {
						this._initColor();
						this.elColorPaletteLayerColorPicker.style.display = "";
						this.welMoreBtn.removeClass("se2_view_more");
						this.welMoreBtn.addClass("se2_view_more2")
					},
					_initColor : function() {
						if (this.cpp) {
							this.cpp.rgb({
								r : 0,
								g : 0,
								b : 0
							})
						}
						this.elPreview.style.backgroundColor = "#000000";
						this.elInputColorCode.value = "#000000";
						this.oApp.exec("HIDE_COLOR_PICKER")
					},
					_ajaxRecentColor : function(a) {
						jindo.$Ajax(this.URL_COLOR_LIST, {
							type : "jsonp",
							onload : jindo.$Fn(a, this).bind()
						}).request()
					},
					_ajaxRecentColorCallback : function(e) {
						var b = e.json()["result"], d, a, c;
						if (!b || !!b.error) {
							return
						}
						d = jindo.$A(b).filter(this._verifyColorCode, this);
						if (d.length() > this.nLimitRecentColor) {
							d.length(this.nLimitRecentColor)
						}
						b = d.reverse().$value();
						for (a = 0, c = b.length; a < c; a++) {
							this._addRecentColor(this._getHexColorCode(b[a]))
						}
						this._redrawRecentColorElement()
					}
				}).extend(jindo.Component);
nhn.husky.SE2M_ExecCommand = jindo
		.$Class({
			name : "SE2M_ExecCommand",
			oEditingArea : null,
			oUndoOption : null,
			$init : function(a) {
				this.oEditingArea = a;
				this.nIndentSpacing = 40;
				this.rxClickCr = new RegExp(
						"^bold|underline|italic|strikethrough|justifyleft|justifycenter|justifyright|justifyfull|insertorderedlist|insertunorderedlist|outdent|indent$",
						"i")
			},
			$BEFORE_MSG_APP_READY : function() {
				if (this.oEditingArea && this.oEditingArea.tagName == "IFRAME") {
					this.oEditingArea = this.oEditingArea.contentWindow.document
				}
			},
			$ON_MSG_APP_READY : function() {
				this.oApp.exec("REGISTER_HOTKEY", [ "ctrl+b", "EXECCOMMAND",
						[ "bold", false, false ] ]);
				this.oApp.exec("REGISTER_HOTKEY", [ "ctrl+u", "EXECCOMMAND",
						[ "underline", false, false ] ]);
				this.oApp.exec("REGISTER_HOTKEY", [ "ctrl+i", "EXECCOMMAND",
						[ "italic", false, false ] ]);
				this.oApp.exec("REGISTER_HOTKEY", [ "ctrl+d", "EXECCOMMAND",
						[ "strikethrough", false, false ] ]);
				this.oApp.exec("REGISTER_HOTKEY", [ "tab", "INDENT" ]);
				this.oApp.exec("REGISTER_HOTKEY", [ "shift+tab", "OUTDENT" ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "bold", "click",
						"EXECCOMMAND", [ "bold", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "underline", "click",
						"EXECCOMMAND", [ "underline", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "italic", "click",
						"EXECCOMMAND", [ "italic", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "lineThrough", "click",
						"EXECCOMMAND", [ "strikethrough", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "superscript", "click",
						"EXECCOMMAND", [ "superscript", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "subscript", "click",
						"EXECCOMMAND", [ "subscript", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "justifyleft", "click",
						"EXECCOMMAND", [ "justifyleft", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "justifycenter", "click",
						"EXECCOMMAND", [ "justifycenter", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "justifyright", "click",
						"EXECCOMMAND", [ "justifyright", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "justifyfull", "click",
						"EXECCOMMAND", [ "justifyfull", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "orderedlist", "click",
						"EXECCOMMAND", [ "insertorderedlist", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT",
						[ "unorderedlist", "click", "EXECCOMMAND",
								[ "insertunorderedlist", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "outdent", "click",
						"EXECCOMMAND", [ "outdent", false, false ] ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "indent", "click",
						"EXECCOMMAND", [ "indent", false, false ] ]);
				this.oNavigator = jindo.$Agent().navigator();
				if (!this.oNavigator.safari && !this.oNavigator.chrome) {
					this._getDocumentBR = function() {
					};
					this._fixDocumentBR = function() {
					}
				}
				if (!this.oNavigator.ie) {
					this._fixCorruptedBlockQuote = function() {
					};
					if (!this.oNavigator.chrome) {
						this._insertBlankLine = function() {
						}
					}
				}
				if (!this.oNavigator.firefox) {
					this._extendBlock = function() {
					}
				}
			},
			$ON_INDENT : function() {
				this.oApp.delayedExec("EXECCOMMAND",
						[ "indent", false, false ], 0)
			},
			$ON_OUTDENT : function() {
				this.oApp.delayedExec("EXECCOMMAND",
						[ "outdent", false, false ], 0)
			},
			$BEFORE_EXECCOMMAND : function(f, a, e, c) {
				var d, b;
				this.oApp.exec("FOCUS");
				this._bOnlyCursorChanged = false;
				b = this.oApp.getSelection();
				if (/^insertorderedlist|insertunorderedlist$/i.test(f)) {
					this._getDocumentBR()
				}
				if (/^justify*/i.test(f)) {
					this._removeSpanAlign()
				}
				if (f
						.match(/^bold|underline|italic|strikethrough|superscript|subscript$/i)) {
					this.oUndoOption = {
						bMustBlockElement : true
					};
					if (nhn.CurrentSelection.isCollapsed()) {
						this._bOnlyCursorChanged = true;
						if (this.oNavigator.ie) {
							if (b.startContainer.tagName == "BODY"
									&& b.startOffset === 0) {
								d = this.oApp.getWYSIWYGDocument()
										.createElement("SPAN");
								d.innerHTML = unescape("%uFEFF");
								b.insertNode(d);
								b.select()
							}
						}
					}
				}
				if (f == "indent" || f == "outdent") {
					if (!c) {
						c = {}
					}
					c.bDontAddUndoHistory = true
				}
				if ((!c || !c.bDontAddUndoHistory) && !this._bOnlyCursorChanged) {
					if (/^justify*/i.test(f)) {
						this.oUndoOption = {
							sSaveTarget : "BODY"
						}
					} else {
						if (f === "insertorderedlist"
								|| f === "insertunorderedlist") {
							this.oUndoOption = {
								bMustBlockContainer : true
							}
						}
					}
					this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ f,
							this.oUndoOption ])
				}
				if (this.oNavigator.ie) {
					if (this.oApp.getWYSIWYGDocument().selection.type === "Control") {
						b = this.oApp.getSelection();
						b.select()
					}
				}
				if (f == "insertorderedlist" || f == "insertunorderedlist") {
					this._insertBlankLine()
				}
			},
			$ON_EXECCOMMAND : function(g, a, f) {
				var h = false;
				var e = {};
				var c = this.oApp.getSelection();
				a = (a == "" || a) ? a : false;
				f = (f == "" || f) ? f : false;
				this.oApp.exec("IS_SELECTED_TD_BLOCK", [ "bIsSelectedTd", e ]);
				h = e.bIsSelectedTd;
				if (h) {
					if (g == "indent") {
						this.oApp.exec("SET_LINE_BLOCK_STYLE", [ null,
								jindo.$Fn(this._indentMargin, this).bind() ])
					} else {
						if (g == "outdent") {
							this.oApp.exec("SET_LINE_BLOCK_STYLE",
									[
											null,
											jindo
													.$Fn(this._outdentMargin,
															this).bind() ])
						} else {
							this._setBlockExecCommand(g, a, f)
						}
					}
				} else {
					switch (g) {
					case "indent":
					case "outdent":
						this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ g ]);
						var b = c.placeStringBookmark();
						if (g === "indent") {
							this.oApp.exec("SET_LINE_STYLE", [ null,
									jindo.$Fn(this._indentMargin, this).bind(),
									{
										bDoNotSelect : true,
										bDontAddUndoHistory : true
									} ])
						} else {
							this.oApp.exec("SET_LINE_STYLE",
									[
											null,
											jindo
													.$Fn(this._outdentMargin,
															this).bind(), {
												bDoNotSelect : true,
												bDontAddUndoHistory : true
											} ])
						}
						c.moveToStringBookmark(b);
						c.select();
						c.removeStringBookmark(b);
						setTimeout(jindo.$Fn(function(j) {
							this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [ j ])
						}, this).bind(g), 25);
						break;
					case "justifyleft":
					case "justifycenter":
					case "justifyright":
					case "justifyfull":
						var d = this._extendBlock();
						this.oEditingArea.execCommand(g, a, f);
						if (!!d) {
							d.select()
						}
						break;
					default:
						this.oEditingArea.execCommand(g, a, f)
					}
				}
				this._countClickCr(g)
			},
			$AFTER_EXECCOMMAND : function(d, a, c, b) {
				if (this.elP1 && this.elP1.parentNode) {
					this.elP1.parentNode.removeChild(this.elP1)
				}
				if (this.elP2 && this.elP2.parentNode) {
					this.elP2.parentNode.removeChild(this.elP2)
				}
				if (/^insertorderedlist|insertunorderedlist$/i.test(d)) {
					this._fixDocumentBR();
					this
							._fixCorruptedBlockQuote(d === "insertorderedlist" ? "OL"
									: "UL")
				}
				if ((/^justify*/i.test(d))) {
					this._fixAlign(d === "justifyfull" ? "justify" : d
							.substring(7))
				}
				if (d == "indent" || d == "outdent") {
					if (!b) {
						b = {}
					}
					b.bDontAddUndoHistory = true
				}
				if ((!b || !b.bDontAddUndoHistory) && !this._bOnlyCursorChanged) {
					this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [ d,
							this.oUndoOption ])
				}
				this.oApp.exec("CHECK_STYLE_CHANGE", [])
			},
			_removeSpanAlign : function() {
				var d = this.oApp.getSelection(), a = d.getNodes(), b = null;
				for ( var c = 0, e = a.length; c < e; c++) {
					b = a[c];
					if (b.tagName && b.tagName === "SPAN") {
						b.style.textAlign = "";
						b.removeAttribute("align")
					}
				}
			},
			_getAlignNode : function(a) {
				if (a.tagName && (a.tagName === "P" || a.tagName === "DIV")) {
					return a
				}
				a = a.parentNode;
				while (a && a.tagName) {
					if (a.tagName === "P" || a.tagName === "DIV") {
						return a
					}
					a = a.parentNode
				}
			},
			_fixAlign : function(d) {
				var f = this.oApp.getSelection(), a = [], c = null, b = null;
				var h = !this.oNavigator.ie ? function() {
				} : function(j) {
					if (j.tagName && j.tagName === "TABLE") {
						j.removeAttribute("align");
						return true
					}
					return false
				};
				if (f.collapsed) {
					a[0] = f.startContainer
				} else {
					a = f.getNodes()
				}
				for ( var e = 0, g = a.length; e < g; e++) {
					c = a[e];
					if (c.nodeType === 3) {
						c = c.parentNode
					}
					if (b && (c === b || jindo.$Element(c).isChildOf(b))) {
						continue
					}
					b = this._getAlignNode(c);
					if (b && b.align !== b.style.textAlign) {
						b.style.textAlign = d;
						b.setAttribute("align", d)
					}
				}
			},
			_getDocumentBR : function() {
				var a, b;
				this.aBRs = this.oApp.getWYSIWYGDocument()
						.getElementsByTagName("BR");
				this.aBeforeBRs = [];
				for (a = 0, b = this.aBRs.length; a < b; a++) {
					this.aBeforeBRs[a] = this.aBRs[a]
				}
			},
			_fixDocumentBR : function() {
				if (this.aBeforeBRs.length === this.aBRs.length) {
					return
				}
				var c = jindo.$A(this.aBeforeBRs), b, a = this.aBRs.length;
				for (b = a - 1; b >= 0; b--) {
					if (c.indexOf(this.aBRs[b]) < 0) {
						this.aBRs[b].parentNode.removeChild(this.aBRs[b])
					}
				}
			},
			_setBlockExecCommand : function(h, d, g) {
				var b, a, f = {};
				this.oSelection = this.oApp.getSelection();
				this.oApp.exec("GET_SELECTED_TD_BLOCK", [ "aTdCells", f ]);
				b = f.aTdCells;
				for ( var e = 0; e < b.length; e++) {
					this.oSelection.selectNodeContents(b[e]);
					this.oSelection.select();
					if (this.oNavigator.firefox) {
						this.oEditingArea.execCommand("styleWithCSS", d, false)
					}
					a = this.oSelection.getNodes();
					for ( var c = 0; c < a.length; c++) {
						if (a[c].tagName == "UL" || a[c].tagName == "OL") {
							jindo.$Element(a[c]).css("color", g)
						}
					}
					this.oEditingArea.execCommand(h, d, g)
				}
			},
			_indentMargin : function(c) {
				var f = c, g, d, e, a, b, h;
				while (f) {
					if (f.tagName && f.tagName === "LI") {
						c = f;
						break
					}
					f = f.parentNode
				}
				if (c.tagName === "LI") {
					if (c.previousSibling
							&& c.previousSibling.tagName
							&& c.previousSibling.tagName === c.parentNode.tagName) {
						if (c.nextSibling
								&& c.nextSibling.tagName
								&& c.nextSibling.tagName === c.parentNode.tagName) {
							g = [ c ];
							for (d = 0, e = c.nextSibling.childNodes.length; d < e; d++) {
								g.push(c.nextSibling.childNodes[d])
							}
							a = c.previousSibling;
							b = c.nextSibling;
							for (d = 0, e = g.length; d < e; d++) {
								a.insertBefore(g[d], null)
							}
							b.parentNode.removeChild(b)
						} else {
							c.previousSibling.insertBefore(c, null)
						}
						return
					}
					if (c.nextSibling && c.nextSibling.tagName
							&& c.nextSibling.tagName === c.parentNode.tagName) {
						c.nextSibling.insertBefore(c, c.nextSibling.firstChild);
						return
					}
					f = c.parentNode.cloneNode(false);
					c.parentNode.insertBefore(f, c);
					f.appendChild(c);
					return
				}
				h = parseInt(c.style.marginLeft, 10);
				if (!h) {
					h = 0
				}
				h += this.nIndentSpacing;
				c.style.marginLeft = h + "px"
			},
			_outdentMargin : function(d) {
				var e = d, c, h, b, f, a, g;
				while (e) {
					if (e.tagName && e.tagName === "LI") {
						d = e;
						break
					}
					e = e.parentNode
				}
				if (d.tagName === "LI") {
					c = d.parentNode;
					h = d.parentNode;
					if (d.previousSibling && d.previousSibling.tagName
							&& d.previousSibling.tagName.match(/LI|UL|OL/)) {
						if (d.nextSibling && d.nextSibling.tagName
								&& d.nextSibling.tagName.match(/LI|UL|OL/)) {
							b = c.cloneNode(false);
							while (d.nextSibling) {
								b.insertBefore(d.nextSibling, null)
							}
							c.parentNode.insertBefore(b, c.nextSibling);
							h = b
						} else {
							h = c.nextSibling
						}
					}
					c.parentNode.insertBefore(d, h);
					if (!c.innerHTML.match(/LI/i)) {
						c.parentNode.removeChild(c)
					}
					if (!d.parentNode.tagName.match(/OL|UL/)) {
						f = d.parentNode;
						h = d;
						a = this.oApp.getWYSIWYGDocument();
						f = a.createElement("P");
						h = null;
						d.parentNode.insertBefore(f, d);
						while (d.firstChild) {
							f.insertBefore(d.firstChild, h)
						}
						d.parentNode.removeChild(d)
					}
					return
				}
				g = parseInt(d.style.marginLeft, 10);
				if (!g) {
					g = 0
				}
				g -= this.nIndentSpacing;
				if (g < 0) {
					g = 0
				}
				d.style.marginLeft = g + "px"
			},
			_insertBlankLine : function() {
				var b = this.oApp.getSelection();
				var a = b.commonAncestorContainer;
				this.elP1 = null;
				this.elP2 = null;
				while (a) {
					if (a.tagName == "BLOCKQUOTE") {
						this.elP1 = jindo.$("<p>&nbsp;</p>", this.oApp
								.getWYSIWYGDocument());
						a.parentNode.insertBefore(this.elP1, a);
						this.elP2 = jindo.$("<p>&nbsp;</p>", this.oApp
								.getWYSIWYGDocument());
						a.parentNode.insertBefore(this.elP2, a.nextSibling);
						break
					}
					a = a.parentNode
				}
			},
			_fixCorruptedBlockQuote : function(c) {
				var j = this.oApp.getWYSIWYGDocument().getElementsByTagName(c), h, e, l, f, g, k, a, b, d;
				for (g = 0, k = j.length; g < k; g++) {
					if (j[g].firstChild && j[g].firstChild.tagName == c) {
						h = j[g];
						break
					}
				}
				if (!h) {
					return
				}
				e = h.parentNode;
				a = this._getPosIdx(h);
				b = this.oApp.getWYSIWYGDocument().createElement("DIV");
				b.innerHTML = h.outerHTML.replace("<" + c, "<BLOCKQUOTE");
				h.parentNode.insertBefore(b.firstChild, h);
				h.parentNode.removeChild(h);
				l = e.childNodes[a];
				f = l.getElementsByTagName(c);
				for (g = 0, k = f.length; g < k; g++) {
					if (f[g].childNodes.length < 1) {
						f[g].parentNode.removeChild(f[g])
					}
				}
				d = this.oApp.getEmptySelection();
				d.selectNodeContents(l);
				d.collapseToEnd();
				d.select()
			},
			_getPosIdx : function(b) {
				var a = 0;
				for ( var c = b.previousSibling; c; c = c.previousSibling) {
					a++
				}
				return a
			},
			_countClickCr : function(a) {
				if (!a.match(this.rxClickCr)) {
					return
				}
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ a
						.replace(/^insert/i, "") ])
			},
			_extendBlock : function() {
				var d = this.oApp.getSelection(), f = d.startContainer, c = d.endContainer, b = [], a = [], e = d
						.cloneRange();
				if (!(f === c && f.nodeType === 1 && f.tagName === "P")) {
					return
				}
				b = jindo.$A(f.childNodes).filter(function(h, g, j) {
					return (h.nodeType === 1 && h.tagName === "IMG")
				}).$value();
				a = jindo.$A(d.getNodes()).filter(function(h, g, j) {
					return (h.nodeType === 1 && h.tagName === "IMG")
				}).$value();
				if (b.length <= a.length) {
					return
				}
				d.selectNode(f);
				d.select();
				return e
			}
		});
nhn.husky.SE2M_FontColor = jindo
		.$Class({
			name : "SE2M_FontColor",
			rxColorPattern : /^#?[0-9a-fA-F]{6}$|^rgb\(\d+, ?\d+, ?\d+\)$/i,
			$init : function(a) {
				this._assignHTMLElements(a)
			},
			_assignHTMLElements : function(a) {
				this.elLastUsed = jindo.$$.getSingle(
						"BUTTON.husky_se2m_fontColor_lastUsed", a);
				this.elDropdownLayer = jindo.$$.getSingle(
						"DIV.husky_se2m_fontcolor_layer", a);
				this.elPaletteHolder = jindo.$$.getSingle(
						"DIV.husky_se2m_fontcolor_paletteHolder",
						this.elDropdownLayer);
				this._setLastUsedFontColor("#000000")
			},
			$ON_MSG_APP_READY : function() {
				this.oApp.exec("REGISTER_UI_EVENT", [ "fontColorA", "click",
						"APPLY_LAST_USED_FONTCOLOR" ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "fontColorB", "click",
						"TOGGLE_FONTCOLOR_LAYER" ])
			},
			$ON_TOGGLE_FONTCOLOR_LAYER : function() {
				this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [
						this.elDropdownLayer, null, "FONTCOLOR_LAYER_SHOWN",
						[], "FONTCOLOR_LAYER_HIDDEN", [] ]);
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "fontcolor" ])
			},
			$ON_FONTCOLOR_LAYER_SHOWN : function() {
				this.oApp.exec("SELECT_UI", [ "fontColorB" ]);
				this.oApp.exec("SHOW_COLOR_PALETTE", [ "APPLY_FONTCOLOR",
						this.elPaletteHolder ])
			},
			$ON_FONTCOLOR_LAYER_HIDDEN : function() {
				this.oApp.exec("DESELECT_UI", [ "fontColorB" ]);
				this.oApp.exec("RESET_COLOR_PALETTE", [])
			},
			$ON_APPLY_LAST_USED_FONTCOLOR : function() {
				this.oApp.exec("APPLY_FONTCOLOR", [ this.sLastUsedColor ]);
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "fontcolor" ])
			},
			$ON_APPLY_FONTCOLOR : function(a) {
				if (!this.rxColorPattern.test(a)) {
					alert(this.oApp.$MSG("SE_FontColor.invalidColorCode"));
					return
				}
				this._setLastUsedFontColor(a);
				this.oApp.exec("SET_WYSIWYG_STYLE", [ {
					color : a
				} ]);
				this.oApp.exec("HIDE_ACTIVE_LAYER")
			},
			_setLastUsedFontColor : function(a) {
				this.sLastUsedColor = a;
				this.elLastUsed.style.backgroundColor = this.sLastUsedColor
			}
		});
nhn.husky.SE2M_FontNameWithLayerUI = jindo
		.$Class({
			name : "SE2M_FontNameWithLayerUI",
			$init : function(a) {
				this.elLastHover = null;
				this._assignHTMLElements(a);
				this.htBrowser = jindo.$Agent().navigator()
			},
			addAllFonts : function() {
				var b, e, a, d, c;
				this.htFamilyName2DisplayName = {};
				this.htAllFonts = {};
				this.aBaseFontList = [];
				this.aDefaultFontList = [];
				this.aTempSavedFontList = [];
				this.htOptions = this.oApp.htOptions.SE2M_FontName;
				if (this.htOptions) {
					b = this.htOptions.aDefaultFontList || [];
					e = this.htOptions.aFontList;
					a = this.htOptions.htMainFont;
					d = this.htOptions.aFontInUse;
					if (this.oApp.oNavigator.ie && e) {
						for (c = 0; c < e.length; c++) {
							this.addFont(e[c].id, e[c].name, e[c].size,
									e[c].url, e[c].cssUrl)
						}
					}
					for (c = 0; c < b.length; c++) {
						this.addFont(b[c][0], b[c][1], 0, "", "", 1)
					}
					if (a && a.id) {
						this.setMainFont(a.id, a.name, a.size, a.url, a.cssUrl)
					}
					if (this.oApp.oNavigator.ie && d) {
						for (c = 0; c < d.length; c++) {
							this.addFontInUse(d[c].id, d[c].name, d[c].size,
									d[c].url, d[c].cssUrl)
						}
					}
				}
				if (!this.htOptions || !this.htOptions.aDefaultFontList
						|| this.htOptions.aDefaultFontList.length === 0) {
					this.addFont("돋움,Dotum", "돋움", 0, "", "", 1);
					this.addFont("돋움체,DotumChe", "돋움체", 0, "", "", 1);
					this.addFont("굴림,Gulim", "굴림", 0, "", "", 1);
					this.addFont("굴림체,GulimChe", "굴림체", 0, "", "", 1);
					this.addFont("바탕,Batang", "바탕", 0, "", "", 1);
					this.addFont("바탕체,BatangChe", "바탕체", 0, "", "", 1);
					this.addFont("궁서,Gungsuh", "궁서", 0, "", "", 1);
					this.addFont("Arial", "Arial", 0, "", "", 1);
					this.addFont("Tahoma", "Tahoma", 0, "", "", 1, "abcd");
					this.addFont("Times New Roman", "Times New Roman", 0, "",
							"", 1, "abcd");
					this.addFont("Verdana", "Verdana", 0, "", "", 1, "abcd")
				}
			},
			$ON_MSG_APP_READY : function() {
				this.bDoNotRecordUndo = false;
				this.oApp.exec("ADD_APP_PROPERTY", [ "addFont",
						jindo.$Fn(this.addFont, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "addFontInUse",
						jindo.$Fn(this.addFontInUse, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "setMainFont",
						jindo.$Fn(this.setMainFont, this).bind() ]);
				this.oApp.exec("ADD_APP_PROPERTY", [ "setDefaultFont",
						jindo.$Fn(this.setDefaultFont, this).bind() ]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "fontName", "click",
						"SE2M_TOGGLE_FONTNAME_LAYER" ])
			},
			$AFTER_MSG_APP_READY : function() {
				this._initFontName();
				this._attachIEEvent()
			},
			_assignHTMLElements : function(a) {
				this.oDropdownLayer = jindo.$$.getSingle(
						"DIV.husky_se_fontName_layer", a);
				this.elFontNameLabel = jindo.$$.getSingle(
						"SPAN.husky_se2m_current_fontName", a);
				this.elFontNameList = jindo.$$.getSingle("UL",
						this.oDropdownLayer);
				this.elInnerLayer = this.elFontNameList.parentNode;
				this.elFontItemTemplate = jindo.$$.getSingle("LI",
						this.oDropdownLayer);
				this.aLIFontNames = jindo.$A(
						jindo.$$("LI", this.oDropdownLayer)).filter(
						function(c, d, b) {
							return (c.firstChild !== null)
						})._array;
				this.elSeparator = jindo.$$.getSingle(
						"LI.husky_seditor_font_separator", this.oDropdownLayer);
				this.elNanumgothic = jindo.$$.getSingle(
						"LI.husky_seditor_font_nanumgothic",
						this.oDropdownLayer);
				this.elNanummyeongjo = jindo.$$.getSingle(
						"LI.husky_seditor_font_nanummyeongjo",
						this.oDropdownLayer);
				this.sDefaultText = this.elFontNameLabel.innerHTML
			},
			_initFontName : function() {
				this._addNanumFont();
				this.addAllFonts();
				this.oApp.registerBrowserEvent(this.oDropdownLayer,
						"mouseover", "EVENT_FONTNAME_LAYER_MOUSEOVER", []);
				this.oApp.registerBrowserEvent(this.oDropdownLayer, "click",
						"EVENT_FONTNAME_LAYER_CLICKED", [])
			},
			_addNanumFont : function() {
				var c = false;
				var a = unescape("%uB098%uB214%uACE0%uB515");
				var b = unescape("%uB098%uB214%uBA85%uC870");
				if (jindo.$Agent().os().mac) {
					a = "NanumGothic";
					b = "NanumMyeongjo"
				}
				if (!!this.elNanumgothic) {
					if (IsInstalledFont(a)) {
						c = true;
						this.elNanumgothic.style.display = "block"
					} else {
						this.elNanumgothic.style.display = "none"
					}
				}
				if (!!this.elNanummyeongjo) {
					if (IsInstalledFont(b)) {
						c = true;
						this.elNanummyeongjo.style.display = "block"
					} else {
						this.elNanummyeongjo.style.display = "none"
					}
				}
				if (!!this.elSeparator) {
					this.elSeparator.style.display = c ? "block" : "none"
				}
			},
			_attachIEEvent : function() {
				if (!this.htBrowser.ie) {
					return
				}
				if (this.htBrowser.nativeVersion < 9) {
					this._wfOnPasteWYSIWYGBody = jindo.$Fn(
							this._onPasteWYSIWYGBody, this);
					this._wfOnPasteWYSIWYGBody.attach(this.oApp
							.getWYSIWYGDocument().body, "paste");
					return
				}
				if (document.documentMode < 9) {
					this._wfOnFocusWYSIWYGBody = jindo.$Fn(
							this._onFocusWYSIWYGBody, this);
					this._wfOnFocusWYSIWYGBody.attach(this.oApp
							.getWYSIWYGDocument().body, "focus");
					return
				}
				this.welEditingAreaCover = jindo
						.$Element('<DIV style="width:100%; height:100%; position:absolute; top:0px; left:0px; z-index:1000;"></DIV>');
				this.oApp.welEditingAreaContainer
						.prepend(this.welEditingAreaCover);
				jindo.$Fn(this._onMouseupCover, this).attach(
						this.welEditingAreaCover.$value(), "mouseup")
			},
			_onFocusWYSIWYGBody : function(a) {
				this._wfOnFocusWYSIWYGBody.detach(this.oApp
						.getWYSIWYGDocument().body, "focus");
				this._loadAllBaseFont()
			},
			_onPasteWYSIWYGBody : function(a) {
				this._wfOnPasteWYSIWYGBody.detach(this.oApp
						.getWYSIWYGDocument().body, "paste");
				this._loadAllBaseFont()
			},
			_onMouseupCover : function(d) {
				d.stop();
				this.welEditingAreaCover.leave();
				var f = d.mouse(), c = this.oApp.getWYSIWYGDocument().body, a = jindo
						.$Element(c), b = this.oApp.getEmptySelection();
				b.selectNode(c);
				b.collapseToStart();
				b.select();
				a.fireEvent("mousedown", {
					left : f.left,
					middle : f.middle,
					right : f.right
				});
				a.fireEvent("mouseup", {
					left : f.left,
					middle : f.middle,
					right : f.right
				})
			},
			$ON_EVENT_TOOLBAR_MOUSEDOWN : function() {
				if (this.htBrowser.nativeVersion < 9
						|| document.documentMode < 9) {
					return
				}
				this.welEditingAreaCover.leave()
			},
			_loadAllBaseFont : function() {
				var b, a;
				if (!this.htBrowser.ie) {
					return
				}
				if (this.htBrowser.nativeVersion < 9) {
					for (b = 0, a = this.aBaseFontList.length; b < a; b++) {
						this.aBaseFontList[b].loadCSS(this.oApp
								.getWYSIWYGDocument())
					}
				} else {
					if (document.documentMode < 9) {
						for (b = 0, a = this.aBaseFontList.length; b < a; b++) {
							this.aBaseFontList[b].loadCSSToMenu()
						}
					}
				}
				this._loadAllBaseFont = function() {
				}
			},
			_addFontToMenu : function(c, b, d) {
				var a = document.createElement("LI");
				a.innerHTML = this.elFontItemTemplate.innerHTML.replace(
						"@DisplayName@", c).replace("FontFamily", b).replace(
						"@SampleText@", d);
				this.elFontNameList.insertBefore(a, this.elFontItemTemplate);
				this.aLIFontNames[this.aLIFontNames.length] = a;
				if (this.aLIFontNames.length > 20) {
					this.oDropdownLayer.style.overflowX = "hidden";
					this.oDropdownLayer.style.overflowY = "auto";
					this.oDropdownLayer.style.height = "400px";
					this.oDropdownLayer.style.width = "204px"
				}
			},
			$ON_EVENT_FONTNAME_LAYER_MOUSEOVER : function(a) {
				var b = this._findLI(a.element);
				if (!b) {
					return
				}
				this._clearLastHover();
				b.className = "hover";
				this.elLastHover = b
			},
			$ON_EVENT_FONTNAME_LAYER_CLICKED : function(b) {
				var e = this._findLI(b.element);
				if (!e) {
					return
				}
				var c = this._getFontFamilyFromLI(e);
				var d = this.htAllFonts[c.replace(/\"/g,
						nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS)];
				var a;
				if (d) {
					a = d.defaultSize + "pt"
				} else {
					a = 0
				}
				this.oApp.exec("SET_FONTFAMILY", [ c, a ])
			},
			_findLI : function(a) {
				while (a.tagName != "LI") {
					if (!a || a === this.oDropdownLayer) {
						return null
					}
					a = a.parentNode
				}
				if (/husky_seditor_font_separator/.test(a.className)) {
					return null
				}
				return a
			},
			_clearLastHover : function() {
				if (this.elLastHover) {
					this.elLastHover.className = ""
				}
			},
			$ON_SE2M_TOGGLE_FONTNAME_LAYER : function() {
				this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [
						this.oDropdownLayer, null, "MSG_FONTNAME_LAYER_OPENED",
						[], "MSG_FONTNAME_LAYER_CLOSED", [] ]);
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "font" ])
			},
			$ON_MSG_FONTNAME_LAYER_OPENED : function() {
				this.oApp.exec("SELECT_UI", [ "fontName" ])
			},
			$ON_MSG_FONTNAME_LAYER_CLOSED : function() {
				this._clearLastHover();
				this.oApp.exec("DESELECT_UI", [ "fontName" ])
			},
			$ON_MSG_STYLE_CHANGED : function(d, a) {
				if (d == "fontFamily") {
					a = a.replace(/["']/g, "");
					var b = this._getMatchingLI(a);
					this._clearFontNameSelection();
					if (b) {
						this.elFontNameLabel.innerHTML = this
								._getFontNameLabelFromLI(b);
						jindo.$Element(b).addClass("active")
					} else {
						var c = this.sDefaultText;
						this.elFontNameLabel.innerHTML = c
					}
				}
			},
			$BEFORE_RECORD_UNDO_BEFORE_ACTION : function() {
				return !this.bDoNotRecordUndo
			},
			$BEFORE_RECORD_UNDO_AFTER_ACTION : function() {
				return !this.bDoNotRecordUndo
			},
			$BEFORE_RECORD_UNDO_ACTION : function() {
				return !this.bDoNotRecordUndo
			},
			$ON_SET_FONTFAMILY : function(c, b) {
				if (!c) {
					return
				}
				var a = this.htAllFonts[c.replace(/\"/g,
						nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS)];
				if (!!a) {
					a.loadCSS(this.oApp.getWYSIWYGDocument())
				}
				this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ "SET FONTFAMILY",
						{
							bMustBlockElement : true
						} ]);
				this.bDoNotRecordUndo = true;
				if (parseInt(b, 10) > 0) {
					this.oApp.exec("SET_WYSIWYG_STYLE", [ {
						fontSize : b
					} ])
				}
				this.oApp.exec("SET_WYSIWYG_STYLE", [ {
					fontFamily : c
				} ]);
				this.bDoNotRecordUndo = false;
				this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [ "SET FONTFAMILY",
						{
							bMustBlockElement : true
						} ]);
				this.oApp.exec("HIDE_ACTIVE_LAYER", []);
				this.oApp.exec("CHECK_STYLE_CHANGE", [])
			},
			_getMatchingLI : function(e) {
				e = e.toLowerCase();
				var c, a;
				for ( var b = 0; b < this.aLIFontNames.length; b++) {
					c = this.aLIFontNames[b];
					a = this._getFontFamilyFromLI(c).split(",");
					for ( var d = 0; d < a.length; d++) {
						if (!!a[d]
								&& jindo.$S(a[d].replace(/['"]/ig, "")).trim()
										.$value() == e) {
							return c
						}
					}
				}
				return null
			},
			_getFontFamilyFromLI : function(a) {
				return (a.getElementsByTagName("EM")[0]).style.fontFamily
			},
			_getFontNameLabelFromLI : function(a) {
				return a.firstChild.firstChild.firstChild.nodeValue
			},
			_clearFontNameSelection : function(b) {
				for ( var a = 0; a < this.aLIFontNames.length; a++) {
					jindo.$Element(this.aLIFontNames[a]).removeClass("active")
				}
			},
			addFont : function(d, b, k, c, e, h, g) {
				if (!this.oApp.oNavigator.ie && e) {
					return null
				}
				d = d.toLowerCase();
				var j = new fontProperty(d, b, k, c, e);
				var f;
				var a;
				if (k > 0) {
					f = d + "_" + k;
					a = b + "_" + k
				} else {
					f = d;
					a = b
				}
				if (!h) {
					f = nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS
							+ f
							+ nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS
				}
				if (this.htAllFonts[f]) {
					return this.htAllFonts[f]
				}
				this.htAllFonts[f] = j;
				if (this.htBrowser.ie && this.htBrowser.nativeVersion >= 9
						&& document.documentMode >= 9) {
					j.loadCSSToMenu()
				}
				this.htFamilyName2DisplayName[f] = b;
				g = g || this.oApp.$MSG("SE2M_FontNameWithLayerUI.sSampleText");
				this._addFontToMenu(a, f, g);
				if (!h) {
					this.aBaseFontList[this.aBaseFontList.length] = j
				} else {
					if (h == 1) {
						this.aDefaultFontList[this.aDefaultFontList.length] = j
					} else {
						this.aTempSavedFontList[this.aTempSavedFontList.length] = j
					}
				}
				return j
			},
			addFontInUse : function(c, d, g, e, b, f) {
				var a = this.addFont(c, d, g, e, b, f);
				if (!a) {
					return null
				}
				a.loadCSS(this.oApp.getWYSIWYGDocument());
				return a
			},
			setMainFont : function(c, d, g, e, b, f) {
				var a = this.addFontInUse(c, d, g, e, b, f);
				if (!a) {
					return null
				}
				this.setDefaultFont(a.fontFamily, g);
				return a
			},
			setDefaultFont : function(a, c) {
				var b = this.oApp.getWYSIWYGDocument().body;
				b.style.fontFamily = a;
				if (c > 0) {
					b.style.fontSize = c + "pt"
				}
			}
		});
nhn.husky.SE2M_FontNameWithLayerUI.CUSTOM_FONT_MARKS = "'";
function fontProperty(b, c, e, d, a) {
	this.fontId = b;
	this.fontName = c;
	this.defaultSize = e;
	this.fontURL = d;
	this.fontCSSURL = a;
	this.displayName = c;
	this.isLoaded = true;
	this.fontFamily = this.fontId;
	if (this.fontCSSURL != "") {
		this.displayName += "" + e;
		this.fontFamily += "_" + e;
		this.isLoaded = false;
		this.loadCSS = function(f) {
			if (this.isLoaded) {
				return
			}
			this._importCSS(f);
			this.isLoaded = true
		};
		this.loadCSSToMenu = function() {
			this._importCSS(document)
		};
		this._importCSS = function(h) {
			var g = h.styleSheets.length;
			var f = h.styleSheets[g - 1];
			if (g === 0 || f.imports.length == 30) {
				f = h.createStyleSheet()
			}
			f.addImport(this.fontCSSURL)
		}
	} else {
		this.loadCSS = function() {
		};
		this.loadCSSToMenu = function() {
		}
	}
	this.toStruct = function() {
		return {
			fontId : this.fontId,
			fontName : this.fontName,
			defaultSize : this.defaultSize,
			fontURL : this.fontURL,
			fontCSSURL : this.fontCSSURL
		}
	}
}
nhn.husky.SE2M_FontSizeWithLayerUI = jindo.$Class({
	name : "SE2M_FontSizeWithLayerUI",
	$init : function(a) {
		this._assignHTMLElements(a);
		this.mapPX2PT = {};
		this.mapPX2PT["8"] = "6";
		this.mapPX2PT["9"] = "7";
		this.mapPX2PT["10"] = "7.5";
		this.mapPX2PT["11"] = "8";
		this.mapPX2PT["12"] = "9";
		this.mapPX2PT["13"] = "10";
		this.mapPX2PT["14"] = "10.5";
		this.mapPX2PT["15"] = "11";
		this.mapPX2PT["16"] = "12";
		this.mapPX2PT["17"] = "13";
		this.mapPX2PT["18"] = "13.5";
		this.mapPX2PT["19"] = "14";
		this.mapPX2PT["20"] = "14.5";
		this.mapPX2PT["21"] = "15";
		this.mapPX2PT["22"] = "16";
		this.mapPX2PT["23"] = "17";
		this.mapPX2PT["24"] = "18";
		this.mapPX2PT["26"] = "20";
		this.mapPX2PT["29"] = "22";
		this.mapPX2PT["32"] = "24";
		this.mapPX2PT["35"] = "26";
		this.mapPX2PT["36"] = "27";
		this.mapPX2PT["37"] = "28";
		this.mapPX2PT["38"] = "29";
		this.mapPX2PT["40"] = "30";
		this.mapPX2PT["42"] = "32";
		this.mapPX2PT["45"] = "34";
		this.mapPX2PT["48"] = "36"
	},
	_assignHTMLElements : function(a) {
		this.oDropdownLayer = jindo.$$.getSingle("DIV.husky_se_fontSize_layer",
				a);
		this.elFontSizeLabel = jindo.$$.getSingle(
				"SPAN.husky_se2m_current_fontSize", a);
		this.aLIFontSizes = jindo.$A(jindo.$$("LI", this.oDropdownLayer))
				.filter(function(c, d, b) {
					return (c.firstChild != null)
				})._array;
		this.sDefaultText = this.elFontSizeLabel.innerHTML
	},
	$ON_MSG_APP_READY : function() {
		this.oApp.exec("REGISTER_UI_EVENT", [ "fontSize", "click",
				"SE2M_TOGGLE_FONTSIZE_LAYER" ]);
		this.oApp.exec("SE2_ATTACH_HOVER_EVENTS", [ this.aLIFontSizes ]);
		for ( var a = 0; a < this.aLIFontSizes.length; a++) {
			this.oApp.registerBrowserEvent(this.aLIFontSizes[a], "click",
					"SET_FONTSIZE", [ this
							._getFontSizeFromLI(this.aLIFontSizes[a]) ])
		}
	},
	$ON_SE2M_TOGGLE_FONTSIZE_LAYER : function() {
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [ this.oDropdownLayer,
				null, "SELECT_UI", [ "fontSize" ], "DESELECT_UI",
				[ "fontSize" ] ]);
		this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "size" ])
	},
	$ON_MSG_STYLE_CHANGED : function(d, a) {
		if (d == "fontSize") {
			if (a.match(/px$/)) {
				var b = parseFloat(a.replace("px", "")).toFixed(0);
				if (this.mapPX2PT[b]) {
					a = this.mapPX2PT[b] + "pt"
				} else {
					if (a > 0) {
						a = b + "px"
					} else {
						a = this.sDefaultText
					}
				}
			}
			if (!a) {
				a = this.sDefaultText
			}
			var c = this._getMatchingLI(a);
			this._clearFontSizeSelection();
			if (c) {
				this.elFontSizeLabel.innerHTML = a;
				jindo.$Element(c).addClass("active")
			} else {
				this.elFontSizeLabel.innerHTML = a
			}
		}
	},
	$ON_SET_FONTSIZE : function(a) {
		if (!a) {
			return
		}
		this.oApp.exec("SET_WYSIWYG_STYLE", [ {
			fontSize : a
		} ]);
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
		this.oApp.exec("CHECK_STYLE_CHANGE", [])
	},
	_getMatchingLI : function(c) {
		var b;
		c = c.toLowerCase();
		for ( var a = 0; a < this.aLIFontSizes.length; a++) {
			b = this.aLIFontSizes[a];
			if (this._getFontSizeFromLI(b).toLowerCase() == c) {
				return b
			}
		}
		return null
	},
	_getFontSizeFromLI : function(a) {
		return a.firstChild.firstChild.style.fontSize
	},
	_clearFontSizeSelection : function(b) {
		for ( var a = 0; a < this.aLIFontSizes.length; a++) {
			jindo.$Element(this.aLIFontSizes[a]).removeClass("active")
		}
	}
});
nhn.husky.SE2M_Hyperlink = jindo
		.$Class({
			name : "SE2M_Hyperlink",
			sATagMarker : "HTTP://HUSKY_TMP.MARKER/",
			_assignHTMLElements : function(a) {
				this.oHyperlinkButton = jindo.$$.getSingle(
						"li.husky_seditor_ui_hyperlink", a);
				this.oHyperlinkLayer = jindo.$$.getSingle("div.se2_layer",
						this.oHyperlinkButton);
				this.oLinkInput = jindo.$$.getSingle("INPUT[type=text]",
						this.oHyperlinkLayer);
				this.oBtnConfirm = jindo.$$.getSingle("button.se2_apply",
						this.oHyperlinkLayer);
				this.oBtnCancel = jindo.$$.getSingle("button.se2_cancel",
						this.oHyperlinkLayer)
			},
			_generateAutoLink : function(f, d, e, c, a) {
				d = d || "";
				var b;
				if (c) {
					b = '<a href="http://' + c + '">' + e + "</a>"
				} else {
					b = '<a href="' + a + '">' + e + "</a>"
				}
				return d + b
			},
			$ON_MSG_APP_READY : function() {
				this.bLayerShown = false;
				this.oApp.exec("REGISTER_UI_EVENT", [ "hyperlink", "click",
						"TOGGLE_HYPERLINK_LAYER" ]);
				this.oApp.exec("REGISTER_HOTKEY", [ "ctrl+k",
						"TOGGLE_HYPERLINK_LAYER", [] ])
			},
			$ON_REGISTER_CONVERTERS : function() {
				this.oApp
						.exec(
								"ADD_CONVERTER_DOM",
								[
										"IR_TO_DB",
										jindo
												.$Fn(
														function(p) {
															var k = this.oApp
																	.getEmptySelection();
															var q = k
																	._getFirstRealChild(p);
															var b = k
																	._getLastRealChild(p);
															var m = jindo
																	.$A(k
																			._getNodesBetween(
																					q,
																					b));
															var d = m
																	.filter(
																			function(
																					a) {
																				return (a && a.nodeType === 3)
																			})
																	.$value();
															var l = d;
															var j = d;
															var h = this.oApp
																	.getWYSIWYGDocument()
																	.createElement(
																			"DIV");
															var e, o;
															var c = "@"
																	+ (new Date())
																			.getTime()
																	+ "@";
															var g = new RegExp(
																	c, "g");
															for ( var f = 0, n = d.length; f < n; f++) {
																e = l[f].parentNode;
																o = false;
																while (e) {
																	if (e.tagName === "A"
																			|| e.tagName === "PRE") {
																		o = true;
																		break
																	}
																	e = e.parentNode
																}
																if (o) {
																	continue
																}
																h.innerHTML = "";
																h
																		.appendChild(l[f]
																				.cloneNode(true));
																h.innerHTML = (c + h.innerHTML)
																		.replace(
																				/(&nbsp|\s)?(((?!http:\/\/)www\.(?:(?!\&nbsp;|\s|"|').)+)|(http:\/\/(?:(?!&nbsp;|\s|"|').)+))/ig,
																				this._generateAutoLink);
																l[f].parentNode
																		.insertBefore(
																				h,
																				l[f]);
																l[f].parentNode
																		.removeChild(l[f]);
																while (h.firstChild) {
																	h.parentNode
																			.insertBefore(
																					h.firstChild,
																					h)
																}
																h.parentNode
																		.removeChild(h)
															}
															p.innerHTML = p.innerHTML
																	.replace(g,
																			"")
														}, this).bind() ])
			},
			$LOCAL_BEFORE_FIRST : function(a) {
				if (!!a.match(/(REGISTER_CONVERTERS)/)) {
					this.oApp.acceptLocalBeforeFirstAgain(this, true);
					return true
				}
				this._assignHTMLElements(this.oApp.htOptions.elAppContainer);
				this.sRXATagMarker = this.sATagMarker.replace(/\//g, "\\/")
						.replace(/\./g, "\\.");
				this.oApp.registerBrowserEvent(this.oBtnConfirm, "click",
						"APPLY_HYPERLINK");
				this.oApp.registerBrowserEvent(this.oBtnCancel, "click",
						"HIDE_ACTIVE_LAYER");
				this.oApp.registerBrowserEvent(this.oLinkInput, "keydown",
						"EVENT_HYPERLINK_KEYDOWN")
			},
			$ON_TOGGLE_HYPERLINK_LAYER : function() {
				if (!this.bLayerShown) {
					this.oApp.exec("IE_FOCUS", []);
					this.oSelection = this.oApp.getSelection()
				}
				this.oApp.delayedExec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [
						this.oHyperlinkLayer, null,
						"MSG_HYPERLINK_LAYER_SHOWN", [],
						"MSG_HYPERLINK_LAYER_HIDDEN", [ "" ] ], 0);
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "hyperlink" ])
			},
			$ON_MSG_HYPERLINK_LAYER_SHOWN : function() {
				this.bLayerShown = true;
				var b = this.oSelection.findAncestorByTagName("A");
				if (!b) {
					b = this._getSelectedNode()
				}
				if (b && !this.oSelection.collapsed) {
					this.oSelection.selectNode(b);
					this.oSelection.select();
					var a = b.target;
					try {
						var c = b.getAttribute("href");
						this.oLinkInput.value = c && c.indexOf("#") == -1 ? c
								: "http://"
					} catch (d) {
						this.oLinkInput.value = "http://"
					}
					this.bModify = true
				} else {
					this.oLinkInput.value = "http://";
					this.bModify = false
				}
				this.oApp.delayedExec("SELECT_UI", [ "hyperlink" ], 0);
				this.oLinkInput.focus();
				this.oLinkInput.value = this.oLinkInput.value;
				this.oLinkInput.select()
			},
			$ON_MSG_HYPERLINK_LAYER_HIDDEN : function() {
				this.bLayerShown = false;
				this.oApp.exec("DESELECT_UI", [ "hyperlink" ])
			},
			$ON_APPLY_HYPERLINK : function() {
				var h = this.oLinkInput.value;
				if (!/^((http|https|ftp|mailto):(?:\/\/)?)/.test(h)) {
					h = "http://" + h
				}
				h = h.replace(/\s+$/, "");
				var r = jindo.$Agent().navigator();
				var n = "";
				this.oApp.exec("IE_FOCUS", []);
				if (r.ie) {
					n = '<span style="text-decoration:none;">&nbsp;</span>'
				}
				if (this._validateURL(h)) {
					if (false) {
						sTarget = "_blank"
					} else {
						sTarget = "_self"
					}
					this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ "HYPERLINK",
							{
								sSaveTarget : (this.bModify ? "A" : null)
							} ]);
					var g;
					if (this.oSelection.collapsed) {
						var l = "<a href='" + h + "' target=" + sTarget + ">"
								+ h + "</a>" + n;
						this.oSelection.pasteHTML(l);
						g = this.oSelection.placeStringBookmark()
					} else {
						g = this.oSelection.placeStringBookmark();
						this.oSelection.select();
						if (r.ie && (r.version === 8 || r.nativeVersion === 8)) {
							this.oApp.exec("IE_FOCUS", []);
							this.oSelection.moveToBookmark(g);
							this.oSelection.select()
						}
						var b = Math.ceil(Math.random() * 10000);
						if (h == "") {
							this.oApp.exec("EXECCOMMAND", [ "unlink" ])
						} else {
							if (this._isExceptional()) {
								this.oApp.exec("EXECCOMMAND", [ "unlink",
										false, "", {
											bDontAddUndoHistory : true
										} ]);
								var f = "<a href='" + h + "' target=" + sTarget
										+ ">";
								jindo
										.$A(this.oSelection.getNodes(true))
										.forEach(
												function(u, e, w) {
													var v = this.oApp
															.getEmptySelection();
													if (u.nodeType === 3) {
														v.selectNode(u);
														v.pasteHTML(f
																+ u.nodeValue
																+ "</a>")
													} else {
														if (u.nodeType === 1
																&& u.tagName === "IMG") {
															v.selectNode(u);
															v
																	.pasteHTML(f
																			+ jindo
																					.$Element(
																							u)
																					.outerHTML()
																			+ "</a>")
														}
													}
												}, this)
							} else {
								this.oApp.exec("EXECCOMMAND", [
										"createLink",
										false,
										this.sATagMarker + b
												+ encodeURIComponent(h), {
											bDontAddUndoHistory : true
										} ])
							}
						}
						var p = this.oApp.getWYSIWYGDocument();
						var m = p.body.getElementsByTagName("A");
						var k = m.length;
						var j = new RegExp(this.sRXATagMarker + b, "gi");
						var s;
						for ( var o = 0; o < k; o++) {
							s = m[o];
							var t = "";
							try {
								t = s.getAttribute("href")
							} catch (q) {
							}
							if (t && t.match(j)) {
								var c = t.replace(j, "");
								var d = decodeURIComponent(c);
								if (r.ie) {
									jindo.$Element(s).attr({
										href : d,
										target : sTarget
									})
								} else {
									var a = jindo.$Element(s).html();
									jindo.$Element(s).attr({
										href : d,
										target : sTarget
									});
									if (this._validateURL(a)) {
										jindo.$Element(s).html(
												jindo.$Element(s).attr("href"))
									}
								}
							}
						}
					}
					this.oApp.exec("HIDE_ACTIVE_LAYER");
					setTimeout(jindo.$Fn(
							function() {
								var e = this.oApp.getEmptySelection();
								e.moveToBookmark(g);
								e.collapseToEnd();
								e.select();
								e.removeStringBookmark(g);
								this.oApp.exec("FOCUS");
								this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [
										"HYPERLINK",
										{
											sSaveTarget : (this.bModify ? "A"
													: null)
										} ])
							}, this).bind(), 17)
				} else {
					alert(this.oApp.$MSG("SE_Hyperlink.invalidURL"));
					this.oLinkInput.focus()
				}
			},
			_isExceptional : function() {
				var c = jindo.$Agent().navigator(), b = false, a = false;
				if (!c.ie) {
					return false
				}
				if (this.oApp.getWYSIWYGDocument().selection.type === "None") {
					b = jindo.$A(this.oSelection.getNodes()).some(
							function(e, d, f) {
								if (e.nodeType === 1 && e.tagName === "IMG") {
									return true
								}
							}, this);
					if (b) {
						return true
					}
				}
				if (c.nativeVersion > 8) {
					return false
				}
				a = jindo.$A(this.oSelection.getTextNodes()).some(
						function(e, d, f) {
							if (e.nodeValue.indexOf("@") >= 1) {
								return true
							}
						}, this);
				if (a) {
					return true
				}
				return false
			},
			$ON_EVENT_HYPERLINK_KEYDOWN : function(a) {
				if (a.key().enter) {
					this.oApp.exec("APPLY_HYPERLINK");
					a.stop()
				}
			},
			_getSelectedNode : function() {
				var a = this.oSelection.getNodes();
				for ( var b = 0; b < a.length; b++) {
					if (a[b].tagName && a[b].tagName == "A") {
						return a[b]
					}
				}
			},
			_validateURL : function(b) {
				if (!b) {
					return false
				}
				try {
					var a = b.split("?");
					a[0] = a[0].replace(/%[a-z0-9]{2}/gi, "U");
					decodeURIComponent(a[0])
				} catch (c) {
					return false
				}
				return /^(http|https|ftp|mailto):(\/\/)?(([-가-힣]|\w)+(?:[\/\.:@]([-가-힣]|\w)+)+)\/?(.*)?\s*$/i
						.test(b)
			}
		});
nhn.husky.SE2M_LineHeightWithLayerUI = jindo.$Class({
	name : "SE2M_LineHeightWithLayerUI",
	$ON_MSG_APP_READY : function() {
		this.oApp.exec("REGISTER_UI_EVENT", [ "lineHeight", "click",
				"SE2M_TOGGLE_LINEHEIGHT_LAYER" ])
	},
	_assignHTMLObjects : function(b) {
		this.oDropdownLayer = jindo.$$.getSingle(
				"DIV.husky_se2m_lineHeight_layer", b);
		this.aLIOptions = jindo.$A(jindo.$$("LI", this.oDropdownLayer)).filter(
				function(d, e, c) {
					return (d.firstChild !== null)
				})._array;
		this.oInput = jindo.$$.getSingle("INPUT", this.oDropdownLayer);
		var a = jindo.$$.getSingle(".husky_se2m_lineHeight_direct_input",
				this.oDropdownLayer);
		a = jindo.$$("BUTTON", a);
		this.oBtn_up = a[0];
		this.oBtn_down = a[1];
		this.oBtn_ok = a[2];
		this.oBtn_cancel = a[3]
	},
	$LOCAL_BEFORE_FIRST : function() {
		this._assignHTMLObjects(this.oApp.htOptions.elAppContainer);
		this.oApp.exec("SE2_ATTACH_HOVER_EVENTS", [ this.aLIOptions ]);
		for ( var a = 0; a < this.aLIOptions.length; a++) {
			this.oApp.registerBrowserEvent(this.aLIOptions[a], "click",
					"SET_LINEHEIGHT_FROM_LAYER_UI", [ this
							._getLineHeightFromLI(this.aLIOptions[a]) ])
		}
		this.oApp.registerBrowserEvent(this.oBtn_up, "click",
				"SE2M_INC_LINEHEIGHT", []);
		this.oApp.registerBrowserEvent(this.oBtn_down, "click",
				"SE2M_DEC_LINEHEIGHT", []);
		this.oApp.registerBrowserEvent(this.oBtn_ok, "click",
				"SE2M_SET_LINEHEIGHT_FROM_DIRECT_INPUT", []);
		this.oApp.registerBrowserEvent(this.oBtn_cancel, "click",
				"SE2M_CANCEL_LINEHEIGHT", []);
		this.oApp.registerBrowserEvent(this.oInput, "keydown",
				"EVENT_SE2M_LINEHEIGHT_KEYDOWN")
	},
	$ON_EVENT_SE2M_LINEHEIGHT_KEYDOWN : function(a) {
		if (a.key().enter) {
			this.oApp.exec("SE2M_SET_LINEHEIGHT_FROM_DIRECT_INPUT");
			a.stop()
		}
	},
	$ON_SE2M_TOGGLE_LINEHEIGHT_LAYER : function() {
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [ this.oDropdownLayer,
				null, "LINEHEIGHT_LAYER_SHOWN", [], "LINEHEIGHT_LAYER_HIDDEN",
				[] ]);
		this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "lineheight" ])
	},
	$ON_SE2M_INC_LINEHEIGHT : function() {
		this.oInput.value = parseInt(this.oInput.value, 10) || 0;
		this.oInput.value++
	},
	$ON_SE2M_DEC_LINEHEIGHT : function() {
		this.oInput.value = parseInt(this.oInput.value, 10) || 0;
		if (this.oInput.value > 0) {
			this.oInput.value--
		}
	},
	$ON_LINEHEIGHT_LAYER_SHOWN : function() {
		this.oApp.exec("SELECT_UI", [ "lineHeight" ]);
		this.oInitialSelection = this.oApp.getSelection();
		var b = this.oApp.getLineStyle("lineHeight");
		if (b != null && b !== 0) {
			this.oInput.value = (b * 100).toFixed(0);
			var a = this._getMatchingLI(this.oInput.value + "%");
			if (a) {
				jindo.$Element(a.firstChild).addClass("active")
			}
		} else {
			this.oInput.value = ""
		}
	},
	$ON_LINEHEIGHT_LAYER_HIDDEN : function() {
		this.oApp.exec("DESELECT_UI", [ "lineHeight" ]);
		this._clearOptionSelection()
	},
	$ON_SE2M_SET_LINEHEIGHT_FROM_DIRECT_INPUT : function() {
		this._setLineHeightAndCloseLayer(this.oInput.value)
	},
	$ON_SET_LINEHEIGHT_FROM_LAYER_UI : function(a) {
		this._setLineHeightAndCloseLayer(a)
	},
	$ON_SE2M_CANCEL_LINEHEIGHT : function() {
		this.oInitialSelection.select();
		this.oApp.exec("HIDE_ACTIVE_LAYER")
	},
	_setLineHeightAndCloseLayer : function(c) {
		var b = parseInt(c, 10) / 100;
		if (b > 0) {
			this.oApp.exec("SET_LINE_STYLE", [ "lineHeight", b ])
		} else {
			alert(this.oApp.$MSG("SE_LineHeight.invalidLineHeight"))
		}
		this.oApp.exec("SE2M_TOGGLE_LINEHEIGHT_LAYER", []);
		var a = jindo.$Agent().navigator();
		if (a.chrome || a.safari) {
			this.oApp.exec("FOCUS")
		}
	},
	_getMatchingLI : function(c) {
		var b;
		c = c.toLowerCase();
		for ( var a = 0; a < this.aLIOptions.length; a++) {
			b = this.aLIOptions[a];
			if (this._getLineHeightFromLI(b).toLowerCase() == c) {
				return b
			}
		}
		return null
	},
	_getLineHeightFromLI : function(a) {
		return a.firstChild.firstChild.innerHTML
	},
	_clearOptionSelection : function(b) {
		for ( var a = 0; a < this.aLIOptions.length; a++) {
			jindo.$Element(this.aLIOptions[a].firstChild).removeClass("active")
		}
	}
});
nhn.husky.SE2M_LineStyler = jindo.$Class({
	name : "SE2M_LineStyler",
	$ON_SE2M_TOGGLE_LINEHEIGHT_LAYER : function() {
		this.oApp.exec("ADD_APP_PROPERTY", [ "getLineStyle",
				jindo.$Fn(this.getLineStyle, this).bind() ])
	},
	$ON_SET_LINE_STYLE : function(a, c, d) {
		this.oSelection = this.oApp.getSelection();
		var b = this._getSelectedNodes(false);
		this.setLineStyle(a, c, d, b);
		this.oApp.exec("CHECK_STYLE_CHANGE", [])
	},
	$ON_SET_LINE_BLOCK_STYLE : function(a, b, c) {
		this.oSelection = this.oApp.getSelection();
		this.setLineBlockStyle(a, b, c);
		this.oApp.exec("CHECK_STYLE_CHANGE", [])
	},
	getLineStyle : function(e) {
		var d = this._getSelectedNodes(false);
		var j, k;
		var b, h;
		if (d.length === 0) {
			return null
		}
		var f = d.length;
		if (f === 0) {
			h = null
		} else {
			k = this._getLineWrapper(d[0]);
			h = this._getWrapperLineStyle(e, k)
		}
		var a = this.oSelection.getStartNode();
		if (h != null) {
			for ( var g = 1; g < f; g++) {
				if (this._isChildOf(d[g], j)) {
					continue
				}
				if (!d[g]) {
					continue
				}
				j = this._getLineWrapper(d[g]);
				if (j == k) {
					continue
				}
				b = this._getWrapperLineStyle(e, j);
				if (b != h) {
					h = null;
					break
				}
				k = j
			}
		}
		j = this._getLineWrapper(d[f - 1]);
		var c = this.oSelection.getEndNode();
		selectText = jindo.$Fn(function(m, l) {
			this.oSelection.setEndNodes(m, l);
			this.oSelection.select();
			this.oApp.exec("CHECK_STYLE_CHANGE", [])
		}, this).bind(a, c);
		setTimeout(selectText, 0);
		return h
	},
	setLineStyle : function(m, o, l, a) {
		thisRef = this;
		var p = false;
		function h(t, q, r) {
			if (!t) {
				p = true;
				try {
					t = thisRef.oSelection.surroundContentsWithNewNode("P")
				} catch (s) {
					t = thisRef.oSelection.surroundContentsWithNewNode("DIV")
				}
			}
			if (typeof r == "function") {
				r(t)
			} else {
				t.style[q] = r
			}
			if (t.childNodes.length === 0) {
				t.innerHTML = "&nbsp;"
			}
			return t
		}
		function b(e) {
			while (e && e.tagName != "BODY") {
				e = nhn.DOMFix.parentNode(e)
			}
			if (!e) {
				return false
			}
			return true
		}
		if (a.length === 0) {
			return
		}
		var k, n;
		var d = a.length;
		if ((!l || !l.bDontAddUndoHistory)) {
			this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ "LINE STYLE" ])
		}
		n = this._getLineWrapper(a[0]);
		n = h(n, m, o);
		var c = n;
		var g = n;
		for ( var f = 1; f < d; f++) {
			try {
				if (!b(nhn.DOMFix.parentNode(a[f]))) {
					continue
				}
			} catch (j) {
				continue
			}
			if (this._isChildOf(a[f], k)) {
				continue
			}
			k = this._getLineWrapper(a[f]);
			if (k == n) {
				continue
			}
			k = h(k, m, o);
			n = k
		}
		g = k || c;
		if (p && (!l || !l.bDoNotSelect)) {
			setTimeout(jindo.$Fn(
					function(q, e, r) {
						if (q == e) {
							this.oSelection.selectNodeContents(q);
							if (q.childNodes.length == 1
									&& q.firstChild.tagName == "BR") {
								this.oSelection.collapseToStart()
							}
						} else {
							this.oSelection.setEndNodes(q, e)
						}
						this.oSelection.select();
						if ((!r || !r.bDontAddUndoHistory)) {
							this.oApp.exec("RECORD_UNDO_AFTER_ACTION",
									[ "LINE STYLE" ])
						}
					}, this).bind(c, g, l), 0)
		}
	},
	setLineBlockStyle : function(l, n, g) {
		var a = {};
		var c = [];
		var h = [];
		this.oApp.exec("GET_SELECTED_TD_BLOCK", [ "aTdCells", a ]);
		var f = a.aTdCells;
		for ( var e = 0; e < f.length; e++) {
			this.oSelection.selectNode(f[e]);
			c = this.oSelection.getNodes();
			for ( var d = 0, b = 0; d < c.length; d++) {
				if (c[d].nodeType == 3 || (c[d].tagName == "BR" && d == 0)) {
					h[b] = c[d];
					b++
				}
			}
			this.setLineStyle(l, n, g, h);
			c = h = []
		}
	},
	getTextNodes : function(a, b) {
		var c = function(d) {
			if ((d.nodeType == 3 && d.nodeValue != "\n" && d.nodeValue != "")
					|| (d.tagName == "LI" && d.innerHTML == "")
					|| (d.tagName == "P" && d.innerHTML == "")) {
				return true
			} else {
				return false
			}
		};
		return b.getNodes(a, c)
	},
	_getSelectedNodes : function(c) {
		if (!c) {
			this.oSelection = this.oApp.getSelection()
		}
		if (this.oSelection.endContainer.tagName == "LI"
				&& this.oSelection.endOffset == 0
				&& this.oSelection.endContainer.innerHTML == "") {
			this.oSelection.setEndAfter(this.oSelection.endContainer)
		}
		if (this.oSelection.collapsed) {
			this.oSelection.selectNode(this.oSelection.commonAncestorContainer)
		}
		var a = this.getTextNodes(false, this.oSelection);
		if (a.length === 0) {
			var b = this.oSelection.getStartNode();
			if (b) {
				a[0] = b
			} else {
				var d = this.oSelection._document.createTextNode("\u00A0");
				this.oSelection.insertNode(d);
				a = [ d ]
			}
		}
		return a
	},
	_getWrapperLineStyle : function(b, c) {
		var a = null;
		if (c && c.style[b]) {
			a = c.style[b]
		} else {
			c = this.oSelection.commonAncesterContainer;
			while (c && !this.oSelection.rxLineBreaker.test(c.tagName)) {
				if (c && c.style[b]) {
					a = c.style[b];
					break
				}
				c = nhn.DOMFix.parentNode(c)
			}
		}
		return a
	},
	_isChildOf : function(b, a) {
		while (b && b.tagName != "BODY") {
			if (b == a) {
				return true
			}
			b = nhn.DOMFix.parentNode(b)
		}
		return false
	},
	_getLineWrapper : function(d) {
		var k = this.oApp.getEmptySelection();
		k.selectNode(d);
		var m = k.getLineInfo();
		var l = m.oStart;
		var f = m.oEnd;
		var j, h;
		var g, e;
		var c = null;
		j = l.oNode;
		g = l.oLineBreaker;
		h = f.oNode;
		e = f.oLineBreaker;
		this.oSelection.setEndNodes(j, h);
		if (g == e) {
			if (g.tagName == "P" || g.tagName == "DIV" || g.tagName == "LI") {
				c = g
			} else {
				this.oSelection.setEndNodes(g.firstChild, g.lastChild)
			}
		}
		return c
	}
});
nhn.husky.SE_WYSIWYGStyleGetter = jindo
		.$Class({
			name : "SE_WYSIWYGStyleGetter",
			hKeyUp : null,
			getStyleInterval : 200,
			oStyleMap : {
				fontFamily : {
					type : "Value",
					css : "fontFamily"
				},
				fontSize : {
					type : "Value",
					css : "fontSize"
				},
				lineHeight : {
					type : "Value",
					css : "lineHeight",
					converter : function(b, a) {
						if (!b.match(/px$/)) {
							return b
						}
						return Math.ceil((parseInt(b, 10) / parseInt(
								a.fontSize, 10)) * 10) / 10
					}
				},
				bold : {
					command : "bold"
				},
				underline : {
					command : "underline"
				},
				italic : {
					command : "italic"
				},
				lineThrough : {
					command : "strikethrough"
				},
				superscript : {
					command : "superscript"
				},
				subscript : {
					command : "subscript"
				},
				justifyleft : {
					command : "justifyleft"
				},
				justifycenter : {
					command : "justifycenter"
				},
				justifyright : {
					command : "justifyright"
				},
				justifyfull : {
					command : "justifyfull"
				},
				orderedlist : {
					command : "insertorderedlist"
				},
				unorderedlist : {
					command : "insertunorderedlist"
				}
			},
			$init : function() {
				this.oStyle = this._getBlankStyle()
			},
			$LOCAL_BEFORE_ALL : function() {
				return (this.oApp.getEditingMode() == "WYSIWYG")
			},
			$ON_MSG_APP_READY : function() {
				this.oDocument = this.oApp.getWYSIWYGDocument();
				this.oApp.exec("ADD_APP_PROPERTY", [ "getCurrentStyle",
						jindo.$Fn(this.getCurrentStyle, this).bind() ]);
				if (jindo.$Agent().navigator().safari
						|| jindo.$Agent().navigator().chrome) {
					this.oStyleMap.textAlign = {
						type : "Value",
						css : "textAlign"
					}
				}
			},
			$ON_EVENT_EDITING_AREA_MOUSEUP : function(a) {
				this.oApp.exec("CHECK_STYLE_CHANGE")
			},
			$ON_EVENT_EDITING_AREA_KEYPRESS : function(a) {
				var b;
				if (this.oApp.oNavigator.firefox) {
					b = a.key();
					if (b.ctrl && b.keyCode == 97) {
						return
					}
				}
				if (this.bAllSelected) {
					this.bAllSelected = false;
					return
				}
				this.oApp.exec("CHECK_STYLE_CHANGE")
			},
			$ON_EVENT_EDITING_AREA_KEYDOWN : function(a) {
				var b = a.key();
				if ((this.oApp.oNavigator.ie || this.oApp.oNavigator.firefox)
						&& b.ctrl && b.keyCode == 65) {
					this.oApp.exec("RESET_STYLE_STATUS");
					this.bAllSelected = true;
					return
				}
				if (!(b.keyCode == 8 || (b.keyCode >= 33 && b.keyCode <= 40)
						|| b.keyCode == 45 || b.keyCode == 46)) {
					return
				}
				if (this.bAllSelected) {
					if (this.oApp.oNavigator.firefox) {
						return
					}
					this.bAllSelected = false;
					return
				}
				this.oApp.exec("CHECK_STYLE_CHANGE")
			},
			$ON_CHECK_STYLE_CHANGE : function() {
				this._getStyle()
			},
			$ON_RESET_STYLE_STATUS : function() {
				this.oStyle = this._getBlankStyle();
				var a = this._getStyleOf(this.oApp.getWYSIWYGDocument().body);
				this.oStyle.fontFamily = a.fontFamily;
				this.oStyle.fontSize = a.fontSize;
				this.oStyle.justifyleft = "@^";
				for ( var b in this.oStyle) {
					this.oApp.exec("MSG_STYLE_CHANGED", [ b, this.oStyle[b] ])
				}
			},
			getCurrentStyle : function() {
				return this.oStyle
			},
			_check_style_change : function() {
				this.oApp.exec("CHECK_STYLE_CHANGE", [])
			},
			_getBlankStyle : function() {
				var a = {};
				for ( var b in this.oStyleMap) {
					if (this.oStyleMap[b].type == "Value") {
						a[b] = ""
					} else {
						a[b] = 0
					}
				}
				return a
			},
			_getStyle : function() {
				var a;
				if (nhn.CurrentSelection.isCollapsed()) {
					a = this._getStyleOf(nhn.CurrentSelection
							.getCommonAncestorContainer())
				} else {
					var c = this.oApp.getSelection();
					var b = function(e) {
						if (!e.childNodes || e.childNodes.length == 0) {
							return true
						} else {
							return false
						}
					};
					var d = c.getNodes(false, b);
					if (d.length == 0) {
						a = this._getStyleOf(c.commonAncestorContainer)
					} else {
						a = this._getStyleOf(d[0])
					}
				}
				for (attributeName in a) {
					if (this.oStyleMap[attributeName].converter) {
						a[attributeName] = this.oStyleMap[attributeName]
								.converter(a[attributeName], a)
					}
					if (this.oStyle[attributeName] != a[attributeName]) {
						this.oApp.exec("MSG_STYLE_CHANGED", [ attributeName,
								a[attributeName] ])
					}
				}
				this.oStyle = a
			},
			_getStyleOf : function(g) {
				var a = this._getBlankStyle();
				if (!g) {
					return a
				}
				if (g.nodeType == 3) {
					g = g.parentNode
				} else {
					if (g.nodeType == 9) {
						g = g.body
					}
				}
				var f = jindo.$Element(g);
				var c, j;
				for ( var b in this.oStyle) {
					c = this.oStyleMap[b];
					if (c.type && c.type == "Value") {
						try {
							if (c.css) {
								var h = f.css(c.css);
								if (b == "fontFamily") {
									h = h.split(/,/)[0]
								}
								a[b] = h
							} else {
								if (c.command) {
									a[b] = this.oDocument
											.queryCommandState(c.command)
								} else {
								}
							}
						} catch (d) {
						}
					} else {
						if (c.command) {
							try {
								if (this.oDocument.queryCommandState(c.command)) {
									a[b] = "@^"
								} else {
									a[b] = "@-"
								}
							} catch (d) {
							}
						} else {
						}
					}
				}
				switch (a.textAlign) {
				case "left":
					a.justifyleft = "@^";
					break;
				case "center":
					a.justifycenter = "@^";
					break;
				case "right":
					a.justifyright = "@^";
					break;
				case "justify":
					a.justifyfull = "@^";
					break
				}
				if (a.justifyleft == "@-" && a.justifycenter == "@-"
						&& a.justifyright == "@-" && a.justifyfull == "@-") {
					a.justifyleft = "@^"
				}
				return a
			}
		});
nhn.husky.SE_WYSIWYGStyler = jindo
		.$Class({
			name : "SE_WYSIWYGStyler",
			sBlankText : unescape("%uFEFF"),
			$init : function() {
				var a = jindo.$Agent().navigator();
				if (!a.ie || a.nativeVersion < 9 || document.documentMode < 9) {
					this._addCursorHolder = function() {
					}
				}
			},
			_addCursorHolder : function(c, f) {
				var b = this.oApp.getWYSIWYGDocument().body, e, d = jindo
						.$Element(f), g, a;
				g = b.innerHTML;
				e = b;
				if (g === d.outerHTML()) {
					a = c._document.createTextNode(unescape("%uFEFF"));
					e.appendChild(a);
					return
				}
				e = nhn.husky.SE2M_Utils.findAncestorByTagName("P", f);
				if (!e) {
					return
				}
				g = e.innerHTML;
				if (g.indexOf("&nbsp;") > -1) {
					return
				}
				a = c._document.createTextNode(unescape("%u00A0"));
				e.appendChild(a)
			},
			$PRECONDITION : function(a, b) {
				return (this.oApp.getEditingMode() == "WYSIWYG")
			},
			$ON_SET_WYSIWYG_STYLE : function(c) {
				var b = this.oApp.getSelection();
				var x = {};
				this.oApp.exec("IS_SELECTED_TD_BLOCK", [ "bIsSelectedTd", x ]);
				var g = x.bIsSelectedTd;
				if (b.collapsed && !g) {
					this.oApp.exec("RECORD_UNDO_ACTION", [ "FONT STYLE", {
						bMustBlockElement : true
					} ]);
					var l, q;
					var d = b.commonAncestorContainer;
					if (d.nodeType == 3) {
						d = d.parentNode
					}
					if (d
							&& d.tagName == "SPAN"
							&& (d.innerHTML == ""
									|| d.innerHTML == this.sBlankText || d.innerHTML == "&nbsp;")) {
						q = false;
						l = d
					} else {
						q = true;
						l = this.oApp.getWYSIWYGDocument()
								.createElement("SPAN")
					}
					l.innerHTML = this.sBlankText;
					var a;
					for ( var f in c) {
						a = c[f];
						if (typeof a != "string") {
							continue
						}
						l.style[f] = a
					}
					if (q) {
						if (b.startContainer.tagName == "BODY"
								&& b.startOffset === 0) {
							var n = b._getVeryFirstRealChild(this.oApp
									.getWYSIWYGDocument().body);
							var h = true;
							var p = n.cloneNode(false);
							try {
								p.innerHTML = "test";
								if (p.innerHTML != "test") {
									h = false
								}
							} catch (v) {
								h = false
							}
							if (h && p.nodeType == 1 && p.tagName == "BR") {
								b.selectNode(n);
								b.collapseToStart();
								b.insertNode(l)
							} else {
								if (h && n.tagName != "IFRAME" && n.appendChild
										&& typeof n.innerHTML == "string") {
									n.appendChild(l)
								} else {
									b.selectNode(n);
									b.collapseToStart();
									b.insertNode(l)
								}
							}
						} else {
							b.collapseToStart();
							b.insertNode(l)
						}
					} else {
						b = this.oApp.getEmptySelection()
					}
					if (!!c.color) {
						b._checkTextDecoration(l)
					}
					this._addCursorHolder(b, l);
					b.selectNodeContents(l);
					b.collapseToEnd();
					b._window.focus();
					b._window.document.body.focus();
					b.select();
					return
				}
				this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ "FONT STYLE", {
					bMustBlockElement : true
				} ]);
				if (g) {
					var r;
					this.oApp.exec("GET_SELECTED_TD_BLOCK", [ "aTdCells", x ]);
					r = x.aTdCells;
					for ( var s = 0; s < r.length; s++) {
						b.selectNodeContents(r[s]);
						b.styleRange(c);
						b.select()
					}
				} else {
					var m = !!c.color;
					var t = c.fontSize || c.fontFamily;
					b.styleRange(c, null, null, t, m);
					if (jindo.$Agent().navigator().firefox) {
						var o = b.aStyleParents;
						for ( var u = 0, k = o.length; u < k; u++) {
							var w = o[u];
							if (w.nextSibling && w.nextSibling.tagName == "BR"
									&& !w.nextSibling.nextSibling) {
								w.parentNode.removeChild(w.nextSibling)
							}
						}
					}
					b._window.focus();
					b.select()
				}
				this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [ "FONT STYLE", {
					bMustBlockElement : true
				} ])
			}
		});
nhn.husky.SE2M_FindReplacePlugin = jindo.$Class({
	name : "SE2M_FindReplacePlugin",
	oEditingWindow : null,
	oFindReplace : null,
	bFindMode : true,
	bLayerShown : false,
	$init : function() {
		this.nDefaultTop = 20
	},
	$ON_MSG_APP_READY : function() {
		this.oEditingWindow = this.oApp.getWYSIWYGWindow();
		this.oApp.exec("REGISTER_HOTKEY", [ "ctrl+f", "SHOW_FIND_LAYER", [] ]);
		this.oApp.exec("REGISTER_HOTKEY",
				[ "ctrl+h", "SHOW_REPLACE_LAYER", [] ]);
		this.oApp.exec("REGISTER_UI_EVENT", [ "findAndReplace", "click",
				"TOGGLE_FIND_REPLACE_LAYER" ])
	},
	$ON_SHOW_ACTIVE_LAYER : function() {
		this.oApp.exec("HIDE_DIALOG_LAYER", [ this.elDropdownLayer ])
	},
	_assignHTMLElements : function() {
		var a = this.oApp.htOptions.elAppContainer;
		this.oApp.exec("LOAD_HTML", [ "find_and_replace" ]);
		this.elDropdownLayer = jindo.$$.getSingle(
				"DIV.husky_se2m_findAndReplace_layer", a);
		this.welDropdownLayer = jindo.$Element(this.elDropdownLayer);
		var b = jindo.$$("LI", this.elDropdownLayer);
		this.oFindTab = b[0];
		this.oReplaceTab = b[1];
		b = jindo.$$(".container > .bx", this.elDropdownLayer);
		this.oFindInputSet = jindo.$$.getSingle(".husky_se2m_find_ui",
				this.elDropdownLayer);
		this.oReplaceInputSet = jindo.$$.getSingle(".husky_se2m_replace_ui",
				this.elDropdownLayer);
		this.elTitle = jindo.$$.getSingle("H3", this.elDropdownLayer);
		this.oFindInput_Keyword = jindo.$$.getSingle("INPUT",
				this.oFindInputSet);
		b = jindo.$$("INPUT", this.oReplaceInputSet);
		this.oReplaceInput_Original = b[0];
		this.oReplaceInput_Replacement = b[1];
		this.oFindNextButton = jindo.$$.getSingle(
				"BUTTON.husky_se2m_find_next", this.elDropdownLayer);
		this.oReplaceFindNextButton = jindo.$$.getSingle(
				"BUTTON.husky_se2m_replace_find_next", this.elDropdownLayer);
		this.oReplaceButton = jindo.$$.getSingle("BUTTON.husky_se2m_replace",
				this.elDropdownLayer);
		this.oReplaceAllButton = jindo.$$.getSingle(
				"BUTTON.husky_se2m_replace_all", this.elDropdownLayer);
		this.aCloseButtons = jindo.$$("BUTTON.husky_se2m_cancel",
				this.elDropdownLayer)
	},
	$LOCAL_BEFORE_FIRST : function(a) {
		this._assignHTMLElements();
		this.oFindReplace = new nhn.FindReplace(this.oEditingWindow);
		for ( var b = 0; b < this.aCloseButtons.length; b++) {
			var e = jindo.$Fn(this.oApp.exec, this.oApp).bind(
					"HIDE_FIND_REPLACE_LAYER", [ this.elDropdownLayer ]);
			jindo.$Fn(e, this).attach(this.aCloseButtons[b], "click")
		}
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("SHOW_FIND", []),
				this).attach(this.oFindTab, "click");
		jindo.$Fn(
				jindo.$Fn(this.oApp.exec, this.oApp).bind("SHOW_REPLACE", []),
				this).attach(this.oReplaceTab, "click");
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("FIND", []), this)
				.attach(this.oFindNextButton, "click");
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("FIND", []), this)
				.attach(this.oReplaceFindNextButton, "click");
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("REPLACE", []),
				this).attach(this.oReplaceButton, "click");
		jindo.$Fn(jindo.$Fn(this.oApp.exec, this.oApp).bind("REPLACE_ALL", []),
				this).attach(this.oReplaceAllButton, "click");
		this.oFindInput_Keyword.value = "";
		this.oReplaceInput_Original.value = "";
		this.oReplaceInput_Replacement.value = "";
		var d = this.oApp.getWYSIWYGWindow().frameElement;
		this.htOffsetPos = jindo.$Element(d).offset();
		this.nEditorWidth = d.offsetWidth;
		this.elDropdownLayer.style.display = "block";
		this.htInitialPos = this.welDropdownLayer.offset();
		var c = this.oApp.oUtils.getScrollXY();
		this.welDropdownLayer.offset(this.htOffsetPos.top,
				this.htOffsetPos.left);
		this.htTopLeftCorner = {
			x : parseInt(this.elDropdownLayer.style.left, 10),
			y : parseInt(this.elDropdownLayer.style.top, 10)
		};
		this.nLayerWidth = 258;
		this.nLayerHeight = 160;
		this.elDropdownLayer.style.display = "none"
	},
	$ON_TOGGLE_FIND_REPLACE_LAYER : function() {
		if (!this.bLayerShown) {
			this.oApp.exec("SHOW_FIND_REPLACE_LAYER")
		} else {
			this.oApp.exec("HIDE_FIND_REPLACE_LAYER")
		}
	},
	$ON_SHOW_FIND_REPLACE_LAYER : function() {
		this.bLayerShown = true;
		this.oApp.exec("DISABLE_ALL_UI", [ {
			aExceptions : [ "findAndReplace" ]
		} ]);
		this.oApp.exec("SELECT_UI", [ "findAndReplace" ]);
		this.oApp.exec("HIDE_ALL_DIALOG_LAYER", []);
		this.elDropdownLayer.style.top = this.nDefaultTop + "px";
		this.oApp.exec("SHOW_DIALOG_LAYER", [
				this.elDropdownLayer,
				{
					elHandle : this.elTitle,
					fnOnDragStart : jindo.$Fn(this.oApp.exec, this.oApp).bind(
							"SHOW_EDITING_AREA_COVER"),
					fnOnDragEnd : jindo.$Fn(this.oApp.exec, this.oApp).bind(
							"HIDE_EDITING_AREA_COVER"),
					nMinX : this.htTopLeftCorner.x,
					nMinY : this.nDefaultTop,
					nMaxX : this.htTopLeftCorner.x
							+ this.oApp.getEditingAreaWidth()
							- this.nLayerWidth,
					nMaxY : this.htTopLeftCorner.y
							+ this.oApp.getEditingAreaHeight()
							- this.nLayerHeight,
					sOnShowMsg : "FIND_REPLACE_LAYER_SHOWN"
				} ]);
		this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "findreplace" ])
	},
	$ON_HIDE_FIND_REPLACE_LAYER : function() {
		this.oApp.exec("ENABLE_ALL_UI");
		this.oApp.exec("DESELECT_UI", [ "findAndReplace" ]);
		this.oApp.exec("HIDE_ALL_DIALOG_LAYER", []);
		this.bLayerShown = false
	},
	$ON_FIND_REPLACE_LAYER_SHOWN : function() {
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [ this.elDropdownLayer ]);
		if (this.bFindMode) {
			this.oFindInput_Keyword.value = "_clear_";
			this.oFindInput_Keyword.value = "";
			this.oFindInput_Keyword.focus()
		} else {
			this.oReplaceInput_Original.value = "_clear_";
			this.oReplaceInput_Original.value = "";
			this.oReplaceInput_Replacement.value = "";
			this.oReplaceInput_Original.focus()
		}
		this.oApp.exec("HIDE_CURRENT_ACTIVE_LAYER", [])
	},
	$ON_SHOW_FIND_LAYER : function() {
		this.oApp.exec("SHOW_FIND");
		this.oApp.exec("SHOW_FIND_REPLACE_LAYER")
	},
	$ON_SHOW_REPLACE_LAYER : function() {
		this.oApp.exec("SHOW_REPLACE");
		this.oApp.exec("SHOW_FIND_REPLACE_LAYER")
	},
	$ON_SHOW_FIND : function() {
		this.bFindMode = true;
		this.oFindInput_Keyword.value = this.oReplaceInput_Original.value;
		jindo.$Element(this.oFindTab).addClass("active");
		jindo.$Element(this.oReplaceTab).removeClass("active");
		jindo.$Element(this.oFindNextButton).removeClass("normal");
		jindo.$Element(this.oFindNextButton).addClass("strong");
		this.oFindInputSet.style.display = "block";
		this.oReplaceInputSet.style.display = "none";
		this.oReplaceButton.style.display = "none";
		this.oReplaceAllButton.style.display = "none";
		jindo.$Element(this.elDropdownLayer).removeClass("replace");
		jindo.$Element(this.elDropdownLayer).addClass("find")
	},
	$ON_SHOW_REPLACE : function() {
		this.bFindMode = false;
		this.oReplaceInput_Original.value = this.oFindInput_Keyword.value;
		jindo.$Element(this.oFindTab).removeClass("active");
		jindo.$Element(this.oReplaceTab).addClass("active");
		jindo.$Element(this.oFindNextButton).removeClass("strong");
		jindo.$Element(this.oFindNextButton).addClass("normal");
		this.oFindInputSet.style.display = "none";
		this.oReplaceInputSet.style.display = "block";
		this.oReplaceButton.style.display = "inline";
		this.oReplaceAllButton.style.display = "inline";
		jindo.$Element(this.elDropdownLayer).removeClass("find");
		jindo.$Element(this.elDropdownLayer).addClass("replace")
	},
	$ON_FIND : function() {
		var a;
		if (this.bFindMode) {
			a = this.oFindInput_Keyword.value
		} else {
			a = this.oReplaceInput_Original.value
		}
		var b = this.oApp.getSelection();
		b.select();
		switch (this.oFindReplace.find(a, false)) {
		case 1:
			alert(this.oApp.$MSG("SE_FindReplace.keywordNotFound"));
			b.select();
			break;
		case 2:
			alert(this.oApp.$MSG("SE_FindReplace.keywordMissing"));
			break
		}
	},
	$ON_REPLACE : function() {
		var a = this.oReplaceInput_Original.value;
		var c = this.oReplaceInput_Replacement.value;
		var b = this.oApp.getSelection();
		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ "REPLACE" ]);
		var d = this.oFindReplace.replace(a, c, false);
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [ "REPLACE" ]);
		switch (d) {
		case 1:
		case 3:
			alert(this.oApp.$MSG("SE_FindReplace.keywordNotFound"));
			b.select();
			break;
		case 4:
			alert(this.oApp.$MSG("SE_FindReplace.keywordMissing"));
			break
		}
	},
	$ON_REPLACE_ALL : function() {
		var b = this.oReplaceInput_Original.value;
		var d = this.oReplaceInput_Replacement.value;
		var c = this.oApp.getSelection();
		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ "REPLACE ALL", {
			sSaveTarget : "BODY"
		} ]);
		var a = this.oFindReplace.replaceAll(b, d, false);
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [ "REPLACE ALL", {
			sSaveTarget : "BODY"
		} ]);
		if (a === 0) {
			alert(this.oApp.$MSG("SE_FindReplace.replaceKeywordNotFound"));
			c.select();
			this.oApp.exec("FOCUS")
		} else {
			if (a < 0) {
				alert(this.oApp.$MSG("SE_FindReplace.keywordMissing"));
				c.select()
			} else {
				alert(this.oApp.$MSG("SE_FindReplace.replaceAllResultP1") + a
						+ this.oApp.$MSG("SE_FindReplace.replaceAllResultP2"));
				c = this.oApp.getEmptySelection();
				c.select();
				this.oApp.exec("FOCUS")
			}
		}
	}
});
nhn.husky.SE2M_Quote = jindo
		.$Class({
			name : "SE2M_Quote",
			htQuoteStyles_view : null,
			$init : function() {
				var a = nhn.husky.SE2M_Configuration.Quote || {};
				var b = a.sImageBaseURL;
				this.nMaxLevel = a.nMaxLevel || 14;
				this.htQuoteStyles_view = {};
				this.htQuoteStyles_view.se2_quote1 = "_zoom:1;padding:0 8px; margin:0 0 30px 20px; margin-right:15px; border-left:2px solid #cccccc;color:#888888;";
				this.htQuoteStyles_view.se2_quote2 = "_zoom:1;margin:0 0 30px 13px;padding:0 8px 0 16px;background:url("
						+ b + "/bg_quote2.gif) 0 3px no-repeat;color:#888888;";
				this.htQuoteStyles_view.se2_quote3 = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px dashed #cccccc;color:#888888;";
				this.htQuoteStyles_view.se2_quote4 = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px dashed #66b246;color:#888888;";
				this.htQuoteStyles_view.se2_quote5 = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px dashed #cccccc;background:url("
						+ b
						+ "/bg_b1.png) repeat;_background:none;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"
						+ b
						+ "/bg_b1.png',sizingMethod='scale');color:#888888;";
				this.htQuoteStyles_view.se2_quote6 = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px solid #e5e5e5;color:#888888;";
				this.htQuoteStyles_view.se2_quote7 = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px solid #66b246;color:#888888;";
				this.htQuoteStyles_view.se2_quote8 = "_zoom:1;margin:0 0 30px 0;padding:10px;border:1px solid #e5e5e5;background:url("
						+ b
						+ "/bg_b1.png) repeat;_background:none;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"
						+ b
						+ "/bg_b1.png',sizingMethod='scale');color:#888888;";
				this.htQuoteStyles_view.se2_quote9 = "_zoom:1;margin:0 0 30px 0;padding:10px;border:2px solid #e5e5e5;color:#888888;";
				this.htQuoteStyles_view.se2_quote10 = "_zoom:1;margin:0 0 30px 0;padding:10px;border:2px solid #e5e5e5;background:url("
						+ b
						+ "/bg_b1.png) repeat;_background:none;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"
						+ b
						+ "/bg_b1.png',sizingMethod='scale');color:#888888;"
			},
			_assignHTMLElements : function() {
				this.elDropdownLayer = jindo.$$.getSingle(
						"DIV.husky_seditor_blockquote_layer",
						this.oApp.htOptions.elAppContainer);
				this.aLI = jindo.$$("LI", this.elDropdownLayer)
			},
			$ON_REGISTER_CONVERTERS : function() {
				this.oApp
						.exec(
								"ADD_CONVERTER",
								[
										"DB_TO_IR",
										jindo
												.$Fn(
														function(a) {
															a = a
																	.replace(
																			/<(blockquote)[^>]*class=['"]?(se2_quote[0-9]+)['"]?[^>]*>/gi,
																			"<$1 class=$2>");
															return a
														}, this).bind() ]);
				this.oApp
						.exec(
								"ADD_CONVERTER",
								[
										"IR_TO_DB",
										jindo
												.$Fn(
														function(a) {
															var b = this.htQuoteStyles_view;
															a = a
																	.replace(
																			/<(blockquote)[^>]*class=['"]?(se2_quote[0-9]+)['"]?[^>]*>/gi,
																			function(
																					e,
																					d,
																					c) {
																				return "<"
																						+ d
																						+ " class="
																						+ c
																						+ ' style="'
																						+ b[c]
																						+ '">'
																			});
															return a
														}, this).bind() ]);
				this.htSE1toSE2Map = {
					"01" : "1",
					"02" : "2",
					"03" : "6",
					"04" : "8",
					"05" : "9",
					"07" : "3",
					"08" : "5"
				}
			},
			$LOCAL_BEFORE_FIRST : function() {
				this._assignHTMLElements();
				this.oApp.registerBrowserEvent(this.elDropdownLayer, "click",
						"EVENT_SE2_BLOCKQUOTE_LAYER_CLICK", []);
				this.oApp.delayedExec("SE2_ATTACH_HOVER_EVENTS", [ this.aLI ],
						0)
			},
			$ON_MSG_APP_READY : function() {
				this.oApp.exec("REGISTER_UI_EVENT", [ "quote", "click",
						"TOGGLE_BLOCKQUOTE_LAYER" ])
			},
			$ON_TOGGLE_BLOCKQUOTE_LAYER : function() {
				this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [
						this.elDropdownLayer, null, "SELECT_UI", [ "quote" ],
						"DESELECT_UI", [ "quote" ] ]);
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "quote" ])
			},
			$ON_EVENT_SE2_BLOCKQUOTE_LAYER_CLICK : function(b) {
				var a = nhn.husky.SE2M_Utils.findAncestorByTagName("BUTTON",
						b.element);
				if (!a || a.tagName != "BUTTON") {
					return
				}
				var c = a.className;
				this.oApp.exec("APPLY_BLOCKQUOTE", [ c ])
			},
			$ON_APPLY_BLOCKQUOTE : function(a) {
				if (a.match(/(se2_quote[0-9]+)/)) {
					this._wrapBlock("BLOCKQUOTE", RegExp.$1)
				} else {
					this._unwrapBlock("BLOCKQUOTE")
				}
				this.oApp.exec("HIDE_ACTIVE_LAYER", [])
			},
			_isExceedMaxDepth : function(b) {
				var a = function(c) {
					var f = c.firstChild;
					var d = 0;
					var e = 0;
					if (!f) {
						if (c.tagName && c.tagName === "BLOCKQUOTE") {
							return 1
						} else {
							return 0
						}
					}
					while (f) {
						if (f.nodeType === 1) {
							d = a(f);
							if (f.tagName === "BLOCKQUOTE") {
								d += 1
							}
							if (e < d) {
								e = d
							}
							if (e >= this.nMaxLevel) {
								return e
							}
						}
						f = f.nextSibling
					}
					return e
				};
				return (a(b) >= this.nMaxLevel)
			},
			_unwrapBlock : function(a) {
				var b = this.oApp.getSelection();
				var c = b.commonAncestorContainer;
				while (c && c.tagName != a) {
					c = c.parentNode
				}
				if (!c) {
					return
				}
				this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [
						"CANCEL BLOCK QUOTE", {
							sSaveTarget : "BODY"
						} ]);
				while (c.firstChild) {
					c.parentNode.insertBefore(c.firstChild, c)
				}
				c.parentNode.removeChild(c);
				this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [
						"CANCEL BLOCK QUOTE", {
							sSaveTarget : "BODY"
						} ])
			},
			_wrapBlock : function(w, f) {
				var b, u, e, a, o = /BODY|TD|LI/i, x, c, n, t, h, k, j, l, p, m, v, g, s, q, d, r;
				this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ "BLOCK QUOTE", {
					sSaveTarget : "BODY"
				} ]);
				b = this.oApp.getSelection();
				if (b.startContainer === b.endContainer
						&& b.startContainer.nodeType === 1
						&& b.startContainer.tagName === "P"
						&& nhn.husky.SE2M_Utils.isBlankNode(b.startContainer)) {
					u = b.getLineInfo(true)
				} else {
					u = b.getLineInfo(false)
				}
				e = u.oStart;
				a = u.oEnd;
				if (e.bParentBreak && !o.test(e.oLineBreaker.tagName)) {
					x = e.oNode.parentNode
				} else {
					x = e.oNode
				}
				if (a.bParentBreak && !o.test(a.oLineBreaker.tagName)) {
					c = a.oNode.parentNode
				} else {
					c = a.oNode
				}
				b.setStartBefore(x);
				b.setEndAfter(c);
				n = this._expandToTableStart(b, c);
				if (n) {
					c = n;
					b.setEndAfter(n)
				}
				n = this._expandToTableStart(b, x);
				if (n) {
					x = n;
					b.setStartBefore(n)
				}
				n = x;
				b.fixCommonAncestorContainer();
				t = b.commonAncestorContainer;
				if (b.startContainer == b.endContainer
						&& b.endOffset - b.startOffset == 1) {
					h = b.startContainer.childNodes[b.startOffset]
				} else {
					h = b.commonAncestorContainer
				}
				k = this._findParentQuote(h);
				if (k) {
					k.className = f;
					return
				}
				while (!t.tagName
						|| (t.tagName && t.tagName.match(/UL|OL|LI|IMG|IFRAME/))) {
					t = t.parentNode
				}
				while (n && n != t && n.parentNode != t) {
					n = n.parentNode
				}
				if (n == t) {
					j = t.firstChild
				} else {
					j = n
				}
				l = b._document.createElement(w);
				if (f) {
					l.className = f
				}
				t.insertBefore(l, j);
				b.setStartAfter(l);
				b.setEndAfter(c);
				b.surroundContents(l);
				if (this._isExceedMaxDepth(l)) {
					alert(this.oApp.$MSG("SE2M_Quote.exceedMaxCount").replace(
							"#MaxCount#", (this.nMaxLevel + 1)));
					this.oApp.exec("HIDE_ACTIVE_LAYER", []);
					p = l.nextSibling;
					m = l.parentNode;
					v = l.childNodes;
					g = [];
					jindo.$Element(l).leave();
					for (s = 0, q = v.length; s < q; s++) {
						g[s] = v[s]
					}
					for (s = 0, q = g.length; s < q; s++) {
						if (!!p) {
							jindo.$Element(p).before(g[s])
						} else {
							jindo.$Element(m).append(g[s])
						}
					}
					return
				}
				b.selectNodeContents(l);
				if (l && l.parentNode && l.parentNode.tagName == "BODY"
						&& !l.nextSibling) {
					d = b._document.createElement("P");
					d.innerHTML = "&nbsp;";
					l.parentNode.insertBefore(d, l.nextSibling)
				}
				if (nhn.husky.SE2M_Utils.isBlankNode(l)) {
					l.innerHTML = "&nbsp;";
					b.selectNodeContents(l);
					b.collapseToStart();
					b.select()
				}
				this.oApp.exec("REFRESH_WYSIWYG");
				setTimeout(jindo.$Fn(function(y) {
					r = y.placeStringBookmark();
					y.select();
					y.removeStringBookmark(r);
					this.oApp.exec("FOCUS")
				}, this).bind(b), 0);
				this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [ "BLOCK QUOTE", {
					sSaveTarget : "BODY"
				} ]);
				return l
			},
			_expandToTableStart : function(c, d) {
				var e = c.commonAncestorContainer;
				var a = null;
				var b = false;
				while (d && !b) {
					if (d == e) {
						b = true
					}
					if (/TBODY|TFOOT|THEAD|TR/i.test(d.tagName)) {
						a = this._getTableRoot(d);
						break
					}
					d = d.parentNode
				}
				return a
			},
			_getTableRoot : function(a) {
				while (a && a.tagName != "TABLE") {
					a = a.parentNode
				}
				return a
			},
			_setStyle : function(a, b) {
				a.setAttribute("style", b);
				a.style.cssText = b
			},
			$ON_EVENT_EDITING_AREA_KEYDOWN : function(c) {
				var a, b;
				if ("WYSIWYG" !== this.oApp.getEditingMode()) {
					return
				}
				if (8 !== c.key().keyCode) {
					return
				}
				a = this.oApp.getSelection();
				a.fixCommonAncestorContainer();
				b = this._findParentQuote(a.commonAncestorContainer);
				if (!b) {
					return
				}
				if (this._isBlankQuote(b)) {
					c.stop(jindo.$Event.CANCEL_DEFAULT);
					a.selectNode(b);
					a.collapseToStart();
					jindo.$Element(b).leave();
					a.select()
				}
			},
			$ON_EVENT_EDITING_AREA_KEYUP : function(c) {
				var a, b, d;
				if ("WYSIWYG" !== this.oApp.getEditingMode()) {
					return
				}
				if (46 !== c.key().keyCode) {
					return
				}
				a = this.oApp.getSelection();
				a.fixCommonAncestorContainer();
				b = this._findParentQuote(a.commonAncestorContainer);
				if (!b) {
					return false
				}
				if (!b.nextSibling) {
					c.stop(jindo.$Event.CANCEL_DEFAULT);
					d = a._document.createElement("P");
					d.innerHTML = "&nbsp;";
					jindo.$Element(b).after(d);
					setTimeout(jindo.$Fn(function(e) {
						var f = e.placeStringBookmark();
						e.select();
						e.removeStringBookmark(f)
					}, this).bind(a), 0)
				}
			},
			_isBlankQuote : function(c) {
				var n, f, g, m, l = this.oApp.oNavigator.chrome, d = this.oApp.oNavigator.safari, a = function(
						o) {
					o = o.replace(/[\r\n]/ig, "").replace(unescape("%uFEFF"),
							"");
					if (o === "") {
						return true
					}
					if (o === "&nbsp;" || o === " ") {
						return true
					}
					return false
				}, b = function(o) {
					if (o.nodeType === 3 && a(o.nodeValue)) {
						return true
					}
					if ((o.tagName === "P" || o.tagName === "SPAN")
							&& (a(o.innerHTML) || o.innerHTML === "<br>")) {
						return true
					}
					return false
				}, e = function(o) {
					if ((jindo.$$("tr", o)).length === 0) {
						return true
					}
					return false
				};
				if (a(c.innerHTML) || c.innerHTML === "<br>") {
					return true
				}
				if (l || d) {
					var j = jindo.$$("TABLE", c), h = j.length, k;
					for (g = 0; g < h; g++) {
						k = j[g];
						if (e(k)) {
							jindo.$Element(k).leave()
						}
					}
				}
				f = c.childNodes;
				for (g = 0, m = f.length; g < m; g++) {
					n = f[g];
					if (!b(n)) {
						return false
					}
				}
				return true
			},
			_findParentQuote : function(a) {
				return this._findAncestor(jindo.$Fn(function(c) {
					if (!c) {
						return false
					}
					if (c.tagName !== "BLOCKQUOTE") {
						return false
					}
					if (!c.className) {
						return false
					}
					var b = c.className;
					if (!this.htQuoteStyles_view[b]) {
						return false
					}
					return true
				}, this).bind(), a)
			},
			_findAncestor : function(a, b) {
				while (b && !a(b)) {
					b = b.parentNode
				}
				return b
			}
		});
nhn.husky.SE2M_SCharacter = jindo
		.$Class({
			name : "SE2M_SCharacter",
			$ON_MSG_APP_READY : function() {
				this.oApp.exec("REGISTER_UI_EVENT", [ "sCharacter", "click",
						"TOGGLE_SCHARACTER_LAYER" ])
			},
			_assignHTMLObjects : function(b) {
				b = jindo.$(b) || document;
				this.elDropdownLayer = jindo.$$.getSingle(
						"DIV.husky_seditor_sCharacter_layer", b);
				this.oTextField = jindo.$$.getSingle("INPUT",
						this.elDropdownLayer);
				this.oInsertButton = jindo.$$.getSingle("+ BUTTON",
						this.oTextField);
				this.aCloseButton = jindo.$$(
						"BUTTON.husky_se2m_sCharacter_close",
						this.elDropdownLayer);
				this.aSCharList = jindo.$$("UL.husky_se2m_sCharacter_list",
						this.elDropdownLayer);
				var a = jindo.$$.getSingle("UL.se2_char_tab",
						this.elDropdownLayer);
				this.aLabel = jindo.$$(">LI", a)
			},
			$LOCAL_BEFORE_FIRST : function(c) {
				this.bIE = jindo.$Agent().navigator().ie;
				this._assignHTMLObjects(this.oApp.htOptions.elAppContainer);
				this.charSet = [];
				this.charSet[0] = unescape(
						"FF5B FF5D 3014 3015 3008 3009 300A 300B 300C 300D 300E 300F 3010 3011 2018 2019 201C 201D 3001 3002 %B7 2025 2026 %A7 203B 2606 2605 25CB 25CF 25CE 25C7 25C6 25A1 25A0 25B3 25B2 25BD 25BC 25C1 25C0 25B7 25B6 2664 2660 2661 2665 2667 2663 2299 25C8 25A3 25D0 25D1 2592 25A4 25A5 25A8 25A7 25A6 25A9 %B1 %D7 %F7 2260 2264 2265 221E 2234 %B0 2032 2033 2220 22A5 2312 2202 2261 2252 226A 226B 221A 223D 221D 2235 222B 222C 2208 220B 2286 2287 2282 2283 222A 2229 2227 2228 FFE2 21D2 21D4 2200 2203 %B4 FF5E 02C7 02D8 02DD 02DA 02D9 %B8 02DB %A1 %BF 02D0 222E 2211 220F 266D 2669 266A 266C 327F 2192 2190 2191 2193 2194 2195 2197 2199 2196 2198 321C 2116 33C7 2122 33C2 33D8 2121 2668 260F 260E 261C 261E %B6 2020 2021 %AE %AA %BA 2642 2640")
						.replace(/(\S{4})/g, function(e) {
							return "%u" + e
						}).split(" ");
				this.charSet[1] = unescape(
						"%BD 2153 2154 %BC %BE 215B 215C 215D 215E %B9 %B2 %B3 2074 207F 2081 2082 2083 2084 2160 2161 2162 2163 2164 2165 2166 2167 2168 2169 2170 2171 2172 2173 2174 2175 2176 2177 2178 2179 FFE6 %24 FFE5 FFE1 20AC 2103 212B 2109 FFE0 %A4 2030 3395 3396 3397 2113 3398 33C4 33A3 33A4 33A5 33A6 3399 339A 339B 339C 339D 339E 339F 33A0 33A1 33A2 33CA 338D 338E 338F 33CF 3388 3389 33C8 33A7 33A8 33B0 33B1 33B2 33B3 33B4 33B5 33B6 33B7 33B8 33B9 3380 3381 3382 3383 3384 33BA 33BB 33BC 33BD 33BE 33BF 3390 3391 3392 3393 3394 2126 33C0 33C1 338A 338B 338C 33D6 33C5 33AD 33AE 33AF 33DB 33A9 33AA 33AB 33AC 33DD 33D0 33D3 33C3 33C9 33DC 33C6")
						.replace(/(\S{4})/g, function(e) {
							return "%u" + e
						}).split(" ");
				this.charSet[2] = unescape(
						"3260 3261 3262 3263 3264 3265 3266 3267 3268 3269 326A 326B 326C 326D 326E 326F 3270 3271 3272 3273 3274 3275 3276 3277 3278 3279 327A 327B 24D0 24D1 24D2 24D3 24D4 24D5 24D6 24D7 24D8 24D9 24DA 24DB 24DC 24DD 24DE 24DF 24E0 24E1 24E2 24E3 24E4 24E5 24E6 24E7 24E8 24E9 2460 2461 2462 2463 2464 2465 2466 2467 2468 2469 246A 246B 246C 246D 246E 3200 3201 3202 3203 3204 3205 3206 3207 3208 3209 320A 320B 320C 320D 320E 320F 3210 3211 3212 3213 3214 3215 3216 3217 3218 3219 321A 321B 249C 249D 249E 249F 24A0 24A1 24A2 24A3 24A4 24A5 24A6 24A7 24A8 24A9 24AA 24AB 24AC 24AD 24AE 24AF 24B0 24B1 24B2 24B3 24B4 24B5 2474 2475 2476 2477 2478 2479 247A 247B 247C 247D 247E 247F 2480 2481 2482")
						.replace(/(\S{4})/g, function(e) {
							return "%u" + e
						}).split(" ");
				this.charSet[3] = unescape(
						"3131 3132 3133 3134 3135 3136 3137 3138 3139 313A 313B 313C 313D 313E 313F 3140 3141 3142 3143 3144 3145 3146 3147 3148 3149 314A 314B 314C 314D 314E 314F 3150 3151 3152 3153 3154 3155 3156 3157 3158 3159 315A 315B 315C 315D 315E 315F 3160 3161 3162 3163 3165 3166 3167 3168 3169 316A 316B 316C 316D 316E 316F 3170 3171 3172 3173 3174 3175 3176 3177 3178 3179 317A 317B 317C 317D 317E 317F 3180 3181 3182 3183 3184 3185 3186 3187 3188 3189 318A 318B 318C 318D 318E")
						.replace(/(\S{4})/g, function(e) {
							return "%u" + e
						}).split(" ");
				this.charSet[4] = unescape(
						"0391 0392 0393 0394 0395 0396 0397 0398 0399 039A 039B 039C 039D 039E 039F 03A0 03A1 03A3 03A4 03A5 03A6 03A7 03A8 03A9 03B1 03B2 03B3 03B4 03B5 03B6 03B7 03B8 03B9 03BA 03BB 03BC 03BD 03BE 03BF 03C0 03C1 03C3 03C4 03C5 03C6 03C7 03C8 03C9 %C6 %D0 0126 0132 013F 0141 %D8 0152 %DE 0166 014A %E6 0111 %F0 0127 I 0133 0138 0140 0142 0142 0153 %DF %FE 0167 014B 0149 0411 0413 0414 0401 0416 0417 0418 0419 041B 041F 0426 0427 0428 0429 042A 042B 042C 042D 042E 042F 0431 0432 0433 0434 0451 0436 0437 0438 0439 043B 043F 0444 0446 0447 0448 0449 044A 044B 044C 044D 044E 044F")
						.replace(/(\S{4})/g, function(e) {
							return "%u" + e
						}).split(" ");
				this.charSet[5] = unescape(
						"3041 3042 3043 3044 3045 3046 3047 3048 3049 304A 304B 304C 304D 304E 304F 3050 3051 3052 3053 3054 3055 3056 3057 3058 3059 305A 305B 305C 305D 305E 305F 3060 3061 3062 3063 3064 3065 3066 3067 3068 3069 306A 306B 306C 306D 306E 306F 3070 3071 3072 3073 3074 3075 3076 3077 3078 3079 307A 307B 307C 307D 307E 307F 3080 3081 3082 3083 3084 3085 3086 3087 3088 3089 308A 308B 308C 308D 308E 308F 3090 3091 3092 3093 30A1 30A2 30A3 30A4 30A5 30A6 30A7 30A8 30A9 30AA 30AB 30AC 30AD 30AE 30AF 30B0 30B1 30B2 30B3 30B4 30B5 30B6 30B7 30B8 30B9 30BA 30BB 30BC 30BD 30BE 30BF 30C0 30C1 30C2 30C3 30C4 30C5 30C6 30C7 30C8 30C9 30CA 30CB 30CC 30CD 30CE 30CF 30D0 30D1 30D2 30D3 30D4 30D5 30D6 30D7 30D8 30D9 30DA 30DB 30DC 30DD 30DE 30DF 30E0 30E1 30E2 30E3 30E4 30E5 30E6 30E7 30E8 30E9 30EA 30EB 30EC 30ED 30EE 30EF 30F0 30F1 30F2 30F3 30F4 30F5 30F6")
						.replace(/(\S{4})/g, function(e) {
							return "%u" + e
						}).split(" ");
				var b = jindo.$Fn(this.oApp.exec, this.oApp).bind(
						"INSERT_SCHARACTERS", [ this.oTextField.value ]);
				jindo.$Fn(b, this).attach(this.oInsertButton, "click");
				this.oApp.exec("SET_SCHARACTER_LIST", [ this.charSet ]);
				for ( var a = 0; a < this.aLabel.length; a++) {
					var d = jindo.$Fn(this.oApp.exec, this.oApp).bind(
							"CHANGE_SCHARACTER_SET", [ a ]);
					jindo.$Fn(d, this).attach(this.aLabel[a].firstChild,
							"mousedown")
				}
				for ( var a = 0; a < this.aCloseButton.length; a++) {
					this.oApp.registerBrowserEvent(this.aCloseButton[a],
							"click", "HIDE_ACTIVE_LAYER", [])
				}
				this.oApp.registerBrowserEvent(this.elDropdownLayer, "click",
						"EVENT_SCHARACTER_CLICKED", [])
			},
			$ON_TOGGLE_SCHARACTER_LAYER : function() {
				this.oTextField.value = "";
				this.oSelection = this.oApp.getSelection();
				this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [
						this.elDropdownLayer, null,
						"MSG_SCHARACTER_LAYER_SHOWN", [],
						"MSG_SCHARACTER_LAYER_HIDDEN", [ "" ] ]);
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "symbol" ])
			},
			$ON_MSG_SCHARACTER_LAYER_SHOWN : function() {
				this.oTextField.focus();
				this.oApp.exec("SELECT_UI", [ "sCharacter" ])
			},
			$ON_MSG_SCHARACTER_LAYER_HIDDEN : function() {
				this.oApp.exec("DESELECT_UI", [ "sCharacter" ])
			},
			$ON_EVENT_SCHARACTER_CLICKED : function(b) {
				var a = nhn.husky.SE2M_Utils.findAncestorByTagName("BUTTON",
						b.element);
				if (!a || a.tagName != "BUTTON") {
					return
				}
				if (a.parentNode.tagName != "LI") {
					return
				}
				var c = a.firstChild.innerHTML;
				if (c.length > 1) {
					return
				}
				this.oApp.exec("SELECT_SCHARACTER", [ c ]);
				b.stop()
			},
			$ON_SELECT_SCHARACTER : function(a) {
				this.oTextField.value += a;
				if (this.oTextField.createTextRange) {
					var b = this.oTextField.createTextRange();
					b.collapse(false);
					b.select()
				} else {
					if (this.oTextField.selectionEnd) {
						this.oTextField.selectionEnd = this.oTextField.value.length;
						this.oTextField.focus()
					}
				}
			},
			$ON_INSERT_SCHARACTERS : function() {
				this.oApp.exec("RECORD_UNDO_BEFORE_ACTION",
						[ "INSERT SCHARACTER" ]);
				this.oSelection.pasteHTML(this.oTextField.value);
				this.oSelection.collapseToEnd();
				this.oSelection.select();
				this.oApp.exec("FOCUS");
				this.oApp.exec("RECORD_UNDO_AFTER_ACTION",
						[ "INSERT SCHARACTER" ]);
				this.oApp.exec("HIDE_ACTIVE_LAYER", [])
			},
			$ON_CHANGE_SCHARACTER_SET : function(b) {
				for ( var a = 0; a < this.aSCharList.length; a++) {
					if (jindo.$Element(this.aLabel[a]).hasClass("active")) {
						if (a == b) {
							return
						}
						jindo.$Element(this.aLabel[a]).removeClass("active")
					}
				}
				this._drawSCharList(b);
				jindo.$Element(this.aLabel[b]).addClass("active")
			},
			$ON_SET_SCHARACTER_LIST : function(a) {
				this.charSet = a;
				this.bSCharSetDrawn = new Array(this.charSet.length);
				this._drawSCharList(0)
			},
			_drawSCharList : function(c) {
				if (this.bSCharSetDrawn[c]) {
					return
				}
				this.bSCharSetDrawn[c] = true;
				var a = this.charSet[c].length;
				var f = new Array(a);
				this.aSCharList[c].innerHTML = "";
				var b, e;
				for ( var d = 0; d < a; d++) {
					f[d] = jindo.$("<LI>");
					if (this.bIE) {
						b = jindo.$("<BUTTON>");
						b.setAttribute("type", "button")
					} else {
						b = jindo.$("<BUTTON>");
						b.type = "button"
					}
					e = jindo.$("<SPAN>");
					e.innerHTML = unescape(this.charSet[c][d]);
					b.appendChild(e);
					f[d].appendChild(b);
					f[d].onmouseover = function() {
						this.className = "hover"
					};
					f[d].onmouseout = function() {
						this.className = ""
					};
					this.aSCharList[c].appendChild(f[d])
				}
			}
		});
nhn.husky.SE2M_TableBlockStyler = jindo
		.$Class({
			name : "SE2M_TableBlockStyler",
			nSelectedTD : 0,
			htSelectedTD : {},
			aTdRange : [],
			$init : function() {
			},
			$LOCAL_BEFORE_ALL : function() {
				return (this.oApp.getEditingMode() == "WYSIWYG")
			},
			$ON_MSG_APP_READY : function() {
				this.oDocument = this.oApp.getWYSIWYGDocument()
			},
			$ON_EVENT_EDITING_AREA_MOUSEUP : function(a) {
				if (this.oApp.getEditingMode() != "WYSIWYG") {
					return
				}
				this.setTdBlock()
			},
			$ON_IS_SELECTED_TD_BLOCK : function(a, b) {
				if (this.nSelectedTD > 0) {
					b[a] = true;
					return b[a]
				} else {
					b[a] = false;
					return b[a]
				}
			},
			$ON_GET_SELECTED_TD_BLOCK : function(a, b) {
				b[a] = this.htSelectedTD.aTdCells
			},
			setTdBlock : function() {
				this.oApp.exec("GET_SELECTED_CELLS", [ "aTdCells",
						this.htSelectedTD ]);
				var a = this.htSelectedTD.aTdCells;
				if (a) {
					this.nSelectedTD = a.length
				}
			},
			$ON_DELETE_BLOCK_CONTENTS : function() {
				var b = this, a, e, d;
				this.setTdBlock();
				for ( var c = 0; c < this.nSelectedTD; c++) {
					jindo.$Element(this.htSelectedTD.aTdCells[c]).child(
							function(f) {
								a = jindo.$Element(f._element.parentNode);
								a.remove(f);
								e = b.oDocument.createElement("P");
								if (jindo.$Agent().navigator().firefox) {
									d = b.oDocument.createElement("BR")
								} else {
									d = b.oDocument.createTextNode("\u00A0")
								}
								e.appendChild(d);
								a.append(e)
							}, 1)
				}
			}
		});
nhn.husky.SE2M_TableCreator = jindo
		.$Class({
			name : "SE2M_TableCreator",
			_sSETblClass : "__se_tbl",
			nRows : 3,
			nColumns : 4,
			nBorderSize : 1,
			sBorderColor : "#000000",
			sBGColor : "#000000",
			nBorderStyleIdx : 3,
			nTableStyleIdx : 1,
			nMinRows : 1,
			nMaxRows : 20,
			nMinColumns : 1,
			nMaxColumns : 20,
			nMinBorderWidth : 1,
			nMaxBorderWidth : 10,
			rxLastDigits : null,
			sReEditGuideMsg_table : null,
			oSelection : null,
			$ON_MSG_APP_READY : function() {
				this.sReEditGuideMsg_table = this.oApp
						.$MSG(nhn.husky.SE2M_Configuration.SE2M_ReEditAction.aReEditGuideMsg[3]);
				this.oApp.exec("REGISTER_UI_EVENT", [ "table", "click",
						"TOGGLE_TABLE_LAYER" ])
			},
			$ON_REGISTER_CONVERTERS : function() {
				this.oApp.exec("ADD_CONVERTER_DOM", [ "IR_TO_DB",
						jindo.$Fn(this.irToDbDOM, this).bind() ]);
				this.oApp.exec("ADD_CONVERTER_DOM", [ "DB_TO_IR",
						jindo.$Fn(this.dbToIrDOM, this).bind() ])
			},
			irToDbDOM : function(e) {
				var f = [];
				var b = jindo.$$("table[class=__se_tbl]", e, {
					oneTimeOffCache : true
				});
				jindo.$A(b).forEach(function(h, k, j) {
					if (jindo.$Element(h).attr("attr_no_border_tbl")) {
						f.push(h)
					}
				}, this);
				if (f.length < 1) {
					return
				}
				var g = [], a;
				for ( var d = 0, c = f.length; d < c; d++) {
					a = f[d];
					jindo.$Element(a).css({
						border : "",
						borderLeft : "",
						borderBottom : ""
					});
					jindo.$Element(a).attr({
						border : 0,
						cellpadding : 1
					});
					g = jindo.$$("tbody>tr>td", a);
					jindo.$A(g).forEach(function(k, j, h) {
						jindo.$Element(k).css({
							border : "",
							borderTop : "",
							borderRight : ""
						})
					})
				}
			},
			dbToIrDOM : function(e) {
				var f = [];
				var b = jindo.$$("table[class=__se_tbl]", e, {
					oneTimeOffCache : true
				});
				jindo.$A(b).forEach(function(h, k, j) {
					if (jindo.$Element(h).attr("attr_no_border_tbl")) {
						f.push(h)
					}
				}, this);
				if (f.length < 1) {
					return
				}
				var g = [], a;
				for ( var d = 0, c = f.length; d < c; d++) {
					a = f[d];
					jindo.$Element(a).css({
						border : "1px dashed #c7c7c7",
						borderLeft : 0,
						borderBottom : 0
					});
					jindo.$Element(a).attr({
						border : 1,
						cellpadding : 0
					});
					g = jindo.$$("tbody>tr>td", a);
					jindo.$A(g).forEach(function(k, j, h) {
						jindo.$Element(k).css({
							border : "1px dashed #c7c7c7",
							borderTop : 0,
							borderRight : 0
						})
					})
				}
			},
			_assignHTMLObjects : function(b) {
				this.oApp.exec("LOAD_HTML", [ "create_table" ]);
				var a = null;
				this.elDropdownLayer = jindo.$$.getSingle(
						"DIV.husky_se2m_table_layer", b);
				this.welDropdownLayer = jindo.$Element(this.elDropdownLayer);
				a = jindo.$$("INPUT", this.elDropdownLayer);
				this.elText_row = a[0];
				this.elText_col = a[1];
				this.elRadio_manualStyle = a[2];
				this.elText_borderSize = a[3];
				this.elText_borderColor = a[4];
				this.elText_BGColor = a[5];
				this.elRadio_templateStyle = a[6];
				a = jindo.$$("BUTTON", this.elDropdownLayer);
				this.elBtn_rowInc = a[0];
				this.elBtn_rowDec = a[1];
				this.elBtn_colInc = a[2];
				this.elBtn_colDec = a[3];
				this.elBtn_borderStyle = a[4];
				this.elBtn_incBorderSize = jindo.$$.getSingle(
						"BUTTON.se2m_incBorder", this.elDropdownLayer);
				this.elBtn_decBorderSize = jindo.$$.getSingle(
						"BUTTON.se2m_decBorder", this.elDropdownLayer);
				this.elLayer_Dim1 = jindo.$$.getSingle("DIV.se2_t_dim0",
						this.elDropdownLayer);
				this.elLayer_Dim2 = jindo.$$.getSingle("DIV.se2_t_dim3",
						this.elDropdownLayer);
				a = jindo.$$("SPAN.se2_pre_color>BUTTON", this.elDropdownLayer);
				this.elBtn_borderColor = a[0];
				this.elBtn_BGColor = a[1];
				this.elBtn_tableStyle = jindo.$$.getSingle(
						"DIV.se2_select_ty2>BUTTON", this.elDropdownLayer);
				a = jindo.$$("P.se2_btn_area>BUTTON", this.elDropdownLayer);
				this.elBtn_apply = a[0];
				this.elBtn_cancel = a[1];
				this.elTable_preview = jindo.$$.getSingle(
						"TABLE.husky_se2m_table_preview", this.elDropdownLayer);
				this.elLayer_borderStyle = jindo.$$.getSingle(
						"DIV.husky_se2m_table_border_style_layer",
						this.elDropdownLayer);
				this.elPanel_borderStylePreview = jindo.$$.getSingle(
						"SPAN.husky_se2m_table_border_style_preview",
						this.elDropdownLayer);
				this.elPanel_borderColorPallet = jindo.$$.getSingle(
						"DIV.husky_se2m_table_border_color_pallet",
						this.elDropdownLayer);
				this.elPanel_bgColorPallet = jindo.$$.getSingle(
						"DIV.husky_se2m_table_bgcolor_pallet",
						this.elDropdownLayer);
				this.elLayer_tableStyle = jindo.$$.getSingle(
						"DIV.husky_se2m_table_style_layer",
						this.elDropdownLayer);
				this.elPanel_tableStylePreview = jindo.$$.getSingle(
						"SPAN.husky_se2m_table_style_preview",
						this.elDropdownLayer);
				this.aElBtn_borderStyle = jindo.$$("BUTTON",
						this.elLayer_borderStyle);
				this.aElBtn_tableStyle = jindo.$$("BUTTON",
						this.elLayer_tableStyle);
				this.sNoBorderText = jindo.$$.getSingle("SPAN.se2m_no_border",
						this.elDropdownLayer).innerHTML;
				this.rxLastDigits = RegExp("([0-9]+)$")
			},
			$LOCAL_BEFORE_FIRST : function() {
				this._assignHTMLObjects(this.oApp.htOptions.elAppContainer);
				this.oApp.registerBrowserEvent(this.elText_row, "change",
						"TABLE_SET_ROW_NUM", [ null, 0 ]);
				this.oApp.registerBrowserEvent(this.elText_col, "change",
						"TABLE_SET_COLUMN_NUM", [ null, 0 ]);
				this.oApp.registerBrowserEvent(this.elText_borderSize,
						"change", "TABLE_SET_BORDER_SIZE", [ null, 0 ]);
				this.oApp.registerBrowserEvent(this.elBtn_rowInc, "click",
						"TABLE_INC_ROW");
				this.oApp.registerBrowserEvent(this.elBtn_rowDec, "click",
						"TABLE_DEC_ROW");
				jindo.$Fn(this._numRowKeydown, this).attach(
						this.elText_row.parentNode, "keydown");
				this.oApp.registerBrowserEvent(this.elBtn_colInc, "click",
						"TABLE_INC_COLUMN");
				this.oApp.registerBrowserEvent(this.elBtn_colDec, "click",
						"TABLE_DEC_COLUMN");
				jindo.$Fn(this._numColKeydown, this).attach(
						this.elText_col.parentNode, "keydown");
				this.oApp.registerBrowserEvent(this.elBtn_incBorderSize,
						"click", "TABLE_INC_BORDER_SIZE");
				this.oApp.registerBrowserEvent(this.elBtn_decBorderSize,
						"click", "TABLE_DEC_BORDER_SIZE");
				jindo.$Fn(this._borderSizeKeydown, this).attach(
						this.elText_borderSize.parentNode, "keydown");
				this.oApp.registerBrowserEvent(this.elBtn_borderStyle, "click",
						"TABLE_TOGGLE_BORDER_STYLE_LAYER");
				this.oApp.registerBrowserEvent(this.elBtn_tableStyle, "click",
						"TABLE_TOGGLE_STYLE_LAYER");
				this.oApp.registerBrowserEvent(this.elBtn_borderColor, "click",
						"TABLE_TOGGLE_BORDER_COLOR_PALLET");
				this.oApp.registerBrowserEvent(this.elBtn_BGColor, "click",
						"TABLE_TOGGLE_BGCOLOR_PALLET");
				this.oApp.registerBrowserEvent(this.elRadio_manualStyle,
						"click", "TABLE_ENABLE_MANUAL_STYLE");
				this.oApp.registerBrowserEvent(this.elRadio_templateStyle,
						"click", "TABLE_ENABLE_TEMPLATE_STYLE");
				this.oApp.exec("SE2_ATTACH_HOVER_EVENTS",
						[ this.aElBtn_borderStyle ]);
				this.oApp.exec("SE2_ATTACH_HOVER_EVENTS",
						[ this.aElBtn_tableStyle ]);
				var a;
				for (a = 0; a < this.aElBtn_borderStyle.length; a++) {
					this.oApp.registerBrowserEvent(this.aElBtn_borderStyle[a],
							"click", "TABLE_SELECT_BORDER_STYLE")
				}
				for (a = 0; a < this.aElBtn_tableStyle.length; a++) {
					this.oApp.registerBrowserEvent(this.aElBtn_tableStyle[a],
							"click", "TABLE_SELECT_STYLE")
				}
				this.oApp.registerBrowserEvent(this.elBtn_apply, "click",
						"TABLE_INSERT");
				this.oApp.registerBrowserEvent(this.elBtn_cancel, "click",
						"HIDE_ACTIVE_LAYER");
				this.oApp
						.exec(
								"TABLE_SET_BORDER_COLOR",
								[ /#[0-9A-Fa-f]{6}/
										.test(this.elText_borderColor.value) ? this.elText_borderColor.value
										: "#cccccc" ]);
				this.oApp
						.exec(
								"TABLE_SET_BGCOLOR",
								[ /#[0-9A-Fa-f]{6}/
										.test(this.elText_BGColor.value) ? this.elText_BGColor.value
										: "#ffffff" ]);
				this.nStyleMode = 1;
				this.aTableStyleByBorder = [
						"",
						'border="1" cellpadding="0" cellspacing="0" style="border:1px dashed #c7c7c7; border-left:0; border-bottom:0;"',
						'border="1" cellpadding="0" cellspacing="0" style="border:#BorderSize#px dashed #BorderColor#; border-left:0; border-bottom:0;"',
						'border="0" cellpadding="0" cellspacing="0" style="border:#BorderSize#px solid #BorderColor#; border-left:0; border-bottom:0;"',
						'border="0" cellpadding="0" cellspacing="1" style="border:#BorderSize#px solid #BorderColor#;"',
						'border="0" cellpadding="0" cellspacing="1" style="border:#BorderSize#px double #BorderColor#;"',
						'border="0" cellpadding="0" cellspacing="1" style="border-width:#BorderSize*2#px #BorderSize#px #BorderSize#px #BorderSize*2#px; border-style:solid;border-color:#BorderColor#;"',
						'border="0" cellpadding="0" cellspacing="1" style="border-width:#BorderSize#px #BorderSize*2#px #BorderSize*2#px #BorderSize#px; border-style:solid;border-color:#BorderColor#;"' ];
				this.aTDStyleByBorder = [
						"",
						'style="border:1px dashed #c7c7c7; border-top:0; border-right:0; background-color:#BGColor#"',
						'style="border:#BorderSize#px dashed #BorderColor#; border-top:0; border-right:0; background-color:#BGColor#"',
						'style="border:#BorderSize#px solid #BorderColor#; border-top:0; border-right:0; background-color:#BGColor#"',
						'style="border:#BorderSize#px solid #BorderColor#; background-color:#BGColor#"',
						'style="border:#BorderSize+2#px double #BorderColor#; background-color:#BGColor#"',
						'style="border-width:#BorderSize#px #BorderSize*2#px #BorderSize*2#px #BorderSize#px; border-style:solid;border-color:#BorderColor#; background-color:#BGColor#"',
						'style="border-width:#BorderSize*2#px #BorderSize#px #BorderSize#px #BorderSize*2#px; border-style:solid;border-color:#BorderColor#; background-color:#BGColor#"' ];
				this.oApp.registerBrowserEvent(this.elDropdownLayer, "keydown",
						"EVENT_TABLE_CREATE_KEYDOWN");
				this._drawTableDropdownLayer()
			},
			$ON_TABLE_SELECT_BORDER_STYLE : function(c) {
				var b = c.currentElement;
				var a = this.rxLastDigits.exec(b.className);
				this._selectBorderStyle(a[1])
			},
			$ON_TABLE_SELECT_STYLE : function(b) {
				var a = this.rxLastDigits.exec(b.element.className);
				this._selectTableStyle(a[1])
			},
			$ON_TOGGLE_TABLE_LAYER : function() {
				this._showNewTable();
				this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [
						this.elDropdownLayer, null, "SELECT_UI", [ "table" ],
						"TABLE_CLOSE", [] ]);
				this.oApp.exec("MSG_NOTIFY_CLICKCR", [ "table" ])
			},
			$ON_TABLE_BORDER_STYLE_LAYER_CLICKED : function(a) {
				top.document.title = a.element.tagName
			},
			$ON_TABLE_CLOSE_ALL : function() {
				this.oApp.exec("TABLE_HIDE_BORDER_COLOR_PALLET", []);
				this.oApp.exec("TABLE_HIDE_BGCOLOR_PALLET", []);
				this.oApp.exec("TABLE_HIDE_BORDER_STYLE_LAYER", []);
				this.oApp.exec("TABLE_HIDE_STYLE_LAYER", [])
			},
			$ON_TABLE_INC_ROW : function() {
				this.oApp.exec("TABLE_SET_ROW_NUM", [ null, 1 ])
			},
			$ON_TABLE_DEC_ROW : function() {
				this.oApp.exec("TABLE_SET_ROW_NUM", [ null, -1 ])
			},
			$ON_TABLE_INC_COLUMN : function() {
				this.oApp.exec("TABLE_SET_COLUMN_NUM", [ null, 1 ])
			},
			$ON_TABLE_DEC_COLUMN : function() {
				this.oApp.exec("TABLE_SET_COLUMN_NUM", [ null, -1 ])
			},
			$ON_TABLE_SET_ROW_NUM : function(a, b) {
				a = a || parseInt(this.elText_row.value, 10) || 0;
				b = b || 0;
				a += b;
				if (a < this.nMinRows) {
					a = this.nMinRows
				}
				if (a > this.nMaxRows) {
					a = this.nMaxRows
				}
				this.elText_row.value = a;
				this._showNewTable()
			},
			$ON_TABLE_SET_COLUMN_NUM : function(b, a) {
				b = b || parseInt(this.elText_col.value, 10) || 0;
				a = a || 0;
				b += a;
				if (b < this.nMinColumns) {
					b = this.nMinColumns
				}
				if (b > this.nMaxColumns) {
					b = this.nMaxColumns
				}
				this.elText_col.value = b;
				this._showNewTable()
			},
			_getTableString : function() {
				var a;
				if (this.nStyleMode == 1) {
					a = this._doGetTableString(this.nColumns, this.nRows,
							this.nBorderSize, this.sBorderColor, this.sBGColor,
							this.nBorderStyleIdx)
				} else {
					a = this._doGetTableString(this.nColumns, this.nRows,
							this.nBorderSize, this.sBorderColor, this.sBGColor,
							0)
				}
				return a
			},
			$ON_TABLE_INSERT : function() {
				this.oApp.exec("IE_FOCUS", []);
				this.oApp.exec("TABLE_SET_COLUMN_NUM");
				this.oApp.exec("TABLE_SET_ROW_NUM");
				this._loadValuesFromHTML();
				var j, h, c, k, d, e, f, b, g, a;
				c = this.oApp.getWYSIWYGDocument().body;
				k = jindo.$Element(c);
				a = jindo.$Agent().navigator();
				this.nTableWidth = c.offsetWidth;
				j = this._getTableString();
				d = this.oApp.getWYSIWYGDocument().createElement("DIV");
				d.innerHTML = j;
				e = d.firstChild;
				e.className = this._sSETblClass;
				b = this.oApp.getSelection();
				b = this._divideParagraph(b);
				this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [ "INSERT TABLE", {
					sSaveTarget : "BODY"
				} ]);
				g = this.oApp.getWYSIWYGDocument().createElement("DIV");
				b.deleteContents();
				b.insertNode(g);
				b.selectNode(g);
				this.oApp.exec("REMOVE_STYLE", [ b ]);
				if (a.ie
						&& this.oApp.getWYSIWYGDocument().body.childNodes.length === 1
						&& this.oApp.getWYSIWYGDocument().body.firstChild === g) {
					g.insertBefore(e, null)
				} else {
					g.parentNode.insertBefore(e, g);
					g.parentNode.removeChild(g)
				}
				if (a.firefox) {
					h = this.oApp.getWYSIWYGDocument().createElement("BR");
					e.parentNode.insertBefore(h, e.nextSibling)
				} else {
					if (a.ie) {
						h = this.oApp.getWYSIWYGDocument().createElement("p");
						e.parentNode.insertBefore(h, e.nextSibling)
					}
				}
				if (this.nStyleMode == 2) {
					this.oApp.exec("STYLE_TABLE", [ e, this.nTableStyleIdx ])
				}
				f = e.getElementsByTagName("TD")[0];
				b.selectNodeContents(f.firstChild || f);
				b.collapseToEnd();
				b.select();
				this.oApp.exec("FOCUS");
				this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [ "INSERT TABLE", {
					sSaveTarget : "BODY"
				} ]);
				this.oApp.exec("HIDE_ACTIVE_LAYER", []);
				this.oApp.exec("MSG_DISPLAY_REEDIT_MESSAGE_SHOW", [ this.name,
						this.sReEditGuideMsg_table ])
			},
			_divideParagraph : function(f) {
				var d, c, g, b, a, e;
				f.fixCommonAncestorContainer();
				d = f.findAncestorByTagName("P");
				if (!d) {
					return f
				}
				if (!d.firstChild || nhn.husky.SE2M_Utils.isBlankNode(d)) {
					f.selectNode(d);
					f.select();
					return f
				}
				b = f.placeStringBookmark();
				f.moveToBookmark(b);
				a = this.oApp.getWYSIWYGDocument().createElement("P");
				f.setStartBefore(d.firstChild);
				f.surroundContents(a);
				f.collapseToEnd();
				e = this.oApp.getWYSIWYGDocument().createElement("P");
				f.setEndAfter(d.lastChild);
				f.surroundContents(e);
				f.collapseToStart();
				f.removeStringBookmark(b);
				c = jindo.$Element(d);
				c.after(e);
				c.after(a);
				c.leave();
				f = this.oApp.getEmptySelection();
				f.setEndAfter(a);
				f.setStartBefore(e);
				f.select();
				return f
			},
			$ON_TABLE_CLOSE : function() {
				this.oApp.exec("TABLE_CLOSE_ALL", []);
				this.oApp.exec("DESELECT_UI", [ "table" ])
			},
			$ON_TABLE_SET_BORDER_SIZE : function(b, a) {
				b = b || parseInt(this.elText_borderSize.value, 10) || 0;
				a = a || 0;
				b += a;
				if (b < this.nMinBorderWidth) {
					b = this.nMinBorderWidth
				}
				if (b > this.nMaxBorderWidth) {
					b = this.nMaxBorderWidth
				}
				this.elText_borderSize.value = b
			},
			$ON_TABLE_INC_BORDER_SIZE : function() {
				this.oApp.exec("TABLE_SET_BORDER_SIZE", [ null, 1 ])
			},
			$ON_TABLE_DEC_BORDER_SIZE : function() {
				this.oApp.exec("TABLE_SET_BORDER_SIZE", [ null, -1 ])
			},
			$ON_TABLE_TOGGLE_BORDER_STYLE_LAYER : function() {
				if (this.elLayer_borderStyle.style.display == "block") {
					this.oApp.exec("TABLE_HIDE_BORDER_STYLE_LAYER", [])
				} else {
					this.oApp.exec("TABLE_SHOW_BORDER_STYLE_LAYER", [])
				}
			},
			$ON_TABLE_SHOW_BORDER_STYLE_LAYER : function() {
				this.oApp.exec("TABLE_CLOSE_ALL", []);
				this.elBtn_borderStyle.className = "se2_view_more2";
				this.elLayer_borderStyle.style.display = "block";
				this._refresh()
			},
			$ON_TABLE_HIDE_BORDER_STYLE_LAYER : function() {
				this.elBtn_borderStyle.className = "se2_view_more";
				this.elLayer_borderStyle.style.display = "none";
				this._refresh()
			},
			$ON_TABLE_TOGGLE_STYLE_LAYER : function() {
				if (this.elLayer_tableStyle.style.display == "block") {
					this.oApp.exec("TABLE_HIDE_STYLE_LAYER", [])
				} else {
					this.oApp.exec("TABLE_SHOW_STYLE_LAYER", [])
				}
			},
			$ON_TABLE_SHOW_STYLE_LAYER : function() {
				this.oApp.exec("TABLE_CLOSE_ALL", []);
				this.elBtn_tableStyle.className = "se2_view_more2";
				this.elLayer_tableStyle.style.display = "block";
				this._refresh()
			},
			$ON_TABLE_HIDE_STYLE_LAYER : function() {
				this.elBtn_tableStyle.className = "se2_view_more";
				this.elLayer_tableStyle.style.display = "none";
				this._refresh()
			},
			$ON_TABLE_TOGGLE_BORDER_COLOR_PALLET : function() {
				if (this.welDropdownLayer.hasClass("p1")) {
					this.oApp.exec("TABLE_HIDE_BORDER_COLOR_PALLET", [])
				} else {
					this.oApp.exec("TABLE_SHOW_BORDER_COLOR_PALLET", [])
				}
			},
			$ON_TABLE_SHOW_BORDER_COLOR_PALLET : function() {
				this.oApp.exec("TABLE_CLOSE_ALL", []);
				this.welDropdownLayer.addClass("p1");
				this.welDropdownLayer.removeClass("p2");
				this.oApp.exec("SHOW_COLOR_PALETTE", [
						"TABLE_SET_BORDER_COLOR_FROM_PALETTE",
						this.elPanel_borderColorPallet ]);
				this.elPanel_borderColorPallet.parentNode.style.display = "block"
			},
			$ON_TABLE_HIDE_BORDER_COLOR_PALLET : function() {
				this.welDropdownLayer.removeClass("p1");
				this.oApp.exec("HIDE_COLOR_PALETTE", []);
				this.elPanel_borderColorPallet.parentNode.style.display = "none"
			},
			$ON_TABLE_TOGGLE_BGCOLOR_PALLET : function() {
				if (this.welDropdownLayer.hasClass("p2")) {
					this.oApp.exec("TABLE_HIDE_BGCOLOR_PALLET", [])
				} else {
					this.oApp.exec("TABLE_SHOW_BGCOLOR_PALLET", [])
				}
			},
			$ON_TABLE_SHOW_BGCOLOR_PALLET : function() {
				this.oApp.exec("TABLE_CLOSE_ALL", []);
				this.welDropdownLayer.removeClass("p1");
				this.welDropdownLayer.addClass("p2");
				this.oApp.exec("SHOW_COLOR_PALETTE", [
						"TABLE_SET_BGCOLOR_FROM_PALETTE",
						this.elPanel_bgColorPallet ]);
				this.elPanel_bgColorPallet.parentNode.style.display = "block"
			},
			$ON_TABLE_HIDE_BGCOLOR_PALLET : function() {
				this.welDropdownLayer.removeClass("p2");
				this.oApp.exec("HIDE_COLOR_PALETTE", []);
				this.elPanel_bgColorPallet.parentNode.style.display = "none"
			},
			$ON_TABLE_SET_BORDER_COLOR_FROM_PALETTE : function(a) {
				this.oApp.exec("TABLE_SET_BORDER_COLOR", [ a ]);
				this.oApp.exec("TABLE_HIDE_BORDER_COLOR_PALLET", [])
			},
			$ON_TABLE_SET_BORDER_COLOR : function(a) {
				this.elText_borderColor.value = a;
				this.elBtn_borderColor.style.backgroundColor = a
			},
			$ON_TABLE_SET_BGCOLOR_FROM_PALETTE : function(a) {
				this.oApp.exec("TABLE_SET_BGCOLOR", [ a ]);
				this.oApp.exec("TABLE_HIDE_BGCOLOR_PALLET", [])
			},
			$ON_TABLE_SET_BGCOLOR : function(a) {
				this.elText_BGColor.value = a;
				this.elBtn_BGColor.style.backgroundColor = a
			},
			$ON_TABLE_ENABLE_MANUAL_STYLE : function() {
				this.nStyleMode = 1;
				this._drawTableDropdownLayer()
			},
			$ON_TABLE_ENABLE_TEMPLATE_STYLE : function() {
				this.nStyleMode = 2;
				this._drawTableDropdownLayer()
			},
			$ON_EVENT_TABLE_CREATE_KEYDOWN : function(a) {
				if (a.key().enter) {
					this.elBtn_apply.focus();
					this.oApp.exec("TABLE_INSERT");
					a.stop()
				}
			},
			_drawTableDropdownLayer : function() {
				if (this.nBorderStyleIdx == 1) {
					this.elPanel_borderStylePreview.innerHTML = this.sNoBorderText;
					this.elLayer_Dim1.className = "se2_t_dim2"
				} else {
					this.elPanel_borderStylePreview.innerHTML = "";
					this.elLayer_Dim1.className = "se2_t_dim0"
				}
				if (this.nStyleMode == 1) {
					this.elRadio_manualStyle.checked = true;
					this.elLayer_Dim2.className = "se2_t_dim3";
					this.elText_borderSize.disabled = false;
					this.elText_borderColor.disabled = false;
					this.elText_BGColor.disabled = false
				} else {
					this.elRadio_templateStyle.checked = true;
					this.elLayer_Dim2.className = "se2_t_dim1";
					this.elText_borderSize.disabled = true;
					this.elText_borderColor.disabled = true;
					this.elText_BGColor.disabled = true
				}
				this.oApp.exec("TABLE_CLOSE_ALL", [])
			},
			_selectBorderStyle : function(a) {
				this.elPanel_borderStylePreview.className = "se2_b_style" + a;
				this.nBorderStyleIdx = a;
				this._drawTableDropdownLayer()
			},
			_selectTableStyle : function(a) {
				this.elPanel_tableStylePreview.className = "se2_t_style" + a;
				this.nTableStyleIdx = a;
				this._drawTableDropdownLayer()
			},
			_showNewTable : function() {
				var a = document.createElement("DIV");
				this._loadValuesFromHTML();
				a.innerHTML = this._getPreviewTableString(this.nColumns,
						this.nRows);
				var b = a.firstChild;
				this.elTable_preview.parentNode.insertBefore(b,
						this.elTable_preview);
				this.elTable_preview.parentNode
						.removeChild(this.elTable_preview);
				this.elTable_preview = b;
				this._refresh()
			},
			_getPreviewTableString : function(d, c) {
				var e = '<table border="0" cellspacing="1" class="se2_pre_table husky_se2m_table_preview">';
				var a = "<tr>";
				for ( var b = 0; b < d; b++) {
					a += "<td><p>&nbsp;</p></td>\n"
				}
				a += "</tr>\n";
				e += "<tbody>";
				for ( var b = 0; b < c; b++) {
					e += a
				}
				e += "</tbody>\n";
				e += "</table>\n";
				return e
			},
			_loadValuesFromHTML : function() {
				this.nColumns = parseInt(this.elText_col.value, 10) || 1;
				this.nRows = parseInt(this.elText_row.value, 10) || 1;
				this.nBorderSize = parseInt(this.elText_borderSize.value, 10) || 1;
				this.sBorderColor = this.elText_borderColor.value;
				this.sBGColor = this.elText_BGColor.value
			},
			_doGetTableString : function(d, k, h, j, n, l) {
				var f = parseInt(this.nTableWidth / d, 10);
				var h = this.nBorderSize;
				var c = this.aTableStyleByBorder[l].replace(/#BorderSize#/g,
						this.nBorderSize).replace(/#BorderSize\*([0-9]+)#/g,
						function(p, o) {
							return h * parseInt(o, 10)
						}).replace(/#BorderSize\+([0-9]+)#/g, function(p, o) {
					return h + parseInt(o, 10)
				}).replace("#BorderColor#", this.sBorderColor).replace(
						"#BGColor#", this.sBGColor);
				var g = this.aTDStyleByBorder[l].replace(/#BorderSize#/g,
						this.nBorderSize).replace(/#BorderSize\*([0-9]+)#/g,
						function(p, o) {
							return h * parseInt(o, 10)
						}).replace(/#BorderSize\+([0-9]+)#/g, function(p, o) {
					return h + parseInt(o, 10)
				}).replace("#BorderColor#", this.sBorderColor).replace(
						"#BGColor#", this.sBGColor);
				if (f) {
					g += " width=" + f
				} else {
					c += "class=se2_pre_table"
				}
				var b = (l == 1) ? 'attr_no_border_tbl="1"' : "";
				var m = "<table " + c + " " + b + ">";
				var a = "<tr>";
				for ( var e = 0; e < d; e++) {
					a += "<td " + g + "><p>&nbsp;</p></td>\n"
				}
				a += "</tr>\n";
				m += "<tbody>\n";
				for ( var e = 0; e < k; e++) {
					m += a
				}
				m += "</tbody>\n";
				m += "</table>\n<br>";
				return m
			},
			_numRowKeydown : function(a) {
				var b = a.key();
				if (b.keyCode == 38) {
					this.oApp.exec("TABLE_INC_ROW", [])
				}
				if (b.keyCode == 40) {
					this.oApp.exec("TABLE_DEC_ROW", [])
				}
			},
			_numColKeydown : function(a) {
				var b = a.key();
				if (b.keyCode == 38) {
					this.oApp.exec("TABLE_INC_COLUMN", [])
				}
				if (b.keyCode == 40) {
					this.oApp.exec("TABLE_DEC_COLUMN", [])
				}
			},
			_borderSizeKeydown : function(a) {
				var b = a.key();
				if (b.keyCode == 38) {
					this.oApp.exec("TABLE_INC_BORDER_SIZE", [])
				}
				if (b.keyCode == 40) {
					this.oApp.exec("TABLE_DEC_BORDER_SIZE", [])
				}
			},
			_refresh : function() {
				this.elDropdownLayer.style.zoom = 0;
				this.elDropdownLayer.style.zoom = ""
			}
		});
nhn.husky.SE2M_TableEditor = jindo
		.$Class({
			name : "SE2M_TableEditor",
			_sSETblClass : "__se_tbl",
			_sSEReviewTblClass : "__se_tbl_review",
			STATUS : {
				S_0 : 1,
				MOUSEDOWN_CELL : 2,
				CELL_SELECTING : 3,
				CELL_SELECTED : 4,
				MOUSEOVER_BORDER : 5,
				MOUSEDOWN_BORDER : 6
			},
			CELL_SELECTION_CLASS : "se2_te_selection",
			MIN_CELL_WIDTH : 5,
			MIN_CELL_HEIGHT : 5,
			TMP_BGC_ATTR : "_se2_tmp_te_bgc",
			TMP_BGIMG_ATTR : "_se2_tmp_te_bg_img",
			ATTR_TBL_TEMPLATE : "_se2_tbl_template",
			nStatus : 1,
			nMouseEventsStatus : 0,
			aSelectedCells : [],
			$ON_REGISTER_CONVERTERS : function() {
				this.oApp
						.exec(
								"ADD_CONVERTER_DOM",
								[
										"WYSIWYG_TO_IR",
										jindo
												.$Fn(
														function(c) {
															if (this.aSelectedCells.length < 1) {
																return
															}
															var b;
															var a = [ "TD",
																	"TH" ];
															for ( var f = 0; f < a.length; f++) {
																b = c
																		.getElementsByTagName(a[f]);
																for ( var d = 0, e = b.length; d < e; d++) {
																	if (b[d].className) {
																		b[d].className = b[d].className
																				.replace(
																						this.CELL_SELECTION_CLASS,
																						"");
																		if (b[d]
																				.getAttribute(this.TMP_BGC_ATTR)) {
																			b[d].style.backgroundColor = b[d]
																					.getAttribute(this.TMP_BGC_ATTR);
																			b[d]
																					.removeAttribute(this.TMP_BGC_ATTR)
																		} else {
																			if (b[d]
																					.getAttribute(this.TMP_BGIMG_ATTR)) {
																				jindo
																						.$Element(
																								this.aCells[d])
																						.css(
																								"backgroundImage",
																								b[d]
																										.getAttribute(this.TMP_BGIMG_ATTR));
																				b[d]
																						.removeAttribute(this.TMP_BGIMG_ATTR)
																			}
																		}
																	}
																}
															}
														}, this).bind() ])
			},
			_assignHTMLObjects : function() {
				this.oApp.exec("LOAD_HTML", [ "qe_table" ]);
				this.elQELayer = jindo.$$.getSingle("DIV.q_table_wrap",
						this.oApp.htOptions.elAppContainer);
				this.elQELayer.style.zIndex = 150;
				this.elBtnAddRowBelow = jindo.$$.getSingle("BUTTON.se2_addrow",
						this.elQELayer);
				this.elBtnAddColumnRight = jindo.$$.getSingle(
						"BUTTON.se2_addcol", this.elQELayer);
				this.elBtnSplitRow = jindo.$$.getSingle("BUTTON.se2_seprow",
						this.elQELayer);
				this.elBtnSplitColumn = jindo.$$.getSingle("BUTTON.se2_sepcol",
						this.elQELayer);
				this.elBtnDeleteRow = jindo.$$.getSingle("BUTTON.se2_delrow",
						this.elQELayer);
				this.elBtnDeleteColumn = jindo.$$.getSingle(
						"BUTTON.se2_delcol", this.elQELayer);
				this.elBtnMergeCell = jindo.$$.getSingle("BUTTON.se2_merrow",
						this.elQELayer);
				this.elBtnBGPalette = jindo.$$.getSingle(
						"BUTTON.husky_se2m_table_qe_bgcolor_btn",
						this.elQELayer);
				this.elBtnBGIMGPalette = jindo.$$.getSingle(
						"BUTTON.husky_se2m_table_qe_bgimage_btn",
						this.elQELayer);
				this.elPanelBGPaletteHolder = jindo.$$.getSingle(
						"DIV.husky_se2m_tbl_qe_bg_paletteHolder",
						this.elQELayer);
				this.elPanelBGIMGPaletteHolder = jindo.$$.getSingle(
						"DIV.husky_se2m_tbl_qe_bg_img_paletteHolder",
						this.elQELayer);
				this.elPanelTableBGArea = jindo.$$.getSingle("DIV.se2_qe2",
						this.elQELayer);
				this.elPanelTableTemplateArea = jindo.$$.getSingle(
						"DL.se2_qe3", this.elQELayer);
				this.elPanelReviewBGArea = jindo.$$.getSingle(
						"DL.husky_se2m_tbl_qe_review_bg", this.elQELayer);
				this.elPanelBGImg = jindo.$$.getSingle("DD",
						this.elPanelReviewBGArea);
				this.welPanelTableBGArea = jindo
						.$Element(this.elPanelTableBGArea);
				this.welPanelTableTemplateArea = jindo
						.$Element(this.elPanelTableTemplateArea);
				this.welPanelReviewBGArea = jindo
						.$Element(this.elPanelReviewBGArea);
				this.elPanelDim1 = jindo.$$.getSingle(
						"DIV.husky_se2m_tbl_qe_dim1", this.elQELayer);
				this.elPanelDim2 = jindo.$$.getSingle(
						"DIV.husky_se2m_tbl_qe_dim2", this.elQELayer);
				this.elPanelDimDelCol = jindo.$$.getSingle(
						"DIV.husky_se2m_tbl_qe_dim_del_col", this.elQELayer);
				this.elPanelDimDelRow = jindo.$$.getSingle(
						"DIV.husky_se2m_tbl_qe_dim_del_row", this.elQELayer);
				this.elInputRadioBGColor = jindo.$$.getSingle(
						"INPUT.husky_se2m_radio_bgc", this.elQELayer);
				this.elInputRadioBGImg = jindo.$$.getSingle(
						"INPUT.husky_se2m_radio_bgimg", this.elQELayer);
				this.elSelectBoxTemplate = jindo.$$.getSingle(
						"DIV.se2_select_ty2", this.elQELayer);
				this.elInputRadioTemplate = jindo.$$.getSingle(
						"INPUT.husky_se2m_radio_template", this.elQELayer);
				this.elPanelQETemplate = jindo.$$.getSingle(
						"DIV.se2_layer_t_style", this.elQELayer);
				this.elBtnQETemplate = jindo.$$.getSingle(
						"BUTTON.husky_se2m_template_more", this.elQELayer);
				this.elPanelQETemplatePreview = jindo.$$.getSingle(
						"SPAN.se2_t_style1", this.elQELayer);
				this.aElBtn_tableStyle = jindo.$$("BUTTON",
						this.elPanelQETemplate);
				for (i = 0; i < this.aElBtn_tableStyle.length; i++) {
					this.oApp.registerBrowserEvent(this.aElBtn_tableStyle[i],
							"click", "TABLE_QE_SELECT_TEMPLATE")
				}
			},
			$LOCAL_BEFORE_FIRST : function(a) {
				if (!!a.match(/(REGISTER_CONVERTERS)/)) {
					this.oApp.acceptLocalBeforeFirstAgain(this, true);
					return true
				} else {
					if (!a.match(/(EVENT_EDITING_AREA_MOUSEMOVE)/)) {
						this.oApp.acceptLocalBeforeFirstAgain(this, true);
						return false
					}
				}
				this.htResizing = {};
				this.nDraggableCellEdge = 2;
				var b = jindo.$Element(document.body);
				this.nPageLeftRightMargin = parseInt(b.css("marginLeft"), 10)
						+ parseInt(b.css("marginRight"), 10);
				this.nPageTopBottomMargin = parseInt(b.css("marginTop"), 10)
						+ parseInt(b.css("marginBottom"), 10);
				this.QE_DIM_MERGE_BTN = 1;
				this.QE_DIM_BG_COLOR = 2;
				this.QE_DIM_REVIEW_BG_IMG = 3;
				this.QE_DIM_TABLE_TEMPLATE = 4;
				this.rxLastDigits = RegExp("([0-9]+)$");
				this._assignHTMLObjects();
				this.oApp.exec("SE2_ATTACH_HOVER_EVENTS",
						[ this.aElBtn_tableStyle ]);
				this.addCSSClass(this.CELL_SELECTION_CLASS,
						"background-color:#B4C9E9;");
				this._createCellResizeGrip();
				this.elIFrame = this.oApp.getWYSIWYGWindow().frameElement;
				this.htFrameOffset = jindo.$Element(this.elIFrame).offset();
				var c;
				this.sEmptyTDSrc = "";
				if (this.oApp.oNavigator.ie) {
					this.sEmptyTDSrc = "<p>&nbsp;</p>"
				} else {
					if (this.oApp.oNavigator.firefox) {
						this.sEmptyTDSrc = "<p><br/></p>"
					} else {
						this.sEmptyTDSrc = "<p>&nbsp;</p>"
					}
				}
				c = this.oApp.getWYSIWYGDocument();
				c = this.elResizeCover;
				this.wfnMousedown_ResizeCover = jindo.$Fn(
						this._mousedown_ResizeCover, this);
				this.wfnMousemove_ResizeCover = jindo.$Fn(
						this._mousemove_ResizeCover, this);
				this.wfnMouseup_ResizeCover = jindo.$Fn(
						this._mouseup_ResizeCover, this);
				this.wfnMousedown_ResizeCover.attach(c, "mousedown");
				this._changeTableEditorStatus(this.STATUS.S_0);
				this.oApp.registerBrowserEvent(this.elBtnMergeCell, "click",
						"TE_MERGE_CELLS");
				this.oApp.registerBrowserEvent(this.elBtnSplitColumn, "click",
						"TE_SPLIT_COLUMN");
				this.oApp.registerBrowserEvent(this.elBtnSplitRow, "click",
						"TE_SPLIT_ROW");
				this.oApp.registerBrowserEvent(this.elBtnAddColumnRight,
						"click", "TE_INSERT_COLUMN_RIGHT");
				this.oApp.registerBrowserEvent(this.elBtnAddRowBelow, "click",
						"TE_INSERT_ROW_BELOW");
				this.oApp.registerBrowserEvent(this.elBtnDeleteColumn, "click",
						"TE_DELETE_COLUMN");
				this.oApp.registerBrowserEvent(this.elBtnDeleteRow, "click",
						"TE_DELETE_ROW");
				this.oApp.registerBrowserEvent(this.elInputRadioBGColor,
						"click", "DRAW_QE_RADIO_OPTION", [ 2 ]);
				this.oApp.registerBrowserEvent(this.elInputRadioBGImg, "click",
						"DRAW_QE_RADIO_OPTION", [ 3 ]);
				this.oApp.registerBrowserEvent(this.elInputRadioTemplate,
						"click", "DRAW_QE_RADIO_OPTION", [ 4 ]);
				this.oApp.registerBrowserEvent(this.elBtnBGPalette, "click",
						"TABLE_QE_TOGGLE_BGC_PALETTE");
				this.oApp.registerBrowserEvent(this.elBtnBGIMGPalette, "click",
						"TABLE_QE_TOGGLE_IMG_PALETTE");
				this.oApp.registerBrowserEvent(this.elPanelBGIMGPaletteHolder,
						"click", "TABLE_QE_SET_IMG_FROM_PALETTE");
				this.oApp.registerBrowserEvent(this.elBtnQETemplate, "click",
						"TABLE_QE_TOGGLE_TEMPLATE");
				this.oApp.registerBrowserEvent(document.body, "mouseup",
						"EVENT_OUTER_DOC_MOUSEUP");
				this.oApp.registerBrowserEvent(document.body, "mousemove",
						"EVENT_OUTER_DOC_MOUSEMOVE")
			},
			$ON_EVENT_EDITING_AREA_KEYUP : function(a) {
				var b = a.key();
				if (b.keyCode == 229 || b.alt || b.ctrl || b.keyCode == 16) {
					return
				} else {
					if (b.keyCode == 8 || b.keyCode == 46) {
						this.oApp.exec("DELETE_BLOCK_CONTENTS");
						a.stop()
					}
				}
				switch (this.nStatus) {
				case this.STATUS.CELL_SELECTED:
					this._changeTableEditorStatus(this.STATUS.S_0);
					break
				}
			},
			$ON_TABLE_QE_SELECT_TEMPLATE : function(e) {
				var c = this.rxLastDigits.exec(e.element.className);
				var b = this.elSelectionStartTable;
				this._changeTableEditorStatus(this.STATUS.S_0);
				this.oApp.exec("STYLE_TABLE", [ b, c[1] ]);
				var a = !!b && b.parentNode ? b.parentNode : null;
				var d = !b ? "BODY" : null;
				this.oApp.exec("RECORD_UNDO_ACTION", [ "CHANGE_TABLE_STYLE", {
					elSaveTarget : a,
					sSaveTarget : d,
					bDontSaveSelection : true
				} ])
			},
			$BEFORE_CHANGE_EDITING_MODE : function(a, b) {
				if (a !== "WYSIWYG" && this.nStatus !== this.STATUS.S_0) {
					this._changeTableEditorStatus(this.STATUS.S_0)
				}
			},
			$ON_TABLE_QE_TOGGLE_BGC_PALETTE : function() {
				if (this.elPanelBGPaletteHolder.parentNode.style.display == "block") {
					this.oApp.exec("HIDE_TABLE_QE_BGC_PALETTE", [])
				} else {
					this.oApp.exec("SHOW_TABLE_QE_BGC_PALETTE", [])
				}
			},
			$ON_SHOW_TABLE_QE_BGC_PALETTE : function() {
				this.elPanelBGPaletteHolder.parentNode.style.display = "block";
				this.oApp.exec("SHOW_COLOR_PALETTE", [
						"TABLE_QE_SET_BGC_FROM_PALETTE",
						this.elPanelBGPaletteHolder ])
			},
			$ON_HIDE_TABLE_QE_BGC_PALETTE : function() {
				this.elPanelBGPaletteHolder.parentNode.style.display = "none";
				this.oApp.exec("HIDE_COLOR_PALETTE", [])
			},
			$ON_TABLE_QE_SET_BGC_FROM_PALETTE : function(a) {
				this.oApp.exec("TABLE_QE_SET_BGC", [ a ]);
				if (this.oSelection) {
					this.oSelection.select()
				}
				this._changeTableEditorStatus(this.STATUS.S_0)
			},
			$ON_TABLE_QE_SET_BGC : function(c) {
				this.elBtnBGPalette.style.backgroundColor = c;
				for ( var a = 0, b = this.aSelectedCells.length; a < b; a++) {
					this.aSelectedCells[a].setAttribute(this.TMP_BGC_ATTR, c);
					this.aSelectedCells[a].removeAttribute(this.TMP_BGIMG_ATTR)
				}
				this.sQEAction = "TABLE_SET_BGCOLOR"
			},
			$ON_TABLE_QE_TOGGLE_IMG_PALETTE : function() {
				if (this.elPanelBGIMGPaletteHolder.parentNode.style.display == "block") {
					this.oApp.exec("HIDE_TABLE_QE_IMG_PALETTE", [])
				} else {
					this.oApp.exec("SHOW_TABLE_QE_IMG_PALETTE", [])
				}
			},
			$ON_SHOW_TABLE_QE_IMG_PALETTE : function() {
				this.elPanelBGIMGPaletteHolder.parentNode.style.display = "block"
			},
			$ON_HIDE_TABLE_QE_IMG_PALETTE : function() {
				this.elPanelBGIMGPaletteHolder.parentNode.style.display = "none"
			},
			$ON_TABLE_QE_SET_IMG_FROM_PALETTE : function(a) {
				this.oApp.exec("TABLE_QE_SET_IMG", [ a.element ]);
				if (this.oSelection) {
					this.oSelection.select()
				}
				this._changeTableEditorStatus(this.STATUS.S_0)
			},
			$ON_TABLE_QE_SET_IMG : function(e) {
				var b = jindo.$Element(e).className();
				var g = jindo.$Element(this.elBtnBGIMGPalette);
				var k = g.className().split(" ");
				for ( var f = 0, h = k.length; f < h; f++) {
					if (k[f].indexOf("cellimg") > 0) {
						g.removeClass(k[f])
					}
				}
				jindo.$Element(this.elBtnBGIMGPalette).addClass(b);
				var a = b.substring(11, b.length);
				var c = "pattern_";
				if (a === "0") {
					for ( var f = 0, h = this.aSelectedCells.length; f < h; f++) {
						jindo.$Element(this.aSelectedCells[f]).css(
								"backgroundImage", "");
						this.aSelectedCells[f]
								.removeAttribute(this.TMP_BGC_ATTR);
						this.aSelectedCells[f]
								.removeAttribute(this.TMP_BGIMG_ATTR)
					}
				} else {
					if (a == 19 || a == 20 || a == 21 || a == 22 || a == 25
							|| a == 26) {
						c = c + a + ".jpg"
					} else {
						c = c + a + ".gif"
					}
					for ( var d = 0, h = this.aSelectedCells.length; d < h; d++) {
						jindo.$Element(this.aSelectedCells[d]).css(
								"backgroundImage",
								"url(http://static.se2.naver.com/static/img/"
										+ c + ")");
						this.aSelectedCells[d]
								.removeAttribute(this.TMP_BGC_ATTR);
						this.aSelectedCells[d].setAttribute(
								this.TMP_BGIMG_ATTR,
								"url(http://static.se2.naver.com/static/img/"
										+ c + ")")
					}
				}
				this.sQEAction = "TABLE_SET_BGIMAGE"
			},
			$ON_SAVE_QE_MY_REVIEW_ITEM : function() {
				this.oApp.exec("SAVE_MY_REVIEW_ITEM");
				this.oApp.exec("CLOSE_QE_LAYER")
			},
			$ON_SHOW_COMMON_QE : function() {
				if (jindo.$Element(this.elSelectionStartTable).hasClass(
						this._sSETblClass)) {
					this.oApp.exec("SHOW_TABLE_QE")
				} else {
					if (jindo.$Element(this.elSelectionStartTable).hasClass(
							this._sSEReviewTblClass)) {
						this.oApp.exec("SHOW_REVIEW_QE")
					}
				}
			},
			$ON_SHOW_TABLE_QE : function() {
				this.oApp.exec("HIDE_TABLE_QE_BGC_PALETTE", []);
				this.oApp.exec("TABLE_QE_HIDE_TEMPLATE", []);
				this.oApp.exec("SETUP_TABLE_QE_MODE", [ 0 ]);
				this.oApp
						.exec(
								"OPEN_QE_LAYER",
								[
										this.htMap[this.htSelectionEPos.x][this.htSelectionEPos.y],
										this.elQELayer, "table" ])
			},
			$ON_SHOW_REVIEW_QE : function() {
				this.oApp.exec("SETUP_TABLE_QE_MODE", [ 1 ]);
				this.oApp
						.exec(
								"OPEN_QE_LAYER",
								[
										this.htMap[this.htSelectionEPos.x][this.htSelectionEPos.y],
										this.elQELayer, "review" ])
			},
			$ON_CLOSE_SUB_LAYER_QE : function() {
				if (typeof this.elPanelBGPaletteHolder != "undefined") {
					this.elPanelBGPaletteHolder.parentNode.style.display = "none"
				}
				if (typeof this.elPanelBGIMGPaletteHolder != "undefined") {
					this.elPanelBGIMGPaletteHolder.parentNode.style.display = "none"
				}
			},
			$ON_SETUP_TABLE_QE_MODE : function(d) {
				var b = true;
				if (typeof d == "number") {
					this.nQEMode = d
				}
				if (this.aSelectedCells.length < 2) {
					b = false
				}
				this.oApp.exec("TABLE_QE_DIM", [ this.QE_DIM_MERGE_BTN, b ]);
				var c = this.aSelectedCells[0].getAttribute(this.TMP_BGC_ATTR)
						|| "rgb(255,255,255)";
				var q = true;
				for ( var g = 1, n = this.aSelectedCells.length; g < n; g++) {
					if (c != this.aSelectedCells[g]
							.getAttribute(this.TMP_BGC_ATTR)) {
						q = false;
						break
					}
				}
				if (q) {
					this.elBtnBGPalette.style.backgroundColor = c
				} else {
					this.elBtnBGPalette.style.backgroundColor = "#FFFFFF"
				}
				var a = this.aSelectedCells[0]
						.getAttribute(this.TMP_BGIMG_ATTR)
						|| "";
				var l = true;
				var h, f = 0;
				var k = jindo.$Element(this.elBtnBGIMGPalette);
				if (!!a) {
					var p = a.match(/\_[0-9]*/);
					h = (!!p) ? p[0] : "_0";
					f = h.substring(1, h.length);
					for ( var g = 1, n = this.aSelectedCells.length; g < n; g++) {
						if (a != this.aSelectedCells[g]
								.getAttribute(this.TMP_BGIMG_ATTR)) {
							l = false;
							break
						}
					}
				}
				var o = k.className().split(/\s/);
				for ( var e = 0, n = o.length; e < n; e++) {
					if (o[e].indexOf("cellimg") > 0) {
						k.removeClass(o[e])
					}
				}
				if (l && f > 0) {
					k.addClass("se2_cellimg" + f)
				} else {
					k.addClass("se2_cellimg0")
				}
				if (this.nQEMode === 0) {
					this.elPanelTableTemplateArea.style.display = "block";
					this.elPanelReviewBGArea.style.display = "none";
					jindo.$Element(this.elPanelTableBGArea)
							.className("se2_qe2");
					var m = this.parseIntOr0(this.elSelectionStartTable
							.getAttribute(this.ATTR_TBL_TEMPLATE));
					if (m) {
					} else {
						this.elInputRadioBGColor.checked = "true";
						m = 1
					}
					this.elPanelQETemplatePreview.className = "se2_t_style" + m;
					this.elPanelBGImg.style.position = ""
				} else {
					if (this.nQEMode == 1) {
						this.elPanelTableTemplateArea.style.display = "none";
						this.elPanelReviewBGArea.style.display = "block";
						var m = this.parseIntOr0(this.elSelectionStartTable
								.getAttribute(this.ATTR_REVIEW_TEMPLATE));
						this.elPanelBGImg.style.position = "relative"
					} else {
						this.elPanelTableTemplateArea.style.display = "none";
						this.elPanelReviewBGArea.style.display = "none"
					}
				}
				this.oApp.exec("DRAW_QE_RADIO_OPTION", [ 0 ])
			},
			$ON_DRAW_QE_RADIO_OPTION : function(a) {
				if (a !== 0 && a != 2) {
					this.oApp.exec("HIDE_TABLE_QE_BGC_PALETTE", [])
				}
				if (a !== 0 && a != 3) {
					this.oApp.exec("HIDE_TABLE_QE_IMG_PALETTE", [])
				}
				if (a !== 0 && a != 4) {
					this.oApp.exec("TABLE_QE_HIDE_TEMPLATE", [])
				}
				if (this.nQEMode === 0) {
					if (this.elInputRadioBGImg.checked) {
						this.elInputRadioBGColor.checked = "true"
					}
					if (this.elInputRadioBGColor.checked) {
						this.oApp.exec("TABLE_QE_DIM", [
								this.QE_DIM_TABLE_TEMPLATE, false ])
					} else {
						this.oApp.exec("TABLE_QE_DIM", [ this.QE_DIM_BG_COLOR,
								false ])
					}
				} else {
					if (this.elInputRadioTemplate.checked) {
						this.elInputRadioBGColor.checked = "true"
					}
					if (this.elInputRadioBGColor.checked) {
						this.oApp.exec("TABLE_QE_DIM", [
								this.QE_DIM_REVIEW_BG_IMG, false ])
					} else {
						this.oApp.exec("TABLE_QE_DIM", [ this.QE_DIM_BG_COLOR,
								false ])
					}
				}
			},
			$ON_TABLE_QE_DIM : function(a, c) {
				var b;
				var d = "se2_qdim";
				if (a == 1) {
					b = this.elPanelDim1
				} else {
					b = this.elPanelDim2
				}
				if (c) {
					a = 0
				}
				b.className = d + a
			},
			$ON_TE_SELECT_TABLE : function(a) {
				this.elSelectionStartTable = a;
				this.htMap = this._getCellMapping(this.elSelectionStartTable)
			},
			$ON_TE_SELECT_CELLS : function(b, a) {
				this._selectCells(b, a)
			},
			$ON_TE_MERGE_CELLS : function() {
				if (this.aSelectedCells.length === 0
						|| this.aSelectedCells.length == 1) {
					return
				}
				this._removeClassFromSelection();
				var e, d, c;
				d = this.aSelectedCells[0];
				var f = nhn.husky.SE2M_Utils.findAncestorByTagName("TABLE", d);
				var a, b;
				var g, h = this.aSelectedCells[0];
				a = parseInt(h.style.height || h.getAttribute("height"), 10);
				b = parseInt(h.style.width || h.getAttribute("width"), 10);
				for (e = this.htSelectionSPos.x + 1; e < this.htSelectionEPos.x + 1; e++) {
					curTD = this.htMap[e][this.htSelectionSPos.y];
					if (curTD == h) {
						continue
					}
					h = curTD;
					b += parseInt(curTD.style.width
							|| curTD.getAttribute("width"), 10)
				}
				h = this.aSelectedCells[0];
				for (e = this.htSelectionSPos.y + 1; e < this.htSelectionEPos.y + 1; e++) {
					curTD = this.htMap[this.htSelectionSPos.x][e];
					if (curTD == h) {
						continue
					}
					h = curTD;
					a += parseInt(curTD.style.height
							|| curTD.getAttribute("height"), 10)
				}
				if (b) {
					d.style.width = b + "px"
				}
				if (a) {
					d.style.height = a + "px"
				}
				d.setAttribute("colSpan", this.htSelectionEPos.x
						- this.htSelectionSPos.x + 1);
				d.setAttribute("rowSpan", this.htSelectionEPos.y
						- this.htSelectionSPos.y + 1);
				for (e = 1; e < this.aSelectedCells.length; e++) {
					c = this.aSelectedCells[e];
					if (c.parentNode) {
						if (!nhn.husky.SE2M_Utils.isBlankNode(c)) {
							d.innerHTML += c.innerHTML
						}
						c.parentNode.removeChild(c)
					}
				}
				this.htMap = this._getCellMapping(this.elSelectionStartTable);
				this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
				this._showTableTemplate(this.elSelectionStartTable);
				this._addClassToSelection();
				this.sQEAction = "TABLE_CELL_MERGE";
				this.oApp.exec("SHOW_COMMON_QE")
			},
			$ON_TABLE_QE_TOGGLE_TEMPLATE : function() {
				if (this.elPanelQETemplate.style.display == "block") {
					this.oApp.exec("TABLE_QE_HIDE_TEMPLATE")
				} else {
					this.oApp.exec("TABLE_QE_SHOW_TEMPLATE")
				}
			},
			$ON_TABLE_QE_SHOW_TEMPLATE : function() {
				this.elPanelQETemplate.style.display = "block";
				this.oApp.exec("POSITION_TOOLBAR_LAYER",
						[ this.elPanelQETemplate ])
			},
			$ON_TABLE_QE_HIDE_TEMPLATE : function() {
				this.elPanelQETemplate.style.display = "none"
			},
			$ON_STYLE_TABLE : function(a, b) {
				if (!a) {
					if (!this._t) {
						this._t = 1
					}
					a = this.elSelectionStartTable;
					b = (this._t++) % 20 + 1
				}
				if (this.oSelection) {
					this.oSelection.select()
				}
				this._applyTableTemplate(a, b)
			},
			$ON_TE_DELETE_COLUMN : function() {
				if (this.aSelectedCells.length === 0
						|| this.aSelectedCells.length == 1) {
					return
				}
				this._selectAll_Column();
				this._deleteSelectedCells();
				this.sQEAction = "DELETE_TABLE_COLUMN";
				this._changeTableEditorStatus(this.STATUS.S_0)
			},
			$ON_TE_DELETE_ROW : function() {
				if (this.aSelectedCells.length === 0
						|| this.aSelectedCells.length == 1) {
					return
				}
				this._selectAll_Row();
				this._deleteSelectedCells();
				this.sQEAction = "DELETE_TABLE_ROW";
				this._changeTableEditorStatus(this.STATUS.S_0)
			},
			$ON_TE_INSERT_COLUMN_RIGHT : function() {
				if (this.aSelectedCells.length === 0) {
					return
				}
				this._selectAll_Column();
				this._insertColumnAfter(this.htSelectionEPos.x)
			},
			$ON_TE_INSERT_COLUMN_LEFT : function() {
				this._selectAll_Column();
				this._insertColumnAfter(this.htSelectionSPos.x - 1)
			},
			$ON_TE_INSERT_ROW_BELOW : function() {
				if (this.aSelectedCells.length === 0) {
					return
				}
				this._insertRowBelow(this.htSelectionEPos.y)
			},
			$ON_TE_INSERT_ROW_ABOVE : function() {
				this._insertRowBelow(this.htSelectionSPos.y - 1)
			},
			$ON_TE_SPLIT_COLUMN : function() {
				var e, a, f, l;
				var j, d;
				if (this.aSelectedCells.length === 0) {
					return
				}
				this._removeClassFromSelection();
				var g = this.aSelectedCells[0];
				for ( var b = 0, k = this.aSelectedCells.length; b < k; b++) {
					j = this.aSelectedCells[b];
					e = parseInt(j.getAttribute("colSpan"), 10) || 1;
					if (e > 1) {
						continue
					}
					var c = this._getBasisCellPosition(j);
					for ( var h = 0; h < this.htMap[0].length;) {
						j = this.htMap[c.x][h];
						e = parseInt(j.getAttribute("colSpan"), 10) || 1;
						j.setAttribute("colSpan", e + 1);
						h += parseInt(j.getAttribute("rowSpan"), 10) || 1
					}
				}
				for ( var b = 0, k = this.aSelectedCells.length; b < k; b++) {
					j = this.aSelectedCells[b];
					e = parseInt(j.getAttribute("colSpan"), 10) || 1;
					a = (e / 2).toFixed(0);
					j.setAttribute("colSpan", a);
					d = this._shallowCloneTD(j);
					d.setAttribute("colSpan", e - a);
					g = d;
					e = parseInt(j.getAttribute("rowSpan"), 10) || 1;
					d.setAttribute("rowSpan", e);
					d.innerHTML = "&nbsp;";
					f = j.width || j.style.width;
					if (f) {
						f = this.parseIntOr0(f);
						j.removeAttribute("width");
						l = (f / 2).toFixed();
						j.style.width = l + "px";
						d.style.width = (f - l) + "px"
					}
					j.parentNode.insertBefore(d, j.nextSibling)
				}
				this._reassignCellSizes(this.elSelectionStartTable);
				this.htMap = this._getCellMapping(this.elSelectionStartTable);
				var c = this._getBasisCellPosition(g);
				this.htSelectionEPos.x = c.x;
				this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
				this.sQEAction = "SPLIT_TABLE_COLUMN";
				this.oApp.exec("SHOW_COMMON_QE")
			},
			$ON_TE_SPLIT_ROW : function() {
				var u, d, y, y;
				var q, s, a, n;
				if (this.aSelectedCells.length === 0) {
					return
				}
				var m = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
					oneTimeOffCache : true
				});
				this._removeClassFromSelection();
				var v = 0;
				var c;
				for ( var r = 0, k = this.aSelectedCells.length; r < k; r++) {
					q = this.aSelectedCells[r];
					u = parseInt(q.getAttribute("rowSpan"), 10) || 1;
					if (u > 1) {
						continue
					}
					a = this._getBasisCellPosition(q);
					c = m[a.y];
					n = this.oApp.getWYSIWYGDocument().createElement("TR");
					c.parentNode.insertBefore(n, c.nextSibling);
					v++;
					for ( var h = 0; h < this.htMap.length;) {
						q = this.htMap[h][a.y];
						u = parseInt(q.getAttribute("rowSpan"), 10) || 1;
						q.setAttribute("rowSpan", u + 1);
						h += parseInt(q.getAttribute("colSpan"), 10) || 1
					}
				}
				m = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
					oneTimeOffCache : true
				});
				var p, o;
				for ( var r = 0, k = this.aSelectedCells.length; r < k; r++) {
					q = this.aSelectedCells[r];
					u = parseInt(q.getAttribute("rowSpan"), 10) || 1;
					d = (u / 2).toFixed(0);
					q.setAttribute("rowSpan", d);
					s = this._shallowCloneTD(q);
					s.setAttribute("rowSpan", u - d);
					u = parseInt(q.getAttribute("colSpan"), 10) || 1;
					s.setAttribute("colSpan", u);
					s.innerHTML = "&nbsp;";
					y = q.height || q.style.height;
					if (y) {
						y = this.parseIntOr0(y);
						q.removeAttribute("height");
						nNewHeight = (y / 2).toFixed();
						q.style.height = nNewHeight + "px";
						s.style.height = (y - nNewHeight) + "px"
					}
					var f = jindo.$A(m).indexOf(q.parentNode);
					var t = parseInt(f, 10) + parseInt(d, 10);
					var b = m[t];
					var j = b.childNodes;
					var e = null;
					var w;
					p = this._getBasisCellPosition(q);
					for ( var l = 0, g = j.length; l < g; l++) {
						w = j[l];
						if (!w.tagName || w.tagName != "TD") {
							continue
						}
						o = this._getBasisCellPosition(w);
						if (p.x < o.x) {
							e = w;
							break
						}
					}
					b.insertBefore(s, e)
				}
				this._reassignCellSizes(this.elSelectionStartTable);
				this.htMap = this._getCellMapping(this.elSelectionStartTable);
				this.htSelectionEPos.y += v;
				this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
				this.sQEAction = "SPLIT_TABLE_ROW";
				this.oApp.exec("SHOW_COMMON_QE")
			},
			$ON_MSG_CELL_SELECTED : function() {
				this.elPanelDimDelCol.className = "se2_qdim6r";
				this.elPanelDimDelRow.className = "se2_qdim6c";
				if (this.htSelectionSPos.x === 0
						&& this.htSelectionEPos.x === this.htMap.length - 1) {
					this.oApp.exec("MSG_ROW_SELECTED")
				}
				if (this.htSelectionSPos.y === 0
						&& this.htSelectionEPos.y === this.htMap[0].length - 1) {
					this.oApp.exec("MSG_COL_SELECTED")
				}
				this.oApp.exec("SHOW_COMMON_QE")
			},
			$ON_MSG_ROW_SELECTED : function() {
				this.elPanelDimDelRow.className = ""
			},
			$ON_MSG_COL_SELECTED : function() {
				this.elPanelDimDelCol.className = ""
			},
			$ON_EVENT_EDITING_AREA_MOUSEDOWN : function(c) {
				if (!this.oApp.isWYSIWYGEnabled()) {
					return
				}
				switch (this.nStatus) {
				case this.STATUS.S_0:
					if (!c.element) {
						return
					}
					if (c.element.tagName == "IMG") {
						return
					}
					if (this.oApp.getEditingMode() !== "WYSIWYG") {
						return
					}
					var b = nhn.husky.SE2M_Utils.findAncestorByTagName("TD",
							c.element);
					if (b && b.tagName == "TD") {
						var a = nhn.husky.SE2M_Utils.findAncestorByTagName(
								"TABLE", b);
						if (!jindo.$Element(a).hasClass(this._sSETblClass)
								&& !jindo.$Element(a).hasClass(
										this._sSEReviewTblClass)) {
							return
						}
						if (!this._isValidTable(a)) {
							jindo.$Element(a).removeClass(this._sSETblClass);
							jindo.$Element(a).removeClass(
									this._sSEReviewTblClass);
							return
						}
						if (a) {
							this.elSelectionStartTD = b;
							this.elSelectionStartTable = a;
							this
									._changeTableEditorStatus(this.STATUS.MOUSEDOWN_CELL)
						}
					}
					break;
				case this.STATUS.MOUSEDOWN_CELL:
					break;
				case this.STATUS.CELL_SELECTING:
					break;
				case this.STATUS.CELL_SELECTED:
					this._changeTableEditorStatus(this.STATUS.S_0);
					break
				}
			},
			$ON_EVENT_EDITING_AREA_MOUSEMOVE : function(c) {
				if (this.oApp.getEditingMode() != "WYSIWYG") {
					return
				}
				switch (this.nStatus) {
				case this.STATUS.S_0:
					if (this._isOnBorder(c)) {
						this._showCellResizeGrip(c)
					} else {
						this._hideResizer()
					}
					break;
				case this.STATUS.MOUSEDOWN_CELL:
					var b = nhn.husky.SE2M_Utils.findAncestorByTagName("TD",
							c.element);
					if ((b && b !== this.elSelectionStartTD) || !b) {
						if (!b) {
							b = this.elSelectionStartTD
						}
						this._reassignCellSizes(this.elSelectionStartTable);
						this._startCellSelection();
						this._selectBetweenCells(this.elSelectionStartTD, b)
					}
					break;
				case this.STATUS.CELL_SELECTING:
					var b = nhn.husky.SE2M_Utils.findAncestorByTagName("TD",
							c.element);
					if (!b || b === this.elLastSelectedTD) {
						return
					}
					var a = nhn.husky.SE2M_Utils.findAncestorByTagName("TABLE",
							b);
					if (a !== this.elSelectionStartTable) {
						return
					}
					this.elLastSelectedTD = b;
					this._selectBetweenCells(this.elSelectionStartTD, b);
					break;
				case this.STATUS.CELL_SELECTED:
					break
				}
			},
			$ON_EVENT_OUTER_DOC_MOUSEMOVE : function(g) {
				switch (this.nStatus) {
				case this.STATUS.CELL_SELECTING:
					var e = g.pos();
					var b = e.pageY;
					var d = e.pageX;
					if (b < this.htEditingAreaPos.top) {
						var f = this.htSelectionSPos.y;
						if (f > 0) {
							this.htSelectionSPos.y--;
							this._selectCells(this.htSelectionSPos,
									this.htSelectionEPos);
							var c = this.oApp.getSelection();
							c.selectNodeContents(this.aSelectedCells[0]);
							c.select();
							c.oBrowserSelection.selectNone()
						}
					} else {
						if (b > this.htEditingAreaPos.bottom) {
							var f = this.htSelectionEPos.y;
							if (f < this.htMap[0].length - 1) {
								this.htSelectionEPos.y++;
								this._selectCells(this.htSelectionSPos,
										this.htSelectionEPos);
								var c = this.oApp.getSelection();
								c
										.selectNodeContents(this.htMap[this.htSelectionEPos.x][this.htSelectionEPos.y]);
								c.select();
								c.oBrowserSelection.selectNone()
							}
						}
					}
					if (d < this.htEditingAreaPos.left) {
						var a = this.htSelectionSPos.x;
						if (a > 0) {
							this.htSelectionSPos.x--;
							this._selectCells(this.htSelectionSPos,
									this.htSelectionEPos);
							var c = this.oApp.getSelection();
							c.selectNodeContents(this.aSelectedCells[0]);
							c.select();
							c.oBrowserSelection.selectNone()
						}
					} else {
						if (d > this.htEditingAreaPos.right) {
							var a = this.htSelectionEPos.x;
							if (a < this.htMap.length - 1) {
								this.htSelectionEPos.x++;
								this._selectCells(this.htSelectionSPos,
										this.htSelectionEPos);
								var c = this.oApp.getSelection();
								c
										.selectNodeContents(this.htMap[this.htSelectionEPos.x][this.htSelectionEPos.y]);
								c.select();
								c.oBrowserSelection.selectNone()
							}
						}
					}
					break
				}
			},
			$ON_EVENT_OUTER_DOC_MOUSEUP : function(a) {
				this._eventEditingAreaMouseup(a)
			},
			$ON_EVENT_EDITING_AREA_MOUSEUP : function(a) {
				this._eventEditingAreaMouseup(a)
			},
			_eventEditingAreaMouseup : function(a) {
				if (this.oApp.getEditingMode() != "WYSIWYG") {
					return
				}
				switch (this.nStatus) {
				case this.STATUS.S_0:
					break;
				case this.STATUS.MOUSEDOWN_CELL:
					this._changeTableEditorStatus(this.STATUS.S_0);
					break;
				case this.STATUS.CELL_SELECTING:
					this._changeTableEditorStatus(this.STATUS.CELL_SELECTED);
					break;
				case this.STATUS.CELL_SELECTED:
					break
				}
			},
			$ON_GET_SELECTED_CELLS : function(a, b) {
				if (!!this.aSelectedCells) {
					b[a] = this.aSelectedCells
				}
			},
			_coverResizeLayer : function() {
				this.elResizeCover.style.position = "absolute";
				var a = jindo.$Document().clientSize();
				this.elResizeCover.style.width = a.width
						- this.nPageLeftRightMargin + "px";
				this.elResizeCover.style.height = a.height
						- this.nPageTopBottomMargin + "px";
				document.body.appendChild(this.elResizeCover)
			},
			_uncoverResizeLayer : function() {
				this.elResizeGrid.appendChild(this.elResizeCover);
				this.elResizeCover.style.position = "";
				this.elResizeCover.style.width = "100%";
				this.elResizeCover.style.height = "100%"
			},
			_reassignCellSizes : function(r) {
				var d = new Array(2);
				d[0] = jindo.$$(">TBODY>TR>TD", r, {
					oneTimeOffCache : true
				});
				d[1] = jindo.$$(">TBODY>TR>TH", r, {
					oneTimeOffCache : true
				});
				var j = new Array(d[0].length + d[1].length);
				var c = 0;
				var h = this.parseIntOr0(r.border);
				var a = this.parseIntOr0(r.cellPadding);
				for ( var m = 0; m < 2; m++) {
					for ( var q = 0; q < d[m].length; q++) {
						var g = d[m][q];
						var b = jindo.$Element(g);
						var u = this.parseIntOr0(b.css("paddingLeft"));
						var p = this.parseIntOr0(b.css("paddingRight"));
						var v = this.parseIntOr0(b.css("paddingTop"));
						var t = this.parseIntOr0(b.css("paddingBottom"));
						var l = this.parseBorder(b.css("borderLeftWidth"), b
								.css("borderLeftStyle"));
						var f = this.parseBorder(b.css("borderRightWidth"), b
								.css("borderRightStyle"));
						var e = this.parseBorder(b.css("borderTopWidth"), b
								.css("borderTopStyle"));
						var w = this.parseBorder(b.css("borderBottomWidth"), b
								.css("borderBottomStyle"));
						var o, s;
						if (this.oApp.oNavigator.firefox) {
							o = g.offsetWidth - (u + p + l + f) + "px";
							s = g.offsetHeight + "px"
						} else {
							o = g.offsetWidth - (u + p + l + f) + "px";
							s = g.offsetHeight - (v + t + e + w) + "px"
						}
						j[c++] = [ g, o, s ]
					}
				}
				for ( var q = 0; q < c; q++) {
					var k = j[q];
					k[0].removeAttribute("width");
					k[0].removeAttribute("height");
					k[0].style.width = k[1];
					k[0].style.height = k[2]
				}
				r.removeAttribute("width");
				r.removeAttribute("height");
				r.style.width = "";
				r.style.height = ""
			},
			_mousedown_ResizeCover : function(c) {
				this.bResizing = true;
				this.nStartHeight = c.pos().clientY;
				this.wfnMousemove_ResizeCover.attach(this.elResizeCover,
						"mousemove");
				this.wfnMouseup_ResizeCover.attach(document, "mouseup");
				this._coverResizeLayer();
				this.elResizeGrid.style.border = "1px dotted black";
				this.nStartHeight = c.pos().clientY;
				this.nStartWidth = c.pos().clientX;
				this._reassignCellSizes(this.htResizing.elTable);
				this.htMap = this._getCellMapping(this.htResizing.elTable);
				var d = this._getBasisCellPosition(this.htResizing.elCell);
				var b = (parseInt(this.htResizing.elCell
						.getAttribute("colspan")) || 1) - 1;
				var f = (parseInt(this.htResizing.elCell
						.getAttribute("rowspan")) || 1) - 1;
				var a = d.x + b + this.htResizing.nHA;
				var e = d.y + f + this.htResizing.nVA;
				if (a < 0 || e < 0) {
					return
				}
				this.htAllAffectedCells = this._getAllAffectedCells(a, e,
						this.htResizing.nResizeMode, this.htResizing.elTable)
			},
			_mousemove_ResizeCover : function(b) {
				var a = b.pos().clientY - this.nStartHeight;
				var c = b.pos().clientX - this.nStartWidth;
				var d = b.pos();
				if (this.htResizing.nResizeMode == 1) {
					this.elResizeGrid.style.left = d.pageX
							- this.parseIntOr0(this.elResizeGrid.style.width)
							/ 2 + "px"
				} else {
					this.elResizeGrid.style.top = d.pageY
							- this.parseIntOr0(this.elResizeGrid.style.height)
							/ 2 + "px"
				}
			},
			_mouseup_ResizeCover : function(h) {
				this.bResizing = false;
				this._hideResizer();
				this._uncoverResizeLayer();
				this.elResizeGrid.style.border = "";
				this.wfnMousemove_ResizeCover.detach(this.elResizeCover,
						"mousemove");
				this.wfnMouseup_ResizeCover.detach(document, "mouseup");
				var f = 0;
				var e = 0;
				if (this.htResizing.nResizeMode == 2) {
					f = h.pos().clientY - this.nStartHeight
				}
				if (this.htResizing.nResizeMode == 1) {
					e = h.pos().clientX - this.nStartWidth;
					if (this.htAllAffectedCells.nMinBefore != -1
							&& e < -1 * this.htAllAffectedCells.nMinBefore) {
						e = -1 * this.htAllAffectedCells.nMinBefore
								+ this.MIN_CELL_WIDTH
					}
					if (this.htAllAffectedCells.nMinAfter != -1
							&& e > this.htAllAffectedCells.nMinAfter) {
						e = this.htAllAffectedCells.nMinAfter
								- this.MIN_CELL_WIDTH
					}
				}
				var c = this.htAllAffectedCells.aCellsBefore;
				for ( var d = 0; d < c.length; d++) {
					var g = c[d];
					var a = this.parseIntOr0(g.style.width) + e;
					g.style.width = Math.max(a, this.MIN_CELL_WIDTH) + "px";
					var j = this.parseIntOr0(g.style.height) + f;
					g.style.height = Math.max(j, this.MIN_CELL_HEIGHT) + "px"
				}
				var b = this.htAllAffectedCells.aCellsAfter;
				for ( var d = 0; d < b.length; d++) {
					var g = b[d];
					var a = this.parseIntOr0(g.style.width) - e;
					g.style.width = Math.max(a, this.MIN_CELL_WIDTH) + "px";
					var j = this.parseIntOr0(g.style.height) - f;
					g.style.height = Math.max(j, this.MIN_CELL_HEIGHT) + "px"
				}
			},
			$ON_CLOSE_QE_LAYER : function() {
				this._changeTableEditorStatus(this.STATUS.S_0)
			},
			_changeTableEditorStatus : function(a) {
				if (this.nStatus == a) {
					return
				}
				this.nStatus = a;
				switch (a) {
				case this.STATUS.S_0:
					if (this.nStatus == this.STATUS.MOUSEDOWN_CELL) {
						break
					}
					this._deselectCells();
					if (!!this.sQEAction) {
						this.oApp.exec("RECORD_UNDO_ACTION", [ this.sQEAction,
								{
									elSaveTarget : this.elSelectionStartTable,
									bDontSaveSelection : true
								} ]);
						this.sQEAction = ""
					}
					if (this.oApp.oNavigator.safari
							|| this.oApp.oNavigator.chrome) {
						this.oApp.getWYSIWYGDocument().onselectstart = null
					}
					this.oApp.exec("ENABLE_WYSIWYG", []);
					this.oApp.exec("CLOSE_QE_LAYER");
					this.elSelectionStartTable = null;
					break;
				case this.STATUS.CELL_SELECTING:
					if (this.oApp.oNavigator.ie) {
						document.body.setCapture(false)
					}
					break;
				case this.STATUS.CELL_SELECTED:
					this.oApp.delayedExec("MSG_CELL_SELECTED", [], 0);
					if (this.oApp.oNavigator.ie) {
						document.body.releaseCapture()
					}
					break
				}
				this.oApp.exec("TABLE_EDITOR_STATUS_CHANGED", [ this.nStatus ])
			},
			_isOnBorder : function(c) {
				this.htResizing.nResizeMode = 0;
				this.htResizing.elCell = c.element;
				if (c.element.tagName != "TD" && c.element.tagName != "TH") {
					return false
				}
				this.htResizing.elTable = nhn.husky.SE2M_Utils
						.findAncestorByTagName("TABLE", this.htResizing.elCell);
				if (!this.htResizing.elTable) {
					return
				}
				if (!jindo.$Element(this.htResizing.elTable).hasClass(
						this._sSETblClass)
						&& !jindo.$Element(this.htResizing.elTable).hasClass(
								this._sSEReviewTblClass)) {
					return
				}
				this.htResizing.nVA = 0;
				this.htResizing.nHA = 0;
				this.htResizing.nBorderLeftPos = 0;
				this.htResizing.nBorderTopPos = -1;
				this.htResizing.htEPos = c.pos(true);
				this.htResizing.nBorderSize = this
						.parseIntOr0(this.htResizing.elTable.border);
				var b;
				var a;
				if (jindo.$Agent().navigator().ie
						|| jindo.$Agent().navigator().safari) {
					b = this.htResizing.nBorderSize + this.nDraggableCellEdge;
					a = this.nDraggableCellEdge
				} else {
					b = this.nDraggableCellEdge;
					a = this.htResizing.nBorderSize + this.nDraggableCellEdge
				}
				if (this.htResizing.htEPos.offsetY <= b) {
					if (this.htResizing.elCell.parentNode.previousSibling) {
						this.htResizing.nVA = -1;
						this.htResizing.nResizeMode = 2
					}
				}
				if (this.htResizing.elCell.offsetHeight - a <= this.htResizing.htEPos.offsetY) {
					this.htResizing.nBorderTopPos = this.htResizing.elCell.offsetHeight
							+ b - 1;
					this.htResizing.nResizeMode = 2
				}
				if (this.htResizing.htEPos.offsetX <= b) {
					if (this.htResizing.elCell.previousSibling) {
						this.htResizing.nHA = -1;
						this.htResizing.nResizeMode = 0
					}
				}
				if (this.htResizing.elCell.offsetWidth - a <= this.htResizing.htEPos.offsetX) {
					this.htResizing.nBorderLeftPos = this.htResizing.elCell.offsetWidth
							+ b - 1;
					this.htResizing.nResizeMode = 1
				}
				if (this.htResizing.nResizeMode === 0) {
					return false
				}
				return true
			},
			_showCellResizeGrip : function() {
				if (this.htResizing.nResizeMode == 1) {
					this.elResizeCover.style.cursor = "col-resize"
				} else {
					this.elResizeCover.style.cursor = "row-resize"
				}
				this._showResizer();
				if (this.htResizing.nResizeMode == 1) {
					this
							._setResizerSize(
									(this.htResizing.nBorderSize + this.nDraggableCellEdge) * 2,
									this.parseIntOr0(jindo.$Element(
											this.elIFrame).css("height")));
					jindo
							.$Element(this.elResizeGrid)
							.offset(
									this.htFrameOffset.top,
									this.htFrameOffset.left
											+ this.htResizing.htEPos.clientX
											- this
													.parseIntOr0(this.elResizeGrid.style.width)
											/ 2
											- this.htResizing.htEPos.offsetX
											+ this.htResizing.nBorderLeftPos)
				} else {
					var a = this.oApp.elEditingAreaContainer.offsetWidth + "px";
					this
							._setResizerSize(
									this.parseIntOr0(a),
									(this.htResizing.nBorderSize + this.nDraggableCellEdge) * 2);
					jindo
							.$Element(this.elResizeGrid)
							.offset(
									this.htFrameOffset.top
											+ this.htResizing.htEPos.clientY
											- this
													.parseIntOr0(this.elResizeGrid.style.height)
											/ 2
											- this.htResizing.htEPos.offsetY
											+ this.htResizing.nBorderTopPos,
									this.htFrameOffset.left)
				}
			},
			_getAllAffectedCells : function(d, a, o, m) {
				if (!m) {
					return []
				}
				var h = this._getCellMapping(m);
				var p = h.length;
				var n = h[0].length;
				var f = [];
				var c = [];
				var g;
				var b = -1, e = -1;
				if (o == 1) {
					for ( var k = 0; k < n; k++) {
						if (f.length > 0 && f[f.length - 1] == h[d][k]) {
							continue
						}
						f[f.length] = h[d][k];
						var j = parseInt(h[d][k].style.width);
						if (b == -1 || b > j) {
							b = j
						}
					}
					if (h.length > d + 1) {
						for ( var k = 0; k < n; k++) {
							if (c.length > 0 && c[c.length - 1] == h[d + 1][k]) {
								continue
							}
							c[c.length] = h[d + 1][k];
							var j = parseInt(h[d + 1][k].style.width);
							if (e == -1 || e > j) {
								e = j
							}
						}
					}
					g = {
						aCellsBefore : f,
						aCellsAfter : c,
						nMinBefore : b,
						nMinAfter : e
					}
				} else {
					for ( var l = 0; l < p; l++) {
						if (f.length > 0 && f[f.length - 1] == h[l][a]) {
							continue
						}
						f[f.length] = h[l][a];
						if (b == -1 || b > h[l][a].style.height) {
							b = h[l][a].style.height
						}
					}
					g = {
						aCellsBefore : f,
						aCellsAfter : c,
						nMinBefore : b,
						nMinAfter : e
					}
				}
				return g
			},
			_createCellResizeGrip : function() {
				this.elTmp = document.createElement("DIV");
				try {
					this.elTmp.innerHTML = '<div style="position:absolute; overflow:hidden; z-index: 99; "><div onmousedown="return false" style="background-color:#000000;filter:alpha(opacity=0);opacity:0.0;-moz-opacity:0.0;-khtml-opacity:0.0;cursor: col-resize; left: 0px; top: 0px; width: 100%; height: 100%;font-size:1px;z-index: 999; "></div></div>';
					this.elResizeGrid = this.elTmp.firstChild;
					this.elResizeCover = this.elResizeGrid.firstChild
				} catch (a) {
				}
				document.body.appendChild(this.elResizeGrid)
			},
			_selectAll_Row : function() {
				this.htSelectionSPos.x = 0;
				this.htSelectionEPos.x = this.htMap.length - 1;
				this._selectCells(this.htSelectionSPos, this.htSelectionEPos)
			},
			_selectAll_Column : function() {
				this.htSelectionSPos.y = 0;
				this.htSelectionEPos.y = this.htMap[0].length - 1;
				this._selectCells(this.htSelectionSPos, this.htSelectionEPos)
			},
			_deleteSelectedColumn : function() {
				var e = this.htSelectionSPos.x;
				var g = this.htSelectionEPos.x;
				var c;
				var f = null;
				for ( var a = e; a <= g; a++) {
					elCurCell = this.htMap[a][this.htSelectionSPos.y];
					if (elCurCell != f) {
						elCurCell.innerHTML = "";
						c = parseInt(elCurCell.getAttribute("colSpan"), 10) || 1;
						elCurCell.style.width = "";
						elCurCell.setAttribute("colSpan", 1);
						for ( var d = 0; d < c - 1; d++) {
							var b = this.oApp.getWYSIWYGDocument()
									.createElement("TD");
							elCurCell.parentNode.insertBefore(b, elCurCell)
						}
						f = elCurCell
					}
				}
				this.htMap = this._getCellMapping(this.elSelectionStartTable);
				for ( var a = e; a <= g; a++) {
					this._deleteColumn(e)
				}
			},
			_deleteColumn : function(e) {
				var b;
				var c = 0;
				for ( var d = 0; d < this.htMap[0].length; d++) {
					b = this.htMap[e][d];
					nSpan = parseInt(b.getAttribute("colSpan"), 10) || 1;
					if (nSpan == 1) {
						c = b.offsetWidth;
						break
					}
				}
				var a = null;
				for ( var d = 0; d < this.htMap[0].length; d++) {
					b = this.htMap[e][d];
					if (b == a) {
						continue
					}
					a = b;
					nSpan = parseInt(b.getAttribute("colSpan"), 10) || 1;
					if (nSpan > 1) {
						b.setAttribute("colSpan", nSpan - 1);
						b.style.width = parseInt(b.style.width) - c + "px"
					} else {
						b.parentNode.removeChild(b)
					}
				}
				aTR = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
					oneTimeOffCache : true
				});
				if (aTR.length < 1) {
					this.elSelectionStartTable.parentNode
							.removeChild(this.elSelectionStartTable)
				} else {
					this.htMap = this
							._getCellMapping(this.elSelectionStartTable)
				}
			},
			_deleteSelectedRow : function() {
				var a = this.htSelectionSPos.y;
				var b = this.htSelectionEPos.y;
				for ( var c = a; c <= b; c++) {
					this._deleteRow(a)
				}
			},
			_deleteRow : function(d) {
				var e;
				var c = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
					oneTimeOffCache : true
				});
				var b = c[d];
				var f = b.offsetHeight;
				for ( var a = 0; a < this.htMap.length; a++) {
					e = this.htMap[a][d];
					nSpan = parseInt(e.getAttribute("rowSpan"), 10) || 1;
					if (nSpan > 1) {
						e.setAttribute("rowSpan", nSpan - 1);
						e.style.height = parseInt(e.style.height) - f + "px";
						if (e.parentNode == b) {
							this._appendCellAt(e, a, d + 1)
						}
					} else {
						e.parentNode.removeChild(e)
					}
				}
				b.parentNode.removeChild(b);
				c = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
					oneTimeOffCache : true
				});
				if (c.length < 1) {
					this.elSelectionStartTable.parentNode
							.removeChild(this.elSelectionStartTable)
				} else {
					this.htMap = this
							._getCellMapping(this.elSelectionStartTable)
				}
			},
			_appendCellAt : function(e, a, g) {
				var d = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
					oneTimeOffCache : true
				});
				var b = d[g];
				var f = null;
				for ( var c = this.htMap.length - 1; c >= a; c--) {
					if (this.htMap[c][g].parentNode == b) {
						f = this.htMap[c][g]
					}
				}
				b.insertBefore(e, f)
			},
			_deleteSelectedCells : function() {
				var f;
				for ( var b = 0, e = this.aSelectedCells.length; b < e; b++) {
					f = this.aSelectedCells[b];
					f.parentNode.removeChild(f)
				}
				var d = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
					oneTimeOffCache : true
				});
				var c = this.htSelectionEPos.x - this.htSelectionSPos.x + 1;
				var a = this.htMap.length;
				if (c == a) {
					for ( var b = 0, e = d.length; b < e; b++) {
						f = d[b];
						if (!this.htMap[0][b] || !this.htMap[0][b].parentNode
								|| this.htMap[0][b].parentNode.tagName !== "TR") {
							f.parentNode.removeChild(f)
						}
					}
					d = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
						oneTimeOffCache : true
					})
				}
				if (d.length < 1) {
					this.elSelectionStartTable.parentNode
							.removeChild(this.elSelectionStartTable)
				}
				this._updateSelection()
			},
			_insertColumnAfter : function() {
				this._removeClassFromSelection();
				this._hideTableTemplate(this.elSelectionStartTable);
				var d = jindo.$$(">TBODY>TR", this.elSelectionStartTable, {
					oneTimeOffCache : true
				});
				var p;
				var g = "_tmp_inserted";
				var o, b, j, f;
				for ( var k = 0, n = this.htMap[0].length; k < n; k++) {
					j = d[k];
					for ( var l = this.htSelectionEPos.x; l >= this.htSelectionSPos.x; l--) {
						o = this.htMap[l][k];
						b = this._shallowCloneTD(o);
						var h = parseInt(o.getAttribute("rowSpan"));
						if (h > 1) {
							b.setAttribute("rowSpan", 1);
							b.style.height = ""
						}
						h = parseInt(o.getAttribute("colSpan"));
						if (h > 1) {
							b.setAttribute("colSpan", 1);
							b.style.width = ""
						}
						f = null;
						for ( var a = this.htSelectionEPos.x; a >= this.htSelectionSPos.x; a--) {
							if (this.htMap[a][k].parentNode == j) {
								f = this.htMap[a][k].nextSibling;
								break
							}
						}
						j.insertBefore(b, f)
					}
				}
				for ( var e = 0, q = this.aSelectedCells.length; e < q; e++) {
					this.aSelectedCells[e].removeAttribute(g)
				}
				var m = this.htSelectionEPos.x - this.htSelectionSPos.x + 1;
				var c = this.htSelectionEPos.y - this.htSelectionSPos.y + 1;
				this.htSelectionSPos.x += m;
				this.htSelectionEPos.x += m;
				this.htMap = this._getCellMapping(this.elSelectionStartTable);
				this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
				this._showTableTemplate(this.elSelectionStartTable);
				this._addClassToSelection();
				this.sQEAction = "INSERT_TABLE_COLUMN";
				this.oApp.exec("SHOW_COMMON_QE")
			},
			_insertRowBelow : function() {
				this._selectAll_Row();
				this._removeClassFromSelection();
				this._hideTableTemplate(this.elSelectionStartTable);
				var b;
				var g = this.htMap[0][0].parentNode.parentNode;
				var c = jindo.$$(">TR", g, {
					oneTimeOffCache : true
				});
				var e = c[this.htSelectionEPos.y + 1] || null;
				for ( var f = this.htSelectionSPos.y; f <= this.htSelectionEPos.y; f++) {
					b = this._getTRCloneWithAllTD(f);
					g.insertBefore(b, e)
				}
				var d = this.htSelectionEPos.x - this.htSelectionSPos.x + 1;
				var a = this.htSelectionEPos.y - this.htSelectionSPos.y + 1;
				this.htSelectionSPos.y += a;
				this.htSelectionEPos.y += a;
				this.htMap = this._getCellMapping(this.elSelectionStartTable);
				this._selectCells(this.htSelectionSPos, this.htSelectionEPos);
				this._showTableTemplate(this.elSelectionStartTable);
				this._addClassToSelection();
				this.sQEAction = "INSERT_TABLE_ROW";
				this.oApp.exec("SHOW_COMMON_QE")
			},
			_updateSelection : function() {
				this.aSelectedCells = jindo
						.$A(this.aSelectedCells)
						.filter(
								function(a) {
									return (a.parentNode !== null && a.parentNode.parentNode !== null)
								}).$value()
			},
			_startCellSelection : function() {
				this.htMap = this._getCellMapping(this.elSelectionStartTable);
				this.oApp.getEmptySelection().oBrowserSelection.selectNone();
				if (this.oApp.oNavigator.safari || this.oApp.oNavigator.chrome) {
					this.oApp.getWYSIWYGDocument().onselectstart = function() {
						return false
					}
				}
				var a = this.oApp.getWYSIWYGWindow().frameElement;
				this.htEditingAreaPos = jindo.$Element(a).offset();
				this.htEditingAreaPos.height = a.offsetHeight;
				this.htEditingAreaPos.bottom = this.htEditingAreaPos.top
						+ this.htEditingAreaPos.height;
				this.htEditingAreaPos.width = a.offsetWidth;
				this.htEditingAreaPos.right = this.htEditingAreaPos.left
						+ this.htEditingAreaPos.width;
				this._changeTableEditorStatus(this.STATUS.CELL_SELECTING)
			},
			_selectBetweenCells : function(b, a) {
				this._deselectCells();
				var f = this._getBasisCellPosition(b);
				var e = this._getBasisCellPosition(a);
				this._setEndPos(f);
				this._setEndPos(e);
				var d = {}, c = {};
				d.x = Math.min(f.x, f.ex, e.x, e.ex);
				d.y = Math.min(f.y, f.ey, e.y, e.ey);
				c.x = Math.max(f.x, f.ex, e.x, e.ex);
				c.y = Math.max(f.y, f.ey, e.y, e.ey);
				this._selectCells(d, c)
			},
			_getNextCell : function(a) {
				while (a) {
					a = a.nextSibling;
					if (a && a.tagName && a.tagName.match(/^TD|TH$/)) {
						return a
					}
				}
				return null
			},
			_getCellMapping : function(t) {
				var m = jindo.$$(">TBODY>TR", t, {
					oneTimeOffCache : true
				});
				var v = 0;
				var n = m[0].childNodes;
				for ( var s = 0; s < n.length; s++) {
					var o = n[s];
					if (!o.tagName || !o.tagName.match(/^TD|TH$/)) {
						continue
					}
					if (o.getAttribute("colSpan")) {
						v += this.parseIntOr0(o.getAttribute("colSpan"))
					} else {
						v++
					}
				}
				var l = v;
				var k = m.length;
				var q = new Array(l);
				for ( var j = 0; j < l; j++) {
					q[j] = new Array(k)
				}
				for ( var h = 0; h < k; h++) {
					var e = m[h].childNodes[0];
					if (!e) {
						continue
					}
					if (!e.tagName || !e.tagName.match(/^TD|TH$/)) {
						e = this._getNextCell(e)
					}
					var j = -1;
					while (e) {
						j++;
						if (!q[j]) {
							q[j] = []
						}
						if (q[j][h]) {
							continue
						}
						var g = parseInt(e.getAttribute("colSpan"), 10) || 1;
						var c = parseInt(e.getAttribute("rowSpan"), 10) || 1;
						for ( var p = 0; p < c; p++) {
							for ( var f = 0; f < g; f++) {
								if (!q[j + f]) {
									q[j + f] = []
								}
								q[j + f][h + p] = e
							}
						}
						e = this._getNextCell(e)
					}
				}
				var b = false;
				var u = null;
				for ( var h = 0, r = 0, d = q[0].length; h < d; h++, r++) {
					u = null;
					if (!m[h].innerHTML.match(/TD|TH/i)) {
						for ( var j = 0, a = q.length; j < a; j++) {
							e = q[j][h];
							if (e === u) {
								continue
							}
							u = e;
							var c = parseInt(e.getAttribute("rowSpan"), 10) || 1;
							if (c > 1) {
								e.setAttribute("rowSpan", c - 1)
							}
						}
						m[h].parentNode.removeChild(m[h]);
						if (this.htSelectionEPos.y >= r) {
							r--;
							this.htSelectionEPos.y--
						}
						b = true
					}
				}
				if (b) {
					return this._getCellMapping(t)
				}
				return q
			},
			_selectCells : function(b, a) {
				this.aSelectedCells = this._getSelectedCells(b, a);
				this._addClassToSelection()
			},
			_deselectCells : function() {
				this._removeClassFromSelection();
				this.aSelectedCells = [];
				this.htSelectionSPos = {
					x : -1,
					y : -1
				};
				this.htSelectionEPos = {
					x : -1,
					y : -1
				}
			},
			_addClassToSelection : function() {
				var a, c;
				for ( var b = 0; b < this.aSelectedCells.length; b++) {
					c = this.aSelectedCells[b];
					a = jindo.$Element(c);
					a.addClass(this.CELL_SELECTION_CLASS);
					if (c.style.backgroundColor) {
						c.setAttribute(this.TMP_BGC_ATTR,
								c.style.backgroundColor);
						a.css("backgroundColor", "")
					}
					if (c.style.backgroundImage) {
						c.setAttribute(this.TMP_BGIMG_ATTR,
								c.style.backgroundImage);
						a.css("backgroundImage", "")
					}
				}
			},
			_removeClassFromSelection : function() {
				var a, c;
				for ( var b = 0; b < this.aSelectedCells.length; b++) {
					c = this.aSelectedCells[b];
					a = jindo.$Element(c);
					a.removeClass(this.CELL_SELECTION_CLASS);
					if (c.getAttribute(this.TMP_BGC_ATTR)) {
						c.style.backgroundColor = c
								.getAttribute(this.TMP_BGC_ATTR);
						c.removeAttribute(this.TMP_BGC_ATTR)
					}
					if (c.getAttribute(this.TMP_BGIMG_ATTR)) {
						a.css("backgroundImage", c
								.getAttribute(this.TMP_BGIMG_ATTR));
						c.removeAttribute(this.TMP_BGIMG_ATTR)
					}
				}
			},
			_expandAndSelect : function(e, c) {
				var b, g, d, a, f;
				if (e.y > 0) {
					for (b = e.x; b <= c.x; b++) {
						d = this.htMap[b][e.y];
						if (this.htMap[b][e.y - 1] == d) {
							a = e.y - 2;
							while (a >= 0 && this.htMap[b][a] == d) {
								a--
							}
							e.y = a + 1;
							this._expandAndSelect(e, c);
							return
						}
					}
				}
				if (e.x > 0) {
					for (g = e.y; g <= c.y; g++) {
						d = this.htMap[e.x][g];
						if (this.htMap[e.x - 1][g] == d) {
							a = e.x - 2;
							while (a >= 0 && this.htMap[a][g] == d) {
								a--
							}
							e.x = a + 1;
							this._expandAndSelect(e, c);
							return
						}
					}
				}
				if (c.y < this.htMap[0].length - 1) {
					for (b = e.x; b <= c.x; b++) {
						d = this.htMap[b][c.y];
						if (this.htMap[b][c.y + 1] == d) {
							a = c.y + 2;
							while (a < this.htMap[0].length
									&& this.htMap[b][a] == d) {
								a++
							}
							c.y = a - 1;
							this._expandAndSelect(e, c);
							return
						}
					}
				}
				if (c.x < this.htMap.length - 1) {
					for (g = e.y; g <= c.y; g++) {
						d = this.htMap[c.x][g];
						if (this.htMap[c.x + 1][g] == d) {
							a = c.x + 2;
							while (a < this.htMap.length
									&& this.htMap[a][g] == d) {
								a++
							}
							c.x = a - 1;
							this._expandAndSelect(e, c);
							return
						}
					}
				}
			},
			_getSelectedCells : function(j, h) {
				this._expandAndSelect(j, h);
				var b = j.x;
				var f = j.y;
				var a = h.x;
				var d = h.y;
				this.htSelectionSPos = j;
				this.htSelectionEPos = h;
				var g = [];
				for ( var c = f; c <= d; c++) {
					for ( var e = b; e <= a; e++) {
						if (jindo.$A(g).has(this.htMap[e][c])) {
							continue
						}
						g[g.length] = this.htMap[e][c]
					}
				}
				return g
			},
			_setEndPos : function(a) {
				var c, b;
				c = parseInt(a.elCell.getAttribute("colSpan"), 10) || 1;
				b = parseInt(a.elCell.getAttribute("rowSpan"), 10) || 1;
				a.ex = a.x + c - 1;
				a.ey = a.y + b - 1
			},
			_getBasisCellPosition : function(b) {
				var a = 0, c = 0;
				for (a = 0; a < this.htMap.length; a++) {
					for (c = 0; c < this.htMap[a].length; c++) {
						if (this.htMap[a][c] == b) {
							return {
								x : a,
								y : c,
								elCell : b
							}
						}
					}
				}
				return {
					x : 0,
					y : 0,
					elCell : b
				}
			},
			_applyTableTemplate : function(b, a) {
				if (!b) {
					return
				}
				this._clearAllTableStyles(b);
				this._doApplyTableTemplate(b, nhn.husky.SE2M_TableTemplate[a],
						false);
				b.setAttribute(this.ATTR_TBL_TEMPLATE, a)
			},
			_clearAllTableStyles : function(b) {
				b.removeAttribute("border");
				b.removeAttribute("cellPadding");
				b.removeAttribute("cellSpacing");
				b.style.padding = "";
				b.style.border = "";
				b.style.backgroundColor = "";
				b.style.color = "";
				var d = jindo.$$(">TBODY>TR>TD", b, {
					oneTimeOffCache : true
				});
				for ( var a = 0, c = d.length; a < c; a++) {
					d[a].style.padding = "";
					d[a].style.border = "";
					d[a].style.backgroundColor = "";
					d[a].style.color = ""
				}
			},
			_hideTableTemplate : function(a) {
				if (a.getAttribute(this.ATTR_TBL_TEMPLATE)) {
					this._doApplyTableTemplate(a,
							nhn.husky.SE2M_TableTemplate[this.parseIntOr0(a
									.getAttribute(this.ATTR_TBL_TEMPLATE))],
							true)
				}
			},
			_showTableTemplate : function(a) {
				if (a.getAttribute(this.ATTR_TBL_TEMPLATE)) {
					this._doApplyTableTemplate(a,
							nhn.husky.SE2M_TableTemplate[this.parseIntOr0(a
									.getAttribute(this.ATTR_TBL_TEMPLATE))],
							false)
				}
			},
			_doApplyTableTemplate : function(s, a, j) {
				var f = a.htTableProperty;
				var g = a.htTableStyle;
				var o = a.ht1stRowStyle;
				var k = a.ht1stColumnStyle;
				var b = a.aRowStyle;
				var n;
				if (f) {
					this._copyAttributesTo(s, f, j)
				}
				if (g) {
					this._copyStylesTo(s, g, j)
				}
				var m = jindo.$$(">TBODY>TR", s, {
					oneTimeOffCache : true
				});
				var e = 0;
				if (o) {
					var e = 1;
					for ( var l = 0, p = m[0].childNodes.length; l < p; l++) {
						n = m[0].childNodes[l];
						if (!n.tagName || !n.tagName.match(/^TD|TH$/)) {
							continue
						}
						this._copyStylesTo(n, o, j)
					}
				}
				var d;
				var c;
				if (k) {
					var t = o ? 1 : 0;
					for ( var r = t, h = m.length; r < h;) {
						c = m[r].firstChild;
						d = 1;
						if (c && c.tagName.match(/^TD|TH$/)) {
							d = parseInt(c.getAttribute("rowSpan"), 10) || 1;
							this._copyStylesTo(c, k, j)
						}
						r += d
					}
				}
				if (b) {
					var q = b.length;
					for ( var r = e, h = m.length; r < h; r++) {
						for ( var l = 0, p = m[r].childNodes.length; l < p; l++) {
							var n = m[r].childNodes[l];
							if (!n.tagName || !n.tagName.match(/^TD|TH$/)) {
								continue
							}
							this._copyStylesTo(n, b[(r + e) % q], j)
						}
					}
				}
			},
			_copyAttributesTo : function(d, b, c) {
				var e;
				for ( var a in b) {
					if (b.hasOwnProperty(a)) {
						if (c) {
							if (d[a]) {
								e = document.createElement(d.tagName);
								e[a] = b[a];
								if (e[a] == d[a]) {
									d.removeAttribute(a)
								}
							}
						} else {
							e = document.createElement(d.tagName);
							e.style[a] = "";
							if (!d[a] || d.style[a] == e.style[a]) {
								d.setAttribute(a, b[a])
							}
						}
					}
				}
			},
			_copyStylesTo : function(d, b, c) {
				var e;
				for ( var a in b) {
					if (b.hasOwnProperty(a)) {
						if (c) {
							if (d.style[a]) {
								e = document.createElement(d.tagName);
								e.style[a] = b[a];
								if (e.style[a] == d.style[a]) {
									d.style[a] = ""
								}
							}
						} else {
							e = document.createElement(d.tagName);
							e.style[a] = "";
							if (!d.style[a] || d.style[a] == e.style[a]
									|| a.match(/^border/)) {
								d.style[a] = b[a]
							}
						}
					}
				}
			},
			_hideResizer : function() {
				this.elResizeGrid.style.display = "none"
			},
			_showResizer : function() {
				this.elResizeGrid.style.display = "block"
			},
			_setResizerSize : function(b, a) {
				this.elResizeGrid.style.width = b + "px";
				this.elResizeGrid.style.height = a + "px"
			},
			parseBorder : function(b, c) {
				if (c == "none") {
					return 0
				}
				var a = parseInt(b, 10);
				if (isNaN(a)) {
					if (typeof (b) == "string") {
						return 1
					}
				}
				return a
			},
			parseIntOr0 : function(a) {
				a = parseInt(a, 10);
				if (isNaN(a)) {
					return 0
				}
				return a
			},
			_shallowCloneTR : function(f) {
				var a = f.cloneNode(false);
				var d, b;
				for ( var c = 0, e = f.childNodes.length; c < e; c++) {
					d = f.childNodes[c];
					if (d.tagName == "TD") {
						b = this._shallowCloneTD(d);
						a.insertBefore(b, null)
					}
				}
				return a
			},
			_getTRCloneWithAllTD : function(d) {
				var a = this.htMap[0][d].parentNode.cloneNode(false);
				var e, b;
				for ( var c = 0, f = this.htMap.length; c < f; c++) {
					e = this.htMap[c][d];
					if (e.tagName == "TD") {
						b = this._shallowCloneTD(e);
						b.setAttribute("rowSpan", 1);
						b.setAttribute("colSpan", 1);
						b.style.width = "";
						b.style.height = "";
						a.insertBefore(b, null)
					}
				}
				return a
			},
			_shallowCloneTD : function(b) {
				var a = b.cloneNode(false);
				a.innerHTML = this.sEmptyTDSrc;
				return a
			},
			_isValidTable : function(a) {
				if (!a || !a.tagName || a.tagName != "TABLE") {
					return false
				}
				this.htMap = this._getCellMapping(a);
				var c = this.htMap.length;
				if (c < 1) {
					return false
				}
				var e = this.htMap[0].length;
				if (e < 1) {
					return false
				}
				for ( var d = 1; d < c; d++) {
					if (this.htMap[d].length != e || !this.htMap[d][e - 1]) {
						return false
					}
					for ( var b = 0; b < e; b++) {
						if (!this.htMap[d] || !this.htMap[d][b]) {
							return false
						}
					}
				}
				return true
			},
			addCSSClass : function(c, e) {
				var b = this.oApp.getWYSIWYGDocument();
				if (b.styleSheets[0] && b.styleSheets[0].addRule) {
					b.styleSheets[0].addRule("." + c, e)
				} else {
					var a = b.getElementsByTagName("HEAD")[0];
					var d = b.createElement("STYLE");
					a.appendChild(d);
					d.sheet.insertRule("." + c + " { " + e + " }", 0)
				}
			}
		});
nhn.husky.SE2M_QuickEditor_Common = jindo
		.$Class({
			name : "SE2M_QuickEditor_Common",
			_environmentData : "",
			_currentType : "",
			_in_event : false,
			_bUseConfig : true,
			_sBaseAjaxUrl : "",
			_sAddTextAjaxUrl : "",
			$init : function() {
				this.waHotkeys = new jindo.$A();
				this.waHotkeyLayers = new jindo.$A()
			},
			$ON_MSG_APP_READY : function() {
				var a = nhn.husky.SE2M_Configuration.QuickEditor;
				if (a) {
					this._bUseConfig = (!!a.common && typeof a.common.bUseConfig !== "undefined") ? a.common.bUseConfig
							: true
				}
				if (!this._bUseConfig) {
					this.setData("{table:'full',img:'full',review:'full'}")
				} else {
					this._sBaseAjaxUrl = a.common.sBaseAjaxUrl;
					this._sAddTextAjaxUrl = a.common.sAddTextAjaxUrl;
					this.getData()
				}
			},
			$ON_EVENT_EDITING_AREA_KEYDOWN : function(a) {
				var b = a.key();
				if (b.keyCode == 8 || b.keyCode == 46) {
					this.oApp.exec("CLOSE_QE_LAYER", [ a ])
				}
			},
			getData : function() {
				var a = this;
				jindo
						.$Ajax(
								a._sBaseAjaxUrl,
								{
									type : "jsonp",
									timeout : 1,
									onload : function(c) {
										var b = c.json().result;
										if (!!b && !!b.length) {
											a.setData(b[b.length - 1])
										} else {
											a
													.setData("{table:'full',img:'full',review:'full'}")
										}
									},
									onerror : function() {
										a
												.setData("{table:'full',img:'full',review:'full'}")
									},
									ontimeout : function() {
										a
												.setData("{table:'full',img:'full',review:'full'}")
									}
								}).request({
							text_key : "qeditor_fold"
						})
			},
			setData : function(sResult) {
				var oResult = {
					table : "full",
					img : "full",
					review : "full"
				};
				if (sResult) {
					oResult = eval("(" + sResult + ")")
				}
				this._environmentData = {
					table : {
						isOpen : false,
						type : oResult.table,
						isFixed : false,
						position : []
					},
					img : {
						isOpen : false,
						type : oResult.img,
						isFixed : false
					},
					review : {
						isOpen : false,
						type : oResult.review,
						isFixed : false,
						position : []
					}
				};
				this.waTableTagNames = jindo.$A([ "table", "tbody", "td",
						"tfoot", "th", "thead", "tr" ])
			},
			$ON_REGISTER_HOTKEY : function(b, a, c) {
				if (b != "tab" && b != "shift+tab") {
					this.waHotkeys.push([ b, a, c ])
				}
			},
			$ON_MSG_BEFOREUNLOAD_FIRED : function() {
				if (!this._environmentData || !this._bUseConfig) {
					return
				}
				jindo.$Ajax(this._sAddTextAjaxUrl, {
					type : "jsonp",
					onload : function() {
					}
				}).request(
						{
							text_key : "qeditor_fold",
							text_data : "{table:'"
									+ this._environmentData.table["type"]
									+ "',img:'"
									+ this._environmentData.img["type"]
									+ "',review:'"
									+ this._environmentData.review["type"]
									+ "'}"
						})
			},
			setOpenType : function(b, a) {
				this._environmentData[b].isOpen = a
			},
			$ON_OPEN_QE_LAYER : function(b, a, g) {
				if (this.waHotkeys.length() > 0 && !this.waHotkeyLayers.has(a)) {
					this.waHotkeyLayers.push(a);
					var f;
					for ( var c = 0, e = this.waHotkeys.length(); c < e; c++) {
						f = this.waHotkeys.get(c);
						this.oApp.exec("ADD_HOTKEY", [ f[0], f[1], f[2], a ])
					}
				}
				var d = g;
				if (d) {
					this.targetEle = b;
					this.currentEle = a;
					this.layer_show(d, b)
				}
			},
			$ON_CLOSE_QE_LAYER : function(a) {
				if (!this.currentEle) {
					return
				}
				this.oApp.exec("CLOSE_SUB_LAYER_QE");
				this.layer_hide(a)
			},
			$LOCAL_BEFORE_FIRST : function(b) {
				if (!b.match(/OPEN_QE_LAYER/)) {
					this.oApp.acceptLocalBeforeFirstAgain(this, true);
					if (b.match(/REGISTER_HOTKEY/)) {
						return true
					}
					return false
				}
				this.woEditor = jindo
						.$Element(this.oApp.elEditingAreaContainer);
				this.woStandard = jindo.$Element(
						this.oApp.htOptions.elAppContainer).offset();
				this._qe_wrap = jindo.$$.getSingle("DIV.quick_wrap",
						this.oApp.htOptions.elAppContainer);
				var c = this;
				new jindo.DragArea(this._qe_wrap, {
					sClassName : "q_dragable",
					bFlowOut : false,
					nThreshold : 1
				}).attach({
					beforeDrag : function(e) {
						e.elFlowOut = e.elArea.parentNode
					},
					dragStart : function(e) {
						if (!jindo.$Element(e.elDrag).hasClass("se2_qmax")) {
							e.elDrag = e.elDrag.parentNode
						}
						c.oApp.exec("SHOW_EDITING_AREA_COVER")
					},
					dragEnd : function(e) {
						c.changeFixedMode();
						c._in_event = false;
						var f = jindo.$Element(e.elDrag);
						c._environmentData[c._currentType].position = [
								f.css("top"), f.css("left") ];
						c.oApp.exec("HIDE_EDITING_AREA_COVER")
					}
				});
				var d = jindo.$Fn(this.toggle, this).bind("img");
				var a = jindo.$Fn(this.toggle, this).bind("table");
				jindo.$Fn(d, this).attach(
						jindo.$$.getSingle(".q_open_img_fold",
								this.oApp.htOptions.elAppContainer), "click");
				jindo.$Fn(d, this).attach(
						jindo.$$.getSingle(".q_open_img_full",
								this.oApp.htOptions.elAppContainer), "click");
				jindo.$Fn(a, this).attach(
						jindo.$$.getSingle(".q_open_table_fold",
								this.oApp.htOptions.elAppContainer), "click");
				jindo.$Fn(a, this).attach(
						jindo.$$.getSingle(".q_open_table_full",
								this.oApp.htOptions.elAppContainer), "click")
			},
			toggle : function(b, a) {
				b = this._currentType;
				this.oApp.exec("CLOSE_QE_LAYER", [ a ]);
				if (this._environmentData[b].type == "full") {
					this._environmentData[b].type = "fold"
				} else {
					this._environmentData[b].type = "full"
				}
				this.oApp.exec("OPEN_QE_LAYER", [ this.targetEle,
						this.currentEle, b ]);
				this._in_event = false;
				a.stop(jindo.$Event.CANCEL_DEFAULT)
			},
			positionCopy : function(b, a, c) {
				jindo.$Element(jindo.$$.getSingle("._" + c, this.currentEle))
						.css({
							top : a,
							left : b
						})
			},
			changeFixedMode : function() {
				this._environmentData[this._currentType].isFixed = true
			},
			$ON_HIDE_ACTIVE_LAYER : function() {
				this.oApp.exec("CLOSE_QE_LAYER")
			},
			$ON_EVENT_EDITING_AREA_MOUSEDOWN : function(a) {
				if (this._currentType && (!this._in_event)
						&& this._environmentData[this._currentType].isOpen) {
					this.oApp.exec("CLOSE_QE_LAYER", [ a ])
				}
				this._in_event = false
			},
			$ON_EVENT_EDITING_AREA_MOUSEWHEEL : function(a) {
				if (this._currentType && (!this._in_event)
						&& this._environmentData[this._currentType].isOpen) {
					this.oApp.exec("CLOSE_QE_LAYER", [ a ])
				}
				this._in_event = false
			},
			get_type : function(a) {
				var b = a.tagName.toLowerCase();
				if (this.waTableTagNames.has(b)) {
					return "table"
				} else {
					if (b == "img") {
						return "img"
					}
				}
			},
			$ON_QE_IN_KEYUP : function() {
				this._in_event = true
			},
			$ON_QE_IN_MOUSEDOWN : function() {
				this._in_event = true
			},
			$ON_QE_IN_MOUSEWHEEL : function() {
				this._in_event = true
			},
			layer_hide : function(a) {
				this.setOpenType(this._currentType, false);
				jindo
						.$Element(
								jindo.$$
										.getSingle(
												"._"
														+ this._environmentData[this._currentType].type,
												this.currentEle)).hide()
			},
			lazy_common : function() {
				this.oApp.registerBrowserEvent(jindo.$(this._qe_wrap), "keyup",
						"QE_IN_KEYUP");
				this.oApp.registerBrowserEvent(jindo.$(this._qe_wrap),
						"mousedown", "QE_IN_MOUSEDOWN");
				this.oApp.registerBrowserEvent(jindo.$(this._qe_wrap),
						"mousewheel", "QE_IN_MOUSEWHEEL");
				this.lazy_common = function() {
				}
			},
			layer_show : function(c, a) {
				this._currentType = c;
				this.setOpenType(this._currentType, true);
				var b = jindo.$$.getSingle("._"
						+ this._environmentData[this._currentType].type,
						this.currentEle);
				jindo.$Element(b).show().css(this.get_position_layer(a, b));
				this.lazy_common()
			},
			get_position_layer : function(c, b) {
				if (!this.isCurrentFixed()
						|| this._environmentData[this._currentType].type == "fold") {
					return this.calculateLayer(c, b)
				}
				var a = this._environmentData[this._currentType].position;
				var d = parseInt(a[0], 10);
				var f = this.getAppPosition().h;
				var e = jindo.$Element(b).height();
				if ((d + e + this.nYGap) > f) {
					d = f - e;
					this._environmentData[this._currentType].position[0] = d
				}
				return {
					top : d + "px",
					left : a[1]
				}
			},
			isCurrentFixed : function() {
				return this._environmentData[this._currentType].isFixed
			},
			calculateLayer : function(b, a) {
				var c = this.getPositionInfo(b, a);
				return {
					top : c.y + "px",
					left : c.x + "px"
				}
			},
			getPositionInfo : function(b, a) {
				this.nYGap = jindo.$Agent().navigator().ie ? -16 : -18;
				this.nXGap = 1;
				var c = {};
				var f = this.getElementPosition(b, a);
				var d = this.getAppPosition();
				var e = {
					w : jindo.$Element(a).width(),
					h : jindo.$Element(a).height()
				};
				if ((f.x + e.w + this.nXGap) > d.w) {
					c.x = d.w - e.w
				} else {
					c.x = f.x + this.nXGap
				}
				if ((f.y + e.h + this.nYGap) > d.h) {
					c.y = d.h - e.h - 2
				} else {
					c.y = f.y + this.nYGap
				}
				return {
					x : c.x,
					y : c.y
				}
			},
			getElementPosition : function(e, b) {
				var k, d, g, c, h, f;
				if (e) {
					k = jindo.$Element(e);
					d = k.offset();
					g = k.width();
					c = k.height()
				} else {
					d = {
						top : parseInt(b.style.top, 10) - this.nYGap,
						left : parseInt(b.style.left, 10) - this.nXGap
					};
					g = 0;
					c = 0
				}
				var a = this.oApp.getWYSIWYGWindow();
				if (typeof a.scrollX == "undefined") {
					h = a.document.documentElement.scrollLeft;
					f = a.document.documentElement.scrollTop
				} else {
					h = a.scrollX;
					f = a.scrollY
				}
				var j = this.woEditor.offset();
				return {
					x : d.left - h + g,
					y : d.top - f + c
				}
			},
			getAppPosition : function() {
				return {
					w : this.woEditor.width(),
					h : this.woEditor.height()
				}
			}
		});
nhn.husky.Hotkey = jindo.$Class({
	name : "Hotkey",
	$init : function() {
		this.oShortcut = shortcut
	},
	$ON_ADD_HOTKEY : function(b, a, e, d) {
		if (!e) {
			e = []
		}
		var c = jindo.$Fn(this.oApp.exec, this.oApp).bind(a, e);
		this.oShortcut(b, d).addEvent(c)
	}
});
function Shortcut(e, c) {
	var e = e.replace(/\s+/g, "");
	var b = Shortcut.Store;
	var d = Shortcut.Action;
	if (typeof c === "undefined" && e.constructor == String) {
		b.set("document", e, document);
		return d.init(b.get("document"), e)
	} else {
		if (c.constructor == String && e.constructor == String) {
			b.set(c, e, jindo.$(c));
			return d.init(b.get(c), e)
		} else {
			if (c.constructor != String && e.constructor == String) {
				var a = "nonID" + new Date().getTime();
				a = Shortcut.Store.searchId(a, c);
				b.set(a, e, c);
				return d.init(b.get(a), e)
			}
		}
	}
	alert(c + "는 반드시 string이거나  없어야 됩니다.")
}
Shortcut.Store = {
	anthorKeyHash : {},
	datas : {},
	currentId : "",
	currentKey : "",
	searchId : function(a, b) {
		jindo.$H(this.datas).forEach(function(c, d) {
			if (b == c.element) {
				a = d;
				jindo.$H.Break()
			}
		});
		return a
	},
	set : function(a, d, b) {
		this.currentId = a;
		this.currentKey = d;
		var c = this.get(a);
		this.datas[a] = c ? c.createKey(d) : new Shortcut.Data(a, d, b)
	},
	get : function(a, b) {
		if (b) {
			return this.datas[a].keys[b]
		} else {
			return this.datas[a]
		}
	},
	reset : function(a) {
		var b = this.datas[a];
		Shortcut.Helper.bind(b.func, b.element, "detach");
		delete this.datas[a]
	},
	allReset : function() {
		jindo.$H(this.datas).forEach(jindo.$Fn(function(b, a) {
			this.reset(a)
		}, this).bind())
	}
};
Shortcut.Data = jindo.$Class({
	$init : function(a, c, b) {
		this.id = a;
		this.element = b;
		this.func = jindo.$Fn(this.fire, this).bind();
		Shortcut.Helper.bind(this.func, b, "attach");
		this.keys = {};
		this.keyStemp = {};
		this.createKey(c)
	},
	createKey : function(b) {
		this.keyStemp[Shortcut.Helper.keyInterpretor(b)] = b;
		this.keys[b] = {};
		var a = this.keys[b];
		a.key = b;
		a.events = [];
		a.commonExceptions = [];
		a.stopDefalutBehavior = true;
		return this
	},
	getKeyStamp : function(a) {
		var c = a.keyCode || a.charCode;
		var b = "";
		b += a.altKey ? "1" : "0";
		b += a.ctrlKey ? "1" : "0";
		b += a.metaKey ? "1" : "0";
		b += a.shiftKey ? "1" : "0";
		b += c;
		return b
	},
	fire : function(a) {
		a = a || window.eEvent;
		var b = this.keyStemp[this.getKeyStamp(a)];
		if (b) {
			this.excute(new jindo.$Event(a), b)
		}
	},
	excute : function(e, d) {
		var a = true;
		var b = Shortcut.Helper;
		var c = this.keys[d];
		if (b.notCommonException(e, c.commonExceptions)) {
			jindo.$A(c.events).forEach(function(f) {
				if (c.stopDefalutBehavior) {
					var h = f.exceptions.length;
					if (h) {
						for ( var g = 0; g < h; g++) {
							if (!f.exception[g](e)) {
								a = false;
								break
							}
						}
						if (a) {
							f.event(e);
							if (jindo.$Agent().navigator().ie) {
								var j = e._event;
								j.keyCode = "";
								j.charCode = ""
							}
							e.stop()
						} else {
							jindo.$A.Break()
						}
					} else {
						f.event(e);
						if (jindo.$Agent().navigator().ie) {
							var j = e._event;
							j.keyCode = "";
							j.charCode = ""
						}
						e.stop()
					}
				}
			})
		}
	},
	addEvent : function(a, c) {
		var b = this.keys[c].events;
		if (!Shortcut.Helper.hasEvent(a, b)) {
			b.push({
				event : a,
				exceptions : []
			})
		}
	},
	addException : function(c, b) {
		var a = this.keys[b].commonExceptions;
		if (!Shortcut.Helper.hasException(c, a)) {
			a.push(c)
		}
	},
	removeException : function(c, b) {
		var a = this.keys[b].commonExceptions;
		a = jindo.$A(a).filter(function(d) {
			return d != c
		}).$value()
	},
	removeEvent : function(a, c) {
		var b = this.keys[c].events;
		b = jindo.$A(b).filter(function(d) {
			return d != a
		}).$value();
		this.unRegister(c)
	},
	unRegister : function(d) {
		var a = this.keys[d].events;
		if (a.length) {
			delete this.keys[d]
		}
		var c = true;
		for ( var b in this.keys) {
			c = false;
			break
		}
		if (c) {
			Shortcut.Helper.bind(this.func, this.element, "detach");
			delete Shortcut.Store.datas[this.id]
		}
	},
	startDefalutBehavior : function(a) {
		this._setDefalutBehavior(a, false)
	},
	stopDefalutBehavior : function(a) {
		this._setDefalutBehavior(a, true)
	},
	_setDefalutBehavior : function(b, a) {
		this.keys[b].stopDefalutBehavior = a
	}
});
Shortcut.Helper = {
	keyInterpretor : function(d) {
		var a = d.split("+");
		var e = jindo.$A(a);
		var c = "";
		c += e.has("alt") ? "1" : "0";
		c += e.has("ctrl") ? "1" : "0";
		c += e.has("meta") ? "1" : "0";
		c += e.has("shift") ? "1" : "0";
		var e = e.filter(function(f) {
			return !(f == "alt" || f == "ctrl" || f == "meta" || f == "shift")
		});
		var b = e.$value()[0];
		if (b) {
			var d = Shortcut.Store.anthorKeyHash[b.toUpperCase()]
					|| b.toUpperCase().charCodeAt(0);
			c += d
		}
		return c
	},
	notCommonException : function(d, c) {
		var b = c.length;
		for ( var a = 0; a < b; a++) {
			if (!c[a](d)) {
				return false
			}
		}
		return true
	},
	hasEvent : function(b, a) {
		var d = a.length;
		for ( var c = 0; c < d; ++c) {
			if (a.event == b) {
				return true
			}
		}
		return false
	},
	hasException : function(d, a) {
		var c = a.length;
		for ( var b = 0; b < c; ++b) {
			if (a[b] == d) {
				return true
			}
		}
		return false
	},
	bind : function(a, b, c) {
		if (c == "attach") {
			domAttach(b, "keydown", a)
		} else {
			domDetach(b, "keydown", a)
		}
	}
};
(function domAttach() {
	if (document.addEventListener) {
		window.domAttach = function(c, b, a) {
			c.addEventListener(b, a, false)
		}
	} else {
		window.domAttach = function(c, b, a) {
			c.attachEvent("on" + b, a)
		}
	}
})();
(function domDetach() {
	if (document.removeEventListener) {
		window.domDetach = function(c, b, a) {
			c.removeEventListener(b, a, false)
		}
	} else {
		window.domDetach = function(c, b, a) {
			c.detachEvent("on" + b, a)
		}
	}
})();
Shortcut.Action = {
	init : function(b, a) {
		this.dataInstance = b;
		this.rawKey = a;
		return this
	},
	addEvent : function(a) {
		this.dataInstance.addEvent(a, this.rawKey);
		return this
	},
	removeEvent : function(a) {
		this.dataInstance.removeEvent(a, this.rawKey);
		return this
	},
	addException : function(a) {
		this.dataInstance.addException(a, this.rawKey);
		return this
	},
	removeException : function(a) {
		this.dataInstance.removeException(a, this.rawKey);
		return this
	},
	startDefalutBehavior : function() {
		this.dataInstance.startDefalutBehavior(this.rawKey);
		return this
	},
	stopDefalutBehavior : function() {
		this.dataInstance.stopDefalutBehavior(this.rawKey);
		return this
	},
	resetElement : function() {
		Shortcut.Store.reset(this.dataInstance.id);
		return this
	},
	resetAll : function() {
		Shortcut.Store.allReset();
		return this
	}
};
(function() {
	Shortcut.Store.anthorKeyHash = {
		BACKSPACE : 8,
		TAB : 9,
		ENTER : 13,
		ESC : 27,
		SPACE : 32,
		PAGEUP : 33,
		PAGEDOWN : 34,
		END : 35,
		HOME : 36,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		DEL : 46,
		COMMA : 188,
		PERIOD : 190,
		SLASH : 191
	};
	var c = Shortcut.Store.anthorKeyHash;
	for ( var a = 1; a < 13; a++) {
		Shortcut.Store.anthorKeyHash["F" + a] = a + 111
	}
	var b = jindo.$Agent().navigator();
	if (b.ie || b.safari || b.chrome) {
		c.HYPHEN = 189;
		c.EQUAL = 187
	} else {
		c.HYPHEN = 109;
		c.EQUAL = 61
	}
})();
var shortcut = Shortcut;
nhn.husky.SE2M_AttachQuickPhoto = jindo
		.$Class({
			name : "SE2M_AttachQuickPhoto",
			$init : function() {
			},
			$ON_MSG_APP_READY : function() {
				this.oApp.exec("REGISTER_UI_EVENT", [ "photo_attach", "click",
						"ATTACHPHOTO_OPEN_WINDOW" ])
			},
			$LOCAL_BEFORE_FIRST : function(a) {
				if (!!this.oPopupMgr) {
					return
				}
				this.htPopupOption = {
					oApp : this.oApp,
					sName : this.name,
					bScroll : false,
					sProperties : "",
					sUrl : ""
				};
				this.oPopupMgr = nhn.husky.PopUpManager.getInstance(this.oApp)
			},
			$ON_ATTACHPHOTO_OPEN_WINDOW : function() {
				this.htPopupOption.sUrl = this.makePopupURL();
				this.htPopupOption.sProperties = "left=0,top=0,width=383,height=339,scrollbars=no,location=no,status=0,resizable=no";
				this.oPopupWindow = this.oPopupMgr
						.openWindow(this.htPopupOption);
				this.oApp.exec("FOCUS");
				return (!!this.oPopupWindow ? true : false)
			},
			makePopupURL : function() {
				var a = "./popup/quick_photo/Photo_Quick_UploadPopup.html";
				return a
			},
			$ON_SET_PHOTO : function(f) {
				var c, g, b;
				if (!f) {
					return
				}
				try {
					c = "";
					for ( var a = 0; a < f.length; a++) {
						b = f[a];
						if (!b.sAlign) {
							b.sAlign = ""
						}
						g = {
							sName : b.sFileName || "",
							sOriginalImageURL : b.sFileURL,
							bNewLine : b.bNewLine || false
						};
						c += this._getPhotoTag(g)
					}
					this.oApp.exec("PASTE_HTML", [ c ])
				} catch (d) {
					return false
				}
			},
			_getPhotoTag : function(b) {
				var a = '<img src="{=sOriginalImageURL}" title="{=sName}" >';
				if (b.bNewLine) {
					a += '<br style="clear:both;">'
				}
				a = jindo.$Template(a).process(b);
				return a
			}
		});
if (typeof window.nhn == "undefined") {
	window.nhn = {}
}
nhn.DraggableLayer = jindo
		.$Class({
			$init : function(c, b) {
				this.elLayer = c;
				this.setOptions(b);
				this.elHandle = this.oOptions.elHandle;
				c.style.display = "block";
				c.style.position = "absolute";
				c.style.zIndex = "9999";
				this.aBasePosition = this.getBaseOffset(c);
				var d = (this.toInt(jindo.$Element(c).offset().top) - this.aBasePosition.top);
				var e = (this.toInt(jindo.$Element(c).offset().left) - this.aBasePosition.left);
				var a = this._correctXY({
					x : e,
					y : d
				});
				c.style.top = a.y + "px";
				c.style.left = a.x + "px";
				this.$FnMouseDown = jindo.$Fn(jindo.$Fn(this._mousedown, this)
						.bind(c), this);
				this.$FnMouseMove = jindo.$Fn(jindo.$Fn(this._mousemove, this)
						.bind(c), this);
				this.$FnMouseUp = jindo.$Fn(jindo.$Fn(this._mouseup, this)
						.bind(c), this);
				this.$FnMouseDown.attach(this.elHandle, "mousedown");
				this.elHandle.ondragstart = new Function("return false");
				this.elHandle.onselectstart = new Function("return false")
			},
			_mousedown : function(b, a) {
				if (a.element.tagName == "INPUT") {
					return
				}
				this.oOptions.fnOnDragStart();
				this.MouseOffsetY = (a.pos().clientY - this.toInt(b.style.top) - this.aBasePosition.top);
				this.MouseOffsetX = (a.pos().clientX - this.toInt(b.style.left) - this.aBasePosition.left);
				this.$FnMouseMove.attach(b.ownerDocument, "mousemove");
				this.$FnMouseUp.attach(b.ownerDocument, "mouseup");
				this.elHandle.style.cursor = "move"
			},
			_mousemove : function(c, a) {
				var d = (a.pos().clientY - this.MouseOffsetY - this.aBasePosition.top);
				var e = (a.pos().clientX - this.MouseOffsetX - this.aBasePosition.left);
				var b = this._correctXY({
					x : e,
					y : d
				});
				c.style.top = b.y + "px";
				c.style.left = b.x + "px"
			},
			_mouseup : function(b, a) {
				this.oOptions.fnOnDragEnd();
				this.$FnMouseMove.detach(b.ownerDocument, "mousemove");
				this.$FnMouseUp.detach(b.ownerDocument, "mouseup");
				this.elHandle.style.cursor = ""
			},
			_correctXY : function(a) {
				var c = a.x;
				var b = a.y;
				if (b < this.oOptions.nMinY) {
					b = this.oOptions.nMinY
				}
				if (b > this.oOptions.nMaxY) {
					b = this.oOptions.nMaxY
				}
				if (c < this.oOptions.nMinX) {
					c = this.oOptions.nMinX
				}
				if (c > this.oOptions.nMaxX) {
					c = this.oOptions.nMaxX
				}
				return {
					x : c,
					y : b
				}
			},
			toInt : function(b) {
				var a = parseInt(b);
				return a || 0
			},
			findNonStatic : function(a) {
				if (!a) {
					return null
				}
				if (a.tagName == "BODY") {
					return a
				}
				if (jindo.$Element(a).css("position").match(
						/absolute|relative/i)) {
					return a
				}
				return this.findNonStatic(a.offsetParent)
			},
			getBaseOffset : function(a) {
				var c = this.findNonStatic(a.offsetParent)
						|| a.ownerDocument.body;
				var b = jindo.$Element(c).offset();
				return {
					top : b.top,
					left : b.left
				}
			},
			setOptions : function(a) {
				this.oOptions = a || {};
				this.oOptions.bModal = this.oOptions.bModal || false;
				this.oOptions.elHandle = this.oOptions.elHandle || this.elLayer;
				this.oOptions.nMinX = this.oOptions.nMinX || -999999;
				this.oOptions.nMinY = this.oOptions.nMinY || -999999;
				this.oOptions.nMaxX = this.oOptions.nMaxX || 999999;
				this.oOptions.nMaxY = this.oOptions.nMaxY || 999999;
				this.oOptions.fnOnDragStart = this.oOptions.fnOnDragStart
						|| function() {
						};
				this.oOptions.fnOnDragEnd = this.oOptions.fnOnDragEnd
						|| function() {
						}
			}
		});
nhn.husky.ActiveLayerManager = jindo.$Class({
	name : "ActiveLayerManager",
	oCurrentLayer : null,
	$BEFORE_MSG_APP_READY : function() {
		this.oNavigator = jindo.$Agent().navigator()
	},
	$ON_TOGGLE_ACTIVE_LAYER : function(a, d, b, e, c) {
		if (a == this.oCurrentLayer) {
			this.oApp.exec("HIDE_ACTIVE_LAYER", [])
		} else {
			this.oApp.exec("SHOW_ACTIVE_LAYER", [ a, e, c ]);
			if (d) {
				this.oApp.exec(d, b)
			}
		}
	},
	$ON_SHOW_ACTIVE_LAYER : function(a, d, b) {
		a = jindo.$(a);
		var c = this.oCurrentLayer;
		if (a == c) {
			return
		}
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
		this.sOnCloseCmd = d;
		this.aOnCloseParam = b;
		a.style.display = "block";
		this.oCurrentLayer = a;
		this.oApp.exec("ADD_APP_PROPERTY", [ "oToolBarLayer",
				this.oCurrentLayer ])
	},
	$ON_HIDE_ACTIVE_LAYER : function() {
		var a = this.oCurrentLayer;
		if (!a) {
			return
		}
		a.style.display = "none";
		this.oCurrentLayer = null;
		if (this.sOnCloseCmd) {
			this.oApp.exec(this.sOnCloseCmd, this.aOnCloseParam)
		}
		if (!!this.oNavigator.msafari) {
			this.oApp.getWYSIWYGWindow().focus()
		}
	},
	$ON_HIDE_ACTIVE_LAYER_IF_NOT_CHILD : function(a) {
		var b = a;
		while (b) {
			if (b == this.oCurrentLayer) {
				return
			}
			b = b.parentNode
		}
		this.oApp.exec("HIDE_ACTIVE_LAYER")
	},
	$ON_HIDE_CURRENT_ACTIVE_LAYER : function() {
		this.oApp.exec("HIDE_ACTIVE_LAYER", [])
	}
});
nhn.husky.DialogLayerManager = jindo.$Class({
	name : "DialogLayerManager",
	aMadeDraggable : null,
	aOpenedLayers : null,
	$init : function() {
		this.aMadeDraggable = [];
		this.aDraggableLayer = [];
		this.aOpenedLayers = []
	},
	$BEFORE_MSG_APP_READY : function() {
		this.oNavigator = jindo.$Agent().navigator()
	},
	$ON_SHOW_DIALOG_LAYER : function(a, b) {
		a = jindo.$(a);
		b = b || {};
		if (!a) {
			return
		}
		if (jindo.$A(this.aOpenedLayers).has(a)) {
			return
		}
		this.oApp.exec("POSITION_DIALOG_LAYER", [ a ]);
		this.aOpenedLayers[this.aOpenedLayers.length] = a;
		var d;
		var c = jindo.$A(this.aMadeDraggable).indexOf(a);
		if (c == -1) {
			d = new nhn.DraggableLayer(a, b);
			this.aMadeDraggable[this.aMadeDraggable.length] = a;
			this.aDraggableLayer[this.aDraggableLayer.length] = d
		} else {
			if (b) {
				d = this.aDraggableLayer[c];
				d.setOptions(b)
			}
			a.style.display = "block"
		}
		if (b.sOnShowMsg) {
			this.oApp.exec(b.sOnShowMsg, b.sOnShowParam)
		}
	},
	$ON_HIDE_LAST_DIALOG_LAYER : function() {
		this.oApp.exec("HIDE_DIALOG_LAYER",
				[ this.aOpenedLayers[this.aOpenedLayers.length - 1] ])
	},
	$ON_HIDE_ALL_DIALOG_LAYER : function() {
		for ( var a = this.aOpenedLayers.length - 1; a >= 0; a--) {
			this.oApp.exec("HIDE_DIALOG_LAYER", [ this.aOpenedLayers[a] ])
		}
	},
	$ON_HIDE_DIALOG_LAYER : function(a) {
		a = jindo.$(a);
		if (a) {
			a.style.display = "none"
		}
		this.aOpenedLayers = jindo.$A(this.aOpenedLayers).refuse(a).$value();
		if (!!this.oNavigator.msafari) {
			this.oApp.getWYSIWYGWindow().focus()
		}
	},
	$ON_TOGGLE_DIALOG_LAYER : function(a, b) {
		if (jindo.$A(this.aOpenedLayers).indexOf(a)) {
			this.oApp.exec("SHOW_DIALOG_LAYER", [ a, b ])
		} else {
			this.oApp.exec("HIDE_DIALOG_LAYER", [ a ])
		}
	},
	$ON_SET_DIALOG_LAYER_POSITION : function(a, b, c) {
		a.style.top = b;
		a.style.left = c
	}
});
nhn.husky.LazyLoader = jindo.$Class({
	name : "LazyLoader",
	htMsgInfo : null,
	aLoadingInfo : null,
	$init : function(a) {
		this.htMsgInfo = {};
		this.aLoadingInfo = [];
		this.aToDo = a
	},
	$ON_MSG_APP_READY : function() {
		for ( var a = 0; a < this.aToDo.length; a++) {
			var b = this.aToDo[a];
			this._createBeforeHandlersAndSaveURLInfo(b.oMsgs, b.sURL,
					b.elTarget, b.htOptions)
		}
	},
	$LOCAL_BEFORE_ALL : function(b, d) {
		var c = b.replace("$BEFORE_", "");
		var a = this.htMsgInfo[c];
		if (a.nLoadingStatus == 1) {
			return true
		}
		if (a.nLoadingStatus == 2) {
			this[b] = function() {
				this._removeHandler(b);
				this.oApp.delayedExec(c, d, 0);
				return false
			};
			return true
		}
		a.bLoadingStatus = 1;
		(new jindo.$Ajax(a.sURL, {
			onload : jindo.$Fn(this._onload, this).bind(c, d)
		})).request();
		return true
	},
	_onload : function(a, c, b) {
		if (b._response.readyState == 4) {
			this.htMsgInfo[a].elTarget.innerHTML = b.text();
			this.htMsgInfo[a].nLoadingStatus = 2;
			this._removeHandler("$BEFORE_" + a);
			this.oApp.exec("sMsg", c)
		} else {
			this.oApp.exec(this.htMsgInfo[a].sFailureCallback, [])
		}
	},
	_removeHandler : function(a) {
		delete this[a];
		this.oApp.createMessageMap(a)
	},
	_createBeforeHandlersAndSaveURLInfo : function(e, g, a, j) {
		j = j || {};
		var k = {
			sURL : g,
			elTarget : a,
			sSuccessCallback : j.sSuccessCallback,
			sFailureCallback : j.sFailureCallback,
			nLoadingStatus : 0
		};
		this.aLoadingInfo[this.aLoadingInfo.legnth] = k;
		if (!(e instanceof Array)) {
			var l = e;
			e = [];
			var h = {};
			for ( var c in l) {
				if (c.match(/^\$(BEFORE|ON|AFTER)_(.+)$/)) {
					var b = RegExp.$2;
					if (b == "MSG_APP_READY") {
						continue
					}
					if (!h[b]) {
						e[e.length] = RegExp.$2;
						h[b] = true
					}
				}
			}
		}
		for ( var d = 0; d < e.length; d++) {
			var f = "$BEFORE_" + e[d];
			this[f] = function() {
				return false
			};
			this.oApp.createMessageMap(f);
			this.htMsgInfo[e[d]] = k
		}
	}
});
nhn.husky.MessageManager = jindo.$Class({
	name : "MessageManager",
	oMessageMap : null,
	sLocale : "ko_KR",
	$init : function(a, b) {
		switch (b) {
		case "ja_JP":
			this.oMessageMap = oMessageMap_ja_JP;
			break;
		case "en_US":
			this.oMessageMap = oMessageMap_en_US;
			break;
		case "zh_CN":
			this.oMessageMap = oMessageMap_zh_CN;
			break;
		default:
			this.oMessageMap = a;
			break
		}
	},
	$BEFORE_MSG_APP_READY : function() {
		this.oApp.exec("ADD_APP_PROPERTY", [ "$MSG",
				jindo.$Fn(this.getMessage, this).bind() ])
	},
	getMessage : function(a) {
		if (this.oMessageMap[a]) {
			return unescape(this.oMessageMap[a])
		}
		return a
	}
});
nhn.husky.PopUpManager = {};
nhn.husky.PopUpManager._instance = null;
nhn.husky.PopUpManager._pluginKeyCnt = 0;
nhn.husky.PopUpManager.getInstance = function(a) {
	if (this._instance == null) {
		this._instance = new (function() {
			this._whtPluginWin = new jindo.$H();
			this._whtPlugin = new jindo.$H();
			this.addPlugin = function(c, b) {
				this._whtPlugin.add(c, b)
			};
			this.getPlugin = function() {
				return this._whtPlugin
			};
			this.getPluginWin = function() {
				return this._whtPluginWin
			};
			this.openWindow = function(b) {
				var h = {
					oApp : null,
					sUrl : "",
					sName : "popup",
					sLeft : null,
					sTop : null,
					nWidth : 400,
					nHeight : 400,
					sProperties : null,
					bScroll : true
				};
				for ( var c in b) {
					h[c] = b[c]
				}
				if (h.oApp == null) {
					alert("팝업 요청시 옵션으로 oApp(허스키 reference) 값을 설정하셔야 합니다.")
				}
				var f = h.sLeft || (screen.availWidth - h.nWidth) / 2;
				var e = h.sTop || (screen.availHeight - h.nHeight) / 2;
				var g = h.sProperties != null ? h.sProperties : "top=" + e
						+ ",left=" + f + ",width=" + h.nWidth + ",height="
						+ h.nHeight + ",scrollbars="
						+ (h.bScroll ? "yes" : "no") + ",status=yes";
				var d = window.open(h.sUrl, h.sName, g);
				if (!!d) {
					setTimeout(function() {
						try {
							d.focus()
						} catch (j) {
						}
					}, 100)
				}
				this.removePluginWin(d);
				this._whtPluginWin.add(this.getCorrectKey(this._whtPlugin,
						h.oApp), d);
				return d
			};
			this.getCorrectKey = function(d, c) {
				var b = null;
				d.forEach(function(f, e) {
					if (f == c) {
						b = e;
						return
					}
				});
				return b
			};
			this.removePluginWin = function(c) {
				var b = this._whtPluginWin.search(c);
				if (b) {
					this._whtPluginWin.remove(b);
					this.removePluginWin(c)
				}
			}
		})()
	}
	this._instance.addPlugin("plugin_" + (this._pluginKeyCnt++), a);
	return nhn.husky.PopUpManager._instance
};
nhn.husky.PopUpManager.setCallback = function(a, b, d) {
	if (this._instance.getPluginWin().hasValue(a)) {
		var c = this._instance.getCorrectKey(this._instance.getPluginWin(), a);
		if (c) {
			this._instance.getPlugin().$(c).exec(b, d)
		}
	}
};
nhn.husky.PopUpManager.getFunc = function(b, a) {
	if (this._instance.getPluginWin().hasValue(b)) {
		var c = this._instance.getCorrectKey(this._instance.getPluginWin(), b);
		if (c) {
			return this._instance.getPlugin().$(c)[a]()
		}
	}
};
nhn.husky.SE2M_ImgSizeRatioKeeper = jindo
		.$Class({
			name : "SE2M_ImgSizeRatioKeeper",
			$LOCAL_BEFORE_FIRST : function() {
				this.wfnResizeEnd = jindo.$Fn(this._onResizeEnd, this)
			},
			$ON_EVENT_EDITING_AREA_KEYDOWN : function() {
				this._detachResizeEnd()
			},
			$ON_EVENT_EDITING_AREA_MOUSEUP : function(a) {
				this._detachResizeEnd();
				if (!a.element || a.element.tagName != "IMG") {
					return
				}
				this.oApp.exec("SET_RESIZE_TARGET_IMG", [ a.element ])
			},
			$ON_SET_RESIZE_TARGET_IMG : function(a) {
				if (a == this.elImg) {
					return
				}
				this._detachResizeEnd();
				this._attachResizeEnd(a)
			},
			_attachResizeEnd : function(a) {
				this.elImg = a;
				this.wfnResizeEnd.attach(this.elImg, "resizeend");
				this.elBorderSize = (a.border || 0);
				this.nWidth = this.elImg.clientWidth;
				this.nHeight = this.elImg.clientHeight
			},
			_detachResizeEnd : function() {
				if (!this.elImg) {
					return
				}
				this.wfnResizeEnd.detach(this.elImg, "resizeend");
				this.elImg = null
			},
			_onResizeEnd : function(d) {
				if (d.element != this.elImg) {
					return
				}
				var c, f, b, h, g, e;
				e = this.elImg.border || 0;
				f = this.elImg.clientWidth - (e * 2);
				b = this.elImg.clientHeight - (e * 2);
				h = f - this.nWidth;
				if (-1 <= h && h <= 1) {
					c = this.nWidth / this.nHeight;
					f = c * b
				} else {
					c = this.nHeight / this.nWidth;
					b = c * f
				}
				this.elImg.style.width = f + "px";
				this.elImg.style.height = b + "px";
				this.elImg.setAttribute("width", f);
				this.elImg.setAttribute("height", b);
				this.elImg.style.rwidth = this.elImg.style.width;
				this.elImg.style.rheight = this.elImg.style.height;
				this.elImg.setAttribute("rwidth", this.elImg
						.getAttribute("width"));
				this.elImg.setAttribute("rheight", this.elImg
						.getAttribute("height"));
				var a = this._isAdjustPossible(this.elImg.offsetWidth);
				if (!a) {
					this.elImg.style.width = this.nWidth;
					this.elImg.style.height = this.nHeight;
					this.elImg.style.rwidth = this.elImg.style.width;
					this.elImg.style.rheight = this.elImg.style.height;
					this.elImg.setAttribute("width", this.nWidth);
					this.elImg.setAttribute("height", this.nHeight);
					this.elImg.setAttribute("rwidth", this.elImg
							.getAttribute("width"));
					this.elImg.setAttribute("rheight", this.elImg
							.getAttribute("height"))
				}
				this.oApp.delayedExec("SET_RESIZE_TARGET_IMG", [ this.elImg ],
						0)
			},
			_isAdjustPossible : function(e) {
				var b = true;
				var a = (this.oApp.htOptions.SE2M_EditingAreaRuler) ? this.oApp.htOptions.SE2M_EditingAreaRuler.bUse
						: false;
				if (a) {
					var d = jindo.$Element(this.oApp.getWYSIWYGDocument().body);
					if (d) {
						var c = d.width();
						if (e > c) {
							b = false;
							alert(this.oApp.$MSG(
									"SE2M_ImgSizeRatioKeeper.exceedMaxWidth")
									.replace("#EditorWidth#", c))
						}
					}
				}
				return b
			}
		});
if (typeof window.nhn == "undefined") {
	window.nhn = {}
}
if (!nhn.husky) {
	nhn.husky = {}
}
nhn.husky.SE2M_UtilPlugin = jindo.$Class({
	name : "SE2M_UtilPlugin",
	$BEFORE_MSG_APP_READY : function() {
		this.oApp.exec("ADD_APP_PROPERTY", [ "oAgent", jindo.$Agent() ]);
		this.oApp.exec("ADD_APP_PROPERTY", [ "oNavigator",
				jindo.$Agent().navigator() ]);
		this.oApp.exec("ADD_APP_PROPERTY", [ "oUtils", this ])
	},
	$ON_REGISTER_HOTKEY : function(b, a, d, c) {
		this.oApp.exec("ADD_HOTKEY", [ b, a, d,
				(c || this.oApp.getWYSIWYGDocument()) ])
	},
	$ON_SE2_ATTACH_HOVER_EVENTS : function(a) {
		this.oApp.exec("ATTACH_HOVER_EVENTS", [ a, {
			fnElmToSrc : this._elm2Src,
			fnElmToTarget : this._elm2Target
		} ])
	},
	_elm2Src : function(a) {
		if (a.tagName == "LI" && a.firstChild
				&& a.firstChild.tagName == "BUTTON") {
			return a.firstChild
		} else {
			return a
		}
	},
	_elm2Target : function(a) {
		if (a.tagName == "BUTTON" && a.parentNode.tagName == "LI") {
			return a.parentNode
		} else {
			return a
		}
	},
	getScrollXY : function() {
		var c, b;
		var a = this.oApp.getWYSIWYGWindow();
		if (typeof a.scrollX == "undefined") {
			c = a.document.documentElement.scrollLeft;
			b = a.document.documentElement.scrollTop
		} else {
			c = a.scrollX;
			b = a.scrollY
		}
		return {
			x : c,
			y : b
		}
	}
});
nhn.husky.SE2M_Utils = {
	sURLPattern : "(http|https|ftp|mailto):(?:\\/\\/)?((:?\\w|-)+(:?\\.(:?\\w|-)+)+)([^ <>]+)?",
	getCustomCSS : function(a, d, e) {
		var c = [];
		if ("undefined" == typeof (a) || "undefined" == typeof (d) || !a || !d) {
			return c
		}
		var b = a.match(d);
		if (b && b[0] && b[1]) {
			if (e) {
				c = b[1].split(e)
			} else {
				c[0] = b[1]
			}
		}
		return c
	},
	toStringSamePropertiesOfArray : function(d, f, b) {
		if (d instanceof Array) {
			var c = [];
			for ( var e = 0; e < d.length; e++) {
				c.push(d[e][f])
			}
			return c.join(",").replace(/,/g, b)
		} else {
			if (typeof d[f] == "undefined") {
				return ""
			}
			if (typeof d[f] == "string") {
				return d[f]
			}
		}
	},
	makeArray : function(c) {
		if (c === null || typeof c === "undefined") {
			return []
		}
		if (c instanceof Array) {
			return c
		}
		var b = [];
		b.push(c);
		return b
	},
	ellipsis : function(k, c, d, j) {
		d = d || "...";
		if (typeof j == "undefined") {
			j = 1
		}
		var e = jindo.$Element(k);
		var g = jindo.$Element(c);
		var b = e.html();
		var l = b.length;
		var f = g.height();
		var a = 0;
		e.html("A");
		var h = g.height();
		if (f < h * (j + 0.5)) {
			return e.html(b)
		}
		f = h;
		while (f < h * (j + 0.5)) {
			a += Math.max(Math.ceil((l - a) / 2), 1);
			e.html(b.substring(0, a) + d);
			f = g.height()
		}
		while (f > h * (j + 0.5)) {
			a--;
			e.html(b.substring(0, a) + d);
			f = g.height()
		}
	},
	ellipsisByPixel : function(j, c, h, e) {
		c = c || "...";
		var d = jindo.$Element(j);
		var f = d.width();
		if (f < h) {
			return
		}
		var b = d.html();
		var k = b.length;
		var a = 0;
		if (typeof e == "undefined") {
			var g = d.html("A").width();
			f = g;
			while (f < h) {
				a += Math.max(Math.ceil((k - a) / 2), 1);
				d.html(b.substring(0, a) + c);
				f = d.width()
			}
			e = function() {
				return true
			}
		}
		a = d.html().length - c.length;
		while (f > h) {
			if (!e()) {
				break
			}
			a--;
			d.html(b.substring(0, a) + c);
			f = d.width()
		}
	},
	ellipsisElementsToDesinatedWidth : function(d, a, b, c) {
		jindo.$A(d).forEach(function(f, e) {
			if (!f) {
				jindo.$A.Continue()
			}
			nhn.husky.SE2M_Utils.ellipsisByPixel(f, a, b[e], c)
		})
	},
	paddingZero : function(c, b) {
		var a = c.toString();
		while (a.length < b) {
			a = ("0" + a)
		}
		return a
	},
	cutStringToByte : function(d, f, e) {
		if (d === null || d.length === 0) {
			return d
		}
		d = d.replace(/  +/g, " ");
		if (!e && e != "") {
			e = "..."
		}
		var c = f;
		var g = 0;
		var b = d.length;
		for ( var a = 0; a < b; a++) {
			g += this.getCharByte(d.charAt(a));
			if (g == c) {
				if (a == b - 1) {
					return d
				} else {
					return d.substring(0, a) + e
				}
			} else {
				if (g > c) {
					return d.substring(0, a) + e
				}
			}
		}
		return d
	},
	getCharByte : function(a) {
		if (a === null || a.length < 1) {
			return 0
		}
		var b = 0;
		var c = escape(a);
		if (c.length == 1) {
			b++
		} else {
			if (c.indexOf("%u") != -1) {
				b += 2
			} else {
				if (c.indexOf("%") != -1) {
					b += c.length / 3
				}
			}
		}
		return b
	},
	getFilteredHashTable : function(c, b) {
		if (!(b instanceof Array)) {
			return arguments.callee.call(this, c, [ b ])
		}
		var a = jindo.$A(b);
		return jindo.$H(c).filter(function(e, d) {
			if (a.has(d) && e) {
				return true
			} else {
				return false
			}
		}).$value()
	},
	isBlankNode : function(b) {
		var e = this.isBlankTextNode;
		var a = function(h) {
			if (!h) {
				return true
			}
			if (e(h)) {
				return true
			}
			if (h.tagName == "BR") {
				return true
			}
			if (h.innerHTML == "&nbsp;" || h.innerHTML == "") {
				return true
			}
			return false
		};
		var d = function(h) {
			if (a(h)) {
				return true
			}
			if (h.tagName == "P") {
				for ( var j = h.childNodes.length - 1; j >= 0; j--) {
					var k = h.childNodes[j];
					if (e(k)) {
						k.parentNode.removeChild(k)
					}
				}
				if (h.childNodes.length == 1 && a(h.firstChild)) {
					return true
				}
			}
			return false
		};
		if (d(b)) {
			return true
		}
		for ( var c = 0, g = b.childNodes.length; c < g; c++) {
			var f = b.childNodes[c];
			if (!d(f)) {
				return false
			}
		}
		return true
	},
	isBlankTextNode : function(b) {
		var a;
		if (b.nodeType == 3) {
			a = b.nodeValue;
			a = a.replace(unescape("%uFEFF"), "");
			if (a == "") {
				return true
			}
		}
		return false
	},
	findAncestorByTagName : function(b, a) {
		while (a && a.tagName != b) {
			a = a.parentNode
		}
		return a
	},
	loadCSS : function(c, e) {
		var b = document;
		var a = b.getElementsByTagName("HEAD")[0];
		var d = b.createElement("LINK");
		d.setAttribute("type", "text/css");
		d.setAttribute("rel", "stylesheet");
		d.setAttribute("href", c);
		if (e) {
			d.onreadystatechange = function() {
				if (d.readyState != "complete") {
					return
				}
				if (d.getAttribute("_complete")) {
					return
				}
				d.setAttribute("_complete", true);
				e()
			}
		}
		a.appendChild(d)
	},
	getUniqueId : function(a) {
		return (a || "") + jindo.$Date().time()
				+ (Math.random() * 100000).toFixed()
	},
	clone : function(c, b) {
		if ("undefined" != typeof (c) && !!c
				&& (c.constructor == Array || c.constructor == Object)) {
			var a = (c.constructor == Array ? [] : {});
			for ( var d in c) {
				if ("undefined" != typeof (b) && !!b[d]) {
					a[d] = arguments.callee(b[d])
				} else {
					a[d] = arguments.callee(c[d])
				}
			}
			return a
		}
		return c
	},
	getHtmlTagAttr : function(e, a) {
		var c = new RegExp("\\s" + a + "=('([^']*)'|\"([^\"]*)\"|([^\"' >]*))",
				"i");
		var d = c.exec(e);
		if (!d) {
			return ""
		}
		var b = (d[1] || d[2] || d[3]);
		if (!!b) {
			b = b.replace(/[\"]/g, "")
		}
		return b
	},
	iframeAlignConverter : function(f, b) {
		var e = f.tagName.toUpperCase();
		if (e == "DIV" || e == "P") {
			if (f.parentNode === null) {
				return
			}
			var a = b;
			var d = jindo.$Element(f);
			var h = d.html();
			var c = jindo.$Element(f).attr("align")
					|| jindo.$Element(f).css("text-align");
			var g = jindo.$Element(jindo.$("<div></div>", a));
			g.html(h).attr("align", c);
			d.replace(g)
		}
	},
	getJsonDatafromXML : function(a) {
		var d = {};
		var k = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
		var g = /^[0-9]+(?:\.[0-9]+)?$/;
		var h = {
			"&amp;" : "&",
			"&nbsp;" : " ",
			"&quot;" : '"',
			"&lt;" : "<",
			"&gt;" : ">"
		};
		var b = {
			tags : [ "/" ],
			stack : [ d ]
		};
		var j = function(l) {
			if (typeof l == "undefined") {
				return ""
			}
			return l.replace(/&[a-z]+;/g, function(n) {
				return (typeof h[n] == "string") ? h[n] : n
			})
		};
		var e = function(l, m) {
			l
					.replace(
							/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g,
							function(o, n, q, p) {
								m[n] = j((q ? q.replace(/\\"/g, '"')
										: undefined)
										|| (p ? p.replace(/\\'/g, "'")
												: undefined))
							})
		};
		var c = function(m) {
			for ( var l in m) {
				if (m.hasOwnProperty(l)) {
					if (Object.prototype[l]) {
						continue
					}
					return false
				}
			}
			return true
		};
		var f = function(t, s, q, p, n, m) {
			var A, z = "";
			var y = b.stack.length - 1;
			if (typeof s == "string" && s) {
				if (s.substr(0, 1) != "/") {
					var x = (typeof q == "string" && q);
					var v = (typeof p == "string" && p);
					var r = (!x && v) ? "" : {};
					A = b.stack[y];
					if (typeof A[s] == "undefined") {
						A[s] = r;
						A = b.stack[y + 1] = A[s]
					} else {
						if (A[s] instanceof Array) {
							var u = A[s].length;
							A[s][u] = r;
							A = b.stack[y + 1] = A[s][u]
						} else {
							A[s] = [ A[s], r ];
							A = b.stack[y + 1] = A[s][1]
						}
					}
					if (x) {
						e(q, A)
					}
					b.tags[y + 1] = s;
					if (v) {
						b.tags.length--;
						b.stack.length--
					}
				} else {
					b.tags.length--;
					b.stack.length--
				}
			} else {
				if (typeof n == "string" && n) {
					z = n
				} else {
					if (typeof m == "string" && m) {
						z = j(m)
					}
				}
			}
			if (z.length > 0) {
				var w = b.stack[y - 1];
				var B = b.tags[y];
				if (g.test(z)) {
				} else {
					if (z == "true" || z == "false") {
						z = new Boolean(z)
					}
				}
				if (typeof w == "undefined") {
					return
				}
				if (w[B] instanceof Array) {
					var l = w[B];
					if (typeof l[l.length - 1] == "object"
							&& !c(l[l.length - 1])) {
						l[l.length - 1].$cdata = z;
						l[l.length - 1].toString = function() {
							return z
						}
					} else {
						l[l.length - 1] = z
					}
				} else {
					if (typeof w[B] == "object" && !c(w[B])) {
						w[B].$cdata = z;
						w[B].toString = function() {
							return z
						}
					} else {
						w[B] = z
					}
				}
			}
		};
		a = a.replace(/<(\?|\!-)[^>]*>/g, "");
		a.replace(k, f);
		return jindo.$Json(d)
	}
};
nhn.husky.AutoResizer = jindo.$Class({
	welHiddenDiv : null,
	welCloneDiv : null,
	elContainer : null,
	$init : function(c, d) {
		var a = [ "lineHeight", "textDecoration", "letterSpacing", "fontSize",
				"fontFamily", "fontStyle", "fontWeight", "textTransform",
				"textAlign", "direction", "wordSpacing", "fontSizeAdjust",
				"paddingTop", "paddingLeft", "paddingBottom", "paddingRight",
				"width" ], b = a.length, e = {
			position : "absolute",
			top : -9999,
			left : -9999,
			opacity : 0,
			overflow : "hidden",
			wordWrap : "break-word"
		};
		this.nMinHeight = d.nMinHeight;
		this.wfnCallback = d.wfnCallback;
		this.elContainer = c.parentNode;
		this.welTextArea = jindo.$Element(c);
		this.welHiddenDiv = jindo.$Element("<div>");
		this.wfnResize = jindo.$Fn(this._resize, this);
		this.sOverflow = this.welTextArea.css("overflow");
		this.welTextArea.css("overflow", "hidden");
		while (b--) {
			e[a[b]] = this.welTextArea.css(a[b])
		}
		this.welHiddenDiv.css(e);
		this.nLastHeight = this.welTextArea.height()
	},
	bind : function() {
		this.welCloneDiv = jindo.$Element(this.welHiddenDiv.$value().cloneNode(
				false));
		this.wfnResize.attach(this.welTextArea, "keyup");
		this.welCloneDiv.appendTo(this.elContainer);
		this._resize()
	},
	unbind : function() {
		this.wfnResize.detach(this.welTextArea, "keyup");
		this.welTextArea.css("overflow", this.sOverflow);
		if (this.welCloneDiv) {
			this.welCloneDiv.leave()
		}
	},
	_resize : function() {
		var c = this.welTextArea.$value().value, b = false, a;
		if (c === this.sContents) {
			return
		}
		this.sContents = c.replace(/&/g, "&amp;").replace(/</g, "&lt;")
				.replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\n/g,
						"<br>");
		this.sContents += "<br>";
		this.welCloneDiv.html(this.sContents);
		a = this.welCloneDiv.height();
		if (a < this.nMinHeight) {
			a = this.nMinHeight
		}
		this.welTextArea.css("height", a + "px");
		this.elContainer.style.height = a + "px";
		if (this.nLastHeight < a) {
			b = true
		}
		this.wfnCallback(b)
	}
});
if ("undefined" != typeof (StringBuffer)) {
	StringBuffer = {}
}
StringBuffer = function(a) {
	this._aString = [];
	if ("undefined" != typeof (a)) {
		this.append(a)
	}
};
StringBuffer.prototype.append = function(a) {
	this._aString.push(a);
	return this
};
StringBuffer.prototype.toString = function() {
	return this._aString.join("")
};
StringBuffer.prototype.setLength = function(a) {
	if ("undefined" == typeof (a) || 0 >= a) {
		this._aString.length = 0
	} else {
		this._aString.length = a
	}
};
(function() {
	var a = null;
	IsInstalledFont = function(f) {
		var b = f == "Comic Sans MS" ? "Courier New" : "Comic Sans MS";
		if (!a) {
			a = document.createElement("div")
		}
		var g = "position:absolute !important; font-size:200px !important; left:-9999px !important; top:-9999px !important;";
		a.innerHTML = "mmmmiiiii" + unescape("%uD55C%uAE00");
		a.style.cssText = g + 'font-family:"' + b + '" !important';
		var e = document.body || document.documentElement;
		if (e.firstChild) {
			e.insertBefore(a, e.firstChild)
		} else {
			document.body.appendChild(a)
		}
		var c = a.offsetWidth + "-" + a.offsetHeight;
		a.style.cssText = g + 'font-family:"' + f + '", "' + b + '" !important';
		var d = c != (a.offsetWidth + "-" + a.offsetHeight);
		document.body.removeChild(a);
		return d
	}
})();
nhn.husky.StringConverterManager = jindo.$Class({
	name : "StringConverterManager",
	oConverters : null,
	$init : function() {
		this.oConverters = {};
		this.oConverters_DOM = {}
	},
	$BEFORE_MSG_APP_READY : function() {
		this.oApp.exec("ADD_APP_PROPERTY", [ "applyConverter",
				jindo.$Fn(this.applyConverter, this).bind() ]);
		this.oApp.exec("ADD_APP_PROPERTY", [ "addConverter",
				jindo.$Fn(this.addConverter, this).bind() ]);
		this.oApp.exec("ADD_APP_PROPERTY", [ "addConverter_DOM",
				jindo.$Fn(this.addConverter_DOM, this).bind() ])
	},
	applyConverter : function(c, j, h) {
		var a = "@" + (new Date()).getTime() + "@";
		var f = new RegExp(a, "g");
		var k = {
			sContents : a + j
		};
		h = h || document;
		this.oApp.exec("MSG_STRING_CONVERTER_STARTED", [ c, k ]);
		var e;
		j = k.sContents;
		e = this.oConverters_DOM[c];
		if (e) {
			var g = h.createElement("DIV");
			g.innerHTML = j;
			for ( var d = 0; d < e.length; d++) {
				e[d](g)
			}
			j = g.innerHTML;
			g.innerHTML = "";
			if (jindo.$Agent().navigator().ie) {
				a = a + "(\r\n)?";
				f = new RegExp(a, "g")
			}
		}
		e = this.oConverters[c];
		if (e) {
			for ( var d = 0; d < e.length; d++) {
				var b = e[d](j);
				if (typeof b != "undefined") {
					j = b
				}
			}
		}
		k = {
			sContents : j
		};
		this.oApp.exec("MSG_STRING_CONVERTER_ENDED", [ c, k ]);
		k.sContents = k.sContents.replace(f, "");
		return k.sContents
	},
	$ON_ADD_CONVERTER : function(b, a) {
		var c = this.oApp.aCallerStack;
		a.sPluginName = c[c.length - 2].name;
		this.addConverter(b, a)
	},
	$ON_ADD_CONVERTER_DOM : function(b, a) {
		var c = this.oApp.aCallerStack;
		a.sPluginName = c[c.length - 2].name;
		this.addConverter_DOM(b, a)
	},
	addConverter : function(b, a) {
		var c = this.oConverters[b];
		if (!c) {
			this.oConverters[b] = []
		}
		this.oConverters[b][this.oConverters[b].length] = a
	},
	addConverter_DOM : function(b, a) {
		var c = this.oConverters_DOM[b];
		if (!c) {
			this.oConverters_DOM[b] = []
		}
		this.oConverters_DOM[b][this.oConverters_DOM[b].length] = a
	}
});
nhn.husky.Utils = jindo.$Class({
	name : "Utils",
	$init : function() {
		var a = jindo.$Agent();
		var b = a.navigator();
		if (b.ie && b.version == 6) {
			try {
				document.execCommand("BackgroundImageCache", false, true)
			} catch (c) {
			}
		}
	},
	$BEFORE_MSG_APP_READY : function() {
		this.oApp.exec("ADD_APP_PROPERTY", [ "htBrowser",
				jindo.$Agent().navigator() ])
	},
	$ON_ATTACH_HOVER_EVENTS : function(c, j) {
		j = j || [];
		var b = j.sHoverClass || "hover";
		var a = j.fnElmToSrc || function(l) {
			return l
		};
		var k = j.fnElmToTarget || function(l) {
			return l
		};
		if (!c) {
			return
		}
		var d = jindo.$Fn(function(l) {
			jindo.$Element(k(l.currentElement)).addClass(b)
		}, this);
		var e = jindo.$Fn(function(l) {
			jindo.$Element(k(l.currentElement)).removeClass(b)
		}, this);
		for ( var f = 0, g = c.length; f < g; f++) {
			var h = a(c[f]);
			d.attach(h, "mouseover");
			e.attach(h, "mouseout");
			d.attach(h, "focus");
			e.attach(h, "blur")
		}
	}
});
nhn.husky.SE_OuterIFrameControl = $Class({
	name : "SE_OuterIFrameControl",
	oResizeGrip : null,
	$init : function(a) {
		this.aHeightChangeKeyMap = [ -100, 100, 500, -500, -1, -10, 1, 10 ];
		this._assignHTMLObjects(a);
		this.$FnKeyDown = $Fn(this._keydown, this);
		if (this.oResizeGrip) {
			this.$FnKeyDown.attach(this.oResizeGrip, "keydown")
		}
		if (!!jindo.$Agent().navigator().ie) {
			this.$FnMouseDown = $Fn(this._mousedown, this);
			this.$FnMouseMove = $Fn(this._mousemove, this);
			this.$FnMouseMove_Parent = $Fn(this._mousemove_parent, this);
			this.$FnMouseUp = $Fn(this._mouseup, this);
			if (this.oResizeGrip) {
				this.$FnMouseDown.attach(this.oResizeGrip, "mousedown")
			}
		}
	},
	_assignHTMLObjects : function(a) {
		a = $(a) || document;
		this.oResizeGrip = cssquery.getSingle(
				".husky_seditor_editingArea_verticalResizer", a);
		this.elIFrame = window.frameElement;
		this.welIFrame = $Element(this.elIFrame)
	},
	$ON_MSG_APP_READY : function() {
		this.oApp.exec("SE_FIT_IFRAME", [])
	},
	$ON_MSG_EDITING_AREA_SIZE_CHANGED : function() {
		this.oApp.exec("SE_FIT_IFRAME", [])
	},
	$ON_SE_FIT_IFRAME : function() {
		this.elIFrame.style.height = document.body.offsetHeight + "px"
	},
	$AFTER_RESIZE_EDITING_AREA_BY : function(a, b) {
		this.oApp.exec("SE_FIT_IFRAME", [])
	},
	_keydown : function(a) {
		var b = a.key();
		if (b.keyCode >= 33 && b.keyCode <= 40) {
			this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED", []);
			this.oApp.exec("RESIZE_EDITING_AREA_BY", [ 0,
					this.aHeightChangeKeyMap[b.keyCode - 33] ]);
			this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED", []);
			a.stop()
		}
	},
	_mousedown : function(a) {
		this.iStartHeight = a.pos().clientY;
		this.iStartHeightOffset = a.pos().layerY;
		this.$FnMouseMove.attach(document, "mousemove");
		this.$FnMouseMove_Parent.attach(parent.document, "mousemove");
		this.$FnMouseUp.attach(document, "mouseup");
		this.$FnMouseUp.attach(parent.document, "mouseup");
		this.iStartHeight = a.pos().clientY;
		this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED", [ this.$FnMouseDown,
				this.$FnMouseMove, this.$FnMouseUp ])
	},
	_mousemove : function(b) {
		var a = b.pos().clientY - this.iStartHeight;
		this.oApp.exec("RESIZE_EDITING_AREA_BY", [ 0, a ])
	},
	_mousemove_parent : function(b) {
		var a = b.pos().pageY
				- (this.welIFrame.offset().top + this.iStartHeight);
		this.oApp.exec("RESIZE_EDITING_AREA_BY", [ 0, a ])
	},
	_mouseup : function(a) {
		this.$FnMouseMove.detach(document, "mousemove");
		this.$FnMouseMove_Parent.detach(parent.document, "mousemove");
		this.$FnMouseUp.detach(document, "mouseup");
		this.$FnMouseUp.detach(parent.document, "mouseup");
		this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED", [ this.$FnMouseDown,
				this.$FnMouseMove, this.$FnMouseUp ])
	}
});
nhn.husky.SE_ToolbarToggler = $Class({
	name : "SE_ToolbarToggler",
	bUseToolbar : true,
	$init : function(a, b) {
		this._assignHTMLObjects(a, b)
	},
	_assignHTMLObjects : function(a, b) {
		a = $(a) || document;
		this.toolbarArea = cssquery.getSingle(".se2_tool", a);
		if (typeof (b) == "undefined" || b === true) {
			this.toolbarArea.style.display = "block"
		} else {
			this.toolbarArea.style.display = "none"
		}
	},
	$ON_MSG_APP_READY : function() {
		this.oApp
				.exec("REGISTER_HOTKEY", [ "ctrl+t", "SE_TOGGLE_TOOLBAR", [] ])
	},
	$ON_SE_TOGGLE_TOOLBAR : function() {
		this.toolbarArea.style.display = (this.toolbarArea.style.display == "none") ? "block"
				: "none";
		this.oApp.exec("MSG_EDITING_AREA_SIZE_CHANGED", [])
	}
});
nhn.husky.SE2B_CSSLoader = jindo.$Class({
	name : "SE2B_CSSLoader",
	bCssLoaded : false,
	aInstantLoadTrigger : [ "OPEN_QE_LAYER", "SHOW_ACTIVE_LAYER",
			"SHOW_DIALOG_LAYER" ],
	aDelayedLoadTrigger : [ "MSG_SE_OBJECT_EDIT_REQUESTED", "OBJECT_MODIFY",
			"MSG_SE_DUMMY_OBJECT_EDIT_REQUESTED",
			"TOGGLE_TOOLBAR_ACTIVE_LAYER", "SHOW_TOOLBAR_ACTIVE_LAYER" ],
	$init : function() {
		this.htOptions = nhn.husky.SE2M_Configuration.SE2B_CSSLoader;
		if (!jindo.$Agent().navigator().ie) {
			this.loadSE2CSS()
		} else {
			for ( var b = 0, c = this.aInstantLoadTrigger.length; b < c; b++) {
				this["$BEFORE_" + this.aInstantLoadTrigger[b]] = jindo.$Fn(
						function() {
							this.loadSE2CSS()
						}, this).bind()
			}
			for ( var b = 0, c = this.aDelayedLoadTrigger.length; b < c; b++) {
				var a = this.aDelayedLoadTrigger[b];
				this["$BEFORE_" + this.aDelayedLoadTrigger[b]] = jindo.$Fn(
						function(d) {
							var e = jindo.$A(arguments).$value();
							e = e.splice(1, e.length - 1);
							return this.loadSE2CSS(d, e)
						}, this).bind(a)
			}
		}
	},
	loadSE2CSS : function(a, b) {
		if (this.bCssLoaded) {
			return true
		}
		this.bCssLoaded = true;
		var c = null;
		if (a) {
			c = jindo.$Fn(this.oApp.exec, this.oApp).bind(a, b)
		}
		nhn.husky.SE2M_Utils.loadCSS(this.htOptions.sCSSBaseURI
				+ "/smart_editor2_items.css", c);
		return false
	}
});
nhn.husky.SE2B_Customize_ToolBar = jindo.$Class({
	name : "SE2B_Customize_ToolBar",
	$init : function(a) {
		this._assignHTMLElements(a)
	},
	$BEFORE_MSG_APP_READY : function() {
		this._addEventMoreButton()
	},
	_assignHTMLElements : function(a) {
		this.oAppContainer = a;
		this.elTextToolBarArea = jindo.$$.getSingle("div.se2_tool");
		this.elTextMoreButton = jindo.$$.getSingle("button.se2_text_tool_more",
				this.elTextToolBarArea);
		this.elTextMoreButtonParent = this.elTextMoreButton.parentNode;
		this.welTextMoreButtonParent = jindo
				.$Element(this.elTextMoreButtonParent);
		this.elMoreLayer = jindo.$$.getSingle("div.se2_sub_text_tool")
	},
	_addEventMoreButton : function() {
		this.oApp.registerBrowserEvent(this.elTextMoreButton, "click",
				"EVENT_CLICK_EXPAND_VIEW");
		this.oApp.registerBrowserEvent(this.elMoreLayer, "click",
				"EVENT_CLICK_EXPAND_VIEW")
	},
	$ON_EVENT_CLICK_EXPAND_VIEW : function(a) {
		this.oApp.exec("TOGGLE_EXPAND_VIEW", [ this.elTextMoreButton ]);
		a.stop()
	},
	$ON_TOGGLE_EXPAND_VIEW : function() {
		if (!this.welTextMoreButtonParent.hasClass("active")) {
			this.oApp.exec("SHOW_EXPAND_VIEW")
		} else {
			this.oApp.exec("HIDE_EXPAND_VIEW")
		}
	},
	$ON_CHANGE_EDITING_MODE : function(a) {
		if (a != "WYSIWYG") {
			this.elTextMoreButton.disabled = true;
			this.welTextMoreButtonParent.removeClass("active");
			this.oApp.exec("HIDE_EXPAND_VIEW")
		} else {
			this.elTextMoreButton.disabled = false
		}
	},
	$AFTER_SHOW_ACTIVE_LAYER : function() {
		this.oApp.exec("HIDE_EXPAND_VIEW")
	},
	$AFTER_SHOW_DIALOG_LAYER : function() {
		this.oApp.exec("HIDE_EXPAND_VIEW")
	},
	$ON_SHOW_EXPAND_VIEW : function() {
		this.welTextMoreButtonParent.addClass("active");
		this.elMoreLayer.style.display = "block"
	},
	$ON_HIDE_EXPAND_VIEW : function() {
		this.welTextMoreButtonParent.removeClass("active");
		this.elMoreLayer.style.display = "none"
	},
	$ON_RESET_TOOLBAR : function() {
		if (this.oApp.getEditingMode() !== "WYSIWYG") {
			return
		}
		this.oApp.exec("END_SPELLCHECK");
		this.oApp.exec("DISABLE_ALL_UI");
		this.oApp.exec("ENABLE_ALL_UI");
		this.oApp.exec("RESET_STYLE_STATUS");
		this.oApp.exec("CHECK_STYLE_CHANGE");
		this.oApp.exec("APPLY_FONTCOLOR", [ "#000000" ]);
		this.oApp.exec("HIDE_EXPAND_VIEW")
	}
});
if (typeof window.nhn == "undefined") {
	window.nhn = {}
}
var oMessageMap = {
	"SE_EditingAreaManager.onExit" : "내용이 변경되었습니다.",
	"SE_Color.invalidColorCode" : "색상 코드를 올바르게 입력해 주세요. \n\n 예) #000000, #FF0000, #FFFFFF, #ffffff, ffffff",
	"SE_Hyperlink.invalidURL" : "입력하신 URL이 올바르지 않습니다.",
	"SE_FindReplace.keywordMissing" : "찾으실 단어를 입력해 주세요.",
	"SE_FindReplace.keywordNotFound" : "찾으실 단어가 없습니다.",
	"SE_FindReplace.replaceAllResultP1" : "일치하는 내용이 총 ",
	"SE_FindReplace.replaceAllResultP2" : "건 바뀌었습니다.",
	"SE_FindReplace.notSupportedBrowser" : "현재 사용하고 계신 브라우저에서는 사용하실수 없는 기능입니다.\n\n이용에 불편을 드려 죄송합니다.",
	"SE_FindReplace.replaceKeywordNotFound" : "바뀔 단어가 없습니다",
	"SE_LineHeight.invalidLineHeight" : "잘못된 값입니다.",
	"SE_Footnote.defaultText" : "각주내용을 입력해 주세요",
	"SE.failedToLoadFlash" : "플래시가 차단되어 있어 해당 기능을 사용할 수 없습니다.",
	"SE2M_EditingModeChanger.confirmTextMode" : "텍스트 모드로 전환하면 작성된 내용은 유지되나, \n\n글꼴 등의 편집효과와 이미지 등의 첨부내용이 모두 사라지게 됩니다.\n\n전환하시겠습니까?",
	"SE2M_FontNameWithLayerUI.sSampleText" : "가나다라"
};