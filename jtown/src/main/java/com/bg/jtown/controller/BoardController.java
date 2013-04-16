package com.bg.jtown.controller;

import javax.annotation.Resource;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bg.jtown.business.board.Board;
import com.bg.jtown.business.board.BoardService;
import com.bg.jtown.business.search.BoardFilter;

@Controller
public class BoardController {

	@Resource
	private BoardService boardService;

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/notice", method = RequestMethod.GET)
	public String showNotice(Model model,
			@ModelAttribute BoardFilter boardFilter) {
		model.addAttribute("noticeList",
				boardService.selectNoticeList(boardFilter));
		return "admin/notice/list";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeWrite", method = RequestMethod.GET)
	public String showNoticeWrite(Model model, @ModelAttribute Board board) {
		return "admin/notice/write";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeWrite", method = RequestMethod.POST)
	public String formNoticeWrite(Model model, @ModelAttribute Board board) {
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
	public String showNoticeModifyPost(Model model, @ModelAttribute Board board) {
		boardService.updateNotice(board);
		model.addAttribute("notice", boardService.selectNoticeContent(board));
		return "redirect:noticeContent?pn=" + board.getPn();
	}
}
