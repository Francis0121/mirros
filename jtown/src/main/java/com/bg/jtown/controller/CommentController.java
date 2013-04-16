package com.bg.jtown.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.SummaryUser;

@Controller
public class CommentController {

	@Resource
	private CommentService commentService;

	// ~ ajax

	@RequestMapping(value = "/ajax/home/selectCommentBest.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Comment> ajaxSelectCommentTop(
			@RequestBody CommentFilter commentFilter, SummaryUser summaryUser) {
		if (summaryUser.getEnumAuthority().equals(Authority.CUSTOMER)) {
			commentFilter.setCustomerPn(summaryUser.getPn());
		}
		return commentService.selectCommentTop(commentFilter);
	}

	@RequestMapping(value = "/ajax/home/selectComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Comment> ajaxSelectComment(
			@RequestBody CommentFilter commentFilter, SummaryUser summaryUser) {
		if (summaryUser.getEnumAuthority().equals(Authority.CUSTOMER)) {
			commentFilter.setCustomerPn(summaryUser.getPn());
		}
		return commentService.selectComment(commentFilter);
	}

	@RequestMapping(value = "/ajax/home/insertComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxInsertComment(@RequestBody Comment comment,
			SummaryUser summaryUser) {
		comment.setCustomerPn(summaryUser.getPn());
		return commentService.insertComment(comment);
	}

	@RequestMapping(value = "/ajax/home/updateComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxUpdateComment(@RequestBody Comment comment,
			SummaryUser summaryUser) {
		comment.setCustomerPn(summaryUser.getPn());
		return commentService.updateComment(comment);
	}

	@RequestMapping(value = "/ajax/home/deleteComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxDeleteComment(@RequestBody Comment comment,
			SummaryUser summaryUser) {
		comment.setCustomerPn(summaryUser.getPn());
		commentService.deleteComment(comment);
	}

	@RequestMapping(value = "/ajax/home/toggleCommentLove.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxInsertCommentLove(@RequestBody Comment comment,
			SummaryUser summaryUser) {
		if (summaryUser.getEnumAuthority().equals(Authority.CUSTOMER)) {
			comment.setCustomerPn(summaryUser.getPn());
			commentService.toggleCommentLove(comment);
		} else if (summaryUser.getEnumAuthority().equals(Authority.NOT_LOGIN)) {
			comment.setMessage("로그인한 사용자만 이용가능합니다.");
		} else {
			comment.setMessage("판매자는 불가능 합니다.");
		}
		return comment;
	}
}
