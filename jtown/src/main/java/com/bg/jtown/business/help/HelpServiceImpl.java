package com.bg.jtown.business.help;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.HomeService;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Json;
import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.admin.AdminService;
import com.bg.jtown.business.search.PartnershipFilter;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class HelpServiceImpl extends SqlSessionDaoSupport implements
		HelpService {

	private static final Integer PROCESS_RECEIPT = 1;
	private static final Integer DEPOSIT_NOT = 1; 
	@Resource
	private HomeService homeService;

	@Resource
	private AdminService adminService;

	// ~ Partnership
	@Override
	public Map<String, Object> selectObject(PartnershipFilter partnershipFilter) {
		Map<String, Object> selectMap = new HashMap<String, Object>();

		List<Partnership> partnerships = selectPartnerships(partnershipFilter);
		selectMap.put("partnerships", partnerships);

		List<Integer> pnList = new ArrayList<Integer>();
		for (Partnership p : partnerships) {
			JtownUser ju = p.getJtownUser();
			if (ju.getPn() != null && !ju.getPn().equals(0)) {
				pnList.add(ju.getPn());
			}
		}

		List<Interest> interestList = adminService
				.selectSellerInterestList(pnList);
		Map<Integer, Interest> interestMap = new HashMap<Integer, Interest>();
		for (Interest interest : interestList) {
			interestMap.put(interest.getSellerPn(), interest);
		}
		selectMap.put("interestMap", interestMap);

		List<Interest> interestCategories = homeService.selecInterestCategory();
		selectMap.put("interestCategories", interestCategories);

		List<JtownUser> jtownUsers = getSqlSession().selectList(
				"helpMapper.selectAdminIdList");
		selectMap.put("usersAdmin", jtownUsers);
		return selectMap;
	}

	@Override
	public List<Partnership> selectPartnerships(
			PartnershipFilter partnershipFilter) {
		Pagination pagination = partnershipFilter.getPagination();
		int count = selectPartnershipCount(partnershipFilter);
		if (count == 0) {
			return new ArrayList<Partnership>();
		}
		pagination.setNumItems(count);

		List<Partnership> partnerships = getSqlSession().selectList(
				"helpMapper.selectPartnerships", partnershipFilter);
		return partnerships;
	}

	@Override
	public Partnership selectPartnership(Partnership partnership) {
		return getSqlSession().selectOne("helpMapper.selectPartnership",
				partnership);
	}

	@Override
	public Integer selectPartnershipCount(PartnershipFilter partnershipFilter) {
		return getSqlSession().selectOne("helpMapper.selectPartnershipCount",
				partnershipFilter);
	}

	@Override
	public void insertPartnership(Partnership partnership) {
		partnership.setProcess(PROCESS_RECEIPT);
		partnership.setDeposit(DEPOSIT_NOT);
		getSqlSession().insert("helpMapper.insertPartnership", partnership);
	}

	@Override
	public void deletePartnership(Partnership partnership) {
		getSqlSession().delete("helpMapper.deletePartnership", partnership);
	}

	@Override
	public void updatePatnership(Partnership partnership) {
		getSqlSession().update("helpMapper.updatePatnership", partnership);
	}

	@Override
	public void updatePartnershipJson(Json json, Authority authority) {
		if (authority.equals(Authority.ADMIN)) {
			getSqlSession().update("helpMapper.updatePartnershipJsonA", json);
		} else if (authority.equals(Authority.SELLER)) {
			getSqlSession().update("helpMapper.updatePartnershipJsonS", json);
		}
	}

	@Override
	public Partnership updatePatnershipCategory(Partnership partnership) {
		updatePatnership(partnership);
		Partnership lp = selectPartnership(partnership);
		Integer pn = lp.getJtownUser().getPn();
		if(pn != null && !new Integer(0).equals(pn)){
			adminService.deleteSellerInterest(new Interest(pn, null, null, null));
		}
		return lp;
	}
}
