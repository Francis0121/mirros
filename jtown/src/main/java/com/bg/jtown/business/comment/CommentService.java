package com.bg.jtown.business.comment;

import java.util.List;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Gather;
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

	Comment selectCommentDefaultOne(Integer commentPn);

	Boolean selectExistComment(Comment comment);

	Boolean selectExistLove(Count count);

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

	// ~ productComment

	void insertProductComment(Comment comment);

	Integer selectCommentExist(Comment comment);

	List<Comment> selectCommentList(Comment comment);

	Integer selectProductCommentWarnExist(Comment comment);

	Integer selectUserCommentExist(Comment comment);

	void insertProductCommentWarn(Comment comment);

	void deleteProductComment(Comment comment);

	List<Comment> selectCommentFeedList();
	
	Gather selectCommentFeedItem(Integer commnetPn);
	
	//~ EventComment
	
	void insertEventComment(Comment comment);
	
	void deleteEventComment(Comment comment);
	
	Integer selectEventCommentExist(Comment comment);
	
	List<Comment> selectEventCommentList(Comment comment);
	
	Integer selectUserEventCommentExist(Comment comment);
	
	Gather selectEventCommentFeedItem(Integer commnetPn);
	
	Integer selectEventCommentWarnExist(Comment comment);
	
	void insertEventCommentWarn(Comment comment);

}
