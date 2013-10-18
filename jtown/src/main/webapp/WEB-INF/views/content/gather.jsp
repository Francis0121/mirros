<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home_header.jspf" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="jt-pg-container">
<div class="jt-pg-main js-masonry">
	<div class="jt-pg-item jt-pg-event-item">
	</div>
	<div class="jt-pg-item jt-pg-event-page">
		<img src="${cp}/resources/images/event/banner2.PNG">
	</div>
	<c:forEach items="${productGatherList }" var="list">
	<c:set value="${!empty list.customerPn ? 'jt-home-shop-love-click' : ''}   " var="heartClickShapeClass" />
	<c:set value="${!empty list.customerPn ? 'jt-home-shop-love-text-click' : ''}   " var="heartClickTextClass" />
	
	<c:choose>
		<c:when test="${list.hot ==0}">
			<div class="jt-pg-item jt-pg-small-product" data-url="${list.url }" data-product-pn="${list.productPn }" data-event-pn="${list.eventPn }">
				<c:if test="${list.productPn == 0 }">
					<div class="jt-pg-event-line">
						<div class="jt-pg-item-wrap">
							<div class="jt-pg-event-line-event-name-wrap">
								<span class="jt-home-expand-shop-event-new-image">NEW</span>
								<div class="jt-pg-event-line-event-name">${list.eventName }</div>
							</div>
							<div class="jt-pg-event-line-shop-name">
								${list.shopName }
							</div>
							<div class="jt-pg-event-line-end-date">
								D - ${list.endDate }일 남았습니다.
							</div>
							<div class="jt-pg-heart-wrap">
								<div class="jt-pg-heart-shape">
									<span class="jt-home-shop-love jt-pg-heart-shape ${heartClickShapeClass }" id="jt-pg-heart-click-e-${list.eventPn}">heart</span>
								</div>
								<div class="jt-pg-heart-event-count ${heartClickTextClass}" id="jt-pg-heart-count-e-${list.eventPn }">${list.heartCount }</div>
							</div>
							<div class="jt-btn-fbLogin jt-pg-product-facebook">
								<span class="loginImage"></span>
								<span class="loginText">페이스북 공유하기</span>
							</div>
						</div>
					</div>
				</c:if> 
				<c:if test="${list.productPn != 0 }">
					<div class="jt-pg-product-line">
						<div class="jt-pg-item-wrap">
							<div class="jt-pg-product-img">
								<c:if test="${empty list.contentType}">
									<img src="${cp}/resources/uploadImage/${list.saveName }" alt="${list.productName }" />
								</c:if>
								<c:if test="${!empty list.contentType}">
									<img src="${cp}/photo/thumbnail/${list.saveName }product.${list.contentType}" alt="${list.productName }" />
								</c:if>
							</div>
							<div class="jt-pg-product-line-bright"></div>
							<div class="jt-btn-fbLogin jt-pg-product-facebook">
								<span class="loginImage"></span>
								<span class="loginText">페이스북 공유하기</span>
							</div>
							<div class="jt-pg-product-name" >
								<div>${list.productName }</div>
								<div><fmt:formatNumber value="${list.price }" /></div>
							</div>
							<div class="jt-pg-heart-wrap">
								<div class="jt-pg-heart-shape">
									<span class="jt-home-shop-love jt-pg-heart-shape ${heartClickShapeClass }" id="jt-pg-heart-click-${list.productPn}">heart</span>
								</div>
								<div class="jt-pg-heart-count ${heartClickTextClass}" id="jt-pg-heart-count-${list.productPn }">	${list.heartCount }</div>
							</div>
						</div>
						<div class="jt-pg-comment-wrap">
							<div>ㅁ <input type="text" class="jt-pg-comment-input" placeholder="Write your secret comment..."  maxlength="20"/></div>
							<div class="jt-pg-comment-line-wrap">
								<c:forEach items="${list.comments}" var="commentList" varStatus="idx">
									<c:if test="${idx.count >3}">
										<c:set var="enable" value="jt-pg-comment-more-enable"  />
									</c:if>
									<c:if test="${idx.count <=3}">
										<div>
											<div class="jt-pg-comment-line-text">${commentList.comment }</div>
											<div class="jt-pg-comment-line-date">${commentList.inputDate}</div>
										</div>
									</c:if>
								</c:forEach>
							</div>
							<div class="jt-pg-comment-more <c:out value="${enable}"/>">▼</div>
							<c:set var="enable" value=""  />
						</div>
					</div>
				</c:if>
			</div>
		</c:when>
		<c:otherwise>
			<div class="jt-pg-item jt-pg-large-product" data-url="${list.url }" data-product-pn="${list.productPn }" >
				<div class="jt-pg-product-line">
					<div class="jt-pg-item-wrap">
						<div class="jt-pg-product-line-hot"><img src="${cp}/resources/images/jt-hot.png"></div>
						<div class="jt-pg-product-img">
							<c:if test="${empty list.contentType}">
								<img src="${cp}/resources/uploadImage/${list.saveName }" alt="${list.productName }" />
							</c:if>
							<c:if test="${!empty list.contentType}">
								<img src="${cp}/photo/thumbnail/${list.saveName }product.${list.contentType}" alt="${list.productName }" />
							</c:if>
						</div>
						<div class="jt-pg-product-line-bright"></div>
						<div class="jt-btn-fbLogin jt-pg-product-facebook">
							<span class="loginImage"></span>
							<span class="loginText">페이스북 공유하기</span>
						</div>
						<div class="jt-pg-product-name">
							<div>${list.productName }</div>
							<div><fmt:formatNumber value="${list.price }" /></div>
						</div>
						<div class="jt-pg-heart-wrap">
							<div class="jt-pg-heart-shape">	
								<span class="jt-home-shop-love jt-pg-heart-shape ${heartClickShapeClass }" id="jt-pg-heart-click-${list.productPn}">heart</span>
							</div>
							<div class="jt-pg-heart-count ${heartClickTextClass}" id="jt-pg-heart-count-${list.productPn }">${list.heartCount }</div>
						</div>
					</div>
					<div class="jt-pg-comment-wrap">
							<div>ㅁ <input type="text" class="jt-pg-comment-input" placeholder="Write your secret comment..."  maxlength="20"/></div>
							<div class="jt-pg-comment-line-wrap">
								<c:forEach items="${list.comments}" var="commentList" varStatus="idx">
									<c:if test="${idx.count >3}">
										<c:set var="enable" value="jt-pg-comment-more-enable"  />
									</c:if>
									<c:if test="${idx.count <=3}">
										<div>
											<div class="jt-pg-comment-line-text">${commentList.comment }</div>
											<div class="jt-pg-comment-line-date">${commentList.inputDate}</div>
										</div>
									</c:if>
								</c:forEach>
							</div>
							<div class="jt-pg-comment-more <c:out value="${enable}"/>">▼</div>
							<c:set var="enable" value=""  />
						</div>
				</div>	
			</div>
		</c:otherwise>
	</c:choose>
	</c:forEach>
</div>
<div id="infscr-loading" style="display:none;">
	<center>
		<img alt="Loading..." src="${cp}/resources/images/jt-loading-big.gif" />
	</center>
	Loading...
</div>

</div>
<%@ include file="../layout/home_footer.jspf" %>