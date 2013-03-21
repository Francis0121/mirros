package com.bg.jtown.controller;

import java.util.ArrayList;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.ModelAttribute;
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

	// ~ FORM

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public ModelAndView showMainPage(@ModelAttribute HomeFilter homeFilter,
			HttpServletRequest request) {
		logger.debug("Show Main page");
		HttpSession session = request.getSession();
		ModelAndView mav = new ModelAndView("home");
		mav.addObject("interestCategories", homeService.selecInterestCategory());
		if(session.getAttribute("interestMap") == null){
			Map<Integer, List<Interest>> interestMap = homeService
					.selectInterest(null);
			session.setAttribute("interestMap", interestMap);
		}
		
		List<Integer> randomPage = homeService.makeRandomCount(homeFilter);
		logger.debug("RandomPage Controller" + randomPage.toString());
		session.setAttribute("randomPage", randomPage);
		logger.debug("RandomPage Controller" + randomPage.get(0));

		homeFilter.setPage(randomPage.get(0));
		Map<String, Object> one = homeService.selectHome(homeFilter);
		mav.addObject("one", one);
		if (randomPage.size() > 1) {
			homeFilter.setPage(randomPage.get(1));
			Map<String, Object> two = homeService.selectHome(homeFilter);
			mav.addObject("two", two);
		}
		return mav;
	}

	@RequestMapping(value = "/cpn/{categoryPn}/spn/{sectionPn}", method = RequestMethod.GET)
	public ModelAndView showMainPageSearch(
			@ModelAttribute HomeFilter homeFilter, HttpServletRequest request) {
		logger.debug("Show Main page Search");
		HttpSession session = request.getSession();
		ModelAndView mav = new ModelAndView("home");
		mav.addObject("interestCategories", homeService.selecInterestCategory());
		if(session.getAttribute("interestMap") == null){
			Map<Integer, List<Interest>> interestMap = homeService
					.selectInterest(null);
			session.setAttribute("interestMap", interestMap);
		}
		
		List<Integer> randomPage = homeService.makeRandomCount(homeFilter);
		logger.debug("RandomPage Controller" + randomPage.toString());
		session.setAttribute("randomPage", randomPage);
		logger.debug("RandomPage Controller" + randomPage.get(0));

		homeFilter.setPage(randomPage.get(0));
		Map<String, Object> one = homeService.selectHome(homeFilter);
		mav.addObject("one", one);
		if (randomPage.size() > 1) {
			homeFilter.setPage(randomPage.get(1));
			Map<String, Object> two = homeService.selectHome(homeFilter);
			mav.addObject("two", two);
		}
		return mav;
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

	// ~ AJAX

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
	public void ajaxClickShop(@RequestBody Count count,
			HttpServletRequest request) {
		try {
			JtownUser user = (JtownUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			logger.debug(user.toString());
			if (user.getGroupName().equals("Customer")) {
				count.setCustomerPn(user.getPn());
			}
		} catch (ClassCastException e) {
			logger.debug("로그인하지않은 사용자");
		}

		homeService.insertViewCount(count, request.getRemoteAddr());
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
				homeService.insertLoveCount(count);
			} else {
				count.setMessage("판매자는 불가능합니다");
			}
			return count;
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
		session.setAttribute("interestMap", interestMap);
	}

	@RequestMapping(value = "/ajax/getNavInterest.jt", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> ajaxGetNavInterest(@RequestBody Interest interest) {
		return homeService.selectInterestDataMap(interest.getCategoryPn());
	}

	@RequestMapping(value = "/ajax/navInterestInsert.jt", method = RequestMethod.POST)
	@ResponseBody
	public void navInterestInsert(@RequestBody Interest interest,
			HttpServletRequest request) {
		try {
			JtownUser user = (JtownUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			logger.debug(user.toString());
			if (user.getGroupName().equals("Customer")) {
				interest.setCustomerPn(user.getPn());
				homeService.insertInterest(interest);
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
		Integer categoryPn = interest.getCategoryPn();
		if (interestMap == null) {
			Map<Integer, List<Interest>> newInterestMap = new HashMap<Integer, List<Interest>>();
			List<Interest> newInterest = new ArrayList<Interest>();
			newInterest.add(interest);
			newInterestMap.put(categoryPn, newInterest);
			session.setAttribute("interestMap", newInterestMap);
			logger.debug(newInterestMap.toString());
		} else {
			List<Interest> interests = interestMap.get(categoryPn);
			boolean result = true;
			if (interests == null) {
				interests = new ArrayList<Interest>();
			} else {
				for (Interest i : interests) {
					Integer addSectionPn = interest.getSectionPn();
					Integer innerSectionPn = i.getSectionPn();
					if (addSectionPn.equals(innerSectionPn)) {
						result = false;
						break;
					}
				}
			}
			if (result) {
				interests.add(interest);
				interestMap.put(categoryPn, interests);
				logger.debug(interestMap.toString());
				session.setAttribute("interestMap", interestMap);
			}
		}
	}

	@RequestMapping(value = "/ajax/homePagination.jt", method = RequestMethod.POST)
	@ResponseBody
	@SuppressWarnings("unchecked")
	public Object ajaxHomePagination(@RequestBody HomeFilter homeFilter,
			HttpServletRequest request) {
		logger.debug("Ajax Pagination page" + homeFilter.toString()
				+ ", Page [ " + homeFilter.getPage() + " ] ");

		HttpSession session = request.getSession();
		List<Integer> randomPage = (List<Integer>) session
				.getAttribute("randomPage");

		Integer page = homeFilter.getCurrentPage();
		if (randomPage.size() > page - 1) {
			homeFilter.setPage(randomPage.get(page - 1));
			Map<String, Object> object = homeService.selectHome(homeFilter);
			logger.debug("Home Pagination " + object);
			return object;
		} else {
			return null;
		}
	}
}
