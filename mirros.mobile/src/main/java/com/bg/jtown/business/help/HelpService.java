package com.bg.jtown.business.help;

import java.util.List;
import java.util.Map;

import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.Question;
import com.bg.jtown.business.QuestionSection;

/**
 * @author Francis
 * 
 */
public interface HelpService {

	// ~ Partnership

	Integer selectPartnershipCategory(Integer pn);

	void insertPartnership(Partnership partnership);
	
	Partnership selectPartnership(Partnership partnership);
	
	// ~ FAQ

	Map<String, List<QuestionSection>> selectQuestionCategoriesMap();

	void insertQuestion(Question question);

}
