package com.bg.jtown.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookLink;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.HomeService;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.business.search.HomeFilter;
import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.SummaryUser;

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
	@Resource
	private CommentService commentService;
	@Resource
	private Facebook facebook;
	@Resource
	private Twitter twitter;
	@Resource
	private SellerService sellerService;
	@Resource
	private LoginService loginService;

	// ~ FORM

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String showHome(Model model, HttpSession session,
			@ModelAttribute HomeFilter homeFilter, SummaryUser summaryUser) {
		getHomeModel(model, session, homeFilter, summaryUser);
		return "home";
	}

	@RequestMapping(value = "/mir/{sellerPn}", method = RequestMethod.GET)
	public String showSellerPage(Model model, @PathVariable Integer sellerPn,
			HttpSession session, SummaryUser summaryUser) {
		if (session.getAttribute("interestCategories") == null) {
			session.setAttribute("interestCategories",
					homeService.selecInterestCategory());
		}
		if (session.getAttribute("interestMap") == null) {
			session.setAttribute("interestMap",
					homeService.selectInterest(null));
		}
		model.addAllAttributes(sellerService.selectAllInformation(sellerPn,
				summaryUser.getPn()));
		model.addAttribute("intervalCount",
				sellerService.selectInterval7DayCount(sellerPn));

		return "mir";
	}

	@RequestMapping(value = "/cpn/{categoryPn}/spn/{sectionPn}", method = RequestMethod.GET)
	public String showHomeSearch(Model model, Integer loginUserPn,
			HttpSession session, @ModelAttribute HomeFilter homeFilter,
			SummaryUser summaryUser) {
		getHomeModel(model, session, homeFilter, summaryUser);
		return "home";
	}

	private void getHomeModel(Model model, HttpSession session,
			HomeFilter homeFilter, SummaryUser summaryUser) {
		if (session.getAttribute("interestCategories") == null) {
			session.setAttribute("interestCategories",
					homeService.selecInterestCategory());
		}
		if (session.getAttribute("interestMap") == null) {
			session.setAttribute("interestMap",
					homeService.selectInterest(null));
		}

		List<Integer> randomPage = homeService.makeRandomCount(homeFilter);
		session.setAttribute("randomPage", randomPage);

		logger.debug("RandomPage Controller" + randomPage.toString()
				+ " RandomFirstPage = " + randomPage.get(0));

		homeFilter.setCustomerPn(summaryUser.getPn());
		homeFilter.setPage(randomPage.get(0));
		Map<String, Object> one = homeService.selectHome(homeFilter);
		model.addAttribute("one", one);
		if (randomPage.size() > 1) {
			homeFilter.setPage(randomPage.get(1));
			Map<String, Object> two = homeService.selectHome(homeFilter);
			model.addAttribute("two", two);
		}
	}

	@RequestMapping(value = "/process")
	public String showProcessRedirect(HttpSession session,
			HomeFilter homeFilter, SummaryUser summaryUser) {

		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.ADMIN)) {
			return "redirect:admin";
		} else if (authority.equals(Authority.SELLER)) {
			return "redirect:seller/" + summaryUser.getPn();
		} else if (authority.equals(Authority.CUSTOMER)) {
			// TODO 사용자 맞춤형k메뉴 검색시 추가
			// session.setAttribute("interestMap",
			// homeService.selectInterest(summaryUser.getPn()));
			return "redirect:";
		} else {
			return "redirect:";
		}
	}

	@RequestMapping(value = "/noPermission", method = RequestMethod.GET)
	public String showNoPermissionPage() {
		return "login/noPermission";
	}

	// ~ AJAX

	@RequestMapping(value = "/ajax/homePagination.jt", method = RequestMethod.POST)
	@ResponseBody
	@SuppressWarnings("unchecked")
	public Object ajaxHomePagination(@RequestBody HomeFilter homeFilter,
			SummaryUser summaryUser, HttpSession session) {
		List<Integer> randomPage = (List<Integer>) session
				.getAttribute("randomPage");

		homeFilter.setCustomerPn(summaryUser.getPn());
		Integer page = homeFilter.getCurrentPage();
		if (randomPage.size() > page - 1) {
			homeFilter.setPage(randomPage.get(page - 1));
			Map<String, Object> object = homeService.selectHome(homeFilter);
			logger.debug("Home Pagination  = " + object + " HomeFilter = "
					+ homeFilter.toString());
			return object;
		} else {
			return null;
		}
	}

	@RequestMapping(value = "/ajax/home/expandShop.jt", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> ajaxExpandShop(@RequestBody JtownUser jtownUser,
			SummaryUser summaryUser) {
		Integer sellerPn = jtownUser.getPn();
		Integer customerPn = summaryUser.getPn();

		Map<String, Object> selectMap = homeService.selectExpandShop(sellerPn);

		if (summaryUser.getEnumAuthority().equals(Authority.CUSTOMER)) {
			selectMap.put("cpn", customerPn);
			if (customerPn != null && customerPn != 0) {
				int count = homeService.selectLoveCount(new Count(null,
						customerPn, null, null, sellerPn, null));
				selectMap.put("loveHave", count);
			}
		} else if (summaryUser.getEnumAuthority().equals(Authority.NOT_LOGIN)) {
			selectMap.put("cpn", null);
		} else {
			selectMap.put("cpn", 0);
		}

		CommentFilter commentFilter = new CommentFilter();
		commentFilter.setSellerPn(sellerPn);
		commentFilter.setCustomerPn(customerPn);

		List<Comment> commentTops = commentService
				.selectCommentTop(commentFilter);
		if (commentTops.size() == 0) {
			selectMap.put("comments",
					commentService.selectComment(commentFilter));
		}
		selectMap.put("commentTops", commentTops);
		selectMap.put("commentFilter", commentFilter);

		return selectMap;
	}

	@RequestMapping(value = "/ajax/clickShop.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxClickShop(@RequestBody Count count, SummaryUser summaryUser) {
		homeService.insertViewCount(count, summaryUser.getRemoteIp());
		return count;
	}

	@RequestMapping(value = "/ajax/clickLove.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxClickLove(@RequestBody Count count, SummaryUser summaryUser) {
		if (summaryUser.getEnumAuthority().equals(Authority.CUSTOMER)) {
			count.setCustomerPn(summaryUser.getPn());
			homeService.insertLoveCount(count);
			
			String providerUserId = loginService.selectSocialProviderUserId(summaryUser.getPn(), "facebook");
			if(providerUserId != null && !"".equals(providerUserId)){
				if (count.getCrudType().equals("insert")) {
					JtownUser jtownUser = sellerService.selectSellerInformation(count.getSellerPn());
					FacebookLink link = new FacebookLink("https://www.mirros.net/mir/"+count.getSellerPn(), jtownUser.getName(), "", jtownUser.getLongNotice());
					facebook.feedOperations().postLink(providerUserId, "@"+summaryUser.getName() +"님이 Secret Shop Mirros의 "+ jtownUser.getName()+"을 좋아합니다.", link);
				}
			}
		} else if (summaryUser.getEnumAuthority().equals(Authority.NOT_LOGIN)) {
			count.setMessage("1");
		} else {
			count.setMessage("2");
		}
		return count;
	}

	// ~ Custom Navigation - 2013.04.16 사용 X

	@RequestMapping(value = "/ajax/getNavInterest.jt", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> ajaxGetNavInterest(@RequestBody Interest interest) {
		return homeService.selectInterestDataMap(interest.getCategoryPn());
	}

	@RequestMapping(value = "/ajax/navInterestDelete.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxClickLove(@RequestBody Interest interest,
			HttpSession session) {
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

	@RequestMapping(value = "/ajax/navInterestInsert.jt", method = RequestMethod.POST)
	@ResponseBody
	public void navInterestInsert(@RequestBody Interest interest,
			HttpSession session) {
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

}
