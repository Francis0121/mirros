package com.bg.jtown.business.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.search.AdminCommentFilter;
import com.bg.jtown.business.search.AdministratorFilter;
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

		String interestSectionList = jtownUser.getInterestSectionList().trim();
		jtownUser.setInterestSectionList(interestSectionList);
		String[] interestSection = interestSectionList.split(",");

		Interest interestParam;

		for (String i : interestSection) {
			if (i == null || i.equals("")) {
				continue;
			}
			i = i.trim();
			Integer pn = getSqlSession().selectOne(
					"adminMapper.interestSectionPn", i);
			if (pn != null) {
				interestParam = new Interest(sellerPn,
						Integer.parseInt(jtownUser.getInterestCategory()), pn,
						null);
			} else {
				interestParam = new Interest(sellerPn,
						Integer.parseInt(jtownUser.getInterestCategory()),
						null, i);
				getSqlSession().insert("adminMapper.insertInterestSection",
						interestParam);
			}

			getSqlSession().insert("adminMapper.insertUserInterest",
					interestParam);
		}
	}

	@Override
	public void updateInterest(Interest interest) {
		getSqlSession().delete("adminMapper.deleteInterestSellerInterest",
				interest);

		String interestSectionList = interest.getInterestSectionNameList()
				.trim();
		interest.setInterestSectionNameList(interestSectionList);
		String[] interestSection = interestSectionList.split(",");

		Interest interestParam;

		for (String i : interestSection) {
			if (i == null || i.equals("")) {
				continue;
			}
			i = i.trim();

			Integer pn = getSqlSession().selectOne(
					"adminMapper.interestSectionPn", i);

			if (pn != null) {
				interestParam = new Interest(interest.getSellerPn(),
						interest.getCategoryPn(), pn, null);

			} else {
				interestParam = new Interest(interest.getSellerPn(),
						interest.getCategoryPn(), null, i);
				getSqlSession().insert("adminMapper.insertInterestSection",
						interestParam);
			}

			getSqlSession().insert("adminMapper.insertUserInterest",
					interestParam);
		}
	}

	@Override
	public void updateSeller(JtownUser jtownUser) {
		getSqlSession().update("adminMapper.updateSeller", jtownUser);
	}

	@Override
	public void updateEnabled(JtownUser jtownUser) {
		getSqlSession().update("adminMapper.updateEnabled", jtownUser);
	}

	// ~ Aministrator

	@Override
	public Map<String, Object> selectAdminModelMap(
			AdministratorFilter administartorFilter) {
		Map<String, Object> modelMap = new HashMap<String, Object>();

		List<JtownUser> adminList = selectAdminList(administartorFilter);
		modelMap.put("adminList", adminList);

		return modelMap;
	};

	@Override
	public List<JtownUser> selectAdminList(
			AdministratorFilter administartorFilter) {
		Pagination pagination = administartorFilter.getPagination();
		int count = selectAdminCount(administartorFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<JtownUser>();
		}

		return getSqlSession().selectList(
				"adminMapper.selectAdministratorList", administartorFilter);
	}

	private Integer selectAdminCount(AdministratorFilter administartorFilter) {
		return getSqlSession().selectOne("adminMapper.selectAdminCount",
				administartorFilter);
	}

	@Override
	public List<Interest> selectInterestCategoryList() {
		return getSqlSession()
				.selectList("adminMapper.getInterestCategoryList");
	}

	@Override
	public List<Interest> selectSellerInterestList(List<Integer> pnList) {
		if (pnList.size() == 0) {
			return new ArrayList<Interest>();
		}
		return getSqlSession().selectList(
				"adminMapper.selectSellerInterestList", pnList);
	}

	// ~ Customer

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

	// ~ Comment

	@Override
	public List<Comment> selectAllCommentList(
			AdminCommentFilter adminCommentFilter) {
		Pagination pagination = adminCommentFilter.getPagination();
		int count = selectAllCommentCount(adminCommentFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<Comment>();
		}
		return getSqlSession().selectList("adminMapper.selectAllCommentList",
				adminCommentFilter);
	}

	private Integer selectAllCommentCount(AdminCommentFilter adminCommentFilter) {
		return getSqlSession().selectOne("adminMapper.selectAllCommentCount",
				adminCommentFilter);
	}

	@Override
	public List<Interest> selectInterestSection(Interest interest) {
		String[] names = interest.getName().split(",");
		String name = names[names.length - 1].trim();
		interest.setName('%' + name + '%');
		return getSqlSession().selectList("adminMapper.selectInterestSection",
				interest);
	}
}
