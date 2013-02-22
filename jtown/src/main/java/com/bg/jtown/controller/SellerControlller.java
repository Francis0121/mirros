package com.bg.jtown.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Francis, 김성근
 * 
 */
@Controller
public class SellerControlller {

	private static final Logger logger = LoggerFactory
			.getLogger(SellerControlller.class);

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/{p}", method = RequestMethod.GET)
	public String showSellerPage(@PathVariable(value = "p") Integer sellerPn,
			Model model) {
		logger.debug("Show seller page");
		logger.debug(sellerPn.toString());
		return "seller";
	}
}
