$(document).ready(function() {

	jtown.login.confirmEmail();

	jtown.login.passwordLength();

	jtown.login.confirmPassword();

	jtown.login.joinFormSubmit();
	
	jtown.login.nickNameLength();
});

if (typeof jtown.login == 'undefined') {
	jtown.login = {};
}

jtown.login.confirmEmail = function() {
	$('input[data-type=create]')
			.keyup(
					function() {
						var regExp = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
						var username = $(this).val();
						if (regExp.test(username)) {
							$('#confirmEmail').removeClass('invalid').addClass(
									'valid');
						} else {
							$('#confirmEmail').removeClass('valid').addClass(
									'invalid');
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
			$('#passwordLength').removeClass('invalid').addClass('valid');
		} else {
			$('#passwordLength').removeClass('valid').addClass('invalid');
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
			$('#confirmPW').removeClass('invalid').addClass('valid');
		} else {
			$('#confirmPW').removeClass('valid').addClass('invalid');
		}
	}).focus(function() {
		$('#confirmPW').show();
	}).blur(function() {
		$('#confirmPW').hide();
	});
};

jtown.login.nickNameLength = function(){
	$('input[name=name]').keyup(function(){
		var length = $(this).val().length;
		
		if(length <= 10 && length > 0){
			$('#nameLength').removeClass('invalid').addClass('valid');
		} else {
			$('#nameLength').removeClass('valid').addClass('invalid');
		}
	}).focus(function(){
		$('#nameLength').show();
	}).blur(function(){
		$('#nameLength').hide();
	});
};

jtown.login.joinFormSubmit = function() {
	$('.joinBtn').unbind('click');
	$('.joinBtn').bind('click', function() {
		var form = document.forms['jtownUser'];
		form.submit();
	});
};