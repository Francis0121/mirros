package com.bg.jtown.security;

public enum Authority {

	NOT_LOGIN, ADMIN(true), SELLER, CUSTOMER, ROOT_ADMIN(true);

	private boolean isAdmin;
	
	private Authority(){
		this(false);
	}
	
	private Authority(boolean isAdmin){
		this.isAdmin = isAdmin;
	}
	
	public boolean isAdmin(){
		return isAdmin;
	}
}
