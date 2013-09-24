package com.bg.jtown.business.home;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.search.HomeFilter;
import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.DateUtil;
import com.bg.jtown.util.FileVO;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class HomeServiceImpl extends SqlSessionDaoSupport implements HomeService {
	// Menu 변경으로 주석처리
	// private static final Integer CATEGORY_DEFAULT_FASION = 1;

	private static Logger logger = LoggerFactory.getLogger(HomeServiceImpl.class);

	@Resource
	private SellerService sellerService;
	@Resource
	private Publisher publisher;

	// ~ map model

	@Override
	public Map<String, Object> selectHome(HomeFilter homeFilter) {
		Map<String, Object> selectMap = new HashMap<String, Object>();

		List<JtownUser> jtownUsers = selectSeller(homeFilter);
		Random random = new Random(System.currentTimeMillis());
		Collections.shuffle(jtownUsers, random);
		selectMap.put("jtownUsers", jtownUsers);

		Map<Integer, List<FileVO>> homeMap = new HashMap<Integer, List<FileVO>>();
		Map<Integer, List<Comment>> commentsMap = new HashMap<Integer, List<Comment>>();
		for (JtownUser jtownUser : jtownUsers) {
			Integer pn = jtownUser.getPn();
			homeMap.put(pn, jtownUser.getImages());
			commentsMap.put(pn, selectNewComment(pn));
		}
		selectMap.put("newComments", commentsMap);
		selectMap.put("images", homeMap);
		logger.debug(commentsMap.toString());
		logger.debug(homeMap.toString());
		logger.debug(selectMap.toString());
		return selectMap;
	}

	private List<Comment> selectNewComment(Integer pn) {
		return getSqlSession().selectList("homeMapper.selectNewComment", pn);
	}

	@Override
	public List<Integer> makeRandomCount(HomeFilter homeFilter) {
		Integer categoryPn = homeFilter.getCategoryPn();
		Integer sectionPn = homeFilter.getSectionPn();
		int count = 0;
		if (sectionPn != null && !sectionPn.equals(0)) {
			count = selectFromInterestCount(homeFilter);
		} else if (categoryPn != null && !categoryPn.equals(0)) {
			count = selectFromInterestCategoryCount(homeFilter);
		} else {
			// Menu 변경으로 주석처리
			// homeFilter.setCategoryPn(CATEGORY_DEFAULT_FASION);
			count = selectFromInterestCategoryCount(homeFilter);
		}
		Pagination pagination = homeFilter.getPagination();
		pagination.setNumItems(count);

		List<Integer> list = new ArrayList<Integer>();
		Random random = new Random(System.currentTimeMillis());
		logger.debug("Max Pages" + pagination.getNumPages());
		for (int i = 1; i <= pagination.getNumPages(); i++) {
			list.add(i);
		}
		Collections.shuffle(list, random);
		logger.debug("RandomPage " + list.toString());
		return list;
	}

	@Override
	public Map<String, Object> selectExpandShop(Integer properNumber) {
		Map<String, Object> selectMap = new HashMap<String, Object>();
		selectMap.put("jtownUser", sellerService.selectSellerInformation(properNumber));
		selectMap.putAll(sellerService.selectSellerEvent(properNumber));
		selectMap.put("products", sellerService.selectSellerProduct(properNumber));
		selectMap.put("interestes", sellerService.selectSellerInterest(properNumber));
		selectMap.putAll(selectSellerEventBannerInformation(properNumber));
		logger.debug(selectMap.toString());

		return selectMap;
	}
	
	@Override
	public Map<String, Object> selectSellerEventBannerInformation(int properNumber){
		Map<String, Object> selectMap = new HashMap<String, Object>();
		Event event = new Event();
		event.setBannerOrder(1);
		event.setSellerPn(properNumber);
		selectMap.put("firstBannerInfo",  sellerService.selectSellerDDayEvent(event));
		event.setBannerOrder(2);
		selectMap.put("secondBannerInfo",  sellerService.selectSellerDDayEvent(event));
		return selectMap;
	}

	// ~ seller Information

	@Override
	public List<JtownUser> selectSeller(HomeFilter homeFilter) {
		Integer categoryPn = homeFilter.getCategoryPn();
		Integer sectionPn = homeFilter.getSectionPn();
		if (sectionPn != null && !sectionPn.equals(0)) {
			return selectFromInterest(homeFilter);
		} else if (categoryPn != null && !categoryPn.equals(0)) {
			return selectFromInterestCategory(homeFilter);
		} else {
			// Menu 변경으로 주석처리
			// homeFilter.setCategoryPn(CATEGORY_DEFAULT_FASION);
			return selectFromInterestCategory(homeFilter);
		}
	}

	@Override
	public List<JtownUser> selectFromInterestCategory(HomeFilter homeFilter) {
		Pagination pagination = homeFilter.getPagination();
		int count = selectFromInterestCategoryCount(homeFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<JtownUser>();
		}

		List<JtownUser> list = getSqlSession().selectList("homeMapper.selectFromInterestCategory", homeFilter);
		logger.debug(list.toString());
		return list;
	}

	private Integer selectFromInterestCategoryCount(HomeFilter homeFilter) {
		return getSqlSession().selectOne("homeMapper.selectFromInterestCategoryCount", homeFilter);
	}

	@Override
	public List<JtownUser> selectFromInterest(HomeFilter homeFilter) {
		Pagination pagination = homeFilter.getPagination();
		int count = selectFromInterestCount(homeFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<JtownUser>();
		}
		List<JtownUser> list = getSqlSession().selectList("homeMapper.selectFromInterest", homeFilter);
		logger.debug(list.toString());
		return list;
	}

	private int selectFromInterestCount(HomeFilter homeFilter) {
		return getSqlSession().selectOne("homeMapper.selectFromInterestCount", homeFilter);
	}

	// ~ Count

	@Override
	public void insertViewCount(Count count) {
		if (count.getCount() == null)
			count.setCount(1);

		Integer sellerPn = count.getSellerPn();
		Integer dayCount = selectStatisticView(sellerPn);
		
		if (dayCount == null || dayCount == 0) {
			getSqlSession().insert("homeMapper.insertStatisticView", count);
		} else {
			count.setCount(dayCount + count.getCount());
			getSqlSession().update("homeMapper.updateStatisticView", count);
		}

		Integer totalCount = selectTotalStatisticView(sellerPn);
		count.setCount(totalCount);

		publisher.viewPublish(count);
	}

	private Integer selectSevenDayStatisticView(Integer sellerPn) {
		String nowDate = DateUtil.getToday("YYYY-MM-DD");
		String beforeDate = DateUtil.addYearMonthDay(nowDate, 0, 0, -6);
		beforeDate = DateUtil.getDayString(beforeDate, "YYYY.MM.DD");
		nowDate = nowDate.replace("-", ".");
		Map<String, Object> selectMap = new HashMap<String, Object>();
		selectMap.put("nowDate", nowDate);
		selectMap.put("beforeDate", beforeDate);
		selectMap.put("sellerPn", sellerPn);

		return getSqlSession().selectOne("homeMapper.selectSevenDayStatisticView", selectMap);
	}

	private Integer selectStatisticView(Integer sellerPn) {
		return getSqlSession().selectOne("homeMapper.selectStatisticView", sellerPn);
	}
	
	private Integer selectTotalStatisticView(Integer sellerPn) {
		return getSqlSession().selectOne("homeMapper.selectTotalStatisticView", sellerPn);
	}

	@Override
	public void insertClickCount(Count count) {
		Integer sellerPn = count.getSellerPn();

		Integer dayCount = selectStaisticClick(sellerPn);
		if (dayCount == null || dayCount == 0) {
			insertStaisticClick(sellerPn);
		} else {
			count.setCount(dayCount + 1);
			updateStaisticClick(count);
		}
	}

	private Integer selectStaisticClick(Integer sellerPn) {
		return getSqlSession().selectOne("homeMapper.selectStatisticClick", sellerPn);
	}

	private void insertStaisticClick(Integer sellerPn) {
		getSqlSession().insert("homeMapper.insertStatisticClick", sellerPn);
	}

	private void updateStaisticClick(Count count) {
		getSqlSession().update("homeMapper.updateStatisticClick", count);
	}

	@Override
	public void insertLoveCount(Count count) {
		Integer loveCount = selectLoveCount(count);
		if (loveCount == 0) {
			count.setCrudType("insert");
			getSqlSession().insert("homeMapper.insertLoveCount", count);
		} else {
			count.setCrudType("delete");
			getSqlSession().delete("homeMapper.deleteLoveCount", count);
		}
		count.setCount(sellerService.selectLoveCount(count.getSellerPn()));
		publisher.lovePublish(count);
	}

	public Integer selectLoveCount(Count count) {
		return getSqlSession().selectOne("homeMapper.selectLoveCount", count);
	}

	// ~ Navigation Interest

	@Override
	public List<Interest> selecInterestCategory() {
		return getSqlSession().selectList("homeMapper.selecInterestCategory");
	}

	@Override
	public Map<Integer, List<Interest>> selectInterest(Integer customerPn) {
		List<Interest> interests = getSqlSession().selectList("homeMapper.selectInterest", customerPn);
		List<Interest> interestCategories = selecInterestCategory();

		Map<Integer, List<Interest>> selectMap = new HashMap<Integer, List<Interest>>();
		List<Interest> divideInterest;
		Map<Integer, String> interestMap = new HashMap<Integer, String>();
		for (Interest ic : interestCategories) {
			divideInterest = new ArrayList<Interest>();
			interestMap = new HashMap<Integer, String>();
			Integer categoryPnic = ic.getCategoryPn();
			for (Interest i : interests) {
				Integer categoryPni = i.getCategoryPn();
				if (categoryPnic.equals(categoryPni)) {
					divideInterest.add(i);
					interestMap.put(i.getSectionPn(), i.getName());
				}
			}
			selectMap.put(categoryPnic, divideInterest);
		}
		return selectMap;
	}

	@Override
	public void insertInterest(Interest interest) {
		Integer count = getSqlSession().selectOne("homeMapper.selectInterestSectionCount", interest);
		if (count == 0) {
			getSqlSession().insert("homeMapper.insertInterest", interest);
		}

	}

	@Override
	public void deleteInterest(Interest interest) {
		getSqlSession().delete("homeMapper.deleteInterest", interest);
	}

	@Override
	public Map<String, Object> selectInterestDataMap(Integer categoryPn) {
		List<Interest> interestCategories = selecInterestCategory();
		int size = interestCategories.size();

		if (categoryPn.equals(0)) {
			categoryPn = size;
		} else if (categoryPn.equals(size + 1)) {
			categoryPn = 1;
		}

		Map<String, Object> selectMap = new HashMap<String, Object>();
		selectMap.put("interestSections", selectInterestSection(categoryPn));
		selectMap.put("interestCategories", interestCategories);
		selectMap.put("pn", categoryPn);
		return selectMap;
	}

	@Override
	public List<Interest> selectInterestSection(Integer categoryPn) {
		return getSqlSession().selectList("homeMapper.selectInterestSection", categoryPn);
	}
}
