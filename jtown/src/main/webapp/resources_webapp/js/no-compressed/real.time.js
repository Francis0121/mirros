if (typeof mobile.real == 'undefined') {
	mobile.real = {};
}

$(function(){
	mobile.real.start();
});
mobile.real.start = function(){
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
			mobile.real.time(data);
		});		
	});
};

mobile.real.time = function(data) {
	var obj = eval('('+data+')');
	if(obj.redisType == 'comment_feed'){
		var mobileHtml = '';
		mobileHtml += '<div class="jt-app-reply-comment-wrap" data-url="'+obj.url+'" data-comment-pn="'+obj.commentPn+'">';
		mobileHtml += '<div class="jt-app-reply-under-arrow-wrap"><div class="jt-app-reply-under-arrow"></div></div>';
		if(obj.contentType != '-1'){
			mobileHtml += 		'<div class="jt-app-reply-img-wrap" data-productPn="'+obj.productPn+'">';
			if(obj.contentType == null){
				mobileHtml += '<img src="'+contextPath+'/resources/uploadImage/'+obj.saveName +'" alt="'+obj.productName +'" />';
			}else{
				mobileHtml += '<img src="'+contextPath+'/photo/thumbnail/'+obj.saveName+'product.'+obj.contentType+'" alt="'+obj.productName+'" />';
			}
			mobileHtml += '</div>';
		}else{
			mobileHtml += '<div class="jt-app-reply-event-wrap" data-eventPn="'+obj.eventPn+'"><div class="jt-tab-wrap"><div class="jt-tab-event"></div></div></div>';
		}
		mobileHtml +=		'<div class="jt-app-reply-contents-wrap">';
		mobileHtml += 			'<div class="jt-app-reply-product-name">'+obj.productName+'</div>';
		mobileHtml += 			'<div class="jt-app-reply-comment">'+obj.comment+'</div>';		
		mobileHtml += 			'<div class="jt-app-reply-comment-date"><div class="jt-app-reply-clock"></div><div>'+obj.comparedTime+'</div></div>';
		mobileHtml += 		'</div>';
		mobileHtml += '</div>';
		$('.jt-app-reply-contents-item-wrap').prepend(mobileHtml);
	}
};

