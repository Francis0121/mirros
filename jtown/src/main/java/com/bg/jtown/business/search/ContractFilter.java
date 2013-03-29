package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * 
 * @author Francis
 * 
 */
public class ContractFilter extends AbstractListFilter {

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	public Integer getSellerPn() {
		return sellerPn;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	@Override
	public String toString() {
		return "ContractFilter [sellerPn=" + sellerPn + "]";
	}

}
