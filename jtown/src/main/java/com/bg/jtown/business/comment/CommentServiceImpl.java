package com.bg.jtown.business.comment;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.util.Pagination;

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

	private static final Integer COMMENT_NUM_PER_PAGE = 5;

	@Resource
	private Publisher publisher;

	@Override
	public Integer selectCommentCount(CommentFilter commentFilter) {
		Integer count = getSqlSession().selectOne(
				"commentMapper.selectCommentCount", commentFilter);
		if (count == null) {
			return 0;
		}
		return count;
	}

	@Override
	public List<Comment> selectComment(CommentFilter commentFilter) {
		Pagination pagination = commentFilter.getPagination();
		int count = selectCommentCount(commentFilter);
		if (count == 0) {
			return new ArrayList<Comment>();
		}
		pagination.setNumItems(count);
		pagination.setNumItemsPerPage(COMMENT_NUM_PER_PAGE);

		List<Comment> comments = getSqlSession().selectList(
				"commentMapper.selectComment", commentFilter);
		return comments;
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
		int count = selectCommentCount(new CommentFilter(comment.getSellerPn()));
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
		Integer count = selectCommentCount(new CommentFilter(
				comment.getSellerPn()));
		comment.setCount(count);
		comment.setRedisType("delete_comment");
		logger.debug(comment.toString());
		publisher.commentPublish(comment);
	}

}
