package com.bg.jtown.business.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Interest;
import com.bg.jtown.business.search.UserFilter;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.Pagination;

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
		customJdbcUserDetailManager.createUserSellerAndAuthority(jtownUser);
		Integer sellerPn = jtownUser.getPn();
		// insert user_interest
		String[] interestSection = jtownUser.getInterestSectionList().trim()
				.split(",");

		Interest interestParam;

		for (String interest : interestSection) {
			Integer pn = getSqlSession().selectOne(
					"adminMapper.interestSectionPn", interest);
			if (pn != null) {
				interestParam = new Interest(sellerPn,
						Integer.parseInt(jtownUser.getInterestCategory()), pn,
						null);
			} else {
				interestParam = new Interest(sellerPn,
						Integer.parseInt(jtownUser.getInterestCategory()),
						null, interest);
				getSqlSession().insert("adminMapper.insertInterestSection",
						interestParam);
			}

			getSqlSession().insert("adminMapper.insertUserInterest",
					interestParam);
		}
	}

	@Override
	public void updateShopUrl(JtownUser jtownUser) {
		getSqlSession().update("adminMapper.updateShopUrl", jtownUser);
	}

	@Override
	public void updateInterest(Interest interest) {
		getSqlSession().delete("adminMapper.deleteInterestSellerInterest",
				interest);

		String[] interestListStr = interest.getInterestSectionNameList().trim()
				.split(",");

		Interest interestParam;

		for (String interestTemp : interestListStr) {
			Integer pn = getSqlSession().selectOne(
					"adminMapper.interestSectionPn", interestTemp);

			if (pn != null) {
				interestParam = new Interest(interest.getSellerPn(),
						interest.getCategoryPn(), pn, null);

			} else {
				interestParam = new Interest(interest.getSellerPn(),
						interest.getCategoryPn(), null, interestTemp);
				getSqlSession().insert("adminMapper.insertInterestSection",
						interestParam);
			}

			getSqlSession().insert("adminMapper.insertUserInterest",
					interestParam);
		}
	}

	@Override
	public void updateEnable(JtownUser jtownUser) {
		getSqlSession().update("adminMapper.updateEnable", jtownUser);
	}

	@Override
	public List<Interest> selectInterestCategoryList() {
		return getSqlSession()
				.selectList("adminMapper.getInterestCategoryList");
	}

	@Override
	public Map<String, Object> selectSellerModelMap(UserFilter userFilter) {
		Map<String, Object> modelMap = new HashMap<String, Object>();

		List<JtownUser> sellerList = selectSellerList(userFilter);
		modelMap.put("sellerList", sellerList);

		List<Integer> pnList = new ArrayList<Integer>();
		for (JtownUser ju : sellerList) {
			pnList.add(ju.getPn());
		}

		List<Interest> interestList = selectSellerInterestList(pnList);
		Map<Integer, Interest> interestMap = new HashMap<Integer, Interest>();
		for (Interest interest : interestList) {
			interestMap.put(interest.getSellerPn(), interest);
		}
		modelMap.put("interestMap", interestMap);

		return modelMap;
	}

	public Integer selectSellerCount(UserFilter userFilter) {
		return getSqlSession().selectOne("adminMapper.selectSellerCount",
				userFilter);
	}

	public List<JtownUser> selectSellerList(UserFilter userFilter) {
		Pagination pagination = userFilter.getPagination();
		int count = selectSellerCount(userFilter);
		if (count == 0) {
			return new ArrayList<JtownUser>();
		}
		pagination.setNumItems(count);

		return getSqlSession().selectList("adminMapper.selectSellerList",
				userFilter);
	}

	public List<Interest> selectSellerInterestList(List<Integer> pnList) {
		if (pnList.size() == 0) {
			return new ArrayList<Interest>();
		}
		return getSqlSession().selectList(
				"adminMapper.selectSellerInterestList", pnList);
	}

	@Override
	public Map<String, Object> selectCustomerModelMap(UserFilter userFilter) {
		Map<String, Object> modelMap = new HashMap<String, Object>();

		List<JtownUser> customerList = selectCustomerList(userFilter);
		modelMap.put("customerList", customerList);

		List<Integer> pnList = new ArrayList<Integer>();
		for (JtownUser ju : customerList) {
			pnList.add(ju.getPn());
		}

		List<Interest> customInterestList = selectCustomerInterestList(pnList);
		Map<Integer, Interest> interestMap = new HashMap<Integer, Interest>();
		for (Interest interest : customInterestList) {
			interestMap.put(interest.getCustomerPn(), interest);
		}
		modelMap.put("interestMap", interestMap);

		return modelMap;
	}

	public Integer selectCustomerCount(UserFilter userFilter) {
		return getSqlSession().selectOne("adminMapper.selectCustomerCount",
				userFilter);
	}

	public List<JtownUser> selectCustomerList(UserFilter userFilter) {
		Pagination pagination = userFilter.getPagination();
		int count = selectCustomerCount(userFilter);
		if (count == 0) {
			return new ArrayList<JtownUser>();
		}
		pagination.setNumItems(count);

		return getSqlSession().selectList("adminMapper.selectCustomerList",
				userFilter);
	}

	public List<Interest> selectCustomerInterestList(List<Integer> pnList) {
		if (pnList.size() == 0) {
			return new ArrayList<Interest>();
		}
		return getSqlSession().selectList(
				"adminMapper.selectCustomerInterestList", pnList);
	}
}
