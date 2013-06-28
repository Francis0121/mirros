package com.bg.jtown.security;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;

import com.bg.jtown.util.DateUtil;

/**
 * @author Francis
 *
 */
@SuppressWarnings("serial")
public class JtownUser extends AbstractUser {

	// ~ Common
	private String newPassword;

	// ~ Customer
	private Integer year;
	private Integer month;
	private Integer day;
	private Boolean sex;
	private String social;

	// ~ Seller
	private Integer shopPn;
	private String notice;
	private String longNotice;
	private String shopUrl;
	private Integer loveCount;
	private Integer loveHotCount;
	private Integer viewCount;
	private Integer commentCount;
	private String beginStartDate;
	private String contractEndDate;
	private Integer bannerDate;
	private Integer bannerFirst;
	private Integer bannerSecond;
	private List<String> images;
	private Integer customerPn;
	private String interestCategory;
	private String interestSectionList;
	
	// ~ Admin
	private String email;

	public JtownUser() {
		super();
	}
	
	public JtownUser(Integer pn, String username, String password,
			String salt, String name, String groupName, Boolean confirmEmail, Boolean facebookFeed, boolean enabled,
			Collection<? extends GrantedAuthority> authorities) {
		this(pn, username, password, salt, name, groupName, confirmEmail, facebookFeed, enabled, true, true, true, authorities);
	}

	public JtownUser(Integer pn, String username, String password,
			String salt, String name, String groupName, Boolean confirmEmail, Boolean facebookFeed,
			boolean enabled, boolean accountNonExpired,
			boolean credentialsNonExpired, boolean accountNonLocked,
			Collection<? extends GrantedAuthority> authorities) {
		super(pn, username, password, salt, name, groupName, confirmEmail, facebookFeed,
				enabled, accountNonExpired, credentialsNonExpired,
				accountNonLocked, authorities);
	}

	public Integer getBannerDate() {
		if (this.bannerFirst != null && this.bannerSecond != null) {
			int i[] = { this.bannerFirst, this.bannerSecond };
			Arrays.sort(i);
			this.bannerDate = i[0];
		} else {
			if (this.bannerFirst == null && this.bannerSecond == null) {
				this.bannerDate = null;
			} else if (this.bannerFirst == null) {
				this.bannerDate = this.bannerSecond;
			} else if (this.bannerSecond == null) {
				this.bannerDate = this.bannerFirst;
			} else {
				this.bannerDate = null;
			}
		}
		return bannerDate;
	}
	
	public String getSixShopPn(){
		if(this.shopPn == null || "".equals(this.shopPn))
			return null;
		return String.format("%06d", this.shopPn);
	}
	
	public int getNowYear() {
		return DateUtil.getYear();
	}

	public Integer getShopPn() {
		return shopPn;
	}

	public void setShopPn(Integer shopPn) {
		this.shopPn = shopPn;
	}

	public String getUpperName() {
		return super.getName().toUpperCase();
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Integer getMonth() {
		return month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}

	public Integer getDay() {
		return day;
	}

	public void setDay(Integer day) {
		this.day = day;
	}

	public Boolean getSex() {
		return sex;
	}

	public void setSex(Boolean sex) {
		this.sex = sex;
	}

	public String getSocial() {
		return social;
	}

	public void setSocial(String social) {
		this.social = social;
	}

	public String getNotice() {
		return notice;
	}

	public void setNotice(String notice) {
		this.notice = notice;
	}

	public String getLongNotice() {
		return longNotice;
	}

	public void setLongNotice(String longNotice) {
		this.longNotice = longNotice;
	}

	public String getShopUrl() {
		return shopUrl;
	}

	public void setShopUrl(String shopUrl) {
		this.shopUrl = shopUrl;
	}

	public Integer getLoveCount() {
		return loveCount;
	}

	public void setLoveCount(Integer loveCount) {
		this.loveCount = loveCount;
	}

	public Integer getCommentCount() {
		return commentCount;
	}

	public void setCommentCount(Integer commentCount) {
		this.commentCount = commentCount;
	}

	public Integer getViewCount() {
		return viewCount;
	}

	public void setViewCount(Integer viewCount) {
		this.viewCount = viewCount;
	}

	public Integer getBannerFirst() {
		return bannerFirst;
	}

	public void setBannerFirst(Integer bannerFirst) {
		this.bannerFirst = bannerFirst;
	}

	public Integer getBannerSecond() {
		return bannerSecond;
	}

	public void setBannerSecond(Integer bannerSecond) {
		this.bannerSecond = bannerSecond;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public String getContractEndDate() {
		return contractEndDate;
	}

	public void setContractEndDate(String contractEndDate) {
		this.contractEndDate = contractEndDate;
	}

	public Integer getCustomerPn() {
		return customerPn;
	}

	public void setCustomerPn(Integer customerPn) {
		this.customerPn = customerPn;
	}

	public Integer getLoveHotCount() {
		return loveHotCount;
	}

	public void setLoveHotCount(Integer loveHotCount) {
		this.loveHotCount = loveHotCount;
	}

	public String getInterestCategory() {
		return interestCategory;
	}

	public void setInterestCategory(String interestCategory) {
		this.interestCategory = interestCategory;
	}

	public String getInterestSectionList() {
		return interestSectionList;
	}

	public void setInterestSectionList(String interestSectionList) {
		this.interestSectionList = interestSectionList;
	}

	public void setBannerDate(Integer bannerDate) {
		this.bannerDate = bannerDate;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getBeginStartDate() {
		return beginStartDate;
	}

	public void setBeginStartDate(String beginStartDate) {
		this.beginStartDate = beginStartDate;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(super.toString());
		sb.append("Customer : [ ");
		sb.append("BirthDay : ").append(this.year).append("/").append(this.month).append("/").append(this.day).append("; ");
		sb.append("Sex :").append(this.sex).append("; ");
		sb.append("Social : ").append(this.social).append(";");
		sb.append(" ] ");	
		sb.append("Seller : [ ");
		sb.append("Spon Pn : ").append(this.shopPn).append("; ");
		sb.append("Notice: ").append(this.notice).append("; ");
		sb.append("LongNotice : ").append(this.longNotice).append("; ");
		sb.append("ShopUrl: ").append(this.shopUrl).append("; ");
		sb.append("LoveCount: ").append(this.loveCount).append("; ");
		sb.append("LoveHotCount : ").append(this.loveHotCount).append(";");
		sb.append("ViewCount: ").append(this.viewCount).append("; ");
		sb.append("CommentCount : ").append(this.commentCount).append("; ");
		sb.append("BeginStartDate :").append(this.beginStartDate).append("; ");
		sb.append("ContractEndDate :").append(this.contractEndDate).append("; ");
		sb.append("BannerDate : ").append(this.bannerDate).append("; ");
		sb.append("BannerFirst : ").append(this.bannerFirst).append("; ");
		sb.append("BannerSecond : ").append(this.bannerSecond).append("; ");
		sb.append("CustomerPn : ").append(this.customerPn).append(";");
		sb.append("interestCategory : ").append(this.interestCategory).append("; ");
		sb.append("interestSectionList : ").append(this.interestSectionList).append("; ");
		sb.append(" ] ");
		sb.append("Admin : [ ");
		sb.append("email : ").append(this.email).append("; ");
		sb.append(" ] ");
		
		return sb.toString();
	}

}
