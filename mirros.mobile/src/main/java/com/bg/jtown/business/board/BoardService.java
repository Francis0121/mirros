package com.bg.jtown.business.board;

import java.util.List;

import com.bg.jtown.business.Board;
import com.bg.jtown.business.search.BoardFilter;

/**
 * @author 박광열
 * 
 */
public interface BoardService {

	Board selectNoticeContent(Board board);

	List<Board> selectNoticeList(BoardFilter boardFilter);

	Integer selectNoticeCount(BoardFilter boardFilter);

	void updateReadCount(Integer pn);

	List<Board> selectBeforeAfterNotice(Board board);
}
