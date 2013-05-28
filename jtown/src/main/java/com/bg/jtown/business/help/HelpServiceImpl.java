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
import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.search.PartnershipFilter;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class HelpServiceImpl extends SqlSessionDaoSupport implements
		HelpService {

	@Resource
	private HomeService homeService;

	// ~ Partnership
	@Override
	public Map<String, Object> selectObject(PartnershipFilter partnershipFilter) {
		Map<String, Object> selectMap = new HashMap<String, Object>();

		selectMap.put("partnerships", selectPartnership(partnershipFilter));

		List<Interest> interestCatogies = homeService.selecInterestCategory();
		Map<Integer, String> interestCategoryMap = new HashMap<Integer, String>();
		for (Interest ic : interestCatogies) {
			interestCategoryMap.put(ic.getCategoryPn(), ic.getName());
		}
		selectMap.put("interestCategoryMap", interestCategoryMap);

		List<JtownUser> jtownUsers = getSqlSession().selectList(
				"helpMapper.selectAdminIdList");
		selectMap.put("usersAdmin", jtownUsers);
		return selectMap;
	}

	@Override
	public List<Partnership> selectPartnership(
			PartnershipFilter partnershipFilter) {
		Pagination pagination = partnershipFilter.getPagination();
		int count = selectPartnershipCount(partnershipFilter);
		if (count == 0) {
			return new ArrayList<Partnership>();
		}
		pagination.setNumItems(count);

		List<Partnership> partnerships = getSqlSession().selectList(
				"helpMapper.selectPartnershipList", partnershipFilter);
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
}
