<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/help_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>

<section class="jt-help-notice-wrap">

<section class="jt-help-notice-content">
	<header>
		<ul>
			<li class="jt-help-notice-content-title"><span><c:out value="${noticeContent.title }"/></span></li>
			<li class="jt-help-notice-content-count"><span>조회 <c:out value="${noticeContent.readCount }"/></span></li>
		</ul>
	</header>
	<article>
		<span><c:out value="${fn:substring(noticeContent.inputDate, 0, 19) }"/></span>
		<pre>${noticeContent.content }</pre>
	</article>
</section>

<ul class="jt-help-notice-tool">
	<li>
		<a href="${cp }/help/notice" class="jt-btn-white-small jt-help-notice-tool-list">
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
				<td><a href="${cp }/help/notice/content?pn=${notice.pn }"><c:out value="${notice.title }"/></a></td>
				<td><c:out value="${fn:substring(notice.inputDate, 0, 19) }"/></td>
				<td><c:out value="${notice.readCount eq null ? 0 : notice.readCount}"/></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

</section>
<%@ include file="../../layout/help_footer.jspf" %>