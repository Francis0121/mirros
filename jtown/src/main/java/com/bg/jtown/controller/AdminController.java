package com.bg.jtown.controller;

import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.bg.jtown.business.AdminService;
import com.bg.jtown.business.Interest;
import com.bg.jtown.business.board.Board;
import com.bg.jtown.business.board.BoardFilter;
import com.bg.jtown.business.board.BoardService;
import com.bg.jtown.business.search.UserSearch;
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

	@Resource(name = "boardServiceImpl")
	private BoardService boardService;
	
	@Resource
	private CustomJdbcUserDetailManager customJdbcUserDetailManager;

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String showAdminPage(Model model) {
		logger.debug("Show Admin Page");
		return "admin/main";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/notice", method = RequestMethod.GET)
	public String showNoticePage(Model model,
			@ModelAttribute BoardFilter boardFilter) {
		logger.debug("Show Notice Page");
		model.addAttribute("noticeList",
				boardService.selectNoticeList(boardFilter));
		return "admin/notice/list";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeWrite", method = RequestMethod.GET)
	public String showNoticeWritePage(Model model, @ModelAttribute Board board) {
		logger.debug("Show Notice Page");
		return "admin/notice/write";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeWrite", method = RequestMethod.POST)
	public String showNoticeWritePagePost(Model model,
			@ModelAttribute Board board) {
		logger.debug("Show Notice Page");
		boardService.insertNoticeWrite(board);
		return "redirect:/admin/notice";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeWrite", method = RequestMethod.DELETE)
	public String formNoticeDelete(Model model, @ModelAttribute Board board) {
		boardService.deleteBoard(board);
		return "redirect:/admin/notice";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeContent", method = RequestMethod.GET)
	public String showNoticeContent(Model model, @ModelAttribute Board board) {
		logger.debug("Show Notice Page");

		model.addAttribute("notice", boardService.selectNoticeContent(board));

		return "admin/notice/content";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeModify", method = RequestMethod.GET)
	public String showNoticeModify(Model model, @ModelAttribute Board board) {

		model.addAttribute("board", boardService.selectNoticeContent(board));

		return "admin/notice/modify";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/noticeModify", method = RequestMethod.POST)
	public ModelAndView showNoticeModifyPost(@ModelAttribute Board board) {
		ModelAndView mav = new ModelAndView();

		boardService.updateNotice(board);

		mav.addObject("notice", boardService.selectNoticeContent(board));

		mav.setView(new RedirectView("noticeContent?pn=" + board.getPn()));

		return mav;

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
	public String showSellerPage(Model model, @ModelAttribute UserSearch search) {
		logger.debug("Show Seller Page");

		model.addAllAttributes(adminService.selectSellerModelMap(search));

		return "admin/seller";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/customer", method = RequestMethod.GET)
	public String showCustomerPage(Model model,
			@ModelAttribute UserSearch search) {
		logger.debug("Show Customer Page");
		
		Map<String, Object> modelMap = adminService.selectCustomerModelMap(search);
		
		model.addAllAttributes(modelMap);
		

		return "admin/customer";
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/cs", method = RequestMethod.GET)
	public String showCreatSellerPage(Model model,
			@ModelAttribute JtownUser jtownUser) {
		logger.debug("Show createSeller Page");

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

				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "shopName",
						"create.seller.shopName.empty");
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
			return "admin/main";
		} else {
			List<Interest> interestCategoryList = adminService
					.selectInterestCategoryList();

			model.addAttribute("categoryList", interestCategoryList);

			return "admin/createSeller";
		}
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/admin/administrator", method = RequestMethod.GET)
	public String showAdministratorPage(Model model) {
		logger.debug("Show Administrator Page");
		
		customJdbcUserDetailManager.createUserAdminAndAuthority(new JtownUser());
		
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
}
