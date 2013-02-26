if (typeof jtown.admin == 'undefined') {
	jtown.admin = {};
}

$(document).ready(function() {
	jtown.admin.createSubmit();
	
	jtown.admin.syncAdminPage();
});

jtown.admin.createSubmit = function(){
	$('.jt-create-seller-submit').unbind('click');
	$('.jt-create-seller-submit').bind('click', function() {
		var form = document.forms['jtownUser'];
		form.submit();
	});
};

jtown.admin.syncAdminPage = function(){
	
	$('.jt-admin-seller-table-shopUrl').unbind('mouseup');
	$('.jt-admin-seller-table-shopUrl').bind('mouseup', function(){
		jtown.admin.insertInputBox($(this), 'jt-admin-seller-table-shopUrl');
	});
	
	$('.jt-admin-seller-table-shopUrl-input').unbind('focusout');
	$('.jt-admin-seller-table-shopUrl-input').bind('focusout', function(){
		jtown.admin.deleteInputBox($(this), 'jt-admin-seller-table-shopUrl');
	});
	
	$('.jt-admin-seller-table-shopUrl-input').unbind('change');
	$('.jt-admin-seller-table-shopUrl-input').bind('change', function(){
		jtown.admin.changeShopUrl($(this));
	});
	
	$('.jt-admin-seller-table-interestList').unbind('mouseup');
	$('.jt-admin-seller-table-interestList').bind('mouseup', function(){
		jtown.admin.insertInputBox($(this), 'jt-admin-seller-table-interestList');
	});
	
	$('.jt-admin-seller-table-interestList-input').unbind('focusout');
	$('.jt-admin-seller-table-interestList-input').bind('focusout', function(){
		jtown.admin.deleteInputBox($(this), 'jt-admin-seller-table-interestList');
	});
};

jtown.admin.changeShopUrl = function(me){
	var parents = me.parents('.jt-admin-seller-table-tr');
	
	var sellerPn = parents.attr('data-pn');
	var shopUrl = me.val();
	
	var json = {
			'pn' : sellerPn,
			'shopUrl' : shopUrl
	};
	
	var url = contextPath + 'admin/changeShopUrl';
	
	$.postJSON(url, json, function(){
		return jQuery.ajax({
			'success' : function(){
				alert('주소 변경 성공');
			},
			'error' : function(){
				alert('에러 발생!');
			}
		});
	});
};

jtown.admin.changeInterest = function(){
	
};

jtown.admin.insertInputBox = function(me, clazz){
	var value = me.text();
	
	var inputName = clazz + '-input';
	
	var html = '<input class="' + inputName + '" id="' + inputName + '" type="text" value="' + value + '" />';
	
	me.html(html);
	jtown.admin.setFocus(inputName);
	
	jtown.admin.syncAdminPage();
};

jtown.admin.deleteInputBox = function(me, clazz){
	var parent = me.parents('.' + clazz);
	var value = me.val();
	
	parent.html(value);
};

jtown.admin.setFocus = function(clazz){
	$('.' + clazz + ':input:visible:enabled:first').focus();
};