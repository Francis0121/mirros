package com.bg.jtown.security;

import java.util.Map;

import com.bg.jtown.security.JtownUser;

/**
 * @author 박광열, Francis
 * 
 */
public interface LoginService {

	void insertCreatUserCustomer(JtownUser jtownUser);

	void insertCreateUserSeller(JtownUser jtownUser);

	void insertCreatUserAdmin(JtownUser jtownUser);

	void addUserToGroup(Map<String, Integer> groupMap);

	void updateChangePassword(JtownUser jtownUser);

	int findGroupId(String group);

	boolean selectCheckExistEmail(String id);

	JtownUser selectCustomer(Integer pn);

	String selectUsername(Integer pn);

	void updateUserCustomer(JtownUser jtownUser);

	void updateUserCustomerEmail(String changeUserName, String nowUserName);

	Map<String, Object> selectDeleteUser(Integer pn);

	void insertDeleteUser(Integer pn);

	void deleteDeleteUser(Integer pn);

	// ~ Use Only Test Case

	void deleteUserAll();

	Integer selectUsersCount();

	// ~ Confirm Email Address

	Confirm selectEmailConfirm(Confirm confirm);

	void confirmingEmailAddress(JtownUser jtownUser);

	void insertEmailConfirm(Confirm confirm);

	void deleteEmailConfirm(Confirm confirm);

	// Social

	String selectSocialProviderUserId(Integer properNumber, String providerId);

	void updateFacebookFeed(JtownUser jtownUser);

	void updateUsername(String changeUsername, String nowUsername);

}
