package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.ProductGather;
import com.bg.jtown.business.home.HomeService;
import com.bg.jtown.business.home.ProductGatherService;
import com.bg.jtown.business.search.ProductGatherFilter;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.BrowserUtil;
import com.bg.jtown.util.CookieUtil;

@Controller
public class ProductGatherController {

	private static final Logger logger = LoggerFactory.getLogger(ProductGatherController.class);

	@Autowired
	private HomeService homeService;

	@Autowired
	private ProductGatherService productGatherService;

	private String prefixView = "views/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	private List<ProductGather> mergeList = null;
	private int mergeSize = 0;

	public void productGatherModelSetting(Model model, HttpSession session, ProductGatherFilter productGatherFilter, HttpServletRequest request) {
		session.setAttribute("currentPage", 1);
		productGatherFilter.setPagePerItem(30);
		mergeList = productGatherService.mergeProductGatherList(productGatherFilter);
		mergeSize = mergeList.size();
		productGatherFilter.setTotalCount(mergeSize);
		model.addAttribute("productGatherList", productGatherService.paginateItemList(mergeList, productGatherFilter));
		model.addAttribute("interestCategories", homeService.selecInterestCategory());
		model.addAttribute("categoryType", "pg");
	}

	@RequestMapping(value = "/g", method = RequestMethod.GET)
	public String productGatherView(Model model, HttpSession session, @ModelAttribute ProductGatherFilter productGatherFilter,
			SummaryUser summaryUser, HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/g";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		productGatherModelSetting(model, session, productGatherFilter, request);
		return prefixView + "product_gather";
	}

	@RequestMapping(value = "/g/cpn/{categoryPn}", method = RequestMethod.GET)
	public String productGatherCategoryView(Model model, HttpSession session, @ModelAttribute ProductGatherFilter productGatherFilter,
			SummaryUser summaryUser, HttpServletRequest request) throws UnsupportedEncodingException {
		if (BrowserUtil.isMobile(request)) {
			String value = CookieUtil.isCookie("SEE_PC_VERSION", request);
			if (value == null || !value.equals("T")) {
				return "redirect:/m/g/cpn/{categoryPn}";
			} else {
				model.addAttribute("isMobile", true);
			}
		}
		productGatherModelSetting(model, session, productGatherFilter, request);
		return prefixView + "product_gather";
	}

	@RequestMapping(value = "/g/", method = RequestMethod.GET)
	public String productGatherView() {
		return "redirect:/g";
	}

	@RequestMapping(value = "/ajax/productGatherPagination.jt", method = RequestMethod.POST)
	@ResponseBody
	public Object ajaxProductGatherItem(ProductGatherFilter productGatherFilter, HttpSession session) {
		// TODO
		int currentPage = (Integer) session.getAttribute("currentPage") == null ? 2 : (Integer) session.getAttribute("currentPage");
		productGatherFilter.setCurrentPage(currentPage);
		System.out.println("mergeSize : " + mergeSize);
		
		productGatherFilter.setPagePerItem(30);
		productGatherFilter.setTotalCount(mergeSize);

		if (productGatherFilter.getTotalPageSize() > currentPage) {
			Map<String, Object> object = new HashMap<String, Object>();
			object.put("mergeItems", productGatherService.paginateItemList(mergeList, productGatherFilter));
			session.setAttribute("currentPage", (productGatherFilter.getCurrentPage() + 1));
			return object;
		} else {
			return null;
		}
	}

}
