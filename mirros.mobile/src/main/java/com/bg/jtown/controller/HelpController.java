package com.bg.jtown.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.bg.jtown.business.Board;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.Question;
import com.bg.jtown.business.QuestionSection;
import com.bg.jtown.business.board.BoardService;
import com.bg.jtown.business.help.HelpService;
import com.bg.jtown.business.home.HomeService;
import com.bg.jtown.business.search.BoardFilter;
import com.bg.jtown.controller.validator.PartnershipValidatorImpl;
import com.bg.jtown.controller.validator.QuestionValidatorImpl;
import com.bg.jtown.util.ValidationUtil;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class HelpController {

	@Resource
	private HelpService helpService;
	@Resource
	private BoardService boardService;
	@Resource
	private HomeService homeService;
	@Resource
	private PartnershipValidatorImpl partnershipValidatorImpl;

	@Resource
	private QuestionValidatorImpl questionValidatorImpl;

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
	public String showQuestion(Model model,
			@RequestParam(required = false) Integer result) {
		model.addAttribute("result", result);
		Map<String, List<QuestionSection>> questionCategoryMap = helpService
				.selectQuestionCategoriesMap();
		model.addAttribute("questionCategoryMap", questionCategoryMap);
		model.addAttribute("cQuestion", new Question());
		model.addAttribute("sQuestion", new Question());
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
		partnershipValidatorImpl.validate(partnership, result);
		if (!result.hasErrors()) {
			helpService.insertPartnership(partnership);
			model.addAttribute("result", 1);
			return "redirect:partnership";
		} else {
			List<Interest> interests = homeService.selecInterestCategory();
			model.addAttribute("interest", interests);
			return "help/partnership";
		}
	}

	@RequestMapping(value = "/help/cQuestion.jt", method = RequestMethod.POST)
	public String formCustomerQuestion(Model model,
			@ModelAttribute(value = "cQuestion") Question question,
			BindingResult result) {
		this.questionValidatorImpl.validate(question, result);

		if (result.hasErrors()) {
			Map<String, List<QuestionSection>> questionCategoryMap = helpService
					.selectQuestionCategoriesMap();
			model.addAttribute("questionCategoryMap", questionCategoryMap);
			model.addAttribute("sQuestion", new Question());
			return "help/question";
		} else {
			helpService.insertQuestion(question);
			return "redirect:question?result=7";
		}
	}

	@RequestMapping(value = "/help/sQuestion.jt", method = RequestMethod.POST)
	public String formSellerQuestion(Model model,
			@ModelAttribute(value = "sQuestion") Question question,
			BindingResult result) {
		this.questionValidatorImpl.validate(question, result);
		new Validator() {

			@Override
			public void validate(Object target, Errors errors) {
				Question question = (Question) target;

				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "shopPn",
						"question.shopPn.empty");

				String shopPn = question.getShopPn();
				if (!ValidationUtil.checkNullAndBlank(shopPn)) {
					if (!ValidationUtil.onlyNumber(shopPn)) {
						errors.rejectValue("shopPn", "question.shopPn.notAllow");
					} else {
						if (!ValidationUtil.lengthCheck(shopPn, 5, 6)) {
							errors.rejectValue("shopPn",
									"question.shopPn.notAllow");
						}
					}
				}
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return Question.class.isAssignableFrom(clazz);
			}
		}.validate(question, result);

		if (result.hasErrors()) {
			Map<String, List<QuestionSection>> questionCategoryMap = helpService
					.selectQuestionCategoriesMap();
			model.addAttribute("questionCategoryMap", questionCategoryMap);
			model.addAttribute("cQuestion", new Question());
			return "help/question";
		} else {
			helpService.insertQuestion(question);
			return "redirect:question?result=7";
		}
	}
}
