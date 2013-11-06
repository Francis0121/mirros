package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

public class GatherFilter extends AbstractListFilter {

	private int categoryPn;
	private int currentPage = 1;
	private int percentCount;
	private int totalCount = 0;
	private int pagePerItem = 10;
	private int totalPageSize;
	private String navFlag;
	private Integer customerPn;
	private String itemName;
	private Integer itemCategoryPn;

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

	public String getNavFlag() {
		return navFlag;
	}

	public void setNavFlag(String navFlag) {
		this.navFlag = navFlag;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Integer getItemCategoryPn() {
		return itemCategoryPn;
	}

	public void setItemCategoryPn(Integer itemCategoryPn) {
		this.itemCategoryPn = itemCategoryPn;
	}

	@Override
	public String toString() {
		return "GatherFilter [categoryPn=" + categoryPn + ", currentPage=" + currentPage + ", percentCount=" + percentCount + ", totalCount="
				+ totalCount + ", pagePerItem=" + pagePerItem + ", totalPageSize=" + totalPageSize + ", navFlag=" + navFlag + ", customerPn="
				+ customerPn + ", itemName=" + itemName + ", itemCategoryPn=" + itemCategoryPn + "]";
	}

}
