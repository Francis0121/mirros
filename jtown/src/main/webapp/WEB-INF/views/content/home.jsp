<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../layout/home_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<div id="jt-home-container">
	<c:forEach begin="1" end="2" varStatus="loop">
		<c:if test="${loop.count eq 1 }">
			<c:set var="jtownUsers" value="${one.jtownUsers }"/>
			<c:set var="images" value="${one.images }"/>
		</c:if>
		<c:if test="${loop.count eq 2 }">
			<c:set var="jtownUsers" value="${two.jtownUsers }"/>
			<c:set var="images" value="${two.images }"/>
		</c:if>
		<c:forEach items="${jtownUsers }" var="seller">
			<c:set value="${seller.pn }" var="spn"/>
			<c:if test="${spn ne 0 and spn ne null }">
			<c:set value="${images[spn] }" var="mainImages"/>
			<div class="jt-home-shop" id="jt-home-shop-<c:out value="${spn }"/>" data-spn="<c:out value="${spn }"/>">
				<header>
					<a href="http://<c:out value="${seller.shopUrl }"/>" target="_blank" onclick="jtown.home.goHome('<c:out value="${spn }"/>')"><c:out value="${seller.name }"/></a>
				</header>
				<div class="jt-home-shop-content">
					<ul class="jt-home-shop-content-image">
						<li>
							<c:choose>
								<c:when test="${fn:length(mainImages) eq 0 }">
									<img alt="blank" src="${cp }/resources/images/jt-introduce-home-blank.png" title="${jtownUser.name}"/>	
								</c:when>
								<c:otherwise>	
									<c:forEach items="${mainImages }" var="mainImage">
										<img alt="" src="${cp }/resources/uploadImage/${mainImage}" title="${jtownUser.name}"/>	
									</c:forEach>
								</c:otherwise>
							</c:choose>
							<div class="jt-home-shop-new-event">
								<c:set var="newBannerStyle" value="${seller.newBanner ? 'display: block;' : 'display:none;'}"></c:set>
								<c:set var="newProductStyle" value="${seller.newProduct > 0 ? 'display: block;' : 'display:none;'}"></c:set>
								
								<div id="new-product-<c:out value="${seller.pn }"/>" class="jt-home-shop-new-event-div" style="${newProductStyle}">
									<span class="jt-home-shop-product-new-image">New product</span>
								</div>
								
								<div id="new-<c:out value="${seller.pn }"/>"  class="jt-home-shop-new-event-div" style="${newBannerStyle}">
									<span class="jt-home-shop-event-new-image">New event</span>														
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="jt-home-notice">
					<span class="jt-home-shop-footer-firstQuotationMark"></span>
					<pre class="jt-home-shop-footer-text"><c:out value="${seller.notice }"/></pre>
					<span class="jt-home-shop-footer-lastQuotationMark"></span>
				</div>
				<ul class="jt-home-shop-content-fn">
					<li>
						<span class="jt-home-shop-view" title="최근 일주일간 방문수" >VIEW</span>&nbsp;<span id="view-<c:out value="${spn }"/>"><c:out value="${seller.viewCount eq null ? 0 : seller.viewCount}"/></span>	
					</li>
					<li>
						<span class="jt-home-shop-comment">COMMENT</span>&nbsp;<span id="comment-<c:out value="${spn }"/>"><c:out value="${seller.commentCount eq null ? 0 : seller.commentCount}"/></span>
					</li>
					<li>
						<c:set var="loveClick" value="${seller.customerPn ne null ? 'jt-home-shop-love-click' : '' }"/>
						<c:set var="loveTextClick" value="${seller.customerPn ne null ? 'jt-home-shop-love-text-click' : '' }"/>
						<div class="jt-heart-click-wrap">
							<div class="jt-heart-click-background" id="jt-heart-click-<c:out value="${spn }"/>">
								<img alt="heart-background" src="${cp}/resources/images/heart-background.png">
							</div>
							<div class="jt-heart-click">
								<a href="#none" 
									onclick="jtown.home.clickLove('<c:out value="${spn }"/>');" 
									id="love-image-<c:out value="${spn }"/>" 
									class="jt-home-shop-love ${loveClick }">♥</a>
							</div>
						</div>
						<div class="jt-home-shop-content-love-text-wrap">
							<span id="love-<c:out value="${spn }"/>" class="${loveTextClick}"><c:out value="${seller.loveCount eq null ? 0 : seller.loveCount}"/></span>
							<c:if test="${seller.loveHotCount ne null and seller.loveHotCount ne 0}">
							<span class="jt-home-shop-love-hot" title="최근 뜨는 미니샵">HOT</span>
							</c:if>
						</div>
					</li>
				</ul>
				<!--[if IE 7]>
				<div class="jt-home-shop-image-footer"></div>
				<![endif]-->
				<!--[if IE 8]>
				<div class="jt-home-shop-image-footer"></div>
				<![endif]-->
			</div>
			</c:if>	
		</c:forEach>
	</c:forEach>
</div>
<%@ include file="../layout/home_footer.jspf" %>