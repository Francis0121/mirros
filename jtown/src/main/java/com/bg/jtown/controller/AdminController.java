package com.bg.jtown.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class AdminController {

	private static final Logger logger = LoggerFactory
			.getLogger(AdminController.class);

	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String showAdminPage(Model model) {
		logger.debug("Show Admin Page");
		return "admin/main";
	}

	@RequestMapping(value = "/admin/qna", method = RequestMethod.GET)
	public String showQnaPage(Model model) {
		logger.debug("Show Qna Page");
		return "admin/qna";
	}

	@RequestMapping(value = "/admin/qnaSeller", method = RequestMethod.GET)
	public String showQnaSellerPage(Model model) {
		logger.debug("Show QnaSeller Page");
		return "admin/qnaSeller";
	}

	@RequestMapping(value = "/admin/qnaCustomer", method = RequestMethod.GET)
	public String showQnaCustomerPage(Model model) {
		logger.debug("Show QnaCustomer Page");
		return "admin/qnaCustomer";
	}

	@RequestMapping(value = "/admin/users", method = RequestMethod.GET)
	public String showUsersPage(Model model) {
		logger.debug("Show Users Page");
		return "admin/users";
	}

	@RequestMapping(value = "/admin/customer", method = RequestMethod.GET)
	public String showCustomerPage(Model model) {
		logger.debug("Show Customer Page");
		return "admin/customer";
	}

	@RequestMapping(value = "/admin/seller", method = RequestMethod.GET)
	public String showSellerPage(Model model) {
		logger.debug("Show Seller Page");
		return "admin/seller";
	}

	@RequestMapping(value = "/admin/administrator", method = RequestMethod.GET)
	public String showAdministratorPage(Model model) {
		logger.debug("Show Administrator Page");
		return "admin/Administrator";
	}
}
