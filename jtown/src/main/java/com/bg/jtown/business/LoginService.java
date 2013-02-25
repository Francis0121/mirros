package com.bg.jtown.business;

import java.util.Map;

import com.bg.jtown.security.JtownUser;

public interface LoginService {
	boolean checkExistEmail(String id);

	void creatUserCustomer(JtownUser jtownUser);

	int findGroupdId(String group);

	void addUserToGroup(Map<String, Integer> groupMap);

	Integer createUserSeller(JtownUser jtownUser);
}
