package com.bg.jtown.controller;

import java.util.List;
import java.util.Locale;

import javax.annotation.Resource;

import org.springframework.context.support.DelegatingMessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.*;
import com.bg.jtown.business.admin.AdminService;
import com.bg.jtown.business.help.HelpService;
import com.bg.jtown.business.home.HomeService;
import com.bg.jtown.business.search.*;
import com.bg.jtown.business.seller.ContractService;
import com.bg.jtown.controller.validator.SigninAdminVaildatorImpl;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.ValidationUtil;

/**
 * @author Francis, 박광열
 * 
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

	// ~ Static
	private static final Integer TRUE = 1;

	// ~ Variable

	private String prefixView = "views/content/admin/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	// ~ Dynamic Injection

	@Resource
	private AdminService adminService;
	@Resource
	private HelpService helpService;
	@Resource
	private HomeService homeService;
	@Resource
	private ContractService contractService;
	@Resource
	private SigninAdminVaildatorImpl siginAdminVaildatorImpl;
	@Resource(name = "messageSource")
	private DelegatingMessageSource messageSource;
//	@Resource
//	private FileService fileService;

	// ~ SHOW

	@RequestMapping(method = RequestMethod.GET)
	public String showAdmin(Model model,
			@ModelAttribute PartnershipFilter partnershipFilter,
			SummaryUser summaryUser) {
		HomeFilter homeFilter = new HomeFilter();
		homeFilter.getPagination().setNumItemsPerPage( Integer.MAX_VALUE );
		List<JtownUser> partnerships = homeService.selectSeller( homeFilter );
		model.addAttribute("partnerships", partnerships);
		
		if("Salesman".equals(summaryUser.getAuthority())){
			return "redirect:/admin/partnership";
		}else{
			return prefixView + "main";
		}
	}

	@RequestMapping(value = "/customer", method = RequestMethod.GET)
	public String showCustomerPage(Model model,
			@ModelAttribute UserFilter userFilter) {
		model.addAllAttributes(adminService.selectCustomerModelMap(userFilter));
		return prefixView + "customer";
	}

	@RequestMapping(value = "/administrator", method = RequestMethod.GET)
	public String showAdministrator(Model model,
			@ModelAttribute AdministratorFilter administratorFilter) {
		model.addAllAttributes(adminService
				.selectAdminModelMap(administratorFilter));
		return prefixView + "user/list";
	}

	@RequestMapping(value = "/createAdministrator", method = RequestMethod.GET)
	public String showCreateAdministrator(Model model) {
		model.addAttribute("jtownUser", new JtownUser());
		return prefixView + "user/create";
	}

	@RequestMapping(value = "/partnership", method = RequestMethod.GET)
	public String showPartnership(Model model,
			@ModelAttribute PartnershipFilter partnershipFilter,
			SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.ADMIN)) {
			Integer adminPn = summaryUser.getPn();
			partnershipFilter.setAdminPn(adminPn);
		}
		model.addAllAttributes(helpService.selectObject(partnershipFilter));

		return prefixView + "partnership/list";
	}

	@RequestMapping(value = "/contract", method = RequestMethod.GET)
	public String showContracPopup(Model model,
			@ModelAttribute ContractFilter contractFilter,
			@RequestParam(required = false) Integer isFinish) {
		if (isFinish != null && isFinish.equals(TRUE)) {
			model.addAttribute("isFinish", "contract");
		}

		List<Contract> contracts = contractService
				.selectContractList(contractFilter);
		model.addAttribute("contracts", contracts);

		Integer sellerPn = contractFilter.getSellerPn();
		Contract contract = contractService.selectContractPeroid(sellerPn);
		model.addAttribute("contract", contract);
		return prefixView + "partnership/contract";
	}

	@RequestMapping(value = "/comment", method = RequestMethod.GET)
	public String showContractListPopup(Model model,
			@ModelAttribute AdminCommentFilter adminCommentFilter) {
		model.addAttribute("comments",
				adminService.selectAllCommentList(adminCommentFilter));
		return prefixView + "comment";
	}

	@RequestMapping(value = "/questions", method = RequestMethod.GET)
	public String showQuestionList(Model model,
			@ModelAttribute QuestionFilter questionFilter) {
		List<Question> questions = helpService.selectQuestions(questionFilter);
		model.addAllAttributes(helpService
				.selectQuestionCategoriesList(questionFilter));
		model.addAttribute("questions", questions);
		return prefixView + "question/list";
	}

	@RequestMapping(value = "/question", method = RequestMethod.GET)
	public String showQuestion(Model model,
			@RequestParam(value = "qpn") Integer questionPn) {
		Question question = helpService.selectQuestion(questionPn);
		model.addAttribute("question", question);
		return prefixView + "question/content";
	}

	// ~ FORM

	@RequestMapping(value = "/createAdministrator.jt", method = RequestMethod.POST)
	public String formCreateAdministrator(Model model,
			@ModelAttribute JtownUser jtownUser, BindingResult result,
			@RequestParam("confirmPassword") final String confirmPassword) {
		siginAdminVaildatorImpl.validate(jtownUser, result);
		new Validator() {
			@Override
			public void validate(Object target, Errors errors) {
				JtownUser jtownUser = (JtownUser) target;

				if (jtownUser.getPassword() == null) {
					errors.rejectValue("password", "join.password.empty");
				} else if (ValidationUtil.confirmPassword(
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
			return prefixView + "user/create";
		} else {
			adminService.insertAdmin(jtownUser);
			return "redirect:administrator";
		}
	}

	@RequestMapping(value = "/contract.jt", method = RequestMethod.POST)
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
		Integer sellerPn = contract.getSellerPn();
		if (result.hasErrors()) {
			ContractFilter contractFilter = new ContractFilter(sellerPn);
			model.addAttribute("contractFilter", contractFilter);
			List<Contract> contracts = contractService
					.selectContractList(contractFilter);
			model.addAttribute("contracts", contracts);
			return prefixView + "partnership/contract";
		} else {
			contractService.insertCaculatePeroidContract(contract);
			model.addAttribute("isFinish", TRUE);
			model.addAttribute("sellerPn", sellerPn);
			return "redirect:contract";
		}
	}

	// ~ Ajax

	@RequestMapping(value = "/ajax/insertViewCount.jt", method = RequestMethod.POST)
	@ResponseBody
	public Count ajaxInsertViewCount(
			@RequestBody Count count) {
		homeService.insertViewCount( count );
		return count;
	}
	
	@RequestMapping(value = "/ajax/selectSellerLovers.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Count> ajaxSelectSellerLovers(@RequestParam("sellerPn") Integer sellerPn) {
		return adminService.selectSellerLovers(sellerPn);
	}
	
	@RequestMapping(value = "/ajax/selectPartnershipCategory.jt", method = RequestMethod.POST)
	@ResponseBody
	public Integer ajaxSelectPartnershipCategory(
			@RequestBody Partnership partnership) {
		return helpService.selectPartnershipCategory(partnership.getPn());
	}

	@RequestMapping(value = "/ajax/updatePartnership.jt", method = RequestMethod.POST)
	@ResponseBody
	public Partnership ajaxChangePartnership(
			@RequestBody Partnership partnership) {
		helpService.updatePatnership(partnership);
		return partnership;
	}

	@RequestMapping(value = "/ajax/updatePartnershipCategory.jt", method = RequestMethod.POST)
	@ResponseBody
	public Partnership ajaxChangePartnershipCategory(
			@RequestBody Partnership partnership) {
		return helpService.updatePatnershipCategory(partnership);
	}

	@RequestMapping(value = "/ajax/updatePartnershipName.jt", method = RequestMethod.POST)
	@ResponseBody
	public Json ajaxChangePartnershipName(@RequestBody Partnership partnership,
			Locale locale) {
		String name = partnership.getName();
		if (ValidationUtil.lengthCheck(name, 0, 10)) {
			if (!ValidationUtil.onlyEucKR(name)) {
				return new Json(1, messageSource.getMessage(
						"partnership.name.notAllow", null, locale));
			}
		} else {
			return new Json(1, messageSource.getMessage(
					"partnership.name.empty", null, locale));
		}
		helpService.updatePatnership(partnership);
		return new Json(0, name);
	}

	@RequestMapping(value = "/ajax/updatePartnershipEmail.jt", method = RequestMethod.POST)
	@ResponseBody
	public Json ajaxChangePartnershipEmail(
			@RequestBody Partnership partnership, Locale locale) {
		String email = partnership.getEmail();
		if (ValidationUtil.lengthCheck(email, 0, 50)) {
			if (!ValidationUtil.emailFormCheck(email)) {
				return new Json(1, messageSource.getMessage(
						"partnership.email.notAllow", null, locale));
			} else {
				Partnership lp = helpService.selectPartnership(new Partnership(
						email, null));
				if (lp != null) {
					if (!lp.getPn().equals(partnership.getPn())) {
						return new Json(1, messageSource.getMessage(
								"partnership.email.exist", null, locale));
					}
				}
			}
		} else {
			return new Json(1, messageSource.getMessage(
					"partnership.email.empty", null, locale));
		}
		helpService.updatePatnership(partnership);
		return new Json(0, email);
	}

	@RequestMapping(value = "/ajax/updatePartnershipPhoneNumber.jt", method = RequestMethod.POST)
	@ResponseBody
	public Json ajaxChangePartnershipPhoneNumber(
			@RequestBody Partnership partnership, Locale locale) {
		String phoneNumber = partnership.getPhoneNumber();
		if (ValidationUtil.lengthCheck(phoneNumber, 9, 12)) {
			if (!ValidationUtil.onlyNumber(phoneNumber)) {
				return new Json(1, messageSource.getMessage(
						"partnership.phoneNumber.notAllow", null, locale));
			} else {
				Partnership lp = helpService.selectPartnership(new Partnership(
						null, phoneNumber));
				if (lp != null) {
					if (!lp.getPn().equals(partnership.getPn())) {
						return new Json(1, messageSource.getMessage(
								"partnership.phoneNumber.exist", null, locale));
					}
				}
			}
		} else {
			return new Json(1, messageSource.getMessage(
					"partnership.phoneNumber.empty", null, locale));
		}
		helpService.updatePatnership(partnership);
		return new Json(0, phoneNumber);
	}

	@RequestMapping(value = "/ajax/updatePartnershipNote.jt", method = RequestMethod.POST)
	@ResponseBody
	public Json ajaxChangePartnershipNote(@RequestBody Partnership partnership,
			Locale locale) {
		String note = partnership.getNote();
		if (!ValidationUtil.lengthCheck(note, -1, 3000)) {
			return new Json(1, messageSource.getMessage(
					"partnership.note.empty", null, locale));
		} else {
			if (note.length() == 0) {
				return new Json(0, note);
			}
		}
		helpService.updatePatnership(partnership);
		return new Json(0, note);
	}

	@RequestMapping(value = "/ajax/changePartnershipJson.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangePartnershipJson(@RequestBody Json json) {
		helpService.updatePartnershipJson(json, Authority.ADMIN);
	}

	@RequestMapping(value = "/ajax/createSeller.jt", method = RequestMethod.POST)
	@ResponseBody
	public JtownUser ajaxCreateSeller(@RequestBody JtownUser jtownUser) {
		Json json = new Json(jtownUser.getPn(), null);
		adminService.insertSeller(jtownUser);
		json.setValue(jtownUser.getPn().toString());
		helpService.updatePartnershipJson(json, Authority.SELLER);
		return jtownUser;
	}

	@RequestMapping(value = "/ajax/changeSellerShopUrl.jt", method = RequestMethod.POST)
	@ResponseBody
	public Json ajaxChangeSellerShopUrl(@RequestBody JtownUser jtownUser,
			Locale locale) {
		String shopUrl = jtownUser.getShopUrl();
		if (!ValidationUtil.lengthCheck(shopUrl, 0, 100)) {
			return new Json(1, messageSource.getMessage("seller.shopUrl.empty",
					null, locale));
		}
		adminService.updateSeller(jtownUser);
		return new Json(0, shopUrl);
	}

	@RequestMapping(value = "/ajax/changeSellerName.jt", method = RequestMethod.POST)
	@ResponseBody
	public Json ajaxChangeSellerName(@RequestBody JtownUser jtownUser,
			Locale locale) {
		String name = jtownUser.getName();
		if (!ValidationUtil.checkCharAndLength(name, 0, 30)) {
			return new Json(1, messageSource.getMessage("seller.name.empty",
					null, locale));
		}
		adminService.updateSeller(jtownUser);
		return new Json(0, name);
	}

	@RequestMapping(value = "/ajax/changeEnabled.jt", method = RequestMethod.POST)
	@ResponseBody
	public JtownUser ajaxChangeEnabled(@RequestBody JtownUser jtownUser) {
		adminService.updateEnabled(jtownUser);
		return jtownUser;
	}

	@RequestMapping(value = "/ajax/changeInterest.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeInterest(@RequestBody Interest interest) {
		adminService.updateInterest(interest);
	}

	@RequestMapping(value = "/ajax/autoInterestSection.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Interest> ajaxAutoInterestSection(@RequestBody Interest interest) {
		return adminService.selectInterestSection(interest);
	}

	@RequestMapping(value = "/ajax/resetPassword.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxResetPassword(@RequestBody JtownUser jtownUser) {
		adminService.updateAdminPassword(jtownUser);
	}

}
