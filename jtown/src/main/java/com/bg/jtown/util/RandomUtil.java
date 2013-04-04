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

}
