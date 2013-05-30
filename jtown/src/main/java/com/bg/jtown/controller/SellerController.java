package com.bg.jtown.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Product;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.FileVO;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.seller.SellerService;

/**
 * @author Francis
 * 
 */
@Controller
public class SellerController {

	private static final Logger logger = LoggerFactory
			.getLogger(SellerController.class);

	@Resource
	private SellerService sellerService;

	// ~ Show

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/{p}", method = RequestMethod.GET)
	public String showSeller(@PathVariable(value = "p") Integer sellerPn,
			@RequestParam(required = false) Integer error, Model model,
			SummaryUser summaryUser) {
		if (summaryUser.getEnumAuthority().equals(Authority.SELLER)) {
			if (!summaryUser.getPn().equals(sellerPn)) {
				logger.warn("Deny Seller page No Permission [ Access = "
						+ summaryUser.getPn() + ", IP = "
						+ summaryUser.getRemoteIp() + " ] ");
				return "redirect:../noPermission";
			}
		}
		model.addAllAttributes(sellerService.selectAllInformation(sellerPn));
		if (error != null) {
			model.addAttribute("error", error);
		}
		return "seller";
	}

	// ~ Form

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/dp.jt", method = RequestMethod.POST)
	public String formDeleteProduct(Model model,
			@ModelAttribute Product product, SummaryUser summaryUser) {
		product.setSellerPn(summaryUser.getPn());
		boolean result = sellerService.deleteSellerProduct(product);
		if (!result) {
			model.addAttribute("error", 1);
		}
		return "redirect:" + summaryUser.getPn();
	}

	// ~ Ajax

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/insertProduct.jt", method = RequestMethod.POST)
	@ResponseBody
	public Product ajaxChangeNotice(@RequestBody Product product,
			SummaryUser summaryUser) {
		product.setSellerPn(summaryUser.getPn());
		sellerService.insertSellerProduct(product);
		return product;
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeMainImage.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeMainImage(@RequestBody FileVO fileVO,
			SummaryUser summaryUser) {
		fileVO.setOwnerPn(summaryUser.getPn());
		sellerService.updateSellerImage(fileVO);
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeNotice.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeNotice(@RequestBody JtownUser jtownUser,
			SummaryUser summaryUser) {
		jtownUser.setPn(summaryUser.getPn());
		sellerService.updateSellerNotice(jtownUser);
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeLongNotice.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeLongNotice(@RequestBody JtownUser jtownUser,
			SummaryUser summaryUser) {
		jtownUser.setPn(summaryUser.getPn());
		sellerService.updateSellerLongNotice(jtownUser);
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeEvent.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeEvent(@RequestBody Event event,
			SummaryUser summaryUser) {
		event.setSellerPn(summaryUser.getPn());
		event.setBannerType(1);
		sellerService.updateAndInsertEvent(event);
	}

}
