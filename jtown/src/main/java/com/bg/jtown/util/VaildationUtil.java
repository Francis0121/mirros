package com.bg.jtown.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author 박광열
 * 
 */
public class VaildationUtil {

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

	public static boolean lengthCheck(String value, String flag) {
		int length = value.length();

		if (flag != null) {
			if (flag.equals("password")) {
				if (length >= 8 && length <= 16) {
					return true;
				} else {
					return false;
				}
			} else if (flag.equals("nickName")) {
				if (length > 0 && length <= 20) {
					return true;
				} else {
					return false;
				}
			}
		}

		return false;
	}

	public static boolean confirmPassword(String password,
			String confirmPassword) {
		if (password.equals(confirmPassword))
			return false;
		else
			return true;
	}

}
