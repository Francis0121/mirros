package com.bg.jtown.business;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.search.UserSearch;
import com.bg.jtown.security.JtownUser;

/**
 * @author 박광열
 * 
 */
public interface AdminService {

	void insertCreateSeller(JtownUser jtownUser);

	void updateShopUrl(JtownUser jtownUser);

	void updateInterest(Interest interest);

	void updateEnable(JtownUser jtownUser);

	List<Interest> selectInterestCategoryList();

	Map<String, Object> selectSellerModelMap(UserSearch search);

	Map<String, Object> selectCustomerModelMap(UserSearch search);
}
