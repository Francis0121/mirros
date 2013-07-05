package com.bg.jtown.controller;

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

import com.bg.jtown.business.Board;
import com.bg.jtown.business.board.BoardService;
import com.bg.jtown.business.search.BoardFilter;

@Controller
@RequestMapping("/admin")
public class BoardController {

	@Resource
	private BoardService boardService;

	private String prefiexView = "views/content/admin/";

	public void setPrefiexView(String prefiexView) {
		this.prefiexView = prefiexView;
	}

	@RequestMapping(value = "/notice", method = RequestMethod.GET)
	public String showNotice(Model model,
			@ModelAttribute BoardFilter boardFilter) {
		model.addAttribute("noticeList",
				boardService.selectNoticeList(boardFilter));
		return prefiexView + "notice/list";
	}

	@RequestMapping(value = "/noticeWrite", method = RequestMethod.GET)
	public String showNoticeWrite(Model model, @ModelAttribute Board board) {
		Integer pn = board.getPn();
		if (pn != null && !pn.equals(0)) {
			model.addAttribute("board", boardService.selectNoticeContent(board));
		}
		return prefiexView + "notice/write";
	}

	@RequestMapping(value = "/noticeWrite", method = RequestMethod.POST)
	public String formNoticeWrite(Model model, @ModelAttribute Board board,
			BindingResult result) {
		new Validator() {

			@Override
			public void validate(Object target, Errors errors) {
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "title",
						"board.title.empty", "제목을 입력해 주시기 바랍니다.");
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return Board.class.isAssignableFrom(clazz);
			}
		}.validate(board, result);

		if (result.hasErrors()) {
			return prefiexView + "notice/write";
		} else {
			boardService.insertNoticeWrite(board);
			return "redirect:/" + prefiexView + "notice";
		}
	}

	@RequestMapping(value = "/noticeWrite", method = RequestMethod.DELETE)
	public String formNoticeDelete(Model model, @ModelAttribute Board board) {
		boardService.deleteBoard(board);
		return "redirect:/" + prefiexView + "notice";
	}

	@RequestMapping(value = "/noticeContent", method = RequestMethod.GET)
	public String showNoticeContent(Model model, @ModelAttribute Board board) {
		model.addAttribute("notice", boardService.selectNoticeContent(board));
		model.addAttribute("noticeList",
				boardService.selectBeforeAfterNotice(board));
		return prefiexView + "notice/content";
	}

	@RequestMapping(value = "/noticeWrite", method = RequestMethod.PUT)
	public String showNoticeModifyPost(Model model,
			@ModelAttribute Board board, BindingResult result) {
		new Validator() {

			@Override
			public void validate(Object target, Errors errors) {
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "title",
						"board.title.empty", "제목을 입력해 주시기 바랍니다.");
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return Board.class.isAssignableFrom(clazz);
			}
		}.validate(board, result);
		if (result.hasErrors()) {
			return prefiexView + "notice/write";
		} else {
			boardService.updateNotice(board);
			model.addAttribute("notice",
					boardService.selectNoticeContent(board));
			return "redirect:noticeContent?pn=" + board.getPn();
		}

	}
}
