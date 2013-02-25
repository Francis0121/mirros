package com.bg.jtown.business;

import java.util.Map;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.security.JtownUser;

@Service
public class LoginServiceImpl extends SqlSessionDaoSupport implements LoginService {

	@Override
	public boolean checkExistEmail(String id) {
		if(id != null){
			if((Integer)getSqlSession().selectOne("LoginMapper.checkExistEmail", id) > 0){
				return true;
			} else {
				return false;
			}
		}
		
		return false;
	}
	
	@Override
	public void creatUserCustomer(JtownUser jtownUser) {
		getSqlSession().insert("LoginMapper.insertUsers", jtownUser);
		
		getSqlSession().insert("LoginMapper.insertUserCustomer", jtownUser);
		
	}
	
	@Override
	public Integer createUserSeller(JtownUser jtownUser) {
		getSqlSession().insert("LoginMapper.insertUsers", jtownUser);

		getSqlSession().insert("LoginMapper.insertUserSeller", jtownUser);
		
		return jtownUser.getPn();
	}
	
	@Override
	public int findGroupdId(String group) {
		return getSqlSession().selectOne("LoginMapper.findGroupId", group);
	}
	
	@Override
	public void addUserToGroup(Map<String, Integer> groupMap) {
		getSqlSession().insert("LoginMapper.addUserToGroup", groupMap);		
	}
}
