package com.bg.jtown.business.seller;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Event;
import com.bg.jtown.business.Product;
import com.bg.jtown.security.JtownUser;

/**
 * @author Francis
 * 
 */
public interface SellerService {

	Map<String, Object> selectAllInformation(Integer properNumber);

	Map<String, Object> selectAllInformation(Integer properNumber,
			Integer customerPn);

	// ~ Seller Information

	JtownUser selectSellerInformation(Integer properNumber);

	JtownUser selectSellerInformation(Integer properNumber, Integer customerPn);

	Map<String, Object> selectInterval7DayCount(Integer properNumber);

	// ~ SellerImage

	List<String> selectSellerImage(Integer properNumber);

	String selectSellerImageOne(Integer properNumber, Integer imagePn);

	Integer selectSellerImageCount(Integer properNumber);

	// ~ SellerEvent

	Map<String, Event> selectSellerEvent(Integer userPn);

	List<Event> selectEventList(Integer userPn);

	Event selectEventOne(Integer eventPn);

	Integer selectEventCount(Integer userPn);

	// ~ SellerInterest

	List<String> selectSellerInterest(Integer properNumber);

	// ~ SellerProduct

	List<Product> selectSellerProduct(Integer userPn);

	Integer selectSellerProductCount(Integer userPn);

	Product selectSellerProductOne(Integer productPn);

	// ~ LoveCount

	Integer selectLoveCount(Integer properNumber);

}
