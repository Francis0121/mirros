package com.bg.jtown.business.help;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.Question;
import com.bg.jtown.business.QuestionCategory;
import com.bg.jtown.business.QuestionSection;
import com.bg.jtown.business.home.HomeService;

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

	@Override
	public Integer selectPartnershipCategory(Integer pn) {
		return getSqlSession().selectOne(
				"helpMapper.selectPartnershipCategory", pn);
	}

	@Override
	public void insertPartnership(Partnership partnership) {
		partnership.setProcess(PROCESS_RECEIPT);
		partnership.setDeposit(DEPOSIT_NOT);
		getSqlSession().insert("helpMapper.insertPartnership", partnership);
	}

	@Override
	public Partnership selectPartnership(Partnership partnership) {
		return getSqlSession().selectOne("helpMapper.selectPartnership",
				partnership);
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

}
