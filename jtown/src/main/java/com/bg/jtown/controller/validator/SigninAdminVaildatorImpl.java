package com.bg.jtown.controller.validator;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.util.ValidationUtil;

@Component
public class SigninAdminVaildatorImpl implements Validator {

	@Resource
	private LoginService loginService;

	@Override
	public boolean supports(Class<?> clazz) {
		return JtownUser.class.isAssignableFrom(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {
		JtownUser jtownUser = (JtownUser) target;
		String username = jtownUser.getUsername();
		String password = jtownUser.getPassword();
		String email = jtownUser.getEmail();
		String name = jtownUser.getName();

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username",
				"join.username.empty");

		boolean exist = loginService.selectCheckExistAdminUsername(username);
		if (exist) {
			errors.rejectValue("username", "join.username.exist");
		}

		if (!ValidationUtil.checkNullAndBlank(username)) {
			if (!ValidationUtil.checkCharAndLength(username, 0, 20)) {
				errors.rejectValue("username", "join.username.notAllow");
			}
		}

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password",
				"join.password.empty");

		if (!ValidationUtil.checkNullAndBlank(password)) {
			if (!ValidationUtil.lengthCheck(password, 7, 16)) {
				errors.rejectValue("password", "join.password.notAllow");
			}
		}

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email",
				"join.email.empty");
		exist = loginService.selectCheckExistAdminEmail(email);
		if (exist) {
			errors.rejectValue("username", "join.email.exist");
		}
		if (!ValidationUtil.checkNullAndBlank(email)) {
			if (!ValidationUtil.emailFormCheck(email)) {
				errors.rejectValue("email", "join.email.notAllow");
			}
		}

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name",
				"join.nickName.empty");

		if (!ValidationUtil.checkNullAndBlank(name)) {
			if (!ValidationUtil.checkCharAndLength(name, 0, 20)) {
				errors.rejectValue("name", "join.nickName.notAllow");
			}
		}
	}

}
