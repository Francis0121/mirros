if (typeof jtown.login == 'undefined') {
	jtown.login = {};
}

function onPopupLoginSubmit(){
	jtown.login.submit('jt-popup-login-form');
}

function onPageLoginSubmit() {
	jtown.login.submit('jt-page-login-form');
}

jtown.login.submit = function(name){
	var $form = $('#'+name);
	jQuery.ajax({
		'type' : 'POST',
		'url' : contextPath + 'j_spring_security_check',
		'data' : $form.serialize(),
		'dataType' : 'text',
		'success' : function(data) {
			jtown.login.control(data, name);
		}
	});	
};

jtown.login.control = function(data, name){
	var map = eval('('+data+')'), result = map.result, url = map.url;
	if(result == 'success'){
		location.href= contextPath + url;		
	}else if(result == 'error'){
		location.href= contextPath + 'login/?isFinish=0';
	}
	return;
};

jtown.login.showLoginForm = function(){
	var inner = $('#jt-login-form-wrap'),
		form = inner.find('form[name=jt-popup-login-form]'),
		j_username = inner.find('input[name=j_username]'),
		j_password = inner.find('input[name=j_password]')
		/*
		joinForm = inner.find('form[name=jt-join-direct-join-form]'),
		name = inner.find('input[name=name]'),
		username = inner.find('input[name=username]'),
		password = inner.find('input[name=password]'),
		confirmPassword = inner.find('input[name=confirmPassword]');
		*/
		;
	
	form.attr('id', 'jt-popup-login-form');
	j_username.attr('id', 'j_username');
	j_password.attr('id', 'j_password');
	$.smartPop.open({ width : 430, height : 400, html : inner.html(), effect : null });	
	
	form.attr('id', '');
	j_username.attr('id', '');
	j_password.attr('id', '');
	
	setTimeout('$(function() { $(\'#j_username, #j_password\').placeholder(); });', 0);
};

jtown.login.loginOn= function(){
	$('.jt-login-direct-login-form').css('display','block');
	$('.jt-login-direct-sign-wrap').css('display','none');
};
jtown.login.loginOff= function(){
	$('.jt-login-direct-login-form').css('display','none');
	$('.jt-login-direct-sign-wrap').css('display','block');
};
jtown.login.joinOn= function(){
	$('.jt-login-direct-form').css('display','none');
	$('.jt-login-join-form').css('display','block');
};
jtown.login.joinOff= function(){
	$('.jt-login-direct-form').css('display','block');
	$('.jt-login-join-form').css('display','none');
};

jtown.login.resendEmailAddress = function() {
	$('#resendConfirmMail').unbind('click');
	jtown.postJSON(contextPath + 'ajax/resendConfirmEmail.jt', {}, function(){
		jtown.dialog('E-mail을 재전송 하였습니다.');
		
		$('#resendConfirmMail').bind('click', function(){
			jtown.login.resendEmailAddress();
		});
	});
};

jtown.login.joinSubmit = function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['jt-join-direct-join-form'];
		console.log(form);
		console.log($('.jt-join-direct-user-input'));
		//form.submit();
};

jtown.login.changeUserSubmit = function(){
	$('.jt-change-user-btn').bind('click', function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['jtownUser'];
		form.action = contextPath + 'login/modify.jt';
		form.submit();
	});
};

jtown.login.disactiveUser = function(){
	$('.jt-disactive-user-btn').toggle(function(){
		$('.jt-disactive-content').show();
		setTimeout("$('html, body').animate({scrollTop: $(document).height()}, 'slow')",0);
	}, function(){
		$('.jt-disactive-content').slideUp();
	});
	
	$('.jt-disactive-btn').bind('click', function(){
		jtown.confirm('계정을 정말로 삭제하시겠습니까?', function(){
			var form = document.forms['disactiveUser'];
			form.submit();
		}, function(){});
	});
	
	$('.jt-disactive-cancle-btn').bind('click', function(){
		jtown.confirm('계정 삭제를 취소하시겠습니까?', function(){
			var form = document.forms['disactiveUser'];
			form.submit();
		}, function(){});
	});
};

jtown.login.confirmPassword = function() {
	$('input[name=confirmPassword]').keyup(function() {
		var cpw = $(this).val(), pw = nullValueCheck($('input[data-form=joinPw]').val()) ? $('input[data-form=modify]').val() : $('input[data-form=joinPw]').val();
		if (cpw == pw) {
			$('#confirmPW>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#confirmPW>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
	}).focus(function() {
		var cpw = $(this).val(), pw = nullValueCheck($('input[data-form=joinPw]').val()) ? $('input[data-form=modify]').val() : $('input[data-form=joinPw]').val();
		if (cpw == pw) {
			$('#confirmPW>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#confirmPW>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
		$('#confirmPW').show();
	}).blur(function() {
		$('#confirmPW').hide();
	});
};