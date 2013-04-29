package com.bg.jtown.social.connect;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.connect.web.ConnectController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UrlPathHelper;

public class SocialConnectionController extends ConnectController {
	
	private static final Logger logger = LoggerFactory.getLogger(SocialConnectionController.class);
	
	private final UrlPathHelper urlPathHelper = new UrlPathHelper();
	
	@Inject
	public SocialConnectionController(
			ConnectionFactoryLocator connectionFactoryLocator,
			ConnectionRepository connectionRepository) {
		super(connectionFactoryLocator, connectionRepository);
	}
	
	@Override
	protected RedirectView connectionStatusRedirect(String providerId,
			NativeWebRequest request) {
		HttpServletRequest servletRequest = request.getNativeRequest(HttpServletRequest.class);
		String path = "/login/modify";
		if (prependServletPath(servletRequest)) {
			path = servletRequest.getServletPath() + path;
		}
		logger.debug(" Redirect Path  : " +path);
		return new RedirectView(path, true);
	}
	
	private boolean prependServletPath(HttpServletRequest request) {
		logger.debug(this.urlPathHelper.getPathWithinServletMapping(request));
		return !this.urlPathHelper.getPathWithinServletMapping(request).equals("");
	}
}
