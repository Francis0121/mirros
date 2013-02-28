package com.bg.jtown.controller;

import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
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

	@RequestMapping(value = "/ajax/home/expandShop.jt", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> ajaxExpandShop(@RequestBody JtownUser jtownUser) {
		Map<String, Object> selectMap = homeService.selectExpandShop(jtownUser
				.getPn());

		try {
			JtownUser user = (JtownUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			logger.debug(user.toString());
			if (user.getGroupName().equals("Customer")) {
				selectMap.put("cpn", user.getPn());
			} else {
				selectMap.put("cpn", 0);
			}
		} catch (ClassCastException e) {
			logger.debug("로그인하지않은 사용자");
		}

		return selectMap;
	}

	@RequestMapping(value = "/ajax/home/insertComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxInsertComment(@RequestBody Comment comment) {
		JtownUser user = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		comment.setCustomerPn(user.getPn());
		return homeService.insertComment(comment);
	}

	@RequestMapping(value = "/ajax/home/updateComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxUpdateComment(@RequestBody Comment comment) {
		JtownUser user = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		comment.setCustomerPn(user.getPn());
		return homeService.updateComment(comment);
	}

	@RequestMapping(value = "/ajax/home/deleteComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxDeleteComment(@RequestBody Comment comment) {
		JtownUser user = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		comment.setCustomerPn(user.getPn());
		homeService.deleteComment(comment);
	}

	@RequestMapping(value = "/ajax/clickShop.jt", method = RequestMethod.POST)
	@ResponseBody
	public JtownUser ajaxClickShop(@RequestBody Count count) {
		try {
			JtownUser user = (JtownUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			logger.debug(user.toString());
			if (user.getGroupName().equals("Customer")) {
				count.setCustomerPn(user.getPn());
				return homeService.insertViewCount(count);
			} else {
				return user;
			}
		} catch (ClassCastException e) {
			logger.debug("로그인하지않은 사용자");
			return null;
		}
	}

	@RequestMapping(value = "/ajax/clickLove.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxClickLove(@RequestBody Count count) {
		try {
			JtownUser user = (JtownUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			logger.debug(user.toString());
			if (user.getGroupName().equals("Customer")) {
				count.setCustomerPn(user.getPn());
				return homeService.insertLoveCount(count);
			} else {
				count.setMessage("판매자는 불가능합니다");
				return count;
			}
		} catch (ClassCastException e) {
			logger.debug("로그인하지않은 사용자");
			count.setMessage("로그인한 사용자만 사용가능합니다");
			return count;
		}
	}
}
