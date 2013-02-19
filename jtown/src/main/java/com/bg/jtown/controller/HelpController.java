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
public class HelpController {

	private static final Logger logger = LoggerFactory
			.getLogger(HelpController.class);

	@RequestMapping(value = "/help/notice", method = RequestMethod.GET)
	public String showNoticePage(Model model) {
		logger.debug("Show Notice Main Page");
		return "help/notice";
	}

	@RequestMapping(value = "/help/findUserInfo", method = RequestMethod.GET)
	public String showFindUserInfoPage(Model model) {
		logger.debug("Show FindUserInfo Main Page");
		return "help/findUserInfo";
	}

	@RequestMapping(value = "/help/qna", method = RequestMethod.GET)
	public String showQnaPage(Model model) {
		logger.debug("Show Qna Main Page");
		return "help/qna";
	}

	@RequestMapping(value = "/help/question", method = RequestMethod.GET)
	public String showQuestionPage(Model model) {
		logger.debug("Show Question Main Page");
		return "help/question";
	}

	@RequestMapping(value = "/help/serviceGuide", method = RequestMethod.GET)
	public String showServiceGuidePage(Model model) {
		logger.debug("Show ServiceGuide Main Page");
		return "help/serviceGuidp";
	}

	@RequestMapping(value = "/help/rule", method = RequestMethod.GET)
	public String showRulePage(Model model) {
		logger.debug("Show Rule Main Page");
		return "help/rule";
	}
}
