if (typeof jtown.admin == 'undefined') {
	jtown.admin = {};
}

var oEditors = [];

$(function() {
	
	$('#jt-search-partnership-btn').bind('click', function(){
		var form = document.forms['partnershipFilter'];
		form.page.value = 1;
		form.submit();
	});
	
	var boardContent = $('#board #content');
	if(boardContent.html() != undefined){
		nhn.husky.EZCreator.createInIFrame({
			oAppRef : oEditors,
			elPlaceHolder : "content",
			sSkinURI : contextPath + "resources/se2/SmartEditor2Skin.html",
			fCreator : "createSEditor2"
		});
	}
	
	$('#jt-admin-notice-delete').bind('click',function(){
		
		jtown.confirm('게시글을 삭제하시겠습니까?', function(){
			var form = document.forms['board'];
			form._method.value = 'delete';
			form.submit();
		}, function(){});
	});
	
	jtown.admin.sellerCreate();
	
	jtown.admin.sellerSync();
	
	$('.jt-reset-password').unbind('click').bind('click', function(){
		var json =  { username : $(this).attr('data-username') }, url = contextPath + 'admin/ajax/resetPassword.jt';
		
		$.postJSON(url, json, function(){
			jtown.dialog('재설정 되었습니다.');
		});
	});
	
	$('.jt-seller-reset-password').unbind('click').bind('click', function(){
		var json =  { username : $(this).attr('data-sellername') }, url = contextPath + 'admin/ajax/resetSellerPassword.jt';
		
		$.postJSON(url, json, function(){
			jtown.dialog('재설정 되었습니다.');
		});
	});
	
	$('.jt-partnership-table-information').unbind('click').bind('click', function(){
		var partnershipPn =	$(this).parents('.jt-partnership-info').attr('data-pspn');
		$('#partnership-content-'+partnershipPn).toggle();
	});
	
	$('.jt-admin-customer-enable').unbind('change').bind('change', function(){
		var parents = $(this).parents('.jt-admin-customer-table-tr'),
			json = { 	'pn' : parents.attr('data-cpn'), 
						'enabled' : ($(this).val() == 1 ? true : false)},
			url = contextPath + 'admin/ajax/changeEnabled.jt';
		$.postJSON(url, json, function(){
		});
	});
	
	jtown.admin.changeText('jt-partnership-name' , function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
			parent = thiz.parents(nameVo.selector),
			url = contextPath+'admin/ajax/updatePartnershipName.jt',
			json = { pn : grandParent.attr('data-pspn'),
					 name : thiz.val()	};
		
		$.postJSON(url, json, function(object){
			if(object.key == 1){
				alert(object.value);
				thiz.focus();
			}else{				
				parent.html(htmlChars(object.value));
			}
		});
	}, function(){});
	
	jtown.admin.changeText('jt-partnership-email', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/updatePartnershipEmail.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 email : thiz.val()	};
	
		$.postJSON(url, json, function(object){
			if(object.key == 1){
				alert(object.value);
				thiz.focus();
			}else{				
				parent.html(htmlChars(object.value));
			}
		});
	}, function(){});
	
	jtown.admin.changeText('jt-partnership-phoneNumber', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/updatePartnershipPhoneNumber.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 phoneNumber : thiz.val()	};
	
		$.postJSON(url, json, function(object){
			if(object.key == 1){
				alert(object.value);
				thiz.focus();
			}else{				
				parent.html(htmlChars(object.value));
			}
		});
	}, function(){});
	
	jtown.admin.changeSelect('jt-partnership-category', function(thiz, nameVo){
		
		success = function(){
			var grandParent = thiz.parents(nameVo.parentSelector),
			url = contextPath+'admin/ajax/updatePartnershipCategory.jt',
			json = { pn : grandParent.attr('data-pspn'),
					 categoryPn : thiz.val()	};
			$.postJSON(url, json, function(partnership){
				var pn = partnership.jtownUser.pn;
				if(pn != null && pn != 0 ){
					grandParent.find('.jt-partnership-interest').html('');
				}
			});
		};
		
		cancle = function(){
			var grandParent = thiz.parents(nameVo.parentSelector),
			url = contextPath+'admin/ajax/selectPartnershipCategory.jt',
			json = { pn : grandParent.attr('data-pspn') };
			$.postJSON(url, json, function(categoryPn){
				thiz.val(categoryPn);
			});
		};
		
		jtown.confirm('사업아이템을 바꾸시겠습니까?', success, cancle);
		
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
		url = contextPath+'admin/ajax/updatePartnership.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 process : thiz.val()	};
		$.postJSON(url, json, function(partnership){
		});
	});
	
	jtown.admin.changeSelect('jt-partnership-deposit', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		url = contextPath+'admin/ajax/updatePartnership.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 deposit : thiz.val()	};
		$.postJSON(url, json, function(partnership){
		});
	});
	
	jtown.admin.changeTextarea('jt-partnership-note',function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/updatePartnershipNote.jt',
		json = { pn : grandParent.attr('data-pspn'),
				 note : thiz.val()	};
		$.postJSON(url, json, function(object){
			if(object.key == 1){
				alert(object.value);
				thiz.focus();
			}else{				
				parent.html('<pre>'+htmlChars(object.value)+'</pre>');
			}
		});
	});
	
});

jtown.admin.sellerCreate = function(){
	$('.jt-seller-create-btn').unbind('click').bind('click', function(){
		var thiz = $(this),
			parent = thiz.parents('.jt-partnership-info'),
			pspn = parent.attr('data-pspn');
		
		var url = contextPath + 'admin/ajax/createSeller.jt';
		var json =	{ 	pn		: pspn,
						shopUrl : thiz.attr('data-shopUrl'),
						name 	: thiz.attr('data-name') };
		
		$.postJSON(url, json, function(jtownUser){
			parent.attr('data-spn', jtownUser.pn);
			parent.find('.jt-seller-create').html('<a href="'+contextPath+'seller/'+jtownUser.pn+'">'+jtownUser.username+'</a>').removeClass('jt-seller-create').addClass('jt-partnership-username');
			parent.find('.jt-seller-shopPn').text(jtownUser.sixShopPn).removeClass('jt-seller-shopPn').addClass('jt-partnership-shopPn');
			parent.find('.jt-seller-shopUrl').addClass('jt-partnership-shopUrl').removeClass('jt-seller-shopUrl');
			parent.find('.jt-seller-name').addClass('jt-partnership-sellerName').removeClass('jt-seller-name');
			parent.find('.jt-seller-enabled').addClass('jt-partnership-enabled').removeClass('jt-seller-enabled');
			parent.find('.jt-partnership-enabled-select').css('display', 'block');
			parent.find('.jt-seller-interest').text('').addClass('jt-partnership-interest').removeClass('jt-seller-interest');
			parent.find('.jt-seller-date').text('').addClass('jt-partnership-contract-date').removeClass('jt-seller-date');
			var btn = '<button type="button" class="jt-admin-contract jt-btn-white-small"><span class="btnText">조회</span></button>';
			parent.find('.jt-seller-register').html(btn).addClass('jt-partnership-contract-register').removeClass('jt-seller-register');
			
			setTimeout('jtown.admin.sellerSync()', 0);
		});
	});
};

jtown.admin.sellerSync = function(){
	jtown.admin.changeText('jt-partnership-shopUrl', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changeSellerShopUrl.jt',
		json = { pn : grandParent.attr('data-spn'),
				 shopUrl : thiz.val()	};
	
		$.postJSON(url, json, function(object){
			if(object.key == 1){
				alert(object.value);
				thiz.focus();
			}else{				
				parent.html(htmlChars(object.value));
			}
		});
	}, function(){});
	jtown.admin.changeText('jt-partnership-sellerName', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changeSellerName.jt',
		json = { pn : grandParent.attr('data-spn'),
				 name : thiz.val()	};
	
		$.postJSON(url, json, function(object){
			if(object.key == 1){
				alert(object.value);
				thiz.focus();
			}else{				
				parent.html(htmlChars(object.value));
			}
		});
	}, function(){});
	jtown.admin.changeText('jt-partnership-interest', function(thiz, nameVo){
		var grandParent = thiz.parents(nameVo.parentSelector),
		parent = thiz.parents(nameVo.selector),
		url = contextPath+'admin/ajax/changeInterest.jt',
		category = grandParent.find('.jt-partnership-category-select'),
		json = { 	sellerPn : grandParent.attr('data-spn'),
					categoryPn : category.val(),
					interestSectionList : thiz.val()};
	
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
	
	$('.jt-admin-contract').unbind('click').bind('click', function(){
		var parent = $(this).parents('.jt-partnership-info'),
			spn = parent.attr('data-spn');
		
		var url = contextPath + 'admin/contract/?sellerPn='+spn;
		var option = 'width=800, height=300, resizable=no, scrollbars=no, status=no';
		
		window.open(url, '', option);
	});
};

// ~ 일관된 format

jtown.admin.changeText = function(name, callback, event){
	var eventString = $.browser.chrome ? 'keydown' : 'keypress';
	
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
		
		$(nameVo.inputSelector).bind(eventString, function(event){
			if(event.keyCode == 13){
				callback($(this), nameVo);
			}else if(event.keyCode == 27){
				me.html(htmlChars(value));
			}
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

jtown.admin.changeTextarea = function(name, callback, event){
	var eventString = $.browser.chrome ? 'keydown' : 'keypress';
	
	var nameVo = { 	selector : '.'+name,
					input : name+'-input',
					inputSelector : '#'+name+'-input',
					parentSelector : '.jt-partnership-info'	};
	
	$(nameVo.selector).unbind('mouseup').bind('mouseup', function(){
		var me = $(this),  value = me.text(),
			html = '<textarea class="" id="' + nameVo.input + '" type="text" style="width: '+(Number(me.width())-14)+'px; height: '+(Number(me.height()))+'">'+value+'</textarea>';
		me.html(html);
		
		setTimeout(event, 0);
		
		$(nameVo.inputSelector).focus();
		$(nameVo.inputSelector).bind('focusout', function(){
			callback($(this), nameVo);
		});
		
		$(nameVo.inputSelector).bind(eventString, function(event){
			if(event.keyCode == 13){
				callback($(this), nameVo);
			}else if(event.keyCode == 27){
				me.html('<pre>'+htmlChars(value)+'</pre>');
			}
		});
	});
};

// ~ 판매자 관심사 수정시
jtown.admin.autoInterestOne = function(){
	var eventString = $.browser.chrome ? 'keydown' : 'keypress';
	var categoryPn = '';
	$('#jt-partnership-interest-input').unbind(eventString).bind( eventString, function( event ) {
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

//~ banner 
$('[name=bannerType]').bind('change', function(){
	if($('[name=bannerType]').val() == 1){
		$('.jt-admin-event-memo-text-title').text('추가사항');
		$('.jt-admin-event-url-input').attr('placeholder','ex) 수요일 18시/ 19시 (없으면 비워둡니다.)');
		$('.jt-admin-event-facebook-wrap').show();
		$('.jt-admin-event-content-wrap').show();
		
	}else if($('[name=bannerType]').val() == 2){
		$('.jt-admin-event-memo-text-title').text('URL 입력');
		$('.jt-admin-event-url-input').attr('placeholder','');
		$('.jt-admin-event-facebook-wrap').hide();
		$('.jt-admin-event-content-wrap').hide();
	}	
});
$('#jt-admin-event-image-upload-btn').uploadify({
	'formData' : {'category' : 'banner'},
	'buttonText' : '이미지 업로드',
	'fileTypeDesc' : 'Image Files',
    'fileTypeExts' : '*.gif; *.jpg; *.png',
    'fileSizeLimit' : '2MB',
	'multi'	: false,
	'swf' : contextPath + 'resources/uploadify/uploadify.swf',
	'uploader' : contextPath + 'file/upload.jt',
	'itemTemplate' : '<div></div>',
	'onUploadStart' : function(){
		jtown.loading.start();
	},
	'onUploadSuccess' : function(file, data, response){
		var dataValue = eval('('+data+')');
		$('.jt-admin-event-image-upload-img').html('');
		$('.jt-admin-event-image-upload-img').append('<img src="'+contextPath+'photo/thumbnail/'+dataValue.saveName+'banner.'+dataValue.type+' " alt="" />');
		$('[name=image]').val(dataValue.saveName+'banner.'+dataValue.type);
		setTimeout('jtown.loading.finish()', 0);
	}
});

$('#jt-admin-event-fb-img-upload-btn').uploadify({
	'formData' : {'category' : 'facebook'},
	'buttonText' : '이미지 업로드',
	'fileTypeDesc' : 'Image Files',
    'fileTypeExts' : '*.gif; *.jpg; *.png',
    'fileSizeLimit' : '2MB',
	'multi'	: false,
	'swf' : contextPath + 'resources/uploadify/uploadify.swf',
	'uploader' : contextPath + 'file/upload.jt',
	'itemTemplate' : '<div></div>',
	'onUploadStart' : function(){
		jtown.loading.start();
	},
	'onUploadSuccess' : function(file, data, response){
		var dataValue = eval('('+data+')');
		$('.jt-admin-event-image-upload-img').html('');
		$('.jt-admin-event-fb-upload-img').append('<img src="'+contextPath+'photo/thumbnail/'+dataValue.saveName+'facebook.'+dataValue.type+' " alt="" />');
		$('[name=fbMessage]').val(dataValue.saveName+'facebook.'+dataValue.type);
		setTimeout('jtown.loading.finish()', 0);
	}
});

$('.jt-admin-event-insert-btn').bind('click', function(){
	var form = $('.jt-admin-event-form')[0];
	form.action = contextPath+ 'admin/insertBanner';
	form.submit();
});