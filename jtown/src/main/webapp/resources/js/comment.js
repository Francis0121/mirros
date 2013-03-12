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
		$parents.css('background' , '#fff');
		$parents.find('.jt-home-expand-shop-tool-wrap').hide();
		$parents.find('.jt-home-expand-shop-text-wrap').hide();
		$parents.find('.jt-home-expand-shop-update-wrap').show();
	});
	
	$('.jt-comment-update-input').unbind(eventString);
	$('.jt-comment-update-input').bind(eventString, function(){
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
				$(this).css('background', '#e5e5e5');
				$(this).find('.jt-home-expand-shop-tool-wrap').show();
			}else if(event.type == 'mouseout'){
				$(this).css('background', '#fff');
				$(this).find('.jt-home-expand-shop-tool-wrap').hide();
			}
		}
	});
};

jtown.comment.insertComment = function(me){
	var $parent = me.parents('#jt-home-expand-shop'),
		spn = $parent.attr('data-spn'),
		comment = me.val();
	
	var url = contextPath + 'ajax/home/insertComment.jt',
		json = {	'sellerPn' 	: spn,
				 	'comment'	: comment 	};
	
	$.postJSON(url, json, function(comment){
		var innerHtml = $('.jt-home-expand-shop-comment>li:last').html();
		var commentHtml ='';
		commentHtml += 	'<li data-copn="'+comment.commentPn+'">';
		commentHtml +=	'	<ul class="jt-home-expand-shop-text-wrap">';
		commentHtml += 	'		<li class="jt-home-expand-shop-comment-name">'+htmlChars(comment.customerName)+'</li>';
		commentHtml +=	'		<li class="jt-home-expand-shop-comment-text">'+htmlChars(comment.comment)+'</li>';
		commentHtml	+= 	'	</ul>';
		commentHtml +=	'	<div class="jt-home-expand-shop-update-wrap">';
		commentHtml +=	'		<input type="text" class="jt-comment-update-input" value="'+htmlChars(comment.comment)+'"/><br/>';
		commentHtml += 	'		<span>esc를 누르시면 수정이 취소 됩니다.</span>';
		commentHtml +=	'	</div>';
		commentHtml +=	'	<div class="jt-home-expand-shop-tool-wrap">';
		commentHtml +=	'		<a href="#none" class="jt-comment-update">수정</a>';
		commentHtml +=	'		<a href="#none" class="jt-comment-delete">삭제</a>';
		commentHtml +=	'	</div>';
		commentHtml += 	'</li>';
		
		if(!nullValueCheck(innerHtml)){			
			$('.jt-home-expand-shop-comment>li:last').after(commentHtml);
		}else{
			$('.jt-home-expand-shop-comment').html(commentHtml);
		}
		me.val('');
		jtown.comment.syncComment();
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
		$parents.remove();
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
		$parents.find('.jt-home-expand-shop-comment-text').html(htmlChars(comment.comment));
	});
};

jtown.comment.cancleComment = function(me){
	var $parents = me.parents('li');
	$parents.find('.jt-home-expand-shop-text-wrap').show();
	$parents.find('.jt-home-expand-shop-update-wrap').hide();
	var text = $parents.find('.jt-home-expand-shop-comment-text').html();
	$parents.find('.jt-comment-update-input').val(text);
};