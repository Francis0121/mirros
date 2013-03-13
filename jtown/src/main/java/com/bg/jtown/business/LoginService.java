package com.bg.jtown.business;

import java.util.Map;

import com.bg.jtown.security.JtownUser;

/**
 * @author 박광열
 * 
 */
public interface LoginService {

	void insertCreatUserCustomer(JtownUser jtownUser);

	Integer insertCreateUserSeller(JtownUser jtownUser);

	void addUserToGroup(Map<String, Integer> groupMap);

	void updateChangePassword(JtownUser jtownUser);

	int findGroupdId(String group);

	boolean selectCheckExistEmail(String id);
}
