package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * <h1>판매자 별 댓글 페이징 처리</h1>
 * 
 * @author Francis
 * 
 */
public class CommentFilter extends AbstractListFilter {

	/**
	 * 날짜기간
	 */
	private Integer peroid = 7;

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	/**
	 * 최대로 가져올 개수
	 */
	private Integer topItemNum = 3;

	public CommentFilter() {
		super();
	}

	public CommentFilter(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public Integer getPeroid() {
		return peroid;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public Integer getTopItemNum() {
		return topItemNum;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	@Override
	public String toString() {
		return "CommentFilter [peroid=" + peroid + ", sellerPn=" + sellerPn
				+ ", topItemNum=" + topItemNum + "]";
	}

}
