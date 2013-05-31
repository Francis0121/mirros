<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/help_header.jspf" %>

<section class="jt-help-notice-wrap">
			
<table class="jt-help-notice-content-table">
	<thead>
		<tr>
			<th><div>제목</div></th>
			<td colspan="3" class="jt-help-notice-content-title"><c:out value="${noticeContent.title }"/></td>
		</tr>
		<tr>
			<th><div>작성자</div></th>
			<td>관리자</td>
			<th><div>날짜</div></th>
			<td><c:out value="${fn:substring(noticeContent.inputDate, 0, 19) }"/></td>
		</tr>
	</thead>			
		<tr>
			<td colspan="4"><div><pre>${noticeContent.content }</pre></div></td>
		</tr>
	</tbody>	
</table>

<ul class="jt-help-notice-tool">
	<li>
		<c:url value="/help/notice" var="noticeUrl" />
		<a href="${noticeUrl }" class="jt-btn-white-small">
			<span class="btnImage"></span>
			<span class="btnText">목록</span>
		</a>
	</li>
</ul>

<table class="jt-help-notice-content-list-table">
	<tbody>
		<c:forEach items="${noticeList }" var="notice" varStatus="i">
			<tr class="jt-help-notice-content-tr">
				<td><c:out value="${noticeContent.pn < notice.pn ? '다음글' : '이전글'}"/></td>
				<c:url value="/help/notice/content?pn=${notice.pn }&amp;page=${pagination.currentPage}" var="noticeUrl"/>
				<td><a href="${noticeUrl }"><c:out value="${notice.title }"/></a></td>
				<td><c:out value="${fn:substring(notice.inputDate, 0, 19) }"/></td>
				<td><c:out value="${notice.readCount eq null ? 0 : notice.readCount}"/></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

</section>
<%@ include file="../../layout/help_footer.jspf" %>