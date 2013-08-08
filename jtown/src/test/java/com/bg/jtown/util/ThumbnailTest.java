package com.bg.jtown.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import net.coobird.thumbnailator.Thumbnails;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ThumbnailTest {

	private static Logger logger = LoggerFactory.getLogger(ThumbnailTest.class);
	private static String directory = "/Users/hayoung/Desktop/";

	@Test
	public void test() {
		long start = System.currentTimeMillis();
		logger.info(start + " : 실행");
		try {
			String fileDirectory = directory + "01_E.png";
			File file = new File(fileDirectory);
			OutputStream os = new FileOutputStream(directory + "03_E.png");
			// Thumbnails.of(file).size(rWidth, rHeight).outputFormat("png")
			// .toOutputStream(os);
			Thumbnails.of(file).width(140).outputQuality(1.0d)
					.outputFormat("png").toOutputStream(os);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			long end = System.currentTimeMillis();
			logger.info(end + " : 끝");
			logger.info(end - start + " : 경과");
		}

	}
}
