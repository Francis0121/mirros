package com.bg.jtown.business;

import java.util.List;

/**
 * @author Francis
 * 
 */
public class Home {

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	/**
	 * 이름 리스트
	 */
	private List<String> saveNameList;

	public Home() {
		super();
	}

	public List<String> getSaveNameList() {
		return saveNameList;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public void setSaveNameList(List<String> saveNameList) {
		this.saveNameList = saveNameList;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	@Override
	public String toString() {
		return "Home [sellerPn=" + sellerPn + ", saveNameList=" + saveNameList
				+ "]";
	}

}
