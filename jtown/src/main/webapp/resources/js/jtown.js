$(function() {
	
	$('.jt-header-nav-interestCategory-li').unbind('mouseover mouseout').bind('mouseover mouseout', function(event) {
		jtown.header.showSubNavigation($(this).find('.jt-header-nav-interest'), event.type);
	});
	
	$('#jt-login-smartPopup').unbind('click').bind('click', function(){
		jtown.header.showLoginForm();		
	});

	$('#jt-mypage').unbind('mouseover mouseout').bind('mouseover mouseout', function(event) {
		jtown.header.showSubNavigation($('#jt-mypage-wrap'), event.type);
	});

	$('#jt-help').unbind('mouseover mouseout').bind('mouseover mouseout', function(event) {
		jtown.header.showSubNavigation($('#jt-help-wrap'), event.type);
	});

	$('#resendConfirmMail').unbind('click').bind('click', function(){
		jtown.header.resendEmailAddress();
	});

});

jtown.postJSON = function(url, json, option, callback){
	jtown.loading = {
		start : function(){
			$(option.position).append('<div id="jtown-loading"><img alt="Loading.." src="'+option.img+'" /></div>');
		},
		finish : function(){
			$('#jtown-loading').remove();
		}
	};
	jtown.loading.start();
	
	$.postJSON(url, json, function() {
		callback();
		jtown.loading.finish();
	});
};

jtown.dialog = function(message){
	var dialog = '<div style="text-align:center; margin-top: 25px; font-weight: bold;">'+message+'</div>';
	$(dialog).dialog({
		resizable: false, width: '300px', hegiht : '200px', modal : true, buttons : { 'Close' : function(){$(this).dialog('close');} }
	});
	$('.ui-dialog-titlebar').removeClass('ui-widget-header');
	$('.ui-dialog-buttonset').css({'float' : 'none', 'text-align' : 'center'});
};


if (typeof jtown.header == 'undefined') {
	jtown.header = {};
}

jtown.header.showSubNavigation = function(object, eventType){
	if(eventType == 'mouseover')
		object.show();
	else if(eventType == 'mouseout')
		object.hide();
};

jtown.header.resendEmailAddress = function() {
	var url = contextPath + 'ajax/resendConfirmEmail.jt',
		json = {},
		option = { 	position : '.jt-header-warning-confirmEmail',
					img	: contextPath+'/resources/images/jt-loading-02.gif' };
	
	jtown.postJSON(url, json, option, function(){
		jtown.dialog('E-mail을 재전송 하였습니다.');
	});
};

jtown.header.showLoginForm = function(){
	var inner = $('#jt-login-form-wrap'),
		j_username = inner.find('input[name=j_username]'),
		j_password = inner.find('input[name=j_password]');
	
	j_username.attr('id', 'j_username');
	j_password.attr('id', 'j_password');
	
	$.smartPop.open({ width : 420, height : 330, html : inner.html(), effect : null });	
	
	j_username.attr('id', '');
	j_password.attr('id', '');
	
	setTimeout('$(function() { $(\'#j_username, #j_password\').placeholder(); });', 0);
};

if (typeof jtown.home == 'undefined') {
	jtown.home = {};
}

jtown.home.clickShop = function(spn) {
	var url = contextPath + 'ajax/clickShop.jt', 
	json = {
		sellerPn : spn
	};
	$.postJSON(url, json, function() {	});
};

jtown.home.clickLove = function(spn) {
	var url = contextPath + 'ajax/clickLove.jt', 
	json = {
		sellerPn : spn
	};

	$.postJSON(url, json, function(count) {
		if (!nullValueCheck(count.message)) {
			jtown.header.showLoginForm();
		} else {
			var crudType = count.crudType;

			if (crudType == 'insert') {
				$('#love-image-' + spn).addClass('jt-home-shop-love-click');
				$('#love-' + spn).addClass('jt-home-shop-love-text-click');
				$('#love-expand-image-' + spn).addClass('jt-home-shop-love-click');
				$('#love-expand-' + spn).addClass('jt-home-shop-love-text-click');
			} else if (crudType == 'delete') {
				$('#love-image-' + spn).removeClass('jt-home-shop-love-click');
				$('#love-' + spn).removeClass('jt-home-shop-love-text-click');
				$('#love-expand-image-' + spn).removeClass('jt-home-shop-love-click');
				$('#love-expand-' + spn).removeClass('jt-home-shop-love-text-click');
			}
		}
	});

};

jtown.home.html = function(data) {
	var jtownUsers = data.jtownUsers;
	var images = data.images;

	var html = '';
	for ( var i = 0, len = jtownUsers.length; i < len; i++) {
		var seller = jtownUsers[i], spn = seller.pn, mainImages = images[spn];

		var imageHtml = '';
		for ( var j = 0, jLen = mainImages.length; j < jLen; j++) {
			var mainImage = mainImages[j];
			var imageSrc = contextPath + 'resources/uploadImage/'+ ((mainImage == null) ? '8.jpg' : mainImage);
			imageHtml += '<img alt="" src="' + imageSrc + '" title="'+ htmlChars(seller.name) + '"/>	';
		}

		var loveClick = !nullValueCheck(seller.customerPn) ? 'jt-home-shop-love-click' : '';
		var loveTextClick = !nullValueCheck(seller.customerPn) ? 'jt-home-shop-love-text-click' : '';

		var loveHotCount = '<span class="jt-home-shop-love-hot">HOT</span>';
		if (nullValueCheck(seller.loveHotCount)) {
			loveHotCount = '';
		}

		html += '	<div class="jt-home-shop" id="jt-home-shop-' + spn + '"  data-spn="' + spn + '">';
		html += '		<header>';
		html += '			<a href="http://' + seller.shopUrl + '" target="_blank" onclick="jtown.home.clickShop(\'' + spn + '\')">' + htmlChars(seller.name) + '</a>';
		html += '		</header>';
		html += '		<div class="jt-home-shop-content">';
		html += '			<ul class="jt-home-shop-content-image">';
		html += '				<li>';
		html += '					' + imageHtml;
		html += '				</li>';
		html += '			</ul>';
		html += '		</div>';
		html += '		<div class="jt-home-notice">';
		html += '			<span class="jt-home-shop-footer-firstQuotationMark">"</span>';
		html += '			<pre class="jt-home-shop-footer-text">'+ htmlChars(seller.notice) + '</pre>';
		html += '			<span class="jt-home-shop-footer-lastQuotationMark">"</span>';
		html += '		</div>';
		html += '		<ul class="jt-home-shop-content-fn">';
		html += '			<li>';
		html += '				<span class="jt-home-shop-view">VIEW</span>&nbsp;<span id="view-'+ spn+ '">'+ (nullValueCheck(seller.viewCount) ? 0 : seller.viewCount)+ '</span>';
		html += '			</li>';
		html += '			<li>';
		html += '				<span class="jt-home-shop-comment">COMMENT</span>&nbsp;<span id="comment-'+ spn+ '">'+ (nullValueCheck(seller.commentCount) ? 0 : seller.commentCount) + '</span>';
		html += '			</li>';
		html += '			<li>';
		html += '				' + loveHotCount;
		html += '				<a href="#none" onclick="jtown.home.clickLove(\'' + spn + '\');"id="love-image-' + spn + '" class="jt-home-shop-love ' + loveClick + '">♥</a>&nbsp;<span id="love-' + spn + '" class="' + loveTextClick + '">' + (nullValueCheck(seller.loveCount) ? 0 : seller.loveCount) + '</span>';
		html += '				<span id="new-' + spn + '">';
		html += '					'+ ((seller.bannerDate != null && Number(seller.bannerDate) < 8) ? 'new': '');
		html += '				</span>';
		html += '			</li>';
		html += '		</ul>';
		html += '	</div>';
	}
	return html;
};
