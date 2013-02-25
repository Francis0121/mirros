package com.bg.jtown.business;

import java.util.List;

import com.bg.jtown.security.JtownUser;

public interface AdminService {

	List<Interest> getInterestCategoryList();

	void createSeller(JtownUser jtownUser);

}
