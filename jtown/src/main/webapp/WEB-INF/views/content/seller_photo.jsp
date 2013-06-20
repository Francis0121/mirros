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
<body>
	<section class="jt-product-section">
		<header class="jt-product-header">
			<ul>
				<li><h1>상품 사진 올리기</h1></li>
				<li><span class="jt-product-header-icon"></span><span class="jt-product-header-text">한 장당 15MB, 상품은 총 10장 가능합니다. (JPG, GIF, PNG)</span></li>
			</ul>
		</header>
		
		<article class="jt-product-article">
			<ul>
				<c:forEach items="${products }" var="product" varStatus="i">
					<li class="jt-product-article-object">
						<img alt="${product.name }" src="${cp }/resources/uploadImage/${product.saveName }"/>
						<div class="jt-product-article-object-wrap"></div>
						<div class="jt-product-article-object-text">
							<span><c:out value="${product.name }"/></span>
							<span><c:out value="${product.price }"/></span>
						</div>
					</li>
				</c:forEach>
				<c:forEach begin="${fn:length(products) }" end="9" varStatus="i">
					<li class="jt-product-article-object">
						<img alt="Blank" src="${cp }/resources/images/jt-product-blank.png">
					</li>
				</c:forEach>
				<li class="jt-product-article-inputBox">
					<ul class="jt-product-article-insert">
						<li><input type="file" id="jt-product-file" name="jt-product-file"/></li>
						<li>상품 수정은 해당 상품을 클릭하시기 바랍니다.</li>
						<li>상품 삭제는 해당 상품에 마우스를 올릴시 좌측 상단에 뜨는 X 버튼을 클릭하시기 바랍니다.</li>
					</ul>
					<div class="jt-product-article-update">
		
					</div>
				</li>
			</ul>
		</article>
		
		<footer class="jt-product-footer">
			<span>저작권 및 타인의 권리 침해, 명예를 훼손하는 이미지는 이용약관 및 관련 법률에 의해 제재 받으실 수 있습니다.</span>
		</footer>
	</section>	
	<%@ include file="../layout/script_foot.jspf" %>
</body>
</html>