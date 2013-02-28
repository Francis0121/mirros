<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>

<%@ include file="../../../layout/layout_admin_header.jspf" %>
<div>
	<div>
		<c:url value="/admin/noticeModify?pn=${notice.pn }" var="modify" />
		<a href="${modify }">글 수정</a>
	</div>
	<table class="jt-join-user-table">
		<tbody>
			<tr>
				<th>제목</th>
				<td>${notice.title }</td>
				<th>조회수</th>
				<td>${notice.readCount }</td>
			</tr>
			<tr>
				<th>작성자</th>
				<td colspan="3">운영자</td>
			</tr>
			<tr>
				<th>게시일</th>
				<td colspan="3">${fn:substring(notice.inputDate, 0, 19) }</td>
			</tr>			
			<tr>
				<th>내용</th>
				<td colspan="3"><pre>${notice.content }</pre></td>
			</tr>
		</tbody>	
	</table>
</div>
<%@ include file="../../../layout/layout_admin_footer.jspf" %>