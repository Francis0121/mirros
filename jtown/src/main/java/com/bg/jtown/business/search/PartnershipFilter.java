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

	private static final Integer FINISH = 3;

	private static final Integer INQUIRE = 1;

	private static final Integer RECEIPT = 2;

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

	public PartnershipFilter() {
		super();
	}

	public PartnershipFilter(Integer categoryPn, Integer process, String email,
			String phoneNumber) {
		super();
		this.categoryPn = categoryPn;
		this.process = process;
		this.email = email;
		this.phoneNumber = phoneNumber;
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

	@Override
	public String toString() {
		return "PartnershipFilter [categoryPn=" + categoryPn + ", process="
				+ process + "]";
	}

}
