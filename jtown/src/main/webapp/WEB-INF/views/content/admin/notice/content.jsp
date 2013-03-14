<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../../layout/layout_admin_header.jspf" %>
<c:url value="/admin/noticeWrite" var="boardUrl"/>
<form:form commandName="board" action="${boardUrl }" htmlEscape="true" method="delete">
	<form:hidden path="pn"/>
</form:form>

<ul class="jt-notice-tool">
	<li>
		<c:url value="/admin/noticeModify?pn=${notice.pn }" var="modify" />
		<a href="${modify }" class="jt-common-a-base-two">수정</a>
	</li>
	<li>
		<a href="javascript:document.forms['board'].submit();" class="jt-common-a-base-two">삭제</a>
	</li>
	<li>
		<c:url value="/admin/notice" var="noticeUrl" />
		<a href="${noticeUrl }" class="jt-common-a-base-two">목록</a>
	</li>
</ul>
			
<table class="jt-notice-content-table">
	<tbody>
		<tr>
			<th>제목</th>
			<td><c:out value="${notice.title }"/></td>
			<th>조회수</th>
			<td><c:out value="${notice.readCount }"/></td>
		</tr>
		<tr>
			<th>작성자</th>
			<td colspan="3">운영자</td>
		</tr>
		<tr>
			<th>게시일</th>
			<td colspan="3"><c:out value="${fn:substring(notice.inputDate, 0, 19) }"/></td>
		</tr>			
		<tr>
			<th>내용</th>
			<td colspan="3"><pre><c:out value="${notice.content }"/></pre></td>
		</tr>
	</tbody>	
</table>
<%@ include file="../../../layout/layout_admin_footer.jspf" %>