<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../layout/layout_header.jspf" %>
<div id="jt-home-container">
	<c:forEach items="${jtownUsers }" var="seller" varStatus="loop">
		<c:set value="${seller.pn }" var="spn"/>
		<c:set value="${images[spn] }" var="mainImages"/>
		<div class="jt-home-shop">
			<header>
				<a href="#none" onclick="window.open('http://${seller.shopUrl }');"><c:out value="${seller.shopName }"/></a>
			</header>
			<div class="jt-home-shop-content" data-spn="<c:out value="${spn }"/>">
				<ul class="jt-home-shop-content-image">
					<li>
						<c:forEach items="${mainImages }" var="mainImage" varStatus="loop" >
							<c:url value="/resources/uploadImage/${mainImage eq null ? '8.jpg' : mainImage}" var="image"/>
							<img alt="" src="${image }" title="${jtownUser.shopName}" id="jt-seller-main-image-area"/>	
						</c:forEach>
					</li>
				</ul>
				<ul class="jt-home-shop-content-fn">
					<li>
						VIEW <c:out value="${seller.viewCount eq null ? 0 : seller.viewCount}"/>	
					</li>
					<li>
						COMMENT 8
					</li>
					<li>
						♥ <c:out value="${seller.loveCount eq null ? 0 : seller.loveCount}"/>
					</li>
				</ul>
			</div>
			<footer>
				<span class="jt-home-shop-footer-firstQuotationMark">"</span>
				<pre id="jt-seller-main-footer-text" class="jt-home-shop-footer-text"><c:out value="${seller.notice }"/></pre>
				<span class="jt-home-shop-footer-lastQuotationMark">"</span>
			</footer>
		</div>	
	</c:forEach>
</div>
<nav id="page-nav" style="display: none;">
  <a href="<c:url value="/page/2"/>"></a>
</nav>
<%@ include file="../layout/layout_footer.jspf" %>