package com.bg.jtown.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class CookieUtil {

	public static String isCookie(String name, HttpServletRequest request)
			throws UnsupportedEncodingException {
		Cookie cookies[] = request.getCookies();
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				if (cookies[i].getName().equals(name)) {
					return URLDecoder.decode(cookies[i].getValue(), "UTF-8");
				}
			}
		}
		return null;
	}
}
