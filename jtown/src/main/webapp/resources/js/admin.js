if (typeof jtown.admin == 'undefined') {
	jtown.admin = {};
}

$(function() {
	jtown.admin.syncAdminPage();

	jtown.admin.showPartnershipContent();
	
	jtown.admin.openContractList();
	
	jtown.admin.openContract();
	
	jtown.admin.autoInterestSection();
	
	jtown.admin.changeCustomerEnable();
	
	jtown.admin.changeText('jt-partnership-name' , function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
			parent = thiz.parents(nameVo.selector),
			url = contextPath+'admin/ajax/changePartnership.jt',
			json = { pn : grandParent.attr('data-pspn'),
					 name : thiz.val()	};
		
		$.postJSON(url, json, function(partnership){
			parent.html(htmlChars(partnership.name));
		});
	});
	jtown.admin.changeText('jt-partnership-email', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changePartnership.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 email : thiz.val()	};
	
		$.postJSON(url, json, function(partnership){
			parent.html(htmlChars(partnership.email));
		});
	});
	jtown.admin.changeText('jt-partnership-phoneNumber', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changePartnership.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 phoneNumber : thiz.val()	};
	
		$.postJSON(url, json, function(partnership){
			parent.html(htmlChars(partnership.phoneNumber));
		});
	});
	jtown.admin.changeSelect('jt-partnership-category', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		url = contextPath+'admin/ajax/changePartnership.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 categoryPn : thiz.val()	};
		$.postJSON(url, json, function(partnership){
		});
	});
	jtown.admin.changeSelect('jt-partnership-adminPn', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		url = contextPath+'admin/ajax/changePartnershipJson.jt',
		json = { key : grandParent.attr('data-pspn'),
				 value : thiz.val()	};
		$.postJSON(url, json, function(partnership){
		});
	});
	jtown.admin.changeSelect('jt-partnership-process', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		url = contextPath+'admin/ajax/changePartnership.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 process : thiz.val()	};
		$.postJSON(url, json, function(partnership){
		});
	});
	
	jtown.admin.sellerCreate();
	
	jtown.admin.sellerSync();
});

jtown.admin.sellerCreate = function(){
	$('.jt-seller-create-btn').unbind('click').bind('click', function(){
		var parent = $(this).parents('.jt-partnership-info'),
			pspn = parent.attr('data-pspn'),
			shopUrl =  parent.find('.jt-seller-shopUrl-input'),
			name = parent.find('.jt-seller-name-input');
		var url = contextPath + 'admin/ajax/createSeller.jt';
		var json =	{ 	shopUrl : shopUrl.val(),
						name	: name.val(),
						pn		: pspn			};
		
		$.postJSON(url, json, function(jtownUser){
			parent.attr('data-spn', jtownUser.pn);
			parent.find('.jt-seller-create').text(htmlChars(jtownUser.username)).removeClass('jt-seller-create');
			parent.find('.jt-seller-shopUrl').text(htmlChars(jtownUser.shopUrl)).addClass('jt-partnership-shopUrl').removeClass('jt-seller-shopUrl');
			parent.find('.jt-seller-name').text(htmlChars(jtownUser.name)).addClass('jt-partnership-sellerName').removeClass('jt-seller-name');
			parent.find('.jt-seller-enabled').addClass('jt-partnership-enabled').removeClass('jt-seller-enabled');
			
			setTimeout('jtown.admin.sellerSync()', 0);
		});
	});
};

jtown.admin.sellerSync = function(){
	jtown.admin.changeText('jt-partnership-shopUrl', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changeSeller.jt',
		json = { pn : grandParent.attr('data-spn'),
				 shopUrl : thiz.val()	};
	
		$.postJSON(url, json, function(jtownUser){
			parent.html(htmlChars(jtownUser.shopUrl));
		});
	});
	jtown.admin.changeText('jt-partnership-sellerName', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changeSeller.jt',
		json = { pn : grandParent.attr('data-spn'),
				 name : thiz.val()	};
	
		$.postJSON(url, json, function(jtownUser){
			parent.html(htmlChars(jtownUser.name));
		});
	});
	jtown.admin.changeSelect('jt-partnership-enabled', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		url = contextPath+'admin/ajax/changeEnabled.jt',
		json = { pn : grandParent.attr('data-spn'),
				enabled : (thiz.val() == 1 ? true : false)	};
		$.postJSON(url, json, function(jtownUser){
		});
	});
};

jtown.admin.changeText = function(name, callback){
	var nameVo = { 	selector : '.'+name,
					input : name+'-input',
					inputSelector : '#'+name+'-input',
					parentSelector : '.jt-partnership-info'	};
	
	$(nameVo.selector).unbind('mouseup').bind('mouseup', function(){
		var me = $(this),  value = me.text(),
			html = '<input class="" id="' + nameVo.input + '" type="text" value="' + value + '" style="width: '+(Number(me.width())-14)+'px;"/>';
		me.html(html);
		
		$(nameVo.inputSelector).focus();
		$(nameVo.inputSelector).bind('focusout', function(){
			callback($(this), nameVo);
		});
	});
};

jtown.admin.changeSelect = function(name, callback){
	var nameVo = { 	selector : '.'+name,
					input : name+'-select',
					inputSelector : '.'+name+'-select',
					parentSelector : '.jt-partnership-info'	};
	$(nameVo.inputSelector).unbind('change').bind('change', function(){
		callback($(this), nameVo);
	});
};

jtown.admin.syncAdminPage = function(){

	$('.jt-admin-seller-table-interestList').unbind('mouseup').bind('mouseup', function(){
		jtown.admin.insertInputBox($(this), 'jt-admin-seller-table-interestList');
	});
	
	$('.jt-admin-seller-table-interestList-input').unbind('focusout').bind('focusout', function(){
		jtown.admin.deleteInputBox($(this), 'jt-admin-seller-table-interestList');
	});
	
	$('.jt-admin-seller-table-interestList-input').unbind('change').bind('change', function(){
		jtown.admin.changeInterest($(this));
	});

};

jtown.admin.autoInterestSection = function(){
	$( "#interestSectionList" ).bind( "keydown", function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {
			event.preventDefault();
		}
    }).autocomplete({
		minLength: 0,
		source: function( request, response ) {
			var url = contextPath + 'ajax/admin/autoInterestSection.jt',
			json = {	'categoryPn' : $('#interestCategory').val() };
		
			$.postJSON(url, json, function(interestes){
				var data = [];
				
				for(var i=0, len = interestes.length ; i< len; i++){
					var interest = interestes[i];
					data[i] = { label : interest.name , value : interest.name };
				}
				response( data );
			});
		},
		focus: function() {
			return false;
		},
		select: function(event, ui) {
			var terms = split( this.value );
			terms.pop();
			terms.push(ui.item.value);
			terms.push('');
			this.value = terms.join(',');
			return false;
		}
	});	
};

function split( val ) {
	return val.split( /,\s*/ );
}

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


jtown.admin.changeCustomerEnable = function(){
	$('.jt-admin-customer-enable').unbind('change').bind('change', function(){
		var parents = $(this).parents('.jt-admin-customer-table-tr'),
			pn = parents.attr('data-cpn');
		var enabled = $(this).val();
		
		var json = {
				'pn' : pn,
				'enabled' : (enabled == 1 ? true : false)
		};
		
		var url = contextPath + 'admin/ajax/changeEnabled.jt';
		
		$.postJSON(url, json, function(){
		});
	});
};

jtown.admin.showPartnershipContent = function(){
	
	$('.jt-partnership-table-information').unbind('click');
	$('.jt-partnership-table-information').bind('click', function(){
		var partnershipPn =	$(this).parents('.jt-partnership-info').attr('data-pspn');
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
