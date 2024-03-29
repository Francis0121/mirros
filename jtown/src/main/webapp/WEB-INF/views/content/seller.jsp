<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/none_header.jspf" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set value="${fn:length(products) }" var="productSize"/>
<article class="jt-seller-content-wrap" id="jt-seller-body" data-spn="<sec:authentication property="principal.pn" />">
	<div id="folderBar">
	</div>
	<section class="jt-seller-content">
		<section class="jt-seller-main">
			
			<div class="jt-home-shop">
				<header>
					<a href="${jtownUser.shopUrl }" target="_blank"><c:out value="${jtownUser.name }"/></a>
				</header>
				<div class="jt-home-shop-content" id="step3">
					<ul class="jt-home-shop-content-image" id="jt-seller-main-image">
						<li class="question-mark-wrap">
							<a class="question-mark" data-step="1">?</a>
						</li>
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
									<img alt="blank" src="${cp }/resources/images/jt-introduce-blank.png" title="${jtownUser.name}" id="jt-seller-main-image-area"/>	
								</c:when>
								<c:otherwise>
									<c:forEach items="${mainImages }" var="mainImage" varStatus="loop" >
										<c:set var="image" value="${cp }/photo/thumbnail/${mainImage.saveName}represent.${mainImage.type }"/>
										<c:if test="${mainImage.category eq 0 }">
											<c:set value="${cp }/resources/uploadImage/${mainImage.saveName }" var="image"/>
										</c:if>
										<img alt="" src="${image }" title="${jtownUser.name}" id="jt-seller-main-image-area"/>	
									</c:forEach>
								</c:otherwise>
							</c:choose>
							<div class="jt-home-shop-new-event">
								<c:set var="newBannerStyle" value="${jtownUser.newBanner ? 'display: block;' : 'display:none;'}"></c:set>
								<c:set var="newProductStyle" value="${jtownUser.newProduct > 0 ? 'display: block;' : 'display:none;'}"></c:set>
								
								<div id="new-product-<c:out value="${jtownUser.pn }"/>" class="jt-home-shop-new-event-div" style="${newProductStyle}">
									<span class="jt-home-shop-product-new-image">New product</span>
								</div>
								
								<div id="new-<c:out value="${jtownUser.pn }"/>" class="jt-home-shop-new-event-div" style="${newBannerStyle}">
									<span class="jt-home-shop-event-new-image">New event</span>														
								</div>
							</div>
						</li>
						<li id="jt-seller-main-image-update-tool" class="jt-seller-main-image-update-tool">
							<input type="file" id="jt-represent-image" name="jt-represent-image"/>
							<br/>
							<a href="#none" id="jt-seller-main-image-update" class="jt-btn-white-small">
								<span class="btnImage"></span>
								<span class="btnText">완료</span>
							</a>
							<a href="#none" id="jt-seller-main-image-cancle" class="jt-btn-white-small">
								<span class="btnImage"></span>
								<span class="btnText">취소</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="jt-home-shop-event-dday-wrap">
				<c:if test="${!empty jtownUser.eventName && jtownUser.endDate >= 0  }">
				<div class="jt-home-shop-event-dday">
					<div class="jt-home-shop-event-dday-event-name">
						${jtownUser.eventName }
					</div>
					<div class="jt-home-shop-event-dday-end-date">
						${jtownUser.endDate }일 남음
					</div>
				</div>
				</c:if>
				</div>
				<div id="jt-seller-main-footer" class="jt-home-notice">
					<div class="question-mark-wrap" style="width: 316px;">
						<a class="question-mark" data-step="2">?</a>
					</div>
					<div class="jt-seller-main-notice-hover-tool" id="jt-seller-main-notice-hover-tool">
						<div>
							<a href="#none" id="jt-seller-main-notice-updateShow" class="jt-seller-main-notice-updateShow jt-btn-white-small">
								<span class="btnImage"></span>
								<span class="btnText">수정</span>
							</a>
						</div>
					</div>
					<c:set var="mainTextIsNull" value="${( jtownUser.notice ne null ) and ( jtownUser.notice ne '')}" />
					<pre id="jt-seller-main-footer-text" class="jt-home-shop-footer-text ${ !mainTextIsNull ? 'jt-home-shop-footer-text-isNull' : '' }" data-isNull="${ !mainTextIsNull }"><c:choose><c:when test="${mainTextIsNull}"><c:out value="${jtownUser.notice }"/></c:when><c:otherwise>쇼핑몰 소개 공간입니다. 쇼핑몰의 특징이나 최근 진행하는 이벤트를 적어보세요.</c:otherwise></c:choose></pre>				
					<textarea id="jt-seller-main-textarea" class="jt-seller-main-textarea" maxlength="80" placeholder="쇼핑몰 소개 공간입니다. 쇼핑몰의 특징이나 최근 진행하는 이벤트를 적어보세요."><c:out value="${jtownUser.notice }"/></textarea>
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
				<ul class="jt-home-shop-content-fn" id="step5">
					<li class="question-mark-wrap" style="width: 316px;">
						<a class="question-mark" data-step="3">?</a>
					</li>
					<li>
						<span class="jt-home-shop-view" title="최근 일주일간 방문수">VIEW</span>&nbsp;<span id="view-<c:out value="${jtownUser.pn}"/>"><c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/></span>	
					</li>
					<li>
						<span class="jt-home-shop-comment">COMMENT</span>&nbsp;<span id="comment-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
					</li>
					<li>
						<div class="jt-heart-click-wrap">
							<div class="jt-heart-click-background" id="jt-heart-click-<c:out value="${spn }"/>">
								<img alt="heart-background" src="${cp}/resources/images/heart-background.png">
							</div>
							<div class="jt-heart-click">
								<span class="jt-home-shop-love jt-home-shop-love-click">♥</span>
							</div>
						</div>
						<div class="jt-home-shop-content-love-text-wrap">
							<span id="love-<c:out value="${jtownUser.pn}"/>" class="jt-home-shop-love-text-click"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
							<c:if test="${jtownUser.loveHotCount ne null and jtownUser.loveHotCount ne 0}">
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
			
			
			
			<div class="jt-seller-text-contnet-wrap">
				<ul class="jt-seller-text-content" id="step1">
					<li class="question-mark-wrap" style="margin-left: 11px;">
						<a class="question-mark" data-step="4">?</a>
					</li>
					<li>
						<h3>ShopNo</h3>
						<span><c:out value="${jtownUser.sixShopPn }"/></span>
					</li>
					<li>
						<h3>Seller</h3>
						<span><c:out value="${jtownUser.name }"/></span>
					</li>
					<li>
						<h3>Site</h3>
						<span><c:out value="${jtownUser.shopUrl}"/></span>
					</li>
					
				</ul>
				<ul class="jt-seller-tag" id="step2">
					<%--
					<li class="question-mark-wrap" style="margin-left: 11px;">
						<a class="question-mark" data-step="5">?</a>
					</li>
					<li>
						<h3>Tag</h3>
						<div id="jt-seller-tag-content">
							<c:forEach items="${interestes }" var="interest" varStatus="loop">
								<span><c:out value="${interest.name }"/><c:if test="${loop.count ne fn:length(interestes) }">, </c:if></span>
							</c:forEach>
							<div id="jt-tag-update-show-btn" title="수정" >수정</div>
						</div>
					</li>
					 --%>
					<li id="jt-tag-checkBox">
						<div id="jt-tag-checkBox-section">
							<div id="jt-tag-checkBox-header">
								<span id="jt-checkBox-header-icon"></span><span id="jt-checkBox-header-text">최대 5개 까지 입력 가능합니다.</span>
							</div>
							<ul>		
							</ul>
							<div id="jt-tag-checkBox-footer">
								<a href="#none" class="jt-btn-white-small" id="jt-tag-update-btn">
									<span class="btnImage"></span>
									<span class="btnText">수정</span>
								</a>
								<a href="#none" class="jt-btn-white-small" id="jt-tag-cancle-btn">
									<span class="btnImage"></span>
									<span class="btnText">취소</span>
								</a>
							</div>
						</div>
					</li>
				</ul>
			</div>
			
			<div id="jt-home-expand-shop-notice">
					<div class="question-mark-wrap" style="width: 320px;">
						<a class="question-mark" data-step="5">?</a>
					</div>
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
			<div class="jt-seller-product-tip">
				<ul>
					<li>Tip 1 : 인기 상품은 최대 1주일까지 HOT에 올라갑니다. 매력적인 상품을 올려보세요!</li>
					<li>Tip 2 : 하루에 올릴 수 있는 상품은 최대 12개 까지입니다.</li>
				</ul>
				
				<div class="jt-showHowWrap">
				<a href="#none" id="showHow" class="jt-showhow-btn jt-btn-white-small">
					<span><img src="${cp }/resources/images/jt-search.png" style="width:12px;float: left;" /></span>
					<span class="btnText">설명보기</span>
				</a>
			</div>
			</div>
			
		</section>
		<section class="jt-seller-expand">
			<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-name="<c:out value="${jtownUser.name }"/>" data-spn="${jtownUser.pn }" data-size="${productSize }" data-nowPosition="${productSize}" data-url="${jtownUser.shopUrl }">
				
				<div class="jt-home-expand-shop-expandProducts" >
					<div class="jt-home-expand-shop-products" id="step7">
						<div class="question-mark-wrap" style="width: 740px;">
							<a class="question-mark" data-step="6">?</a>
						</div>
						<c:forEach items="${products }" var="product" varStatus="loop">
							<div class="thumbnail">
								<c:choose>
									<c:when test="${product.newProduct }">
										<span class="text">New</span>	
									</c:when>
									<c:otherwise>
										<span class="text">&nbsp;</span>	
									</c:otherwise>
								</c:choose>
								<c:set value="${cp }/photo/thumbnail/${product.saveName }product.${product.imageType }" var="image"/>
								<c:if test="${product.imageCategory eq 0 }">
									<c:set value="${cp }/resources/uploadImage/${product.saveName }" var="image"/>
								</c:if>
								<a href="${product.url eq null ? shopUrl : product.url}" target="_blank" class="image"><img alt="Product" src="${image }"/></a>
								<div class="jt-product-article-object-wrap jt-product-article-object-expand">
										<c:choose>
											<c:when test="${product.name eq null or product.commaPrice eq null }">
												<span>상품 정보가 아직</span>
												<span>입력되지 않았습니다.</span>
											</c:when>
											<c:otherwise>
												<span title="<c:out value="${product.name }"/>"><b><c:out value="${product.name }"/></b></span>
												<span><c:out value="${product.commaPrice }"/></span>
											</c:otherwise>
										</c:choose>
									</div>
							</div>
						</c:forEach>
						<c:if test="${productSize < 10 }">  
							<div class="thumbnail">
								<div style="margin: 65px 0 ;text-align: center; border: 1px solid #fafafa;">
									<img alt="plus" src="${cp}/resources/images/jt-plus-btn.png" style="width:60px">
								</div>
							</div>
						</c:if> 
						<c:forEach items="${eventList }" var="event">
						<div class="jt-seller-event-wrap" data-url="${event.url }">
							<div class="jt-tab-event-wrap"><div class="jt-tab-event-mini"></div></div>
							<c:if test="${event.dDay < 0}">
								<div class="jt-seller-event-end-filter"></div>
								<div class="jt-seller-event-end-filter-text"> 이벤트가 만료되었습니다.</div>
							</c:if>
							<div class="jt-seller-upload-event-name" style="height: 120px;">${event.eventName }</div>
							<div class="jt-seller-upload-event-dday">
								<c:if test="${event.dDay >= 0}">D - ${event.dDay }일 남았습니다.</c:if>
							</div>
						</div>	
						</c:forEach>
						<c:if test="${fn:length(products) < 3 }">
							<c:forEach begin="${fn:length(products) }" end="2">
							<div class="thumbnail">
								<span class="text">&nbsp;</span>
								<span class="image" ><img alt="Product" src="${cp }/resources/images/jt-product-thumbnail-blank.png"/></span>
							</div>
							</c:forEach>
						</c:if>
					</div>
					<div id="jt-seller-product-insert-wrap">
							<button type="button" id="jt-product-popup" data-pn="${jtownUser.pn }" class="jt-btn-white-small jt-product-plus-btn">
								<img alt="plus" src="${cp }/resources/images/jt-plus-btn.png"><div>상품 관리</div>
							</button>
							
							<button type="button" class="jt-btn-white-small jt-product-plus-btn jt-event-popup" data-pn="${jtownUser.pn }">
								<img alt="plus" src="${cp }/resources/images/jt-plus-btn.png"><div>이벤트 관리</div>
							</button>
						</div>
					
				</div>
				<div class="jt-home-expand-shop-content-wrap">
					<ul class="jt-home-expand-shop-content-fn">
						<li class="jt-home-expand-shop-content-view-wrap">
							<span class="jt-home-expand-shop-content-view" title="최근 일주일간 방문수">Look</span>&nbsp;<span id="view-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.viewCount eq null ? 0 : jtownUser.viewCount}"/></span>
						</li>
						<li class="jt-home-expand-shop-content-comment-wrap">
							<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;<span id="comment-expand-<c:out value="${jtownUser.pn }"/>" class="jt-home-expand-shop-content-comment-text"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
							<div class="jt-home-expand-shop-border-hide"></div>
						</li>
						<li class="jt-home-expand-shop-content-love-wrap">
							<div class="jt-heart-click-expand-wrap">
								<div class="jt-heart-click-background" id="jt-heart-click-<c:out value="${jtownUser.pn }"/>">
									<img alt="heart-background" src="${cp}/resources/images/heart-background.png">
								</div>
								<div class="jt-heart-click">
									<span class="jt-home-expand-shop-content-love jt-home-shop-love-click">Love</span>
								</div>
							</div>
							<div class="jt-home-expand-shop-content-love-text-wrap">
								<span id="love-expand-<c:out value="${jtownUser.pn }"/>" class="jt-home-shop-love-text-click"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
								<c:if test="${jtownUser.loveHotCount ne null and jtownUser.loveHotCount ne 0}">
									<span class="jt-home-shop-love-hot" title="최근 뜨는 미니샵">HOT</span>
								</c:if>
							</div>		
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
												<input type="text" class="jt-comment-update-input" value="<c:out value="${comment.comment}"/>" maxlength="100"><br/>
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
							<input type="text" readonly="readonly" placeholder="판매자 아이디로는 이용하실 수 없습니다."/>
						</div>
					</div>
				</div>
			</div>
		</section>
	</section>
</article>
<%@ include file="../layout/none_footer.jspf" %>