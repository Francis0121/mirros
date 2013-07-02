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
			<c:if test="${jtownUser.bannerFirst < 3 }">
				<div class="mm-mir-events-new">
					<div>
						<span class="mm-mir-events-new-image">Event</span>
					</div>
				</div>
			</c:if>
			<c:set var="blankEvent" value="${cp }/resources/images/jt-event-user-blank.png"/>
			<c:set var="imageEvent" value="${web }/resources/uploadImage/${event1.saveName }"/>
			<img alt="First Event" src="${event1.saveName eq null ? blankEvent : imageEvent }"/>
		</div>
		<div title="클릭시 해당 쇼핑몰로 이동됩니다.">
			<c:if test="${jtownUser.bannerSecond < 3 }">
				<div class="mm-mir-events-new">
					<div>
						<span class="mm-mir-events-new-image">Event</span>
					</div>
				</div>
			</c:if>
			<c:set var="imageEvent" value="${web }/resources/uploadImage/${event2.saveName }"/>
			<img alt="Second Event" src="${event2.saveName eq null ? blankEvent : imageEvent }"/>
		</div>
	</section>
</section>
<footer class="mm-mir-footer" data-spn="<c:out value="${jtownUser.pn }"/>">
	<ul>
		<li>
			<div style="width: 35px;">
				<span class="mm-home-view" title="최근 일주일간 방문수">View</span><span class="mm-home-number" id="view-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/></span>
			</div>
		</li>
		<li class="mm-mir-comment-wrap">
			<div style="width: 35px;">
				<span class="mm-mir-comment">Comment</span><span class="mm-home-number" id="comment-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
			</div>
			<div class="mm-mir-comment-wrap-hide"></div>
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
						<span class="mm-mir-love ${loveClick }" id="love-image-<c:out value="${jtownUser.pn }"/>">Love</a>
					</div>
				</div>
				<div>
					<span class="mm-home-number ${loveNumberClick }" id="love-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
				</div>
				<c:if test="${jtownUser.loveHotCount ne null and jtownUser.loveHotCount ne 0}">
					<span class="mm-home-hot" title="최근 뜨는 미니샵">HOT</span>
				</c:if>
			</div>
		</li>
	</ul>
	<div class="mm-mir-comment-content">
		<ul>
			<c:forEach items="${null }" var="comment">
				<li data-copn="<c:out value="${comment.commentPn }"/>">
					<ul class="mm-mir-comment-text-wrap">
						<li class="mm-mir-comment-text-header">
							<span class="mm-mir-comment-text-header-best">BEST</span>
						</li>
						<li class="mm-mir-comment-text-content">
							<span class="mm-mir-comment-text-content-name"><c:out value="${comment.customerName }"/></span>
							<span class="mm-mir-comment-text-content-text"><c:out value="${comment.comment }"/></span>
						</li>
						<li class="mm-mir-comment-text-footer">
							<span class="mm-mir-comment-text-footer-progress-date"><c:out value="${comment.inputDate}"/></span>
							<span class="mm-mir-comment-text-footer-loveIt">LOVE</span>
							<span class="mm-mir-comment-text-footer-loveIt-count"><c:out value="${comment.commentLoveCount eq null ? '' : comment.commentLoveCount }"/></span>
						</li>
					</ul>
					<c:choose>
						<c:when test="${comment.customerPn eq jtownUser.pn }">
							<div>
								<input type="text" maxlength="100" value="${comment.comment}"/><br/>
								<span>esc를 누르시면 수정이 취소 됩니다.</span>
							</div>
							<div>
								<a href="#none">
									<span class="btnImage"></span>
								</a>
								<a href="#none">
									<span class="btnImage"></span>
								</a>
							</div>
						</c:when>
						<c:otherwise>
							<div>
								<a href="#none">
									<span class="btnImage"></span>
								</a>
							</div>
						</c:otherwise>
					</c:choose>
				</li>
			</c:forEach>
			<c:set var="pagination" value="${commentFilter.pagination }"/>
			<c:if test="${pagination.numItems ne 0 }">
				<c:choose>
					<c:when test="${fn:length(comments) > 0 }">
						<li class="mm-mir-comment-add">
							<a href="#none" class="mm-btn-silver" data-spn="${jtownUser.pn }">베스트 리플보기</a>
						</li>
						<li class="mm-mir-comment-add" style="display: none;">
					</c:when>
					<c:otherwise>
						<li class="mm-mir-comment-add">									
					</c:otherwise>
				</c:choose>
					<a href="#none" class="mm-btn-silver" id="comment-add-btn" 
						data-spn="${jtownUser.pn }" 
						data-page="0" 
						data-ni="<c:out value='${pagination.numItems }'/>"
						data-nipp="<c:out value='${pagination.numItemsPerPage }'/>">
						댓글 더 보기 <span id="comment-now-count"><c:out value="${pagination.numItemsPerPage * 0 }"/></span>/<c:out value="${pagination.numItems}"/>
					</a>
				</li>
			</c:if>
		</ul>
		<div>
			<sec:authorize access="hasRole('ROLE_USER')">
				<sec:authentication property="principal.groupName" var="groupName"/>
			</sec:authorize>
			<c:choose>
				<c:when test="${groupName eq null || groupName eq '' }">
					<input type="text" class="mm-mir-comment-insert" readonly="readonly" placeholder="로그인한 사용자만 사용할 수 있습니다."/>
				</c:when>
				<c:otherwise>
					<c:choose>
						<c:when test="${groupName eq 'Customer' }">
							<input type="text" class="mm-mir-comment-insert" placeholder="이 쇼핑몰에 대한 한마디를 남겨주세요. 상품 배송문의는 해당 쇼핑몰 고객센터로 남겨주세요." maxlength="100"/>
						</c:when>
						<c:otherwise>
							<input type="text" class="mm-mir-comment-insert" readonly="readonly" placeholder="판매자 아이디로는 이용하실 수 없습니다."/>
						</c:otherwise>
					</c:choose>
				</c:otherwise>
			</c:choose>
		</div>
	</div>
</footer>
<%@ include file="../layout/home-footer.jspf" %>