<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
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
<body onunload="closePage(event);" data-spn="<sec:authentication property="principal.pn" />">
	<section class="jt-product-section">
		<header class="jt-product-header">
			<ul>
				<li><h1>상품 사진 올리기</h1></li>
				<li><span class="jt-product-header-icon"></span><span class="jt-product-header-text">한 장당 15MB이하로, 상품은 총 10장 까지 가능합니다. (JPG, GIF, PNG)</span></li>
			</ul>
		</header>
		
		<article class="jt-product-article">
			<ul>
				<c:forEach items="${products }" var="product" varStatus="i">
					<li class="jt-product-article-object jt-product-article-object-img" 
						id="jt-product-article-object-<c:out value="${i.index }"/>"
						data-ppn="${product.pn}"
						data-name="<c:out value="${product.name }"/>"
						data-price="<c:out value="${product.price }"/>"
						data-url="<c:out value="${product.url }"/>">
						<div class="jt-seller-expand-product-delete-tool">	
							<div>
								<a href="#none" class="jt-seller-product-delete jt-btn-white-small">
									<span class="btnImage"></span>
								</a>
							</div>
						</div>
						<img alt="${product.name }" src="${cp }/resources/uploadImage/${product.saveName }"/>
						<div class="jt-product-article-object-wrap">
							<c:choose>
								<c:when test="${product.name eq null or product.commaPrice eq null }">
									<span>상품 정보가 아직</span>
									<span>입력되지 않았습니다.</span>
								</c:when>
								<c:otherwise>
									<span><c:out value="${product.name }"/></span>
									<span><c:out value="${product.commaPrice }"/></span>
								</c:otherwise>
							</c:choose>
						</div>
					</li>
				</c:forEach>
				<c:forEach begin="${fn:length(products) }" end="9" varStatus="i">
					<li class="jt-product-article-object" id="jt-product-article-object-<c:out value="${i.index }"/>">
						<div class="jt-seller-expand-product-delete-tool">	
							<div>
								<a href="#none" class="jt-seller-product-delete jt-btn-white-small">
									<span class="btnImage"></span>
								</a>
							</div>
						</div>
						<img alt="Blank" src="${cp }/resources/images/jt-product-blank.png">
						<div class="jt-product-article-object-wrap">
							<span><c:out value="${product.name }"/></span>
							<span><c:out value="${product.price }"/></span>
						</div>
					</li>
				</c:forEach>
				<li class="jt-product-article-inputBox">
					<c:set var="insert" value="block"/>
					<c:set var="update" value="none"/>
					<c:if test="${product.pn ne null }">
						<c:set var="insert" value="none"/>
						<c:set var="update" value="block"/>
					</c:if>
					<ul class="jt-product-article-insert" style="display: ${insert};">
						<li class="jt-product-insert-wrap">
							<input type="file" id="jt-product-file" name="jt-product-file"/>
						</li>
						<li>
							<button type="button" class="jt-finish-insert-btn" id="jt-product-finish">
								<img alt="입력완료" src="${cp }/resources/images/jt-confirm-icon.png" style="float:left; margin: 1px 7px 0 3px;"/><span style="float:left; ">입력완료</span>
							</button>
						</li>
						<li>1. 해당 상품을 클릭하시면 상세정보 (이름, 가격, 상품 URL) 입력이 가능합니다.</li>
						<li>2. 상품 삭제는 해당 상품에 마우스를 올릴시 좌측 상단에 뜨는 X 버튼을 클릭하시기 바랍니다.</li>
					</ul>
					<div class="jt-product-article-update" style="display: ${update};">
						<form:form commandName="product" action="${cp }/seller/form.jt" method="delete">
							<form:hidden path="pn"/>
							<form:hidden path="sellerPn"/>
							<ul class="jt-product-article-update-input"> 
								<li>
									<form:label path="name" cssClass="jt-product-label">이름</form:label>
									<form:input path="name" cssClass="jt-product-input" cssErrorClass="jt-product-input-error" maxlength="15" placeholder="ex) T-Shirt"/>
								</li>
								<li>
									<form:label path="price" cssClass="jt-product-label">가격</form:label>
									<form:input path="price" cssClass="jt-product-input" cssErrorClass="jt-product-input-error" maxlength="10" placeholder="ex) 20000"/>
								</li>
								<li>
									<form:label path="url" cssClass="jt-product-label">상품 URL</form:label>
									<form:input path="url" cssClass="jt-product-input" cssErrorClass="jt-product-input-error" maxlength="300" placeholder="ex) http://www.myshop.net/shoes"/>
								</li>
								<li style="width: 260px; margin: 0;">
									<div class="jt-product-error">
										<form:errors path="*" cssClass="jt-product-error-text"/>
									</div>
								</li>
								<li style="float: right; width: auto; margin-right: 8px;">
									<button type="button" class="jt-btn-white-small jt-product-update-submit">
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
			<span>저작권 및 타인의 권리 침해, 명예를 훼손하는 이미지는 이용약관 및 관련 법률에 의해 제재 받으실 수 있습니다.</span>
		</footer>
	</section>	
	<%@ include file="../layout/script_foot.jspf" %>
<script type="text/javascript">
/* <![CDATA[ */ 
	$(function(){
		$('#product #name').placeholder();
		$('#product #price').placeholder();
		$('#product #url').placeholder();
	}); 
	
	$(window).unload(function(event){
		window.opener.document.location.reload();
	});
/* ]]> */	
</script>
</body>
</html>