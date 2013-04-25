package com.bg.jtown.social.config;

import java.util.Date;

import com.bg.jtown.security.JtownUser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionSignUp;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookProfile;

public final class SocialConnectionSignUp implements ConnectionSignUp {

	private static Logger logger = LoggerFactory
			.getLogger(SocialConnectionSignUp.class);

	@Override
	public String execute(Connection<?> connection) {
		logger.debug("Executer : " + connection);

		// 유저 정보를 생성하고 저장
		JtownUser jtownUser = new JtownUser();
		logger.debug("Executer :  jtownUser first [ " + jtownUser + " ]");

		jtownUser.setJoinDate(new Date().toString());

		if (connection.getApi() instanceof Facebook) {
			Facebook facebook = (Facebook) connection.getApi();
			FacebookProfile fp = facebook.userOperations().getUserProfile();

			jtownUser.setUsername(fp.getEmail());
			jtownUser.setSex(fp.getGender().equals("male") ? true : false);
			jtownUser.setName(fp.getName());
			
			String date = fp.getBirthday();
			String year = date.substring(6, 10);
			String month = date.substring(3, 5);
			String day = date.substring(0, 2);
			jtownUser.setYear(Integer.parseInt(year));
			jtownUser.setMonth(Integer.parseInt(month.replace("0", "")));
			jtownUser.setDay(Integer.parseInt(day.replace("0", "")));
			
			jtownUser.setPn(Integer.parseInt(fp.getId()));
		}
		logger.debug("Executer :  jtownUser last [ " + jtownUser + " ]");

		return jtownUser.getPn().toString();
	}
}
