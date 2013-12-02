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
	console.log(obj);
	if(obj.redisType == 'comment_feed'){
		var mobileHtml = '';
		mobileHtml += '<div class="jt-app-reply-comment-wrap" data-url="'+obj.url+'">';
		if(obj.contentType != '-1'){
			mobileHtml += 		'<div class="jt-app-reply-img-wrap">';
			if(obj.contentType == null){
				mobileHtml += '<img src="'+contextPath+'/resources/uploadImage/'+obj.saveName +'" alt="'+obj.productName +'" />';
			}else{
				mobileHtml += '<img src="'+contextPath+'/photo/thumbnail/'+obj.saveName+'product.'+obj.contentType+'" alt="'+obj.productName+'" />';
			}
			mobileHtml += '</div>';
		}else{
			mobileHtml += '<div class="jt-app-reply-event-wrap"><span class="jt-app-event-mark jt-app-reply-event-mark"> </span></div>';
		}
		mobileHtml +=		'<div class="jt-app-reply-contents-wrap">';
		mobileHtml += 			'<div class="jt-app-reply-product-name">'+obj.productName+'</div>';
		mobileHtml += 			'<div class="jt-app-reply-comment">'+obj.comment+'</div>';		
		mobileHtml += 			'<div class="jt-app-reply-comment-date"><span>'+obj.comparedTime+'</span></div>';
		mobileHtml += 		'</div>';
		mobileHtml += '</div>';
		$('.jt-app-reply-contents').prepend(mobileHtml);
	}
};

