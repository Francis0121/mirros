<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home_header.jspf" %>
<div class="jt-pg-container">
<div class="jt-pg-main js-masonry">
	<c:forEach items="${productGatherList }" var="list">
	<c:set value="${!empty list.customerPn ? 'jt-home-shop-love-click' : ''}   " var="heartClickShapeClass" />
	<c:set value="${!empty list.customerPn ? 'jt-home-shop-love-text-click' : ''}   " var="heartClickTextClass" />
	<c:choose>
		<c:when test="${list.hot ==0}">
			<div class="jt-pg-item jt-pg-small-product" data-url="${list.url }" data-product-pn="${list.productPn }" data-event-pn="${list.eventPn }">
				<c:if test="${list.productPn == 0 }">
					<div class="jt-pg-event-line">
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
					</div>
				</c:if> 
				<c:if test="${list.productPn != 0 }">
					<div class="jt-pg-product-line-bright">
					</div>
					<div class="jt-pg-product-line">
						<div class="jt-pg-product-img">
							<c:if test="${empty list.contentType}">
								<img src="${cp}/resources/uploadImage/${list.saveName }" alt="${list.productName }" />
							</c:if>
							<c:if test="${!empty list.contentType}">
								<img src="${cp}/photo/thumbnail/${list.saveName }product.${list.contentType}" alt="${list.productName }" />
							</c:if>
						</div>
						<div class="jt-pg-product-name" >
							<div>${list.productName }</div>
							<div>${list.price }</div>
						</div>
						<div class="jt-pg-heart-wrap">
							<div class="jt-pg-heart-shape">
								<span class="jt-home-shop-love jt-pg-heart-shape ${heartClickShapeClass }" id="jt-pg-heart-click-${list.productPn}">heart</span>
							</div>
							<div class="jt-pg-heart-count ${heartClickTextClass}" id="jt-pg-heart-count-${list.productPn }">	${list.heartCount }</div>
						</div>
					</div>
				</c:if>
			</div>
		</c:when>
		<c:otherwise>
			<div class="jt-pg-item jt-pg-large-product" data-url="${list.url }" data-product-pn="${list.productPn }" >
				<div class="jt-pg-product-line">
					<div class="jt-pg-product-line-hot"><img src="${cp}/resources/images/jt-hot.png"></div>
					<div class="jt-pg-product-img">
						<c:if test="${empty list.contentType}">
							<img src="${cp}/resources/uploadImage/${list.saveName }" alt="${list.productName }" />
						</c:if>
						<c:if test="${!empty list.contentType}">
							<img src="${cp}/photo/thumbnail/${list.saveName }product.${list.contentType}" alt="${list.productName }" />
						</c:if>
					</div>
					<div class="jt-pg-product-line-bright">
					</div>
					<div class="jt-pg-product-name">
						<div>${list.productName }</div>
						<div>${list.price }</div>
					</div>
					<div class="jt-pg-heart-wrap">
						<div class="jt-pg-heart-shape">	
							<span class="jt-home-shop-love jt-pg-heart-shape ${heartClickShapeClass }" id="jt-pg-heart-click-${list.productPn}">heart</span>
						</div>
						<div class="jt-pg-heart-count ${heartClickTextClass}" id="jt-pg-heart-count-${list.productPn }">${list.heartCount }</div>
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