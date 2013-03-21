package com.bg.jtown.security;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.Assert;

/**
 * @author 박광열
 * 
 */
@SuppressWarnings("serial")
public class JtownUser implements JtownDetails, CredentialsContainer {

	private static class AuthorityComparator implements
			Comparator<GrantedAuthority>, Serializable {
		private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

		public int compare(GrantedAuthority g1, GrantedAuthority g2) {
			// Neither should ever be null as each entry is checked before
			// adding it to the set.
			// If the authority is null, it is a custom authority and should
			// precede others.
			if (g2.getAuthority() == null) {
				return -1;
			}

			if (g1.getAuthority() == null) {
				return 1;
			}

			return g1.getAuthority().compareTo(g2.getAuthority());
		}
	}

	private static SortedSet<GrantedAuthority> sortAuthorities(
			Collection<? extends GrantedAuthority> authorities) {
		Assert.notNull(authorities,
				"Cannot pass a null GrantedAuthority collection");
		// Ensure array iteration order is predictable (as per
		// UserDetails.getAuthorities() contract and SEC-717)
		SortedSet<GrantedAuthority> sortedAuthorities = new TreeSet<GrantedAuthority>(
				new AuthorityComparator());

		for (GrantedAuthority grantedAuthority : authorities) {
			Assert.notNull(grantedAuthority,
					"GrantedAuthority list cannot contain any null elements");
			sortedAuthorities.add(grantedAuthority);
		}

		return sortedAuthorities;
	}

	// base Variable

	// users
	private final boolean accountNonExpired;
	private final boolean accountNonLocked;
	private final boolean credentialsNonExpired;
	private boolean enabled;
	private Set<GrantedAuthority> authorities;
	private String username;
	private String groupName;
	private String password;
	private String newPassword;
	private String salt;
	private Integer pn;

	// user_customer
	private String name;
	private String joinDate;

	// user_seller
	private String notice;
	private String shopUrl;
	private Integer loveCount;
	private Integer commentCount;
	private Integer viewCount;
	private Integer bannerDate;
	private List<String> images;

	private String interestCategory;
	private String interestSectionList;

	// ~ Constructors
	// ===================================================================================================

	public JtownUser() {
		this.username = "";
		this.password = "";
		this.enabled = true;
		this.accountNonExpired = true;
		this.credentialsNonExpired = true;
		this.accountNonLocked = true;
		this.groupName = "";

		this.salt = "";

		this.name = "";
		this.joinDate = "";
		
		this.shopUrl = "";
		this.notice = "";

		// TODO 권한작업
		this.authorities = new TreeSet<GrantedAuthority>();
	}

	public JtownUser(Integer pn, String username, String password,
			boolean enabled, boolean accountNonExpired,
			boolean credentialsNonExpired, boolean accountNonLocked,
			Collection<? extends GrantedAuthority> authorities, String salt,
			String groupName, String name) {

		if (((username == null) || "".equals(username)) || (password == null)) {
			throw new IllegalArgumentException(
					"Cannot pass null or empty values to constructor");
		}

		this.pn = pn;
		this.username = username;
		this.password = password;
		this.enabled = enabled;
		this.accountNonExpired = accountNonExpired;
		this.credentialsNonExpired = credentialsNonExpired;
		this.accountNonLocked = accountNonLocked;
		this.authorities = Collections
				.unmodifiableSet(sortAuthorities(authorities));
		this.salt = salt;
		this.groupName = groupName;
		this.name = name;
	}

	/**
	 * Construct the <code>User</code> with the details required by
	 * {@link org.springframework.security.authentication.dao.DaoAuthenticationProvider}
	 * .
	 * 
	 * @param username
	 *            the username presented to the
	 *            <code>DaoAuthenticationProvider</code>
	 * @param password
	 *            the password that should be presented to the
	 *            <code>DaoAuthenticationProvider</code>
	 * @param enabled
	 *            set to <code>true</code> if the user is enabled
	 * @param accountNonExpired
	 *            set to <code>true</code> if the account has not expired
	 * @param credentialsNonExpired
	 *            set to <code>true</code> if the credentials have not expired
	 * @param accountNonLocked
	 *            set to <code>true</code> if the account is not locked
	 * @param authorities
	 *            the authorities that should be granted to the caller if they
	 *            presented the correct username and password and the user is
	 *            enabled. Not null.
	 * 
	 * @throws IllegalArgumentException
	 *             if a <code>null</code> value was passed either as a parameter
	 *             or as an element in the <code>GrantedAuthority</code>
	 *             collection
	 */
	public JtownUser(String username, String password, boolean enabled,
			boolean accountNonExpired, boolean credentialsNonExpired,
			boolean accountNonLocked,
			Collection<? extends GrantedAuthority> authorities) {

		if (((username == null) || "".equals(username)) || (password == null)) {
			throw new IllegalArgumentException(
					"Cannot pass null or empty values to constructor");
		}

		this.username = username;
		this.password = password;
		this.enabled = enabled;
		this.accountNonExpired = accountNonExpired;
		this.credentialsNonExpired = credentialsNonExpired;
		this.accountNonLocked = accountNonLocked;
		this.authorities = Collections
				.unmodifiableSet(sortAuthorities(authorities));
	}

	// ~ Methods
	// ========================================================================================================

	public JtownUser(String username, String password, boolean enabled,
			boolean accountNonExpired, boolean credentialsNonExpired,
			boolean accountNonLocked,
			Collection<? extends GrantedAuthority> authorities, String salt) {

		if (((username == null) || "".equals(username)) || (password == null)) {
			throw new IllegalArgumentException(
					"Cannot pass null or empty values to constructor");
		}

		this.username = username;
		this.password = password;
		this.enabled = enabled;
		this.accountNonExpired = accountNonExpired;
		this.credentialsNonExpired = credentialsNonExpired;
		this.accountNonLocked = accountNonLocked;
		this.authorities = Collections
				.unmodifiableSet(sortAuthorities(authorities));
		this.salt = salt;
	}

	/**
	 * Calls the more complex constructor with all boolean arguments set to
	 * {@code true}.
	 */
	public JtownUser(String username, String password,
			Collection<? extends GrantedAuthority> authorities) {
		this(username, password, true, true, true, true, authorities);
	}

	/**
	 * Returns {@code true} if the supplied object is a {@code User} instance
	 * with the same {@code username} value.
	 * <p>
	 * In other words, the objects are equal if they have the same username,
	 * representing the same principal.
	 */
	@Override
	public boolean equals(Object rhs) {
		if (rhs instanceof User) {
			return username.equals(((JtownUser) rhs).username);
		}
		return false;
	}

	public void eraseCredentials() {
		password = null;
	}

	public Set<GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public Integer getBannerDate() {
		return bannerDate;
	}

	public Integer getCommentCount() {
		return commentCount;
	}

	public String getGroupName() {
		return groupName;
	}

	public List<String> getImages() {
		return images;
	}

	public String getInterestCategory() {
		return interestCategory;
	}

	public String getInterestSectionList() {
		return interestSectionList;
	}

	public String getJoinDate() {
		return joinDate;
	}

	public Integer getLoveCount() {
		return loveCount;
	}

	public String getName() {
		return name;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public String getNotice() {
		return notice;
	}

	public String getPassword() {
		return password;
	}

	public Integer getPn() {
		return pn;
	}

	public String getSalt() {
		return salt;
	}

	public String getShopUrl() {
		return shopUrl;
	}

	public String getUsername() {
		return username;
	}

	public Integer getViewCount() {
		return viewCount;
	}

	/**
	 * Returns the hashcode of the {@code username}.
	 */
	@Override
	public int hashCode() {
		return username.hashCode();
	}

	public boolean isAccountNonExpired() {
		return accountNonExpired;
	}

	public boolean isAccountNonLocked() {
		return accountNonLocked;
	}

	public boolean isCredentialsNonExpired() {
		return credentialsNonExpired;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setAuthorities(Set<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	public void setBannerDate(Integer bannerDate) {
		this.bannerDate = bannerDate;
	}

	public void setCommentCount(Integer commentCount) {
		this.commentCount = commentCount;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public void setInterestCategory(String interestCategory) {
		this.interestCategory = interestCategory;
	}

	public void setInterestSectionList(String interestSectionList) {
		this.interestSectionList = interestSectionList;
	}

	public void setJoinDate(String joinDate) {
		this.joinDate = joinDate;
	}

	public void setLoveCount(Integer loveCount) {
		this.loveCount = loveCount;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public void setNotice(String notice) {
		this.notice = notice;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public void setShopUrl(String shopUrl) {
		this.shopUrl = shopUrl;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setViewCount(Integer viewCount) {
		this.viewCount = viewCount;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(super.toString()).append(": ");
		sb.append("Username: ").append(this.username).append("; ");
		sb.append("Password: [PROTECTED]; ");
		sb.append("Enabled: ").append(this.enabled).append("; ");
		sb.append("AccountNonExpired: ").append(this.accountNonExpired)
				.append("; ");
		sb.append("credentialsNonExpired: ").append(this.credentialsNonExpired)
				.append("; ");
		sb.append("AccountNonLocked: ").append(this.accountNonLocked)
				.append("; ");
		sb.append("Pn: ").append(this.pn).append("; ");
		sb.append("Salt: ").append(this.salt).append("; ");
		sb.append("Name :").append(this.name).append("; ");
		sb.append("JoinDate: ").append(this.joinDate).append("; ");
		sb.append("shopUrl: ").append(this.shopUrl).append("; ");
		sb.append("notice: ").append(this.notice).append("; ");
		sb.append("loveCount: ").append(this.loveCount).append("; ");
		sb.append("viewCount: ").append(this.viewCount).append("; ");
		sb.append("interestCategory : ").append(this.interestCategory)
				.append("; ");
		sb.append("interestSectionList : ").append(this.interestSectionList)
				.append("; ");
		sb.append("newPassword : ").append(this.newPassword).append("; ");
		sb.append("GroupName : ").append(this.groupName).append("; ");
		sb.append("commentCount : ").append(this.commentCount).append("; ");
		sb.append("images : ").append(this.images).append("; ");
		sb.append("bannerDate : ").append(this.bannerDate).append("; ");

		if (!authorities.isEmpty()) {
			sb.append("Granted Authorities: ");

			boolean first = true;
			for (GrantedAuthority auth : authorities) {
				if (!first) {
					sb.append(",");
				}
				first = false;

				sb.append(auth);
			}
		} else {
			sb.append("Not granted any authorities");
		}

		return sb.toString();
	}
}
