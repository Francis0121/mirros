package com.bg.jtown.util;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * 문자열 변화 Util
 * 
 * @author 김성근
 * 
 */
public class StringUtil {

	/**
	 * 
	 * 특수문자 를 로 치환하기위한 메소드
	 * 
	 * @param srcString
	 *            변환문자열
	 * 
	 * @return 변환문자열
	 */
	public static String getSpclStrCnvr(String srcString) {

		String rtnStr = null;

		try {
			StringBuffer strTxt = new StringBuffer("");

			char chrBuff;
			int len = srcString.length();

			for (int i = 0; i < len; i++) {
				chrBuff = (char) srcString.charAt(i);

				switch (chrBuff) {
				case '<':
					strTxt.append("&lt;");
					break;
				case '>':
					strTxt.append("&gt;");
					break;
				case '&':
					strTxt.append("&amp;");
					break;
				default:
					strTxt.append(chrBuff);
				}
			}

			rtnStr = strTxt.toString();

		} catch (Exception e) {
			e.printStackTrace();
		}

		return rtnStr;
	}

	/**
	 * 문자열을 파라메터로 넘어오는 c 를 기준으로 나누어 List 를 만든다
	 * 
	 * @param s
	 * @param c
	 * @return
	 */
	public static List<String> split(String s, String c) {
		int j = 0;
		ArrayList<String> arraylist = new ArrayList<String>();
		do {
			int i = s.indexOf(c, j);
			if (i < 0) {
				arraylist.add(s.substring(j, s.length()));
				break;
			}
			arraylist.add(s.substring(j, i));
			j = ++i;
		} while (true);
		return arraylist;
	}

	/**
	 * 넘겨받은 숫자를 무조껀 2자리로 만드는 메소드 ex) 0 -> 00, 2 -> 02
	 * 
	 * @param i
	 * @return
	 */
	public static String getTwoDigit(int i) {
		if (i > 9)
			return String.valueOf(i);
		else
			return "0" + String.valueOf(i);
	}

	/**
	 * 길이가 긴 문자열을 cutLength만큼 자르고 tail 을 붙인다.(긴문자열을 앞부분만 표시할때 사용)
	 * 
	 * @param data
	 * @param cutLength
	 * @param tail
	 * @return
	 */
	public static String cutString(String data, int cutLength, String tail) {
		if (data.getBytes().length < cutLength)
			return data;
		int han = 0;
		int inx = 0;
		byte buf[] = data.getBytes();
		han = 0;
		for (inx = 0; inx < cutLength; inx++)
			if (buf[inx] < 0 || buf[inx] > 127)
				han++;

		if (han % 2 == 1)
			cutLength--;
		return new String(buf, 0, cutLength) + tail;
	}

	/**
	 * 
	 * 길이가 긴 문자열을 cutLength만큼 자르는 메소드 한글 깨짐 현상 제거
	 * 
	 * @param szText
	 * @param nLength
	 * @return
	 */
	public static String strCut(String szText, int nLength, String tail) { // 문자열
																			// 자르기
		String r_val = szText;
		int oF = 0, oL = 0, rF = 0, rL = 0;
		int nLengthPrev = 0;
		try {
			byte[] bytes = r_val.getBytes("UTF-8"); // 바이트로 보관
			// x부터 y길이만큼 잘라낸다. 한글안깨지게.
			int j = 0;
			if (nLengthPrev > 0)
				while (j < bytes.length) {
					if ((bytes[j] & 0x80) != 0) {
						oF += 2;
						rF += 3;
						if (oF + 2 > nLengthPrev) {
							break;
						}
						j += 3;
					} else {
						if (oF + 1 > nLengthPrev) {
							break;
						}
						++oF;
						++rF;
						++j;
					}
				}
			j = rF;
			while (j < bytes.length) {
				if ((bytes[j] & 0x80) != 0) {
					if (oL + 2 > nLength) {
						break;
					}
					oL += 2;
					rL += 3;
					j += 3;
				} else {
					if (oL + 1 > nLength) {
						break;
					}
					++oL;
					++rL;
					++j;
				}
			}
			r_val = new String(bytes, rF, rL, "UTF-8"); // charset 옵션
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		if (szText.getBytes().length < nLength)
			return r_val;

		return r_val + tail;
	}

	/**
	 * 원본 문자열의 포함된 특정 문자열을 새로운 문자열로 변환하는 메서드
	 * 
	 * @param source
	 *            원본 문자열
	 * @param subject
	 *            원본 문자열에 포함된 특정 문자열
	 * @param object
	 *            변환할 문자열
	 * @return sb.toString() 새로운 문자열로 변환된 문자열
	 */
	public static String replace(String source, String subject, String object) {
		StringBuffer rtnStr = new StringBuffer();
		String preStr = "";
		String nextStr = source;
		String srcStr = source;

		while (srcStr.indexOf(subject) >= 0) {
			preStr = srcStr.substring(0, srcStr.indexOf(subject));
			nextStr = srcStr
					.substring(srcStr.indexOf(subject) + subject.length(),
							srcStr.length());
			srcStr = nextStr;
			rtnStr.append(preStr).append(object);
		}
		rtnStr.append(nextStr);
		return rtnStr.toString();
	}

	public static String replacetZero(String str) {
		try {
			for (int i = 0; i < str.length(); i++) {
				if (!(str.substring(i, i + 1).indexOf("0") > -1)) {
					return str.substring(i);
				}
			}
		} catch (IndexOutOfBoundsException e) {
			str = "";
		}
		return str;
	}

}
