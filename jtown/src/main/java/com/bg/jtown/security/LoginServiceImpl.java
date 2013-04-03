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

	private void insertUser(JtownUser jtownUser) {
		getSqlSession().insert("loginMapper.insertUsers", jtownUser);
	}

	@Override
	public void insertCreatUserCustomer(JtownUser jtownUser) {
		insertUser(jtownUser);
		getSqlSession().insert("loginMapper.insertUserCustomer", jtownUser);
	}

	@Override
	public void insertCreateUserSeller(JtownUser jtownUser) {
		insertUser(jtownUser);
		getSqlSession().insert("loginMapper.insertUserSeller", jtownUser);
	}

	@Override
	public void insertCreatUserAdmin(JtownUser jtownUser) {
		insertUser(jtownUser);
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

	// ~ Confirm Email Address

	@Override
	public Confirm selectEmailConfirm(Confirm confirm) {
		return getSqlSession().selectOne("loginMapper.selectEmailConfirm",
				confirm);
	}

	@Override
	public void confirmingEmailAddress(JtownUser jtownUser) {
		String series = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		Confirm confirm = new Confirm(jtownUser.getUsername(), series);

		deleteEmailConfirm(confirm);
		insertEmailConfirm(confirm);
	}

	@Override
	public void insertEmailConfirm(Confirm confirm) {
		getSqlSession().insert("loginMapper.insertEmailConfirm", confirm);
	}

	@Override
	public void deleteEmailConfirm(Confirm confirm) {
		getSqlSession().delete("loginMapper.deleteEmailConfirm", confirm);
	}
}
