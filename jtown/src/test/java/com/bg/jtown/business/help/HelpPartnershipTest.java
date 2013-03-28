package com.bg.jtown.business.help;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

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

	@Test
	public void 제휴문의_입력() throws Exception {

	}

}
