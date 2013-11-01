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

	/**
	 * 상품 고유번호
	 */
	private Integer productPn;

	/**
	 * 이벤트 고유번호
	 */
	private Integer eventPn;

	/**
	 * 페이지
	 */
	private Integer page = 1;

	/**
	 * 가져오는 범위 preItem ~ postItem
	 */
	private Integer preItem;
	private Integer postItem;

	/**
	 * 상품 이름
	 */
	private String productName;

	public Comment() {
		super();
	}

	public Comment(String comment, Integer commentCustomerPn, Integer warnCustomerPn, Integer commentLoveCount, Integer commentPn, Integer count,
			String crudType, String customerName, Integer customerPn, String inputDate, String message, String redisType, Integer sellerPn) {
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
		return StringUtil.strCut(this.comment.trim(), 40, "");
	}

	public boolean getIsSplit() {
		return StringUtil.isSplit(this.comment, 40);
	}

	public Integer getProductPn() {
		return productPn;
	}

	public void setProductPn(Integer productPn) {
		this.productPn = productPn;
	}

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	public Integer getPreItem() {
		return (page - 1) * 3;
	}

	public void setPreItem(Integer preItem) {
		this.preItem = preItem;
	}

	public Integer getPostItem() {
		return page * 3 + 1;
	}

	public void setPostItem(Integer postItem) {
		this.postItem = postItem;
	}

	public Integer getEventPn() {
		return eventPn;
	}

	public void setEventPn(Integer eventPn) {
		this.eventPn = eventPn;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	@Override
	public String toString() {
		return "Comment [comment=" + comment + ", commentCustomerPn=" + commentCustomerPn + ", warnCustomerPn=" + warnCustomerPn
				+ ", commentLoveCount=" + commentLoveCount + ", commentPn=" + commentPn + ", count=" + count + ", crudType=" + crudType
				+ ", customerName=" + customerName + ", customerPn=" + customerPn + ", inputDate=" + inputDate + ", message=" + message
				+ ", redisType=" + redisType + ", sellerPn=" + sellerPn + ", productPn=" + productPn + ", eventPn=" + eventPn + ", page=" + page
				+ ", preItem=" + preItem + ", postItem=" + postItem + ", productName=" + productName + "]";
	}

}
