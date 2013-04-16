package com.bg.jtown.security;

/**
 * Java에서 본인 확인용 정보를 AOP에서 정리 해주는 Object
 * 
 * @author Francis
 * 
 */
public class SummaryUser {

	/**
	 * 권한
	 */
	private String authoirty;

	/**
	 * 로그인 여부
	 */
	private Boolean isLogin;

	/**
	 * 사용자 고유 번호
	 */
	private Integer pn;

	public Authority getEnumAuthority() {
		if (this.authoirty == null) {
			return Authority.NOT_LOGIN;
		}

		if (this.authoirty.equals("Administartor")) {
			return Authority.ADMIN;
		} else if (this.authoirty.equals("Seller")) {
			return Authority.SELLER;
		} else if (this.authoirty.equals("Customer")) {
			return Authority.CUSTOMER;
		} else {
			return Authority.NOT_LOGIN;
		}
	}

	public SummaryUser() {
		super();
	}

	public SummaryUser(String authoirty, Boolean isLogin, Integer pn) {
		super();
		this.authoirty = authoirty;
		this.isLogin = isLogin;
		this.pn = pn;
	}

	public String getAuthoirty() {
		return authoirty;
	}

	public Boolean getIsLogin() {
		return isLogin;
	}

	public Integer getPn() {
		return pn;
	}

	public void setAuthoirty(String authoirty) {
		this.authoirty = authoirty;
	}

	public void setIsLogin(Boolean isLogin) {
		this.isLogin = isLogin;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	@Override
	public String toString() {
		return "SummaryUser [authoirty=" + authoirty + ", isLogin=" + isLogin
				+ ", pn=" + pn + "]";
	}

}
