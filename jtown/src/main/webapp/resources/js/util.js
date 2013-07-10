/**
 * 빈문자열 정리
 * 
 * @param character
 * @returns
 */
function trim(character) {
	character = character.replace(/^\s*/, '');
	character = character.replace(/\s*$/, '');
	return character;
}

/**
 * 특수문자 변환 메소드
 * 
 * @param character
 * @returns
 */
function htmlChars(character) {
	if(nullValueCheck(character)){
		return "";
	}
	
	var str = ((character.replace('"', '&amp;')).replace('"', '&quot;'))
			.replace('\'', '&#39;');

	return (str.replace('<', '&lt;')).replace('>', '&gt;');

}
/**
 * 자바스크립트 3자리마다 , 찍기
 * 
 * @param n
 * @returns
 */
function fmtNumber(number) {
	var reg = /(^[+-]?\d+)(\d{3})/;
	number += '';
	while (reg.test(number))
		number = number.replace(reg, '$1' + ',' + '$2');
	return number;
}

/**
 * 업로드 된 파일 이름과 파일 고유번호 String을 형식에 맞게 변화해주는 메소드
 * 
 * @param character
 * @returns 변환된 문자열
 */
function changeFileString(character) {
	var changeChar = character.toString();

	changeChar = changeChar.replace(/<PRE>/ig, '');
	changeChar = changeChar.replace(/<\/PRE>/ig, '');

	return changeChar;
}

/**
 * nullValue 값을 체크
 * 
 * @param object
 * @returns true = null인경우, false = object가 있는 경우
 */
function nullValueCheck(object) {
	if (object == null || object == undefined || object == ''
			|| object == 'undefined') {
		return true;
	}
	return false;
}

/**
 * 자르기
 * 
 * @param val
 * @returns
 */
function split(val) {
	return val.split( /,\s*/ );
}

/**
 * Browser 정보 확인
 */
var BrowserDetect = {
	init : function() {
		this.browser = this.searchString(this.dataBrowser)
				|| "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString : function(data) {
		for ( var i = 0; i < data.length; i++) {
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch
					|| data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			} else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion : function(dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1)
			return;
		return parseFloat(dataString.substring(index
				+ this.versionSearchString.length + 1));
	},
	dataBrowser : [ {
		string : navigator.userAgent,
		subString : "Chrome",
		identity : "Chrome"
	}, {
		string : navigator.userAgent,
		subString : "OmniWeb",
		versionSearch : "OmniWeb/",
		identity : "OmniWeb"
	}, {
		string : navigator.vendor,
		subString : "Apple",
		identity : "Safari",
		versionSearch : "Version"
	}, {
		prop : window.opera,
		identity : "Opera",
		versionSearch : "Version"
	}, {
		string : navigator.vendor,
		subString : "iCab",
		identity : "iCab"
	}, {
		string : navigator.vendor,
		subString : "KDE",
		identity : "Konqueror"
	}, {
		string : navigator.userAgent,
		subString : "Firefox",
		identity : "Firefox"
	}, {
		string : navigator.vendor,
		subString : "Camino",
		identity : "Camino"
	}, { // for newer Netscapes (6+)
		string : navigator.userAgent,
		subString : "Netscape",
		identity : "Netscape"
	}, {
		string : navigator.userAgent,
		subString : "MSIE",
		identity : "Explorer",
		versionSearch : "MSIE"
	}, {
		string : navigator.userAgent,
		subString : "Gecko",
		identity : "Mozilla",
		versionSearch : "rv"
	}, { // for older Netscapes (4-)
		string : navigator.userAgent,
		subString : "Mozilla",
		identity : "Netscape",
		versionSearch : "Mozilla"
	} ],
	dataOS : [ {
		string : navigator.platform,
		subString : "Win",
		identity : "Windows"
	}, {
		string : navigator.platform,
		subString : "Mac",
		identity : "Mac"
	}, {
		string : navigator.userAgent,
		subString : "iPhone",
		identity : "iPhone/iPod"
	}, {
		string : navigator.platform,
		subString : "Linux",
		identity : "Linux"
	} ]
};

