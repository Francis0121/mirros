package com.bg.jtown.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author 박광열
 * 
 */
public class ValidationUtil {

	public static boolean checkNullAndBlank(String target) {
		if (target == null || "".equals(target.trim())) {
			return true;
		} else {
			return false;
		}
	}

	public static boolean emailFormCheck(String username) {
		String regex = "^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$";

		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(username);

		return matcher.matches();
	}

	public static boolean onlyNumber(String number) {
		String regex = "^[0-9]*$";

		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(number);

		return matcher.matches();
	}

	public static boolean onlyEucKR(String string) {
		String regex = "^[가-힣]*$";

		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(string);

		return matcher.matches();
	}

	public static boolean checkCharAndLength(String str, int start, int end) {
		boolean regexBool = false;
		boolean lengthBool = false;

		String regex = "^[0-9A-Za-z가-힣]*$";

		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(str);

		regexBool = matcher.matches();

		int length = str.length();

		if (length > start && length <= end) {
			lengthBool = true;
		}

		return regexBool && lengthBool;
	}

	public static boolean lengthCheck(String str, int start, int end) {
		int length = str.length();
		
		if (length > start && length <= end) {
			return true;
		} else {
			return false;
		}
	}

	public static boolean confirmPassword(String password,
			String confirmPassword) {
		if (password.equals(confirmPassword))
			return false;
		else
			return true;
	}

}
