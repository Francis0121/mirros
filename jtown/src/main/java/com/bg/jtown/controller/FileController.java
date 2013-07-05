package com.bg.jtown.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.bg.jtown.business.file.FileService;
import com.bg.jtown.business.search.FileFilter;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.FileUtil;
import com.bg.jtown.util.FileVO;
import com.bg.jtown.util.MultipartFile;
import com.google.gson.Gson;

/**
 * @author Francis
 * 
 */
@Controller
public class FileController {

	// ~ Static
	private static Logger logger = LoggerFactory
			.getLogger(FileController.class);

	// ~ Variabel

	private String prefixView = "views/content/";

	public void setPrefixView(String prefixView) {
		this.prefixView = prefixView;
	}

	// ~ Dynamic Injection
	@Resource
	private FileService fileService;

	// ~ Show

	@RequestMapping(value = "/admin/file", method = RequestMethod.GET)
	@SuppressWarnings("deprecation")
	public String showUpload(@ModelAttribute FileFilter fileFilter,
			Model model, HttpServletRequest request) {

		String saveDirectory = request.getRealPath("resources/uploadAdmin");
		List<FileVO> files = fileService.selectFiles(fileFilter);

		for (FileVO file : files) {
			try {
				String directory = saveDirectory + "/" + file.getSaveName();
				BufferedImage bi = ImageIO.read(new java.io.File(directory));
				int width = bi.getWidth();
				int height = bi.getHeight();

				file.setWidth(width);
				file.setHeight(height);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		model.addAttribute("files", files);
		return prefixView + "upload_photo";
	}

	// ~ Form

	@RequestMapping(value = "/admin/file", method = RequestMethod.DELETE)
	public String formUploadDelete(@ModelAttribute FileFilter fileFilter,
			Model model) {
		Integer pn = fileFilter.getPn();

		FileVO file = fileService.selectFile(pn);
		String saveName = file.getSaveName();
		FileUtil.fileDelete(saveName);

		fileService.deleteFile(pn);
		model.addAttribute("fileFilter", fileFilter);
		return "redirect:file";
	}

	// ~ Ajax

	@RequestMapping(value = "/file/upload.jt")
	@ResponseBody
	public void ajaxUpload(@ModelAttribute MultipartFile multipartFile,
			Integer pn, BindingResult result, HttpServletRequest request,
			HttpServletResponse response, SummaryUser summaryUser)
			throws IOException {
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
						Integer sellerPn = summaryUser.getPn();
						if (sellerPn == null) {
							sellerPn = pn;
						}
						FileVO fileVO = new FileVO(null, orginalName, saveName,
								sellerPn, (int) commonsMultipartFile.getSize());
						fileService.insertFile(fileVO);

						Gson gson = new Gson();
						String json = gson.toJson(fileVO);

						logger.debug(json);
						writer.print(json);
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

	@RequestMapping(value = "/admin/file/upload.jt")
	@ResponseBody
	public void ajaxUpload(@ModelAttribute MultipartFile multipartFile,
			BindingResult result, HttpServletRequest request,
			HttpServletResponse response) throws IOException {

		@SuppressWarnings("deprecation")
		String saveDirectory = request.getRealPath("resources/uploadAdmin");
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
								new FileOutputStream(new java.io.File(
										saveDirectory, saveName)));
						FileVO file = new FileVO(null, orginalName, saveName,
								1, (int) commonsMultipartFile.getSize());

						fileService.insertFile(file);

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
