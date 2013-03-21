package com.bg.jtown.business.seller;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.bg.jtown.business.FileService;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class SellerNoticeTest {

	private static String OVERFLOW_NOTICE = "문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과문자열초과";

	// ~ Dynamic Injection
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	@Resource
	private LoginService loginService;
	@Resource
	private SellerService sellerService;
	@Resource
	private FileService fileService;

	// ~ Variable
	private JtownUser jtownUser = new JtownUser();
	private JtownUser loadJtownUser = new JtownUser();

	// ~ Method

	@Before
	public void BEFORE_TEST() throws Exception {
		// ~ User And File Setting
		jtownUser.setName("SellerShop");
		jtownUser.setShopUrl("www.sellerShop.com");

		loginService.deleteUserAll();
		customJdbcUserDetailManager.createUserSellerAndAuthority(jtownUser);
		loadJtownUser = (JtownUser) customJdbcUserDetailManager
				.loadUserByUsername(jtownUser.getUsername());

		// ~ Start Seller Image
		sellerService.deleteSellerImage(null);
		int count = sellerService.selectSellerImageCount(null);
		assertThat(count, is(0));
	}

	@Test
	public void 공지사항_수정() throws Exception {
		loadJtownUser.setNotice("공지사항 수정 입력");
		sellerService.updateSellerNotice(loadJtownUser);

		JtownUser loadSeller = sellerService
				.selectSellerInformation(loadJtownUser.getPn());

		assertThat(loadSeller.getNotice(), is(loadJtownUser.getNotice()));
	}

	@Test
	public void 공지사항_수정_문자열_초과() throws Exception {
		loadJtownUser.setNotice(OVERFLOW_NOTICE);
		sellerService.updateSellerNotice(loadJtownUser);

		JtownUser loadSeller = sellerService
				.selectSellerInformation(loadJtownUser.getPn());

		assertThat(loadSeller.getNotice(), is(not(loadJtownUser.getNotice())));
	}
}
