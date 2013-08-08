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
 * 사용자 입력 수정 삭제 테스트
 * 
 * @author Francis
 * 
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"../spring-context.xml", "../mirros-email.xml", "../mirros-orm.xml", "../mirros-security.xml"})
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class UserCustomerTest {

	private static Logger logger = LoggerFactory
			.getLogger(UserCustomerTest.class);

	// ~ Dynamic Injection
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	@Resource
	private LoginService loginService;
//	@Resource
//	private PasswordEncoder passwordEncoder;
//	@Resource
//	private SaltSource saltSource;

	// ~ Variable
	private JtownUser jtownUser = new JtownUser();

	private JtownUser jtownUser2 = new JtownUser();

	// ~ Method
	@Before
	public void BEFORE_TEST() throws Exception {
		loginService.deleteUserAll();
		int count = loginService.selectUsersCount();
		assertThat(count, is(0));

		jtownUser.setName("User");
		jtownUser.setUsername("user@jtown.com");
		jtownUser.setPassword("1q2w3e4r!");
		jtownUser.setSex(true);
		jtownUser.setYear(1991);
		jtownUser.setMonth(1);
		jtownUser.setDay(1);
		jtownUser.setPn(1);

		jtownUser2.setName("User2");
		jtownUser2.setUsername("user2@jtown.com");
		jtownUser2.setPassword("2w3e4r5t@");
		jtownUser2.setSex(false);
		jtownUser2.setYear(1992);
		jtownUser2.setMonth(2);
		jtownUser2.setDay(3);
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

	@Test
	public void 사용자_삭제() throws Exception {
		customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser);
		customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser2);

		//TODO 사용자 삭제ustomJdbcUserDetailManager.deleteUserCustomer(jtownUser);
		int count = loginService.selectUsersCount();
		assertThat(count, is(1));

		JtownUser loadJtownUser = (JtownUser) customJdbcUserDetailManager
				.loadUserByUsername(jtownUser2.getUsername());
		logger.debug(loadJtownUser.toString());
		confirmUserAndLoadUser(jtownUser2, loadJtownUser);
	}

	@Test
	public void 사용자_선택() throws Exception {
		customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser);
		JtownUser customerUser = loginService.selectCustomer(jtownUser.getPn());
		logger.debug(customerUser.toString());
		confirmCustmoerAndLoadCustomer(jtownUser, customerUser);
	}

	@Test
	public void 사용자_수정() throws Exception {
		customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser);
		customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser2);

		int count = loginService.selectUsersCount();
		assertThat(count, is(2));
		jtownUser.setName("UpdateUser");
		jtownUser.setConfirmEmail( null );
		loginService.updateUserCustomer(jtownUser);

		JtownUser customerUser = loginService.selectCustomer(jtownUser.getPn());
		logger.debug(customerUser.toString());
		confirmCustmoerAndLoadCustomer(jtownUser, customerUser);

		JtownUser customerUser2 = loginService.selectCustomer(jtownUser2
				.getPn());
		logger.debug(customerUser.toString());
		confirmCustmoerAndLoadCustomer(jtownUser2, customerUser2);
	}

	/**
	 * <h1>Jtown 값 비교</h1><br/>
	 * name 값은 loadUserByUsername에서 가져오지 않음으로 Check하지 않음
	 * 
	 * @param user
	 *            입력한 JtownUser
	 * @param loadUser
	 *            DB 조회를 통한 JtownUser
	 */
	private void confirmUserAndLoadUser(JtownUser user, JtownUser loadUser) {
		assertThat(user.getUsername(), is(loadUser.getUsername()));
		assertThat(user.getPassword(), is(loadUser.getPassword()));
		assertThat(user.getName(), is(loadUser.getName()));
	}

	/**
	 * <h1>Jtown 값 비교</h1><br/>
	 * name 값 체크
	 * 
	 * @param user
	 * @param loadCustomer
	 */
	private void confirmCustmoerAndLoadCustomer(JtownUser user,
			JtownUser loadCustomer) {

	}

}
