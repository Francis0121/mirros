package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

public class ProductGatherFilter extends AbstractListFilter {

	private int categoryPn;
	private int currentPage = 1;
	private int percentCount;
	private int totalCount = 0;
	private int pagePerItem = 10;
	private int totalPageSize;

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
		return (int) Math.ceil(1.0*totalCount / pagePerItem);
	}

	public void setTotalPageSize(int totalPageSize) {
		this.totalPageSize = totalPageSize;
	}

	@Override
	public String toString() {
		return "ProductGatherFilter [categoryPn=" + categoryPn + ", currentPage=" + currentPage + ", percentCount=" + percentCount + ", totalCount="
				+ totalCount + ", pagePerItem=" + pagePerItem + ", totalPageSize=" + totalPageSize + "]";
	}

}
