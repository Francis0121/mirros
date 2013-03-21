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
};

jtown.comment.commentHtml = function(comment){
	var innerHtml = $('.jt-home-expand-shop-comment>li:last').html();
	var commentHtml ='';
	commentHtml += 	'<li data-copn="'+comment.commentPn+'">';
	commentHtml +=	'	<ul class="jt-home-expand-shop-text-wrap">';
	commentHtml += 	'		<li class="jt-home-expand-shop-comment-header">';
	commentHtml += 	'			<span class="jt-home-expand-shop-comment-name">'+htmlChars(comment.customerName)+'</span>';
	commentHtml += 	'			<span class="jt-home-expand-shop-comment-progress-date">3 시간전</span>';
	commentHtml += 	'		</li>';
	commentHtml +=	'		<li class="jt-home-expand-shop-comment-text">'+htmlChars(comment.comment)+'</li>';
	commentHtml	+= 	'	</ul>';
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
	commentHtml += 	'</li>';
	
	if(!nullValueCheck(innerHtml)){			
		$('.jt-home-expand-shop-comment>li:last').after(commentHtml);
	}else{
		$('.jt-home-expand-shop-comment').html(commentHtml);
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