package com.bg.jtown.business.board;

import java.util.List;

public interface BoardService {

	void insertNoticeWrite(Board board);

	List<Board> selectNoticeList();

	Board selectNoticeContent(Board board);

	void updateNotice(Board board);

}
