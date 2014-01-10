package com.bg.jtown.business;

import java.util.Date;

/**
 * Seller Event
 * 
 * @author Francis
 * @author In Sanghak
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
	 * 이미지 이름
	 */
	private String image;
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

	/**
	 * 이벤트 종료 d-day
	 */
	private int dDay;

	/**
	 * 삽입일
	 */
	private Date inputDate;

	/**
	 * 이벤트 url
	 */
	private String url;

	/**
	 * URL or placeHolder
	 */
	private String variableData;

	/**
	 * 페이스북 공유하기에 올라갈 메세지
	 */
	private String fbMessage;

	/**
	 * 페이스북 공유하기에 올라갈 이미지
	 */
	private String fbThumbnail;

	/**
	 * 삭제여부
	 */
	private String deleted;

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

	public Date getInputDate() {
		return inputDate;
	}

	public void setInputDate(Date inputDate) {
		this.inputDate = inputDate;
	}

	public String getVariableData() {
		return variableData;
	}

	public void setVariableData(String variableData) {
		this.variableData = variableData;
	}

	public String getFbMessage() {
		return fbMessage;
	}

	public void setFbMessage(String fbMessage) {
		this.fbMessage = fbMessage;
	}

	public String getFbThumbnail() {
		return fbThumbnail;
	}

	public void setFbThumbnail(String fbThumbnail) {
		this.fbThumbnail = fbThumbnail;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getdDay() {
		return dDay;
	}

	public void setdDay(int dDay) {
		this.dDay = dDay;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getDeleted() {
		return deleted;
	}

	public void setDeleted(String deleted) {
		this.deleted = deleted;
	}

	@Override
	public String toString() {
		return "Event [bannerOrder=" + bannerOrder + ", bannerType=" + bannerType + ", content=" + content + ", imagePn=" + imagePn + ", pn=" + pn
				+ ", redisType=" + redisType + ", saveName=" + saveName + ", sellerPn=" + sellerPn + ", image=" + image + ", imageCategory="
				+ imageCategory + ", imageType=" + imageType + ", eventPn=" + eventPn + ", eventName=" + eventName + ", endDate=" + endDate
				+ ", dDay=" + dDay + ", inputDate=" + inputDate + ", url=" + url + ", variableData=" + variableData + ", fbMessage=" + fbMessage
				+ ", fbThumbnail=" + fbThumbnail + ", deleted=" + deleted + "]";
	}

}
