<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<c:set value="${fn:length(products) }" var="productSize"/>
<!DOCTYPE HTML>
<html>
<head>
<title>J TOWN</title>
<%@ include file="../layout/style.jspf"%>
<%@ include file="../layout/header_script.jspf" %>
<style type="text/css">
	.jt-home-shop-content-image{cursor: default;}
</style>
</head>
<body style="background: #f2f2f2;">
	<section class="jt-body">
		<header class="jt-header">
			<div class="jt-header-title jt-seller-header-title">
				<div class="jt-header-banner">
					<a href="${cp }/seller/<c:out value="${jtownUser.pn}"/>"><h1>J Town</h1></a>
				</div>
				<div class="jt-header-banner">
					<a href="${cp }/"><h1>J Town</h1></a>
				</div>
				<ul class="jt-header-login-menu">
					<sec:authorize access="hasRole('ROLE_USER')">
						<li id="jt-mypage">
							<a href="#none" class="jt-common-a-base">MYPAGE&nbsp;<span class="jt-btn-underArrow">▼</span></a>
							<ul class="jt-under-wrap" id="jt-mypage-wrap">
								<li>
									<c:url value="/login/modify" var="modifyUrl"/>
									<a href="${modifyUrl }" class="jt-common-a-base" id="jt-modify">비밀번호 변경</a>
								</li>
								<li>
									<c:url value="/login/logout" var="logoutUrl"/>
									<a href="${logoutUrl }" class="jt-common-a-base" id="jt-logout">로그아웃</a>
								</li>	
							</ul>
						</li>
					</sec:authorize>
					<sec:authorize access="anonymous">
						<li>
							<a href="#none" class="jt-common-a-base" id="jt-login-smartPopup">LOG IN</a>
						</li>
						<li>
							<c:url var="join" value="/login/join"/>
							<a href="${join }" class="jt-common-a-base">SIGN UP</a>
						</li>
					</sec:authorize>
					<li id="jt-help">
						<c:url var="help" value="/help/question"/>
						<a href="#none" class="jt-common-a-base">HELP&nbsp;<span class="jt-btn-underArrow">▼</span></a>
						<ul class="jt-help-under-wrap" id="jt-help-wrap">
							<li>HELP</li>
							<li>HELP</li>
						</ul>
					</li>
				</ul>
			</div>
		</header>
		<article class="jt-seller-content-wrap">
			<section class="jt-seller-content">
				<header>
					<ul>
						<li><c:out value="${jtownUser.shopName }"/></li>
						<li><c:out value="${jtownUser.shopUrl}"/></li>
						<li>
							관심사 : 
							<c:forEach items="${interestes }" var="interest" varStatus="loop">
								<c:out value="${interest }"/>
								<c:if test="${loop.count ne fn:length(interestes) }">
									,
								</c:if>
							</c:forEach>
						</li>
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
									<div>
										<a href="#none" class="jt-seller-main-image-updateShow jt-btn-white-small" id="jt-seller-main-image-updateShow">
											<span class="btnImage"></span>
											<span class="btnText">수정</span>
										</a>
									</div>
								</li>
								<li>
									<c:choose>
										<c:when test="${fn:length(mainImages) eq 0 }">
											<c:url value="/resources/uploadImage/8.jpg" var="image"/>
											<img alt="" src="${image }" title="${jtownUser.shopName}" id="jt-seller-main-image-area"/>	
										</c:when>
										<c:otherwise>
											<c:forEach items="${mainImages }" var="mainImage" varStatus="loop" >
												<c:url value="/resources/uploadImage/${mainImage }" var="image"/>
												<img alt="" src="${image }" title="${jtownUser.shopName}" id="jt-seller-main-image-area"/>	
											</c:forEach>
										</c:otherwise>
									</c:choose>
								</li>
								<li id="jt-seller-main-image-update-tool" class="jt-seller-main-image-update-tool">
									<input type="file" id="jt-represent-image" name="jt-represent-image"/>
									<br/>
									<a href="#none" id="jt-seller-main-image-update" class="jt-btn-white-small">
										<span class="btnImage"></span>
										<span class="btnText">수정</span>
									</a>
									<a href="#none" id="jt-seller-main-image-cancle" class="jt-btn-white-small">
										<span class="btnImage"></span>
										<span class="btnText">취소</span>
									</a>
								</li>
							</ul>
						</div>
						<div id="jt-seller-main-footer" class="jt-home-notice">
							<div class="jt-seller-main-notice-hover-tool" id="jt-seller-main-notice-hover-tool">
								<div>
									<a href="#none" id="jt-seller-main-notice-updateShow" class="jt-seller-main-notice-updateShow jt-btn-white-small">
										<span class="btnImage"></span>
										<span class="btnText">수정</span>
									</a>
								</div>
							</div>
							<span class="jt-home-shop-footer-firstQuotationMark">"</span>
							<pre id="jt-seller-main-footer-text" class="jt-home-shop-footer-text"><c:out value="${jtownUser.notice }"/></pre>
							<textarea id="jt-seller-main-textarea" class="jt-seller-main-textarea" maxlength="80"><c:out value="${jtownUser.notice }"/></textarea>
							<span class="jt-home-shop-footer-lastQuotationMark">"</span>
							<div class="jt-seller-main-notice-update-tool" id="jt-seller-main-notice-update-tool">
								<a href="#none" id="jt-seller-main-notice-update" class="jt-seller-main-notice-update jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">수정</span>
								</a>
								<a href="#none" id="jt-seller-main-notice-cancle" class="jt-seller-main-notice-cancle jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">취소</span>
								</a>
							</div>
						</div>
						<ul class="jt-home-shop-content-fn">
							<li>
								<span class="jt-home-shop-view">VIEW</span>&nbsp;<span id="view-<c:out value="${jtownUser.pn}"/>"><c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/></span>	
							</li>
							<li>
								<span class="jt-home-shop-comment">COMMENT</span>&nbsp;<span id="comment-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
							</li>
							<li>
								<span class="jt-home-shop-love">♥</span>&nbsp;<span id="love-<c:out value="${jtownUser.pn}"/>"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
								<span id="new-<c:out value="${jtownUser.pn }"/>">
								<c:if test="${jtownUser.bannerDate ne null and jtownUser.bannerDate < 7 }">
									new
								</c:if>
								</span>
							</li>
						</ul>
					</div>
				</section>
				<section class="jt-seller-expand">
					<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-spn="${jtownUser.pn }" data-size="${productSize }" data-nowPosition="${productSize }">
						<header>
							<a href="#none" onclick="window.open('${jtownUser.shopUrl }');"><c:out value="${jtownUser.shopName }"/></a>
						</header>
						<ul class="jt-home-expand-shop-expandProducts">
							<li class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow">
								<a href="#none" id="jt-home-expand-shop-leftArrow">&lt;</a>
							</li>
							<li class="jt-home-expand-shop-expandProduct-slide" id="jt-seller-slide-big">
								<c:forEach items="${products }" var="product" varStatus="loop">
									<c:choose>
										<c:when test="${loop.count == 1 }">
											<div class="jt-home-expand-shop-expandProduct" id="jt-product-${productSize - loop.index }">
										</c:when>
										<c:otherwise>
											<div class="jt-home-expand-shop-expandProduct" id="jt-product-${productSize - loop.index }" style="display: none;">
										</c:otherwise>
									</c:choose>
										<c:url value="/resources/uploadImage/${product.saveName }" var="image"/>
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
								<div>
									<a href="#none" class="jt-seller-expand-product-insert-btn jt-btn-white-small">
										<span class="btnImage"></span>
										<span class="btnText">상품입력</span>
									</a>
								</div>
							</div>
							<div class="jt-seller-expand-product-insert-wrap">
								<input type="file" id="jt-product-file" name="jt-product-file"/><br/>
								<a href="#none" class="jt-seller-expand-product-insert-cancle jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">취소</span>
								</a>
							</div>
							<ul id="jt-seller-slide-small">
								<c:forEach items="${products }" var="product" varStatus="loop">
									<li data-count="${productSize - loop.index }" data-ppn="${product.pn }">
										<div class="jt-seller-expand-product-delete-tool">	
											<div>
												<a href="#none" class="jt-seller-product-delete jt-btn-white-small">
													<span class="btnImage"></span>
												</a>
											</div>
										</div>
										<c:url value="/resources/uploadImage/${product.saveName }" var="image"/>
										<a href="#none" class="jt-product-list"><img alt="상품" src="${image }"/></a>
									</li>
								</c:forEach>
							</ul>
							<form action="<c:url value="/seller/dp.jt"/>" method="post" id="product" name="product">
								<input type="hidden" id="pn" name="pn" value="pn"/>
							</form>
						</div>
						<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-first" data-epn="<c:out value="${event1.pn }"/>" data-bo="1">
							<div class="jt-home-expand-shop-event-new">
								<span>NEW</span>
							</div>
							<div class="jt-home-expand-shop-event-tool">
								<a href="#none" class="jt-home-expand-shop-event-update-btn jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">수정</span>
								</a>
							</div>
							<div class="jt-home-expand-shop-event-update-wrap">
								<span style="color: #fff;">310 X 150 (pixel)</span><br/>
								<input type="file" id="jt-event-first-image" name="jt-event-first-image"/><br/>
								<a href="#none" class="jt-home-expand-shop-event-update-done jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">수정</span>
								</a>
								<a href="#none" class="jt-home-expand-shop-event-update-cancle jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">취소</span>
								</a>
							</div>
							<c:url value="/resources/uploadImage/${event1.saveName eq null ? 'event-1.png' : event1.saveName}" var="image"/>
							<img alt="event1" src="${image }" title="<c:out value="${jtownUser.shopName }"/> Event" id="jt-seller-expand-event-first-img"/>
						</div>
						<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-second" data-epn="<c:out value="${event2.pn }"/>" data-bo="2">
							<div class="jt-home-expand-shop-event-new">
								<span>NEW</span>
							</div>
							<div class="jt-home-expand-shop-event-tool">
								<a href="#none" class="jt-home-expand-shop-event-update-btn jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">수정</span>
								</a>
							</div>
							<div class="jt-home-expand-shop-event-update-wrap">
								<span style="color: #fff;">310 X 150 (pixel)</span><br/>
								<input type="file" id="jt-event-second-image" name="jt-event-second-image"/><br/>
								<a href="#none" class="jt-home-expand-shop-event-update-done jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">수정</span>
								</a>
								<a href="#none" class="jt-home-expand-shop-event-update-cancle jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">취소</span>
								</a>
							</div>
							<c:url value="/resources/uploadImage/${event2.saveName eq null ? 'event-2.png' : event2.saveName}" var="image"/>
							<img alt="event2" src="${image }" title="<c:out value="${jtownUser.shopName }"/> Event" id="jt-seller-expand-event-second-img"/>
						</div>
						<ul class="jt-home-expand-shop-content-fn">
							<li class="jt-home-expand-shop-content-view-wrap">
								<span class="jt-home-expand-shop-content-view"></span>&nbsp;Look&nbsp;<span id="view-expand-<c:out value="${jtownUser.pn }"/>"/><c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/></span>
							</li>
							<li class="jt-home-expand-shop-content-comment-wrap">
								<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;&nbsp;<span id="comment-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
							</li>
							<li class="jt-home-expand-shop-content-love-wrap">
								<span class="jt-home-expand-shop-content-love"></span>&nbsp;Love&nbsp;<span id="love-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
							</li>
						</ul>
						<div class="jt-home-expand-divide-orange-bar"></div>
						<div class="jt-home-expand-shop-comment-wrap">
							<ul class="jt-home-expand-shop-comment">
								<c:forEach items="${comments }" var="comment">
									<li data-copn="<c:out value="${comment.commentPn }"/>">
										<ul class="jt-home-expand-shop-text-wrap">
											<li class="jt-home-expand-shop-comment-name"><c:out value="${comment.customerName }"/></li>
											<li class="jt-home-expand-shop-comment-text"><c:out value="${comment.comment }"/></li>
										</ul>
										<c:choose>
											<c:when test="${comment.customerPn eq jtownUser.pn }">
												<div class="jt-home-expand-shop-update-wrap">
													<input type="text" class="jt-comment-update-input" value="'+htmlChars(comment.comment)+'"/><br/>
													<span>esc를 누르시면 수정이 취소 됩니다.</span>
												</div>
												<div class="jt-home-expand-shop-tool-wrap">
													<a href="#none" class="jt-comment-update">수정</a>
													<a href="#none" class="jt-comment-delete">삭제</a>
												</div>
											</c:when>
											<c:otherwise>
												<div class="jt-home-expand-shop-tool-wrap">
													<a href="#none" class="jt-comment-delete">삭제</a>
												</div>
											</c:otherwise>
										</c:choose>
									</li>
								</c:forEach>
							</ul>
						</div>
						<div class="jt-home-expand-shop-comment-insert">
							<input type="text" id="jt-comment-insert" readonly="readonly" value="판매자 아이디로는 이용하실 수 없습니다."/>
						</div>
					</div>
				</section>
				<footer>
					※ 홈페이지 주소, 샵이름, 관심사 테그 변경은 고객센터로 문의하기 바랍니다.
				</footer>
			</section>
		</article>
	</section>
	<%@ include file="../layout/login.jspf" %>
	<%@ include file="../layout/script.jspf" %>
</body>
</html>