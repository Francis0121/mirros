/*************************
 * MIT licensed
 *
 * Copyright (C) 2013 peoplegate - made by Francis ( Project : businessgate)
 * ***********************/
$(function() {
	// ~ Home
	
//	Sub Navigation View	
//	$('.jt-header-nav-interestCategory-li').bind('mouseover mouseout', function(event) {
//		jtown.toggleMouse($(this).find('.jt-header-nav-interest'), event.type);
//	});	
	
	$('#jt-mypage').bind('mouseover mouseout', function(event) {
		jtown.toggleMouse($('#jt-mypage-wrap'), event.type);
	});

	$('#jt-help').bind('mouseover mouseout', function(event) {
		jtown.toggleMouse($('#jt-help-wrap'), event.type);
	});
	
	$('.jt-header-menu').bind('mouseover mouseout', function(event) {
		jtown.toggleMouse($('.jt-header-nav-interestCategory'), event.type);
	});
	
	$('.jt-header-menu').bind('mouseover', function(event) {
		$('.jt-header-menu img').attr('src', contextPath+'resources/images/jt-top-menu2.png');
	});
	
	$('.jt-header-menu').bind('mouseout', function(event) {
		$('.jt-header-menu img').attr('src', contextPath+'resources/images/jt-top-menu.png');
	});
	
	jtown.comment.home();
	jtown.home.masonry.start();
	jtown.home.naturalLanguage();
	
	// ~ Expand
	
	jtown.expand.loadExpandShop();
	jtown.comment.syncComment();
	jtown.expand.gotoPage();
	
	// ~ Login

	$('#jt-login-smartPopup').bind('click', function(){
		jtown.login.showLoginForm();		
	});
	
	$('#resendConfirmMail').bind('click', function(){
		jtown.login.resendEmailAddress();
	});
	
	$('#jt-findUserPassword-btn').bind('click', function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['jtownUser'];
		form.submit();
	});
	
	$('#jt-findSellerPassword-btn').bind('click', function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['sellerUser'];
		form.submit();
	});
	
	$('#jt-emailAddress-user-btn').bind('click', function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['jtownUser'];
		form.submit();
	});
	
	jtown.regExp('email', 'input[data-type=create]', '#confirmEmail', 0, 50);
	jtown.regExp('onlyChar', 'input[data-type=createId]', '#confirmEmail', 0, 20);
	jtown.regExp('empty', 'input[data-form=joinPw]', '#passwordLength', 7, 16);
	jtown.regExp('onlyChar', 'input[data-form=join]', '#nameLength', 0, 20);
	jtown.regExp('empty', 'input[data-form=modify]', '#passwordLength', 7, 16);
	jtown.login.confirmPassword();
	jtown.login.joinFormSubmit();
	jtown.login.changeUserSubmit();
	jtown.login.disactiveUser();
	
	// ~ Help
		
	jtown.regExp('onlyChar', 'input[name=shopName]', '#shopNameCheck', 0, 30);
	jtown.regExp('email', 'input[name=email]', '#confirmEmail', 0, 50);
	jtown.regExp('euckr', 'input[data-form=partnership]', '#nameLength', 0, 10);
	jtown.regExp('number', 'input[name=phoneNumberSt]', '#confirmPhoneNumber', 0, 4);
	jtown.regExp('number', 'input[name=phoneNumberNd]', '#confirmPhoneNumber', 0, 4);
	jtown.regExp('number', 'input[name=phoneNumberRd]', '#confirmPhoneNumber', 0, 4);
	jtown.help.questionSync();
	
	$('#jt-partnership-btn').bind('click', function(){
		var form = document.forms['partnership'];
		$('#loading-popup').fadeIn();
		form.submit();
	});
	
	// ~ Board
	
	jtown.board.noticeWrite();
	
	// ~ Page
	
	$('#page-wrap').css('width', $('#page-wrap>div').width());
	
	// ~ Placeholder
	
	$('#jt-seller-main-textarea').placeholder();
	$('#jt-naturalLanguage-search').placeholder();
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
	
	// ~ Seller
	
	$('.jt-home-expand-shop-expandProducts').jCarouselLite({
		btnNext: ".jt-home-expand-shop-leftArrow",
		btnPrev: ".jt-home-expand-shop-rigthArrow",
		mouseWheel: true,
		speed : 300,
		btnGo : ['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9',
		         '.10', '.11', '.12', '.13', '.14', '.15', '.16', '.17', '.18', '.19', 
		         '.20', '.21', '.22', '.23', '.24', '.25', '.26', '.27', '.28', '.29' 	],
		afterEnd : function(e){
			setTimeout('jtown.seller.syncProduct()', 0);
		}
	});
});

jtown.loading = {
	start : function(){
		$('#loading-popup').fadeIn();
	},
	finish : function(){
		$('#loading-popup').fadeOut();
	}
};

jtown.postJSON = function(url, json, callback){
	
	jtown.loading.start();
	
	$.postJSON(url, json, function() {
		callback();
		jtown.loading.finish();
	});
};

jtown.dialog = function(message){
	var dialog = '<div style="text-align:center; margin-top: 15px; font-weight: bold; line-height : 16px;">'+message+'</div>';
	$(dialog).dialog({
		resizable: false, 
		width: '300px',
		hegiht : '200px', 
		zIndex :'999',
		modal : true, 
		buttons : { 
			'Close' : function(){ $(this).dialog('close'); } 
		}
	});
	$('.ui-dialog-titlebar').removeClass('ui-widget-header');
	$('.ui-dialog-buttonset').css({'float' : 'none', 'text-align' : 'center'});
};

jtown.reloadDialog = function(message){
	var dialog = '<div style="text-align:center; margin-top: 15px; font-weight: bold; line-height : 16px;">'+message+'</div>';
	$(dialog).dialog({
		resizable: false, 
		width: '300px',
		hegiht : '200px', 
		zIndex :'999',
		modal : true, 
		buttons : { 
			'Close' : function(){ $(this).dialog('close'); location.reload(); } 
		}
	});
	$('.ui-dialog-titlebar').removeClass('ui-widget-header');
	$('.ui-dialog-buttonset').css({'float' : 'none', 'text-align' : 'center'});
};

jtown.confirm = function(message, success, cancle){
	var dialog = '<div style="text-align:center; margin-top: 25px; font-weight: bold;">'+message+'</div>';
	$(dialog).dialog({
		resizable: false, 
		width: '300px', 
		hegiht : '200px', 
		modal : true, 
		buttons : { 
			'확인' : function(){ success(); $(this).dialog('close');  }, 
			'취소' : function(){ cancle(); $(this).dialog('close');} 
		}
	});
	$('.ui-dialog-titlebar').removeClass('ui-widget-header');
	$('.ui-dialog-buttonset').css({'float' : 'none', 'text-align' : 'center'});
};

jtown.toggleMouse = function(object, eventType){
	if(eventType == 'mouseover')
		object.show();
	else if(eventType == 'mouseout')
		object.hide();
};

jtown.regExp = function(category, name, target, first, last){
	if(nullValueCheck(category)) return;
	
	var regExp = null;
	if(category == 'email'){
		regExp = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
	}else if(category == 'onlyChar'){
		regExp = /^[0-9A-Za-z가-힣]*$/;
	}else if(category == 'empty'){
		regExp = /^.*$/;
	}else if(category == 'euckr'){
		regExp = /^[가-힣]*$/;
	}else if(category == 'number'){
		regExp = /^[0-9]*$/;
	}
	
	$(name).keyup(function() {
		var value = $(this).val(), length = $(this).val().length;
		if (regExp.test(value) && (length > first && length <= last)) {
			$(target).children('span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$(target).children('span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}		
	}).focus(function() {
		var value = $(this).val(), length = $(this).val().length;
		if (regExp.test(value) && (length > first && length <= last)) {
			$(target).children('span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$(target).children('span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
		$(target).show();
	}).blur(function() {
		$(target).hide();
	});
};

if (typeof jtown.home == 'undefined') {
	jtown.home = {};
}

jtown.home.masonry = {
	object : { 
		container : $('#jt-home-container')
	},
	start : function(){
		var $c = this.object.container;
		if(nullValueCheck($c.html())){
			return ;
		}
		$c.imagesLoaded(function(){
			$c.masonry({
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
		var $c = this.object.container;
		$c.scrollPagination({
			'contentPage'	: contextPath + 'ajax/homePagination.jt',
			'contentData'	: { 	'categoryPn'	: 	$c.attr('data-cpn'),
									'sectionPn'		: 	$c.attr('data-spn')	},
			'scrollTarget'	: $(window),
			'successCallback' : function(data){
				if($.browser.msie && $.browser.version == '7.0'){
					var html = $(jtown.home.html(data));
					$c.append(html).masonry('appended', html);
					$c.imagesLoaded(function(){
						$c.masonry('reload');
					});
				}else{
					var htmlArray = jtown.home.html(data);
					$c.append(htmlArray).masonry('appended',htmlArray);
					$c.imagesLoaded(function(){
						$c.masonry();
					});
				}
				$(".jt-home-shop-event-dday").css("visibility","visible");
				setTimeout('jtown.expand.loadExpandShop()', 0);
				setTimeout('jtown.comment.home()', 0);
			},
			'maxPage'		: $c.attr('data-maxPage')
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
		var $header = $('.jt-header-title'), $footer =$('.jt-footer'), scrollheight = { },
			isEmail = $footer.attr('data-isEmail'),
			isBrowser = ($.browser.msie && $.browser.version == '7.0') || ($.browser.msie && $.browser.version == '8.0'),			
			element = document.documentElement, body = document.body,
			scrollY = document.all ? (!element.scrollTop ? body.scrollTop : element.scrollTop) : (window.pageYOffset ? window.pageYOffset : window.scrollY);	
				
		if(isBrowser)
			scrollheight = isEmail ? { topHeight : '80px', downHeight : '35px'} : { topHeight : '50px', downHeight : '5px'}; 
		else
			scrollheight = isEmail ? { topHeight : '76px', downHeight : '31px'} : { topHeight : '46px', downHeight : '1px'};
		
		if(scrollY == 0){
			$footer.slideUp('fast');
			//$header.slideDown('fast');
			setTimeout('$(".jt-header-nav-interestCategory").css( { top : "'+scrollheight.topHeight+'" })', 0);
		}else{
			$footer.slideDown('fast');
			/*
			$header.slideUp('fast', function(){
				$('.jt-header-nav-interestCategory').css({ top : scrollheight.downHeight});
			});*/
		}
	}
};

jtown.home.clickProduct = function(spn,label, productPn) {
	ga('send', 'event', 'product', 'click', label);
	jtown.home.productStatisticClick(productPn);
	jtown.home.goHome(spn);
};

jtown.home.clickShop = function(spn) {
	$.postJSON(contextPath + 'ajax/clickView.jt', { sellerPn : spn }, function(){} );
};

jtown.home.goHome = function(spn) {
	$.postJSON(contextPath + 'ajax/goHome.jt', { sellerPn : spn }, function(){} );
};

jtown.home.clickLove = function(spn) {
	$.postJSON(contextPath + 'ajax/clickLove.jt', { sellerPn : spn }, function(count) {
		var spn = count.sellerPn, crudType = count.crudType, message = count.message,
			$small = $('#jt-heart-click-'+spn), $big = $('#jt-heart-expand-click-'+spn);
		if (!nullValueCheck(message)) {
			message == '1' ? jtown.login.showLoginForm() : jtown.dialog('판매자는 불가능합니다');
			return;
		} 
		
		if (crudType == 'insert') {
			$small.addClass('jt-heart-animation');
			$big.addClass('jt-heart-animation');
		} else if (crudType == 'delete') {
			$small.removeClass('jt-heart-animation');
			$big.removeClass('jt-heart-animation');
		}
	});
};

jtown.home.html = function(data) {
	var jtownUsers = data.jtownUsers, images = data.images, newComments = data.newComments, browser = $.browser,
		isIe7 = browser.msie && browser.version == '7.0',
		htmlArray = [], html = '';
	
	for ( var i = 0, len = jtownUsers.length; i < len; i++) {
		var seller = jtownUsers[i], spn = seller.pn, mainImages = images[spn], comments = newComments[spn],
			imageHtml = '', commentHtml = '',
			msieHtml = (isIe7 || (browser.msie && browser.version =='8.0')) ? '<div class="jt-home-shop-image-footer"></div>' : '' ,
			hotHtml = !(nullValueCheck(seller.loveHotCount) || seller.loveHotCount == 0 ) ? '<span class="jt-home-shop-love-hot" title="최근 뜨는 미니샵">HOT</span>' : '',
			loveClick = !nullValueCheck(seller.customerPn) ? 'jt-home-shop-love-click' : '',
			loveTextClick = !nullValueCheck(seller.customerPn) ? 'jt-home-shop-love-text-click' : '';
		
		if(mainImages.length == 0){
			imageHtml = '<img alt="Blank" src="'+contextPath+'resources/images/jt-introduce-home-blank.png" title="'+ htmlChars(seller.name) + '"/>	';
		}else{
			for ( var j = 0, jLen = mainImages.length; j < jLen; j++) {
				var mainImage = mainImages[j],
					imageSrc = contextPath + 'photo/thumbnail/'+mainImage.saveName+'represent.'+mainImage.type;
				if(mainImage.category == '0'){
					imageSrc = contextPath + 'resources/uploadImage/'+ mainImage.saveName;					
				}
				imageHtml += '<img alt="" src="' + imageSrc + '" title="'+ htmlChars(seller.name) + '"/>	';
			}
		}
		for(var j = 0, jLen = comments.length; j < jLen ; j++){
			var comment = comments[j];
			commentHtml +='<div class="jt-home-shop-comments" data-isSplit="'+comment.isSplit+'" data-copn="'+comment.commentPn+'">'+htmlChars(comment.splitHome);
			commentHtml +='</div>';
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
		html += '						<div id="new-' + spn + '" class="jt-home-shop-new-event-div" style="'+(seller.eventName !=null && seller.endDate >=0 ? "display: block;": "display:none;") +'">';
		html += ' 							<span class="jt-home-shop-event-new-image">New event</span>';	
		html += '						</div>';
		html += '					</div>';
		if(seller.eventName !=null && seller.endDate >=0){
		html += '						<div class="jt-home-shop-event-dday">';
		html += '							<div class="jt-home-shop-event-dday-event-name">';
		html += '								'+seller.eventName;
		html += '							</div>';
		html += '							<div class="jt-home-shop-event-dday-end-date">';
		html += '								'+seller.endDate +'일 남음';
		html += '							</div>';
		html += '						</div>';
		}
		html += '				</li>';
		html += '			</ul>';
		html += '		</div>';
		html += '		<div class="jt-home-notice">';
		html += '			<pre class="jt-home-shop-footer-text">'+ htmlChars(seller.notice) + '</pre>';
		html += '		</div>';
		if(comments.length > 0){
		html += '		<div class="jt-home-shop-comments-wrap">';	
		html += '			<div class="jt-home-shop-comments-bar"><img src="'+contextPath+'resources/images/jt-comment.png"></div>';
		html += '			'+commentHtml;
		html += '		</div>';
		}
		html += '		<ul class="jt-home-shop-content-fn">';
		html += '			<li>';
		html += '				<span class="jt-home-shop-view" title="최근 일주일간 방문수">VIEW</span>&nbsp;<span id="view-'+ spn+ '">'+ (nullValueCheck(seller.viewCount) ? 0 : seller.viewCount)+ '</span>';
		html += '			</li>';
		html += '			<li class="jt-home-shop-comment-wrap">';
		html += '				<span class="jt-home-shop-comment">COMMENT</span>&nbsp;<span id="comment-'+ spn+ '">'+ (nullValueCheck(seller.commentCount) ? 0 : seller.commentCount) + '</span>';
		html += '			</li>';
		html += '			<li class="jt-home-heart-click-wrap" onclick="jtown.home.clickLove(\'' + spn + '\');">';
		html += '			<div class="jt-heart-click-wrap">';
		html += '				<div class="jt-heart-click-background" id="jt-heart-click-' + spn + '">';
		html += '					<img alt="heart-background" src="'+contextPath+'resources/images/heart-background.png">';
		html += '				</div>';
		html += '				<div class="jt-heart-click">';
		html += '				<a href="#none" id="love-image-' + spn + '" class="jt-home-shop-love ' + loveClick + '">♥</a>';
		html += '				</div>';
		html += '			</div>';
		html += '			<div class="jt-home-shop-content-love-text-wrap">';
		html += '				<span id="love-' + spn + '" class="' + loveTextClick + '">' + (nullValueCheck(seller.loveCount) ? 0 : seller.loveCount) + '</span>';
		html += '				' + hotHtml;
		html += '			</div>';
		html += '			</li>';
		html += '		</ul>';
		html += '		'+msieHtml;
		html += '	</div>';
		
		if(!isIe7){	
			htmlArray[i] = $(html).get(0);
			html = '';					
		}
	}
	return !isIe7 ? htmlArray : html;
};

jtown.home.naturalLanguage = function(){
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
// HOME - javascript_CSS
jQuery(document).ready(function(){
	$(".jt-home-shop-comment-wrap").live({
		mouseenter : function(){
			$(this).find(".jt-home-shop-comment").css("background-position", "-15px -60px");
	},
		mouseleave: function(){
			$(this).find(".jt-home-shop-comment").css("background-position", "0px -60px");
	}});

	$(".jt-home-heart-click-wrap").live({
		mouseenter:function(){
			$(this).find(".jt-home-shop-love").css("background-position", "-15px -30px");
	},
		mouseleave: function(){
			$(this).find(".jt-home-shop-love").css("background-position", "0px -30px");
	}});
	$(".jt-home-shop-event-dday").css("visibility","visible");
	
	jtown.home.productStatisticClick = function(productPn){
		$.ajax({
	        url: contextPath+'ajax/productClick.jt',
	        type: 'POST',
	        data:{productPn : productPn },
	        success: function(data){}
	    });
	};
	
});
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
