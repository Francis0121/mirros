if (typeof jtown.comment == 'undefined') {
	jtown.comment = {};
}

jtown.comment.syncComment = function(){
	
	var eventString = $.browser.chrome ? 'keydown' : 'keypress';
	$('#jt-comment-insert').unbind(eventString);
	$('#jt-comment-insert').bind(eventString, function(event){
		if(event.keyCode == 13){
			jtown.comment.insertComment($(this));
		}
	});
	
	$('.jt-comment-delete').unbind('click');
	$('.jt-comment-delete').bind('click', function(){
		jtown.comment.deleteComment($(this));
	});
	
	$('.jt-comment-update').unbind('click');
	$('.jt-comment-update').bind('click', function(){
		var $parents = $(this).parents('li');
		$parents.find('.jt-home-expand-shop-tool-wrap').hide();
		$parents.find('.jt-home-expand-shop-text-wrap').hide();
		$parents.find('.jt-home-expand-shop-update-wrap').show();
	});
	
	$('.jt-comment-update-input').unbind(eventString);
	$('.jt-comment-update-input').bind(eventString, function(event){
		if(event.keyCode == 13){
			jtown.comment.updateComment($(this));
		}else if(event.keyCode == 27){
			jtown.comment.cancleComment($(this));
		}
	});
	
	$('.jt-home-expand-shop-comment li').unbind('mouseover mouseout');
	$('.jt-home-expand-shop-comment li').bind('mouseover mouseout',function(event){
		var display = $(this).find('.jt-home-expand-shop-update-wrap').css('display');
		if(display != 'block'){
			if(event.type == 'mouseover'){
				$(this).find('.jt-home-expand-shop-tool-wrap').show();
			}else if(event.type == 'mouseout'){
				$(this).find('.jt-home-expand-shop-tool-wrap').hide();
			}
		}
	});
	
	$('#comment-add-btn-best').unbind('click');
	$('#comment-add-btn-best').bind('click', function(event){
		
		var me = $(this);

		var url = contextPath + 'ajax/home/selectCommentBest.jt';
		var json = { 	sellerPn	:	me.attr('data-spn')	};
		
		$.postJSON(url, json, function(comments){
			for(var i=0, len = comments.length; i < len ; i++){
				var comment = comments[i];
				jtown.comment.commentHtml(comment, 'last', true);
			}
			
			setTimeout('jtown.comment.syncComment()',0);
			
			$('#comment-add-btn-best').parents('li').remove();
			$('#comment-add-btn').parents('li').show();
		});
	});
	
	$('#comment-add-btn').unbind('click');
	$('#comment-add-btn').bind('click', function(event){
		var me = $(this), 
			page = ( Number(me.attr('data-page'))  + 1 ),
			nextPage = ( page + 1 ),
			numItemsPerPage = me.attr('data-nipp'),
			numItems = me.attr('data-ni');

		var url = contextPath + 'ajax/home/selectComment.jt';
		var json = { 	page  		: 	page,
						sellerPn	:	me.attr('data-spn')	};
		
		$.postJSON(url, json, function(comments){
			for(var i=0, len = comments.length; i < len ; i++){
				var comment = comments[i];
				jtown.comment.commentHtml(comment, 'last', false);
			}
			
			setTimeout('jtown.expand.changeContainerHeight(\''+comments.length+'\')', 0);
			setTimeout('jtown.comment.syncComment()',0);
			if(nextPage * numItemsPerPage < numItems ||
					(page * numItemsPerPage < numItems && nextPage * numItemsPerPage >= numItems )){
				me.attr('data-page', page);
				$('#comment-now-count').html(page * numItemsPerPage);
			}else{
				me.parents('li').remove();
			}
		});
	});
	
	$('.jt-home-expand-shop-comment-loveIt').unbind('click');
	$('.jt-home-expand-shop-comment-loveIt').bind('click', function(){
		var me = $(this),
			parents = me.parents('.jt-home-expand-shop-comment-li'),
			$shop = me.parents('#jt-home-expand-shop');
		
		var url = contextPath + 'ajax/home/toggleCommentLove.jt';
		var json = {	commentPn	:	parents.attr('data-copn'),
						sellerPn	:	$shop.attr('data-spn') 		};
		
		$.postJSON(url, json, function(){
		});
	});
};

jtown.comment.commentHtml = function(comment, position, best){
	var cpn = $('#jt-logout').attr('data-cpn');
	var commentHtml ='';
	commentHtml += 	'<li data-copn="'+comment.commentPn+'" class="'+ (best ? 'jt-home-expand-shop-comment-li-best' : 'jt-home-expand-shop-comment-li')+'">';
	commentHtml +=	'	<ul class="jt-home-expand-shop-text-wrap">';
	commentHtml += 	'		<li class="jt-home-expand-shop-comment-header">';
	commentHtml += 	'			<span class="jt-home-expand-shop-comment-name">'+htmlChars(comment.customerName)+'</span>';
	commentHtml += 	'			<span class="jt-home-expand-shop-comment-progress-date">'+comment.inputDate+'</span>';
	commentHtml +=	' 			<a href="#none" class="jt-home-expand-shop-comment-loveIt">Love&nbsp;It</a>';	
	commentHtml +=	'			<span id="copnLoveIt-'+comment.commentPn+'" class="jt-home-expand-shop-comment-loveIt-count">'+ ( nullValueCheck(comment.commentLoveCount) ? '' : comment.commentLoveCount )+'</span>';	
	commentHtml += 	'		</li>';
	commentHtml +=	'		<li class="jt-home-expand-shop-comment-text">'+htmlChars(comment.comment)+'</li>';
	commentHtml	+= 	'	</ul>';
	if(comment.customerPn == cpn){
	commentHtml +=	'	<div class="jt-home-expand-shop-update-wrap">';
	commentHtml +=	'		<input type="text" class="jt-comment-update-input" value="'+htmlChars(comment.comment)+'"/><br/>';
	commentHtml += 	'		<span>esc를 누르시면 수정이 취소 됩니다.</span>';
	commentHtml +=	'	</div>';
	commentHtml +=	'	<div class="jt-home-expand-shop-tool-wrap">';
	commentHtml +=	'		<a href="#none" class="jt-comment-update jt-btn-white-small">';
	commentHtml +=	'			<span class="btnImage"></span>';
	commentHtml +=	'		</a>';
	commentHtml +=	'		<a href="#none" class="jt-comment-delete jt-btn-white-small">';
	commentHtml +=	'			<span class="btnImage"></span>';
	commentHtml +=	'		</a>';
	commentHtml +=	'	</div>';
	}
	commentHtml += 	'</li>';
	
	var innerHtml = $('.jt-home-expand-shop-comment-li:'+position).html();
	if(!nullValueCheck(innerHtml)){		
		if(position == 'last')
			$('.jt-home-expand-shop-comment-li:'+position).after(commentHtml);
		else if(position == 'first')
			$('.jt-home-expand-shop-comment-li:'+position).before(commentHtml);
	}else{
		var innerBestHtml = $('.jt-home-expand-shop-comment-li-best:last').html();
		if(!nullValueCheck(innerBestHtml)){
			$('.jt-home-expand-shop-comment-li-best:last').after(commentHtml);
		}else{			
			$('.jt-home-expand-shop-comment').prepend(commentHtml);
		}
	}
};

jtown.comment.insertComment = function(me){
	var $parent = me.parents('#jt-home-expand-shop'),
		spn = $parent.attr('data-spn'),
		comment = me.val();
	
	var url = contextPath + 'ajax/home/insertComment.jt',
		json = {	'sellerPn' 	: spn,
				 	'comment'	: comment 	};
	
	$.postJSON(url, json, function(comment){
		me.val('');
	});
};

jtown.comment.deleteComment = function(me){
	var $shop = me.parents('#jt-home-expand-shop'),
		spn = $shop.attr('data-spn');
	
	var $parents = me.parents('li');
	var commentPn = $parents.attr('data-copn');
	
	var url = contextPath + 'ajax/home/deleteComment.jt',
		json = {	'commentPn' : commentPn,
					'sellerPn'	: spn		};

	$.postJSON(url, json, function(){
	});
};

jtown.comment.updateComment = function(me){
	var $parents = me.parents('li');
	var commentPn = $parents.attr('data-copn'),
		comment = me.val();
	
	var url = contextPath + 'ajax/home/updateComment.jt',
		json = {	'commentPn' : commentPn,
					'comment'	: comment};

	$.postJSON(url, json, function(comment){
		$parents.find('.jt-home-expand-shop-text-wrap').show();
		$parents.find('.jt-home-expand-shop-update-wrap').hide();
	});
};

jtown.comment.cancleComment = function(me){
	var $parents = me.parents('li');
	$parents.find('.jt-home-expand-shop-text-wrap').show();
	$parents.find('.jt-home-expand-shop-update-wrap').hide();
	var text = $parents.find('.jt-home-expand-shop-comment-text').html();
	$parents.find('.jt-comment-update-input').val(text);
};