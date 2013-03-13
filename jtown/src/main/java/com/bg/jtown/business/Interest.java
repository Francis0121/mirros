package com.bg.jtown.business;

/**
 * @author Francis
 * 
 */
public class Interest {

	private Integer customerPn;

	private Integer sellerPn;

	private Integer categoryPn;

	private Integer sectionPn;

	private String name;

	private String interestSectionNameList;

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

	public Interest(Integer sellerPn, Integer categoryPn, Integer sectionPn,
			String name, String interestSectionNameList) {
		this.sellerPn = sellerPn;
		this.categoryPn = categoryPn;
		this.sectionPn = sectionPn;
		this.name = name;
		this.interestSectionNameList = interestSectionNameList;
	}

	public Interest(Integer customerPn, Integer sellerPn, Integer categoryPn,
			Integer sectionPn, String name, String interestSectionNameList) {
		this.customerPn = customerPn;
		this.sellerPn = sellerPn;
		this.categoryPn = categoryPn;
		this.sectionPn = sectionPn;
		this.name = name;
		this.interestSectionNameList = interestSectionNameList;
	}

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public String getInterestSectionNameList() {
		return interestSectionNameList;
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

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	public void setInterestSectionNameList(String interestSectionNameList) {
		this.interestSectionNameList = interestSectionNameList;
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
		return "Interest [customerPn=" + customerPn + ", sellerPn=" + sellerPn
				+ ", categoryPn=" + categoryPn + ", sectionPn=" + sectionPn
				+ ", name=" + name + ", interestSectionNameList="
				+ interestSectionNameList + ", toString()=" + super.toString()
				+ "]";
	}

}
