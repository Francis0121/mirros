$(function() {

	jtown.login.confirmEmail();

	jtown.login.passwordLength();

	jtown.login.confirmPassword();

	jtown.login.joinFormSubmit();
	
	jtown.login.nickNameLength();
	
	jtown.login.changeUserSubmit();
	
	jtown.login.modifyPasswordLength();
	
	jtown.login.disactiveUser();
	
	jtown.login.confirmId();
	
	$('#jt-findUserPassword-btn').bind('click', function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['jtownUser'];
		form.submit();
	});
	
	$('#jt-findSellerPassword-btn').bind('click', function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['sellerUser'];
		form.submit();
	});
	
	$('#jt-emailAddress-user-btn').bind('click', function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['jtownUser'];
		form.submit();
	});
});

function onPopupLoginSubmit(){
	onLoginSubmit('jt-popup-login-form');
}

function onLoginSubmit(name){
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
}

if (typeof jtown.login == 'undefined') {
	jtown.login = {};
}

jtown.login.control = function(data, name){
	
	var map = eval('('+data+')'),
		result = map.result,
		url = map.url;
	
	if(result == 'success'){
		location.href= contextPath + url;		
		return;
	}else if(result == 'error'){
		location.href= contextPath + 'login/?isFinish=0';
		return;
	}

};

jtown.login.confirmEmail = function() {
	$('input[data-type=create]').keyup(
			function() {
				var regExp = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
				var username = $(this).val();
				if (regExp.test(username)) {
					$('#confirmEmail>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
				} else {
					$('#confirmEmail>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
				}
			}).focus(function() {
		var regExp = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
		var username = $(this).val();
		if (regExp.test(username)) {
			$('#confirmEmail>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#confirmEmail>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
		$('#confirmEmail').show();
	}).blur(function() {
		$('#confirmEmail').hide();
	});
};

jtown.login.confirmId = function() {
	$('input[data-type=createId]').keyup(
			function() {
				var regExp = /^[0-9A-Za-z가-힣]*$/;
				var username = $(this).val();
				if (regExp.test(username)) {
					$('#confirmEmail>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
				} else {
					$('#confirmEmail>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
				}
			}).focus(function() {
		var regExp = /^[0-9A-Za-z가-힣]*$/;
		var username = $(this).val();
		if (regExp.test(username)) {
			$('#confirmEmail>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#confirmEmail>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
		$('#confirmEmail').show();
	}).blur(function() {
		$('#confirmEmail').hide();
	});
};

jtown.login.passwordLength = function() {
	$('input[data-form=joinPw]').keyup(function() {
		var length = $(this).val().length;

		if (length >= 8 && length <= 16) {
			$('#passwordLength>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#passwordLength>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
	}).focus(function() {
		$('#passwordLength').show();
	}).blur(function() {
		$('#passwordLength').hide();
	});
};

jtown.login.confirmPassword = function() {
	$('input[name=confirmPassword]').keyup(function() {
		var cpw = $(this).val();
		var pw = nullValueCheck($('input[data-form=joinPw]').val()) ? $('input[data-form=modify]').val() : $('input[data-form=joinPw]').val();
		// match cpw and pw
		if (cpw == pw) {
			$('#confirmPW>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#confirmPW>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
	}).focus(function() {
		var cpw = $(this).val();
		var pw = nullValueCheck($('input[data-form=joinPw]').val()) ? $('input[data-form=modify]').val() : $('input[data-form=joinPw]').val();
		// match cpw and pw
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

jtown.login.nickNameLength = function(){
	$('input[data-form=join]').keyup(function(){
		var regExp = /^[0-9A-Za-z가-힣]*$/;
		var name = $(this).val();
		var length = name.length;
		if (regExp.test(name) && length > 0) {
			$('#nameLength>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#nameLength>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
	}).focus(function(){
		var regExp = /^[0-9A-Za-z가-힣]*$/;
		var name = $(this).val();
		var length = name.length;
		if (regExp.test(name) && length > 0) {
			$('#nameLength>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#nameLength>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
		$('#nameLength').show();
	}).blur(function(){
		$('#nameLength').hide();
	});
};

jtown.login.joinFormSubmit = function() {
	$('.jt-join-submit').unbind('click');
	$('.jt-join-submit').bind('click', function() {
		$('#loading-popup').fadeIn();
		var form = document.forms['jtownUser'];
		form.submit();
	});
};

jtown.login.changeUserSubmit = function(){
	$('.jt-change-user-btn').unbind('click').bind('click', function(){
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
	
	$('.jt-disactive-btn').unbind('click').bind('click', function(){
		jtown.confirm('계정을 정말로 삭제하시겠습니까?', function(){
			var form = document.forms['disactiveUser'];
			form.submit();
		}, function(){});
	});
	
	$('.jt-disactive-cancle-btn').unbind('click').bind('click', function(){
		jtown.confirm('계정 삭제를 취소하시겠습니까?', function(){
			var form = document.forms['disactiveUser'];
			form.submit();
		}, function(){});
	});
};

jtown.login.modifyPasswordLength = function() {
	$('input[data-form=modify]').keyup(function() {
		var length = $(this).val().length;

		if (length >= 8 && length <= 16) {
			$('#passwordLength>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#passwordLength>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
	}).focus(function() {
		$('#passwordLength').show();
	}).blur(function() {
		$('#passwordLength').hide();
	});
};