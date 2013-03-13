package com.bg.jtown.util;

/**
 * @author Francis
 * 
 */
public class FileVO {

	/**
	 * 파일고유번호
	 */
	private Integer imagePn;

	/**
	 * 파일이름
	 */
	private String originalName;

	/**
	 * 저장한 파일이름
	 */
	private String saveName;

	/**
	 * 입력한 유저 정보
	 */
	private Integer ownerPn;

	/**
	 * 메모리크기
	 */
	private Integer memorySize;

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

	@Override
	public String toString() {
		return "FileVO [imagePn=" + imagePn + ", originalName=" + originalName
				+ ", saveName=" + saveName + ", ownerPn=" + ownerPn
				+ ", memorySize=" + memorySize + "]";
	}

}
