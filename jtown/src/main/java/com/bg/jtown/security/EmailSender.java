package com.bg.jtown.security;

import java.util.Date;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 이메일 전송 함수
 * 
 * @author Francis
 * 
 */
public class EmailSender {

	private static final String SENDER_EMAIL_ADDRESS = "admin@mirros.net";

	private static final Logger logger = LoggerFactory.getLogger(EmailSender.class);

	private Properties props;

	public void setProps(Properties props) {
		this.props = props;
	}

	public void sendEmail(String to, String subject, String content) {

		EmailAuthenticator authenticator = new EmailAuthenticator();
		Session session = Session.getInstance(props, authenticator);

		try {
			Message msg = new MimeMessage(session);
			msg.setFrom(new InternetAddress(SENDER_EMAIL_ADDRESS, "Mirros", "UTF-8"));
			logger.debug(msg.getFrom()[0].toString());
			// Recipients 받는사람
			InternetAddress[] address = { new InternetAddress(to) };
			msg.setRecipients(Message.RecipientType.TO, address);
			msg.setSubject(subject);
			msg.setContent(content, "text/html; charset=UTF-8");
			msg.setSentDate(new Date());
			Transport.send(msg);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	class EmailAuthenticator extends Authenticator {
		private String id;
		private String pw;

		public EmailAuthenticator() {
			this.id = "help@mirros.net";
			this.pw = "bizgate";
		}

		public EmailAuthenticator(String id, String pw) {
			this.id = id;
			this.pw = pw;
		}

		protected PasswordAuthentication getPasswordAuthentication() {
			return new PasswordAuthentication(id, pw);
		}
	}

}