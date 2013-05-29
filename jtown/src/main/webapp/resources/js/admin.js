if (typeof jtown.admin == 'undefined') {
	jtown.admin = {};
}

$(function() {
	
	jtown.admin.showPartnershipContent();
	
	jtown.admin.openContractList();
	
	jtown.admin.openContract();
	
	
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
	}, function(){});
	jtown.admin.changeText('jt-partnership-email', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changePartnership.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 email : thiz.val()	};
	
		$.postJSON(url, json, function(partnership){
			parent.html(htmlChars(partnership.email));
		});
	}, function(){});
	jtown.admin.changeText('jt-partnership-phoneNumber', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changePartnership.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 phoneNumber : thiz.val()	};
	
		$.postJSON(url, json, function(partnership){
			parent.html(htmlChars(partnership.phoneNumber));
		});
	}, function(){});
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
	
	jtown.admin.autoInterest();
});

jtown.admin.sellerCreate = function(){
	$('.jt-seller-create-btn').unbind('click').bind('click', function(){
		var parent = $(this).parents('.jt-partnership-info'),
			pspn = parent.attr('data-pspn'),
			shopUrl =  parent.find('.jt-seller-shopUrl-input'),
			name = parent.find('.jt-seller-name-input'),
			interestSectionList = parent.find('.jt-seller-interest-input'),
			category = parent.find('.jt-partnership-category-select');
		
		var url = contextPath + 'admin/ajax/createSeller.jt';
		var json =	{ 	shopUrl : shopUrl.val(),
						name	: name.val(),
						pn		: pspn,
						interestCategory : category.val(),
						interestSectionList : interestSectionList.val()};
		
		$.postJSON(url, json, function(jtownUser){
			parent.attr('data-spn', jtownUser.pn);
			parent.find('.jt-seller-create').text(htmlChars(jtownUser.username)).removeClass('jt-seller-create');
			parent.find('.jt-seller-shopUrl').text(htmlChars(jtownUser.shopUrl)).addClass('jt-partnership-shopUrl').removeClass('jt-seller-shopUrl');
			parent.find('.jt-seller-name').text(htmlChars(jtownUser.name)).addClass('jt-partnership-sellerName').removeClass('jt-seller-name');
			parent.find('.jt-seller-enabled').addClass('jt-partnership-enabled').removeClass('jt-seller-enabled');
			parent.find('.jt-seller-interest').text(htmlChars(jtownUser.interestSectionList)).addClass('jt-partnership-interest').removeClass('jt-seller-interest');
			
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
	}, function(){});
	jtown.admin.changeText('jt-partnership-sellerName', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changeSeller.jt',
		json = { pn : grandParent.attr('data-spn'),
				 name : thiz.val()	};
	
		$.postJSON(url, json, function(jtownUser){
			parent.html(htmlChars(jtownUser.name));
		});
	}, function(){});
	jtown.admin.changeText('jt-partnership-interest', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changeInterest.jt',
		category = grandParent.find('.jt-partnership-category-select'),
		json = { 	sellerPn : grandParent.attr('data-spn'),
					categoryPn : category.val(),
					interestSectionNameList : thiz.val()};
	
		$.postJSON(url, json, function(){
			parent.html(htmlChars(thiz.val()));
		});
	}, jtown.admin.autoInterestOne);
	jtown.admin.changeSelect('jt-partnership-enabled', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		url = contextPath+'admin/ajax/changeEnabled.jt',
		json = { pn : grandParent.attr('data-spn'),
				enabled : (thiz.val() == 1 ? true : false)	};
		$.postJSON(url, json, function(jtownUser){
		});
	});
};

jtown.admin.changeText = function(name, callback, event){
	var nameVo = { 	selector : '.'+name,
					input : name+'-input',
					inputSelector : '#'+name+'-input',
					parentSelector : '.jt-partnership-info'	};
	
	$(nameVo.selector).unbind('mouseup').bind('mouseup', function(){
		var me = $(this),  value = me.text(),
			html = '<input class="" id="' + nameVo.input + '" type="text" value="' + value + '" style="width: '+(Number(me.width())-14)+'px;"/>';
		me.html(html);
		
		setTimeout(event, 0);
		
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

jtown.admin.autoInterestOne = function(){
	var categoryPn = '';
	$('#jt-partnership-interest-input').bind( 'keydown', function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( 'ui-autocomplete' ).menu.active ) {
			event.preventDefault();
		}
		if(categoryPn == '' ){
			var parent = $(this).parents('.jt-partnership-info');
			categoryPn =  parent.find('.jt-partnership-category-select').val();
		}
    }).autocomplete({
		minLength: 0,
		source: function( request, response ) {
			var url = contextPath + 'admin/ajax/autoInterestSection.jt',
				json = {	'categoryPn' : categoryPn,
							'name'		: request.term };
		
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

jtown.admin.autoInterest = function(){
	var categoryPn = '';
	$('.jt-seller-interest-input').bind( 'keydown', function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( 'ui-autocomplete' ).menu.active ) {
			event.preventDefault();
		}
		if(categoryPn == '' ){
			var parent = $(this).parents('.jt-partnership-info');
			categoryPn =  parent.find('.jt-partnership-category-select').val();
		}
    }).autocomplete({
		minLength: 0,
		source: function( request, response ) {
			var url = contextPath + 'admin/ajax/autoInterestSection.jt',
				json = {	'categoryPn' : categoryPn,
							'name'		: request.term };
		
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
