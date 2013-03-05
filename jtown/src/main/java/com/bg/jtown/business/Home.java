package com.bg.jtown.business;

/**
 * @author Francis
 * 
 */
public class Home {

	private String name;

	private Integer pn;

	public Home() {
		super();
	}

	public Home(String name, Integer pn) {
		super();
		this.name = name;
		this.pn = pn;
	}

	public String getName() {
		return name;
	}

	public Integer getPn() {
		return pn;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	@Override
	public String toString() {
		return "Home [name=" + name + ", pn=" + pn + "]";
	}
}
