if (typeof jtown.comment == 'undefined') {
	jtown.comment = {};
}

jtown.comment.syncComment = function(){
	
	var eventString = $.browser.chrome ? 'keydown' : 'keypress';

	$('#jt-comment-insert').unbind(eventString).bind(eventString, function(event){	
		if (event.keyCode == 13){
			jtown.comment.insertComment($(this));
		}
	});
	
	$('#jt-comment-insert').unbind('click').bind('click', function(){
		var $parent = $(this).parents('#jt-home-expand-shop'),
			spn = $parent.attr('data-spn'),
			name = $parent.attr('data-name');
		
		var url = contextPath + 'ajax/home/existComment.jt',
			json = { sellerPn : spn	};
		$.postJSON(url, json, function(map){
			var result = map.result, authoriy = map.authority;
			
			if(authoriy != 'CUSTOMER'){
				$('#jt-comment-insert').unbind('click');
				return;
			}
			
			if(result){	
				$('#jt-comment-insert').attr('readonly', 'readonly');
				jtown.dialog(name+' 쇼핑몰에 대한 댓글은<br/>하루에 한번만 가능합니다.');				
			}else{
				$('#jt-comment-insert').removeAttr('readonly');
			}	
		});
	});
	
	$('.jt-comment-delete').unbind('click').bind('click', function(){
		var me = $(this);
		jtown.confirm('댓글을 삭제하시겠습니까?', function(){ 
			jtown.comment.deleteComment(me);
		}, function(){});
	});
	
	$('.jt-comment-update').unbind('click').bind('click', function(){
		var $parents = $(this).parents('li');
		$parents.find('.jt-home-expand-shop-tool-wrap').hide();
		$parents.find('.jt-home-expand-shop-text-wrap').hide();
		$parents.find('.jt-home-expand-shop-update-wrap').show();
		setTimeout('jtown.expand.changeContainerHeight()', 0);
	});
	
	$('.jt-comment-update-input').unbind(eventString).bind(eventString, function(event){
		if(event.keyCode == 13){
			jtown.comment.updateComment($(this));
		}else if(event.keyCode == 27){
			jtown.comment.cancleComment($(this));
		}
		setTimeout('jtown.expand.changeContainerHeight()', 0);
	});
	
	$('.jt-home-expand-shop-comment li').unbind('mouseover mouseout').bind('mouseover mouseout',function(event){
		var display = $(this).find('.jt-home-expand-shop-update-wrap').css('display');
		if(display != 'block'){
			if(event.type == 'mouseover'){
				$(this).find('.jt-home-expand-shop-tool-wrap').show();
			}else if(event.type == 'mouseout'){
				$(this).find('.jt-home-expand-shop-tool-wrap').hide();
			}
		}
	});
	
	$('#comment-add-btn-best').unbind('click').bind('click', function(event){
		
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
	
	$('#comment-add-btn').unbind('click').bind('click', function(event){
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
			
			setTimeout('jtown.expand.changeContainerHeight()', 0);
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
	
	$('.jt-home-expand-shop-comment-loveIt').unbind('click').bind('click', function(){
		var me = $(this),
			parents = me.parents('.jt-home-expand-shop-comment-li'),
			$shop = me.parents('#jt-home-expand-shop');
		
		if(nullValueCheck(parents.html())){
			parents = me.parents('.jt-home-expand-shop-comment-li-best');
		}
		var commentPn = parents.attr('data-copn');
		
		var url = contextPath + 'ajax/home/toggleCommentLove.jt';
		var json = {	commentPn	:	commentPn,
						sellerPn	:	$shop.attr('data-spn') 		};
		
		$.postJSON(url, json, function(comment){
			if(!nullValueCheck(comment.message)){
				switch (Number(comment.message)) {
				case 1:
					jtown.header.showLoginForm();					
					break;
				case 2:
					jtown.dialog('판매자는 불가능 합니다.');
					break;
				default:
					break;
				}
			}else{
				var crudType = comment.crudType;
				if(crudType == 'insert'){
					$('.copnLoveIt-'+commentPn+' .jt-home-expand-shop-comment-loveIt-count').after('<a href="#none" class="jt-home-expand-shop-comment-loveIt-cancle">&nbsp;취소</a>');
					jtown.comment.loveCancle();
				}else if(crudType == 'delete'){
					$('.copnLoveIt-'+commentPn).find('.jt-home-expand-shop-comment-loveIt-cancle').remove();
				}
			}
		});
	});
	
	jtown.comment.loveCancle();
	
	$('.jt-warn-active').unbind('click').bind('click', function(){
		var me = $(this),
			parents = me.parents('.jt-home-expand-shop-comment-li');
		
		if(nullValueCheck(parents.html())){
			parents = me.parents('.jt-home-expand-shop-comment-li-best');
		}
		var commentPn = parents.attr('data-copn');
		
		var url = contextPath + 'ajax/home/warnCommentLove.jt';
		var json = {	commentPn	:	commentPn 	};
		
		$.postJSON(url, json, function(comment){
			if(!nullValueCheck(comment.message)){
				jtown.dialog(comment.message );
			}else{
				me.removeClass('jt-warn-active').addClass('jt-warn-disactive').unbind('click');	
			}
		});
	});
	
};

jtown.comment.loveCancle = function(){
	$('.jt-home-expand-shop-comment-loveIt-cancle').unbind('click').bind('click', function(){
		var me = $(this),
			parents = me.parents('.jt-home-expand-shop-comment-li'),
			shop = me.parents('#jt-home-expand-shop');
		
		if(nullValueCheck(parents.html())){
			parents = me.parents('.jt-home-expand-shop-comment-li-best');
		}
		var commentPn = parents.attr('data-copn');
		
		var url = contextPath + 'ajax/home/toggleCommentLove.jt';
		var json = {	commentPn	:	commentPn,
						sellerPn	:	shop.attr('data-spn') 		};
		
		$.postJSON(url, json, function(comment){
			if(!nullValueCheck(comment.message)){
				jtown.header.showLoginForm();
			}else{
				var crudType = comment.crudType;
				if(crudType == 'delete'){
					$('.copnLoveIt-'+commentPn).find('.jt-home-expand-shop-comment-loveIt-cancle').remove();
				}
			}
		});
	});
};

jtown.comment.commentHtml = function(comment, position, best){
	var cpn = $('#jt-logout').attr('data-cpn');
	var cancleHtml = '&nbsp;<a href="#none" class="jt-home-expand-shop-comment-loveIt-cancle">취소</a>';
	var cancleComment = nullValueCheck(comment.commentCustomerPn) ? '' : cancleHtml;
	var warnComment = '';
	if(comment.customerPn != cpn){
		if(nullValueCheck(comment.warnCustomerPn)){
			warnComment = '&nbsp;<span href="#none" class="jt-warn-active" title="신고">WARN</span>';
		}else{
			warnComment = '&nbsp;<span href="#none" class="jt-warn-disactive" title="신고">WARN</span>';
		}
	}
	
	var commentHtml ='';
	commentHtml += 	'<li data-copn="'+comment.commentPn+'" class="' + (best ? 'jt-home-expand-shop-comment-li-best' : 'jt-home-expand-shop-comment-li') + '">';
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
	if(comment.customerPn == cpn){
	commentHtml +=	'	<div class="jt-home-expand-shop-update-wrap">';
	commentHtml +=	'		<input type="text" class="jt-comment-update-input" value="'+htmlChars(comment.comment)+'" maxlength="100"/><br/>';
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
		name = $parent.attr('data-name'),
		comment = me.val();
	if(nullValueCheck(comment)){
		return ;
	}
	
	var url, json = { 	'sellerPn' 	: spn };
	
	url = contextPath + 'ajax/home/existLove.jt';
	
	$.postJSON(url, json, function(result){
	
		postComment = function(){
			url = contextPath + 'ajax/home/insertComment.jt';
			json.comment = comment;
			$.postJSON(url, json, function(comment){
				me.val('');
				me.attr('readonly', 'readonly');
			});
		};
		
		if(!result){
			jtown.comment.loveconfirm(function(){jtown.home.clickLove(spn); setTimeout('postComment()', 0);}, function(){ postComment(); }, name);
		}else{
			postComment();
		}
		
	});
};

jtown.comment.loveconfirm = function(success, cancle, name){
	var dialog = '<div><div class="jt-love-img"><img src="'+contextPath+'resources/images/heart.jpg" alt="Heart"/></div></div>';
	$(dialog).dialog({
		resizable: false, width: '400px', modal : true, buttons : { 'YES' : function(){ success(); $(this).dialog('close');  }, 'NO' : function(){ cancle(); $(this).dialog('close');} }
	});
	$('.ui-dialog-titlebar').remove();
	$('.ui-widget-overlay').css('opacity','.9');
	$('.ui-dialog').removeClass('ui-widget-content').addClass('jt-love-dialog');
	$('.ui-dialog-content').removeClass('ui-widget-content').addClass('jt-love-dialog-content');
	$('.ui-dialog-content').after('<div class="jt-love-dialog-ment">쇼핑몰&nbsp;'+name+'에게 하트를 주시겠어요?</div>');
	$('.ui-dialog-buttonpane').removeClass('ui-widget-content').addClass('jt-love-dialog-buttonpane');
	$('.ui-dialog-buttonset').addClass('jt-love-dialog-buttonset');
	$('.ui-button').removeClass().addClass('jt-love-dialog-button');
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