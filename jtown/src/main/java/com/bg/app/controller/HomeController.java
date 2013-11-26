package com.bg.app.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.home.GatherService;
import com.bg.jtown.business.home.HomeService;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.BrowserUtil;
import com.bg.jtown.util.CookieUtil;

@Controller(value = "appHomeController")
@RequestMapping("/app")
public class HomeController {

	@Autowired
	private HomeService homeService;

	@Autowired
	private GatherService gatherService;

	@Autowired
	private CommentService commentService;

	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

	private String prefixView = "views_webapp/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	@RequestMapping(value = "")
	public String itemView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter, SummaryUser summaryUser) {
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "item";
	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String itemViewRedirect() {
		return "redirect:/app";
	}

	@RequestMapping(value = "/cpn/{categoryPn}", method = RequestMethod.GET)
	public String productGatherCategoryView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter, SummaryUser summaryUser,
			HttpServletRequest request) throws UnsupportedEncodingException {
		gatherModelSetting(model, session, gatherFilter, summaryUser);
		return prefixView + "item";
	}

	public void gatherModelSetting(Model model, HttpSession session, GatherFilter gatherFilter, SummaryUser summaryUser) {
		session.setAttribute("app-currentPage", 1);
		gatherFilter.setPagePerItem(12);
		
		model.addAttribute("categoryType", "app");
		model.addAttribute("itemName", gatherFilter.getItemName());
		model.addAttribute("categoryPn", gatherFilter.getCategoryPn());
	}

	@RequestMapping(value = "/ajax/productPagination.jt", method = RequestMethod.POST)
	@ResponseBody
	public Object ajaxGatherItem(GatherFilter gatherFilter, HttpSession session, SummaryUser summaryUser) {
		int currentPage = (Integer) session.getAttribute("app-currentPage") == null ? 1 : (Integer) session.getAttribute("app-currentPage");
		gatherFilter.setMobileFlag(true);
		gatherFilter.setCurrentPage(currentPage);
		gatherFilter.setPagePerItem(12);
		gatherFilter.setCustomerPn(summaryUser.getPn());
		Map<String, Object> object = new HashMap<String, Object>();
		if ("H".equals(gatherFilter.getNavFlag())) {
			object.put("mergeItems", gatherService.selectHotProductList(gatherFilter));
		} else {
			object.put("mergeItems", gatherService.selectNewMergeList(gatherFilter));
		}
		session.setAttribute("app-currentPage", (gatherFilter.getCurrentPage() + 1));
		return object;
	}

}
