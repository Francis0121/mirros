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
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	public Count() {
		super();
	}

	public Integer getCount() {
		return count;
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

	public Integer getSellerPn() {
		return sellerPn;
	}

	public void setCount(Integer count) {
		this.count = count;
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

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	@Override
	public String toString() {
		return "Count [count=" + count + ", customerPn=" + customerPn
				+ ", inputDate=" + inputDate + ", message=" + message
				+ ", sellerPn=" + sellerPn + "]";
	}

}
