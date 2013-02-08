package com.bg.jtown.business;

/**
 * TEST DTO
 * 
 * @author Francis
 * 
 */
public class Home {

	private String username;

	public Home() {
		super();
	}

	public Home(String username) {
		super();
		this.username = username;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Override
	public String toString() {
		return "Home [username=" + username + "]";
	}
}
