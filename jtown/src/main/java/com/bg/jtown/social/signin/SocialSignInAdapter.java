package com.bg.jtown.social.signin;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.web.SignInAdapter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.NativeWebRequest;

import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.UserAuthenticator;

@Component(value = "socialSignInAdapter")
public class SocialSignInAdapter implements SignInAdapter {

	private final RequestCache requestCache;

	private UserAuthenticator userAuthenticator;

	private LoginService loginService;

	@Inject
	public SocialSignInAdapter(RequestCache requestCache,
			UserAuthenticator userAuthenticator, LoginService loginService) {
		this.requestCache = requestCache;
		this.userAuthenticator = userAuthenticator;
		this.loginService = loginService;
	}

	@Override
	public String signIn(String localUserId, Connection<?> connection,
			NativeWebRequest request) {
		String username = loginService.selectUsername(Integer
				.parseInt(localUserId));
		userAuthenticator.onApplicationSocial(username);
		return extractOriginalUrl(request);
	}

	private String extractOriginalUrl(NativeWebRequest request) {
		HttpServletRequest nativeReq = request
				.getNativeRequest(HttpServletRequest.class);
		HttpServletResponse nativeRes = request
				.getNativeResponse(HttpServletResponse.class);
		SavedRequest saved = requestCache.getRequest(nativeReq, nativeRes);
		if (saved == null) {
			return null;
		}
		requestCache.removeRequest(nativeReq, nativeRes);
		removeAutheticationAttributes(nativeReq.getSession(false));
		return saved.getRedirectUrl();
	}

	private void removeAutheticationAttributes(HttpSession session) {
		if (session == null) {
			return;
		}
		session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
	}

}