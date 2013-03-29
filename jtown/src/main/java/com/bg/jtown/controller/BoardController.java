package com.bg.jtown.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.bg.jtown.business.board.Board;
import com.bg.jtown.business.board.BoardFilter;
import com.bg.jtown.business.board.BoardService;

@Controller
public class BoardController {
	private static Logger logger = LoggerFactory
			.getLogger(BoardController.class);

	@Resource
	private BoardService boardService;

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/notice", method = RequestMethod.GET)
	public String showNoticePage(Model model,
			@ModelAttribute BoardFilter boardFilter) {
		logger.debug("Show Notice Page");
		model.addAttribute("noticeList",
				boardService.selectNoticeList(boardFilter));
		return "admin/notice/list";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeWrite", method = RequestMethod.GET)
	public String showNoticeWritePage(Model model, @ModelAttribute Board board) {
		logger.debug("Show Notice Page");
		return "admin/notice/write";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeWrite", method = RequestMethod.POST)
	public String showNoticeWritePagePost(Model model,
			@ModelAttribute Board board) {
		logger.debug("Show Notice Page");
		boardService.insertNoticeWrite(board);
		return "redirect:/admin/notice";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeWrite", method = RequestMethod.DELETE)
	public String formNoticeDelete(Model model, @ModelAttribute Board board) {
		boardService.deleteBoard(board);
		return "redirect:/admin/notice";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeContent", method = RequestMethod.GET)
	public String showNoticeContent(Model model, @ModelAttribute Board board) {
		logger.debug("Show Notice Page");

		model.addAttribute("notice", boardService.selectNoticeContent(board));

		return "admin/notice/content";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeModify", method = RequestMethod.GET)
	public String showNoticeModify(Model model, @ModelAttribute Board board) {

		model.addAttribute("board", boardService.selectNoticeContent(board));

		return "admin/notice/modify";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeModify", method = RequestMethod.POST)
	public ModelAndView showNoticeModifyPost(@ModelAttribute Board board) {
		ModelAndView mav = new ModelAndView();
		
		boardService.updateNotice(board);
		
		mav.addObject("notice", boardService.selectNoticeContent(board));
		mav.setView(new RedirectView("noticeContent?pn=" + board.getPn()));
		return mav;

	}
}
