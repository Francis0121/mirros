package com.bg.jtown.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;

@Service
public class AdminServiceImpl extends SqlSessionDaoSupport implements
		AdminService {
	
	@Autowired
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	
	@Override
	public List<Interest> getInterestCategoryList() {
		return getSqlSession().selectList("AdminMapper.getInterestCategoryList");
	}
	
	@Override
	public void createSeller(JtownUser jtownUser) {
		Integer sellerPn = customJdbcUserDetailManager.createUserSellerAndAuthority(jtownUser);
		
		// insert user_interest
		String [] interestSection = jtownUser.getInterestSectionList().trim().split(",");
		
		Interest interestParam = new Interest();
		
		for( String interest : interestSection){
			Integer pn = getSqlSession().selectOne("AdminMapper.interestSectionPn", interest);
			
			if(pn != null){
				interestParam.setCategoryPn(Integer.parseInt(jtownUser.getInterestCategory()));
				interestParam.setSectionPn(pn);				
			} else {							
				interestParam = new Interest(sellerPn, Integer.parseInt(jtownUser.getInterestCategory()), null, interest);
				getSqlSession().insert("AdminMapper.insertInterestSection", interestParam);
			}
			
			getSqlSession().insert("AdminMapper.insertUserInterest", interestParam);
		}		
	}

}
