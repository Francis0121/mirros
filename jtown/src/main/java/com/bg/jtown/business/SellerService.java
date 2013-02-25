package com.bg.jtown.business;

import java.util.Map;

import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.FileVO;

/**
 * @author Francis
 * 
 */
public interface SellerService {

	Map<String, Object> selectAllInformation(Integer properNumber);

	JtownUser selectSellerInformation(Integer properNumber);

	String selectSellerImage(Integer properNumber);

	void insertSellerImage(FileVO fileVO);

	void updateSellerImage(FileVO fileVO);

	void updateSellerNotice(JtownUser jtownUser);
}
