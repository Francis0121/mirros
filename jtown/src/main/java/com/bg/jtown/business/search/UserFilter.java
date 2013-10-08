package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * @author 박광열, Francis
 * 
 */
public class UserFilter extends AbstractListFilter {

	/**
	 * 불량 사용자 여부
	 */
	private Boolean enabled;

	/**
	 * 가게 명 또는 이름
	 */
	private String name;

	/**
	 * 유저아이디
	 */
	private String userId;

	public UserFilter() {
		super();
	}

	public UserFilter(Boolean enabled, String name, String userId) {
		super();
		this.enabled = enabled;
		this.name = name;
		this.userId = userId;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public String getName() {
		return name;
	}

	public String getUserId() {
		return userId;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "UserFilter [enabled=" + enabled + ", name=" + name
				+ ", userId=" + userId + "]";
	}

}
