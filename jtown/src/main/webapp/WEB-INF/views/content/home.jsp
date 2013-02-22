<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../layout/layout_header.jspf" %>
<div id="jt-home-container">
	<c:forEach begin="0" end="19" varStatus="loop">
		<div class="jt-home-shop">
			<header>
				<a href="#none">조군샵</a>
			</header>
			<div class="jt-home-shop-content">
				<ul class="jt-home-shop-content-image">
					<li>
						<c:url value="/resources/uploadImage/${loop.count > 10 ? loop.count - 10 : loop.count }.jpg" var="image"/>
						<img alt="사진" src="${image }"/>	
					</li>
				</ul>
				<ul class="jt-home-shop-content-fn">
					<li>
						VIEW 3,000	
					</li>
					<li>
						COMMENT 8
					</li>
					<li>
						♥
					</li>
				</ul>
			</div>
			<footer>
				<span class="jt-home-shop-footer-firstQuotationMark">"</span>
				<span class="jt-home-shop-footer-text">
					감독이 선수단 숙소에서 함께 생활한다? 프로 야구단에서 상상하기 어려운 풍경이다. 더구나 현역 최고령 김응용 감독
				</span>
				<span class="jt-home-shop-footer-lastQuotationMark">"</span>
			</footer>
		</div>	
	</c:forEach>
</div>
<nav id="page-nav" style="display: none;">
  <a href="<c:url value="/page/2"/>"></a>
</nav>
<%@ include file="../layout/layout_footer.jspf" %>