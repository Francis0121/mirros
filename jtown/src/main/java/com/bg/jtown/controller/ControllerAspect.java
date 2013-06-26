package com.bg.jtown.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.springframework.validation.support.BindingAwareModelMap;

import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.SummaryUser;

/**
 * @author Francis, 박광열
 * 
 */
@Aspect
@Component
public class ControllerAspect {

	private final Logger logger = LoggerFactory
			.getLogger(ControllerAspect.class);

	@Resource
	private HttpServletRequest request;

	@Resource
	private SellerService sellerService;

	@Resource
	private Facebook facebook;

	@Around("bean(*Controller)")
	public Object trace(ProceedingJoinPoint joinPoint) throws Throwable {
		String signatureString = joinPoint.getSignature().toShortString();
		logger.info(signatureString + " 시작");
		long start = System.currentTimeMillis();

		try {
			Object[] param = joinPoint.getArgs();

			HttpSession session = request.getSession();
			SummaryUser summaryUser;
			String remoteIp = request.getRemoteAddr();
			try {
				JtownUser user = (JtownUser) SecurityContextHolder.getContext()
						.getAuthentication().getPrincipal();
				logger.debug(user.toString());
				summaryUser = new SummaryUser(user.getGroupName(), true,
						user.getName(), user.getPn(), remoteIp,
						user.getUsername(), user.getFacebookFeed());
			} catch (ClassCastException e) {
				logger.debug("Not Log In user");
				summaryUser = new SummaryUser(null, false, null, null,
						remoteIp, null, null);
			}

			for (int i = 0; i < param.length; i++) {
				if (param[i] != null) {
					if (param[i].getClass() == HttpSession.class) {
						param[i] = session;
					} else if (param[i].getClass() == SummaryUser.class) {
						param[i] = summaryUser;
					}
					logger.debug("Object = " + param[i].toString()
							+ param[i].getClass());
				}
			}
			return joinPoint.proceed(param);
		} finally {
			long finish = System.currentTimeMillis();
			logger.info(signatureString + " 종료");
			logger.info(signatureString + " 실행 시간 : " + (finish - start) + "ms");
		}
	}

	@AfterReturning(value = "bean(*Controller)", returning = "view")
	public void after(JoinPoint joinPoint, Object view) {
		if (view.getClass() ==  String.class) {
			String realView = (String) view;
			logger.debug("viewName : " + realView);

			Object[] param = joinPoint.getArgs();

			for (int i = 0; i < param.length; i++) {
				if (param[i] != null) {
					if (param[i].getClass() == BindingAwareModelMap.class) {
						Model model = (Model) param[i];
						model.addAttribute("rv", realView);
					}
				}
			}
		}
	}
}
