$(function() {
	
	if (typeof jtown.pg == 'undefined') {
		jtown.pg = {};
	}
	
	function getInternetExplorerVersion() {    
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {        
             var ua = navigator.userAgent;        
             var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");        
             if (re.exec(ua) != null)            
                 rv = parseFloat(RegExp.$1);    
            }    
        return rv; 
   }
	if (getInternetExplorerVersion() != 7 ){
		jtown.pg.windowResize = function(){
			var clientWidth = Number(window.document.body.clientWidth),
			widthItem = Math.floor(clientWidth/258);
			if(widthItem > 6){
				widthItem = widthItem-1;
			}
			$('.jt-pg-main').css({width : (widthItem*258), margin : 'auto'});
		};
		$( window ).resize(function() {
			jtown.pg.windowResize();
		});
		jtown.pg.windowResize();
	
	var containerDiv = document.querySelector('.jt-pg-main');
		
		
	
	jtown.pg.itemOrder = function(){
		var msnry = new Masonry( containerDiv, {
		  columnWidth: 0,
		  itemSelector: '.jt-pg-item'
		});
	};
	
	}
	
if($('.jt-header-nav-interestCategory').attr('data-category') == 'pg' || $('.jt-header-nav-interestCategory').attr('data-category') == 'new'){
	$(window).scroll(function(){
			    if($(window).scrollTop() == $(document).height() - $(window).height()){
			        $('div#infscr-loading').show();
			        $.ajax({
			        url: contextPath+'ajax/gatherPagination.jt',
			        type: 'POST',
			        success: function(data){
			            if(data){
			            	productGatherHtml(data);
			                $('div#infscr-loading').hide();
			            }else{
			                $('div#infscr-loading').html('<center>Today end</center>');
			                $('div#infscr-loading').delay(500).fadeOut(1000);
			            }
			        }
		        });
		    }
	});
}
var productGatherHtml = function(data){
	var html = '';
	var size = data.mergeItems.length;
	var heartClickShapeClass ='';
	var heartClickTextClass ='';
	for(var idx=0; idx< size; idx++){
		if(data.mergeItems[idx].customerPn != null){
			heartClickShapeClass = 'jt-home-shop-love-click';
			heartClickTextClass = 'jt-home-shop-love-text-click';
		}else{
			heartClickShapeClass='';
			heartClickTextClass='';
		}
		if(data.mergeItems[idx].hot == 0){
			html+='<div class="jt-pg-item jt-pg-small-product" data-url="'+data.mergeItems[idx].url+'" data-product-pn="'+data.mergeItems[idx].productPn+'" data-event-pn="'+data.mergeItems[idx].eventPn+'">';
			if(data.mergeItems[idx].productPn == 0){
				html+=	'<div class="jt-pg-event-line">';
				html+=		'<div class="jt-pg-event-line-event-name-wrap">';
				html+=	 		'<span class="jt-home-expand-shop-event-new-image">NEW</span>';
				html+=			'<div class="jt-pg-event-line-event-name">'+data.mergeItems[idx].eventName +'</div>';
				html+=		'</div>';
				html+=		'<div class="jt-pg-event-line-shop-name">';
				html+=			data.mergeItems[idx].shopName ;
				html+=		'</div>';
				html+=		'<div class="jt-pg-event-line-end-date">';
				html+=			'D - '+data.mergeItems[idx].endDate+'일 남았습니다.';
				html+=		'</div>';
				html+=		'<div class="jt-pg-heart-wrap">';
				html+=			'<div class="jt-pg-heart-shape">';
				html+=				'<span class="jt-home-shop-love jt-pg-heart-shape '+heartClickShapeClass+'" id="jt-pg-heart-click-e-'+data.mergeItems[idx].eventPn+'">heart</span>';
				html+=			'</div>';
				html+=			'<div class="jt-pg-heart-event-count '+heartClickTextClass+'" id="jt-pg-heart-count-e-'+data.mergeItems[idx].eventPn+'">	'+data.mergeItems[idx].heartCount+'</div>';
				html+=		'</div>';
				html+=		'<div class="jt-btn-fbLogin jt-pg-product-facebook">';
				html+=			'<span class="loginImage"></span>';
				html+=		'<span class="loginText">페이스북 공유하기</span>';
				html+=		'</div>';
				html+='</div>';
			}else if(data.mergeItems[idx].productPn != 0){
				html+=		'<div class="jt-pg-product-line">';
				html+=			'<div class="jt-pg-product-img">';
				if(data.mergeItems[idx].contentType == ''){
					html+=			 '<img src="'+contextPath+'resources/uploadImage/'+data.mergeItems[idx].saveName+'" alt="'+data.mergeItems[idx].productName+'" />';
				}else{
					html+=			 '<img src="'+contextPath+'photo/thumbnail/'+data.mergeItems[idx].saveName+'product.'+data.mergeItems[idx].contentType +'" alt="'+data.mergeItems[idx].productName+'" />';	
				}
				html+= 		'</div>';
				html+=			'<div class="jt-pg-product-line-bright"></div>';
				html+=			'<div class="jt-btn-fbLogin jt-pg-product-facebook">';
				html+=				'<span class="loginImage"></span>';
				html+=			'<span class="loginText">페이스북 공유하기</span>';
				html+=			'</div>';
				html+=			'<div class="jt-pg-product-name">';
				html+=				'<div>'+data.mergeItems[idx].productName+'</div>';
				html+=				'<div>'+jtown.pg.formatNumber(data.mergeItems[idx].price)+'</div>';
				html+=			'</div>';
				html+=			'<div class="jt-pg-heart-wrap">';
				html+=				'<div class="jt-pg-heart-shape">';	
				html+=					'<span class="jt-home-shop-love jt-pg-heart-shape '+heartClickShapeClass+'" id="jt-pg-heart-click-'+data.mergeItems[idx].productPn+'">heart</span>';
				html+=				'</div>';
				html+=			'<div class="jt-pg-heart-count '+heartClickTextClass+'" id="jt-pg-heart-count-'+data.mergeItems[idx].productPn+'">'+data.mergeItems[idx].heartCount+'</div>';
				html+=			'</div>';
				html+=		'</div>';
			}
			html+='</div>';
		}else{
			html+='<div class="jt-pg-item jt-pg-large-product" data-url="'+data.mergeItems[idx].url+'" data-product-pn="'+data.mergeItems[idx].productPn+'">';
			html+=		'<div class="jt-pg-product-line">';
			html+=			'<div class="jt-pg-product-line-hot"><img src="'+contextPath+'resources/images/jt-hot.png"></div>';
			html+=			'<div class="jt-pg-product-img">';
			if(data.mergeItems[idx].contentType == ''){
				html+=			 '<img src="'+contextPath+'resources/uploadImage/'+data.mergeItems[idx].saveName+'" alt="'+data.mergeItems[idx].productName+'" />';
			}else{
				html+=			 '<img src="'+contextPath+'photo/thumbnail/'+data.mergeItems[idx].saveName+'product.'+data.mergeItems[idx].contentType +'" alt="'+data.mergeItems[idx].productName+'" />';	
			}
			html+= 		'</div>';
			html+=			'<div class="jt-pg-product-line-bright"></div>';
			html+=			'<div class="jt-btn-fbLogin jt-pg-product-facebook">';
			html+=				'<span class="loginImage"></span>';
			html+=			'<span class="loginText">페이스북 공유하기</span>';
			html+=			'</div>';
			html+=			'<div class="jt-pg-product-name">';
			html+=				'<div>'+data.mergeItems[idx].productName+'</div>';
			html+=				'<div>'+jtown.pg.formatNumber(data.mergeItems[idx].price)+'</div>';
			html+=			'</div>';
			html+=			'<div class="jt-pg-heart-wrap">';
			html+=				'<div class="jt-pg-heart-shape">';	
			html+=					'<span class="jt-home-shop-love jt-pg-heart-shape '+heartClickShapeClass+'" id="jt-pg-heart-click-'+data.mergeItems[idx].productPn+'">heart</span>';
			html+=				'</div>';
			html+=			'<div class="jt-pg-heart-count '+heartClickTextClass+'" id="jt-pg-heart-count-'+data.mergeItems[idx].productPn+'" >'+data.mergeItems[idx].heartCount+'</div>';
			html+=			'</div>';
			html+=		'</div>';
			html+='</div>';
		}
	}
	$('.jt-pg-main').append(html);
	if (getInternetExplorerVersion() != 7 ){
		jtown.pg.itemOrder();
	}
};

$('.jt-pg-container').on('click', '.jt-pg-heart-wrap', function(e){
	e.stopPropagation();
	var productPn =$(this).parents('.jt-pg-item').attr('data-product-pn');
	var eventPn =$(this).parents('.jt-pg-item').attr('data-event-pn');
	var isHeartChecked = $(this).find('.jt-home-shop-love-click').text() =='';
	var fbElement = $(this).parents('.jt-pg-item').find('.jt-pg-product-facebook');
	productPn == 0 ? jtown.home.eventHeartClick(eventPn, isHeartChecked,fbElement) : jtown.home.productHeartClick(productPn, isHeartChecked,fbElement) ;
});

$('.jt-pg-container').on('click', '.jt-pg-product-facebook', function(e){
	e.stopPropagation();
	var productPn =$(this).parents('.jt-pg-item').attr('data-product-pn');
	var eventPn =$(this).parents('.jt-pg-item').attr('data-event-pn');
	var fbTextElement = $(this).parents('.jt-pg-item').find('.loginText'); 
	productPn == 0 ? jtown.home.eventFacebookLikeClick(eventPn, fbTextElement) : jtown.home.productFacebookLikeClick(productPn, fbTextElement);
});

$('.jt-pg-container').on('click', '.jt-pg-item', function(){
	var productPn = $(this).attr('data-product-pn');
	var eventPn = $(this).attr('data-event-pn');
	var productUrl = $(this).attr('data-url'); 
	
	if($('#jt-login-smartPopup').text() ==''){
		if(productPn != 0){
			jtown.home.productStatisticClick(productPn);
		}else{
			jtown.home.eventStatisticClick(eventPn);
		}
		window.open(productUrl, '_blank');
	}else{
		if(productPn != 0){
			sessionStorage.setItem('productPn', productPn);
			sessionStorage.setItem('productUrl', productUrl);
		}else{
			sessionStorage.setItem('eventPn', eventPn);
			sessionStorage.setItem('eventUrl', productUrl);
		}
		jtown.login.showLoginForm();
	};
});

jtown.pg.formatNumber = function(cr){
	var str = new Array();
	cr = String(cr);
	for(var i=1;i<=cr.length;i++){
		if(i%3){str[cr.length-i]=cr.charAt(cr.length-i);}
		else{str[cr.length-i]=','+cr.charAt(cr.length-i);}
	}
	return str.join('').replace(/^,/,'');
};

$('.jt-pg-container').on('mouseenter', '.jt-pg-item', function(){
	$(this).find('.jt-pg-product-line-bright').css('display','block');
});
$('.jt-pg-container').on('mouseleave', '.jt-pg-item', function(){
	$(this).find('.jt-pg-product-line-bright').css('display','none');
});

$('.jt-pg-container').on('mouseenter', '.jt-pg-heart-wrap', function(){
	$(this).find('.jt-home-shop-love').css('background-position','-15px -30px');
});
$('.jt-pg-container').on('mouseleave', '.jt-pg-heart-wrap', function(){
	$(this).find('.jt-home-shop-love').css('background-position','0px -30px');
});


$('.jt-footer').css('display','block');
$('#jt-scroll-top').bind('click', function(){
	$('html, body').animate({scrollTop:0}, 'slow');
});

});