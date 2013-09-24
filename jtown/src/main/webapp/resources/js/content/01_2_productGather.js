$(function() {
	
	if (typeof jtown.pg == 'undefined') {
		jtown.pg = {};
	}
	
	
	var containerDiv = document.querySelector('.jt-pg-main');

	var itemOrder = function(){
		var msnry = new Masonry( containerDiv, {
		  // options
		  columnWidth: 0,
		  itemSelector: '.jt-item'
		});
	};
if($('.jt-header-nav-interestCategory').attr('data-category') == 'pg'){
	$(window).scroll(function(){
			    if($(window).scrollTop() == $(document).height() - $(window).height()){
			        $('div#infscr-loading').show();
			        $.ajax({
			        url: contextPath+'ajax/productGatherPagination.jt',
			        type: 'POST',
			        success: function(data){
			            if(data){
			            	productGatherHtml(data);
			                $('div#infscr-loading').hide();
			            }else{
			                $('div#infscr-loading').html('<center>Today end</center>');
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
			html+='<div class="jt-item jt-pg-small-product">';
			html+=		'<div class="jt-pg-product-line">';
			html+=			'<div>';
			if(data.mergeItems[idx].contentType == ''){
				html+=			 '<img src="'+contextPath+'resources/uploadImage'+data.mergeItems[idx].saveName+'" alt="'+data.mergeItems[idx].productName+'" />';
			}else{
				html+=			 '<img src="'+contextPath+'resources/uploadImage'+data.mergeItems[idx].saveName+'.'+data.mergeItems[idx].contentType+'" alt="'+data.mergeItems[idx].productName+'" />';	
			}
			html+= 		'</div>';
			html+=			'<div class="jt-pg-product-name">';
			html+=				'<div>'+data.mergeItems[idx].productName+'</div>';
			html+=				'<div>'+data.mergeItems[idx].price+'</div>';
			html+=			'</div>';
			html+=		'</div>';
			html+='</div>';
		}else{
			html+='<div class="jt-item jt-pg-large-product">';
			html+=		'<div class="jt-pg-product-line">';
			html+=			'<div>';
			if(data.mergeItems[idx].contentType == ''){
				html+=			 '<img src="'+contextPath+'resources/uploadImage'+data.mergeItems[idx].saveName+'" alt="'+data.mergeItems[idx].productName+'" />';
			}else{
				html+=			 '<img src="'+contextPath+'resources/uploadImage'+data.mergeItems[idx].saveName+'.'+data.mergeItems[idx].contentType+'" alt="'+data.mergeItems[idx].productName+'" />';	
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


$('.jt-item').live({
	mouseenter: function(){
		$(this).find('.jt-pg-product-name').css('display','block');
	},
	mouseleave: function(){
		$(this).find('.jt-pg-product-name').css('display','none');
	}
});

});