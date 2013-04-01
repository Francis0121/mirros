if (typeof jtown.admin == 'undefined') {
	jtown.admin = {};
}

$(document).ready(function() {
	jtown.admin.createSubmit();
	
	jtown.admin.syncAdminPage();
	
	jtown.admin.partnershipProcess();
	
	jtown.admin.showPartnershipContent();
	
	jtown.admin.openContractList();
	
	jtown.admin.openContract();
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
	
	$('.jt-admin-customer-enable').unbind('change');
	$('.jt-admin-customer-enable').bind('change', function(){
		jtown.admin.changeCustomerEnable($(this));
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

jtown.admin.changeCustomerEnable = function(me){
	var parents = me.parents('.jt-admin-customer-table-tr');
	var enabled = me.val();
	var customerId = parents.children('.jt-admin-customer-table-customerId').text();
	
	var json = {
			'username' : customerId,
			'enabled' : (enabled == 1 ? true : false)
	};
	
	var url = contextPath + 'admin/changeEnable';
	
	$.postJSON(url, json, function(){
		return jQuery.ajax({
			'success' : function(){
				alert('사용자의 상태가 변경되었습니다.');
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
	
	var html = '<input class="' + inputName + '" id="' + inputName + '" type="text" value="' + value + '" style="width: '+(Number(me.width())-14)+'px;"/>';

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

jtown.admin.partnershipProcess = function(){
	
	$('.jt-partnership-process').unbind('change');
	$('.jt-partnership-process').bind('change', function(){
		if(confirm('변경 하시겠습니까?')){
			var partnershipPn = $(this).attr('data-pspn');
			var process = $(this).val();
			var url = contextPath + 'ajax/admin/process.jt';
			var json = { pn : partnershipPn, process : process };
			
			$.postJSON(url, json, function(){
			});
		}
	});
	
};

jtown.admin.showPartnershipContent = function(){
	
	$('.jt-partnership-table-information').unbind('click');
	$('.jt-partnership-table-information').bind('click', function(){
		var partnershipPn =	$(this).attr('data-pspn');
		$('#partnership-content-'+partnershipPn).toggle();
	});
};

jtown.admin.openContractList = function(){
	
	$('.jt-admin-contract-list').unbind('click');
	$('.jt-admin-contract-list').bind('click', function(){
		var parent = $(this).parents('.jt-admin-seller-table-tr');
		var spn = parent.attr('data-pn');
		
		var url = contextPath + 'admin/contractList/?sellerPn='+spn;
		var option = 'width=400, height=300, resizable=no, scrollbars=no, status=no';
		
		window.open(url, '', option);
	});
};

jtown.admin.openContract = function(){
	
	$('.jt-admin-contract').unbind('click');
	$('.jt-admin-contract').bind('click', function(){
		var parent = $(this).parents('.jt-admin-seller-table-tr');
		var spn = parent.attr('data-pn');
		
		var url = contextPath + 'admin/contract/?sellerPn='+spn;
		var option = 'width=400, height=300, resizable=no, scrollbars=no, status=no';
		
		window.open(url, '', option);
	});
	
};
