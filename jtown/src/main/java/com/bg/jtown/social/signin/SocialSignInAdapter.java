package com.bg.jtown.social.signin;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.web.SignInAdapter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.NativeWebRequest;

import com.bg.jtown.security.IPPersistentTokenBasedRememberMeServices;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.UserAuthenticator;

@Component(value = "socialSignInAdapter")
public class SocialSignInAdapter implements SignInAdapter {

	private UserAuthenticator userAuthenticator;

	private LoginService loginService;

	private IPPersistentTokenBasedRememberMeServices ipPersistentTokenBasedRememberMeServices;

	@Inject
	public SocialSignInAdapter(
			UserAuthenticator userAuthenticator,
			LoginService loginService,
			IPPersistentTokenBasedRememberMeServices ipPersistentTokenBasedRememberMeServices) {
		this.userAuthenticator = userAuthenticator;
		this.loginService = loginService;
		this.ipPersistentTokenBasedRememberMeServices = ipPersistentTokenBasedRememberMeServices;
	}

	@Override
	public String signIn(String localUserId, Connection<?> connection,
			NativeWebRequest request) {
		String username = loginService.selectUsername(Integer
				.parseInt(localUserId));
		Authentication authentication = userAuthenticator.signInUser(username);

		ipPersistentTokenBasedRememberMeServices.loginSuccess(
				(HttpServletRequest) request.getNativeRequest(),
				(HttpServletResponse) request.getNativeResponse(),
				authentication);

		return null;
	}

}