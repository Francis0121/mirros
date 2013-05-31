<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../../layout/admin_header.jspf" %>

<c:url var="createAdministartor" value="/admin/createAdministrator"/>
<a href="${createAdministartor}">관리자 생성</a>

<c:set var="pagination" value="${administratorFilter.pagination }"/>
<%-- Page 처리 Script --%>
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
	
	var form = document.forms['administratorFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>

<c:url value="/admin/administrator" var="administratorUrl"/>
<form:form commandName="administratorFilter" action="${administratorUrl }" htmlEscape="true" method="get">
	<form:hidden path="page" value="${pagination.currentPage}"/>
</form:form>

<table>
	<thead>
		<tr>
			<th>번호</th>
			<th>아이디</th>
			<th>이름</th>
			<th>등록날짜</th>
			<th>사용여부</th>
			<th>비밀번호 재설정</th>
		</tr>
	</thead>
	<tfoot>
		<tr>	
			<th colspan="7">
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
			</th>
		</tr>
	</tfoot>
	<tbody>
		<c:forEach items="${adminList }" var="admin" varStatus="loop">
			<tr>
				<td><c:out value="${admin.pn }"/></td>
				<td><c:out value="${admin.username }"/></td>
				<td><c:out value="${admin.name }"/></td>
				<td><c:out value="${admin.salt }"/></td>
				<td><c:out value="${admin.enabled}"/></td>
				<td><button type="button" class="jt-reset-password" data-username="${admin.username }">비밀번호 재설정</button></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

<%@ include file="../../../layout/admin_footer.jspf" %>
