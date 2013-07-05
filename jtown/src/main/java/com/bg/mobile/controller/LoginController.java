package com.bg.mobile.controller;

import javax.annotation.Resource;

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
import org.springframework.web.context.request.WebRequest;

import com.bg.jtown.controller.EmailSend;
import com.bg.jtown.controller.validator.LoginValidatorImpl;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.LoginService;
import com.bg.jtown.security.UserAuthenticator;
import com.bg.jtown.security.algorithm.SeedCipher;
import com.bg.jtown.util.ValidationUtil;

/**
 * @author Francis, 박광열
 * 
 */
@Controller(value = "mobileLoginController")
@RequestMapping("/m")
public class LoginController {

	// ~ Variable

	private String prefixView = "views_mobile/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	// ~ Dynamic Injection

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
		return prefixView + "login/signin";
	}

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String showLogin(Model model,
			@RequestParam(required = false) String error) {
		model.addAttribute("login_error", error);
		return prefixView + "login/login";
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
		return prefixView + "login/join";
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
			return prefixView + "login/join";
		}
	}

	@RequestMapping(value = "/login/findPassword", method = RequestMethod.GET)
	public String showFindPassword(Model model,
			@RequestParam(required = false) Integer result) {
		model.addAttribute("jtownUser", new JtownUser());
		model.addAttribute("sellerUser", new JtownUser());
		model.addAttribute("result", result);
		return prefixView + "login/findPassword";
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
			return prefixView + "login/findPassword";
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
			return prefixView + "login/findPassword";
		}
	}
}
