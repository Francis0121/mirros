package com.bg.jtown.business.help;

import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.search.PartnershipFilter;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class HelpServiceImpl extends SqlSessionDaoSupport implements
		HelpService {

	// ~ Partnership

	@Override
	public List<Partnership> selectPartnership(
			PartnershipFilter partnershipFilter) {
		Pagination pagination = new Pagination();
		int count = selectPartnershipCount(partnershipFilter);
		pagination.setNumItems(count);

		List<Partnership> partnerships = getSqlSession().selectList(
				"helpMapper.selectPartnershipList", partnershipFilter);
		return partnerships;
	}

	@Override
	public Partnership selectPartnership(Integer partnershipPn) {
		return getSqlSession().selectOne("helpMapper.selectPartnership",
				partnershipPn);
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
