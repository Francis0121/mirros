package com.bg.jtown.business;

import java.text.DecimalFormat;

import com.bg.jtown.util.DateUtil;

/**
 * @author Francis
 * 
 */
public class Product {

	/**
	 * 상품개수
	 */
	private Integer count;

	/**
	 * 이미지 고유번호
	 */
	private Integer imagePn;

	/**
	 * 입력날짜
	 */
	private String inputDate;

	/**
	 * 상품명
	 */
	private String name;

	/**
	 * 상품순서
	 */
	private Integer order;

	/**
	 * 상품 등록 고유번호
	 */
	private Integer pn;

	/**
	 * 가격
	 */
	private String price;

	/**
	 * 저장된이름
	 */
	private String saveName;

	/**
	 * 판매자 고유번호
	 */
	private Integer sellerPn;

	/**
	 * 상품주소
	 */
	private String url;

	/**
	 * 현재페이지
	 */
	private Integer currentPage;

	public Integer getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(Integer currentPage) {
		this.currentPage = currentPage;
	}

	public Product() {
		super();
	}

	public String getCommaPrice() {
		if (this.price == null || this.price.equals("")) {
			return null;
		}
		DecimalFormat format = new DecimalFormat("#,###");
		return format.format(Integer.parseInt(this.price));
	}

	public boolean getNewProduct() {
		if (this.inputDate == null || this.inputDate.equals("")) {
			return false;
		}

		try {
			long diffDays = DateUtil.diffOfDate(this.inputDate,
					DateUtil.getToday("YYYYMMDD"));
			if (diffDays < 3) {
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return false;
	}

	public Integer getCount() {
		return count;
	}

	public Integer getImagePn() {
		return imagePn;
	}

	public String getInputDate() {
		return inputDate;
	}

	public String getName() {
		return name;
	}

	public Integer getOrder() {
		return order;
	}

	public Integer getPn() {
		return pn;
	}

	public String getPrice() {
		return price;
	}

	public String getSaveName() {
		return saveName;
	}

	public Integer getSellerPn() {
		return sellerPn;
	}

	public String getUrl() {
		return url;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public void setImagePn(Integer imagePn) {
		this.imagePn = imagePn;
	}

	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setOrder(Integer order) {
		this.order = order;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public void setSaveName(String saveName) {
		this.saveName = saveName;
	}

	public void setSellerPn(Integer sellerPn) {
		this.sellerPn = sellerPn;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Override
	public String toString() {
		return "Product [count=" + count + ", imagePn=" + imagePn
				+ ", inputDate=" + inputDate + ", name=" + name + ", order="
				+ order + ", pn=" + pn + ", price=" + price + ", saveName="
				+ saveName + ", sellerPn=" + sellerPn + ", url=" + url
				+ ", currentPage=" + currentPage + "]";
	}

}
