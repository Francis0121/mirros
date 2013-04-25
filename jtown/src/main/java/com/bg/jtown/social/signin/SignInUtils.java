package com.bg.jtown.social.signin;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

public class SignInUtils {
	/**
	 * Programmatically signs in the user with the given the user ID.
	 */
	public static void signin(String userId) {
		List<GrantedAuthority> dbAuths = new ArrayList<GrantedAuthority>();
		dbAuths.add(new SimpleGrantedAuthority("ROLE_USER"));

		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken(userId, null, dbAuths));
	}
}
