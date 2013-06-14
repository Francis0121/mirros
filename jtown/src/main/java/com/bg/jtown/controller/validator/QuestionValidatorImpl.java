package com.bg.jtown.controller.validator;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import com.bg.jtown.business.Question;
import com.bg.jtown.util.ValidationUtil;

@Component
public class QuestionValidatorImpl implements Validator {

	@Override
	public boolean supports(Class<?> clazz) {
		return Question.class.isAssignableFrom(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {
		Question question = (Question) target;

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name",
				"question.name.empty");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email",
				"question.email.empty");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "title",
				"question.title.empty");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "content",
				"question.content.empty");

		String email = question.getEmail();
		if (!ValidationUtil.checkNullAndBlank(email)) {
			if (!ValidationUtil.emailFormCheck(email)) {
				errors.rejectValue("email", "question.email.notAllow");
			}
		}

		String name = question.getName();
		if (!ValidationUtil.checkNullAndBlank(name)) {
			if (!ValidationUtil.onlyEucKR(name)) {
				errors.rejectValue("name", "question.name.notAllow");
			}
		}

		String content = question.getContent();
		if (!ValidationUtil.checkNullAndBlank(content)) {
			if (!ValidationUtil.lengthCheck(content, 10, 3000)) {
				errors.rejectValue("content", "question.content.notAllow");
			}
		}

	}

}
