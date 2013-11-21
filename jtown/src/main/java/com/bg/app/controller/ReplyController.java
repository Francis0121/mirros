package com.bg.app.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.security.SummaryUser;

@Controller
@RequestMapping("/app")
public class ReplyController {

	@Autowired
	private CommentService commentService;

	private String prefixView = "views_webapp/content/";

	@RequestMapping(value = "/reply", method = RequestMethod.GET)
	public String replyView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter, SummaryUser summaryUser) {

		model.addAttribute("commentFeed", commentService.selectCommentFeedList());
		return prefixView + "reply";
	}

}
