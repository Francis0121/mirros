<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/none_header.jspf" %>
<section class="jt-modify-content-wrap">
	<div id="folderBar">
		<div id="folderTabName">
			<span id="digonalFolderImage">My Page</span>
		</div>
	</div>
	<section class="jt-modify-content">
		계정삭제
		<c:url value="/login/disactive.jt" var="disactiveUrl"/>
		<form:form commandName="jtownUser" action="${disactiveUrl }" htmlEscape="true">
			<sec:authentication property="principal.pn" var="pn"/>
			<sec:authentication property="principal.username" var="username"/>
			<form:hidden path="username" value="${username }"/>
			<form:hidden path="pn" value="${pn }"/>
			<form:password path="password"/>
			<input type="button" value="삭제" class="jt-disactive-btn jt-btn-orange"/>
			<form:errors path="password"></form:errors>
		</form:form>
	</section>
</section>
<%@ include file="../../layout/none_footer.jspf" %>