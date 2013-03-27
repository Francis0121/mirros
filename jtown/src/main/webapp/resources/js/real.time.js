if (typeof jtown.real == 'undefined') {
	jtown.real = {};
}

jtown.real.time = function(obj) {

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
				jtown.comment.commentHtml(obj, 'first');
				setTimeout('jtown.comment.syncComment()', 0);
				setTimeout('jtown.expand.changeContainerHeight(\'1\')', 0);
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
				setTimeout('jtown.expand.changeContainerHeight(\'-1\')', 0);
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
				$('#copnLoveIt-'+copn).html(count == 0 ? '': count);
			}
		}
	}

};
