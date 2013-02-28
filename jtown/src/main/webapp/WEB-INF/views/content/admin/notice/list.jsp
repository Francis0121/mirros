<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../../layout/layout_admin_header.jspf" %>
<div>
	<div>
		<c:url value="/admin/noticeWrite" var="write" />
		<a href="${write }">글 작성</a>
	</div>
	<table class="jt-join-user-table">
		<tfoot>
		
		</tfoot>
		<thead>
			<tr>
				<th>번호</th>
				<th>제목</th>
				<th>날짜</th>
				<th>조회수</th>				
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${noticeList }" var="notice" varStatus="i">
				<tr class="jt-notice-content-tr" data-pn="${notice.pn }">
					<td>${i.count }</td>
					<td>${notice.title }</td>
					<td>${fn:substring(notice.inputDate, 0, 19) }</td>
					<td>${notice.readCount }</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</div>
<%@ include file="../../../layout/layout_admin_footer.jspf" %>