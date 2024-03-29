<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home_header.jspf" %>
<c:set value="${fn:length(products) }" var="productSize"/>
<article class="jt-url-content-wrap">
	<section class="jt-seller-content">
		<section class="jt-home-main-url">
			<div class="jt-home-main-url-shop-name"><a href="${jtownUser.shopUrl }" target="_blank" title="클릭시 해당 쇼핑몰로 이동됩니다."><c:out value="${jtownUser.name }"/></a></div>
			<ul class="jt-home-main-url-image">
				<li>
					<c:choose>
						<c:when test="${fn:length(mainImages) eq 0 }">
							<img alt="blank" src="${cp }/resources/images/jt-introduce-user-blank.png" title="${jtownUser.name}" />	
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
			</ul>
			<div class="jt-home-main-url-notice">
				<pre class="jt-home-shop-footer-text"><c:out value="${jtownUser.notice }"/></pre>
			</div>
			<section class="jt-home-main-recently-wrap">
				<header>
					<h1>Date</h1>
					<span class="jt-home-main-recently-date"><c:out value="${intervalCount.beforeDate }"/> ~ ${intervalCount.nowDate }</span>
				</header>
				<ul>
					<li>
						<span>Love</span><span><c:out value="${intervalCount.love }"/></span>						
					</li>
					<li>
						<span>View</span><span><c:out value="${intervalCount.view eq null ? 0 : intervalCount.view }"/></span>
					</li>	
					<li>
						<span>Comment</span><span><c:out value="${intervalCount.comment }"/></span>
					</li>
				</ul>
			</section>
			<div id="jt-home-expand-shop-notice" class="gotoPage" title="클릭시 해당 쇼핑몰로 이동됩니다." style="float: none;">
					<span class="jt-home-expand-shop-firstQuotationMark"></span>
					<pre id="jt-seller-expand-shop-text" class="jt-home-expand-shop-text"><c:out value="${jtownUser.longNotice}"/></pre>
					<textarea id="jt-seller-expand-textarea" class="jt-seller-expand-textarea" maxlength="200"><c:out value="${jtownUser.longNotice}"/></textarea>
					<span class="jt-home-expand-shop-lastQuotationMark"></span>
				</div>
		</section>
		<section class="jt-seller-expand">
			<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-name="<c:out value="${jtownUser.name }"/>" data-spn="${jtownUser.pn }" data-size="${productSize }" data-nowPosition="${productSize}" data-url="${jtownUser.shopUrl }">
				
				<div class="jt-home-expand-shop-expandProducts">
				
				<%--
					<c:choose>
						<c:when test="${fn:length(products) > 3 }">
							<button class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow"><span>&lt;</span></button>
						</c:when>
						<c:otherwise>
							<button class="jt-home-expand-shop-arrow"></button>
						</c:otherwise>
					</c:choose>
					<div class="jt-home-expand-shop-fake-dan">
						<ul class="jt-home-expand-shop-expandProduct-slide">
							<c:forEach items="${products }" var="product" varStatus="loop">
								<li class="jt-home-expand-shop-expandProduct" >
									<c:set value="${cp }/photo/thumbnail/${product.saveName }product.${product.imageType }" var="image"/>
									<c:if test="${product.imageCategory eq 0 }">
										<c:set value="${cp }/resources/uploadImage/${product.saveName }" var="image"/>
									</c:if>
									<c:set var="shopUrl" value="${jtownUser.shopUrl }" />
									<a href="${product.url eq null ? shopUrl : product.url}" target="_blank"  onclick="jtown.home.productStatisticClick('${product.pn}');"><img alt="상품" src="${image }"/></a>
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
								</li>
							</c:forEach>
							<c:if test="${fn:length(products) < 3 }">
								<c:forEach begin="${fn:length(products) }" end="2">
								<li class="jt-home-expand-shop-expandProduct">
									<a href="${shopUrl }"><img alt="Empty Product" src="${cp }/resources/images/jt-product-blank.png"></a>
								</li>
								</c:forEach>
							</c:if>
						</ul>
					</div>
					<c:choose>
						<c:when test="${fn:length(products) > 3 }">
							<button class="jt-home-expand-shop-rigthArrow jt-home-expand-shop-arrow"><span>&gt;</span></button>
						</c:when>
						<c:otherwise>
							<button class="jt-home-expand-shop-arrow"></button>
						</c:otherwise>
					</c:choose>
					 --%>
					<div class="jt-home-expand-shop-products">
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
								
								<a href="${product.url eq null ? shopUrl : product.url}" target="_blank">							
									<span class="${loop.index eq 0 ? fn:length(products)-1 : loop.index-1 } image" ><img alt="Product${loop.index }" src="${image }" class="jt-mir-img" /></span>
								</a>
							</div>
						</c:forEach>
						<c:if test="${fn:length(products) < 3 }">
							<c:forEach begin="${fn:length(products) }" end="2">
							<div class="thumbnail">
								<span class="text">&nbsp;</span>
								<a href="${product.url eq null ? shopUrl : product.url}" target="_blank">
									<span class="image" ><img alt="Product" src="${cp }/resources/images/jt-product-thumbnail-blank.png"/></span>
								</a>
							</div>
							</c:forEach>
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
					</div>
				</div>
				<%--
				<div class="jt-home-expand-shop-event gotoPage" id="jt-seller-expand-event-first" title="클릭시 해당 쇼핑몰로 이동됩니다." data-epn="<c:out value="${event1.pn }"/>" data-bo="1">
					<c:if test="${jtownUser.bannerFirst < 3 }">
						<div class="jt-home-expand-shop-event-new">
							<div>
								<span class="jt-home-expand-shop-event-new-image">NEW</span>
							</div>
						</div>
					</c:if>
					<c:set var="blankEvent" value="${cp }/resources/images/jt-event-user-blank.png"/>
					<c:set var="imageEvent" value="${cp }/photo/thumbnail/${event1.saveName }event.${event1.imageType }"/>
					<c:if test="${event1.imageCategory eq 0}">
						<c:set var="imageEvent" value="${cp }/resources/uploadImage/${event1.saveName }"/>
					</c:if>
					<img alt="First Event" src="${event1.saveName eq null ? blankEvent : imageEvent }" id="jt-seller-expand-event-first-img"/>
				</div>
				
				<div class="jt-home-expand-shop-event gotoPage" id="jt-seller-expand-event-second" title="클릭시 해당 쇼핑몰로 이동됩니다." data-epn="<c:out value="${event2.pn }"/>" data-bo="2">
					<c:if test="${jtownUser.bannerSecond < 3 }">
					<div class="jt-home-expand-shop-event-new">
						<div>
							<span class="jt-home-expand-shop-event-new-image">NEW</span>
						</div>
					</div>
					</c:if>
					<c:set var="imageEvent" value="${cp }/photo/thumbnail/${event2.saveName }event.${event2.imageType }"/>
					<c:if test="${event2.imageCategory eq 0}">
						<c:set var="imageEvent" value="${cp }/resources/uploadImage/${event2.saveName }"/>
					</c:if>
					<img alt="Second Event" src="${event2.saveName eq null ? blankEvent : imageEvent }" id="jt-seller-expand-event-second-img"/>
				</div>
				 --%>
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
							<c:set var="loveClick" value="${jtownUser.customerPn ne null ? 'jt-home-shop-love-click' : '' }"/>
							<c:set var="loveTextClick" value="${jtownUser.customerPn ne null ? 'jt-home-shop-love-text-click' : '' }"/>
							<div class="jt-heart-click-expand-wrap">
								<div class="jt-heart-click-background" id="jt-heart-click-<c:out value="${jtownUser.pn }"/>">
									<img alt="heart-background" src="${cp}/resources/images/heart-background.png">
								</div>
								<div class="jt-heart-click">
									<a href="#none" 
										onclick="jtown.home.clickLove('<c:out value="${jtownUser.pn }"/>');" 
										id="love-image-<c:out value="${jtownUser.pn }"/>" 
										class="jt-home-expand-shop-content-love ${loveClick }">♥</a>
								</div>
							</div>
							<div class="jt-home-expand-shop-content-love-text-wrap">
							<span id="love-<c:out value="${jtownUser.pn }"/>" 
								class="${loveTextClick}"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
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
												<input type="text" class="jt-comment-update-input" maxlength="100" value="<c:out value="${comment.comment}"/>"/><br/>
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
									<c:when test="${fn:length(commentTops) > 0 }">
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
											<input type="text" id="jt-comment-insert" placeholder="쇼핑몰에 대한 한마디를 남겨보세요. 상품 배송문의는 해당 쇼핑몰 고객센터로 남겨주세요." maxlength="100"/>
										</c:when>
										<c:otherwise>
											<input id="jt-comment-insert" readonly="readonly" placeholder="판매자 아이디로는 이용하실 수 없습니다."/>
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