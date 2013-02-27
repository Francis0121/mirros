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

	Map<String, Object> selectHome(HomeFilter homeFilter);

	Map<String, Object> selectExpandShop(Integer properNumber);

	List<JtownUser> selectSeller(HomeFilter homeFilter);

	List<JtownUser> selectFromInterestCategory(HomeFilter homeFilter);

	List<JtownUser> selectFromInterest(HomeFilter homeFilter);

}
