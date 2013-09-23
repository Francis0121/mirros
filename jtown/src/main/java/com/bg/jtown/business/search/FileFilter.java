package com.bg.jtown.business.search;

import com.bg.jtown.util.AbstractListFilter;

/**
 * @author Francis
 * 
 */
public class FileFilter extends AbstractListFilter {
	private Integer pn;

	public FileFilter() {
		super();
	}

	public Integer getPn() {
		return pn;
	}

	public void setPn(Integer pn) {
		this.pn = pn;
	}

	@Override
	public String toString() {
		return "FileFilter [pn=" + pn + "]";
	}

}
