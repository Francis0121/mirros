package com.bg.jtown.controller.validator;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

	public static boolean lengthCheck(String value, String flag) {
		int length = value.length();
		
		if(flag != null){
			if(flag.equals("password")){
				if(length >= 8 && length <= 16){
					return true;
				} else {
					return false;
				}
			} else if(flag.equals("nickName")){
				if(length > 0 && length <= 10){
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
		if(password.equals(confirmPassword))
			return false;
		else
			return true;
	}
}
