package com.bg.jtown.business;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

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

}
