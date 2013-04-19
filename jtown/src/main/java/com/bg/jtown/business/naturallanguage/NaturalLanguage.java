package com.bg.jtown.business.naturallanguage;

/**
 * @author Francis
 * 
 */
public class NaturalLanguage {

	/**
	 * 찾으려고 하는 이름
	 */
	private String searchName;

	public String getSearchName() {
		return searchName;
	}

	public void setSearchName(String searchName) {
		this.searchName = searchName;
	}

	@Override
	public String toString() {
		return "NaturlaLanguage [searchName=" + searchName + "]";
	}

}
