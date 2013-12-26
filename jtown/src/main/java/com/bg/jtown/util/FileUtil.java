package com.bg.jtown.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Francis
 * 
 */
public class FileUtil {

	private static Logger logger = LoggerFactory.getLogger(FileUtil.class);
// TODO 서버일때는 변경
	private static final String PHOTO_DIRECTORY = "C:/Users/User2/Desktop/uploadImage";
//	private static final String PHOTO_DIRECTORY = "/uploadImage";

	public static final String ORGINAL_DIRECOTRY = PHOTO_DIRECTORY
			+ "/original/";

	public static final String THUMBNAIL_DIRECTORTY = PHOTO_DIRECTORY
			+ "/thumbnail/";

	/**
	 * 확장자 체크
	 * 
	 * 제한 확장자 실행불가능하게함
	 * 
	 * @param fileName
	 *            사용하는 현재 파일이름
	 * @return 허용되지 않는 확장자 boolean =false
	 * 
	 *         허용확장자 boolean =true
	 */
	public static boolean checkContentType(String type) {

		boolean result = false;

		if (type.equals("jpg") || type.equals("bmp") || type.equals("png")
				|| type.equals("gif")) {
			result = true;
		}

		return result;
	}

	public static String getContentType(String fileName) {
		return fileName.substring(fileName.lastIndexOf(".") + 1,
				fileName.length()).toLowerCase();
	}

	public static int getCategoryWidth(String category) {
		if (category.equals("represent")) {
			return 316;
		} else if (category.equals("event")) {
			return 309;
		} else if (category.equals("product")) {
			return 240;
		}
		return 0;
	}

	public static int getCategoryNum(String category) {
		if (category.equals("represent")) {
			return 1;
		} else if (category.equals("event")) {
			return 2;
		} else if (category.equals("product")) {
			return 3;
		}
		return 0;
	}

	/**
	 * 파일 존재여부 확인
	 * 
	 * @param isLivefile
	 * @return
	 */
	public static Boolean fileIsLive(String isLivefile) {
		File f1 = new File(isLivefile);

		if (f1.exists()) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 파일 생성
	 * 
	 * @param makeFileName
	 *            파일이름
	 * 
	 */
	public static void fileMake(String makeFileName) {
		File f1 = new File(makeFileName);
		try {
			f1.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 파일 삭제
	 * 
	 * @param deleteFileName
	 *            파일 이름
	 */
	public static void fileDelete(String deleteFileName) {
		File file = new File(deleteFileName);
		if (file.delete()) {
			logger.info("File Delete Complete");
		} else {
			logger.info("File Delete Not Complete");
		}
	}

	/**
	 * 파일복사
	 * 
	 * @param inFileName
	 *            원본이름
	 * @param outFileName
	 *            이동이름
	 */
	public static void fileCopy(String inFileName, String outFileName) {
		try {
			FileInputStream fis = new FileInputStream(inFileName);
			FileOutputStream fos = new FileOutputStream(outFileName);

			int data = 0;
			while ((data = fis.read()) != -1) {
				fos.write(data);
			}
			fis.close();
			fos.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 파일 이동하는 메소드
	 * 
	 * @param inFileName
	 *            원본이름
	 * @param outFileName
	 *            이동이름
	 */
	public static void fileMove(String inFileName, String outFileName) {
		try {
			FileInputStream fis = new FileInputStream(inFileName);
			FileOutputStream fos = new FileOutputStream(outFileName);

			int data = 0;
			while ((data = fis.read()) != -1) {
				fos.write(data);
			}
			fis.close();
			fos.close();

			// 원본 파일 삭제
			fileDelete(inFileName);

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 디렉토리에 파일 리스트 읽어오기
	 * 
	 * @param dirPath
	 *            디렉토리이름
	 * @return
	 */
	public static List<File> getDirFileList(String dirPath) {
		// 디렉토리 파일 리스트
		List<File> dirFileList = null;

		// 파일 목록을 요청한 디렉토리를 가지고 파일 객체를 생성함
		File dir = new File(dirPath);

		// 디렉토리가 존재한다면
		if (dir.exists()) {
			// 파일 목록을 구함
			File[] files = dir.listFiles();

			// 파일 배열을 파일 리스트로 변화함
			dirFileList = Arrays.asList(files);
		}

		return dirFileList;
	}

}
