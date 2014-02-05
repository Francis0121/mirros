<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home_header.jspf" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<sec:authorize ifAnyGranted="ROLE_ANONYMOUS">
	<div class="jt-right-sidebar-cover"> </div>
</sec:authorize>
<div class="jt-right-sidebar">
	<div class="jt-right-sidebar-upper">Mirros News</div>
	<div class="jt-right-sidebar-comment-feed">
		<c:forEach items="${commentFeed}" var="feedList">
			<div class="jt-sidebar-comment-item" data-productPn="${feedList.productPn}" data-url="${feedList.url }">
				<span class="jt-sidebar-comment-item-product">${feedList.productName }</span>
				<span class="jt-sidebar-comment-item-comment"> ${feedList.comment}</span>
				<div class="jt-right-sidebar-comment-feed-dialog" role="dialog">
					<span class="jt-right-sidebar-comment-feed-dialog-arrow"> </span>
					<div class="jt-right-sidebar-comment-feed-dialog-contents">
						<c:if test="${feedList.contentType == '-1'}">
							<div class="jt-right-sidebar-comment-feed-dialog-contents-img">
								<div class="jt-tab-event-wrap"><div class="jt-tab-event"></div></div>
								<div class="jt-right-sidebar-comment-feed-dialog-contents-event">${feedList.productName }</div>
							</div>
							<div class="jt-right-sidebar-comment-feed-dialog-contents-text">
								<div class="jt-pg-event-line-shop-name jt-right-sidebar-comment-feed-dialog-contents-event-text">${feedList.saveName }</div>
								<c:if test="${feedList.price >= 0}">
									<div class="jt-pg-event-line-end-date jt-right-sidebar-comment-feed-dialog-contents-event-text">D- ${feedList.price }일 남았습니다.</div>
								</c:if>
								<c:if test="${feedList.price < 0}">
									<div class="jt-pg-event-line-end-date jt-right-sidebar-comment-feed-dialog-contents-event-text">이벤트 기간이 만료되었습니다.</div>
								</c:if>
							</div>
						</c:if>
						<c:if test="${feedList.contentType != '-1'}">
							<div class="jt-right-sidebar-comment-feed-dialog-contents-img">
								<c:if test="${empty feedList.contentType}">
									<img src="${cp}/resources/uploadImage/${feedList.saveName }" alt="${feedList.productName }" />
								</c:if>
								<c:if test="${!empty feedList.contentType}">
									<img src="${cp}/photo/thumbnail/${feedList.saveName }product.${feedList.contentType}" alt="${feedList.productName }" />
								</c:if>
							</div>
							<div class="jt-right-sidebar-comment-feed-dialog-contents-text jt-right-sidebar-comment-feed-dialog-contents-product-text">
								<div>${feedList.productName }</div>
								<div><fmt:formatNumber value="${feedList.price }" /></div>
							</div>
						</c:if>
					</div>
				</div>
			</div>
		</c:forEach>
	</div>
	<div class="jt-right-sidebar-heart-gather">
		<div class="jt-right-sidebar-heart-gather-title">관심 리스트</div>
		<div class="jt-right-sidebar-heart-gather-wrap">
		<c:forEach items="${myHeartList}" var="myHeartList">
			<c:if test="${myHeartList.price != -1}">
				<div class="jt-sidebar-heart-item" data-url ="${myHeartList.url}" data-productPn="${myHeartList.productPn }" data-eventPn="">
					<div class="jt-sidebar-heart-item-img-wrap">
						<c:if test="${empty myHeartList.contentType}">
							<img src="${cp}/resources/uploadImage/${myHeartList.saveName }" alt="${myHeartList.productName }" />
						</c:if>
						<c:if test="${!empty myHeartList.contentType}">
							<img src="${cp}/photo/thumbnail/${myHeartList.saveName }productSmall.${myHeartList.contentType}" alt="${myHeartList.productName }" />
						</c:if>
					</div>
					<div class="jt-sidebar-heart-item-text-wrap">
						<div>${myHeartList.productName }</div>
						<div><fmt:formatNumber value="${myHeartList.price }" /></div>
					</div>
				</div>
			</c:if>
			<c:if test="${myHeartList.price == -1}">
				<div class="jt-sidebar-heart-item" data-url ="${myHeartList.url}" data-eventPn="${myHeartList.productPn }" data-productPn="">
					<div class="jt-sidebar-heart-item-img-wrap">
						<div class="jt-tab-event-wrap"><div class="jt-tab-event-mini"></div></div>
					</div>
					<div class="jt-sidebar-heart-item-text-wrap">
						<div>${myHeartList.productName }</div>
						<c:if test="${myHeartList.contentType >=0}">
							<div>D - ${myHeartList.contentType } 일 남았습니다.</div>
						</c:if>
						<c:if test="${myHeartList.contentType <0}">
							<div>이벤트 기간이 만료되었습니다.</div>
						</c:if>
					</div>
				</div>
			</c:if>
		</c:forEach>
		</div>
	</div>
	
</div>
<div class="jt-pg-divide-title"><h2 class="headline">Products</h2> <h3>더보기..</h3></div>
<div class="jt-pg-container">
<div class="jt-pg-main js-masonry jt-sr-main" data-item-name="${itemName }">
	
	<c:forEach items="${productGatherList }" var="list" end="12">
	<c:set value="${!empty list.customerPn ? 'jt-home-shop-love-click' : ''}   " var="heartClickShapeClass" />
	<c:set value="${!empty list.customerPn ? 'jt-home-shop-love-text-click' : ''}   " var="heartClickTextClass" />
	<c:choose>
		<c:when test="${list.hot ==0}">
			<c:if test="${list.productPn != 0 }">
			<div class="jt-pg-item jt-pg-small-product" data-url="${list.url }" data-product-pn="${list.productPn }" data-event-pn="${list.eventPn }">
			
					<div class="jt-pg-product-line">
						<div class="jt-pg-item-wrap">
							<div class="jt-pg-item-heart-wrap">
								<span class="jt-home-shop-love jt-pg-heart-shape ${heartClickShapeClass }" id="jt-pg-heart-click-${list.productPn}">heart</span>
							</div>
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
							<div class="jt-pg-product-name-wrap">
								<div class="jt-pg-product-name" >
									<div>${list.productName }</div>
									<div><fmt:formatNumber value="${list.price }" /></div>
								</div>
								<div class="jt-pg-heart-wrap">
									<div class="jt-pg-heart-shape">
										<span class="jt-home-shop-love jt-pg-heart-shape " id="jt-pg-heart-click-${list.productPn}">heart</span>
									</div>
									<div class="jt-pg-heart-count ${heartClickTextClass}" id="jt-pg-heart-count-${list.productPn }">	${list.heartCount }</div>
								</div>
							</div>
						</div>
						
						<div class="jt-pg-comment-wrap">
							<div><span class="jt-pg-comment-icon"> </span> <input type="text" class="jt-pg-comment-input" placeholder="Write your secret comment"  maxlength="20"/></div>
							<div class="jt-pg-comment-line-wrap">
								<c:forEach items="${list.comments}" var="commentList" varStatus="idx">
									<c:if test="${idx.count >3}">
										<c:set var="enable" value="jt-pg-comment-more-enable"  />
									</c:if>
									<c:if test="${idx.count <=3}">
										<div>
											<div class="jt-pg-comment-line-text">${commentList.comment }</div>
											<div class="jt-pg-comment-line-date" data-cmPn="${commentList.commentPn }">
												<span>${commentList.inputDate}</span>
												<span class="jt-pg-comment-line-warn">신고</span> |
												<span class="jt-pg-comment-line-delete">삭제</span> 
											</div>
										</div>
									</c:if>
								</c:forEach>
							</div>
							<div class="jt-pg-comment-more <c:out value="${enable}"/>">▼</div>
							<c:set var="enable" value=""  />
						</div>
						
					</div>
			
			</div>
			</c:if>	
			
		</c:when>
		<c:otherwise>
			<div class="jt-pg-item jt-pg-large-product" data-url="${list.url }" data-product-pn="${list.productPn }" >
				<div class="jt-pg-product-line">
					<div class="jt-pg-item-wrap">
						<div class="jt-pg-item-heart-wrap">
							<span class="jt-home-shop-love jt-pg-heart-shape ${heartClickShapeClass }" id="jt-pg-heart-click-${list.productPn}">heart</span>
						</div>
						<div class="jt-pg-product-line-hot"><div class="jt-tab-hot"></div></div>
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
						<div class="jt-pg-product-name-wrap">
							<div class="jt-pg-product-name">
								<div>${list.productName }</div>
								<div><fmt:formatNumber value="${list.price }" /></div>
							</div>
							<div class="jt-pg-heart-wrap">
								<div class="jt-pg-heart-shape">	
									<span class="jt-home-shop-love jt-pg-heart-shape " id="jt-pg-heart-click-${list.productPn}">heart</span>
								</div>
								<div class="jt-pg-heart-count ${heartClickTextClass}" id="jt-pg-heart-count-${list.productPn }">${list.heartCount }</div>
							</div>
						</div>
					</div>
					
					<div class="jt-pg-comment-wrap">
							<div><span class="jt-pg-comment-icon"> </span> <input type="text" class="jt-pg-comment-input" placeholder="Write your secret comment"  maxlength="20"/></div>
							<div class="jt-pg-comment-line-wrap">
								<c:forEach items="${list.comments}" var="commentList" varStatus="idx">
									<c:if test="${idx.count >3}">
										<c:set var="enable" value="jt-pg-comment-more-enable"  />
									</c:if>
									<c:if test="${idx.count <=3}">
										<div>
											<div class="jt-pg-comment-line-text">${commentList.comment }</div>
											<div class="jt-pg-comment-line-date" data-cmPn="${commentList.commentPn }">
												<span>${commentList.inputDate}</span>
												<span class="jt-pg-comment-line-warn">신고</span> |
												<span class="jt-pg-comment-line-delete">삭제</span>
											</div>
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
<div class="jt-pg-divide-title"><h2 class="headline">Shops</h2><h3>더보기..</h3></div>

<div id="jt-home-container" class="jt-rs-shop"
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
								<c:set var="newBannerStyle" value="${!empty seller.eventName && seller.endDate >= 0 ? 'display: block;' : 'display:none;'}"></c:set>
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
				<c:if test="${!empty seller.eventName && seller.endDate >= 0  }">
					<div class="jt-home-shop-event-dday">
							<div class="jt-home-shop-event-dday-event-name">
								${seller.eventName }
							</div>
							<div class="jt-home-shop-event-dday-end-date">
								${seller.endDate }일 남음
							</div>
					</div>
				</c:if>
				<div class="jt-home-notice">
					<pre class="jt-home-shop-footer-text"><c:out value="${seller.notice }"/></pre>
				</div>
				<c:if test="${fn:length(comments) > 0}">
				<div class="jt-home-shop-comments-wrap">
					<div class="jt-home-shop-comments-bar"><img src="${cp }/resources/images/jt-comment.png"></div>
					<c:forEach items="${comments }" var="comment" >
					<div class="jt-home-shop-comments" data-isSplit="${comment.isSplit }" data-copn="${comment.commentPn }">
						<c:out value="${comment.splitHome }"/>
					</div>
					</c:forEach>
				</div>
				</c:if>
				<ul class="jt-home-shop-content-fn">
					<li>
						<span class="jt-home-shop-view" title="최근 일주일간 방문수" >VIEW</span>&nbsp;<span id="view-<c:out value="${spn }"/>"><c:out value="${seller.viewCount eq null ? 0 : seller.viewCount}"/></span>	
					</li>
					<li class="jt-home-shop-comment-wrap">
						<span class="jt-home-shop-comment">COMMENT</span>&nbsp;<span id="comment-<c:out value="${spn }"/>"><c:out value="${seller.commentCount eq null ? 0 : seller.commentCount}"/></span>
					</li>
					<li class="jt-home-heart-click-wrap" onclick="jtown.home.clickLove('<c:out value="${spn }"/>');" >
						<c:set var="loveClick" value="${seller.customerPn ne null ? 'jt-home-shop-love-click' : '' }"/>
						<c:set var="loveTextClick" value="${seller.customerPn ne null ? 'jt-home-shop-love-text-click' : '' }"/>
						<div class="jt-heart-click-wrap">
							<div class="jt-heart-click-background" id="jt-heart-click-<c:out value="${spn }"/>">
								<img alt="heart-background" src="${cp}/resources/images/heart-background.png">
							</div>
							<div class="jt-heart-click">
								<a 	href="#none" 
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

<div id="infscr-loading" style="display:none;">
	<center>
		<img alt="Loading..." src="${cp}/resources/images/jt-loading-big.gif" />
	</center>
	Loading...
</div>
</div>
<%@ include file="../layout/home_footer.jspf" %>