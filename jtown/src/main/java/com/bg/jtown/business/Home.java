package com.bg.jtown.business;

/**
 * TEST DTO
 * 
 * @author Francis
 * 
 */
public class Home {

	private String id;

	public Home() {
		super();
	}

	public Home(String id) {
		super();
		this.id = id;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return "Home [id=" + id + "]";
	}
}
