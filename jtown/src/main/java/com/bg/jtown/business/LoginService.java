package com.bg.jtown.business;

import java.util.Map;

import com.bg.jtown.security.JtownUser;

public interface LoginService {
	boolean selectCheckExistEmail(String id);

	void insertCreatUserCustomer(JtownUser jtownUser);

	int findGroupdId(String group);

	void addUserToGroup(Map<String, Integer> groupMap);

	Integer insertCreateUserSeller(JtownUser jtownUser);

	void updateChangePassword(JtownUser jtownUser);
}
