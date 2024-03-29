package com.bg.jtown.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Interest;
import com.bg.jtown.business.naturallanguage.NaturalLanguageService;
import com.bg.jtown.business.search.NaturalLanguageFilter;
import com.bg.jtown.security.JtownUser;

/**
 * 자연어 검색 방식
 * 
 * @author Francis
 * 
 */
@Controller
public class NaturalLanguageController {

	// ~ Static

	private static Logger logger = LoggerFactory.getLogger(NaturalLanguageController.class);

	// ~ Dynamic Injection

	@Resource
	private NaturalLanguageService naturalLanguageService;

	// ~ Ajax

	@RequestMapping(value = "/ajax/natural/autocomplete.jt", method = RequestMethod.POST)
	@ResponseBody
	public Object ajaxAutoComplete(@RequestBody NaturalLanguageFilter naturalLanguageFilter) {
		logger.debug(naturalLanguageFilter.toString());

		List<JtownUser> jtownUsers = naturalLanguageService.selectSearchShopName(naturalLanguageFilter);

		List<JtownUser> productNameSearch = new ArrayList<JtownUser>();
		if(naturalLanguageFilter.getSearchName().length() >=2 ){ 
			productNameSearch = naturalLanguageService.selectSearchProductName(naturalLanguageFilter);
		}
		
		NaturalLanguageFilter naturalLanguageFilterInterest = new NaturalLanguageFilter(naturalLanguageFilter.getSearchName());
		List<Interest> interests = naturalLanguageService.selectSearchCategoryItemInShop(naturalLanguageFilterInterest);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("jtownUsers", jtownUsers);
		map.put("juNLF", naturalLanguageFilter);

		map.put("interests", interests);
		map.put("iNLF", naturalLanguageFilterInterest);
		
		map.put("productName", productNameSearch);
		return map;
	}
	
	@RequestMapping(value = "/ajax/natural/appAutocomplete.jt", method = RequestMethod.POST)
	@ResponseBody
	public Object ajaxAppAutoComplete(NaturalLanguageFilter naturalLanguageFilter) {
		logger.debug(naturalLanguageFilter.toString());

		List<JtownUser> jtownUsers = naturalLanguageService.selectSearchShopName(naturalLanguageFilter);

		List<JtownUser> productNameSearch = new ArrayList<JtownUser>();
		if(naturalLanguageFilter.getSearchName().length() >=2 ){ 
			productNameSearch = naturalLanguageService.selectSearchProductName(naturalLanguageFilter);
		}
		
		NaturalLanguageFilter naturalLanguageFilterInterest = new NaturalLanguageFilter(naturalLanguageFilter.getSearchName());

		List<Interest> interests = naturalLanguageService.selectSearchInterestSection(naturalLanguageFilterInterest);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("jtownUsers", jtownUsers);
		map.put("juNLF", naturalLanguageFilter);

		map.put("interests", interests);
		map.put("iNLF", naturalLanguageFilterInterest);
		
		map.put("productName", productNameSearch);
		return map;
	}
}
