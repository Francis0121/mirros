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
<link rel="stylesheet" type="text/css" href="${cp }/resources/jquery/jquery-ui-1.10.2.custom.min.css" />
<link rel="stylesheet" type="text/css" href="${cp }/resources/css/default.css" />
<link rel="stylesheet" type="text/css" href="${cp }/resources/css/common.css" />
<link rel="stylesheet" type="text/css" href="${cp }/resources/css/admin.css" />
</head>
<body>

<c:set var="pagination" value="${contractFilter.pagination }"/>	
<form:form commandName="contractFilter" action="${cp }/admin/contract" method="get">
	<form:hidden path="page" value="${pagination.currentPage}"/>
	<form:hidden path="sellerPn" htmlEscape="true"/>
</form:form>

<table class="jt-admin-base-table jt-contract-table">
	<thead>
		<tr>
			<th>순번</th>
			<th>시작날짜</th>
			<th>끝날짜</th>
			<th>계약날짜</th>
		</tr>
	</thead>
	<tfoot class="jt-pagination">
		<tr>
			<td colspan="4">
				<div id="page-wrap">
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
			</td>
		</tr>
	</tfoot>
	<tbody>
		<c:forEach var="contractObj" items="${contracts }" varStatus="i">
			<tr>
				<td><c:out value="${pagination.numItems - (pagination.currentPage - 1)* 10-i.count+1}"/></td>
				<td><c:out value="${contractObj.startDate }"/></td>
				<td><c:out value="${contractObj.endDate }"/></td>
				<td><c:out value="${fn:substring(contractObj.inputDate , 0, 10) }"/></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

<section class="jt-contract-section">
	<form:form commandName="contract" action="${cp }/admin/contract.jt" method="post">
		<form:hidden path="sellerPn"/>
		<c:choose>
			<c:when test="${contract.contractEndDate eq null }">
				<header>
					계약
				</header>
				<article>
					<ul>
						<li>
							<form:label path="startDate">시작날짜</form:label>
							<form:input path="startDate" cssClass="jt-admin-input" cssErrorClass="jt-admin-input-error" readonly="true"/>	
							<div class="jt-admin-error">
								<form:errors path="startDate"/>
							</div>
						</li>
			</c:when>
			<c:otherwise>
				<header>
					계약연장
				</header>
				<article>
					<form:hidden path="contractEndDate"/>
					<ul>
			</c:otherwise>
		</c:choose>
				<li>
					<form:label path="contractPeroid">계약기간</form:label>
					<form:select path="contractPeroid" cssClass="jt-admin-select" cssErrorClass="jt-admin-select-error">
						<form:option value="">계약기간</form:option>	
						<form:option value="15">15일</form:option>
						<form:option value="30">1달</form:option>
						<form:option value="60">2달</form:option>
						<form:option value="90">3달</form:option>
						<form:option value="365">1년</form:option>
					</form:select>
					<div class="jt-admin-error">
						<form:errors path="contractPeroid"/>
					</div>
				</li>
			</ul>
		</article>
		<footer>	
			<button type="submit" class="jt-btn-white-small">
				<span class="btnText">계약</span>
			</button>			
		</footer>
	</form:form>
</section>
	
<script src="${cp}/resources/jquery/jquery-1.8.2.min.js"></script>
<script src="${cp}/resources/jquery/jquery-ui-1.10.0.custom.js"></script>
<script src="${cp}/resources/jquery/jquery.ui.datepicker-ko.js"></script>
<script type="text/javascript">
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
	
	var form = document.forms['contractFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}    

$(function(){
	$('#page-wrap').css('width', $('#page-wrap>div').width());
	
	$('#startDate').datepicker({
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		width: 220
	});
});
/* ]]> */	
</script>

<%-- F5, CTRL + N, CTRL + R 시에는 result 메시지 안뜨도록 설정 --%>
<c:if test="${result ne null }">

<script type="text/javascript">
/* <![CDATA[ */
var alertText = '';
var pageUrl = '<c:out value="${rp }"/>';
/* ]]> */	
</script>

<c:if test="${result eq 1 }">
<script type="text/javascript">
/* <![CDATA[ */
alertText ='계약 되었습니다.';
pageUrl += '?sellerPn=<c:out value="${contractFilter.sellerPn}"/>';
window.opener.document.location.reload();
/* ]]> */	
</script>
</c:if>

<script type="text/javascript">
/* <![CDATA[ */
alert(alertText);

document.onkeydown = checkKeycode;

function checkKeycode(e) {
	var keycode = 0;
	if (window.event) 
		keycode = window.event.keyCode;
		else if (e) 
			keycode = e.which;
	
    if (keycode == 116) {
    	keycode= 2;
        location.href=pageUrl;
        return false;
    }else if(e.ctrlKey && (keycode==78 || keycode == 82)){
    	location.href=pageUrl;
        return false;
    }
}
/* ]]> */	
</script>
</c:if>

</body>
</html>
