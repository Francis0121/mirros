package com.bg.jtown.security;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;

/**
 * @author Francis
 * 
 */
@Component
public class UserAuthenticator {

	private final Logger logger = LoggerFactory
			.getLogger(UserAuthenticator.class);

	@Autowired
	private AuthenticationManager authenticationManager;

	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	public void login(HttpServletRequest request, HttpServletResponse response) {
		logger.debug("Auto Login");

		String username = (String) request.getAttribute("username");
		String password = (String) request.getAttribute("password");

		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
				username, password);
		Authentication authentication = authenticationManager
				.authenticate(authRequest);
		persistAuthentication(authentication, request.getSession());
	}

	private void persistAuthentication(Authentication authentication,
			HttpSession session) {
		SecurityContext securityContext = new SecurityContextImpl();
		securityContext.setAuthentication(authentication);
		SecurityContextHolder.setContext(securityContext);
		session.setAttribute(
				HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
				securityContext);
	}

	public void onApplicationEvent(String username) {
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		SecurityContextHolder.getContext().setAuthentication(
				createNewAuthentication(authentication, username));
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

	public void onApplicationSocial(String username) {
		SecurityContextHolder.getContext().setAuthentication(
				createNewAuthenticationNoPassword(username));
	}

	protected Authentication createNewAuthenticationNoPassword(String username) {
		JtownDetails newPrincipal = (JtownDetails) customJdbcUserDetailManager
				.loadUserByUsername(username);
		UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(
				newPrincipal, null, newPrincipal.getAuthorities());
		return newAuth;
	}
}
