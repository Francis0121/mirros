package com.bg.jtown.business;

/**
 * @author Francis
 * 
 */
public class Product {

	/**
	 * 상품개
	 */
	private Integer count;

	/**
	 * 이미지 고유번호
	 */
	private Integer imagePn;

	/**
	 * 상품 등록 고유번호
	 */
	private Integer pn;

	/**
	 * 저장된이름
	 */
	private String saveName;

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	public Product() {
		super();
	}

	public Product(Integer pn, Integer sellerPn, Integer imagePn,
			String saveName) {
		super();
		this.pn = pn;
		this.sellerPn = sellerPn;
		this.imagePn = imagePn;
		this.saveName = saveName;
	}

	public Integer getCount() {
		return count;
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

	public void setCount(Integer count) {
		this.count = count;
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
		return "Product [count=" + count + ", imagePn=" + imagePn + ", pn="
				+ pn + ", saveName=" + saveName + ", sellerPn=" + sellerPn
				+ "]";
	}

}
