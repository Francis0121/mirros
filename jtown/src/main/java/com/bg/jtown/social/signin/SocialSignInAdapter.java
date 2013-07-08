package com.bg.jtown.social.signin;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.web.SignInAdapter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;

import com.bg.jtown.security.IPPersistentTokenBasedRememberMeServices;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.UserAuthenticator;

@Component(value = "socialSignInAdapter")
public class SocialSignInAdapter implements SignInAdapter {

	private static Logger logger = LoggerFactory
			.getLogger(SocialSignInAdapter.class);

	private UserAuthenticator userAuthenticator;
	private IPPersistentTokenBasedRememberMeServices ipPersistentTokenBasedRememberMeServices;
	private LoginService loginService;

	@Inject
	public SocialSignInAdapter(
			UserAuthenticator userAuthenticator,
			LoginService loginService,
			IPPersistentTokenBasedRememberMeServices ipPersistentTokenBasedRememberMeServices) {
		this.loginService = loginService;
		this.userAuthenticator = userAuthenticator;
		this.ipPersistentTokenBasedRememberMeServices = ipPersistentTokenBasedRememberMeServices;
	}

	@Override
	public String signIn(String localUserId, Connection<?> connection,
			NativeWebRequest request) {
		String username = loginService.selectUsername(Integer
				.parseInt(localUserId));
		Authentication authentication = userAuthenticator.signInUser(username);
		logger.debug("Signin : username [ " + localUserId
				+ " ] , Authentication [ " + authentication.getPrincipal()
				+ " ] ");

		ipPersistentTokenBasedRememberMeServices.setAlwaysRemember(true);
		ipPersistentTokenBasedRememberMeServices.loginSuccess(
				(HttpServletRequest) request.getNativeRequest(),
				(HttpServletResponse) request.getNativeResponse(),
				authentication);

		String referer = (String) request.getAttribute("beforeLoginUrl",
				RequestAttributes.SCOPE_SESSION);
		logger.debug(" Social Referer " + referer);
		if (referer != null) {
			request.setAttribute("beforeLoginUrl", null,
					RequestAttributes.SCOPE_SESSION);
			return referer;
		}
		return null;
	}

}