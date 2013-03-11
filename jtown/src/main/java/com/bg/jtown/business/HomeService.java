package com.bg.jtown.business;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.search.HomeFilter;
import com.bg.jtown.security.JtownUser;

/**
 * @author Francis
 * 
 */
public interface HomeService {

	// ~ map model

	Map<String, Object> selectHome(HomeFilter homeFilter);

	Map<String, Object> selectExpandShop(Integer properNumber);

	List<Integer> makeRandomCount(HomeFilter homeFilter);

	// ~ seller Information

	List<JtownUser> selectSeller(HomeFilter homeFilter);

	List<JtownUser> selectFromInterestCategory(HomeFilter homeFilter);

	List<JtownUser> selectFromInterest(HomeFilter homeFilter);

	// ~ comment

	Comment insertComment(Comment comment);

	Comment updateComment(Comment comment);

	void deleteComment(Comment comment);

	// ~ count

	JtownUser insertViewCount(Count count);

	Count insertLoveCount(Count count);

	// ~ Navigation

	List<Interest> selecInterestCategory();

	Map<Integer, List<Interest>> selectInterest(Integer customerPn);

	void insertInterest(Interest interest);

	void deleteInterest(Interest interest);

	List<Interest> selectInterestSection(Integer categoryPn);

	Map<String, Object> selectInterestDataMap(Integer categoryPn);

}
