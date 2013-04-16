<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/admin_header.jspf" %>
<c:set var="pagination" value="${adminCommentFilter.pagination }"/>
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
	
	var form = document.forms['adminCommentFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>

<c:url value="/admin/comment" var="commentUrl"/>
<form:form commandName="adminCommentFilter" action="${commentUrl }" method="get">
	<form:hidden path="page" value="${pagination.currentPage}"/>
</form:form>


<table class="jt-admin-comment-table">
	<thead>
		<tr>
			<th>순번</th>
			<th>고객고유번호</th>
			<th>아이디</th>
			<th>내용</th>
			<th>입력날짜</th>
			<th>숨기기</th>
			<th>아이디정지</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="7">
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
		<c:forEach items="${comments }" var="comment" varStatus="i">
			<tr data-copn="<c:out value="${comment.commentPn }"/>" data-spn="<c:out value="${comment.sellerPn }"/>">
				<td><c:out value="${pagination.numItems - (pagination.currentPage - 1)* 10-i.count+1}"/></td>
				<td><c:out value="${comment.customerPn }"/></td>
				<td><c:out value="${comment.customerName }"/></td>
				<td><c:out value="${comment.comment }"/></td>
				<td><c:out value="${comment.inputDate }"/></td>
				<td></td>
				<td></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

<%@ include file="../../layout/admin_footer.jspf" %>