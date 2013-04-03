package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bg.jtown.security.Confirm;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.EmailSender;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.algorithm.SeedCipher;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

@Component
public class EmailSend {

	private LoginService loginService;
	private SeedCipher seedCipher;
	private EmailSender emailSender;
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	@Autowired
	public void config(LoginService loginService, SeedCipher seedCipher,
			EmailSender emailSender,
			CustomJdbcUserDetailManager customJdbcUserDetailManager) {
		this.loginService = loginService;
		this.seedCipher = seedCipher;
		this.emailSender = emailSender;
		this.customJdbcUserDetailManager = customJdbcUserDetailManager;
	}

	public void sendConfirmEmail(String username) {
		Confirm confirm = loginService
				.selectEmailConfirm(new Confirm(username));

		StringBuffer url = new StringBuffer();
		url.append("username=").append(username);
		url.append("&number=").append(confirm.getSeries());

		JtownUser jtownUser = (JtownUser) customJdbcUserDetailManager
				.loadUserByUsername(username);

		String key = username + jtownUser.getSalt();
		String text = url.toString();
		String encryptText = "";
		try {
			encryptText = Base64.encode(seedCipher.encrypt(text,
					key.getBytes(), "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			encryptText = null;
		}

		// TODO 도메인 주소가 나올경우 도메인을 바꿔주어야함
		String subject = "비즈니스게이트 인증 메일 입니다.";
		StringBuffer sb = new StringBuffer();
		sb.append("안녕하세요 비즈니스 게이트 입니다<br/>");
		sb.append("<a href='");
		sb.append("http://54.248.234.116:8080/bg/login/confirmEmailAddress.bg?");
		sb.append("key=").append(username).append("&");
		sb.append("value=").append(encryptText);
		sb.append("' target='_self'>클릭하면 인증됩니다.");
		sb.append("</a>");

		emailSender.sendEmail(username, subject, sb.toString());
	}
}
