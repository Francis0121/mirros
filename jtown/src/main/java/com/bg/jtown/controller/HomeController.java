package com.bg.jtown.controller;


import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.bg.jtown.business.HomeService;
import com.bg.jtown.business.search.HomeFilter;
import com.bg.jtown.security.JtownUser;

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
	public ModelAndView showMainPage(Model model,
			@ModelAttribute HomeFilter homeFilter) {
		logger.debug("Show Main page");
		model.addAllAttributes(homeService.selectHome(homeFilter));
		return new ModelAndView("home");
	}

	@RequestMapping(value = "/page/{page}", method = RequestMethod.GET)
	public String showPagination(@PathVariable Integer page, Model model) {
		logger.debug("Show Pagination page");
		if (page > 5) {
			return "pageFinish";
		}
		return "pagination";
	}

	@RequestMapping(value = "/process")
	public ModelAndView redirectView() {

		ModelAndView mav = new ModelAndView();

		Authentication auth = SecurityContextHolder.getContext()
				.getAuthentication();

		JtownUser user = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();

		for (GrantedAuthority grantedAuthority : auth.getAuthorities()) {
			String authority = grantedAuthority.getAuthority();
			if (authority.equals("ROLE_ADMIN")) {
				mav.setView(new RedirectView("admin"));
				break;
			} else if (authority.equals("ROLE_SELLER")) {
				mav.setView(new RedirectView("seller/" + user.getPn()));
				break;
			} else {
				mav.setView(new RedirectView(""));
				break;
			}
		}
		return mav;
	}

	@RequestMapping(value = "/noPermission", method = RequestMethod.GET)
	public String showNoPermissionPage() {
		logger.debug("Show noPermission page");
		return "noPermission";
	}
}
