package com.bg.jtown.business;

/**
 * 계약기간
 * 
 * @author Francis
 * 
 */
public class Contract {

	/**
	 * 끝날짜
	 */
	private String endDate;

	/**
	 * 입력날짜
	 */
	private String inputDate;

	/**
	 * 계약기간 고유번호
	 */
	private Integer pn;

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	/**
	 * 시작날짜
	 */
	private String startDate;

	public Contract() {
		super();

	}

	public Contract(String endDate, String inputDate, Integer pn,
			Integer sellerPn, String startDate) {
		super();
		this.endDate = endDate;
		this.inputDate = inputDate;
		this.pn = pn;
		this.sellerPn = sellerPn;
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public String getInputDate() {
		return inputDate;
	}

	public Integer getPn() {
		return pn;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	@Override
	public String toString() {
		return "Contract [endDate=" + endDate + ", inputDate=" + inputDate
				+ ", pn=" + pn + ", sellerPn=" + sellerPn + ", startDate="
				+ startDate + "]";
	}

}
