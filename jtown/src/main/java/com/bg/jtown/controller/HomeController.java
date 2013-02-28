package com.bg.jtown.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.search.HomeFilter;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.Pagination;

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
	public ModelAndView showMainPage(@ModelAttribute HomeFilter homeFilter) {
		ModelAndView mav = new ModelAndView("home");
		logger.debug("Show Main page");
		mav.addObject("interestCategories", homeService.selecInterestCategory());
		mav.addAllObjects(homeService.selectHome(homeFilter));
		return mav;
	}

	@RequestMapping(value = "/cpn/{categoryPn}/spn/{sectionPn}", method = RequestMethod.GET)
	public ModelAndView showMainPageSearch(@ModelAttribute HomeFilter homeFilter) {
		ModelAndView mav = new ModelAndView("home");
		logger.debug("Show Main page");
		logger.debug(homeFilter.toString());
		mav.addObject("interestCategories", homeService.selecInterestCategory());
		mav.addAllObjects(homeService.selectHome(homeFilter));
		return mav;
	}

	@RequestMapping(value = "/cpn/{categoryPn}/spn/{sectionPn}/page/{page}", method = RequestMethod.GET)
	public String showPagination(@ModelAttribute HomeFilter homeFilter,
			@PathVariable Integer page, Model model) {
		logger.debug("Show Pagination page");
		logger.debug("HomeFilter Page " + page + " " + homeFilter.toString());
		homeFilter.setPage(page);
		model.addAllAttributes(homeService.selectHome(homeFilter));
		Pagination pagination = homeFilter.getPagination();
		if (pagination.getNumPages() < page) {
			return "pageFinish";
		}
		return "pagination";
	}

	@RequestMapping(value = "/process")
	public ModelAndView redirectView(HttpServletRequest request) {

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
			} else if (authority.equals("ROLE_USER")) {
				Map<Integer, List<Interest>> interestMap = homeService
						.selectInterest(user.getPn());
				HttpSession session = request.getSession();
				session.setAttribute("interestMap", interestMap);
				logger.debug(interestMap.toString());
				mav.setView(new RedirectView(""));
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

	@RequestMapping(value = "/ajax/navInterestDelete.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxClickLove(@RequestBody Interest interest,
			HttpServletRequest request) {
		try {
			JtownUser user = (JtownUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			logger.debug(user.toString());
			if (user.getGroupName().equals("Customer")) {
				interest.setCustomerPn(user.getPn());
				homeService.deleteInterest(interest);
			} else {
				logger.debug("판매자 사용불가");
			}
		} catch (ClassCastException e) {
			logger.debug("로그인하지않은 사용자");
		}
		HttpSession session = request.getSession();
		@SuppressWarnings("unchecked")
		Map<Integer, List<Interest>> interestMap = (Map<Integer, List<Interest>>) session
				.getAttribute("interestMap");
		logger.debug(interestMap.toString());
		Integer categoryPn = interest.getCategoryPn();
		List<Interest> interests = interestMap.get(categoryPn);
		logger.debug(interests.toString());
		List<Interest> newInterests = new ArrayList<Interest>();
		if (interests != null) {
			for (Interest i : interests) {
				if (!i.getSectionPn().equals(interest.getSectionPn()))
					newInterests.add(i);
			}
		}
		interestMap.put(categoryPn, newInterests);
	}
}
