package com.bg.jtown.business.board;

import java.util.ArrayList;
import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.search.BoardFilter;
import com.bg.jtown.util.Pagination;

/**
 * @author 박광열
 * 
 */
@Service
public class BoardServiceImpl extends SqlSessionDaoSupport implements
		BoardService {

	private static Logger logger = LoggerFactory
			.getLogger(BoardServiceImpl.class);

	@Override
	public void insertNoticeWrite(Board board) {
		getSqlSession().insert("boardMapper.insertNoticeWrite", board);
	}

	@Override
	public void updateNotice(Board board) {
		getSqlSession().update("boardMapper.updateNotice", board);
	}

	@Override
	public void deleteBoard(Board board) {
		getSqlSession().delete("boardMapper.deleteNotice", board);
	}

	@Override
	public List<Board> selectNoticeList(BoardFilter boardFilter) {
		Pagination pagination = boardFilter.getPagination();
		int count = selectNoticeCount(boardFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<Board>();
		}
		List<Board> boards = getSqlSession().selectList(
				"boardMapper.selectNoticeList", boardFilter);
		return boards;
	}

	@Override
	public Board selectNoticeContent(Board board) {
		Board loadBoard = getSqlSession().selectOne(
				"boardMapper.selectNoticeContent", board);
		return loadBoard;
	}

	@Override
	public Integer selectNoticeCount(BoardFilter boardFilter) {
		Integer count = getSqlSession().selectOne(
				"boardMapper.selectNoticeCount", boardFilter);
		return count;
	}

	@Override
	public void updateReadCount(Integer pn) {
		getSqlSession().update("boardMapper.increaseReadCount", pn);
	}

	@Override
	public List<Board> selectBeforeAfterNotice(Board board) {
		return getSqlSession().selectList(
				"boardMapper.selectBeforeAfterNotice", board);
	}
}
