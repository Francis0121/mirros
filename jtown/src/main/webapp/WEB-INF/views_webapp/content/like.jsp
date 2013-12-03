<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page" id="like">
<%@ include file="../layout/header.jspf" %>
	<div data-role="content" class="jt-app-item-content">
		<c:forEach items="${myHeartList}" var="myHeartList" >
			<c:if test="${myHeartList.price != '-1'}">
				<div class="jt-app-item-list-products jt-app-like-lists" data-url="${myHeartList.url }" data-product-pn="${myHeartList.productPn }">
					<div class="jt-app-item-list-wrap"></div>
					<div class="jt-app-item-list-products-img">
					<c:if test="${myHeartList.contentType == '' }">
						<img src="${cp}/resources/uploadImage/${myHeartList.saveName }" oncontextmenu="return false" onselectstart="return false"/>
					</c:if>
					<c:if test="${myHeartList.contentType != '' }">
						<img src="${cp}/photo/thumbnail/${myHeartList.saveName }product.${myHeartList.contentType }" oncontextmenu="return false"/>	
					</c:if>
				</div>
				<div class="jt-app-item-list-products-name">${myHeartList.productName }</div>
				<div class="jt-app-item-list-products-price"><fmt:formatNumber value="${myHeartList.price }" />  원</div>
				<div class="jt-app-like-margin"></div>
				</div>
			</c:if>
			<c:if test="${myHeartList.price == '-1'}">
				<div class="jt-app-item-list-events jt-app-like-lists" data-url="${myHeartList.url }" data-event-pn="${myHeartList.productPn }">
					<div class="jt-app-item-list-wrap"></div>
					<div class="jt-app-item-event-wrap"><span class="jt-app-event-mark jt-app-reply-event-mark"> </span></div>
						<div class="jt-app-item-event-name">${myHeartList.productName }</div>
						<div class="jt-app-item-event-contents">
						<div class="jt-app-item-shop-name">${myHeartList.saveName }</div>
						<div class="jt-app-item-end-date">D-${myHeartList.contentType} 일 남았습니다.</div>
						<div class="jt-app-like-margin"></div>
					</div>
				</div>
			</c:if>
		</c:forEach>
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>
