if (typeof mobile.real == 'undefined') {
	mobile.real = {};
}

mobile.real.time = function(data) {

	var obj = eval('('+data+')');
	// love, view, event
	if (obj.redisType == 'love_count') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#love-' + spn).html(count);
		var cpn = obj.customerPn;
		var nowcpn = $('#mm-logout').attr('data-cpn');
		
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
	} else if (obj.redisType == 'delete_comment') {
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#comment-' + spn).html(count);
	} else if (obj.redisType == 'update_comment') {
		
	}  else if(obj.redisType == 'love_comment'){
	
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