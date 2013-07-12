package com.bg.jtown.business;

import java.util.Arrays;

/**
 * @author Francis
 * 
 */
public class Interest {

	private String categoryName;

	private Integer categoryPn;

	private Integer customerPn;

	private String interestSectionList;

	private String name;

	private Integer sectionPn;

	private Integer sellerPn;

	/**
	 * Ajax를 통해 리스트 받아오는 용
	 * 
	 */
	private Integer[] spnList;

	public Interest() {
		super();
	}

	public Interest(Integer sellerPn, Integer categoryPn, Integer sectionPn,
			String name) {
		this.sellerPn = sellerPn;
		this.categoryPn = categoryPn;
		this.sectionPn = sectionPn;
		this.name = name;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public String getInterestSectionList() {
		return interestSectionList;
	}

	public String getName() {
		return name;
	}

	public String getNaturalName() {
		if (this.categoryName != null && this.name != null) {
			return this.categoryName + " - " + this.name;
		}
		return null;
	}

	public Integer getSectionPn() {
		return sectionPn;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public String getUpperName() {
		return name.toUpperCase();
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	public void setInterestSectionList(String interestSectionList) {
		this.interestSectionList = interestSectionList;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setSectionPn(Integer sectionPn) {
		this.sectionPn = sectionPn;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public Integer[] getSpnList() {
		return spnList;
	}

	public void setSpnList(Integer[] spnList) {
		this.spnList = spnList;
	}

	@Override
	public String toString() {
		return "Interest [categoryName=" + categoryName + ", categoryPn="
				+ categoryPn + ", customerPn=" + customerPn
				+ ", interestSectionList=" + interestSectionList + ", name="
				+ name + ", sectionPn=" + sectionPn + ", sellerPn=" + sellerPn
				+ ", spnList=" + Arrays.toString(spnList) + "]";
	}

}
