package com.bg.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.security.SummaryUser;

@Controller
@RequestMapping("/app")
public class MoreContorller {

	@RequestMapping("/more")
	public String moreIndex(Model model, GatherFilter gatherFilter, SummaryUser summaryUser){
		
		return "views_webapp/content/more";
	}
}
