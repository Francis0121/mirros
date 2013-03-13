package com.bg.jtown.security;

import java.util.Map;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.security.JtownUser;

/**
 * @author 박광열
 * 
 */
@Service
public class LoginServiceImpl extends SqlSessionDaoSupport implements
		LoginService {

	@Override
	public boolean selectCheckExistEmail(String id) {
		if (id != null) {
			return (Integer) getSqlSession().selectOne(
					"loginMapper.checkExistEmail", id) > 0;
		}
		return false;
	}

	@Override
	public void insertCreatUserCustomer(JtownUser jtownUser) {
		getSqlSession().insert("loginMapper.insertUsers", jtownUser);

		getSqlSession().insert("loginMapper.insertUserCustomer", jtownUser);
	}

	@Override
	public Integer insertCreateUserSeller(JtownUser jtownUser) {
		getSqlSession().insert("loginMapper.insertUsers", jtownUser);

		getSqlSession().insert("loginMapper.insertUserSeller", jtownUser);

		return jtownUser.getPn();
	}

	@Override
	public int findGroupdId(String group) {
		return getSqlSession().selectOne("loginMapper.findGroupId", group);
	}

	@Override
	public void addUserToGroup(Map<String, Integer> groupMap) {
		getSqlSession().insert("loginMapper.addUserToGroup", groupMap);
	}

	@Override
	public void updateChangePassword(JtownUser jtownUser) {
		getSqlSession().update("loginMapper.changePassword", jtownUser);
	}

	@Override
	public JtownUser selectCustomer(Integer pn) {
		return getSqlSession().selectOne("loginMapper.selectCustomer", pn);
	}

	@Override
	public void updateUserCustomer(JtownUser jtownUser) {
		getSqlSession().update("loginMapper.updateUserCustomer", jtownUser);
	}

	// ~ Use Only Test Case

	@Override
	public void deleteUserAll() {
		getSqlSession().delete("loginMapper.deleteUserAll");
	}

	@Override
	public Integer selectUsersCount() {
		return getSqlSession().selectOne("loginMapper.selectUsersCount");
	}
}
