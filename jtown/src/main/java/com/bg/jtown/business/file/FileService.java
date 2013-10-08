package com.bg.jtown.business.file;

import java.util.List;

import com.bg.jtown.business.search.FileFilter;
import com.bg.jtown.util.FileVO;

/**
 * @author Francis
 * 
 */
public interface FileService {

	List<FileVO> selectFiles(FileFilter fileFilter);

	FileVO selectFile(Integer pn);

	void deleteFile(Integer pn);

	void insertFile(FileVO fileVO);
}
