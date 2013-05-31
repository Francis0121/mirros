if (typeof jtown.board == 'undefined') {
	jtown.board = {};
}

$(document).ready(function() {
	jtown.board.noticeWrite();
	
	jtown.board.noticeContent();
});

jtown.board.noticeWrite = function(){
	$('#jt-admin-noticeWrite-btn').unbind('click').bind('click', function(){
		var form = document.forms['board'];
		oEditors[0].exec("UPDATE_CONTENTS_FIELD", []);
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