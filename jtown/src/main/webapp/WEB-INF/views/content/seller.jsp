<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:url var="cp" value="/"/>
<!DOCTYPE HTML>
<html>
<head>
<title>J TOWN</title>
<%@ include file="../layout/style.jspf"%>
</head>
<body>
	<section class="jt-body">
		<header class="jt-header">
			<div class="jt-header-title">
				<div class="jt-header-banner">
					<a href="${cp }"><h1>J Town</h1></a>
				</div>
				<menu class="jt-header-login-menu">
					<li>
						<c:url var="help" value="/help/question"/>
						<a href="${help }" class="jt-common-a-base">고객센터</a>
					</li>
					<sec:authorize access="anonymous">
						<li>
							<a href="#none" class="jt-common-a-base" id="jt-login-smartPopup">로그인</a>
						</li>
						<li>
							<c:url var="join" value="/login/join"/>
							<a href="${join }" class="jt-common-a-base">회원가입</a>
						</li>
					</sec:authorize>
					<sec:authorize access="hasRole('ROLE_USER')">
						<li>
							<a href="#none" class="jt-common-a-base" id="jt-logout">로그아웃</a>
						</li>
					</sec:authorize>
				</menu>
			</div>
		</header>
		<article class="jt-seller-content">
			<header>
				<ul>
					<li>Teacher's Fitting Shop</li>
					<li>www.jogunshop.com</li>
					<li>관심사 : 남성, 댄디, 힙합, 패션</li>
				</ul>
			</header>
			<section class="jt-seller-main">
				<div class="jt-home-shop">
					<header>
						<a href="#none">Teacher's Fitting Shop</a>
					</header>
					<div class="jt-home-shop-content">
						<ul class="jt-home-shop-content-image" id="jt-seller-main-image">
							<li id="jt-seller-main-image-hover-tool" class="jt-seller-main-image-hover-tool">
								<a href="#none" class="jt-seller-main-image-updateShow" id="jt-seller-main-image-updateShow">수정</a>
							</li>
							<li>
								<c:url value="/resources/uploadImage/8.jpg" var="image"/>
								<img alt="사진" src="${image }"/>	
							</li>
							<li id="jt-seller-main-image-update-tool" class="jt-seller-main-image-update-tool">
								<input type="file"/><br/>
								<a href="#none" id="jt-seller-main-image-update">수정</a>
								<a href="#none" id="jt-seller-main-image-cancle">취소</a>
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
					<footer id="jt-seller-main-footer">
						<div class="jt-seller-main-notice-hover-tool" id="jt-seller-main-notice-hover-tool">
							<a href="#none" id="jt-seller-main-notice-updateShow" class="jt-seller-main-notice-updateShow">수정</a>
						</div>
						<span class="jt-home-shop-footer-firstQuotationMark">"</span>
						<span id="jt-seller-main-footer-text" class="jt-home-shop-footer-text">
							감독이 선수단 숙소에서 함께 생활한다? 프로 야구단에서 상상하기 어려운 풍경이다. 더구나 현역 최고령 김응용 감독
						</span>
						<textarea id="jt-seller-main-textarea" class="jt-seller-main-textarea" maxlength="80">감독이 선수단 숙소에서 함께 생활한다? 프로 야구단에서 상상하기 어려운 풍경이다. 더구나 현역 최고령 김응용 감독</textarea>
						<div class="jt-seller-main-notice-update-tool" id="jt-seller-main-notice-update-tool">
							<a href="#none" id="jt-seller-main-notice-update" class="jt-seller-main-notice-update">수정</a>
							<a href="#none" id="jt-seller-main-notice-cancle" class="jt-seller-main-notice-cancle">취소</a>
						</div>
						<span class="jt-home-shop-footer-lastQuotationMark">"</span>
					</footer>
				</div>
			</section>
			<section class="jt-seller-expand">
				<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-size="10" data-nowPosition="2">
					<header>
						<a href="#none">Teacher's Fitting Shop</a>
					</header>
					<ul class="jt-home-expand-shop-expandProducts">
						<li class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow">
							<a href="#none" id="jt-home-expand-shop-leftArrow">&lt;</a>
						</li>
						<li class="jt-home-expand-shop-expandProduct-slide">
							<c:forEach begin="0" end="9" varStatus="loop">
								<c:choose>
									<c:when test="${loop.count < 4 }">
										<div class="jt-home-expand-shop-expandProduct" id="jt-product-${loop.count }">
									</c:when>
									<c:otherwise>
										<div class="jt-home-expand-shop-expandProduct" id="jt-product-${loop.count }" style="display: none;">
									</c:otherwise>
								</c:choose>
									<c:url value="/resources/uploadImage/Product-${loop.count }.png" var="image"/>
									<img alt="상품" src="${image }"/>
								</div>
							</c:forEach>
						</li>
						<li class="jt-home-expand-shop-rigthArrow jt-home-expand-shop-arrow">
							<a href="#none" id="jt-home-expand-shop-rigthArrow">&gt;</a>
						</li>
					</ul>
					<div class="jt-home-expand-shop-products">
						<div class="jt-seller-expand-product-insert-tool">
							<div class="jt-seller-expand-product-insert">
								상품등록 <input type="file"/>
							</div>
						</div>
						<h2>Products</h2>
						<ul>
							<c:forEach begin="0" end="9" varStatus="loop">
								<li data-count="${loop.count }">
									<div class="jt-seller-expand-product-delete-tool">	
										<a href="#none" class="jt-seller-product-delete">X</a>
									</div>
									<c:url value="/resources/uploadImage/Product-${loop.count }.png" var="image"/>
									<a href="#none"class="jt-product-list"><img alt="상품" src="${image }"/></a>
								</li>
							</c:forEach>
						</ul>
					</div>
					<div class="jt-home-expand-shop-event-first" id="jt-seller-expand-event-first">
						<div>
							<a href="#none">수정</a>
						</div>
						<c:url value="/resources/uploadImage/event-1.png" var="image"/>
						<img alt="event1" src="${image }"/>
						<input type="file"/>
					</div>
					<div class="jt-home-expand-shop-event-second" id="jt-seller-expand-event-second">
						<div>
							<a href="#none">수정</a>
						</div>
						<c:url value="/resources/uploadImage/event-2.png" var="image"/>
						<img alt="event2" src="${image }"/>
						<input type="file"/>
					</div>
				</div>
			</section>
			<footer>
				※ 홈페이지 주소, 샵이름, 관심사 테그 변경은 고객센터로 문의하기 바랍니다.
			</footer>
		</article>
	</section>
	<%@ include file="../layout/login.jspf" %>
	<%@ include file="../layout/script.jspf" %>
</body>
</html>