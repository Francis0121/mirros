package com.bg.jtown.business;

import java.util.List;
import java.util.Map;

import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.FileVO;

/**
 * @author Francis
 * 
 */
public interface SellerService {

	Map<String, Object> selectAllInformation(Integer properNumber);

	// ~ Seller Information

	JtownUser selectSellerInformation(Integer properNumber);

	// ~ SellerImage

	String selectSellerImage(Integer properNumber);

	void insertSellerImage(FileVO fileVO);

	void updateSellerImage(FileVO fileVO);

	// ~ SellerNotice

	void updateSellerNotice(JtownUser jtownUser);

	// ~ SellerEvent

	Map<String, Event> selectSellerEvent(Integer properNumber);

	void insertSellerEvent(Event event);

	void updateSellerEvent(Event event);

	// ~ SellerInterest

	List<String> selectSellerInterest(Integer properNumber);

	// ~ SellerProduct

	List<Product> selectSellerProduct(Integer properNumber);

	Integer selectSellerProductCount(Integer properNumber);

	void deleteSellerProduct(Product product);

	void insertSellerProduct(Product product);

}
