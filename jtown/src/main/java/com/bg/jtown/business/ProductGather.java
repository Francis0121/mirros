package com.bg.jtown.business;

/**
 * @author In Sanghak
 * 
 */
public class ProductGather {

	private int productPn;
	private int sellerPn;
	private int imagePn;
	private String productName;
	private String url;
	private int price;
	private String saveName;
	private String contentType;
	private int hot;

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

	@Override
	public String toString() {
		return "ProductGather [productPn=" + productPn + ", sellerPn=" + sellerPn + ", imagePn=" + imagePn + ", productName=" + productName
				+ ", url=" + url + ", price=" + price + ", saveName=" + saveName + ", contentType=" + contentType + ", hot=" + hot + "]";
	}

}
