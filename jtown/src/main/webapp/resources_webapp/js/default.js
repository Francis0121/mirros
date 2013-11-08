$(document).bind('mobileinit', function(){
	$.mobile.loadingMessage = 'Loading...';
});
$('.reply').bind('taphold', function(){
	alert('tophold');
	console.log('tophold');
});

$('.jt-app-header').bind('swipedown', function(){
	$.titleMenuOpen();
});
$('#jt-app-header-arrow-d').bind('click', function(){
	if($('#jt-app-header-arrow-d').attr('data-toggle') == '0'){
		$.titleMenuOpen();
	}else{
		$.titleMenuClose();
	}
});
$('.jt-app-header-arrow-u').bind('click', function(){
	$.titleMenuClose();
});

$.titleMenuOpen = function(){
	$('.jt-app-header-extend-menu').height('200');
	$('.jt-app-header-extend-menu-inner').delay(300).fadeIn();
	$('#jt-app-header-arrow-d').attr('data-toggle','1');
};
$.titleMenuClose = function(){
	$('.jt-app-header-extend-menu-inner').fadeOut(250);
	$('.jt-app-header-extend-menu').height('0');
	$('#jt-app-header-arrow-d').attr('data-toggle','0');
};