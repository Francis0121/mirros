if (typeof jtown.board == 'undefined') {
	jtown.board = {};
}

$(document).ready(function() {
	jtown.board.noticeWrite();
	
	jtown.board.noticeContent();
});

jtown.board.noticeWrite = function(){
	$('#jt-admin-noticeWrite-btn').unbind('click');
	$('#jt-admin-noticeWrite-btn').bind('click', function(){
		var form = document.forms['board'];
		form.submit();
	});
};

jtown.board.noticeContent = function(){
	$('.jt-notice-content-tr').unbind('click');
	$('.jt-notice-content-tr').bind('click', function(){
		var me = $(this);
		var pn = me.attr('data-pn');
		location.href= contextPath + "admin/noticeContent?pn=" + pn;
	});
};