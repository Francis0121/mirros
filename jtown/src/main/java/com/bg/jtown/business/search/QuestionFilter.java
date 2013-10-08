package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * @author Francis
 * 
 */
public class QuestionFilter extends AbstractListFilter {

	private Integer categoryPn;

	private Integer sectionPn;

	public QuestionFilter() {
		super();
	}

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public Integer getSectionPn() {
		return sectionPn;
	}

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setSectionPn(Integer sectionPn) {
		this.sectionPn = sectionPn;
	}

	@Override
	public String toString() {
		return "QuestionFilter [categoryPn=" + categoryPn + ", sectionPn="
				+ sectionPn + "]";
	}

}