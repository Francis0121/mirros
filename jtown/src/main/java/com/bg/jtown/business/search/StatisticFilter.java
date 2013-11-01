package com.bg.jtown.business.search;

import java.util.Date;

import com.bg.jtown.util.AbstractListFilter;

/**
 * @author Francis
 * 
 */
public class StatisticFilter extends AbstractListFilter {

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	private Integer nextMonth;

	private long currentDate;

	public StatisticFilter() {
		super();
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public Integer getNextMonth() {
		return nextMonth;
	}

	public void setNextMonth(Integer nextMonth) {
		this.nextMonth = nextMonth;
	}

	public long getCurrentDate() {
		return currentDate;
	}

	public void setCurrentDate(long currentDate) {
		this.currentDate = currentDate;
	}

	@Override
	public String toString() {
		return "StatisticFilter [sellerPn=" + sellerPn + ", nextMonth=" + nextMonth + ", currentDate=" + currentDate + "]";
	}

}
