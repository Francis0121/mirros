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
		$.changePageTransition('/app', 'slide', false);
	});
};

$.emailLogin = function(){
	$.post(contextPath+'/j_spring_security_check',{j_username : $('.jt-login-form-table-input').val(),
		j_password : $('.jt-login-form-table-password').val()}, function(data){
			if("success" == data.result){
				$.changePageTransition('/app', 'slide', false);
			}else{
				alert('로그인에 실패하였습니다.');
			}
	});
};

//~ Join
$.joinSubmit = function(){
	$.mobile.showPageLoadingMsg();
	$.post(contextPath+'/login/appJoinSubmit.jt',{
		name : $('.jt-join-direct-user-name').val(),
		username : $('.jt-join-direct-user-username').val(),
		password : $('.jt-join-direct-user-password').val(),
		confirmPassword : $('.jt-join-direct-user-confirmPassword').val()
	},function(data){
		$.mobile.hidePageLoadingMsg();
		if(data == 'success'){
			console.log('ok');
			$.changePageTransition('/app', 'slide', false);
		}else{
			$('.jt-join-direct-user-name').val('');
			$('.jt-join-direct-user-username').val('');
			$('.jt-join-direct-user-password').val('');
			$('.jt-join-direct-user-confirmPassword').val('');
			$('.jt-app-more-join-name-check').text('');
			$('.jt-join-direct-user-username-check').text('');
			$('.jt-join-direct-user-password-check').text(''); 
			$('.jt-join-direct-user-confirmPassword-check').text('');
			alert('잘못된 정보를 입력하셨습니다.');
		}
	});
};

$('body').on('focusout', '.jt-join-direct-user-name', function(){
	$.post( contextPath+'/login/nameValidation.jt', { name: this.value}, function(result){
		result == 'success' ? $('.jt-app-more-join-name-check').text('O') : $('.jt-app-more-join-name-check').text('X');
	});
});

$('body').on('focusout', '.jt-join-direct-user-username', function(){
	$.post( contextPath+'/login/usernameValidation.jt', { username: this.value}, function(result){
		result == 'success' ? $('.jt-join-direct-user-username-check').text('O') : $('.jt-join-direct-user-username-check').text('X');
	});
});

$('body').on('focusout', '.jt-join-direct-user-password', function(){
	this.value.length >=8 && this.value.length <=16 ? $('.jt-join-direct-user-password-check').text('O') : $('.jt-join-direct-user-password-check').text('X'); 
});
$('body').on('focusout', '.jt-join-direct-user-confirmPassword', function(){
	$('.jt-join-direct-user-password').val() == this.value & this.value!='' ? $('.jt-join-direct-user-confirmPassword-check').text('O') : $('.jt-join-direct-user-confirmPassword-check').text('X'); 
});

$.checkMorePage = function(){
	if($('.jt-app-header-category:last').attr('data-category-type') == 'more'){
		return true;
	}else{
		return false;
	}
};

