package com.bg.jtown.business.admin;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.search.AdminCommentFilter;
import com.bg.jtown.business.search.UserFilter;
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

	Map<String, Object> selectSellerModelMap(UserFilter userFilter);

	Map<String, Object> selectCustomerModelMap(UserFilter userFilter);

	List<Comment> selectAllCommentList(AdminCommentFilter adminCommentFilter);
}
