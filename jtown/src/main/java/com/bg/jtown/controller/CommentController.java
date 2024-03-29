package com.bg.jtown.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.CommentAjax;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.SummaryUser;

@Controller
public class CommentController {

	// ~ static

	private static Logger logger = LoggerFactory
			.getLogger(CommentController.class);

	@Resource
	private CommentService commentService;

	// ~ ajax

	@RequestMapping(value = "/ajax/home/selectCommentOne.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxSelectCommentOne(@RequestBody Comment comment) {
		return commentService.selectCommentDefaultOne(comment.getCommentPn());
	}

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
	public Object ajaxSelectComment(
			@RequestBody CommentFilter commentFilter, SummaryUser summaryUser) {
		Map<String, Object> map = new HashMap<String, Object>();
		switch(summaryUser.getEnumAuthority()) {
		case ADMIN:
		case ROOT_ADMIN:
			map.put( "isAdmin", true );
			break;
		case CUSTOMER:
			commentFilter.setCustomerPn(summaryUser.getPn());
		}
		List<Comment> comments = commentService.selectComment(commentFilter);
		map.put( "comments", comments );
		return map;
	}

	@RequestMapping(value = "/ajax/home/existComment.jt", method = RequestMethod.POST)
	@ResponseBody
	public Object ajaxExistComment(@RequestBody Comment comment,
			SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("authority", authority);
		if (authority.equals(Authority.CUSTOMER)) {
			comment.setCustomerPn(summaryUser.getPn());
			map.put("result", commentService.selectExistComment(comment));
		} else {
			map.put("result", true);
		}
		return map;
	}

	@RequestMapping(value = "/ajax/home/existLove.jt", method = RequestMethod.POST)
	@ResponseBody
	public Boolean ajaxExistLove(@RequestBody Count count,
			SummaryUser summaryUser) {
		count.setCustomerPn(summaryUser.getPn());
		return commentService.selectExistLove(count);
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
		if( !summaryUser.getEnumAuthority().isAdmin() ){
			comment.setCustomerPn(summaryUser.getPn());
		}
		commentService.deleteComment(comment);
	}

	@RequestMapping(value = "/ajax/home/toggleCommentLove.jt", method = RequestMethod.POST)
	@ResponseBody
	public CommentAjax ajaxInsertCommentLove(@RequestBody Comment comment,
			SummaryUser summaryUser) {
		CommentAjax commentAjax = new CommentAjax();
		if (summaryUser.getEnumAuthority().equals(Authority.CUSTOMER)) {
			comment.setCustomerPn(summaryUser.getPn());
			commentService.toggleCommentLove(comment);
			commentAjax.setCrudType(comment.getCrudType());
		} else if (summaryUser.getEnumAuthority().equals(Authority.NOT_LOGIN)) {
			commentAjax.setMessage("1");
		} else {
			commentAjax.setMessage("2");
		}
		logger.debug(commentAjax.toString());
		return commentAjax;
	}
	
	@RequestMapping(value = "/ajax/home/warnCommentLove.jt", method = RequestMethod.POST)
	@ResponseBody
	public Comment ajaxWarnCommentLove(@RequestBody Comment comment,
			SummaryUser summaryUser) {
		if (summaryUser.getEnumAuthority().equals(Authority.CUSTOMER)) {
			comment.setCustomerPn(summaryUser.getPn());
			commentService.insertWarnComment(comment);
		} else if (summaryUser.getEnumAuthority().equals(Authority.NOT_LOGIN)) {
			comment.setMessage("로그인한 사용자만 이용가능합니다.");
		} else {
			comment.setMessage("판매자는 불가능 합니다.");
		}
		return comment;
	}
}
