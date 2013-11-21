package com.bg.app.controller;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.security.SummaryUser;

@Controller
@RequestMapping("/app")
public class MoreContorller {

	private String prefixView = "views_webapp/content/more/";
	
	@RequestMapping(value = "/more")
	public String moreIndex(Model model, GatherFilter gatherFilter, SummaryUser summaryUser){
		
		return "views_webapp/content/more";
	}
	
	@RequestMapping(value = "/login")
	public String login(Model model){
		return prefixView+"login";
	}
	
	@RequestMapping(value = "/emailLogin")
	public String emailLogin(Model model){
		return prefixView+"emailLogin";
	}
	
	@RequestMapping(value = "/join")
	public String join(Model model){
		return prefixView+"join";
	}
	
	@RequestMapping(value = "/agreement")
	public String agreement(Model model){
		return prefixView+"agreement";
	}
	
	@RequestMapping(value = "/individual")
	public String individual(Model model){
		return prefixView+"individual";
	}
	
	@RequestMapping(value = "/mirros")
	public String mirros(Model model){
		return prefixView+"mirros";
	}
	
}
