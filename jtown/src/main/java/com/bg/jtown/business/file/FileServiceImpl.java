package com.bg.jtown.business.file;

import java.util.ArrayList;
import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.search.FileFilter;
import com.bg.jtown.util.FileVO;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class FileServiceImpl extends SqlSessionDaoSupport implements
		FileService {

	private static final Integer IMAGE_NUM_ITEMS = 9;

	@Override
	public List<FileVO> selectFiles(FileFilter fileFilter) {
		Pagination pagination = fileFilter.getPagination();
		pagination.setNumItemsPerPage(IMAGE_NUM_ITEMS);
		int count = selectFileCount(fileFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<FileVO>();
		}

		return getSqlSession().selectList("fileMapper.selectFiles", fileFilter);
	}

	private int selectFileCount(FileFilter fileFilter) {
		return getSqlSession().selectOne("fileMapper.selectFileCount", fileFilter);
	}

	@Override
	public FileVO selectFile(Integer pn) {
		return getSqlSession().selectOne("fileMapper.selectFile", pn);
	}

	@Override
	public void insertFile(FileVO fileVO) {
		getSqlSession().insert("fileMapper.insertFile", fileVO);
	}

	@Override
	public void deleteFile(Integer pn) {
		getSqlSession().delete("fileMapper.deleteFile", pn);
	}
}
