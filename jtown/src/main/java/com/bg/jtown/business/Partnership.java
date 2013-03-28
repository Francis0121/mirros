package com.bg.jtown.business;

/**
 * <h1>제휴문의</h1>
 * 
 * @author Francis
 * 
 */
public class Partnership {

	/**
	 * 사업 아이템 분류
	 */
	private Integer categoryPn;

	/**
	 * 문의사항
	 */
	private String content;

	/**
	 * 이메일주소
	 */
	private String email;

	/**
	 * 입력날짜
	 */
	private String inputDate;

	/**
	 * 성명
	 */
	private String name;

	/**
	 * 핸드폰 번호
	 */
	private String phoneNumber;

	/**
	 * 핸드폰 번호 두번째 자리
	 */
	private String phoneNumberNd;

	/**
	 * 핸드폰 번호 세번째 자리
	 */
	private String phoneNumberRd;

	/**
	 * 핸드폰 번호 첫자리
	 */
	private String phoneNumberSt;

	/**
	 * 제휴문위 고유번호
	 */
	private Integer pn;

	/**
	 * 처리상황
	 */
	private Integer process;

	public Partnership() {
		super();
	}

	public Partnership(Integer categoryPn, String content, String email,
			String name, String phoneNumber, Integer pn, Integer process) {
		super();
		this.categoryPn = categoryPn;
		this.content = content;
		this.email = email;
		this.name = name;
		this.phoneNumber = phoneNumber;
		this.pn = pn;
		this.process = process;
	}

	public void makePhoneNumber() {
		this.phoneNumber = this.phoneNumberSt + this.phoneNumberNd
				+ this.phoneNumberRd;
	}

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public String getContent() {
		return content;
	}

	public String getEmail() {
		return email;
	}

	public String getInputDate() {
		return inputDate;
	}

	public String getName() {
		return name;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public String getPhoneNumberNd() {
		return phoneNumberNd;
	}

	public String getPhoneNumberRd() {
		return phoneNumberRd;
	}

	public String getPhoneNumberSt() {
		return phoneNumberSt;
	}

	public Integer getPn() {
		return pn;
	}

	public Integer getProcess() {
		return process;
	}

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public void setPhoneNumberNd(String phoneNumberNd) {
		this.phoneNumberNd = phoneNumberNd;
	}

	public void setPhoneNumberRd(String phoneNumberRd) {
		this.phoneNumberRd = phoneNumberRd;
	}

	public void setPhoneNumberSt(String phoneNumberSt) {
		this.phoneNumberSt = phoneNumberSt;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setProcess(Integer process) {
		this.process = process;
	}

	@Override
	public String toString() {
		return "Partnership [categoryPn=" + categoryPn + ", content=" + content
				+ ", email=" + email + ", inputDate=" + inputDate + ", name="
				+ name + ", phoneNumber=" + phoneNumber + ", phoneNumberNd="
				+ phoneNumberNd + ", phoneNumberSt=" + phoneNumberSt + ", pn="
				+ pn + ", phoneNumberRd=" + phoneNumberRd + ", process="
				+ process + "]";
	}

}
