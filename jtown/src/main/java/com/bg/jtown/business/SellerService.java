package com.bg.jtown.business;

import com.bg.jtown.security.JtownUser;

/**
 * @author Francis
 * 
 */
public interface SellerService {

	JtownUser selectSellerInformation(Integer properNumber);
}
