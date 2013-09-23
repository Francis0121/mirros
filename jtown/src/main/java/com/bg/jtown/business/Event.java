package com.bg.jtown.business;

import java.util.Date;

/**
 * Seller Event
 * 
 * @author Francis
 * 
 */
public class Event {

	/**
	 * 배너 순서
	 */
	private Integer bannerOrder;

	/**
	 * Event Type
	 */
	private Integer bannerType;

	/**
	 * 내용
	 */
	private String content;

	/**
	 * 파일 고유 번호
	 */
	private Integer imagePn;

	/**
	 * 이벤트 고유번호
	 */
	private Integer pn;

	/**
	 * 실시간 적용 타입
	 */
	private String redisType = "event";

	/**
	 * 파일 저장된 이름
	 */
	private String saveName;

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	/**
	 * 이미지 분류
	 */
	private Integer imageCategory;

	/**
	 * 이미지 타입
	 */
	private String imageType;

	/**
	 * 이벤트 고유번호
	 */
	private Integer eventPn;
	/**
	 * 이벤트 설명
	 */
	private String eventName;

	/**
	 * 만기일
	 */
	private Date endDate;

	public Event() {
		super();
	}

	public Event(Integer pn, Integer sellerPn, Integer bannerType, String saveName, Integer imagePn, String content, Integer bannerOrder) {
		super();
		this.pn = pn;
		this.sellerPn = sellerPn;
		this.bannerType = bannerType;
		this.saveName = saveName;
		this.imagePn = imagePn;
		this.content = content;
		this.bannerOrder = bannerOrder;
	}

	public Integer getBannerOrder() {
		return bannerOrder;
	}

	public Integer getBannerType() {
		return bannerType;
	}

	public String getContent() {
		return content;
	}

	public Integer getImagePn() {
		return imagePn;
	}

	public Integer getPn() {
		return pn;
	}

	public String getRedisType() {
		return redisType;
	}

	public String getSaveName() {
		return saveName;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public void setBannerOrder(Integer bannerOrder) {
		this.bannerOrder = bannerOrder;
	}

	public void setBannerType(Integer bannerType) {
		this.bannerType = bannerType;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setImagePn(Integer imagePn) {
		this.imagePn = imagePn;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setSaveName(String saveName) {
		this.saveName = saveName;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public Integer getImageCategory() {
		return imageCategory;
	}

	public void setImageCategory(Integer imageCategory) {
		this.imageCategory = imageCategory;
	}

	public String getImageType() {
		return imageType;
	}

	public void setImageType(String imageType) {
		this.imageType = imageType;
	}

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Integer getEventPn() {
		return eventPn;
	}

	public void setEventPn(Integer eventPn) {
		this.eventPn = eventPn;
	}

	@Override
	public String toString() {
		return "Event [bannerOrder=" + bannerOrder + ", bannerType=" + bannerType + ", content=" + content + ", imagePn=" + imagePn + ", pn=" + pn
				+ ", redisType=" + redisType + ", saveName=" + saveName + ", sellerPn=" + sellerPn + ", imageCategory=" + imageCategory
				+ ", imageType=" + imageType + ", eventName=" + eventName + ", endDate=" + endDate + "]";
	}

}
