<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home_header.jspf" %>
<!-- 서버올릴시 제거 -->
<div id="jt-home-container" 
	data-cpn="${homeFilter.categoryPn eq null ? 0 : homeFilter.categoryPn}" 
	data-spn="${homeFilter.sectionPn eq null ? 0 : homeFilter.sectionPn}" 
	data-maxPage="${homeFilter.pagination.numPages eq null ? 0 : homeFilter.pagination.numPages }">
	<c:forEach begin="1" end="2" varStatus="i">
		<c:set var="jtownUsers" value="${ i.count eq 1 ? one.jtownUsers : two.jtownUsers }"/>
		<c:set var="images" value="${ i.count eq 1 ? one.images : two.images }"/>
		<c:set var="newComments" value="${ i.count eq 1 ? one.newComments : two.newComments }"/>
		<c:forEach items="${jtownUsers }" var="seller">
			<c:set value="${seller.pn }" var="spn"/>
			<c:set value="${images[spn] }" var="mainImages"/>
			<c:set value="${newComments[spn] }" var="comments"/>
			<div class="jt-home-shop" id="jt-home-shop-<c:out value="${spn }"/>" data-spn="<c:out value="${spn }"/>">
				<header>
					<a href="<c:out value="${seller.shopUrl }"/>" target="_blank" onclick="jtown.home.goHome('<c:out value="${spn }"/>')"><c:out value="${seller.name }"/></a>
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
									<c:set var="image" value="${cp }/photo/thumbnail/${mainImage.saveName}represent.${mainImage.type }"/>
										<c:if test="${mainImage.category eq 0 }">
											<c:set value="${cp }/resources/uploadImage/${mainImage.saveName }" var="image"/>
										</c:if>
										<img alt="" src="${image }" title="${jtownUser.name}"/>	
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
								<a 	href="#none" 
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
				<c:if test="${fn:length(comments) > 0}">
				<div class="jt-home-shop-comments-wrap">
					<div class="jt-home-shop-comments-bar"><div></div></div>
					<c:forEach items="${comments }" var="comment" >
					<div class="jt-home-shop-comments" data-isSplit="${comment.isSplit }" data-copn="${comment.commentPn }">
						<c:out value="${comment.splitHome }"/>
					</div>
					</c:forEach>
				</div>
				</c:if>
				<!--[if IE 7]>
				<div class="jt-home-shop-image-footer"></div>
				<![endif]-->
				<!--[if IE 8]>
				<div class="jt-home-shop-image-footer"></div>
				<![endif]-->
			</div>
		</c:forEach>
	</c:forEach>
</div>
<%@ include file="../layout/home_footer.jspf" %>