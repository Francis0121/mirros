<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home-header.jspf" %>
<header class="mm-header">
	<div>
		<a href="${cp }">Mirros</a>
	</div>
</header>
<nav class="mm-home-nav">
	<ul>
		<li>
			<a class="mm-home-nav-title"><span>Menu</span></a>
			<ul class="mm-home-sub-nav">
				<li class="mm-home-sub-nav-title">
					<span>Account</span>
				</li>
				<li>
					<a><span>Log In</span></a>
				</li>
				<li>
					<a><span>Sign Up</span></a>
				</li>
				<li class="mm-home-sub-nav-title">
					<span>Help</span>
				</li>
				<li>
					<a><span>Business</span></a>
				</li>
				<li>
					<a><span>About US</span></a>
				</li>
				<li>
					<a><span>Notice</span></a>
				</li>
				<li>
					<a><span>FAQ</span></a>
				</li>
			</ul>
		</li>
		<li>
			<a class="mm-home-nav-title"><span>Search</span></a>
			<ul class="mm-home-sub-nav mm-home-search">
				<li>
					<input type="text" class="mm-home-search-input"  placeholder="어떤 쇼핑몰을 찾으시나요?"/>
				</li>
			</ul>
		</li>
		<c:set var="homeFilterUrl" value="${cp }/cpn/${homeFilter.categoryPn }/spn/0" scope="request"/>
		<c:forEach var="interestCategory" items="${interestCategories }">
			<c:set var="interestCategoryPn" value="${interestCategory.categoryPn }"/>
			<c:set var="interestSections" value="${interestMap[interestCategoryPn] }"/>
			<li>
				<c:set var="interestUrl" value="${cp }/cpn/${interestCategoryPn }/spn/0"/>
				<a class="mm-home-nav-title" style="${interestUrl eq homeFilterUrl ? '' : ''}">
					<span><c:out value="${interestCategory.name }"/></span>
				</a>
				<ul class="mm-home-sub-nav">
					<c:set var="homeFilterUrl" value="${cp }/cpn/${homeFilter.categoryPn }/spn/${homeFilter.sectionPn eq null ? 0 : homeFilter.sectionPn}" scope="request"/>
					<li>
						<a href="${interestUrl }" style="${interestUrl eq homeFilterUrl ? '' : ''}"><span>ALL</span></a>
					</li>
					<c:forEach var="interestSection" items="${interestSections }">
						<c:set var="interestSectionPn" value="${interestSection.sectionPn }"/>
						<c:set var="interestUrl" value="${cp }/cpn/${interestCategoryPn }/spn/${interestSectionPn }"/>
						<li>
							<a href="${interestUrl }" style="${interestUrl eq homeFilterUrl ? '' : ''}"><span><c:out value="${interestSection.name }"/></span></a>
						</li>
					</c:forEach>
				</ul>
			</li>
		</c:forEach>
	</ul>
</nav>
<section class="mm-home-section">
	<header>
		<h1>Let’s see your shop :</h1>
	</header>
<c:forEach begin="1" end="2" varStatus="i">
	<c:set var="jtownUsers" value="${ i.count eq 1 ? one.jtownUsers : two.jtownUsers }"/>
	<c:set var="images" value="${ i.count eq 1 ? one.images : two.images }"/>
	
	<c:forEach items="${jtownUsers }" var="seller">
		<c:set value="${seller.pn }" var="spn"/>
		<c:set value="${images[spn] }" var="mainImages"/>
		<article class="mm-home-article" data-spn="<c:out value="${spn }"/>">
			<header class="mm-home-article-header">
				<a href="http://<c:out value="${seller.shopUrl }"/>" target="_blank"><c:out value="${seller.name }"/></a>
			</header>
			<article>
				<ul class="mm-home-mainImage">
					<li>
						<c:choose>
							<c:when test="${fn:length(mainImages) eq 0 }">
								<img alt="Main Image Blank" src="${cp }/resources/images/jt-introduce-home-blank.png" title="${jtownUser.name}"/>	
							</c:when>
							<c:otherwise>	
								<c:forEach items="${mainImages }" var="mainImage">
									<img alt="Main Image" src="${web }/resources/uploadImage/${mainImage}" title="${jtownUser.name}"/>	
								</c:forEach>
							</c:otherwise>
						</c:choose>
						<div>
							<span id="new-${spn }" style="${seller.bannerDate ne null and seller.bannerDate < 8 ? 'display: block;' : 'display: none;'}">Event</span>
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
			</footer>
		</article>
	</c:forEach>
</c:forEach>
</section>
<footer>

</footer>
<%@ include file="../layout/home-footer.jspf" %>