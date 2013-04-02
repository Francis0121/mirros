<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<c:set value="${fn:length(products) }" var="productSize"/>
<!DOCTYPE HTML>
<html>
<head>
<title>J TOWN</title>
<%@ include file="../layout/style.jspf"%>
<%@ include file="../layout/header_script.jspf" %>
<style type="text/css">
	.jt-home-shop-content-image{cursor: default;}
</style>
</head>
<body style="background: #f2f2f2;">
	<section class="jt-body">
		<header class="jt-header">
			<div class="jt-header-title jt-one-header-title">
				<div class="jt-header-banner">
					<a href="${cp }/"><h1 class="jt-header-banner-h1">J Town</h1></a>
				</div>
				<ul class="jt-header-login-menu">
					<sec:authorize access="hasRole('ROLE_USER')">
						<li id="jt-mypage">
							<a href="#none" class="jt-common-a-base"><sec:authentication property="principal.name" />&nbsp;<span class="jt-btn-underArrow">▼</span></a>
							<ul class="jt-under-wrap" id="jt-mypage-wrap">
								<li>
									<c:url value="/login/modify" var="modifyUrl"/>
									<a href="${modifyUrl }" class="jt-common-a-base" id="jt-modify">비밀번호 변경</a>
								</li>
								<li>
									<c:url value="/login/logout" var="logoutUrl"/>
									<a href="${logoutUrl }" class="jt-common-a-base" id="jt-logout" data-cpn="${jtownUser.pn }">로그아웃</a>
								</li>	
								<sec:authorize access="hasRole('ROLE_SELLER')">
								<li>
									<c:url value="/seller/${jtownUser.pn}" var="sellerUrl"/>
									<a href="${sellerUrl }" class="jt-common-a-base">판매자 페이지</a>
								</li>	
								</sec:authorize>
								<sec:authorize access="hasRole('ROLE_ADMIN')">
								<li>
									<c:url value="/admin" var="sellerUrl"/>
									<a href="${adminUrl }" class="jt-common-a-base">관리자 페이지</a>
								</li>	
								</sec:authorize>
							</ul>
						</li>
					</sec:authorize>
					<sec:authorize access="anonymous">
						<li>
							<a href="#none" class="jt-common-a-base" id="jt-login-smartPopup">LOG IN</a>
						</li>
						<li>
							<c:url var="join" value="/login/join"/>
							<a href="${join }" class="jt-common-a-base">SIGN UP</a>
						</li>
					</sec:authorize>
					<li id="jt-help">
						<c:url var="help" value="/help/question"/>
						<a href="#none" class="jt-common-a-base">HELP&nbsp;<span class="jt-btn-underArrow">▼</span></a>
						<ul class="jt-help-under-wrap" id="jt-help-wrap">
							<li>
								<c:url var="serviceGuide" value="/help/serviceGuide"/>
								<a href="${serviceGuide }" class="jt-common-a-base">About US</a>
							</li>
							<li>
								<c:url var="notice" value="/help/notice"/>
								<a href="${notice }" class="jt-common-a-base">News</a>
							</li>
							<li>
								<c:url var="question" value="/help/question"/>
								<a href="${question }" class="jt-common-a-base">FAQ</a>
							</li>
							<li>
								<c:url var="partnership" value="/help/partnership"/>
								<a href="${partnership }" class="jt-common-a-base">Business</a>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</header>
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
								<span id="new-<c:out value="${jtownUser.pn }"/>">
								<c:if test="${jtownUser.bannerDate ne null and jtownUser.bannerDate < 8 }">
									new
								</c:if>
								</span>
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
					<div class="jt-home-expand-shop" id="jt-home-expand-shop" data-spn="${jtownUser.pn }" data-size="${productSize }" data-nowPosition="${productSize -1 }">
						<ul class="jt-home-expand-shop-expandProducts">
							<li class="jt-home-expand-shop-leftArrow jt-home-expand-shop-arrow">
								<a href="#none" id="jt-home-expand-shop-leftArrow">&lt;</a>
							</li>
							<li class="jt-home-expand-shop-expandProduct-slide" id="jt-seller-slide-big">
								<c:forEach items="${products }" var="product" varStatus="loop">
									<c:choose>
										<c:when test="${loop.count < 4 }">
											<div class="jt-home-expand-shop-expandProduct" id="jt-product-${productSize - loop.index }">
										</c:when>
										<c:otherwise>
											<div class="jt-home-expand-shop-expandProduct" id="jt-product-${productSize - loop.index }" style="display: none;">
										</c:otherwise>
									</c:choose>
										<c:url value="/resources/uploadImage/${product.saveName }" var="image"/>
										<img alt="상품" src="${image }"/>
									</div>
								</c:forEach>
							</li>
							<li class="jt-home-expand-shop-rigthArrow jt-home-expand-shop-arrow">
								<a href="#none" id="jt-home-expand-shop-rigthArrow">&gt;</a>
							</li>
						</ul>
						<div class="jt-home-expand-shop-products">
							<div class="jt-seller-expand-product-insert-tool">
								<div>
									<a href="#none" class="jt-seller-expand-product-insert-btn jt-btn-white-small">
										<span class="btnImage"></span>
										<span class="btnText">상품입력</span>
									</a>
								</div>
							</div>
							<div class="jt-seller-expand-product-insert-wrap">
								<input type="file" id="jt-product-file" name="jt-product-file"/><br/>
								<a href="#none" class="jt-seller-expand-product-insert-cancle jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">취소</span>
								</a>
							</div>
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
							<div class="jt-home-expand-shop-event-tool">
								<a href="#none" class="jt-home-expand-shop-event-update-btn jt-btn-white-small">
									<span class="btnImage"></span>
									<span class="btnText">수정</span>
								</a>
							</div>
							<div class="jt-home-expand-shop-event-update-wrap">
								<span style="color: #fff;">310 X 150 (pixel)</span><br/>
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
								<span style="color: #fff;">310 X 150 (pixel)</span><br/>
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
									<span class="jt-home-expand-shop-content-comment"></span>&nbsp;Comment&nbsp;&nbsp;<span id="comment-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.commentCount eq null ? 0 : jtownUser.commentCount}"/></span>
									<div class="jt-home-expand-shop-border-hide"></div>
								</li>
								<li class="jt-home-expand-shop-content-love-wrap">
									<span class="jt-home-expand-shop-content-love">Love</span>&nbsp;<span id="love-expand-<c:out value="${jtownUser.pn }"/>"><c:out value="${jtownUser.loveCount eq null ? 0 : jtownUser.loveCount}"/></span>
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
	</section>
	<%@ include file="../layout/login.jspf" %>
	<%@ include file="../layout/script.jspf" %>
	<script type="text/javascript">
		$(function(){
			$('#jt-comment-insert').placeholder();
		});
	</script>
	<c:if test="${error eq 1 }">
		<%--F5, CTRL + N, CTRL + R 시에는 error 메시지 안뜨도록 설정 --%>
		<c:url value="/seller/${jtownUser.pn}" var="sellerUrl"/>
		<script type="text/javascript">
		/* <![CDATA[ */  
		    alert('상품을 3개 이하로 삭제할 수 없습니다.');
		
		    document.onkeydown = checkKeycode;
			
		    function checkKeycode(e) {
				var keycode = 0;
				if (window.event) 
					keycode = window.event.keyCode;
 				else if (e) 
 					keycode = e.which;
				
			    if (keycode == 116) {
			    	keycode= 2;
			        location.href='${sellerUrl}';
			        return false;
			    }else if(e.ctrlKey && (keycode==78 || keycode == 82)){
			    	location.href='${sellerUrl}';
			        return false;
			    }
			}
		/* ]]> */	            
		</script>
	</c:if>
</body>
</html>