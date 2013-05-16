package com.bg.jtown.business.comment;

import java.util.List;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.search.CommentFilter;

/**
 * @author Francis
 * 
 */
public interface CommentService {

	// ~ Comment

	Integer selectCommentCount(CommentFilter commentFilter);

	List<Comment> selectCommentTop(CommentFilter commentFilter);

	List<Comment> selectComment(CommentFilter commentFilter);

	Comment selectCommentOne(Integer commentPn);

	Comment insertComment(Comment comment);

	Comment updateComment(Comment comment);

	void deleteComment(Comment comment);

	// ~ CommentLove

	Integer selectCommentLoveCount(Comment comment);

	List<Comment> selectCommentLove(Comment comment);

	void insertCommentLove(Comment comment);

	void deleteCommentLove(Comment comment);

	void toggleCommentLove(Comment comment);

	// ~ WarnComment
	
	void insertWarnComment(Comment comment);

}
