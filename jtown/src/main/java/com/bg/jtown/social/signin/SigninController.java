package com.bg.jtown.social.signin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(value = "signinSocial")
public class SigninController {

	@RequestMapping(value = "/signin", method = RequestMethod.GET)
	public void signin() {
	}
}