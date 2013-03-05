package com.bg.jtown.redis;

import com.bg.jtown.business.Count;

/**
 * Redis Test
 * 
 * @author Francis
 * 
 */
public interface Publisher {

	public void publish(String message);

	public void lovePublish(Count count);

}
