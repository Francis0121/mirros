package com.bg.jtown.business;

/**
 * 판매자 기본정보 현황
 * 
 * @author Francis
 * 
 */
public class SellerBaseInfo {

	/**
	 * 배너 개수
	 */
	private Integer bannerBoolCount;

	/**
	 * 메인 이미지 개수
	 */
	private Integer imageBoolCount;

	/**
	 * 긴 공지
	 */
	private String longNotice;

	/**
	 * 공지
	 */
	private String notice;

	/**
	 * 상품 개수
	 */
	private Integer productBoolCount;

	/**
	 * 판매자고유번호
	 */
	private Integer sellerPn;

	/**
	 * Tag 개수
	 */
	private Integer tagBoolCount;

	public SellerBaseInfo() {
		super();
	}

	public Integer getBannerBoolCount() {
		return bannerBoolCount;
	}

	public Integer getImageBoolCount() {
		return imageBoolCount;
	}

	public String getLongNotice() {
		return longNotice;
	}

	public String getNotice() {
		return notice;
	}

	public Integer getProductBoolCount() {
		return productBoolCount;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public Integer getTagBoolCount() {
		return tagBoolCount;
	}

	public void setBannerBoolCount(Integer bannerBoolCount) {
		this.bannerBoolCount = bannerBoolCount;
	}

	public void setImageBoolCount(Integer imageBoolCount) {
		this.imageBoolCount = imageBoolCount;
	}

	public void setLongNotice(String longNotice) {
		this.longNotice = longNotice;
	}

	public void setNotice(String notice) {
		this.notice = notice;
	}

	public void setProductBoolCount(Integer productBoolCount) {
		this.productBoolCount = productBoolCount;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public void setTagBoolCount(Integer tagBoolCount) {
		this.tagBoolCount = tagBoolCount;
	}

	@Override
	public String toString() {
		return "SellerBaseInfo [bannerBoolCount=" + bannerBoolCount
				+ ", imageBoolCount=" + imageBoolCount + ", longNotice="
				+ longNotice + ", notice=" + notice + ", productBoolCount="
				+ productBoolCount + ", sellerPn=" + sellerPn
				+ ", tagBoolCount=" + tagBoolCount + "]";
	}

}
