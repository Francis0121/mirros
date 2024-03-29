if (typeof jtown.real == 'undefined') {
	jtown.real = {};
}
$(function(){
	jtown.real.start();
});
jtown.real.start = function(){
	var options = {
			secure : false,
			'reconnect': true,
			'reopen delay': 500,
			'max reconnection attempts': 10,
			'reconnection delay' : 500,
			'connect timeout': 500
		};	
	
	var socket = io.connect(nodePath, options);

	socket.on('connect', function() {
		socket.on('real_time', function(data){
			jtown.real.time(data);
		});		
		socket.on('love_rank', function(data){
			jtown.real.loveRank(data);
		});
	});
};

jtown.real.time = function(data) {

	var obj = eval('('+data+')');
	
	var expandShop = $('#jt-home-expand-shop');

	if (obj.redisType == 'love_count') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#love-' + spn).html(count);
		var crudType = obj.crudType;
		var cpn = obj.customerPn;
		var nowcpn = $('#jt-logout').attr('data-cpn');
		
		/*
		if(cpn == nowcpn){
			if (crudType == 'insert') {
				$('#love-image-' + spn).addClass('jt-home-shop-love-click');
				$('#love-' + spn).addClass('jt-home-shop-love-text-click');
			} else if (crudType == 'delete') {
				$('#love-image-' + spn).removeClass('jt-home-shop-love-click');
				$('#love-' + spn).removeClass('jt-home-shop-love-text-click');
			}
			if (!nullValueCheck(expandShop.html())) {
				var expandSpn = expandShop.attr('data-spn');
				if (spn == expandSpn){
					$('#love-expand-' + spn).html(count);
					if (crudType == 'insert') {
						$('#love-expand-image-' + spn).addClass('jt-home-shop-love-click');
						$('#love-expand-' + spn).addClass('jt-home-shop-love-text-click');
					} else if (crudType == 'delete') {
						$('#love-expand-image-' + spn).removeClass('jt-home-shop-love-click');
						$('#love-expand-' + spn).removeClass('jt-home-shop-love-text-click');
					}
				}
			}
		}*/
	} else if (obj.redisType == 'view_count') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#view-' + spn).html(count);
		if (!nullValueCheck(expandShop.html())) {
			var expandSpn = expandShop.attr('data-spn');
			if (spn == expandSpn)
				$('#view-expand-' + spn).html(count);
		}
	} else if (obj.redisType == 'insert_comment') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#comment-' + spn).html(count);
		if (!nullValueCheck(expandShop.html())) {
			var expandSpn = expandShop.attr('data-spn');
			if (spn == expandSpn) {
				$('#comment-expand-' + spn).html(count);
				jtown.comment.commentHtml(obj, 'first', false);
				setTimeout('jtown.comment.syncComment()', 0);
				setTimeout('jtown.expand.changeContainerHeight()', 0);
			}
		}
	} else if (obj.redisType == 'delete_comment') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#comment-' + spn).html(count);
		if (!nullValueCheck(expandShop.html())) {
			var expandSpn = expandShop.attr('data-spn');
			if (spn == expandSpn) {
				$('#comment-expand-' + spn).html(count);
				$('.jt-home-expand-shop-comment>li[data-copn='+obj.commentPn+']').remove();
				setTimeout('jtown.expand.changeContainerHeight()', 0);
			}
		}
	} else if (obj.redisType == 'update_comment') {
		if (!nullValueCheck(expandShop.html())) {
			var commentLi = $('.jt-home-expand-shop-comment>li[data-copn='+obj.commentPn+']');
			if(!nullValueCheck(commentLi.html()))
				commentLi.find('.jt-home-expand-shop-comment-text').html(htmlChars(obj.comment));
		}
	} else if (obj.redisType == 'event') {
		var spn = obj.sellerPn;
		$('#new-' + spn).css('display', 'block');
	} else if(obj.redisType == 'love_comment'){
		var spn = obj.sellerPn;
		var copn = obj.commentPn;
		var count = obj.commentLoveCount;
		
		if (!nullValueCheck(expandShop.html())) {
			var expandSpn = expandShop.attr('data-spn');
			if (spn == expandSpn) {			
				$('.copnLoveIt-'+copn).find('.jt-home-expand-shop-comment-loveIt-count').html(count == 0 ? '': count);
			}
		}
	}else if(obj.redisType == 'product_heart_count'){
		var productPn = obj.productPn;
		var count = obj.count;
		$('#jt-pg-heart-count-' + productPn).html(count);
		var crudType = obj.crudType;
		var cpn = obj.customerPn;
		var nowcpn = $('#jt-logout').attr('data-cpn');
		
		if(cpn == nowcpn){
			if (crudType == 'productHeartInsert') {
				$('#jt-pg-heart-click-' + productPn).addClass('jt-home-shop-love-click');
				$('#jt-pg-heart-count-' + productPn).addClass('jt-home-shop-love-text-click');
			} else if (crudType == 'productHeartDelete') {
				$('#jt-pg-heart-click-' + productPn).removeClass('jt-home-shop-love-click');
				$('#jt-pg-heart-count-' + productPn).removeClass('jt-home-shop-love-text-click');
			}
		}
	}else if(obj.redisType == 'event_heart_count'){
		var eventPn = obj.eventPn;
		var count = obj.count;
		$('#jt-pg-heart-count-e-' + eventPn).html(count);
		var crudType = obj.crudType;
		var cpn = obj.customerPn;
		var nowcpn = $('#jt-logout').attr('data-cpn');
		
		if(cpn == nowcpn){
			if (crudType == 'eventHeartInsert') {
				$('#jt-pg-heart-click-e-' + eventPn).addClass('jt-home-shop-love-click');
				$('.jt-pg-heart-wrap #jt-pg-heart-click-e-' + eventPn).addClass('jt-home-shop-love-click');
				$('#jt-pg-heart-count-e-' + eventPn).addClass('jt-home-shop-love-text-click');
			} else if (crudType == 'eventHeartDelete') {
				$('#jt-pg-heart-click-e-' + eventPn).removeClass('jt-home-shop-love-click');
				$('.jt-pg-heart-wrap #jt-pg-heart-click-e-' + eventPn).removeClass('jt-home-shop-love-click');
				$('#jt-pg-heart-count-e-' + eventPn).removeClass('jt-home-shop-love-text-click');
			}
		}
	}else if(obj.redisType == 'comment_feed'){
		var html ='';
		html +='<div class="jt-sidebar-comment-item" data-productPn="'+obj.productPn+'" data-url="'+obj.url +'">';
		html +=	'<span class="jt-sidebar-comment-item-product">'+obj.productName+'</span>';
		html +=	'<span class="jt-sidebar-comment-item-comment">'+obj.comment+'</span>';
		html +=	'<div class="jt-right-sidebar-comment-feed-dialog" role="dialog">';
		html +=		'<span class="jt-right-sidebar-comment-feed-dialog-arrow"> </span>';
		html +=		'<div class="jt-right-sidebar-comment-feed-dialog-contents">';
		if(obj.contentType == '-1'){
			html +=		'<div class="jt-right-sidebar-comment-feed-dialog-contents-img">';
			html +=			'<div class="jt-tab-event-wrap"><div class="jt-tab-event"></div></div>';
			html +=			'<div class="jt-right-sidebar-comment-feed-dialog-contents-event">'+obj.productName+'</div>';
			html +=		'</div>';
			html +=		'<div class="jt-right-sidebar-comment-feed-dialog-contents-text">';
			html +=		'<div class="jt-pg-event-line-shop-name jt-right-sidebar-comment-feed-dialog-contents-event-text">'+obj.saveName+'</div>';
			if(obj.price >= 0){
				html +='<div class="jt-pg-event-line-end-date jt-right-sidebar-comment-feed-dialog-contents-event-text">D- '+obj.price +'일 남았습니다.</div>';
			}else{
				html +='<div class="jt-pg-event-line-end-date jt-right-sidebar-comment-feed-dialog-contents-event-text">이벤트 기간이 만료되었습니다.</div>';
			}
			html +='</div>';
		}else{
			html +='<div class="jt-right-sidebar-comment-feed-dialog-contents-img">';
			if(obj.contentType == null){
				html+= 		'<img src="'+contextPath+'resources/uploadImage/'+obj.saveName +'" alt="'+obj.productName +'" />';
			}else{
				html+=			 '<img src="'+contextPath+'photo/thumbnail/'+obj.saveName+'product.'+obj.contentType+'" alt="'+obj.productName+'" />';
			}
			html +=				'</div>';
			html +=				'<div class="jt-right-sidebar-comment-feed-dialog-contents-text jt-right-sidebar-comment-feed-dialog-contents-product-text">';
			html +=					'<div>'+obj.productName+'</div>';
			html +=					'<div>'+jtown.pg.formatNumber(obj.price) +'</div>';
			html +=				'</div>';
		}
		html +=			'</div>';
		html +=	'</div>';
		html += '</div>';
		$('.jt-right-sidebar-comment-feed').prepend(html);
		$('.jt-sidebar-comment-item:first').hide().fadeIn(900);
	}
};

jtown.real.loveRank = function(data){
	var sellerPnList = data.split(',');
	$('.jt-home-shop-love-hot').remove();
	var html = '<span class="jt-home-shop-love-hot">HOT</span>';
	var idStr = '#love-';
	
	var expandShop = $('#jt-home-expand-shop');
	
	if (!nullValueCheck(expandShop.html())) {
		var expandSpn = expandShop.attr('data-spn');	
		if(sellerPnList.indexOf(expandSpn) != -1){
			$('.jt-home-expand-shop-content-love-wrap').append(html);
		}
	}
	
	for(var i=0, len=sellerPnList.length; i < len; i++){
		var element = sellerPnList[i];
		element = idStr + element;
		$(element).after(html);
	}
};