package com.bg.jtown.business;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.security.JtownUser;

/**
 * @author Francis
 * 
 */
@Service
public class SellerServiceImpl extends SqlSessionDaoSupport implements
		SellerService {

	@Override
	public JtownUser selectSellerInformation(Integer properNumber) {
		JtownUser jtownUser = getSqlSession().selectOne(
				"sellerMapper.selectSellerInformation", properNumber);
		return jtownUser;
	}
}
