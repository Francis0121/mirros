package com.bg.jtown.controller;

import java.util.List;

import javax.annotation.Resource;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Contract;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Json;
import com.bg.jtown.business.Partnership;
import com.bg.jtown.business.admin.AdminService;
import com.bg.jtown.business.help.HelpService;
import com.bg.jtown.business.search.AdminCommentFilter;
import com.bg.jtown.business.search.AdministratorFilter;
import com.bg.jtown.business.search.ContractFilter;
import com.bg.jtown.business.search.PartnershipFilter;
import com.bg.jtown.business.search.UserFilter;
import com.bg.jtown.business.seller.ContractService;
import com.bg.jtown.business.seller.SellerService;
import com.bg.jtown.controller.validator.AdminLoginValidator;
import com.bg.jtown.security.CustomJdbcUserDetailManager;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.VaildationUtil;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
public class AdminController {

	@Resource
	private AdminService adminService;
	@Resource
	private HelpService helpService;
	@Resource
	private SellerService sellerService;
	@Resource
	private ContractService contractService;
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;
	@Resource
	private AdminLoginValidator adminLoginValidator;

	// ~ SHOW

	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String showAdmin(Model model) {
		return "admin/main";
	}

	@RequestMapping(value = "/admin/seller", method = RequestMethod.GET)
	public String showSellerPage(Model model,
			@ModelAttribute UserFilter userFilter) {
		model.addAllAttributes(adminService.selectSellerModelMap(userFilter));
		return "admin/seller";
	}

	@RequestMapping(value = "/admin/customer", method = RequestMethod.GET)
	public String showCustomerPage(Model model,
			@ModelAttribute UserFilter userFilter) {
		model.addAllAttributes(adminService.selectCustomerModelMap(userFilter));
		return "admin/customer";
	}

	@RequestMapping(value = "/admin/cs", method = RequestMethod.GET)
	public String showCreatSeller(Model model,
			@ModelAttribute JtownUser jtownUser) {
		List<Interest> interestCategoryList = adminService
				.selectInterestCategoryList();
		model.addAttribute("categoryList", interestCategoryList);
		return "admin/createSeller";
	}

	@RequestMapping(value = "/admin/sellerInformation/sp/{sellerPn}", method = RequestMethod.GET)
	public String showCreateSellerFinish(Model model,
			@PathVariable Integer sellerPn) {
		model.addAllAttributes(sellerService.selectAllInformation(sellerPn));
		return "admin/sellerInformation";
	}

	@RequestMapping(value = "/admin/administrator", method = RequestMethod.GET)
	public String showAdministrator(Model model,
			@ModelAttribute AdministratorFilter administratorFilter) {
		model.addAllAttributes(adminService
				.selectAdminModelMap(administratorFilter));
		return "admin/user/list";
	}

	@RequestMapping(value = "/admin/createAdministrator", method = RequestMethod.GET)
	public String showCreateAdministrator(Model model) {
		model.addAttribute("jtownUser", new JtownUser());
		return "admin/user/create";
	}

	@RequestMapping(value = "/admin/partnership", method = RequestMethod.GET)
	public String showPartnership(Model model,
			@ModelAttribute PartnershipFilter partnershipFilter) {
		model.addAllAttributes(helpService.selectObject(partnershipFilter));
		return "admin/partnership/list";
	}

	// ~ FORM

	@RequestMapping(value = "/admin/cs.jt", method = RequestMethod.POST)
	public String formCreateSeller(Model model,
			@ModelAttribute JtownUser jtownUser, BindingResult result) {
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

	@RequestMapping(value = "/admin/createAdministrator.jt", method = RequestMethod.POST)
	public String formCreateAdministrator(Model model,
			@ModelAttribute JtownUser jtownUser, BindingResult result,
			@RequestParam("confirmPassword") final String confirmPassword) {
		adminLoginValidator.validate(jtownUser, result);

		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;

				if (jtownUser.getPassword() == null) {
					errors.rejectValue("password", "join.password.empty");
				} else if (VaildationUtil.confirmPassword(
						jtownUser.getPassword(), confirmPassword)) {
					errors.rejectValue("password", "join.password.isNotEqual");
				}
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return JtownUser.class.isAssignableFrom(clazz);
			}
		}.validate(jtownUser, result);

		if (result.hasErrors()) {
			return "admin/user/create";
		} else {
			customJdbcUserDetailManager.createUserAdminAndAuthority(jtownUser);
			return "redirect:administrator";
		}
	}

	// ~ Contract

	@RequestMapping(value = "/admin/contractList", method = RequestMethod.GET)
	public String showContractListPopup(Model model,
			@ModelAttribute ContractFilter contractFilter) {
		List<Contract> contracts = contractService
				.selectContractList(contractFilter);
		model.addAttribute("contracts", contracts);
		return "admin/contractList";
	}

	@RequestMapping(value = "/admin/contract", method = RequestMethod.GET)
	public String showContractListPopup(Model model,
			@RequestParam Integer sellerPn) {
		Contract contract = new Contract();
		contract.setSellerPn(sellerPn);

		Contract loadContract = contractService.selectContractPeroid(contract);
		loadContract.setSellerPn(sellerPn);
		model.addAttribute("contract", loadContract);
		return "admin/contract";
	}

	@RequestMapping(value = "/admin/contract.jt", method = RequestMethod.POST)
	public String formContract(Model model, @ModelAttribute Contract contract,
			BindingResult result) {
		new Validator() {

			@Override
			public void validate(Object object, Errors errors) {
				Contract contract = (Contract) object;
				if (contract.getContractEndDate() == null) {
					ValidationUtils.rejectIfEmptyOrWhitespace(errors,
							"startDate", "contract.startDate.empty");
				}
				ValidationUtils.rejectIfEmptyOrWhitespace(errors,
						"contractPeroid", "contract.contractPeroid.empty");
			}

			@Override
			public boolean supports(Class<?> clazz) {
				return Contract.class.isAssignableFrom(clazz);
			}
		}.validate(contract, result);
		if (result.hasErrors()) {
		} else {
			model.addAttribute("result",
					contractService.insertCaculatePeroidContract(contract));
		}
		return "admin/contract";
	}

	// ~ Comment

	@RequestMapping(value = "/admin/comment", method = RequestMethod.GET)
	public String showContractListPopup(Model model,
			@ModelAttribute AdminCommentFilter adminCommentFilter) {
		model.addAttribute("comments",
				adminService.selectAllCommentList(adminCommentFilter));
		return "admin/comment";
	}

	// ~ Ajax

	@RequestMapping(value = "/admin/ajax/changePartnership.jt", method = RequestMethod.POST)
	@ResponseBody
	public Partnership ajaxChangePartnership(
			@RequestBody Partnership partnership) {
		helpService.updatePatnership(partnership);
		return partnership;
	}

	@RequestMapping(value = "/admin/ajax/changePartnershipJson.jt", method = RequestMethod.POST)
	@ResponseBody
	public void changePartnershipJson(@RequestBody Json json) {
		helpService.updatePatnershipJson(json);
	}

	@RequestMapping(value = "/ajax/admin/autoInterestSection.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Interest> ajaxAutoInterestSection(@RequestBody Interest interest) {
		return adminService.selectInterestSection(interest);
	}

	@RequestMapping(value = "/admin/changeShopUrl", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeShopUrl(@RequestBody JtownUser jtownUser) {
		adminService.updateShopUrl(jtownUser);
	}

	@RequestMapping(value = "/admin/changeInterest", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeInterest(@RequestBody Interest interest) {
		adminService.updateInterest(interest);
	}

	@RequestMapping(value = "/admin/changeEnable", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeEnable(@RequestBody JtownUser jtownUser) {
		adminService.updateEnable(jtownUser);
	}

}
