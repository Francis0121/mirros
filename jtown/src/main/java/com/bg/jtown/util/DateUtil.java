package com.bg.jtown.util;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 날짜 변환 Util
 * 
 * @author 김성근
 * 
 */
public class DateUtil {

	static String zone = "Asia/Seoul";

	/**
	 * 오늘의 Calendar를 가져옴
	 * 
	 * @return 해당 년도
	 */
	public static Calendar getCalendar() {
		TimeZone tz = TimeZone.getTimeZone(zone);
		Calendar cal = new GregorianCalendar(tz);
		return cal;
	}

	/**
	 * 10일 미만의 날은 앞에 0을 붙여주는 함수(2자리수 유지를 위함)
	 * 
	 * @param day
	 * @return
	 */
	public static String dayIntToString(int day) {
		if (day < 10) {
			return "0" + String.valueOf(day);
		} else {
			return String.valueOf(day);
		}
	}

	/**
	 * 20110204 형식이 날짜를 받아서 2011/1형식으로 나타나게해줌
	 * 
	 * @param date
	 *            20110204 형식이 String 날짜
	 * @return 2011/1 과같은 년도와 분기형식
	 */
	public static String dateToYearAndQuerterYear(String date) {

		StringBuffer sb = new StringBuffer();

		String year = date.substring(0, 4);

		String month = date.substring(4, 6);

		String querterYear = getQuerteryear(month);

		return sb.append(year).append("/").append(querterYear).toString();
	}

	/**
	 * 오늘 날짜를 넘어온 dateForm에 따라 리턴 시켜줌 ex) getToday("YYYY년 MM월 DD일") ->
	 * "2011년 11월 28일" 리턴
	 * 
	 * @param dateForm
	 * @return
	 */
	public static String getToday(String dateForm) {
		String date = dateForm;
		Calendar cal = getCalendar();
		String year = dayIntToString(cal.get(1));
		String month = dayIntToString(cal.get(2) + 1);
		String day = dayIntToString(cal.get(5));
		date = date.replaceAll("YYYY", year);
		date = date.replaceAll("MM", month);
		date = date.replaceAll("DD", day);
		return date;
	}

	/**
	 * 입력시 분기와 년도를 계산해서 입력시켜줌
	 * 
	 * @param registerDto
	 */
	public static String getQuerteryear(String month) {

		final Logger logger = LoggerFactory.getLogger(DateUtil.class);

		String querterYear = "";

		if (month.equals("01") || month.equals("02") || month.equals("03")) {
			querterYear = "1";
		} else if (month.equals("04") || month.equals("05")
				|| month.equals("06")) {
			querterYear = "2";
		} else if (month.equals("07") || month.equals("08")
				|| month.equals("09")) {
			querterYear = "3";
		} else if (month.equals("10") || month.equals("11")
				|| month.equals("12")) {
			querterYear = "4";
		} else {
			logger.error("잘못된 월 입력");
		}

		return querterYear;
	}

	/**
	 * 넘어온 date를 dateForm에 맞게 변형 시켜줌( 주의: date는 YYYYMMDD 형식이여야함) ex)
	 * getDayString("20111128","YYYY-MM-DD") -> 2011-11-28 리턴
	 * 
	 * @param date
	 * @param dateForm
	 * @return
	 */
	public static String getDayString(String date, String dateForm) {
		String result = dateForm;
		if (date != null) {
			if (date.length() > 7) {
				String year = date.substring(0, 4);
				String month = date.substring(4, 6);
				String day = date.substring(6, 8);
				result = result.replaceAll("YYYY", year);
				result = result.replaceAll("MM", month);
				result = result.replaceAll("DD", day);
				return result;
			} else {
				return date;
			}
		} else {
			return date;
		}

	}

	/**
	 * 현재 년도를 리턴해줌
	 * 
	 * @return
	 */
	public static int getYear() {
		Calendar cal = getCalendar();
		return cal.get(1);
	}
}
