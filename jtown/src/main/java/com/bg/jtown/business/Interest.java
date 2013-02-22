package com.bg.jtown.business;

public class Interest {
	private Integer categoryPn;

	private Integer sectionPn;

	private String name;

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public String getName() {
		return name;
	}

	public Integer getSectionPn() {
		return sectionPn;
	}

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setSectionPn(Integer sectionPn) {
		this.sectionPn = sectionPn;
	}

	@Override
	public String toString() {
		return "Interest [categoryPn=" + categoryPn + ", sectionPn="
				+ sectionPn + ", name=" + name + ", toString()="
				+ super.toString() + "]";
	}

}
