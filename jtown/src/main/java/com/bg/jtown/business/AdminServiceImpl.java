package com.bg.jtown.business;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.search.UserSearch;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;

@Service
public class AdminServiceImpl extends SqlSessionDaoSupport implements
		AdminService {
	
	@Autowired
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	
	@Override
	public List<Interest> selectInterestCategoryList() {
		return getSqlSession().selectList("AdminMapper.getInterestCategoryList");
	}
	
	@Override
	public void insertCreateSeller(JtownUser jtownUser) {
		Integer sellerPn = customJdbcUserDetailManager.createUserSellerAndAuthority(jtownUser);
		
		// insert user_interest
		String [] interestSection = jtownUser.getInterestSectionList().trim().split(",");
		
		Interest interestParam;
		
		for( String interest : interestSection){
			Integer pn = getSqlSession().selectOne("AdminMapper.interestSectionPn", interest);
			
			if(pn != null){
				interestParam = new Interest(sellerPn, Integer.parseInt(jtownUser.getInterestCategory()), pn, null);			
				
			} else {							
				interestParam = new Interest(sellerPn, Integer.parseInt(jtownUser.getInterestCategory()), null, interest);
				getSqlSession().insert("AdminMapper.insertInterestSection", interestParam);
			}
			
			getSqlSession().insert("AdminMapper.insertUserInterest", interestParam);
		}		
	}
	
	@Override
	public Map<String, Object> getSellerModelMap(UserSearch search) {
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		List<JtownUser> sellerList = getSqlSession().selectList("AdminMapper.getSellerList", search);
		
		modelMap.put("sellerList", sellerList);
		
		List<Interest> interestList = getSqlSession().selectList("AdminMapper.getInterestNameList", search);
		
		Map<Integer, Interest> interestMap = new HashMap<Integer, Interest>();
		
		for( Interest interest : interestList){
			interestMap.put(interest.getSellerPn(), interest);
		}
		
		modelMap.put("interestMap", interestMap);
		
		return modelMap;
	}

	@Override
	public void updateShopUrl(JtownUser jtownUser) {
		getSqlSession().update("AdminMapper.updateShopUrl", jtownUser);		
	}
}