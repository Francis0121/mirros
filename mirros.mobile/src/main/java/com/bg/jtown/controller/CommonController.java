package com.bg.jtown.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class CommonController {

	@RequestMapping(value = "/individual", method = RequestMethod.GET)
	public String showIndividual() {
		return "common/individual";
	}
	
	@RequestMapping(value = "/agreement", method = RequestMethod.GET)
	public String showAgreement() {
		return "common/agreement";
	}
}
