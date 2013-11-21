package com.bg.app.controller;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;

import com.bg.jtown.business.home.HomeService;

@Aspect
@Component
public class MainAOP {

	@Autowired
	private HomeService homeService;
	
	@Pointcut("execution(public * com.bg.app.controller.*.*(org.springframework.ui.Model,..))")
	public void allControllerHasModelTarget() {
	}
	
	@Around("allControllerHasModelTarget()")
    public String setCategory(ProceedingJoinPoint joinPoint) throws Throwable {         
		Model model = (Model) joinPoint.getArgs()[0];
		System.out.println("model");
		model.addAttribute("interestCategories", homeService.selecInterestCategory());
        return (String) joinPoint.proceed();
    }
	
}
