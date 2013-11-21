<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page">
<%@ include file="../layout/header.jspf" %>
	<div data-role="content" style="height: 100%;overflow: hidden;">
		<c:forEach var="commentFeed" items="${commentFeed }">
			<div class="jt-app-reply-comment-wrap">
				<c:if test="${commentFeed.contentType != '-1'}">	
					<div class="jt-app-reply-img-wrap">
						<c:if test="${empty commentFeed.contentType}">
							<img src="${cp}/resources/uploadImage/${commentFeed.saveName }" alt="${commentFeed.productName }" />
						</c:if>
						<c:if test="${!empty commentFeed.contentType}">
							<img src="${cp}/photo/thumbnail/${commentFeed.saveName }product.${commentFeed.contentType}" alt="${commentFeed.productName }" />
						</c:if>
					</div>
				</c:if>
				<c:if test="${commentFeed.contentType == '-1'}">
					<div class="jt-app-reply-event-wrap"><span class="jt-app-event-mark jt-app-reply-event-mark"> </span></div>
				</c:if>
				<div class="jt-app-reply-contents-wrap">
					<div class="jt-app-reply-product-name">${commentFeed.productName }</div>
					<div class="jt-app-reply-comment">${commentFeed.comment }</div>
					<div class="jt-app-reply-comment-date"><span>${commentFeed.inputDate} </span></div>
				</div>
			</div>
		</c:forEach>
	
	
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>
