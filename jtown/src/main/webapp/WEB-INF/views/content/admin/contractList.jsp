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
<style type="text/css">
.jt-popup-table { border-bottom: 1px solid #ffd5a6; border-right: 1px solid #ffd5a6; border-collapse: collapse; font-size: 12px; width: 350px;}
.jt-popup-table th{ background: #ffead1; vertical-align: middle;}
.jt-popup-table th, .jt-popup-table td{ padding: 2px 3px; border-top: 1px solid #ffd5a6; border-left: 1px solid #ffd5a6; min-height: 20px; text-align: center;}
</style>
</head>
<body>
	<c:set var="pagination" value="${contractFilter.pagination }"/>
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
	/* ]]> */
	</script>
	
	<c:url value="/admin/contractList" var="contractUrl"/>
	<form:form commandName="contractFilter" action="${contractUrl }">
		<form:hidden path="page" value="${pagination.currentPage}"/>
	</form:form>
	
	<table class="jt-popup-table">
		<thead>
			<tr>
				<th>순번</th>
				<th>시작날짜</th>
				<th>끝날짜</th>
				<th>계약날짜</th>
			</tr>
		</thead>
		<tfoot>
			<tr>
				<td colspan="4">
					<a href="javascript:void(goToPage(1))" onfocus="blur();">
						처음
	<%-- 					<img src="<c:url value='/images/mims_pageFirst_btn.gif'/>" alt="처음" style="vertical-align: middle; border: none" /> --%>
					</a>
					<a href="javascript:void(goToPreviousPages())" onfocus="blur();">
							다음
	<%-- 					<img src="<c:url value='/images/button/mims_prev_btn.gif'/>" alt="다음" style="vertical-align: middle; border: none" /> --%>
					</a>
					<c:forEach var="i" begin="${pagination.pageBegin}" end="${pagination.pageEnd}">
						<c:if test="${i == pagination.currentPage}">
							<strong>${i}</strong>
						</c:if>
						<c:if test="${i != pagination.currentPage}">
							<a class="pageLink" href="javascript:void(goToPage(${i}))" onfocus="blur();">${i}</a>
						</c:if>
					</c:forEach>
					<a href="javascript:void(goToNextPages())" onfocus="blur();">
							다음
	<%-- 					<img src="<c:url value='/images/button/mims_next_btn.gif'/>" alt="다음" style="vertical-align: middle; border: none" /> --%>
					</a>
					<a href="javascript:void(goToPage(${pagination.numPages}))" onfocus="blur();">
							끝
	<%-- 					<img src="<c:url value='/images/mims_pageLast_btn.gif'/>" alt="끝" style="vertical-align: middle; border: none" /> --%>
					</a>
				</td>
			</tr>
		</tfoot>
		<tbody>
			<c:forEach var="contract" items="${contracts }" varStatus="i">
				<tr>
					<td><c:out value="${pagination.numItems - (pagination.currentPage - 1)* 10-i.count+1}"/></td>
					<td><c:out value="${contract.startDate }"/></td>
					<td><c:out value="${contract.endDate }"/></td>
					<td><c:out value="${contract.inputDate }"/></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>
</html>
