package com.bg.jtown.business;

public class Interest {
	private Integer sellerPn;

	private Integer categoryPn;

	private Integer sectionPn;

	private String name;
	
	private String interestSectionNameList;

	public Interest() {
		// TODO Auto-generated constructor stub
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

	public Integer getCategoryPn() {
		return categoryPn;
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
		return "Interest [sellerPn=" + sellerPn + ", categoryPn=" + categoryPn
				+ ", sectionPn=" + sectionPn + ", name=" + name
				+ ", interestSectionNameList=" + interestSectionNameList
				+ ", toString()=" + super.toString() + "]";
	}

}
