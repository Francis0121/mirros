if (typeof jtown.expand == 'undefined') {
	jtown.expand = {};
}

jtown.expand.show = true;

jtown.expand.loadExpandShop = function(){
	$('.jt-home-shop-content-image').unbind('click').bind('click', function(){
		var parent = $(this).parents('.jt-seller-main');
		
		if(nullValueCheck(parent.html())){
			var jtHomeShop = $(this).parents('.jt-home-shop'),
				spn = jtHomeShop.attr('data-spn');
			jtown.expand.makeInnerHtml(spn);	
		}
	});
	
	$('.jt-home-shop-comment-wrap').unbind('click').bind('click', function(){
		var $parent = $(this).parents('.jt-seller-main');
		
		if(nullValueCheck($parent.html())){
			var jtHomeShop = $(this).parents('.jt-home-shop'),
			spn = jtHomeShop.attr('data-spn');
			jtown.expand.makeInnerHtml(spn);
		}
	});
};

jtown.expand.makeInnerHtml = function(spn){
	var url = contextPath + 'ajax/home/expandShop.jt',
		json = { 'pn' : spn };
	
	$.postJSON(url, json, function(selectMap){
		var html ='';
		var event1 = selectMap.event1, 
			event2 = selectMap.event2, 
			products = selectMap.products, 
			jtownUser = selectMap.jtownUser,
			comments = selectMap.comments,
			commentTops = selectMap.commentTops,
			commentFilter = selectMap.commentFilter,
			interests = selectMap.interestes,
			cpn = selectMap.cpn,
			best = false,
			loveHave = selectMap.loveHave,
			firstBannerInfo = selectMap.firstBannerInfo,
			secondBannerInfo = selectMap.secondBannerInfo;
		
		var userName = htmlChars(jtownUser.name);
		ga('send', 'pageview', {
			  'page': '/ajax/home/expandShop.jt?pn=' + spn,
			  'title': userName
			});
		
		var productSize = Number(products.length);
		var bigProductHtml = '';
		var smallProductHtml = '';
		for(var i=0; i<productSize; i++){
			var product = products[i];
			
			var detailProduct  = '<span title="'+htmlChars(nullValueCheck(product.name) ? '' : product.name)+'">'+htmlChars(nullValueCheck(product.name) ? '' : product.name)+'</span>';
				detailProduct += '<span>'+htmlChars(nullValueCheck(product.commaPrice) ? '' : product.commaPrice)+'</span>';
			
			if(nullValueCheck(product.name) || nullValueCheck(product.commaPrice)){
				detailProduct = '<span>상품 정보가 아직</span><span>입력되지 않았습니다.</span>';
			}
			var image = contextPath + 'photo/thumbnail/'+product.saveName+'product.'+product.imageType;
			if(product.imageCategory == '0'){
				image = contextPath + 'resources/uploadImage/'+product.saveName;
			}
			bigProductHtml += '	<li class="jt-home-expand-shop-expandProduct">';
			bigProductHtml += '		<a href="'+ ( nullValueCheck(product.url) ? jtownUser.shopUrl : product.url  )+'" target="_blank" onclick="jtown.home.clickProduct('+spn+',\''+userName+': '+product.name+'\');"><img alt="상품" src="'+image+'"/></a>';
			bigProductHtml += '		<div class="jt-product-article-object-wrap jt-product-article-object-expand">';
			bigProductHtml += '			'+detailProduct;
			bigProductHtml += '		</div>';
			bigProductHtml += '	</li>';
			
			var smallProductNewHtml = '<span class="text">&nbsp;</span>';
			if(product.newProduct){
				smallProductNewHtml = '<span class="text">New</span>';
			}
			
			image = contextPath + 'photo/thumbnail/'+product.saveName+'productSmall.'+product.imageType;
			if(product.imageCategory == '0'){
				image = contextPath + 'resources/uploadImage/'+product.saveName;
			}
			smallProductHtml += '<div class="thumbnail">';
			smallProductHtml += '	'+smallProductNewHtml;
			smallProductHtml += '	<span class="'+(i == 0 ? (productSize - 1) : (i-1))+' image" ><img alt="Product'+i+'" src="'+image+'"/></span>';
			smallProductHtml += '</div>';
		}
		if(productSize < 3 ){
			for(var i=productSize ; i< 3; i++){
				bigProductHtml += '	<li class="jt-home-expand-shop-expandProduct">';
				bigProductHtml += '		<a href="'+jtownUser.shopUrl+'"><img alt="Empty Product" src="'+contextPath+'resources/images/jt-product-blank.png"></a>';
				bigProductHtml += ' </li>';
				
				smallProductHtml += '<div class="thumbnail">';
				smallProductHtml += '	<span class="text">&nbsp;</span>';
				smallProductHtml += '	<span class="image" ><img alt="Product" src="'+contextPath+'resources/images/jt-product-thumbnail-blank.png"/></span>';
				smallProductHtml += '</div>';
			}
		}
		
		var eventImage1 = contextPath + 'resources/images/jt-event-user-blank.png', 
			eventImage2 = contextPath + 'resources/images/jt-event-user-blank.png';
		
		if(!nullValueCheck(event1)){
			eventImage1 = contextPath + 'photo/thumbnail/'+event1.saveName+'event.'+event1.imageType;
			if(event1.imageCategory == '0'){
				eventImage1 = contextPath + 'resources/uploadImage/' + event1.saveName;
			}
		}
		
		if(!nullValueCheck(event2)){
			eventImage2 = contextPath + 'photo/thumbnail/'+event2.saveName+'event.'+event2.imageType;
			if(event2.imageCategory == '0'){
				eventImage2 = contextPath + 'resources/uploadImage/' + event2.saveName;
			}
		}
		
		var commentHtml = '';

		if(commentTops.length > 0){
			comments = commentTops;
			best = true;
		}
		
		var cancleHtml = '&nbsp;<a href="#none" class="jt-home-expand-shop-comment-loveIt-cancle">취소</a>';
		for(var i=0; i<comments.length; i++){
			var comment = comments[i];
			var cancleComment = nullValueCheck(comment.commentCustomerPn) ? '' : cancleHtml;
			var warnComment = '';
			if(comment.customerPn != cpn){
				if(nullValueCheck(comment.warnCustomerPn)){
					warnComment = '&nbsp;<span href="#none" class="jt-warn-active" title="신고">WARN</span>';
				}else{
					warnComment = '&nbsp;<span href="#none" class="jt-warn-disactive" title="신고">WARN</span>';
				}
			}
			
			commentHtml += 	'<li data-copn="'+comment.commentPn+'" class="'+(best ? 'jt-home-expand-shop-comment-li-best' : 'jt-home-expand-shop-comment-li')+'">';
			commentHtml +=	'	<ul class="jt-home-expand-shop-text-wrap">';
			if(best){
				commentHtml += 	'		<li class="jt-home-expand-shop-comment-header">';
				commentHtml += 	'			<span class="jt-home-expand-shop-comment-best">BEST</span>';
				commentHtml += 	'		</li>';
			}
			commentHtml += 	'		<li class="jt-home-expand-shop-comment-content">';
			commentHtml += 	'			<span class="jt-home-expand-shop-comment-name">'+htmlChars(comment.customerName)+'</span>';
			commentHtml +=	' 			<span class="jt-home-expand-shop-comment-text">'+htmlChars(comment.comment)+'</span>';
			commentHtml += 	'		</li>';
			commentHtml +=	'		<li class="copnLoveIt-'+comment.commentPn+' jt-home-expand-shop-comment-footer">';
			commentHtml += 	'			<span class="jt-home-expand-shop-comment-progress-date">'+comment.inputDate+'</span>';
			commentHtml +=	' 			<a href="#none" class="jt-home-expand-shop-comment-loveIt">LOVE</a>';	
			commentHtml +=	'			<span class="jt-home-expand-shop-comment-loveIt-count">'+ ( nullValueCheck(comment.commentLoveCount) ? '' : comment.commentLoveCount )+'</span>'+cancleComment;
			commentHtml +=	'			'+warnComment;
			commentHtml += 	'		</li>';
			commentHtml	+= 	'	</ul>';
			if(comment.customerPn == cpn || cpn == 'admin'){
				commentHtml +=	'<div class="jt-home-expand-shop-update-wrap">';
				commentHtml +=	'	<input type="text" class="jt-comment-update-input" value="'+htmlChars(comment.comment)+'" maxlength="100"><br/>';
				commentHtml += 	'	<span>esc를 누르시면 수정이 취소 됩니다.</span>';
				commentHtml +=	'</div>';
				commentHtml +=	'<div class="jt-home-expand-shop-tool-wrap">';
				commentHtml +=	'	<a href="#none" class="jt-comment-update jt-btn-white-small">';
				commentHtml +=	'		<span class="btnImage"></span>';
				commentHtml +=	'	</a>';
				commentHtml +=	'	<a href="#none" class="jt-comment-delete jt-btn-white-small">';
				commentHtml +=	'		<span class="btnImage"></span>';
				commentHtml +=	'	</a>';
				commentHtml +=	'</div>';
			}
			commentHtml += '</li>';
		}
		
		var pagination = commentFilter.pagination;
		if(commentTops.length > 0){
			if(pagination.numItems > 0 ){
				commentHtml +=	'<li class="jt-home-expand-shop-comment-add">';
				commentHtml +=	'	<a href="#none" class="jt-btn-silver" id="comment-add-btn"';
				commentHtml +=	'		data-spn="'+jtownUser.pn+'" data-page="0" ';
				commentHtml +=	'		data-ni="'+pagination.numItems+'" data-nipp="'+pagination.numItemsPerPage+'">';
				commentHtml +=	'			댓글&nbsp;더&nbsp;보기&nbsp;<span id="comment-now-count">0</span>/'+pagination.numItems;
				commentHtml +=	'	</a>';
				commentHtml +=	'</li>';
			}
		}else{
			if(pagination.numItems > pagination.numItemsPerPage ){
				commentHtml +=	'<li class="jt-home-expand-shop-comment-add">';
				commentHtml +=	'	<a href="#none" class="jt-btn-silver" id="comment-add-btn"';
				commentHtml +=	'		data-spn="'+jtownUser.pn+'" data-page="1" ';
				commentHtml +=	'		data-ni="'+pagination.numItems+'" data-nipp="'+pagination.numItemsPerPage+'">';
				commentHtml +=	'			댓글&nbsp;더&nbsp;보기&nbsp;<span id="comment-now-count">'+pagination.numItemsPerPage+'</span>/'+pagination.numItems;
				commentHtml +=	'	</a>';
				commentHtml +=	'</li>';
			}
		}
		
		var commentInputHtml = '';
		if(cpn == 0){
			commentInputHtml += '<input id="jt-comment-insert" readonly="readonly" placeholder="판매자 아이디로는 이용하실 수 없습니다."/>';	
		}else if(!nullValueCheck(cpn)){			 
			commentInputHtml += '<input type="text" id="jt-comment-insert" placeholder="쇼핑몰에 대한 한마디를 남겨보세요. 상품 배송문의는 해당 쇼핑몰 고객센터로 남겨주세요." maxlength="100"/>';
		}else{
			commentInputHtml += '<input id="jt-comment-insert" readonly="readonly" placeholder="로그인한 사용자만 사용할 수 있습니다."/>';
		}
		
		var newEventHtml = '';
		newEventHtml += '		<div class="jt-home-expand-shop-event-new">';
		newEventHtml += '			<div>';
		newEventHtml += '				<span class="jt-home-expand-shop-event-new-image">NEW</span>';
		newEventHtml += '			</div>';
		newEventHtml += '		</div>';
		
		var loveClick = (!nullValueCheck(loveHave) && loveHave != 0 ) ? 'jt-home-shop-love-click' : '';
		var loveTextClick =   (!nullValueCheck(loveHave) && loveHave != 0) ? 'jt-home-shop-love-text-click' : '';
		
		var loveHotCount ='<span class="jt-home-shop-love-hot" title="최근 뜨는 미니샵">HOT</span>';
		if(nullValueCheck(jtownUser.loveHotCount) || jtownUser.loveHotCount == 0 ){
			loveHotCount = '';
		}
		var tagHtml = '<div style="padding-bottom: 15px; float:left; width: 100%;"></div>';
		if(interests.length > 0){
			tagHtml += '<div class="jt-home-expand-shop-tag">';	
			tagHtml += '<span class="tag-txt">';
			for(var i = 0, iLength = interests.length ; i < iLength ; i++){
				var interest = interests[i];
				tagHtml += interest.name;
				if((i+1) != iLength){
					tagHtml += ',&nbsp;';
				}
			}
			tagHtml +='</span><span class="tag-image">Tag</span>';
			tagHtml +='</div>';
		}
		
		html += '<header class="jt-home-expand-click-shop-header">';
		html += '	<div>';
		html += '		<a href="'+jtownUser.shopUrl+'" target="_blank" onclick="jtown.home.goHome(\''+spn+'\');" title="클릭시 해당 쇼핑몰로 이동됩니다.">'+userName+'</a>';
		html += '	</div>';	
		html += '</header>';
		html += '<div class="jt-home-expand-shop jt-home-expand-click-shop" id="jt-home-expand-shop" data-name="'+userName+'" data-size="'+productSize+'" data-nowPosition="'+productSize+'" data-spn="'+jtownUser.pn+'" data-url="'+jtownUser.shopUrl+'">';
		html += '	<div id="jt-home-expand-shop-notice" title="클릭시 해당 쇼핑몰로 이동됩니다.">';
		html += '		<span class="jt-home-expand-shop-firstQuotationMark"></span>';
		html += '		<pre id="jt-seller-expand-shop-text" class="jt-home-expand-shop-text">'+ ( nullValueCheck(jtownUser.longNotice) ? "쇼핑몰의 홍보문구를 입력해주세요." : jtownUser.longNotice ) +'</pre>';
		html += '		<span class="jt-home-expand-shop-lastQuotationMark"></span>';				
		html += '	</div>';
		html += '	<div class="jt-home-expand-shop-expandProducts">';
		if(productSize > 3){
		html += '		<button class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow"><span>&lt;</span></button>';
		}else{
		html += '		<button class="jt-home-expand-shop-arrow"></button>';	
		}
		html += '		<div class="jt-home-expand-shop-fake-dan">';
		html += '			<ul class="jt-home-expand-shop-expandProduct-slide">';
		html +=	'				'+bigProductHtml;
		html += '			</ul>';
		html +=	'		</div>';
		if(productSize > 3){
		html +=	'		<button class="jt-home-expand-shop-rigthArrow jt-home-expand-shop-arrow"><span>&gt;</span></button>';
		}else{
		html += '		<button class="jt-home-expand-shop-arrow"></button>';		
		}
		html += '		<div class="jt-home-expand-shop-products ">';
		html += '			'+smallProductHtml;
		html += '			'+tagHtml;
		html += '		</div>';
		html += '	</div>';
		var nowDate = new Date();
		if(firstBannerInfo!=null  && (Math.floor((nowDate.getTime() - firstBannerInfo.endDate) / (1000*60*60*24))  <= 0)){
			html += '	<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-first" title="클릭시 해당 쇼핑몰로 이동됩니다.">';
			html += '		'+ ( (jtownUser.bannerFirst != null && Number(jtownUser.bannerFirst) < 3 ) ? newEventHtml : '');
			html += '		<img alt="First Event" src="'+eventImage1 +'"/>';
			html += '	</div>';
		}
		if(secondBannerInfo!=null  && (Math.floor((nowDate.getTime() - secondBannerInfo.endDate) / (1000*60*60*24))  <= 0)){
		html += '	<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-second" title="클릭시 해당 쇼핑몰로 이동됩니다.">';
		html += '		'+ ( (jtownUser.bannerSecond != null && Number(jtownUser.bannerSecond) < 3 )? newEventHtml : '');
		html +=	'		<img alt="Second Event" src="'+eventImage2 +'"/>';
		html +=	'	</div>';
		}
		html += '	<ul class="jt-home-expand-shop-content-fn">';
		html +=	'		<li class="jt-home-expand-shop-content-view-wrap">';
		html +=	'			<span class="jt-home-expand-shop-content-view" title="최근 일주일간 방문수">Look</span>&nbsp;<span id="view-expand-'+spn+'">'+jtownUser.viewCount+'</span>';	
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-content-comment-wrap">';
		html +=	'			<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;<span id="comment-expand-'+spn+'" class="jt-home-expand-shop-content-comment-text">' + jtownUser.commentCount+'</span>';
		html += '			<div class="jt-home-expand-shop-border-hide"></div>';
		html +=	'		</li>';
		html +=	'		<li class="jt-home-expand-shop-content-love-wrap">';
		html +=	'			<div class="jt-heart-click-expand-wrap">';
		html +=	'				<div class="jt-heart-click-background" id="jt-heart-expand-click-'+spn+'">';
		html +=	'					<img alt="heart-background" src="'+contextPath+'resources/images/heart-background.png">';
		html +=	'				</div>';
		html +=	'				<div class="jt-heart-click">';
		html +=	'					<a href="#none" onclick="jtown.home.clickLove(\''+spn+'\');"><span class="jt-home-expand-shop-content-love '+loveClick+'" id="love-expand-image-'+spn+'">Love</span></a>';
		html +=	'				</div>';
		html +=	'			</div>';
		html +=	'			<div class="jt-home-expand-shop-content-love-text-wrap">';
		html +=	'				<span id="love-expand-'+spn+'" class="'+loveTextClick+'">'+jtownUser.loveCount+'</span>';
		html += '				'+loveHotCount;		
		html +=	'			</div>';
		html +=	'		</li>';
		html +=	'	</ul>';
		html +=	'	<div class="jt-home-expand-shop-comment-wrap">';
		html +=	'		<ul class="jt-home-expand-shop-comment">';
		html +=	'			'+commentHtml;
		html +=	'		</ul>';
		html +=	'		<div class="jt-home-expand-shop-comment-insert">';
		html +=	'			'+commentInputHtml;
		html +=	'		</div>';
		html +=	'	</div>';
		html +=	'</div>';
		
		$.smartPop.open({width : 640,height : 650, html : html ,effect : 'transfer', target : '#jt-home-shop-'+spn });
		setTimeout('jtown.expand.setTimeout()',0);
		setTimeout('jtown.home.clickShop(\''+spn+'\');', 0);
	});
};

jtown.expand.setTimeout = function(){
	jtown.expand.show = true;
	jtown.comment.syncComment();
	jtown.expand.changeContainerHeight();
	jtown.expand.gotoPage();
	jtown.seller.syncProduct();
	$(function(){
		$('#jt-comment-insert').placeholder();
		
		$('.jt-home-expand-shop-expandProducts').jCarouselLite({
			btnNext: ".jt-home-expand-shop-leftArrow",
			btnPrev: ".jt-home-expand-shop-rigthArrow",
			mouseWheel: true,
			speed : 300,
			btnGo : ['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9',
			         '.10', '.11', '.12', '.13', '.14', '.15', '.16', '.17', '.18', '.19', 
			         '.20', '.21', '.22', '.23', '.24', '.25', '.26', '.27', '.28', '.29'	],
			afterEnd : function(e){
				setTimeout('jtown.seller.syncProduct()', 0);
			}
		});
	});
};

jtown.expand.gotoPage = function(){
	$('.jt-home-expand-click-shop').each(function(){
		var parent = $(this);
		var label = parent.attr('data-name');
		var gotoPage = function(){
			var spn = parent.attr('data-spn');
			var url = parent.attr('data-url');

			var open = window.open('about:blank');
			open.location.href = url;
			jtown.home.goHome(spn);
		};
		parent.children('#jt-home-expand-shop-notice').unbind('click').bind('click', gotoPage);
		parent.children('.jt-home-expand-shop-event').unbind('click').bind('click', function(){
			ga('send', 'event', 'event', 'click', label);
			gotoPage();
		});
	});
};

jtown.expand.changeContainerHeight = function(){
	var smartPopContainer = $('#smartPop_container');
	if(!nullValueCheck(smartPopContainer.html())){	
		var smartPopContent = $('#smartPop_content');
		var height = $('#jt-home-expand-shop').css('height');
		height = Number(height.replace('px', ''));
		var changeHeight = height + 50;
		
		smartPopContainer.css('height', changeHeight+'px');
		smartPopContent.css('height', changeHeight+'px');
	}
};