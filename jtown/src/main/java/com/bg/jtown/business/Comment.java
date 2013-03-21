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
	 * 판매자에 따른 댓글 개수
	 */
	private Integer count;

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
	 * redisType
	 */
	private String redisType;

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	public Comment() {
		super();
	}

	public Comment(String comment, Integer commentPn, Integer count,
			String customerName, Integer customerPn, Integer inputDate,
			Integer sellerPn) {
		super();
		this.comment = comment;
		this.commentPn = commentPn;
		this.count = count;
		this.customerName = customerName;
		this.customerPn = customerPn;
		this.inputDate = inputDate;
		this.sellerPn = sellerPn;
	}

	public String getComment() {
		return comment;
	}

	public Integer getCommentPn() {
		return commentPn;
	}

	public Integer getCount() {
		return count;
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

	public String getRedisType() {
		return redisType;
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

	public void setCount(Integer count) {
		this.count = count;
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

	public void setRedisType(String redisType) {
		this.redisType = redisType;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	@Override
	public String toString() {
		return "Comment [comment=" + comment + ", commentPn=" + commentPn
				+ ", count=" + count + ", customerName=" + customerName
				+ ", customerPn=" + customerPn + ", inputDate=" + inputDate
				+ ", redisType=" + redisType + ", sellerPn=" + sellerPn + "]";
	}

}
