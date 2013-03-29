package com.bg.jtown.business.help;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.search.PartnershipFilter;

/**
 * @author Francis
 * 
 */
public interface HelpService {

	// ~ Partnershop

	Map<String, Object> selectObject(PartnershipFilter partnershipFilter);

	List<Partnership> selectPartnership(PartnershipFilter partnershipFilter);

	Partnership selectPartnership(Partnership partnership);

	Integer selectPartnershipCount(PartnershipFilter partnershipFilter);

	void insertPartnership(Partnership partnership);

	void deletePartnership(Partnership partnership);

	void updatePatnership(Partnership partnership);

}
