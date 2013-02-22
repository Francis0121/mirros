package com.bg.jtown.controller.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.servlet.view.RedirectView;

public class AuthCheckInterceptor extends HandlerInterceptorAdapter{
	
	private static final Logger logger = LoggerFactory
			.getLogger(AuthCheckInterceptor.class);
	
	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {

		 Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		 
		 if(auth.getName().equals("admin")){
			 modelAndView.setViewName("admin/main");
		 } else if(auth.getName().equals("seller")){
			 logger.debug(auth.getName());
		 } 
	}
}
