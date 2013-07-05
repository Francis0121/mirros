package com.bg.jtown.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieUtil {

	private static final String LOGIN_COOKIE_NAME = "MIRROS_USER";
	private static final String REMEMBER_ME_COOKIE_NAME = "SPRING_SECURITY_REMEMBER_ME_COOKIE";
	private static final String DOMAIN = ".mirros.net";
	private static final Integer AGE_1DAY = 60 * 60 * 24;

	public static void makeCookie(String name, String text,
			HttpServletRequest request, HttpServletResponse response) {
		try {
			Cookie cookie = new Cookie(name, URLEncoder.encode(text, "UTF-8"));
			cookie.setPath(getCookiePath(request));
			cookie.setDomain(DOMAIN);
			cookie.setMaxAge(AGE_1DAY);
			response.addCookie(cookie);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	private static String getCookiePath(HttpServletRequest request) {
		String contextPath = request.getContextPath();
		return contextPath.length() > 0 ? contextPath : "/";
	}

	public static void makeLoginCookie(String text, HttpServletRequest request,
			HttpServletResponse response) {
		makeCookie(LOGIN_COOKIE_NAME, text, request, response);
	}

	public static Boolean checkCookie(String name, HttpServletRequest request) {
		Cookie cookies[] = request.getCookies();
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				if (cookies[i].getName().equals(name)) {
					return true;
				}
			}
		}
		return false;
	}

	public static Boolean checkRememberme(HttpServletRequest request) {
		Cookie cookies[] = request.getCookies();
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				if (cookies[i].getName().equals(REMEMBER_ME_COOKIE_NAME)) {
					return true;
				}
			}
		}
		return false;
	}

	public static String checkLogin(HttpServletRequest request) {
		try {
			Cookie cookies[] = request.getCookies();
			if (cookies != null) {
				for (int i = 0; i < cookies.length; i++) {
					if (cookies[i].getName().equals(LOGIN_COOKIE_NAME)) {
						return URLDecoder
								.decode(cookies[i].getValue(), "UTF-8");
					}
				}
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return null;
		}
		return null;

	}
}
