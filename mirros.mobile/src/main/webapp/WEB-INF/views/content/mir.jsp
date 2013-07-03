<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home-header.jspf" %>
<sec:authorize access="hasRole('ROLE_USER')">
	<sec:authentication property="principal.pn" var="cpn"/>				
</sec:authorize>
<sec:authorize access="anonymous">
	<c:set var="cpn" value=""/>
</sec:authorize>
<header class="mm-mir-header">
	<a href="http://${jtownUser.shopUrl }" target="_blank" data-spn="${jtownUser.pn }"><c:out value="${jtownUser.name }"/></a>
	<div class="mm-mir-header-goHome">
		<a href="${cp }">Home</a>
	</div>
</header>
<section class="mm-mir-section">
	<section class="mm-mir-longNotice">
		<pre>"&nbsp;<c:out value="${jtownUser.longNotice}"/>&nbsp;"</pre>
	</section>
	<section class="mm-mir-products">
		<div class="mm-mir-products-fake">
			<div id="mm-carousel" data-length="${fn:length(products)}">
				<ul>
					<c:forEach items="${products }" var="product" varStatus="i">
						<c:set var="shopUrl" value="http://${jtownUser.shopUrl }" />
						<li>
							<a href="javascript:mobile.product('${jtownUser.pn }', '${product.url eq null ? shopUrl : product.url}');">
								<img alt="${product.name eq null ? 'Product' : product.name }" src="${web }/resources/uploadImage/${product.saveName }" >
							</a>
							<p>
								<c:choose>
									<c:when test="${product.name eq null or product.commaPrice eq null }">
										<span class="mm-carousel-text">상품 정보가 아직</span>
										<span class="mm-carousel-text">
											입력되지 않았습니다.
											<c:if test="${product.newProduct }">
											</c:if>
										</span>
										<span class="mm-mir-products-new">New</span>	
									</c:when>
									<c:otherwise>
										<span class="mm-carousel-text"><c:out value="${product.name }"/></span>
										<span class="mm-carousel-text">
											<c:out value="${product.commaPrice }"/>
											<c:if test="${product.newProduct }">
												<span class="mm-mir-products-new">New</span>	
											</c:if>
										</span>
									</c:otherwise>
								</c:choose>
							</p>
						</li>
					</c:forEach>
				</ul>
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
<footer class="mm-mir-footer" data-spn="<c:out value="${jtownUser.pn }"/>" data-name="<c:out value="${jtownUser.name }"/>">
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
			<c:forEach items="${commentTops }" var="comment">
				<li data-copn="<c:out value="${comment.commentPn }"/>" class="mm-mir-comment-content-text">
					<ul class="mm-mir-comment-text-wrap">
						<li class="mm-mir-comment-text-header">
							<span class="mm-mir-comment-text-header-best">BEST</span>
						</li>
						<li class="mm-mir-comment-text-content">
							<span class="mm-mir-comment-text-content-name"><c:out value="${comment.customerName }"/></span>
							<span class="mm-mir-comment-text-content-text"><c:out value="${comment.comment }"/></span>
						</li>
						<li class="mm-mir-comment-text-footer comment-love-<c:out value="${comment.commentPn }"/>">
							<span class="mm-mir-comment-text-footer-progress-date"><c:out value="${comment.inputDate}"/></span>
							<span class="mm-mir-comment-text-footer-loveIt">LOVE</span>
							<span class="mm-mir-comment-text-footer-loveIt-count"><c:out value="${comment.commentLoveCount eq null ? '' : comment.commentLoveCount }"/></span>
							<c:if test="${comment.commentCustomerPn ne null}">
								<span class="mm-mir-comment-text-footer-loveIt-cancle">취소</span>
							</c:if>
							<c:choose>
								<c:when test="${comment.customerPn ne cpn }">
									<c:choose>
										<c:when test="${comment.warnCustomerPn eq null }">
											<span class="mm-warn-active" title="신고">WARN</span>
										</c:when>
										<c:otherwise>
											<span class="mm-warn-disactive" title="신고">WARN</span>
										</c:otherwise>
									</c:choose>
								</c:when>
								<c:otherwise>
									<span class="mm-comment-delete">삭제</span>
									<span class="mm-comment-update">수정</span>
								</c:otherwise>
							</c:choose>
						</li>
					</ul>
					<c:if test="${comment.customerPn eq cpn}">
						<div class="mm-comment-update-wrap">
							<input type="text" maxlength="100" value="${comment.comment}" class="mm-mir-comment-update"/><br/>
							<button type="button" class="mm-btn-orange mm-commnet-cancle-btn">취소</button>
							<button type="button" class="mm-btn-orange mm-commnet-update-btn">수정</button>
						</div>
					</c:if>
				</li>
			</c:forEach>
			<c:forEach items="${comments }" var="comment">
				<li data-copn="<c:out value="${comment.commentPn }"/>" class="mm-mir-comment-content-text comment-not-best">
					<ul class="mm-mir-comment-text-wrap">
						<li class="mm-mir-comment-text-content">
							<span class="mm-mir-comment-text-content-name"><c:out value="${comment.customerName }"/></span>
							<span class="mm-mir-comment-text-content-text"><c:out value="${comment.comment }"/></span>
						</li>
						<li class="mm-mir-comment-text-footer comment-love-<c:out value="${comment.commentPn }"/>">
							<span class="mm-mir-comment-text-footer-progress-date"><c:out value="${comment.inputDate}"/></span>
							<span class="mm-mir-comment-text-footer-loveIt">LOVE</span>
							<span class="mm-mir-comment-text-footer-loveIt-count"><c:out value="${comment.commentLoveCount eq null ? '' : comment.commentLoveCount }"/></span>
							<c:if test="${comment.commentCustomerPn ne null }">
								<span class="mm-mir-comment-text-footer-loveIt-cancle">취소</span>
							</c:if>
							<c:choose>
								<c:when test="${comment.customerPn ne cpn }">
									<c:choose>
										<c:when test="${comment.warnCustomerPn eq null }">
											<span class="mm-warn-active" title="신고">WARN</span>
										</c:when>
										<c:otherwise>
											<span class="mm-warn-disactive" title="신고">WARN</span>
										</c:otherwise>
									</c:choose>
								</c:when>
								<c:otherwise>
									<span class="mm-comment-delete">삭제</span>
									<span class="mm-comment-update">수정</span>
								</c:otherwise>
							</c:choose>
						</li>
					</ul>
					<c:if test="${comment.customerPn eq cpn }">
						<div class="mm-comment-update-wrap">
							<input type="text" maxlength="100" value="${comment.comment}" class="mm-mir-comment-update"/><br/>
							<button type="button" class="mm-btn-orange mm-commnet-cancle-btn">취소</button>
							<button type="button" class="mm-btn-orange mm-commnet-update-btn">수정</button>
						</div>
					</c:if>
				</li>
			</c:forEach>
			<c:set var="pagination" value="${commentFilter.pagination }"/>
			<c:if test="${pagination.numItems > pagination.numItemsPerPage }">
				<li class="mm-mir-comment-add">									
					<a href="#none" class="mm-btn-silver" id="comment-add-btn" 
						data-spn="${jtownUser.pn }" 
						data-page="1" 
						data-ni="<c:out value='${pagination.numItems }'/>"
						data-nipp="<c:out value='${pagination.numItemsPerPage }'/>">
						댓글 더 보기 <span id="comment-now-count"><c:out value="${pagination.numItemsPerPage}"/></span>/<c:out value="${pagination.numItems}"/>
					</a>
				</li>
			</c:if>
		</ul>
		<div class="mm-mir-comment-insert-wrap">
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
							<input type="text" class="mm-mir-comment-insert" placeholder="이 쇼핑몰에 대한 한마디를 남겨주세요." maxlength="100"/>
							<button type="button" class="mm-btn-orange mm-mir-comment-insert-btn">댓글 달기</button>
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