<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/admin_header.jspf" %>
<c:set var="pagination" value="${userFilter.pagination }"/>
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
	
	var form = document.forms['userFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>

<c:url value="/admin/customer" var="customerUrl"/>
<ul class="jt-manage-filter">
<form:form commandName="userFilter" action="${customerUrl }" method="get" htmlEscape="true">
	<form:hidden path="page" value="${pagination.currentPage}"/>
	<li>
		<form:select path="enabled" htmlEscape="true" onchange="document.forms['userFilter'].submit();">
			<form:option value="">전체</form:option>
			<form:option value="true">정상사용자</form:option>
			<form:option value="false">불량사용자</form:option>
		</form:select>
	</li>
	<li>
		<form:label path="name">이름</form:label>
		<form:input path="name"/>
		<form:label path="userId">아이디</form:label>
		<form:input path="userId"/>
		<input type="submit" value="전송"/>
	</li>
</form:form>
</ul>

<table class="jt-manage-table">
	<thead>
		<tr>
			<th>번호</th>
			<th>아이디</th>
			<th>이름</th>
			<th>관심사</th>
			<th>가입날짜</th>
			<th>불량사용자 여부</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="6">
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
		<c:forEach items="${customerList }" var="customer" varStatus="i">
			<c:set var="customerPn" value="${customer.pn }" />
			<tr class="jt-admin-customer-table-tr">
				<td><c:out value="${pagination.numItems - (pagination.currentPage - 1)* 10-i.count+1}"/></td>
				<td class="jt-admin-customer-table-customerId"><c:out value="${customer.username }"/></td>
				<td><c:out value="${customer.name }"/></td>
				<td><c:out value="${interestMap[customerPn].interestSectionNameList }"/></td>
				<td><c:out value="${customer.joinDate }"/></td>
				<td>
					<select class="jt-admin-customer-enable">
						<option value="1" ${customer.enabled eq true ? 'selected=selected' : ''}>정상 사용자</option>
						<option value="0" ${customer.enabled eq false ? 'selected=selected' : ''}>불량 사용자</option>					
					</select>
				</td>
			</tr>
		</c:forEach>
	</tbody>
</table>
<%@ include file="../../layout/admin_footer.jspf" %>