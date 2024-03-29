<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home-header.jspf" %>
<header class="mm-header">
	<div>
		<a href="${mcp }/">Mirros</a>
	</div>
</header>
<nav class="mm-home-nav">
	<ul>
		<li>
			<a class="mm-home-nav-title mm-home-menu"><span>Menu</span></a>
			<ul class="mm-home-sub-nav">
				<sec:authorize access="hasRole('ROLE_USER')">
					<li class="mm-home-sub-nav-title">
						<span><sec:authentication property="principal.name" /></span>
					</li>
					<li>
						<a href="${cp }/login/logout"><span>Log out</span></a>
					</li>
					<!-- <li>
						<a href="${cp }/" id="mm-pc-version-btn"><span>PC Version</span></a>
					</li> -->
				</sec:authorize>
				<sec:authorize access="anonymous">
					<li class="mm-home-sub-nav-title">
						<span>Account</span>
					</li>
					<li>
						<a href="${mcp }/login"><span>Log In</span></a>
					</li>
					<li>
						<a href="${mcp }/login/join"><span>Sign In</span></a>
					</li>
					<!-- <li>
						<a href="${cp }/" id="mm-pc-version-btn"><span>PC Version</span></a>
					</li> -->
					<li>
						<a><span>&nbsp;</span></a>
					</li>
				</sec:authorize>
			</ul>
		</li>
		<li>
			<a class="mm-home-nav-title mm-home-search"><span>Search</span></a>
			<ul class="mm-home-sub-nav mm-home-search">
				<li>
					<input type="text" class="mm-home-search-input" id="mm-naturalLanguage-search"  placeholder="어떤 쇼핑몰을 찾으시나요?"/>
				</li>
			</ul>
		</li>
<!-- 
		<li>
			<a class="mm-home-nav-title mm-home-refresh"><span>refresh</span></a>
		</li>
 -->
		<c:set var="homeFilterUrl" value="${mcp }/cpn/${homeFilter.categoryPn eq null ? 0 : homeFilter.categoryPn}/spn/0" scope="request"/>
		<c:set var="interestUrl" value="${mcp }/cpn/0/spn/0"/>
 		<li>
 			<a href="${mcp }/" style="${interestUrl eq homeFilterUrl ? 'font-weight : bold;' : ''}">
 				<span>All</span>
 			</a>
 		</li>
		<c:forEach var="interestCategory" items="${interestCategories }">
			<c:set var="interestCategoryPn" value="${interestCategory.categoryPn }"/>
			<c:set var="interestSections" value="${interestMap[interestCategoryPn] }"/>
			<li>
				<c:set var="interestUrl" value="${mcp }/cpn/${interestCategoryPn }/spn/0"/>
				<a href="${interestUrl }" style="${interestUrl eq homeFilterUrl ? 'font-weight : bold;' : ''}">
					<span><c:out value="${interestCategory.name }"/></span>
				</a>
			</li>
		</c:forEach>
	</ul>
</nav>
<section class="mm-home-section" id="mm-home-container" 
	data-cpn="${homeFilter.categoryPn eq null ? 0 : homeFilter.categoryPn}" 
	data-spn="${homeFilter.sectionPn eq null ? 0 : homeFilter.sectionPn}" 
	data-maxPage="${homeFilter.pagination.numPages eq null ? 0 : homeFilter.pagination.numPages }">
	<header>
		<h1>Let’s see, your shop</h1>
	</header>
<c:forEach begin="1" end="2" varStatus="i">
	<c:set var="jtownUsers" value="${ i.count eq 1 ? one.jtownUsers : two.jtownUsers }"/>
	<c:set var="images" value="${ i.count eq 1 ? one.images : two.images }"/>
	<c:set var="newComments" value="${ i.count eq 1 ? one.newComments : two.newComments }"/>
	
	<c:forEach items="${jtownUsers }" var="seller">
		<c:set value="${seller.pn }" var="spn"/>
		<c:set value="${images[spn] }" var="mainImages"/>
		<c:set value="${newComments[spn] }" var="comments"/>
		<article class="mm-home-article" data-spn="<c:out value="${spn }"/>">
			<header class="mm-home-article-header">
				<a href="<c:out value="${seller.shopUrl }"/>" target="_blank"><c:out value="${seller.name }"/></a>
			</header>
			<article>
				<ul class="mm-home-mainImage">
					<li>
						<c:choose>
							<c:when test="${fn:length(mainImages) eq 0 }">
								<div class="mm-home-mainImage-content"><img alt="Main Image Blank" src="${cp }/resources/images/jt-introduce-home-blank.png" title="${seller.name}"/></div>	
							</c:when>
							<c:otherwise>	
								<c:forEach items="${mainImages }" var="mainImage">
									<c:forEach items="${mainImages }" var="mainImage">
									<c:set var="image" value="${cp }/photo/thumbnail/${mainImage.saveName}represent.${mainImage.type }"/>
										<c:if test="${mainImage.category eq 0 }">
											<c:set value="${cp }/resources/uploadImage/${mainImage.saveName }" var="image"/>
										</c:if>
										<div class="mm-home-mainImage-content"><img alt="Main Image" src="${image}" title="${seller.name}"/></div>
									</c:forEach>
									
								</c:forEach>
							</c:otherwise>
						</c:choose>
						<div class="mm-home-mainImage-event">
							<c:set var="newProductStyle" value="${seller.newProduct > 0 ? 'display: block;' : 'display:none;'}"></c:set>
							<c:set var="newBannerStyle" value="${seller.newBanner ? 'display: block;' : 'display:none;'}"></c:set>
							
							<div id="new-product-<c:out value="${seller.pn }"/>" class="mm-home-article-new-wrap" style="${newProductStyle}">
								<span class="mm-home-article-product-new">New product</span>
							</div>
							
							<div id="new-<c:out value="${seller.pn }"/>"  class="mm-home-article-new-wrap" style="${newBannerStyle}">
								<span class="mm-home-article-event-new">New event</span>														
							</div>
						</div>
					</li>
				</ul>
				<div>
					<div class="mm-home-article-quotationmark-first"><span>"</span></div>
					<pre class="mm-home-article-notice"><c:out value="${seller.notice }"/></pre>
					<div class="mm-home-article-quotationmark-last"><span>"</span></div>
				</div>
			</article>
			<footer>
				<ul>
					<li>
						<div style="width: 35px;">
							<span class="mm-home-view" title="최근 일주일간 방문수">View</span><span class="mm-home-number" id="view-${spn}"><c:out value="${seller.viewCount eq null ? 0 : seller.viewCount}"/></span>
						</div>	
					</li>
					<li>
						<div style="width: 35px;">
							<span class="mm-home-comment">Comment</span><span class="mm-home-number" id="comment-${spn }"><c:out value="${seller.commentCount eq null ? 0 : seller.commentCount}"/></span>
						</div>
					</li>
					<li>
						<c:set var="loveClick" value="${seller.customerPn ne null ? 'mm-home-love-click' : '' }"/>
						<c:set var="loveNumberClick" value="${seller.customerPn ne null ? 'mm-home-love-number-click' : '' }"/>
						<c:set var="loveWidth" value="${seller.loveHotCount ne null and seller.loveHotCount ne 0 ? '66' : '39' }"/>
						<div style="width: ${loveWidth}px;">
							<div class="mm-love-click-wrap">
								<div class="mm-love-click-background">
									<img alt="Love Background" src="${cp}/resources/images/heart-background.png">
								</div>
								<div class="mm-love-click">
									<span class="mm-home-love ${loveClick }" id="love-image-${spn }">Love</span>
								</div>
							</div>
							<div>
								<span class="mm-home-number ${loveNumberClick}" id="love-${spn }"><c:out value="${seller.loveCount eq null ? 0 : seller.loveCount}"/></span>
							</div>
							<c:if test="${seller.loveHotCount ne null and seller.loveHotCount ne 0}">
								<span class="mm-home-hot" title="최근 뜨는 미니샵">HOT</span>
							</c:if>
						</div>
					</li>
				</ul>
				<c:if test="${fn:length(comments) > 0}">
					<div class="mm-home-shop-comments-wrap">
						<c:forEach items="${comments }" var="comment" >
							<div class="mm-home-shop-comments"><c:out value="${comment.comment }"/></div>
						</c:forEach>
					</div>
				</c:if>
			</footer>
		</article>
	</c:forEach>
</c:forEach>
</section>
<footer>

</footer>
<%@ include file="../layout/home-footer.jspf" %>