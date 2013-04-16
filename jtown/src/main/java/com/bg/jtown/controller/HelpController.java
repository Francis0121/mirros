package com.bg.jtown.controller;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.bg.jtown.business.HomeService;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.board.BoardService;
import com.bg.jtown.business.help.HelpService;
import com.bg.jtown.controller.validator.PartnershipValidator;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class HelpController {

	private static Logger logger = LoggerFactory
			.getLogger(HelpController.class);

	private static final Integer PROCESS_RECEIPT = 1;

	@Resource
	private HelpService helpService;
	@Resource
	private BoardService boardService;
	@Resource
	private HomeService homeService;
	@Resource
	private PartnershipValidator partnershipValidator;

	// ~ Show

	@RequestMapping(value = "/help/notice", method = RequestMethod.GET)
	public String showNoticePage(Model model) {
		logger.debug("Show Notice Main Page");
		return "help/notice";
	}

	@RequestMapping(value = "/help/question", method = RequestMethod.GET)
	public String showQuestionPage(Model model) {
		logger.debug("Show Question Main Page");
		return "help/question";
	}

	@RequestMapping(value = "/help/serviceGuide", method = RequestMethod.GET)
	public String showServiceGuidePage(Model model) {
		logger.debug("Show ServiceGuide Main Page");
		return "help/serviceGuide";
	}

	@RequestMapping(value = "/help/partnership", method = RequestMethod.GET)
	public String showRulePage(Model model,
			@RequestParam(required = false) Integer result) {
		logger.debug("Show Rule Main Page");
		List<Interest> interests = homeService.selecInterestCategory();
		model.addAttribute("interest", interests);
		model.addAttribute("partnership", new Partnership());
		model.addAttribute("result", result);
		return "help/partnership";
	}

	// ~ Form

	@RequestMapping(value = "/help/partnership.jt", method = RequestMethod.POST)
	public ModelAndView formSumbitPartnership(
			@ModelAttribute Partnership partnership, BindingResult result) {
		this.partnershipValidator.validate(partnership, result);

		ModelAndView mav;
		if (!result.hasErrors()) {
			mav = new ModelAndView(new RedirectView("partnership"));
			partnership.setProcess(PROCESS_RECEIPT);
			helpService.insertPartnership(partnership);
			mav.addObject("result", 1);
		} else {
			mav = new ModelAndView("help/partnership");
			List<Interest> interests = homeService.selecInterestCategory();
			mav.addObject("interest", interests);
		}
		return mav;
	}
}
