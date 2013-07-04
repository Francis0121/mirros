<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../../layout/admin_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<form:form commandName="board" action="${cp }/admin/noticeWrite" htmlEscape="true" method="delete">
	<form:hidden path="pn"/>
</form:form>

<section class="jt-admin-notice-wrap">

<section class="jt-help-notice-content">
	<header>
		<ul>
			<li class="jt-help-notice-content-title"><span><c:out value="${notice.title }"/></span></li>
			<li class="jt-help-notice-content-count"><span>조회 <c:out value="${notice.readCount }"/></span></li>
		</ul>
	</header>
	<article>
		<span><c:out value="${notice.inputDate}"/></span>
		<pre>${notice.content }</pre>
	</article>
</section>

<ul class="jt-admin-notice-tool">
	<li>
		<a href="${cp }/admin/noticeWrite?pn=${notice.pn }" class="jt-btn-white-small jt-admin-notice-tool-update">
			<span class="btnImage"></span>
			<span class="btnText">수정</span>
		</a>
	</li>
	<li>
		<a href="#none" id="jt-admin-notice-delete" class="jt-btn-white-small jt-admin-notice-tool-delete">
			<span class="btnImage"></span>
			<span class="btnText">삭제</span>
		</a>
	</li>
	<li>
		<a href="${cp }/admin/notice" class="jt-btn-white-small jt-admin-notice-tool-list">
			<span class="btnImage"></span>
			<span class="btnText">목록</span>
		</a>
	</li>
</ul>

<table class="jt-beforeAfterBoards-table">
	<tbody>
		<c:forEach items="${noticeList }" var="notice" varStatus="i">
			<tr class="jt-help-notice-content-tr">
				<td><c:out value="${noticeContent.pn < notice.pn ? '다음글' : '이전글'}"/></td>
				<td><a href="${cp }/admin/noticeContent?pn=${notice.pn }"><c:out value="${notice.title }"/></a></td>
				<td><c:out value="${fn:substring(notice.inputDate, 0, 19) }"/></td>
				<td><c:out value="${notice.readCount eq null ? 0 : notice.readCount}"/></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

</section>

<%@ include file="../../../layout/admin_footer.jspf" %>