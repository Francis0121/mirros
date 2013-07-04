package com.bg.jtown.business.board;

import java.util.ArrayList;
import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Board;
import com.bg.jtown.business.search.BoardFilter;
import com.bg.jtown.util.Pagination;

/**
 * @author 김성근
 * 
 */
@Service
public class BoardServiceImpl extends SqlSessionDaoSupport implements
		BoardService {

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
