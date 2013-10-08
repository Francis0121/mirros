package com.bg.jtown.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.SummaryUser;

/**
 * @author Francis, 박광열
 * 
 */
@Aspect
@Component
public class ControllerAspect {

	private final Logger logger = LoggerFactory.getLogger(ControllerAspect.class);

	@Resource
	private HttpServletRequest request;

	// @Resource
	// private SellerService sellerService;
	// @Resource
	// private Facebook facebook;

	@Around("bean(*Controller)")
	public Object trace(ProceedingJoinPoint joinPoint) throws Throwable {
		String signatureString = joinPoint.getSignature().toShortString();
		logger.debug(signatureString + " 시작");
		long start = System.currentTimeMillis();

		try {
			Object[] param = joinPoint.getArgs();

			HttpSession session = request.getSession();
			SummaryUser summaryUser;
			String remoteIp = request.getRemoteAddr();
			try {
				JtownUser user = (JtownUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
				summaryUser = new SummaryUser(user.getGroupName(), true, user.getName(), user.getPn(), remoteIp, user.getUsername(),
						user.getFacebookFeed());
				logger.info("Log In : " + summaryUser.getName());
				logger.debug(summaryUser.toString());
			} catch (ClassCastException e) {
				summaryUser = new SummaryUser(null, false, null, null, remoteIp, null, null);
				logger.debug("Not Log In user");
			}

			for (int i = 0; i < param.length; i++) {
				if (param[i] != null) {
					if (param[i].getClass() == HttpSession.class) {
						param[i] = session;
					} else if (param[i].getClass() == SummaryUser.class) {
						param[i] = summaryUser;
					}
					logger.debug("Param Class : " + param[i].getClass());
				}
			}
			return joinPoint.proceed(param);
		} finally {
			long finish = System.currentTimeMillis();
			logger.debug(signatureString + " 종료");
			logger.debug(signatureString + " 실행 시간 : " + (finish - start) + "ms");
		}
	}

}
