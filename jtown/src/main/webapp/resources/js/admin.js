if (typeof jtown.admin == 'undefined') {
	jtown.admin = {};
}

jtown.admin.createSubmit = function(){
	$('.jt-create-seller-submit').unbind('click');
	$('.jt-create-seller-submit').bind('click', function() {
		var form = document.forms['jtownUser'];
		form.submit();
	});
};