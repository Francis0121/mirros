package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.social.ApiException;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookLink;
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
import com.bg.jtown.business.Event;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.home.HomeService;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.business.search.HomeFilter;
import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.BrowserUtil;
import com.bg.jtown.util.CookieUtil;

/**
 * @author Francis, 박광열
 * @author In Sanghak
 */
@Controller
public class HomeController {

	// ~ Static

	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	// Menu 변경으로 주석처리
	// private static final Integer CATEGORY_WOMAN = 1;
	// private static final Integer CATEGORY_MAN = 2;

	// ~ Variable

	private String prefixView = "views/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	// ~ Dynamic Injection

	@Resource
	private HomeService homeService;
	@Resource
	private CommentService commentService;
	@Resource
	private Facebook facebook;
	// @Resource
	// private Twitter twitter;
	@Resource
	private SellerService sellerService;

	// @Resource
	// private LoginService loginService;
	// @Resource
	// private SeedCipher seedCipher;

	// ~ SHOW

	@RequestMapping(value = "/s")
	public String showHome(Model model, HttpSession session, @ModelAttribute HomeFilter homeFilter, SummaryUser summaryUser,
			HttpServletRequest request) throws UnsupportedEncodingException {
		
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		getHomeModel(model, session, homeFilter, summaryUser);
		return prefixView + "home";
	}

	@RequestMapping(value = "/mir/{sellerPn}", method = RequestMethod.GET)
	public String showSellerPage(Model model, @PathVariable Integer sellerPn, SummaryUser summaryUser, HttpSession session, HttpServletRequest request)
			throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/mir/" + sellerPn;
			} else {
				model.addAttribute("isMobie", "T");
			}
		}
		Count count = new Count();
		count.setSellerPn(sellerPn);
		checkSessionStatisticView(session, count, summaryUser);
		
		Event event = new Event();
		event.setSellerPn(sellerPn);
		model.addAttribute("eventList", sellerService.selectSellerDDayEventList(event));
		model.addAttribute("interestCategories", homeService.selecInterestCategory());
		model.addAttribute("interestMap", homeService.selectInterest(null));

		model.addAllAttributes(sellerService.selectAllInformation(sellerPn, summaryUser.getPn()));
		model.addAttribute("intervalCount", sellerService.selectInterval7DayCount(sellerPn));
		model.addAttribute("facebookSellerPn", sellerPn);
		
		return prefixView + "mir";
	}

	@RequestMapping(value = "/s/cpn/{categoryPn}/spn/{sectionPn}", method = RequestMethod.GET)
	public String showHomeSearch(Model model, Integer loginUserPn, HttpSession session, @ModelAttribute HomeFilter homeFilter,
			SummaryUser summaryUser, HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/app/cpn/" + homeFilter.getCategoryPn() + "/spn/" + homeFilter.getSectionPn();
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		getHomeModel(model, session, homeFilter, summaryUser);

		return prefixView + "home";
	}

	private void getHomeModel(Model model, HttpSession session, HomeFilter homeFilter, SummaryUser summaryUser) {
		model.addAttribute("interestCategories", homeService.selecInterestCategory());
		// Menu 변경으로 주석처리
		// model.addAttribute("interestMap", homeService.selectInterest(null));

		List<Integer> randomPage = homeService.makeRandomCount(homeFilter);
		session.setAttribute("randomPage", randomPage);

		logger.debug("RandomPage Controller" + randomPage.toString() + " RandomFirstPage = " + randomPage.get(0));

		homeFilter.setCustomerPn(summaryUser.getPn());
		homeFilter.setPage(randomPage.get(0));
		Map<String, Object> one = homeService.selectHome(homeFilter);
		model.addAttribute("one", one);
	}

	// ~ AJAX

	@RequestMapping(value = "/ajax/homePagination.jt", method = RequestMethod.POST)
	@ResponseBody
	@SuppressWarnings("unchecked")
	public Object ajaxHomePagination(@RequestBody HomeFilter homeFilter, SummaryUser summaryUser, HttpSession session) {
		List<Integer> randomPage = (List<Integer>) session.getAttribute("randomPage");

		homeFilter.setCustomerPn(summaryUser.getPn());
		Integer page = homeFilter.getCurrentPage();
		if (randomPage.size() > page - 1) {
			homeFilter.setPage(randomPage.get(page - 1));
			Map<String, Object> object = homeService.selectHome(homeFilter);
			logger.debug("Home Pagination  = " + object + " HomeFilter = " + homeFilter.toString());
			return object;
		} else {
			return null;
		}
	}

	@RequestMapping(value = "/ajax/home/expandShop.jt", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> ajaxExpandShop(@RequestBody JtownUser jtownUser, SummaryUser summaryUser) {
		Integer sellerPn = jtownUser.getPn();
		Integer customerPn = summaryUser.getPn();

		Map<String, Object> selectMap = homeService.selectExpandShop(sellerPn);

		logger.debug("summaryUser.getEnumAuthority() " + summaryUser.getEnumAuthority());
		switch (summaryUser.getEnumAuthority()) {
		case ADMIN:
		case ROOT_ADMIN:
			selectMap.put("cpn", "admin");
			break;
		case CUSTOMER:
			selectMap.put("cpn", customerPn);
			if (customerPn != null && customerPn != 0) {
				int count = homeService.selectLoveCount(new Count(null, customerPn, null, null, sellerPn, null));
				selectMap.put("loveHave", count);
			}
			break;
		case NOT_LOGIN:
			selectMap.put("cpn", null);
			break;
		default:
			selectMap.put("cpn", 0);
		}

		CommentFilter commentFilter = new CommentFilter();
		commentFilter.setSellerPn(sellerPn);
		commentFilter.setCustomerPn(customerPn);

		List<Comment> commentTops = commentService.selectCommentTop(commentFilter);
		if (commentTops.size() == 0) {
			selectMap.put("comments", commentService.selectComment(commentFilter));
		}
		selectMap.put("commentTops", commentTops);
		selectMap.put("commentFilter", commentFilter);

		return selectMap;
	}

	@RequestMapping(value = "/ajax/clickView.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxClickShop(@RequestBody Count count, HttpSession session, SummaryUser summaryUser) {
		checkSessionStatisticView(session, count, summaryUser);
	}

	private void checkSessionStatisticView(HttpSession session, Count count, SummaryUser summaryUser) {

		Integer sellerPn = count.getSellerPn();
		
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.CUSTOMER) || authority.equals(Authority.NOT_LOGIN)) {

			@SuppressWarnings("unchecked")
			ArrayList<Integer> sellerPns = (ArrayList<Integer>) session.getAttribute("statisticView");
			if (sellerPns != null && sellerPns.size() != 0) {
				boolean add = true;
				for (Integer i : sellerPns) {
					if (i.equals(sellerPn)) {
						add = false;
					}
				}
				if (add) {
					sellerPns.add(sellerPn);
					homeService.insertViewCount(count);
				}
			} else {
				sellerPns = new ArrayList<Integer>();
				sellerPns.add(sellerPn);
				homeService.insertViewCount(count);
			}

			session.setAttribute("statisticView", sellerPns);
		}
	}

	@RequestMapping(value = "/ajax/goHome.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxGoHome(@RequestBody Count count) {
		homeService.insertClickCount(count);
	}

	@RequestMapping(value = "/ajax/clickLove.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxClickLove(@RequestBody Count count, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			count.setCustomerPn(summaryUser.getPn());
		case ADMIN:
		case ROOT_ADMIN:
			homeService.insertLoveCount(count);
			try {
				if (count.getCrudType().equals("insert") && (summaryUser.getFacebookFeed() != null && summaryUser.getFacebookFeed().equals(true))) {
					JtownUser jtownUser = sellerService.selectSellerInformation(count.getSellerPn());
					String url = "https://www.mirros.net/mir/" + count.getSellerPn();
					String name = jtownUser.getName();
					String loginNotice = jtownUser.getLongNotice();
					FacebookLink link = new FacebookLink(url, name, "", loginNotice);

					String message = summaryUser.getName() + "님이 미러스(Mirros)의 " + jtownUser.getName() + "을(를) 좋아합니다.";

					facebook.feedOperations().postLink(message, link);
				}
			} catch (ApiException e) {
				logger.debug("PostConnect Catch");
			}
			break;
		case NOT_LOGIN:
			count.setMessage("1");
			break;
		default:
			count.setMessage("2");
		}
		return count;
	}
}
