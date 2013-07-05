package com.bg.jtown.controller;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

/**
 * Ajax Cross Domain을 위한 CORS Filter
 * 
 * 모든 Header "Access-Control-Allow-Origin * " 추가
 * 
 * @author Francis
 * 
 */
public class CORSFilter implements Filter {

	public CORSFilter() {
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}

	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {

		((HttpServletResponse) response).addHeader(
				"Access-Control-Allow-Origin", "*");
		chain.doFilter(request, response);
	}
}