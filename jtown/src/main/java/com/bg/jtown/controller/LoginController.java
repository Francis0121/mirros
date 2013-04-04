package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.bg.jtown.controller.validator.LoginValidator;
import com.bg.jtown.security.Confirm;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.UserAuthenticator;
import com.bg.jtown.security.algorithm.SeedCipher;
import com.bg.jtown.util.StringUtil;
import com.bg.jtown.util.VaildationUtil;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory
			.getLogger(LoginController.class);

	@Resource
	private LoginValidator loginValidator;
	@Resource
	private UserAuthenticator userAuthenticator;
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	@Resource
	private EmailSend emailSend;
	@Resource
	private SeedCipher seedCipher;
	@Resource
	private LoginService loginService;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String showLoginPage(Model model) {
		logger.debug("Show Login page");
		return "login/login";
	}

	@RequestMapping(value = "/login/join", method = RequestMethod.GET)
	public String showJoinPage(Model model,
			@ModelAttribute JtownUser jtownUser, HttpServletRequest request) {
		logger.debug("Show Join page");

		request.getSession().setAttribute("beforJoinUrl",
				request.getHeader("referer"));

		return "login/join";
	}

	@RequestMapping(value = "/login/joinSubmit.jt", method = RequestMethod.POST)
	public ModelAndView formJoinSubmit(@ModelAttribute JtownUser jtownUser,
			@RequestParam("confirmPassword") final String confirmPassword,
			BindingResult result, HttpServletRequest request,
			HttpServletResponse response) {
		loginValidator.validate(jtownUser, result);
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;

				if (jtownUser.getPassword() == null) {
					errors.rejectValue("password", "join.password.empty");
				} else if (VaildationUtil.confirmPassword(
						jtownUser.getPassword(), confirmPassword)) {
					errors.rejectValue("password", "join.password.isNotEqual");
				}

			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);
		ModelAndView mav = new ModelAndView();
		if (!result.hasErrors()) {
			request.setAttribute("username", jtownUser.getUsername());
			request.setAttribute("password", jtownUser.getPassword());

			customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser);
			userAuthenticator.login(request, response);

			String beforeAddress = (String) request.getSession().getAttribute(
					"beforJoinUrl");
			logger.debug(beforeAddress);
			emailSend.sendConfirmEmail(jtownUser.getUsername());

			mav.setView(new RedirectView(beforeAddress));
		} else {
			mav.setViewName("login/join");
		}
		return mav;
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/modify", method = RequestMethod.GET)
	public String showModifyPage(Model model,
			@ModelAttribute JtownUser jtownUser,
			@RequestParam(required = false) Integer result) {
		model.addAttribute("result", result);
		return "login/modify";
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/modify.jt", method = RequestMethod.POST)
	public String formPassword(@ModelAttribute JtownUser jtownUser,
			@RequestParam final String confirmPassword, BindingResult result) {
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;
				if (customJdbcUserDetailManager.confirmPassword(jtownUser)) {
					errors.rejectValue("password",
							"change.password.notEqualPassword");
				}

				if (VaildationUtil
						.checkNullAndBlank(jtownUser.getNewPassword())) {
					errors.rejectValue("newPassword", "join.password.empty");
				} else if (VaildationUtil.confirmPassword(
						jtownUser.getNewPassword(), confirmPassword)) {
					errors.rejectValue("newPassword",
							"join.password.isNotEqual");
				}
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);

		if (!result.hasErrors()) {
			customJdbcUserDetailManager.changePassword(jtownUser.getPassword(),
					jtownUser.getNewPassword());

			return "redirect:modify/?result=2";
		} else {
			return "login/modify";
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/modifyEmailAddress", method = RequestMethod.GET)
	public String showModifyEmailAddressPage(Model model,
			@ModelAttribute JtownUser jtownUser,
			@RequestParam(required = false) Integer result) {
		model.addAttribute("result", result);
		return "login/modifyEmailAddress";
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/modifyEmailAddress.jt", method = RequestMethod.POST)
	public String formModifyEmailAddressPage(
			@ModelAttribute JtownUser jtownUser, BindingResult result,
			HttpServletRequest request, HttpServletResponse response) {
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;
				if (customJdbcUserDetailManager.confirmPassword(jtownUser)) {
					errors.rejectValue("password",
							"change.password.notEqualPassword");
				}
				String username = jtownUser.getUsername();
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
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);
		JtownUser nowUser;
		try {
			nowUser = (JtownUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (ClassCastException e) {
			logger.debug("로그인하지않은 사용자");
			return "redirect:/";
		}
		if (!result.hasErrors()) {
			loginService.updateUserCustomerEmail(jtownUser.getUsername(),
					nowUser.getUsername());

			request.setAttribute("username", jtownUser.getUsername());
			request.setAttribute("password", jtownUser.getPassword());

			userAuthenticator.login(request, response);

			emailSend.sendConfirmEmail(jtownUser.getUsername());
			return "redirect:modifyEmailAddress/?result=3";
		} else {
			return "login/modifyEmailAddress";
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/ajax/resendConfirmEmail.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxResendConfirmEmail() {
		try {
			JtownUser user = (JtownUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			logger.debug(user.toString());

			emailSend.sendConfirmEmail(user.getUsername());
		} catch (ClassCastException e) {
			logger.debug("로그인하지않은 사용자");
		}
	}

	@RequestMapping(value = "/resultEmailAddress", method = RequestMethod.GET)
	public String formConfirmEmailAddress(Model model,
			@RequestParam(required = false) Integer confirm) {
		model.addAttribute("confirm", confirm);
		return "login/confirmEmaillAddress";
	}

	@RequestMapping(value = "/confirmEmailAddress", method = RequestMethod.GET)
	public ModelAndView formConfirmEmailAddress(@ModelAttribute Confirm confirm) {
		ModelAndView mav = new ModelAndView(new RedirectView(
				"resultEmailAddress"));
		logger.debug(confirm.toString());

		String id = confirm.getId();
		JtownUser jtownUser = (JtownUser) customJdbcUserDetailManager
				.loadUserByUsername(id);
		String key = jtownUser.getSalt();
		String value = confirm.getSeries();
		value = StringUtil.replace(value, " ", "+");
		byte[] encryptbytes = Base64.decode(value);
		String decryptText = "";

		try {
			decryptText = seedCipher.decryptAsString(encryptbytes,
					key.getBytes(), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			logger.error("Error in Confimr Email Address Encoding");
			return mav;
		}
		Confirm loadConfirm = loginService.selectEmailConfirm(new Confirm(id));
		String loadSeries = loadConfirm.getSeries();
		if (loadSeries.equals(decryptText)) {
			JtownUser setJtownUser = new JtownUser();
			setJtownUser.setUsername(id);
			setJtownUser.setConfirmEmail(true);
			loginService.updateUserCustomer(setJtownUser);
			loginService.deleteEmailConfirm(new Confirm(id));

			userAuthenticator.onApplicationEvent(id);
			mav.addObject("confirm", 1);
		} else {
			mav.addObject("confirm", 2);
		}
		return mav;
	}

	@RequestMapping(value = "/login/findPassword", method = RequestMethod.GET)
	public String showFindPassword(Model model,
			@ModelAttribute JtownUser jtownUser,
			@RequestParam(required = false) Integer result) {
		model.addAttribute("result", result);
		return "login/findPassword";
	}

	@RequestMapping(value = "/login/findPassword.jt", method = RequestMethod.POST)
	public String formFindPassword(@ModelAttribute JtownUser jtownUser,
			BindingResult result) {
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;
				String username = jtownUser.getUsername();
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username",
						"join.username.empty");

				boolean exist = loginService.selectCheckExistEmail(username);
				if (!exist) {
					errors.rejectValue("username", "join.username.notExist");
				}
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);

		if (!result.hasErrors()) {
			emailSend.sendTempPasswordEmail(jtownUser.getUsername());
			return "redirect:findPassword/?result=4";
		} else {
			return "login/findPassword";
		}
	}
}
