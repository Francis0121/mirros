$(function() {

	
});


$(document).on("pageshow", function () {
	if('app/individual' == document.URL.substring(document.URL.lastIndexOf('app'))){
		$.get(contextPath+'/individual',{ }, function(data){
			$('.jt-app-pre-text').html(data.substring(data.search('<pre>')+5, data.search('</pre>')-6));
		});
	}else if('app/agreement' == document.URL.substring(document.URL.lastIndexOf('app'))){
		$.get(contextPath+'/agreement',{ }, function(data){
			$('.jt-app-pre-text').html(data.substring(data.search('<pre>')+5, data.search('</pre>')-6));
		});
	}else if('app/mirros' == document.URL.substring(document.URL.lastIndexOf('app'))){
		$.get(contextPath+'/help/serviceGuide',{ }, function(data){
			var value = data.substring(data.search('<section class="jt-about-mirrosis">'), data.search('</section>')+10);
			$('.jt-app-mirrosis').html(value);
		});
	}
});



//~ Login
$.fbLogin = function(){
	var form = $('.jt-app-more-fb-form')[0];
	form.submit();
};

$.logout = function(){
	$.post(contextPath+'/login/logout',{}, function(data){
		location.href=contextPath+'/app';
	});
};

$.emailLogin = function(){
	$.post(contextPath+'/j_spring_security_check',{j_username : $('.jt-login-form-table-input').val(),
		j_password : $('.jt-login-form-table-password').val()}, function(data){
			if("success" == data.result){
				location.href=contextPath+'/app';
			}else{
				alert('로그인에 실패하였습니다.');
			}
	});
};
	

//~ Join
$.joinSubmit = function(){
	var $form = $('#jt-app-more-join-form');
	$form.serialize();
	$form.submit();
};

$('.jt-join-direct-user-name').focusout(function(){
	$.post( contextPath+'/login/nameValidation.jt', { name: this.value}, function(result){
		result == 'success' ? $('.jt-app-more-join-name-check').text('O') : $('.jt-app-more-join-name-check').text('X');
	});
});
$('.jt-join-direct-user-username').focusout(function(){
	$.post( contextPath+'/login/usernameValidation.jt', { username: this.value}, function(result){
		result == 'success' ? $('.jt-join-direct-user-username-check').text('O') : $('.jt-join-direct-user-username-check').text('X');
	});
});
$('.jt-join-direct-user-password').focusout(function(){
	this.value.length >=8 && this.value.length <=16 ? $('.jt-join-direct-user-password-check').text('O') : $('.jt-join-direct-user-password-check').text('X'); 
});
$('.jt-join-direct-user-confirmPassword').focusout(function(){
	$('.jt-join-direct-user-confirmPassword').val() == this.value & this.value!='' ? $('.jt-join-direct-user-confirmPassword-check').text('O') : $('.jt-join-direct-user-confirmPassword-check').text('X'); 
});
