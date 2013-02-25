package com.bg.jtown.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.bg.jtown.business.FileService;
import com.bg.jtown.util.FileUtil;
import com.bg.jtown.util.FileVO;
import com.bg.jtown.util.MultipartFile;

/**
 * @author Francis
 * 
 */
@Controller
public class FileController {

	private static Logger logger = LoggerFactory
			.getLogger(FileController.class);

	@Resource
	private FileService fileService;

	@RequestMapping(value = "/file/upload.jt")
	@ResponseBody
	public void ajaxUpload(@ModelAttribute MultipartFile multipartFile,
			BindingResult result, HttpServletRequest request,
			HttpServletResponse response) throws IOException {

		@SuppressWarnings("deprecation")
		String saveDirectory = request.getRealPath("resources/uploadImage");
		PrintWriter writer = response.getWriter();
		response.setContentType("text/plain");
		if (result.hasErrors()) {
			for (ObjectError error : result.getAllErrors()) {
				logger.error("Error in uploading" + error.getCode() + " - "
						+ error.getDefaultMessage());
			}
			writer.print("{ 'result' : 'error' }");
		} else {
			CommonsMultipartFile commonsMultipartFile = multipartFile
					.getFiledata();

			String orginalName = commonsMultipartFile.getOriginalFilename();
			String type = orginalName.substring(
					orginalName.lastIndexOf(".") + 1, orginalName.length());
			String saveName = System.currentTimeMillis() + "_image." + type;

			if (FileUtil.checkContentType(type)) {

				if (commonsMultipartFile.getSize() > 0) {
					try {

						IOUtils.copy(commonsMultipartFile.getInputStream(),
								new FileOutputStream(new File(saveDirectory,
										saveName)));
						FileVO fileVO = new FileVO();

						fileVO.setOriginalName(orginalName);
						fileVO.setSaveName(saveName);
						fileVO.setMemorySize((int) commonsMultipartFile
								.getSize());

						fileService.insertFileVO(fileVO);

						logger.debug("fileVO" + fileVO);

						StringBuffer param = new StringBuffer();

						param.append("saveName:").append(fileVO.getSaveName())
								.append(",");
						param.append("imagePn:").append(fileVO.getImagePn());

						writer.print(param.toString());
					} catch (FileNotFoundException e) {
						e.printStackTrace();
						writer.print("{ 'result' : 'error' }");
					} catch (IOException e) {
						e.printStackTrace();
						writer.print("{ 'result' : 'error' }");
					}
				}
			} else {
				logger.error("Error in uploading : 허용할수 없는 확장자 입니다.");
				writer.print("{ 'result' : 'error' }");
			}
		}
		writer.flush();
		writer.close();
	}
}
