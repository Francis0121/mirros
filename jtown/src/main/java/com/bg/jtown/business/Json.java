package com.bg.jtown.business;

/**
 * JSON 형태의 Key value object
 * 
 * @author Francis
 * 
 */
public class Json {

	/**
	 * Key 값
	 */
	private Integer key;

	/**
	 * value 값
	 */
	private String value;

	public Json() {
		super();
	}

	public Json(Integer key, String value) {
		super();
		this.key = key;
		this.value = value;
	}

	public Integer getKey() {
		return key;
	}

	public String getValue() {
		return value;
	}

	public void setKey(Integer key) {
		this.key = key;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "Json [key=" + key + ", value=" + value + "]";
	}
}
