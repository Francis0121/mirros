package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.connect.web.ProviderSignInUtils;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.social.twitter.api.TwitterProfile;
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
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.bg.jtown.controller.validator.LoginValidator;
import com.bg.jtown.security.Confirm;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.SummaryUser;
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
	@Resource
	private ConnectionFactoryLocator connectionFactoryLocator;
	@Resource
	private ConnectionRepository connectionRepository;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String showLogin(Model model) {
		return "login/login";
	}

	@RequestMapping(value = "/login/join", method = RequestMethod.GET)
	public String showJoin(Model model, @ModelAttribute JtownUser jtownUser,
			WebRequest request) {
		Connection<?> connection = ProviderSignInUtils.getConnection(request);
		if (connection != null) {
			if (connection.getApi() instanceof Twitter) {
				Twitter twitter = (Twitter) connection.getApi();
				TwitterProfile tp = twitter.userOperations().getUserProfile();

				jtownUser.setName(tp.getName());
				jtownUser.setSocial("twitter");
			}
		}
		String referer = request.getHeader("referer") == null ? "../" : request
				.getHeader("referer");
		logger.debug(referer);
		request.setAttribute("beforJoinUrl", referer, WebRequest.SCOPE_SESSION);
		return "login/join";
	}

	@RequestMapping(value = "/login/joinSubmit.jt", method = RequestMethod.POST)
	public String formJoin(Model model, @ModelAttribute JtownUser jtownUser,
			@RequestParam("confirmPassword") final String confirmPassword,
			BindingResult result, WebRequest request) {
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

		if (!result.hasErrors()) {
			String username = jtownUser.getUsername();
			String password = jtownUser.getPassword();

			customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser);
			emailSend.sendConfirmEmail(jtownUser.getUsername());
			userAuthenticator.login(username, password);

			if ("twitter".equals(jtownUser.getSocial())) {
				ProviderSignInUtils.handlePostSignUp(jtownUser.getPn()
						.toString(), request);
			}

			String beforeAddress = (String) request.getAttribute(
					"beforJoinUrl", WebRequest.SCOPE_SESSION);
			return "redirect:" + beforeAddress;
		} else {
			return "login/join";
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/modify", method = RequestMethod.GET)
	public String showModify(Model model, @ModelAttribute JtownUser jtownUser,
			@RequestParam(required = false) Integer result,
			NativeWebRequest request) {
		setNoCache(request);
		processFlash(request, model);

		model.addAttribute("result", result);
		Map<String, List<Connection<?>>> connections = connectionRepository
				.findAllConnections();
		model.addAttribute("providerIds",
				connectionFactoryLocator.registeredProviderIds());
		model.addAttribute("connectionMap", connections);

		logger.debug(model.toString());
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
	public String showModifyEmailAddress(Model model,
			@ModelAttribute JtownUser jtownUser,
			@RequestParam(required = false) Integer result) {
		model.addAttribute("result", result);
		return "login/modifyEmailAddress";
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/modifyEmailAddress.jt", method = RequestMethod.POST)
	public String formModifyEmailAddress(@ModelAttribute JtownUser jtownUser,
			BindingResult result, HttpServletRequest request,
			SummaryUser summaryUser) {
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
		if (!result.hasErrors()) {
			String username = jtownUser.getUsername();
			String password = jtownUser.getPassword();

			loginService.updateUserCustomerEmail(jtownUser.getUsername(),
					summaryUser.getUsername());
			emailSend.sendConfirmEmail(jtownUser.getUsername());
			userAuthenticator.login(username, password);
			return "redirect:modifyEmailAddress/?result=3";
		} else {
			return "login/modifyEmailAddress";
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/ajax/resendConfirmEmail.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxResendConfirmEmail(SummaryUser summaryUser) {
		String username = summaryUser.getUsername();
		if (username != null) {
			emailSend.sendConfirmEmail(summaryUser.getUsername());
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

	private void setNoCache(NativeWebRequest request) {
		HttpServletResponse response = request
				.getNativeResponse(HttpServletResponse.class);
		if (response != null) {
			response.setHeader("Pragma", "no-cache");
			response.setDateHeader("Expires", 1L);
			response.setHeader("Cache-Control", "no-cache");
			response.addHeader("Cache-Control", "no-store");
		}
	}

	private void processFlash(WebRequest request, Model model) {
		convertSessionAttributeToModelAttribute(DUPLICATE_CONNECTION_ATTRIBUTE,
				request, model);
		convertSessionAttributeToModelAttribute(PROVIDER_ERROR_ATTRIBUTE,
				request, model);
		convertSessionAttributeToModelAttribute("providerId", request, model);
	}

	private void convertSessionAttributeToModelAttribute(String attributeName,
			WebRequest request, Model model) {
		if (request
				.getAttribute(attributeName, RequestAttributes.SCOPE_SESSION) != null) {
			if ("social.addConnection.duplicate".equals(attributeName)) {
				model.addAttribute("socialDuplicate", true);
			} else if ("social.provider.error".equals(attributeName)) {
				model.addAttribute("socialError", true);
			} else if ("providerId".equals(attributeName)) {
				model.addAttribute("socialErrorProviderId", request
						.getAttribute("providerId",
								RequestAttributes.SCOPE_SESSION));
			}
			request.removeAttribute(attributeName,
					RequestAttributes.SCOPE_SESSION);
		}
	}

	private static final String DUPLICATE_CONNECTION_ATTRIBUTE = "social.addConnection.duplicate";

	private static final String PROVIDER_ERROR_ATTRIBUTE = "social.provider.error";

}
