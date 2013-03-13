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

/**
 * @author 박광열
 * 
 */
@Service
public class AdminServiceImpl extends SqlSessionDaoSupport implements
		AdminService {

	@Autowired
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	@Override
	public void insertCreateSeller(JtownUser jtownUser) {
		Integer sellerPn = customJdbcUserDetailManager
				.createUserSellerAndAuthority(jtownUser);

		// insert user_interest
		String[] interestSection = jtownUser.getInterestSectionList().trim()
				.split(",");

		Interest interestParam;

		for (String interest : interestSection) {
			Integer pn = getSqlSession().selectOne(
					"AdminMapper.interestSectionPn", interest);

			if (pn != null) {
				interestParam = new Interest(sellerPn,
						Integer.parseInt(jtownUser.getInterestCategory()), pn,
						null);

			} else {
				interestParam = new Interest(sellerPn,
						Integer.parseInt(jtownUser.getInterestCategory()),
						null, interest);
				getSqlSession().insert("AdminMapper.insertInterestSection",
						interestParam);
			}

			getSqlSession().insert("AdminMapper.insertUserInterest",
					interestParam);
		}
	}

	@Override
	public void updateShopUrl(JtownUser jtownUser) {
		getSqlSession().update("AdminMapper.updateShopUrl", jtownUser);
	}

	@Override
	public void updateInterest(Interest interest) {
		getSqlSession().delete("AdminMapper.deleteInterestSellerInterest",
				interest);

		String[] interestListStr = interest.getInterestSectionNameList().trim()
				.split(",");

		Interest interestParam;

		for (String interestTemp : interestListStr) {
			Integer pn = getSqlSession().selectOne(
					"AdminMapper.interestSectionPn", interestTemp);

			if (pn != null) {
				interestParam = new Interest(interest.getSellerPn(),
						interest.getCategoryPn(), pn, null);

			} else {
				interestParam = new Interest(interest.getSellerPn(),
						interest.getCategoryPn(), null, interestTemp);
				getSqlSession().insert("AdminMapper.insertInterestSection",
						interestParam);
			}

			getSqlSession().insert("AdminMapper.insertUserInterest",
					interestParam);
		}
	}

	@Override
	public void updateEnable(JtownUser jtownUser) {
		getSqlSession().update("AdminMapper.updateEnable", jtownUser);
	}

	@Override
	public List<Interest> selectInterestCategoryList() {
		return getSqlSession()
				.selectList("AdminMapper.getInterestCategoryList");
	}

	@Override
	public Map<String, Object> selectSellerModelMap(UserSearch search) {
		Map<String, Object> modelMap = new HashMap<String, Object>();

		List<JtownUser> sellerList = getSqlSession().selectList(
				"AdminMapper.getSellerList", search);

		modelMap.put("sellerList", sellerList);

		List<Interest> interestList = getSqlSession().selectList(
				"AdminMapper.getInterestNameList", search);

		Map<Integer, Interest> interestMap = new HashMap<Integer, Interest>();

		for (Interest interest : interestList) {
			interestMap.put(interest.getSellerPn(), interest);
		}

		modelMap.put("interestMap", interestMap);

		return modelMap;
	}

	@Override
	public Map<String, Object> selectCustomerModelMap(UserSearch search) {
		Map<String, Object> modelMap = new HashMap<String, Object>();

		List<JtownUser> customerList = getSqlSession().selectList(
				"AdminMapper.getCustomerList", search);

		modelMap.put("customerList", customerList);

		List<Interest> customInterestList = getSqlSession().selectList(
				"AdminMapper.getCustomerInterestList", search);

		Map<Integer, Interest> interestMap = new HashMap<Integer, Interest>();

		for (Interest interest : customInterestList) {
			interestMap.put(interest.getCustomerPn(), interest);
		}

		modelMap.put("interestMap", interestMap);

		return modelMap;
	}
}
