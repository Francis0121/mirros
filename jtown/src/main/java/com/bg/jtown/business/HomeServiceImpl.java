package com.bg.jtown.business;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
		selectMap.put("jtownUsers", jtownUsers);

		Map<Integer, List<String>> homeMap = new HashMap<Integer, List<String>>();
		for (JtownUser jtownUser : jtownUsers) {
			Integer pn = jtownUser.getPn();
			homeMap.put(pn, sellerService.selectSellerImage(pn));

			jtownUser.setCommentCount(sellerService.selectCommentCount(pn));
			jtownUser.setLoveCount(sellerService.selectLoveCount(pn));
		}
		logger.debug(homeMap.toString());
		selectMap.put("images", homeMap);

		return selectMap;
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
}
