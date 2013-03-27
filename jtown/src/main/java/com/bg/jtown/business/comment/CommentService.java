package com.bg.jtown.business.comment;

import java.util.List;

import com.bg.jtown.business.Comment;

/**
 * @author Francis
 * 
 */
public interface CommentService {

	List<Comment> selectComment(Integer properNumber);

	Comment selectCommentOne(Integer commentPn);

	Comment insertComment(Comment comment);

	Comment updateComment(Comment comment);

	void deleteComment(Comment comment);

	Integer selectCommentCount(Integer properNumber);
}
