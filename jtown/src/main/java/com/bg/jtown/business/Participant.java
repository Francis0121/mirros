package com.bg.jtown.business;

public class Participant {

	private Integer customerPn;
	private Integer eventPn;
	private String memo;
	private String message;

	public Integer getCustomerPn() {
		return customerPn;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	public Integer getEventPn() {
		return eventPn;
	}

	public void setEventPn(Integer eventPn) {
		this.eventPn = eventPn;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "Participant [customerPn=" + customerPn + ", eventPn=" + eventPn + ", memo=" + memo + ", message=" + message + "]";
	}

}
