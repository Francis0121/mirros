<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../layout/home_header.jspf" %>
<style>
<!--
	.jt-content {min-height: 800px;}
-->
</style>
<c:set value="${fn:length(products) }" var="productSize"/>
<article class="jt-url-content-wrap">
	<div id="urlfolderBar">
		<div id="urlfolderTabName">
			<span id="urldigonalFolderImage"><a href="http://${jtownUser.shopUrl }"target="_blank"><c:out value="${jtownUser.name }"/></a></span>
		</div>
	</div>
	<section class="jt-seller-content">
		<section class="jt-home-main-url">
			<ul class="jt-home-main-url-image">
				<li>
					<c:choose>
						<c:when test="${fn:length(mainImages) eq 0 }">
							<c:url value="/resources/uploadImage/8.jpg" var="image"/>
							<img alt="" src="${image }" title="${jtownUser.name}" id="jt-seller-main-image-area"/>	
						</c:when>
						<c:otherwise>
							<c:forEach items="${mainImages }" var="mainImage" varStatus="loop" >
								<c:url value="/resources/uploadImage/${mainImage }" var="image"/>
								<img alt="" src="${image }" title="${jtownUser.name}" id="jt-seller-main-image-area"/>	
							</c:forEach>
						</c:otherwise>
					</c:choose>
				</li>
			</ul>
		</section>
		<section class="jt-seller-expand">
			<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-spn="${jtownUser.pn }" data-size="${productSize }" data-nowPosition="${productSize}">
				<div id="jt-home-expand-shop-notice">
					<span class="jt-home-expand-shop-firstQuotationMark"></span>
					<pre id="jt-seller-expand-shop-text" class="jt-home-expand-shop-text"><c:out value="${jtownUser.longNotice}"/></pre>
					<textarea id="jt-seller-expand-textarea" class="jt-seller-expand-textarea" maxlength="200"><c:out value="${jtownUser.longNotice}"/></textarea>
					<span class="jt-home-expand-shop-lastQuotationMark"></span>
				</div>
				<ul class="jt-home-expand-shop-expandProducts">
					<li class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow">
						<a href="#none" id="jt-home-expand-shop-leftArrow">&lt;</a>
					</li>
					<li class="jt-home-expand-shop-expandProduct-slide" id="jt-seller-slide-big">
						<div id="jt-seller-slide-fake-dan">
							<div style="width :${fn:length(products) * 170}px;" id="jt-seller-slide-content-dan">
							<c:forEach items="${products }" var="product" varStatus="loop">
								<div class="jt-home-expand-shop-expandProduct" id="jt-product-${productSize - loop.index }">
									<img alt="상품" src="<c:url value="/resources/uploadImage/${product.saveName }"/>"/>
								</div>
							</c:forEach>
							</div>
						</div>
					</li>
					<li class="jt-home-expand-shop-rigthArrow jt-home-expand-shop-arrow">
						<a href="#none" id="jt-home-expand-shop-rigthArrow">&gt;</a>
					</li>
				</ul>
				<div class="jt-home-expand-shop-products">
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
					<c:if test="${jtownUser.bannerFirst < 8 }">
						<div class="jt-home-expand-shop-event-new">
							<div>
								<span class="jt-home-expand-shop-event-new-image">NEW</span>
							</div>
						</div>
					</c:if>
					<c:url value="/resources/uploadImage/${event1.saveName eq null ? 'event-1.png' : event1.saveName}" var="image"/>
					<img alt="event1" src="${image }" title="<c:out value="${jtownUser.name }"/> Event" id="jt-seller-expand-event-first-img"/>
				</div>
				<div class="jt-home-expand-shop-event" id="jt-seller-expand-event-second" data-epn="<c:out value="${event2.pn }"/>" data-bo="2">
					<c:if test="${jtownUser.bannerSecond < 8 }">
					<div class="jt-home-expand-shop-event-new">
						<div>
							<span class="jt-home-expand-shop-event-new-image">NEW</span>
						</div>
					</div>
					</c:if>
					<c:url value="/resources/uploadImage/${event2.saveName eq null ? 'event-2.png' : event2.saveName}" var="image"/>
					<img alt="event2" src="${image }" title="<c:out value="${jtownUser.name }"/> Event" id="jt-seller-expand-event-second-img"/>
				</div>
				<div class="jt-home-expand-shop-content-wrpa">
					<ul class="jt-home-expand-shop-content-fn">
						<li class="jt-home-expand-shop-content-view-wrap">
							<span class="jt-home-expand-shop-content-view">Look</span>&nbsp;<span id="view-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/></span>
						</li>
						<li class="jt-home-expand-shop-content-comment-wrap">
							<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;&nbsp;<span id="comment-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
							<div class="jt-home-expand-shop-border-hide"></div>
						</li>
						<li class="jt-home-expand-shop-content-love-wrap">
							<c:set var="loveClick" value="${jtownUser.customerPn ne null ? 'jt-home-shop-love-click' : '' }"/>
							<c:set var="loveTextClick" value="${jtownUser.customerPn ne null ? 'jt-home-shop-love-text-click' : '' }"/>
							<a href="#none" onclick="jtown.home.clickLove('<c:out value="${jtownUser.pn }"/>');" id="love-image-<c:out value="${jtownUser.pn }"/>" class="jt-home-expand-shop-content-love ${loveClick }">♥</a>&nbsp;<span id="love-<c:out value="${jtownUser.pn }"/>" class="${loveTextClick}"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
							<c:if test="${jtownUser.loveHotCount ne null and jtownUser.loveHotCount ne 0}">
								<span class="jt-home-shop-love-hot">HOT</span>
							</c:if>
						</li>
					</ul>
					<div class="jt-home-expand-shop-comment-wrap">
						<ul class="jt-home-expand-shop-comment">
							<c:forEach items="${null }" var="comment">
								<li data-copn="<c:out value="${comment.commentPn }"/>" class="jt-home-expand-shop-comment-li">
									<ul class="jt-home-expand-shop-text-wrap">
										<li class="jt-home-expand-shop-comment-header">
											<span class="jt-home-expand-shop-comment-best">BEST</span>
										</li>
										<li class="jt-home-expand-shop-comment-content">
											<span class="jt-home-expand-shop-comment-name"><c:out value="${comment.customerName }"/></span>
											<span class="jt-home-expand-shop-comment-text"><c:out value="${comment.comment }"/></span>
										</li>
										<li class="copnLoveIt-<c:out value="${comment.commentPn }"/> jt-home-expand-shop-comment-footer">
											<span class="jt-home-expand-shop-comment-progress-date">${comment.inputDate}</span>
											<a href="#none" class="jt-home-expand-shop-comment-loveIt">LOVE</a>
											<span class="jt-home-expand-shop-comment-loveIt-count"><c:out value="${comment.commentLoveCount eq null ? '' : comment.commentLoveCount }"/></span>
										</li>
									</ul>
									<c:choose>
										<c:when test="${comment.customerPn eq jtownUser.pn }">
											<div class="jt-home-expand-shop-update-wrap">
												<input type="text" class="jt-comment-update-input" value="'+htmlChars(comment.comment)+'"/><br/>
												<span>esc를 누르시면 수정이 취소 됩니다.</span>
											</div>
											<div class="jt-home-expand-shop-tool-wrap">
												<a href="#none" class="jt-comment-update jt-btn-white-small">
													<span class="btnImage"></span>
												</a>
												<a href="#none" class="jt-comment-delete jt-btn-white-small">
													<span class="btnImage"></span>
												</a>
											</div>
										</c:when>
										<c:otherwise>
											<div class="jt-home-expand-shop-tool-wrap">
												<a href="#none" class="jt-comment-delete jt-btn-white-small">
													<span class="btnImage"></span>
												</a>
											</div>
										</c:otherwise>
									</c:choose>
								</li>
							</c:forEach>
							<c:set var="pagination" value="${commentFilter.pagination }"/>
							<c:if test="${fn:length(comments) > 0 }">
							<c:choose>
								<c:when test="${fn:length(comments) > 0 }">
									<li class="jt-home-expand-shop-comment-add">
										<a href="#none" class="jt-btn-silver" data-spn="${jtownUser.pn }"  id="comment-add-btn-best">베스트 리플보기</a>
									</li>
									<li class="jt-home-expand-shop-comment-add" style="display: none;">
								</c:when>
								<c:otherwise>
									<li class="jt-home-expand-shop-comment-add">									
								</c:otherwise>
							</c:choose>
								<a href="#none" class="jt-btn-silver" id="comment-add-btn" 
									data-spn="${jtownUser.pn }" 
									data-page="0" 
									data-ni="<c:out value='${pagination.numItems }'/>"
									data-nipp="<c:out value='${pagination.numItemsPerPage }'/>">
									댓글 더 보기 <span id="comment-now-count"><c:out value="${pagination.numItemsPerPage * 0 }"/></span>/<c:out value="${pagination.numItems}"/>
								</a>
							</li>
							</c:if>
						</ul>
						<div class="jt-home-expand-shop-comment-insert">
							<sec:authorize access="hasRole('ROLE_USER')">
								<sec:authentication property="principal.groupName" var="groupName"/>
							</sec:authorize>
							<c:choose>
								<c:when test="${groupName eq null || groupName eq '' }">
									<input type="text" id="jt-comment-insert" readonly="readonly" placeholder="로그인한 사용자만 사용할 수 있습니다."/>
								</c:when>
								<c:otherwise>
									<c:choose>
										<c:when test="${groupName eq 'Customer' }">
											<input type="text" id="jt-comment-insert" placeholder="이 쇼핑몰에 대한 한마디를 남겨주세요." maxlength="100"/>
										</c:when>
										<c:otherwise>
											<input type="text" id="jt-comment-insert" readonly="readonly" placeholder="판매자 아이디로는 이용하실 수 없습니다."/>
										</c:otherwise>
									</c:choose>
								</c:otherwise>
							</c:choose>
						</div>
					</div>
				</div>
			</div>
		</section>
	</section>
</article>
<%@ include file="../layout/home_footer.jspf" %>