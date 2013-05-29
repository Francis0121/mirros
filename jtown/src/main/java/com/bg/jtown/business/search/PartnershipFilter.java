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

	private static final Integer INQUIRE = 1;
	private static final Integer RECEIPT = 2;
	private static final Integer FINISH = 3;

	/**
	 * 사업 아이템 분류
	 */
	private Integer categoryPn;

	/**
	 * 이메일 주소
	 */
	private String email;

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
	 * 판매자 홈페이지
	 */
	private String shopUrl;

	/**
	 * 판매자 회사명
	 */
	private String sellerName;

	/**
	 * 판매자 불량사용자
	 */
	private Boolean enabled;

	/**
	 * 담당자
	 */
	private Integer adminPn;

	public PartnershipFilter() {
		super();
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

	public String getSearchShopUrl() {
		if (this.shopUrl == null || this.shopUrl.trim().equals("")) {
			return null;
		}
		return "%" + this.shopUrl + "%";
	}

	public String getSearchSellerName() {
		if (this.sellerName == null || this.sellerName.trim().equals("")) {
			return null;
		}
		return "%" + this.sellerName + "%";
	}

	public Integer getCategoryPn() {
		return categoryPn;
	}

	public String getEmail() {
		return email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public Integer getProcess() {
		return process;
	}

	public List<Json> getProcessList() {
		List<Json> processList = new ArrayList<Json>();

		processList.add(new Json(INQUIRE, "문의"));
		processList.add(new Json(RECEIPT, "접수"));
		processList.add(new Json(FINISH, "완료"));

		return processList;
	}

	public Map<Integer, String> getProcessMap() {
		Map<Integer, String> processMap = new HashMap<Integer, String>();

		processMap.put(INQUIRE, "문의");
		processMap.put(RECEIPT, "접수");
		processMap.put(FINISH, "완료");

		return processMap;
	}

	public void setCategoryPn(Integer categoryPn) {
		this.categoryPn = categoryPn;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public void setProcess(Integer process) {
		this.process = process;
	}

	public String getSellerId() {
		return sellerId;
	}

	public void setSellerId(String sellerId) {
		this.sellerId = sellerId;
	}

	public String getShopUrl() {
		return shopUrl;
	}

	public void setShopUrl(String shopUrl) {
		this.shopUrl = shopUrl;
	}

	public String getSellerName() {
		return sellerName;
	}

	public void setSellerName(String sellerName) {
		this.sellerName = sellerName;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	public Integer getAdminPn() {
		return adminPn;
	}

	public void setAdminPn(Integer adminPn) {
		this.adminPn = adminPn;
	}

	@Override
	public String toString() {
		return "PartnershipFilter [categoryPn=" + categoryPn + ", email="
				+ email + ", phoneNumber=" + phoneNumber + ", process="
				+ process + ", sellerId=" + sellerId + ", shopUrl=" + shopUrl
				+ ", sellerName=" + sellerName + ", enabled=" + enabled
				+ ", adminPn=" + adminPn + "]";
	}

}
