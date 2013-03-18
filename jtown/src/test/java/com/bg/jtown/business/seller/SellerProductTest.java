package com.bg.jtown.business.seller;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.bg.jtown.business.FileService;
import com.bg.jtown.business.Product;
import com.bg.jtown.business.SellerService;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.util.FileVO;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class SellerProductTest {

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
		jtownUser.setShopName("SellerShop");
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
		sellerService.deleteProduct(new Product());
		int count = sellerService.selectSellerProductCount(loadJtownUser
				.getPn());
		assertThat(count, is(0));
	}

	@Test
	public void 상품_입력() {
		fileService.insertFileVO(fileVO1);
		Integer imagePn = fileVO1.getImagePn();
		Integer userPn = loadJtownUser.getPn();
		Product product = new Product(null, userPn, imagePn, null);
		sellerService.insertProduct(product);
		int count = sellerService.selectSellerProductCount(userPn);
		assertThat(count, is(1));

		Product loadProduct = sellerService.selectSellerProductOne(product
				.getPn());
		assertThat(product.getImagePn(), is(loadProduct.getImagePn()));
		assertThat(product.getSellerPn(), is(loadProduct.getSellerPn()));
	}

	@Test
	public void 상품_삭제() {
		fileService.insertFileVO(fileVO1);
		fileService.insertFileVO(fileVO2);

		Integer imagePn1 = fileVO1.getImagePn();
		Integer imagePn2 = fileVO2.getImagePn();
		Integer userPn = loadJtownUser.getPn();

		Product product1 = new Product(null, userPn, imagePn1, null);
		Product product2 = new Product(null, userPn, imagePn2, null);

		sellerService.insertProduct(product1);
		sellerService.insertProduct(product2);
		int count = sellerService.selectSellerProductCount(userPn);
		assertThat(count, is(2));

		sellerService.deleteProduct(product1);
		count = sellerService.selectSellerProductCount(userPn);
		assertThat(count, is(1));

		Product loadProduct = sellerService.selectSellerProductOne(product2
				.getPn());
		assertThat(product2.getImagePn(), is(loadProduct.getImagePn()));
		assertThat(product2.getSellerPn(), is(loadProduct.getSellerPn()));
	}

	@Test
	public void 상품_입력개수_제한() throws Exception {
		Integer userPn = loadJtownUser.getPn();
		for (int i = 0; i < 10; i++) {
			FileVO fileVO = new FileVO(null, "orginalName", "saveName", userPn,
					1004);
			fileService.insertFileVO(fileVO);
			Integer imagePn = fileVO.getImagePn();

			Product product = new Product(null, userPn, imagePn, null);
			sellerService.insertProduct(product);
		}
		int count = sellerService.selectSellerProductCount(userPn);
		assertThat(count, is(10));

		fileService.insertFileVO(fileVO1);
		Integer imagePn = fileVO1.getImagePn();
		Product product = new Product(null, userPn, imagePn, null);
		sellerService.insertSellerProduct(product);

		assertThat(null, is(product.getPn()));
	}

	@Test
	public void 상품_삭제개수_제한() throws Exception {
		Integer userPn = loadJtownUser.getPn();
		for (int i = 0; i < 2; i++) {
			FileVO fileVO = new FileVO(null, "orginalName", "saveName", userPn,
					1004);
			fileService.insertFileVO(fileVO);
			Integer imagePn = fileVO.getImagePn();

			Product product = new Product(null, userPn, imagePn, null);
			sellerService.insertProduct(product);
		}
		int count = sellerService.selectSellerProductCount(userPn);
		assertThat(count, is(2));

		fileService.insertFileVO(fileVO1);

		Integer imagePn = fileVO1.getImagePn();
		Product product = new Product(null, userPn, imagePn, null);

		sellerService.insertProduct(product);
		count = sellerService.selectSellerProductCount(userPn);
		assertThat(count, is(3));

		sellerService.deleteSellerProduct(product);
		count = sellerService.selectSellerProductCount(userPn);
		assertThat(count, is(3));
	}
}
