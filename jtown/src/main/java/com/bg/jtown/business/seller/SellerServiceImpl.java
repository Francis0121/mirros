package com.bg.jtown.business.seller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Event;
import com.bg.jtown.business.Product;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.FileVO;

/**
 * @author Francis
 * 
 */
@Service
public class SellerServiceImpl extends SqlSessionDaoSupport implements
		SellerService {

	private static Logger logger = LoggerFactory
			.getLogger(SellerServiceImpl.class);

	@Resource
	private Publisher publisher;

	@Override
	public Map<String, Object> selectAllInformation(Integer properNumber) {
		Map<String, Object> selectMap = new HashMap<String, Object>();

		selectMap.put("jtownUser", selectSellerInformation(properNumber));
		selectMap.put("mainImages", selectSellerImage(properNumber));
		selectMap.putAll(selectSellerEvent(properNumber));
		selectMap.put("interestes", selectSellerInterest(properNumber));
		selectMap.put("products", selectSellerProduct(properNumber));

		logger.debug(selectMap.toString());

		return selectMap;
	}

	// ~ Seller Information

	@Override
	public JtownUser selectSellerInformation(Integer properNumber) {
		JtownUser jtownUser = getSqlSession().selectOne(
				"sellerMapper.selectSellerInformation", properNumber);
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

	// ~ SellerImage

	@Override
	public List<String> selectSellerImage(Integer properNumber) {
		List<String> images = getSqlSession().selectList(
				"sellerMapper.selectSellerImage", properNumber);
		logger.debug(images.toString());
		return images;
	}

	@Override
	public String selectSellerImageOne(Integer properNumber, Integer imagePn) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("properNumber", properNumber);
		paramMap.put("imagePn", imagePn);

		String savename = getSqlSession().selectOne(
				"sellerMapper.selectSellerImageOne", paramMap);
		logger.debug(savename.toString());
		return savename;
	}

	@Override
	public Integer selectSellerImageCount(Integer properNumber) {
		return getSqlSession().selectOne("sellerMapper.selectSellerImageCount",
				properNumber);
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
			getSqlSession()
					.update("sellerMapper.updateSellerNotice", jtownUser);
		} else {
			logger.error("=================> Notice Over Flow Character 100");
			logger.error(jtownUser.getNotice());
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
		return getSqlSession().selectList("sellerMapper.selectEventList",
				userPn);
	}

	@Override
	public Event selectEventOne(Integer eventPn) {
		return getSqlSession()
				.selectOne("sellerMapper.selectEventOne", eventPn);
	}

	@Override
	public Integer selectEventCount(Integer userPn) {
		return getSqlSession().selectOne("sellerMapper.selectEventCount",
				userPn);
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
	public List<String> selectSellerInterest(Integer properNumber) {
		return getSqlSession().selectList("sellerMapper.selectSellerInterest",
				properNumber);
	}

	// ~ Seller Product

	@Override
	public List<Product> selectSellerProduct(Integer userPn) {
		return getSqlSession().selectList("sellerMapper.selectSellerProduct",
				userPn);
	}

	@Override
	public Integer selectSellerProductCount(Integer userPn) {
		return getSqlSession().selectOne(
				"sellerMapper.selectSellerProductCount", userPn);
	}

	@Override
	public Product selectSellerProductOne(Integer productPn) {
		return getSqlSession().selectOne("sellerMapper.selectSellerProductOne",
				productPn);
	}

	@Override
	public void deleteSellerProduct(Product product) {
		Integer sellerPn = product.getSellerPn();
		Integer count = selectSellerProductCount(sellerPn);
		if (count < 4) {
			product = null;
			return;
		}
		deleteProduct(product);
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
			return;
		}
		insertProduct(product);
	}

	@Override
	public void insertProduct(Product product) {
		getSqlSession().insert("sellerMapper.insertSellerProduct", product);
	}

	// ~ SellerComment
	@Override
	public Integer selectCommentCount(Integer properNumber) {
		Integer count = getSqlSession().selectOne(
				"sellerMapper.selectCommentCount", properNumber);
		if (count == null) {
			return 0;
		}
		return count;
	}

	// ~ LoveCount
	@Override
	public Integer selectLoveCount(Integer properNumber) {
		return getSqlSession().selectOne("sellerMapper.selectLoveCount",
				properNumber);
	}
}