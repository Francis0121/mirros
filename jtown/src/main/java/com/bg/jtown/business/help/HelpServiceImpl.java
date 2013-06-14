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
import com.bg.jtown.business.Question;
import com.bg.jtown.business.QuestionCategory;
import com.bg.jtown.business.QuestionSection;
import com.bg.jtown.business.admin.AdminService;
import com.bg.jtown.business.search.PartnershipFilter;
import com.bg.jtown.business.search.QuestionFilter;
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
	public Integer selectPartnershipCategory(Integer pn) {
		return getSqlSession().selectOne(
				"helpMapper.selectPartnershipCategory", pn);
	}

	@Override
	public List<Partnership> selectPartnerships(
			PartnershipFilter partnershipFilter) {
		Pagination pagination = partnershipFilter.getPagination();
		int count = selectPartnershipCount(partnershipFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<Partnership>();
		}

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
		if (pn != null && !new Integer(0).equals(pn)) {
			adminService
					.deleteSellerInterest(new Interest(pn, null, null, null));
		}
		return lp;
	}

	// ~ FAQ
	@Override
	public Map<String, List<QuestionSection>> selectQuestionCategoriesMap() {
		List<QuestionCategory> qcs = selectQuestionCategories();
		if (qcs.size() == 0) {
			return null;
		}

		Map<String, List<QuestionSection>> map = new HashMap<String, List<QuestionSection>>();
		for (QuestionCategory q : qcs) {
			Integer categoryPn = q.getPn();
			List<QuestionSection> qss = selectQuestionSections(categoryPn);
			map.put(q.getName(), qss);
		}
		return map;
	}

	@Override
	public Map<String, Object> selectQuestionCategoriesList(
			QuestionFilter questionFilter) {
		Integer categoryPn = questionFilter.getCategoryPn();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("questionCategories", selectQuestionCategories());
		if (categoryPn != null) {
			map.put("questionSections", selectQuestionSections(categoryPn));
		}
		return map;
	}

	private List<QuestionSection> selectQuestionSections(Integer categoryPn) {
		return getSqlSession().selectList("helpMapper.selectQuestionSections",
				categoryPn);
	}

	private List<QuestionCategory> selectQuestionCategories() {
		return getSqlSession()
				.selectList("helpMapper.selectQuestionCategories");
	}

	@Override
	public void insertQuestion(Question question) {
		getSqlSession().insert("helpMapper.insertQuestion", question);
	}

	@Override
	public List<Question> selectQuestions(QuestionFilter questionFilter) {
		Pagination pagination = questionFilter.getPagination();
		int count = selectQuestionCount(questionFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<Question>();
		}

		return getSqlSession().selectList("helpMapper.selectQuestions",
				questionFilter);
	}

	@Override
	public Question selectQuestion(Integer questionPn) {
		return getSqlSession().selectOne("helpMapper.selectQuestion",
				questionPn);
	}

	private int selectQuestionCount(QuestionFilter questionFilter) {
		return getSqlSession().selectOne("helpMapper.selectQuestionCount",
				questionFilter);
	}
}
