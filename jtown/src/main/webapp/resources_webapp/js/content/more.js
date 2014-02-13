$(function() {
//~ init
	!$.isMobile() ? $('.jt-app-more-cacao-invite').hide() : null;
});
$(document).on("pageinit", function () {
	!$.isMobile() ? $('.jt-app-more-cacao-invite').hide() : null;
});

$(document).on("pageshow", function () {
	 if('app/login' == document.URL.substring(document.URL.lastIndexOf('app'))){
		 if($.isIOS()){
			 $('.jt-app-more-login-message-box').css('bottom', 80);
		 }
		 $('.jt-app-more-login-message-box').css('display', 'block');
	}else if('app/emailLogin' == document.URL.substring(document.URL.lastIndexOf('app'))){
		if(!$.isIOS()){
			$('.jt-app-more-login-message-box').css('display', 'block');
		}
	}else if('app/individual' == document.URL.substring(document.URL.lastIndexOf('app'))){
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
		$.changePageTransition('/app', 'fade', false);
	});
};

$.goEmailLogin = function(){
	$.changePageTransition('/app/emailLogin', 'fade', false);
};

$.emailLogin = function(){
	$.post(contextPath+'/j_spring_security_check',{j_username : $('.jt-login-form-table-input').val(),
		j_password : $('.jt-login-form-table-password').val(), _spring_security_remember_me : true}, function(data){
			if("success" == data.result){
				$.changePageTransition('/app', 'fade', false);
			}else{
				$.toast('아이디와 비밀번호를 다시 확인해주세요.');
			}
	});
};

$('body').on('keyup', '.jt-login-form-table-password:last',function(){
	if($('#j_username_page:last').val().length > 0 && $('#j_password_page:last').val().length > 0){
		$('.jt-app-more-login-btn:last').css('color', '#000');
	}else{
		$('.jt-app-more-login-btn:last').css('color', '#d0d0d0');
	}
});



//~ Join
$.goJoin = function(){
	$.changePageTransition('/app/join', 'fade', false);
};

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
			$.changePageTransition('/app', 'fade', false);
		}else{
			$('.jt-join-direct-user-name').val('');
			$('.jt-join-direct-user-username').val('');
			$('.jt-join-direct-user-password').val('');
			$('.jt-join-direct-user-confirmPassword').val('');
			$('.jt-app-more-join-name-check').text('');
			$('.jt-join-direct-user-username-check').text('');
			$('.jt-join-direct-user-password-check').text(''); 
			$('.jt-join-direct-user-confirmPassword-check').text('');
			$.toast('잘못된 정보를 입력하셨습니다.');
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

$('body').on('tap', '.jt-app-more-cacao-invite', function(){
	$.post(contextPath + '/app/ajax/checkLogin.jt', {}, function(object) {
		if(object.isLogin==false){
			$.toast('로그인 해주세요.');
			$.changePageTransition('/app/login', 'fade');
			return;
		}else{
			kakao.link("talk").send({
		        msg : object.name+'님이 여자를 위한 잇 아이템 Mirros로의 초대장을 보내셨습니다.',
		        url : "http://218.55.100.41:8080/jtown/app",  
		        appid : "http://218.55.100.41:8080/jtown/app",
		        appver : "2.0",
		        appname : "Mirros",
		        metainfo : JSON.stringify({metainfo : [ {os:"android", devicetype: "phone",installurl:"market://details?id=com.kakao.talk", executeurl : "kakaoagit://testtest"},{os:"ios", devicetype:"phone",installurl:"items://itunes.apple.com/us/app/kakaotalk/id362057947?mt=8",executeurl : "kakaoagit://testtest"}]}),
		        type : "app"
		    });
		}
	});
});

$('body').on('tap', '.jt-app-more-facebook-invite', function(){
	$.post(contextPath + '/app/ajax/checkLogin.jt', {}, function(object) {
		if(object.isLogin==false){
			$.toast('로그인 해주세요.');
			$.changePageTransition('/app/login', 'fade');
			return;
		}else{
			FB.getLoginStatus(function(response) {
			      if (response.status == 'connected') {
			        getCurrentUserInfo(response);
			      } else {
			    	 $.toast('페이스북으로 로그인 하셔야 합니다.');
			      }
			    });
		}
	});
});
function getCurrentUserInfo() {
    FB.api('/me', function(userInfo) {
    	 FB.ui({
				method: 'apprequests',
				message: userInfo.name+'님이 여자를 위한 잇 아이템 Mirros로의 초대장을 보내셨습니다.'
			   }, requestCallback);
    });
  }
function requestCallback(response) {
	if(response.to != null){
		$.toast('초대장을 발송하였습니다.');
	}
	//TODO update point
}

