package com.bg.app.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bg.jtown.business.home.GatherService;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.security.SummaryUser;

@Controller
@RequestMapping("/app")
public class LikeController {

	@Autowired
	private GatherService gatherService;

	private String prefixView = "views_webapp/content/";

	@RequestMapping(value = "/like", method = RequestMethod.GET)
	public String likeView(Model model, HttpSession session, @ModelAttribute GatherFilter gatherFilter, SummaryUser summaryUser) {
		model.addAttribute("myHeartList", gatherService.selectMyHeartList(summaryUser.getPn()));
		model.addAttribute("categoryType", "like");
		model.addAttribute("username", summaryUser.getName());
		return prefixView + "like";
	}

}
