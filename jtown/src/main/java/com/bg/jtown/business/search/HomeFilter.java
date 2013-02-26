package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * @author Francis
 * 
 */
public class HomeFilter extends AbstractListFilter {

	/**
	 * 관심사 분류 고유번호
	 */
	private Integer categoryPn;

	/**
	 * 관심사 고유번호
	 */
	private Integer sectionPn;

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
		return "HomeFilter [categoryPn=" + categoryPn + ", sectionPn="
				+ sectionPn + "]";
	}

}
