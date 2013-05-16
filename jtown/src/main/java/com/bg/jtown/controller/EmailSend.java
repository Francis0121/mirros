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

		String subject = "[Mirros] 가입인증메일입니다.";
		StringBuffer sb = new StringBuffer();

		sb.append("	<div style='font-family: Dotum, Gulim; font-size: 12px; line-height: 2; width: 600px;'>");
		sb.append("		<div style='border-bottom: 2px solid #ffa500; padding: 10px;'>");
		sb.append("			<a href='https://www.mirros.net'><img alt='Mirros' src='https://www.mirros.net/resources/images/jt-main-banner.png'></a>");
		sb.append("		</div>");
		sb.append("		<div style='padding: 10px;'>");
		sb.append("			<h1 style='font-weight: normal;'>Weclode to Mirros</h1>");
		sb.append("			<p style='margin: 1em 0;'>");
		sb.append("				Mirros 계정 ("+jtownUser.getName()+")에 대한 이메일 인증 이메일 입니다.<br/>");
		sb.append("				아래에 링크를 클릭하시면 이메일 인증이 완료 됩니다.");
		sb.append("			</p>");
		sb.append("			<p style='margin: 1em 0;'>");
		sb.append("				<a href='http://www.mirros.net/confirmEmailAddress?id="+username+"&series="+encryptText+"' target='_self' style='color: #ef662a;'>링크를 클릭해주세요</a>");
		sb.append("			</p>");
		sb.append("			<p style='margin: 1em 0;'>");
		sb.append("				지속적으로 요청하지 않은 인증 메일을 자주 받으신다면, <a href='mailto:help@mirros.net' style='color: #ef662a;'>help@mirros.net</a>로 문의 주시기 바랍니다.");
		sb.append("			</p>");
		sb.append("		</div>");
		sb.append("		<div style='color: #808080; font-size: 11px; border-top: 1px solid #d9d9d9; padding: 10px;'>");
		sb.append("			본 메일은 발신전용 이메일입니다.");
		sb.append("			궁금한 사항을 문의하시거나 Mirros계정 관련 도움은 <a href='mailto:help@mirros.net' style='color: #ef662a;'>help@mirros.net</a>로 문의 주시거나, <a href='https://www.mirros.net/help/question' style='color: #ef662a;'>FAQ</a>페이지에서 확인하시기 바랍니다.");
		sb.append("		</div>");
		sb.append("	</div>");
		
		emailSender.sendEmail(username, subject, sb.toString());
	}

	public void sendTempPasswordEmail(String username) {

		String tempPassword = customJdbcUserDetailManager
				.changeTempPassword(username);

		JtownUser jtownUser = (JtownUser) customJdbcUserDetailManager
				.loadUserByUsername(username);

		String subject = "[Mirros] 임시비밀번호를 알려 드립니다.";
		StringBuffer sb = new StringBuffer();
		sb.append("	<div style='font-family: Dotum, Gulim; font-size: 12px; line-height: 2; width: 600px;'>");
		sb.append("		<div style='border-bottom: 2px solid #ffa500; padding: 10px;'>");
		sb.append("			<a href='https://www.mirros.net'><img alt='Mirros' src='https://www.mirros.net/resources/images/jt-main-banner.png'></a>");
		sb.append("		</div>");
		sb.append("		<div style='padding: 10px;'>");
		sb.append("			<h1 style='font-weight: normal;'>"+jtownUser.getName()+"님, 비밀번호를 잊으셨나요?</h1>");
		sb.append("			<p style='margin: 1em 0;'>");
		sb.append("				Mirros 계정 ("+jtownUser.getUsername()+")에 대한 비밀번호 재설정 요청을 받았습니다.<br/>");
		sb.append("				비밀번호가 재설정 되었으며, 재 설정된 비밀번호는 아래와 같습니다.");
		sb.append("			</p>");
		sb.append("			<p style='margin: 1em 0;'>");
		sb.append("				비밀번호 : "+tempPassword);
		sb.append("			</p>");
		sb.append("			<p style='margin: 1em 0;'>");
		sb.append("				지속적으로 요청하지 않은 비밀번호 재설정 메일을 자주 받으신다면, ");
		sb.append("				<a href='https://www.mirros.net/login/modify' style='color: #ef662a;'>계정설정</a>에서 비밀번호를 재설정 해주시기 바랍니다.");
		sb.append("				그리고 본 메일은 보안을 위해 확인후 삭제 하시기 바라며, 임시 비밀번호로 로그인 후에는 새로운 비밀번호로 변경해 주시기 바랍니다.");
		sb.append("			</p>");
		sb.append("		</div>");
		sb.append("		<div style='color: #808080; font-size: 11px; border-top: 1px solid #d9d9d9; padding: 10px;'>");
		sb.append("			본 메일은 발신전용 이메일입니다.");
		sb.append("			궁금한 사항을 문의하시거나 Mirros계정 관련 도움은 <a href='mailto:help@mirros.net' style='color: #ef662a;'>help@mirros.net</a>로 문의 주시거나, <a href='https://www.mirros.net/help/question' style='color: #ef662a;'>FAQ</a>페이지에서 확인하시기 바랍니다.");
		sb.append("		</div>");
		sb.append("</div>");

		emailSender.sendEmail(username, subject, sb.toString());
	}
}
