package com.bg.jtown.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.bg.jtown.business.HomeService;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.board.Board;
import com.bg.jtown.business.board.BoardService;
import com.bg.jtown.business.help.HelpService;
import com.bg.jtown.business.search.BoardFilter;
import com.bg.jtown.controller.validator.PartnershipValidator;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class HelpController {

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
	public String showNotice(Model model,
			@ModelAttribute BoardFilter boardFilter) {
		model.addAttribute("noticeList",
				boardService.selectNoticeList(boardFilter));
		return "help/notice";
	}

	@RequestMapping(value = "/help/notice/content", method = RequestMethod.GET)
	public String showNoticeContent(Model model, @ModelAttribute Board board) {
		boardService.updateReadCount(board.getPn());
		model.addAttribute("noticeContent",
				boardService.selectNoticeContent(board));
		model.addAttribute("noticeList",
				boardService.selectBeforeAfterNotice(board));
		return "help/noticeContent";
	}

	@RequestMapping(value = "/help/question", method = RequestMethod.GET)
	public String showQuestion(Model model) {
		return "help/question";
	}

	@RequestMapping(value = "/help/serviceGuide", method = RequestMethod.GET)
	public String showServiceGuide(Model model) {
		return "help/serviceGuide";
	}

	@RequestMapping(value = "/help/partnership", method = RequestMethod.GET)
	public String showRule(Model model,
			@RequestParam(required = false) Integer result) {
		List<Interest> interests = homeService.selecInterestCategory();
		model.addAttribute("interest", interests);
		model.addAttribute("partnership", new Partnership());
		model.addAttribute("result", result);
		return "help/partnership";
	}

	// ~ Form

	@RequestMapping(value = "/help/partnership.jt", method = RequestMethod.POST)
	public String formSumbitPartnership(Model model,
			@ModelAttribute Partnership partnership, BindingResult result) {
		this.partnershipValidator.validate(partnership, result);

		if (!result.hasErrors()) {
			partnership.setProcess(PROCESS_RECEIPT);
			helpService.insertPartnership(partnership);
			model.addAttribute("result", 1);
			return "redirect:partnership";
		} else {
			List<Interest> interests = homeService.selecInterestCategory();
			model.addAttribute("interest", interests);
			return "help/partnership";
		}
	}
}
