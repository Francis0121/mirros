package com.bg.jtown.business.board;

public class Board {
	private Integer pn;
	private String title;
	private String content;
	private String inputDate;

	private Integer readCount;
	
	private Integer ownerPn;
	
	public Board() {
		// TODO Auto-generated constructor stub
	}
	
	public Board(Integer pn, String title, String content, String inputDate,
			Integer readCount, Integer ownerPn) {
		super();
		this.pn = pn;
		this.title = title;
		this.content = content;
		this.inputDate = inputDate;
		this.readCount = readCount;
		this.ownerPn = ownerPn;
	}

	public String getContent() {
		return content;
	}

	public String getInputDate() {
		return inputDate;
	}

	public Integer getOwnerPn() {
		return ownerPn;
	}

	public Integer getPn() {
		return pn;
	}

	public Integer getReadCount() {
		return readCount;
	}

	public String getTitle() {
		return title;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}

	public void setOwnerPn(Integer ownerPn) {
		this.ownerPn = ownerPn;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setReadCount(Integer readCount) {
		this.readCount = readCount;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Override
	public String toString() {
		return "Board [pn=" + pn + ", title=" + title + ", content=" + content
				+ ", inputDate=" + inputDate + ", readCount=" + readCount
				+ ", ownerPn=" + ownerPn + "]";
	}	
	
}
