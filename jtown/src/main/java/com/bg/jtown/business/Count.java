package com.bg.jtown.business;

/**
 * @author Francis
 * 
 */
public class Count {

	/**
	 * 개수
	 */
	private Integer count;

	/**
	 * 입력 삭제 타입
	 * 
	 */
	private String crudType;

	/**
	 * 고객 고유번호
	 */
	private Integer customerPn;

	/**
	 * 입력된 날짜
	 */
	private String inputDate;

	/**
	 * Error 메시지
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

	public Count() {
		super();
	}

	public Count(Integer count, Integer customerPn, String inputDate, String message, Integer sellerPn, String redisType) {
		super();
		this.count = count;
		this.customerPn = customerPn;
		this.inputDate = inputDate;
		this.message = message;
		this.sellerPn = sellerPn;
		this.redisType = redisType;
	}

	public Integer getCount() {
		return count;
	}

	public String getCrudType() {
		return crudType;
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

	public void setCount(Integer count) {
		this.count = count;
	}

	public void setCrudType(String crudType) {
		this.crudType = crudType;
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

	public Integer getProductPn() {
		return productPn;
	}

	public void setProductPn(Integer productPn) {
		this.productPn = productPn;
	}

	@Override
	public String toString() {
		return "Count [count=" + count + ", crudType=" + crudType + ", customerPn=" + customerPn + ", inputDate=" + inputDate + ", message="
				+ message + ", redisType=" + redisType + ", sellerPn=" + sellerPn + ", productPn=" + productPn + "]";
	}

}
