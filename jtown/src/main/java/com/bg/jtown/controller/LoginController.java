package com.bg.jtown.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.bg.jtown.business.LoginService;
import com.bg.jtown.controller.validator.LoginValidator;
import com.bg.jtown.controller.validator.VaildationUtil;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.UserAuthenticator;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory
			.getLogger(LoginController.class);
	
	private LoginValidator loginValidator;
	private LoginService loginService;
	private UserAuthenticator userAuthenticator;
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	
	@Autowired
	private void config(LoginValidator loginValidator, LoginService loginService, UserAuthenticator userAuthenticator, CustomJdbcUserDetailManager customJdbcUserDetailManager){
		this.loginValidator = loginValidator;
		this.loginService = loginService;
		this.userAuthenticator = userAuthenticator;
		this.customJdbcUserDetailManager = customJdbcUserDetailManager;
	}
	

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String showLoginPage(Model model) {
		logger.debug("Show Login page");
		return "login/login";
	}

	@RequestMapping(value = "/login/join", method = RequestMethod.GET)
	public String showJoinPage(Model model, @ModelAttribute JtownUser jtownUser, HttpServletRequest request) {
		logger.debug("Show Join page");
		
		request.getSession().setAttribute("beforJoinUrl", request.getHeader("referer"));
		
		return "login/join";
	}
	
	@RequestMapping(value = "/login/joinSubmit", method = RequestMethod.POST)
	public ModelAndView joinSubmit(@ModelAttribute JtownUser jtownUser,
			@RequestParam("confirmPassword") final String confirmPassword,
			BindingResult result,
			HttpServletRequest request, HttpServletResponse response){
		ModelAndView mav = new ModelAndView();
		
		loginValidator.validate(jtownUser, result);
		
		new Validator() {			
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser)target;
				
				if(jtownUser.getPassword() == null){
					errors.rejectValue("password", "join.password.empty");
				} else if (VaildationUtil.confirmPassword(jtownUser.getPassword(), confirmPassword)){
					errors.rejectValue("password", "join.password.isNotEqual");
				}
				
			}
			
			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);
		
		if(!result.hasErrors()){			
			request.setAttribute("username", jtownUser.getUsername());
			request.setAttribute("password", jtownUser.getPassword());			

			customJdbcUserDetailManager.createUserCustomAndAuthority(jtownUser);
			
			userAuthenticator.login(request, response);
			
			String beforeAddress = (String) request.getSession().getAttribute("beforJoinUrl");
			
			logger.debug(beforeAddress);
			
			mav.setView(new RedirectView(beforeAddress));
		} else {
			mav.setViewName("login/join");
		}
		
		return mav;
	}

}
