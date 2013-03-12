package com.bg.jtown.redis;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;

/**
 * Redis Test
 * 
 * @author Francis
 * 
 */
@Repository
public class RedisPublisher implements Publisher {

	private static Logger logger = LoggerFactory
			.getLogger(RedisPublisher.class);

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
			logger.debug("Publish Reids " + count.toString());
			StringBuffer sb = new StringBuffer();
			sb.append("{");
			sb.append("type : 'love_count' ");
			sb.append(",");
			sb.append("sellerPn : '").append(count.getSellerPn()).append("'");
			sb.append(",");
			sb.append("count : '").append(count.getCount()).append("'");
			sb.append("}");
			String message = sb.toString();
			publishTemplate.convertAndSend("real_time", message);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}

	@Override
	public void commentPublish(Integer count, Comment comment) {
		try {
			logger.debug("Publish Reids " + comment.toString());
			StringBuffer sb = new StringBuffer();
			sb.append("{");
			sb.append("type : 'comment' ");
			sb.append(",");
			sb.append("count : '").append(count).append("'");
			sb.append(",");
			sb.append("sellerPn : '").append(comment.getSellerPn()).append("'");
			sb.append("}");
			String message = sb.toString();
			publishTemplate.convertAndSend("real_time", message);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}

	@Override
	public void eventPublish(Event event) {
		try {
			logger.debug("Publish Reids " + event.toString());
			StringBuffer sb = new StringBuffer();
			sb.append("{");
			sb.append("type : 'event' ");
			sb.append(",");
			sb.append("sellerPn : '").append(event.getSellerPn()).append("'");
			sb.append("}");
			String message = sb.toString();
			publishTemplate.convertAndSend("real_time", message);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}

	@Override
	public void viewPublish(Count count) {
		try {
			logger.debug("Publish Reids " + count.toString());
			StringBuffer sb = new StringBuffer();
			sb.append("{");
			sb.append("type : 'view_count' ");
			sb.append(",");
			sb.append("sellerPn : '").append(count.getSellerPn()).append("'");
			sb.append(",");
			sb.append("count : '").append(count.getCount()).append("'");
			sb.append("}");
			String message = sb.toString();
			publishTemplate.convertAndSend("real_time", message);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Redis 서버가 작동하지 않고 있습니다. Redis 서버를 실행시켜야 합니다");
		}
	}
}
