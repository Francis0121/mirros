package com.bg.jtown.controller;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.cache.NullUserCache;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.connect.web.ProviderSignInUtils;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.social.twitter.api.TwitterProfile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Assert;
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

import com.bg.jtown.business.search.HomeFilter;
import com.bg.jtown.controller.validator.LoginValidatorImpl;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.Confirm;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.security.UserAuthenticator;
import com.bg.jtown.security.algorithm.SeedCipher;
import com.bg.jtown.util.StringUtil;
import com.bg.jtown.util.ValidationUtil;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory
			.getLogger(LoginController.class);

	private UserCache userCache = new NullUserCache();

	/**
	 * Optionally sets the UserCache if one is in use in the application. This
	 * allows the user to be removed from the cache after updates have taken
	 * place to avoid stale data.
	 * 
	 * @param userCache
	 *            the cache used by the AuthenticationManager.
	 */
	public void setUserCache(UserCache userCache) {
		Assert.notNull(userCache, "userCache cannot be null");
		this.userCache = userCache;
	}

	@Resource
	private LoginValidatorImpl loginValidatorImpl;
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

	@RequestMapping(value = "/signin", method = RequestMethod.GET)
	public String showSigninRedirect(Model model) {
		return "login/signin";
	}

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String showLogin(Model model) {
		return "login/login";
	}

	@RequestMapping(value = "/noPermission", method = RequestMethod.GET)
	public String showNoPermissionPage() {
		return "login/noPermission";
	}

	@RequestMapping(value = "/process")
	public String showProcessRedirect(HttpSession session,
			HomeFilter homeFilter, SummaryUser summaryUser, Model model) {

		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.ADMIN)
				|| authority.equals(Authority.ROOT_ADMIN)) {
			return "redirect:admin";
		} else if (authority.equals(Authority.SELLER)) {
			return "redirect:seller/" + summaryUser.getPn();
		} else if (authority.equals(Authority.CUSTOMER)) {
			// TODO 사용자 맞춤형k메뉴 검색시 추가
			// session.setAttribute("interestMap",
			// homeService.selectInterest(summaryUser.getPn()));
			return "redirect:";
		} else {
			return "redirect:";
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/disactive.jt", method = RequestMethod.POST)
	public String formDisactive(
			@ModelAttribute(value = "disactiveUser") JtownUser jtownUser,
			BindingResult result, HttpSession session, SummaryUser summaryUser,
			Model model) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)
				|| authority.equals(Authority.ADMIN)) {
			return "redirect:/noPermission";
		}

		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;

				if (jtownUser.getPassword() == null) {
					errors.rejectValue("password", "join.password.empty");
				} else {
					if (customJdbcUserDetailManager.confirmPassword(jtownUser)) {
						errors.rejectValue("password",
								"change.password.notEqualPassword");
					}
				}
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);

		Integer pn = summaryUser.getPn();
		if (!result.hasErrors()) {
			loginService.insertDeleteUser(pn);
			model.addAllAttributes(loginService.selectDeleteUser(pn));
			return "redirect:modify";
		} else {
			Map<String, List<Connection<?>>> connections = connectionRepository
					.findAllConnections();
			model.addAttribute("providerIds",
					connectionFactoryLocator.registeredProviderIds());
			model.addAttribute("connectionMap", connections);

			if (summaryUser.getEnumAuthority() == Authority.CUSTOMER) {
				JtownUser user = loginService.selectCustomer(pn);
				user.setUsername(summaryUser.getUsername());
				user.setName(summaryUser.getName());
				model.addAttribute("jtownUser", user);
				model.addAllAttributes(loginService.selectDeleteUser(pn));
				model.addAttribute("disactiveUser", jtownUser);
				model.addAttribute("disactiveError", true);
			} else {
				JtownUser user = new JtownUser();
				user.setUsername(summaryUser.getUsername());
				model.addAttribute("jtownUser", user);
			}
			return "login/modify";
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/disactive.jt", method = RequestMethod.DELETE)
	public String formDisactiveDelete(
			@ModelAttribute(value = "disactiveUser") JtownUser jtownUser,
			BindingResult result, HttpSession session, SummaryUser summaryUser,
			Model model) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)
				|| authority.equals(Authority.ADMIN)) {
			return "redirect:/noPermission";
		}

		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;

				if (jtownUser.getPassword() == null) {
					errors.rejectValue("password", "join.password.empty");
				} else {
					if (customJdbcUserDetailManager.confirmPassword(jtownUser)) {
						errors.rejectValue("password",
								"change.password.notEqualPassword");
					}
				}
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);

		Integer pn = summaryUser.getPn();
		if (!result.hasErrors()) {
			loginService.deleteDeleteUser(pn);
			return "redirect:modify";
		} else {
			Map<String, List<Connection<?>>> connections = connectionRepository
					.findAllConnections();
			model.addAttribute("providerIds",
					connectionFactoryLocator.registeredProviderIds());
			model.addAttribute("connectionMap", connections);

			if (summaryUser.getEnumAuthority() == Authority.CUSTOMER) {
				JtownUser user = loginService.selectCustomer(pn);
				user.setUsername(summaryUser.getUsername());
				user.setName(summaryUser.getName());
				model.addAttribute("jtownUser", user);
				model.addAllAttributes(loginService.selectDeleteUser(pn));
				model.addAttribute("disactiveUser", jtownUser);
				model.addAttribute("disactiveError", true);
			} else {
				JtownUser user = new JtownUser();
				user.setUsername(summaryUser.getUsername());
				model.addAttribute("jtownUser", user);
			}
			return "login/modify";
		}
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
		request.setAttribute("beforJoinUrl", referer, WebRequest.SCOPE_SESSION);
		return "login/join";
	}

	@RequestMapping(value = "/login/joinSubmit.jt", method = RequestMethod.POST)
	public String formJoin(Model model, @ModelAttribute JtownUser jtownUser,
			@RequestParam("confirmPassword") final String confirmPassword,
			BindingResult result, WebRequest request) {
		loginValidatorImpl.validate(jtownUser, result);
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;

				if (jtownUser.getPassword() == null) {
					errors.rejectValue("password", "join.password.empty");
				} else if (ValidationUtil.confirmPassword(
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
	public String showModify(Model model, SummaryUser summaryUser,
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

		if (summaryUser.getEnumAuthority() == Authority.CUSTOMER) {
			JtownUser jtownUser = loginService.selectCustomer(summaryUser
					.getPn());
			jtownUser.setUsername(summaryUser.getUsername());
			jtownUser.setName(summaryUser.getName());
			model.addAttribute("jtownUser", jtownUser);
			model.addAllAttributes(loginService.selectDeleteUser(summaryUser
					.getPn()));
			model.addAttribute("disactiveUser", new JtownUser());
		} else {
			JtownUser jtownUser = new JtownUser();
			jtownUser.setUsername(summaryUser.getUsername());
			model.addAttribute("jtownUser", jtownUser);
		}
		return "login/modify";
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value = "/login/modify.jt", method = RequestMethod.POST)
	public String formPassword(@ModelAttribute JtownUser jtownUser,
			BindingResult result, @RequestParam final String confirmPassword,
			Model model, final SummaryUser summaryUser,
			HttpServletRequest request, HttpServletResponse response) {
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;
				if (customJdbcUserDetailManager.confirmPassword(jtownUser)) {
					errors.rejectValue("password",
							"change.password.notEqualPassword");
				}

				String newPassword = jtownUser.getNewPassword();

				if (!ValidationUtil.checkNullAndBlank(newPassword)) {
					if (ValidationUtil.confirmPassword(newPassword,
							confirmPassword)) {
						errors.rejectValue("newPassword",
								"join.password.isNotEqual");
					} else if (!ValidationUtil.lengthCheck(newPassword, 7, 16)) {
						errors.rejectValue("newPassword",
								"join.password.notAllow");
					}
				}

				String nowUsername = summaryUser.getUsername();
				String changeUsername = jtownUser.getUsername();

				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username",
						"join.username.empty");
				Authority authority = summaryUser.getEnumAuthority();

				if (!ValidationUtil.checkNullAndBlank(changeUsername)) {
					if (!nowUsername.equals(changeUsername)) {
						if (authority.equals(Authority.CUSTOMER)) {
							if (!ValidationUtil.emailFormCheck(changeUsername)) {
								errors.rejectValue("username",
										"join.username.notAllow");
							}
						} else if (authority.equals(Authority.SELLER)
								|| authority.equals(Authority.ADMIN)) {
							if (!ValidationUtil.checkCharAndLength(
									changeUsername, 0, 20)) {
								errors.rejectValue("username",
										"join.username.notAllowId");
							}
						}

						boolean exist = loginService
								.selectCheckExistEmail(changeUsername);
						if (exist) {
							errors.rejectValue("username",
									"join.username.exist");
						}
					}
				}

				if (authority.equals(Authority.CUSTOMER)) {
					ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name",
							"join.nickName.empty");

					String name = jtownUser.getName();
					if (!ValidationUtil.checkCharAndLength(name, 0, 20)) {
						errors.rejectValue("name", "join.nickName.notAllow");
					}
				}
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);

		Authority authority = summaryUser.getEnumAuthority();
		if (!result.hasErrors()) {
			if (authority.equals(Authority.CUSTOMER)) {
				jtownUser.setPn(summaryUser.getPn());
				jtownUser.setConfirmEmail(null);
				loginService.updateUserCustomer(jtownUser);
			}

			// 아이디 변경전
			String nowUsername = summaryUser.getUsername();
			String changeUsername = jtownUser.getUsername();
			if (!ValidationUtil.checkNullAndBlank(changeUsername)) {
				if (!nowUsername.equals(changeUsername)) {
					if (authority.equals(Authority.CUSTOMER)) {
						loginService.updateUserCustomerEmail(changeUsername,
								nowUsername);
						emailSend.sendConfirmEmail(changeUsername);
					} else if (authority.equals(Authority.SELLER)
							|| authority.equals(Authority.ADMIN)) {
						loginService
								.updateUsername(changeUsername, nowUsername);
					}
					summaryUser.setUsername(changeUsername);
				}
			}

			// 아이디 변경후
			String newPassword = jtownUser.getNewPassword();
			if (!ValidationUtil.checkNullAndBlank(newPassword)) {
				jtownUser.setNewPassword(newPassword);
				jtownUser.setUsername(summaryUser.getUsername());
				customJdbcUserDetailManager.changePassword(jtownUser);
			}

			userCache.removeUserFromCache(jtownUser.getUsername());
			userAuthenticator.onApplicationEvent(jtownUser.getUsername(),
					request, response);
			return "redirect:modify/?result=2";
		} else {
			Map<String, List<Connection<?>>> connections = connectionRepository
					.findAllConnections();
			model.addAttribute("providerIds",
					connectionFactoryLocator.registeredProviderIds());
			model.addAttribute("connectionMap", connections);

			if (authority.equals(Authority.CUSTOMER)) {
				model.addAllAttributes(loginService
						.selectDeleteUser(summaryUser.getPn()));
				model.addAttribute("disactiveUser", new JtownUser());
			}
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

				if (!ValidationUtil.checkNullAndBlank(username)) {
					if (!ValidationUtil.emailFormCheck(username)) {
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
	public ModelAndView formConfirmEmailAddress(
			@ModelAttribute Confirm confirm, HttpServletRequest request,
			HttpServletResponse response) {
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

			userAuthenticator.onApplicationEvent(id, request, response);
			mav.addObject("confirm", 1);
		} else {
			mav.addObject("confirm", 2);
		}
		return mav;
	}

	@RequestMapping(value = "/login/findPassword", method = RequestMethod.GET)
	public String showFindPassword(Model model,
			@RequestParam(required = false) Integer result) {
		model.addAttribute("jtownUser", new JtownUser());
		model.addAttribute("sellerUser", new JtownUser());
		model.addAttribute("result", result);
		return "login/findPassword";
	}

	@RequestMapping(value = "/login/findUserPassword.jt", method = RequestMethod.POST)
	public String formFindUserPassword(Model model,
			@ModelAttribute JtownUser jtownUser, BindingResult result) {
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;
				String username = jtownUser.getUsername();
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username",
						"join.username.empty");

				if (!ValidationUtil.checkNullAndBlank(username)) {
					boolean exist = loginService
							.selectCheckExistEmail(username);
					if (!exist) {
						errors.rejectValue("username", "join.username.notExist");
					}
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
			model.addAttribute("sellerUser", new JtownUser());
			return "login/findPassword";
		}
	}

	@RequestMapping(value = "/login/findSellerPassword.jt", method = RequestMethod.POST)
	public String formFindSellerPassword(Model model,
			@ModelAttribute(value = "sellerUser") JtownUser jtownUser,
			BindingResult result) {
		String username = jtownUser.getUsername();
		final Integer pn = loginService.selectCheckExistSellerEmail(username);
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;
				String username = jtownUser.getUsername();
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username",
						"join.username.empty");

				if (!ValidationUtil.checkNullAndBlank(username)) {
					if (pn == null) {
						errors.rejectValue("username", "join.username.notExist");
					}
				}
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);

		if (!result.hasErrors()) {
			emailSend.sendSellerTempPasswordEmail(pn);
			return "redirect:findPassword/?result=4";
		} else {
			model.addAttribute("jtownUser", new JtownUser());
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

	@RequestMapping(value = "/login/modifyFacebookFeed.jt", method = RequestMethod.POST)
	public String formModifyFacebookFeed(SummaryUser summaryUser,
			HttpServletRequest request, HttpServletResponse response) {
		JtownUser jtownUser = new JtownUser();
		jtownUser.setPn(summaryUser.getPn());
		jtownUser.setFacebookFeed(!summaryUser.getFacebookFeed());

		loginService.updateFacebookFeed(jtownUser);

		userAuthenticator.onApplicationEvent(summaryUser.getUsername(),
				request, response);

		return "redirect:modify/?result=2";
	}

}
