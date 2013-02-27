package com.bg.jtown.business;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.search.UserSearch;
import com.bg.jtown.security.JtownUser;

public interface AdminService {

	List<Interest> selectInterestCategoryList();

	void insertCreateSeller(JtownUser jtownUser);

	Map<String, Object> selectSellerModelMap(UserSearch search);

	void updateShopUrl(JtownUser jtownUser);

	void updateInterest(Interest interest);

	void updateEnable(JtownUser jtownUser);

	Map<String, Object> selectCustomerModelMap(UserSearch search);
}
