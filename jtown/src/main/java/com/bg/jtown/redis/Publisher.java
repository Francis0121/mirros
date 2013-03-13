package com.bg.jtown.redis;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;

/**
 * Redis Test
 * 
 * @author Francis
 * 
 */
public interface Publisher {

	public void publish(String message);

	public void lovePublish(Count count);

	public void commentPublish(Integer count, Comment comment);

	public void eventPublish(Event event);

	public void viewPublish(Count count);

}