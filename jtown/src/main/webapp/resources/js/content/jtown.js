$(function() {
	
	$('.jt-header-nav-interestCategory-li').bind('mouseover mouseout', function(event) {
		jtown.header.showSubNavigation($(this).find('.jt-header-nav-interest'), event.type);
	});
	
	$('#jt-login-smartPopup').bind('click', function(){
		jtown.header.showLoginForm();		
	});

	$('#jt-mypage').bind('mouseover mouseout', function(event) {
		jtown.header.showSubNavigation($('#jt-mypage-wrap'), event.type);
	});

	$('#jt-help').bind('mouseover mouseout', function(event) {
		jtown.header.showSubNavigation($('#jt-help-wrap'), event.type);
	});

	$('#resendConfirmMail').bind('click', function(){
		jtown.header.resendEmailAddress();
	});
	
	$('#jt-naturalLanguage-search').placeholder();
	
	jtown.naturalLanguage.autocomplete();
	
	if(!nullValueCheck($container.html())){
		jtown.home.masonry.start();
	}
	
	if(realPath == contextPath +'help/sQuestion.jt'){
		 setTimeout("$('html, body').animate({scrollTop: '680px'}, 'slow')",0);
	}else if(realPath == contextPath + 'help/cQuestion.jt'){
		setTimeout("$('html, body').animate({scrollTop: '100px'}, 'slow')",0);
	}else if(realPath == contextPath + 'login/disactive.jt'){
		setTimeout("$('html, body').animate({scrollTop: $(document).height()}, 'slow')",0);
	}
	
	$('#page-wrap').css('width', $('#page-wrap>div').width());
	$('#jt-comment-insert').placeholder(); 
	$('#username_findPassword').placeholder();
	$('#username_findSellerPassword').placeholder();
	$('#j_username_page, #j_password_page').placeholder();
	$('#partnership_content').placeholder();
	$('#cQuestion #name').placeholder();
	$('#cQuestion #email').placeholder();
	$('#sQuestion #shopPn').placeholder();
	$('#sQuestion #name').placeholder();
	$('#sQuestion #email').placeholder();
	$('#sQuestion #content').placeholder();
	$('#partnership #shopUrl').placeholder();
	$('#partnership #email').placeholder();
});

jtown.postJSON = function(url, json, option, callback){
	jtown.loading = {
		start : function(){
			$('#loading-popup').fadeIn();
		},
		finish : function(){
			$('#loading-popup').fadeOut();
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
		form = inner.find('form[name=jt-popup-login-form]'),
		j_username = inner.find('input[name=j_username]'),
		j_password = inner.find('input[name=j_password]');
	
	form.attr('id', 'jt-popup-login-form');
	j_username.attr('id', 'j_username');
	j_password.attr('id', 'j_password');
	
	$.smartPop.open({ width : 430, height : 350, html : inner.html(), effect : null });	
	
	form.attr('id', '');
	j_username.attr('id', '');
	j_password.attr('id', '');
	
	setTimeout('$(function() { $(\'#j_username, #j_password\').placeholder(); });', 0);
};

if (typeof jtown.home == 'undefined') {
	jtown.home = {};
}

var $container = $('#jt-home-container');

jtown.home.masonry = {
	start : function(){
		$container.imagesLoaded(function(){
			$container.masonry({
				itemSelector : '.jt-home-shop',
				columnWidth : 330,
				transitionDuration: 0.
			});
		});
		
		this.pagination();
		this.resize();
		this.scrollTop();
		$(window).scroll(this.move);
		$(window).resize(this.resize);
	},
	pagination : function(){
		$container.scrollPagination({
			'contentPage'	: contextPath + 'ajax/homePagination.jt',
			'contentData'	: { 	'categoryPn'	: 	Number($('#jt-home-container').attr('data-cpn')),
									'sectionPn'		: 	Number($('#jt-home-container').attr('data-spn'))	},
			'scrollTarget'	: $(window),
			'successCallback' : function(data){
				if($.browser.msie && $.browser.version == '7.0'){
					var html = jtown.home.html(data), $boxes = $(html);
					$container.imagesLoaded(function(){
						$container.append($boxes).masonry('appended', $boxes).masonry('reload');
					});
				}else{
					var htmlArray = jtown.home.html(data);
					$container.imagesLoaded(function(){
						$container.append(htmlArray).masonry('appended',htmlArray).masonry();
					});
				}

				setTimeout('jtown.expand.loadExpandShop()', 0);
			},
			'maxPage'		: $('#jt-home-container').attr('data-maxPage')
		});
	},
	resize : function(){
		var clientWidth = Number(window.document.body.clientWidth),
		widthItem = Math.floor(clientWidth/330);
	
		if(widthItem < 3 ) widthItem = 3;
		
		$('#jt-home-container').css({width : (widthItem*330), margin : 'auto'});
	},
	scrollTop : function(){
		$('#jt-scroll-top').bind('click', function(){
			$('html, body').animate({scrollTop:0}, 'slow');
		});
	},
	move : function(){
		
		var scrollheight = { topHeight : '46px', downHeight : '1px'}; 
		var isEmail = $('.jt-footer').attr('data-isEmail');
		BrowserDetect.init();
		if(isEmail){
			scrollheight = { topHeight : '76px', downHeight : '31px' }; 
		}
		if(!nullValueCheck(BrowserDetect.browser) && BrowserDetect.browser == 'Explorer'){
			if(!nullValueCheck(BrowserDetect.version) && BrowserDetect.version < 9){
				scrollheight = { topHeight : '50px', downHeight : '5px'}; 
				if(isEmail){
					scrollheight = { topHeight : '80px', downHeight : '35px'}; 
				}
			}
		}
		
		var element = document.documentElement;
		var body = document.body;
		var scrollY = document.all ? (!element.scrollTop ? body.scrollTop : element.scrollTop) : (window.pageYOffset ? window.pageYOffset : window.scrollY);
		if(scrollY == 0){
			$('.jt-header-title').slideDown('fast');
			setTimeout('$(".jt-header-nav-interestCategory").css("top", "'+scrollheight.topHeight+'")');
			setTimeout('$(".jt-footer").slideUp()',0);
		}else{
			$('.jt-header-title').slideUp('fast', function(){
				$('.jt-header-nav-interestCategory').css('top', scrollheight.downHeight);
				setTimeout('$(".jt-footer").slideDown()',0);
			});
		}
	}
};

jtown.home.clickShop = function(spn) {
	var url = contextPath + 'ajax/clickView.jt', 
	json = { sellerPn : spn };
	$.postJSON(url, json, function() {	});
};

jtown.home.goHome = function(spn) {
	var url = contextPath + 'ajax/goHome.jt', 
	json = { sellerPn : spn };
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
	var browser = $.browser;
	
	var htmlArray = [];
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

		var loveHotCount = '<span class="jt-home-shop-love-hot" title="최근 뜨는 미니샵">HOT</span>';
		if (nullValueCheck(seller.loveHotCount)  || seller.loveHotCount == 0 ) {
			loveHotCount = '';
		}
		
		var msieHtml = '';
		if(browser.msie){
			if(browser.version == '7.0' || browser.version =='8.0' ){
				msieHtml = '<div class="jt-home-shop-image-footer"></div>';
			}
		}

		html += '	<div class="jt-home-shop" id="jt-home-shop-' + spn + '"  data-spn="' + spn + '">';
		html += '		<header>';
		html += '			<a href="' + seller.shopUrl + '" target="_blank" onclick="jtown.home.goHome(\'' + spn + '\')">' + htmlChars(seller.name) + '</a>';
		html += '		</header>';
		html += '		<div class="jt-home-shop-content">';
		html += '			<ul class="jt-home-shop-content-image">';
		html += '				<li>';
		html += '					' + imageHtml;
		html += '					<div class="jt-home-shop-new-event">';
		html += '						<div id="new-product-' + spn + '" class="jt-home-shop-new-event-div" style="'+( (seller.newProduct > 0 ) ? "display: block;": "display:none;") +'">';
		html += ' 							<span class="jt-home-shop-product-new-image">New arrive</span>';	
		html += '						</div>';
		html += '						<div id="new-' + spn + '" class="jt-home-shop-new-event-div" style="'+(seller.newBanner ? "display: block;": "display:none;") +'">';
		html += ' 							<span class="jt-home-shop-event-new-image">New event</span>';	
		html += '						</div>';
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
		html += '				<span class="jt-home-shop-view" title="최근 일주일간 방문수">VIEW</span>&nbsp;<span id="view-'+ spn+ '">'+ (nullValueCheck(seller.viewCount) ? 0 : seller.viewCount)+ '</span>';
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
		html += '		'+msieHtml;
		html += '	</div>';
		
		if(!(browser.msie && browser.version == '7.0')){	
			htmlArray[i] = $(html).get(0);
			html = '';					
		}
	}
	if(!(browser.msie && browser.version == '7.0')){
		return htmlArray;		
	}else{
		return html;
	}
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
					data[i+size] = { label : interest.naturalName , value : interest.naturalName, categoryPn : interest.categoryPn, spn : interest.sectionPn, category : 'CATEGORY'};
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