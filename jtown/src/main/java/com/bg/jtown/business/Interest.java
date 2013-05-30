package com.bg.jtown.business;

/**
 * @author Francis
 * 
 */
public class Interest {

	private Integer categoryPn;

	private Integer customerPn;

	private String interestSectionList;

	private String name;

	private Integer sectionPn;

	private Integer sellerPn;

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

	public Integer getSectionPn() {
		return sectionPn;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public String getUpperName() {
		return name.toUpperCase();
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

	@Override
	public String toString() {
		return "Interest [categoryPn=" + categoryPn + ", customerPn="
				+ customerPn + ", interestSectionList=" + interestSectionList
				+ ", name=" + name + ", sectionPn=" + sectionPn + ", sellerPn="
				+ sellerPn + "]";
	}

}
