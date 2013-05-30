package com.bg.jtown.business;

import com.bg.jtown.security.JtownUser;

/**
 * <h1>제휴문의</h1>
 * 
 * @author Francis
 * 
 */
public class Partnership {

	/**
	 * 담당 관리자 정보
	 */
	private JtownUser adminUser = new JtownUser();

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
	 * 사업자 아이디 정보
	 */
	private JtownUser jtownUser = new JtownUser();

	/**
	 * 성명
	 */
	private String name;

	/**
	 * 메모, 비고
	 */
	private String note;

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

	/**
	 * 입금현황
	 */
	private Integer deposit;

	/**
	 * 수정날짜
	 */
	private String updateDate;

	public Partnership() {
		super();
	}

	public Partnership(String email, String phoneNumber) {
		this.email = email;
		this.phoneNumber = phoneNumber;
	}

	public JtownUser getAdminUser() {
		return adminUser;
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

	public JtownUser getJtownUser() {
		return jtownUser;
	}

	public String getName() {
		return name;
	}

	public String getNote() {
		return note;
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

	public String getUpdateDate() {
		return updateDate;
	}

	public void makePhoneNumber() {
		this.phoneNumber = this.phoneNumberSt + this.phoneNumberNd
				+ this.phoneNumberRd;
	}

	public void setAdminUser(JtownUser adminUser) {
		this.adminUser = adminUser;
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

	public void setJtownUser(JtownUser jtownUser) {
		this.jtownUser = jtownUser;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setNote(String note) {
		this.note = note;
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

	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}

	public Integer getDeposit() {
		return deposit;
	}

	public void setDeposit(Integer deposit) {
		this.deposit = deposit;
	}

	@Override
	public String toString() {
		return "Partnership [adminUser=" + adminUser + ", categoryPn="
				+ categoryPn + ", content=" + content + ", email=" + email
				+ ", inputDate=" + inputDate + ", jtownUser=" + jtownUser
				+ ", name=" + name + ", note=" + note + ", phoneNumber="
				+ phoneNumber + ", phoneNumberNd=" + phoneNumberNd
				+ ", phoneNumberRd=" + phoneNumberRd + ", phoneNumberSt="
				+ phoneNumberSt + ", pn=" + pn + ", process=" + process
				+ ", deposit=" + deposit + ", updateDate=" + updateDate + "]";
	}

}
