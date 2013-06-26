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
	
	$('#jt-naturalLanguage-search').placeholder();
	
	jtown.naturalLanguage.autocomplete();
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
	var dialog = '<div style="text-align:center; margin-top: 15px; font-weight: bold; line-height : 16px;">'+message+'</div>';
	$(dialog).dialog({
		resizable: false, width: '300px', hegiht : '200px', modal : true, buttons : { 'Close' : function(){$(this).dialog('close'); } }
	});
	$('.ui-dialog-titlebar').removeClass('ui-widget-header');
	$('.ui-dialog-buttonset').css({'float' : 'none', 'text-align' : 'center'});
};

jtown.confirm = function(message, success, cancle){
	var dialog = '<div style="text-align:center; margin-top: 25px; font-weight: bold;">'+message+'</div>';
	$(dialog).dialog({
		resizable: false, width: '300px', hegiht : '200px', modal : true, buttons : { '확인' : function(){ success(); $(this).dialog('close');  }, '취소' : function(){ cancle(); $(this).dialog('close');} }
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
					img	: contextPath+'resources/images/jt-loading-02.gif' };
	$('#resendConfirmMail').unbind('click');
	jtown.postJSON(url, json, option, function(){
		jtown.dialog('E-mail을 재전송 하였습니다.');
		
		$('#resendConfirmMail').bind('click', function(){
			jtown.header.resendEmailAddress();
		});
	});
};

jtown.header.showLoginForm = function(){
	var inner = $('#jt-login-form-wrap'),
		j_username = inner.find('input[name=j_username]'),
		j_password = inner.find('input[name=j_password]');
	
	j_username.attr('id', 'j_username');
	j_password.attr('id', 'j_password');
	
	$.smartPop.open({ width : 430, height : 350, html : inner.html(), effect : null });	
	
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
			if(count.message == '1'){				
				jtown.header.showLoginForm();
			}else{
				jtown.dialog('판매자는 불가능합니다');
			}
		} else {
			var spn = count.sellerPn;
			var crudType = count.crudType;
			if (crudType == 'insert') {
				$('#jt-heart-click-'+spn).addClass('jt-heart-animation');
			} else if (crudType == 'delete') {
				$('#jt-heart-click-'+spn).removeClass('jt-heart-animation');
			}
			
			var expandShop = $('#jt-home-expand-shop');
			if (!nullValueCheck(expandShop.html())) {
				var expandSpn = expandShop.attr('data-spn');
				if (spn == expandSpn){
					if (crudType == 'insert') {
						$('#jt-heart-expand-click-'+spn).addClass('jt-heart-animation');
					} else if (crudType == 'delete') {
						$('#jt-heart-expand-click-'+spn).removeClass('jt-heart-animation');
					}
				}
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

		if(mainImages.length == 0){
			imageHtml +='<img alt="Blank" src="'+contextPath+'resources/images/jt-introduce-home-blank.png" title="'+ htmlChars(seller.name) + '"/>	';
		}
		for ( var j = 0, jLen = mainImages.length; j < jLen; j++) {
			var mainImage = mainImages[j];
			var imageSrc = contextPath + 'resources/uploadImage/'+ mainImage;
			if(nullValueCheck(imageSrc)){
				imageSrc = contextPath + 'resources/images/jt-introduce-home-blank.png';
			}
			imageHtml += '<img alt="" src="' + imageSrc + '" title="'+ htmlChars(seller.name) + '"/>	';
		}

		var loveClick = !nullValueCheck(seller.customerPn) ? 'jt-home-shop-love-click' : '';
		var loveTextClick = !nullValueCheck(seller.customerPn) ? 'jt-home-shop-love-text-click' : '';

		var loveHotCount = '<span class="jt-home-shop-love-hot">HOT</span>';
		if (nullValueCheck(seller.loveHotCount)  || seller.loveHotCount == 0 ) {
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
		html += '					<div class="jt-home-shop-new-event">';
		html += ' 					<span id="new-' + spn + '" class="jt-home-shop-event-new-image"  style="'+((seller.bannerDate != null && Number(seller.bannerDate) < 8) ? "": "display:none;") +'">event</span>';	
		html += '					</div>';
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
		html += '			<div class="jt-heart-click-wrap">';
		html += '				<div class="jt-heart-click-background" id="jt-heart-click-' + spn + '">';
		html += '					<img alt="heart-background" src="'+contextPath+'resources/images/heart-background.png">';
		html += '				</div>';
		html += '				<div class="jt-heart-click">';
		html += '				<a href="#none" onclick="jtown.home.clickLove(\'' + spn + '\');"id="love-image-' + spn + '" class="jt-home-shop-love ' + loveClick + '">♥</a>';
		html += '				</div>';
		html += '			</div>';
		html += '			<div class="jt-home-shop-content-love-text-wrap">';
		html += '				<span id="love-' + spn + '" class="' + loveTextClick + '">' + (nullValueCheck(seller.loveCount) ? 0 : seller.loveCount) + '</span>';
		html += '				' + loveHotCount;;
		html += '			</div>';
		html += '			</li>';
		html += '		</ul>';
		html += '	</div>';
	}
	return html;
};

if (typeof jtown.naturalLanguage == 'undefined') {
	jtown.naturalLanguage = {};
}

jtown.naturalLanguage.autocomplete = function(){
	$.widget( "custom.catcomplete", $.ui.autocomplete, {
	    _renderMenu: function( ul, items ) {
	      var that = this,
	        currentCategory = "";
	      $.each( items, function( index, item ) {
	        if ( item.category != currentCategory ) {
	          ul.append( '<li class="ui-autocomplete-category"><span class="ui-autocomplete-category-span">' + item.category + '</span></li>' );
	          currentCategory = item.category;
	        }
	        
	        that._renderItem = function( ul, item ) {
	            return $('<li>').append( '<a class="ui-catcomplete-menu-item">' + item.label + '</a>' ).appendTo( ul );
	        };
	        
	        that._renderItemData( ul, item );
	      });
	    }
	 });
	
	$('#jt-naturalLanguage-search').catcomplete({
		source : function(request, response){
			var url = contextPath + 'ajax/natural/autocomplete.jt',
				json = {	searchName : request.term  };
			
			$.postJSON(url, json, function(map){
				var jtownUsers = map.jtownUsers, interests = map.interests, data = [];
				
				for(var i=0, len = jtownUsers.length ; i< len; i++){
					var jtownUser = jtownUsers[i];
					data[i] = { label : jtownUser.name , value : jtownUser.name, pn : jtownUser.pn,  category : 'SHOP'};
				}
				for(var i=0, len = interests.length, size = jtownUsers.length ; i< len; i++){
					var interest = interests[i];
					data[i+size] = { label : interest.name , value : interest.name, categoryPn : interest.categoryPn, spn : interest.sectionPn, category : 'CATEGORY'};
				}
				response( data );
			});
		},
		minLength : 1,
		select : function(event, ui){
			var item = ui.item;
			if(item.category =='SHOP'){				
				location.href = contextPath + 'mir/'+item.pn;
			}else if(item.category =='CATEGORY'){
				location.href = contextPath + 'cpn/'+item.categoryPn+'/spn/'+item.spn;
			}
		},
		focus : function(event, ui){
			$('.ui-state-focus').removeClass('ui-corner-all').removeClass('ui-state-focus');
		},
		open :function(){
			$('.ui-autocomplete').removeClass('ui-widget-content').addClass('ui-catcomplete-content');
			$(this).addClass('ui-catcomplete-input');
			$('.ui-menu').css({padding : 0});
		},
		close : function(){
			$(this).removeClass('ui-catcomplete-input');
			$('#jt-naturalLanguage-search').val('');
		}
	});
	
};