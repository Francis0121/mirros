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

import com.bg.jtown.business.search.HomeFilter;
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
		Map<String, Object> selectMap = new HashMap<String, Object>();
		selectMap.put("jtownUser",
				sellerService.selectSellerInformation(properNumber));
		selectMap.putAll(sellerService.selectSellerEvent(properNumber));
		selectMap.put("products",
				sellerService.selectSellerProduct(properNumber));
		selectMap.put("comments", selectComment(properNumber));
		return selectMap;
	}

	// ~ seller Information

	@Override
	public List<JtownUser> selectSeller(HomeFilter homeFilter) {
		Integer categoryPn = homeFilter.getCategoryPn();
		Integer sectionPn = homeFilter.getSectionPn();
		if (categoryPn != null && !categoryPn.equals(0)) {
			return selectFromInterestCategory(homeFilter);
		} else if (sectionPn != null && !sectionPn.equals(0)) {
			return selectFromInterest(homeFilter);
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

	public List<Comment> selectComment(Integer properNumber) {
		return getSqlSession().selectList("homeMapper.selectComment",
				properNumber);
	}

	private Comment selectCommentOne(Integer commentPn) {
		return getSqlSession().selectOne("homeMapper.selectCommentOne",
				commentPn);
	}

	@Override
	public Comment insertComment(Comment comment) {
		getSqlSession().insert("homeMapper.insertComment", comment);
		return selectCommentOne(comment.getCommentPn());
	}

	@Override
	public Comment updateComment(Comment comment) {
		getSqlSession().update("homeMapper.updateComment", comment);
		return selectCommentOne(comment.getCommentPn());
	}

	@Override
	public void deleteComment(Comment comment) {
		getSqlSession().update("homeMapper.deleteComment", comment);
	}

	@Override
	public JtownUser insertViewCount(Count count) {
		return null;
	}

	@Override
	public Count insertLoveCount(Count count) {
		Integer loveCount = selectLoveCount(count);
		if (loveCount == 0) {
			getSqlSession().insert("homeMapper.insertLoveCount", count);
		} else {
			getSqlSession().delete("homeMapper.deleteLoveCount", count);
		}
		count.setCount(sellerService.selectLoveCount(count.getSellerPn()));
		return count;
	}

	private Integer selectLoveCount(Count count) {
		return getSqlSession().selectOne("homeMapper.selectLoveCount", count);
	}

	// ~ Navigation

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
		for (Interest ic : interestCategories) {
			divideInterest = new ArrayList<Interest>();
			Integer categoryPnic = ic.getCategoryPn();
			for (Interest i : interests) {
				Integer categoryPni = i.getCategoryPn();
				if (categoryPnic.equals(categoryPni)) {
					divideInterest.add(i);
				}
			}
			selectMap.put(categoryPnic, divideInterest);
		}
		return selectMap;
	}

	@Override
	public void deleteInterest(Interest interest) {
		getSqlSession().delete("homeMapper.deleteInterest", interest);
	}
}
