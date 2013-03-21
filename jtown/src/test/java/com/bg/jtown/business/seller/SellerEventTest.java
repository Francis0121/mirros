package com.bg.jtown.business.seller;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.bg.jtown.business.Event;
import com.bg.jtown.business.FileService;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.util.FileVO;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class SellerEventTest {

	private static final Integer BANNER_TYPE = 1;
	private static final Integer BANNER_ORDER_FIRST = 1;
	private static final Integer BANNER_ORDER_SECOND = 2;

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

	private FileVO fileVO1;
	private FileVO fileVO2;

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

		fileVO1 = new FileVO(null, "orginalName1", "saveName1",
				loadJtownUser.getPn(), 1004);
		fileVO2 = new FileVO(null, "orginalName2", "saveName2",
				loadJtownUser.getPn(), 2008);

		// ~ Start Seller Product
		sellerService.deleteEvent(new Event());
		int count = sellerService.selectEventCount(loadJtownUser.getPn());
		assertThat(count, is(0));

		fileService.insertFileVO(fileVO1);
		fileService.insertFileVO(fileVO2);
	}

	@Test
	public void 이벤트_입력() throws Exception {
		Integer userPn = loadJtownUser.getPn();
		Integer imagePn = fileVO1.getImagePn();
		Event event = new Event(null, userPn, BANNER_TYPE, null, imagePn, "내용",
				BANNER_ORDER_FIRST);
		sellerService.insertEvent(event);
		int count = sellerService.selectEventCount(loadJtownUser.getPn());
		assertThat(count, is(1));

		Event loadEvent = sellerService.selectEventOne(event.getPn());
		confirmEventAndLoadEvent(event, loadEvent);
	}

	@Test
	public void 이벤트_수정() throws Exception {
		Integer userPn = loadJtownUser.getPn();
		Integer imagePn1 = fileVO1.getImagePn();
		Integer imagePn2 = fileVO1.getImagePn();
		Event event1 = new Event(null, userPn, BANNER_TYPE, null, imagePn1,
				"내용1", BANNER_ORDER_FIRST);
		Event event2 = new Event(null, userPn, BANNER_TYPE, null, imagePn2,
				"내용2", BANNER_ORDER_SECOND);
		sellerService.insertEvent(event1);
		sellerService.insertEvent(event2);
		int count = sellerService.selectEventCount(loadJtownUser.getPn());
		assertThat(count, is(2));

		FileVO fileVO3 = new FileVO(null, "orginalName3", "saveName3",
				loadJtownUser.getPn(), 2008);
		fileService.insertFileVO(fileVO3);
		event1.setImagePn(fileVO3.getImagePn());
		event1.setContent("수정");
		event1.setBannerType(2);

		sellerService.updateEvent(event1);

		Event loadEvent1 = sellerService.selectEventOne(event1.getPn());
		confirmEventAndLoadEvent(event1, loadEvent1);

		Event loadEvent2 = sellerService.selectEventOne(event2.getPn());
		confirmEventAndLoadEvent(event2, loadEvent2);
	}

	@Test
	public void 이벤트_수정_및_입력메소드_입력테스트() throws Exception {
		Integer userPn = loadJtownUser.getPn();
		Integer imagePn = fileVO1.getImagePn();
		Event event = new Event(null, userPn, BANNER_TYPE, null, imagePn,
				"내용1", BANNER_ORDER_FIRST);

		sellerService.updateAndInsertEvent(event);
		int count = sellerService.selectEventCount(loadJtownUser.getPn());
		assertThat(count, is(1));

		Event loadEvent = sellerService.selectEventOne(event.getPn());
		confirmEventAndLoadEvent(event, loadEvent);
	}

	@Test
	public void 이벤트_수정_및_입력메소드_수정테스트() throws Exception {
		Integer userPn = loadJtownUser.getPn();
		Integer imagePn = fileVO1.getImagePn();
		Event event = new Event(null, userPn, BANNER_TYPE, null, imagePn,
				"내용1", BANNER_ORDER_FIRST);

		sellerService.insertEvent(event);
		int count = sellerService.selectEventCount(loadJtownUser.getPn());
		assertThat(count, is(1));

		event.setImagePn(fileVO2.getImagePn());
		event.setContent("수정");
		event.setBannerType(2);
		sellerService.updateAndInsertEvent(event);

		Event loadEvent = sellerService.selectEventOne(event.getPn());
		confirmEventAndLoadEvent(event, loadEvent);
	}

	@Test
	public void 이벤트_리스트() throws Exception {
		Integer userPn = loadJtownUser.getPn();
		Integer imagePn1 = fileVO1.getImagePn();
		Integer imagePn2 = fileVO1.getImagePn();
		Event event1 = new Event(null, userPn, BANNER_TYPE, null, imagePn1,
				"내용1", BANNER_ORDER_FIRST);
		Event event2 = new Event(null, userPn, BANNER_TYPE, null, imagePn2,
				"내용2", BANNER_ORDER_SECOND);
		sellerService.insertEvent(event1);
		sellerService.insertEvent(event2);
		int count = sellerService.selectEventCount(loadJtownUser.getPn());
		assertThat(count, is(2));

		List<Event> event = sellerService.selectEventList(userPn);
		assertThat(2, is(event.size()));
	}

	private void confirmEventAndLoadEvent(Event event, Event loadEvent) {
		assertThat(event.getImagePn(), is(loadEvent.getImagePn()));
		assertThat(event.getBannerOrder(), is(loadEvent.getBannerOrder()));
		assertThat(event.getBannerType(), is(loadEvent.getBannerType()));
		assertThat(event.getContent(), is(loadEvent.getContent()));
	}
}
