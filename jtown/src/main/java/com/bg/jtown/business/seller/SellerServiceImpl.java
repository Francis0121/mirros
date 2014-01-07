package com.bg.jtown.business.seller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Event;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Json;
import com.bg.jtown.business.Product;
import com.bg.jtown.business.Statistic;
import com.bg.jtown.business.admin.AdminService;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.business.search.ProductFilter;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.DateUtil;
import com.bg.jtown.util.FileVO;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * @author In Sanghak
 */
@Service
public class SellerServiceImpl extends SqlSessionDaoSupport implements SellerService {

	private static Logger logger = LoggerFactory.getLogger(SellerServiceImpl.class);

	@Resource
	private Publisher publisher;
	@Resource
	private CommentService commentService;
	@Resource
	private AdminService adminService;

	@Override
	public Map<String, Object> selectAllInformation(Integer properNumber) {
		CommentFilter commentFilter = new CommentFilter(properNumber);
		Map<String, Object> selectMap = new HashMap<String, Object>();

		selectMap.put("jtownUser", selectSellerInformation(properNumber));
		selectMap.put("mainImages", selectSellerImage(properNumber));
		selectMap.putAll(selectSellerEvent(properNumber));
		selectMap.put("interestes", selectSellerInterest(properNumber));
		selectMap.put("products", selectSellerProduct(properNumber));
		selectMap.put("comments", commentService.selectCommentTop(commentFilter));
		selectMap.put("commentFilter", commentFilter);

		logger.debug(selectMap.toString());

		return selectMap;
	}

	@Override
	public Map<String, Object> selectAllInformation(Integer properNumber, Integer customerPn) {
		CommentFilter commentFilter = new CommentFilter(properNumber, customerPn);
		Map<String, Object> selectMap = new HashMap<String, Object>();

		selectMap.put("jtownUser", selectSellerInformation(properNumber, customerPn));
		selectMap.put("mainImages", selectSellerImage(properNumber));
		selectMap.putAll(selectSellerEvent(properNumber));
		selectMap.put("interestes", selectSellerInterest(properNumber));
		selectMap.put("products", selectSellerProduct(properNumber));
		selectMap.put("commentTops", commentService.selectCommentTop(commentFilter));
		selectMap.put("comments", commentService.selectComment(commentFilter));
		selectMap.put("commentFilter", commentFilter);

		logger.debug(selectMap.toString());

		return selectMap;
	}

	// ~ Seller Information

	@Override
	public JtownUser selectSellerInformation(Integer properNumber, Integer customerPn) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("properNumber", properNumber);
		param.put("customerPn", customerPn);
		JtownUser jtownUser = getSqlSession().selectOne("sellerMapper.selectSellerInformation", param);
		if (jtownUser != null) {
			if (jtownUser.getLoveCount() == null) {
				jtownUser.setLoveCount(0);
			}
			if (jtownUser.getViewCount() == null) {
				jtownUser.setViewCount(0);
			}
			if (jtownUser.getCommentCount() == null) {
				jtownUser.setCommentCount(0);
			}
		}
		return jtownUser;
	}

	@Override
	public JtownUser selectSellerInformation(Integer properNumber) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("properNumber", properNumber);
		param.put("customerPn", null);
		JtownUser jtownUser = getSqlSession().selectOne("sellerMapper.selectSellerInformation", param);
		if (jtownUser != null) {
			if (jtownUser.getLoveCount() == null) {
				jtownUser.setLoveCount(0);
			}
			if (jtownUser.getViewCount() == null) {
				jtownUser.setViewCount(0);
			}
			if (jtownUser.getCommentCount() == null) {
				jtownUser.setCommentCount(0);
			}
		}
		return jtownUser;
	}

	@Override
	public Map<String, Object> selectInterval7DayCount(Integer properNumber) {
		String nowDate = DateUtil.getToday("YYYY-MM-DD");
		String beforeDate = DateUtil.addYearMonthDay(nowDate, 0, 0, -7);
		beforeDate = DateUtil.getDayString(beforeDate, "YYYY.MM.DD");
		nowDate = nowDate.replace("-", ".");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("nowDate", nowDate);
		map.put("beforeDate", beforeDate);
		map.put("properNumber", properNumber);

		List<Json> jsons = getSqlSession().selectList("sellerMapper.selectInterval7DayCount", map);
		if (jsons == null) {
			return map;
		}

		for (Json json : jsons) {
			map.put(json.getValue(), json.getKey());
		}
		return map;
	}

	// ~ SellerImage

	@Override
	public List<FileVO> selectSellerImage(Integer properNumber) {
		List<FileVO> images = getSqlSession().selectList("sellerMapper.selectSellerImage", properNumber);
		logger.debug(images.toString());
		return images;
	}

	@Override
	public FileVO selectSellerImageOne(Integer properNumber, Integer imagePn) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("properNumber", properNumber);
		paramMap.put("imagePn", imagePn);

		FileVO savename = getSqlSession().selectOne("sellerMapper.selectSellerImageOne", paramMap);
		logger.debug(savename.toString());
		return savename;
	}

	@Override
	public Integer selectSellerImageCount(Integer properNumber) {
		return getSqlSession().selectOne("sellerMapper.selectSellerImageCount", properNumber);
	}

	@Override
	public void insertSellerImage(FileVO fileVO) {
		getSqlSession().insert("sellerMapper.insertSellerImage", fileVO);
	}

	@Override
	public void updateSellerImage(FileVO fileVO) {
		Integer count = selectSellerImageCount(fileVO.getOwnerPn());
		Integer imagePn = fileVO.getImagePn();
		if (imagePn == null || imagePn == 0)
			return;

		if (count != null && count != 0) {
			getSqlSession().update("sellerMapper.updateSellerImage", fileVO);
		} else {
			insertSellerImage(fileVO);
		}
	}

	@Override
	public void deleteSellerImage(Integer properNumber) {
		getSqlSession().delete("sellerMapper.deleteSellerImage", properNumber);
	}

	// ~ SellerNotice

	@Override
	public void updateSellerNotice(JtownUser jtownUser) {
		String notice = jtownUser.getNotice();
		if (notice.length() < 100) {
			getSqlSession().update("sellerMapper.updateSellerNotice", jtownUser);
		} else {
			logger.error("=================> Notice Over Flow Character 100");
			logger.error(jtownUser.getNotice());
		}
	}

	@Override
	public void updateSellerLongNotice(JtownUser jtownUser) {
		String longNotice = jtownUser.getLongNotice();
		if (longNotice.length() < 250) {
			getSqlSession().update("sellerMapper.updateSellerLongNotice", jtownUser);
		} else {
			logger.error("=================> Notice Over Flow Character 100");
			logger.error(jtownUser.getLongNotice());
		}
	}

	// ~ SellerEvent

	@Override
	public Map<String, Event> selectSellerEvent(Integer userPn) {
		List<Event> events = selectEventList(userPn);

		Map<String, Event> eventMap = new HashMap<String, Event>();
		if (events == null)
			return eventMap;

		for (Event event : events) {
			eventMap.put("event" + event.getBannerOrder().toString(), event);
		}
		return eventMap;
	}

	@Override
	public List<Event> selectEventList(Integer userPn) {
		return getSqlSession().selectList("sellerMapper.selectEventList", userPn);
	}

	@Override
	public Event selectEventOne(Integer eventPn) {
		return getSqlSession().selectOne("sellerMapper.selectEventOne", eventPn);
	}

	@Override
	public Integer selectEventCount(Integer userPn) {
		return getSqlSession().selectOne("sellerMapper.selectEventCount", userPn);
	}

	@Override
	public void deleteEvent(Event event) {
		getSqlSession().delete("sellerMapper.deleteEvent", event);
	}

	@Override
	public void insertEvent(Event event) {
		getSqlSession().insert("sellerMapper.insertSellerEvent", event);
	}

	@Override
	public void updateEvent(Event event) {
		getSqlSession().update("sellerMapper.updateSellerEvent", event);
	}

	@Override
	public void updateAndInsertEvent(Event event) {
		if (event.getPn() != null && !event.getPn().equals("")) {
			updateEvent(event);
		} else {
			insertEvent(event);
		}
		publisher.eventPublish(event);
	}

	// ~ Seller Interest

	@Override
	public List<Interest> selectSellerInterest(Integer properNumber) {
		return getSqlSession().selectList("sellerMapper.selectSellerInterest", properNumber);
	}

	@Override
	public List<Interest> selectInterestes(Integer properNumber) {
		return getSqlSession().selectList("sellerMapper.selectInterestes", properNumber);
	}

	@Override
	public void updateSellerInterestes(Interest interest) {
		adminService.deleteSellerInterest(interest);

		Integer[] spnList = interest.getSpnList();
		Interest insertInterest = new Interest(interest.getSellerPn(), null, interest.getSectionPn(), null);
		for (int i = 0; i < spnList.length; i++) {
			Integer spn = spnList[i];
			if (spn != null && !spn.equals("0")) {
				insertInterest.setSectionPn(spn);
				adminService.insertSellerInterest(insertInterest);
			}
		}
	}

	// ~ Seller Product

	@Override
	public List<Product> selectSellerProduct(Integer userPn) {
		return getSqlSession().selectList("sellerMapper.selectSellerProduct", userPn);
	}

	@Override
	public List<Product> selectSellerProduct(ProductFilter productFilter) {
		Pagination pagination = productFilter.getPagination();
		int count = selectSellerProductCount(productFilter);
		if (count == 0) {
			return new ArrayList<Product>();
		} else if (count <= 10 && productFilter.getPage() == 2) {
			productFilter.setPage(1);
		} else if (count <= 20 && productFilter.getPage() == 3) {
			productFilter.setPage(2);
		}
		pagination.setNumItems(count);
		return getSqlSession().selectList("sellerMapper.selectSellerProductFromProductFilter", productFilter);
	}

	private Integer selectSellerProductCount(ProductFilter productFilter) {
		return getSqlSession().selectOne("sellerMapper.selectSellerProductCountFromProductFilter", productFilter);
	}

	@Override
	public Integer selectSellerProductCount(Integer userPn) {
		return getSqlSession().selectOne("sellerMapper.selectSellerProductCount", userPn);
	}

	@Override
	public Product selectSellerProductOne(Integer productPn) {
		return getSqlSession().selectOne("sellerMapper.selectSellerProductOne", productPn);
	}

	@Override
	public boolean deleteSellerProduct(Product product) {
		Integer sellerPn = product.getSellerPn();
		Integer count = selectSellerProductCount(sellerPn);
		if (count < 4) {
			product = null;
			return false;
		}
		deleteProduct(product);
		return true;
	}

	@Override
	public void deleteProduct(Product product) {
		getSqlSession().delete("sellerMapper.deleteSellerProduct", product);
	}

	@Override
	public void insertSellerProduct(Product product) {
		Integer sellerPn = product.getSellerPn();
		Integer count = selectSellerProductCount(sellerPn);
		if (count >= 10) {
			product.setCount(count);
			return;
		}
		insertProduct(product);
		product.setCount(count);
	}

	@Override
	public void insertProduct(Product product) {
		getSqlSession().insert("sellerMapper.insertSellerProduct", product);
	}

	@Override
	public void updateProduct(Product product) {
		getSqlSession().update("sellerMapper.updateSellerProduct", product);
	}

	@Override
	public void insertProductTodayUploadCount(Product product) {
		getSqlSession().insert("sellerMapper.insertProductTodayUploadCount", product);
	}

	@Override
	public void updateProductTodayCount(Product product) {
		getSqlSession().update("sellerMapper.updateProductTodayCount", product);
	}

	@Override
	public Integer selectProductTodayUploadCount(Product product) {
		return getSqlSession().selectOne("sellerMapper.selectProductTodayUploadCount", product);
	}

	@Override
	public Integer insertProductTodayUpload(Product product) {
		Integer todayCount = selectProductTodayUploadCount(product);
		if (todayCount == null || todayCount < 13) {
			product.setTodayCount(todayCount);
			if (todayCount == null) {
				insertProductTodayUploadCount(product);
				todayCount = 1;
			} else {
				updateProductTodayCount(product);
				todayCount++;
			}
		}
		return todayCount;
	}

	// ~ LoveCount
	@Override
	public Integer selectLoveCount(Integer properNumber) {
		return getSqlSession().selectOne("sellerMapper.selectLoveCount", properNumber);
	}

	// D-DAY Event
	@Override
	public void insertDdayEvent(Event event) {
		getSqlSession().insert("sellerMapper.insertDdayEvent", event);
	}

	@Override
	public void updateDdayEvent(Event event) {
		getSqlSession().update("sellerMapper.updateDdayEvent", event);
	}

	@Override
	public void insertAndUpdateDdayEvent(Event event) {
		if (event.getEventPn() != null && !("".equals(event.getEventPn()))) {
			updateDdayEvent(event);
		} else {
			insertDdayEvent(event);
		}
		publisher.eventPublish(event);
	}

	@Override
	public Event selectSellerDDayEvent(Event event) {
		return getSqlSession().selectOne("sellerMapper.selectSellerDDayEvent", event);
	}

	@Override
	public List<Event> selectSellerDDayEventList(Event event) {
		return getSqlSession().selectList("sellerMapper.selectSellerDDayEventList", event);
	}

	@Override
	public void deleteSellerDDayEvent(Event event) {
		getSqlSession().update("sellerMapper.deleteSellerDDayEvent", event);
	}

	@Override
	public void deleteSellerBanner(Event event) {
		getSqlSession().delete("sellerMapper.deleteSellerBanner", event);
	}

	// Statistic
	
	@Override
	public Integer selectProductClickStatisticCount(Statistic statistic) {
		return getSqlSession().selectOne("sellerMapper.selectProductClickStatisticCount", statistic);
	}

	@Override
	public List<Statistic> selectProductClickStatisticTopNPercentList(Statistic statistic) {
		statistic.setPercentCount(selectProductClickStatisticCount(statistic));
		return getSqlSession().selectList("sellerMapper.selectProductClickStatisticTopNPercentList", statistic);
	}

	@Override
	public List<Statistic> selectProductClickStatistic(Statistic statistics) {
		return getSqlSession().selectList("sellerMapper.selectProductClickStatistic", statistics);
	}

	@Override
	public List<Statistic> selectTotalProductClickStatistic(Statistic statistic) {
		return getSqlSession().selectList("sellerMapper.selectTotalProductClickStatistic", statistic);
	}

	@Override
	public List<Statistic> selectTotalEventClickStatistic(Statistic statistic) {
		return getSqlSession().selectList("sellerMapper.selectTotalEventClickStatistic", statistic);
	}
	

}
