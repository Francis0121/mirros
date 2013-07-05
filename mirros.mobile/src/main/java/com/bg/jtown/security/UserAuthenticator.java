package com.bg.jtown.security;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * @author Francis
 * 
 */
@Component
public class UserAuthenticator {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	@Resource(name = "ipPersistentTokenBasedRememberMeServicesBean")
	private IPPersistentTokenBasedRememberMeServices ipPersistentTokenBasedRememberMeServices;

	/**
	 * 로그인시 패스워드 보유
	 * 
	 * @param username
	 * @param password
	 */
	public void login(String username, String password) {
		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
				username, password);
		Authentication authentication = authenticationManager
				.authenticate(authRequest);
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}

	public void onApplicationEvent(String username, HttpServletRequest request,
			HttpServletResponse response) {
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		ipPersistentTokenBasedRememberMeServices.logout(request, response,
				authentication);
		SecurityContextHolder.getContext().setAuthentication(
				createNewAuthentication(authentication, username));
	}

	public void onApplicationRemeberMe(String username,
			HttpServletRequest request, HttpServletResponse response) {
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		ipPersistentTokenBasedRememberMeServices.logout(request, response,
				authentication);
		Authentication successfulAuthentication = createNewAuthentication(
				authentication, username);
		SecurityContextHolder.getContext().setAuthentication(
				successfulAuthentication);
		ipPersistentTokenBasedRememberMeServices.onLoginSuccess(request,
				response, successfulAuthentication);
	}

	protected Authentication createNewAuthentication(
			Authentication currentAuth, String username) {
		JtownDetails newPrincipal = (JtownDetails) customJdbcUserDetailManager
				.loadUserByUsername(username);
		UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(
				newPrincipal, currentAuth.getCredentials(),
				newPrincipal.getAuthorities());
		newAuth.setDetails(currentAuth.getDetails());
		return newAuth;
	}

	/**
	 * Facebook 로그인 과 같은 패스워드 미보유
	 * 
	 * @param username
	 * @return
	 */
	public Authentication signInUser(String username) {
		JtownDetails newPrincipal = (JtownDetails) customJdbcUserDetailManager
				.loadUserByUsername(username);
		Authentication authentication = new UsernamePasswordAuthenticationToken(
				newPrincipal, null, newPrincipal.getAuthorities());
		SecurityContextHolder.getContext().setAuthentication(authentication);
		return authentication;
	}
}
