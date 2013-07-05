package com.bg.mobile.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(value = "mobileCommonController")
@RequestMapping("/m")
public class CommonController {

	private String prefixView = "views_mobile/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	@RequestMapping(value = "/individual", method = RequestMethod.GET)
	public String showIndividual() {
		return prefixView + "common/individual";
	}

	@RequestMapping(value = "/agreement", method = RequestMethod.GET)
	public String showAgreement() {
		return prefixView + "common/agreement";
	}
}
