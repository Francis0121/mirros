package com.bg.jtown.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bg.jtown.business.SellerService;
import com.bg.jtown.security.JtownUser;

/**
 * @author Francis, 김성근
 * 
 */
@Controller
public class SellerControlller {

	private static final Logger logger = LoggerFactory
			.getLogger(SellerControlller.class);

	@Resource
	private SellerService sellerService;

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/{p}", method = RequestMethod.GET)
	public String showSellerPage(@PathVariable(value = "p") Integer sellerPn,
			Model model) {
		JtownUser user = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		if (!user.getPn().equals(sellerPn)) {
			logger.debug("Deny Seller page No Permission");
			return "noPermission";
		}
		logger.debug("Show seller page");
		JtownUser jtownUser = sellerService.selectSellerInformation(sellerPn);
		model.addAttribute("jtownUser", jtownUser);
		return "seller";
	}
}
