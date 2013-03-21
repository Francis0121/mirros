<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<div id="jt-home-container">
	<c:forEach items="${jtownUsers }" var="seller" varStatus="loop">
		<c:set value="${seller.pn }" var="spn"/>
		<c:if test="${spn ne 0 and spn ne null }">
		<c:set value="${images[spn] }" var="mainImages"/>
		<div class="jt-home-shop" id="jt-home-shop-<c:out value="${spn }"/>">
			<header>
				<a href="#none" onclick="jtown.home.clickShop('<c:out value="${spn }"/>', '<c:out value="${seller.shopUrl }"/>')"><c:out value="${seller.name }"/></a>
			</header>
			<div class="jt-home-shop-content">
				<ul class="jt-home-shop-content-image" data-spn="<c:out value="${spn }"/>">
					<li>
						<c:forEach items="${mainImages }" var="mainImage">
							<c:url value="/resources/uploadImage/${mainImage eq null ? '8.jpg' : mainImage}" var="image"/>
							<img alt="" src="${image }" title="<c:out value="${jtownUser.name}"/>"/>	
						</c:forEach>
					</li>
				</ul>
				<ul class="jt-home-shop-content-fn">
					<li>
						VIEW <span id="view-<c:out value="${spn }"/>"><c:out value="${seller.viewCount eq null ? 0 : seller.viewCount}"/></span>	
					</li>
					<li>
						COMMENT <span id="comment-<c:out value="${spn }"/>"><c:out value="${seller.commentCount eq null ? 0 : seller.commentCount}"/></span>
					</li>
					<li>
						<a href="#none" onclick="jtown.home.clickLove('<c:out value="${spn }"/>');">♥</a> <span id="love-<c:out value="${spn }"/>"><c:out value="${seller.loveCount eq null ? 0 : seller.loveCount}"/></span>
						<span id="new-<c:out value="${spn }"/>">
						<c:if test="${seller.bannerDate ne null and seller.bannerDate < 7 }">
							new
						</c:if>
						</span>
					</li>
				</ul>
			</div>
			<footer>
				<span class="jt-home-shop-footer-firstQuotationMark">"</span>
				<pre class="jt-home-shop-footer-text"><c:out value="${seller.notice }"/></pre>
				<span class="jt-home-shop-footer-lastQuotationMark">"</span>
			</footer>
		</div>
		</c:if>	
	</c:forEach>
</div>