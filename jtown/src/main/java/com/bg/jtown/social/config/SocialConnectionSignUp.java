package com.bg.jtown.social.config;

import javax.inject.Inject;

import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionSignUp;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookProfile;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.social.twitter.api.TwitterProfile;

public final class SocialConnectionSignUp implements ConnectionSignUp {

	private static Logger logger = LoggerFactory
			.getLogger(SocialConnectionSignUp.class);

	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	@Inject
	public void setCustomJdbcUserDetailManager(
			CustomJdbcUserDetailManager customJdbcUserDetailManager) {
		this.customJdbcUserDetailManager = customJdbcUserDetailManager;
	}

	@Override
	public String execute(Connection<?> connection) {
		// 유저 정보를 생성하고 저장
		JtownUser jtownUser = new JtownUser();

		if (connection.getApi() instanceof Facebook) {
			Facebook facebook = (Facebook) connection.getApi();
			FacebookProfile fp = facebook.userOperations().getUserProfile();

			jtownUser.setUsername(fp.getEmail());
			jtownUser.setSex(fp.getGender().equals("male") ? true : false);
			jtownUser.setName(fp.getName().replace(" ", ""));

			String date = fp.getBirthday();
			String year = date.substring(6, 10);
			String day = date.substring(3, 5);
			String month = date.substring(0, 2);

			jtownUser.setYear(Integer.parseInt(year));
			jtownUser.setMonth(Integer.parseInt(month.replace("0", "")));
			jtownUser.setDay(Integer.parseInt(day.replace("0", "")));

			customJdbcUserDetailManager.createUserSocialAndAuthority(jtownUser);

			logger.debug("Executer :  Facebook [ " + jtownUser + " ]");

			return jtownUser.getPn().toString();
		} else if (connection.getApi() instanceof Twitter) {
			Twitter twitter = (Twitter) connection.getApi();
			TwitterProfile tp = twitter.userOperations().getUserProfile();

			jtownUser.setUsername(tp.getName());
			jtownUser.setPn(0);

			logger.debug("Executer :  Twitter [ " + jtownUser + " ]");

			return null;
		} else {
			return null;
		}
	}
}
