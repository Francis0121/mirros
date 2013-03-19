if (typeof jtown == 'undefined') {
	jtown = {};
}

if (typeof jtown.header == 'undefined') {
	jtown.header = {};
}

$(document).ready(function(){
	$('#jt-login-smartPopup').unbind('click');
	$('#jt-login-smartPopup').bind('click', function() {
		var inner = $('#jt-login-form-wrap');
		$.smartPop.open({
			width : 400,
			height : 270,
			html : inner.html(),
			effect : null
		});
	});
	
	$('.jt-header-nav-interestCategory-li').unbind('mouseover mouseout');
	$('.jt-header-nav-interestCategory-li').bind('mouseover mouseout', function(event){
		var $interest = $(this).find('.jt-header-nav-interest');
		if(event.type == 'mouseover'){
			$interest.show();
		}else if(event.type =='mouseout'){
			$interest.hide();
		}
	});
	
	$('#jt-mypage').unbind('mouseover mouseout');
	$('#jt-mypage').bind('mouseover mouseout', function(event){
		var mypage = $('#jt-mypage-wrap');
		if(event.type == 'mouseover'){
			mypage.show();
		}else if(event.type =='mouseout'){
			mypage.hide();
		}	
	});
	
	$('#jt-help').unbind('mouseover mouseout');
	$('#jt-help').bind('mouseover mouseout', function(event){
		var help = $('#jt-help-wrap');
		if(event.type == 'mouseover'){
			help.show();
		}else if(event.type =='mouseout'){
			help.hide();
		}	
	});
	
	$('#jt-person-addInterest').unbind('click');
	$('#jt-person-addInterest').bind('click', function(){
		jtown.header.addInterest(1);
	});
	
	jtown.header.syncNavMove();
	
	jtown.header.syncNavInterest();
});

jtown.header.addInterest = function(pn){
	
	var url = contextPath + 'ajax/getNavInterest.jt',
		json = { 'categoryPn' : pn };
	
	$.postJSON(url, json, function(data){
		var interestSections = data.interestSections,
			interestCategories = data.interestCategories,
			pn = data.pn;
		
		var innerHtml = '';
		innerHtml += '<div id="jt-addInterest-wrap" data-categoryPn="'+pn+'" data-categoryLen="'+interestCategories.length+'">';
		innerHtml += '	<div class="jt-addInterest-arrow">';
		innerHtml += '		<a href="#none" id="jt-addInterest-leftArrow">&lt;</a>';
		innerHtml += '	</div>';
		innerHtml += '	<div id="jt-interest-tag">';
		for(var i=0, len = interestSections.length; i<len; i++){
			var interestSection = interestSections[i];
			innerHtml += '<a href="#none" class="jt-interestSection-click" data-sectionPn="'+interestSection.sectionPn+'">'+interestSection.name + '</a>&nbsp;';
			if(i%5 == 4){
				innerHtml +='<br/>';
			}
		}
		innerHtml += '	</div>';
		innerHtml += '	<div>';
		innerHtml += '		<a href="#none" id="jt-addInterest-rightArrow">&gt;</a>';
		innerHtml += '	</div>';
		innerHtml += '</div>';
		$.smartPop.open({
			width : 800,
			height : 525,
			html : innerHtml,
			categoryFn : function(){document.location.reload();},
			effect : null
		});
		
		setTimeout('jtown.header.addInterestSync()', 0);
	});
};

jtown.header.addInterestSync = function(){
	
	$('#jt-addInterest-leftArrow').unbind('click');
	$('#jt-addInterest-leftArrow').bind('click', function(){
		var categoryPn = Number($('#jt-addInterest-wrap').attr('data-categoryPn')) - 1;
		jtown.header.addInterest(categoryPn);
	});
	
	$('#jt-addInterest-rightArrow').unbind('click');
	$('#jt-addInterest-rightArrow').bind('click', function(){
		var categoryPn = Number($('#jt-addInterest-wrap').attr('data-categoryPn')) + 1;
		jtown.header.addInterest(categoryPn);
	});
	
	$('.jt-interestSection-click').unbind('click');
	$('.jt-interestSection-click').bind('click', function(){
		var parent = $(this).parents('#jt-addInterest-wrap');
		var categoryPn = parent.attr('data-categoryPn');
		var sectionPn = $(this).attr('data-sectionPn');
		var sectionName = $(this).html();
		jtown.header.insertInterestSectionPn(categoryPn, sectionPn, sectionName);
	});
};

jtown.header.insertInterestSectionPn = function(categoryPn, sectionPn, sectionName){
	var url = contextPath+'ajax/navInterestInsert.jt';
	var json = { 	'categoryPn'	: 	categoryPn,
					'sectionPn'		:	sectionPn,
					'name'			:	sectionName	};		
	$.postJSON(url, json, function(data){
	
	});
};

jtown.header.syncNavMove = function(){
	$('.jt-header-nav-right').unbind('click');
	$('.jt-header-nav-right').bind('click', function(){
		var scrollWidth = Number($('.jt-header-nav-scroll').width()),
			allWidth =  Number($('.jt-header-nav-all').width()),
			gapWith = scrollWidth - allWidth,
			allLeftText = $('.jt-header-nav-all').css('left'),
			allLeftWidth = Number(allLeftText.replace('px', '')),
			moveWidth = Number(0);
		
		if(gapWith < allLeftWidth){
			moveWidth = allLeftWidth + -(scrollWidth/2);
			if(moveWidth < gapWith){
				moveWidth = gapWith;
			}
			$('.jt-header-nav-all').animate({
				left : moveWidth+'px'
			}, 500);	
		}
	});
	
	$('.jt-header-nav-left').unbind('click');
	$('.jt-header-nav-left').bind('click', function(){
		var scrollWidth = Number($('.jt-header-nav-scroll').width()),
			allLeftText = $('.jt-header-nav-all').css('left'),
			allLeftWidth = Number(allLeftText.replace('px', '')),
			moveWidth = Number(0);
		
		if(0 > allLeftWidth){
			moveWidth = allLeftWidth + (scrollWidth/2);
			if(moveWidth > 0){
				moveWidth = 0;
			}
			$('.jt-header-nav-all').animate({
				left : moveWidth+'px'
			}, 500);	
		}
	});
	
//	$('.jt-header-nav-all').children('li').unbind('click');
//	$('.jt-header-nav-all').children('li').bind('click', function(){
//		var left = Number($(this).position().left) - 1;
//		$('.jt-header-nav-all').animate({
//			left : '-'+left+'px'
//		}, 500);	
//	});
};

jtown.header.syncNavInterest = function(){
	$('.jt-header-nav-down').unbind('mouseover mouseout');
	$('.jt-header-nav-down').bind('mouseover mouseout', function(event){
		if(event.type == 'mouseover'){
			$(this).find('.jt-header-nav-down-delete').show();
		}else if(event.type == 'mouseout'){
			$(this).find('.jt-header-nav-down-delete').hide();
		}
	});
	
	$('.jt-header-nav-down-delete').unbind('click');
	$('.jt-header-nav-down-delete').bind('click', function(){
		jtown.header.navInterestDelete($(this));
	});
};

jtown.header.navInterestDelete = function(me){
	var $parent = me.parents('.jt-header-nav-down'),
		cpn = $parent.attr('data-cpn'),
		spn = $parent.attr('data-spn');
	var url = contextPath + 'ajax/navInterestDelete.jt',
		json = {	'categoryPn'	:	cpn,
					'sectionPn'		:	spn		};
	
	$.postJSON(url, json, function(){
		$parent.remove();		
	});
	
};

if (typeof jtown.home == 'undefined') {
	jtown.home = {};
}

jtown.home.clickShop = function(spn, href){
	var url = contextPath + 'ajax/clickShop.jt',
		json = {	'sellerPn' :	spn	};
	
	$.postJSON(url, json, function(){
		window.open('http://'+href);			
	});
};

jtown.home.clickLove = function(spn){
	var url = contextPath + 'ajax/clickLove.jt',
	json = {	'sellerPn'	:	spn};

	$.postJSON(url, json, function(count){
		if(!nullValueCheck(count.message)){
			alert(count.message);
		}
	});
};

jtown.home.html = function(data){
	var jtownUsers = data.jtownUsers;
	var images = data.images;
	
	var html = '';
	for(var i=0, len=jtownUsers.length; i<len ; i++){
		var seller = jtownUsers[i],
			spn = seller.pn,
			mainImages = images[spn],
			bannerDate = seller.bannerDate;
		
		var imageHtml = '';
		for(var j=0, jLen = mainImages.length; j < jLen ; j++){
			var mainImage = mainImages[j];
			var imageSrc = contextPath + 'resources/uploadImage/'+ ( (mainImage == null )? '8.jpg' : mainImage );
			imageHtml+='<img alt="" src="'+imageSrc+'" title="'+htmlChars(seller.shopName)+'"/>	';
		}
		
		html+='	<div class="jt-home-shop" id="jt-home-shop-'+spn+'">';
		html+='		<header>';
		html+='			<a href="#none" onclick="jtown.home.clickShop(\''+spn+'\', \''+htmlChars(seller.shopUrl)+'\')">'+htmlChars(seller.shopName)+'</a>';
		html+='		</header>';
		html+='		<div class="jt-home-shop-content">';
		html+='			<ul class="jt-home-shop-content-image" data-spn="'+spn+'">';
		html+='				<li>';
		html+='					'+imageHtml;
		html+='				</li>';
		html+='			</ul>';
		html+='		</div>';
		html+='		<div class="jt-home-notice">';
		html+='			<span class="jt-home-shop-footer-firstQuotationMark">"</span>';
		html+='			<pre class="jt-home-shop-footer-text">'+htmlChars(seller.notice)+'</pre>';
		html+='			<span class="jt-home-shop-footer-lastQuotationMark">"</span>';
		html+='		</div>';
		html+='		<ul class="jt-home-shop-content-fn">';
		html+='			<li>';
		html+='				<span class="jt-home-shop-view">VIEW</span>&nbsp;<span id="view-'+spn+'">'+( nullValueCheck(seller.viewCount) ? 0 : seller.viewCount )+'</span>';	
		html+='			</li>';
		html+='			<li>';
		html+='				<a href="#none" onclick="jtown.home.clickLove(\''+spn+'\');" class="jt-home-shop-love">♥</a>&nbsp;<span id="love-'+spn+'">'+ ( nullValueCheck(seller.loveCount) ? 0 : seller.loveCount) + '</span>';
		html+='				<span id="new-'+spn+'">';
		html+='					'+ ( bannerDate == null && Number(bannerDate) < 7 ) ? 'new' : '' ;
		html+='				</span>';
		html+='			</li>';
		html+='			<li>';
		html+='				<span class="jt-home-shop-comment">COMMENT</span>&nbsp;<span id="comment-'+spn+'">'+ ( nullValueCheck(seller.commentCount) ? 0 : seller.commentCount )+ '</span>';
		html+='			</li>';
		html+='		</ul>';
		html+='	</div>';
	}
	return html;
};

