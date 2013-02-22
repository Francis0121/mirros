package com.bg.jtown.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bg.jtown.business.Home;
import com.bg.jtown.business.HomeService;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class HomeController {

	private static final Logger logger = LoggerFactory
			.getLogger(HomeController.class);

	@Resource
	private HomeService homeService;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String showMainPage(Model model) {
		logger.debug("Show Main page");
		Home home = homeService.selectHomeTest();
		logger.info(home.toString());
		return "home";
	}

	@RequestMapping(value = "/page/{page}", method = RequestMethod.GET)
	public String showPagination(@PathVariable Integer page, Model model) {
		logger.debug("Show Pagination page");
		if(page > 5){
			return "pageFinish";
		}
		return "pagination";
	}

	@RequestMapping(value = "/noPermission", method = RequestMethod.GET)
	public String showNoPermissionPage() {
		logger.debug("Show noPermission page");
		return "noPermission";
	}
}
