package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.ApiException;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookLink;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Count;
import com.bg.jtown.business.Gather;
import com.bg.jtown.business.Product;
import com.bg.jtown.business.home.HomeService;
import com.bg.jtown.business.home.GatherService;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.BrowserUtil;
import com.bg.jtown.util.CookieUtil;

@Controller
public class GatherController {

	private static final Logger logger = LoggerFactory.getLogger(GatherController.class);

	@Autowired
	private HomeService homeService;

	@Autowired
	private GatherService gatherService;
	
	@Autowired
	private SellerService sellerService;
	
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
		if(gatherFilter.getNewFlag() == 0){
			model.addAttribute("categoryType", "pg");
		}else{
			model.addAttribute("categoryType", "new");
		}
	}

	@RequestMapping(value = "/g", method = RequestMethod.GET)
	public String productGatherView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter,
			SummaryUser summaryUser, HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/g";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "gather";
	}

	@RequestMapping(value = "/g/cpn/{categoryPn}", method = RequestMethod.GET)
	public String productGatherCategoryView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter,
			SummaryUser summaryUser, HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/g/cpn/{categoryPn}";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "gather";
	}

	@RequestMapping(value = "/g/", method = RequestMethod.GET)
	public String productGatherView() {
		return "redirect:/g";
	}
	
	@RequestMapping(value = "/n", method = RequestMethod.GET)
	public String newGatherView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter,
			SummaryUser summaryUser, HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/n";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		gatherFilter.setNewFlag(1);
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "gather";
	}

	@RequestMapping(value = "/n/cpn/{categoryPn}", method = RequestMethod.GET)
	public String newGatherCategoryView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter,
			SummaryUser summaryUser, HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/n/cpn/{categoryPn}";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		gatherFilter.setNewFlag(1);
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "gather";
	}

	@RequestMapping(value = "/n/", method = RequestMethod.GET)
	public String newGatherView() {
		return "redirect:/n";
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
				for(Integer productPns : checkedList ){
					if(productPns.equals(count.getProductPn())){
						isProductPn = true;
					}
				}
				if(!isProductPn){
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
				for(Integer eventPns : checkedList ){
					if(eventPns.equals(count.getEventPn())){
						isEventPn = true;
					}
				}
				if(!isEventPn){
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
			try {
				if (count.getCrudType().equals("productHeartInsert") && (summaryUser.getFacebookFeed() != null && summaryUser.getFacebookFeed().equals(true))) {
					Product productInfo = sellerService.selectSellerProductOne(count.getProductPn());
					String url = "https://www.mirros.net/mir/" + productInfo.getSellerPn();
					String name = productInfo.getName();
					FacebookLink link = new FacebookLink(url, name, "", name);
					String message = summaryUser.getName() + "님이 미러스(Mirros)의 " + name + "을(를) 좋아합니다.";
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
