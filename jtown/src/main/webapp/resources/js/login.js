$(document).ready(function() {

	jtown.login.confirmEmail();

	jtown.login.passwordLength();

	jtown.login.confirmPassword();

	jtown.login.joinFormSubmit();
	
	jtown.login.nickNameLength();
	
	jtown.login.changePasswordSubmit();
});

if (typeof jtown.login == 'undefined') {
	jtown.login = {};
}

jtown.login.confirmEmail = function() {
	$('input[data-type=create]').keyup(
			function() {
				var regExp = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
				var username = $(this).val();
				if (regExp.test(username)) {
					$('#confirmEmail').removeClass('jt-form-invalid').addClass('jt-form-valid');
				} else {
					$('#confirmEmail').removeClass('jt-form-valid').addClass('jt-form-invalid');
				}
			}).focus(function() {
		$('#confirmEmail').show();
	}).blur(function() {
		$('#confirmEmail').hide();
	});
};

jtown.login.passwordLength = function() {
	$('input[name=password]').keyup(function() {
		var length = $(this).val().length;

		if (length >= 8 && length <= 16) {
			$('#passwordLength').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#passwordLength').removeClass('jt-form-valid').addClass('jt-form-invalid');
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
		var pw = $('input[name=password]').val();
		// match cpw and pw
		if (cpw == pw) {
			$('#confirmPW').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#confirmPW').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
	}).focus(function() {
		var cpw = $(this).val();
		var pw = $('input[name=password]').val();
		// match cpw and pw
		if (cpw == pw) {
			$('#confirmPW').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#confirmPW').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
		$('#confirmPW').show();
	}).blur(function() {
		$('#confirmPW').hide();
	});
};

jtown.login.nickNameLength = function(){
	$('input[name=name]').keyup(function(){
		var length = $(this).val().length;
		
		if(length <= 10 && length > 0){
			$('#nameLength').removeClass('jt-form-invalid').addClass('jt-form-valid');
		} else {
			$('#nameLength').removeClass('jt-form-valid').addClass('jt-form-invalid');
		}
	}).focus(function(){
		$('#nameLength').show();
	}).blur(function(){
		$('#nameLength').hide();
	});
};

jtown.login.joinFormSubmit = function() {
	$('.jt-join-submit').unbind('click');
	$('.jt-join-submit').bind('click', function() {
		var form = document.forms['jtownUser'];
		form.submit();
	});
};

jtown.login.changePasswordSubmit = function(){
	$('.jt-change-password-btn').unbind('click');
	$('.jt-change-password-btn').bind('click', function(){
		var form = document.forms['jtownUser'];
		form.submit();
	});
};