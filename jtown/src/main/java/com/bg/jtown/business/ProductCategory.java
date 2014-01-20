package com.bg.jtown.business;

public class ProductCategory {

	private Integer sectionsPn;
	private Integer divisionsPn;
	private Integer groupsPn;
	private String sectionsName;
	private String divisionsName;
	private String groupsName;

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
		return "ProductCategory [sectionsPn=" + sectionsPn + ", divisionsPn=" + divisionsPn + ", groupsPn=" + groupsPn + ", sectionsName="
				+ sectionsName + ", divisionsName=" + divisionsName + ", groupsName=" + groupsName + "]";
	}

}
