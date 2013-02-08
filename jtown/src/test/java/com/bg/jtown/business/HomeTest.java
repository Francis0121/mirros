package com.bg.jtown.business;

import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../../../../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class HomeTest {

	@Test
	public void test() {
		fail("Not yet implemented");
	}

}
