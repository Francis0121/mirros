package com.bg.jtown.security;

/**
 * 확인
 * 
 * @author Francis
 * 
 */
public class Confirm {

	/**
	 * 사용자 고유 아이디
	 */
	private String id;

	/**
	 * email_series
	 */
	private String series;

	public Confirm() {
		super();

	}

	public Confirm(String id) {
		super();
		this.id = id;
	}

	public Confirm(String id, String series) {
		super();
		this.id = id;
		this.series = series;
	}

	public String getId() {
		return id;
	}

	public String getSeries() {
		return series;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setSeries(String series) {
		this.series = series;
	}

	@Override
	public String toString() {
		return "Confirm [id=" + id + ", series=" + series + "]";
	}

}
