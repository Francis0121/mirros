if (typeof jtown.help == 'undefined') {
	jtown.help = {};
}

jtown.help.questionSync = function(){
	
	$('.jt-cQuestion-btn').bind('click',function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['cQuestion'];
		BrowserDetect.init();
		form.browser.value = BrowserDetect.browser +'-'+ BrowserDetect.version + ' [ '+ BrowserDetect.OS + ' ] ';
		form.submit();
	});
	
	$('.jt-sQuestion-btn').bind('click',function(){
		$('#loading-popup').fadeIn();
		var form = document.forms['sQuestion'];
		BrowserDetect.init();
		form.browser.value = BrowserDetect.browser +'-'+ BrowserDetect.version + ' [ '+ BrowserDetect.OS + ' ] ';
		form.submit();
	});
	
	if(realPath == contextPath +'help/sQuestion.jt'){
		setTimeout("$('html, body').animate({scrollTop: '680px'}, 'slow')",0);
	}else if(realPath == contextPath + 'help/cQuestion.jt'){
		setTimeout("$('html, body').animate({scrollTop: '100px'}, 'slow')",0);
	}else if(realPath == contextPath + 'login/disactive.jt'){
		setTimeout("$('html, body').animate({scrollTop: $(document).height()}, 'slow')",0);
	}
};
