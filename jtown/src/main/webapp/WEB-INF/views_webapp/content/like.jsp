<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page" id="like" data-theme="g">
<%@ include file="../layout/header.jspf" %>
	<div class="jt-app-contents-wrap">
		<div data-role="content" class="jt-app-item-content" data-theme="c">
			<div class="jt-app-like-title">${username }님의 관심리스트입니다.</div>

			<c:forEach items="${myHeartList}" var="myHeartList" >
				<c:if test="${myHeartList.price != '-1'}">
					<div class="jt-app-item-list-products jt-app-like-lists" data-url="${myHeartList.url }" data-product-pn="${myHeartList.productPn }">
						<div class="jt-app-item-list-wrap"></div>
						<div class="jt-app-item-img-shield"></div>
						<div class="jt-app-like-delete-wrap"><div class="jt-app-like-delete-wrap-background"><div class="jt-app-like-delete"></div></div></div>
						<div class="jt-app-item-list-products-img">
						<c:if test="${myHeartList.contentType == '' }">
							<img src="${cp}/resources/uploadImage/${myHeartList.saveName }" />
						</c:if>
						<c:if test="${myHeartList.contentType != '' }">
							<img src="${cp}/photo/thumbnail/${myHeartList.saveName }product.${myHeartList.contentType }" />	
						</c:if>
					</div>
					<div class="jt-app-item-list-products-name">	
						<c:if test="${fn:length(myHeartList.productName) >= 11 }">
							${fn:substring( myHeartList.productName ,0,10) }..	
						</c:if>
						<c:if test="${fn:length(myHeartList.productName) < 11 }">
							${myHeartList.productName}
						</c:if>
					</div>
					<div class="jt-app-item-list-products-price"><fmt:formatNumber value="${myHeartList.price }" />  원</div>
					<div class="jt-app-like-time-wrap"><div class="jt-app-reply-clock jt-app-like-time"></div><div class="jt-app-like-time">${myHeartList.comparedTime } </div></div>
					</div>
				</c:if>
				<c:if test="${myHeartList.price == '-1'}">
					<div class="jt-app-item-list-events jt-app-like-lists" data-url="${myHeartList.url }" data-event-pn="${myHeartList.productPn }">
						<div class="jt-tab-wrap"><div class="jt-tab-event"></div></div>
						<div class="jt-app-item-list-wrap"></div>
						<div class="jt-app-like-delete-wrap"><div class="jt-app-like-delete-wrap-background"><div class="jt-app-like-delete"></div></div></div>
						<div class="jt-app-item-event-wrap"><img src="${cp}/resources_webapp/images/jt-dummy.png" /></div>
							<div class="jt-app-item-event-name">${myHeartList.productName }</div>
							<div class="jt-app-item-event-contents">
								<div class="jt-app-item-shop-name">${myHeartList.saveName }</div>
								<div class="jt-app-item-end-date">D-${myHeartList.contentType} 일 남았습니다.</div>
							</div>
							<div class="jt-app-like-time-wrap"><div class="jt-app-reply-clock jt-app-like-time"></div><div class="jt-app-like-time">${myHeartList.comparedTime }</div> </div>
					</div>
				</c:if>
			</c:forEach>
		</div>
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>
