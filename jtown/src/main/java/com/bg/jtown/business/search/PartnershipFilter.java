package com.bg.jtown.business.search;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Json;
import com.bg.jtown.util.AbstractListFilter;

/**
 * <h1>제휴문의 검색 필터</h1>
 * 
 * @author Francis
 * 
 */
public class PartnershipFilter extends AbstractListFilter {

	private static final Integer ETC = 0;

	// ~ Process
	private static final Integer FINISH = 4;
	private static final Integer INQUIRE = 1;
	private static final Integer PROCESS = 3;
	private static final Integer RECEIPT = 2;

	// ~ Deposit

	private static final Integer NOT_DEPOSIT = 1;
	private static final Integer DEPOSIT = 2;

	/**
	 * 담당자
	 */
	private Integer adminPn;

	/**
	 * 사업 아이템 분류
	 */
	private Integer categoryPn;

	/**
	 * 입금현황
	 */
	private Integer deposit;

	/**
	 * 이메일 주소
	 */
	private String email;

	/**
	 * 판매자 불량사용자
	 */
	private Boolean enabled;

	/**
	 * 핸드폰 주소
	 */
	private String phoneNumber;

	/**
	 * 처리상황
	 */
	private Integer process;

	/**
	 * 판매자 아이디
	 */
	private String sellerId;

	/**
	 * 판매자 회사명
	 */
	private String sellerName;

	/**
	 * 판매자 홈페이지
	 */
	private String shopUrl;

	public PartnershipFilter() {
		super();
	}

	public Integer getAdminPn() {
		return adminPn;
	}

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public Integer getDeposit() {
		return deposit;
	}

	public String getEmail() {
		return email;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public Integer getProcess() {
		return process;
	}

	public List<Json> getProcessList() {
		List<Json> processList = new ArrayList<Json>();

		processList.add(new Json(INQUIRE, "미접수"));
		processList.add(new Json(RECEIPT, "접수"));
		processList.add(new Json(PROCESS, "진행"));
		processList.add(new Json(FINISH, "완료"));
		processList.add(new Json(ETC, "기타"));

		return processList;
	}

	public Map<Integer, String> getProcessMap() {
		Map<Integer, String> processMap = new HashMap<Integer, String>();

		processMap.put(INQUIRE, "미접수");
		processMap.put(RECEIPT, "접수");
		processMap.put(PROCESS, "진행");
		processMap.put(FINISH, "완료");
		processMap.put(ETC, "기타");

		return processMap;
	}

	public List<Json> getDepositList() {
		List<Json> depositList = new ArrayList<Json>();

		depositList.add(new Json(NOT_DEPOSIT, "미입금"));
		depositList.add(new Json(DEPOSIT, "입금"));
		depositList.add(new Json(ETC, "기타"));

		return depositList;
	}

	public Map<Integer, String> getDepositMap() {
		Map<Integer, String> depositMap = new HashMap<Integer, String>();

		depositMap.put(NOT_DEPOSIT, "미입금");
		depositMap.put(DEPOSIT, "입금");
		depositMap.put(ETC, "기타");
		
		return depositMap;
	}

	public String getSearchEmail() {
		if (this.email == null || this.email.trim().equals("")) {
			return null;
		}
		return "%" + this.email + "%";
	}

	public String getSearchPhoneNumber() {
		if (this.phoneNumber == null || this.phoneNumber.trim().equals("")) {
			return null;
		}
		return "%" + this.phoneNumber + "%";
	}

	public String getSearchSellerId() {
		if (this.sellerId == null || this.sellerId.trim().equals("")) {
			return null;
		}
		return "%" + this.sellerId + "%";
	}

	public String getSearchSellerName() {
		if (this.sellerName == null || this.sellerName.trim().equals("")) {
			return null;
		}
		return "%" + this.sellerName + "%";
	}

	public String getSearchShopUrl() {
		if (this.shopUrl == null || this.shopUrl.trim().equals("")) {
			return null;
		}
		return "%" + this.shopUrl + "%";
	}

	public String getSellerId() {
		return sellerId;
	}

	public String getSellerName() {
		return sellerName;
	}

	public String getShopUrl() {
		return shopUrl;
	}

	public void setAdminPn(Integer adminPn) {
		this.adminPn = adminPn;
	}

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setDeposit(Integer deposit) {
		this.deposit = deposit;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public void setProcess(Integer process) {
		this.process = process;
	}

	public void setSellerId(String sellerId) {
		this.sellerId = sellerId;
	}

	public void setSellerName(String sellerName) {
		this.sellerName = sellerName;
	}

	public void setShopUrl(String shopUrl) {
		this.shopUrl = shopUrl;
	}

	@Override
	public String toString() {
		return "PartnershipFilter [adminPn=" + adminPn + ", categoryPn="
				+ categoryPn + ", deposit=" + deposit + ", email=" + email
				+ ", enabled=" + enabled + ", phoneNumber=" + phoneNumber
				+ ", process=" + process + ", sellerId=" + sellerId
				+ ", sellerName=" + sellerName + ", shopUrl=" + shopUrl + "]";
	}

}
