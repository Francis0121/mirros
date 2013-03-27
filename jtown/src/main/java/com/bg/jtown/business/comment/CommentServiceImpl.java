package com.bg.jtown.business.comment;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.redis.Publisher;

/**
 * <h1>각 판매자 별 댓글</h1>
 * 
 * @author Francis
 * 
 */
@Service
public class CommentServiceImpl extends SqlSessionDaoSupport implements
		CommentService {

	private static Logger logger = LoggerFactory
			.getLogger(CommentServiceImpl.class);

	@Resource
	private Publisher publisher;

	@Override
	public List<Comment> selectComment(Integer properNumber) {
		return getSqlSession().selectList("commentMapper.selectComment",
				properNumber);
	}

	@Override
	public Comment selectCommentOne(Integer commentPn) {
		return getSqlSession().selectOne("commentMapper.selectCommentOne",
				commentPn);
	}

	@Override
	public Comment insertComment(Comment comment) {
		getSqlSession().insert("commentMapper.insertComment", comment);
		Comment newComment = selectCommentOne(comment.getCommentPn());
		int count = selectCommentCount(comment.getSellerPn());
		newComment.setCount(count);
		newComment.setRedisType("insert_comment");
		publisher.commentPublish(newComment);
		logger.debug(newComment.toString());
		return newComment;
	}

	@Override
	public Comment updateComment(Comment comment) {
		getSqlSession().update("commentMapper.updateComment", comment);
		Comment newComment = selectCommentOne(comment.getCommentPn());
		newComment.setRedisType("update_comment");
		publisher.commentPublish(newComment);
		logger.debug(newComment.toString());
		return newComment;
	}

	@Override
	public void deleteComment(Comment comment) {
		getSqlSession().update("commentMapper.deleteComment", comment);
		Integer count = selectCommentCount(comment.getSellerPn());
		comment.setCount(count);
		comment.setRedisType("delete_comment");
		logger.debug(comment.toString());
		publisher.commentPublish(comment);
	}

	@Override
	public Integer selectCommentCount(Integer properNumber) {
		Integer count = getSqlSession().selectOne(
				"commentMapper.selectCommentCount", properNumber);
		if (count == null) {
			return 0;
		}
		return count;
	}

}
