package com.bg.jtown.business.board;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.UserCustomerTest;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "../../spring-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class BoardTest {

	private static Logger logger = LoggerFactory
			.getLogger(UserCustomerTest.class);

	// ~ Dynamic Injection
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	@Resource
	private LoginService loginService;
	@Resource
	private BoardService boardService;

	// ~ Variable
	private JtownUser jtownUser = new JtownUser();
	private Board board1;
	private Board board2;

	// ~ Method

	@Before
	public void BEFORE_TEST() throws Exception {
		jtownUser.setUsername("admin01");
		jtownUser.setPassword("1q2w3e4r!");

		loginService.deleteUserAll();
		customJdbcUserDetailManager.createUserAdminAndAuthority(jtownUser);

		logger.debug(jtownUser.toString());
		Integer pn = jtownUser.getPn();

		board1 = new Board(null, "제목", "내용", null, null, pn);
		board2 = new Board(null, "제목2", "내용2", null, null, pn);
	}

	@Test
	public void 공지사항_입력() throws Exception {
		boardService.deleteBoard(new Board());
		int count = boardService.selectNoticeCount(new BoardFilter());
		assertThat(count, is(0));

		boardService.insertNoticeWrite(board1);
		Board loadBoard = boardService.selectNoticeContent(board1);

		confirmBoardAndLoadBoard(board1, loadBoard);
	}

	@Test
	public void 공지사항_수정() throws Exception {
		boardService.deleteBoard(new Board());
		int count = boardService.selectNoticeCount(new BoardFilter());
		assertThat(count, is(0));

		boardService.insertNoticeWrite(board1);
		boardService.insertNoticeWrite(board2);

		board1.setContent("내용수정");
		board1.setTitle("제목수정");

		boardService.updateNotice(board1);

		Board loadBoard;

		loadBoard = boardService.selectNoticeContent(board1);
		confirmBoardAndLoadBoard(board1, loadBoard);

		loadBoard = boardService.selectNoticeContent(board2);
		confirmBoardAndLoadBoard(board2, loadBoard);
	}

	@Test
	public void 공지사항_삭제() throws Exception {
		boardService.deleteBoard(new Board());
		int count = boardService.selectNoticeCount(new BoardFilter());
		assertThat(count, is(0));

		boardService.insertNoticeWrite(board1);
		boardService.insertNoticeWrite(board2);

		boardService.deleteBoard(board1);
		count = boardService.selectNoticeCount(new BoardFilter());
		assertThat(count, is(1));

		Board loadBoard = boardService.selectNoticeContent(board2);
		confirmBoardAndLoadBoard(board2, loadBoard);
	}

	@Test
	public void 공지사항_페이징_처리() throws Exception {
		boardService.deleteBoard(new Board());
		int count = boardService.selectNoticeCount(new BoardFilter());
		assertThat(count, is(0));

		for (int i = 0; i < 14; i++) {
			boardService.insertNoticeWrite(board1);
		}
		BoardFilter boardFilter = new BoardFilter();
		
		boardFilter.setPage(1);
		List<Board> boards = boardService.selectNoticeList(boardFilter);
		assertThat(boards.size(), is(10));
		
		boardFilter.setPage(2);
		boards = boardService.selectNoticeList(boardFilter);
		assertThat(boards.size(), is(4));
		
		boardFilter.setPage(3);
		boards = boardService.selectNoticeList(boardFilter);
		assertThat(boards.size(), is(0));
	}

	private void confirmBoardAndLoadBoard(Board board, Board loadBoard) {
		assertThat(board.getTitle(), is(loadBoard.getTitle()));
		assertThat(board.getContent(), is(loadBoard.getContent()));
	}

}
