package com.bg.jtown.business;

import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

@Service
public class HomeServiceImpl extends SqlSessionDaoSupport implements HomeService{

	public Home selectHomeTest() {
	
		getSqlSession().insert("HomeMapper.insertHomeTest", new Home("가나다2"));

		getSqlSession()
				.insert("HomeMapper.insertHomeTest",
						new Home(
								"ABACACACACABACACACACABACACACACABACACACACABACACACACABACACACACABACACACACABACACACACABACACACACABACACACACABACACACACABACACACACABACACACACABACACACAC"));
		return getSqlSession().selectOne("HomeMapper.getHomeTest");
	}
	
	public void selectTest(){
		
	};

}
