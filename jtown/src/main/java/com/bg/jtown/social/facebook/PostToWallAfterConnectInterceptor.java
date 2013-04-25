/*
 * Copyright 2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.bg.jtown.social.facebook;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.social.ApiException;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionFactory;
import org.springframework.social.connect.web.ConnectInterceptor;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.WebRequest;

/**
 * <pre>
 * Facebook 연동시 담벼락에 게시글을 남기는 Interceptor로
 * <b>URL = http://${host}/connect/facebook</b> 시 담벼락에 글을 남긴다. 
 * &lt;input type="checkbox" id="postToWall"/&gt; 이 체크 되있을 경우 실행된다.
 * 
 * ! Facebook 로그인과는 전혀 관계없는 Interceptor
 * 
 * 무조건 하게 할 때에는 form 전송시 checkbox 값을 항생 check되도록 함
 * </pre>
 * 
 * @author Francis
 *
 */
public class PostToWallAfterConnectInterceptor implements
		ConnectInterceptor<Facebook> {

	private static final Logger logger = LoggerFactory
			.getLogger(PostToWallAfterConnectInterceptor.class);

	public void preConnect(ConnectionFactory<Facebook> connectionFactory,
			MultiValueMap<String, String> parameters, WebRequest request) {
		if (StringUtils.hasText(request.getParameter(POST_TO_WALL_PARAMETER))) {
			request.setAttribute(POST_TO_WALL_ATTRIBUTE, Boolean.TRUE, WebRequest.SCOPE_SESSION);
		}
	}

	public void postConnect(Connection<Facebook> connection, WebRequest request) {
		if (request.getAttribute(POST_TO_WALL_ATTRIBUTE, WebRequest.SCOPE_SESSION) != null) {
			try {
				//TODO updateStatus Facebook 글귀
				connection.updateStatus("I've connected with the Spring Social Showcase!");
			} catch (ApiException e) {
				logger.debug("PostConnect Catch");
				// Do nothing: No need to break down if the post-connect post
				// can't be made.
			}
			request.removeAttribute(POST_TO_WALL_ATTRIBUTE, WebRequest.SCOPE_SESSION);
		}
	}

	private static final String POST_TO_WALL_PARAMETER = "postToWall";

	private static final String POST_TO_WALL_ATTRIBUTE = "facebookConnect." + POST_TO_WALL_PARAMETER;
}
