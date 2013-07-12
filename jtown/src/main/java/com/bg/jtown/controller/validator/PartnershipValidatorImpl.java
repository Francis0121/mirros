package com.bg.jtown.controller.validator;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.help.HelpService;
import com.bg.jtown.util.ValidationUtil;

@Component
public class PartnershipValidatorImpl implements Validator {

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
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "shopName",
				"partnership.shopName.empty");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "shopUrl",
				"partnership.shopUrl.empty");

		String email = partnership.getEmail();
		if (!ValidationUtil.checkNullAndBlank(email)) {
			if (!ValidationUtil.emailFormCheck(email)) {
				errors.rejectValue("email", "partnership.email.notAllow");
			} else {
				Partnership loadPartnership = helpService
						.selectPartnership(new Partnership(partnership
								.getEmail(), null));
				if (loadPartnership != null) {
					errors.rejectValue("email", "partnership.email.exist");
				}
			}
		}

		String name = partnership.getName();
		if (!ValidationUtil.checkNullAndBlank(name)) {
			if (!ValidationUtil.onlyEucKR(name)) {
				errors.rejectValue("name", "partnership.name.notAllow");
			}
		}

		String phoneNumberNd = partnership.getPhoneNumberNd();
		if (!ValidationUtil.checkNullAndBlank(phoneNumberNd)) {
			if (!ValidationUtil.onlyNumber(phoneNumberNd)) {
				errors.rejectValue("phoneNumber",
						"partnership.phoneNumber.notAllow");
				errors.rejectValue("phoneNumberNd",
						"partnership.phoneNumberNd.check");
				errors.rejectValue("phoneNumberRd",
						"partnership.phoneNumberRd.check");
			} else {
				String phoneNumberRd = partnership.getPhoneNumberRd();
				if (!ValidationUtil.checkNullAndBlank(phoneNumberRd)) {
					if (!ValidationUtil.onlyNumber(phoneNumberRd)) {
						errors.rejectValue("phoneNumber",
								"partnership.phoneNumber.notAllow");
						errors.rejectValue("phoneNumberNd",
								"partnership.phoneNumberNd.check");
						errors.rejectValue("phoneNumberRd",
								"partnership.phoneNumberRd.check");
					} else {
						partnership.makePhoneNumber();
						Partnership loadPartnership = helpService
								.selectPartnership(new Partnership(null,
										partnership.getPhoneNumber()));
						if (loadPartnership != null) {
							errors.rejectValue("phoneNumber",
									"partnership.phoneNumber.exist");
							errors.rejectValue("phoneNumberNd",
									"partnership.phoneNumberNd.check");
							errors.rejectValue("phoneNumberRd",
									"partnership.phoneNumberRd.check");
						}
					}
				} else {
					errors.rejectValue("phoneNumber",
							"partnership.phoneNumber.empty");
					errors.rejectValue("phoneNumberNd",
							"partnership.phoneNumberNd.check");
					errors.rejectValue("phoneNumberRd",
							"partnership.phoneNumberRd.check");
				}
			}
		} else {
			errors.rejectValue("phoneNumber", "partnership.phoneNumber.empty");
			errors.rejectValue("phoneNumberNd",
					"partnership.phoneNumberNd.check");
			errors.rejectValue("phoneNumberRd",
					"partnership.phoneNumberRd.check");
		}

		String shopName = partnership.getShopName();
		if (!ValidationUtil.checkNullAndBlank(shopName)) {
			if (!ValidationUtil.checkCharAndLength(shopName, 0, 30)) {
				errors.rejectValue("shopName", "partnership.shopName.notAllow");
			}
		}

		String shopUrl = partnership.getShopUrl();
		if (ValidationUtil.lengthCheck(shopUrl, 0, 100)) {
//			if (!ValidationUtil.homepageFormCheck(shopUrl)) {
//				errors.rejectValue("shopUrl", "partnership.shopUrl.notAllow");
//			}
		}
	}

	@Override
	public boolean supports(Class<?> clazz) {
		return Partnership.class.isAssignableFrom(clazz);
	}
}
