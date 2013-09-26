$(function() {
	
	if (typeof jtown.pg == 'undefined') {
		jtown.pg = {};
	}
	
	var containerDiv = document.querySelector('.jt-pg-main');
	
	var itemOrder = function(){
		var msnry = new Masonry( containerDiv, {
		  columnWidth: 0,
		  itemSelector: '.jt-pg-item'
		});
	};
	$( window ).resize(function() {
		var clientWidth = Number(window.document.body.clientWidth),
		widthItem = Math.floor(clientWidth/258);
		if(widthItem > 6){
			widthItem = widthItem-1;
		}
		$('.jt-pg-main').css({width : (widthItem*258), margin : 'auto'});
	});
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
	
	for(var idx=0; idx< size; idx++){
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
				html+='</div>';
			}else if(data.mergeItems[idx].productPn != 0){
				html+=		'<div class="jt-pg-product-line">';
				html+=			'<div>';
				if(data.mergeItems[idx].contentType == ''){
					html+=			 '<img src="'+contextPath+'resources/uploadImage/'+data.mergeItems[idx].saveName+'" alt="'+data.mergeItems[idx].productName+'" />';
				}else{
					html+=			 '<img src="'+contextPath+'photo/thumbnail/'+data.mergeItems[idx].saveName+'product.'+data.mergeItems[idx].contentType +'" alt="'+data.mergeItems[idx].productName+'" />';	
				}
				html+= 		'</div>';
				html+=			'<div class="jt-pg-product-name">';
				html+=				'<div>'+data.mergeItems[idx].productName+'</div>';
				html+=				'<div>'+data.mergeItems[idx].price+'</div>';
				html+=			'</div>';
				html+=		'</div>';
			}
			html+='</div>';
		}else{
			html+='<div class="jt-pg-item jt-pg-large-product" data-url="'+data.mergeItems[idx].url+'" data-product-pn="'+data.mergeItems[idx].productPn+'">';
			html+=		'<div class="jt-pg-product-line">';
			html+=			'<div class="jt-pg-product-line-hot"><img src="'+contextPath+'resources/images/jt-hot.png"></div>';
			html+=			'<div>';
			if(data.mergeItems[idx].contentType == ''){
				html+=			 '<img src="'+contextPath+'resources/uploadImage/'+data.mergeItems[idx].saveName+'" alt="'+data.mergeItems[idx].productName+'" />';
			}else{
				html+=			 '<img src="'+contextPath+'photo/thumbnail/'+data.mergeItems[idx].saveName+'product.'+data.mergeItems[idx].contentType +'" alt="'+data.mergeItems[idx].productName+'" />';	
			}
			html+= 		'</div>';
			html+=			'<div class="jt-pg-product-name">';
			html+=				'<div>'+data.mergeItems[idx].productName+'</div>';
			html+=				'<div>'+data.mergeItems[idx].price+'</div>';
			html+=			'</div>';
			html+=		'</div>';
			html+='</div>';
		}
	}
	$('.jt-pg-main').append(html);
	itemOrder();
};
jtown.pg.productStatisticClick = function(productPn){
	$.ajax({
        url: contextPath+'ajax/productClick.jt',
        type: 'POST',
        data:{productPn : productPn },
        success: function(data){}
    });
};

jtown.pg.eventStatisticClick = function(eventPn){
	$.ajax({
        url: contextPath+'ajax/eventClick.jt',
        type: 'POST',
        data:{eventPn : eventPn },
        success: function(data){}
    });
};

$('.jt-pg-item').live('click', function(){
	var productPn = $(this).attr('data-product-pn');
	var eventPn = $(this).attr('data-event-pn');
	if(productPn != 0){
		jtown.pg.productStatisticClick(productPn);
	}else{
		jtown.pg.eventStatisticClick(eventPn);
	}
	window.open($(this).attr('data-url'), '_blank');
});


$('.jt-pg-item').live({
	mouseenter: function(){
		$(this).find('.jt-pg-product-name').css('display','block');
	},
	mouseleave: function(){
		$(this).find('.jt-pg-product-name').css('display','none');
	}
});


});