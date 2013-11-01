package com.bg.jtown.business;

public class Redis {

	/**
	 *  입력 삭제 타입
	 */
	private String crudType;

	/**
	 * error 메세지
	 */
	private String message;

	/**
	 * redisType
	 */
	private String redisType;

	public String getCrudType() {
		return crudType;
	}

	public void setCrudType(String crudType) {
		this.crudType = crudType;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getRedisType() {
		return redisType;
	}

	public void setRedisType(String redisType) {
		this.redisType = redisType;
	}

	@Override
	public String toString() {
		return "Redis [crudType=" + crudType + ", message=" + message + ", redisType=" + redisType + "]";
	}

}
