package com.bg.jtown.controller.validator;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.help.HelpService;
import com.bg.jtown.util.VaildationUtil;

@Component
public class PartnershipValidator implements Validator {

	@Resource
	private HelpService helpService;

	@Override
	public void validate(Object object, Errors errors) {
		Partnership partnership = (Partnership) object;

		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "categoryPn",
				"partnership.categoryPn.empty");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "content",
				"partnership.content.empty");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email",
				"partnership.email.empty");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name",
				"partnership.name.empty");

		String email = partnership.getEmail();
		if (!VaildationUtil.checkNullAndBlank(email)) {
			if (!VaildationUtil.emailFormCheck(email)) {
				errors.rejectValue("email", "partnership.email.notAllow");
			} else {
				Partnership loadPartnership = helpService
						.selectPartnership(new Partnership(null, null,
								partnership.getEmail(), null, null, null, null));
				if (loadPartnership != null) {
					errors.rejectValue("email", "partnership.email.exist");
				}
			}
		}

		String name = partnership.getName();
		if (!VaildationUtil.checkNullAndBlank(name)) {
			if (!VaildationUtil.onlyEucKR(name)) {
				errors.rejectValue("name", "partnership.name.notAllow");
			}
		}

		String phoneNumberNd = partnership.getPhoneNumberNd();
		if (!VaildationUtil.checkNullAndBlank(phoneNumberNd)) {
			if (!VaildationUtil.onlyNumber(phoneNumberNd)) {
				errors.rejectValue("phoneNumber",
						"partnership.phoneNumber.notAllow");
				errors.rejectValue("phoneNumberNd", "partnership.phoneNumberNd.check");
				errors.rejectValue("phoneNumberRd", "partnership.phoneNumberRd.check");
			} else {
				String phoneNumberRd = partnership.getPhoneNumberRd();
				if (!VaildationUtil.checkNullAndBlank(phoneNumberRd)) {
					if (!VaildationUtil.onlyNumber(phoneNumberRd)) {
						errors.rejectValue("phoneNumber",
								"partnership.phoneNumber.notAllow");
						errors.rejectValue("phoneNumberNd", "partnership.phoneNumberNd.check");
						errors.rejectValue("phoneNumberRd", "partnership.phoneNumberRd.check");
					} else {
						partnership.makePhoneNumber();
						Partnership loadPartnership = helpService
								.selectPartnership(new Partnership(null, null,
										null, null, partnership
												.getPhoneNumber(), null, null));
						if (loadPartnership != null) {
							errors.rejectValue("phoneNumber",
									"partnership.phoneNumber.exist");
							errors.rejectValue("phoneNumberNd", "partnership.phoneNumberNd.check");
							errors.rejectValue("phoneNumberRd", "partnership.phoneNumberRd.check");
						}
					}
				} else {
					errors.rejectValue("phoneNumber",
							"partnership.phoneNumber.empty");
					errors.rejectValue("phoneNumberNd", "partnership.phoneNumberNd.check");
					errors.rejectValue("phoneNumberRd", "partnership.phoneNumberRd.check");
				}
			}
		} else {
			errors.rejectValue("phoneNumber", "partnership.phoneNumber.empty");
			errors.rejectValue("phoneNumberNd", "partnership.phoneNumberNd.check");
			errors.rejectValue("phoneNumberRd", "partnership.phoneNumberRd.check");
		}

	}

	@Override
	public boolean supports(Class<?> clazz) {
		return Partnership.class.isAssignableFrom(clazz);
	}
}
