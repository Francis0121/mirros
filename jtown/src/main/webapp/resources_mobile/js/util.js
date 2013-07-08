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