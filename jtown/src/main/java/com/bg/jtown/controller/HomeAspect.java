package com.bg.jtown.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * @author Francis, 박광열
 * 
 */
@Aspect
@Component
public class HomeAspect {

	private final Logger logger = LoggerFactory.getLogger(HomeAspect.class);

	@Resource
	private HttpServletRequest request;

	@Around("bean(*Controller)")
	public Object trace(ProceedingJoinPoint joinPoint) throws Throwable {
		String signatureString = joinPoint.getSignature().toShortString();
		logger.info(signatureString + " 시작");
		long start = System.currentTimeMillis();

		try {
			Object[] param = joinPoint.getArgs();

			HttpSession session = request.getSession();

			for (int i = 0; i < param.length; i++) {
				if (param[i] != null) {
					logger.debug("Object = " + param[i].toString()
							+ param[i].getClass());
					if (param[i].getClass() == HttpSession.class) {
						param[i] = session;
					}
				}
			}
			return joinPoint.proceed(param);
		} finally {
			long finish = System.currentTimeMillis();
			logger.info(signatureString + " 종료");
			logger.info(signatureString + " 실행 시간 : " + (finish - start) + "ms");
		}
	}
}
