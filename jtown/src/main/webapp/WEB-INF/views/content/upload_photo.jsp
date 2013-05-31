<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE HTML>
<html>
<head>
<title>People GATE</title>
<style type="text/css">
body,p,h1,h2,h3,h4,h5,h6,ul,ol,li,dl,dt,dd,table,th,td,form,fieldset,legend,input,textarea,button,select{margin:0;padding:0}
body,input,textarea,select,button,table{font-family:Dotum,Gulim,Helvetica,sans-serif;font-size:12px}
img,fieldset{border:0}
ul,ol{list-style:none}
em,address{font-style:normal}
a{text-decoration:none}
a:hover,a:active,a:focus{text-decoration:underline}
</style>
<link rel="stylesheet" type="text/css" href="${cp }/resources/uploadify/uploadify.css" />
<link rel="stylesheet" type="text/css" href="${cp }/resources/se2/popup/jsp_photo/style.css" />
<script type="text/javascript"> var contextPath = '${cp}'; </script>
<script src="${cp }/resources/jquery/jquery-1.8.2.min.js"></script>
<script src="${cp }/resources/se2/popup/jsp_photo/syncFileUpload.js" charset="utf-8"></script>
<script src="${cp }/resources/uploadify/jquery.uploadify.min.js"></script>
<c:set var="pagination" value="${fileFilter.pagination }"/>
<script >
/* <![CDATA[ */
var numPagesPerScreen = <c:out value='${pagination.numPagesPerScreen}'/>;
var page = <c:out value='${pagination.currentPage}'/>;
var numPages = <c:out value='${pagination.numPages}'/>;

function goToNextPages() {
	goToPage(Math.min(numPages, page + numPagesPerScreen));
}

function goToPage(page) {
	var input = document.getElementById('page');
	input.value = page;
	
	var form = document.forms['fileFilter'];
	form._method.value='get';
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>
</head>
<body>
	<div class="photoViewWrap">
	
		<ul class="photoArray">
			<c:set var="fileCount" value="0"/>
			<c:forEach items="${files}" var="file" varStatus="loop">
				<li class="photo" id="photo_${loop.count }"
					data-pn="${file.imagePn }" 
					data-originalName="${file.originalName }"
					data-saveName="${file.saveName }"
					data-count="${loop.count}">
					<div class="select-photo">
						<ul class="photo-bar">
							<li><input type="checkbox" class="check-photo"/><button type="button" class="delete-photo btn-white-small">삭제</button></li>
						</ul>
						<img src="${cp }/resources/uploadAdmin/${file.saveName}">
					</div>
				</li>
				<c:set var="fileCount" value="${loop.count }"/>
			</c:forEach>
			<c:forEach begin="${fileCount+1 }" end="9" varStatus="loop">
				<li class="photo" id="photo_${loop.count }">
					<div>
						<ul class="photo-bar">
							<li><input type="checkbox" id="photoCheck_${loop.count }"/></li>
						</ul>
						<img />
					</div>
				</li>
			</c:forEach>
		</ul>
		
		<div class="photoPagination">
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
	
	<div class="photoInputWrap">
		<c:set var="fileFilterUrl" value="${cp }/admin/file"/>
		<form:form commandName="fileFilter" action="${fileFilterUrl }" method="put" htmlEscape="true">
			<form:hidden path="page" value="${pagination.currentPage}"/>
			<form:hidden path="pn"/>
		</form:form>

		<input type="file" id="filedata" name="filedata">
		
		<button type="button" id="insert-photo" class="btn-white-small">사진입력</button>
		
		<div class="photoSizeWrap">
		<c:forEach items="${files}" var="file" varStatus="loop">
			<ul id="photoSize_${loop.count}" class="photoSize">
				<li>크기변경</li>
				<li>자동변경<input type="checkbox" id="photoAutoResize_${loop.count }" checked="checked"/> </li>
				<li>Width : <input type="text" value="${file.width }" id="width_${loop.count}" onchange="calculatorHeight('${loop.count }', '${file.width }', '${file.height }');"/></li>
				<li>Heigth : <input type="text" value="${file.height }" id="height_${loop.count}" onchange="calculatorWidth('${loop.count }', '${file.width }', '${file.height }');"/></li>
			</ul>
		</c:forEach>
		</div>
	</div>
</body>
</html>