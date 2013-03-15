package com.bg.jtown.business;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

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
		getSqlSession().insert("fileMapper.insertFileVO", fileVO);
	}
}
