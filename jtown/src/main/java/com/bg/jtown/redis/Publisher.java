package com.bg.jtown.redis;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.Gather;
import com.bg.jtown.util.DateUtil;
import com.google.gson.Gson;

/**
 * Redis
 * 
 * @author Francis
 * 
 */
@Service
public class Publisher {

	private static Logger logger = LoggerFactory.getLogger(Publisher.class);

	@Resource
	private StringRedisTemplate publishTemplate;

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
	
	public void productHeartPublish(Count count) {
		try {
			count.setRedisType("product_heart_count");
			Gson gson = new Gson();
			String json = gson.toJson(count);
			logger.debug("Publish Reids " + json);
			publishTemplate.convertAndSend("real_time", json);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}
	
	public void eventHeartPublish(Count count) {
		try {
			count.setRedisType("event_heart_count");
			Gson gson = new Gson();
			String json = gson.toJson(count);
			logger.debug("Publish Reids " + json);
			publishTemplate.convertAndSend("real_time", json);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}
	
	public void commentFeed(Gather gather) {
		
		gather.setComparedTime(DateUtil.beforeRecodeTimeToString(gather.getInputDate()));
		System.out.println("gather :"+ gather);
		try {
			gather.setRedisType("comment_feed");
			Gson gson = new Gson();
			String json = gson.toJson(gather);
			logger.debug("Publish Reids " + json);
			publishTemplate.convertAndSend("real_time", json);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}
}
