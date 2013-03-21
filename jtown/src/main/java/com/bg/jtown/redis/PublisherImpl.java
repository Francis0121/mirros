package com.bg.jtown.redis;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;
import com.google.gson.Gson;

/**
 * Redis
 * 
 * @author Francis
 * 
 */
@Repository
public class PublisherImpl implements Publisher {

	private static Logger logger = LoggerFactory.getLogger(PublisherImpl.class);

	@Resource(name = "publishTemplate")
	private StringRedisTemplate publishTemplate;

	@Override
	public void publish(String message) {
		logger.debug(message.toString());
		publishTemplate.convertAndSend("real_time", message);
	}

	@Override
	public void lovePublish(Count count) {
		try {
			count.setRedisType("love_count");
			Gson gson = new Gson();
			String json = gson.toJson(count);
			logger.debug("Publish Reids " + json);
			publishTemplate.convertAndSend("real_time", json);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}

	@Override
	public void commentPublish(Comment comment) {
		try {
			Gson gson = new Gson();
			String json = gson.toJson(comment);
			logger.debug("Publish Reids " + json);
			publishTemplate.convertAndSend("real_time", json);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}

	@Override
	public void eventPublish(Event event) {
		try {
			Gson gson = new Gson();
			String json = gson.toJson(event);
			logger.debug("Publish Reids " + json);
			publishTemplate.convertAndSend("real_time", json);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}

	@Override
	public void viewPublish(Count count) {
		try {
			count.setRedisType("view_count");
			Gson gson = new Gson();
			String json = gson.toJson(count);
			logger.debug("Publish Reids " + json);
			publishTemplate.convertAndSend("real_time", json);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}
}
