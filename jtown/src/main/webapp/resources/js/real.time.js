if (typeof jtown.real == 'undefined') {
	jtown.real = {};
}

jtown.real.time = function(obj){

	if(obj.type =='love_count'){
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#love-expand-'+spn).html(count);
		$('#love-'+spn).html(count);
	}else if(obj.type == 'comment'){
		var spn = obj.sellerPn;
		var count = obj.count;
		$('#comment-expand-'+spn).html(count);
		$('#comment-'+spn).html(count);
	}else if(obj.type == 'event'){
		var spn = obj.sellerPn;
		$('#new-'+spn).html('new');
	}
	
};
