package com.bg.jtown.security;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.rememberme.InvalidCookieException;
import org.springframework.security.web.authentication.rememberme.PersistentTokenBasedRememberMeServices;

@SuppressWarnings("deprecation")
public class IPPersistentTokenBasedRememberMeServices extends
		PersistentTokenBasedRememberMeServices {

	private static final ThreadLocal<HttpServletRequest> requestHolder = new ThreadLocal<HttpServletRequest>();

	public HttpServletRequest getContext() {
		return requestHolder.get();
	}

	public void setContext(HttpServletRequest context) {
		requestHolder.set(context);
	}

	protected String getUserIpAddress(HttpServletRequest request) {
		return request.getRemoteAddr();
	}

	@Override
	protected void onLoginSuccess(HttpServletRequest request,
			HttpServletResponse response,
			Authentication successfulAuthentication) {
		try {
			setContext(request);
			super.onLoginSuccess(request, response, successfulAuthentication);
		} finally {
			setContext(null);
		}
	}

	@Override
	protected void setCookie(String[] tokens, int maxAge,
			HttpServletRequest request, HttpServletResponse response) {
		String[] tokensWithIPAddress = Arrays.copyOf(tokens, tokens.length + 1);
		tokensWithIPAddress[tokensWithIPAddress.length - 1] = getUserIpAddress(request);
		logger.debug(getUserIpAddress(request)+"( 000000000000000000000000 )");
		super.setCookie(tokensWithIPAddress, maxAge, request, response);
	}

	@Override
	protected UserDetails processAutoLoginCookie(String[] cookieTokens,
			HttpServletRequest request, HttpServletResponse response) {
		try {
			setContext(request);
			String ipAddressToken = cookieTokens[cookieTokens.length - 1];
			if (!getUserIpAddress(request).equals(ipAddressToken)) {
				throw new InvalidCookieException(
						"Cooke Ip Addrss did not contain a matching IP (contained '"
								+ ipAddressToken + "')");
			}
			return super.processAutoLoginCookie(
					Arrays.copyOf(cookieTokens, cookieTokens.length - 1),
					request, response);
		} finally {
			setContext(null);
		}

	}
}
