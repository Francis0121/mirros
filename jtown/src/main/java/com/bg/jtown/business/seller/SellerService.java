package com.bg.jtown.business.seller;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Event;
import com.bg.jtown.business.Product;
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

	List<String> selectSellerImage(Integer properNumber);

	String selectSellerImageOne(Integer properNumber, Integer imagePn);

	Integer selectSellerImageCount(Integer properNumber);

	void insertSellerImage(FileVO fileVO);

	void updateSellerImage(FileVO fileVO);

	void deleteSellerImage(Integer properNumber);

	// ~ SellerNotice

	void updateSellerNotice(JtownUser jtownUser);

	// ~ SellerEvent

	Map<String, Event> selectSellerEvent(Integer userPn);

	List<Event> selectEventList(Integer userPn);

	Event selectEventOne(Integer eventPn);

	Integer selectEventCount(Integer userPn);

	void deleteEvent(Event event);

	void insertEvent(Event event);

	void updateEvent(Event event);

	void updateAndInsertEvent(Event event);

	// ~ SellerInterest

	List<String> selectSellerInterest(Integer properNumber);

	// ~ SellerProduct

	List<Product> selectSellerProduct(Integer userPn);

	Integer selectSellerProductCount(Integer userPn);

	Product selectSellerProductOne(Integer productPn);

	void deleteProduct(Product product);

	void deleteSellerProduct(Product product);

	void insertProduct(Product product2);

	void insertSellerProduct(Product product);

	// ~ SellerComment

	Integer selectCommentCount(Integer properNumber);

	// ~ LoveCount

	Integer selectLoveCount(Integer properNumber);

}