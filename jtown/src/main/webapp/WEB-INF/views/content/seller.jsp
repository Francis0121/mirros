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
<style type="text/css">
	.jt-home-shop-content{cursor: default;}
</style>
</head>
<body>
	<section class="jt-body">
		<header class="jt-header">
			<div class="jt-header-title">
				<div class="jt-header-banner">
					<a href="${cp }seller/<c:out value="${jtownUser.pn}"/>"><h1>J Town</h1></a>
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
					<li><c:out value="${jtownUser.shopName }"/></li>
					<li><c:out value="${jtownUser.shopUrl}"/></li>
					<li>관심사 : 남성, 댄디, 힙합, 패션</li>
				</ul>
			</header>
			<section class="jt-seller-main">
				<div class="jt-home-shop">
					<header>
						<a href="#none" onclick="window.open('${jtownUser.shopUrl }');"><c:out value="${jtownUser.shopName }"/></a>
					</header>
					<div class="jt-home-shop-content">
						<ul class="jt-home-shop-content-image" id="jt-seller-main-image">
							<li id="jt-seller-main-image-hover-tool" class="jt-seller-main-image-hover-tool">
								<a href="#none" class="jt-seller-main-image-updateShow" id="jt-seller-main-image-updateShow">수정</a>
							</li>
							<li>
								<c:url value="/resources/uploadImage/${mainImage eq null ? '8.jpg' : mainImage}" var="image"/>
								<img alt="" src="${image }" title="${jtownUser.shopName}" id="jt-seller-main-image-area"/>	
							</li>
							<li id="jt-seller-main-image-update-tool" class="jt-seller-main-image-update-tool">
								<c:url value="/file/upload.jt" var="upload"/>
								<form name="representImageForm" id="representImageForm" method="POST" enctype="multipart/form-data" action="${upload }">
									<input type="file" id="filedata" name="filedata" onchange="$('#representImageForm').submit();" />
								</form><br/>
								<a href="#none" id="jt-seller-main-image-update">수정</a>
								<a href="#none" id="jt-seller-main-image-cancle">취소</a>
							</li>
						</ul>
						<ul class="jt-home-shop-content-fn">
							<li>
								VIEW <c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/>	
							</li>
							<li>
								COMMENT 
							</li>
							<li>
								♥ <c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/>
							</li>
						</ul>
					</div>
					<footer id="jt-seller-main-footer">
						<div class="jt-seller-main-notice-hover-tool" id="jt-seller-main-notice-hover-tool">
							<a href="#none" id="jt-seller-main-notice-updateShow" class="jt-seller-main-notice-updateShow">수정</a>
						</div>
						<span class="jt-home-shop-footer-firstQuotationMark">"</span>
						<pre id="jt-seller-main-footer-text" class="jt-home-shop-footer-text"><c:out value="${jtownUser.notice }"/></pre>
						<textarea id="jt-seller-main-textarea" class="jt-seller-main-textarea" maxlength="80"><c:out value="${jtownUser.notice }"/></textarea>
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
						<a href="#none" onclick="window.open('${jtownUser.shopUrl }');"><c:out value="${jtownUser.shopName }"/></a>
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
					<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-first">
						<div class="jt-home-expand-shop-event-tool">
							<a href="#none">수정</a>
						</div>
						<div class="jt-home-expand-shop-event-update-wrap">
							<input type="file"/><br/>
							<a href="#none" class="jt-home-expand-shop-event-update-done">수정</a>
							<a href="#none" class="jt-home-expand-shop-event-update-cancle">취소</a>
						</div>
						<c:url value="/resources/uploadImage/event-1.png" var="image"/>
						<img alt="event1" src="${image }"/>
					</div>
					<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-second">
						<div class="jt-home-expand-shop-event-tool">
							<a href="#none">수정</a>
						</div>
						<div class="jt-home-expand-shop-event-update-wrap">
							<input type="file"/><br/>
							<a href="#none" class="jt-home-expand-shop-event-update-done">수정</a>
							<a href="#none" class="jt-home-expand-shop-event-update-cancle">취소</a>
						</div>
						<c:url value="/resources/uploadImage/event-2.png" var="image"/>
						<img alt="event2" src="${image }"/>
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