package com.bg.jtown.util;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

/**
 * @author Francis
 * 
 */
public class MultipartFile {
	
	private CommonsMultipartFile filedata;

	public CommonsMultipartFile getFiledata() {
		return filedata;
	}

	public void setFiledata(CommonsMultipartFile filedata) {
		this.filedata = filedata;
	}

	@Override
	public String toString() {
		return "MultipartFile [filedata=" + filedata + "]";
	}

}
