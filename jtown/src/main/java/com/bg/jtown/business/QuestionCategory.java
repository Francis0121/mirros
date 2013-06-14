package com.bg.jtown.business;

import java.util.List;

public class QuestionCategory {

	private String name;

	private Integer pn;

	private List<QuestionSection> questionSections;

	public QuestionCategory() {
		super();
	}

	public String getName() {
		return name;
	}

	public Integer getPn() {
		return pn;
	}

	public List<QuestionSection> getQuestionSections() {
		return questionSections;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setQuestionSections(List<QuestionSection> questionSections) {
		this.questionSections = questionSections;
	}

	@Override
	public String toString() {
		return "QuestionCategory [name=" + name + ", pn=" + pn
				+ ", questionSections=" + questionSections + "]";
	}

}
