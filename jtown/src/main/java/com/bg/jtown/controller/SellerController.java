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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bg.jtown.business.Interest;
import com.bg.jtown.business.Product;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.FileVO;
import com.bg.jtown.util.ValidationUtil;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.seller.SellerService;

/**
 * @author Francis
 * 
 */
@Controller
public class SellerController {

	// ~ Static
	private static final Integer FALSE = 0;
	private static final Integer TRUE = 1;
	private static final Logger logger = LoggerFactory
			.getLogger(SellerController.class);

	// ~ Variable

	private String prefixView = "views/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	// ~ Dynamic Injection

	@Resource
	private SellerService sellerService;

	// ~ Show

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller", method = RequestMethod.GET)
	public String showNoneSeller() {
		return prefixView + "error/404";
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/products", method = RequestMethod.GET)
	public String showNoneSellerProduct() {
		return prefixView + "error/404";
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/{p}", method = RequestMethod.GET)
	public String showSeller(@PathVariable(value = "p") Integer sellerPn,
			@RequestParam(required = false) Integer error, Model model,
			SummaryUser summaryUser) {
		if (summaryUser.getEnumAuthority().equals(Authority.SELLER)) {
			if (!summaryUser.getPn().equals(sellerPn)) {
				logger.warn("Deny Seller page No Permission [ Access = "
						+ summaryUser.getPn() + ", IP = "
						+ summaryUser.getRemoteIp() + " ] ");
				return "redirect:../noPermission";
			}
		}
		model.addAllAttributes(sellerService.selectAllInformation(sellerPn));
		if (error != null) {
			model.addAttribute("error", error);
		}
		return prefixView + "seller";
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/products/{p}", method = RequestMethod.GET)
	public String showProducts(@PathVariable(value = "p") Integer sellerPn,
			Model model, SummaryUser summaryUser,
			@RequestParam(required = false) Integer isFinish) {

		if (isFinish != null) {
			if (isFinish.equals(TRUE)) {
				model.addAttribute("isFinish", "products.true");
			} else if (isFinish.equals(FALSE)) {
				model.addAttribute("isFinish", "products.false");
			}
		}

		if (summaryUser.getEnumAuthority().equals(Authority.SELLER)) {
			if (!summaryUser.getPn().equals(sellerPn)) {
				logger.warn("Deny Seller page No Permission [ Access = "
						+ summaryUser.getPn() + ", IP = "
						+ summaryUser.getRemoteIp() + " ] ");
				return "redirect:../noPermission";
			}
		}
		model.addAttribute("products",
				sellerService.selectSellerProduct(sellerPn));
		Product product = new Product();
		product.setSellerPn(sellerPn);
		model.addAttribute("product", product);
		return prefixView + "seller_photo";
	}

	// ~ Form

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/form.jt", method = RequestMethod.PUT)
	public String formUpdateProduct(Model model, SummaryUser summaryUser,
			@ModelAttribute Product product, BindingResult result) {
		new Validator() {

			@Override
			public void validate(Object target, Errors errors) {
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name",
						"product.name.empty");
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "price",
						"product.price.empty");
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "url",
						"product.url.empty");

				Product product = (Product) target;
				String price = product.getPrice();
				if (ValidationUtil.lengthCheck(price, 0, 10)) {
					if (!ValidationUtil.onlyNumber(price)) {
						errors.rejectValue("price", "product.price.notAllow");
					}
				}

				String url = product.getUrl();
				if (ValidationUtil.lengthCheck(url, 0, 300)) {
					if (!ValidationUtil.homepageFormCheck(url)) {
						errors.rejectValue("url", "product.url.notAllow");
					}
				}

			}

			@Override
			public boolean supports(Class<?> clazz) {
				return false;
			}
		}.validate(product, result);

		Integer nowPn = product.getSellerPn();
		if (result.hasErrors()) {
			model.addAttribute("products",
					sellerService.selectSellerProduct(nowPn));
			return prefixView + "seller_photo";
		} else {
			Integer sellerPn = product.getSellerPn();
			product.setSellerPn(sellerPn);
			sellerService.updateProduct(product);
			model.addAttribute("isFinish", TRUE);
			return "redirect:products/" + nowPn;
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/form.jt", method = RequestMethod.DELETE)
	public String formDeleteProduct(Model model,
			@ModelAttribute Product product, SummaryUser summaryUser) {
		Integer nowPn = product.getSellerPn();
		product.setSellerPn(summaryUser.getPn());
		boolean result = sellerService.deleteSellerProduct(product);
		if (!result) {
			model.addAttribute("isFinish", FALSE);
		}
		return "redirect:products/" + nowPn;
	}

	// ~ Ajax

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/selectInterestes.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Interest> ajaxSelectInterestes(SummaryUser summaryUser) {
		return sellerService.selectInterestes(summaryUser.getPn());
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/updateSellerInterestes.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Interest> ajaxUpdateSellerInterestes(
			@RequestBody Interest interest, SummaryUser summaryUser) {
		logger.debug(interest.toString());
		Integer pn = summaryUser.getPn();
		interest.setSellerPn(pn);
		sellerService.updateSellerInterestes(interest);
		return sellerService.selectSellerInterest(pn);
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/insertProduct.jt", method = RequestMethod.POST)
	@ResponseBody
	public Product ajaxChangeNotice(@RequestBody Product product,
			SummaryUser summaryUser) {
		product.setSellerPn(summaryUser.getPn());
		sellerService.insertSellerProduct(product);
		return product;
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeMainImage.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeMainImage(@RequestBody FileVO fileVO,
			SummaryUser summaryUser) {
		fileVO.setOwnerPn(summaryUser.getPn());
		sellerService.updateSellerImage(fileVO);
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeNotice.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeNotice(@RequestBody JtownUser jtownUser,
			SummaryUser summaryUser) {
		jtownUser.setPn(summaryUser.getPn());
		sellerService.updateSellerNotice(jtownUser);
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeLongNotice.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeLongNotice(@RequestBody JtownUser jtownUser,
			SummaryUser summaryUser) {
		jtownUser.setPn(summaryUser.getPn());
		sellerService.updateSellerLongNotice(jtownUser);
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeEvent.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeEvent(@RequestBody Event event,
			SummaryUser summaryUser) {
		event.setSellerPn(summaryUser.getPn());
		event.setBannerType(1);
		sellerService.updateAndInsertEvent(event);
	}

}
