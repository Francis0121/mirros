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
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	public CommentFilter() {
		super();
	}

	public CommentFilter(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	@Override
	public String toString() {
		return "CommentFilter [sellerPn=" + sellerPn + "]";
	}

}
