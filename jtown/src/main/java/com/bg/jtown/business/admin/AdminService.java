package com.bg.jtown.business.admin;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.ProductCategory;
import com.bg.jtown.business.search.AdminCommentFilter;
import com.bg.jtown.business.search.AdministratorFilter;
import com.bg.jtown.business.search.UserFilter;
import com.bg.jtown.security.JtownUser;

/**
 * @author Francis
 *
 */
public interface AdminService {
	
	// ~ Common

	List<Interest> selectInterestCategoryList();

	List<Interest> selectInterestSection(Interest interest);

	void updateEnabled(JtownUser jtownUser);
	 
	void deleteSellerInterest(Interest interest);

	// ~ Admin
	
	Map<String, Object> selectAdminModelMap(AdministratorFilter administratorFilter);

	List<JtownUser> selectAdminList(AdministratorFilter administratorFilter);

	void insertAdmin(JtownUser jtownUser);

	void updateAdminPassword(JtownUser jtownUser);
	
	void updateSellerPassword(JtownUser jtownUser);
	
	void insertEventBanner(Event event);
	
	void deleteEventBanner(Event event);
	
	void updateEventBanner(Event event);
	
	// ~ Seller 

	List<Interest> selectSellerInterestList(List<Integer> pnList);

	JtownUser selectSeller(String name);
	
	List<Count> selectSellerLovers(Integer sellerPn);

	void insertSeller(JtownUser jtownUser);

	void updateSeller(JtownUser jtownUser);

	void updateInterest(Interest interest);

	void insertSellerInterest(Interest interest);
	
	// ~ Customer
	
	Map<String, Object> selectCustomerModelMap(UserFilter userFilter);

	List<Comment> selectAllCommentList(AdminCommentFilter adminCommentFilter);

	//~ ProductCategory
	
		List<ProductCategory> selectSectionsList();
		
		List<ProductCategory> selectDivisionsList(ProductCategory productCategory);
		
		List<ProductCategory> selectGroupsList(ProductCategory productCategory);
	
		void insertSectionsItem(ProductCategory productCategory);
		
		void insertDivisionsItem(ProductCategory productCategory);
		
		void insertGroupsItem(ProductCategory productCategory);
		
		void updateSectionsItem(ProductCategory productCategory);
		
		void updateDivisionsItem(ProductCategory productCategory);
		
		void updateGroupsItem(ProductCategory productCategory);
		
}
