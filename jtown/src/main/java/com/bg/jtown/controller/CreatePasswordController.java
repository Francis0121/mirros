package com.bg.jtown.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.security.authentication.dao.SaltSource;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;

@Controller
public class CreatePasswordController{

	private String prefixView = "views/content/admin/";

	@Autowired
	private CustomJdbcUserDetailManager userDetailsService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private SaltSource saltSource;

	@RequestMapping(value = "createpw", method = RequestMethod.GET)
	public String createPW(Model model) {
		return prefixView + "createpw";
	}
	
	@RequestMapping(value = "createpwSubmit", method = RequestMethod.POST)
	public String createPWSubmit(Model model, @RequestParam(required=false) String password, @RequestParam(required=false) String salt) {
		JtownUser user = new JtownUser(); 
				//(JtownUser) userDetailsService.loadUsersByUsername(password).get(0);
		user.setUsername(password);
		user.setSalt(salt);
		System.out.println("password :"+ password);
		System.out.println("salt :"+ salt);
		String encodedPassword = passwordEncoder.encodePassword(password, saltSource.getSalt(user));
		System.out.println("create password :"+ encodedPassword);
		return "redirect:createpw";
	}
}
