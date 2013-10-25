package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.ApiException;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookLink;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.Gather;
import com.bg.jtown.business.Participant;
import com.bg.jtown.business.Product;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.home.HomeService;
import com.bg.jtown.business.home.GatherService;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.BrowserUtil;
import com.bg.jtown.util.CookieUtil;
import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.Parameter;
import com.restfb.types.FacebookType;

/**
 * @author In Sanghak
 * 
 */
@Controller
public class GatherController {

	private static final Logger logger = LoggerFactory.getLogger(GatherController.class);

	@Autowired
	private HomeService homeService;

	@Autowired
	private GatherService gatherService;

	@Autowired
	private SellerService sellerService;

	@Autowired
	private LoginService loginService;

	@Autowired
	private CommentService commentService;

	@Resource
	private Facebook facebook;

	private String prefixView = "views/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	private List<Gather> mergeList = null;
	private int mergeSize = 0;

	public void gatherModelSetting(Model model, HttpSession session, GatherFilter gatherFilter, SummaryUser summaryUser) {
		session.setAttribute("currentPage", 2);
		gatherFilter.setPagePerItem(20);
		gatherFilter.setCustomerPn(summaryUser.getPn());
		mergeList = gatherService.mergeProductGatherList(gatherFilter);
		mergeSize = mergeList.size();
		gatherFilter.setTotalCount(mergeSize);
		model.addAttribute("productGatherList", gatherService.paginateItemList(mergeList, gatherFilter));
		model.addAttribute("interestCategories", homeService.selecInterestCategory());
		model.addAttribute("commentFeed", commentService.selectCommentFeedList());
		model.addAttribute("myHeartList", gatherService.selectMyHeartList(summaryUser.getPn()));
		if (gatherFilter.getNewFlag() == 0) {
			model.addAttribute("categoryType", "pg");
		} else {
			model.addAttribute("categoryType", "new");
		}
	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String productGatherView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter, SummaryUser summaryUser,
			HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "gather";
	}

	@RequestMapping(value = "/cpn/{categoryPn}", method = RequestMethod.GET)
	public String productGatherCategoryView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter, SummaryUser summaryUser,
			HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/cpn/{categoryPn}";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "gather";
	}

	/*
	 * @RequestMapping(value = "/g/", method = RequestMethod.GET) public String
	 * productGatherView() { return "redirect:/g"; }
	 */

	@RequestMapping(value = "/n", method = RequestMethod.GET)
	public String newGatherView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter, SummaryUser summaryUser,
			HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		gatherFilter.setNewFlag(1);
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "gather";
	}

	@RequestMapping(value = "/n/cpn/{categoryPn}", method = RequestMethod.GET)
	public String newGatherCategoryView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter, SummaryUser summaryUser,
			HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/cpn/{categoryPn}";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		gatherFilter.setNewFlag(1);
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "gather";
	}

	/*
	 * @RequestMapping(value = "/n/", method = RequestMethod.GET) public String
	 * newGatherView() { return "redirect:/n"; }
	 */
	@RequestMapping(value = "/bannerJSON")
	public String eventBanner(Model model, @RequestParam Integer order) {
		model.addAttribute("order", order);
		return prefixView + "bannerJSON";
	}

	@RequestMapping(value = "/ajax/gatherPagination.jt", method = RequestMethod.POST)
	@ResponseBody
	public Object ajaxGatherItem(GatherFilter gatherFilter, HttpSession session, SummaryUser summaryUser) {
		int currentPage = (Integer) session.getAttribute("currentPage") == null ? 2 : (Integer) session.getAttribute("currentPage");
		gatherFilter.setCurrentPage(currentPage);
		gatherFilter.setPagePerItem(20);
		gatherFilter.setCustomerPn(summaryUser.getPn());
		gatherFilter.setTotalCount(mergeSize);
		if (gatherFilter.getTotalPageSize() > currentPage) {
			Map<String, Object> object = new HashMap<String, Object>();
			object.put("mergeItems", gatherService.paginateItemList(mergeList, gatherFilter));
			session.setAttribute("currentPage", (gatherFilter.getCurrentPage() + 1));
			return object;
		} else {
			return null;
		}
	}

	@RequestMapping(value = "/ajax/productClick.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxProductClick(Count count, HttpSession session, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.CUSTOMER) || authority.equals(Authority.NOT_LOGIN)) {
			ArrayList<Integer> checkedList = (ArrayList<Integer>) session.getAttribute("productStasticView");
			if (checkedList == null || checkedList.isEmpty()) {
				checkedList = new ArrayList<Integer>();
				checkedList.add(count.getProductPn());
				gatherService.insertUpdateProductStasticView(count);
			} else {
				boolean isProductPn = false;
				for (Integer productPns : checkedList) {
					if (productPns.equals(count.getProductPn())) {
						isProductPn = true;
					}
				}
				if (!isProductPn) {
					checkedList.add(count.getProductPn());
					gatherService.insertUpdateProductStasticView(count);
				}
			}
			session.setAttribute("productStasticView", checkedList);
		}
	}

	@RequestMapping(value = "/ajax/eventClick.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxEventClick(Count count, HttpSession session, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.CUSTOMER) || authority.equals(Authority.NOT_LOGIN)) {
			ArrayList<Integer> checkedList = (ArrayList<Integer>) session.getAttribute("eventStasticView");
			if (checkedList == null || checkedList.isEmpty()) {
				checkedList = new ArrayList<Integer>();
				checkedList.add(count.getEventPn());
				gatherService.insertUpdateEventStasticView(count);
			} else {
				boolean isEventPn = false;
				for (Integer eventPns : checkedList) {
					if (eventPns.equals(count.getEventPn())) {
						isEventPn = true;
					}
				}
				if (!isEventPn) {
					checkedList.add(count.getEventPn());
					gatherService.insertUpdateEventStasticView(count);
				}
			}
			session.setAttribute("eventStasticView", checkedList);
		}
	}

	@RequestMapping(value = "/ajax/productHeartClick.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxProductHeartClick(@RequestBody Count count, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			count.setCustomerPn(summaryUser.getPn());
		case ADMIN:
		case ROOT_ADMIN:
			gatherService.insertProductHeartCount(count);
			break;
		case NOT_LOGIN:
			count.setMessage("1");
			break;
		default:
			count.setMessage("2");
		}
		return count;
	}

	@RequestMapping(value = "/ajax/productFacebookLikeClick.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxProductFacebookLikeClick(@RequestBody Count count, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			count.setCustomerPn(summaryUser.getPn());
		case ADMIN:
		case ROOT_ADMIN:
			try {
				String accessToken = loginService.selectAccessToken(summaryUser.getPn());
				if (accessToken == null) {
					count.setMessage("4");
					return count;
				} else {
					Product productInfo = sellerService.selectSellerProductOne(count.getProductPn());
					String url = "https://www.mirros.net/mir/" + productInfo.getSellerPn();
					String name = productInfo.getName();
					String message = summaryUser.getName() + "님이 미러스(Mirros)의 " + name + "을(를) 좋아합니다.";
					String shopName = productInfo.getShopName();
					String prevImageUrl = "https://www.mirros.net/photo/thumbnail/";
					String imageType = productInfo.getImageType();
					String imageUrl = imageType == null ? prevImageUrl + productInfo.getSaveName() : prevImageUrl + productInfo.getSaveName()
							+ "product." + imageType;
					String notice = productInfo.getNotice();
					FacebookClient facebookClient = new DefaultFacebookClient(accessToken);
					FacebookType publish = facebookClient.publish("me/feed", FacebookType.class, Parameter.with("link", url),
							Parameter.with("message", message), Parameter.with("name", shopName), Parameter.with("picture", imageUrl),
							Parameter.with("caption", name), Parameter.with("description", notice));
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

	@RequestMapping(value = "/ajax/eventHeartClick.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxEventHeartClick(@RequestBody Count count, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			count.setCustomerPn(summaryUser.getPn());
		case ADMIN:
		case ROOT_ADMIN:
			gatherService.insertEventHeartCount(count);
			break;
		case NOT_LOGIN:
			count.setMessage("1");
			break;
		default:
			count.setMessage("2");
		}
		return count;
	}

	@RequestMapping(value = "/ajax/eventFacebookLikeClick.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxEventFacebookLikeClick(@RequestBody Count count, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			count.setCustomerPn(summaryUser.getPn());
		case ADMIN:
		case ROOT_ADMIN:
			try {
				String accessToken = loginService.selectAccessToken(summaryUser.getPn());
				if (accessToken == null) {
					count.setMessage("4");
					return count;
				} else {
					Gather shopEventInfo = gatherService.selectShopEvent(count.getEventPn());
					String url = "https://www.mirros.net/mir/" + shopEventInfo.getSellerPn();
					String shopName = shopEventInfo.getShopName();
					String eventName = shopEventInfo.getEventName();
					String message = summaryUser.getName() + "님이 미러스(Mirros)의 " + shopName + " 에서 진행되는 이벤트를 좋아합니다.";

					FacebookClient facebookClient = new DefaultFacebookClient(accessToken);
					FacebookType publish = facebookClient.publish("me/feed", FacebookType.class, Parameter.with("link", url),
							Parameter.with("message", message), Parameter.with("name", shopName), Parameter.with("picture", ""),
							Parameter.with("description", eventName));
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

	@RequestMapping(value = "/ajax/insertComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> ajaxInsertComment(@RequestBody Comment comment, SummaryUser summaryUser) {
		Map<String, Object> map = new HashMap<String, Object>();
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			comment.setCustomerPn(summaryUser.getPn());
			if (commentService.selectCommentExist(comment) == 0) {
				commentService.insertProductComment(comment);
				List<Comment> commentList = commentService.selectCommentList(comment);
				comment.setCount(commentList.size());
				map.put("commentList", commentList);
			} else {
				comment.setMessage("3");
				break;
			}
			break;
		case NOT_LOGIN:
			comment.setMessage("1");
			break;
		default:
			comment.setMessage("2");
		}
		map.put("comment", comment);
		return map;
	}

	@RequestMapping(value = "/ajax/selectComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> ajaxSelectComment(@RequestBody Comment comment, SummaryUser summaryUser) {
		Map<String, Object> map = new HashMap<String, Object>();
		List<Comment> commentList = commentService.selectCommentList(comment);
		comment.setCount(commentList.size());
		map.put("commentList", commentList);
		map.put("comment", comment);
		return map;
	}

	@RequestMapping(value = "/ajax/eventBanner.jt", method = RequestMethod.POST)
	@ResponseBody
	public Event ajaxSelectEventBanner(@RequestBody Event event, SummaryUser summaryUser) {
		event = gatherService.selectBannerEvent(event);
		return event;
	}

	@RequestMapping(value = "/ajax/insertParticipantFilter.jt", method = RequestMethod.POST)
	@ResponseBody
	public Participant ajaxInsertEventParticipantFilter(@RequestBody Participant participant, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			try {
				participant.setCustomerPn(summaryUser.getPn());
				Integer exist = gatherService.selectExistParticipant(participant);
				if (exist == 0) {
					participant.setMessage("success");
					return participant;
				} else {
					participant.setMessage("3");
					return participant;
				}
			} catch (ApiException e) {
				logger.debug("PostConnect Catch");
			}
			break;
		case NOT_LOGIN:
			participant.setMessage("1");
			break;
		default:
			participant.setMessage("2");
		}
		return participant;
	}

	@RequestMapping(value = "/ajax/insertParticipant.jt", method = RequestMethod.POST)
	@ResponseBody
	public Participant ajaxInsertEventParticipant(@RequestBody Participant participant, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			try {
				participant.setCustomerPn(summaryUser.getPn());
				Integer exist = gatherService.selectExistParticipant(participant);
				if (exist == 0) {
					String accessToken = loginService.selectAccessToken(summaryUser.getPn());
					if (accessToken == null) {
						participant.setMessage("4");
						return participant;
					} else {
						gatherService.insertBannerEventParticipant(participant);
						Event event = new Event();
						event.setPn(participant.getEventPn());
						String url = "https://www.mirros.net";
						Event eventItem = gatherService.selectBannerEvent(event);
						String eventName = eventItem.getEventName();
						String imageUrl = "https://www.mirros.net/resources/images/event_thumbnail/" + eventItem.getFbThumbnail();
						String message = summaryUser.getName() + "님이 미러스(Mirros)의 " + eventName + " 이벤트를 좋아합니다.";

						FacebookClient facebookClient = new DefaultFacebookClient(accessToken);
						FacebookType publish = facebookClient.publish("me/feed", FacebookType.class, Parameter.with("link", url),
								Parameter.with("message", message), Parameter.with("name", eventName), Parameter.with("picture", imageUrl),
								Parameter.with("description", eventItem.getFbMessage()));
					}
				} else {
					participant.setMessage("3");
					return participant;
				}
			} catch (ApiException e) {
				logger.debug("PostConnect Catch");
			}
			break;
		case NOT_LOGIN:
			participant.setMessage("1");
			break;
		default:
			participant.setMessage("2");
		}
		return participant;
	}

	@RequestMapping(value = "/ajax/insertProductCommentWarn.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxInsertProductCommentWarn(@RequestBody Comment comment, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case CUSTOMER:
			comment.setCustomerPn(summaryUser.getPn());
			Integer exist = commentService.selectProductCommentWarnExist(comment);
			if (exist == 0) {
				commentService.insertProductCommentWarn(comment);
			} else {
				comment.setMessage("3");
				return comment;
			}
			break;
		case NOT_LOGIN:
			comment.setMessage("1");
			break;
		default:
			comment.setMessage("2");
		}
		return comment;
	}

	@RequestMapping(value = "/ajax/deleteComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxDeleteComment(@RequestBody Comment comment, SummaryUser summaryUser) {
		comment.setCustomerPn(summaryUser.getPn());
		switch (summaryUser.getEnumAuthority()) {
		case ROOT_ADMIN:
			commentService.deleteProductComment(comment);
			break;
		case CUSTOMER:
			Integer exist = commentService.selectUserCommentExist(comment);
			if (exist == 1) {
				commentService.deleteProductComment(comment);
			} else {
				comment.setMessage("3");
				break;
			}
			break;
		case NOT_LOGIN:
			comment.setMessage("1");
			break;
		default:
			comment.setMessage("2");
		}
		return comment;
	}

}
