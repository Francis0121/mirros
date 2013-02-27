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
	
	$('.jt-admin-seller-table-interestList-input').unbind('change');
	$('.jt-admin-seller-table-interestList-input').bind('change', function(){
		jtown.admin.changeInterest($(this));
	});
	
	$('.jt-admin-seller-enable').unbind('change');
	$('.jt-admin-seller-enable').bind('change', function(){
		jtown.admin.changeEnable($(this));
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

jtown.admin.changeInterest = function(me){
	var parents = me.parents('.jt-admin-seller-table-tr');
	
	var interestListStr = me.val();
	
	var interestList = interestListStr.split(',');
	
	if(interestList.length == 1 && nullValueCheck(interestList)){
		alert('관심사는 1개 이상 등록하셔야 됩니다.');
		document.location.reload();
	} else if( interestList.length > 5 ){
		alert('관심사는 5개 이상 등록이 불가능합니다.');
		document.location.reload();
	} else {
		var sellerPn = parents.attr('data-pn');
		var categoryPn = parents.attr('data-categoryPn');
		
		var json = {
				'sellerPn' : sellerPn,
				'categoryPn' : categoryPn,
				'interestSectionNameList' : interestListStr
		};
		
		var url = contextPath + 'admin/changeInterest';
		$.postJSON(url, json, function(){
			return jQuery.ajax({
				'success' : function(){
					alert('관심사가 변경 되었습니다.');
				},
				'error' : function(){
					alert('에러발생!!!');
				}
			});
		});
	}
};

jtown.admin.changeEnable = function(me){
	var parents = me.parents('.jt-admin-seller-table-tr');
	var enabled = me.val();
	var sellerId = parents.children('.jt-admin-seller-table-sellerId').text();
	
	var json = {
		'username' : sellerId,
		'enabled' : (enabled == 1 ? true : false)
	};
	
	var url = contextPath + 'admin/changeEnable';
	
	$.postJSON(url, json, function(){
		return jQuery.ajax({
			'success' : function(){
				alert('판매자 상태가 변경되었습니다.');
			},
			'error' : function(){
				alert('에러 발생!!!');
			}
		});
	});
};

jtown.admin.insertInputBox = function(me, clazz){
	if( !nullValueCheck(me.children('input').val())){
		return;
	}
	
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