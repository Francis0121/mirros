package com.bg.jtown.business;

public class CommentAjax {
	
	private String message;

	private String crudType;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getCrudType() {
		return crudType;
	}

	public void setCrudType(String crudType) {
		this.crudType = crudType;
	}

	@Override
	public String toString() {
		return "CommentAjax [message=" + message + ", crudType=" + crudType
				+ "]";
	}

}
