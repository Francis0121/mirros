package com.bg.jtown.business;

public class ProductCategory {

	/**
	 * 상품 고유번호
	 */
	private Integer pn;
	/**
	 * 대분류 고유번호
	 */
	private Integer sectionsPn;
	/**
	 * 중분류 고유번호
	 */
	private Integer divisionsPn;
	/**
	 * 소분류 고유번호
	 */
	private Integer groupsPn;
	/**
	 * 대분류 이름
	 */
	private String sectionsName;
	/**
	 * 중분류이름
	 */
	private String divisionsName;
	/**
	 * 소분류 이름
	 */
	private String groupsName;

	public Integer getPn() {
		return pn;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public Integer getSectionsPn() {
		return sectionsPn;
	}

	public void setSectionsPn(Integer sectionsPn) {
		this.sectionsPn = sectionsPn;
	}

	public Integer getDivisionsPn() {
		return divisionsPn;
	}

	public void setDivisionsPn(Integer divisionsPn) {
		this.divisionsPn = divisionsPn;
	}

	public Integer getGroupsPn() {
		return groupsPn;
	}

	public void setGroupsPn(Integer groupsPn) {
		this.groupsPn = groupsPn;
	}

	public String getSectionsName() {
		return sectionsName;
	}

	public void setSectionsName(String sectionsName) {
		this.sectionsName = sectionsName;
	}

	public String getDivisionsName() {
		return divisionsName;
	}

	public void setDivisionsName(String divisionsName) {
		this.divisionsName = divisionsName;
	}

	public String getGroupsName() {
		return groupsName;
	}

	public void setGroupsName(String groupsName) {
		this.groupsName = groupsName;
	}

	@Override
	public String toString() {
		return "ProductCategory [pn=" + pn + ", sectionsPn=" + sectionsPn + ", divisionsPn=" + divisionsPn + ", groupsPn=" + groupsPn
				+ ", sectionsName=" + sectionsName + ", divisionsName=" + divisionsName + ", groupsName=" + groupsName + "]";
	}

}
