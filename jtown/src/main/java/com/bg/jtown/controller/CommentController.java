package com.bg.jtown.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.security.JtownUser;

@Controller
public class CommentController {

	@Resource
	private CommentService commentService;

	// ~ ajax

	@RequestMapping(value = "/ajax/home/selectComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Comment> ajaxSelectComment(
			@RequestBody CommentFilter commentFilter) {
		return commentService.selectComment(commentFilter);
	}

	@RequestMapping(value = "/ajax/home/insertComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxInsertComment(@RequestBody Comment comment) {
		JtownUser user = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		comment.setCustomerPn(user.getPn());
		return commentService.insertComment(comment);
	}

	@RequestMapping(value = "/ajax/home/updateComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxUpdateComment(@RequestBody Comment comment) {
		JtownUser user = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		comment.setCustomerPn(user.getPn());
		return commentService.updateComment(comment);
	}

	@RequestMapping(value = "/ajax/home/deleteComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxDeleteComment(@RequestBody Comment comment) {
		JtownUser user = (JtownUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		comment.setCustomerPn(user.getPn());
		commentService.deleteComment(comment);
	}
}
