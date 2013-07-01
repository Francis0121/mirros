<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home-header.jspf" %>
<header class="mm-mir-header">
	<a href="http://${jtownUser.shopUrl }" target="_blank" ><c:out value="${jtownUser.name }"/></a>
	<div class="mm-mir-header-goHome">
		<a href="${cp }">Home</a>
	</div>
</header>
<section class="mm-mir-section">
	<section class="mm-mir-longNotice">
		<pre>"&nbsp;<c:out value="${jtownUser.longNotice}"/>&nbsp;"</pre>
	</section>
	<section class="mm-mir-products">
		<div id="mm-mir-products-fake-dan">
			<div style="width :${fn:length(products) * 170}px;" id="mm-mir-products-dan">
				<c:forEach items="${products }" var="product" varStatus="i">
					<div>
						<c:set var="shopUrl" value="http://${jtownUser.shopUrl }" />
						<a href="${product.url eq null ? shopUrl : product.url}" target="_blank" title="클릭시 상품 페이지로 이동됩니다." ><img alt="${product.name eq null ? 'Product' : product.name }" src="${web }/resources/uploadImage/${product.saveName }"/></a>
						<div>
							<c:choose>
								<c:when test="${product.name eq null or product.commaPrice eq null }">
									<span>상품 정보가 아직</span>
									<span>입력되지 않았습니다.</span>
								</c:when>
								<c:otherwise>
									<span><c:out value="${product.name }"/></span>
									<span><c:out value="${product.commaPrice }"/></span>
								</c:otherwise>
							</c:choose>
						</div>
					</div>
				</c:forEach>
			</div>
		</div>
	</section>
	<section class="mm-mir-events">
		<div title="클릭시 해당 쇼핑몰로 이동됩니다.">
			<c:if test="${jtownUser.bannerFirst < 8 }">
				<div class="mm-mir-events-new">
					<span class="mm-mir-events-new-image">Event</span>
				</div>
			</c:if>
			<c:set var="blankEvent" value="${cp }/resources/images/jt-event-user-blank.png"/>
			<c:set var="imageEvent" value="${web }/resources/uploadImage/${event1.saveName }"/>
			<img alt="First Event" src="${event1.saveName eq null ? blankEvent : imageEvent }"/>
		</div>
		<div title="클릭시 해당 쇼핑몰로 이동됩니다.">
			<c:if test="${jtownUser.bannerSecond < 8 }">
			<div class="mm-mir-events-new">
				<span class="mm-mir-events-new-image">Event</span>
			</div>
			</c:if>
			<c:set var="imageEvent" value="${web }/resources/uploadImage/${event2.saveName }"/>
			<img alt="Second Event" src="${event2.saveName eq null ? blankEvent : imageEvent }"/>
		</div>
	</section>
</section>
<footer class="mm-mir-footer">
	<ul>
		<li>
			<div style="width: 35px;">
				<span class="mm-home-view" title="최근 일주일간 방문수">View</span><span class="mm-home-number" id="view-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/></span>
			</div>
		</li>
		<li>
			<div style="width: 97px;">
				<span class="mm-home-comment">Comment</span><span class="mm-home-text">Comment</span><span class="mm-home-number" id="comment-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
			</div>
		</li>
		<li>
			<c:set var="loveClick" value="${jtownUser.customerPn ne null ? 'mm-home-love-click' : '' }"/>
			<c:set var="loveNumberClick" value="${jtownUser.customerPn ne null ? 'mm-home-love-number-click' : '' }"/>
			<c:set var="loveWidth" value="${jtownUser.loveHotCount ne null and jtownUser.loveHotCount ne 0 ? '66' : '39' }"/>
			<div style="width: ${loveWidth}px;">
				<div class="mm-love-click-wrap">
					<div class="mm-love-click-background">
						<img alt="Love Background" src="${cp}/resources/images/heart-background.png">
					</div>
					<div class="mm-love-click">
						<span class="mm-home-love ${loveClick }" id="love-image-<c:out value="${jtownUser.pn }"/>">Love</a>
					</div>
				</div>
				<div>
					<span class="mm-home-number" id="love-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
				</div>
				<c:if test="${jtownUser.loveHotCount ne null and jtownUser.loveHotCount ne 0}">
					<span class="mm-home-hot" title="최근 뜨는 미니샵">HOT</span>
				</c:if>
			</div>
		</li>
	</ul>
</footer>
<%@ include file="../layout/home-footer.jspf" %>