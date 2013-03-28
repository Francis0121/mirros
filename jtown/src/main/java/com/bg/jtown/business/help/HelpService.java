package com.bg.jtown.business.help;

import java.util.List;

import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.search.PartnershipFilter;

/**
 * @author Francis
 * 
 */
public interface HelpService {

	// ~ Partnershop

	List<Partnership> selectPartnership(PartnershipFilter partnershipFilter);

	Partnership selectPartnership(Integer partnershipPn);

	Integer selectPartnershipCount(PartnershipFilter partnershipFilter);

	void insertPartnership(Partnership partnership);

	void deletePartnership(Partnership partnership);

	void updatePatnership(Partnership partnership);

}
