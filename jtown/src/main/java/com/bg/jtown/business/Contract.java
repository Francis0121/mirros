package com.bg.jtown.business;

/**
 * 계약기간
 * 
 * @author Francis
 * 
 */
public class Contract {

	/**
	 * 계약 횟수
	 */
	private Integer contractCount;

	/**
	 * 계약 만료 날짜
	 */
	private String contractEndDate;

	/**
	 * 계약기간
	 */
	private Integer contractPeroid;

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

	public Contract(Integer sellerPn) {
		super();
		this.sellerPn = sellerPn;
	}

	public Integer getContractCount() {
		return contractCount;
	}

	public String getContractEndDate() {
		return contractEndDate;
	}

	public Integer getContractPeroid() {
		return contractPeroid;
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

	public void setContractCount(Integer contractCount) {
		this.contractCount = contractCount;
	}

	public void setContractEndDate(String contractEndDate) {
		this.contractEndDate = contractEndDate;
	}

	public void setContractPeroid(Integer contractPeroid) {
		this.contractPeroid = contractPeroid;
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
		return "Contract [contractCount=" + contractCount
				+ ", contractEndDate=" + contractEndDate + ", contractPeroid="
				+ contractPeroid + ", endDate=" + endDate + ", inputDate="
				+ inputDate + ", pn=" + pn + ", sellerPn=" + sellerPn
				+ ", startDate=" + startDate + "]";
	}

}
