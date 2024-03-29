$(function(){
	
	$('.mm-home-nav-title').toggle(function(){
		$('.mm-home-sub-nav').hide();
		$(this).parents('li').find('.mm-home-sub-nav').show();
	}, function(){
		$(this).parents('li').find('.mm-home-sub-nav').hide();
	});
	
	$('.mm-join-submit').bind('click', function() {
		$('body').bind('touchmove', function(e){e.preventDefault();});
		$('html').css('overflow', 'hidden');
		$('#loading-popup').fadeIn();
		var form = document.forms['jtownUser'];
		form.submit();
	});

	$('.mm-mir-header>a').bind('click', function(){
		var thiz = $(this),
			spn = thiz.attr('data-spn');
		$.postJSON(mobileContextPath + '/ajax/goHome.jt', { sellerPn : spn }, function() { });
	});
	
	$('#mm-pc-version-btn').bind('click', function(){
		$.cookie('SEE_PC_VERSION', 'T', {expires : 1, path : '/' });
	});
	
	$('.mm-home-refresh').bind('click', function(){
		location.reload();
	});
	
	$('.mm-home-search').bind('click', function(){
		$('#mm-naturalLanguage-search').focus();
	});
	
	mobile.homeSync();
	
	mobile.mirSync();
	
	mobile.commentSync();
	
	mobile.autocomplete();
	
	$('#mm-home-container').scrollPagination({
		'contentPage'	: mobileContextPath + '/ajax/homePagination.jt',
		'contentData'	: { 	'categoryPn'	: 	Number($('#mm-home-container').attr('data-cpn')),
								'sectionPn'		: 	Number($('#mm-home-container').attr('data-spn'))	},
		'scrollTarget'	: $(window),
		'successCallback' : function(data){
			var html = mobile.homeHtml(data);
			var $boxes = $(html);
			$('#mm-home-container').append($boxes);
			setTimeout('mobile.homeSync();', 0);
		},
		'maxPage'		: $('#mm-home-container').attr('data-maxPage')
	});
	
	$('#mm-userFindPassword-btn').bind('click', function(){
		$('body').bind('touchmove', function(e){e.preventDefault();});
		$('html').css('overflow', 'hidden');
		$('#loading-popup').fadeIn();
		var form = document.forms['jtownUser'];
		form.submit();
	});
	
	$('#mm-findSellerPassword-btn').bind('click', function(){
		$('body').bind('touchmove', function(e){e.preventDefault();});
		$('html').css('overflow', 'hidden');
		$('#loading-popup').fadeIn();
		var form = document.forms['sellerUser'];
		form.submit();
	});
	
	mirProductHeight = function(){
		var imgWidth = $('.mm-mir-product-one-image').width();
		$('.mm-mir-product-one-image>a').height(imgWidth);
		$('.mm-mir-product-one-image>a>img').height(imgWidth);
	};
	
	mirProductHeight();
	
	$(window).resize(mirProductHeight);
});

function onPopupLoginSubmit(){
	onLoginSubmit('mm-page-login-form');
}

function onLoginSubmit(name){
	var $form = $('#'+name);
	
	jQuery.ajax({
		'type' : 'POST',
		'url' : contextPath + '/j_spring_security_check',
		'data' : $form.serialize(),
		'dataType' : 'text',
		'success' : function(data) {
			mobile.loginControl(data, name);
		}
	});	
}

mobile.loginControl = function(data, name){
	
	var map = eval('('+data+')'),
		result = map.result,
		referer = map.referer;	

	if(result == 'success'){
		if(nullValueCheck(referer)){
			location.href = mobileContextPath + "/";		
		}else{
			location.href = referer;
		}
		return;			
	}else if(result == 'error'){
		location.href= mobileContextPath + '/login/?isFinish=0';
		return;
	}

};

mobile.autocomplete = function(){
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
	
	$('#mm-naturalLanguage-search').catcomplete({
		source : function(request, response){
			var url = mobileContextPath + '/natural/ajax/autocomplete.jt',
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
				location.href = mobileContextPath + '/mir/'+item.pn;
			}else if(item.category =='CATEGORY'){
				location.href = mobileContextPath + '/cpn/'+item.categoryPn+'/spn/'+item.spn;
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
			$('#mm-naturalLanguage-search').val('');
		}
	});
	
};

mobile.product = function(spn, href){
	var open = window.open('about:blank');
	open.location.href = href;
	$.postJSON(mobileContextPath + '/ajax/goHome.jt', { sellerPn : spn }, function() { });
};

mobile.mirSync = function(){
	$('.mm-mir-love').bind('click', function(){
		var parent = $(this).parents('.mm-mir-footer');
		var spn = parent.attr('data-spn');
		var url = mobileContextPath + '/ajax/clickLove.jt', 
			json = { sellerPn : spn };
		
		$.postJSON(url, json, function(count) {
			if (!nullValueCheck(count.message)) {
				if(count.message == '1'){				
					location.href = mobileContextPath+'/login';
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
	
	var btn = $('#comment-add-btn');
	btn.click(function(event){
		this.disabled = 'disabled';
		var page = ( Number(btn.attr('data-page'))  + 1 ),
			nextPage = ( page + 1 ),
			numItemsPerPage = btn.attr('data-nipp'),
			numItems = btn.attr('data-ni');

		var url = mobileContextPath + '/home/ajax/selectComment.jt';
		var json = { 	page  		: 	page,
						sellerPn	:	btn.attr('data-spn')	};
		
		$.postJSON(url, json, function(comments){
			console.log("comments: " + comments.length);
			for(var i in comments){
				mobile.comment(comments[i], 'last');
			}
			
			setTimeout('mobile.commentSync()',0);
			if(nextPage * numItemsPerPage < numItems ||
					(page * numItemsPerPage < numItems && nextPage * numItemsPerPage >= numItems )){
				btn.attr('data-page', page);
				$('#comment-now-count').html(page * numItemsPerPage);
			}else{
				btn.parents('li').remove();
			}
		});
	});
	
	var insert = $('.mm-mir-comment-insert');
	insert.click(function(event){
		var footer = insert.parents('.mm-mir-footer'),
			spn = footer.attr('data-spn'),
			name = footer.attr('data-name');
		
		var url = mobileContextPath + '/home/ajax/existComment.jt',
			json = { sellerPn : spn	};
		
		$.postJSON(url, json, function(map){
			var result = map.result, authority = map.authority;
			
			if(authority == 'NOT_LOGIN'){
				location.href = mobileContextPath + '/login';
				return;
			}else if(authority != 'CUSTOMER'){
				insert.unbind('click');
				return;
			}
			
			if(result){	
				insert.attr('readonly', 'readonly');
				alert(name+' 쇼핑몰에 대한 댓글은 하루에 한번만 가능합니다.');				
			}else{
				insert.removeAttr('readonly');
			}	
		});
	});
	insert.bind('focusin', function(){
		$('.mm-mir-comment-insert-btn').show();
	});
	
	var insertBtn = $('.mm-mir-comment-insert-btn');
	insertBtn.bind('click', function(event){
		this.disabled = 'disabled';
		var footer = insertBtn.parents('.mm-mir-footer'),
			spn = footer.attr('data-spn'),
			name = footer.attr('data-name');
			comment = insert.val();
		
		if(nullValueCheck(comment)){ return ; }
		
		var url, json = { 	'sellerPn' 	: spn };
		url = mobileContextPath + '/home/ajax/existLove.jt';
		$.postJSON(url, json, function(result){
		
			postComment = function(){
				url = mobileContextPath + '/home/ajax/insertComment.jt';
				json.comment = comment;
				$.postJSON(url, json, function(comment){
					insert.val('');
					insert.attr('readonly', 'readonly');
				});
			};
			
			if(!result){
				mobile.loveConfirm(
					function(){
						url = mobileContextPath + '/ajax/clickLove.jt';
						json = { sellerPn : spn };
						
						$.postJSON(url, json, function(count) {
							if (!nullValueCheck(count.message)) {
								if(count.message == '1'){				
									location.href = mobileContextPath+'/login';
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
						setTimeout('postComment()', 0);
					}, function(){ 	
						postComment(); 
					}, name);
			}else{
				postComment();
			}
			console.log("insertBtn[0]: " + insertBtn[0]);
			insertBtn.removeAttr("disabled");
			console.log("disabled: " + insertBtn[0].disabled);
		});
	});

};

mobile.loveConfirm = function(success, cancle, name){
	var html = '';
		html += '<div class="mm-love-dialog">';
		html += '	<div class="mm-love-dialog-ment">';
		html += '		댓글 입력이 완료되었습니다.<br/>쇼핑몰&nbsp;'+name+'을 추천하시겠어요?';
		html += '	</div>';
		html += '	<div class="mm-love-dialog-buttonpane">';
		html += '		<div class="mm-love-dialog-button">';
		html += '			<span id="smart-success">Love</span>';
		html += '		</div>';
		html += '		<div class="mm-love-dialog-button">';
		html += '			<span id="smart-cancle">Skip</span>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
	
	$.smartPop.open({ width : 280, height : 120, html : html, effect : null });	
	
	syncConfirm = function(){
		$('#smart-success').bind('click', function(){
			success();
			$.smartPop.close();
		});
		
		$('#smart-cancle').bind('click', function(){
			cancle();
			$.smartPop.close();
		});
	};
	
	setTimeout('syncConfirm()', 0);
};

mobile.commentSync = function(){
	$('.mm-warn-active').unbind('click').bind('click', function(){
		var thiz = $(this),
			parents = thiz.parents('.mm-mir-comment-content-text'),
			commentPn = parents.attr('data-copn');
		
		var url = mobileContextPath + '/home/ajax/warnCommentLove.jt';
		var json = {	commentPn	:	commentPn 	};
		
		$.postJSON(url, json, function(comment){
			if(!nullValueCheck(comment.message)){
				alert(comment.message);
			}else{
				thiz.removeClass('mm-warn-active').addClass('mm-warn-disactive').unbind('click');	
			}
		});
	});
	
	$('.mm-mir-comment-text-footer-loveIt').unbind('click').bind('click', function(){
		var thiz = $(this),
			parents = thiz.parents('.mm-mir-comment-content-text'),
			footer = thiz.parents('.mm-mir-footer'),
			commentPn = parents.attr('data-copn');;
		
		var url = mobileContextPath + '/home/ajax/toggleCommentLove.jt';
		var json = {	commentPn	:	parents.attr('data-copn'),
						sellerPn	:	footer.attr('data-spn') 		};
		
		$.postJSON(url, json, function(comment){
			if(!nullValueCheck(comment.message)){
				switch (Number(comment.message)) {
				case 1:
					location.href= mobileContextPath + '/login';				
					break;
				case 2:
					alert('판매자는 불가능 합니다.');
					break;
				default:
					break;
				}
			}else{
				var crudType = comment.crudType;
				if(crudType == 'insert'){
					$('.comment-love-'+commentPn+' .mm-mir-comment-text-footer-loveIt-count').after('<span class="mm-mir-comment-text-footer-loveIt-cancle">&nbsp;취소</a>');
					commentLoveCancle();
				}else if(crudType == 'delete'){
					$('.comment-love-'+commentPn).find('.mm-mir-comment-text-footer-loveIt-cancle').remove();
				}
			}
		});
	});
	
	commentLoveCancle = function(){
		$('.mm-mir-comment-text-footer-loveIt-cancle').unbind('click').bind('click', function(){
			var thiz = $(this),
				parents = thiz.parents('.mm-mir-comment-content-text'),
				footer = thiz.parents('.mm-mir-footer'),
				commentPn = parents.attr('data-copn');
			
			var url = mobileContextPath + '/home/ajax/toggleCommentLove.jt';
			var json = {	commentPn	:	commentPn,
							sellerPn	:	footer.attr('data-spn') 		};
			
			$.postJSON(url, json, function(comment){
				if(!nullValueCheck(comment.message)){
					location.href = mobileContextPath + '/login';
				}else{
					var crudType = comment.crudType;
					if(crudType == 'delete'){
						$('.comment-love-'+commentPn).find('.mm-mir-comment-text-footer-loveIt-cancle').remove();
					}
				}
			});
		});
	};
	
	commentLoveCancle();
	
	$('.mm-comment-delete').unbind('click').bind('click', function(){
		var thiz = $(this),
			footer = thiz.parents('.mm-mir-footer'),
			spn = footer.attr('data-spn'),
			comment = thiz.parents('.mm-mir-comment-content-text'),
			commentPn = comment.attr('data-copn');
		
		var url = mobileContextPath + '/home/ajax/deleteComment.jt',
			json = {	'commentPn' : commentPn,
						'sellerPn'	: spn		};
		$.postJSON(url, json, function(){ });
	});
	
	$('.mm-comment-update').unbind('click').bind('click', function(){
		var thiz = $(this),
			comment = thiz.parents('.mm-mir-comment-content-text'),
			updateWrap = comment.find('.mm-comment-update-wrap'),
			commentWrap = comment.find('.mm-mir-comment-text-wrap');
		
		commentWrap.hide();
		updateWrap.show();
	});
	
	$('.mm-commnet-cancle-btn').unbind('click').bind('click', function(){
		var thiz = $(this),
			comment = thiz.parents('.mm-mir-comment-content-text'),
			updateWrap = comment.find('.mm-comment-update-wrap'),
			commentWrap = comment.find('.mm-mir-comment-text-wrap'),
			txt = commentWrap.find('.mm-mir-comment-text-content-text').html();
			
		commentWrap.show();
		updateWrap.hide();
		updateWrap.find('.mm-mir-comment-update').val(txt);
	});
	
	$('.mm-commnet-update-btn').unbind('click').bind('click', function(){
		var thiz = $(this),
			comment = thiz.parents('.mm-mir-comment-content-text'),
			updateWrap = comment.find('.mm-comment-update-wrap'),
			commentWrap = comment.find('.mm-mir-comment-text-wrap'),
			txt = updateWrap.find('.mm-mir-comment-update').val();
		
		var url = mobileContextPath + '/home/ajax/updateComment.jt',
			json = {	'commentPn' : comment.attr('data-copn'),
						'comment'	: txt	};
		if(nullValueCheck(txt)){
			return;
		}
		
		$.postJSON(url, json, function(comment){
			commentWrap.show();
			updateWrap.hide();
		});
	});
};

mobile.comment = function(comment, position){
	var cpn = $('body').attr('data-cpn');
	var cancleHtml = '<span class="mm-mir-comment-text-footer-loveIt-cancle">취소</span>';
	var cancleComment = nullValueCheck(comment.commentCustomerPn) ? '' : cancleHtml;
	var warnComment = '';
	if(comment.customerPn != cpn){
		if(nullValueCheck(comment.warnCustomerPn)){
			warnComment = '<span class="mm-warn-active" title="신고">WARN</span>';
		}else{
			warnComment = '<span class="mm-warn-disactive" title="신고">WARN</span>';
		}
	}
	
	var commentHtml ='';
	commentHtml += 	'<li data-copn="'+comment.commentPn+'" class="mm-mir-comment-content-text comment-not-best">';
	commentHtml +=	'	<ul class="mm-mir-comment-text-wrap">';
	commentHtml += 	'		<li class="mm-mir-comment-text-content">';
	commentHtml += 	'			<span class="mm-mir-comment-text-content-name">'+htmlChars(comment.customerName)+'</span>';
	commentHtml +=	' 			<span class="mm-mir-comment-text-content-text">'+htmlChars(comment.comment)+'</span>';
	commentHtml += 	'		</li>';
	commentHtml +=	'		<li class="mm-mir-comment-text-footer comment-love-'+comment.commentPn+'">';
	commentHtml += 	'			<span class="mm-mir-comment-text-footer-progress-date">'+comment.inputDate+'</span>';
	commentHtml +=	' 			<span class="mm-mir-comment-text-footer-loveIt">LOVE</span>';	
	commentHtml +=	'			<span class="mm-mir-comment-text-footer-loveIt-count">'+ ( nullValueCheck(comment.commentLoveCount) ? '' : comment.commentLoveCount )+'</span>';
	commentHtml +=  '			'+cancleComment;
	commentHtml +=	'			'+warnComment;
	if(comment.customerPn == cpn){
	commentHtml += 	'				<span class="mm-comment-delete">삭제</span>';
	commentHtml += 	'				<span class="mm-comment-update">수정</span>';
	}
	commentHtml += 	'		</li>';
	commentHtml	+= 	'	</ul>';
	if(comment.customerPn == cpn){
	commentHtml +=	'	<div class="mm-comment-update-wrap">';
	commentHtml +=	'		<input type="text" maxlength="100" value="'+htmlChars(comment.comment)+'" class="mm-mir-comment-update"/><br/>';
	commentHtml +=	'		<button type="button" class="mm-btn-orange mm-commnet-cancle-btn">취소</button>';
	commentHtml +=	'		<button type="button" class="mm-btn-orange mm-commnet-update-btn">수정</button>';
	commentHtml +=	'	</div>';
	}
	commentHtml += 	'</li>';

	var contentWrap = $('.mm-mir-comment-content>ul');
	if(!nullValueCheck(contentWrap.html().trim())){	
		if(position == 'last'){
			$('.comment-not-best:last').after(commentHtml);		
		}else if(position == 'first'){
			$('.comment-not-best:first').before(commentHtml);
		}
	}else{
		contentWrap.html(commentHtml);
	}
};

mobile.homeSync = function(){
	$('.mm-home-love').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');
		var url = mobileContextPath + '/ajax/clickLove.jt', 
			json = { sellerPn : spn };
		
		$.postJSON(url, json, function(count) {
			if (!nullValueCheck(count.message)) {
				if(count.message == '1'){				
					location.href = mobileContextPath+'/login';
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
		
		$.postJSON(mobileContextPath + '/ajax/goHome.jt', { sellerPn : spn }, function() { });
	});
	
	$('.mm-home-mainImage').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');

		location.href= mobileContextPath + '/mir/'+spn;
	});
	
	$('.mm-home-comment').unbind('click').bind('click', function(){
		var parent = $(this).parents('.mm-home-article');
		var spn = parent.attr('data-spn');

		location.href= mobileContextPath + '/mir/'+spn;
	});
};

mobile.homeHtml = function(data) {
	var jtownUsers = data.jtownUsers;
	var images = data.images;
	var newComments = data.newComments;
	
	var html = '';
	for ( var i = 0, len = jtownUsers.length; i < len; i++) {
		var seller = jtownUsers[i], spn = seller.pn, mainImages = images[spn], comments = newComments[spn];

		var imageHtml = '';

		if(mainImages.length == 0){
			imageHtml += '<div class="mm-home-mainImage-content">';	
			imageHtml += '	<img alt="Main Image Blank" src="'+contextPath+'/resources/images/jt-introduce-home-blank.png" title="'+ htmlChars(seller.name) + '"/>	';
			imageHtml += '</div>';
		}
		for ( var j = 0, jLen = mainImages.length; j < jLen; j++) {
			var mainImage = mainImages[j];
			var imageSrc = contextPath + '/photo/thumbnail/'+mainImage.saveName+'represent.'+mainImage.type;
			if(mainImage.category == '0'){
				imageSrc = contextPath + '/resources/uploadImage/'+ mainImage.saveName;					
			}
			imageHtml += '<div class="mm-home-mainImage-content">';	
			imageHtml += '	<img alt="Main Image" src="' + imageSrc + '" title="'+ htmlChars(seller.name) + '"/>	';
			imageHtml += '</div>';
		}

		var loveClick = !nullValueCheck(seller.customerPn) ? 'mm-home-love-click' : '';
		var loveTextClick = !nullValueCheck(seller.customerPn) ? 'mm-home-love-number-click' : '';

		var loveHotCount = '<span class="mm-home-hot" title="최근 뜨는 미니샵">HOT</span>';
		var loveWidth = '66';
		if (nullValueCheck(seller.loveHotCount)  || seller.loveHotCount == 0 ) {
			loveHotCount = '';
			loveWidth = '39';
		}
		var newProductStyle = seller.newProduct > 0 ? 'display: block;' : 'display:none;';
		var newBannerStyle = seller.eventName != null && seller.endDate >= 0 ? 'display: block;' : 'display:none;' ;
		
		var commentHtml = '';
		if(comments.length > 0){
			commentHtml += '<div class="mm-home-shop-comments-wrap">';
			for(var j=0, jLen = comments.length; j < jLen ; j++){
				var comment = comments[j];
				commentHtml +='<div class="mm-home-shop-comments">'+htmlChars(comment.comment)+'</div>';
			}
			commentHtml += '</div>';
		}
		
		html += '<article class="mm-home-article" data-spn="' + spn + '">';
		html += '	<header class="mm-home-article-header">';
		html += '		<a href="' + seller.shopUrl + '" target="_blank">' + htmlChars(seller.name) + '</a>';
		html += '	</header>';
		html += '	<article>';
		html += '		<ul class="mm-home-mainImage">';
		html += '			<li>';
		html += '				' + imageHtml;
		html += '				<div class="mm-home-mainImage-event">';
		html += '					<div id="new-product-'+seller.pn+'" class="mm-home-article-new-wrap" style="'+newProductStyle+'">';
		html += '						<span class="mm-home-article-product-new">New product</span>';
		html += '					</div>';
		html += '					<div id="new-'+seller.pn+'"  class="mm-home-article-new-wrap" style="'+newBannerStyle+'">';
		html += '						<span class="mm-home-article-event-new">New event</span>';
		html += '					</div>';
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
		html +=	'		'+commentHtml;
		html += '	</footer>';
		html += '</article>';
	}
	return html;
};