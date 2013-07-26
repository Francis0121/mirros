package com.bg.jtown.business;

import com.bg.jtown.util.StringUtil;

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
	 * 댓글 고객 보유 번호
	 */
	private Integer commentCustomerPn;

	/**
	 * 경고 클릭 고객 고유 번호
	 */
	private Integer warnCustomerPn;

	/**
	 * comment 좋아요 개수
	 */
	private Integer commentLoveCount;

	/**
	 * 댓글 고유 번호
	 */
	private Integer commentPn;

	/**
	 * 판매자에 따른 댓글 개수
	 */
	private Integer count;

	/**
	 * 입력삭제 타입
	 */
	private String crudType;

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
	private String inputDate;

	/**
	 * 오류 메시지
	 */
	private String message;

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

	public Comment(String comment, Integer commentCustomerPn,
			Integer warnCustomerPn, Integer commentLoveCount,
			Integer commentPn, Integer count, String crudType,
			String customerName, Integer customerPn, String inputDate,
			String message, String redisType, Integer sellerPn) {
		super();
		this.comment = comment;
		this.commentCustomerPn = commentCustomerPn;
		this.warnCustomerPn = warnCustomerPn;
		this.commentLoveCount = commentLoveCount;
		this.commentPn = commentPn;
		this.count = count;
		this.crudType = crudType;
		this.customerName = customerName;
		this.customerPn = customerPn;
		this.inputDate = inputDate;
		this.message = message;
		this.redisType = redisType;
		this.sellerPn = sellerPn;
	}

	public String getComment() {
		return comment;
	}

	public Integer getCommentCustomerPn() {
		return commentCustomerPn;
	}

	public Integer getCommentLoveCount() {
		return commentLoveCount;
	}

	public Integer getCommentPn() {
		return commentPn;
	}

	public Integer getCount() {
		return count;
	}

	public String getCrudType() {
		return crudType;
	}

	public String getCustomerName() {
		return customerName;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public String getInputDate() {
		return inputDate;
	}

	public String getMessage() {
		return message;
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

	public void setCommentCustomerPn(Integer commentCustomerPn) {
		this.commentCustomerPn = commentCustomerPn;
	}

	public void setCommentLoveCount(Integer commentLoveCount) {
		this.commentLoveCount = commentLoveCount;
	}

	public void setCommentPn(Integer commentPn) {
		this.commentPn = commentPn;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public void setCrudType(String crudType) {
		this.crudType = crudType;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public void setRedisType(String redisType) {
		this.redisType = redisType;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public Integer getWarnCustomerPn() {
		return warnCustomerPn;
	}

	public void setWarnCustomerPn(Integer warnCustomerPn) {
		this.warnCustomerPn = warnCustomerPn;
	}

	public String getSplitHome() {
		if (this.comment == null || this.comment.trim().equals("")) {
			return "";
		}
		return StringUtil.strCut(this.comment.trim(), 48, "");
	}
	
	public boolean getIsSplit(){
		return StringUtil.isSplit(this.comment, 48);
	}

	@Override
	public String toString() {
		return "Comment [comment=" + comment + ", commentCustomerPn="
				+ commentCustomerPn + ", warnCustomerPn=" + warnCustomerPn
				+ ", commentLoveCount=" + commentLoveCount + ", commentPn="
				+ commentPn + ", count=" + count + ", crudType=" + crudType
				+ ", customerName=" + customerName + ", customerPn="
				+ customerPn + ", inputDate=" + inputDate + ", message="
				+ message + ", redisType=" + redisType + ", sellerPn="
				+ sellerPn + "]";
	}

}
