package com.bg.jtown.util;

public class RandomUtil {

	/**
	 * 지정된 법위에서 렌덤한 변수를 제공하는 함수
	 * 
	 * @param lowestValue
	 *            하한값
	 * @param higestValue
	 *            상한값
	 * @return
	 */
	public static int randomRange(int lowestValue, int higestValue) {
		return (int) (Math.random() * (lowestValue - higestValue + 1))
				+ higestValue;
	}

	/**
	 * 랜덤한 비밀번호 만들기
	 * 
	 * @param length
	 *            비밀번호 자리수
	 * @return
	 */
	public static String randomPassword(int length) {

		int index = 0;

		char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7',
				'8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
				'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
				'w', 'x', 'y', 'z', '!', '@', '#', '$' };

		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < length; i++) {
			index = (int) (charSet.length * Math.random());
			sb.append(charSet[index]);
		}

		return sb.toString();
	}
}
