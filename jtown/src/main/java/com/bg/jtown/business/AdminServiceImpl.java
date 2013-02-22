package com.bg.jtown.business;

import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl extends SqlSessionDaoSupport implements
		AdminService {
	
	@Override
	public List<Interest> getInterestCategoryList() {
		return getSqlSession().selectList("AdminMapper.getInterestCategoryList");
	}

}
