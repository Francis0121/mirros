package com.bg.jtown.business;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

@Service
public class HomeServiceImpl extends SqlSessionDaoSupport implements HomeService{

	public Home selectHomeTest() {
		return getSqlSession().selectOne("HomeMapper.getHomeTest");
	}
	
	public void selectTest(){
		
	};

}
