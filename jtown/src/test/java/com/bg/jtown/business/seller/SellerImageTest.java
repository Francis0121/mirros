package com.bg.jtown.business.seller;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import java.util.List;

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

import com.bg.jtown.business.FileService;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.util.FileVO;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class SellerImageTest {

	private static Logger logger = LoggerFactory
			.getLogger(SellerImageTest.class);

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

		// ~ Start Seller Image
		sellerService.deleteSellerImage(null);
		int count = sellerService.selectSellerImageCount(null);
		assertThat(count, is(0));
	}

	@Test
	public void 판매자_이미지_입력() throws Exception {
		fileService.insertFileVO(fileVO1);

		sellerService.insertSellerImage(fileVO1);
		String saveName = sellerService.selectSellerImageOne(
				loadJtownUser.getPn(), fileVO1.getImagePn());

		assertThat(saveName, is(fileVO1.getSaveName()));
	}

	@Test
	public void 판매자_이미지_수정_입력값이_있는경우() throws Exception {
		fileService.insertFileVO(fileVO1);
		sellerService.insertSellerImage(fileVO1);

		fileService.insertFileVO(fileVO2);
		logger.debug(fileVO2.toString());
		sellerService.updateSellerImage(fileVO2);

		String saveName = sellerService.selectSellerImageOne(
				loadJtownUser.getPn(), fileVO2.getImagePn());
		assertThat(saveName, is(fileVO2.getSaveName()));
	}

	@Test
	public void 판매자_이미지_수정_입력값이_없는경우() throws Exception {
		fileService.insertFileVO(fileVO1);
		sellerService.updateSellerImage(fileVO1);

		String saveName = sellerService.selectSellerImageOne(
				loadJtownUser.getPn(), fileVO1.getImagePn());

		assertThat(saveName, is(fileVO1.getSaveName()));
	}

	@Test
	public void 이미지_업로드_되지않고_수정클릭시() throws Exception {
		fileService.insertFileVO(fileVO1);
		sellerService.updateSellerImage(fileVO1);

		sellerService.updateSellerImage(new FileVO(null, null, null,
				loadJtownUser.getPn(), null));

		String saveName = sellerService.selectSellerImageOne(
				loadJtownUser.getPn(), fileVO1.getImagePn());
		assertThat(saveName, is(fileVO1.getSaveName()));
	}

	/**
	 * 현재 Controller 로직과 같음 Insert는 하나밖에 못하도록 되있고 파일 가져오는것도 한개임
	 * 
	 * @throws Exception
	 */
	@Test
	public void 판매자_이미지_리스트_가져오기() throws Exception {
		fileService.insertFileVO(fileVO1);
		sellerService.updateSellerImage(fileVO1);

		List<String> images = sellerService.selectSellerImage(loadJtownUser
				.getPn());

		assertThat(images.get(0), is(fileVO1.getSaveName()));
	}
}
