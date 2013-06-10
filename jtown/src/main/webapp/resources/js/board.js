if (typeof jtown.board == 'undefined') {
	jtown.board = {};
}

$(document).ready(function() {
	jtown.board.noticeWrite();
});

jtown.board.noticeWrite = function(){
	$('#jt-admin-noticeWrite-btn').unbind('click').bind('click', function(){
		var form = document.forms['board'];
		form._method.value='post';
		oEditors[0].exec("UPDATE_CONTENTS_FIELD", []);
		form.submit();
	});
	$('#jt-admin-noticeUpdate-btn').unbind('click').bind('click', function(){
		var form = document.forms['board'];
		form._method.value='put';
		oEditors[0].exec("UPDATE_CONTENTS_FIELD", []);
		form.submit();
	});
};
