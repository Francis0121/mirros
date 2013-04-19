package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * @author Francis
 * 
 */
public class NaturalLanguageFilter extends AbstractListFilter {

	/**
	 * 찾으려고 하는 이름
	 */
	private String searchName;

	public NaturalLanguageFilter() {
		super();
	}

	public NaturalLanguageFilter(String searchName) {
		super();
		this.searchName = searchName;
	}

	public String getSearchName() {
		return searchName;
	}

	public String getUpperSearchName() {
		if (searchName == null || searchName.trim().equals("")) {
			return null;
		}
		return "%" + searchName.toUpperCase() + "%";
	}

	public void setSearchName(String searchName) {
		this.searchName = searchName;
	}

	@Override
	public String toString() {
		return "NaturlaLanguage [searchName=" + searchName + "]";
	}

}
