package com.bg.jtown.business.board;

import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

/**
 * @author 박광열
 * 
 */
@Service
public class BoardServiceImpl extends SqlSessionDaoSupport implements
		BoardService {

	@Override
	public void insertNoticeWrite(Board board) {
		getSqlSession().insert("boardMapper.insertNoticeWrite", board);

	}

	@Override
	public void updateNotice(Board board) {
		getSqlSession().update("boardMapper.updateNotice", board);
	}

	@Override
	public List<Board> selectNoticeList() {
		return getSqlSession().selectList("boardMapper.selectNoticeList");
	}

	@Override
	public Board selectNoticeContent(Board board) {
		return getSqlSession().selectOne("boardMapper.selectNoticeContent",
				board);
	}

}
