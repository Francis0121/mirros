package com.bg.jtown.business;

/**
 * Seller Event
 * 
 * @author Francis
 * 
 */
public class Event {

	/**
	 * 이벤트 고유번호
	 */
	private Integer pn;

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	/**
	 * Event Type
	 */
	private Integer bannerType;

	/**
	 * 파일 저장된 이름
	 */
	private String saveName;

	/**
	 * 파일 고유 번호
	 */
	private Integer imagePn;

	/**
	 * 내용
	 */
	private String content;

	/**
	 * 배너 순서
	 */
	private Integer bannerOrder;

	public Event() {
		super();
	}

	public Event(Integer pn, Integer sellerPn, Integer bannerType,
			String saveName, Integer imagePn, String content,
			Integer bannerOrder) {
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

	@Override
	public String toString() {
		return "Event [pn=" + pn + ", sellerPn=" + sellerPn + ", bannerType="
				+ bannerType + ", saveName=" + saveName + ", imagePn="
				+ imagePn + ", content=" + content + ", bannerOrder="
				+ bannerOrder + "]";
	}

}
