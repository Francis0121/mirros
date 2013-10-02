package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

public class GatherFilter extends AbstractListFilter {

	private int categoryPn;
	private int currentPage = 1;
	private int percentCount;
	private int totalCount = 0;
	private int pagePerItem = 10;
	private int totalPageSize;
	private int newFlag = 0;
	private Integer customerPn;

	public int getCategoryPn() {
		return categoryPn;
	}

	public void setCategoryPn(int categoryPn) {
		this.categoryPn = categoryPn;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getPercentCount() {
		return percentCount;
	}

	public void setPercentCount(int percentCount) {
		this.percentCount = percentCount;
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}

	public int getPagePerItem() {
		return pagePerItem;
	}

	public void setPagePerItem(int pagePerItem) {
		this.pagePerItem = pagePerItem;
	}

	public int getTotalPageSize() {
		return (int) Math.ceil(1.0 * totalCount / pagePerItem);
	}

	public void setTotalPageSize(int totalPageSize) {
		this.totalPageSize = totalPageSize;
	}

	public int getNewFlag() {
		return newFlag;
	}

	public void setNewFlag(int newFlag) {
		this.newFlag = newFlag;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	@Override
	public String toString() {
		return "GatherFilter [categoryPn=" + categoryPn + ", currentPage=" + currentPage + ", percentCount=" + percentCount + ", totalCount="
				+ totalCount + ", pagePerItem=" + pagePerItem + ", totalPageSize=" + totalPageSize + ", newFlag=" + newFlag + ", customerPn="
				+ customerPn + "]";
	}

}
