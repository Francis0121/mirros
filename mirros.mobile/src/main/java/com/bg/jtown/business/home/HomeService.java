package com.bg.jtown.business.home;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Count;
import com.bg.jtown.business.Interest;
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

	// ~ count

	void insertViewCount(Count count);

	void insertClickCount(Count count);
	
	void insertLoveCount(Count count);

	Integer selectLoveCount(Count count);

	// ~ Navigation Interest

	List<Interest> selecInterestCategory();

	Map<Integer, List<Interest>> selectInterest(Integer customerPn);

	List<Interest> selectInterestSection(Integer categoryPn);

	Map<String, Object> selectInterestDataMap(Integer categoryPn);

}
