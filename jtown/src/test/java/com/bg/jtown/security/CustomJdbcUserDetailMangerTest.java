package com.bg.jtown.security;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.dao.SaltSource;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class CustomJdbcUserDetailMangerTest {

	private static Logger logger = LoggerFactory
			.getLogger(CustomJdbcUserDetailMangerTest.class);

	// ~ Dynamic Injection
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	@Resource
	private LoginService loginService;

	@Resource
	private PasswordEncoder passwordEncoder;

	@Resource
	private SaltSource saltSource;

	// ~ Variable
	private JtownUser jtownUser = new JtownUser();

	// ~ Method
	@Before
	public void BEFORE_TEST() throws Exception {
		loginService.deleteUserAll();
		int count = loginService.selectUsersCount();
		assertThat(count, is(0));

		jtownUser.setName("User");
		jtownUser.setUsername("user@jtown.com");
		jtownUser.setPassword("1q2w3e4r!");
	}

	@Test
	public void 사용자_입력() throws Exception {
		customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser);
		int count = loginService.selectUsersCount();
		assertThat(count, is(1));

		JtownUser loadJtownUser = (JtownUser) customJdbcUserDetailManager
				.loadUserByUsername(jtownUser.getUsername());

		logger.debug(loadJtownUser.toString());

		confirmUserAndLoadUser(jtownUser, loadJtownUser);
	}

	private void confirmUserAndLoadUser(JtownUser user, JtownUser loadUser) {
		assertThat(user.getUsername(), is(loadUser.getUsername()));
		assertThat(user.getPassword(), is(loadUser.getPassword()));
	}

}
