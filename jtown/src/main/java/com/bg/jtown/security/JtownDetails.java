package com.bg.jtown.security;

import org.springframework.security.core.userdetails.UserDetails;

/**
 * {@link org.springframework.security.core.userdetails.UserDetails } 상속 받아 메소드 추가한 클래스
 * 
 * @author Francis
 *
 */
public interface JtownDetails extends UserDetails {

	/**
	 * @return Get unique propernumber from ID
	 */
	Integer getPn();

	/**
	 * @return Get group name String ex) 'Customer', 'Seller', 'Administartor'
	 */
	String getGroupName();

	/**
	 * @return Get shopName OR username
	 */
	String getName();

	/**
	 * @return GET confirm email Address Booelan
	 */
	Boolean getConfirmEmail();
	
	/**
	 * @return GET facebook Feed post Operation Boolean
	 */
	Boolean getFacebookFeed();

}