package com.bg.jtown.business;

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

import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.business.search.HomeFilter;
import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class HomeServiceImpl extends SqlSessionDaoSupport implements
		HomeService {

	private static final Integer CATEGORY_DEFAULT_FASION = 1;

	private static Logger logger = LoggerFactory
			.getLogger(HomeServiceImpl.class);

	@Resource
	private SellerService sellerService;

	@Resource
	private CommentService commentService;

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

		Map<Integer, List<String>> homeMap = new HashMap<Integer, List<String>>();
		for (JtownUser jtownUser : jtownUsers) {
			Integer pn = jtownUser.getPn();
			homeMap.put(pn, jtownUser.getImages());
		}
		logger.debug(homeMap.toString());
		selectMap.put("images", homeMap);

		return selectMap;
	}

	@Override
	public List<Integer> makeRandomCount(HomeFilter homeFilter) {
		Integer categoryPn = homeFilter.getCategoryPn();
		Integer sectionPn = homeFilter.getSectionPn();
		int count = 0;
		if (categoryPn != null && !categoryPn.equals(0)) {
			count = selectFromInterestCategoryCount(homeFilter);
		} else if (sectionPn != null && !sectionPn.equals(0)) {
			count = selectFromInterestCount(homeFilter);
		} else {
			homeFilter.setCategoryPn(CATEGORY_DEFAULT_FASION);
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
		CommentFilter commentFilter = new CommentFilter(properNumber);

		Map<String, Object> selectMap = new HashMap<String, Object>();
		selectMap.put("jtownUser",
				sellerService.selectSellerInformation(properNumber));
		selectMap.putAll(sellerService.selectSellerEvent(properNumber));
		selectMap.put("products",
				sellerService.selectSellerProduct(properNumber));
		selectMap.put("comments",
				commentService.selectCommentTop(commentFilter));
		selectMap.put("commentFilter", commentFilter);

		logger.debug(selectMap.toString());

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
			homeFilter.setCategoryPn(CATEGORY_DEFAULT_FASION);
			return selectFromInterestCategory(homeFilter);
		}
	}

	@Override
	public List<JtownUser> selectFromInterestCategory(HomeFilter homeFilter) {
		Pagination pagination = homeFilter.getPagination();
		int count = selectFromInterestCategoryCount(homeFilter);
		pagination.setNumItems(count);

		List<JtownUser> list = getSqlSession().selectList(
				"homeMapper.selectFromInterestCategory", homeFilter);
		logger.debug(list.toString());
		return list;
	}

	private Integer selectFromInterestCategoryCount(HomeFilter homeFilter) {
		return getSqlSession().selectOne(
				"homeMapper.selectFromInterestCategoryCount", homeFilter);
	}

	@Override
	public List<JtownUser> selectFromInterest(HomeFilter homeFilter) {
		Pagination pagination = homeFilter.getPagination();
		int count = selectFromInterestCount(homeFilter);
		pagination.setNumItems(count);
		List<JtownUser> list = getSqlSession().selectList(
				"homeMapper.selectFromInterest", homeFilter);
		logger.debug(list.toString());
		return list;
	}

	private int selectFromInterestCount(HomeFilter homeFilter) {
		return getSqlSession().selectOne("homeMapper.selectFromInterestCount",
				homeFilter);
	}

	// ~ comment

	@Override
	public void insertViewCount(Count count, String remoteAddr) {
		Integer ipCount = getSqlSession().selectOne(
				"homeMapper.selectViewCountIp", remoteAddr);
		Integer sellerPn = count.getSellerPn();
		if (ipCount == 0) {
			getSqlSession().insert("homeMapper.insertViewIp", remoteAddr);

			Integer dayCount = getSqlSession().selectOne(
					"homeMapper.selectViewDayCount", sellerPn);
			if (dayCount == 0) {
				getSqlSession().insert("homeMapper.insertViewDayCount",
						count.getSellerPn());
				count.setCount(1);
			} else {
				count.setCount(dayCount + 1);
				getSqlSession().update("homeMapper.updateViewDayCount", count);
			}
			count.setCount(selectViewTotalCount(sellerPn));
			publisher.viewPublish(count);
		}
	}

	private Integer selectViewTotalCount(Integer sellerPn) {
		return getSqlSession().selectOne("homeMapper.selectViewTotalCount",
				sellerPn);
	}

	@Override
	public void insertLoveCount(Count count) {
		Integer loveCount = selectLoveCount(count);
		if (loveCount == 0) {
			getSqlSession().insert("homeMapper.insertLoveCount", count);
		} else {
			getSqlSession().delete("homeMapper.deleteLoveCount", count);
		}
		count.setCount(sellerService.selectLoveCount(count.getSellerPn()));
		publisher.lovePublish(count);
	}

	private Integer selectLoveCount(Count count) {
		return getSqlSession().selectOne("homeMapper.selectLoveCount", count);
	}

	// ~ Navigation Interest

	@Override
	public List<Interest> selecInterestCategory() {
		return getSqlSession().selectList("homeMapper.selecInterestCategory");
	}

	@Override
	public Map<Integer, List<Interest>> selectInterest(Integer customerPn) {
		List<Interest> interests = getSqlSession().selectList(
				"homeMapper.selectInterest", customerPn);
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
		Integer count = getSqlSession().selectOne(
				"homeMapper.selectInterestSectionCount", interest);
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
		return getSqlSession().selectList("homeMapper.selectInterestSection",
				categoryPn);
	}
}
