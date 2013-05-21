<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../layout/none_header.jspf" %>
<c:set value="${fn:length(products) }" var="productSize"/>
<article class="jt-seller-content-wrap">
	<div id="folderBar">
		<div id="folderTabName">
			<span id="digonalFolderImage">My Page</span>
		</div>
	</div>
	<section class="jt-seller-content">
		<section class="jt-seller-main">
			<ul class="jt-seller-text-content">
				<li>
					<h3>Seller</h3>
					<span><c:out value="${jtownUser.name }"/></span>
				</li>
				<li>
					<h3>Site</h3>
					<span><c:out value="${jtownUser.shopUrl}"/></span>
				</li>
				<li>
					<h3>Tag</h3>
					<span>
						<c:forEach items="${interestes }" var="interest" varStatus="loop">
							<c:out value="${interest }"/>
							<c:if test="${loop.count ne fn:length(interestes) }">
								,
							</c:if>
						</c:forEach>
					</span>
				</li>
			</ul>
			<div class="jt-home-shop">
				<header>
					<a href="http://${jtownUser.shopUrl }"target="_blank"><c:out value="${jtownUser.name }"/></a>
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
									<img alt="" src="${image }" title="${jtownUser.name}" id="jt-seller-main-image-area"/>	
								</c:when>
								<c:otherwise>
									<c:forEach items="${mainImages }" var="mainImage" varStatus="loop" >
										<c:url value="/resources/uploadImage/${mainImage }" var="image"/>
										<img alt="" src="${image }" title="${jtownUser.name}" id="jt-seller-main-image-area"/>	
									</c:forEach>
								</c:otherwise>
							</c:choose>
							<div class="jt-home-shop-new-event">
							<c:choose>
								<c:when test="${jtownUser.bannerDate ne null and jtownUser.bannerDate < 8 }">
									<span id="new-<c:out value="${jtownUser.pn }"/>" class="jt-home-shop-event-new-image"  style="display: block;">event</span>
								</c:when>
								<c:otherwise>
									<span id="new-<c:out value="${jtownUser.pn }"/>" class="jt-home-shop-event-new-image" style="display: none;">event</span>
								</c:otherwise>
							</c:choose>
							</div>
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
						<c:if test="${jtownUser.loveHotCount ne null and jtownUser.loveHotCount ne 0}">
							<span class="jt-home-shop-love-hot">HOT</span>
						</c:if>
					</li>
				</ul>
				<!--[if IE 7]>
				<div class="jt-home-shop-image-footer"></div>
				<![endif]-->
				<!--[if IE 8]>
				<div class="jt-home-shop-image-footer"></div>
				<![endif]-->
			</div>
		</section>
		<section class="jt-seller-expand">
			<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-spn="${jtownUser.pn }" data-size="${productSize }" data-nowPosition="${productSize}">
				<div id="jt-home-expand-shop-notice">
					<div class="jt-seller-expand-notice-hover-tool" id="jt-seller-expand-notice-hover-tool">
						<div>
							<a href="#none" id="jt-seller-expand-notice-updateShow" class="jt-seller-expand-notice-updateShow jt-btn-white-small">
								<span class="btnImage"></span>
								<span class="btnText">수정</span>
							</a>
						</div>
					</div>
					<span class="jt-home-expand-shop-firstQuotationMark"></span>
					<pre id="jt-seller-expand-shop-text" class="jt-home-expand-shop-text"><c:out value="${jtownUser.longNotice}"/></pre>
					<textarea id="jt-seller-expand-textarea" class="jt-seller-expand-textarea" maxlength="200"><c:out value="${jtownUser.longNotice}"/></textarea>
					<span class="jt-home-expand-shop-lastQuotationMark"></span>
					<div class="jt-seller-expand-notice-update-tool" id="jt-seller-expand-notice-update-tool">
						<a href="#none" id="jt-seller-expand-notice-update" class="jt-seller-expand-notice-update jt-btn-white-small">
							<span class="btnImage"></span>
							<span class="btnText">수정</span>
						</a>
						<a href="#none" id="jt-seller-expand-notice-cancle" class="jt-seller-expand-notice-cancle jt-btn-white-small">
							<span class="btnImage"></span>
							<span class="btnText">취소</span>
						</a>
					</div>
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
						<c:if test="${productSize < 10}">
						<li id="jt-seller-product-insert-wrap">
							<input type="file" id="jt-product-file" name="jt-product-file"/>
						</li>
						</c:if>
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
					<div class="jt-home-expand-shop-event-tool">
						<a href="#none" class="jt-home-expand-shop-event-update-btn jt-btn-white-small">
							<span class="btnImage"></span>
							<span class="btnText">수정</span>
						</a>
					</div>
					<div class="jt-home-expand-shop-event-update-wrap">
<!-- 						<span style="color: #fff;">310 X 150 (pixel)</span><br/> -->
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
					<div class="jt-home-expand-shop-event-tool">
						<a href="#none" class="jt-home-expand-shop-event-update-btn jt-btn-white-small">
							<span class="btnImage"></span>
							<span class="btnText">수정</span>
						</a>
					</div>
					<div class="jt-home-expand-shop-event-update-wrap">
<!-- 						<span style="color: #fff;">310 X 150 (pixel)</span><br/> -->
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
					<img alt="event2" src="${image }" title="<c:out value="${jtownUser.name }"/> Event" id="jt-seller-expand-event-second-img"/>
				</div>
				<div class="jt-home-expand-shop-content-wrpa">
					<ul class="jt-home-expand-shop-content-fn">
						<li class="jt-home-expand-shop-content-view-wrap">
							<span class="jt-home-expand-shop-content-view">Look</span>&nbsp;<span id="view-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/></span>
						</li>
						<li class="jt-home-expand-shop-content-comment-wrap">
							<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;<span id="comment-expand-<c:out value="${jtownUser.pn }"/>" class="jt-home-expand-shop-content-comment-text"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
							<div class="jt-home-expand-shop-border-hide"></div>
						</li>
						<li class="jt-home-expand-shop-content-love-wrap">
							<span class="jt-home-expand-shop-content-love">Love</span>&nbsp;<span id="love-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
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
							<c:if test="${pagination.numItems ne 0 }">
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
							<input type="text" id="jt-comment-insert" readonly="readonly" placeholder="판매자 아이디로는 이용하실 수 없습니다." maxlength="100"/>
						</div>
					</div>
				</div>
			</div>
		</section>
	</section>
</article>
<%@ include file="../layout/none_footer.jspf" %>