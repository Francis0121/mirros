package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;

import javax.annotation.Resource;

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

	@Resource
	private LoginService loginService;
	@Resource
	private SeedCipher seedCipher;
	@Resource
	private EmailSender emailSender;
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	public void sendConfirmEmail(String username) {
		Confirm confirm = loginService
				.selectEmailConfirm(new Confirm(username));

		JtownUser jtownUser = (JtownUser) customJdbcUserDetailManager
				.loadUserByUsername(username);

		String series = confirm.getSeries();
		String key = jtownUser.getSalt();
		String encryptText = "";
		try {
			encryptText = Base64.encode(seedCipher.encrypt(series,
					key.getBytes(), "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			encryptText = null;
		}

		String subject = "미러스 인증 메일 입니다.";
		StringBuffer sb = new StringBuffer();
		sb.append("안녕하세요 미러스 입니다<br/>");
		sb.append("<a href='");
		sb.append("http://www.mirros.net/confirmEmailAddress?");
		sb.append("id=").append(username).append("&");
		sb.append("series=").append(encryptText);
		sb.append("' target='_self'>클릭하면 인증됩니다.");
		sb.append("</a>");

		emailSender.sendEmail(username, subject, sb.toString());
	}

	public void sendTempPasswordEmail(String username) {

		String tempPassword = customJdbcUserDetailManager
				.changeTempPassword(username);

		String subject = "미러스 :: 임시 비밀번호 입니다.";
		StringBuffer sb = new StringBuffer();
		sb.append("안녕하세요 미러스 입니다<br/>");
		sb.append(tempPassword);

		emailSender.sendEmail(username, subject, sb.toString());
	}
}
