$(document).ready(function() {
	jtown.help.confirmEmail();
	
	jtown.help.name();
	
	jtown.help.phoneNumberNd();
	
	jtown.help.phoneNumberRd();
	
	jtown.help.questionSync();
});

if (typeof jtown.help == 'undefined') {
	jtown.help = {};
}

jtown.help.confirmEmail = function() {
	$('input[name=email]').keyup(
			function() {
				var regExp = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/;
				var username = $(this).val();
				if (regExp.test(username)) {
					$('#confirmEmail>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
				} else {
					$('#confirmEmail>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
				}
			}).focus(function() {
		$('#confirmEmail').show();
	}).blur(function() {
		$('#confirmEmail').hide();
	});
};

jtown.help.name = function() {
	$('input[data-form=partnership]').keyup(
			function() {
				var regExp = /^[가-힣]*$/;
				var username = $(this).val();
				if (regExp.test(username)) {
					$('#nameLength>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
				} else {
					$('#nameLength>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
				}
			}).focus(function() {
		$('#nameLength').show();
	}).blur(function() {
		$('#nameLength').hide();
	});
};


jtown.help.phoneNumberNd = function() {
	$('input[name=phoneNumberNd]').keyup(
			function() {
				var regExp = /^[0-9]*$/;
				var username = $(this).val();
				if (regExp.test(username)) {
					$('#confirmPhoneNumber>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
				} else {
					$('#confirmPhoneNumber>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
				}
			}).focus(function() {
		$('#confirmPhoneNumber').show();
	}).blur(function() {
		$('#confirmPhoneNumber').hide();
	});
};

jtown.help.phoneNumberRd = function() {
	$('input[name=phoneNumberRd]').keyup(
			function() {
				var regExp = /^[0-9]*$/;
				var username = $(this).val();
				if (regExp.test(username)) {
					$('#confirmPhoneNumber>span').removeClass('jt-form-invalid').addClass('jt-form-valid');
				} else {
					$('#confirmPhoneNumber>span').removeClass('jt-form-valid').addClass('jt-form-invalid');
				}
			}).focus(function() {
		$('#confirmPhoneNumber').show();
	}).blur(function() {
		$('#confirmPhoneNumber').hide();
	});
};

jtown.help.questionSync = function(){
	
	$('.jt-cQuestion-btn').bind('click',function(){
		var form = document.forms['cQuestion'];
		BrowserDetect.init();
		form.browser.value = BrowserDetect.browser +'-'+ BrowserDetect.version + ' [ '+ BrowserDetect.OS + ' ] ';
		form.submit();
	});
	
	$('.jt-sQuestion-btn').bind('click',function(){
		var form = document.forms['sQuestion'];
		BrowserDetect.init();
		form.browser.value = BrowserDetect.browser +'-'+ BrowserDetect.version + ' [ '+ BrowserDetect.OS + ' ] ';
		form.submit();
	});
};