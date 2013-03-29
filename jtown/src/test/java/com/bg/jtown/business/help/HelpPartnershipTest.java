package com.bg.jtown.business.help;

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

import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.search.PartnershipFilter;

/**
 * <h1>제휴문의 테스트케이스</h1>
 * 
 * @author Francis
 * 
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class HelpPartnershipTest {

	private static Logger logger = LoggerFactory
			.getLogger(HelpPartnershipTest.class);

	@Resource
	private HelpService helpService;

	private Partnership partnership;
	private Partnership partnership2;

	@Before
	public void BEFORE_TEST() throws Exception {
		helpService.deletePartnership(new Partnership());
		int count = helpService.selectPartnershipCount(new PartnershipFilter());
		assertThat(0, is(count));

		partnership = new Partnership(1, "접수하겠습니다", "abcde@abcde.com", "홍길동",
				"01012345678", null, 1);
		partnership2 = new Partnership(1, "접수하겠습니다", "abcd2@abcd2.com", "홍길동",
				"01012345679", null, 1);
	}

	@Test
	public void 제휴문의_입력() throws Exception {
		helpService.insertPartnership(partnership);
		int count = helpService.selectPartnershipCount(new PartnershipFilter());
		assertThat(1, is(count));

		Partnership loadPartnership = helpService
				.selectPartnership(new Partnership(null, null, null, null,
						null, partnership.getPn(), null));
		partnershipCompareLodaPartnership(partnership, loadPartnership);
	}

	@Test
	public void 제휴문의_이메일_휴대폰_체크() throws Exception {
		helpService.insertPartnership(partnership);
		int count = helpService.selectPartnershipCount(new PartnershipFilter());
		assertThat(1, is(count));

		Partnership loadPartnership = helpService
				.selectPartnership(new Partnership(null, null, partnership
						.getEmail(), null, null, null, null));

		partnershipCompareLodaPartnership(partnership, loadPartnership);

		Partnership loadPartnership2 = helpService
				.selectPartnership(new Partnership(null, null, null, null,
						partnership.getPhoneNumber(), null, null));

		partnershipCompareLodaPartnership(partnership, loadPartnership2);

	}

	@Test
	public void 제휴문의_수정_내용() throws Exception {
		helpService.insertPartnership(partnership);
		helpService.insertPartnership(partnership2);
		int count = helpService.selectPartnershipCount(new PartnershipFilter());
		assertThat(2, is(count));

		partnership.setContent("내용변경");
		partnership.setCategoryPn(2);
		partnership.setProcess(null);

		helpService.updatePatnership(partnership);

		partnership.setProcess(1);

		Partnership loadPartnership = helpService
				.selectPartnership(new Partnership(null, null, null, null,
						null, partnership.getPn(), null));
		partnershipCompareLodaPartnership(partnership, loadPartnership);

		Partnership loadPartnership2 = helpService
				.selectPartnership(new Partnership(null, null, null, null,
						null, partnership2.getPn(), null));
		partnershipCompareLodaPartnership(partnership2, loadPartnership2);
	}

	@Test
	public void 제휴문의_수정_처리상황() throws Exception {
		helpService.insertPartnership(partnership);
		helpService.insertPartnership(partnership2);
		int count = helpService.selectPartnershipCount(new PartnershipFilter());
		assertThat(2, is(count));

		partnership.setProcess(2);

		helpService.updatePatnership(partnership);

		Partnership loadPartnership = helpService
				.selectPartnership(new Partnership(null, null, null, null,
						null, partnership.getPn(), null));
		partnershipCompareLodaPartnership(partnership, loadPartnership);

		Partnership loadPartnership2 = helpService
				.selectPartnership(new Partnership(null, null, null, null,
						null, partnership2.getPn(), null));
		partnershipCompareLodaPartnership(partnership2, loadPartnership2);
	}

	@Test
	public void 제휴문의_삭제() throws Exception {
		helpService.insertPartnership(partnership);
		helpService.insertPartnership(partnership2);
		int count = helpService.selectPartnershipCount(new PartnershipFilter());
		assertThat(2, is(count));

		helpService.deletePartnership(partnership2);

		Partnership loadPartnership = helpService
				.selectPartnership(new Partnership(null, null, null, null,
						null, partnership.getPn(), null));
		partnershipCompareLodaPartnership(partnership, loadPartnership);
	}

	@Test
	public void 제휴문의_리스트_가져오기_페이지_처리() throws Exception {
		for (int i = 0; i < 16; i++) {
			helpService.insertPartnership(partnership);
			if (i > 12) {
				partnership.setProcess(2);
				helpService.updatePatnership(partnership);
			}
		}
		int count = helpService.selectPartnershipCount(new PartnershipFilter());
		assertThat(16, is(count));

		List<Partnership> partnerships = helpService
				.selectPartnership(new PartnershipFilter(null, 1, null, null));
		assertThat(10, is(partnerships.size()));

		List<Partnership> partnerships2 = helpService
				.selectPartnership(new PartnershipFilter(null, 2, null, null));
		assertThat(3, is(partnerships2.size()));

		List<Partnership> partnerships3 = helpService
				.selectPartnership(new PartnershipFilter(1, null, null, null));
		assertThat(10, is(partnerships3.size()));

		PartnershipFilter partnershipFilter = new PartnershipFilter(1, null,
				null, null);
		partnershipFilter.setPage(2);
		List<Partnership> partnerships4 = helpService
				.selectPartnership(partnershipFilter);
		assertThat(6, is(partnerships4.size()));
	}

	private void partnershipCompareLodaPartnership(Partnership partnership,
			Partnership loadPartnership) {
		logger.debug(partnership.toString());
		logger.debug(loadPartnership.toString());

		assertThat(partnership.getProcess(), is(loadPartnership.getProcess()));
		assertThat(partnership.getContent(), is(loadPartnership.getContent()));
		assertThat(partnership.getCategoryPn(),
				is(loadPartnership.getCategoryPn()));
		assertThat(partnership.getEmail(), is(loadPartnership.getEmail()));
		assertThat(partnership.getName(), is(loadPartnership.getName()));
		assertThat(partnership.getPhoneNumber(),
				is(loadPartnership.getPhoneNumber()));
	}
}
