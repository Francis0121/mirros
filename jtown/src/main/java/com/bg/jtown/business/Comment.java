package com.bg.jtown.business;

/**
 * @author Francis
 * 
 */
public class Comment {

	/**
	 * 댓글
	 */
	private String comment;

	/**
	 * 댓글 고유 번호
	 */
	private Integer commentPn;

	/**
	 * 소비자 닉네임
	 */
	private String customerName;

	/**
	 * 소비자 고유번호
	 */
	private Integer customerPn;

	/**
	 * 입력한 날짜
	 */
	private Integer inputDate;

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	public Comment() {
		super();
	}

	public String getComment() {
		return comment;
	}

	public Integer getCommentPn() {
		return commentPn;
	}

	public String getCustomerName() {
		return customerName;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public Integer getInputDate() {
		return inputDate;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public void setCommentPn(Integer commentPn) {
		this.commentPn = commentPn;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	public void setInputDate(Integer inputDate) {
		this.inputDate = inputDate;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	@Override
	public String toString() {
		return "Comment [comment=" + comment + ", commentPn=" + commentPn
				+ ", customerName=" + customerName + ", customerPn="
				+ customerPn + ", inputDate=" + inputDate + ", sellerPn="
				+ sellerPn + "]";
	}

}
