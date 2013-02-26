package com.bg.jtown.business;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

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

	@Override
	public Map<String, Object> selectAllInformation(Integer properNumber) {
		Map<String, Object> map = new HashMap<String, Object>();

		map.put("jtownUser", selectSellerInformation(properNumber));
		map.put("mainImage", selectSellerImage(properNumber));
		map.putAll(selectSellerEvent(properNumber));
		map.put("interestes", selectSellerInterest(properNumber));

		logger.debug(map.toString());

		return map;
	}

	// ~ Seller Information

	@Override
	public JtownUser selectSellerInformation(Integer properNumber) {
		return getSqlSession().selectOne(
				"sellerMapper.selectSellerInformation", properNumber);
	}

	// ~ SellerImage

	@Override
	public String selectSellerImage(Integer properNumber) {
		return getSqlSession().selectOne("sellerMapper.selectSellerImage",
				properNumber);
	}

	@Override
	public void insertSellerImage(FileVO fileVO) {
		getSqlSession().insert("sellerMapper.insertSellerImage", fileVO);
	}

	@Override
	public void updateSellerImage(FileVO fileVO) {
		String saveName = selectSellerImage(fileVO.getOwnerPn());
		if (saveName != null && !saveName.equals("")) {
			getSqlSession().update("sellerMapper.updateSellerImage", fileVO);
		} else {
			insertSellerImage(fileVO);
		}
	}

	// ~ SellerNotice

	@Override
	public void updateSellerNotice(JtownUser jtownUser) {
		getSqlSession().update("sellerMapper.updateSellerNotice", jtownUser);
	}

	// ~ SellerEvent

	@Override
	public Map<String, Event> selectSellerEvent(Integer properNumber) {
		List<Event> events = getSqlSession().selectList(
				"sellerMapper.selectSellerEvent", properNumber);

		Map<String, Event> eventMap = new HashMap<String, Event>();

		if (events == null) {
			return eventMap;
		}
		for (Event event : events) {
			eventMap.put("event" + event.getBannerOrder().toString(), event);
		}
		return eventMap;
	}

	@Override
	public void insertSellerEvent(Event event) {
		getSqlSession().insert("sellerMapper.insertSellerEvent", event);
	}

	@Override
	public void updateSellerEvent(Event event) {
		if (event.getPn() != null && !event.getPn().equals("")) {
			getSqlSession().update("sellerMapper.updateSellerEvent", event);
		} else {
			insertSellerEvent(event);
		}
	}

	// ~ Seller Interest

	@Override
	public List<String> selectSellerInterest(Integer properNumber) {
		return getSqlSession().selectList("sellerMapper.selectSellerInterest",
				properNumber);
	}

}
