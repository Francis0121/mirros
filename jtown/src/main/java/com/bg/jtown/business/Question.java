package com.bg.jtown.business;

public class Question {

	/**
	 * 사용 브라우저
	 */
	private String browser;

	/**
	 * 내용
	 */
	private String content;

	/**
	 * 작성자 이메일
	 */
	private String email;

	/**
	 * 입력날짜
	 */
	private String inputDate;

	/**
	 * 작성자명
	 */
	private String name;

	/**
	 * FAQ 고유번호
	 */
	private Integer pn;

	/**
	 * 문의분류
	 */
	private QuestionSection questionSection = new QuestionSection();

	/**
	 * 사업자번호
	 */
	private String shopPn;

	/**
	 * 제목
	 */
	private String title;

	public Question() {
		super();
	}

	public String getBrowser() {
		return browser;
	}

	public String getContent() {
		return content;
	}

	public String getEmail() {
		return email;
	}

	public String getInputDate() {
		return inputDate;
	}

	public String getName() {
		return name;
	}

	public Integer getPn() {
		return pn;
	}

	public QuestionSection getQuestionSection() {
		return questionSection;
	}

	public String getShopPn() {
		return shopPn;
	}

	public String getTitle() {
		return title;
	}

	public void setBrowser(String browser) {
		this.browser = browser;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setQuestionSection(QuestionSection questionSection) {
		this.questionSection = questionSection;
	}

	public void setShopPn(String shopPn) {
		this.shopPn = shopPn;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Override
	public String toString() {
		return "Question [browser=" + browser + ", content=" + content
				+ ", email=" + email + ", inputDate=" + inputDate + ", name="
				+ name + ", pn=" + pn + ", questionSection=" + questionSection
				+ ", shopPn=" + shopPn + ", title=" + title + "]";
	}
	
	
}
