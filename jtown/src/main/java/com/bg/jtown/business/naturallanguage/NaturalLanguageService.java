package com.bg.jtown.business.naturallanguage;

import java.util.List;

import com.bg.jtown.business.Interest;
import com.bg.jtown.business.search.NaturalLanguageFilter;
import com.bg.jtown.security.JtownUser;

/**
 * 자연어 검색 방식
 * 
 * @author Francis
 * @author In Sanghak
 * 
 */
public interface NaturalLanguageService {

	List<JtownUser> selectSearchShopName(NaturalLanguageFilter naturalLanguageFilter);

	List<Interest> selectSearchInterestSection(NaturalLanguageFilter naturalLanguageFilter);

	List<JtownUser> selectSearchProductName(NaturalLanguageFilter naturalLanguageFilter);
	
	List<Interest> selectSearchCategoryItemInShop(NaturalLanguageFilter naturalLanguageFilter);

}
