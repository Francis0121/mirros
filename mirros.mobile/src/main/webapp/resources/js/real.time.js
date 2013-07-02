if (typeof mobile.real == 'undefined') {
	mobile.real = {};
}

mobile.real.time = function(data) {

	var obj = eval('('+data+')');
	if (obj.redisType == 'love_count') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#love-' + spn).html(count);
		var cpn = obj.customerPn;
		var nowcpn = $('body').attr('data-cpn');
		
		if(cpn == nowcpn){
			var crudType = obj.crudType;
			if (crudType == 'insert') {
				$('#love-image-' + spn).addClass('mm-home-love-click');
				$('#love-' + spn).addClass('mm-home-love-number-click');
			} else if (crudType == 'delete') {
				$('#love-image-' + spn).removeClass('mm-home-love-click');
				$('#love-' + spn).removeClass('mm-home-love-number-click');
			}
		}
	} else if (obj.redisType == 'view_count') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#view-' + spn).html(count);
	} else if (obj.redisType == 'event') {
		var spn = obj.sellerPn;
		$('#new-' + spn).css('display', 'block');
	} else if (obj.redisType == 'insert_comment') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#comment-' + spn).html(count);
		mobile.comment(obj, 'first');
		setTimeout('mobile.commentSync()', 0);
	} else if (obj.redisType == 'delete_comment') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#comment-' + spn).html(count);
		$('.mm-mir-comment-content>ul>li[data-copn='+obj.commentPn+']').remove();
	} else if (obj.redisType == 'update_comment') {
		
		var commentLi = $('.mm-mir-comment-content>ul>li[data-copn='+obj.commentPn+']');
		if(!nullValueCheck(commentLi.html()))
			commentLi.find('.mm-mir-comment-text-content-text').html(htmlChars(obj.comment));
		
	} else if(obj.redisType == 'love_comment'){
		var copn = obj.commentPn;
		var count = obj.commentLoveCount;
		$('.comment-love-'+copn+' .mm-mir-comment-text-footer-loveIt-count').html(count == 0 ? '': count);
	}
};

mobile.real.loveRank = function(data){
	var sellerPnList = data.split(',');
	
	$('.jt-home-shop-love-hot').remove();
	var html = '<span class="jt-home-shop-love-hot">HOT</span>';
	var idStr = '#love-';

	for(var i=0, len=sellerPnList.length; i < len; i++){
		var element = sellerPnList[i];
		element = idStr + element;
		$(element).after(html);
	}
};