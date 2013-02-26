package com.bg.jtown.business;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.FileVO;

/**
 * @author Francis
 * 
 */
@Service
public class FileServiceImpl extends SqlSessionDaoSupport implements
		FileService {

	@Override
	public void insertFileVO(FileVO fileVO) {
		JtownUser jtownUser = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		
		fileVO.setOwnerPn(jtownUser.getPn());

		getSqlSession().insert("fileMapper.insertFileVO", fileVO);
	}
}
