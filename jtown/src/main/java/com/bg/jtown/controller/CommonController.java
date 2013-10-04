package com.bg.jtown.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class CommonController {

	// ~ Variable

	private String prefixView = "views/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	// ~ Show

	@RequestMapping(value = "/individual", method = RequestMethod.GET)
	public String showIndividual() {
		return prefixView + "common/individual";
	}

	@RequestMapping(value = "/agreement", method = RequestMethod.GET)
	public String showAgreement() {
		return prefixView + "common/agreement";
	}

	@RequestMapping(value = "/businessInfoPolicy", method = RequestMethod.GET)
	public String businessInfoPolicy() {
		return prefixView + "common/businessInfoPolicy";
	}

	@RequestMapping(value = "/businessUtilizationAgree", method = RequestMethod.GET)
	public String businessUtilizationAgree() {
		return prefixView + "common/businessUtilizationAgree";
	}
}
