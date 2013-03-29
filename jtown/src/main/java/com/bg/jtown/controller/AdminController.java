package com.bg.jtown.controller;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.AdminService;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.help.HelpService;
import com.bg.jtown.business.search.PartnershipFilter;
import com.bg.jtown.business.search.UserFilter;
import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class AdminController {

	private static final Logger logger = LoggerFactory
			.getLogger(AdminController.class);

	@Resource(name = "adminServiceImpl")
	private AdminService adminService;
	@Resource
	private HelpService helpService;
	@Resource
	private SellerService sellerService;

	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String showAdminPage(Model model) {
		logger.debug("Show Admin Page");
		return "admin/main";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/qna", method = RequestMethod.GET)
	public String showQnaPage(Model model) {
		logger.debug("Show Qna Page");
		return "admin/qna";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/qnaSeller", method = RequestMethod.GET)
	public String showQnaSellerPage(Model model) {
		logger.debug("Show QnaSeller Page");
		return "admin/qnaSeller";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/qnaCustomer", method = RequestMethod.GET)
	public String showQnaCustomerPage(Model model) {
		logger.debug("Show QnaCustomer Page");
		return "admin/qnaCustomer";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/seller", method = RequestMethod.GET)
	public String showSellerPage(Model model,
			@ModelAttribute UserFilter userFilter) {
		model.addAllAttributes(adminService.selectSellerModelMap(userFilter));
		return "admin/seller";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/customer", method = RequestMethod.GET)
	public String showCustomerPage(Model model,
			@ModelAttribute UserFilter userFilter) {
		model.addAllAttributes(adminService.selectCustomerModelMap(userFilter));
		return "admin/customer";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/cs", method = RequestMethod.GET)
	public String showCreatSellerPage(Model model,
			@ModelAttribute JtownUser jtownUser) {
		List<Interest> interestCategoryList = adminService
				.selectInterestCategoryList();
		model.addAttribute("categoryList", interestCategoryList);
		return "admin/createSeller";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/cs", method = RequestMethod.POST)
	public String formCreateSeller(Model model,
			@ModelAttribute JtownUser jtownUser, BindingResult result) {
		logger.debug(jtownUser.toString());
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name",
						"create.seller.name.empty");
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "shopUrl",
						"create.seller.shopUrl.empty");
				ValidationUtils.rejectIfEmptyOrWhitespace(errors,
						"interestSectionList",
						"create.seller.interestSection.notAllow");
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);

		if (!result.hasErrors()) {
			adminService.insertCreateSeller(jtownUser);
			return "redirect:sellerInformation/sp/" + jtownUser.getPn();
		} else {
			List<Interest> interestCategoryList = adminService
					.selectInterestCategoryList();
			model.addAttribute("categoryList", interestCategoryList);
			return "admin/createSeller";
		}
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/sellerInformation/sp/{sellerPn}", method = RequestMethod.GET)
	public String showCreateSellerFinishPage(Model model,
			@PathVariable Integer sellerPn) {
		model.addAllAttributes(sellerService.selectAllInformation(sellerPn));
		return "admin/sellerInformation";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/administrator", method = RequestMethod.GET)
	public String showAdministratorPage(Model model) {
		customJdbcUserDetailManager
				.createUserAdminAndAuthority(new JtownUser());
		return "admin/main";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/changeShopUrl", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeShopUrl(@RequestBody JtownUser jtownUser) {
		adminService.updateShopUrl(jtownUser);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/changeInterest", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeInterest(@RequestBody Interest interest) {
		adminService.updateInterest(interest);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/changeEnable", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeEnable(@RequestBody JtownUser jtownUser) {
		adminService.updateEnable(jtownUser);
	}

	// ~ Partnership

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/partnership", method = RequestMethod.GET)
	public String showSellerPage(Model model,
			@ModelAttribute PartnershipFilter partnershipFilter) {
		model.addAllAttributes(helpService.selectObject(partnershipFilter));
		return "admin/partnership";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/ajax/admin/process.jt", method = RequestMethod.POST)
	@ResponseBody
	public void showSellerPage(@RequestBody Partnership partnership) {
		helpService.updatePatnership(partnership);
	}

}
