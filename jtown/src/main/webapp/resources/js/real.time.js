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
		var crudType = obj.crudType;

		if (crudType == 'insert') {
			$('#jt-heart-click-'+spn).addClass('jt-heart-animation');
			$('#love-image-' + spn).addClass('jt-home-shop-love-click');
			$('#love-' + spn).addClass('jt-home-shop-love-text-click');
		} else if (crudType == 'delete') {
			$('#jt-heart-click-'+spn).removeClass('jt-heart-animation');
			$('#love-image-' + spn).removeClass('jt-home-shop-love-click');
			$('#love-' + spn).removeClass('jt-home-shop-love-text-click');
		}
		if (!nullValueCheck(expandShop.html())) {
			var expandSpn = expandShop.attr('data-spn');
			if (spn == expandSpn){
				$('#love-expand-' + spn).html(count);
				if (crudType == 'insert') {
					$('#jt-heart-expand-click-'+spn).addClass('jt-heart-animation');
					$('#love-expand-image-' + spn).addClass('jt-home-shop-love-click');
					$('#love-expand-' + spn).addClass('jt-home-shop-love-text-click');
				} else if (crudType == 'delete') {
					$('#jt-heart-expand-click-'+spn).removeClass('jt-heart-animation');
					$('#love-expand-image-' + spn).removeClass('jt-home-shop-love-click');
					$('#love-expand-' + spn).removeClass('jt-home-shop-love-text-click');
				}
			}
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