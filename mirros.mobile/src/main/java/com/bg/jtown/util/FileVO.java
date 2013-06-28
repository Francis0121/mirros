package com.bg.jtown.util;

/**
 * @author Francis
 * 
 */
public class FileVO {

	/**
	 * 세로크기
	 */
	private Integer height;

	/**
	 * 파일고유번호
	 */
	private Integer imagePn;

	/**
	 * 메모리크기
	 */
	private Integer memorySize;

	/**
	 * 파일이름
	 */
	private String originalName;

	/**
	 * 입력한 유저 정보
	 */
	private Integer ownerPn;

	/**
	 * 저장한 파일이름
	 */
	private String saveName;

	/**
	 * 가로크기
	 */
	private Integer width;

	public FileVO() {
		super();
	}

	public FileVO(Integer imagePn, String originalName, String saveName,
			Integer ownerPn, Integer memorySize) {
		super();
		this.imagePn = imagePn;
		this.originalName = originalName;
		this.saveName = saveName;
		this.ownerPn = ownerPn;
		this.memorySize = memorySize;
	}

	public Integer getHeight() {
		return height;
	}

	public Integer getImagePn() {
		return imagePn;
	}

	public Integer getMemorySize() {
		return memorySize;
	}

	public String getOriginalName() {
		return originalName;
	}

	public Integer getOwnerPn() {
		return ownerPn;
	}

	public String getSaveName() {
		return saveName;
	}

	public Integer getWidth() {
		return width;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public void setImagePn(Integer imagePn) {
		this.imagePn = imagePn;
	}

	public void setMemorySize(Integer memorySize) {
		this.memorySize = memorySize;
	}

	public void setOriginalName(String originalName) {
		this.originalName = originalName;
	}

	public void setOwnerPn(Integer ownerPn) {
		this.ownerPn = ownerPn;
	}

	public void setSaveName(String saveName) {
		this.saveName = saveName;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	@Override
	public String toString() {
		return "FileVO [height=" + height + ", imagePn=" + imagePn
				+ ", memorySize=" + memorySize + ", originalName="
				+ originalName + ", ownerPn=" + ownerPn + ", saveName="
				+ saveName + ", width=" + width + "]";
	}

}
