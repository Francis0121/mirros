package com.bg.jtown.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
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
import com.bg.jtown.business.Statistic;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.FileVO;
import com.bg.jtown.util.StringUtil;
import com.bg.jtown.util.ValidationUtil;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.search.ProductFilter;
import com.bg.jtown.business.search.StatisticFilter;
import com.bg.jtown.business.seller.SellerService;
import com.google.gson.JsonArray;

/**
 * @author Francis
 * @author In Sanghak
 */
@PreAuthorize("hasRole('ROLE_SELLER')")
@Controller
public class SellerController {

	// ~ Static
	private static final Integer FALSE = 0;
	private static final Integer TRUE = 1;
	private static final Logger logger = LoggerFactory.getLogger(SellerController.class);

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
	public String showSeller(@PathVariable(value = "p") Integer sellerPn, @RequestParam(required = false) Integer error, Model model,
			SummaryUser summaryUser) {
		if (summaryUser.getEnumAuthority().equals(Authority.SELLER)) {
			if (!summaryUser.getPn().equals(sellerPn)) {
				logger.warn("Deny Seller page No Permission [ Access = " + summaryUser.getPn() + ", IP = " + summaryUser.getRemoteIp() + " ] ");
				return "redirect:../noPermission";
			}
		}
		model.addAllAttributes(sellerService.selectAllInformation(sellerPn));
		if (error != null) {
			model.addAttribute("error", error);
		}
		Date now = new Date();
		model.addAttribute("now", now);
		return prefixView + "seller";
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/products/{sellerPn}", method = RequestMethod.GET)
	public String showProducts(@ModelAttribute ProductFilter productFilter, Model model, SummaryUser summaryUser,
			@RequestParam(required = false) Integer isFinish) {

		if (isFinish != null) {
			if (isFinish.equals(TRUE)) {
				model.addAttribute("isFinish", "products.true");
			} else if (isFinish.equals(FALSE)) {
				model.addAttribute("isFinish", "products.false");
			}
		}

		Integer sellerPn = productFilter.getSellerPn();

		if (sellerPn == null) {
			return prefixView + "error/404";
		}

		if (summaryUser.getEnumAuthority().equals(Authority.SELLER)) {
			if (!summaryUser.getPn().equals(sellerPn)) {
				logger.warn("Deny Seller page No Permission [ Access = " + summaryUser.getPn() + ", IP = " + summaryUser.getRemoteIp() + " ] ");
				return "redirect:../noPermission";
			}
		}
		model.addAttribute("products", sellerService.selectSellerProduct(productFilter));
		Product product = new Product();
		product.setSellerPn(sellerPn);
		model.addAttribute("product", product);
		return prefixView + "seller_photo";
	}

	@RequestMapping(value = "/statistic/{sellerPn}", method = RequestMethod.GET)
	public String sellerStatistic(@ModelAttribute StatisticFilter statisticFilter, Model model, SummaryUser summaryUser) {
		Integer sellerPn = statisticFilter.getSellerPn();
		if (sellerPn == null) {
			return prefixView + "error/404";
		}
		if (summaryUser.getEnumAuthority().equals(Authority.SELLER)) {
			if (!summaryUser.getPn().equals(sellerPn)) {
				logger.warn("Deny Seller page No Permission [ Access = " + summaryUser.getPn() + ", IP = " + summaryUser.getRemoteIp() + " ] ");
				return "redirect:../noPermission";
			}
		}
		model.addAttribute("sellerPn", sellerPn);
		return prefixView + "statistic";
	}

	@RequestMapping(value = "/ajax/statistic/getStatisticValue.jt", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> ajaxGetStatisticValue(@RequestBody StatisticFilter statisticFilter, SummaryUser summaryUser) {
		Map<String, Object> map = new HashMap<String, Object>();
		Statistic statistic = new Statistic();
		Calendar cal = Calendar.getInstance();

		Integer sellerPn = statisticFilter.getSellerPn();
		statistic.setSellerPn(sellerPn);
		statisticFilter.getCurrentDate();
		if (statisticFilter.getCurrentDate() != 0) {
			cal.setTimeInMillis(statisticFilter.getCurrentDate());
			cal.add(Calendar.MONTH, statisticFilter.getNextMonth());
		}
		statistic.setStatisticDate(cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-01");

		map.put("currentDate", cal.getTime().getTime());
		map.put("currentMonth", cal.get(Calendar.MONTH) + 1);
		map.put("currentYear", cal.get(Calendar.YEAR));
		map.put("shopStatistic", sellerService.selectProductClickStatistic(statistic));
		map.put("TopStatistic", sellerService.selectProductClickStatisticTopNPercentList(statistic));

		return map;
	}

	// ~ Form

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/form.jt", method = RequestMethod.PUT)
	public String formUpdateProduct(Model model, SummaryUser summaryUser, @ModelAttribute Product product, BindingResult result) {
		new Validator() {

			@Override
			public void validate(Object target, Errors errors) {
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "product.name.empty");
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "price", "product.price.empty");
				ValidationUtils.rejectIfEmptyOrWhitespace(errors, "url", "product.url.empty");

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
		Integer currentPage = product.getCurrentPage();
		Integer sellerPn = summaryUser.getPn();
		if (result.hasErrors()) {
			ProductFilter productFilter = new ProductFilter();
			productFilter.setPage(currentPage);
			productFilter.setSellerPn(sellerPn);
			model.addAttribute("products", sellerService.selectSellerProduct(productFilter));
			model.addAttribute("productFilter", productFilter);
			return prefixView + "seller_photo";
		} else {
			product.setSellerPn(sellerPn);
			sellerService.updateProduct(product);
			model.addAttribute("isFinish", TRUE);
			return "redirect:products/" + nowPn + "?page=" + currentPage;
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/seller/form.jt", method = RequestMethod.DELETE)
	public String formDeleteProduct(Model model, @ModelAttribute Product product, SummaryUser summaryUser) {
		Integer nowPn = product.getSellerPn();
		product.setSellerPn(summaryUser.getPn());
		boolean result = sellerService.deleteSellerProduct(product);
		if (!result) {
			model.addAttribute("isFinish", FALSE);
		}
		Integer page = product.getCurrentPage();
		int count = sellerService.selectSellerProductCount(nowPn);
		if (count <= 10) {
			page = 1;
		}
		return "redirect:products/" + nowPn + "?page=" + page;
	}

	// ~ Ajax

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/selectInterestes.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Interest> ajaxSelectInterestes(SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			return sellerService.selectInterestes(summaryUser.getPn());
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
			return null;
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/updateSellerInterestes.jt", method = RequestMethod.POST)
	@ResponseBody
	public List<Interest> ajaxUpdateSellerInterestes(@RequestBody Interest interest, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			logger.debug(interest.toString());
			Integer pn = summaryUser.getPn();
			interest.setSellerPn(pn);
			sellerService.updateSellerInterestes(interest);
			return sellerService.selectSellerInterest(pn);
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
			return null;
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/insertProduct.jt", method = RequestMethod.POST)
	@Transactional
	@ResponseBody
	public Product ajaxChangeNotice(@RequestBody Product product, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			product.setSellerPn(summaryUser.getPn());
			Integer todayCount = sellerService.insertProductTodayUpload(product);
			if (todayCount == null || todayCount < 13) {
				sellerService.insertSellerProduct(product);
			}
			product.setTodayCount(todayCount);
			return product;
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
			return null;
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeMainImage.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeMainImage(@RequestBody FileVO fileVO, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			fileVO.setOwnerPn(summaryUser.getPn());
			sellerService.updateSellerImage(fileVO);
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeNotice.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeNotice(@RequestBody JtownUser jtownUser, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			jtownUser.setPn(summaryUser.getPn());
			sellerService.updateSellerNotice(jtownUser);
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeLongNotice.jt", method = RequestMethod.POST)
	@ResponseBody
	public void ajaxChangeLongNotice(@RequestBody JtownUser jtownUser, SummaryUser summaryUser) {
		switch (summaryUser.getEnumAuthority()) {
		case SELLER:
			jtownUser.setPn(summaryUser.getPn());
		case ADMIN:
		case ROOT_ADMIN:
			sellerService.updateSellerLongNotice(jtownUser);
			break;
		default:
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/changeEvent.jt", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public Event ajaxChangeEvent(@RequestBody Event event, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			event.setSellerPn(summaryUser.getPn());
			event.setBannerType(1);
			sellerService.updateAndInsertEvent(event);
			sellerService.insertAndUpdateDdayEvent(event);
			return event;
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
			return null;
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/getEventData.jt", method = RequestMethod.POST)
	@ResponseBody
	public Event ajaxGetEventData(Event event, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			event = sellerService.selectSellerDDayEvent(event);
			return event;
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
			return null;
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/updateDdayEvent.jt", method = RequestMethod.POST)
	@ResponseBody
	public Event ajaxUpdateDdayEvent(@RequestBody Event event, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			sellerService.insertAndUpdateDdayEvent(event);
			return event;
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
			return null;
		}
	}

	@PreAuthorize("hasRole('ROLE_SELLER')")
	@RequestMapping(value = "/ajax/seller/deleteDdayEvent.jt", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void ajaxDeleteEventBanner(Event event, SummaryUser summaryUser) {
		Authority authority = summaryUser.getEnumAuthority();
		if (authority.equals(Authority.SELLER)) {
			sellerService.deleteSellerDDayEvent(event);
			sellerService.deleteSellerBanner(event);
		} else {
			logger.info("[" + summaryUser.getAuthority() + "] " + summaryUser.getName());
		}
	}

}
