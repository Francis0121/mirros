<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<c:set var="rp" value='<%=request.getAttribute("javax.servlet.forward.request_uri")%>'/>
<!DOCTYPE HTML>
<html>
<head>
<title>MIRROS</title>
<%@ include file="../layout/script_head.jspf" %>
<%@ include file="../layout/style.jspf"%>
<style type="text/css">
html{ overflow-y: hidden;}
</style>
</head>
<body data-spn="<sec:authentication property="principal.pn" />" data-reload="${isReload }">
	<section class="jt-product-section">
		<header class="jt-product-header">
			이벤트 올리기
		</header>
		
		<article class="jt-product-article jt-event-article">
			<ul>
				<c:forEach items="${events }" var="event" varStatus="i">
					<li class="jt-event-article-object" 
						data-ppn="${event.eventPn}"
						data-name="<c:out value="${event.eventName }"/>"
						data-url="<c:out value="${event.url }"/>">
						<div class="jt-seller-expand-product-delete-tool">	
							<div>
								<a href="#none" class="jt-seller-event-delete jt-btn-white-small">
									<span class="btnImage"></span>
								</a>
							</div>
						</div>
						<div class="jt-event-article-object-item">
							<span class="jt-home-expand-shop-event-new-image" style="margin: 0;">NEW</span>
							<div class="jt-seller-upload-event-name">${event.eventName }</div>
							<div class="jt-seller-upload-event-dday">D - ${event.dDay }일 남았습니다.</div>
						</div>
					</li>
				</c:forEach>
				<c:forEach begin="${fn:length(events) }" end="1" varStatus="i">
					<li class="jt-event-article-object">
						<div class="jt-seller-expand-product-delete-tool">	
							<div>
								<a href="#none" class="jt-seller-event-delete jt-btn-white-small">
									<span class="btnImage"></span>
								</a>
							</div>
						</div>
						<div class="jt-event-article-object-empty">
							이벤트 비어있음
						</div>
						<div class="jt-product-article-object-wrap jt-product-article-object-photo">
							<span>상품 정보가 아직</span>
							<span>입력되지 않았습니다.</span>
						</div>
					</li>
				</c:forEach>
				<li class="jt-product-article-inputBox jt-event-article-inputBox">
					<c:set var="insert" value="block"/>
					<c:set var="update" value="none"/>
					<c:if test="${dialogOpen eq 1}">
						<c:set var="insert" value="none"/>
						<c:set var="update" value="block"/>
					</c:if>
					<ul class="jt-product-article-insert" style="display: ${insert};">
						<li>
							<button type="button" class="jt-seller-event-insert-btn jt-finish-insert-btn" >
								<img src="${cp }/resources/images/jt-cloth-icon.png" style="float:left; margin: 1px 7px 0 3px"/><span style="float: left;">이벤트 등록</span>
							</button>
						</li>
						<li>
							<button type="button" class="jt-finish-insert-btn" id="jt-product-finish">
								<img alt="입력완료" src="${cp }/resources/images/jt-confirm-icon.png" style="float:left; margin: 1px 7px 0 3px;"/><span style="float:left; ">입력완료</span>
							</button>
						</li>
						<li></li>
						<li>1. 해당 이벤트를 클릭하시면 상세정보 (이름, 기한, 이벤트 URL) 입력이 가능합니다.</li>
						<li>2. 이벤트 삭제는 해당 상품에 마우스를 올릴시 좌측 상단에 뜨는 X 버튼을 클릭하시기 바랍니다.</li>
					</ul>
					<div class="jt-product-article-update" style="display: ${update};">
						<form:form commandName="event" action="${cp }/seller/eventForm.jt" method="delete">
							<form:hidden path="eventPn"/>
							<form:hidden path="sellerPn"/>
							<input type="hidden" id="currentPage" name="currentPage" value="${pagination.currentPage }"/>
							<ul class="jt-product-article-update-input">  
								<li>
									<form:label path="eventName" cssClass="jt-event-label"> 이벤트 이름</form:label>
									<form:input path="eventName" cssClass="jt-product-input" cssErrorClass="jt-product-input-error" maxlength="30" placeholder="ex) 7월 상품 1+1 행사 시작"/>
								</li>
								 <li>
									<form:label path="endDate" cssClass="jt-event-label">이벤트 종료일</form:label>
									<form:input path="endDate" cssClass="jt-product-input jt-event-endDate-input"  placeholder="ex) 2012-01-01" readonly="true"  />
								</li>
								<li>
									<form:label path="url" cssClass="jt-event-label">이벤트 URL</form:label>
									<form:input path="url" cssClass="jt-product-input" cssErrorClass="jt-product-input-error" maxlength="200" placeholder="ex) http://www.myshop.net/shoes"/>
								</li>
								<li style="width: 260px; margin: 0;">
									<div class="jt-product-error">
										<form:errors path="*" cssClass="jt-product-error-text"/>
									</div>
								</li>
								<li style="float: right; width: auto; margin-right: 8px;">
									<button type="button" class="jt-btn-white-small jt-event-update-submit">
										<span class="btnImage"></span>
										<span class="btnText">저장</span>
									</button>
									<button type="button" class="jt-btn-white-small jt-product-update-cancle">
										<span class="btnImage"></span>
										<span class="btnText">취소</span>
									</button>
								</li>
							</ul>
						</form:form>
					</div>
				</li>
			</ul>
		</article>
		
		<footer class="jt-product-footer">
			<div>이벤트는 2개까지 업로드 가능합니다.</div>
		</footer>
	</section>
	<%@ include file="../layout/script_foot.jspf" %>

<script type="text/javascript">
/* <![CDATA[ */ 
	$(function(){
		$('#jt-home-footer').css('display','none');
		if($('body').attr('data-reload') == '1'){
			$('body').attr('data-reload', null);
			window.opener.location.reload();
		}
	}); 
	
/* ]]> */
</script>
</body>
</html>