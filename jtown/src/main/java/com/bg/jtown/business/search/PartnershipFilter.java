package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * <h1>제휴문의 검색 필터</h1>
 * 
 * @author Francis
 * 
 */
public class PartnershipFilter extends AbstractListFilter {

	/**
	 * 사업 아이템 분류
	 */
	private Integer categoryPn;

	/**
	 * 처리상황
	 */
	private Integer process;

	public PartnershipFilter() {
		super();
	}

	public PartnershipFilter(Integer categoryPn, Integer process) {
		super();
		this.categoryPn = categoryPn;
		this.process = process;
	}

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public Integer getProcess() {
		return process;
	}

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setProcess(Integer process) {
		this.process = process;
	}

	@Override
	public String toString() {
		return "PartnershipFilter [categoryPn=" + categoryPn + ", process="
				+ process + "]";
	}

}
