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
	 * 사용자 이름
	 */
	private String name;

	/**
	 * 사용자 고유 번호
	 */
	private Integer pn;

	/**
	 * 접근 Ip
	 */
	private String remoteIp;

	/**
	 * 사용자 아이디
	 */
	private String username;

	/**
	 * Facebook Feed 이용 여부
	 */
	private Boolean facebookFeed;

	public SummaryUser() {
		super();
	}

	public SummaryUser(String authoirty, Boolean isLogin, String name,
			Integer pn, String remoteIp, String username, Boolean facebookFeed) {
		super();
		this.authoirty = authoirty;
		this.isLogin = isLogin;
		this.name = name;
		this.pn = pn;
		this.remoteIp = remoteIp;
		this.username = username;
		this.facebookFeed = facebookFeed;
	}

	public String getAuthoirty() {
		return authoirty;
	}

	public Authority getEnumAuthority() {
		if (this.authoirty == null) {
			return Authority.NOT_LOGIN;
		}
		if (this.authoirty.equals("RootAdministrator")) {
			return Authority.ROOT_ADMIN;
		} else if (this.authoirty.equals("Administrator")) {
			return Authority.ADMIN;
		} else if (this.authoirty.equals("Seller")) {
			return Authority.SELLER;
		} else if (this.authoirty.equals("Customer")) {
			return Authority.CUSTOMER;
		} else {
			return Authority.NOT_LOGIN;
		}
	}

	public Boolean getIsLogin() {
		return isLogin;
	}

	public String getName() {
		return name;
	}

	public Integer getPn() {
		return pn;
	}

	public String getRemoteIp() {
		return remoteIp;
	}

	public String getUsername() {
		return username;
	}

	public void setAuthoirty(String authoirty) {
		this.authoirty = authoirty;
	}

	public void setIsLogin(Boolean isLogin) {
		this.isLogin = isLogin;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setRemoteIp(String remoteIp) {
		this.remoteIp = remoteIp;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Boolean getFacebookFeed() {
		return facebookFeed;
	}

	public void setFacebookFeed(Boolean facebookFeed) {
		this.facebookFeed = facebookFeed;
	}

	@Override
	public String toString() {
		return "SummaryUser [authoirty=" + authoirty + ", isLogin=" + isLogin
				+ ", name=" + name + ", pn=" + pn + ", remoteIp=" + remoteIp
				+ ", username=" + username + ", facebookFeed=" + facebookFeed
				+ "]";
	}

}
