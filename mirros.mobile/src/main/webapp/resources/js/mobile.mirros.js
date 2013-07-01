$(function(){
	
	$('.mm-home-nav-title').toggle(function(){
		$('.mm-home-sub-nav').hide();
		$(this).parents('li').find('.mm-home-sub-nav').slideDown();
	}, function(){
		$(this).parents('li').find('.mm-home-sub-nav').slideUp();
	});
	
	
	mobile.homeSync();
});

mobile.homeSync = function(){
	$('.mm-home-love').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');
		var url = contextPath + '/ajax/clickLove.jt', 
			json = { sellerPn : spn };
		
		$.postJSON(url, json, function(count) {
			if (!nullValueCheck(count.message)) {
				if(count.message == '1'){				
					location.href = contextPath+'/login';
				}else{
					alert('판매자는 불가능합니다');
				}
			} else {
				var crudType = count.crudType;
				var background = parent.find('.mm-love-click-background');
				if (crudType == 'insert') {
					background.addClass('mm-love-animation');
				} else if (crudType == 'delete') {
					background.removeClass('mm-love-animation');
				}
			}
		});
	});
	
	$('.mm-home-article-header>a').unbind('click').bind('click',function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');
		
		$.postJSON(contextPath + '/ajax/goHome.jt', { sellerPn : spn }, function() { });
	});
	
	$('.mm-home-mainImage').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');

		location.href= contextPath + '/mir/'+spn;
	});
	
	$('.mm-home-comment').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');

		location.href= contextPath + '/mir/'+spn;
	});
};

mobile.homeHtml = function(data) {
	var jtownUsers = data.jtownUsers;
	var images = data.images;
	
	var html = '';
	for ( var i = 0, len = jtownUsers.length; i < len; i++) {
		var seller = jtownUsers[i], spn = seller.pn, mainImages = images[spn];

		var imageHtml = '';

		if(mainImages.length == 0){
			imageHtml +='<img alt="Main Image Blank" src="'+contextPath+'/resources/images/jt-introduce-home-blank.png" title="'+ htmlChars(seller.name) + '"/>	';
		}
		for ( var j = 0, jLen = mainImages.length; j < jLen; j++) {
			var mainImage = mainImages[j];
			var imageSrc = webPath + '/resources/uploadImage/'+ mainImage;
			imageHtml += '<img alt="Main Image" src="' + imageSrc + '" title="'+ htmlChars(seller.name) + '"/>	';
		}

		var loveClick = !nullValueCheck(seller.customerPn) ? 'mm-home-love-click' : '';
		var loveTextClick = !nullValueCheck(seller.customerPn) ? 'mm-home-love-number-click' : '';

		var loveHotCount = '<span class="mm-home-hot" title="최근 뜨는 미니샵">HOT</span>';
		var loveWidth = '66';
		if (nullValueCheck(seller.loveHotCount)  || seller.loveHotCount == 0 ) {
			loveHotCount = '';
			loveWidth = '39';
		}
		
		html += '<article class="mm-home-article" data-spn="' + spn + '">';
		html += '	<header class="mm-home-article-header">';
		html += '		<a href="http://' + seller.shopUrl + '" target="_blank">' + htmlChars(seller.name) + '</a>';
		html += '	</header>';
		html += '	<article>';
		html += '		<ul class="mm-home-mainImage">';
		html += '			<li>';
		html += '				' + imageHtml;
		html += '				<div>';
		html += '					<span id="new-' + spn + '" style="'+((seller.bannerDate != null && Number(seller.bannerDate) < 8) ? "": "display:none;") +'">Event</span>';	
		html += '				</div>';
		html += '			</li>';
		html += '		</ul>';
		html += '		<div>';
		html += '			<div class="mm-home-article-quotationmark-first"><span>"</span></div>';
		html += '			<pre class="mm-home-article-notice">'+ htmlChars(seller.notice) + '</pre>';
		html += '			<div class="mm-home-article-quotationmark-last"><span>"</span></div>';
		html += '		</div>';
		html += '	</article>';
		html += '	<footer>';
		html += '		<ul>';
		html += '			<li>';
		html += '				<div style="width: 35px;">';
		html += '					<span class="mm-home-view" title="최근 일주일간 방문수">View</span><span  class="mm-home-number" id="view-'+ spn+ '">'+ (nullValueCheck(seller.viewCount) ? 0 : seller.viewCount)+ '</span>';
		html += '				</div>';
		html += '			</li>';
		html += '			<li>';
		html += '				<div style="width: 35px;">';
		html += '					<span class="mm-home-comment">Comment</span><span class="mm-home-number" id="comment-'+ spn+ '">'+ (nullValueCheck(seller.commentCount) ? 0 : seller.commentCount) + '</span>';
		html += '				</div>';
		html += '			</li>';
		html += '			<li>';
		html += '				<div style="width: '+loveWidth+'px;">';
		html += '					<div class="mm-love-click-wrap">';
		html += '						<div class="mm-love-click-background" id="jt-heart-click-' + spn + '">';
		html += '							<img alt="Love Background" src="'+contextPath+'/resources/images/heart-background.png">';
		html += '						</div>';
		html += '						<div class="mm-love-click">';
		html += '							<span class="mm-home-love ' + loveClick + '" id="love-image-' + spn + '">Love</a>';
		html += '						</div>';
		html += '					</div>';
		html += '					<div>';
		html += '						<span id="love-' + spn + '" class="mm-home-number ' + loveTextClick + '">' + (nullValueCheck(seller.loveCount) ? 0 : seller.loveCount) + '</span>';
		html += '					</div>';
		html += '					' + loveHotCount;
		html += '				</div>';
		html += '			</li>';
		html += '		</ul>';
		html += '	</footer>';
		html += '</article>';
	}
	return html;
};