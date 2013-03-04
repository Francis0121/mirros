<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../../layout/layout_admin_header.jspf" %>

<ul class="jt-notice-tool">
	<li>
		<c:url value="/admin/noticeWrite" var="write" />
		<a href="${write }" class="jt-common-a-base-two">작성</a>
	</li>
</ul>

<table class="jt-notice-table">
	<thead>
		<tr>
			<th>번호</th>
			<th>제목</th>
			<th>날짜</th>
			<th>조회수</th>				
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="4"></td>
		</tr>
	</tfoot>
	<tbody>
		<c:forEach items="${noticeList }" var="notice" varStatus="i">
			<tr class="jt-notice-content-tr" data-pn="<c:out value="${notice.pn }"/>">
				<td><c:out value="${i.count }"/></td>
				<td><c:out value="${notice.title }"/></td>
				<td><c:out value="${fn:substring(notice.inputDate, 0, 19) }"/></td>
				<td><c:out value="${notice.readCount }"/></td>
			</tr>
		</c:forEach>
	</tbody>
</table>
<%@ include file="../../../layout/layout_admin_footer.jspf" %>