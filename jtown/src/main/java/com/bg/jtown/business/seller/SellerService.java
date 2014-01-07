package com.bg.jtown.business.seller;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Event;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Product;
import com.bg.jtown.business.Statistic;
import com.bg.jtown.business.search.ProductFilter;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.FileVO;

/**
 * @author Francis
 * @author In Sanghak
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

	List<FileVO> selectSellerImage(Integer properNumber);

	FileVO selectSellerImageOne(Integer properNumber, Integer imagePn);

	Integer selectSellerImageCount(Integer properNumber);

	void insertSellerImage(FileVO fileVO);

	void updateSellerImage(FileVO fileVO);

	void deleteSellerImage(Integer properNumber);

	// ~ SellerNotice

	void updateSellerNotice(JtownUser jtownUser);

	void updateSellerLongNotice(JtownUser jtownUser);

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

	List<Interest> selectSellerInterest(Integer properNumber);

	List<Interest> selectInterestes(Integer properNumber);

	void updateSellerInterestes(Interest interest);

	// ~ SellerProduct

	List<Product> selectSellerProduct(Integer userPn);

	List<Product> selectSellerProduct(ProductFilter productFilter);

	Integer selectSellerProductCount(Integer userPn);

	Product selectSellerProductOne(Integer productPn);

	void deleteProduct(Product product);

	boolean deleteSellerProduct(Product product);

	void insertProduct(Product product);

	void insertSellerProduct(Product product);

	void updateProduct(Product product);
	
	void insertProductTodayUploadCount(Product product);
	
	void updateProductTodayCount(Product product);
	
	Integer selectProductTodayUploadCount(Product product);
	
	Integer insertProductTodayUpload(Product product);

	// ~ LoveCount

	Integer selectLoveCount(Integer properNumber);

	
	// D-DAY Event
	void insertDdayEvent(Event event);
	
	void updateDdayEvent(Event event);
	
	void insertAndUpdateDdayEvent(Event event);
	
	Event selectSellerDDayEvent(Event event);
	
	void deleteSellerDDayEvent(Event event);
	
	void deleteSellerBanner(Event event);
	
	List<Event> selectSellerDDayEventList(Event event);
	
	//Statistic
	
	Integer selectProductClickStatisticCount(Statistic statistic);
	
	List<Statistic> selectProductClickStatisticTopNPercentList(Statistic statistic); 
	
	List<Statistic> selectProductClickStatistic(Statistic statistic);
	
	List<Statistic> selectTotalProductClickStatistic(Statistic statistic);
	
	List<Statistic> selectTotalEventClickStatistic(Statistic statistic);
}
