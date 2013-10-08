package com.bg.jtown.business;

public class QuestionSection {

	private QuestionCategory questionCategory = new QuestionCategory();

	private Integer pn;

	private String name;

	public QuestionSection() {
		super();
	}

	public QuestionCategory getQuestionCategory() {
		return questionCategory;
	}

	public void setQuestionCategory(QuestionCategory questionCategory) {
		this.questionCategory = questionCategory;
	}

	public Integer getPn() {
		return pn;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "QuestionSection [questionCategory=" + questionCategory
				+ ", pn=" + pn + ", name=" + name + "]";
	}

}
