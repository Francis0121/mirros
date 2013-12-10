<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page" data-theme="g">
<%@ include file="../layout/header.jspf" %>
	<div class="jt-app-contents-wrap">
		<div data-role="content" class="jt-app-item-content jt-app-reply-contents" data-theme="c">
		<div class="jt-app-reply-title">최신 댓글만 모아봅니다.</div>
			<c:forEach var="commentFeed" items="${commentFeed }">
				<div class="jt-app-reply-comment-wrap" data-url="${commentFeed.url}" data-comment-pn="${commentFeed.commentPn}" data-customer-pn="${commentFeed.customerPn }" oncontextmenu="return false" onselectstart="return false">
					<c:if test="${commentFeed.contentType != '-1'}">	
						<div class="jt-app-reply-img-wrap" data-productPn="${commentFeed.productPn }">
							<c:if test="${empty commentFeed.contentType}">
								<img src="${cp}/resources/uploadImage/${commentFeed.saveName }" alt="${commentFeed.productName }" />
							</c:if>
							<c:if test="${!empty commentFeed.contentType}">
								<img src="${cp}/photo/thumbnail/${commentFeed.saveName }product.${commentFeed.contentType}" alt="${commentFeed.productName }" />
							</c:if>
						</div>
					</c:if>
					<c:if test="${commentFeed.contentType == '-1'}">
						<div class="jt-app-reply-event-wrap" data-eventPn="${commentFeed.productPn }"><span class="jt-app-event-mark jt-app-reply-event-mark"> </span></div>
					</c:if>
					<div class="jt-app-reply-contents-wrap">
						<div class="jt-app-reply-product-name">${commentFeed.productName }</div>
						<div class="jt-app-reply-comment">"${commentFeed.comment }"</div>
						<div class="jt-app-reply-menu-wrap">
							<div class="jt-app-reply-comment-date">
							<div class="jt-app-reply-clock"></div><div>${commentFeed.comparedTime }</div>
							</div>
						</div>
					</div>
				</div>
			</c:forEach>
		<div data-role="popup" id="jt-reply-popup-menu" data-overlay-theme="a">
		    <ul data-role="listview" data-inset="true" >
				<li data-role="divider" data-theme="c"> &nbsp; </li>
				<li class="jt-app-reply-popup-delete"><a href="">삭제</a></li>
				<li class="jt-app-reply-popup-warn"><a href="">신고</a></li>
		    </ul>
		</div>
		</div>
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>
