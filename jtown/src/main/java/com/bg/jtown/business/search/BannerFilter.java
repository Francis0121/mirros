package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * @author In Sanghak 
 *  관리자 배너 관리를 위한 필터
 */
public class BannerFilter extends AbstractListFilter {

	private Integer eventPn;
	private String deleted = "N";

	public Integer getEventPn() {
		return eventPn;
	}

	public void setEventPn(Integer eventPn) {
		this.eventPn = eventPn;
	}

	public String getDeleted() {
		return deleted;
	}

	public void setDeleted(String deleted) {
		this.deleted = deleted;
	}

	@Override
	public String toString() {
		return "BannerFilter [eventPn=" + eventPn + ", deleted=" + deleted + "]";
	}

}
