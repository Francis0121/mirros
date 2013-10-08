var array = new Array();

$(function(){
	$('#filedata').uploadify({
		'buttonText' : '사진 업로드',
		'fileTypeDesc' : 'Image Files',
	    'fileTypeExts' : '*.gif; *.jpg; *.png',
		'multi'	: true,
		'swf' : contextPath + '/resources/uploadify/uploadify.swf',
		'uploader' : contextPath + '/admin/file/upload.jt',
		'itemTemplate' : '<div></div>',
		'onQueueComplete' : function(queueData) {
			if (queueData.uploadsSuccessful) {
				location.reload();
			}
		}
	});
	
	$('#insert-photo').unbind('click').bind('click', function(){
		var oFileInfo = new Array();

		for ( var i in array) {
			var id = array[i];
			if (id == '')
				continue;
			var str = '#photo_' + id;
			var object = {
				sFileId	:$(str).attr('data-pn'),
				bNewLine : true,
				sFileName : $(str).attr('data-originalName'),
				sFileURL : contextPath + '/resources/uploadAdmin/'+ $(str).attr('data-saveName'),
				width : $('#width_' + id).val(),
				height : $('#height_' + id).val()
			};

			oFileInfo.push(object);
		}
		setPhotoToEditor(oFileInfo);
		window.close();
	});
	
	$('.delete-photo').unbind('click').bind('click', function(){
		var parent = $(this).parents('.photo'),
			pn = parent.attr('data-pn');
	
		var form = document.forms['fileFilter'];
		form.pn.value = pn;
		form._method.value = 'delete';
		form.submit();
	});
	
	$('.select-photo').unbind('click').bind('click', function(){
		var parent = $(this).parents('.photo'),
			count = parent.attr('data-count'),
			check = $(this).find('.check-photo');
		
		if (check.attr('checked')) {
			check.attr('checked', false);
			var index = array.indexOf(count);
			for ( var i = index; i < array.length; i++) {
				array[i] = array[i + 1] ? array[i + 1] : '';
			}
			$('#photoSize_' + count).hide();
		} else {
			check.attr('checked', true);
			array.push(count);
			$('.photoSize').hide();
			$('#photoSize_' + count).show();
		}
	});
});

function setPhotoToEditor(oFileInfo) {
	if (!!opener && !!opener.nhn && !!opener.nhn.husky
			&& !!opener.nhn.husky.PopUpManager) {
		opener.nhn.husky.PopUpManager.setCallback(window, 'SET_PHOTO_ONE',
				[ oFileInfo ]);
	}else if(!!opener && !!opener.productAPI && !!opener.productAPI.photo){
		opener.productAPI.photo.setProductPhoto(oFileInfo);
	}else{
		opener.$.cleditor.buttons.imagePopup.setPhotoOne(oFileInfo);
	}
}

function calculatorHeight(count, width, height) {
	if ($('#photoAutoResize_' + count).attr('checked')) {
		var resizeWidth = Number($('#width_' + count).val());
		var resizeHeight = Math.round((height * resizeWidth) / width);
		$('#height_' + count).val(resizeHeight);
	}
}

function calculatorWidth(count, width, height) {
	if ($('#photoAutoResize_' + count).attr('checked')) {
		var resizeHeight = Number($('#height_' + count).val());
		var resizeWidth = Math.round((width * resizeHeight) / height);
		$('#width_' + count).val(resizeWidth);
	}
}