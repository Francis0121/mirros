package com.bg.jtown.business;

public class Statistic {

	private String statisticDate;
	private Integer percentCount;
	private Integer sellerPn;
	private int todayCount;
	private String countDate;

	public String getStatisticDate() {
		return statisticDate;
	}

	public void setStatisticDate(String statisticDate) {
		this.statisticDate = statisticDate;
	}

	public Integer getPercentCount() {
		return percentCount;
	}

	public void setPercentCount(Integer percentCount) {
		this.percentCount = percentCount;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public int getTodayCount() {
		return todayCount;
	}

	public void setTodayCount(int todayCount) {
		this.todayCount = todayCount;
	}

	public String getCountDate() {
		return countDate;
	}

	public void setCountDate(String countDate) {
		this.countDate = countDate;
	}

	@Override
	public String toString() {
		return "Statistic [statisticDate=" + statisticDate + ", percentCount=" + percentCount + ", sellerPn=" + sellerPn + ", todayCount="
				+ todayCount + ", countDate=" + countDate + "]";
	}

}
