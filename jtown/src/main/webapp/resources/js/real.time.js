if (typeof jtown.real == 'undefined') {
	jtown.real = {};
}

jtown.real.time = function(data) {

	var obj = eval('('+data+')');
	
	var expandShop = $('#jt-home-expand-shop');

	if (obj.redisType == 'love_count') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#love-' + spn).html(count);
		if (!nullValueCheck(expandShop.html())) {
			var expandSpn = expandShop.attr('data-spn');
			if (spn == expandSpn)
				$('#love-expand-' + spn).html(count);
		}
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
		$('#new-' + spn).html('new');
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
	}
};

jtown.real.loveRank = function(data){
	var sellerPnList = data.split(',');
	
	$('.jt-home-shop-love-hot').remove();
	var html = '<span class="jt-home-shop-love-hot">HOT</span>';
	var idStr = '#love-image-';
	
	var expandShop = $('#jt-home-expand-shop');
	
	if (!nullValueCheck(expandShop.html())) {
		var expandSpn = expandShop.attr('data-spn');	
		if(sellerPnList.indexOf(expandSpn) != -1){
			$('.jt-home-expand-shop-content-love').before(html);
		}
	}
	
	for(var i=0, len=sellerPnList	.length; i < len; i++){
		var element = sellerPnList[i];
		element = idStr + element;
		$(element).before(html);
	}
};