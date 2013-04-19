package com.bg.jtown.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.naturallanguage.NaturalLanguage;
import com.bg.jtown.business.naturallanguage.NaturalLanguageService;

/**
 * 자연어 검색 방식
 * 
 * @author Francis
 * 
 */
@Controller
public class NaturalLanguageController {

	private static Logger logger = LoggerFactory
			.getLogger(NaturalLanguageController.class);

	@Resource
	private NaturalLanguageService naturalLanguageService;

	@RequestMapping(value = "/ajax/natural/autocomplete.jt", method = RequestMethod.POST)
	@ResponseBody
	public Object ajaxAutoComplete(@RequestBody NaturalLanguage naturalLanguage) {
		logger.debug(naturalLanguage.toString());

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("key", 1);
		return map;
	}
}
