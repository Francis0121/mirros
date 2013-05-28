<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../../layout/admin_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<form:form commandName="jtownUser" action="${cp }/admin//createAdministrator.jt" htmlEscape="true" method="post">
	ID
	<form:input path="username"/>
	<form:errors path="username"/>
	Name
	<form:input path="name"/>
	<form:errors path="name"/>
	Email
	<form:input path="email"/>
	<form:errors path="email"/>
	Password
	<form:password path="password"/>
	<form:errors path="password"/>
	Confirm Password
	<input type="password" id="confirmPassword" name="confirmPassword"/>
		
	<button type="submit">생성</button>
</form:form>
<%@ include file="../../../layout/admin_footer.jspf" %>