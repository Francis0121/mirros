package com.bg.jtown.business;

/**
 * @author In Sanghak
 * 
 */
public class Gather {

	// Product Data
	private int productPn;
	private int sellerPn;
	private int imagePn;
	private String productName;
	private String url;
	private int price;
	private String saveName;
	private String originalName;
	private String contentType;
	private int hot;
	private int newProduct;
	private int heartCount;
	private Integer customerPn;

	// Event Data
	private int eventPn;
	private String eventName;
	private int beginDate;
	private int endDate;
	private int bannerOrder;
	private String shopName;
	private int newEvent;

	public int getProductPn() {
		return productPn;
	}

	public void setProductPn(int productPn) {
		this.productPn = productPn;
	}

	public int getSellerPn() {
		return sellerPn;
	}

	public void setSellerPn(int sellerPn) {
		this.sellerPn = sellerPn;
	}

	public int getImagePn() {
		return imagePn;
	}

	public void setImagePn(int imagePn) {
		this.imagePn = imagePn;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public String getSaveName() {
		return saveName;
	}

	public void setSaveName(String saveName) {
		this.saveName = saveName;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public int getHot() {
		return hot;
	}

	public void setHot(int hot) {
		this.hot = hot;
	}

	public int getEventPn() {
		return eventPn;
	}

	public void setEventPn(int eventPn) {
		this.eventPn = eventPn;
	}

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public int getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(int beginDate) {
		this.beginDate = beginDate;
	}

	public int getEndDate() {
		return endDate;
	}

	public void setEndDate(int endDate) {
		this.endDate = endDate;
	}

	public int getBannerOrder() {
		return bannerOrder;
	}

	public void setBannerOrder(int bannerOrder) {
		this.bannerOrder = bannerOrder;
	}

	public String getShopName() {
		return shopName;
	}

	public void setShopName(String shopName) {
		this.shopName = shopName;
	}

	public int getNewProduct() {
		return newProduct;
	}

	public void setNewProduct(int newProduct) {
		this.newProduct = newProduct;
	}

	public int getNewEvent() {
		return newEvent;
	}

	public void setNewEvent(int newEvent) {
		this.newEvent = newEvent;
	}

	public String getOriginalName() {
		return originalName;
	}

	public void setOriginalName(String originalName) {
		this.originalName = originalName;
	}

	public int getHeartCount() {
		return heartCount;
	}

	public void setHeartCount(int heartCount) {
		this.heartCount = heartCount;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	@Override
	public String toString() {
		return "Gather [productPn=" + productPn + ", sellerPn=" + sellerPn + ", imagePn=" + imagePn + ", productName=" + productName + ", url=" + url
				+ ", price=" + price + ", saveName=" + saveName + ", originalName=" + originalName + ", contentType=" + contentType + ", hot=" + hot
				+ ", newProduct=" + newProduct + ", heartCount=" + heartCount + ", customerPn=" + customerPn + ", eventPn=" + eventPn
				+ ", eventName=" + eventName + ", beginDate=" + beginDate + ", endDate=" + endDate + ", bannerOrder=" + bannerOrder + ", shopName="
				+ shopName + ", newEvent=" + newEvent + "]";
	}

}
