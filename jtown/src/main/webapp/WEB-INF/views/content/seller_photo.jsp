<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<c:set var="rp" value='<%=request.getAttribute("javax.servlet.forward.request_uri")%>'/>
<c:set var="pagination" value="${productFilter.pagination }"/>
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
			상품 사진 올리기
		</header>
		
		<article class="jt-product-article">
			<ul>
				<c:forEach items="${products }" var="product" varStatus="i">
					<li class="jt-product-article-object jt-product-article-object-img" 
						id="jt-product-article-object-<c:out value="${((pagination.currentPage-1) * 10) + i.index }"/>"
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
						<c:set value="${cp }/photo/thumbnail/${product.saveName }product.${product.imageType }" var="image"/>
						<c:if test="${product.imageCategory eq 0 }">
							<c:set value="${cp }/resources/uploadImage/${product.saveName }" var="image"/>
						</c:if>
						<img alt="${product.name }" src="${image}"/>
						<div class="jt-product-article-object-wrap jt-product-article-object-photo">
							<c:choose>
								<c:when test="${product.name eq null or product.commaPrice eq null }">
									<span>상품 정보가 아직</span>
									<span>입력되지 않았습니다.</span>
								</c:when>
								<c:otherwise>
									<span title="<c:out value="${product.name }"/>"><c:out value="${product.name }"/></span>
									<span><c:out value="${product.commaPrice }"/></span>
								</c:otherwise>
							</c:choose>
						</div>
					</li>
				</c:forEach>
				<c:forEach begin="${fn:length(products) }" end="9" varStatus="i">
					<li class="jt-product-article-object" id="jt-product-article-object-<c:out value="${((pagination.currentPage-1) * 10) + i.index }"/>">
						<div class="jt-seller-expand-product-delete-tool">	
							<div>
								<a href="#none" class="jt-seller-product-delete jt-btn-white-small">
									<span class="btnImage"></span>
								</a>
							</div>
						</div>
						<img alt="Blank" src="${cp }/resources/images/jt-product-blank.png">
						<div class="jt-product-article-object-wrap jt-product-article-object-photo">
							<span>상품 정보가 아직</span>
							<span>입력되지 않았습니다.</span>
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
						<li></li>
						<li>1. 해당 상품을 클릭하시면 상세정보 (이름, 가격, 상품 URL) 입력이 가능합니다.</li>
						<li>2. 상품 삭제는 해당 상품에 마우스를 올릴시 좌측 상단에 뜨는 X 버튼을 클릭하시기 바랍니다.</li>
					</ul>
					<div class="jt-product-article-update" style="display: ${update};">
						<form:form commandName="product" action="${cp }/seller/form.jt" method="delete">
							<form:hidden path="pn"/>
							<form:hidden path="sellerPn"/>
							<input type="hidden" id="currentPage" name="currentPage" value="${pagination.currentPage }"/>
							<ul class="jt-product-article-update-input">  
								<li>
									<form:input path="name" cssClass="jt-product-input" cssErrorClass="jt-product-input-error" maxlength="15" placeholder="이름 : ex) T-Shirt"/>
										<select class="jt-product-select jt-product-select-sections" name="sectionsPn">
										<option value="-1">대분류</option>	
										<c:forEach items="${sectionsList}" var="sectionsList">
											<option value="${sectionsList.sectionsPn}">${sectionsList.sectionsName}</option>
										</c:forEach>
										</select>
								</li>
								<li>
								
									<form:input path="price" cssClass="jt-product-input" cssErrorClass="jt-product-input-error" maxlength="10" placeholder="가격 : ex) 20000"/>
									<select class="jt-product-select jt-product-select-divisions" name="divisionsPn">
										<option value="-1">중분류</option>
									</select>
								</li>
								<li>
									<form:input path="url" cssClass="jt-product-input" cssErrorClass="jt-product-input-error" maxlength="300" placeholder="상품 URL : ex) http://www.myshop.net/shoes"/>
									<select class="jt-product-select jt-product-select-groups" name="groupsPn">
										<option value="-1">소분류</option>
									</select>
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
			<div class="jt-sellerPop-page">
				<div id="page-wrap" >
					<div style="float: left;">
						<a href="javascript:void(goToPage(1))" onfocus="blur();">
							<img src="${cp }/resources/images/arrow/pageFirst_btn.png" alt="처음" title="First" style="vertical-align: middle; border: none;" />
						</a>
						<a href="javascript:void(goToPreviousPages())" onfocus="blur();" class="page-beforeafter">
							<img src="${cp }/resources/images/arrow/prev_btn.png" alt="이전" title="Before" style="vertical-align: middle; border: none;  margin-top: -2px;" />&nbsp;&nbsp;<span>PREV</span>
						</a>
						<c:forEach var="i" begin="${pagination.pageBegin}" end="${pagination.pageEnd}">
							<c:if test="${i == pagination.currentPage}">
								<a class="page-link page-now">${i}</a>
							</c:if>
							<c:if test="${i != pagination.currentPage}">
								<a class="page-link" href="javascript:void(goToPage(${i}))" onfocus="blur();">${i}</a>
							</c:if>
						</c:forEach>
						<a href="javascript:void(goToNextPages())" onfocus="blur();" class="page-beforeafter">
							<span>NEXT</span>&nbsp;&nbsp;<img src="${cp }/resources/images/arrow/next_btn.png" alt="다음" title="After" style="vertical-align: middle; border: none; margin-top: -2px;" />
						</a>
						<a href="javascript:void(goToPage(${pagination.numPages}))" onfocus="blur();">
							<img src="${cp }/resources/images/arrow/pageLast_btn.png" alt="끝" title="Last" style="vertical-align: middle; border: none; " />
						</a>
					</div>
				</div>
			</div>	
		</article>
		
		<footer class="jt-product-footer">
			<div><span class="jt-product-header-text">한 장당 2MB이하로, 상품은 총 10장 까지 가능합니다. (JPG, GIF, PNG)</span></div>
			<div>저작권 및 타인의 권리 침해, 명예를 훼손하는 이미지는 이용약관 및 관련 법률에 의해 제재 받으실 수 있습니다. </div>
		</footer>
	</section>
	<form:form commandName="productFilter" action="${cp }/seller/products/${productFilter.sellerPn }" method="get">
		<form:hidden path="page" value="${pagination.currentPage}"/>
	</form:form>	
	<%@ include file="../layout/script_foot.jspf" %>

<script type="text/javascript">
/* <![CDATA[ */ 
	$(function(){
		$('#product #name').placeholder();
		$('#product #price').placeholder();
		$('#product #url').placeholder();
		$('#jt-home-footer').css('display','none');
		if( $('.jt-product-error-text').text() == ''){
			$('.jt-product-article-object[data-name =""]:last').click();
		}
	}); 
	
	if($('body').attr('data-reload') == '1'){
		$('body').attr('data-reload', null);
		window.opener.location.reload();
	}
	
	var numPagesPerScreen = <c:out value='${pagination.numPagesPerScreen}'/>;
	var page = <c:out value='${pagination.currentPage}'/>;
	var numPages = <c:out value='${pagination.numPages}'/>;
	
	function goToNextPages() {
		goToPage(Math.min(numPages, page + numPagesPerScreen));
	}
	
	function goToPage(page) {
		var input = document.getElementById('page');
		input.value = page;
		
		var form = document.forms['productFilter'];	
		form.submit();
	}
	
	function goToPreviousPages() {
		goToPage(Math.max(1, page - numPagesPerScreen));
	}
/* ]]> */
</script>
</body>
</html>