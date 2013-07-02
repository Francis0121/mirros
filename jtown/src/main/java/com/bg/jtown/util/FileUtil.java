package com.bg.jtown.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * @author Francis
 * 
 */
public class FileUtil {
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

		boolean result = true;

		if (type.equals("jsp") || type.equals("php") || type.equals("html")
				|| type.equals("sqljsp")) {
			result = false;
		} else if (type.equals("jpg") || type.equals("bmp")
				|| type.equals("png") || type.equals("JPG")
				|| type.equals("PNG") || type.equals("BMP")
				|| type.equals("gif") || type.equals("GIF")) {
			result = true;
		} else {
			result = false;
		}

		return result;
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
			// TODO Auto-generated catch block
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
			System.out.println(2);
		} else {
			System.out.println(1);
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
			// TODO Auto-generated catch block
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
			// TODO Auto-generated catch block
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
