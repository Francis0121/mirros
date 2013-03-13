package com.bg.jtown.security;

import java.util.Map;

import com.bg.jtown.security.JtownUser;

/**
 * @author 박광열, Francis
 * 
 */
public interface LoginService {

	void insertCreatUserCustomer(JtownUser jtownUser);

	Integer insertCreateUserSeller(JtownUser jtownUser);

	void addUserToGroup(Map<String, Integer> groupMap);

	void updateChangePassword(JtownUser jtownUser);

	int findGroupdId(String group);

	boolean selectCheckExistEmail(String id);

	JtownUser selectCustomer(Integer pn);

	void updateUserCustomer(JtownUser jtownUser);

	// ~ Use Only Test Case

	void deleteUserAll();

	Integer selectUsersCount();

}
