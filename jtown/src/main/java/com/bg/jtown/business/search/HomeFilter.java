package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * 메인화면 검색
 * 
 * @author Francis
 * @author In Sanghak
 * 
 */
public class HomeFilter extends AbstractListFilter {

	/**
	 * 관심사 분류 고유번호
	 */
	private Integer categoryPn;

	/**
	 * 현재페이지 번호
	 */
	private Integer currentPage;

	/**
	 * 고객 고유번호
	 */
	private Integer customerPn;

	/**
	 * 관심사 고유번호
	 */
	private Integer sectionPn;

	/**
	 * 검색어
	 */
	private String itemName;

	public HomeFilter() {
		super();
	}

	public HomeFilter(Integer categoryPn, Integer currentPage, Integer sectionPn) {
		super();
		this.categoryPn = categoryPn;
		this.currentPage = currentPage;
		this.sectionPn = sectionPn;
	}

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public Integer getCurrentPage() {
		return currentPage;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public Integer getSectionPn() {
		return sectionPn;
	}

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setCurrentPage(Integer currentPage) {
		this.currentPage = currentPage;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	public void setSectionPn(Integer sectionPn) {
		this.sectionPn = sectionPn;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	@Override
	public String toString() {
		return "HomeFilter [categoryPn=" + categoryPn + ", currentPage=" + currentPage + ", customerPn=" + customerPn + ", sectionPn=" + sectionPn
				+ ", itemName=" + itemName + "]";
	}

}
