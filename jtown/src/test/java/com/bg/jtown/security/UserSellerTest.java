package com.bg.jtown.security;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;
import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

/**
 * 판매자 수정 삭제
 * 
 * @author Francis
 * 
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class UserSellerTest {

	private static Logger logger = LoggerFactory
			.getLogger(UserCustomerTest.class);

	// ~ Dynamic Injection
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	@Resource
	private LoginService loginService;

	// ~ Variable
	private JtownUser jtownUser = new JtownUser();

	// ~ Method

	@Before
	public void BEFORE_TEST() throws Exception {
		loginService.deleteUserAll();
		int count = loginService.selectUsersCount();
		assertThat(count, is(0));

		jtownUser.setShopName("SellerShop");
		jtownUser.setShopUrl("www.sellerShop.com");
	}

	@Test
	public void 판매자_생성() throws Exception {
		customJdbcUserDetailManager.createUserSellerAndAuthority(jtownUser);
		int count = loginService.selectUsersCount();
		assertThat(count, is(1));
		JtownUser loadJtownUser = (JtownUser) customJdbcUserDetailManager
				.loadUserByUsername(jtownUser.getUsername());
		logger.debug(loadJtownUser.toString());
	}
}
