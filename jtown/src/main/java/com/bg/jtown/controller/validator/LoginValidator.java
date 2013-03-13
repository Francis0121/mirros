package com.bg.jtown.controller.validator;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.util.VaildationUtil;

/**
 * @author 박광열
 * 
 */
@Component
public class LoginValidator implements Validator {

	@Resource(name = "loginServiceImpl")
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
		String name = jtownUser.getName();

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username",
				"join.username.empty");

		boolean exist = loginService.selectCheckExistEmail(username);
		if (exist) {
			errors.rejectValue("username", "join.username.exist");
		}

		if (!VaildationUtil.checkNullAndBlank(username)) {
			if (!VaildationUtil.emailFormCheck(username)) {
				errors.rejectValue("username", "join.username.notAllow");
			}
		}

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password",
				"join.password.empty");

		if (!VaildationUtil.checkNullAndBlank(password)) {
			if (!VaildationUtil.lengthCheck(password, "password")) {
				errors.rejectValue("password", "join.password.notAllow");
			}
		}

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name",
				"join.nickName.empty");

		if (!VaildationUtil.checkNullAndBlank(name)) {
			if (!VaildationUtil.lengthCheck(name, "nickName")) {
				errors.rejectValue("name", "join.nickName.notAllow");
			}
		}
	}
}
