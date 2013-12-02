package com.bg.jtown.business.comment;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Gather;
import com.bg.jtown.business.search.CommentFilter;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.util.DateUtil;
import com.bg.jtown.util.Pagination;

/**
 * <h1>각 판매자 별 댓글</h1>
 * 
 * @author Francis
 * 
 */
@Service
public class CommentServiceImpl extends SqlSessionDaoSupport implements CommentService {

	private static Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

	private static final Integer COMMENT_NUM_PER_PAGE = 5;

	@Resource
	private Publisher publisher;

	// ~ Comment

	@Override
	public Integer selectCommentCount(CommentFilter commentFilter) {
		Integer count = getSqlSession().selectOne("commentMapper.selectCommentCount", commentFilter);
		if (count == null) {
			return 0;
		}
		return count;
	}

	public List<Comment> selectCommentTop(CommentFilter commentFilter) {
		Pagination pagination = commentFilter.getPagination();
		int count = selectCommentCount(commentFilter);
		if (count == 0) {
			return new ArrayList<Comment>();
		}
		pagination.setNumItems(count);
		pagination.setNumItemsPerPage(COMMENT_NUM_PER_PAGE);

		List<Comment> comments = getSqlSession().selectList("commentMapper.selectCommentTop", commentFilter);
		return comments;
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

		List<Comment> comments = getSqlSession().selectList("commentMapper.selectComment", commentFilter);
		return comments;
	}

	@Override
	public Comment selectCommentOne(Integer commentPn) {
		return getSqlSession().selectOne("commentMapper.selectCommentOne", commentPn);
	}

	@Override
	public Comment selectCommentDefaultOne(Integer commentPn) {
		return getSqlSession().selectOne("commentMapper.selectCommentDefaultOne", commentPn);
	}

	@Override
	public Boolean selectExistComment(Comment comment) {
		comment.setInputDate(DateUtil.getToday("YYYY-MM-DD"));
		List<Comment> comments = getSqlSession().selectList("commentMapper.selectExistComment", comment);
		return comments.size() > 0 ? true : false;
	}

	@Override
	public Boolean selectExistLove(Count count) {
		List<Count> counts = getSqlSession().selectList("commentMapper.selectExistLove", count);
		return counts.size() > 0 ? true : false;
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
		deleteCommentLove(comment);
		Integer count = selectCommentCount(new CommentFilter(comment.getSellerPn()));
		comment.setCount(count);
		comment.setRedisType("delete_comment");
		logger.debug(comment.toString());
		publisher.commentPublish(comment);
	}

	// ~ Comment Love

	@Override
	public List<Comment> selectCommentLove(Comment comment) {
		return getSqlSession().selectList("commentMapper.selectCommentLove", comment);
	}

	@Override
	public Integer selectCommentLoveCount(Comment comment) {
		return getSqlSession().selectOne("commentMapper.selectCommentLoveCount", comment);
	}

	@Override
	public void insertCommentLove(Comment comment) {
		getSqlSession().insert("commentMapper.insertCommentLove", comment);

	}

	@Override
	public void deleteCommentLove(Comment comment) {
		getSqlSession().insert("commentMapper.deleteCommentLove", comment);
	}

	@Override
	public void toggleCommentLove(Comment comment) {
		if (selectCommentLoveCount(comment) == 0) {
			comment.setCrudType("insert");
			insertCommentLove(comment);
		} else {
			comment.setCrudType("delete");
			deleteCommentLove(comment);
		}
		comment.setRedisType("love_comment");
		comment.setCustomerPn(null);
		comment.setCommentLoveCount(selectCommentLoveCount(comment));
		publisher.commentPublish(comment);
	}

	// ~ Warn Comment

	@Override
	public void insertWarnComment(Comment comment) {
		getSqlSession().insert("commentMapper.insertWarnComment", comment);
	}

	// ~ product Comment

	@Override
	public Integer selectProductCommentWarnExist(Comment comment) {
		return getSqlSession().selectOne("commentMapper.selectProductCommentWarnExist", comment);
	}

	@Override
	public void insertProductCommentWarn(Comment comment) {
		getSqlSession().insert("commentMapper.insertProductCommentWarn", comment);
	}

	@Override
	public void deleteProductComment(Comment comment) {
		getSqlSession().update("commentMapper.deleteProductComment", comment);
	}

	@Override
	public Integer selectUserCommentExist(Comment comment) {
		return getSqlSession().selectOne("commentMapper.selectUserCommentExist", comment);
	}

	@Override
	public void insertProductComment(Comment comment) {
		getSqlSession().insert("commentMapper.insertProductComment", comment);
		Gather selectedComment = selectCommentFeedItem(comment.getCommentPn());
		publisher.commentFeed(selectedComment);
	}

	@Override
	public Integer selectCommentExist(Comment comment) {
		return getSqlSession().selectOne("commentMapper.selectCommentExist", comment);
	}

	@Override
	public List<Comment> selectCommentList(Comment comment) {
		return getSqlSession().selectList("commentMapper.selectCommentList", comment);
	}

	@Override
	public List<Gather> selectCommentFeedList() {
		List<Gather> lists = getSqlSession().selectList("commentMapper.selectCommentFeedList");
		for (int idx = 0, size = lists.size(); idx < size; idx++) {
			lists.get(idx).setComparedTime(DateUtil.beforeRecodeTimeToString(lists.get(idx).getInputDate()));
		}
		return lists;
	}

	@Override
	public Gather selectCommentFeedItem(Integer commnetPn) {
		return getSqlSession().selectOne("commentMapper.selectCommentFeedItem", commnetPn);
	}

	// ~ Event Comment

	@Override
	public void insertEventComment(Comment comment) {
		getSqlSession().insert("commentMapper.insertEventComment", comment);
		Gather selectedComment = selectEventCommentFeedItem(comment.getCommentPn());
		publisher.commentFeed(selectedComment);
	}

	@Override
	public void deleteEventComment(Comment comment) {
		getSqlSession().update("commentMapper.deleteEventComment", comment);
	}

	@Override
	public Integer selectEventCommentExist(Comment comment) {
		return getSqlSession().selectOne("commentMapper.selectEventCommentExist", comment);
	}

	@Override
	public List<Comment> selectEventCommentList(Comment comment) {
		return getSqlSession().selectList("commentMapper.selectEventCommentList", comment);
	}

	@Override
	public Integer selectUserEventCommentExist(Comment comment) {
		return getSqlSession().selectOne("commentMapper.selectUserEventCommentExist", comment);
	}

	@Override
	public Gather selectEventCommentFeedItem(Integer commnetPn) {
		return getSqlSession().selectOne("commentMapper.selectEventCommentFeedItem", commnetPn);
	}

	@Override
	public Integer selectEventCommentWarnExist(Comment comment) {
		return getSqlSession().selectOne("commentMapper.selectEventCommentWarnExist", comment);
	}

	@Override
	public void insertEventCommentWarn(Comment comment) {
		getSqlSession().insert("commentMapper.insertEventCommentWarn", comment);
	}

}
