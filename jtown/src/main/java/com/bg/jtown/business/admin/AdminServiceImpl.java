package com.bg.jtown.business.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.ProductCategory;
import com.bg.jtown.business.search.AdminCommentFilter;
import com.bg.jtown.business.search.AdministratorFilter;
import com.bg.jtown.business.search.UserFilter;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class AdminServiceImpl extends SqlSessionDaoSupport implements AdminService {

	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	// ~ Common

	private Integer selectInterestSectionFromName(Interest interest) {
		return getSqlSession().selectOne("adminMapper.selectInterestSectionFromName", interest);
	}

	private void insertInterestSection(Interest interest) {
		getSqlSession().insert("adminMapper.insertInterestSection", interest);
	}

	@Override
	public void insertSellerInterest(Interest interest) {
		getSqlSession().insert("adminMapper.insertSellerInterest", interest);
	}

	@Override
	public void deleteSellerInterest(Interest interest) {
		getSqlSession().delete("adminMapper.deleteSellerInterest", interest);
	}

	@Override
	public void updateEnabled(JtownUser jtownUser) {
		getSqlSession().update("adminMapper.updateEnabled", jtownUser);
	}

	@Override
	public List<Interest> selectInterestCategoryList() {
		return getSqlSession().selectList("adminMapper.selectInterestCategoryList");
	}

	@Override
	public List<Interest> selectInterestSection(Interest interest) {
		String[] names = interest.getName().split(",");
		String name = names[names.length - 1].trim();
		interest.setName('%' + name + '%');
		return getSqlSession().selectList("adminMapper.selectInterestSection", interest);
	}

	// ~ Admin

	@Override
	public Map<String, Object> selectAdminModelMap(AdministratorFilter administartorFilter) {
		Map<String, Object> modelMap = new HashMap<String, Object>();

		List<JtownUser> adminList = selectAdminList(administartorFilter);
		modelMap.put("adminList", adminList);

		return modelMap;
	};

	@Override
	public List<JtownUser> selectAdminList(AdministratorFilter administartorFilter) {
		Pagination pagination = administartorFilter.getPagination();
		int count = selectAdminCount(administartorFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<JtownUser>();
		}

		return getSqlSession().selectList("adminMapper.selectAdministratorList", administartorFilter);
	}

	private Integer selectAdminCount(AdministratorFilter administartorFilter) {
		return getSqlSession().selectOne("adminMapper.selectAdminCount", administartorFilter);
	}

	@Override
	public void insertAdmin(JtownUser jtownUser) {
		customJdbcUserDetailManager.createUserAdminAndAuthority(jtownUser);
	}

	@Override
	public void updateAdminPassword(JtownUser jtownUser) {
		jtownUser.setNewPassword("1q2w3e4r!");
		customJdbcUserDetailManager.changePassword(jtownUser);
	}

	@Override
	public void updateSellerPassword(JtownUser jtownUser) {
		jtownUser.setNewPassword(jtownUser.getUsername());
		customJdbcUserDetailManager.changePassword(jtownUser);
	}

	@Override
	public void insertEventBanner(Event event) {
		getSqlSession().insert("adminMapper.insertEventBanner", event);
	}

	@Override
	public void deleteEventBanner(Event event) {
		getSqlSession().update("adminMapper.deleteEventBanner", event);
	}

	@Override
	public void updateEventBanner(Event event) {
		getSqlSession().update("adminMapper.updateEventBanner", event);
	}

	// ~ Seller

	private void insertSellerInterestList(String interestSectionStr, Integer categoryPn, Integer sellerPn) {
		String[] interestSection = interestSectionStr.split(",");

		for (String name : interestSection) {
			if (name == null || name.equals("")) {
				continue;
			}
			name = name.trim();
			Interest interest = new Interest(sellerPn, categoryPn, null, name);
			Integer pn = selectInterestSectionFromName(interest);
			if (pn != null) {
				interest.setSectionPn(pn);
			} else {
				insertInterestSection(interest);
			}
			insertSellerInterest(interest);
		}
	}

	@Override
	public JtownUser selectSeller(String name) {
		return getSqlSession().selectOne("adminMapper.selectSeller", name);
	}

	@Override
	public List<Count> selectSellerLovers(Integer sellerPn) {
		return getSqlSession().selectList("adminMapper.selectSellerLovers", sellerPn);
	}

	@Override
	public void insertSeller(JtownUser jtownUser) {
		customJdbcUserDetailManager.createUserSellerAndAuthority(jtownUser);
	}

	@Override
	public void updateSeller(JtownUser jtownUser) {
		getSqlSession().update("adminMapper.updateSeller", jtownUser);
	}

	@Override
	public void updateInterest(Interest interest) {
		deleteSellerInterest(interest);
		Integer sellerPn = interest.getSellerPn();
		Integer categoryPn = interest.getCategoryPn();

		String interestSectionStr = interest.getInterestSectionList().trim();
		interest.setInterestSectionList(interestSectionStr);

		insertSellerInterestList(interestSectionStr, categoryPn, sellerPn);
	}

	@Override
	public List<Interest> selectSellerInterestList(List<Integer> pnList) {
		if (pnList.size() == 0) {
			return new ArrayList<Interest>();
		}
		return getSqlSession().selectList("adminMapper.selectSellerInterestList", pnList);
	}

	// ~ Customer

	private Integer selectCustomerCount(UserFilter userFilter) {
		return getSqlSession().selectOne("adminMapper.selectCustomerCount", userFilter);
	}

	private List<JtownUser> selectCustomerList(UserFilter userFilter) {
		Pagination pagination = userFilter.getPagination();
		int count = selectCustomerCount(userFilter);
		if (count == 0) {
			return new ArrayList<JtownUser>();
		}
		pagination.setNumItems(count);

		return getSqlSession().selectList("adminMapper.selectCustomerList", userFilter);
	}

	private List<Interest> selectCustomerInterestList(List<Integer> pnList) {
		if (pnList.size() == 0) {
			return new ArrayList<Interest>();
		}
		return getSqlSession().selectList("adminMapper.selectCustomerInterestList", pnList);
	}

	private Integer selectAllCommentCount(AdminCommentFilter adminCommentFilter) {
		return getSqlSession().selectOne("adminMapper.selectAllCommentCount", adminCommentFilter);
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

	@Override
	public List<Comment> selectAllCommentList(AdminCommentFilter adminCommentFilter) {
		Pagination pagination = adminCommentFilter.getPagination();
		int count = selectAllCommentCount(adminCommentFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<Comment>();
		}
		return getSqlSession().selectList("adminMapper.selectAllCommentList", adminCommentFilter);
	}

	// ~ ProductCategory

	@Override
	public List<ProductCategory> selectSectionsList() {
		return getSqlSession().selectList("adminMapper.selectSectionsList");
	}

	@Override
	public List<ProductCategory> selectDivisionsList(ProductCategory productCategory) {
		return getSqlSession().selectList("adminMapper.selectDivisionsList", productCategory);
	}

	@Override
	public List<ProductCategory> selectGroupsList(ProductCategory productCategory) {
		return getSqlSession().selectList("adminMapper.selectGroupsList", productCategory);
	}

	@Override
	public void insertSectionsItem(ProductCategory productCategory) {
		getSqlSession().insert("adminMapper.insertSectionsItem", productCategory);
	}

	@Override
	public void insertDivisionsItem(ProductCategory productCategory) {
		getSqlSession().insert("adminMapper.insertDivisionsItem", productCategory);
	}

	@Override
	public void insertGroupsItem(ProductCategory productCategory) {
		getSqlSession().insert("adminMapper.insertGroupsItem", productCategory);
	}

	@Override
	public void updateSectionsItem(ProductCategory productCategory) {
		getSqlSession().update("adminMapper.updateSectionsItem", productCategory);
	}

	@Override
	public void updateDivisionsItem(ProductCategory productCategory) {
		getSqlSession().update("adminMapper.updateDivisionsItem", productCategory);
	}

	@Override
	public void updateGroupsItem(ProductCategory productCategory) {
		getSqlSession().update("adminMapper.updateGroupsItem", productCategory);
	}

	@Override
	public void insertProductCategory(ProductCategory productCategory) {
		getSqlSession().insert("adminMapper.insertProductCategory", productCategory);
	}

	@Override
	public void updateProductCategory(ProductCategory productCategory) {
		getSqlSession().update("adminMapper.updateProductCategory", productCategory);
	}

	@Override
	public ProductCategory selectProductCategory(ProductCategory productCategory) {
		return getSqlSession().selectOne("adminMapper.selectProductCategory", productCategory);
	}

	@Override
	public void insertUpdateProductCategory(ProductCategory productCategory) {
		if(selectProductCategory(productCategory) == null){
			insertProductCategory(productCategory);
		}else{
			updateProductCategory(productCategory);
		}
	}
}
