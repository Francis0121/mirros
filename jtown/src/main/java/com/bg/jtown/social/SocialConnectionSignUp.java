package com.bg.jtown.social;

import com.bg.jtown.security.JtownUser;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionSignUp;

public final class SocialConnectionSignUp implements ConnectionSignUp {

	@Override
	public String execute(Connection<?> connection) {

		// 유저 정보를 생성하고 저장
		JtownUser jtownUser = new JtownUser();

		return jtownUser.getPn().toString();
	}

}
