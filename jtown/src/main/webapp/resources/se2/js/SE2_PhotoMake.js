nhn.husky.SE2_PhotoMake = jindo.$Class({	
	name : "SE2_PhotoMake",
	$init : function(elAppContainer) {
		this._assignHTMLObjects(elAppContainer);
	},
	_assignHTMLObjects : function(elAppContainer) {
		this.oDropdownLayer =
			cssquery.getSingle("DIV.husky_seditor_PhotoMakeLayer", elAppContainer);
		
	},
	$ON_MSG_APP_READY : function() {
		this.oApp.exec("REGISTER_UI_EVENT", [ "PhotoMake", "click",
				"ATTACH_JSP_PHOTO_OPEN_WINDOW" ]);
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
		this.oPopupMgr = nhn.husky.PopUpManager.getInstance(this.oApp);
	},
	$ON_ATTACH_JSP_PHOTO_OPEN_WINDOW : function() {
		this.htPopupOption.sUrl = this.makePopupURL();
		this.htPopupOption.sProperties = "left=0,top=0,width=800,height=600,scrollbars=no,location=no,status=0,resizable=no";
		this.oPopupWindow = this.oPopupMgr
				.openWindow(this.htPopupOption);
		this.oApp.exec("FOCUS");
		return (!!this.oPopupWindow ? true : false);
	},
	makePopupURL : function() {
		//TODO 서버에 올릴 때 Jtown 삭제후 전송
		var a =  "/jtown/admin/file";
		return a;
	},
	$ON_SET_PHOTO_ONE : function(f) {
		var c, g, b;
		if (!f) {
			return
		}
		try {
			c = "";
			for ( var a = 0; a < f.length; a++) {
				b = f[a];
				if (!b.sAlign) {
					b.sAlign = "";
				}
				g = {
					sName : b.sFileName || "",
					sOriginalImageURL : b.sFileURL,
					bNewLine : b.bNewLine || false,
					nWidth : b.width,
					nHeight : b.height
				};
				c += this._getPhotoTag(g);
			}
			this.oApp.exec("PASTE_HTML", [ c ]);
		} catch (d) {
			return false;
		}
	},
	_getPhotoTag : function(b) {
		var a = '<img src="{=sOriginalImageURL}" title="{=sName}" width="{=nWidth}" height="{=nHeight}">';
		if (b.bNewLine) {
			a += '<br style="clear:both;">';
		}
		a = jindo.$Template(a).process(b);
		return a;
	}
});