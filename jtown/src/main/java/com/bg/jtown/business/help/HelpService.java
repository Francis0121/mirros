package com.bg.jtown.business.help;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Json;
import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.search.PartnershipFilter;
import com.bg.jtown.security.Authority;

/**
 * @author Francis
 * 
 */
public interface HelpService {

	// ~ Partnership

	Integer selectPartnershipCategory(Integer pn);

	Map<String, Object> selectObject(PartnershipFilter partnershipFilter);

	List<Partnership> selectPartnerships(PartnershipFilter partnershipFilter);

	Partnership selectPartnership(Partnership partnership);

	Integer selectPartnershipCount(PartnershipFilter partnershipFilter);

	void insertPartnership(Partnership partnership);

	void deletePartnership(Partnership partnership);

	void updatePatnership(Partnership partnership);

	void updatePartnershipJson(Json json, Authority authority);

	Partnership updatePatnershipCategory(Partnership partnership);


}
