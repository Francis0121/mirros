<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../../layout/admin_header.jspf" %>
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

<section class="jt-notice-content-table">
	<header>
		<ul>
			<li class="jt-notice-content-table-title"><span><c:out value="${notice.title }"/></span></li>
			<li class="jt-notice-content-table-count"><span>조회 <c:out value="${notice.readCount }"/></span></li>
		</ul>
	</header>
	<article>
		<span><c:out value="${notice.inputDate}"/></span>
		<pre>${notice.content }</pre>
	</article>
</section>

<%@ include file="../../../layout/admin_footer.jspf" %>